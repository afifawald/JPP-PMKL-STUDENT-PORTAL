// ══ CLOUDFLARE PAGES FUNCTION: /api/album ══
// Manages photo album gallery stored in Cloudflare KV

const DEFAULT_ALBUM = [
  { id: "alb-1", src: "albums/jpp.jpeg", caption: "JPP PMKL", date: "2026" },
  { id: "alb-2", src: "albums/convo.JPG", caption: "Convocation", date: "2026" },
  { id: "alb-3", src: "albums/futsal.JPG", caption: "Futsal", date: "2026" },
  { id: "alb-4", src: "albums/esport.JPG", caption: "E-Sport", date: "2026" },
  { id: "alb-5", src: "albums/ihya.jpg", caption: "Ihya Ramadan", date: "2026" },
  { id: "alb-6", src: "albums/mg.JPG", caption: "Graduation Ceremony", date: "2026" },
  { id: "alb-7", src: "albums/mts.JPG", caption: "Mid-Semester Dinner", date: "2026" },
  { id: "alb-8", src: "albums/bubur.JPG", caption: "Community Programme", date: "2026" }
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
    let list = DEFAULT_ALBUM;
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("album", { type: "json" });
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
    return new Response(JSON.stringify(DEFAULT_ALBUM), {
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
    if (!item.src || typeof item.src !== 'string') {
      return new Response(JSON.stringify({ error: "Image data (src) is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (item.src.length > 3500000) {
      return new Response(JSON.stringify({ error: "Image file exceeds 2.5MB. Please compress your photo before uploading." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    let list = DEFAULT_ALBUM;
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("album", { type: "json" });
      if (Array.isArray(stored)) list = stored;
    }

    const newPhoto = {
      id: "alb-" + Date.now(),
      src: item.src,
      caption: String(item.caption || "JPP PMKL Event").trim().slice(0, 150),
      date: String(item.date || new Date().getFullYear()).trim().slice(0, 30)
    };

    list.unshift(newPhoto);
    if (list.length > 30) list = list.slice(0, 30);

    if (context.env.PORTAL_DATA) {
      await context.env.PORTAL_DATA.put("album", JSON.stringify(list));
    }

    return new Response(JSON.stringify({ success: true, item: newPhoto, list }), {
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
      return new Response(JSON.stringify({ error: "Missing photo id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    let list = DEFAULT_ALBUM;
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("album", { type: "json" });
      if (Array.isArray(stored)) list = stored;
    }

    list = list.filter(item => item.id !== id);

    if (context.env.PORTAL_DATA) {
      await context.env.PORTAL_DATA.put("album", JSON.stringify(list));
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
