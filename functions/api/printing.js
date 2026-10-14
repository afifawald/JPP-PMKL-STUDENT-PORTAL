// ══ CLOUDFLARE PAGES FUNCTION: /api/printing ══
// Manages printing service settings, counter status, and price rates

const DEFAULT_PRINTING_SETTINGS = {
  status: "open", // "open" | "busy" | "closed"
  statusText: "Buka / Sedia Mencetak",
  hours: "Isnin – Jumaat: 8:30 AM – 5:00 PM",
  location: "Bilik Gerakan JPP, Aras 2, PMKL",
  contact: "03-4251 8000",
  whatsapp: "60123456789",
  notice: "Sila muat naik dokumen anda (PDF digalakkan). Bayar di kaunter semasa mengambil cetakan.",
  rates: {
    bw_single: 0.10,        // RM per page (Black & White 1-sided)
    bw_double: 0.15,        // RM per sheet (Black & White 2-sided)
    color_standard: 0.50,   // RM per page (Color standard)
    color_photo: 1.00,      // RM per page (Color photo / high coverage)
    a3_bw: 0.40,            // RM per page (A3 B&W)
    a3_color: 1.50,         // RM per page (A3 Color)
    binding_none: 0.00,
    binding_staple: 0.50,   // Stapler & Tape
    binding_comb: 2.00,     // Comb binding (plastic ring + transparent cover)
    binding_hard: 10.00,    // Hard cover project binding
    laminating_a4: 1.50     // Laminating A4
  },
  lastUpdated: new Date().toISOString()
};

function verifyAdmin(request, env) {
  const configuredKey = env.ADMIN_KEY || "jpp2026admin";
  const authHeader = request.headers.get("x-admin-key") || request.headers.get("Authorization");
  if (!authHeader) return false;
  const provided = authHeader.replace(/^Bearer\s+/i, "").trim();
  return provided === configuredKey;
}

export async function onRequestGet(context) {
  try {
    let settings = DEFAULT_PRINTING_SETTINGS;
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("printing_settings", { type: "json" });
      if (stored) settings = Object.assign({}, DEFAULT_PRINTING_SETTINGS, stored);
    }
    return new Response(JSON.stringify(settings), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify(DEFAULT_PRINTING_SETTINGS), {
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestPost(context) {
  try {
    if (!verifyAdmin(context.request, context.env)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const payload = await context.request.json();
    let current = DEFAULT_PRINTING_SETTINGS;
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("printing_settings", { type: "json" });
      if (stored) current = stored;
    }

    const updated = {
      ...current,
      ...payload,
      rates: {
        ...current.rates,
        ...(payload.rates || {})
      },
      lastUpdated: new Date().toISOString()
    };

    if (context.env.PORTAL_DATA) {
      await context.env.PORTAL_DATA.put("printing_settings", JSON.stringify(updated));
    }

    return new Response(JSON.stringify({ success: true, settings: updated }), {
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

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-admin-key, Authorization"
    }
  });
}
