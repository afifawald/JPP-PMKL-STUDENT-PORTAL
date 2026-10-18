// ══ CLOUDFLARE PAGES FUNCTION: /api/event-rsvp ══
// Manages student event registrations (RSVPs) stored in Cloudflare KV

function verifyAdmin(request, env) {
  const configuredKey = String(env.ADMIN_KEY || "jpp2026admin").trim();
  const authHeader = request.headers.get("x-admin-key") || request.headers.get("Authorization");
  if (!authHeader) return false;
  const provided = String(authHeader.replace(/^Bearer\s+/i, "")).trim();
  if (provided.length !== configuredKey.length) return false;
  let diff = 0;
  for (let i = 0; i < provided.length; i++) {
    diff |= provided.charCodeAt(i) ^ configuredKey.charCodeAt(i);
  }
  return diff === 0;
}

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const eventId = url.searchParams.get("eventId");
    const countOnly = url.searchParams.get("count") === "true";

    let rsvps = [];
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("event_rsvps", { type: "json" });
      if (Array.isArray(stored)) rsvps = stored;
    }

    // Filter by event if requested
    if (eventId) {
      rsvps = rsvps.filter(r => r.eventId === eventId);
    }

    // If public count requested
    if (countOnly) {
      return new Response(JSON.stringify({ eventId: eventId || "all", count: rsvps.length }), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Full attendee list requires admin authentication
    const isAdmin = verifyAdmin(context.request, context.env);
    if (!isAdmin) {
      // Return masked summary for public security (PDPA compliance)
      const publicList = rsvps.map(r => ({
        id: r.id,
        eventId: r.eventId,
        eventTitle: r.eventTitle,
        studentName: r.studentName ? (r.studentName.slice(0, 3) + '***') : 'Student',
        program: r.program || 'PMKL',
        registeredAt: r.registeredAt
      }));

      return new Response(JSON.stringify(publicList), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Admin receives full attendee roster
    return new Response(JSON.stringify(rsvps), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, rsvps: [] }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { eventId, eventTitle, studentName, matricNo, phone, program, notes } = body;

    // Validate mandatory fields
    if (!eventId || !studentName || !matricNo || !phone) {
      return new Response(JSON.stringify({ error: "Sila lengkapkan semua medan wajib (Acara, Nama, No. Matrik, Telefon)." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const cleanMatric = String(matricNo).trim().toUpperCase().slice(0, 20);
    const cleanPhone = String(phone).replace(/\D/g, '').slice(0, 15);
    const cleanName = String(studentName).trim().slice(0, 100);
    const cleanEventId = String(eventId).trim().slice(0, 50);
    const cleanEventTitle = String(eventTitle || "PMKL Event").trim().slice(0, 200);
    const cleanProgram = String(program || "General").trim().slice(0, 30);
    const cleanNotes = String(notes || "").trim().slice(0, 250);

    let rsvps = [];
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("event_rsvps", { type: "json" });
      if (Array.isArray(stored)) rsvps = stored;
    }

    // Check for duplicate registration for this specific event
    const existing = rsvps.find(r => r.eventId === cleanEventId && r.matricNo.toUpperCase() === cleanMatric);
    if (existing) {
      return new Response(JSON.stringify({
        error: "Anda telah pun mendaftar untuk acara ini sebelum ini.",
        alreadyRegistered: true,
        ticket: existing
      }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Generate ticket ID
    const ticketId = "RSVP-" + Math.floor(1000 + Math.random() * 9000);
    const newRecord = {
      id: ticketId,
      eventId: cleanEventId,
      eventTitle: cleanEventTitle,
      studentName: cleanName,
      matricNo: cleanMatric,
      phone: cleanPhone,
      program: cleanProgram,
      notes: cleanNotes,
      status: "confirmed",
      registeredAt: new Date().toISOString()
    };

    rsvps.unshift(newRecord);

    // Keep up to 500 RSVPs to prevent KV limit overflow
    if (rsvps.length > 500) {
      rsvps = rsvps.slice(0, 500);
    }

    if (context.env.PORTAL_DATA) {
      await context.env.PORTAL_DATA.put("event_rsvps", JSON.stringify(rsvps));
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Pendaftaran acara berjaya!",
      ticket: newRecord
    }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestDelete(context) {
  try {
    if (!verifyAdmin(context.request, context.env)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const url = new URL(context.request.url);
    const rsvpId = url.searchParams.get("id");
    if (!rsvpId) {
      return new Response(JSON.stringify({ error: "Missing rsvp id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    let rsvps = [];
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("event_rsvps", { type: "json" });
      if (Array.isArray(stored)) rsvps = stored;
    }

    rsvps = rsvps.filter(r => r.id !== rsvpId);

    if (context.env.PORTAL_DATA) {
      await context.env.PORTAL_DATA.put("event_rsvps", JSON.stringify(rsvps));
    }

    return new Response(JSON.stringify({ success: true, list: rsvps }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-admin-key, Authorization"
    }
  });
}
