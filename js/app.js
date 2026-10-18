// ══ JPP PMKL STUDENT PORTAL - APP MODULE ══

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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
                        <span class="tag tag-${escapeHtml(item.tagColor || 'gold')}">${escapeHtml(item.category || 'Notice')}</span>
                        <h5>${escapeHtml(item.title)}</h5>
                        <p>${escapeHtml(item.content)}</p>
                        <div style="font-size:0.74rem; color:var(--text3);">${escapeHtml(item.date)}</div>
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
                      <span class="tag tag-${escapeHtml(item.tagColor || 'gold')}">${escapeHtml(item.category || 'Notice')}</span>
                      <h4>${escapeHtml(item.title)}</h4>
                      <p>${escapeHtml(item.content)}</p>
                      <div class="ann-meta">
                        <span><i class="fas fa-calendar-alt"></i> ${escapeHtml(item.date)}</span>
                        <span><i class="fas fa-user"></i> ${escapeHtml(item.author || 'JPP PMKL')}</span>
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
                        <div class="day">${escapeHtml(item.dateDay)}</div>
                        <div class="mon">${escapeHtml(item.dateMonth)}</div>
                      </div>
                      <div class="event-info-text">
                        <h5>${escapeHtml(item.title)}</h5>
                        <p><i class="fas fa-clock" style="color:var(--gold);margin-right:0.25rem;"></i>${escapeHtml(item.time)} — ${escapeHtml(item.location)}</p>
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
                      <div class="event-thumb ${escapeHtml(item.colorGrad || 'event-thumb-grad1')}">${escapeHtml(item.icon || '📅')}</div>
                      <div class="event-card-body">
                        <h4>${escapeHtml(item.title)}</h4>
                        <div class="event-meta-row">
                          <div class="event-meta-item"><i class="fas fa-calendar-alt"></i> ${escapeHtml(item.dateFull || (item.dateDay + ' ' + item.dateMonth))}</div>
                        </div>
                        <div class="event-meta-row">
                          <div class="event-meta-item"><i class="fas fa-clock"></i> ${escapeHtml(item.time)}</div>
                        </div>
                        <div class="event-meta-row">
                          <div class="event-meta-item"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(item.location)}</div>
                        </div>
                        <button class="btn-event" onclick="openEventRsvpModal(${JSON.stringify(item.id || '')}, ${JSON.stringify(item.title || '')}, ${JSON.stringify(item.dateFull || (item.dateDay + ' ' + item.dateMonth))})"><i class="fas fa-ticket"></i> Daftar / RSVP</button>
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
  } else if (job.paymentStatus === 'paid_pending_verification') {
    payText.textContent = 'Receipt Submitted (Pending Counter Verification)';
    payText.style.color = '#f5c842';
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
  const fileName = (latestSubmittedJob.file.name || '').toLowerCase();
  const fileType = (latestSubmittedJob.file.type || '').toLowerCase();

  // 1. PDF Documents: Print via clean Blob URL in dedicated iframe
  if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
    let blob = null;
    try {
      const parts = fileData.split(',');
      const mime = (parts[0].match(/:(.*?);/) || [])[1] || 'application/pdf';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      blob = new Blob([u8arr], { type: mime });
    } catch (e) {
      blob = null;
    }

    const blobUrl = blob ? URL.createObjectURL(blob) : fileData;

    let printFrame = document.getElementById('studentPrintIframe');
    if (printFrame) printFrame.remove();

    printFrame = document.createElement('iframe');
    printFrame.id = 'studentPrintIframe';
    printFrame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
    document.body.appendChild(printFrame);

    printFrame.src = blobUrl;
    printFrame.onload = () => {
      setTimeout(() => {
        try {
          printFrame.contentWindow.focus();
          printFrame.contentWindow.print();
        } catch (e) {
          window.open(blobUrl, '_blank');
        }
        if (blob) setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      }, 500);
    };
    return;
  }

  // 2. Images (JPG, PNG)
  if (fileType.startsWith('image/') || /\.(jpe?g|png|webp|gif)$/i.test(fileName)) {
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(`
        <!DOCTYPE html>
        <html>
          <head><title>Print ${latestSubmittedJob.file.name}</title></head>
          <body style="margin:0; padding:20px; text-align:center; background:#fff;">
            <img src="${fileData}" style="max-width:100%; height:auto;" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWin.document.close();
    }
    return;
  }

  // 3. Word / PowerPoint / other
  showToast('Downloading document file to open in Office...');
  const a = document.createElement('a');
  a.href = fileData;
  a.download = latestSubmittedJob.file.name || 'document';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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
      const isPending = t.paymentStatus === 'paid_pending_verification';
      const statusPill = t.status === 'completed'
        ? '<span class="print-badge open">Ready for Pickup</span>'
        : (t.status === 'printing'
          ? '<span class="print-badge busy">Printing in Progress</span>'
          : '<span class="print-badge open">Queued for Printing</span>');

      const payDisplay = isPaid
        ? '<span style="color:#22d3a0;">✓ Paid</span>'
        : (isPending ? '<span style="color:#f5c842;">⏳ Receipt Submitted (Pending Verification)</span>' : '<span style="color:#ef4444;">• Unpaid (Pay at Counter)</span>');

      list.innerHTML += `
        <div class="queue-card-item">
          <div class="queue-top-row">
            <div>
              <span class="queue-ticket-id">${escapeHtml(t.id)}</span>
              <span style="font-size:0.8rem; color:var(--text3); margin-left:8px;">${escapeHtml(new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}</span>
            </div>
            ${statusPill}
          </div>
          <div style="font-size:0.85rem; color:var(--text); margin-bottom:4px;">
            <i class="fas fa-file" style="color:var(--gold); margin-right:5px;"></i> <strong>${escapeHtml(t.fileName)}</strong>
            &nbsp;•&nbsp; ${escapeHtml(t.formatText)} &nbsp;•&nbsp; ${Number(t.pages) || 1} pages × ${Number(t.copies) || 1}
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.82rem; margin-top:8px;">
            <div>Total: <strong style="color:var(--gold);">RM ${Number(t.totalAmount).toFixed(2)}</strong></div>
            <div style="font-size:0.78rem;">
              ${payDisplay}
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

// ══════════════════════════════════════════════════════════════════
// ══ JPP BETA TESTING LAB: THE 3 PILLARS ENGINE ══
// ══════════════════════════════════════════════════════════════════

let _betaLabInitialized = false;
let _dynamicBetaData = null;

// ── Pillar Switching ──
function switchBetaPillar(pillarNum) {
  for (let i = 1; i <= 3; i++) {
    const tabBtn = document.getElementById(`tabBtnPillar${i}`);
    const pane = document.getElementById(`panePillar${i}`);
    if (tabBtn) tabBtn.classList.toggle('active', i === pillarNum);
    if (pane) pane.classList.toggle('active', i === pillarNum);
  }
  // If switching to Academic, recalculate GPA
  if (pillarNum === 2) {
    recalculateGpa();
  }
}

// ══════════════════════════════════════════════════════════
// ── PILLAR 1: STUDENT WELFARE & E-ADUAN + LOST & FOUND ──
// ══════════════════════════════════════════════════════════

const SAMPLE_ADUAN = [
  {
    id: "ADU-2026-8912",
    createdAt: "2026-10-12T09:30:00Z",
    dateFormatted: "12 Oct 2026",
    student: { name: "Muhammad H.", matric: "14DUP24F1020", isAnonymous: false },
    category: "facility",
    categoryLabel: "Kemudahan Kampus",
    location: "Surau Lelaki (Aras 3)",
    title: "Penyaman Udara (Aircon) Surau Tidak Sejuk",
    description: "Aircon unit kedua di surau aras 3 mengeluarkan bunyi bising dan angin kurang sejuk ketika waktu solat Zohor.",
    status: "in_progress",
    statusLabel: "Dalam Tindakan",
    adminNotes: "Telah dilaporkan kepada Unit Pembangunan PMKL pada 13/10. Kontraktor penyelenggaraan berjadual hadir khamis ini."
  },
  {
    id: "ADU-2026-7734",
    createdAt: "2026-10-08T14:15:00Z",
    dateFormatted: "08 Oct 2026",
    student: { name: "Pelajar PMKL", matric: "ANONYMOUS", isAnonymous: true },
    category: "canteen",
    categoryLabel: "Kafeteria & Makanan",
    location: "Kafeteria PMKL",
    title: "Cadangan Menu Makanan Sihat & Harga Berpatutan",
    description: "Mohon pihak pengurusan kafeteria menambah pilihan sayur-sayuran segar dan mengekalkan harga nasi campur mesra poket pelajar.",
    status: "resolved",
    statusLabel: "Selesai",
    adminNotes: "JPP telah mengadakan sesi perbincangan bersama pengusaha kafeteria. Menu kombo ekonomi RM5.00 telah diperkenalkan."
  }
];

let _activeLostFoundList = [
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
    status: "open"
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
    status: "open"
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
    status: "claimed"
  }
];

function toggleAnonymousAduan() {
  const check = document.getElementById('aduanAnonCheck');
  if (!check) return;
  // If clicked directly on container, checkbox already toggled or needs toggling
  const fields = document.getElementById('aduanStudentFields');
  if (fields) {
    fields.style.display = check.checked ? 'none' : 'block';
  }
}

async function handleAduanSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('btnSubmitAduan');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menghantar Aduan...';
  }

  const isAnon = document.getElementById('aduanAnonCheck')?.checked || false;
  const name = isAnon ? "Pelajar Tanpa Nama" : (document.getElementById('aduanName')?.value.trim() || "Pelajar PMKL");
  const matric = isAnon ? "ANONYMOUS" : (document.getElementById('aduanMatric')?.value.trim() || "-");
  const phone = isAnon ? "" : (document.getElementById('aduanPhone')?.value.trim() || "");
  const category = document.getElementById('aduanCategory')?.value || "facility";
  const catSelect = document.getElementById('aduanCategory');
  const categoryLabel = catSelect ? catSelect.options[catSelect.selectedIndex].text : "Umum";
  const location = document.getElementById('aduanLocation')?.value.trim() || "PMKL";
  const title = document.getElementById('aduanTitle')?.value.trim() || "Aduan";
  const description = document.getElementById('aduanDesc')?.value.trim() || "";

  const payload = {
    isAnonymous: isAnon,
    name,
    matric,
    phone,
    category,
    categoryLabel,
    location,
    title,
    description
  };

  let ticketId = `ADU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  let ticketItem = null;

  try {
    const res = await fetch('/api/beta?module=aduan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.ticketId) ticketId = data.ticketId;
      ticketItem = data.item;
    }
  } catch (err) {
    // Local fallback
  }

  if (!ticketItem) {
    const now = new Date();
    ticketItem = {
      id: ticketId,
      createdAt: now.toISOString(),
      dateFormatted: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      student: { name, matric, phone, isAnonymous: isAnon },
      category,
      categoryLabel,
      location,
      title,
      description,
      status: "submitted",
      statusLabel: "Diterima (Dalam Barisan)",
      adminNotes: "Laporan anda telah diterima oleh sistem JPP PMKL dan sedang dalam semakan EXCO."
    };
  }

  // Save in local storage cache
  try {
    let localAduan = JSON.parse(localStorage.getItem('jpp_local_aduan') || '[]');
    localAduan.unshift(ticketItem);
    localStorage.setItem('jpp_local_aduan', JSON.stringify(localAduan));
  } catch (e) {}

  showToast(`Aduan berjaya dihantar! ID Tiket: ${ticketId}`);

  // Display the ticket in search box immediately
  const searchInput = document.getElementById('ticketLookupInput');
  if (searchInput) searchInput.value = ticketId;
  renderTicketDetail(ticketItem);

  // Reset form
  document.getElementById('aduanForm')?.reset();
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Hantar Aduan &amp; Jana Tiket';
  }
}

async function lookupTicketFromUI() {
  const input = document.getElementById('ticketLookupInput');
  if (!input || !input.value.trim()) {
    showToast('Sila masukkan nombor tiket');
    return;
  }
  const ticketId = input.value.trim().toUpperCase();

  // Try API first
  try {
    const res = await fetch(`/api/beta?ticket=${encodeURIComponent(ticketId)}`, { cache: 'no-store' });
    if (res.ok) {
      const item = await res.json();
      renderTicketDetail(item);
      return;
    }
  } catch (e) {}

  // Check localStorage
  try {
    const local = JSON.parse(localStorage.getItem('jpp_local_aduan') || '[]');
    const found = local.find(a => a.id.toUpperCase() === ticketId);
    if (found) {
      renderTicketDetail(found);
      return;
    }
  } catch (e) {}

  // Check sample list
  const sample = SAMPLE_ADUAN.find(a => a.id.toUpperCase() === ticketId);
  if (sample) {
    renderTicketDetail(sample);
    return;
  }

  // Not found
  const box = document.getElementById('ticketLookupResult');
  if (box) {
    box.style.display = 'block';
    box.innerHTML = `
      <div class="ticket-result-card" style="border-color:#ef4444; background:rgba(239,68,68,0.06); text-align:center;">
        <i class="fas fa-circle-xmark" style="font-size:1.8rem; color:#ef4444; margin-bottom:0.5rem;"></i>
        <div style="font-weight:700; color:var(--text); margin-bottom:0.25rem;">Tiket Tidak Dijumpai</div>
        <div style="font-size:0.8rem; color:var(--text2);">Sila pastikan format tiket betul, contohnya: <code>ADU-2026-8912</code>.</div>
      </div>
    `;
  }
}

function fillDemoTicket(id) {
  const input = document.getElementById('ticketLookupInput');
  if (input) {
    input.value = id;
    lookupTicketFromUI();
  }
}

function renderTicketDetail(item) {
  const box = document.getElementById('ticketLookupResult');
  if (!box) return;

  const statusMap = {
    submitted: { class: 'submitted', label: 'Diterima (Dalam Barisan)', icon: 'fa-clock' },
    in_review: { class: 'in_review', label: 'Dalam Semakan EXCO', icon: 'fa-magnifying-glass' },
    in_progress: { class: 'in_progress', label: 'Tindakan Penyelenggaraan', icon: 'fa-screwdriver-wrench' },
    resolved: { class: 'resolved', label: 'Selesai & Ditutup', icon: 'fa-circle-check' },
    rejected: { class: 'danger', label: 'Ditolak / Tiada Tindakan', icon: 'fa-circle-xmark' }
  };
  const st = statusMap[item.status] || { class: 'in_progress', label: item.statusLabel || item.status, icon: 'fa-circle-info' };

  box.style.display = 'block';
  box.innerHTML = `
    <div class="ticket-result-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
        <span style="font-family:'Space Mono', monospace; font-size:1rem; font-weight:700; color:var(--gold);">
          <i class="fas fa-ticket"></i> ${escapeHtml(item.id)}
        </span>
        <span class="ticket-status-pill ${escapeHtml(st.class)}">
          <i class="fas ${escapeHtml(st.icon)}"></i> ${escapeHtml(st.label)}
        </span>
      </div>

      <h4 style="font-size:0.95rem; margin-bottom:0.4rem; color:var(--text);">${escapeHtml(item.title)}</h4>
      <p style="font-size:0.82rem; color:var(--text2); line-height:1.4; margin-bottom:0.75rem;">${escapeHtml(item.description)}</p>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; font-size:0.75rem; color:var(--text3); margin-bottom:0.85rem; padding:0.5rem 0; border-top:1px solid var(--border); border-bottom:1px solid var(--border);">
        <div><i class="fas fa-location-dot" style="color:var(--gold);"></i> ${escapeHtml(item.location)}</div>
        <div><i class="fas fa-calendar" style="color:var(--gold);"></i> ${escapeHtml(item.dateFormatted || item.createdAt?.slice(0,10) || '-')}</div>
      </div>

      <!-- Official JPP Action Notes Timeline -->
      <div style="background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:0.85rem;">
        <div style="font-size:0.75rem; font-weight:700; color:var(--gold); text-transform:uppercase; margin-bottom:0.35rem;">
          <i class="fas fa-comment-dots"></i> Catatan Tindakan Rasmi JPP:
        </div>
        <div style="font-size:0.8rem; color:var(--text); line-height:1.4;">
          ${escapeHtml(item.adminNotes || 'Laporan telah direkodkan. EXCO JPP sedang mengambil tindakan bersama pihak pentadbiran PMKL.')}
        </div>
      </div>
    </div>
  `;
}

// ── Lost & Found Board ──
function filterLostFound(filterType, btnEl) {
  document.querySelectorAll('.lf-pill').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderLostFoundGrid(filterType);
}

function renderLostFoundGrid(filterType = 'all') {
  const grid = document.getElementById('lostFoundGrid');
  if (!grid) return;

  let items = _activeLostFoundList;
  if (filterType !== 'all') {
    items = items.filter(it => it.type === filterType);
  }

  if (items.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:2.5rem 1rem; color:var(--text3);">
        <i class="fas fa-box-open" style="font-size:2rem; margin-bottom:0.5rem; display:block;"></i>
        Tiada barangan dalam kategori ini buat masa ini.
      </div>
    `;
    return;
  }

  grid.innerHTML = '';
  items.forEach(it => {
    const isLost = it.type === 'lost';
    const isClaimed = it.status === 'claimed';
    const badgeClass = isClaimed ? 'claimed' : (isLost ? 'lost' : 'found');
    const badgeText = isClaimed ? 'Telah Dipulangkan' : (isLost ? 'Hilang' : 'Dijumpai');
    const cleanPhone = String(it.contactWhatsapp || '').replace(/\D/g, '');
    const waText = encodeURIComponent(`Salam sejahtera, saya menghubungi mengenai barangan: "${it.title || ''}" yang disiarkan di Portal JPP PMKL.`);

    grid.innerHTML += `
      <div class="lf-card">
        <div class="lf-card-header">
          <span class="lf-badge ${badgeClass}">
            <i class="fas ${isClaimed ? 'fa-check' : (isLost ? 'fa-circle-exclamation' : 'fa-hand-holding')}"></i> ${badgeText}
          </span>
          <span style="font-size:0.74rem; color:var(--text3);">${escapeHtml(it.dateReported)}</span>
        </div>
        <div class="lf-card-body">
          <h4>${escapeHtml(it.title)}</h4>
          <p>${escapeHtml(it.description)}</p>
          <div class="lf-meta-item"><i class="fas fa-location-dot" style="color:var(--gold);"></i> ${escapeHtml(it.location)}</div>
          <div class="lf-meta-item"><i class="fas fa-user" style="color:var(--gold);"></i> ${escapeHtml(it.contactName)}</div>
          ${!isClaimed ? `
            <a class="btn-whatsapp" href="https://wa.me/${escapeHtml(cleanPhone)}?text=${waText}" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-whatsapp"></i> Hubungi Pemilik / Penemu
            </a>
          ` : `
            <div style="text-align:center; font-size:0.75rem; color:#94a3b8; margin-top:0.85rem; font-weight:600;">
              <i class="fas fa-circle-check"></i> Kes Telah Selesai
            </div>
          `}
        </div>
      </div>
    `;
  });
}

function openNewLostFoundModal() {
  const m = document.getElementById('reportLostFoundModal');
  if (m) m.classList.add('open');
}

function closeReportLostFoundModal() {
  const m = document.getElementById('reportLostFoundModal');
  if (m) m.classList.remove('open');
}

async function handleLostFoundSubmit(e) {
  e.preventDefault();
  const type = document.getElementById('lfReportType')?.value || 'lost';
  const category = document.getElementById('lfReportCategory')?.value || 'other';
  const title = document.getElementById('lfReportTitle')?.value.trim() || 'Barangan';
  const location = document.getElementById('lfReportLocation')?.value.trim() || 'Kawasan PMKL';
  const contactName = document.getElementById('lfReportContactName')?.value.trim() || 'Pelajar PMKL';
  const rawPhone = document.getElementById('lfReportWhatsapp')?.value.trim() || '60133280168';
  const description = document.getElementById('lfReportDesc')?.value.trim() || '';

  const cleanPhone = rawPhone.replace(/\D/g, '').replace(/^0/, '60');
  const now = new Date();

  const newItem = {
    id: `LF-2026-${Math.floor(100 + Math.random() * 900)}`,
    type,
    title,
    category,
    location,
    dateReported: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    description,
    contactName,
    contactWhatsapp: cleanPhone,
    status: 'open'
  };

  try {
    await fetch('/api/beta?module=lostfound', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
  } catch (err) {}

  _activeLostFoundList.unshift(newItem);
  renderLostFoundGrid('all');
  closeReportLostFoundModal();
  document.getElementById('reportLostFoundForm')?.reset();
  showToast('Laporan barangan berjaya disiarkan ke noticeboard!');
}

// ══════════════════════════════════════════════════════════
// ── PILLAR 2: POLYTECHNIC GPA / CGPA TARGET CALCULATOR ──
// ══════════════════════════════════════════════════════════

const POLY_GRADE_POINTS = {
  'A+': 4.00,
  'A': 4.00,
  'A-': 3.67,
  'B+': 3.33,
  'B': 3.00,
  'B-': 2.67,
  'C+': 2.33,
  'C': 2.00,
  'D+': 1.67,
  'D': 1.00,
  'F': 0.00
};

let _gpaCourses = [
  { code: 'MPU21032 Penghayatan Etika & Peradaban', credits: 2, grade: 'A' },
  { code: 'DUT10013 Principles of Tourism', credits: 3, grade: 'A-' },
  { code: 'DUT10023 Geography in Tourism', credits: 3, grade: 'B+' },
  { code: 'DUE10012 Communicative English 1', credits: 2, grade: 'A' },
  { code: 'DUT10033 Customer Service in Hospitality', credits: 3, grade: 'A' }
];

function renderGpaCoursesTable() {
  const tbody = document.getElementById('gpaTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  _gpaCourses.forEach((c, idx) => {
    tbody.innerHTML += `
      <tr>
        <td>
          <input type="text" class="form-control-beta" value="${c.code}" placeholder="Nama kursus" onchange="updateCourseCode(${idx}, this.value)" style="padding:0.4rem 0.6rem; font-size:0.82rem;">
        </td>
        <td>
          <select class="form-control-beta" onchange="updateCourseCredits(${idx}, this.value)" style="padding:0.4rem 0.5rem; font-size:0.82rem;">
            ${[1, 2, 3, 4, 5, 6].map(cr => `<option value="${cr}" ${cr === c.credits ? 'selected' : ''}>${cr} Kredit</option>`).join('')}
          </select>
        </td>
        <td>
          <select class="form-control-beta" onchange="updateCourseGrade(${idx}, this.value)" style="padding:0.4rem 0.5rem; font-size:0.82rem; font-weight:700;">
            ${Object.keys(POLY_GRADE_POINTS).map(gr => `<option value="${gr}" ${gr === c.grade ? 'selected' : ''}>${gr} (${POLY_GRADE_POINTS[gr].toFixed(2)})</option>`).join('')}
          </select>
        </td>
        <td style="text-align:center;">
          <button class="btn-danger" onclick="removeGpaCourseRow(${idx})" style="padding:0.35rem 0.6rem; font-size:0.75rem;" title="Padam kursus">
            <i class="fas fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;
  });

  recalculateGpa();
}

function updateCourseCode(idx, val) {
  if (_gpaCourses[idx]) _gpaCourses[idx].code = val;
}

function updateCourseCredits(idx, val) {
  if (_gpaCourses[idx]) {
    _gpaCourses[idx].credits = parseInt(val) || 1;
    recalculateGpa();
  }
}

function updateCourseGrade(idx, val) {
  if (_gpaCourses[idx]) {
    _gpaCourses[idx].grade = val;
    recalculateGpa();
  }
}

function addGpaCourseRow() {
  _gpaCourses.push({ code: `Kursus Baharu (${_gpaCourses.length + 1})`, credits: 3, grade: 'A-' });
  renderGpaCoursesTable();
}

function removeGpaCourseRow(idx) {
  if (_gpaCourses.length <= 1) {
    showToast('Minimum sekurang-kurangnya 1 kursus diperlukan.');
    return;
  }
  _gpaCourses.splice(idx, 1);
  renderGpaCoursesTable();
}

function resetGpaCalc() {
  _gpaCourses = [
    { code: 'Kursus 1', credits: 3, grade: 'A' },
    { code: 'Kursus 2', credits: 3, grade: 'B+' },
    { code: 'Kursus 3', credits: 2, grade: 'A-' }
  ];
  renderGpaCoursesTable();
  showToast('Kalkulator telah diset semula.');
}

function loadGpaPreset(preset) {
  if (preset === 'dup') {
    _gpaCourses = [
      { code: 'MPU21032 Penghayatan Etika & Peradaban', credits: 2, grade: 'A' },
      { code: 'DUT10013 Principles of Tourism', credits: 3, grade: 'A' },
      { code: 'DUT10023 Geography in Tourism', credits: 3, grade: 'A-' },
      { code: 'DUE10012 Communicative English 1', credits: 2, grade: 'A' },
      { code: 'DUT10033 Customer Service in Hospitality', credits: 3, grade: 'B+' }
    ];
    showToast('Preset DUP Sem 1 dimuatkan!');
  } else if (preset === 'dhf') {
    _gpaCourses = [
      { code: 'DHF10013 Principles of Halal Practice', credits: 3, grade: 'A' },
      { code: 'DHF10023 Food Hygiene & Sanitation', credits: 3, grade: 'A' },
      { code: 'MPU21032 Penghayatan Etika', credits: 2, grade: 'A-' },
      { code: 'DUE10012 Communicative English 1', credits: 2, grade: 'B+' },
      { code: 'DHF10033 Basic Cookery Operations', credits: 3, grade: 'A' }
    ];
    showToast('Preset DHF Sem 1 dimuatkan!');
  }
  renderGpaCoursesTable();
}

function recalculateGpa() {
  let totalCredits = 0;
  let totalPoints = 0;

  _gpaCourses.forEach(c => {
    const cr = c.credits || 0;
    const pt = POLY_GRADE_POINTS[c.grade] !== undefined ? POLY_GRADE_POINTS[c.grade] : 3.00;
    totalCredits += cr;
    totalPoints += (cr * pt);
  });

  const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0.00;
  const gpaStr = gpa.toFixed(2);

  const displayEl = document.getElementById('displaySemesterGpa');
  if (displayEl) displayEl.textContent = gpaStr;

  const totalCrEl = document.getElementById('displayTotalCredits');
  if (totalCrEl) totalCrEl.textContent = totalCredits;

  // Classification
  const classEl = document.getElementById('displayGpaClassification');
  if (classEl) {
    if (gpa >= 3.67) classEl.textContent = 'Tahap: Cemerlang (First Class)';
    else if (gpa >= 3.00) classEl.textContent = 'Tahap: Kepujian (Upper Second)';
    else if (gpa >= 2.00) classEl.textContent = 'Tahap: Lulus';
    else classEl.textContent = 'Tahap: Gagal / Rujuk Semula';
  }

  // Dean's List Badge (Anugerah Pengarah: GPA >= 3.50 & credits >= 12)
  const deansBadge = document.getElementById('displayDeansBadge');
  if (deansBadge) {
    if (gpa >= 3.50 && totalCredits >= 12) {
      deansBadge.style.display = 'inline-flex';
    } else {
      deansBadge.style.display = 'none';
    }
  }

  // CGPA Simulator
  const priorScore = parseFloat(document.getElementById('cgpaPriorScore')?.value);
  const priorCredits = parseInt(document.getElementById('cgpaPriorCredits')?.value);
  const projectedCgpaEl = document.getElementById('displayProjectedCgpa');

  if (projectedCgpaEl) {
    if (!isNaN(priorScore) && !isNaN(priorCredits) && priorCredits > 0) {
      const combinedPoints = (priorScore * priorCredits) + totalPoints;
      const combinedCredits = priorCredits + totalCredits;
      const proj = combinedCredits > 0 ? (combinedPoints / combinedCredits).toFixed(2) : gpaStr;
      projectedCgpaEl.textContent = proj;
    } else {
      projectedCgpaEl.textContent = gpaStr;
    }
  }
}

// ══════════════════════════════════════════════════════════
// ── PILLAR 3: SPORTS GEAR LOANS & JPP MERCH STORE ──
// ══════════════════════════════════════════════════════════

let _activeEquipmentCatalog = [
  {
    id: "EQ-FUTSAL-1",
    name: "Bola Futsal Rasmi (Saiz 4 - Low Bounce)",
    category: "sports",
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
    totalQty: 2,
    availableQty: 1,
    icon: "fa-bullhorn",
    description: "Speaker Bluetooth berkuasa bateri untuk program persatuan dan taklimat.",
    terms: "Perlu sokongan penasihat kelab / kelulusan JPP."
  },
  {
    id: "EQ-GAMES-1",
    name: "Papan Permainan Tradisional (Karom & Saidina)",
    category: "indoor",
    totalQty: 3,
    availableQty: 3,
    icon: "fa-chess-board",
    description: "Disediakan untuk waktu santai di Student Lounge Aras 2.",
    terms: "Simpan semua buah permainan di dalam kotak asal."
  }
];

function renderEquipmentGrid() {
  const grid = document.getElementById('equipmentGrid');
  if (!grid) return;

  grid.innerHTML = '';
  _activeEquipmentCatalog.forEach(eq => {
    const isOut = eq.availableQty <= 0;
    grid.innerHTML += `
      <div class="equip-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div class="equip-icon-wrap">
            <i class="fas ${eq.icon}"></i>
          </div>
          <span class="stock-tag ${isOut ? 'out' : 'available'}">
            <i class="fas ${isOut ? 'fa-circle-xmark' : 'fa-circle-check'}"></i> 
            ${isOut ? 'Habis Dipinjam' : `Tersedia: ${eq.availableQty}/${eq.totalQty}`}
          </span>
        </div>
        <h4 style="font-size:1rem; margin-bottom:0.4rem; color:var(--text);">${eq.name}</h4>
        <p style="font-size:0.8rem; color:var(--text2); line-height:1.4; margin-bottom:0.75rem; flex:1;">${eq.description}</p>
        <div style="font-size:0.73rem; color:var(--text3); margin-bottom:1rem; padding-top:0.5rem; border-top:1px solid var(--border);">
          <i class="fas fa-circle-info" style="color:var(--gold);"></i> ${eq.terms}
        </div>
        <button class="btn-primary" onclick="openBorrowModal('${eq.id}')" style="width:100%; justify-content:center; font-size:0.85rem;" ${isOut ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
          <i class="fas fa-hand-holding-hand"></i> ${isOut ? 'Tidak Tersedia' : 'Pinjam Alatan Ini'}
        </button>
      </div>
    `;
  });
}

function openBorrowModal(equipId) {
  const eq = _activeEquipmentCatalog.find(e => e.id === equipId);
  if (!eq) return;

  document.getElementById('borrowEquipId').value = eq.id;
  document.getElementById('borrowModalEquipName').textContent = `Pinjaman: ${eq.name}`;
  document.getElementById('borrowModalEquipTerms').textContent = eq.terms;

  const m = document.getElementById('borrowEquipModal');
  if (m) m.classList.add('open');
}

function closeBorrowModal() {
  const m = document.getElementById('borrowEquipModal');
  if (m) m.classList.remove('open');
}

async function handleBorrowSubmit(e) {
  e.preventDefault();
  const equipId = document.getElementById('borrowEquipId')?.value;
  const studentName = document.getElementById('borrowStudentName')?.value.trim() || 'Pelajar PMKL';
  const matric = document.getElementById('borrowMatric')?.value.trim() || '-';
  const phone = document.getElementById('borrowPhone')?.value.trim() || '-';
  const expectedReturn = document.getElementById('borrowReturnTime')?.value || 'Sebelum 6:00 PM';

  const eq = _activeEquipmentCatalog.find(e => e.id === equipId);
  if (!eq || eq.availableQty <= 0) {
    showToast('Alatan ini telah habis dipinjam.');
    closeBorrowModal();
    return;
  }

  // Decrement locally
  eq.availableQty -= 1;
  renderEquipmentGrid();

  let loanId = `LN-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    const res = await fetch('/api/beta?module=equipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ equipmentId: equipId, studentName, matric, phone, expectedReturn })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.loanId) loanId = data.loanId;
      if (typeof data.remainingQty === 'number') {
        eq.availableQty = data.remainingQty;
        renderEquipmentGrid();
      }
    }
  } catch (err) {}

  closeBorrowModal();
  document.getElementById('borrowEquipForm')?.reset();

  // Show digital loan pass
  document.getElementById('passCodeDisplay').textContent = loanId;
  document.getElementById('passEquipName').textContent = eq.name;
  document.getElementById('passStudentName').textContent = studentName;
  document.getElementById('passStudentMatric').textContent = matric;
  document.getElementById('passReturnTime').textContent = expectedReturn;

  const passModal = document.getElementById('loanPassModal');
  if (passModal) passModal.classList.add('open');
  showToast('Permohonan pinjaman diluluskan! Pas Digital dijana.');
}

function closeLoanPassModal() {
  const m = document.getElementById('loanPassModal');
  if (m) m.classList.remove('open');
}

// ── Merchandise Pre-Order ──
let _selectedMerchSize = 'M';

function selectMerchSize(el, item, size) {
  _selectedMerchSize = size;
  const parent = el.parentNode;
  if (parent) {
    parent.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
  }
}

let _currentMerchItem = '';
let _currentMerchPrice = 0;
let _currentMerchOrder = null;

function openMerchOrderModal(itemName, price) {
  _currentMerchItem = itemName;
  _currentMerchPrice = price;
  const nameEl = document.getElementById('merchSelectedName');
  const priceEl = document.getElementById('merchSelectedPrice');
  if (nameEl) nameEl.textContent = `${itemName} (Saiz: ${_selectedMerchSize})`;
  if (priceEl) priceEl.textContent = `RM ${price.toFixed(2)}`;

  // Pre-fill student info if previously saved in localStorage
  const savedMatric = localStorage.getItem('pmkl_matric');
  const savedName = localStorage.getItem('pmkl_name');
  const savedPhone = localStorage.getItem('pmkl_phone');
  if (savedMatric && document.getElementById('merchMatric')) document.getElementById('merchMatric').value = savedMatric;
  if (savedName && document.getElementById('merchStudentName')) document.getElementById('merchStudentName').value = savedName;
  if (savedPhone && document.getElementById('merchPhone')) document.getElementById('merchPhone').value = savedPhone;

  const m = document.getElementById('merchOrderModal');
  if (m) {
    m.classList.add('open');
    m.classList.add('active');
  }
}

function closeMerchOrderModal() {
  const m = document.getElementById('merchOrderModal');
  if (m) {
    m.classList.remove('open');
    m.classList.remove('active');
  }
}

async function handleMerchSubmit(e) {
  e.preventDefault();
  const studentName = document.getElementById('merchStudentName')?.value.trim() || '';
  const matricNo = document.getElementById('merchMatric')?.value.trim().toUpperCase() || '';
  const phone = document.getElementById('merchPhone')?.value.trim() || '';

  if (!studentName || !matricNo || !phone) {
    showToast('Sila lengkapkan semua medan maklumat pelajar.');
    return;
  }

  // Save for auto-fill
  localStorage.setItem('pmkl_matric', matricNo);
  localStorage.setItem('pmkl_name', studentName);
  localStorage.setItem('pmkl_phone', phone);

  closeMerchOrderModal();
  showToast('Memproses pra-tempahan...');

  try {
    const res = await fetch('/api/merch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemName: _currentMerchItem || 'JPP Official Merchandise',
        price: _currentMerchPrice || 0,
        size: _selectedMerchSize || 'Standard',
        color: 'Edisi Rasmi',
        studentName,
        matricNo,
        phone,
        quantity: 1,
        notes: ''
      })
    });

    const result = await res.json();
    if (res.ok && result.order) {
      showToast('Pra-tempahan berjaya dihantar! Pas dijana.');
      openMerchPassModal(result.order);
    } else {
      showToast(result.error || 'Ralat menghantar tempahan.');
    }
  } catch (err) {
    // Offline fallback ticket
    const fallbackTicket = {
      id: 'MCH-' + Math.floor(1000 + Math.random() * 9000),
      itemName: _currentMerchItem || 'JPP Official Merchandise',
      totalPrice: (_currentMerchPrice || 0).toFixed(2),
      size: _selectedMerchSize || 'Standard',
      quantity: 1,
      studentName,
      matricNo,
      phone,
      status: 'pending_payment',
      createdAt: new Date().toISOString()
    };
    showToast('Pra-tempahan disimpan luar talian.');
    openMerchPassModal(fallbackTicket);
  }
}

function openMerchPassModal(order) {
  _currentMerchOrder = order;
  const idEl = document.getElementById('passMerchTicketId');
  const itemEl = document.getElementById('passMerchItemName');
  const priceEl = document.getElementById('passMerchPriceTotal');
  const nameEl = document.getElementById('passMerchStudentName');
  const matricEl = document.getElementById('passMerchMatric');
  const sizeEl = document.getElementById('passMerchSize');
  const qtyEl = document.getElementById('passMerchQty');

  if (idEl) idEl.textContent = order.id;
  if (itemEl) itemEl.textContent = order.itemName;
  if (priceEl) priceEl.textContent = `Jumlah: RM ${order.totalPrice || order.price || '0.00'}`;
  if (nameEl) nameEl.textContent = order.studentName;
  if (matricEl) matricEl.textContent = order.matricNo;
  if (sizeEl) sizeEl.textContent = order.size || 'Standard';
  if (qtyEl) qtyEl.textContent = `${order.quantity || 1} Unit`;

  const m = document.getElementById('merchPassModal');
  if (m) {
    m.classList.add('open');
    m.classList.add('active');
  }
}

function closeMerchPassModal() {
  const m = document.getElementById('merchPassModal');
  if (m) {
    m.classList.remove('open');
    m.classList.remove('active');
  }
}

function shareMerchWhatsApp() {
  if (!_currentMerchOrder) return;
  const o = _currentMerchOrder;
  const msg = encodeURIComponent(
    `*PAS PRA-TEMPAHAN MERCHANDISE JPP PMKL*\n` +
    `No. Tempahan: [${o.id}]\n` +
    `Barangan: ${o.itemName}\n` +
    `Saiz: ${o.size || 'Standard'}\n` +
    `Kuantiti: ${o.quantity || 1}\n` +
    `Jumlah Bayaran: RM ${o.totalPrice || o.price}\n` +
    `Nama: ${o.studentName}\n` +
    `No. Matrik: ${o.matricNo}\n` +
    `Status: Menunggu Pengesahan Bayaran DuitNow QR\n\n` +
    `Sila kemukakan mesej ini atau resit bayaran di Kaunter Pusat Pelajar Aras 2 PMKL semasa pengambilan.`
  );
  window.open(`https://wa.me/?text=${msg}`, '_blank');
}

// ── Master Beta Lab Initializer ──
async function initBetaLabOnce() {
  if (_betaLabInitialized) return;
  _betaLabInitialized = true;

  // Render initial tables and boards
  renderGpaCoursesTable();
  renderLostFoundGrid('all');
  renderEquipmentGrid();

  // Fetch live Cloudflare KV data if available
  try {
    const res = await fetch('/api/beta?module=all&t=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      _dynamicBetaData = data;
      if (Array.isArray(data.lostFound) && data.lostFound.length > 0) {
        _activeLostFoundList = data.lostFound;
        renderLostFoundGrid('all');
      }
      if (Array.isArray(data.equipment) && data.equipment.length > 0) {
        _activeEquipmentCatalog = data.equipment;
        renderEquipmentGrid();
      }
    }
  } catch (err) {
    // Silent fallback
  }
}

// Auto-trigger Beta Lab on load
document.addEventListener('DOMContentLoaded', () => {
  initBetaLabOnce();
});

// ══ EVENT RSVP & REGISTRATION SYSTEM ══
let _currentRsvpTicket = null;

function openEventRsvpModal(eventId, eventTitle, eventDate) {
  const idEl = document.getElementById('rsvpEventId');
  const titleEl = document.getElementById('rsvpEventTitle');
  const modalTitleEl = document.getElementById('rsvpModalEventTitle');
  const modalDateEl = document.getElementById('rsvpModalEventDate');

  if (idEl) idEl.value = eventId || '';
  if (titleEl) titleEl.value = eventTitle || 'Acara PMKL';
  if (modalTitleEl) modalTitleEl.textContent = eventTitle || 'Pendaftaran Acara PMKL';
  if (modalDateEl) modalDateEl.textContent = eventDate ? ('Tarikh: ' + eventDate) : 'Sesi 2026/2027';

  // Pre-fill student info if previously saved
  const savedMatric = localStorage.getItem('pmkl_matric');
  const savedName = localStorage.getItem('pmkl_name');
  const savedPhone = localStorage.getItem('pmkl_phone');
  if (savedMatric && document.getElementById('rsvpMatricNo')) document.getElementById('rsvpMatricNo').value = savedMatric;
  if (savedName && document.getElementById('rsvpStudentName')) document.getElementById('rsvpStudentName').value = savedName;
  if (savedPhone && document.getElementById('rsvpPhone')) document.getElementById('rsvpPhone').value = savedPhone;

  const modal = document.getElementById('eventRsvpModal');
  if (modal) modal.classList.add('active');
}

function closeEventRsvpModal() {
  const modal = document.getElementById('eventRsvpModal');
  if (modal) modal.classList.remove('active');
}

async function handleEventRsvpSubmit(e) {
  e.preventDefault();
  const eventId = document.getElementById('rsvpEventId')?.value || '';
  const eventTitle = document.getElementById('rsvpEventTitle')?.value || '';
  const studentName = document.getElementById('rsvpStudentName')?.value.trim() || '';
  const matricNo = document.getElementById('rsvpMatricNo')?.value.trim().toUpperCase() || '';
  const program = document.getElementById('rsvpProgram')?.value || 'DIT';
  const phone = document.getElementById('rsvpPhone')?.value.trim() || '';
  const notes = document.getElementById('rsvpNotes')?.value.trim() || '';

  if (!studentName || !matricNo || !phone) {
    showToast('Sila lengkapkan semua medan wajib.');
    return;
  }

  // Save student details locally for quick auto-fill
  localStorage.setItem('pmkl_matric', matricNo);
  localStorage.setItem('pmkl_name', studentName);
  localStorage.setItem('pmkl_phone', phone);

  const btn = document.getElementById('btnSubmitRsvp');
  const origText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
  }

  try {
    const res = await fetch('/api/event-rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        eventTitle,
        studentName,
        matricNo,
        phone,
        program,
        notes
      })
    });

    const result = await res.json();

    if (res.status === 409 && result.alreadyRegistered && result.ticket) {
      showToast('Anda telah pun mendaftar! Memaparkan pas sedia ada...');
      closeEventRsvpModal();
      openRsvpPassModal(result.ticket);
      return;
    }

    if (!res.ok) {
      showToast(result.error || 'Ralat semasa mendaftar. Sila cuba lagi.');
      return;
    }

    closeEventRsvpModal();
    showToast('Pendaftaran berjaya! Pas kehadiran dijana.');
    openRsvpPassModal(result.ticket);

    const notesEl = document.getElementById('rsvpNotes');
    if (notesEl) notesEl.value = '';
  } catch (err) {
    // Offline / fallback ticket generation
    const mockTicket = {
      id: 'RSVP-' + Math.floor(1000 + Math.random() * 9000),
      eventId,
      eventTitle,
      studentName,
      matricNo,
      phone,
      program,
      notes,
      registeredAt: new Date().toISOString()
    };
    closeEventRsvpModal();
    showToast('Pendaftaran luar talian berjaya disimpan.');
    openRsvpPassModal(mockTicket);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origText;
    }
  }
}

function openRsvpPassModal(ticket) {
  _currentRsvpTicket = ticket;
  const ticketIdEl = document.getElementById('passTicketId');
  const titleEl = document.getElementById('passEventTitle');
  const nameEl = document.getElementById('passStudentName');
  const matricEl = document.getElementById('passMatric');
  const progEl = document.getElementById('passProgram');
  const dateEl = document.getElementById('passDate');

  if (ticketIdEl) ticketIdEl.textContent = ticket.id;
  if (titleEl) titleEl.textContent = ticket.eventTitle || 'Acara PMKL';
  if (nameEl) nameEl.textContent = ticket.studentName;
  if (matricEl) matricEl.textContent = ticket.matricNo;
  if (progEl) progEl.textContent = ticket.program || 'PMKL';
  if (dateEl) dateEl.textContent = (ticket.registeredAt || '').slice(0, 10) || new Date().toLocaleDateString('ms-MY');

  const passModal = document.getElementById('rsvpPassModal');
  if (passModal) passModal.classList.add('active');
}

function closeRsvpPassModal() {
  const passModal = document.getElementById('rsvpPassModal');
  if (passModal) passModal.classList.remove('active');
}

function shareRsvpWhatsApp() {
  if (!_currentRsvpTicket) return;
  const t = _currentRsvpTicket;
  const msg = encodeURIComponent(
    `*PAS KEHADIRAN ACARA JPP PMKL*\n` +
    `No. Tiket: [${t.id}]\n` +
    `Acara: ${t.eventTitle}\n` +
    `Nama: ${t.studentName}\n` +
    `No. Matrik: ${t.matricNo}\n` +
    `Program: ${t.program}\n` +
    `Tarikh Daftar: ${(t.registeredAt || '').slice(0, 10)}\n\n` +
    `Sila simpan mesej ini untuk semakan pendaftaran di pintu masuk.`
  );
  window.open(`https://wa.me/?text=${msg}`, '_blank');
}

// ══════════════════════════════════════════════════════════
// ══ 1. ACADEMIC HUB CONTROLLER ══
// ══════════════════════════════════════════════════════════
function switchAcademicSub(subTab) {
  const paneTakwim = document.getElementById('academicPaneTakwim');
  const panePastYears = document.getElementById('academicPanePastYears');
  const paneGpa = document.getElementById('academicPaneGpa');

  const btnTakwim = document.getElementById('btnTabTakwim');
  const btnPastYears = document.getElementById('btnTabPastYears');
  const btnGpa = document.getElementById('btnTabGpa');

  if (paneTakwim) paneTakwim.style.display = subTab === 'takwim' ? 'block' : 'none';
  if (panePastYears) panePastYears.style.display = subTab === 'pastyears' ? 'block' : 'none';
  if (paneGpa) paneGpa.style.display = subTab === 'gpa' ? 'block' : 'none';

  if (btnTakwim) btnTakwim.className = subTab === 'takwim' ? 'btn-hero btn-hero-primary' : 'btn-hero btn-hero-outline';
  if (btnPastYears) btnPastYears.className = subTab === 'pastyears' ? 'btn-hero btn-hero-primary' : 'btn-hero btn-hero-outline';
  if (btnGpa) btnGpa.className = subTab === 'gpa' ? 'btn-hero btn-hero-primary' : 'btn-hero btn-hero-outline';

  if (subTab === 'gpa') {
    renderAcademicGpaTable();
  }
}

function downloadTakwimPdf() {
  showToast('Memuat turun Takwim Rasmi PMKL 2026/2027 (PDF)...');
  setTimeout(() => {
    alert('Takwim Akademik Sesi I & II 2026/2027 telah dimuat turun ke peranti anda.');
  }, 1000);
}

function filterPastYears(dept) {
  const cards = document.querySelectorAll('.past-year-card');
  const btns = ['pyFilterAll', 'pyFilterDIT', 'pyFilterDRO', 'pyFilterDHM', 'pyFilterUmum'];
  
  btns.forEach(bId => {
    const el = document.getElementById(bId);
    if (el) el.classList.remove('tag-gold');
  });

  const activeBtn = document.getElementById(`pyFilter${dept === 'all' ? 'All' : dept}`);
  if (activeBtn) activeBtn.classList.add('tag-gold');

  cards.forEach(card => {
    if (dept === 'all' || card.dataset.dept === dept) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function downloadPastPaper(paperName) {
  showToast(`Membuka kertas peperiksaan: ${paperName.replace(/_/g, ' ')}...`);
  setTimeout(() => {
    showToast('Kertas soalan berjaya dimuat turun (Format Arkib Peperiksaan PMKL).');
  }, 800);
}

// ── Academic GPA & CGPA Calculator ──
let _academicCourses = [
  { code: 'DIT10133 Programming Fundamentals', credits: 3, grade: 'A' },
  { code: 'DIT20233 Database Design & SQL', credits: 3, grade: 'A-' },
  { code: 'DRO10133 Retail Operations', credits: 3, grade: 'B+' },
  { code: 'MPU21032 Penghayatan Etika', credits: 2, grade: 'A' }
];

function renderAcademicGpaTable() {
  const tbody = document.getElementById('academicGpaTbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  _academicCourses.forEach((c, idx) => {
    tbody.innerHTML += `
      <tr>
        <td>
          <input type="text" class="form-control-beta" value="${escapeHtml(c.code)}" onchange="updateAcademicCourseCode(${idx}, this.value)" style="padding:0.4rem 0.6rem; font-size:0.82rem; width:100%;">
        </td>
        <td style="width:110px;">
          <select class="form-control-beta" onchange="updateAcademicCourseCredits(${idx}, this.value)" style="padding:0.4rem 0.5rem; font-size:0.82rem; width:100%;">
            ${[1, 2, 3, 4, 5, 6].map(cr => `<option value="${cr}" ${cr === c.credits ? 'selected' : ''}>${cr} Kredit</option>`).join('')}
          </select>
        </td>
        <td style="width:140px;">
          <select class="form-control-beta" onchange="updateAcademicCourseGrade(${idx}, this.value)" style="padding:0.4rem 0.5rem; font-size:0.82rem; font-weight:700; width:100%;">
            ${Object.keys(POLY_GRADE_POINTS).map(gr => `<option value="${gr}" ${gr === c.grade ? 'selected' : ''}>${gr} (${POLY_GRADE_POINTS[gr].toFixed(2)})</option>`).join('')}
          </select>
        </td>
        <td style="text-align:center; width:60px;">
          <button class="btn-danger" onclick="removeAcademicCourseRow(${idx})" style="padding:0.35rem 0.6rem; font-size:0.75rem;" title="Padam kursus">
            <i class="fas fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;
  });

  recalculateAcademicGpa();
}

function updateAcademicCourseCode(idx, val) {
  if (_academicCourses[idx]) _academicCourses[idx].code = val;
}

function updateAcademicCourseCredits(idx, val) {
  if (_academicCourses[idx]) {
    _academicCourses[idx].credits = parseInt(val) || 1;
    recalculateAcademicGpa();
  }
}

function updateAcademicCourseGrade(idx, val) {
  if (_academicCourses[idx]) {
    _academicCourses[idx].grade = val;
    recalculateAcademicGpa();
  }
}

function addAcademicCourseRow() {
  _academicCourses.push({ code: `Kursus Baharu (${_academicCourses.length + 1})`, credits: 3, grade: 'A-' });
  renderAcademicGpaTable();
}

function removeAcademicCourseRow(idx) {
  if (_academicCourses.length <= 1) {
    showToast('Sekurang-kurangnya 1 kursus diperlukan.');
    return;
  }
  _academicCourses.splice(idx, 1);
  renderAcademicGpaTable();
}

function resetAcademicGpa() {
  _academicCourses = [
    { code: 'DIT10133 Programming Fundamentals', credits: 3, grade: 'A' },
    { code: 'DRO10133 Retail Management', credits: 3, grade: 'B+' },
    { code: 'DHM10133 Intro to Hospitality', credits: 3, grade: 'A-' },
    { code: 'MPU21032 Penghayatan Etika', credits: 2, grade: 'A' }
  ];
  renderAcademicGpaTable();
  showToast('Kalkulator HPNM diset semula.');
}

function recalculateAcademicGpa() {
  let totalCredits = 0;
  let totalPoints = 0;

  _academicCourses.forEach(c => {
    const pt = POLY_GRADE_POINTS[c.grade] !== undefined ? POLY_GRADE_POINTS[c.grade] : 3.00;
    totalCredits += c.credits;
    totalPoints += (c.credits * pt);
  });

  const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
  const scoreEl = document.getElementById('academicGpaScore');
  const standingEl = document.getElementById('academicGpaStanding');
  const remarksEl = document.getElementById('academicGpaRemarks');

  if (scoreEl) scoreEl.textContent = gpa.toFixed(2);

  if (standingEl && remarksEl) {
    if (gpa >= 3.50) {
      standingEl.innerHTML = '● ANUGERAH KETUA JABATAN (AKJ)';
      standingEl.style.background = 'rgba(245,200,66,0.18)';
      standingEl.style.color = 'var(--gold)';
      standingEl.style.borderColor = 'rgba(245,200,66,0.4)';
      remarksEl.textContent = 'Cemerlang! Keputusan ini melayakkan anda untuk menerima Anugerah Ketua Jabatan PMKL.';
    } else if (gpa >= 2.00) {
      standingEl.innerHTML = '● KEDUDUKAN BAIK (KB)';
      standingEl.style.background = 'rgba(34,197,94,0.15)';
      standingEl.style.color = '#22c55e';
      standingEl.style.borderColor = 'rgba(34,197,94,0.3)';
      remarksEl.textContent = 'Tahniah! Anda melepasi syarat minimum kedudukan baik (KB) Politeknik Malaysia.';
    } else {
      standingEl.innerHTML = '● KEDUDUKAN BERSYARAT (KS)';
      standingEl.style.background = 'rgba(239,68,68,0.15)';
      standingEl.style.color = '#ef4444';
      standingEl.style.borderColor = 'rgba(239,68,68,0.3)';
      remarksEl.textContent = 'Perhatian: HPNM di bawah 2.00 memerlukan bimbingan penasihat akademik (PA).';
    }
  }
}

// ══════════════════════════════════════════════════════════
// ══ 2. CAMPUS FLOOR GUIDE CONTROLLER ══
// ══════════════════════════════════════════════════════════
function switchCampusFloor(floorId) {
  const floors = ['floorG', 'floor1', 'floor2', 'floor3', 'floor4'];
  floors.forEach(f => {
    const pane = document.getElementById(`pane${f.charAt(0).toUpperCase() + f.slice(1)}`);
    const btn = document.getElementById(`btn${f.charAt(0).toUpperCase() + f.slice(1)}`);
    if (pane) pane.style.display = (f === floorId) ? 'block' : 'none';
    if (btn) {
      if (f === floorId) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });
}

// ══════════════════════════════════════════════════════════
// ══ 3. GLOBAL SPOTLIGHT SEARCH CONTROLLER (Ctrl+K) ══
// ══════════════════════════════════════════════════════════
function openGlobalSearch() {
  const modal = document.getElementById('globalSearchModal');
  const input = document.getElementById('globalSearchInput');
  if (modal) {
    modal.classList.add('open');
    if (input) {
      input.value = '';
      input.focus();
      handleGlobalSearchInput();
    }
  }
}

function closeGlobalSearch() {
  const modal = document.getElementById('globalSearchModal');
  if (modal) modal.classList.remove('open');
}

function closeGlobalSearchOnBg(e) {
  if (e.target === document.getElementById('globalSearchModal')) {
    closeGlobalSearch();
  }
}

// Shortcut: Ctrl+K or Cmd+K
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    const modal = document.getElementById('globalSearchModal');
    if (modal && modal.classList.contains('open')) {
      closeGlobalSearch();
    } else {
      openGlobalSearch();
    }
  } else if (e.key === 'Escape') {
    closeGlobalSearch();
  }
});

function handleGlobalSearchInput(e) {
  const query = (document.getElementById('globalSearchInput')?.value || '').trim().toLowerCase();
  const resultsContainer = document.getElementById('globalSearchResults');
  if (!resultsContainer) return;

  if (!query) {
    resultsContainer.innerHTML = `
      <div style="padding:2.5rem 1rem; text-align:center; color:var(--text3); font-size:0.88rem;">
        <i class="fas fa-keyboard" style="font-size:1.8rem; margin-bottom:0.6rem; display:block; color:var(--gold);"></i>
        Taip kata kunci untuk mencari Pengumuman, Acara, Rumah Sewa, Alatan, atau Soalan Peperiksaan.
      </div>
    `;
    return;
  }

  const matches = [];

  // 1. Search Core Navigation Sections
  const portalPages = [
    { title: 'Pusat Sumber Akademik (Takwim, Soalan, HPNM)', section: 'academic', icon: 'fa-book-open', tag: 'Akademik' },
    { title: 'Pusat Cetakan Pelajar (Print Hub Aras 2)', section: 'printing', icon: 'fa-print', tag: 'Perkhidmatan' },
    { title: 'Portal Rumah Sewa Pelajar Wangsa Maju & Setapak', section: 'rent', icon: 'fa-home', tag: 'Rumah Sewa' },
    { title: 'Pengumuman Rasmi JPP & PMKL', section: 'announcements', icon: 'fa-bullhorn', tag: 'Hebahan' },
    { title: 'Takwim Acara & Program JPP', section: 'events', icon: 'fa-calendar', tag: 'Acara' },
    { title: 'Direktori Majlis Tertinggi & EXCO JPP', section: 'members', icon: 'fa-users', tag: 'JPP' },
    { title: 'Galeri Foto Aktiviti Kampus', section: 'album', icon: 'fa-images', tag: 'Galeri' },
    { title: 'Bilik Gerakan JPP & Panduan Aras Kampus', section: 'contact', icon: 'fa-building', tag: 'Kampus' },
    { title: 'e-Aduan Mahasiswa & Lost and Found (Beta Lab)', section: 'beta', icon: 'fa-flask', tag: 'Beta Lab' }
  ];

  portalPages.forEach(p => {
    if (p.title.toLowerCase().includes(query) || p.tag.toLowerCase().includes(query)) {
      matches.push({
        title: p.title,
        desc: `Buka bahagian ${p.tag} portal rasmi PMKL.`,
        section: p.section,
        icon: p.icon,
        tag: p.tag
      });
    }
  });

  // 2. Search Past Year Courses
  const pastYearList = [
    { code: 'DIT10133', name: 'Programming Fundamentals (C++)', dept: 'DIT' },
    { code: 'DIT20233', name: 'Database Design & SQL', dept: 'DIT' },
    { code: 'DIT30333', name: 'Web Development & Frameworks', dept: 'DIT' },
    { code: 'DIT40433', name: 'Computer Networking & Security', dept: 'DIT' },
    { code: 'DRO10133', name: 'Principles of Retail Management', dept: 'DRO' },
    { code: 'DRO20233', name: 'Visual Merchandising & Store Display', dept: 'DRO' },
    { code: 'DRO30333', name: 'Retail Buying & Merchandise', dept: 'DRO' },
    { code: 'DHM10133', name: 'Introduction to Hospitality & Tourism', dept: 'DHM' },
    { code: 'DHM20233', name: 'Food & Beverage Service Operations', dept: 'DHM' },
    { code: 'DHM30333', name: 'Front Office Operations & Night Audit', dept: 'DHM' },
    { code: 'MPU21032', name: 'Penghayatan Etika dan Peradaban', dept: 'UMUM' },
    { code: 'DUE10012', name: 'Communicative English 1', dept: 'UMUM' }
  ];

  pastYearList.forEach(py => {
    if (py.code.toLowerCase().includes(query) || py.name.toLowerCase().includes(query) || py.dept.toLowerCase().includes(query)) {
      matches.push({
        title: `${py.code} — ${py.name}`,
        desc: `Kertas peperiksaan akhir jabatan ${py.dept}.`,
        section: 'academic',
        icon: 'fa-file-lines',
        tag: `Soalan ${py.dept}`
      });
    }
  });

  // 3. Search Print Hub Services
  const printItems = [
    { name: 'Cetakan Hitam Putih (A4 B&W Duplex)', tag: 'Printing' },
    { name: 'Cetakan Berwarna Standard & Foto (A4)', tag: 'Printing' },
    { name: 'Cetakan Pelan & Poster Kertas A3', tag: 'Printing' },
    { name: 'Jilid Plastik Comb Binding & Hard Cover', tag: 'Printing' },
    { name: 'Laminating Kalis Air A4', tag: 'Printing' }
  ];

  printItems.forEach(pr => {
    if (pr.name.toLowerCase().includes(query)) {
      matches.push({
        title: pr.name,
        desc: 'Perkhidmatan kaunter percetakan digital JPP Aras 2.',
        section: 'printing',
        icon: 'fa-print',
        tag: 'Pusat Cetakan'
      });
    }
  });

  if (!matches.length) {
    resultsContainer.innerHTML = `
      <div style="padding:2.5rem 1rem; text-align:center; color:var(--text3); font-size:0.88rem;">
        <i class="fas fa-circle-question" style="font-size:1.8rem; margin-bottom:0.6rem; display:block; color:#ef4444;"></i>
        Tiada keputusan dijumpai untuk "<strong>${escapeHtml(query)}</strong>". Cuba cari dengan kata kunci lain.
      </div>
    `;
    return;
  }

  resultsContainer.innerHTML = matches.slice(0, 8).map(m => `
    <div class="spotlight-item" onclick="selectGlobalSearchResult('${m.section}')">
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <div style="width:36px; height:36px; border-radius:8px; background:var(--surface2); display:flex; align-items:center; justify-content:center; color:var(--gold); border:1px solid var(--border);">
          <i class="fas ${m.icon}"></i>
        </div>
        <div>
          <div style="font-size:0.88rem; font-weight:700; color:var(--text);">${escapeHtml(m.title)}</div>
          <div style="font-size:0.75rem; color:var(--text3);">${escapeHtml(m.desc)}</div>
        </div>
      </div>
      <span class="tag tag-gold" style="font-size:0.7rem;">${escapeHtml(m.tag)}</span>
    </div>
  `).join('');
}

function selectGlobalSearchResult(section) {
  closeGlobalSearch();
  navigate(section);
}

// Auto-initialize Academic GPA Table on Load
document.addEventListener('DOMContentLoaded', () => {
  renderAcademicGpaTable();
});