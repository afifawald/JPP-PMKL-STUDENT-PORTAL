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

    // Admin view: return all jobs with file data for direct printing
    if (isAdmin) {
      return new Response(JSON.stringify(jobs), {
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
      studentName: j.student?.name ? (j.student.name.slice(0, 3) + "***") : "Pelajar",
      fileName: j.file?.name || "Dokumen",
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
      if (!payload.file || !payload.file.data) {
        return new Response(JSON.stringify({ error: "Sila sertakan fail untuk dicetak." }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      if (!payload.student || !payload.student.name) {
        return new Response(JSON.stringify({ error: "Sila masukkan nama dan nombor matrik." }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newId = `PRN-${Date.now().toString(36).toUpperCase()}-${randomSuffix}`;

      const newJob = {
        id: newId,
        createdAt: new Date().toISOString(),
        student: {
          name: String(payload.student.name).trim(),
          matric: String(payload.student.matric || "").trim().toUpperCase(),
          phone: String(payload.student.phone || "").trim()
        },
        file: {
          name: payload.file.name || "Document.pdf",
          size: payload.file.size || 0,
          type: payload.file.type || "application/pdf",
          data: payload.file.data // Base64 data URL
        },
        preferences: {
          paperSize: payload.preferences?.paperSize || "A4",
          colorMode: payload.preferences?.colorMode || "bw",
          sides: payload.preferences?.sides || "single",
          pages: parseInt(payload.preferences?.pages) || 1,
          copies: parseInt(payload.preferences?.copies) || 1,
          binding: payload.preferences?.binding || "none",
          remarks: String(payload.preferences?.remarks || "").trim()
        },
        pricing: {
          perPageRate: parseFloat(payload.pricing?.perPageRate) || 0.10,
          printCost: parseFloat(payload.pricing?.printCost) || 0.10,
          bindingCost: parseFloat(payload.pricing?.bindingCost) || 0.00,
          totalAmount: parseFloat(payload.pricing?.totalAmount) || 0.10
        },
        status: "queued", // "queued" | "printing" | "completed" | "cancelled"
        paymentStatus: "unpaid_counter" // "unpaid_counter" | "paid"
      };

      // Add to front of queue
      jobs.unshift(newJob);

      // Keep maximum 40 recent jobs in KV to preserve storage
      if (jobs.length > 40) {
        jobs = jobs.slice(0, 40);
      }

      if (context.env.PORTAL_DATA) {
        await context.env.PORTAL_DATA.put("print_jobs", JSON.stringify(jobs));
      }

      return new Response(JSON.stringify({
        success: true,
        jobId: newJob.id,
        status: newJob.status,
        paymentStatus: newJob.paymentStatus,
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

      if (status) jobs[jobIndex].status = status;
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
