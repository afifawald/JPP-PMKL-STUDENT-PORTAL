// ══ CLOUDFLARE PAGES FUNCTION: /api/merch ══
// Manages JPP merchandise pre-orders stored in Cloudflare KV

function verifyAdmin(request, env) {
  const configuredKey = env.ADMIN_KEY || "jpp2026admin";
  const authHeader = request.headers.get("x-admin-key") || request.headers.get("Authorization");
  if (!authHeader) return false;
  const provided = authHeader.replace(/^Bearer\s+/i, "").trim();
  return provided === configuredKey;
}

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const ticketId = url.searchParams.get("ticket");

    let orders = [];
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("merch_orders", { type: "json" });
      if (Array.isArray(stored)) orders = stored;
    }

    // Public lookup for single order ticket
    if (ticketId) {
      const found = orders.find(o => o.id === ticketId.trim().toUpperCase());
      if (!found) {
        return new Response(JSON.stringify({ error: "Pesanan tidak dijumpai." }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      // Return PDPA masked record
      return new Response(JSON.stringify({
        id: found.id,
        itemName: found.itemName,
        size: found.size,
        color: found.color,
        quantity: found.quantity,
        totalPrice: found.totalPrice,
        status: found.status,
        studentName: found.studentName ? (found.studentName.slice(0, 3) + '***') : 'Pelajar',
        createdAt: found.createdAt
      }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Admin authenticated list
    if (!verifyAdmin(context.request, context.env)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(orders), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, orders: [] }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { itemName, price, size, color, studentName, matricNo, phone, quantity, notes } = body;

    if (!itemName || !studentName || !matricNo || !phone) {
      return new Response(JSON.stringify({ error: "Sila lengkapkan semua medan wajib (Produk, Nama, Matrik, Telefon)." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const unitPrice = parseFloat(price) || 0;
    const qty = Math.max(1, Math.min(10, parseInt(quantity) || 1));
    const totalPrice = (unitPrice * qty).toFixed(2);
    const cleanMatric = String(matricNo).trim().toUpperCase().slice(0, 20);
    const cleanPhone = String(phone).replace(/\D/g, '').slice(0, 15);
    const cleanName = String(studentName).trim().slice(0, 100);

    let orders = [];
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("merch_orders", { type: "json" });
      if (Array.isArray(stored)) orders = stored;
    }

    const ticketId = "MCH-" + Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: ticketId,
      itemName: String(itemName).slice(0, 100),
      unitPrice: unitPrice.toFixed(2),
      quantity: qty,
      totalPrice: totalPrice,
      size: String(size || "Standard").slice(0, 20),
      color: String(color || "Standard").slice(0, 30),
      studentName: cleanName,
      matricNo: cleanMatric,
      phone: cleanPhone,
      notes: String(notes || "").trim().slice(0, 200),
      status: "pending_payment", // pending_payment, paid_verified, preparing, ready_pickup, completed, cancelled
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder);

    // Keep up to 500 orders
    if (orders.length > 500) {
      orders = orders.slice(0, 500);
    }

    if (context.env.PORTAL_DATA) {
      await context.env.PORTAL_DATA.put("merch_orders", JSON.stringify(orders));
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Pra-tempahan berjaya dihantar!",
      order: newOrder
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

export async function onRequestPatch(context) {
  try {
    if (!verifyAdmin(context.request, context.env)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await context.request.json();
    const { orderId, status, notes } = body;

    if (!orderId || !status) {
      return new Response(JSON.stringify({ error: "Missing orderId or status" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    let orders = [];
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("merch_orders", { type: "json" });
      if (Array.isArray(stored)) orders = stored;
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    order.status = String(status).slice(0, 30);
    if (notes !== undefined) order.adminNotes = String(notes).slice(0, 250);
    order.updatedAt = new Date().toISOString();

    if (context.env.PORTAL_DATA) {
      await context.env.PORTAL_DATA.put("merch_orders", JSON.stringify(orders));
    }

    return new Response(JSON.stringify({ success: true, order }), {
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
      return new Response(JSON.stringify({ error: "Missing order id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    let orders = [];
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("merch_orders", { type: "json" });
      if (Array.isArray(stored)) orders = stored;
    }

    orders = orders.filter(o => o.id !== id);

    if (context.env.PORTAL_DATA) {
      await context.env.PORTAL_DATA.put("merch_orders", JSON.stringify(orders));
    }

    return new Response(JSON.stringify({ success: true, list: orders }), {
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
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-admin-key, Authorization"
    }
  });
}
