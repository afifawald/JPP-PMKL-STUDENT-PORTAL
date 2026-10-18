// ══ CLOUDFLARE PAGES FUNCTION: /api/status ══
// Manages website status (Maintenance Mode, Live Ticker, Stats)

const DEFAULT_STATUS = {
  maintenance: false,
  ticker: "🎉 Congratulations to all PMKL students — Outstanding Results Final Exam Session II: 2025/2026 • 📋 New Student Registration Session I: 2026/2027 begins 22 Jun • 🎮 SuperStar Esport Championship — Coming Soon! • 📞 Contact: jpppmklofficial@gmail.com",
  stats: {
    students: 600,
    members: 20,
    events: 2,
    rentals: 3
  },
  lastUpdated: new Date().toISOString()
};

function verifyAdmin(request, env) {
  // If an ADMIN_KEY is configured in Cloudflare environment variables, enforce it.
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
    let status = DEFAULT_STATUS;
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("status", { type: "json" });
      if (stored) status = Object.assign({}, DEFAULT_STATUS, stored);
    }
    return new Response(JSON.stringify(status), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, ...DEFAULT_STATUS }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestPost(context) {
  try {
    if (!verifyAdmin(context.request, context.env)) {
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid or missing admin key" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const payload = await context.request.json().catch(() => ({}));

    // If payload is empty, this is an auth ping from the admin login check
    if (!payload || Object.keys(payload).length === 0) {
      return new Response(JSON.stringify({ success: true, verified: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    let current = DEFAULT_STATUS;
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("status", { type: "json" });
      if (stored) current = stored;
    }

    const updated = {
      ...current,
      ...payload,
      lastUpdated: new Date().toISOString()
    };

    if (context.env.PORTAL_DATA) {
      await context.env.PORTAL_DATA.put("status", JSON.stringify(updated));
    }

    return new Response(JSON.stringify({ success: true, status: updated }), {
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
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-admin-key, Authorization"
    }
  });
}
