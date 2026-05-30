# Project: Donaria

Platform donasi online Indonesia dengan fitur Squad Donasi, User-Generated Campaigns, Admin Analytics, dan Testing Mode.

## Tech Stack

- **Backend**: Node.js, Express.js, Sequelize (MySQL), JWT, Jest, Supertest
- **Frontend Web**: HTML5, Tailwind CSS 4, Vanilla JS (IIFE Pattern), Lucide Icons
- **Mobile**: Flutter (Dart), Provider (State Management)
- **Payment**: Tripay Gateway (QRIS, Virtual Account)

## Commands

| Command | Description |
|---------|-------------|
| `cd backend && npm run dev` | Start backend dev server (port 3000) |
| `cd backend && npm test` | Run backend tests |
| `cd backend && npm run seed` | Seed database with demo data |
| `cd Aplikasi/donaria && flutter run` | Run Flutter mobile app |

**MySQL Path**: `C:\xampp\mysql\bin\mysql.exe`

## Project Structure

```
├── backend/          # API Server
│   ├── src/
│   │   ├── controllers/   # Handle req/res only
│   │   ├── services/      # Business logic (PaymentService, tripayService)
│   │   ├── models/        # Sequelize models (11 tables)
│   │   ├── routes/        # Express routers
│   │   └── middleware/    # authenticate, isAdmin, validate
│   └── server.js          # Entry point
├── website/          # Frontend static HTML
├── Aplikasi/donaria/ # Flutter mobile app
└── docs/             # Documentation & ADRs
```

## Code Conventions

- **Backend**: Bisnis logika di `Services`. Controller cuma handle req/res.
- **Frontend**: Modul dipisah (`api.js`, `auth.js`, `ui.js`) pake IIFE pattern.
- **Database**: Pake Sequelize sync, tidak ada raw SQL migration.
- **State Management**: Flutter pake Provider (ChangeNotifier).

## Boundaries

- **Security**: Bypass Pembayaran CUMA boleh aktif di `development`/`test`.
- **Auth**: Endpoint admin wajib pake middleware `authenticate` & `isAdmin`.
- **Git**: Jangan commit `.env` atau folder `node_modules`.
- **API Response**: Selalu pakai format `{ success, data, message, pagination? }`.

## Database Schema (10 Tables)

| Table | Description |
|-------|-------------|
| users | User accounts (admin/donatur) |
| categories | Campaign categories |
| campaigns | Donation campaigns |
| campaign_images | Campaign gallery |
| donations | Donation records |
| transactions | Payment transactions |
| withdrawals | Fund withdrawal requests |
| squads | Squad Donasi groups |
| squad_members | Squad membership |
| notifications | User notifications |
| settings | Platform settings (bypass mode) |

## Testing Mode (Payment Bypass)

- **Status**: Aktifkan via Admin Dashboard atau `POST /api/admin/test-mode`
- **Effect**: Transaksi donasi langsung `settlement` tanpa gateway
- **Location**: `settings` table, field `test_mode`

## Key Features

### Squad Donasi
- User bisa membuat squad (kelompok donasi)
- Setiap squad punya invite code unik
- Squad bisa donasi ke campaign dengan sub-target
- Lihat [ADR-001](docs/decisions/001-squad-donasi.md) untuk detail

### Payment Flow
- Tripay sebagai payment gateway utama
- PaymentService mengoordinasi seluruh flow
- Lihat [ADR-002](docs/decisions/002-extract-payment-service.md) untuk detail

## AI Context Rules

- **Source of Truth**: `CLAUDE.md` untuk aturan proyek
- **Current Status**: `docs/current-status.md` untuk status terkini
- **ADRs**: `docs/decisions/` untuk keputusan arsitektur
- **Context Budget**: Muat file < 2000 baris agar tetap fokus
- **Security**: Jangan pernah commit `.env` atau kredensial
- **Bypass Mode**: Wajib dimatikan di produksi

## Documentation

- [README.md](README.md) - Quick start & overview
- [docs/](docs/) - Full documentation index
- [CHANGELOG.md](CHANGELOG.md) - Version history
