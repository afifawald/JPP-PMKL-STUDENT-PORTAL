# JPP PMKL — Student Portal & Campus Operations Hub 🏛️

[![Live Portal](https://img.shields.io/badge/Live_Portal-jpppmklstudentportal.dev-00F0A8?style=for-the-badge&logo=cloudflare&logoColor=black)](https://jpppmklstudentportal.dev)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers_Edge-F38020?style=for-the-badge&logo=cloudflareworkers&logoColor=white)](https://workers.cloudflare.com/)
[![Cloudflare KV](https://img.shields.io/badge/Storage-Cloudflare_KV-FF6A00?style=for-the-badge&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/kv/)
[![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-ES6%2B_Modular-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tesseract OCR](https://img.shields.io/badge/OCR-Tesseract.js_v5-527FFF?style=for-the-badge)](https://tesseract.projectnaptha.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-00F0A8?style=for-the-badge&logoColor=black)](LICENSE)

> **High-availability, edge-serverless campus operations portal** engineered for the **Majlis Perwakilan Pelajar (Student Representative Committee)** of **Politeknik METrO Kuala Lumpur (PMKL)**. Delivers real-time academic announcements, event ticketing, campus printing queues, and student services to hundreds of active students by **Muhamad Afif bin Awaludin**.

---

## 🏛️ About the Platform

The **JPP PMKL Student Portal** serves as the primary digital nerve center for the student fraternity at Politeknik METrO Kuala Lumpur. Operating entirely at the network edge on **Cloudflare Workers** and **Workers KV**, the portal guarantees sub-second response times across the nation, high availability during high-traffic academic release cycles, and zero database server management overhead.

---

## 🌟 Core Modules & Campus Capabilities

- 📢 **Pusat Pengumuman (Official Campus Broadcasts)**: Centralized bulletin for academic notices, semester deadlines, and emergency alerts with rich markdown styling and category filtering.
- 🎟️ **Kalendar Acara & Tempahan RSVP (Events & Registrations)**: Interactive campus events calendar with automated capacity caps, real-time RSVP counts, and dynamic attendance management.
- 🖨️ **Pusat Cetakan & Giliran Dokumen (Print Service & Queue Hub)**:
  - Digital printing queue allowing students to submit documents remotely.
  - In-browser document inspection and page counter powered by **Tesseract.js OCR** and client-side canvas renderers.
  - Real-time job status tracking (`Pending` ➔ `Printing` ➔ `Ready for Collection`).
- 🏠 **Papan Maklumat Rumah Sewa (Off-Campus Student Housing)**: Curated listings of verified student accommodation near Setiawangsa/KL with rental fee calculators and direct landlord communication channels.
- 📸 **Arkib & Galeri Digital (Campus Moments & Albums)**: High-resolution media archive capturing convocations, sports tournaments, orientations, and community workshops.
- 🛍️ **Kedai Cenderamata JPP (Merchandise Storefront)**: Catalog showcasing official PMKL merchandise, apparel, lanyard bundles, and event kit reservations.
- 🌐 **Bilingual Interface (i18n)**: Seamless instant toggling between **Bahasa Melayu** and **English**.
- 🔐 **Pusat Kawalan Pentadbir (Admin Operations Console)**: Dedicated `admin.html` interface with cryptographic session verification for JPP committee members to moderate circulars, audit print queues, process inventory, and track metrics.

---

## 🏗️ Edge Serverless Architecture

The portal is architected around a unified Cloudflare Workers gateway that unifies static asset distribution and REST API handling in a single zero-cold-start edge container:

```
                                  ┌───────────────────────────────┐
                                  │      Client Web Browser       │
                                  │  (Student Portal / Admin UI)  │
                                  └───────────────┬───────────────┘
                                                  │ HTTPS
                                  ┌───────────────▼───────────────┐
                                  │   Cloudflare Global Anycast   │
                                  └───────────────┬───────────────┘
                                                  │
                      ┌───────────────────────────┴───────────────────────────┐
                      │                                                       │
                      ▼                                                       ▼
        ┌───────────────────────────┐                           ┌───────────────────────────┐
        │   Static Assets Service   │                           │    Worker Router Engine   │
        │   (HTML, CSS, JS, Media)  │                           │        (worker.js)        │
        └───────────────────────────┘                           └─────────────┬─────────────┘
                                                                              │
                                        ┌─────────────────────────────────────┴─────────────────────────────────────┐
                                        │                                                                           │
                                        ▼                                                                           ▼
                          ┌───────────────────────────┐                                               ┌───────────────────────────┐
                          │   Modular API Endpoints   │                                               │    Edge Persistence KV    │
                          │  announcements • printing │ ◄───────────────────────────────────────────► │   (PORTAL_DATA Namespace) │
                          │   events • rentals • etc. │                                               │  Atomic Read/Write State  │
                          └───────────────────────────┘                                               └───────────────────────────┘
```

---

## 🔌 Edge REST API Endpoints

All backend endpoints are hosted under `/api/*` and backed by Cloudflare Workers KV:

| Endpoint | Methods | Description |
| :--- | :--- | :--- |
| `/api/status` | `GET`, `POST` | Health monitoring, server heartbeat, and maintenance flag |
| `/api/announcements` | `GET`, `POST`, `DELETE` | Fetch active bulletin circulars or publish new notices |
| `/api/events` | `GET`, `POST`, `DELETE` | List scheduled campus events, schedules, and venue metadata |
| `/api/event-rsvp` | `GET`, `POST`, `DELETE` | Submit student registrations and monitor capacity limits |
| `/api/printing` | `GET`, `POST` | Print service pricing tiers, operating hours, and guidelines |
| `/api/print-jobs` | `GET`, `POST` | Queue submission, student document tracking, and pickup alerts |
| `/api/rentals` | `GET`, `POST`, `DELETE` | Housing accommodation board listings and moderator approvals |
| `/api/album` | `GET`, `POST`, `DELETE` | Photo gallery collections, albums, and image metadata |
| `/api/merch` | `GET`, `POST`, `PATCH`, `DELETE`| Inventory tracking and merchandise order fulfillment |
| `/api/beta` | `GET`, `POST`, `PATCH`, `DELETE`| Feature flags and experimental campus tooling |

---

## 🛠️ Tech Stack & Infrastructure

| Component | Technology | Detail |
| :--- | :--- | :--- |
| **Compute Engine** | Cloudflare Workers | V8 isolates running on Cloudflare's global edge network |
| **Primary Storage** | Cloudflare Workers KV | Distributed, low-latency, eventually consistent key-value store |
| **Frontend Runtime** | Pure Vanilla JavaScript | ES6+ Modules, Async/Await, 0 frontend runtime framework bloat |
| **Styling & Theming** | Modern CSS3 | Custom property design tokens, dark/light theme, responsive flex/grid |
| **Optical Engine** | Tesseract.js v5 | Pure client-side WebAssembly OCR for print verification |
| **Iconography & Fonts** | Font Awesome 6.5 & Google Fonts | Silkscreen, Space Mono, Syne, and DM Sans |
| **CLI & Deployment** | Cloudflare Wrangler v3 | Declarative configuration via `wrangler.jsonc` |

---

## 📁 Repository Structure

```
JPP-PMKL-STUDENT-PORTAL/
├── functions/
│   └── api/                               # Modular serverless API routes
│       ├── album.js                       # Gallery & media endpoints
│       ├── announcements.js               # Notice board CRUD handlers
│       ├── beta.js                        # Feature flag & lab experiments
│       ├── event-rsvp.js                  # Event reservations & ticket counting
│       ├── events.js                      # Calendar & event scheduler
│       ├── merch.js                       # Student council shop & orders
│       ├── print-jobs.js                  # Queue management & job statuses
│       ├── printing.js                    # Printing service pricing & settings
│       ├── rentals.js                     # Off-campus housing listings
│       └── status.js                      # Health check & system diagnostics
├── css/
│   └── styles.css                         # Custom styling, themes & typography
├── js/
│   └── app.js                             # Client-side router, state & API fetchers
├── albums/                                # Event album media collections
├── banners/                               # Portal promotional banners
├── members/                               # JPP committee member profiles
├── index.html                             # Student-facing public portal
├── admin.html                             # JPP committee operations control room
├── worker.js                              # Cloudflare Worker router & request dispatcher
├── wrangler.jsonc                         # Cloudflare configuration & KV bindings
└── README.md
```

---

## 🚀 Local Development & Deployment

### Prerequisites
- [Node.js (v18.0.0 or higher)](https://nodejs.org/)
- Cloudflare account with Workers & KV enabled

### 1. Installation
Clone the repository and install Wrangler globally:
```bash
git clone https://github.com/afifawald/JPP-PMKL-STUDENT-PORTAL.git
cd JPP-PMKL-STUDENT-PORTAL
npm install -g wrangler
```

### 2. Local Edge Emulation
Run the portal locally with Cloudflare's Miniflare emulator:
```bash
wrangler dev
```
Navigate to `http://localhost:8787` in your browser. Changes to `worker.js` and frontend assets reload automatically.

### 3. Deploy to Production
Deploy instantly to Cloudflare's worldwide network:
```bash
wrangler deploy
```

---

## 📬 Contact & Connect

- 💼 **LinkedIn**: [linkedin.com/in/muhamad-afif-awaludin](https://linkedin.com/in/muhamad-afif-awaludin)
- 🐙 **GitHub**: [github.com/afifawald](https://github.com/afifawald)
- 📧 **Personal Email**: [muhd.afif.awaludin@gmail.com](mailto:muhd.afif.awaludin@gmail.com)
- 🏛️ **Student Council**: `jpppmklofficial@gmail.com`
- 🌐 **Portfolio**: [afifawald.github.io/portfolio](https://afifawald.github.io/portfolio/)
- 📍 **Institution**: Politeknik METrO Kuala Lumpur, Malaysia

---

© 2026 **Muhamad Afif bin Awaludin** • Developed for **Majlis Perwakilan Pelajar PMKL**. Released under the [MIT License](LICENSE).
