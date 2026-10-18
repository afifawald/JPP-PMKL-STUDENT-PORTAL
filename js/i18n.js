// ══════════════════════════════════════════════════════════════════
// ══ JPP PMKL STUDENT PORTAL — BILINGUAL i18n SYSTEM ══
// ══ Dual Language Support: Bahasa Melayu (ms) & English (en) ══
// ══════════════════════════════════════════════════════════════════

const TRANSLATIONS = {
  ms: {
    // Navigation
    nav_dashboard: "Papan Pemuka",
    nav_announcements: "Pengumuman",
    nav_events: "Acara",
    nav_academic: "Akademik",
    nav_members: "Ahli JPP",
    nav_album: "Galeri",
    nav_printing: "Pusat Cetakan",
    nav_rent: "Rumah Sewa",
    nav_contact: "Hubungi",
    nav_beta: "Makmal Beta",
    nav_search_title: "Carian Pantas (Ctrl+K)",
    nav_lang_title: "Tukar Bahasa (Bahasa Melayu / English)",
    nav_theme_title: "Tukar Mod Tema Gelap / Terang",

    // Hero Section
    hero_badge: "Portal Rasmi Pelajar 2026/2027",
    hero_title: "Selamat Datang ke<br><em>PORTAL PELAJAR JPP PMKL</em>",
    hero_sub: "Jawatankuasa Perwakilan Pelajar — Politeknik METrO Kuala Lumpur. Pusat sehenti bagi hebahan rasmi, aktiviti kampus, dan kebajikan siswa.",
    hero_btn_events: "Program & Acara",
    hero_btn_announcements: "Papan Notis",

    // Quick Access Chips
    qa_discord: "Komuniti Discord",
    qa_academic: "Hab Akademik",
    qa_announcements: "Pengumuman",
    qa_events: "Acara Siswa",
    qa_members: "Ahli JPP",
    qa_printing: "Pusat Cetakan",
    qa_rent: "Rumah Sewa",
    qa_contact: "Hubungi Kami",
    qa_gallery: "Galeri Foto",

    // Statistics
    stat_students: "Jumlah Pelajar",
    stat_members: "Ahli JPP",
    stat_events: "Acara Bulan Ini",
    stat_rentals: "Unit Rumah Sewa",

    // Dashboard Cards
    dash_sec_quick: "Akses Pantas Portal",
    dash_card_ann_title: "Papan Notis & Pengumuman",
    dash_card_ann_desc: "Pekeliling penting dan makluman terkini JPP PMKL",
    dash_card_events_title: "Kalendar Program & Acara",
    dash_card_events_desc: "Program siswa, bengkel keusahawanan dan kejohanan sukan",
    dash_card_acad_title: "Hab Sumber Akademik PMKL",
    dash_card_acad_desc: "Takwim Sesi 2026/2027, arkib soalan peperiksaan DIT, DRO, DHM dan kalkulator GPA",
    dash_card_members_title: "Barisan Kepimpinan JPP",
    dash_card_members_desc: "Kenali barisan Majlis Tertinggi dan EXCO Sesi 2026/2027",
    dash_card_rent_title: "Pencarian Rumah Sewa",
    dash_card_rent_desc: "Direktori rumah sewa selamat sekitar Setiawangsa & PMKL",
    dash_card_print_title: "Pusat Percetakan Siswa",
    dash_card_print_desc: "Kalkulator kos cetakan, tempahan dalam talian dan semakan status",
    dash_card_contact_title: "Direktori Kampus & Hubungi",
    dash_card_contact_desc: "Panduan aras bilik kuliah, makmal komputer dan talian kecemasan",
    dash_card_album_title: "Galeri Kenangan Kampus",
    dash_card_album_desc: "Sorotan memori sukaneka, konvokesyen dan aktiviti persatuan",
    dash_card_beta_title: "Portal Beta: 3 Tonggak Siswa",
    dash_card_beta_desc: "Sistem e-Aduan, Papan Barangan Hilang dan Pinjaman Alatan Sukan",

    dash_panel_ann_title: "Pengumuman Terkini",
    dash_panel_events_title: "Acara Akan Datang",
    dash_view_all: "Lihat semua →",

    // Section Labels & Titles
    sec_ann_label: "Papan Hebahan Rasmi",
    sec_ann_title: "Pengumuman & Makluman",
    sec_ann_sub: "Kekal peka dengan maklumat terkini, pekeliling akademik dan peluang siswa.",
    sec_events_label: "Aktiviti Kampus",
    sec_events_title: "Program & Acara JPP",
    sec_events_sub: "Sertai aktiviti persatuan, kejohanan e-sukan dan bengkel pembangunan kendiri.",
    btn_event_rsvp: "Daftar / RSVP",

    // Academic Hub
    acad_sec_label: "Portal Akademik PMKL",
    acad_main_title: "Hab Sumber & Takwim Akademik",
    acad_main_sub: "Pusat rujukan takwim sesi 2026/2027, arkib kertas soalan peperiksaan akhir, dan kalkulator sasaran GPA / CGPA Politeknik METrO Kuala Lumpur.",
    acad_tab_takwim: "Takwim Akademik",
    acad_tab_pastyears: "Koleksi Kertas Peperiksaan",
    acad_tab_gpa: "Kalkulator GPA / CGPA",
    acad_takwim_heading: "Takwim Akademik Sesi I & II: 2026/2027",
    acad_takwim_desc: "Jadual rasmi pendaftaran kursus, minggu perkuliahan, cuti pertengahan semester, dan minggu peperiksaan akhir Politeknik Malaysia.",
    acad_btn_download_takwim: "Muat Turun PDF Takwim",
    acad_past_heading: "Bank Kertas Soalan Peperiksaan Akhir",
    acad_past_desc: "Koleksi rujukan soalan peperiksaan lepas bagi program diploma yang ditawarkan di Politeknik METrO Kuala Lumpur.",
    acad_filter_all: "Semua Program",
    acad_filter_dit: "DIT (Teknologi Maklumat)",
    acad_filter_dro: "DRO (Pengurusan Peruncitan)",
    acad_filter_dhm: "DHM (Pengurusan Hotel)",
    acad_filter_umum: "Umum (Wajib Politeknik)",
    acad_gpa_heading: "Kalkulator GPA / CGPA Politeknik",
    acad_gpa_desc: "Kira Purata Nilai Gred (GPA) dan unjuran HPNM sasaran mengikut sistem gred rasmi Politeknik Malaysia.",
    acad_col_course: "Nama Kursus & Kod",
    acad_col_credits: "Kredit",
    acad_col_grade: "Gred",
    acad_col_action: "Tindakan",
    acad_btn_add_course: "Tambah Kursus",
    acad_btn_reset_gpa: "Set Semula",
    acad_gpa_result_label: "Anggaran Purata Nilai Gred (GPA)",
    acad_gpa_ref_heading: "Skala Gred Politeknik",

    // Merchandise Store
    merch_sec_label: "Cenderahati Rasmi",
    merch_main_title: "Kedai Pra-Tempahan Cenderahati JPP PMKL",
    merch_main_sub: "Dapatkan barangan rasmi edisi terhad JPP PMKL Sesi 2026/2027. Tempahan dibuka sekarang!",
    merch_jacket_title: "Varsity Jacket Rasmi JPP PMKL 2026",
    merch_jacket_desc: "Fabrik premium fleece & faux leather dengan sulaman logo JPP berkualiti tinggi.",
    merch_lanyard_title: "Lanyard Rasmi Siswa PMKL + Kad Holder",
    merch_lanyard_desc: "Lanyard sublimasi berkualiti tinggi kalis luntur lengkap dengan pemegang kad matrik kalis air.",
    merch_btn_order: "Pra-Tempah Sekarang",
    merch_info_pickup: "Pengambilan di Pusat Khidmat Pelajar JPP (Aras 2)",

    // Campus Guide & Directory
    guide_sec_label: "Panduan Kampus",
    guide_main_title: "Direktori & Panduan Aras Kampus PMKL",
    guide_main_sub: "Panduan kemudahan, bilik kuliah, makmal dan surau mengikut aras bangunan Politeknik METrO Kuala Lumpur.",
    guide_floor_g: "Aras Bawah (Ground)",
    guide_floor_1: "Aras 1 (Dewan & Pejabat)",
    guide_floor_2: "Aras 2 (JPP & Surau)",
    guide_floor_3: "Aras 3 (Makmal DIT & DRO)",
    guide_floor_4: "Aras 4 (Hospitaliti DHM)",
    guide_emergency_title: "Talian Kecemasan & Bantuan Kampus",

    // Printing Station
    print_sec_label: "Pusat Percetakan Siswa",
    print_main_title: "Stesen Cetakan Siswa JPP",
    print_main_sub: "Hantar dokumen cetakan terus ke kaunter bilik JPP aras 2. Jimat masa, tanpa perlu menunggu beratur panjang.",
    print_step1: "1. Muat Naik Fail Dokumen",
    print_step2: "2. Spesifikasi Cetakan",
    print_step3: "3. Pengesahan & Hantar Pesanan",
    print_btn_dispatch: "Hantar Pesanan ke Printer",

    // Beta Lab
    beta_sec_label: "Hab Kebajikan & Fasiliti",
    beta_main_title: "Portal Beta: 3 Tonggak Siswa",
    beta_main_sub: "Penyelesaian digital bersepadu untuk kemudahan kebajikan siswa, pengurusan fasiliti, dan pinjaman alatan.",
    beta_pillar_1: "1. Sistem e-Aduan",
    beta_pillar_2: "2. Papan Barangan Hilang",
    beta_pillar_3: "3. Pinjaman Alatan",

    // Housing Rentals
    rent_sec_label: "Penempatan Siswa",
    rent_main_title: "Pencarian Rumah Sewa",
    rent_main_sub: "Senarai bilik dan rumah sewa berdekatan kampus Politeknik METrO Kuala Lumpur.",
    rent_btn_details: "Lihat Butiran",
    rent_why_heading: "Kenapa Gunakan RENT@PMKL?",
    rent_why_nearby: "Berdekatan",
    rent_why_nearby_desc: "Semua unit berhampiran dengan politeknik.",
    rent_why_updated: "Senarai Terkini",
    rent_why_updated_desc: "Maklumat bilik & rumah sentiasa dikemas kini.",
    rent_why_contact: "Hubungan Terus",
    rent_why_contact_desc: "Hubungi pemilik terus — tiada orang tengah.",
    rent_why_safe: "Selamat & Mudah",
    rent_why_safe_desc: "Antara muka ringkas diuruskan oleh JPP.",

    // Contact & Campus Guide
    contact_sec_label: "Hubungi Kami",
    contact_main_title: "Hubungi Kami",
    contact_main_sub: "Hubungi JPP PMKL untuk sebarang pertanyaan, maklum balas atau kolaborasi.",
    contact_card_address: "Alamat",
    contact_card_phone: "Telefon",
    contact_card_email: "Emel",
    contact_card_social: "Media Sosial",
    contact_chart_title: "Carta Organisasi JPP PMKL 2026/2027",

    // Members Section
    members_sec_label: "Barisan Kepimpinan",
    members_main_title: "Jawatankuasa Perwakilan Pelajar",
    members_main_sub: "Mewakili suara dan memperjuangkan kebajikan seluruh siswa PMKL.",

    // Photo Gallery
    album_sec_label: "Sorotan Gambar",
    album_main_title: "Galeri Kenangan Kampus",
    album_main_sub: "Memori dan detik bersejarah program siswa Politeknik METrO Kuala Lumpur.",

    // Global Search (Ctrl+K)
    search_placeholder: "Cari pengumuman, acara, rumah sewa, alatan, atau soalan peperiksaan...",
    search_hint: "Tekan ESC untuk tutup",
    search_empty: "Tiada keputusan dijumpai. Cuba cari dengan kata kunci lain.",
    search_prompt: "Taip kata kunci untuk memulakan carian merentas seluruh portal.",

    // General Buttons & UI
    btn_back: "Kembali ke Papan Pemuka",
    btn_close: "Tutup",
    btn_cancel: "Batal",
    btn_submit: "Hantar",
    btn_confirm: "Sahkan Pendaftaran",
    toast_switched: "Bahasa ditukar ke Bahasa Melayu 🇲🇾",

    // Footer
    footer_desc: "Jawatankuasa Perwakilan Pelajar Politeknik METrO Kuala Lumpur. Memartabatkan kebajikan, kepimpinan, dan kecemerlangan siswa.",
    footer_portal: "Portal",
    footer_quick_links: "Pautan Pantas",
    footer_resources: "Sumber",
    footer_contact_info: "Maklumat Perhubungan",
    footer_contact: "Maklumat Perhubungan",
    footer_rights: "Hak Cipta Terpelihara.",
    footer_made_with: "Dihasilkan dengan ❤️ untuk Siswa PMKL"
  },

  en: {
    // Navigation
    nav_dashboard: "Dashboard",
    nav_announcements: "Announcements",
    nav_events: "Events",
    nav_academic: "Academic Hub",
    nav_members: "Members",
    nav_album: "Gallery",
    nav_printing: "Printing Hub",
    nav_rent: "Rent House",
    nav_contact: "Contact",
    nav_beta: "Beta Lab",
    nav_search_title: "Quick Search (Ctrl+K)",
    nav_lang_title: "Switch Language (Bahasa Melayu / English)",
    nav_theme_title: "Toggle Dark / Light Theme",

    // Hero Section
    hero_badge: "Official Student Portal 2026/2027",
    hero_title: "Welcome to<br><em>JPP PMKL STUDENT PORTAL</em>",
    hero_sub: "Student Representative Committee — Politeknik METrO Kuala Lumpur. Your central hub for announcements, events, and student welfare.",
    hero_btn_events: "Upcoming Events",
    hero_btn_announcements: "Notice Board",

    // Quick Access Chips
    qa_discord: "Discord Hub",
    qa_academic: "Academic Hub",
    qa_announcements: "Announcements",
    qa_events: "Events",
    qa_members: "JPP Members",
    qa_printing: "Printing Hub",
    qa_rent: "Rent House",
    qa_contact: "Contact Us",
    qa_gallery: "Photo Gallery",

    // Statistics
    stat_students: "Students",
    stat_members: "JPP Members",
    stat_events: "Events This Month",
    stat_rentals: "Rental Listings",

    // Dashboard Cards
    dash_sec_quick: "Quick Access",
    dash_card_ann_title: "Announcements & Notices",
    dash_card_ann_desc: "Important notices and official circulars from JPP PMKL",
    dash_card_events_title: "Events & Programs Calendar",
    dash_card_events_desc: "Upcoming student programs, entrepreneurship workshops and tournaments",
    dash_card_acad_title: "Academic Resources Hub",
    dash_card_acad_desc: "Academic calendar, past year papers bank (DIT, DRO, DHM), and GPA calculator",
    dash_card_members_title: "Student Leadership Team",
    dash_card_members_desc: "Meet the High Council and EXCO committee for Session 2026/2027",
    dash_card_rent_title: "Rental Housing Directory",
    dash_card_rent_desc: "Verified student rental rooms and houses around Setiawangsa and PMKL",
    dash_card_print_title: "Student Printing Center",
    dash_card_print_desc: "Print rates calculator, online document dispatch and live queue status",
    dash_card_contact_title: "Campus Guide & Contact",
    dash_card_contact_desc: "Floor-by-floor room directory, IT labs guide, and emergency contact lines",
    dash_card_album_title: "Campus Memories & Album",
    dash_card_album_desc: "Photo highlights from sports competitions, convocations and student activities",
    dash_card_beta_title: "Beta Lab: 3 Student Pillars",
    dash_card_beta_desc: "e-Aduan ticketing, Lost & Found community board and equipment loan system",

    dash_panel_ann_title: "Latest Announcements",
    dash_panel_events_title: "Upcoming Events",
    dash_view_all: "View all →",

    // Section Labels & Titles
    sec_ann_label: "Official Notice Board",
    sec_ann_title: "Announcements & Circulars",
    sec_ann_sub: "Stay informed with official circulars, academic notices and opportunities.",
    sec_events_label: "Campus Activities",
    sec_events_title: "Events & Programmes",
    sec_events_sub: "Join student association activities, esport championships and workshops.",
    btn_event_rsvp: "Register / RSVP",

    // Academic Hub
    acad_sec_label: "PMKL Academic Portal",
    acad_main_title: "Academic Resources & Calendar Hub",
    acad_main_sub: "Reference hub for PMKL session 2026/2027 calendar, final examination past paper repository, and Politeknik GPA/CGPA target calculator.",
    acad_tab_takwim: "Academic Calendar",
    acad_tab_pastyears: "Past Year Papers Bank",
    acad_tab_gpa: "GPA / CGPA Calculator",
    acad_takwim_heading: "Academic Calendar Session I & II: 2026/2027",
    acad_takwim_desc: "Official timeline for course registration, lecture weeks, mid-semester breaks, and final examinations of Politeknik Malaysia.",
    acad_btn_download_takwim: "Download Calendar PDF",
    acad_past_heading: "Past Year Final Exam Papers Bank",
    acad_past_desc: "Past examination reference papers bank for diploma programmes offered at Politeknik METrO Kuala Lumpur.",
    acad_filter_all: "All Programmes",
    acad_filter_dit: "DIT (Information Tech)",
    acad_filter_dro: "DRO (Retail Operations)",
    acad_filter_dhm: "DHM (Hotel Management)",
    acad_filter_umum: "General (Wajib Courses)",
    acad_gpa_heading: "Politeknik GPA / CGPA Calculator",
    acad_gpa_desc: "Calculate Grade Point Average (GPA) and target CGPA projection following the official Politeknik Malaysia grading scheme.",
    acad_col_course: "Course Code & Name",
    acad_col_credits: "Credits",
    acad_col_grade: "Grade",
    acad_col_action: "Action",
    acad_btn_add_course: "Add Course",
    acad_btn_reset_gpa: "Reset",
    acad_gpa_result_label: "Estimated Grade Point Average (GPA)",
    acad_gpa_ref_heading: "Politeknik Grading Scale",

    // Merchandise Store
    merch_sec_label: "Official Merchandise",
    merch_main_title: "JPP PMKL Official Merchandise Store",
    merch_main_sub: "Get exclusive, limited-edition JPP PMKL merchandise for Session 2026/2027. Pre-orders are now open!",
    merch_jacket_title: "JPP PMKL Official Varsity Jacket 2026",
    merch_jacket_desc: "Premium fleece & faux leather finish with high-density embroidered JPP PMKL emblem.",
    merch_lanyard_title: "PMKL Official Student Lanyard + Card Holder",
    merch_lanyard_desc: "High-grade sublimation lanyard with durable metal hook and waterproof matric card holder.",
    merch_btn_order: "Pre-Order Now",
    merch_info_pickup: "Pickup at JPP Student Service Center (Level 2)",

    // Campus Guide & Directory
    guide_sec_label: "Campus Guide",
    guide_main_title: "PMKL Campus Floor Guide & Directory",
    guide_main_sub: "Floor-by-floor directory of facilities, lecture halls, computer labs, and musolla across Politeknik METrO Kuala Lumpur.",
    guide_floor_g: "Ground Floor (G)",
    guide_floor_1: "Level 1 (Halls & Admin)",
    guide_floor_2: "Level 2 (JPP & Musolla)",
    guide_floor_3: "Level 3 (DIT & DRO Labs)",
    guide_floor_4: "Level 4 (DHM Hospitality)",
    guide_emergency_title: "Campus Emergency & Help Lines",

    // Printing Station
    print_sec_label: "Student Printing Center",
    print_main_title: "JPP Student Printing Station",
    print_main_sub: "Dispatch print jobs directly to JPP counter Level 2. Save time and bypass physical queues.",
    print_step1: "1. Upload Document File",
    print_step2: "2. Print Specifications",
    print_step3: "3. Payment & Submit Order",
    print_btn_dispatch: "Dispatch Job to Printer",

    // Beta Lab
    beta_sec_label: "Student Welfare & Facilities",
    beta_main_title: "Beta Lab: 3 Student Pillars",
    beta_main_sub: "Integrated digital solutions for student welfare, campus facilities, and equipment loans.",
    beta_pillar_1: "1. e-Aduan Feedback System",
    beta_pillar_2: "2. Lost & Found Board",
    beta_pillar_3: "3. Equipment Loan Hub",

    // Housing Rentals
    rent_sec_label: "Student Housing",
    rent_main_title: "Rental Housing Directory",
    rent_main_sub: "Listings of student rooms and rental houses near Politeknik METrO Kuala Lumpur.",
    rent_btn_details: "View Details",
    rent_why_heading: "Why Use RENT@PMKL?",
    rent_why_nearby: "Nearby",
    rent_why_nearby_desc: "All listings are close to the polytechnic.",
    rent_why_updated: "Updated Listings",
    rent_why_updated_desc: "Room & house info kept up to date.",
    rent_why_contact: "Direct Contact",
    rent_why_contact_desc: "Contact the owner directly — no middleman.",
    rent_why_safe: "Safe & Easy",
    rent_why_safe_desc: "Simple interface managed by JPP.",

    // Contact & Campus Guide
    contact_sec_label: "Get In Touch",
    contact_main_title: "Contact Us",
    contact_main_sub: "Reach out to JPP PMKL for inquiries, feedback, or collaboration.",
    contact_card_address: "Address",
    contact_card_phone: "Phone",
    contact_card_email: "Email",
    contact_card_social: "Social Media",
    contact_chart_title: "JPP PMKL 2026/2027 Organisation Chart",

    // Members Section
    members_sec_label: "Leadership Team",
    members_main_title: "Student Representative Committee",
    members_main_sub: "Representing student voices and advancing welfare across PMKL.",

    // Photo Gallery
    album_sec_label: "Photo Highlights",
    album_main_title: "Campus Photo Gallery",
    album_main_sub: "Memories and milestones from student activities at Politeknik METrO Kuala Lumpur.",

    // Global Search (Ctrl+K)
    search_placeholder: "Search announcements, events, rentals, equipment, or past papers...",
    search_hint: "Press ESC to close",
    search_empty: "No results found. Try searching with different keywords.",
    search_prompt: "Type keywords to search across the entire student portal.",

    // General Buttons & UI
    btn_back: "Back to Dashboard",
    btn_close: "Close",
    btn_cancel: "Cancel",
    btn_submit: "Submit",
    btn_confirm: "Confirm Registration",
    toast_switched: "Language switched to English 🇬🇧",

    // Footer
    footer_desc: "Student Representative Committee of Politeknik METrO Kuala Lumpur. Empowering student welfare, leadership, and excellence.",
    footer_portal: "Portal",
    footer_quick_links: "Quick Links",
    footer_resources: "Resources",
    footer_contact_info: "Contact Information",
    footer_contact: "Contact Information",
    footer_rights: "All Rights Reserved.",
    footer_made_with: "Made with ❤️ for PMKL Students"
  }
};

let _currentLang = localStorage.getItem('jpp_portal_lang') || 'ms';
const _langListeners = [];

function getCurrentLanguage() {
  return _currentLang;
}

function t(key, fallback = '') {
  if (TRANSLATIONS[_currentLang] && TRANSLATIONS[_currentLang][key]) {
    return TRANSLATIONS[_currentLang][key];
  }
  if (TRANSLATIONS['ms'] && TRANSLATIONS['ms'][key]) {
    return TRANSLATIONS['ms'][key];
  }
  return fallback;
}

function setLanguage(lang) {
  if (lang !== 'ms' && lang !== 'en') return;
  _currentLang = lang;
  localStorage.setItem('jpp_portal_lang', lang);
  document.documentElement.setAttribute('lang', lang);

  // 1. Update text for all elements with [data-i18n]
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);
    if (!translation) return;

    if (el.hasAttribute('data-i18n-html')) {
      el.innerHTML = translation;
    } else {
      // Check if element has an icon child (like <i class="..."></i> Text)
      const icon = el.querySelector('i');
      if (icon) {
        // Preserve icon and replace text following it
        const iconClone = icon.cloneNode(true);
        el.textContent = '';
        el.appendChild(iconClone);
        el.appendChild(document.createTextNode(' ' + translation));
      } else {
        el.textContent = translation;
      }
    }
  });

  // 2. Update placeholders with [data-i18n-placeholder]
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const translation = t(key);
    if (translation) el.placeholder = translation;
  });

  // 3. Update titles with [data-i18n-title]
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const translation = t(key);
    if (translation) el.title = translation;
  });

  // 4. Update the navbar toggle button UI
  updateLangButtonUI();

  // 5. Fire listeners for dynamic components
  _langListeners.forEach(fn => {
    try { fn(_currentLang); } catch (e) { console.error('i18n listener error:', e); }
  });
}

function updateLangButtonUI() {
  const btn = document.getElementById('langToggleBtn');
  const label = document.getElementById('currentLangText');
  if (label) {
    label.textContent = _currentLang === 'ms' ? 'BM' : 'EN';
  }
  if (btn) {
    btn.title = _currentLang === 'ms' ? 'Tukar ke English' : 'Switch to Bahasa Melayu';
  }
}

function toggleLanguage() {
  const next = _currentLang === 'ms' ? 'en' : 'ms';
  setLanguage(next);
  if (typeof showToast === 'function') {
    showToast(t('toast_switched'));
  }
}

function onLanguageChange(callback) {
  if (typeof callback === 'function') {
    _langListeners.push(callback);
  }
}

// Auto-initialize language on page load
window.addEventListener('DOMContentLoaded', () => {
  setLanguage(_currentLang);
});
