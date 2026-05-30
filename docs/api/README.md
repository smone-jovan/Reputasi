# Donaria API Documentation

REST API untuk platform donasi Donaria.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Endpoint yang membutuhkan autentikasi wajib menyertakan JWT token di header:

```
Authorization: Bearer <token>
```

Token didapat dari endpoint `POST /api/auth/login`.

### Login Response

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@donaria.com",
      "role": "admin"
    }
  }
}
```

## Response Format

Semua response menggunakan format konsisten:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

## Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Rate Limiting

| Tipe | Limit | Window |
|------|-------|--------|
| General API | 100 requests | 15 menit |
| Auth (login/register) | 10 requests | 15 menit |

---

## Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/register` | - | Register user baru |
| POST | `/login` | - | Login, return JWT token |
| GET | `/me` | Login | Dapatkan profile user saat ini |
| PUT | `/profile` | Login | Update name, phone, avatar_url |

#### Register

```json
POST /api/auth/register
{
  "name": "John Doe",          // 3-100 karakter
  "email": "john@example.com", // valid email
  "password": "password123",   // 6-128 karakter
  "phone": "08123456789"       // 10-15 karakter
}
```

#### Login

```json
POST /api/auth/login
{
  "email": "admin@donaria.com",
  "password": "admin123"
}
```

#### Update Profile

```json
PUT /api/auth/profile
Authorization: Bearer <token>
{
  "name": "Nama Baru",
  "phone": "08123456789",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

---

### Categories (`/api/categories`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/` | - | List semua kategori |
| GET | `/:id` | - | Detail kategori |
| POST | `/` | Admin | Buat kategori baru |
| PUT | `/:id` | Admin | Update kategori |
| DELETE | `/:id` | Admin | Hapus kategori |

#### Create Category

```json
POST /api/categories
Authorization: Bearer <admin-token>
{
  "name": "Kategori Baru",
  "slug": "kategori-baru",
  "icon": "tag"
}
```

---

### Campaigns (`/api/campaigns`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/` | - | List campaigns (paginated, filterable) |
| GET | `/:id` | - | Detail campaign + donations |
| GET | `/:id/donors` | - | List donor campaign (paginated) |
| POST | `/` | Admin | Buat campaign baru |
| PUT | `/:id` | Admin | Update campaign |
| DELETE | `/:id` | Admin | Soft-delete (set status=cancelled) |
| POST | `/submit` | Login | User ajukan kampanye (status: pending) |
| GET | `/my` | Login | User lihat kampanye sendiri |
| PUT | `/my/:id` | User edit own pending/rejected campaign |
| POST | `/:id/resubmit` | Login | User ajukan ulang kampanye yang ditolak |
| PUT | `/:id/approve` | Admin | Setujui kampanye pending |
| PUT | `/:id/reject` | Admin | Tolak kampanye pending |

#### List Campaigns

```
GET /api/campaigns?page=1&limit=10&category=1&status=active&search=renovasi
```

Query params:
- `page` (default: 1)
- `limit` (default: 10)
- `category` — filter by category_id
- `status` — filter by status (active/completed/cancelled)
- `search` — search di title dan description

Note: Default filter hanya menampilkan campaign `active` dan `completed` (sembunyikan pending, rejected, cancelled).

#### Create Campaign

```json
POST /api/campaigns
Authorization: Bearer <admin-token>
{
  "title": "Bantu Renovasi Panti Asuhan",
  "short_description": "Ringkasan singkat",
  "description": "Deskripsi lengkap (boleh HTML)",
  "category_id": 1,
  "target_amount": 50000000,
  "banner_image": "https://example.com/banner.jpg",
  "deadline": "2026-12-31"
}
```

#### Submit Campaign (User)

```json
POST /api/campaigns/submit
Authorization: Bearer <token>
{
  "title": "Bantu Renovasi Masjid",
  "short_description": "Ringkasan singkat",
  "description": "Deskripsi lengkap",
  "category_id": 5,
  "target_amount": 25000000,
  "banner_image": "https://example.com/banner.jpg",
  "deadline": "2026-12-31"
}
```

Validasi: `title`, `category_id`, `target_amount` wajib. Minimal target Rp 100.000.

Response:

```json
{
  "success": true,
  "message": "Kampanye berhasil diajukan. Menunggu persetujuan admin.",
  "data": { "campaign": { "id": 5, "status": "pending", ... } }
}
```

#### Get My Campaigns

```
GET /api/campaigns/my?status=pending&page=1&limit=20
Authorization: Bearer <token>
```

#### Edit My Campaign

```json
PUT /api/campaigns/my/5
Authorization: Bearer <token>
{
  "title": "Judul Baru",
  "target_amount": 30000000
}
```

Hanya bisa edit campaign dengan status `pending` atau `rejected`.

#### Resubmit Campaign

```
POST /api/campaigns/5/resubmit
Authorization: Bearer <token>
```

Hanya campaign dengan status `rejected` yang bisa diajukan ulang.

#### Approve/Reject Campaign (Admin)

```json
PUT /api/campaigns/5/approve
Authorization: Bearer <admin-token>

PUT /api/campaigns/5/reject
Authorization: Bearer <admin-token>
{
  "reason": "Deskripsi kurang lengkap"
}
```

---

### Donations (`/api/donations`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/recent` | - | 10 donasi terbaru (public) |
| POST | `/` | Login | Buat donasi baru + trigger payment |
| GET | `/` | Login | Riwayat donasi user |
| GET | `/:id` | Login | Detail donasi (owner/admin) |

#### Create Donation

```json
POST /api/donations
Authorization: Bearer <token>
{
  "campaign_id": 1,
  "amount": 50000,           // minimum Rp 10.000
  "message": "Semoga bermanfaat",
  "is_anonymous": false,
  "payment_method": "qris",  // "qris" atau "bank_transfer"
  "bank_code": "BCA",        // wajib jika bank_transfer (BCA/BNI/BRI/MANDIRI/BSI)
  "squad_id": 5              // optional: donasi via squad
}
```

Response:

```json
{
  "success": true,
  "data": {
    "donation": { "id": 1, "amount": 50000, "status": "pending", ... },
    "transaction": {
      "order_id": "DON-1234567890",
      "payment_method": "qris",
      "qris_url": "https://tripay.co.id/qr/...",
      "gross_amount": 50000,
      "expired_at": "2026-05-31T12:00:00Z"
    },
    "gatewayData": { ... }
  }
}
```

---

### Transactions (`/api/transactions`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/callback` | - | Tripay webhook (signature verified) |
| GET | `/check/:orderId` | - | Cek status pembayaran (public) |
| GET | `/` | Admin | List semua transaksi |
| GET | `/:id` | Login | Detail transaksi |

#### Check Payment Status

```
GET /api/transactions/check/DON-1234567890
```

Response:

```json
{
  "success": true,
  "data": {
    "order_id": "DON-1234567890",
    "status": "settlement",
    "payment_method": "qris",
    "gross_amount": 50000,
    "paid_at": "2026-05-30T10:30:00Z"
  }
}
```

#### Tripay Callback

```
POST /api/transactions/callback
```

Webhook dari Tripay. Signature diverifikasi menggunakan HMAC-SHA256 dengan private key.

---

### Squads (`/api/squads`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/code/:code` | - | Dapatkan squad by invite code |
| GET | `/campaign/:campaignId` | - | List squad per campaign |
| POST | `/` | Login | Buat squad baru |
| POST | `/code/:code/join` | Login | Join squad pakai invite code |
| GET | `/my` | Login | List squad saya |
| GET | `/:id` | Login | Detail squad + leaderboard |

#### Create Squad

```json
POST /api/squads
Authorization: Bearer <token>
{
  "name": "Squad Peduli",
  "campaign_id": 1,
  "target_amount": 5000000
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Squad Peduli",
    "invite_code": "ABC123XYZ",
    "target_amount": 5000000,
    "current_amount": 0,
    "status": "active",
    ...
  }
}
```

#### Join Squad

```
POST /api/squads/code/ABC123XYZ/join
Authorization: Bearer <token>
```

#### Get Squad by Code (Public)

```
GET /api/squads/code/ABC123XYZ
```

#### List Squads for Campaign (Public)

```
GET /api/squads/campaign/1
```

---

### Withdrawals (`/api/withdrawals`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/` | Admin | Buat request pencairan |
| GET | `/` | Admin | List semua pencairan |
| PUT | `/:id` | Admin | Update status (approve/reject/transfer) |

#### Create Withdrawal

```json
POST /api/withdrawals
Authorization: Bearer <admin-token>
{
  "campaign_id": 1,
  "amount": 1000000,
  "bank_name": "BCA",
  "account_number": "1234567890",
  "account_holder": "Nama Pemilik"
}
```

#### Update Withdrawal Status

```json
PUT /api/withdrawals/1
Authorization: Bearer <admin-token>
{
  "status": "approved",  // pending/approved/rejected/transferred
  "notes": "Disetujui"
}
```

---

### Notifications (`/api/notifications`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/` | Login | List notifikasi user + unread count |
| PUT | `/:id/read` | Login | Tandai satu notifikasi dibaca |
| PUT | `/read-all` | Login | Tandai semua notifikasi dibaca |

Response GET `/api/notifications`:

```json
{
  "success": true,
  "data": {
    "notifications": [...],
    "unreadCount": 3
  }
}
```

---

### Stats (`/api/stats`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/` | - | Statistik platform |

Response:

```json
{
  "success": true,
  "data": {
    "totalCampaigns": 10,
    "totalDonations": 50000000,
    "totalDonors": 150,
    "totalTransactions": 200
  }
}
```

---

### Demo (`/api/demo`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/simulate-payment` | Admin | Simulasi donasi tanpa gateway |
| POST | `/toggle-bypass` | Admin | Toggle payment bypass mode |

#### Simulate Payment

```json
POST /api/demo/simulate-payment
Authorization: Bearer <admin-token>
{
  "campaign_id": 1,
  "amount": 100000,
  "donor_name": "Test Donor"
}
```

Membuat donasi + transaksi langsung `settlement` tanpa ke Tripay. Order ID diawali dengan `DEMO-`.

#### Toggle Bypass Mode

```json
POST /api/demo/toggle-bypass
Authorization: Bearer <admin-token>
```

Mengaktifkan/menonaktifkan bypass mode. Saat aktif, semua donasi via `POST /api/donations` langsung `settlement`.

---

### Admin (`/api/admin`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/test-mode` | Admin | Toggle test mode |
| GET | `/test-mode` | Admin | Get test mode status |

#### Toggle Test Mode

```
POST /api/admin/test-mode
Authorization: Bearer <admin-token>
```

Response:

```json
{
  "success": true,
  "message": "Test Mode diaktifkan. Semua donasi akan langsung bypass.",
  "data": { "enabled": true }
}
```

#### Get Test Mode Status (Admin)

```
GET /api/admin/test-mode
Authorization: Bearer <admin-token>
```

---

### Admin Analytics (`/api/admin/analytics`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/trend` | Admin | Donasi per hari (7 hari terakhir) |
| GET | `/top-campaigns` | Admin | Top 5 campaigns dengan progress |
| GET | `/top-donors` | Admin | Top 5 donatur dengan total donasi |

#### Donation Trend

```
GET /api/admin/analytics/trend?days=7
Authorization: Bearer <admin-token>
```

Response:

```json
{
  "success": true,
  "data": {
    "trend": [
      { "date": "2026-05-24", "total": 150000, "count": 3 },
      { "date": "2026-05-25", "total": 0, "count": 0 },
      ...
    ]
  }
}
```

Query params:
- `days` (default: 7) — jumlah hari ke belakang

#### Top Campaigns

```
GET /api/admin/analytics/top-campaigns?limit=5
Authorization: Bearer <admin-token>
```

Response:

```json
{
  "success": true,
  "data": {
    "campaigns": [
      {
        "id": 1,
        "title": "Bantu Renovasi Panti Asuhan",
        "category": "Kemanusiaan",
        "target_amount": 50000000,
        "current_amount": 35000000,
        "progress": 70,
        "status": "active"
      }
    ]
  }
}
```

#### Top Donors

```
GET /api/admin/analytics/top-donors?limit=5
Authorization: Bearer <admin-token>
```

Response:

```json
{
  "success": true,
  "data": {
    "donors": [
      {
        "user_id": 2,
        "name": "John Doe",
        "email": "john@example.com",
        "total_amount": 500000,
        "donation_count": 5
      }
    ]
  }
}
```

---

### Settings (`/api/settings`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/test-mode` | - | Get test mode status (public) |

#### Get Test Mode Status (Public)

```
GET /api/settings/test-mode
```

Response:

```json
{
  "success": true,
  "data": { "enabled": false }
}
```

---

### Health Check (`/api/health`)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/` | - | Cek API status |

Response:

```json
{
  "status": "OK",
  "message": "Donaria API is running",
  "timestamp": "2026-05-30T12:00:00.000Z"
}
```

---

## Alur Pembayaran (Detail)

Lihat [ADR-002](../decisions/002-extract-payment-service.md) untuk alasan arsitektur `PaymentService`.

```
1. User pilih campaign & amount
       │
2. POST /api/donations
       │
3. PaymentService.createPayment()
       │
       ├─ Cek bypass mode (Setting.getValue)
       │       │
       │       ├─ Bypass ON → Transaction status=settlement, langsung step 8
       │       └─ Bypass OFF → lanjut step 4
       │
4. TripayService.createTransaction()
       │
5. Return QR URL / VA number ke frontend
       │
6. User bayar (scan QR / transfer VA)
       │
7. Tripay kirim webhook → POST /api/transactions/callback
       │
8. PaymentService.handleCallback()
       │
       ├─ Verify signature
       ├─ Update Transaction & Donation status
       ├─ _handleSuccessfulPayment()
       │       ├─ campaign.increment('current_amount')
       │       ├─ Auto-complete jika target tercapai
       │       ├─ squad.incrementAmount() jika ada squad
       │       └─ Buat Notification
       │
9. Frontend poll status via GET /api/transactions/check/:orderId
```

---

## Testing Mode

Ketika **Payment Bypass Mode** aktif:
- Semua donasi via `POST /api/donations` langsung `settlement`
- Tidak perlu Tripay API key
- Toggle via `POST /api/demo/toggle-bypass` atau Admin Dashboard

Lihat [ADR-006](../decisions/006-payment-bypass-mode.md) untuk detail.

---

*Last updated: 2026-05-30 (v0.6.0)*
