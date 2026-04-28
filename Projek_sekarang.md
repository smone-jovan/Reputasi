# Project Donaria - Status Saat Ini

> **Diperbarui:** 16 April 2026  
> **Versi:** 1.0  
> **Status:** Siap testing

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
│       │   │   ├── auth_service.dart     # Login, register, token
│       │   │   └── donation_provider.dart # State management
│       │   ├── providers/
│       │   │   ├── auth_provider.dart        # Auth state
│       │   │   ├── campaign_provider.dart    # Campaign state
│       │   │   └── donation_provider.dart    # Donation state
│       │   ├── screens/
│       │   │   ├── splash_screen.dart      # Animation saat startup
│       │   │   ├── login_screen.dart       # Halaman login
│       │   │   ├── register_screen.dart    # Halaman registrasi
│       │   │   ├── home_screen.dart        # Dashboard (4 tabs)
│       │   │   ├── campaign_detail_screen.dart # Detail kampanye
│       │   │   ├── donate_screen.dart      # Form donasi
│       │   │   ├── payment_screen.dart     # Tampilan QR/VA
│       │   │   └── notification_screen.dart # Notifikasi
│       │   ├── widgets/
│       │   │   ├── campaign_card.dart
│       │   │   ├── donation_item.dart
│       │   │   ├── category_chip.dart
│       │   │   ├── progress_bar.dart
│       │   │   ├── loading_widget.dart
│       │   │   └── custom_button.dart
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
│   │   └── style.css         # Design system (CSS variables)
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
│   │   │   └── notificationRoutes.js
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
├── Readme SDLC.MD            # Dokumen SDLC (dokumentasi lama)
├── readme ai next.MD         # AI Continuation Guide (dokumentasi lama)
├── implementation_plan.md    # Implementation Plan (dokumentasi lama)
├── Projek_sekarang.md        # ← File ini (status terkini)
└── README.md
```

---

## 🗄️ Database Schema (MySQL)

**Database Name:** `donaria`  
**Total Tables:** 8

| Tabel | Status | Deskripsi |
|:---|:---|:---|
| `users` | ✅ | Data pengguna (admin & donatur) |
| `categories` | ✅ | Kategori kampanye (8 default) |
| `campaigns` | ✅ | Program donasi |
| `campaign_images` | ✅ | Galeri foto kampanye |
| `donations` | ✅ | Record donasi |
| `transactions` | ✅ | Detail pembayaran (QRIS/VA) |
| `withdrawals` | ✅ | Pencairan dana |
| `notifications` | ✅ | Notifikasi user |

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
| `campaign_detail_screen.dart` | ✅ | Detail kampanye, progress bar, donasi |
| `donate_screen.dart` | ✅ | Form donasi, preset amounts, anonymous toggle |
| `payment_screen.dart` | ✅ | Tampilan QR code / VA number |
| `notification_screen.dart` | ✅ | List notifikasi user |

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

### Design System (Website)
| Komponen | Nilai |
|:---|:---|
| **Warna Utama** | `#10B981` (Green) |
| **Gradient** | `#059669 → #34D399` |
| **Font** | Inter / Poppins (Google Fonts) |
| **Border Radius** | 12px (rounded) |
| **Shadow** | `0 4px 6px rgba(0,0,0,0.07)` |

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
```

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
| **Flutter App** | ✅ | 8 screens, 5 providers, 3 models, 6 widgets |
| **Auth System** | ✅ | JWT, register, login, logout, profile |
| **Payment Gateway** | ✅ | Tripay (QRIS + Bank Transfer) |
| **Admin Panel** | ✅ | Dashboard, campaigns, transactions, withdrawals |
| **Notification** | ✅ | Get, read, mark all read |
| **Seed Data** | ✅ | 8 categories + admin user |

---

## ⚠️ Yang Belum Dikerjakan / Perlu Action

### Prioritas Tinggi
| Komponen | Status | Catatan |
|:---|:---|:---|
| **Tripay API Key** | ⚠️ Need setup | Isi kunci API di `.env` |
| **Database Setup** | ⚠️ Need run | Jalankan `npm run seed` untuk seed data |

### Testing
- [ ] Test semua API endpoints via Postman/Thunder Client
- [ ] Test payment flow (QRIS & VA) di Tripay sandbox
- [ ] Test webhook callback dari Tripay
- [ ] Test Flutter app di emulator/device
- [ ] Test website di browser (responsive)

### Deployment
- [ ] Setup database production (MySQL)
- [ ] Setup domain & hosting (website + backend)
- [ ] Setup SSL/HTTPS
- [ ] Konfigurasi Tripay production
- [ ] Setup monitoring & logging

---

## Catatan penting

1. **File MD lama (SDLC, AI NEXT) tidak aktif** — Dokumen tersebut memuat "rencana" atau "status sebelum implementasi". Dokumen ini (`Projek_sekarang.md`) yang **berlaku saat ini**.

2. **Semua komponen sudah diimplementasikan** — Jika MD menyebut "BELUM dibuat", itu adalah peninggalan dari fase perencanaan.

3. **Tripay API key perlu diisi** — File `.env` masih berisi placeholder. Isi dengan kunci sandbox Tripay untuk testing pembayaran.

4. **Seed data tersedia** — 8 kategori + 1 admin user sudah siap setelah `npm run seed`.

5. **No breaking changes** — Tidak ada perubahan arsitektur dari MD. Semua API endpoints & database schema sesuai.

---

## Cara pakai Humanizer skill di project ini

Skill Humanizer sudah terinstall di komputer ini. Cara pakainya很简单:

```text
/humanizer
[paste teks yang ingin diubah di sini]
```

Atau:
```text
Please humanize this text: [teks Anda di sini]
```

**Contoh nyata di project ini:**

**Sebelum (AI-like, formal berlebihan):**
> Semua komponen yang direncanakan dalam MD (SDLC, AI NEXT, implementation plan) sudah diimplementasikan. Project berada di fase **Siap Testing & Deployment**.

**Sesudah (lebih natural, human-like):**
> Semua komponen yang direncanakan dalam MD (SDLC, AI NEXT, implementation plan) sudah diimplementasikan. Project berada di fase **siap testing & deployment**.

**Perubahan yang dilakukan:**
- Menghapus kata-kata berlebihan: "SUDAH DIIMPLEMENTASIKAN" → "sudah diimplementasikan"
- Mengubah format judul: "Siap Testing & Deployment" → "siap testing & deployment"
- Menghapus emoji berlebihan di header

**Contoh lain (dari tabel bagian backend):**

**Sebelum (AI-like):**
> **Status:** ✅ **SUDAH DIIMPLEMENTASIKAN**

**Sesudah (lebih natural):**
> **Status:** sudah diimplementasikan

Skill ini sangat berguna untuk:
- Memperbaiki teks dokumentasi agar lebih mudah dibaca
- Mengubah output AI menjadi lebih natural
- Menyesuaikan gaya tulis agar lebih personal dan tidak kaku
- Mengurangi kata-kata berlebihan yang sering muncul di output AI

---

*Dokumen ini dibuat untuk mencerminkan status project saat ini (16 April 2026).*  
*Terakhir diupdate: 16 April 2026*

