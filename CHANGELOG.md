# Changelog

Semua perubahan signifikan pada proyek Donaria akan didokumentasikan di file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/ID/1.0.0/).

## [Unreleased]

### Added
- MCP: chrome-devtools dan context7 terkonfigurasi

### Security
- Joi validation schemas untuk campaign, donation, dan squad endpoints
  - `campaignValidation.js` — `submitCampaignSchema`, `updateMyCampaignSchema`
  - `donationValidation.js` — `createDonationSchema`
  - `squadValidation.js` — `createSquadSchema`
- Production guard: test mode tidak bisa diaktifkan saat `NODE_ENV=production`
- `donationController.create()` refactor — delegasi ke `PaymentService` (hilangkan duplicate logic)

---

## [0.6.0] - 2026-05-30

### Added
- Admin Analytics & Laporan
  - `GET /api/admin/analytics/trend` — donasi per hari (7 hari terakhir)
  - `GET /api/admin/analytics/top-campaigns` — top 5 campaigns dengan progress
  - `GET /api/admin/analytics/top-donors` — top 5 donatur dengan total donasi
  - Website: Chart.js line chart, tabel performa kampanye, tabel top donatur
  - Export CSV: trend-donasi.csv dan performa-kampanye.csv
- Pesan Donatur (komentar publik)
  - Tampilkan `message` dari donasi sebagai komentar di halaman kampanye
  - Website: section "Pesan Donatur" di campaign-detail.html
  - Flutter: `CampaignComment` model + section di campaign_detail_screen.dart
  - Tidak perlu tabel baru — pakai data yang sudah ada
- User-Generated Campaigns
  - `POST /api/campaigns/submit` — user ajukan kampanye (status: pending)
  - `GET /api/campaigns/my` — user lihat kampanye sendiri
  - `PUT /api/campaigns/my/:id` — user edit own pending/rejected campaign
  - `POST /api/campaigns/:id/resubmit` — user resubmit rejected campaign
  - `PUT /api/campaigns/:id/approve` — admin approve
  - `PUT /api/campaigns/:id/reject` — admin reject
  - Campaign model: tambah ENUM `pending` dan `rejected`
  - Website: submit-campaign.html, section "Kampanye Saya" di dashboard
  - Flutter: SubmitCampaignScreen, menu "Ajukan Kampanye" di profil
- Test Mode
  - `POST /api/admin/test-mode` — admin toggle test mode
  - `GET /api/admin/test-mode` — admin cek status
  - `GET /api/settings/test-mode` — publik cek status
  - Saat aktif, semua donasi user langsung settlement tanpa Tripay
  - Website: toggle di admin dashboard + banner di donate page
  - Flutter: toggle di admin dashboard + banner di donate screen
- Admin sidebar navigation
  - Redesign admin dashboard dengan sidebar kiri (260px)
  - Konsisten di admin/index.html, campaigns.html, transactions.html
  - Mobile responsive dengan hamburger menu

### Fixed
- Public `GET /api/campaigns` sekarang filter out pending/rejected/cancelled
- Route conflict: `PUT /my/:id` dan `POST /:id/resubmit` sekarang di atas `/:id`
- Trend analytics off-by-one (return 8 hari instead of 7)
- Top donors query error (raw + nest + include tidak kompatibel)
- `Setting` model export di `models/index.js`
- CORS: izinkan semua origin saat `NODE_ENV=development`

### Changed
- `donationController.create()` sekarang cek test mode sebelum proses payment
- `transactionController.getAll()` support filter source `test`
- Back buttons ditambahkan di beberapa halaman (admin, squad, donate, payment)

### Tests
- 48 test cases (3 suite): test-mode (14), user-campaigns (21), analytics (13)

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
