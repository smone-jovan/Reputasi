# 🤖 README AI NEXT — Instruksi Lanjutan untuk Model AI Berikutnya

> **⚠️ PENGUMUMAN PENTING (UPDATE: APRIL 2026)**
> Dokumen ini adalah dokumentasi panduan AI awal.
> Untuk melihat status terkini dan hasil implementasi (termasuk UI/UX terbaru dengan 21st-premium.css), **silakan merujuk ke file `Projek_sekarang.md`**.

> Dokumen ini berisi konteks lengkap dan instruksi untuk melanjutkan pengembangan
> **Donaria (Aplikasi Donasi Online)** jika sesi AI sebelumnya sudah ke limit.

---

## 📌 Status Saat Ini

### Yang Sudah Selesai ✅
- [x] ERD (Entity Relationship Diagram) — 8 entitas
- [x] Dokumen SDLC lengkap (`Readme SDLC.MD`)
- [x] Implementation Plan dengan pilihan user
- [x] Flutter project `donaria` sudah di-create (`Aplikasi/donaria/`)
- [x] Backend Express.js lengkap (8 models, 7 controllers, 7 routes, middleware, Tripay service, seed data)
- [x] Website Frontend lengkap (12 halaman HTML, CSS design system 21st-premium.css, JS API helper)
- [x] Flutter app screens & API integration

### Yang Belum Dikerjakan ❌
- [ ] Isi kunci API Tripay di `.env` (masih placeholder)
- [ ] Testing end-to-end & deployment

---

## 🎯 Pilihan yang Sudah Dikonfirmasi User

| Komponen | Pilihan | Detail |
|:---|:---|:---|
| **Database** | MySQL | XAMPP lokal, phpMyAdmin |
| **Payment Gateway** | Tripay | QRIS + Bank Transfer, sandbox dulu |
| **Website** | HTML/CSS/JS | Vanilla, tanpa framework, mudah |
| **Mobile App** | Flutter | Project `donaria` sudah ada |
| **Backend** | Express.js (Node.js) | REST API, Sequelize ORM |

---

## 📁 Struktur Project

```
d:\code_xI\Reputasi\
├── Aplikasi/
│   └── donaria/              # Flutter Mobile App (sudah dibuat)
│       ├── lib/
│       │   └── main.dart     # Entry point (default)
│       ├── pubspec.yaml
│       └── ...
│
├── website/                   # Website Frontend (BELUM dibuat)
│   ├── index.html            # Halaman utama
│   ├── campaigns.html        # List kampanye
│   ├── campaign-detail.html  # Detail kampanye
│   ├── donate.html           # Form donasi
│   ├── payment.html          # Halaman pembayaran (QR/VA)
│   ├── login.html            # Login
│   ├── register.html         # Register
│   ├── dashboard.html        # Dashboard donatur
│   ├── admin/                # Halaman admin
│   │   ├── index.html
│   │   ├── campaigns.html
│   │   ├── transactions.html
│   │   └── withdrawals.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js           # Main app logic
│   │   ├── api.js           # API calls helper
│   │   ├── auth.js          # Auth logic
│   │   └── payment.js       # Payment logic
│   └── assets/
│       └── images/
│
├── backend/                   # Backend API (BELUM dibuat)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js   # MySQL connection
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
│   │   │   ├── Campaign.js
│   │   │   ├── Category.js
│   │   │   ├── CampaignImage.js
│   │   │   ├── Donation.js
│   │   │   ├── Transaction.js
│   │   │   ├── Withdrawal.js
│   │   │   └── Notification.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── campaignRoutes.js
│   │   │   ├── categoryRoutes.js
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
│   │   └── utils/
│   │       └── helpers.js
│   ├── package.json
│   ├── .env
│   └── server.js             # Entry point
│
├── Readme SDLC.MD             # Dokumen SDLC (✅ sudah dibuat)
├── readme ai next.MD          # File ini
└── README.md
```

---

## 🗄️ Database Schema

Database MySQL bernama `donaria` dengan 8 tabel:

1. **users** — Data pengguna (admin & donatur)
2. **categories** — Kategori kampanye
3. **campaigns** — Program donasi
4. **campaign_images** — Galeri foto kampanye
5. **donations** — Record donasi
6. **transactions** — Detail pembayaran (QRIS/VA)
7. **withdrawals** — Pencairan dana
8. **notifications** — Notifikasi user

> SQL schema lengkap ada di bagian **Lampiran** file `Readme SDLC.MD`.

---

## 🔌 API Endpoints yang Harus Dibuat

### Auth
```
POST   /api/auth/register        # Register user baru
POST   /api/auth/login            # Login (return JWT)
GET    /api/auth/me               # Get current user profile
PUT    /api/auth/profile          # Update profile
```

### Categories
```
POST   /api/categories            # Create kategori (admin)
GET    /api/categories            # List semua kategori
GET    /api/categories/:id        # Detail kategori
PUT    /api/categories/:id        # Update kategori (admin)
DELETE /api/categories/:id        # Delete kategori (admin)
```

### Campaigns
```
POST   /api/campaigns             # Create kampanye (admin)
GET    /api/campaigns             # List kampanye (filter, search, pagination)
GET    /api/campaigns/:id         # Detail kampanye
PUT    /api/campaigns/:id         # Update kampanye (admin)
DELETE /api/campaigns/:id         # Soft delete kampanye (admin)
GET    /api/campaigns/:id/donors  # List donatur kampanye
```

### Donations
```
POST   /api/donations             # Buat donasi (trigger Tripay)
GET    /api/donations             # Riwayat donasi user
GET    /api/donations/:id         # Detail donasi + status bayar
GET    /api/donations/recent      # Donasi terbaru (public)
```

### Transactions (Tripay)
```
POST   /api/transactions/callback # Webhook dari Tripay
GET    /api/transactions/:id      # Cek status transaksi
GET    /api/transactions          # List semua transaksi (admin)
```

### Withdrawals
```
POST   /api/withdrawals           # Request pencairan (admin)
GET    /api/withdrawals           # List pencairan (admin)
PUT    /api/withdrawals/:id       # Approve/Reject (super admin)
```

### Notifications
```
GET    /api/notifications         # List notifikasi user
PUT    /api/notifications/:id/read    # Tandai dibaca
PUT    /api/notifications/read-all    # Tandai semua dibaca
```

---

## 💳 Integrasi Tripay

### Konfigurasi
```
TRIPAY_API_KEY=your_api_key
TRIPAY_PRIVATE_KEY=your_private_key
TRIPAY_MERCHANT_CODE=your_merchant_code
TRIPAY_BASE_URL=https://tripay.co.id/api-sandbox  (sandbox)
TRIPAY_CALLBACK_URL=https://yourdomain.com/api/transactions/callback
```

### Alur Pembayaran
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

### Tripay API Reference
```
# Daftar channel pembayaran
GET  /merchant/payment-channel

# Buat transaksi closed
POST /transaction/create
Body: {
  method: "QRIS" | "BRIVA" | "BCAVA" | "BNIVA" | "MANDIRIVA",
  merchant_ref: "ORDER-123",
  amount: 100000,
  customer_name: "Budi",
  customer_email: "budi@email.com",
  customer_phone: "081234567890",
  order_items: [{ name: "Donasi Kampanye XYZ", price: 100000, quantity: 1 }],
  callback_url: "https://yourdomain.com/api/transactions/callback",
  return_url: "https://yourdomain.com/payment/success",
  signature: HMAC_SHA256(merchant_code + merchant_ref + amount)
}

# Cek status transaksi
GET /transaction/detail?reference=T123456
```

---

## 🎨 Flutter App — Screens yang Perlu Dibuat

```
lib/
├── main.dart
├── config/
│   ├── api_config.dart        # Base URL, endpoints
│   └── theme.dart             # App theme (colors, fonts)
├── models/
│   ├── user.dart
│   ├── campaign.dart
│   ├── category.dart
│   ├── donation.dart
│   └── transaction.dart
├── services/
│   ├── api_service.dart       # HTTP client (Dio)
│   ├── auth_service.dart      # Login, register, token
│   └── payment_service.dart   # Tripay payment flow
├── providers/
│   ├── auth_provider.dart
│   ├── campaign_provider.dart
│   └── donation_provider.dart
├── screens/
│   ├── splash_screen.dart
│   ├── login_screen.dart
│   ├── register_screen.dart
│   ├── home_screen.dart
│   ├── campaign_list_screen.dart
│   ├── campaign_detail_screen.dart
│   ├── donate_screen.dart
│   ├── payment_screen.dart        # Show QR/VA
│   ├── payment_success_screen.dart
│   ├── donation_history_screen.dart
│   ├── profile_screen.dart
│   └── notification_screen.dart
├── widgets/
│   ├── campaign_card.dart
│   ├── donation_item.dart
│   ├── category_chip.dart
│   ├── progress_bar.dart
│   ├── loading_widget.dart
│   └── custom_button.dart
└── utils/
    ├── constants.dart
    └── formatters.dart       # Currency, date formatters
```

### Flutter Dependencies (tambah di pubspec.yaml)
```yaml
dependencies:
  flutter:
    sdk: flutter
  dio: ^5.4.0              # HTTP client
  provider: ^6.1.0         # State management
  shared_preferences: ^2.2.0  # Local storage
  cached_network_image: ^3.3.0  # Image caching
  flutter_secure_storage: ^9.0.0  # Secure token storage
  intl: ^0.19.0            # Date/number formatting
  qr_flutter: ^4.1.0       # QR code display
  url_launcher: ^6.2.0     # Open URLs
  shimmer: ^3.0.0          # Loading shimmer effect
  fluttertoast: ^8.2.0     # Toast messages
  image_picker: ^1.0.0     # Image upload
  google_fonts: ^6.1.0     # Modern typography
```

---

## 🌐 Website — Halaman yang Perlu Dibuat

| File | Fungsi | Prioritas |
|:---|:---|:---|
| `index.html` | Landing page + list kampanye terbaru | 🔴 Tinggi |
| `campaigns.html` | List semua kampanye + search/filter | 🔴 Tinggi |
| `campaign-detail.html` | Detail kampanye + tombol donasi | 🔴 Tinggi |
| `donate.html` | Form donasi (jumlah, pesan, metode) | 🔴 Tinggi |
| `payment.html` | Tampilan QR/VA + countdown | 🔴 Tinggi |
| `login.html` | Form login | 🔴 Tinggi |
| `register.html` | Form register | 🔴 Tinggi |
| `dashboard.html` | Dashboard donatur (riwayat) | 🟡 Sedang |
| `admin/index.html` | Dashboard admin (statistik) | 🟡 Sedang |
| `admin/campaigns.html` | CRUD kampanye | 🟡 Sedang |
| `admin/transactions.html` | List transaksi | 🟡 Sedang |
| `admin/withdrawals.html` | Kelola pencairan | 🟢 Rendah |

### Design System Website
Menggunakan standar **21st.dev / UI-UX Pro Max** (Premium Glassmorphism).
- **Font:** Inter atau Poppins (Google Fonts)
- **Warna utama:** Hijau (#10B981) & Premium Glow
- **Warna sekunder:** Emerald gradient (#059669 → #34D399)
- **Background:** Light mode (#F9FAFB), dark card (#1F2937), orb glow effects
- **Border radius:** 12px hingga 24px (modern rounded)
- **Shadow:** Soft shadow (0 4px 6px rgba(0,0,0,0.07)), Glassmorphism, backdrop-blur

---

## 📋 Urutan Pengerjaan (Step-by-Step)

### Tahap 1: Backend Setup
```
1. mkdir backend && cd backend
2. npm init -y
3. npm install express sequelize mysql2 cors dotenv jsonwebtoken bcryptjs
   multer joi express-validator axios
4. Setup database connection (config/database.js)
5. Buat models (Sequelize)
6. Buat migrations → jalankan untuk create tabel
7. Buat seed data (kategori default, admin user)
```

### Tahap 2: Backend API
```
1. Auth endpoints (register, login, me)
2. Category CRUD
3. Campaign CRUD
4. Donation + Tripay integration
5. Transaction webhook handler
6. Withdrawal CRUD
7. Notification system
8. Testing semua endpoint via Postman
```

### Tahap 3: Website Frontend
```
1. Setup HTML boilerplate + CSS design system
2. Landing page (index.html)
3. Login & Register pages
4. Campaign list & detail pages
5. Donation form & payment page
6. Dashboard donatur
7. Admin pages
8. Responsive testing
```

### Tahap 4: Flutter App
```
1. Setup project structure & dependencies
2. Theme & design system
3. API service layer
4. Auth screens (login, register)
5. Home screen + campaign list
6. Campaign detail + donate
7. Payment screen (QR/VA display)
8. History & profile screens
9. Push notification (opsional)
10. Testing di emulator & device
```

---

## ⚠️ Catatan Penting untuk AI Berikutnya

1. **Jangan ulangi** apa yang sudah dibuat — cek status di atas
2. **Tanyakan user** mau mulai dari tahap mana (backend/website/flutter)
3. File **Readme SDLC.MD** berisi dokumentasi lengkap — jangan timpa
4. Flutter project sudah ada di `Aplikasi/donaria/` — jangan buat ulang
5. Gunakan **sandbox mode** Tripay untuk development
6. Database schema SQL ada di `Readme SDLC.MD` bagian Lampiran
7. User lebih suka **penjelasan bahasa Indonesia**
8. User preference: website yang **mudah dan sederhana** (vanilla HTML/CSS/JS)

---

## 🔗 Referensi

- [Tripay Documentation](https://tripay.co.id/developer)
- [Tripay API Sandbox](https://tripay.co.id/api-sandbox)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Sequelize v6 Docs](https://sequelize.org/docs/v6/)
- [Flutter Docs](https://docs.flutter.dev/)

---

*File ini dibuat otomatis oleh AI assistant.*
*Terakhir diperbarui: 14 April 2026 (Sesi ke-2)*
*Sesi 1: Conversation ID 180c5ec1-92d0-47e2-9213-64523f63d992 (ERD, SDLC, Backend)*
*Sesi 2: Conversation ID 4603a5dd-546b-4187-86c0-f1c2ef2f4a09 (Website Frontend)*
