# 🕌 Donaria — Implementation Plan (FINAL)

## Pilihan User (Dikonfirmasi)

| Komponen | Pilihan |
|:---|:---|
| **Database** | MySQL (XAMPP lokal) |
| **Payment Gateway** | Tripay (QRIS + Bank Transfer) |
| **Website** | HTML/CSS/JavaScript (vanilla, sederhana) |
| **Mobile App** | Flutter (`Aplikasi/donaria/`) |
| **Backend** | Express.js + Sequelize ORM |

## Arsitektur Final

```
Website (HTML/CSS/JS) ──┐
                         ├──▶ Backend (Express.js) ──▶ MySQL
Flutter App (Dart) ─────┘         │
                                   └──▶ Tripay API
```

## Progress

- [x] ERD & Database Design
- [x] SDLC Document (`Readme SDLC.MD`)
- [x] AI Continuation Guide (`readme ai next.MD`)
- [x] Flutter project created
- [x] Backend setup & API (Express.js, 8 models, 7 controllers, 7 routes, Tripay service)
- [x] Website frontend (12 halaman HTML, CSS design system, JS API helper)
- [x] Flutter screens & integration
- [ ] Tripay integration (kunci API belum diisi)
- [ ] Testing & deployment

## Urutan Kerja

1. **Backend** → Setup Express.js, MySQL models, CRUD APIs, Tripay
2. **Website** → HTML/CSS/JS pages, connect to API
3. **Flutter** → Screens, API integration, payment flow
