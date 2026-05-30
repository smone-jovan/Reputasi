# Donaria - Platform Donasi Online

Donaria adalah platform donasi modern yang memudahkan siapa saja untuk berbagi kebaikan melalui kampanye donasi yang terverifikasi.

## Fitur Utama

- **Squad Donasi** - Donasi bareng teman/keluarga dengan sub-target khusus
- **User-Generated Campaigns** - User bisa ajukan kampanye, admin approve/reject
- **Admin Analytics** - Trend chart, top campaigns, top donors, export CSV
- **Test Mode** - Bypass pembayaran untuk testing tanpa gateway
- **Tripay Integration** - QRIS, Virtual Account, berbagai metode pembayaran
- **Admin Dashboard** - Kelola kampanye, transaksi, pencairan dana
- **Mobile App** - Aplikasi Flutter untuk akses cepat

## Quick Start

### Prerequisites

- Node.js (v18+)
- MySQL (via XAMPP atau standalone)
- Flutter SDK (v3.9+)
- Live Server VS Code extension

### 1. Backend Setup

```bash
cd backend
npm install

# Konfigurasi database
cp .env.example .env  # Edit sesuai config MySQL Anda

# Seed database
npm run seed

# Jalankan server
npm run dev
# Server berjalan di http://localhost:3000
```

### 2. Website

```bash
# Buka folder website/ dengan Live Server (port 5500)
# Atau gunakan VS Code Live Server extension
```

### 3. Flutter App

```bash
cd Aplikasi/donaria
flutter pub get
flutter run
```

## Commands

| Command | Description |
|---------|-------------|
| `cd backend && npm run dev` | Start backend development server |
| `cd backend && npm test` | Run backend tests |
| `cd backend && npm run seed` | Seed database with demo data |
| `cd Aplikasi/donaria && flutter run` | Run Flutter mobile app |

## Architecture

```
Reputasi/
├── backend/                  # Node.js/Express/Sequelize API
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Sequelize models (10 tables)
│   │   ├── routes/           # Express routers
│   │   ├── services/         # Business logic (PaymentService)
│   │   └── middleware/       # Auth, validation
│   └── server.js             # Entry point
│
├── website/                  # Frontend (HTML + Tailwind CSS)
│   ├── *.html                # Static pages
│   ├── css/                  # Styles
│   └── js/                   # Vanilla JS (IIFE pattern)
│
├── Aplikasi/donaria/         # Flutter Mobile App
│   └── lib/
│       ├── models/           # Dart models
│       ├── providers/        # State management
│       ├── screens/          # UI screens
│       └── services/         # API services
│
└── docs/                     # Documentation
    ├── decisions/            # ADRs (001-007)
    └── ideas/                # Feature specs
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Node.js, Express.js, Sequelize |
| Database | MySQL |
| Auth | JWT, bcryptjs |
| Payment | Tripay Gateway |
| Frontend | HTML5, Tailwind CSS 4, Vanilla JS |
| Mobile | Flutter, Provider |
| Testing | Jest, Supertest |

## Documentation

- **[Current Status](docs/current-status.md)** - Status proyek terkini
- **[API Documentation](docs/api/README.md)** - Endpoint reference
- **[Architecture Decisions](docs/decisions/)** - ADRs (001-007)
- **[Brand Guidelines](docs/brand-guidelines.md)** - Design tokens
- **[CHANGELOG](CHANGELOG.md)** - Version history

## Akun Demo

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@donaria.com | admin123 |
| Donatur | user1@donaria.com | password123 |
| Donatur | user2@donaria.com | password123 |
| ... | user3-user10@donaria.com | password123 |

## Testing Mode

**Payment Bypass Mode** memungkinkan testing tanpa gateway pembayaran asli.

1. Login sebagai Admin
2. Buka Admin Dashboard → Bypass Pembayaran
3. Aktifkan toggle

Ketika aktif, transaksi donasi langsung `settlement` tanpa melalui Tripay.

## License

Private - Donaria Project
