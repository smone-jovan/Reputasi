# 📋 SDLC — Donaria (Aplikasi Donasi Online)

> **⚠️ PENGUMUMAN PENTING (UPDATE: APRIL 2026)**
> Dokumen ini adalah dokumentasi *Software Development Life Cycle* (SDLC) awal.
> Untuk melihat status terkini dan hasil implementasi (termasuk UI/UX terbaru dengan 21st-premium.css), **silakan merujuk ke file `Projek_sekarang.md`**.

> Dokumen Software Development Life Cycle untuk platform donasi online **Donaria**
> yang mencakup Website dan Aplikasi Mobile dengan pembayaran via QRIS & Transfer Bank.

---

## 1. Analisis Kebutuhan

### A. Latar Belakang Masalah

Di Indonesia, kegiatan donasi dan penggalangan dana masih banyak dilakukan secara manual — melalui transfer langsung ke rekening pribadi, pengumpulan di masjid/gereja, atau media sosial tanpa sistem yang terstruktur. Cara ini menimbulkan beberapa masalah:

1. **Kurangnya transparansi** — Donatur tidak bisa memantau apakah dana mereka benar-benar sampai dan digunakan sesuai tujuan.
2. **Pencatatan manual** — Pengelola harus mencatat setiap donasi satu per satu, rentan kesalahan dan manipulasi.
3. **Jangkauan terbatas** — Kampanye donasi hanya menjangkau orang-orang di sekitar pengelola.
4. **Proses pembayaran rumit** — Donatur harus transfer manual, konfirmasi lewat chat, dan menunggu verifikasi manual.
5. **Tidak ada laporan terstruktur** — Sulit membuat laporan penggunaan dana yang akuntabel.

Platform donasi online seperti **Donaria** hadir untuk menyelesaikan masalah ini dengan menyediakan sistem yang transparan, otomatis, dan mudah diakses oleh siapa saja melalui website dan aplikasi mobile.

### B. Tujuan Aplikasi

| No | Tujuan | Deskripsi |
|:---|:---|:---|
| 1 | Memudahkan donasi | Donatur bisa berdonasi kapan saja, dari mana saja via QRIS atau Transfer Bank |
| 2 | Transparansi dana | Setiap donasi tercatat otomatis, progress kampanye bisa dipantau real-time |
| 3 | Otomatisasi pembayaran | Integrasi payment gateway Tripay untuk verifikasi otomatis |
| 4 | Menjangkau lebih luas | Kampanye donasi bisa diakses siapa saja lewat internet |
| 5 | Laporan akuntabel | Admin bisa generate laporan donasi dan pencairan dana |
| 6 | Multiplatform | Tersedia dalam bentuk Website dan Aplikasi Mobile (Android/iOS) |

### C. Pengguna Sistem

```
┌─────────────────────────────────────────────────────┐
│                  PENGGUNA SISTEM                    │
├─────────────────┬─────────────────┬─────────────────┤
│    👤 Guest     │   🧑 Donatur    │   👨‍💼 Admin     │
├─────────────────┼─────────────────┼─────────────────┤
│ Lihat kampanye  │ Semua hak Guest │ Semua hak       │
│ Lihat detail    │ + Register      │ Donatur         │
│ Cari kampanye   │ + Login         │ + Kelola        │
│                 │ + Donasi        │   kampanye      │
│                 │ + Riwayat       │ + Kelola        │
│                 │   donasi        │   kategori      │
│                 │ + Profil        │ + Lihat semua   │
│                 │ + Notifikasi    │   transaksi     │
│                 │                 │ + Pencairan     │
│                 │                 │   dana          │
│                 │                 │ + Dashboard     │
│                 │                 │   & Laporan     │
│                 │                 │ + Kelola user   │
└─────────────────┴─────────────────┴─────────────────┘
```

### D. Fitur Utama

#### 🔐 Autentikasi (Login/Register)
- Register dengan email & password
- Login (JWT token based authentication)
- Lupa password (reset via email)
- Profil pengguna (edit nama, foto, no HP)

#### 📝 CRUD Data
- **Kampanye Donasi** — Create, Read, Update, Delete (soft delete)
- **Kategori** — Kelola kategori kampanye (Bencana, Pendidikan, Kesehatan, dll)
- **Donasi** — Buat donasi, lihat detail, riwayat
- **User Management** — Admin kelola akun pengguna
- **Pencairan Dana** — Request & approval pencairan

#### 📊 Laporan
- Dashboard statistik (total donasi, jumlah donatur, kampanye aktif)
- Laporan per kampanye (progress, daftar donatur)
- Laporan transaksi per periode
- Export laporan (CSV/PDF)

#### 🔔 Notifikasi
- Notifikasi pembayaran berhasil/gagal
- Notifikasi kampanye baru
- Notifikasi pencairan dana
- Notifikasi sistem

#### ✨ Fitur Lainnya
- Pembayaran via QRIS (scan QR code)
- Pembayaran via Transfer Bank (Virtual Account)
- Donasi anonim (pilihan sembunyikan identitas)
- Share kampanye ke media sosial
- Search & filter kampanye
- Responsive design (mobile-friendly website)
- Real-time update progress donasi

---

## 2. Perencanaan

### A. Tools & Teknologi

#### Website

| Komponen | Teknologi | Alasan |
|:---|:---|:---|
| **Bahasa** | HTML, CSS, JavaScript | Mudah dipelajari, universal, ringan |
| **Styling** | CSS3 + Google Fonts | Desain modern tanpa dependency tambahan |
| **HTTP Client** | Fetch API / Axios | Komunikasi dengan backend API |
| **Icons** | Font Awesome / Material Icons | Ikon UI yang konsisten |
| **Hosting** | Niagahoster / Hostinger / Netlify | Hosting murah, lokal untuk Indonesia |

#### Aplikasi Mobile

| Komponen | Teknologi | Alasan |
|:---|:---|:---|
| **Framework** | Flutter (Dart) | Cross-platform (Android + iOS), UI cantik, performa native |
| **State Mgmt** | Provider / Riverpod | Manajemen state yang scalable |
| **HTTP Client** | Dio / http package | Komunikasi REST API |
| **Local Storage** | SharedPreferences / Hive | Cache data & token |
| **Project Name** | `donaria` | Sudah dibuat di `/Aplikasi/donaria/` |

#### Backend API

| Komponen | Teknologi | Alasan |
|:---|:---|:---|
| **Runtime** | Node.js (Express.js) | JavaScript ecosystem, non-blocking I/O |
| **ORM** | Sequelize | ORM matang untuk MySQL + migrasi |
| **Auth** | JSON Web Token (JWT) | Stateless authentication |
| **Validation** | Joi / Express-validator | Validasi input request |
| **File Upload** | Multer + Cloudinary | Upload gambar kampanye |

#### Database

| Komponen | Teknologi | Alasan |
|:---|:---|:---|
| **DBMS** | MySQL 8.0 | Mudah, banyak tutorial, gratis |
| **GUI** | phpMyAdmin / MySQL Workbench | Visual database management |
| **Local Server** | XAMPP / Laragon | Setup cepat MySQL lokal |

#### Payment Gateway

| Komponen | Teknologi | Alasan |
|:---|:---|:---|
| **Gateway** | Tripay | Murah, tanpa badan usaha, QRIS + VA |
| **Metode** | QRIS + Virtual Account | Dua metode pembayaran utama |
| **Mode** | Sandbox (dev) → Production | Testing aman sebelum live |

#### Tools Pengembangan

| Tool | Fungsi |
|:---|:---|
| VS Code | Code editor utama (website + backend) |
| Android Studio | Flutter development + emulator |
| Postman / Thunder Client | Testing API endpoints |
| Git + GitHub | Version control & kolaborasi |
| XAMPP / Laragon | Local MySQL server |
| Figma (opsional) | Desain UI/UX mockup |

### B. Timeline

```
MINGGU 1-2: Persiapan & Desain
├── Setup project (website, backend, database)
├── Desain ERD & migrasi database
├── Desain UI/UX (wireframe)
└── Setup Tripay sandbox

MINGGU 3-4: Backend Development
├── Implementasi Auth (register/login/JWT)
├── CRUD Campaigns & Categories
├── CRUD Donations
├── Integrasi Tripay (QRIS + Bank Transfer)
└── Webhook handler + notification system

MINGGU 5-6: Website Development
├── Halaman beranda (list kampanye)
├── Halaman detail kampanye
├── Form donasi + payment page
├── Dashboard donatur
├── Dashboard admin
└── Responsive & polishing

MINGGU 7-8: Mobile App Development (Flutter)
├── Setup Flutter project structure
├── Implementasi screens (home, detail, donasi)
├── Integrasi API backend
├── Payment flow (QRIS + Transfer)
└── Testing di device/emulator

MINGGU 9-10: Testing & Deployment
├── Unit testing backend
├── Integration testing payment flow
├── User acceptance testing
├── Bug fixing & optimization
├── Deployment ke hosting/server
└── Go live + monitoring
```

### C. Rencana Arsitektur (Konseptual)

```
┌──────────────────────────────────────────────────────────────────┐
│                        ARSITEKTUR SISTEM                         │
│                         DONARIA PLATFORM                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────┐        ┌──────────────────┐                   │
│   │   WEBSITE   │        │   MOBILE APP     │                   │
│   │  HTML/CSS/  │        │    Flutter        │                   │
│   │  JavaScript │        │   (Android/iOS)   │                   │
│   └──────┬──────┘        └────────┬─────────┘                   │
│          │     REST API (JSON)    │                              │
│          └───────────┬────────────┘                              │
│                      │                                           │
│                      ▼                                           │
│          ┌───────────────────────┐                               │
│          │    BACKEND SERVER     │                               │
│          │    Express.js         │                               │
│          │    (Node.js)          │                               │
│          │                       │                               │
│          │  ┌─────────────────┐  │                               │
│          │  │   Controllers   │  │                               │
│          │  │   Routes        │  │                               │
│          │  │   Middleware     │  │                               │
│          │  │   Services      │  │                               │
│          │  └─────────────────┘  │                               │
│          └───────┬───────┬───────┘                               │
│                  │       │                                        │
│          ┌───────┘       └────────┐                              │
│          ▼                        ▼                              │
│   ┌─────────────┐     ┌──────────────────┐                      │
│   │   MySQL     │     │  Tripay Payment  │                      │
│   │  Database   │     │    Gateway       │                      │
│   │             │     │                  │                      │
│   │  - Users    │     │  - QRIS          │                      │
│   │  - Campaign │     │  - Bank Transfer │                      │
│   │  - Donation │     │  - Webhook       │                      │
│   │  - dll      │     │                  │                      │
│   └─────────────┘     └──────────────────┘                      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Penjelasan Arsitektur:**
- Website (HTML/CSS/JS) dan Mobile App (Flutter) bertindak sebagai **client/frontend**
- Keduanya berkomunikasi dengan **Backend Server** melalui **REST API** (format JSON)
- Backend menggunakan **Express.js** di atas **Node.js** sebagai server
- Data disimpan di **MySQL Database**
- Pembayaran diproses melalui **Tripay Payment Gateway**
- Tripay mengirim **webhook** ke backend untuk konfirmasi pembayaran otomatis

---

## 3. Desain Sistem (Perancangan)

### A. Diagram Alur Sistem

#### Flowchart Utama — Alur Donasi

```
                        ┌─────────┐
                        │  START  │
                        └────┬────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  Buka Website  │
                    │  / Aplikasi    │
                    └────────┬───────┘
                             │
                             ▼
                   ┌─────────────────┐
                   │  Sudah Login?   │
                   └────┬───────┬────┘
                   Tidak│       │Ya
                        ▼       │
              ┌──────────────┐  │
              │ Login/       │  │
              │ Register     │  │
              └──────┬───────┘  │
                     │          │
                     ▼          ▼
              ┌──────────────────────┐
              │  Pilih Kampanye      │
              │  Donasi              │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Masukkan Jumlah     │
              │  Donasi & Pesan      │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Pilih Metode Bayar  │
              └────┬────────────┬────┘
                   │            │
            QRIS   │            │ Bank Transfer
                   ▼            ▼
          ┌────────────┐ ┌──────────────┐
          │ Tampilkan  │ │ Tampilkan    │
          │ QR Code    │ │ No. Virtual  │
          │            │ │ Account      │
          └─────┬──────┘ └──────┬───────┘
                │               │
                ▼               ▼
          ┌────────────────────────────┐
          │     User Bayar             │
          └────────────┬───────────────┘
                       │
                       ▼
          ┌────────────────────────────┐
          │  Tripay Kirim Webhook      │
          │  ke Backend                │
          └────────────┬───────────────┘
                       │
                       ▼
          ┌────────────────────────────┐
          │  Backend Update Status     │
          │  Donasi → "Berhasil"       │
          │  Update Progress Kampanye  │
          └────────────┬───────────────┘
                       │
                       ▼
          ┌────────────────────────────┐
          │  Kirim Notifikasi ke User  │
          │  "Donasi Berhasil!"        │
          └────────────┬───────────────┘
                       │
                       ▼
                  ┌─────────┐
                  │   END   │
                  └─────────┘
```

#### Diagram Use Case

```
┌──────────────────────────────────────────────────────────────────┐
│                       SISTEM DONARIA                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │   ┌─────────────────┐        ┌────────────────────┐     │   │
│  │   │ Register/Login  │        │ Kelola Kampanye    │     │   │
│  │   └────────┬────────┘        │ (CRUD)             │     │   │
│  │            │                  └─────────┬──────────┘     │   │
│  │            │                            │                │   │
│  │   ┌────────▼────────┐        ┌─────────▼──────────┐     │   │
│  │   │ Lihat Kampanye  │        │ Kelola Kategori    │     │   │
│  │   └────────┬────────┘        │ (CRUD)             │     │   │
│  │            │                  └─────────┬──────────┘     │   │
│  │   ┌────────▼────────┐                  │                │   │
│  │   │ Detail Kampanye │        ┌─────────▼──────────┐     │   │
│  │   └────────┬────────┘        │ Lihat Semua        │     │   │
│  │            │                  │ Transaksi          │     │   │
│  │   ┌────────▼────────┐        └─────────┬──────────┘     │   │
│  │   │ Buat Donasi     │                  │                │   │
│  │   └────────┬────────┘        ┌─────────▼──────────┐     │   │
│  │            │                  │ Kelola Pencairan   │     │   │
│  │   ┌────────▼────────┐        │ Dana               │     │   │
│  │   │ Bayar (QRIS/    │        └─────────┬──────────┘     │   │
│  │   │ Transfer)       │                  │                │   │
│  │   └────────┬────────┘        ┌─────────▼──────────┐     │   │
│  │            │                  │ Dashboard &        │     │   │
│  │   ┌────────▼────────┐        │ Laporan            │     │   │
│  │   │ Riwayat Donasi  │        └────────────────────┘     │   │
│  │   └────────┬────────┘                                   │   │
│  │            │                                             │   │
│  │   ┌────────▼────────┐                                   │   │
│  │   │ Notifikasi      │                                   │   │
│  │   └─────────────────┘                                   │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  👤 Donatur                                    👨‍💼 Admin         │
│  (Aktor Kiri)                                 (Aktor Kanan)     │
└──────────────────────────────────────────────────────────────────┘
```

**Daftar Use Case:**

| No | Use Case | Aktor | Deskripsi |
|:---|:---|:---|:---|
| UC-01 | Register | Donatur | Mendaftar akun baru |
| UC-02 | Login | Donatur, Admin | Masuk ke sistem |
| UC-03 | Lihat Kampanye | Donatur, Guest | Melihat daftar kampanye aktif |
| UC-04 | Detail Kampanye | Donatur, Guest | Melihat detail & progress kampanye |
| UC-05 | Buat Donasi | Donatur | Membuat donasi ke kampanye |
| UC-06 | Bayar | Donatur | Membayar via QRIS / Transfer Bank |
| UC-07 | Riwayat Donasi | Donatur | Melihat riwayat donasi pribadi |
| UC-08 | Notifikasi | Donatur, Admin | Menerima notifikasi sistem |
| UC-09 | Kelola Kampanye | Admin | CRUD kampanye donasi |
| UC-10 | Kelola Kategori | Admin | CRUD kategori kampanye |
| UC-11 | Lihat Transaksi | Admin | Melihat semua transaksi |
| UC-12 | Pencairan Dana | Admin | Request & kelola pencairan |
| UC-13 | Dashboard | Admin | Lihat statistik & laporan |

#### Diagram Activity — Proses Donasi

```
┌─────────┐    ┌─────────────┐    ┌──────────┐    ┌─────────┐
│ Donatur │    │   Sistem    │    │ Backend  │    │  Tripay │
└────┬────┘    └──────┬──────┘    └─────┬────┘    └────┬────┘
     │                │                  │              │
     │  Buka app/web  │                  │              │
     │───────────────▶│                  │              │
     │                │                  │              │
     │ Pilih kampanye │                  │              │
     │───────────────▶│                  │              │
     │                │  Request detail  │              │
     │                │─────────────────▶│              │
     │                │  Return data     │              │
     │                │◀─────────────────│              │
     │  Tampilkan     │                  │              │
     │◀───────────────│                  │              │
     │                │                  │              │
     │  Isi form      │                  │              │
     │  donasi        │                  │              │
     │───────────────▶│                  │              │
     │                │  Validasi &      │              │
     │                │  create donation │              │
     │                │─────────────────▶│              │
     │                │                  │ Create charge│
     │                │                  │─────────────▶│
     │                │                  │ Return QR/VA │
     │                │                  │◀─────────────│
     │                │  Tampilkan       │              │
     │                │  pembayaran      │              │
     │  QR / VA       │◀─────────────────│              │
     │◀───────────────│                  │              │
     │                │                  │              │
     │  Scan QR /     │                  │              │
     │  Transfer      │                  │              │
     │─────────────────────────────────────────────────▶│
     │                │                  │              │
     │                │                  │   Webhook    │
     │                │                  │◀─────────────│
     │                │                  │ Update DB    │
     │                │  Notifikasi      │              │
     │                │◀─────────────────│              │
     │  "Berhasil!"   │                  │              │
     │◀───────────────│                  │              │
     │                │                  │              │
```

#### Sequence Diagram — Pembayaran QRIS

```
Donatur          Website/App        Backend           Tripay          Bank/E-Wallet
   │                  │                │                │                │
   │ Pilih kampanye   │                │                │                │
   │─────────────────▶│                │                │                │
   │                  │                │                │                │
   │ Isi jumlah &     │                │                │                │
   │ pilih QRIS       │                │                │                │
   │─────────────────▶│                │                │                │
   │                  │ POST /donate   │                │                │
   │                  │───────────────▶│                │                │
   │                  │                │                │                │
   │                  │                │ Create Order   │                │
   │                  │                │ (QRIS)         │                │
   │                  │                │───────────────▶│                │
   │                  │                │                │                │
   │                  │                │ QR Code URL    │                │
   │                  │                │◀───────────────│                │
   │                  │                │                │                │
   │                  │ Return QR      │                │                │
   │                  │◀───────────────│                │                │
   │                  │                │                │                │
   │ Tampilkan QR     │                │                │                │
   │◀─────────────────│                │                │                │
   │                  │                │                │                │
   │ Scan & bayar via │                │                │                │
   │ banking app      │                │                │                │
   │──────────────────────────────────────────────────────────────────▶│
   │                  │                │                │                │
   │                  │                │                │ Payment OK     │
   │                  │                │                │◀───────────────│
   │                  │                │                │                │
   │                  │                │  Webhook       │                │
   │                  │                │  (callback)    │                │
   │                  │                │◀───────────────│                │
   │                  │                │                │                │
   │                  │                │ Update status  │                │
   │                  │                │ donation →     │                │
   │                  │                │ "success"      │                │
   │                  │                │                │                │
   │                  │ Notifikasi     │                │                │
   │                  │◀───────────────│                │                │
   │ "Donasi          │                │                │                │
   │  Berhasil!"      │                │                │                │
   │◀─────────────────│                │                │                │
   │                  │                │                │                │
```

#### Sequence Diagram — Pembayaran Transfer Bank (Virtual Account)

```
Donatur          Website/App        Backend           Tripay            Bank
   │                  │                │                │                │
   │ Pilih kampanye   │                │                │                │
   │─────────────────▶│                │                │                │
   │                  │                │                │                │
   │ Isi jumlah &     │                │                │                │
   │ pilih Bank BCA   │                │                │                │
   │─────────────────▶│                │                │                │
   │                  │ POST /donate   │                │                │
   │                  │───────────────▶│                │                │
   │                  │                │                │                │
   │                  │                │ Create Order   │                │
   │                  │                │ (VA BCA)       │                │
   │                  │                │───────────────▶│                │
   │                  │                │                │                │
   │                  │                │ VA Number +    │                │
   │                  │                │ Expiry         │                │
   │                  │                │◀───────────────│                │
   │                  │                │                │                │
   │                  │ Return VA info │                │                │
   │                  │◀───────────────│                │                │
   │                  │                │                │                │
   │ Tampilkan VA     │                │                │                │
   │ & instruksi      │                │                │                │
   │◀─────────────────│                │                │                │
   │                  │                │                │                │
   │ Transfer ke VA   │                │                │                │
   │ via ATM/mBanking │                │                │                │
   │──────────────────────────────────────────────────────────────────▶│
   │                  │                │                │                │
   │                  │                │                │ Payment OK     │
   │                  │                │                │◀───────────────│
   │                  │                │                │                │
   │                  │                │  Webhook       │                │
   │                  │                │  (callback)    │                │
   │                  │                │◀───────────────│                │
   │                  │                │                │                │
   │                  │                │ Update status  │                │
   │                  │                │                │                │
   │                  │ Notifikasi     │                │                │
   │                  │◀───────────────│                │                │
   │ "Donasi          │                │                │                │
   │  Berhasil!"      │                │                │                │
   │◀─────────────────│                │                │                │
   │                  │                │                │                │
```

### B. Desain Database (ERD)

#### ERD Sederhana — Donaria

```
┌─────────────────┐       ┌─────────────────────┐       ┌──────────────────┐
│     USERS       │       │     CAMPAIGNS       │       │   CATEGORIES     │
├─────────────────┤       ├─────────────────────┤       ├──────────────────┤
│ PK id           │       │ PK id               │       │ PK id            │
│    name         │       │ FK user_id ─────────┤───┐   │    name          │
│ UK email        │───┐   │ FK category_id ─────┤───┤──▶│ UK slug          │
│    password_hash│   │   │    title            │   │   │    icon          │
│    phone        │   │   │    short_description│   │   │    created_at    │
│    avatar_url   │   │   │    description      │   │   └──────────────────┘
│    role         │   │   │    target_amount    │   │
│    is_verified  │   │   │    current_amount   │   │
│    created_at   │   │   │    banner_image     │   │
│    updated_at   │   │   │    status           │   │
└────────┬────────┘   │   │    deadline         │   │
         │            │   │    created_at       │   │
         │            │   │    updated_at       │   │
         │            │   └──────────┬──────────┘   │
         │            │              │              │
         │            │              │              │
         │            └──────────────┤              │
         │                           │              │
         │     ┌─────────────────┐   │              │
         │     │   DONATIONS     │   │              │
         │     ├─────────────────┤   │              │
         │     │ PK id           │   │              │
         ├────▶│ FK user_id      │   │              │
         │     │ FK campaign_id ─┤───┘              │
         │     │    amount       │                  │
         │     │    message      │       ┌──────────────────────┐
         │     │    is_anonymous │       │  CAMPAIGN_IMAGES     │
         │     │    status       │       ├──────────────────────┤
         │     │    created_at   │       │ PK id                │
         │     │    updated_at   │       │ FK campaign_id       │
         │     └────────┬────────┘       │    image_url         │
         │              │                │    is_primary        │
         │              │                │    created_at        │
         │     ┌────────▼────────┐       └──────────────────────┘
         │     │  TRANSACTIONS   │
         │     ├─────────────────┤       ┌──────────────────────┐
         │     │ PK id           │       │    WITHDRAWALS       │
         │     │ FK donation_id  │       ├──────────────────────┤
         │     │ UK order_id     │       │ PK id                │
         │     │    payment_gw   │       │ FK campaign_id       │
         │     │    payment_method│      │ FK admin_id          │
         │     │    bank_code    │       │    amount            │
         │     │    qris_url     │       │    bank_name         │
         │     │    va_number    │       │    account_number    │
         │     │    gross_amount │       │    account_holder    │
         │     │    fee_amount   │       │    status            │
         │     │    net_amount   │       │    notes             │
         │     │    status       │       │    created_at        │
         │     │    gateway_ref  │       │    updated_at        │
         │     │    paid_at      │       └──────────────────────┘
         │     │    expired_at   │
         │     │    created_at   │
         │     │    updated_at   │
         │     └─────────────────┘
         │
         │     ┌─────────────────┐
         │     │  NOTIFICATIONS  │
         │     ├─────────────────┤
         │     │ PK id           │
         └────▶│ FK user_id      │
               │    title        │
               │    message      │
               │    type         │
               │    is_read      │
               │    created_at   │
               └─────────────────┘
```

**Relasi antar tabel:**

| Relasi | Tipe | Deskripsi |
|:---|:---|:---|
| USERS → CAMPAIGNS | One-to-Many | Satu admin bisa buat banyak kampanye |
| USERS → DONATIONS | One-to-Many | Satu donatur bisa buat banyak donasi |
| USERS → NOTIFICATIONS | One-to-Many | Satu user punya banyak notifikasi |
| CATEGORIES → CAMPAIGNS | One-to-Many | Satu kategori punya banyak kampanye |
| CAMPAIGNS → DONATIONS | One-to-Many | Satu kampanye menerima banyak donasi |
| CAMPAIGNS → CAMPAIGN_IMAGES | One-to-Many | Satu kampanye punya banyak gambar |
| CAMPAIGNS → WITHDRAWALS | One-to-Many | Satu kampanye bisa banyak pencairan |
| DONATIONS → TRANSACTIONS | One-to-One | Satu donasi punya satu transaksi pembayaran |

### C. Desain Tampilan

#### Wireframe Halaman Utama (Website)

```
┌──────────────────────────────────────────────────────────────────┐
│  🕌 DONARIA        Beranda  Kampanye  Tentang       [Login]     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│         ╔══════════════════════════════════════════╗             │
│         ║     MARI BERBAGI KEBAIKAN               ║             │
│         ║     Donasi mudah dan transparan          ║             │
│         ║                                          ║             │
│         ║     [Mulai Berdonasi]  [Lihat Kampanye]  ║             │
│         ╚══════════════════════════════════════════╝             │
│                                                                  │
│  ── Kampanye Terbaru ──────────────────────────────────────────  │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ [Gambar] │  │ [Gambar] │  │ [Gambar] │  │ [Gambar] │       │
│  │          │  │          │  │          │  │          │       │
│  │ Judul    │  │ Judul    │  │ Judul    │  │ Judul    │       │
│  │ kampanye │  │ kampanye │  │ kampanye │  │ kampanye │       │
│  │          │  │          │  │          │  │          │       │
│  │ ████░░░  │  │ ██████░  │  │ ████░░░  │  │ █░░░░░░  │       │
│  │ 60%      │  │ 85%      │  │ 55%      │  │ 15%      │       │
│  │          │  │          │  │          │  │          │       │
│  │ [Donasi] │  │ [Donasi] │  │ [Donasi] │  │ [Donasi] │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ── Statistik ──────────────────────────────────────────────     │
│                                                                  │
│     💰 Rp 150.5 Jt      👥 2,340         📋 45                 │
│     Total Donasi        Total Donatur    Kampanye Aktif         │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  © 2026 Donaria | Tentang | Kontak | Kebijakan Privasi          │
└──────────────────────────────────────────────────────────────────┘
```

#### Wireframe Halaman Detail Kampanye

```
┌──────────────────────────────────────────────────────────────────┐
│  🕌 DONARIA        Beranda  Kampanye  Tentang       [Login]     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────┐  ┌───────────────────────────┐  │
│  │                            │  │                           │  │
│  │                            │  │  Bantu Korban Banjir      │  │
│  │      [Banner Image]        │  │  Kalimantan Selatan       │  │
│  │                            │  │                           │  │
│  │                            │  │  Kategori: 🌊 Bencana     │  │
│  │                            │  │                           │  │
│  └────────────────────────────┘  │  ████████████░░░░ 75%     │  │
│                                   │                           │  │
│                                   │  Terkumpul:               │  │
│                                   │  Rp 75.000.000            │  │
│                                   │  dari Rp 100.000.000      │  │
│                                   │                           │  │
│                                   │  👥 234 Donatur           │  │
│                                   │  ⏰ 15 hari lagi          │  │
│                                   │                           │  │
│                                   │  ┌───────────────────┐   │  │
│                                   │  │  💚 DONASI SEKARANG│   │  │
│                                   │  └───────────────────┘   │  │
│                                   └───────────────────────────┘  │
│                                                                  │
│  ── Deskripsi ─────────────────────────────────────────────      │
│  Lorem ipsum dolor sit amet, consectetur adipiscing elit...      │
│                                                                  │
│  ── Donatur Terbaru ───────────────────────────────────────      │
│  👤 Anonim — Rp 500.000 — "Semoga membantu"                    │
│  👤 Budi S — Rp 100.000 — "Semangat!"                          │
│  👤 Anonim — Rp 1.000.000 — ""                                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### Wireframe Halaman Pembayaran

```
┌──────────────────────────────────────────────────────────────────┐
│  🕌 DONARIA                                          [← Kembali]│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    Pembayaran Donasi                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Kampanye: Bantu Korban Banjir Kalimantan Selatan        │   │
│  │  Jumlah  : Rp 100.000                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Pilih Metode Pembayaran:                                        │
│                                                                  │
│  ┌─ QRIS ──────────────────────────────────────────────────┐    │
│  │  ○ Scan QR Code (GoPay, OVO, DANA, LinkAja, dll)       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─ Transfer Bank (Virtual Account) ──────────────────────┐     │
│  │  ○ BCA Virtual Account                                 │     │
│  │  ○ BNI Virtual Account                                 │     │
│  │  ○ BRI Virtual Account                                 │     │
│  │  ○ Mandiri Virtual Account                             │     │
│  │  ○ BSI Virtual Account                                 │     │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│           ┌──────────────────────────┐                           │
│           │    BAYAR SEKARANG        │                           │
│           └──────────────────────────┘                           │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### Wireframe Tampilan QRIS

```
┌──────────────────────────────────────────────────────────────────┐
│  🕌 DONARIA                                          [← Kembali]│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                   Scan QR Code                                   │
│                                                                  │
│              ┌──────────────────────┐                            │
│              │                      │                            │
│              │    ┌────────────┐    │                            │
│              │    │            │    │                            │
│              │    │  QR CODE   │    │                            │
│              │    │  [Image]   │    │                            │
│              │    │            │    │                            │
│              │    └────────────┘    │                            │
│              │                      │                            │
│              └──────────────────────┘                            │
│                                                                  │
│              Jumlah: Rp 100.000                                  │
│              Order ID: TRX-20260414-001                          │
│                                                                  │
│              ⏰ Berlaku hingga: 14 Apr 2026, 10:30 WIB           │
│                                                                  │
│              Scan menggunakan:                                   │
│              GoPay • OVO • DANA • LinkAja                        │
│              ShopeePay • banking app lainnya                     │
│                                                                  │
│              ┌──────────────────────┐                            │
│              │  Cek Status Bayar    │                            │
│              └──────────────────────┘                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### Wireframe Mobile App (Flutter) — Home Screen

```
┌─────────────────────┐
│ ≡  DONARIA     🔔   │
├─────────────────────┤
│                     │
│  Halo, Budi! 👋     │
│                     │
│ ┌─────────────────┐ │
│ │ 🔍 Cari kampanye│ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │   Mari Berbagi  │ │
│ │   Kebaikan      │ │
│ │  [Banner Slide] │ │
│ └─────────────────┘ │
│                     │
│ Kategori            │
│ 🌊  🎓  💊  🕌    │
│ Benc Pend Kseh Ibd  │
│                     │
│ Kampanye Terbaru    │
│ ┌─────────────────┐ │
│ │ [Img] Judul     │ │
│ │       ████░ 60% │ │
│ │       [Donasi]  │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ [Img] Judul     │ │
│ │       ██░░ 30%  │ │
│ │       [Donasi]  │ │
│ └─────────────────┘ │
│                     │
├─────────────────────┤
│ 🏠   📋   💰   👤  │
│Home Kampanye Riwyat │
└─────────────────────┘
```

---

## Lampiran: SQL Schema (MySQL)

```sql
-- Database: donaria
CREATE DATABASE IF NOT EXISTS donaria
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE donaria;

-- Tabel Users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  role ENUM('admin', 'donatur') DEFAULT 'donatur',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Categories
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Campaigns
CREATE TABLE campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  short_description VARCHAR(500),
  description TEXT,
  target_amount BIGINT NOT NULL,
  current_amount BIGINT DEFAULT 0,
  banner_image VARCHAR(500),
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  deadline DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tabel Campaign Images
CREATE TABLE campaign_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

-- Tabel Donations
CREATE TABLE donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  campaign_id INT NOT NULL,
  amount BIGINT NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  status ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

-- Tabel Transactions
CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donation_id INT NOT NULL UNIQUE,
  order_id VARCHAR(100) NOT NULL UNIQUE,
  payment_gateway VARCHAR(50) DEFAULT 'tripay',
  payment_method ENUM('qris', 'bank_transfer') NOT NULL,
  bank_code VARCHAR(20),
  qris_url VARCHAR(500),
  va_number VARCHAR(50),
  gross_amount BIGINT NOT NULL,
  fee_amount BIGINT DEFAULT 0,
  net_amount BIGINT DEFAULT 0,
  status ENUM('pending', 'settlement', 'expire', 'cancel', 'deny') DEFAULT 'pending',
  gateway_reference_id VARCHAR(100),
  gateway_response_raw TEXT,
  paid_at DATETIME,
  expired_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (donation_id) REFERENCES donations(id)
);

-- Tabel Withdrawals
CREATE TABLE withdrawals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT NOT NULL,
  admin_id INT NOT NULL,
  amount BIGINT NOT NULL,
  bank_name VARCHAR(50) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  account_holder VARCHAR(100) NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'transferred') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
  FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- Tabel Notifications
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type ENUM('donation', 'campaign', 'withdrawal', 'system') DEFAULT 'system',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index untuk performa query
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_category ON campaigns(category_id);
CREATE INDEX idx_donations_user ON donations(user_id);
CREATE INDEX idx_donations_campaign ON donations(campaign_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_order ON transactions(order_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
```

---

*Dokumen ini adalah bagian dari SDLC Donaria — Platform Donasi Online.*
*Terakhir diperbarui: 14 April 2026*
