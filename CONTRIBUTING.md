# Contributing to Donaria

Terima kasih atas kontribusi Anda! Berikut panduan untuk berkontribusi pada proyek Donaria.

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- MySQL (via XAMPP)
- Flutter SDK v3.9+
- Git

### Setup

```bash
# 1. Clone repository
git clone https://github.com/your-username/donaria.git
cd donaria

# 2. Setup Backend
cd backend
cp .env.example .env  # Edit sesuai config Anda
npm install
npm run seed
npm run dev

# 3. Setup Website (VS Code Live Server)
# Buka folder website/ dengan Live Server (port 5500)

# 4. Setup Flutter App
cd ../Aplikasi/donaria
flutter pub get
flutter run
```

---

## 📁 Project Structure

```
donaria/
├── backend/              # Node.js API Server
│   ├── src/
│   │   ├── controllers/  # Handle request/response
│   │   ├── services/     # Business logic
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth & validation
│   │   └── validations/ # Joi schemas
│   └── server.js         # Entry point
│
├── website/              # Frontend (HTML/CSS/JS)
│   ├── *.html            # Static pages
│   ├── css/              # Stylesheets
│   └── js/               # JavaScript modules
│
├── Aplikasi/donaria/     # Flutter Mobile App
│   └── lib/
│       ├── screens/      # UI screens
│       ├── providers/    # State management
│       ├── models/       # Data models
│       └── services/     # API services
│
└── docs/                 # Documentation
    └── decisions/        # ADRs
```

---

## 🛠 Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feat/nama-fitur-baru
```

### 2. Make Changes

Follow coding standards (lihat di bawah).

### 3. Test

```bash
# Backend tests
cd backend
npm test

# Manual testing
# - Test semua endpoint yang berubah
# - Test di browser (Chrome, Firefox)
# - Test di Flutter app (jika ada perubahan mobile)
```

### 4. Commit

Gunakan conventional commits:

```bash
git commit -m "feat: tambah fitur baru"
git commit -m "fix: perbaiki bug di payment flow"
git commit -m "docs: update API documentation"
```

**Commit Types:**
- `feat`: Fitur baru
- `fix`: Perbaikan bug
- `docs`: Dokumentasi
- `refactor`: Refactoring (tanpa ubah behavior)
- `test`: Tambah/ubah test
- `chore`: Maintenance (deps, config, dll)

### 5. Push & Create PR

```bash
git push origin feat/nama-fitur-baru
```

Buat Pull Request ke branch `main` dengan deskripsi yang jelas.

---

## 📏 Coding Standards

### Backend (Node.js)

```javascript
// ✅ GOOD: Arrow function, const, async/await
const getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    res.json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ❌ BAD: function declaration, var, callbacks
function getCampaign(req, res) {
  Campaign.findByPk(req.params.id).then(campaign => {
    res.json(campaign);
  }).catch(err => {
    res.status(500).json(err);
  });
}
```

**Rules:**
- Gunakan `const`/`let`, jangan `var`
- Gunakan `async/await`, jangan `.then()`
- Handle error dengan `try/catch`
- Business logic di `services/`, bukan di `controllers/`
- Response format: `{ success: boolean, data?: any, message?: string }`

### Frontend (Vanilla JS)

```javascript
// ✅ GOOD: IIFE pattern, window globals
const API = (() => {
  const baseURL = 'http://localhost:3000/api';
  
  return {
    getCampaigns: async (params) => {
      const response = await fetch(`${baseURL}/campaigns`);
      return response.json();
    }
  };
})();

window.API = API;
```

**Rules:**
- Gunakan IIFE pattern untuk module
- Export ke `window` object
- Gunakan `fetch` API (jangan XMLHttpRequest)
- Escape HTML untuk prevent XSS

### Flutter (Dart)

```dart
// ✅ GOOD: Named parameters, null safety
class Campaign {
  final int id;
  final String title;
  
  Campaign({required this.id, required this.title});
}

// ✅ GOOD: Consumer for state
Consumer<CampaignProvider>(
  builder: (context, provider, child) {
    return ListView.builder(
      itemCount: provider.campaigns.length,
      itemBuilder: (context, index) {
        return CampaignCard(provider.campaigns[index]);
      },
    );
  },
)
```

**Rules:**
- Gunakan named parameters
- Handle null safety dengan benar
- Gunakan Provider untuk state management
- Widget harus kecil dan reusable

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

Test file location: `backend/tests/`

**Test naming convention:**
```javascript
describe('Campaign Controller', () => {
  it('should return all active campaigns', async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Manual Testing Checklist

- [ ] Register & Login
- [ ] Browse campaigns
- [ ] Create donation
- [ ] Complete payment flow
- [ ] Test admin features
- [ ] Test squad features
- [ ] Test on mobile (Flutter)

---

## 🔐 Security

**NEVER:**
- Commit `.env` files
- Hardcode passwords or API keys
- Skip authentication checks
- Trust user input

**ALWAYS:**
- Validate all input
- Use parameterized queries (Sequelize does this)
- Hash passwords with bcrypt
- Verify JWT tokens
- Check authorization

---

## 📝 Documentation

Update dokumentasi jika mengubah:
- API endpoints → Update `docs/api/README.md`
- Database schema → Update `docs/current-status.md`
- Architecture decisions → Create ADR di `docs/decisions/`
- Environment variables → Update `.env.example`

---

## 🐛 Bug Reports

Sertakan:
1. Description (apa yang terjadi)
2. Steps to reproduce (langkah untuk mengulang)
3. Expected behavior (yang seharusnya)
4. Screenshots (jika ada)
5. Environment (OS, browser, Node version)

---

## 💡 Questions?

Buka GitHub Issues atau hubungi tim development.

---

Thank you for contributing! 🙏
