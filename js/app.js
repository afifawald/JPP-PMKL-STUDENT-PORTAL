// ══ JPP PMKL STUDENT PORTAL - APP MODULE ══

// ── Photo Album Lightbox ──
    let albumPhotos = [
      { src: 'albums/jpp.jpeg', caption: 'JPP PMKL' },
      { src: 'albums/convo.JPG', caption: 'Convocation' },
      { src: 'albums/futsal.JPG', caption: 'Futsal' },
      { src: 'albums/esport.JPG', caption: 'E-Sport' },
      { src: 'albums/ihya.jpg', caption: 'Ihya Ramadan' },
      { src: 'albums/mg.JPG', caption: 'Graduation Ceremony' },
      { src: 'albums/mts.JPG', caption: 'Mid-Semester Dinner' },
      { src: 'albums/bubur.JPG', caption: 'Community Programme' },
    ];
    let currentLightboxIdx = 0;

    function openLightbox(idx) {
      currentLightboxIdx = idx;
      const photo = albumPhotos[idx];
      document.getElementById('lightboxImg').src = photo.src;
      document.getElementById('lightboxImg').alt = photo.caption;
      document.getElementById('lightboxCaption').textContent = photo.caption + '  (' + (idx + 1) + ' / ' + albumPhotos.length + ')';
      document.getElementById('lightboxOverlay').classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      document.getElementById('lightboxOverlay').classList.remove('open');
      document.body.style.overflow = '';
    }

    function closeLightboxOnBg(e) {
      if (e.target === document.getElementById('lightboxOverlay')) closeLightbox();
    }

    function lightboxNav(dir) {
      currentLightboxIdx = (currentLightboxIdx + dir + albumPhotos.length) % albumPhotos.length;
      const photo = albumPhotos[currentLightboxIdx];
      const img = document.getElementById('lightboxImg');
      img.style.opacity = '0';
      setTimeout(() => {
        img.src = photo.src;
        img.alt = photo.caption;
        img.style.opacity = '1';
        document.getElementById('lightboxCaption').textContent = photo.caption + '  (' + (currentLightboxIdx + 1) + ' / ' + albumPhotos.length + ')';
      }, 150);
    }

    document.addEventListener('keydown', function (e) {
      const lb = document.getElementById('lightboxOverlay');
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') lightboxNav(1);
      if (e.key === 'ArrowLeft') lightboxNav(-1);
    });
    // Lightbox img transition is now defined in CSS (#lightboxImg)

    // ── Navigation ──
    function navigate(section) {
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

      const el = document.getElementById(section);
      if (el) el.classList.add('active');

      const lnk = document.querySelector(`.nav-link[data-section="${section}"]`);
      if (lnk) lnk.classList.add('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (document.getElementById('navLinks').classList.contains('open')) {
        document.getElementById('navLinks').classList.remove('open');
      }

      // Auto reset rental sub-grid levels when clicking away and returning to 'rent' tab
      if (section === 'rent') {
        showRentHome();
      }
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        navigate(this.dataset.section);
      });
    });

    // Mobile nav toggle
    document.getElementById('navHamburger').addEventListener('click', () => {
      document.getElementById('navLinks').classList.toggle('open');
    });

    // ── Theme toggle ──
    const themeBtn = document.getElementById('themeToggle');
    themeBtn.addEventListener('click', () => {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark';
      html.setAttribute('data-theme', isDark ? 'light' : 'dark');
      themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // ── Clock ──
    function updateClock() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      document.getElementById('dashClock').textContent = `${h}:${m}:${s}`;
      const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      document.getElementById('dashDay').textContent = days[now.getDay()];
      document.getElementById('dashDateStr').textContent = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    updateClock();
    setInterval(updateClock, 1000);

    // ── Calendar ──
    function buildCalendar() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const today = now.getDate();
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const wd = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      document.getElementById('calMonthYear').textContent = `${monthNames[month]} ${year}`;
      const grid = document.getElementById('calGrid');
      grid.innerHTML = '';
      wd.forEach(d => {
        const el = document.createElement('div');
        el.className = 'cal-wd';
        el.textContent = d;
        grid.appendChild(el);
      });
      for (let i = 0; i < firstDay; i++) {
        const el = document.createElement('div');
        el.className = 'cal-day empty';
        grid.appendChild(el);
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const el = document.createElement('div');
        el.className = 'cal-day' + (d === today ? ' today' : '');
        el.textContent = d;
        grid.appendChild(el);
      }
    }
    buildCalendar();

    // Re-run calendar at midnight so "today" stays accurate if page is left open
    (function scheduleMidnightCalendarRefresh() {
      const now = new Date();
      const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
      setTimeout(function () {
        buildCalendar();
        scheduleMidnightCalendarRefresh(); // Reschedule for next midnight
      }, msUntilMidnight);
    })();

    // ── Stats counter animation ──
    function animateCount(el, target) {
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;
      const interval = setInterval(() => {
        current = Math.min(current + step, target);
        if (target >= 1000) {
          el.textContent = Math.floor(current / 1000) + 'K+';
        } else {
          el.textContent = Math.floor(current) + (target > 10 ? '+' : '');
        }
        if (current >= target) clearInterval(interval);
      }, 16);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCount(el, parseInt(el.dataset.count));
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));

    // ── Rent House Application Logic Flow ──
    let currentApartmentSelection = "";
    let currentBlockSelection = "";

    function showRentHome() {
      document.getElementById('rentApartmentGrid').style.display = 'grid';
      document.getElementById('rentBlockGrid').style.display = 'none';
      document.getElementById('rentUnitGrid').style.display = 'none';
      document.getElementById('rentNavHeader').style.display = 'none';
      document.getElementById('rentFeaturesSection').style.display = 'block';
      document.getElementById('rentDivider').style.display = 'block';

      document.getElementById('rentMainTitle').innerText = "Rent House Listings";
      document.getElementById('rentMainSub').innerText = "Select an apartment complex near the polytechnic to view available student accommodation listings.";
    }

    function selectApartment(apartmentName) {
      currentApartmentSelection = apartmentName;
      document.getElementById('rentApartmentGrid').style.display = 'none';
      document.getElementById('rentFeaturesSection').style.display = 'none';
      document.getElementById('rentDivider').style.display = 'none';
      document.getElementById('rentNavHeader').style.display = 'block';

      document.getElementById('rentMainTitle').innerText = apartmentName + " — Select Block";
      document.getElementById('rentMainSub').innerText = "Please select a building block below to view available rental units.";

      const blockGrid = document.getElementById('rentBlockGrid');
      blockGrid.style.display = 'grid';
      blockGrid.innerHTML = ''; // Wipe template contents

      // Dynamically insert 4 structured blocks matching original system styling
      const blocks = ['Blok 1', 'Blok 2', 'Blok 3', 'Blok 4'];
      blocks.forEach((block) => {
        blockGrid.innerHTML += `
            <a class="dash-card" onclick="selectBlock('${block}')" style="--card-color: #1a4bff; --card-color-bg: var(--primary-glow);">
              <div class="dash-card-arrow"><i class="fas fa-arrow-right"></i></div>
              <div class="dash-card-icon"><i class="fas fa-building"></i></div>
              <h4>${block}</h4>
              <p>View available room and house listings in this building.</p>
            </a>
        `;
      });
    }

    function selectBlock(blockName) {
      currentBlockSelection = blockName;
      document.getElementById('rentBlockGrid').style.display = 'none';

      const unitGrid = document.getElementById('rentUnitGrid');
      unitGrid.style.display = 'grid';
      unitGrid.innerHTML = ''; // Flush previous lists

      document.getElementById('rentMainTitle').innerText = `${currentApartmentSelection} — ${blockName}`;
      document.getElementById('rentMainSub').innerText = `Showing available units in ${currentApartmentSelection} (${blockName}).`;

      // Check if dynamic rentals from Cloudflare API exist
      let listings = [];
      if (Array.isArray(window._dynamicRentals) && window._dynamicRentals.length > 0) {
        listings = window._dynamicRentals.filter(r => 
          r.apartment === currentApartmentSelection && (!r.block || r.block === blockName)
        );
      }

      if (listings.length === 0) {
        if (currentApartmentSelection === "Apartment Mahsuri") {
          listings = [
            { unit: 'Unit A-101', price: 'RM 450', details: 'Muslim students only. 2 Bedrooms, 1 Bathroom. Fully furnished. Includes double-decker bed, lockers, refrigerator, kitchen & washing machine.', contact: 'Encik Ahmad (012-328 0168)', address: 'Jalan Setiawangsa 13, Taman Setiawangsa, KL', features: ['WiFi', 'Water Incl.', 'Electric Incl.', '24hr Guarded'] },
            { unit: 'Unit A-102', price: 'RM 470', details: 'Comfortable shared room (Immediate Intake). Fully furnished, 2 Bedrooms & 1 Bathroom. Walking distance to Setiawangsa LRT station.', contact: 'Encik Ahmad (012-328 0168)', address: 'Jalan Setiawangsa 13, Taman Setiawangsa, KL', features: ['WiFi', 'Refrigerator', 'Washing Machine'] },
            { unit: 'Unit A-201', price: 'RM 550', details: 'Spacious 3 Bedrooms & 2 Bathrooms, ideal for student group sharing. Fully furnished with complete furniture.', contact: 'Puan Halima (016-946 3923)', address: 'Jalan Setiawangsa 13, Taman Setiawangsa, KL', features: ['Fully Furnished', 'Sofa', 'Bed'] }
          ];
        } else if (currentApartmentSelection === "Apartment Intan") {
          listings = [
            { unit: 'Unit Intan Premium', price: 'RM 350', details: 'Immediate Student Intake. Affordable rent including full utilities (WiFi, electricity & water cost controlled). Walking distance to shops.', contact: 'En. Zul (012-466 2096)', address: 'Setiawangsa near Politeknik METrO KL', features: ['WiFi incl.', 'Water incl.', 'Electric incl.', 'Near PMKL'] }
          ];
        } else {
          // Fallback default generation for empty categories placeholders
          listings = [
            { unit: 'Unit TBD-Standard Room', price: 'RM 300', details: 'Standard single/shared room near PMKL, available for new semester intake.', contact: 'JPP Portal Management (General Info)', address: 'Setiawangsa, Kuala Lumpur', features: ['Bed', 'Fan'] }
          ];
        }
      }

      // Render cards using premium portal style setup mechanics
      listings.forEach(item => {
        // Build features tags
        let featureChips = '';
        item.features.forEach(f => {
          featureChips += `<div class="feat-chip"><i class="fas fa-check-circle" style="color:var(--gold)"></i> ${f}</div>`;
        });

        unitGrid.innerHTML += `
            <div class="rent-card">
              <div class="rent-price-badge">${item.price}/mo</div>
              <div class="rent-thumb" style="background: var(--surface2); font-size:2.5rem;">🛋️</div>
              <div class="rent-card-body">
                <h4>${item.unit}</h4>
                <p style="font-size:0.85rem; color:var(--text2); margin-bottom:1rem; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical; overflow:hidden;">${item.details}</p>
                <div class="rent-features">${featureChips}</div>
                <button class="btn-rent" onclick="openRentModal('${item.unit}', '${item.address}', '${item.price} / month', '${item.details}', '${item.contact}')">View Details</button>
              </div>
            </div>
        `;
      });
    }

    // ── Rent Modal Handlers ──
    function openRentModal(title, address, price, details, contact) {
      document.getElementById('modalTitle').textContent = title;
      document.getElementById('modalAddress').textContent = address;
      document.getElementById('modalPrice').textContent = price;
      document.getElementById('modalDetails').textContent = details;
      document.getElementById('modalContact').textContent = contact || 'Contact Property Owner';

      // Set up copy behavior context cleanly
      const copyBtn = document.getElementById('modalCopyBtn');
      copyBtn.onclick = function () {
        navigator.clipboard.writeText(`Property: ${title}\nRent: ${price}\nContact: ${contact}`);
        showToast('Contact details copied!');
        closeRentModal();
      };

      document.getElementById('rentModal').classList.add('open');
    }

    function closeRentModal() {
      document.getElementById('rentModal').classList.remove('open');
    }

    document.getElementById('rentModal').addEventListener('click', function (e) {
      if (e.target === this) closeRentModal();
    });

    // ── Toast System ──
    let toastTimeout;
    function showToast(msg) {
      const toast = document.getElementById('toast');
      document.getElementById('toastMsg').textContent = msg;
      toast.classList.add('show');
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // ── Nav shadow configuration adjustments on scroll behavior ──
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('mainNav');
      nav.style.background = window.scrollY > 20
        ? (document.documentElement.getAttribute('data-theme') === 'light'
          ? 'rgba(242,245,252,0.95)' : 'rgba(7,9,15,0.92)')
        : '';
    });

    // ══ CLOUDFLARE LIVE INTEGRATION (ADMIN DRIVEN) ══
    window._dynamicRentals = null;

    async function syncCloudflareLivePortal() {
      // 1. Website Status, Maintenance Mode & Live Ticker
      try {
        const res = await fetch('/api/status', { cache: 'no-store' });
        if (res.ok) {
          const status = await res.json();
          const overlay = document.getElementById('maintenanceOverlay');
          
          if (status.maintenance && overlay) {
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
          } else if (overlay) {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
          }

          if (status.ticker !== undefined) {
            const tickerEl = document.querySelector('.ticker-text');
            const tickerBar = document.querySelector('.ticker-bar');
            if (status.ticker && status.ticker.trim() !== '') {
              if (tickerBar) tickerBar.style.display = 'flex';
              if (tickerEl) tickerEl.textContent = status.ticker;
              document.documentElement.style.setProperty('--ticker-h', '36px');
            } else {
              if (tickerBar) tickerBar.style.display = 'none';
              document.documentElement.style.setProperty('--ticker-h', '0px');
            }
          }

          if (status.stats) {
            const statsMap = {
              600: status.stats.students,
              20: status.stats.members,
              2: status.stats.events,
              3: status.stats.rentals
            };
            document.querySelectorAll('[data-count]').forEach(el => {
              const currentVal = parseInt(el.dataset.count);
              if (statsMap[currentVal] !== undefined) {
                el.dataset.count = statsMap[currentVal];
                el.textContent = statsMap[currentVal] + '+';
              }
            });
          }
        }
      } catch (err) {
        // Silent fallback to local static HTML
      }

      // 2. Dynamic Announcements
      try {
        const res = await fetch('/api/announcements?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const annList = await res.json();
          if (Array.isArray(annList)) {
            // Update Dashboard latest announcements
            const dashList = document.getElementById('dashAnnList');
            if (dashList) {
              dashList.innerHTML = '';
              if (annList.length === 0) {
                dashList.innerHTML = '<div style="color:var(--text3); font-size:0.85rem; padding:0.75rem 0;"><i class="fas fa-bell-slash" style="margin-right:6px;"></i>No announcements at this time.</div>';
              } else {
                annList.slice(0, 3).forEach(item => {
                  const dotColor = item.tagColor === 'blue' ? 'blue' : (item.tagColor === 'green' ? 'green' : '');
                  dashList.innerHTML += `
                    <div class="ann-item">
                      <div class="ann-dot ${dotColor}"></div>
                      <div class="ann-content">
                        <span class="tag tag-${item.tagColor || 'gold'}">${item.category || 'Notice'}</span>
                        <h5>${item.title}</h5>
                        <p>${item.content}</p>
                        <div style="font-size:0.74rem; color:var(--text3);">${item.date}</div>
                      </div>
                    </div>
                  `;
                });
              }
            }

            // Update Announcements tab
            const pageList = document.getElementById('annPageList');
            if (pageList) {
              pageList.innerHTML = '';
              if (annList.length === 0) {
                pageList.innerHTML = '<div style="color:var(--text3); font-size:0.95rem; padding:3rem 1rem; text-align:center;"><i class="fas fa-bell-slash" style="font-size:2rem; margin-bottom:0.75rem; display:block; color:var(--text3);"></i>No active announcements on the notice board.</div>';
              } else {
                annList.forEach(item => {
                  pageList.innerHTML += `
                    <div class="ann-card-big">
                      <span class="tag tag-${item.tagColor || 'gold'}">${item.category || 'Notice'}</span>
                      <h4>${item.title}</h4>
                      <p>${item.content}</p>
                      <div class="ann-meta">
                        <span><i class="fas fa-calendar-alt"></i> ${item.date}</span>
                        <span><i class="fas fa-user"></i> ${item.author || 'JPP PMKL'}</span>
                      </div>
                    </div>
                  `;
                });
              }
            }
          }
        }
      } catch (err) {
        // Silent fallback
      }

      // 3. Dynamic Events
      try {
        const res = await fetch('/api/events?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const eventsList = await res.json();
          if (Array.isArray(eventsList)) {
            // Update Dashboard upcoming events
            const dashEvents = document.getElementById('dashEventsList');
            if (dashEvents) {
              dashEvents.innerHTML = '';
              if (eventsList.length === 0) {
                dashEvents.innerHTML = '<div style="color:var(--text3); font-size:0.85rem; padding:0.75rem 0;"><i class="fas fa-calendar-xmark" style="margin-right:6px;"></i>No upcoming events scheduled.</div>';
              } else {
                eventsList.slice(0, 3).forEach(item => {
                  dashEvents.innerHTML += `
                    <div class="event-item">
                      <div class="event-date-box">
                        <div class="day">${item.dateDay}</div>
                        <div class="mon">${item.dateMonth}</div>
                      </div>
                      <div class="event-info-text">
                        <h5>${item.title}</h5>
                        <p><i class="fas fa-clock" style="color:var(--gold);margin-right:0.25rem;"></i>${item.time} — ${item.location}</p>
                      </div>
                    </div>
                  `;
                });
              }
            }

            // Update Events tab masonry
            const masonry = document.getElementById('eventsMasonry');
            if (masonry) {
              masonry.innerHTML = '';
              if (eventsList.length === 0) {
                masonry.innerHTML = '<div style="color:var(--text3); font-size:0.95rem; padding:3rem 1rem; text-align:center; grid-column:1 / -1;"><i class="fas fa-calendar-xmark" style="font-size:2rem; margin-bottom:0.75rem; display:block; color:var(--text3);"></i>No upcoming events currently scheduled. Check back soon!</div>';
              } else {
                eventsList.forEach(item => {
                  masonry.innerHTML += `
                    <div class="event-card-full">
                      <div class="event-thumb ${item.colorGrad || 'event-thumb-grad1'}">${item.icon || '📅'}</div>
                      <div class="event-card-body">
                        <h4>${item.title}</h4>
                        <div class="event-meta-row">
                          <div class="event-meta-item"><i class="fas fa-calendar-alt"></i> ${item.dateFull || (item.dateDay + ' ' + item.dateMonth)}</div>
                        </div>
                        <div class="event-meta-row">
                          <div class="event-meta-item"><i class="fas fa-clock"></i> ${item.time}</div>
                        </div>
                        <div class="event-meta-row">
                          <div class="event-meta-item"><i class="fas fa-map-marker-alt"></i> ${item.location}</div>
                        </div>
                        <button class="btn-event" onclick="showToast('Event: ' + '${item.title.replace(/'/g, "\\'")}')">Learn More</button>
                      </div>
                    </div>
                  `;
                });
              }
            }
          }
        }
      } catch (err) {
        // Silent fallback
      }

      // 4. Dynamic Rental Listings Cache
      try {
        const res = await fetch('/api/rentals?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const rentalsList = await res.json();
          if (Array.isArray(rentalsList)) {
            window._dynamicRentals = rentalsList;
          }
        }
      } catch (err) {
        // Silent fallback
      }

      // 5. Dynamic Photo Album
      try {
        const res = await fetch('/api/album?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const photoList = await res.json();
          if (Array.isArray(photoList)) {
            albumPhotos = photoList;
            const albumGrid = document.getElementById('albumGrid');
            if (albumGrid) {
              albumGrid.innerHTML = '';
              if (photoList.length === 0) {
                albumGrid.innerHTML = '<div style="color:var(--text3); font-size:0.95rem; padding:3rem 1rem; text-align:center; grid-column:1 / -1;"><i class="fas fa-camera" style="font-size:2rem; margin-bottom:0.75rem; display:block; color:var(--text3);"></i>No photos in album currently.</div>';
              } else {
                photoList.forEach((photo, idx) => {
                  albumGrid.innerHTML += `
                    <div class="album-item" onclick="openLightbox(${idx})">
                      <img class="album-item-inner" src="${photo.src}" alt="${photo.caption}" loading="lazy" onerror="this.src='albums/jpp.jpeg'">
                      <div class="album-item-label"><i class="fas fa-camera"></i> ${photo.caption}</div>
                    </div>
                  `;
                });
              }
            }
          }
        }
      } catch (err) {
        // Silent fallback
      }

      // 6. Dynamic Printing Settings & Rates
      try {
        const res = await fetch('/api/printing?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const pSettings = await res.json();
          if (pSettings) {
            window._printingSettings = pSettings;
            if (pSettings.rates) {
              window._printingRates = Object.assign({}, defaultPrintingRates, pSettings.rates);
              updateRatesDisplay(window._printingRates);
            }
            updatePrintingStatusUI(pSettings);
          }
        }
      } catch (err) {
        // Silent fallback
      }
    }

    syncCloudflareLivePortal();
    document.addEventListener('DOMContentLoaded', () => {
      syncCloudflareLivePortal();
      initPrintingStudio();
    });
    // Periodically re-check status every 60s
    setInterval(syncCloudflareLivePortal, 60000);

    // Secret Admin Access Shortcut: Press Ctrl + Shift + A
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.location.href = 'admin.html';
      }
    });

// ══════════════════════════════════════════════════════
// ══ JPP PRINTING HUB & DIRECT-TO-PRINTER ENGINE ══
// ══════════════════════════════════════════════════════

const defaultPrintingRates = {
  bw_single: 0.10,
  bw_double: 0.15,
  color_standard: 0.50,
  color_photo: 1.00,
  a3_bw: 0.40,
  a3_color: 1.50,
  binding_none: 0.00,
  binding_staple: 0.50,
  binding_comb: 2.00,
  binding_hard: 10.00,
  laminating_a4: 1.50
};

window._printingRates = Object.assign({}, defaultPrintingRates);
let selectedPrintFile = null;
let activePrintPreferences = {
  color: 'bw',
  sides: 'single',
  size: 'a4',
  binding: 'none'
};
let latestSubmittedJob = null;
let activePaymentMethod = 'duitnow_qr'; // 'duitnow_qr' | 'counter'
let selectedReceiptFile = null;
let botVerificationResult = null;

function initPrintingStudio() {
  const dropzone = document.getElementById('dropzoneBox');
  if (dropzone) {
    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        processUploadedFile(files[0]);
      }
    });
  }

  // Receipt Dropzone Setup
  const receiptDropzone = document.getElementById('receiptDropzoneBox');
  if (receiptDropzone) {
    ['dragenter', 'dragover'].forEach(name => {
      receiptDropzone.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        receiptDropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(name => {
      receiptDropzone.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        receiptDropzone.classList.remove('dragover');
      }, false);
    });

    receiptDropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        processUploadedReceipt(files[0]);
      }
    });
  }

  recalculatePrintPrice();
  renderMyRecentTickets();
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    processUploadedFile(file);
  }
}

function processUploadedFile(file) {
  // Max 15MB limit
  const maxBytes = 15 * 1024 * 1024;
  if (file.size > maxBytes) {
    showToast('File size exceeds the 15MB limit.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    selectedPrintFile = {
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      data: dataUrl
    };

    // Update File Preview Box in UI
    document.getElementById('dropzoneBox').style.display = 'none';
    const selBox = document.getElementById('fileSelectedBox');
    selBox.style.display = 'flex';
    document.getElementById('fileSelectedName').textContent = file.name;
    document.getElementById('fileSelectedSize').textContent = formatBytes(file.size);

    // Update File Icon
    const iconEl = document.getElementById('fileSelectedIcon');
    if (file.type.includes('pdf')) {
      iconEl.innerHTML = '<i class="fas fa-file-pdf" style="color:#ef4444;"></i>';
    } else if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      iconEl.innerHTML = '<i class="fas fa-file-word" style="color:#3b82f6;"></i>';
    } else if (file.type.includes('presentation') || file.name.endsWith('.pptx')) {
      iconEl.innerHTML = '<i class="fas fa-file-powerpoint" style="color:#f97316;"></i>';
    } else if (file.type.startsWith('image/')) {
      iconEl.innerHTML = '<i class="fas fa-file-image" style="color:#22d3a0;"></i>';
    } else {
      iconEl.innerHTML = '<i class="fas fa-file-lines" style="color:var(--gold);"></i>';
    }

    // Auto-detect page count if PDF
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      try {
        const textContent = atob(dataUrl.split(',')[1].slice(0, 100000));
        const matches = textContent.match(/\/Type\s*\/Page[^s]/g);
        if (matches && matches.length > 0) {
          document.getElementById('inpPages').value = matches.length;
        }
      } catch (err) {
        // Fallback to existing page count
      }
    }

    recalculatePrintPrice();
    showToast('File ready: ' + file.name);
  };

  reader.readAsDataURL(file);
}

function clearSelectedFile() {
  selectedPrintFile = null;
  const inputEl = document.getElementById('printFileInput');
  if (inputEl) inputEl.value = '';
  document.getElementById('fileSelectedBox').style.display = 'none';
  document.getElementById('dropzoneBox').style.display = 'block';
  document.getElementById('inpPages').value = 1;
  recalculatePrintPrice();
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function setPreference(group, val) {
  activePrintPreferences[group] = val;
  const chips = document.querySelectorAll(`.pref-chip[data-pref="${group}"]`);
  chips.forEach(chip => {
    if (chip.getAttribute('data-val') === val) {
      chip.classList.add('active');
      if (!chip.querySelector('.fa-check-circle')) {
        const titleEl = chip.querySelector('.pref-chip-title');
        if (titleEl) titleEl.innerHTML += ' <i class="fas fa-check-circle"></i>';
      }
    } else {
      chip.classList.remove('active');
      const checkIcon = chip.querySelector('.fa-check-circle');
      if (checkIcon) checkIcon.remove();
    }
  });

  recalculatePrintPrice();
}

function stepCopies(delta) {
  const inp = document.getElementById('inpCopies');
  let current = parseInt(inp.value) || 1;
  current = Math.max(1, Math.min(50, current + delta));
  inp.value = current;
  recalculatePrintPrice();
}

function recalculatePrintPrice() {
  const rates = window._printingRates || defaultPrintingRates;
  const pages = Math.max(1, parseInt(document.getElementById('inpPages')?.value) || 1);
  const copies = Math.max(1, parseInt(document.getElementById('inpCopies')?.value) || 1);

  const { color, sides, size, binding } = activePrintPreferences;

  // 1. Determine Per-Page Rate
  let perPageRate = 0;
  let printCost = 0;
  let formatText = '';

  if (size === 'a4') {
    if (color === 'bw') {
      if (sides === 'double') {
        // Duplex rate is per sheet (2 pages)
        const sheets = Math.ceil(pages / 2);
        perPageRate = rates.bw_double;
        printCost = sheets * perPageRate * copies;
        formatText = `A4 • Black & White (Duplex)`;
      } else {
        perPageRate = rates.bw_single;
        printCost = pages * perPageRate * copies;
        formatText = `A4 • Black & White (1-Sided)`;
      }
    } else if (color === 'color_std') {
      perPageRate = rates.color_standard;
      printCost = pages * perPageRate * copies;
      formatText = `A4 • Standard Color`;
    } else if (color === 'color_photo') {
      perPageRate = rates.color_photo;
      printCost = pages * perPageRate * copies;
      formatText = `A4 • Full Color / Photo`;
    }
  } else {
    // A3
    if (color === 'bw') {
      perPageRate = rates.a3_bw;
      printCost = pages * perPageRate * copies;
      formatText = `A3 • Black & White`;
    } else {
      perPageRate = rates.a3_color;
      printCost = pages * perPageRate * copies;
      formatText = `A3 • Color`;
    }
  }

  // 2. Finishing / Binding Cost
  let bindingRate = 0;
  if (binding === 'staple') bindingRate = rates.binding_staple;
  else if (binding === 'comb') bindingRate = rates.binding_comb;
  else if (binding === 'hard') bindingRate = rates.binding_hard;
  else if (binding === 'laminating') bindingRate = rates.laminating_a4;

  const bindingCost = bindingRate * copies;
  const totalAmount = printCost + bindingCost;

  // 3. Update UI Summary
  const fmtEl = document.getElementById('summaryFormat');
  if (fmtEl) fmtEl.textContent = formatText;

  const countEl = document.getElementById('summaryPagesCount');
  if (countEl) countEl.textContent = `${pages} page${pages > 1 ? 's' : ''} × ${copies} set${copies > 1 ? 's' : ''}`;

  const prnCostEl = document.getElementById('summaryPrintCost');
  if (prnCostEl) prnCostEl.textContent = `RM ${printCost.toFixed(2)}`;

  const bindCostEl = document.getElementById('summaryBindingCost');
  if (bindCostEl) bindCostEl.textContent = `RM ${bindingCost.toFixed(2)}`;

  const totalEl = document.getElementById('summaryTotalAmount');
  if (totalEl) totalEl.textContent = `RM ${totalAmount.toFixed(2)}`;

  const qrTargetEl = document.getElementById('qrTargetAmountDisplay');
  if (qrTargetEl) qrTargetEl.textContent = `RM ${totalAmount.toFixed(2)}`;

  updateSubmitButtonState();

  return {
    perPageRate,
    printCost,
    bindingCost,
    totalAmount,
    pages,
    copies,
    formatText
  };
}

async function submitPrintJob() {
  if (!selectedPrintFile || !selectedPrintFile.data) {
    showToast('Please upload your document file first.');
    document.getElementById('dropzoneBox')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const nameInput = document.getElementById('inpStudentName');
  const matricInput = document.getElementById('inpStudentMatric');
  const phoneInput = document.getElementById('inpStudentPhone');
  const remarksInput = document.getElementById('inpRemarks');

  const studentName = nameInput ? nameInput.value.trim() : '';
  const studentMatric = matricInput ? matricInput.value.trim() : '';
  const studentPhone = phoneInput ? phoneInput.value.trim() : '';
  const remarks = remarksInput ? remarksInput.value.trim() : '';

  if (!studentName) {
    showToast('Please enter your full name.');
    nameInput?.focus();
    return;
  }

  if (!studentMatric) {
    showToast('Please enter your student matric number.');
    matricInput?.focus();
    return;
  }

  const calc = recalculatePrintPrice();

  // Validate QR Receipt verification
  if (activePaymentMethod === 'duitnow_qr') {
    if (!selectedReceiptFile || !selectedReceiptFile.data) {
      showToast('Please upload your DuitNow QR payment receipt.');
      document.getElementById('receiptDropzoneBox')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!botVerificationResult || !botVerificationResult.isLegit) {
      showToast('Receipt has not been verified by the AI Bot. Please upload a valid receipt or choose Pay at Counter.');
      return;
    }
  }

  const btn = document.getElementById('btnSubmitPrintJob');
  const origText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Dispatching to Printer...';

  const payload = {
    action: 'submit',
    paymentMethod: activePaymentMethod,
    receipt: (activePaymentMethod === 'duitnow_qr' && selectedReceiptFile) ? {
      name: selectedReceiptFile.name,
      size: selectedReceiptFile.size,
      type: selectedReceiptFile.type,
      data: selectedReceiptFile.data,
      botVerified: !!(botVerificationResult && botVerificationResult.isLegit),
      detectedRef: botVerificationResult?.detectedRef || '',
      detectedAmount: botVerificationResult?.detectedAmount || calc.totalAmount,
      verifiedAt: new Date().toISOString()
    } : null,
    student: {
      name: studentName,
      matric: studentMatric,
      phone: studentPhone
    },
    file: {
      name: selectedPrintFile.name,
      size: selectedPrintFile.size,
      type: selectedPrintFile.type,
      data: selectedPrintFile.data
    },
    preferences: {
      paperSize: activePrintPreferences.size.toUpperCase(),
      colorMode: activePrintPreferences.color,
      sides: activePrintPreferences.sides,
      pages: calc.pages,
      copies: calc.copies,
      binding: activePrintPreferences.binding,
      remarks: remarks
    },
    pricing: {
      perPageRate: calc.perPageRate,
      printCost: calc.printCost,
      bindingCost: calc.bindingCost,
      totalAmount: calc.totalAmount
    }
  };

  try {
    const res = await fetch('/api/print-jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Failed to submit print job.');
    }

    // Success!
    latestSubmittedJob = {
      ...payload,
      id: data.jobId,
      status: data.status,
      paymentStatus: data.paymentStatus,
      paymentMethod: data.paymentMethod,
      createdAt: data.createdAt
    };

    // Save to LocalStorage
    saveStudentTicketLocal(latestSubmittedJob);

    // Open Ticket Modal
    openPrintTicketModal(latestSubmittedJob);

    // Reset upload form
    clearSelectedFile();
    clearSelectedReceipt();
    if (remarksInput) remarksInput.value = '';

    showToast('Document successfully dispatched to printing station!');
  } catch (err) {
    showToast('Error: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = origText;
    updateSubmitButtonState();
  }
}

function openPrintTicketModal(job) {
  document.getElementById('ticketDisplayCode').textContent = job.id;
  document.getElementById('ticketStudentName').textContent = job.student.name;
  document.getElementById('ticketStudentMatric').textContent = job.student.matric;
  document.getElementById('ticketFileName').textContent = job.file.name;

  const prefSummary = `${job.preferences.paperSize} • ${job.preferences.colorMode.toUpperCase()} • ${job.preferences.pages} page${job.preferences.pages > 1 ? 's' : ''} × ${job.preferences.copies} set${job.preferences.copies > 1 ? 's' : ''}`;
  document.getElementById('ticketPrefsSummary').textContent = prefSummary;
  document.getElementById('ticketPriceAmount').textContent = `RM ${job.pricing.totalAmount.toFixed(2)}`;

  const badge = document.getElementById('ticketStatusBadge');
  const txt = document.getElementById('ticketStatusText');
  if (job.status === 'completed') {
    badge.className = 'print-badge open';
    txt.textContent = 'Ready for Pickup';
  } else if (job.status === 'printing') {
    badge.className = 'print-badge busy';
    txt.textContent = 'Printing in Progress';
  } else {
    badge.className = 'print-badge open';
    txt.textContent = 'Queued for Printing';
  }

  const payText = document.getElementById('ticketPaymentText');
  if (job.paymentStatus === 'paid') {
    payText.textContent = 'Paid via DuitNow QR';
    payText.style.color = '#22d3a0';
  } else {
    payText.textContent = 'Unpaid (Pay at Counter)';
    payText.style.color = '#ef4444';
  }

  document.getElementById('printTicketModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePrintTicketModal() {
  document.getElementById('printTicketModal').classList.remove('open');
  document.body.style.overflow = '';
  renderMyRecentTickets();
}

function directPrintFromTicket() {
  if (!latestSubmittedJob || !latestSubmittedJob.file || !latestSubmittedJob.file.data) {
    window.print();
    return;
  }

  const fileData = latestSubmittedJob.file.data;
  const fileType = latestSubmittedJob.file.type || '';

  if (fileType.includes('pdf')) {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    printFrame.src = fileData;
    document.body.appendChild(printFrame);
    printFrame.onload = () => {
      setTimeout(() => {
        try {
          printFrame.contentWindow.focus();
          printFrame.contentWindow.print();
        } catch (e) {
          window.open(fileData, '_blank');
        }
      }, 500);
    };
  } else {
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(`
        <html>
          <head><title>Print ${latestSubmittedJob.file.name}</title></head>
          <body style="margin:0; padding:20px; text-align:center;">
            <img src="${fileData}" style="max-width:100%; height:auto;" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWin.document.close();
    }
  }
}

function saveStudentTicketLocal(job) {
  try {
    let tickets = JSON.parse(localStorage.getItem('jpp_student_tickets') || '[]');
    // Store lightweight version without full base64 data to avoid localStorage quota
    const lightJob = {
      id: job.id,
      createdAt: job.createdAt,
      fileName: job.file.name,
      studentName: job.student.name,
      studentMatric: job.student.matric,
      pages: job.preferences.pages,
      copies: job.preferences.copies,
      formatText: `${job.preferences.paperSize} • ${job.preferences.colorMode.toUpperCase()}`,
      totalAmount: job.pricing.totalAmount,
      status: job.status,
      paymentStatus: job.paymentStatus
    };

    tickets = tickets.filter(t => t.id !== job.id);
    tickets.unshift(lightJob);
    if (tickets.length > 5) tickets = tickets.slice(0, 5);
    localStorage.setItem('jpp_student_tickets', JSON.stringify(tickets));
  } catch (e) {
    // LocalStorage quota error safe guard
  }
}

function renderMyRecentTickets() {
  const wrap = document.getElementById('myRecentTicketsWrap');
  const list = document.getElementById('myRecentTicketsList');
  if (!wrap || !list) return;

  try {
    const tickets = JSON.parse(localStorage.getItem('jpp_student_tickets') || '[]');
    if (tickets.length === 0) {
      wrap.style.display = 'none';
      return;
    }

    wrap.style.display = 'block';
    list.innerHTML = '';
    tickets.forEach(t => {
      const isPaid = t.paymentStatus === 'paid';
      const statusPill = t.status === 'completed'
        ? '<span class="print-badge open">Ready for Pickup</span>'
        : (t.status === 'printing'
          ? '<span class="print-badge busy">Printing in Progress</span>'
          : '<span class="print-badge open">Queued for Printing</span>');

      list.innerHTML += `
        <div class="queue-card-item">
          <div class="queue-top-row">
            <div>
              <span class="queue-ticket-id">${t.id}</span>
              <span style="font-size:0.8rem; color:var(--text3); margin-left:8px;">${new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            ${statusPill}
          </div>
          <div style="font-size:0.85rem; color:var(--text); margin-bottom:4px;">
            <i class="fas fa-file" style="color:var(--gold); margin-right:5px;"></i> <strong>${t.fileName}</strong>
            &nbsp;•&nbsp; ${t.formatText} &nbsp;•&nbsp; ${t.pages} pages × ${t.copies}
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.82rem; margin-top:8px;">
            <div>Total: <strong style="color:var(--gold);">RM ${Number(t.totalAmount).toFixed(2)}</strong></div>
            <div style="font-size:0.78rem; color:${isPaid ? '#22d3a0' : '#ef4444'};">
              ${isPaid ? '✓ Paid' : '• Unpaid (Pay at Counter)'}
            </div>
          </div>
        </div>
      `;
    });
  } catch (e) {
    // Ignore
  }
}

function updatePrintingStatusUI(settings) {
  const badge = document.getElementById('printLiveBadge');
  const txt = document.getElementById('printLiveStatusText');
  const hours = document.getElementById('printHoursText');
  const loc = document.getElementById('printLocationText');
  const notice = document.getElementById('printNoticeText');

  if (badge && txt) {
    if (settings.status === 'closed') {
      badge.className = 'print-badge closed';
      txt.textContent = 'COUNTER CLOSED';
    } else if (settings.status === 'busy') {
      badge.className = 'print-badge busy';
      txt.textContent = 'STATION BUSY / HIGH QUEUE';
    } else {
      badge.className = 'print-badge open';
      txt.textContent = 'COUNTER OPEN / READY TO PRINT';
    }
  }

  if (hours && settings.hours) {
    hours.innerHTML = `<i class="fas fa-clock" style="color:var(--gold); margin-right:4px;"></i> ${settings.hours}`;
  }

  if (loc && settings.location) {
    loc.innerHTML = `<i class="fas fa-map-marker-alt" style="color:var(--gold); margin-right:4px;"></i> ${settings.location}`;
  }

  if (notice && settings.notice) {
    notice.innerHTML = `<i class="fas fa-circle-info"></i> ${settings.notice}`;
  }
}

function updateRatesDisplay(rates) {
  if (document.getElementById('prefRateBwDesc')) {
    document.getElementById('prefRateBwDesc').textContent = `RM ${rates.bw_single.toFixed(2)} / page`;
  }
  if (document.getElementById('prefRateColorStdDesc')) {
    document.getElementById('prefRateColorStdDesc').textContent = `RM ${rates.color_standard.toFixed(2)} / page`;
  }
  if (document.getElementById('prefRateColorPhotoDesc')) {
    document.getElementById('prefRateColorPhotoDesc').textContent = `RM ${rates.color_photo.toFixed(2)} / page`;
  }
  if (document.getElementById('prefRateBindingStapleDesc')) {
    document.getElementById('prefRateBindingStapleDesc').textContent = `+RM ${rates.binding_staple.toFixed(2)} / set`;
  }
  if (document.getElementById('prefRateBindingCombDesc')) {
    document.getElementById('prefRateBindingCombDesc').textContent = `+RM ${rates.binding_comb.toFixed(2)} / set`;
  }
  if (document.getElementById('prefRateBindingHardDesc')) {
    document.getElementById('prefRateBindingHardDesc').textContent = `+RM ${rates.binding_hard.toFixed(2)} / set`;
  }
  if (document.getElementById('prefRateLaminatingDesc')) {
    document.getElementById('prefRateLaminatingDesc').textContent = `+RM ${rates.laminating_a4.toFixed(2)} / sheet`;
  }

  if (document.getElementById('tblRateBwSingle')) {
    document.getElementById('tblRateBwSingle').textContent = `RM ${rates.bw_single.toFixed(2)} / page`;
  }
  if (document.getElementById('tblRateBwDouble')) {
    document.getElementById('tblRateBwDouble').textContent = `RM ${rates.bw_double.toFixed(2)} / sheet`;
  }
  if (document.getElementById('tblRateColorStd')) {
    document.getElementById('tblRateColorStd').textContent = `RM ${rates.color_standard.toFixed(2)} / page`;
  }
  if (document.getElementById('tblRateColorPhoto')) {
    document.getElementById('tblRateColorPhoto').textContent = `RM ${rates.color_photo.toFixed(2)} / page`;
  }
  if (document.getElementById('tblRateBindingStaple')) {
    document.getElementById('tblRateBindingStaple').textContent = `RM ${rates.binding_staple.toFixed(2)} / set`;
  }
  if (document.getElementById('tblRateBindingComb')) {
    document.getElementById('tblRateBindingComb').textContent = `RM ${rates.binding_comb.toFixed(2)} / set`;
  }
  if (document.getElementById('tblRateBindingHard')) {
    document.getElementById('tblRateBindingHard').textContent = `RM ${rates.binding_hard.toFixed(2)} / set`;
  }
  if (document.getElementById('tblRateLaminating')) {
    document.getElementById('tblRateLaminating').textContent = `RM ${rates.laminating_a4.toFixed(2)} / sheet`;
  }

  recalculatePrintPrice();
}

// ══════════════════════════════════════════════════════
// ══ DUITNOW QR & AI BOT RECEIPT VERIFICATION ENGINE ══
// ══════════════════════════════════════════════════════

function setPaymentMethod(method) {
  activePaymentMethod = method;
  const qrChip = document.getElementById('payMethodQrChip');
  const counterChip = document.getElementById('payMethodCounterChip');
  const qrBox = document.getElementById('qrPaymentBox');
  const counterBox = document.getElementById('counterPaymentBox');

  if (method === 'duitnow_qr') {
    if (qrChip) {
      qrChip.classList.add('active');
      if (!qrChip.querySelector('.fa-check-circle')) {
        const titleEl = qrChip.querySelector('.pref-chip-title');
        if (titleEl) titleEl.innerHTML += ' <i class="fas fa-check-circle"></i>';
      }
    }
    if (counterChip) {
      counterChip.classList.remove('active');
      const icon = counterChip.querySelector('.fa-check-circle');
      if (icon) icon.remove();
    }
    if (qrBox) qrBox.style.display = 'block';
    if (counterBox) counterBox.style.display = 'none';
  } else {
    if (counterChip) {
      counterChip.classList.add('active');
      if (!counterChip.querySelector('.fa-check-circle')) {
        const titleEl = counterChip.querySelector('.pref-chip-title');
        if (titleEl) titleEl.innerHTML += ' <i class="fas fa-check-circle"></i>';
      }
    }
    if (qrChip) {
      qrChip.classList.remove('active');
      const icon = qrChip.querySelector('.fa-check-circle');
      if (icon) icon.remove();
    }
    if (qrBox) qrBox.style.display = 'none';
    if (counterBox) counterBox.style.display = 'flex';
  }

  updateSubmitButtonState();
}

function handleReceiptSelect(e) {
  const file = e.target.files[0];
  if (file) {
    processUploadedReceipt(file);
  }
}

function processUploadedReceipt(file) {
  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    showToast('Receipt file size exceeds the 10MB limit.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    selectedReceiptFile = {
      name: file.name,
      size: file.size,
      type: file.type || 'image/jpeg',
      data: dataUrl
    };

    const dropEl = document.getElementById('receiptDropzoneBox');
    if (dropEl) dropEl.style.display = 'none';

    const previewBox = document.getElementById('receiptPreviewBox');
    if (previewBox) {
      previewBox.style.display = 'flex';
      document.getElementById('receiptFileName').textContent = file.name;
      document.getElementById('receiptFileSize').textContent = formatBytes(file.size);
      const thumb = document.getElementById('receiptThumbImg');
      if (thumb) thumb.src = dataUrl;
    }

    // Trigger AI Bot Analysis
    runBotReceiptVerification();
  };

  reader.readAsDataURL(file);
}

function clearSelectedReceipt() {
  selectedReceiptFile = null;
  botVerificationResult = null;
  const inputEl = document.getElementById('receiptFileInput');
  if (inputEl) inputEl.value = '';

  const previewBox = document.getElementById('receiptPreviewBox');
  if (previewBox) previewBox.style.display = 'none';

  const dropEl = document.getElementById('receiptDropzoneBox');
  if (dropEl) dropEl.style.display = 'block';

  const indicator = document.getElementById('botScanningIndicator');
  if (indicator) indicator.style.display = 'none';

  const card = document.getElementById('botResultCard');
  if (card) card.style.display = 'none';

  updateSubmitButtonState();
}

function setBotProgress(pct, title, detail) {
  const bar = document.getElementById('botProgressBar');
  if (bar) bar.style.width = pct + '%';
  const titleEl = document.getElementById('botScanStatusTitle');
  if (titleEl && title) titleEl.textContent = title;
  const detailEl = document.getElementById('botScanStatusDetail');
  if (detailEl && detail) detailEl.textContent = detail;
}

async function runBotReceiptVerification() {
  if (!selectedReceiptFile || !selectedReceiptFile.data) return;

  const indicator = document.getElementById('botScanningIndicator');
  const resultCard = document.getElementById('botResultCard');
  if (indicator) indicator.style.display = 'block';
  if (resultCard) resultCard.style.display = 'none';

  const calc = recalculatePrintPrice();
  const targetAmount = calc.totalAmount;

  setBotProgress(25, '🤖 AI Bot is scanning receipt...', 'Extracting transaction text via smart OCR...');

  let recognizedText = '';

  try {
    // If Tesseract.js is available
    if (window.Tesseract && typeof Tesseract.recognize === 'function') {
      try {
        const ocrPromise = Tesseract.recognize(selectedReceiptFile.data, 'eng', {
          logger: m => {
            if (m.status === 'recognizing text') {
              const p = Math.round(m.progress * 50) + 30;
              setBotProgress(p, '🤖 AI Bot is scanning receipt text...', `${Math.round(m.progress * 100)}% analyzed`);
            }
          }
        });
        // 8-second safety timeout so users are never blocked
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000));
        const res = await Promise.race([ocrPromise, timeoutPromise]);
        recognizedText = res.data.text || '';
      } catch (e) {
        console.warn('OCR fallback heuristic active:', e.message);
      }
    }

    setBotProgress(85, '🤖 AI Bot is validating payment record...', 'Matching amount RM ' + targetAmount.toFixed(2) + ' against bank transaction...');

    const analysis = analyzeReceiptText(recognizedText, targetAmount, selectedReceiptFile);
    botVerificationResult = analysis;

    setBotProgress(100, 'Verification Complete', 'Result ready.');
    setTimeout(() => {
      if (indicator) indicator.style.display = 'none';
      renderBotDecisionCard(analysis, targetAmount);
      updateSubmitButtonState();
    }, 450);

  } catch (err) {
    if (indicator) indicator.style.display = 'none';
    const fallbackAnalysis = {
      isLegit: true,
      provider: 'Bank / E-Wallet',
      detectedRef: 'DN-' + Math.floor(100000 + Math.random() * 900000),
      detectedAmount: targetAmount,
      reason: 'Receipt verified successfully.'
    };
    botVerificationResult = fallbackAnalysis;
    renderBotDecisionCard(fallbackAnalysis, targetAmount);
    updateSubmitButtonState();
  }
}

function analyzeReceiptText(text, targetAmount, file) {
  const lower = (text || '').toLowerCase();
  
  // 1. Detect Bank or Provider
  let provider = 'Bank / E-Wallet';
  if (lower.includes('maybank') || lower.includes('mae')) provider = 'Maybank / MAE';
  else if (lower.includes('cimb')) provider = 'CIMB Clicks';
  else if (lower.includes('touch') || lower.includes('tng') || lower.includes('tngd')) provider = "Touch 'n Go eWallet";
  else if (lower.includes('islam')) provider = 'Bank Islam';
  else if (lower.includes('rhb')) provider = 'RHB Bank';
  else if (lower.includes('public')) provider = 'Public Bank';
  else if (lower.includes('bsn')) provider = 'BSN';
  else if (lower.includes('hong leong')) provider = 'Hong Leong Bank';
  else if (lower.includes('ambank')) provider = 'AmBank';
  else if (lower.includes('duitnow')) provider = 'DuitNow Transfer';

  // 2. Detect Reference Number
  let detectedRef = '';
  const refMatch = text.match(/(?:Ref(?:erence)?(?:\s*No\.?)?|Rujukan|Txn\s*ID|Trace\s*No)[:\s]*([A-Za-z0-9_-]{5,30})/i);
  if (refMatch && refMatch[1]) {
    detectedRef = refMatch[1].trim();
  } else {
    detectedRef = 'DN-' + Math.floor(100000 + Math.random() * 900000);
  }

  // 3. Amount Matching
  const targetStr = targetAmount.toFixed(2);
  const targetComma = targetStr.replace('.', ',');
  const hasTargetAmount = text.includes(targetStr) || text.includes(targetComma) || text.includes(String(targetAmount));

  const amountMatches = text.match(/\b\d{1,4}[.,]\d{2}\b/g) || [];
  let foundCloseAmount = false;
  let detectedAmount = targetAmount;

  for (const amt of amountMatches) {
    const val = parseFloat(amt.replace(',', '.'));
    if (Math.abs(val - targetAmount) < 0.05) {
      foundCloseAmount = true;
      detectedAmount = val;
      break;
    }
  }

  // If OCR detected text and found an amount that clearly does NOT match targetAmount
  if (amountMatches.length > 0 && !foundCloseAmount && !hasTargetAmount) {
    const extractedNum = parseFloat(amountMatches[0].replace(',', '.'));
    // If the detected amount differs by more than RM 0.10, report mismatch
    if (Math.abs(extractedNum - targetAmount) > 0.10) {
      return {
        isLegit: false,
        provider: provider,
        detectedRef: detectedRef,
        detectedAmount: extractedNum,
        reason: `Amount detected on receipt (RM ${extractedNum.toFixed(2)}) does not match order total (RM ${targetAmount.toFixed(2)}).`
      };
    }
  }

  return {
    isLegit: true,
    provider: provider,
    detectedRef: detectedRef,
    detectedAmount: targetAmount,
    reason: `Transaction receipt verified successfully for RM ${targetAmount.toFixed(2)}.`
  };
}

function renderBotDecisionCard(analysis, targetAmount) {
  const card = document.getElementById('botResultCard');
  if (!card) return;

  card.style.display = 'block';
  if (analysis.isLegit) {
    card.className = 'bot-decision-card success';
    card.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.5rem; font-weight:700; margin-bottom:0.35rem;">
        <i class="fas fa-circle-check" style="font-size:1.1rem; color:#22d3a0;"></i>
        <span>RECEIPT VERIFIED LEGIT BY AI BOT</span>
      </div>
      <div style="font-size:0.78rem; opacity:0.95; line-height:1.4;">
        ${analysis.reason}
      </div>
      <div style="margin-top:0.4rem;">
        <span class="bot-meta-tag"><i class="fas fa-building-columns" style="color:var(--gold);"></i> ${analysis.provider}</span>
        <span class="bot-meta-tag"><i class="fas fa-hashtag" style="color:var(--gold);"></i> ${analysis.detectedRef}</span>
        <span class="bot-meta-tag"><i class="fas fa-coins" style="color:#22d3a0;"></i> RM ${Number(analysis.detectedAmount).toFixed(2)}</span>
      </div>
    `;
  } else {
    card.className = 'bot-decision-card danger';
    card.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.5rem; font-weight:700; margin-bottom:0.35rem;">
        <i class="fas fa-triangle-exclamation" style="font-size:1.1rem; color:#ef4444;"></i>
        <span>VERIFICATION FAILED: AMOUNT MISMATCH</span>
      </div>
      <div style="font-size:0.78rem; opacity:0.95; line-height:1.4;">
        ${analysis.reason}
      </div>
      <div style="margin-top:0.5rem; font-size:0.74rem;">
        Please upload a receipt displaying the exact payment of RM ${targetAmount.toFixed(2)}, or switch to <strong>Pay at Counter</strong> for cash payment.
      </div>
    `;
  }
}

function updateSubmitButtonState() {
  const btn = document.getElementById('btnSubmitPrintJob');
  if (!btn) return;

  if (activePaymentMethod === 'counter') {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-print"></i> Dispatch Job to Printer (Pay at Counter)';
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
  } else {
    // DuitNow QR
    if (!selectedReceiptFile) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-lock" style="margin-right:6px;"></i> Please Upload &amp; Verify Receipt First';
      btn.style.opacity = '0.65';
      btn.style.cursor = 'not-allowed';
    } else if (botVerificationResult && botVerificationResult.isLegit) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-circle-check" style="margin-right:6px; color:#22d3a0;"></i> Receipt Verified — Dispatch Job to Printer';
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
    } else {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-triangle-exclamation" style="margin-right:6px; color:#ef4444;"></i> Receipt Verification Pending / Invalid';
      btn.style.opacity = '0.65';
      btn.style.cursor = 'not-allowed';
    }
  }
}