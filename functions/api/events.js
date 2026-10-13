// ══ CLOUDFLARE PAGES FUNCTION: /api/events ══
// Manages upcoming events stored in Cloudflare KV

const DEFAULT_EVENTS = [
  {
    id: "evt-1",
    title: "New Student Registration Session I: 2026/2027",
    dateDay: "22",
    dateMonth: "JUN",
    dateFull: "22 Jun 2026",
    time: "8:00 AM onwards",
    location: "PMKL Campus",
    icon: "📋",
    colorGrad: "event-thumb-grad1"
  },
  {
    id: "evt-2",
    title: "SuperStar Esport Championship",
    dateDay: "TBD",
    dateMonth: "2026",
    dateFull: "TBD 2026",
    time: "TBD",
    location: "Campus Hall / Online",
    icon: "🎮",
    colorGrad: "event-thumb-grad2"
  },
  {
    id: "evt-3",
    title: "Volunteering & Entrepreneurship Activities",
    dateDay: "?",
    dateMonth: "TBD",
    dateFull: "Coming Soon",
    time: "TBD",
    location: "Politeknik METrO Kuala Lumpur",
    icon: "🎭",
    colorGrad: "event-thumb-grad3"
  }
];

function verifyAdmin(request, env) {
  const configuredKey = env.ADMIN_KEY || "jpp2026admin";
  const authHeader = request.headers.get("x-admin-key") || request.headers.get("Authorization");
  if (!authHeader) return false;
  const provided = authHeader.replace(/^Bearer\s+/i, "").trim();
  return provided === configuredKey;
}

export async function onRequestGet(context) {
  try {
    let list = DEFAULT_EVENTS;
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("events", { type: "json" });
      if (Array.isArray(stored)) list = stored;
    }
    return new Response(JSON.stringify(list), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify(DEFAULT_EVENTS), {
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

    const item = await context.request.json();
    let list = DEFAULT_EVENTS;
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("events", { type: "json" });
      if (Array.isArray(stored)) list = stored;
    }

    const newItem = {
      id: "evt-" + Date.now(),
      title: item.title || "Untitled Event",
      dateDay: item.dateDay || "TBD",
      dateMonth: item.dateMonth || "2026",
      dateFull: item.dateFull || (item.dateDay + " " + item.dateMonth),
      time: item.time || "TBD",
      location: item.location || "PMKL Campus",
      icon: item.icon || "📅",
      colorGrad: item.colorGrad || "event-thumb-grad1"
    };

    list.unshift(newItem);

    if (context.env.PORTAL_DATA) {
      await context.env.PORTAL_DATA.put("events", JSON.stringify(list));
    }

    return new Response(JSON.stringify({ success: true, item: newItem, list }), {
      headers: { "Content-Type": "application/json" }
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
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing event id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    let list = DEFAULT_EVENTS;
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("events", { type: "json" });
      if (Array.isArray(stored)) list = stored;
    }

    list = list.filter(item => item.id !== id);

    if (context.env.PORTAL_DATA) {
      await context.env.PORTAL_DATA.put("events", JSON.stringify(list));
    }

    return new Response(JSON.stringify({ success: true, list }), {
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
