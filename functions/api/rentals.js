// ══ CLOUDFLARE PAGES FUNCTION: /api/rentals ══
// Manages rental listings stored in Cloudflare KV

const DEFAULT_RENTALS = [
  {
    id: "rent-1",
    apartment: "Apartment Mahsuri",
    block: "Blok 1",
    unit: "Unit A-101",
    price: "RM 450",
    details: "Muslim students only. 2 Bedrooms, 1 Bathroom. Fully furnished. Includes double-decker bed, lockers, refrigerator, kitchen & washing machine.",
    contact: "Encik Ahmad (012-328 0168)",
    address: "Jalan Setiawangsa 13, Taman Setiawangsa, KL",
    features: ["WiFi", "Water Incl.", "Electric Incl.", "24hr Guarded"]
  },
  {
    id: "rent-2",
    apartment: "Apartment Mahsuri",
    block: "Blok 2",
    unit: "Unit A-102",
    price: "RM 470",
    details: "Comfortable shared room (Immediate Intake). Fully furnished, 2 Bedrooms & 1 Bathroom. Walking distance to Setiawangsa LRT station.",
    contact: "Encik Ahmad (012-328 0168)",
    address: "Jalan Setiawangsa 13, Taman Setiawangsa, KL",
    features: ["WiFi", "Refrigerator", "Washing Machine"]
  },
  {
    id: "rent-3",
    apartment: "Apartment Intan",
    block: "Blok 1",
    unit: "Unit Intan Premium",
    price: "RM 350",
    details: "Immediate Student Intake. Affordable rent including full utilities (WiFi, electricity & water cost controlled). Walking distance to shops.",
    contact: "En. Zul (012-466 2096)",
    address: "Setiawangsa near Politeknik METrO KL",
    features: ["WiFi incl.", "Water incl.", "Electric incl.", "Near PMKL"]
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
    let list = DEFAULT_RENTALS;
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("rentals", { type: "json" });
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
    return new Response(JSON.stringify(DEFAULT_RENTALS), {
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
    let list = DEFAULT_RENTALS;
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("rentals", { type: "json" });
      if (Array.isArray(stored)) list = stored;
    }

    const newItem = {
      id: "rent-" + Date.now(),
      apartment: item.apartment || "Apartment Mahsuri",
      block: item.block || "Blok 1",
      unit: item.unit || "Unit New",
      price: item.price ? (item.price.startsWith("RM") ? item.price : "RM " + item.price) : "RM 400",
      details: item.details || "Available for PMKL students.",
      contact: item.contact || "JPP Management",
      address: item.address || "Setiawangsa, Kuala Lumpur",
      features: Array.isArray(item.features) ? item.features : (item.features ? item.features.split(",").map(s => s.trim()) : ["Furnished"])
    };

    list.unshift(newItem);

    if (context.env.PORTAL_DATA) {
      await context.env.PORTAL_DATA.put("rentals", JSON.stringify(list));
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
      return new Response(JSON.stringify({ error: "Missing rental id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    let list = DEFAULT_RENTALS;
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("rentals", { type: "json" });
      if (Array.isArray(stored)) list = stored;
    }

    list = list.filter(item => item.id !== id);

    if (context.env.PORTAL_DATA) {
      await context.env.PORTAL_DATA.put("rentals", JSON.stringify(list));
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
