# Changelog

Semua perubahan signifikan pada proyek Donaria akan didokumentasikan di file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/ID/1.0.0/).

## [Unreleased]

### Added
- MCP: chrome-devtools dan context7 terkonfigurasi
- Perbarui seluruh dokumentasi `docs/` sesuai kode aktual

---

## [0.5.0] - 2026-05-30

### Added
- Test Mode feature
  - Admin toggle: `POST /api/admin/test-mode` — aktifkan/nonaktifkan test mode
  - Admin status: `GET /api/admin/test-mode` — cek status (admin only)
  - Public status: `GET /api/settings/test-mode` — cek apakah test mode aktif
  - Saat aktif, semua donasi user langsung `settlement` tanpa ke Tripay
  - Website: toggle switch di admin dashboard + banner di donate page
  - Flutter: toggle switch di admin dashboard + banner di donate screen
  - Order ID test mode diawali dengan `TEST-` untuk identifikasi
- Admin routes (`backend/src/routes/adminRoutes.js`)
  - `POST /api/admin/test-mode` — toggle test mode
  - `GET /api/admin/test-mode` — get test mode status
- Transaction filter "Test Mode" di admin transactions page
  - Filter source sekarang: Real, Demo, Test Mode
  - Badge `TEST` untuk transaksi test mode
  - Baris transaksi test mode di-highlight biru
- Back buttons di beberapa halaman
  - Admin campaigns & transactions: tombol kembali ke dashboard
  - Squad page: tombol "Kembali ke Kampanye"
  - Campaign detail: back arrow di navbar
  - Donate page: back arrow di navbar
  - Payment & payment-status: back arrow di logo area
- 14 test cases untuk fitur Test Mode (`backend/tests/test-mode.test.js`)
- `Setting` model export di `models/index.js` (fix bug)

### Changed
- `donationController.create()` sekarang cek test mode sebelum proses payment
- `transactionController.getAll()` support filter source `test` untuk `TEST-` prefix
- CORS: izinkan semua origin saat `NODE_ENV=development` (fix Flutter web connection)
- Squad page: tambah `21st-premium.css` untuk konsistensi visual
- ADR-007: Test Mode for User Donations

---

## [0.4.0] - 2026-05-22

### Added
- Squad Donasi Flutter implementation
  - `SquadDetailScreen` — detail squad + leaderboard + join/share
  - `CreateSquadScreen` — form buat squad + preset amounts
  - `SquadProvider` — state management (create, join, load, leaderboard)
  - `SquadCard` widget — reusable card component
  - `Squad` model + `SquadMemberInfo` + `SquadLeaderboardEntry`
  - Deep link: buka squad dari `squad.html?code=XXX` di website
  - Share via `share_plus` package
- Admin Dashboard Flutter
  - `AdminDashboardScreen` — stats grid + Demo Test modal
  - Demo Test: simulasi payment via `POST /api/demo/simulate-payment`
- Payment bypass mode
  - `Setting` model (key-value store di database)
  - `POST /api/demo/toggle-bypass` endpoint
  - `POST /api/demo/simulate-payment` endpoint
  - Admin dashboard toggle di website

### Changed
- `PaymentService.createPayment()` sekarang cek bypass mode sebelum ke Tripay
- Campaign detail Flutter: tambah section "Squad Donasi" dengan list squad

---

## [0.3.0] - 2026-05-22

### Added
- Squad Donasi backend implementation
  - `Squad` model — id, campaign_id, creator_id, name, target_amount, current_amount, invite_code (unique), status
  - `SquadMember` model — id, squad_id, user_id, role (creator/member)
  - 6 API endpoints: create, join, by code, by id, by campaign, my squads
  - Invite code generation (unique per squad)
  - Squad donation tracking via `squad_id` di tabel `donations`
- Squad Donasi website implementation
  - `squad.html` — detail squad (by code) + create flow (by campaign)
  - Widget "Squad Aktif" di `campaign-detail.html`
  - Leaderboard per squad
  - Share ke WhatsApp + copy link

### Changed
- Enhanced `Donation` model dengan field `squad_id` (nullable FK)
- Enhanced `CampaignDetailScreen` Flutter dengan section squad

---

## [0.2.0] - 2026-05-11

### Added
- Initial application scaffolding
- Authentication system (register, login, JWT, bcrypt)
- User model dan profile management
- Campaign model dan CRUD (admin)
- Donation model dan processing
- Category management (8 default categories)
- Campaign images support
- Notification system (get, read, mark all read)
- PaymentService extraction (ADR-002)
- Tripay payment gateway integration (QRIS + Bank Transfer)
- Frontend website dengan glassmorphism design (14 halaman)
- Flutter mobile app foundation (10 screens, 4 providers)
- Security hardening: Helmet, rate limiting, CORS, XSS protection

### Changed
- Modular frontend architecture (ADR-004) — IIFE pattern di `js/modules/`
- Deep services in Flutter (ADR-005) — AuthService handle token + persistence

---

## [0.1.0] - 2026-04-28

### Added
- Project initialization
- Admin dashboard
- Platform statistics (`GET /api/stats`)
- Payment simulation tool (testing mode)
- Initial database schema (8 tabel)
- Backend API foundation (Express.js + Sequelize)

---

## ADR Summary

| ADR | Judul | Tanggal | Status |
|-----|-------|---------|--------|
| 001 | Implementasi Fitur Squad Donasi | 2026-05-24 | Accepted |
| 002 | Ekstraksi PaymentService | 2026-05-24 | Accepted |
| 003 | Deepening the Squad Module | 2026-05-24 | Accepted |
| 004 | Modularisasi Frontend (Vanilla JS) | 2026-05-24 | Accepted |
| 005 | Deep Services in Flutter | 2026-05-24 | Accepted |
| 006 | Payment Bypass Mode for Testing | 2026-05-24 | Accepted |
| 007 | Test Mode for User Donations | 2026-05-30 | Accepted |

Lihat [docs/decisions/](docs/decisions/) untuk detail lengkap setiap ADR.

---

*Last updated: 2026-05-30*
