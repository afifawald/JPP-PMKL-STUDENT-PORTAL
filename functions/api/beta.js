// ══ CLOUDFLARE PAGES FUNCTION: /api/beta ══
// Unified backend for JPP Beta Testing Lab (The 3 Pillars)
// Manages: E-Aduan (Pillar 1), Lost & Found (Pillar 1), and Equipment Loans (Pillar 3)

const DEFAULT_ADUAN = [
  {
    id: "ADU-2026-8912",
    createdAt: "2026-10-12T09:30:00Z",
    dateFormatted: "12 Oct 2026",
    student: {
      name: "Muhammad H.",
      matric: "14DUP24F1020",
      phone: "013-4889211",
      isAnonymous: false
    },
    category: "facility",
    categoryLabel: "Kemudahan Kampus",
    location: "Surau Lelaki (Aras 3)",
    title: "Penyaman Udara (Aircon) Surau Tidak Sejuk",
    description: "Aircon unit kedua di surau aras 3 mengeluarkan bunyi bising dan angin kurang sejuk ketika waktu solat Zohor.",
    status: "in_progress",
    statusLabel: "Dalam Tindakan",
    adminNotes: "Telah dilaporkan kepada Unit Pembangunan PMKL pada 13/10. Kontraktor penyelenggaraan berjadual hadir khamis ini.",
    resolvedAt: null
  },
  {
    id: "ADU-2026-7734",
    createdAt: "2026-10-08T14:15:00Z",
    dateFormatted: "08 Oct 2026",
    student: {
      name: "Pelajar PMKL",
      matric: "HIDDEN",
      phone: "HIDDEN",
      isAnonymous: true
    },
    category: "canteen",
    categoryLabel: "Kafeteria & Makanan",
    location: "Kafeteria PMKL",
    title: "Cadangan Menu Makanan Sihat & Harga Berpatutan",
    description: "Mohon pihak pengurusan kafeteria menambah pilihan sayur-sayuran segar dan mengekalkan harga nasi campur mesra poket pelajar.",
    status: "resolved",
    statusLabel: "Selesai",
    adminNotes: "JPP telah mengadakan sesi perbincangan bersama pengusaha kafeteria. Menu kombo ekonomi RM5.00 telah diperkenalkan.",
    resolvedAt: "2026-10-11T11:00:00Z"
  }
];

const DEFAULT_LOST_FOUND = [
  {
    id: "LF-2026-101",
    type: "found",
    title: "Kalkulator Casio fx-570EX Hitam",
    category: "electronics",
    categoryLabel: "Elektronik & Alat Tulis",
    location: "Bilik Kuliah 3.04 (Aras 3)",
    dateReported: "14 Oct 2026",
    description: "Dijumpai di atas meja barisan belakang selepas tamat kelas DUT10013. Mempunyai pelekat biru di bahagian penutup.",
    contactName: "Kaunter JPP PMKL",
    contactWhatsapp: "60133280168",
    status: "open",
    statusLabel: "Belum Dituntut"
  },
  {
    id: "LF-2026-102",
    type: "lost",
    title: "Kad Matrik Pelajar (DUP Sem 3)",
    category: "cards",
    categoryLabel: "Kad & Kunci",
    location: "Kawasan Parkir Motosikal / Lobi",
    dateReported: "13 Oct 2026",
    description: "Hilang bersama lanyard JPP warna navy blue. Jika terjumpa mohon hubungi saya dengan kadar segera.",
    contactName: "Aina Farhana",
    contactWhatsapp: "601123456789",
    status: "open",
    statusLabel: "Sedang Dicari"
  },
  {
    id: "LF-2026-103",
    type: "found",
    title: "Kunci Bilik Mahsuri (Gantungan Kucing)",
    category: "cards",
    categoryLabel: "Kad & Kunci",
    location: "Tangga Blok Mahsuri ke Laluan PMKL",
    dateReported: "10 Oct 2026",
    description: "2 bilah anak kunci bersama keychain getah berbentuk kucing putih.",
    contactName: "Aqeel (JPP EXCO)",
    contactWhatsapp: "60124662096",
    status: "claimed",
    statusLabel: "Telah Dipulangkan"
  }
];

const DEFAULT_EQUIPMENT = [
  {
    id: "EQ-FUTSAL-1",
    name: "Bola Futsal Rasmi (Saiz 4 - Low Bounce)",
    category: "sports",
    categoryLabel: "Sukan",
    totalQty: 3,
    availableQty: 2,
    icon: "fa-futbol",
    description: "Sesuai untuk perlawanan gelanggang futsal simen & parket.",
    terms: "Tempoh pinjaman maksimum 4 jam. Pulangkan dalam keadaan bersih."
  },
  {
    id: "EQ-BADMINTON-1",
    name: "Set Raket Badminton + Bulu Tangkis",
    category: "sports",
    categoryLabel: "Sukan",
    totalQty: 4,
    availableQty: 3,
    icon: "fa-table-tennis-paddle-ball",
    description: "Termasuk 2 bilah raket Yonex & 2 biji bulu tangkis.",
    terms: "Penggunaan di Dewan / Gelanggang Serbaguna PMKL."
  },
  {
    id: "EQ-PA-1",
    name: "Sistem PA Mudah Alih + 2 Mikrofon Wayarles",
    category: "event",
    categoryLabel: "Alatan Acara",
    totalQty: 2,
    availableQty: 1,
    icon: "fa-bullhorn",
    description: "Speaker Bluetooth berkuasa bateri untuk program persatuan dan taklimat.",
    terms: "Perlu surat sokongan penasihat kelab / kelulusan JPP."
  },
  {
    id: "EQ-GAMES-1",
    name: "Papan Permainan Tradisional (Karom & Saidina)",
    category: "indoor",
    categoryLabel: "Permainan Rekreasi",
    totalQty: 3,
    availableQty: 3,
    icon: "fa-chess-board",
    description: "Disediakan untuk waktu santai di Student Lounge Aras 2.",
    terms: "Simpan semua buah permainan di dalam kotak asal."
  }
];

const DEFAULT_LOANS = [
  {
    loanId: "LN-2026-4401",
    equipmentId: "EQ-FUTSAL-1",
    equipmentName: "Bola Futsal Rasmi (Saiz 4)",
    studentName: "Amirul Haziq",
    matric: "14DHF23F2011",
    phone: "017-8891234",
    borrowDate: "2026-10-15T08:00:00Z",
    borrowDateFormatted: "15 Oct 2026, 4:00 PM",
    expectedReturn: "15 Oct 2026, 7:00 PM",
    status: "active",
    statusLabel: "Sedang Dipinjam"
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
    const url = new URL(context.request.url);
    const module = url.searchParams.get("module") || "all";
    const ticket = url.searchParams.get("ticket");
    const isAdmin = verifyAdmin(context.request, context.env);

    // 1. Ticket lookup for Aduan
    if (ticket) {
      let aduanList = DEFAULT_ADUAN;
      if (context.env.PORTAL_DATA) {
        const stored = await context.env.PORTAL_DATA.get("beta_aduan", { type: "json" });
        if (Array.isArray(stored)) aduanList = stored;
      }
      const found = aduanList.find(a => a.id.toUpperCase() === ticket.trim().toUpperCase());
      if (!found) {
        return new Response(JSON.stringify({ error: "Tiket tidak dijumpai. Sila semak nombor rujukan anda." }), {
          status: 404,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
      return new Response(JSON.stringify(found), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 2. Aduan Module
    if (module === "aduan") {
      let aduanList = DEFAULT_ADUAN;
      if (context.env.PORTAL_DATA) {
        const stored = await context.env.PORTAL_DATA.get("beta_aduan", { type: "json" });
        if (Array.isArray(stored)) aduanList = stored;
      }
      // If not admin, mask sensitive student identity for public feed
      const safeList = isAdmin ? aduanList : aduanList.map(item => ({
        id: item.id,
        createdAt: item.createdAt,
        dateFormatted: item.dateFormatted,
        category: item.category,
        categoryLabel: item.categoryLabel,
        location: item.location,
        title: item.title,
        description: item.description,
        status: item.status,
        statusLabel: item.statusLabel,
        adminNotes: item.adminNotes,
        student: {
          name: item.student.isAnonymous ? "Pelajar Tanpa Nama (Anonymous)" : item.student.name.charAt(0) + "*** " + item.student.name.slice(-2),
          matric: item.student.isAnonymous ? "Rahsia" : item.student.matric.slice(0, 3) + "****" + item.student.matric.slice(-2)
        }
      }));

      return new Response(JSON.stringify(safeList), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 3. Lost & Found Module
    if (module === "lostfound") {
      let lfList = DEFAULT_LOST_FOUND;
      if (context.env.PORTAL_DATA) {
        const stored = await context.env.PORTAL_DATA.get("beta_lostfound", { type: "json" });
        if (Array.isArray(stored)) lfList = stored;
      }
      return new Response(JSON.stringify(lfList), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 4. Equipment Module
    if (module === "equipment") {
      let equipList = DEFAULT_EQUIPMENT;
      let loanList = DEFAULT_LOANS;
      if (context.env.PORTAL_DATA) {
        const storedEquip = await context.env.PORTAL_DATA.get("beta_equipment", { type: "json" });
        if (Array.isArray(storedEquip)) equipList = storedEquip;

        const storedLoans = await context.env.PORTAL_DATA.get("beta_loans", { type: "json" });
        if (Array.isArray(storedLoans)) loanList = storedLoans;
      }
      return new Response(JSON.stringify({ equipment: equipList, loans: isAdmin ? loanList : loanList.filter(l => l.status === "active") }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Return complete payload if module=all
    let aduanList = DEFAULT_ADUAN;
    let lfList = DEFAULT_LOST_FOUND;
    let equipList = DEFAULT_EQUIPMENT;
    let loanList = DEFAULT_LOANS;
    if (context.env.PORTAL_DATA) {
      const a = await context.env.PORTAL_DATA.get("beta_aduan", { type: "json" });
      if (Array.isArray(a)) aduanList = a;
      const b = await context.env.PORTAL_DATA.get("beta_lostfound", { type: "json" });
      if (Array.isArray(b)) lfList = b;
      const c = await context.env.PORTAL_DATA.get("beta_equipment", { type: "json" });
      if (Array.isArray(c)) equipList = c;
      const d = await context.env.PORTAL_DATA.get("beta_loans", { type: "json" });
      if (Array.isArray(d)) loanList = d;
    }

    return new Response(JSON.stringify({
      aduan: isAdmin ? aduanList : aduanList.slice(0, 10),
      lostFound: lfList,
      equipment: equipList,
      loans: loanList
    }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const url = new URL(context.request.url);
    const module = url.searchParams.get("module");
    const payload = await context.request.json();

    // ── 1. Submit New E-Aduan ──
    if (module === "aduan") {
      let aduanList = DEFAULT_ADUAN;
      if (context.env.PORTAL_DATA) {
        const stored = await context.env.PORTAL_DATA.get("beta_aduan", { type: "json" });
        if (Array.isArray(stored)) aduanList = stored;
      }

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const ticketId = `ADU-${new Date().getFullYear()}-${randomSuffix}`;
      const now = new Date();

      const newAduan = {
        id: ticketId,
        createdAt: now.toISOString(),
        dateFormatted: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        student: {
          name: payload.isAnonymous ? "Pelajar Tanpa Nama" : (payload.name || "Pelajar PMKL"),
          matric: payload.isAnonymous ? "ANONYMOUS" : (payload.matric || "TIDAK DIBEKALKAN"),
          phone: payload.isAnonymous ? "" : (payload.phone || ""),
          email: payload.email || "",
          isAnonymous: !!payload.isAnonymous
        },
        category: payload.category || "facility",
        categoryLabel: payload.categoryLabel || "Kemudahan Kampus",
        location: payload.location || "Politeknik METrO Kuala Lumpur",
        title: payload.title || "Maklum Balas / Aduan Pelajar",
        description: payload.description || "",
        image: payload.image || null, // compressed base64 if present
        status: "submitted",
        statusLabel: "Diterima (Dalam Barisan)",
        adminNotes: "Laporan anda telah diterima oleh sistem JPP PMKL dan sedang dalam semakan EXCO.",
        resolvedAt: null
      };

      aduanList.unshift(newAduan);

      if (context.env.PORTAL_DATA) {
        await context.env.PORTAL_DATA.put("beta_aduan", JSON.stringify(aduanList));
      }

      return new Response(JSON.stringify({ success: true, ticketId, item: newAduan }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // ── 2. Submit Lost & Found Item ──
    if (module === "lostfound") {
      let lfList = DEFAULT_LOST_FOUND;
      if (context.env.PORTAL_DATA) {
        const stored = await context.env.PORTAL_DATA.get("beta_lostfound", { type: "json" });
        if (Array.isArray(stored)) lfList = stored;
      }

      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const itemId = `LF-${new Date().getFullYear()}-${randomSuffix}`;
      const now = new Date();

      const newItem = {
        id: itemId,
        type: payload.type === "lost" ? "lost" : "found",
        title: payload.title || "Barangan Tanpa Nama",
        category: payload.category || "other",
        categoryLabel: payload.categoryLabel || "Lain-lain",
        location: payload.location || "Kawasan PMKL",
        dateReported: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        description: payload.description || "",
        photo: payload.photo || null,
        contactName: payload.contactName || "Pelajar PMKL",
        contactWhatsapp: payload.contactWhatsapp ? payload.contactWhatsapp.replace(/\D/g, '') : "60133280168",
        status: "open",
        statusLabel: payload.type === "lost" ? "Sedang Dicari" : "Belum Dituntut"
      };

      lfList.unshift(newItem);

      if (context.env.PORTAL_DATA) {
        await context.env.PORTAL_DATA.put("beta_lostfound", JSON.stringify(lfList));
      }

      return new Response(JSON.stringify({ success: true, itemId, item: newItem }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // ── 3. Submit Equipment Loan ──
    if (module === "equipment") {
      let equipList = DEFAULT_EQUIPMENT;
      let loanList = DEFAULT_LOANS;
      if (context.env.PORTAL_DATA) {
        const storedEquip = await context.env.PORTAL_DATA.get("beta_equipment", { type: "json" });
        if (Array.isArray(storedEquip)) equipList = storedEquip;
        const storedLoans = await context.env.PORTAL_DATA.get("beta_loans", { type: "json" });
        if (Array.isArray(storedLoans)) loanList = storedLoans;
      }

      const eqIndex = equipList.findIndex(e => e.id === payload.equipmentId);
      if (eqIndex === -1) {
        return new Response(JSON.stringify({ error: "Peralatan tidak dijumpai" }), { status: 404 });
      }

      if (equipList[eqIndex].availableQty <= 0) {
        return new Response(JSON.stringify({ error: "Peralatan ini telah habis dipinjam buat masa ini." }), { status: 400 });
      }

      // Decrement stock
      equipList[eqIndex].availableQty -= 1;

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const loanId = `LN-${new Date().getFullYear()}-${randomSuffix}`;
      const now = new Date();

      const newLoan = {
        loanId,
        equipmentId: equipList[eqIndex].id,
        equipmentName: equipList[eqIndex].name,
        studentName: payload.studentName || "Pelajar PMKL",
        matric: payload.matric || "TIDAK DIBEKALKAN",
        phone: payload.phone || "",
        borrowDate: now.toISOString(),
        borrowDateFormatted: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        expectedReturn: payload.expectedReturn || "Sebelum 6:00 PM Hari Ini",
        status: "active",
        statusLabel: "Sedang Dipinjam"
      };

      loanList.unshift(newLoan);

      if (context.env.PORTAL_DATA) {
        await context.env.PORTAL_DATA.put("beta_equipment", JSON.stringify(equipList));
        await context.env.PORTAL_DATA.put("beta_loans", JSON.stringify(loanList));
      }

      return new Response(JSON.stringify({ success: true, loanId, loan: newLoan, remainingQty: equipList[eqIndex].availableQty }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    return new Response(JSON.stringify({ error: "Modul tidak sah" }), { status: 400 });

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

    const url = new URL(context.request.url);
    const module = url.searchParams.get("module");
    const payload = await context.request.json();

    // ── Update Aduan Status ──
    if (module === "aduan") {
      let aduanList = DEFAULT_ADUAN;
      if (context.env.PORTAL_DATA) {
        const stored = await context.env.PORTAL_DATA.get("beta_aduan", { type: "json" });
        if (Array.isArray(stored)) aduanList = stored;
      }

      const idx = aduanList.findIndex(a => a.id === payload.id);
      if (idx === -1) return new Response(JSON.stringify({ error: "Aduan tidak dijumpai" }), { status: 404 });

      if (payload.status) {
        aduanList[idx].status = payload.status;
        const statusMap = {
          submitted: "Diterima",
          in_review: "Dalam Semakan EXCO",
          in_progress: "Tindakan Penyelenggaraan",
          resolved: "Selesai",
          rejected: "Ditolak / Tiada Tindakan"
        };
        aduanList[idx].statusLabel = statusMap[payload.status] || payload.status;
        if (payload.status === "resolved") {
          aduanList[idx].resolvedAt = new Date().toISOString();
        }
      }

      if (payload.adminNotes !== undefined) {
        aduanList[idx].adminNotes = payload.adminNotes;
      }

      if (context.env.PORTAL_DATA) {
        await context.env.PORTAL_DATA.put("beta_aduan", JSON.stringify(aduanList));
      }

      return new Response(JSON.stringify({ success: true, item: aduanList[idx] }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // ── Return Equipment Loan ──
    if (module === "equipment-return") {
      let equipList = DEFAULT_EQUIPMENT;
      let loanList = DEFAULT_LOANS;
      if (context.env.PORTAL_DATA) {
        const storedEquip = await context.env.PORTAL_DATA.get("beta_equipment", { type: "json" });
        if (Array.isArray(storedEquip)) equipList = storedEquip;
        const storedLoans = await context.env.PORTAL_DATA.get("beta_loans", { type: "json" });
        if (Array.isArray(storedLoans)) loanList = storedLoans;
      }

      const lIdx = loanList.findIndex(l => l.loanId === payload.loanId);
      if (lIdx === -1) return new Response(JSON.stringify({ error: "Rekod pinjaman tidak dijumpai" }), { status: 404 });

      if (loanList[lIdx].status !== "returned") {
        loanList[lIdx].status = "returned";
        loanList[lIdx].statusLabel = "Telah Dipulangkan";
        loanList[lIdx].returnedAt = new Date().toISOString();

        // Increment equipment available qty
        const eqIdx = equipList.findIndex(e => e.id === loanList[lIdx].equipmentId);
        if (eqIdx !== -1 && equipList[eqIdx].availableQty < equipList[eqIdx].totalQty) {
          equipList[eqIdx].availableQty += 1;
        }

        if (context.env.PORTAL_DATA) {
          await context.env.PORTAL_DATA.put("beta_equipment", JSON.stringify(equipList));
          await context.env.PORTAL_DATA.put("beta_loans", JSON.stringify(loanList));
        }
      }

      return new Response(JSON.stringify({ success: true, loan: loanList[lIdx] }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // ── Mark Lost & Found Claimed ──
    if (module === "lostfound-claim") {
      let lfList = DEFAULT_LOST_FOUND;
      if (context.env.PORTAL_DATA) {
        const stored = await context.env.PORTAL_DATA.get("beta_lostfound", { type: "json" });
        if (Array.isArray(stored)) lfList = stored;
      }

      const idx = lfList.findIndex(item => item.id === payload.id);
      if (idx === -1) return new Response(JSON.stringify({ error: "Barangan tidak dijumpai" }), { status: 404 });

      lfList[idx].status = payload.status || "claimed";
      lfList[idx].statusLabel = payload.status === "open" ? "Belum Dituntut" : "Telah Dipulangkan";

      if (context.env.PORTAL_DATA) {
        await context.env.PORTAL_DATA.put("beta_lostfound", JSON.stringify(lfList));
      }

      return new Response(JSON.stringify({ success: true, item: lfList[idx] }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    return new Response(JSON.stringify({ error: "Modul tidak sah" }), { status: 400 });

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
    const module = url.searchParams.get("module");
    const id = url.searchParams.get("id");
    if (!id) return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400 });

    if (module === "aduan") {
      let aduanList = DEFAULT_ADUAN;
      if (context.env.PORTAL_DATA) {
        const stored = await context.env.PORTAL_DATA.get("beta_aduan", { type: "json" });
        if (Array.isArray(stored)) aduanList = stored;
      }
      aduanList = aduanList.filter(a => a.id !== id);
      if (context.env.PORTAL_DATA) await context.env.PORTAL_DATA.put("beta_aduan", JSON.stringify(aduanList));
      return new Response(JSON.stringify({ success: true, list: aduanList }), { headers: { "Content-Type": "application/json" } });
    }

    if (module === "lostfound") {
      let lfList = DEFAULT_LOST_FOUND;
      if (context.env.PORTAL_DATA) {
        const stored = await context.env.PORTAL_DATA.get("beta_lostfound", { type: "json" });
        if (Array.isArray(stored)) lfList = stored;
      }
      lfList = lfList.filter(item => item.id !== id);
      if (context.env.PORTAL_DATA) await context.env.PORTAL_DATA.put("beta_lostfound", JSON.stringify(lfList));
      return new Response(JSON.stringify({ success: true, list: lfList }), { headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Modul tidak sah" }), { status: 400 });

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
