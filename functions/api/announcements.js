// ══ CLOUDFLARE PAGES FUNCTION: /api/announcements ══
// Manages announcements stored in Cloudflare KV

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "New Student Registration Session I: 2026/2027",
    category: "Important",
    tagColor: "gold",
    date: "22 Jun 2026",
    author: "JPP PMKL",
    content: "Welcome to all new students! Official registration for the 2026/2027 academic session will begin on 22 Jun 2026. Please bring all required documents."
  },
  {
    id: "ann-2",
    title: "SuperStar Esport Championship",
    category: "Events",
    tagColor: "blue",
    date: "Coming Soon",
    author: "EXCO Sports",
    content: "Stay tuned for the biggest esport event of the year! JPP PMKL is proud to organise a college-level esport competition. Date and venue will be announced soon."
  },
  {
    id: "ann-3",
    title: "Congratulations Top Students Session II: 2025/2026",
    category: "Achievements",
    tagColor: "green",
    date: "Jun 2026",
    author: "JPP PMKL",
    content: "Well done and congratulations to all PMKL students who achieved outstanding results in the Final Examination Session II: 2025/2026. Your success inspires us all!"
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
    let list = DEFAULT_ANNOUNCEMENTS;
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("announcements", { type: "json" });
      if (Array.isArray(stored) && stored.length > 0) list = stored;
    }
    return new Response(JSON.stringify(list), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify(DEFAULT_ANNOUNCEMENTS), {
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
    let list = DEFAULT_ANNOUNCEMENTS;
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("announcements", { type: "json" });
      if (Array.isArray(stored)) list = stored;
    }

    const newItem = {
      id: "ann-" + Date.now(),
      title: item.title || "Untitled Announcement",
      category: item.category || "General",
      tagColor: item.tagColor || (item.category === "Important" ? "gold" : item.category === "Events" ? "blue" : "green"),
      date: item.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      author: item.author || "JPP PMKL",
      content: item.content || ""
    };

    list.unshift(newItem);

    if (context.env.PORTAL_DATA) {
      await context.env.PORTAL_DATA.put("announcements", JSON.stringify(list));
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
      return new Response(JSON.stringify({ error: "Missing announcement id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    let list = DEFAULT_ANNOUNCEMENTS;
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("announcements", { type: "json" });
      if (Array.isArray(stored)) list = stored;
    }

    list = list.filter(item => item.id !== id);

    if (context.env.PORTAL_DATA) {
      await context.env.PORTAL_DATA.put("announcements", JSON.stringify(list));
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
