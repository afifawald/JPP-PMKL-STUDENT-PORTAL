// ══ CLOUDFLARE PAGES FUNCTION: /api/print-jobs ══
// Manages student print job submissions, queue processing, and status updates

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
    const jobId = url.searchParams.get("id");
    const isAdmin = verifyAdmin(context.request, context.env);

    let jobs = [];
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("print_jobs", { type: "json" });
      if (Array.isArray(stored)) jobs = stored;
    }

    // Specific job lookup (for student ticket tracking)
    if (jobId) {
      const found = jobs.find(j => j.id.toLowerCase() === jobId.toLowerCase());
      if (!found) {
        return new Response(JSON.stringify({ error: "Job not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
      // If student is checking status, omit heavy base64 data unless admin
      const resData = isAdmin ? found : {
        id: found.id,
        createdAt: found.createdAt,
        student: { name: found.student?.name, matric: found.student?.matric },
        fileName: found.file?.name,
        preferences: found.preferences,
        pricing: found.pricing,
        status: found.status,
        paymentStatus: found.paymentStatus
      };
      return new Response(JSON.stringify(resData), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Admin view: return jobs without multi-megabyte base64 blobs unless requested
    if (isAdmin) {
      const includeBlobs = url.searchParams.get("full") === "true";
      const adminJobs = jobs.map(j => includeBlobs ? j : {
        ...j,
        file: { name: j.file?.name, size: j.file?.size, type: j.file?.type, hasData: !!j.file?.data },
        receipt: j.receipt ? {
          name: j.receipt.name,
          size: j.receipt.size,
          type: j.receipt.type,
          hasData: !!j.receipt.data,
          botVerified: j.receipt.botVerified,
          detectedRef: j.receipt.detectedRef,
          detectedAmount: j.receipt.detectedAmount,
          verifiedAt: j.receipt.verifiedAt
        } : null
      });
      return new Response(JSON.stringify(adminJobs), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Public view: return lightweight summary of queue without file blobs
    const publicJobs = jobs.map(j => ({
      id: j.id,
      createdAt: j.createdAt,
      studentName: j.student?.name ? (j.student.name.slice(0, 3) + "***") : "Student",
      fileName: j.file?.name || "Document",
      pages: j.preferences?.pages || 1,
      copies: j.preferences?.copies || 1,
      status: j.status,
      paymentStatus: j.paymentStatus
    }));

    return new Response(JSON.stringify(publicJobs), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const payload = await context.request.json();
    const action = payload.action || "submit";

    let jobs = [];
    if (context.env.PORTAL_DATA) {
      const stored = await context.env.PORTAL_DATA.get("print_jobs", { type: "json" });
      if (Array.isArray(stored)) jobs = stored;
    }

    // ── ACTION 1: SUBMIT PRINT JOB (PUBLIC / STUDENT) ──
    if (action === "submit") {
      if (!payload.file || !payload.file.data || typeof payload.file.data !== 'string') {
        return new Response(JSON.stringify({ error: "Please upload a document file to print." }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      // 7MB base64 cap (~5MB file) to prevent Cloudflare KV 25MB limits from crashing
      if (payload.file.data.length > 7000000) {
        return new Response(JSON.stringify({ error: "Document file exceeds maximum upload size (approx 5MB). Please compress your PDF." }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      if (!payload.student || !payload.student.name) {
        return new Response(JSON.stringify({ error: "Please provide your full name and matric ID." }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      // Check receipt size if attached
      if (payload.receipt?.data && typeof payload.receipt.data === 'string' && payload.receipt.data.length > 3000000) {
        return new Response(JSON.stringify({ error: "Receipt image exceeds 2MB limit. Please upload a smaller receipt." }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      // Server-side validation of preferences & pricing
      const pages = Math.max(1, Math.min(parseInt(payload.preferences?.pages) || 1, 500));
      const copies = Math.max(1, Math.min(parseInt(payload.preferences?.copies) || 1, 50));
      const colorMode = payload.preferences?.colorMode === "color" ? "color" : "bw";
      const sides = payload.preferences?.sides === "double" ? "double" : "single";
      const binding = String(payload.preferences?.binding || "none");

      let perPageRate = colorMode === "color" ? 0.50 : 0.10;
      let bindingRate = 0.00;
      if (binding === "staple") bindingRate = 0.50;
      else if (binding === "comb") bindingRate = 2.00;
      else if (binding === "hard") bindingRate = 10.00;

      const printCost = +(pages * copies * perPageRate).toFixed(2);
      const bindingCost = +(copies * bindingRate).toFixed(2);
      const computedTotal = Math.max(0.10, +(printCost + bindingCost).toFixed(2));

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newId = `PRN-${Date.now().toString(36).toUpperCase()}-${randomSuffix}`;

      const hasReceipt = !!(payload.receipt && payload.receipt.data);
      const paymentMethod = payload.paymentMethod === "duitnow_qr" ? "duitnow_qr" : "counter";
      const paymentStatus = paymentMethod === "duitnow_qr"
        ? (hasReceipt ? "paid_pending_verification" : "unpaid_qr")
        : "unpaid_counter";

      const newJob = {
        id: newId,
        createdAt: new Date().toISOString(),
        student: {
          name: String(payload.student.name).trim().slice(0, 100),
          matric: String(payload.student.matric || "").trim().toUpperCase().slice(0, 30),
          phone: String(payload.student.phone || "").trim().slice(0, 25)
        },
        file: {
          name: String(payload.file.name || "Document.pdf").slice(0, 150),
          size: Math.min(Number(payload.file.size) || 0, 10000000),
          type: String(payload.file.type || "application/pdf").slice(0, 50),
          data: payload.file.data
        },
        preferences: {
          paperSize: String(payload.preferences?.paperSize || "A4").slice(0, 10),
          colorMode,
          sides,
          pages,
          copies,
          binding,
          remarks: String(payload.preferences?.remarks || "").trim().slice(0, 300)
        },
        pricing: {
          perPageRate,
          printCost,
          bindingCost,
          totalAmount: computedTotal
        },
        paymentMethod,
        receipt: hasReceipt ? {
          name: String(payload.receipt.name || "receipt.jpg").slice(0, 100),
          size: Math.min(Number(payload.receipt.size) || 0, 5000000),
          type: String(payload.receipt.type || "image/jpeg").slice(0, 50),
          data: payload.receipt.data,
          botVerified: !!payload.receipt.botVerified,
          detectedRef: String(payload.receipt.detectedRef || "").slice(0, 60),
          detectedAmount: parseFloat(payload.receipt.detectedAmount) || 0,
          verifiedAt: payload.receipt.verifiedAt || new Date().toISOString()
        } : null,
        status: "queued",
        paymentStatus
      };

      // Add to front of queue
      jobs.unshift(newJob);

      // Keep maximum 30 recent jobs in KV. Retain raw file blobs only for the most recent active jobs
      if (jobs.length > 30) {
        jobs = jobs.slice(0, 30);
      }
      jobs.forEach((j, idx) => {
        if (idx >= 8 || j.status === 'completed' || j.status === 'cancelled') {
          if (j.file && j.file.data) j.file.data = null;
          if (j.receipt && j.receipt.data) j.receipt.data = null;
        }
      });

      if (context.env.PORTAL_DATA) {
        await context.env.PORTAL_DATA.put("print_jobs", JSON.stringify(jobs));
      }

      return new Response(JSON.stringify({
        success: true,
        jobId: newJob.id,
        status: newJob.status,
        paymentStatus: newJob.paymentStatus,
        paymentMethod: newJob.paymentMethod,
        totalAmount: newJob.pricing.totalAmount,
        createdAt: newJob.createdAt
      }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // ── ACTION 2: UPDATE STATUS (ADMIN ONLY) ──
    if (action === "update_status") {
      if (!verifyAdmin(context.request, context.env)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      const { id, status, paymentStatus } = payload;
      const jobIndex = jobs.findIndex(j => j.id === id);
      if (jobIndex === -1) {
        return new Response(JSON.stringify({ error: "Job not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      if (status) {
        jobs[jobIndex].status = status;
        if (status === "completed" || status === "cancelled") {
          if (jobs[jobIndex].file) jobs[jobIndex].file.data = null;
          if (jobs[jobIndex].receipt) jobs[jobIndex].receipt.data = null;
        }
      }
      if (paymentStatus) jobs[jobIndex].paymentStatus = paymentStatus;
      jobs[jobIndex].updatedAt = new Date().toISOString();

      if (context.env.PORTAL_DATA) {
        await context.env.PORTAL_DATA.put("print_jobs", JSON.stringify(jobs));
      }

      return new Response(JSON.stringify({ success: true, job: jobs[jobIndex] }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // ── ACTION 3: DELETE JOB (ADMIN ONLY) ──
    if (action === "delete") {
      if (!verifyAdmin(context.request, context.env)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      const { id } = payload;
      jobs = jobs.filter(j => j.id !== id);

      if (context.env.PORTAL_DATA) {
        await context.env.PORTAL_DATA.put("print_jobs", JSON.stringify(jobs));
      }

      return new Response(JSON.stringify({ success: true, remaining: jobs.length }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
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
