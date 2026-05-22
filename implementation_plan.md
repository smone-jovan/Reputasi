# 🕌 Donaria — Implementation Plan (FINAL)

## Pilihan User (Dikonfirmasi)

| Komponen | Pilihan |
|:---|:---|
| **Database** | MySQL (XAMPP lokal) |
| **Payment Gateway** | Tripay (QRIS + Bank Transfer) |
| **Website** | HTML/CSS/JavaScript (Tailwind CSS + Glassmorphism) |
| **Mobile App** | Flutter (`Aplikasi/donaria/`) |
| **Backend** | Express.js + Sequelize ORM |
| **Design System** | UI/UX Pro Max Ver 3 (Inter font, Emerald, Premium Mesh Glassmorphism) |
| **MCP Integration** | Stitch (Google AI Design Generation) |

## Arsitektur Final

```
Website (HTML/Tailwind/JS) ──┐
                             ├──▶ Backend (Express.js) ──▶ MySQL
Flutter App (Dart) ─────────┘         │
                                      ├──▶ Tripay API
                                      └──▶ Security Layer (Helmet, Rate Limit, CORS)
```

## Progress (Diperbarui: 13 Mei 2026)

### Fase 1: Core Platform ✅
- [x] ERD & Database Design (8 tabel)
- [x] SDLC Document (`Readme SDLC.MD`)
- [x] AI Continuation Guide (`readme ai next.MD`)
- [x] Flutter project created & Dashboard fixed
- [x] Backend setup & API (Express.js, 8 models, 7 controllers, 7 routes, Tripay service)
- [x] Website frontend (12 halaman HTML, API helper)

### Fase 2: UI/UX Modernization ✅
- [x] Modernisasi UI/UX Pro Max Ver 3 (Inter font, Premium Mesh Background, Glassmorphism)
- [x] Login, Register, Admin Dashboard, Kampanye, Transaksi — 100% Mobile-Friendly
- [x] Perbaikan Route 404 di navigasi Admin
- [x] Standardisasi font Inter di seluruh halaman (menggantikan Plus Jakarta Sans)
- [x] Integrasi `21st-premium.css` dan `style.css` ke seluruh halaman

### Fase 3: Security Hardening ✅
- [x] Helmet.js — HTTP security headers
- [x] Rate Limiting — 10 req/15min (auth), 100 req/15min (API)
- [x] CORS — origin-based restriction via `ALLOWED_ORIGINS` env
- [x] XSS Protection — `escapeHTML()` sanitization di semua `innerHTML`
- [x] Production error handler — tidak membocorkan stack trace
- [x] Dependency audit — 0 vulnerabilities

### Fase 4: MCP & Design System Integration ✅
- [x] Stitch MCP server terkonfigurasi (`mcp.json`)
- [x] Brand guidelines tersinkronisasi (`docs/brand-guidelines.md`)

### Fase 5: Fitur Baru — Squad Donasi 🟡 (Sedang Berjalan)
- [x] Model `Squad` & `SquadMember` (backend)
- [x] API endpoints squad (`/api/squads`)
- [x] Halaman squad di website (`squad.html`)
- [x] Tombol "Buat Squad" di campaign detail
- [ ] Squad detail screen di Flutter app
- [ ] Deep link handler untuk share squad

### Pending
- [ ] Tripay integration (kunci API belum diisi)
- [ ] Testing end-to-end & deployment

## Urutan Kerja

1. **Backend** → Setup Express.js, MySQL models, CRUD APIs, Tripay, Security
2. **Website** → Setup Frontend, Modernisasi Tailwind UI, connect to API
3. **Flutter** → Screens, API integration, payment flow
4. **Security** → Helmet, Rate Limit, CORS, XSS protection
5. **Squad Donasi** → Backend models, API, Website UI, Flutter screen
