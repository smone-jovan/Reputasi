# Donaria

**Platform donasi online Indonesia dengan fitur Squad Donasi, User-Generated Campaigns, Admin Analytics, dan Testing Mode.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![Flutter](https://img.shields.io/badge/Flutter-3.9+-02569B?style=flat&logo=flutter&logoColor=white)](https://flutter.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat&logo=mysql&logoColor=white)](https://mysql.com)
[![Tests](https://img.shields.io/badge/Tests-101%20passed-brightgreen)](#testing)
[![License](https://img.shields.io/badge/License-Private-red)](#license)

---

## Fitur

| Fitur | Deskripsi |
|-------|-----------|
| **Squad Donasi** | Donasi bareng teman/keluarga dengan sub-target, invite code, dan leaderboard |
| **User-Generated Campaigns** | User ajukan kampanye → admin approve/reject → user bisa edit & resubmit |
| **Admin Analytics** | Trend chart 7 hari, top campaigns, top donors, export CSV |
| **Test Mode** | Bypass pembayaran untuk testing (production guard aktif) |
| **Pesan Donatur** | Komentar publik di halaman kampanye dari pesan donasi |
| **Payment Gateway** | Tripay integration — QRIS, BCA/BNI/BRI/Mandiri Virtual Account |
| **Admin Dashboard** | Sidebar navigation, kelola kampanye, transaksi, statistik |
| **Mobile App** | Flutter dengan Provider state management, 11 screens |

---

## Quick Start

### Prerequisites

- Node.js v18+
- MySQL (XAMPP atau standalone)
- Flutter SDK v3.9+
- Live Server VS Code extension

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env    # Edit sesuai config MySQL
npm run seed             # Seed database (8 kategori + admin)
npm run dev              # Server di http://localhost:3000
```

### 2. Website

```bash
# Buka folder website/ dengan Live Server (port 5500)
```

### 3. Flutter App

```bash
cd Aplikasi/donaria
flutter pub get
flutter run
```

---

## Commands

| Command | Description |
|---------|-------------|
| `cd backend && npm run dev` | Start backend dev server |
| `cd backend && npm test` | Run 101 tests |
| `cd backend && npm run seed` | Seed database |
| `cd Aplikasi/donaria && flutter run` | Run Flutter app |

---

## Architecture

```
Website (HTML/Tailwind/JS) ──┐
                              ├──▶ Backend (Express.js) ──▶ MySQL
Flutter App (Dart/Provider) ──┘         │
                                       ├──▶ Tripay API (Payment)
                                       └──▶ Security Layer (Helmet, Rate Limit, CORS)
```

### Backend

```
backend/
├── src/
│   ├── controllers/      # 9 controllers (req/res handler)
│   ├── models/           # 11 Sequelize models
│   ├── routes/           # 11 route files
│   ├── services/         # PaymentService, TripayService
│   ├── middleware/        # authenticate, isAdmin, validate
│   └── validations/      # Joi schemas (donation, campaign, squad)
├── tests/                # 10 test suites, 101 tests
└── server.js             # Entry point
```

### Website

```
website/
├── *.html                # 14 halaman (public + admin)
├── admin/                # Admin dashboard (sidebar layout)
│   ├── index.html        # Stats + analytics + test mode
│   ├── campaigns.html    # Campaign CRUD + approve/reject
│   └── transactions.html # Transaction list + filters
├── css/                  # Design system (glassmorphism)
└── js/                   # API module + auth + utilities
```

### Flutter App

```
Aplikasi/donaria/lib/
├── config/               # API endpoints, theme
├── models/               # 6 model files (10 classes)
├── providers/            # 4 ChangeNotifier providers
├── screens/              # 11 screens
├── widgets/              # 8 reusable widgets
└── services/             # ApiService (Dio), AuthService
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express.js, Sequelize ORM |
| Database | MySQL |
| Auth | JWT, bcryptjs (12 rounds) |
| Payment | Tripay Gateway (QRIS + VA) |
| Validation | Joi |
| Security | Helmet, express-rate-limit, CORS |
| Frontend | HTML5, Tailwind CSS 4, Vanilla JS, Chart.js |
| Mobile | Flutter, Dart, Provider, Dio |
| Testing | Jest, Supertest |

---

## Testing

```bash
cd backend && npm test
```

```
Test Suites: 10 passed, 10 total
Tests:       101 passed, 101 total
```

| Suite | Tests | Coverage |
|-------|-------|----------|
| test-mode | 14 | Test Mode toggle, bypass donations |
| user-campaigns | 21 | Submit, approve, reject, edit, resubmit |
| analytics | 13 | Trend, top campaigns, top donors |
| campaigns | 11 | List, detail, CRUD, filters |
| squads | 11 | Create, join, by code, by campaign |
| auth-flow | 10 | Register, login, profile |
| donations | 8 | Recent, my donations, get by id |
| categories | 5 | List, detail, create |
| withdrawals | 5 | Create, list, approve |
| notifications | 3 | List, mark all read |

---

## API Endpoints (37+)

| Group | Endpoints | Auth |
|-------|-----------|------|
| Auth | register, login, me, profile | Mixed |
| Categories | CRUD (5) | Public / Admin |
| Campaigns | CRUD + submit + approve/reject (12) | Mixed |
| Donations | create, recent, my, detail (4) | Mixed |
| Transactions | callback, check, list (4) | Mixed |
| Squads | create, join, by code, my (6) | Mixed |
| Analytics | trend, top-campaigns, top-donors (3) | Admin |
| Admin | test-mode toggle (2) | Admin |
| Withdrawals | create, list, update (3) | Admin |
| Notifications | list, read, read-all (3) | User |

Lihat [API Documentation](docs/api/README.md) untuk detail lengkap.

---

## Akun Demo

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@donaria.com | admin123 |
| Donatur | user1@donaria.com | password123 |
| Donatur | user2-user10@donaria.com | password123 |

---

## Documentation

| Dokumen | Deskripsi |
|---------|-----------|
| [Current Status](docs/current-status.md) | Source of truth — status proyek |
| [API Documentation](docs/api/README.md) | Semua endpoint dengan contoh |
| [Architecture Decisions](docs/decisions/) | 7 ADRs (001-007) |
| [Brand Guidelines](docs/brand-guidelines.md) | Design tokens, warna, tipografi |
| [CHANGELOG](CHANGELOG.md) | Riwayat versi |
| [Contributing](CONTRIBUTING.md) | Panduan kontribusi |
| [LICENSE](LICENSE) | Lisensi proyek |

### GitHub Templates

- [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md) — Laporkan bug
- [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md) — Ajukan fitur baru
- [PR Template](.github/PULL_REQUEST_TEMPLATE.md) — Template pull request dengan checklist

---

## Security

- JWT authentication with bcrypt hashing (12 rounds)
- Rate limiting: 10 req/15min (auth), 100 req/15min (API)
- CORS origin restriction
- Joi input validation on donation, campaign, squad endpoints
- XSS protection via `escapeHTML()`
- Production guard on test mode toggle
- Helmet HTTP security headers

---

## License

Private — Donaria Project
