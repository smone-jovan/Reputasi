# Donaria — Status Saat Ini

> **Diperbarui:** 30 Mei 2026
> **Versi:** 0.6.0
> **Status:** Siap testing & deployment

---

## Ringkasan Eksekutif

Semua komponen inti sudah diimplementasikan: Backend API (37+ endpoint), Website Frontend (14 halaman), Flutter Mobile App (11 screen + 4 provider), dan fitur Squad Donasi di ketiga lapisan. Project berada di fase **siap testing & deployment**.

---

## Struktur Project

```
D:\code_xI\Reputasi\
├── backend/                        # Express.js API Server
│   ├── server.js                   # Entry point (middleware, sync, seed)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js         # Sequelize connection
│   │   │   └── tripay.js           # Tripay credentials
│   │   ├── models/                 # 11 Sequelize models
│   │   │   ├── index.js            # Model registry & associations
│   │   │   ├── User.js
│   │   │   ├── Category.js
│   │   │   ├── Campaign.js
│   │   │   ├── CampaignImage.js
│   │   │   ├── Donation.js
│   │   │   ├── Transaction.js
│   │   │   ├── Withdrawal.js
│   │   │   ├── Squad.js
│   │   │   ├── SquadMember.js
│   │   │   ├── Notification.js
│   │   │   └── Setting.js
│   │   ├── controllers/            # 9 controllers (req/res handler)
│   │   │   ├── authController.js
│   │   │   ├── campaignController.js
│   │   │   ├── categoryController.js
│   │   │   ├── donationController.js
│   │   │   ├── transactionController.js
│   │   │   ├── squadController.js
│   │   │   ├── withdrawalController.js
│   │   │   ├── notificationController.js
│   │   │   └── analyticsController.js
│   │   ├── services/               # Business logic
│   │   │   ├── PaymentService.js   # Orchestrasi payment flow + bypass
│   │   │   └── tripayService.js    # Low-level Tripay API client
│   │   ├── routes/                 # 11 route files
│   │   │   ├── authRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── campaignRoutes.js
│   │   │   ├── donationRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   ├── squadRoutes.js
│   │   │   ├── withdrawalRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   ├── demoRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   └── analyticsRoutes.js
│   │   ├── middleware/
│   │   │   ├── auth.js             # authenticate + isAdmin
│   │   │   └── validate.js         # Joi validation middleware
│   │   ├── validations/
│   │   │   └── authValidation.js   # Register/Login schemas
│   │   └── seed.js                 # Seed: 8 categories + admin user
│   ├── tests/                      # Jest + Supertest (101 test cases, 10 suites)
│   ├── scripts/                    # Seed & update scripts
│   └── package.json
│
├── website/                        # Frontend (HTML + CSS + Vanilla JS)
│   ├── index.html                  # Landing page
│   ├── campaigns.html              # Campaign listing + search
│   ├── campaign-detail.html        # Campaign detail + squad widget
│   ├── donate.html                 # Donation form
│   ├── payment.html                # QRIS/VA display + polling
│   ├── payment-status.html         # Payment status page
│   ├── squad.html                  # Squad detail + create
│   ├── login.html                  # Login form
│   ├── register.html               # Register form
│   ├── dashboard.html              # Donor dashboard
│   ├── admin/
│   │   ├── index.html              # Admin dashboard + demo test
│   │   ├── campaigns.html          # Campaign CRUD
│   │   └── transactions.html       # Transaction list + filters
│   ├── css/
│   │   ├── style.css               # Design system (2425 lines)
│   │   └── 21st-premium.css        # Premium glassmorphism
│   └── js/
│       ├── api.js                  # API object + Auth + utilities (432 lines)
│       ├── app.js                  # Animations + helpers
│       ├── auth.js                 # Auth guard IIFE
│       └── modules/                # IIFE modules (belum diintegrasikan)
│           ├── API.js
│           ├── Auth.js
│           └── UI.js
│
├── Aplikasi/donaria/               # Flutter Mobile App
│   ├── pubspec.yaml
│   └── lib/
│       ├── main.dart               # Entry point, routing, MultiProvider
│       ├── config/
│       │   ├── api_config.dart     # Base URL + endpoints
│       │   └── theme.dart          # Material3 theme
│       ├── models/                 # 6 model files (10 classes)
│       │   ├── user.dart
│       │   ├── campaign.dart
│       │   ├── category.dart
│       │   ├── donation.dart
│       │   ├── squad.dart
│       │   └── transaction.dart
│       ├── services/
│       │   ├── api_service.dart    # Singleton Dio + JWT interceptor
│       │   └── auth_service.dart   # Login/register + persistence
│       ├── providers/              # 4 ChangeNotifier providers
│       │   ├── auth_provider.dart
│       │   ├── campaign_provider.dart
│       │   ├── donation_provider.dart
│       │   └── squad_provider.dart
│       ├── screens/                # 10 screens
│       │   ├── splash_screen.dart
│       │   ├── login_screen.dart
│       │   ├── register_screen.dart
│       │   ├── home_screen.dart    # 4-tab bottom nav
│       │   ├── campaign_detail_screen.dart
│       │   ├── donate_screen.dart
│       │   ├── payment_screen.dart
│       │   ├── notification_screen.dart
│       │   ├── admin_dashboard_screen.dart
│       │   ├── squad_detail_screen.dart
│       │   └── create_squad_screen.dart
│       ├── widgets/                # 8 reusable widgets
│       │   ├── app_logo.dart
│       │   ├── custom_button.dart
│       │   ├── campaign_card.dart
│       │   ├── category_chip.dart
│       │   ├── progress_bar.dart
│       │   ├── loading_widget.dart
│       │   ├── donation_item.dart
│       │   └── squad_card.dart
│       └── utils/
│           └── formatters.dart
│
├── docs/                           # Dokumentasi
├── assets/                         # Shared assets
├── reports/                        # Test reports
├── CLAUDE.md                       # AI context rules
├── README.md                       # Quick start
├── CONTRIBUTING.md                 # Panduan kontribusi
└── CHANGELOG.md                    # Riwayat versi
```

---

## Database Schema (10 Tables)

**Database:** `donaria` (MySQL via XAMPP)

| Tabel | Deskripsi | Field Kunci |
|-------|-----------|-------------|
| `users` | Akun user (admin/donatur) | `id`, `name`, `email` (unique), `password_hash`, `role` |
| `categories` | Kategori kampanye (8 default) | `id`, `name`, `slug` (unique), `icon` |
| `campaigns` | Program donasi | `id`, `user_id` (FK), `category_id` (FK), `target_amount`, `current_amount`, `status` |
| `campaign_images` | Galeri foto kampanye | `id`, `campaign_id` (FK), `image_url`, `is_primary` |
| `donations` | Record donasi | `id`, `user_id` (FK), `campaign_id` (FK), `squad_id` (FK, nullable), `amount`, `status` |
| `transactions` | Detail pembayaran | `id`, `donation_id` (FK, unique), `order_id`, `payment_method`, `status`, `gross_amount` |
| `withdrawals` | Pencairan dana | `id`, `campaign_id` (FK), `admin_id` (FK), `amount`, `status` |
| `squads` | Squad Donasi per kampanye | `id`, `campaign_id` (FK), `creator_id` (FK), `invite_code` (unique), `target_amount`, `current_amount` |
| `squad_members` | Anggota squad | `id`, `squad_id` (FK), `user_id` (FK), `role` |
| `notifications` | Notifikasi user | `id`, `user_id` (FK), `title`, `type`, `is_read` |
| `settings` | Konfigurasi platform | `key` (PK), `value`, `type` |

**Associations:**
```
User ──hasMany──> Campaign, Donation, Notification, Squad (creator), SquadMember
Category ──hasMany──> Campaign
Campaign ──hasMany──> CampaignImage, Donation, Withdrawal, Squad
Donation ──hasOne──> Transaction
Donation ──belongsTo──> Squad (optional)
Squad ──hasMany──> Donation, SquadMember
```

**Default Admin:** `admin@donaria.com` / `admin123`

**Categories (seeded):** Bencana Alam, Pendidikan, Kesehatan, Kemanusiaan, Rumah Ibadah, Anak Yatim, Lingkungan, Pangan

---

## API Endpoints (37+ endpoints)

Lihat [docs/api/README.md](api/README.md) untuk dokumentasi lengkap.

| Grup | Endpoint | Auth | Jumlah |
|------|----------|------|--------|
| Auth | `/api/auth/*` | register/login: publik, lainnya: login | 4 |
| Categories | `/api/categories/*` | GET: publik, CRUD: admin | 5 |
| Campaigns | `/api/campaigns/*` | GET: publik, submit/my: login, approve/reject: admin | 12 |
| Donations | `/api/donations/*` | recent: publik, lainnya: login | 4 |
| Transactions | `/api/transactions/*` | callback/check: publik, list: admin | 4 |
| Squads | `/api/squads/*` | by code/campaign: publik, create/join: login | 6 |
| Withdrawals | `/api/withdrawals/*` | admin only | 3 |
| Notifications | `/api/notifications/*` | login only | 3 |
| Admin | `/api/admin/*` | admin only | 2 |
| Admin Analytics | `/api/admin/analytics/*` | admin only | 3 |
| Stats | `/api/stats` | publik | 1 |
| Settings | `/api/settings/*` | publik | 1 |
| Demo | `/api/demo/*` | admin only | 2 |
| Health | `/api/health` | publik | 1 |

---

## Service Layer (Handoff Model)

Arsitektur backend menggunakan pola **Controller → Service → Model** untuk memisahkan tanggung jawab.

### PaymentService (`src/services/PaymentService.js`)

Service terpusat yang mengorkestrasi seluruh alur pembayaran. Lihat [ADR-002](decisions/002-extract-payment-service.md) untuk alasan ekstraksi.

```
PaymentService.createPayment()
    ├─ Cek bypass mode dari Setting.getValue('bypass_pembayaran')
    ├─ Validasi campaign aktif & amount >= 10.000
    ├─ Buat Donation (status: 'success' jika bypass, 'pending' jika normal)
    ├─ Bypass → Transaction settlement langsung
    │   Normal → TripayService.createTransaction()
    └─ Return { donation, transaction, gatewayData }

PaymentService.handleCallback()
    ├─ Verify signature dari Tripay
    ├─ Update Transaction & Donation status
    └─ _handleSuccessfulPayment() jika settlement

_handleSuccessfulPayment()
    ├─ campaign.increment('current_amount')
    ├─ Auto-complete campaign jika target tercapai
    ├─ squad.incrementAmount() jika ada squad_id
    └─ Buat Notification untuk donor
```

### TripayService (`src/services/tripayService.js`)

Low-level client untuk Tripay API. Tidak ada business logic — murni HTTP wrapper.

- `getPaymentChannels()` — ambil daftar channel pembayaran
- `createTransaction({...})` — buat transaksi di Tripay (24 jam expiry)
- `getTransactionDetail(reference)` — cek status transaksi
- `verifyCallbackSignature(data)` — verifikasi webhook signature

---

## Flutter App

### Screens (11)

| Screen | Fungsi |
|--------|--------|
| `SplashScreen` | Animasi startup + sound + auto-route |
| `LoginScreen` | Form login dengan validasi |
| `RegisterScreen` | Form registrasi |
| `HomeScreen` | 4-tab: Beranda, Jelajah, Riwayat, Profil |
| `CampaignDetailScreen` | Detail kampanye + squad section + pesan donatur + HTML description |
| `DonateScreen` | Pilih amount + payment method + anonymous |
| `PaymentScreen` | Tampilkan QRIS/VA + instruksi |
| `NotificationScreen` | Placeholder (empty state) |
| `AdminDashboardScreen` | Stats + Demo Test modal + Test Mode toggle |
| `SquadDetailScreen` | Squad info + leaderboard + join/share |
| `CreateSquadScreen` | Form buat squad + preset amounts |
| `SubmitCampaignScreen` | Form ajukan kampanye baru (user-generated) |

### Providers (4)

| Provider | State | Methods |
|----------|-------|---------|
| `AuthProvider` | user, isLoading, isInitialized | init(), login(), register(), logout() |
| `CampaignProvider` | campaigns, categories, selectedCampaign, pagination | loadCategories(), loadCampaigns(), loadMore(), loadCampaignDetail() |
| `DonationProvider` | myDonations, recentDonations, lastTransaction | createDonation(), loadMyDonations(), checkPaymentStatus() |
| `SquadProvider` | campaignSquads, mySquads, selectedSquad, leaderboard | createSquad(), joinSquad(), loadSquadByCode(), loadMySquads() |

### Navigasi

```
Splash → Login/Register → Home (4-tab IndexedStack)
                              ├─ Beranda → CampaignDetail → Donate → Payment
                              │                        └→ CreateSquad → SquadDetail
                              ├─ Jelajah → CampaignDetail → ...
                              ├─ Riwayat
                              └─ Profil → AdminDashboard (admin only)
```

---

## Website Frontend

### Halaman (14)

| Halaman | Fungsi |
|---------|--------|
| `index.html` | Landing page: hero, stats, campaign grid, recent donations |
| `campaigns.html` | Campaign listing + category filter + search + pagination |
| `campaign-detail.html` | Detail + donors + pesan donatur + squad widget + share |
| `donate.html` | Amount presets + payment method + anonymous |
| `payment.html` | QRIS/VA display + countdown + auto-poll |
| `payment-status.html` | Status polling page |
| `squad.html` | Squad detail (by code) atau create flow (by campaign) |
| `login.html` | Login form (split layout) |
| `register.html` | Register form (split layout) |
| `dashboard.html` | Donor dashboard: riwayat + notifikasi + "Kampanye Saya" |
| `submit-campaign.html` | Form ajukan kampanye baru (user-generated) |
| `admin/index.html` | Admin stats + analytics + sidebar navigation |
| `admin/campaigns.html` | Campaign CRUD (create, edit, delete, approve/reject) |
| `admin/transactions.html` | Transaction list + status/source filters |

### JavaScript Architecture

**Aktif digunakan (flat globals):**
- `api.js` — `API` object, `Auth` object, `apiFetch()`, utilities (formatCurrency, showToast, dll)
- `app.js` — Smooth scroll, IntersectionObserver, debounce
- `auth.js` — Auth guard IIFE (redirect jika belum login)

**Belum diintegrasikan (IIFE modules):**
- `js/modules/API.js` — CoreAPI dengan domain methods
- `js/modules/Auth.js` — CoreAuth dengan getAuthHeader()
- `js/modules/UI.js` — UI helpers (toast, renderList)

Lihat [ADR-004](decisions/004-modular-frontend.md) untuk rencana modularisasi.

---

## Integrasi Tripay

**Status:** Terimplementasi, butuh API key di `.env`

### Payment Methods

| Method | Tripay Code | Tipe |
|--------|-------------|------|
| QRIS | `QRIS` | Scan QR (GoPay, OVO, DANA, LinkAja) |
| BCA Virtual Account | `BCAVA` | Bank Transfer |
| BNI Virtual Account | `BNIVA` | Bank Transfer |
| BRI Virtual Account | `BRIVA` | Bank Transfer |
| Mandiri Virtual Account | `MANDIRIVA` | Bank Transfer |
| BSI Virtual Account | `BSIVA` | Bank Transfer |

### Alur Pembayaran

```
User pilih campaign & amount
    → POST /api/donations
    → PaymentService.createPayment()
    → TripayService.createTransaction() (24 jam expiry)
    → Return QR URL / VA number
    → Frontend tampilkan QR/VA + countdown
    → User bayar
    → Tripay kirim webhook ke POST /api/transactions/callback
    → PaymentService.handleCallback()
    → Update status → settlement / failed
    → Update campaign.current_amount
    → Buat notification
```

---

## Konfigurasi Backend

### Environment Variables (`.env`)

```env
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=donaria
DB_USER=root
DB_PASS=

# JWT
JWT_SECRET=donaria_secret_key_change_in_production_2026
JWT_EXPIRES_IN=7d

# Tripay Sandbox
TRIPAY_API_KEY=your_tripay_api_key
TRIPAY_PRIVATE_KEY=your_tripay_private_key
TRIPAY_MERCHANT_CODE=your_merchant_code
TRIPAY_BASE_URL=https://tripay.co.id/api-sandbox

# CORS
ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
```

### Dependencies

| Package | Versi | Fungsi |
|---------|-------|--------|
| express | 4.19.2 | Web framework |
| sequelize | 6.37.3 | ORM MySQL |
| mysql2 | 3.10.0 | MySQL driver |
| jsonwebtoken | 9.0.2 | JWT auth |
| bcryptjs | 2.4.3 | Password hashing (12 rounds) |
| joi | 17.13.1 | Validation |
| axios | 1.7.2 | HTTP client (Tripay) |
| cors | 2.8.5 | CORS middleware |
| helmet | 8.1.0 | HTTP security headers |
| morgan | 1.10.0 | Request logging |
| express-rate-limit | 8.5.1 | Rate limiting |
| multer | 1.4.5 | File upload (imported, belum dipakai) |
| dotenv | 16.4.5 | Env variables |

### Security Middleware

| Middleware | Fungsi |
|-----------|--------|
| `helmet()` | HTTP headers (CSP, HSTS, X-Frame) |
| `cors()` | Origin restriction via `ALLOWED_ORIGINS` |
| `express-rate-limit` | 10 req/15min (auth), 100 req/15min (API) |
| `authenticate` | JWT verification → `req.user` |
| `isAdmin` | Role check (`req.user.role === 'admin'`) |
| `validate(schema)` | Joi validation pada `req.body` |

---

## Checklist Status

| Komponen | Status | Catatan |
|----------|--------|---------|
| Database (11 tabel) | ✅ | Sequelize sync + seed |
| Backend API (37+ endpoint) | ✅ | 9 controllers, 11 routes, 2 services |
| Website (14 halaman) | ✅ | Glassmorphism, responsive |
| Flutter App (11 screen) | ✅ | Provider + Dio |
| Auth System | ✅ | JWT + bcrypt |
| Payment Gateway | ✅ | Tripay (QRIS + VA) |
| Squad Donasi | ✅ | Backend + Web + Flutter |
| Security Hardening | ✅ | Helmet, rate limit, CORS |
| Payment Bypass | ✅ | Toggle via admin |
| Test Mode | ✅ | Toggle via admin, bypass semua donasi |
| User-Generated Campaigns | ✅ | Submit, edit, resubmit, approve/reject |
| Admin Analytics | ✅ | Trend chart, top campaigns, top donors, CSV export |
| Pesan Donatur | ✅ | Message dari donasi sebagai komentar publik |
| Unit Tests | ✅ | 101 test cases (10 suites) |
| Tripay API Keys | ⚠️ | Placeholder di `.env` |

---

## Known Issues

| # | Issue | Severity | Lokasi |
|---|-------|----------|--------|
| 1 | `js/modules/` (IIFE) tidak dipakai halaman manapun | Low | `website/js/modules/` |
| 2 | `assets/sounds/` kosong — splash sound fail silently | Low | `Aplikasi/donaria/assets/sounds/` |

---

## Yang Perlu Dikerjakan

### Prioritas Tinggi
- [ ] Isi Tripay API key di `.env`
- [ ] Hapus duplicate logic di `donationController` dan `transactionController` — gunakan `PaymentService`
- [ ] Implement `Squad.incrementAmount()` di model

### Prioritas Medium
- [ ] Integrasi `js/modules/` ke halaman website
- [ ] Tambah Joi validation di campaign, donation, squad routes

### Deployment
- [ ] Setup production MySQL
- [ ] Domain & hosting + SSL
- [ ] Konfigurasi Tripay production
- [ ] Ganti `JWT_SECRET` dengan key kuat
- [ ] Set `NODE_ENV=production`

---

*Dokumen ini adalah source of truth untuk status proyek.*
*Terakhir diupdate: 30 Mei 2026 (v0.6.0)*
