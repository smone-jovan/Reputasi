# Project Donaria - Status Saat Ini

> **Diperbarui:** 13 Mei 2026  
> **Versi:** 2.1  
> **Status:** Siap testing — Fitur Squad Donasi selesai (Backend + Web + Flutter)

---

## Ringkasan singkat

Semua komponen yang direncanakan dalam MD (SDLC, AI NEXT, implementation plan) sudah diimplementasikan. Project berada di fase **siap testing & deployment**.

## Catatan penting sebelum baca lebih lanjut

**Humanizer skill sudah terinstall** di komputer ini. Skill ini membantu mengubah teks yang terlalu AI-like menjadi tulisan yang lebih natural dan manusiawi. Saya akan memakainya untuk memperbarui bagian-bagian dalam dokumen ini agar lebih mudah dibaca.

---

### Cara pakai Humanizer skill di Claude Code

```text
/humanizer
[paste teks yang ingin diubah di sini]
```

Atau bisa juga dengan:
```text
Please humanize this text: [teks Anda di sini]
```

**Contoh penggunaan di dokumen ini:**

**Sebelum (AI-like):**
> Semua komponen yang direncanakan dalam MD sudah diimplementasikan. Project berada di fase siap testing & deployment.

**Sesudah (lebih natural):**
> Semua komponen yang direncanakan dalam MD (SDLC, AI NEXT, implementation plan) sudah diimplementasikan. Project berada di fase **siap testing & deployment**.

---

## Ringkasan eksekutif

Semua komponen yang didokumentasikan dalam MD (`readme ai next.MD`, `Readme SDLC.MD`, `implementation_plan.md`) **sudah selesai diimplementasikan**. Project berada di fase **siap testing & deployment**.

**Terdapat ide proyek baru (Sampingan): Web Translator (Klon ReadOmni).** Dokumen ide telah dibuat di `docs/ideas/Ide_Penerjemah_Web.md`. Handoff untuk proyek ini ada di `Handoff.MD`.
---


## 📁 Struktur Project Saat Ini

```
D:\code_xI\Reputasi\
├── Aplikasi/
│   └── donaria/              # Flutter Mobile App ✅ (SELESAI)
│       ├── lib/
│       │   ├── config/
│       │   │   ├── api_config.dart   # API Endpoints & Base URL
│       │   │   └── theme.dart        # Color palette & theme
│       │   ├── models/
│       │   │   ├── user.dart         # User model
│       │   │   ├── campaign.dart     # Campaign model
│       │   │   ├── category.dart     # Category model
│       │   │   ├── donation.dart     # Donation model
│       │   │   └── transaction.dart  # Transaction model
│       │   ├── services/
│       │   │   ├── api_service.dart      # HTTP client (Dio)
│       │   │   └── auth_service.dart     # Login, register, token
│       │   ├── providers/
│       │   │   ├── auth_provider.dart        # Auth state
│       │   │   ├── campaign_provider.dart    # Campaign state
│       │   │   ├── donation_provider.dart    # Donation state
│       │   │   └── squad_provider.dart       # 🆕 Squad state
│       │   ├── screens/
│       │   │   ├── splash_screen.dart      # Animation saat startup
│       │   │   ├── login_screen.dart       # Halaman login
│       │   │   ├── register_screen.dart    # Halaman registrasi
│       │   │   ├── home_screen.dart        # Dashboard (4 tabs)
│       │   │   ├── campaign_detail_screen.dart # Detail kampanye
│       │   │   ├── donate_screen.dart      # Form donasi
│       │   │   ├── payment_screen.dart     # Tampilan QR/VA
│       │   │   ├── notification_screen.dart # Notifikasi
│       │   │   ├── squad_detail_screen.dart  # 🆕 Detail squad + leaderboard
│       │   │   └── create_squad_screen.dart  # 🆕 Form buat squad
│       │   ├── widgets/
│       │   │   ├── campaign_card.dart
│       │   │   ├── donation_item.dart
│       │   │   ├── category_chip.dart
│       │   │   ├── progress_bar.dart
│       │   │   ├── loading_widget.dart
│       │   │   ├── custom_button.dart
│       │   │   └── squad_card.dart           # 🆕 Squad card widget
│       │   └── utils/
│       │       ├── formatters.dart       # Currency, date formatter
│       │       └── constants.dart
│       ├── pubspec.yaml
│       └── ...
│
├── website/                   # Website Frontend ✅ (SELESAI)
│   ├── index.html            # Landing page + list kampanye
│   ├── campaigns.html        # List semua kampanye + search
│   ├── campaign-detail.html  # Detail kampanye + tombol donasi
│   ├── donate.html           # Form donasi (jumlah, pesan, metode)
│   ├── payment.html          # Tampilan QR/VA + countdown
│   ├── payment-status.html   # Cek status pembayaran
│   ├── login.html            # Form login
│   ├── register.html         # Form register
│   ├── dashboard.html        # Dashboard donatur
│   ├── admin/
│   │   ├── index.html        # Dashboard admin
│   │   ├── campaigns.html    # CRUD kampanye
│   │   ├── transactions.html # List transaksi
│   │   └── withdrawals.html  # Kelola pencairan
│   ├── css/
│   │   ├── style.css         # Design system dasar
│   │   └── 21st-premium.css  # Design system lama
│   │   └── (Integrasi Tailwind CSS CDN pada HTML pages)
│   ├── js/
│   │   ├── app.js            # Main app logic
│   │   ├── api.js            # API calls helper
│   │   ├── auth.js           # Auth logic
│   │   └── payment.js        # Payment logic
│   └── assets/
│       └── images/
│
├── backend/                   # Backend API ✅ (SELESAI)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js   # MySQL connection (Sequelize)
│   │   │   └── tripay.js     # Tripay config
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── campaignController.js
│   │   │   ├── categoryController.js
│   │   │   ├── donationController.js
│   │   │   ├── transactionController.js
│   │   │   ├── withdrawalController.js
│   │   │   └── notificationController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Category.js
│   │   │   ├── Squad.js          # 🆕 Squad Donasi
│   │   │   ├── SquadMember.js    # 🆕 Squad Members
│   │   │   ├── Campaign.js
│   │   │   ├── CampaignImage.js
│   │   │   ├── Donation.js
│   │   │   ├── Transaction.js
│   │   │   ├── Withdrawal.js
│   │   │   └── Notification.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── campaignRoutes.js
│   │   │   ├── donationRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   ├── withdrawalRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   └── squadRoutes.js     # 🆕 Squad Donasi
│   │   ├── middleware/
│   │   │   ├── auth.js       # JWT verification
│   │   │   ├── admin.js      # Admin role check
│   │   │   └── validate.js   # Request validation
│   │   ├── services/
│   │   │   └── tripayService.js  # Tripay API integration
│   │   └── seed.js           # Seed data (8 kategori + admin)
│   ├── server.js             # Entry point
│   ├── .env                  # Environment variables
│   └── package.json
│
├── docs/
│   ├── brand-guidelines.md   # Brand guidelines Donaria
│   └── ideas/
│       └── squad-donasi.md   # 🆕 Rencana fitur Squad Donasi
├── mcp.json                  # MCP server config (Stitch)
├── Readme SDLC.MD            # Dokumen SDLC
├── readme ai next.MD         # AI Continuation Guide
├── implementation_plan.md    # Implementation Plan
├── Projek_sekarang.md        # ← File ini (status terkini)
└── README.md
```

---

## 🗄️ Database Schema (MySQL)

**Database Name:** `donaria`  
**Total Tables:** 8 (+ 2 baru untuk Squad Donasi)

| Tabel | Status | Deskripsi |
|:---|:---|:---|
| `users` | ✅ | Data pengguna (admin & donatur) |
| `categories` | ✅ | Kategori kampanye (8 default) |
| `campaigns` | ✅ | Program donasi |
| `campaign_images` | ✅ | Galeri foto kampanye |
| `donations` | ✅ | Record donasi (+ field `squad_id` opsional 🆕) |
| `transactions` | ✅ | Detail pembayaran (QRIS/VA) |
| `withdrawals` | ✅ | Pencairan dana |
| `notifications` | ✅ | Notifikasi user |
| `squads` | ✅ | Squad donasi per kampanye |
| `squad_members` | ✅ | Anggota squad |

**Admin Default:**
- Email: `admin@donaria.com`
- Password: `admin123`

**Categories (seeded):**
- 🌊 Bencana Alam
- 🎓 Pendidikan
- 💊 Kesehatan
- 🤝 Kemanusiaan
- 🕌 Rumah Ibadah
- 👶 Anak Yatim
- 🌱 Lingkungan
- 🍚 Pangan

---

## 🔌 API Endpoints (Backend)

### Auth
| Method | Endpoint | Deskripsi | Status |
|:---|:---|:---|:---|
| POST | `/api/auth/register` | Register user baru | ✅ |
| POST | `/api/auth/login` | Login (return JWT) | ✅ |
| GET | `/api/auth/me` | Get current user profile | ✅ |

### Categories
| Method | Endpoint | Deskripsi | Status |
|:---|:---|:---|:---|
| GET | `/api/categories` | List semua kategori | ✅ |

### Campaigns
| Method | Endpoint | Deskripsi | Status |
|:---|:---|:---|:---|
| GET | `/api/campaigns` | List kampanye (filter, search, pagination) | ✅ |
| GET | `/api/campaigns/:id` | Detail kampanye | ✅ |
| GET | `/api/campaigns/:id/donors` | List donatur kampanye | ✅ |

### Donations
| Method | Endpoint | Deskripsi | Status |
|:---|:---|:---|:---|:
| POST | `/api/donations` | Buat donasi (trigger Tripay) | ✅ |
| GET | `/api/donations` | Riwayat donasi user | ✅ |
| GET | `/api/donations/:id` | Detail donasi + status bayar | ✅ |
| GET | `/api/donations/recent` | Donasi terbaru (public) | ✅ |

### Transactions (Tripay)
| Method | Endpoint | Deskripsi | Status |
|:---|:---|:---|:---|
| POST | `/api/transactions/callback` | Webhook dari Tripay | ✅ |
| GET | `/api/transactions/check/:orderId` | Cek status transaksi | ✅ |
| GET | `/api/transactions` | List semua transaksi (admin) | ✅ |

### Withdrawals
| Method | Endpoint | Deskripsi | Status |
|:---|:---|:---|:---|
| POST | `/api/withdrawals` | Request pencairan (admin) | ✅ |
| GET | `/api/withdrawals` | List pencairan (admin) | ✅ |
| PUT | `/api/withdrawals/:id` | Approve/Reject (admin) | ✅ |

### Notifications
| Method | Endpoint | Deskripsi | Status |
|:---|:---|:---|:---|
| GET | `/api/notifications` | List notifikasi user | ✅ |
| PUT | `/api/notifications/:id/read` | Tandai dibaca | ✅ |
| PUT | `/api/notifications/read-all` | Tandai semua dibaca | ✅ |

### Stats
| Method | Endpoint | Deskripsi | Status |
|:---|:---|:---|:---|
| GET | `/api/stats` | Dashboard statistik | ✅ |

### Squads (🆕 Squad Donasi)
| Method | Endpoint | Deskripsi | Status |
|:---|:---|:---|:---|
| POST | `/api/squads` | Buat squad untuk kampanye | ✅ |
| GET | `/api/squads/:code` | Detail squad via invite code | ✅ |
| POST | `/api/squads/:code/join` | Bergabung ke squad | ✅ |
| GET | `/api/squads/:id` | Detail squad + leaderboard | ✅ |
| GET | `/api/squads/campaign/:id` | List squad dari kampanye | ✅ |

---

## Integrasi Tripay

**Status:** sudah diimplementasikan

### Konfigurasi (`.env`)
```env
TRIPAY_API_KEY=your_tripay_api_key
TRIPAY_PRIVATE_KEY=your_tripay_private_key
TRIPAY_MERCHANT_CODE=your_merchant_code
TRIPAY_BASE_URL=https://tripay.co.id/api-sandbox
```

### Payment Methods
| Method | Tripay Code | Deskripsi |
|:---|:---|:---|
| QRIS | `QRIS` | Scan QR code (GoPay, OVO, DANA, LinkAja, dll) |
| Bank Transfer | `BCAVA` | BCA Virtual Account |
| Bank Transfer | `BNIVA` | BNI Virtual Account |
| Bank Transfer | `BRIVA` | BRI Virtual Account |
| Bank Transfer | `MANDIRIVA` | Mandiri Virtual Account |
| Bank Transfer | `BSIVA` | BSI Virtual Account |

### Alur Pembayaran (Tripay)
1. User pilih kampanye & jumlah donasi
2. Backend create record `donations` + `transactions` (status: pending)
3. Backend call Tripay API `POST /transaction/create` (closed transaction)
4. Tripay return: QR code URL (QRIS) atau VA number (bank transfer)
5. Backend return ke frontend → tampilkan QR/VA ke user
6. User bayar via scan QR atau transfer ke VA
7. Tripay kirim webhook ke `POST /api/transactions/callback`
8. Backend verify signature, update status donation & transaction
9. Backend update `current_amount` di campaign
10. Backend create notification untuk user

---

## 📱 Flutter App — Screens yang Tersedia

| Screen | Status | Fitur |
|:---|:---|:---|
| `splash_screen.dart` | ✅ | Animation splash with sound, auto-login check |
| `login_screen.dart` | ✅ | Login dengan validasi, error handling |
| `register_screen.dart` | ✅ | Register (nama, email, password, phone) |
| `home_screen.dart` | ✅ | 4 Tabs: Beranda, Jelajah, Riwayat, Profil |
| `campaign_detail_screen.dart` | ✅ | Detail kampanye, progress bar, donasi, **squad section** |
| `donate_screen.dart` | ✅ | Form donasi, preset amounts, anonymous toggle |
| `payment_screen.dart` | ✅ | Tampilan QR code / VA number |
| `notification_screen.dart` | ✅ | List notifikasi user |
| `squad_detail_screen.dart` | ✅ | 🆕 Detail squad, leaderboard, join/share |
| `create_squad_screen.dart` | ✅ | 🆕 Form buat squad, preset target, invite code |

### Tab Home (`home_screen.dart`)
| Tab | Deskripsi |
|:---|:---|
| **Beranda** | Header greeting, kategori chips, kampanye terbaru |
| **Jelajah** | Search & filter kampanye, pagination |
| **Riwayat** | Donasi pribadi (status, jumlah, waktu) |
| **Profil** | Data user, logout, menu items |

### State Management (Flutter)
| Provider | Status | Fitur |
|:---|:---|:---|
| `AuthProvider` | ✅ | Login, register, logout, get profile |
| `CampaignProvider` | ✅ | Load campaigns, categories, detail |
| `DonationProvider` | ✅ | Create donation, load history |
| `SquadProvider` | ✅ | 🆕 Create/join squad, load squads, leaderboard |

---

## 🌐 Website — Halaman yang Tersedia

| Halaman | Status | Fitur |
|:---|:---|:---|
| `index.html` | ✅ | Landing page + stats + campaign list + recent donations |
| `campaigns.html` | ✅ | List semua kampanye + search + filter kategori |
| `campaign-detail.html` | ✅ | Detail kampanye + form donasi |
| `donate.html` | ✅ | Form donasi (jumlah, pesan, metode) |
| `payment.html` | ✅ | Tampilan QR/VA + countdown timer |
| `payment-status.html` | ✅ | Cek status pembayaran |
| `login.html` | ✅ | Form login dengan validasi |
| `register.html` | ✅ | Form register |
| `dashboard.html` | ✅ | Dashboard donatur (riwayat donasi) |
| `admin/index.html` | ✅ | Dashboard admin (statistik) |
| `admin/campaigns.html` | ✅ | CRUD kampanye |
| `admin/transactions.html` | ✅ | List transaksi |
| `admin/withdrawals.html` | ✅ | Kelola pencairan dana |
| `squad.html` | ✅ | Halaman detail squad donasi |

### Design System (Website)
Menggunakan standar **UI/UX Pro Max Ver 3** (Premium Glassmorphism) **yang telah dimodernisasi menggunakan Tailwind CSS (Mobile-First)**.
| Komponen | Nilai |
|:---|:---|
| **Warna Utama** | `#10B981` (Emerald Green) & Premium Glow |
| **Gradient** | `#059669 → #34D399` |
| **Font** | Inter (Google Fonts) — diperbarui dari Plus Jakarta Sans |
| **Background** | Premium Mesh Gradient (`premium-mesh-bg` class) |
| **Border Radius** | 12px (rounded) hingga 24px |
| **Shadow & Efek** | `0 4px 6px rgba(0,0,0,0.07)`, Glassmorphism, backdrop-blur |
| **CSS Files** | `21st-premium.css` (tokens) + `style.css` (components) |

---

## 🔧 Konfigurasi Backend

### Dependencies (`package.json`)
| Package | Version | Fungsi |
|:---|:---|:---|
| express | ^4.19.2 | Web framework |
| sequelize | ^6.37.3 | ORM MySQL |
| mysql2 | ^3.10.0 | MySQL driver |
| cors | ^2.8.5 | CORS middleware |
| dotenv | ^16.4.5 | Environment variables |
| jsonwebtoken | ^9.0.2 | JWT auth |
| bcryptjs | ^2.4.3 | Password hashing |
| axios | ^1.7.2 | HTTP client |
| joi | ^17.13.1 | Validation |
| multer | ^1.4.5 | File upload |
| morgan | ^1.10.0 | Logging |
| helmet | ^8.x | 🆕 HTTP security headers |
| express-rate-limit | ^7.x | 🆕 Rate limiting |

### Environment Variables (`.env`)
```env
# Server
PORT=3000
NODE_ENV=development

# Database (MySQL via XAMPP)
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

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:5500

# 🆕 Security: Allowed origins for CORS
ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
```

### 🔒 Security Middleware (Diperbarui: 13 Mei 2026)
| Middleware | Fungsi |
|:---|:---|
| `helmet` | Mengamankan HTTP headers (CSP, HSTS, X-Frame, dll) |
| `express-rate-limit` | Membatasi request: 10/15min (auth), 100/15min (API umum) |
| `cors` | Membatasi origin berdasarkan `ALLOWED_ORIGINS` env |
| `escapeHTML()` | Sanitasi input di frontend untuk mencegah XSS |
| Error handler | Tidak membocorkan stack trace di production |

---

## 🚀 Cara Menjalankan

### Backend
```bash
cd backend
npm install
npm run dev  # atau npm start
```
Backend berjalan di: `http://localhost:3000`

### Website
```bash
# Gunakan Live Server di VS Code atau
npx serve website
```
Website berjalan di: `http://localhost:5500`

### Flutter App
```bash
cd Aplikasi/donaria
flutter pub get
flutter run
```

---

## ✅ Checklist Status

| Komponen | Status | Catatan |
|:---|:---|:---|
| **Database** | ✅ | 8 tabel, seed data lengkap |
| **Backend API** | ✅ | 7 controllers, 7 routes, middleware, Tripay service |
| **Website Frontend** | ✅ | 12 halaman HTML, CSS design system, JS API helper |
| **Flutter App** | ✅ | 10 screens, 4 providers, 6 models, 7 widgets |
| **Auth System** | ✅ | JWT, register, login, logout, profile |
| **Payment Gateway** | ✅ | Tripay (QRIS + Bank Transfer) |
| **Admin Panel** | ✅ | Dashboard, campaigns, transactions, withdrawals |
| **Notification** | ✅ | Get, read, mark all read |
| **Seed Data** | ✅ | 8 categories + admin user |
| **Security Hardening** | ✅ | Helmet, rate limit, CORS, XSS protection |
| **MCP Integration** | ✅ | Stitch server terkonfigurasi |
| **Design System Ver 3** | ✅ | Inter font, Premium Mesh Background |
| **Squad Donasi** | ✅ | Backend, Web, dan Flutter App selesai |

---

## ⚠️ Yang Belum Dikerjakan / Perlu Action

### Prioritas Tinggi
| Komponen | Status | Catatan |
|:---|:---|:---|
| **Tripay API Key** | ⚠️ Need setup | Isi kunci API di `.env` |
| **Database Setup** | ⚠️ Need run | Jalankan `npm run seed` untuk seed data |
| **Squad Donasi (Mobile)** | ✅ Done | Model, Provider, 2 Screens, Widget, Routes, share_plus |

### Testing
- [ ] Test semua API endpoints via Postman/Thunder Client
- [ ] Test payment flow (QRIS & VA) di Tripay sandbox
- [ ] Test webhook callback dari Tripay
- [ ] Test Flutter app di emulator/device
- [ ] Test website di browser (responsive)
- [ ] Test rate limiter pada login endpoint
- [ ] Test CORS restriction dari origin yang tidak diizinkan

### Deployment
- [ ] Setup database production (MySQL)
- [ ] Setup domain & hosting (website + backend)
- [ ] Setup SSL/HTTPS
- [ ] Konfigurasi Tripay production
- [ ] Setup monitoring & logging
- [ ] Ganti `JWT_SECRET` dengan key yang kuat
- [ ] Set `NODE_ENV=production` di server

---

## Catatan penting

1. **File MD lama (SDLC, AI NEXT) tidak aktif** — Dokumen tersebut memuat "rencana" atau "status sebelum implementasi". Dokumen ini (`Projek_sekarang.md`) yang **berlaku saat ini**.

2. **Semua komponen inti sudah diimplementasikan** — Jika MD menyebut "BELUM dibuat", itu adalah peninggalan dari fase perencanaan.

3. **Tripay API key perlu diisi** — File `.env` masih berisi placeholder. Isi dengan kunci sandbox Tripay untuk testing pembayaran.

4. **Seed data tersedia** — 8 kategori + 1 admin user sudah siap setelah `npm run seed`.

5. **Security sudah diperkuat** — Helmet, rate limiting, CORS, dan XSS protection sudah aktif sejak 13 Mei 2026.

6. **Design System Ver 3 aktif** — Semua halaman sudah menggunakan font Inter dan Premium Mesh Background.

7. **MCP Stitch tersedia** — Server Stitch terkonfigurasi di `mcp.json` untuk AI-driven design generation.

8. **Fitur Squad Donasi (Selesai)** — Model database, API backend, UI Web, dan Flutter App sudah lengkap.

---

*Dokumen ini dibuat untuk mencerminkan status project saat ini.*  
*Terakhir diupdate: 15 Mei 2026*

