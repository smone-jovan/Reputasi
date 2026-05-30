# Squad Donasi (Circle of Kindness)

> **Status:** Selesai (Implemented)
> **Disetujui:** 13 Mei 2026
> **Diimplementasikan:** 22 Mei 2026 (Backend), 30 Mei 2026 (Web + Flutter)

---

## Problem Statement

Bagaimana memanfaatkan "tekanan sosial positif" dan rasa kebersamaan untuk mempercepat pencapaian target donasi sebuah kampanye?

## Solusi

**Squad Donasi — Private & Project-Based.** Donatur bisa membuat "Squad" untuk satu kampanye spesifik, mengundang teman/keluarga via link unik, dan bersama-sama mencapai target kelompok.

Alasan pendekatan ini:
- **Viralitas tinggi** — setiap squad adalah peluang tarik donatur baru
- **Tekanan sosial positif** — donatur lebih termotivasi saat progres kelompok terlihat
- **Low friction** — cukup klik link squad, tidak perlu sudah terdaftar

---

## User Journey

### 1. Inisiasi
Andi melihat kampanye "Bantu Renovasi Panti Asuhan" → klik "Buat Squad" → masukkan nama + target → dapat invite code unik.

### 2. Penyebaran
Andi share link ke WhatsApp keluarga → Budi klik link → halaman squad terbuka.

### 3. Partisipasi
Budi donasi via squad → donasi masuk ke total kampanye DAN progres squad → leaderboard update.

### 4. Pencapaian
Target squad tercapai → notifikasi ke semua anggota → nama squad muncul di daftar donatur.

---

## Implementasi

### Backend

| Komponen | File | Detail |
|----------|------|--------|
| Model Squad | `src/models/Squad.js` | id, campaign_id, creator_id, name, target_amount, current_amount, invite_code (unique), status |
| Model SquadMember | `src/models/SquadMember.js` | id, squad_id, user_id, role (creator/member) |
| Routes | `src/routes/squadRoutes.js` | 6 endpoints (create, join, detail, list, by code, by campaign) |
| Controller | `src/controllers/squadController.js` | HTTP handler |
| Donation link | `src/models/Donation.js` | Field opsional `squad_id` |

### Website

| Komponen | File | Detail |
|----------|------|--------|
| Squad page | `website/squad.html` | Detail squad (by code) atau create flow (by campaign) |
| Campaign detail | `website/campaign-detail.html` | Widget "Squad Aktif" + tombol "Buat Squad" |

### Flutter

| Komponen | File | Detail |
|----------|------|--------|
| SquadDetailScreen | `lib/screens/squad_detail_screen.dart` | Info squad + leaderboard + join/share |
| CreateSquadScreen | `lib/screens/create_squad_screen.dart` | Form buat squad + preset amounts |
| SquadProvider | `lib/providers/squad_provider.dart` | State management |
| SquadCard | `lib/widgets/squad_card.dart` | Reusable card widget |
| Squad model | `lib/models/squad.dart` | Squad + SquadMemberInfo + SquadLeaderboardEntry |

---

## Not Doing

- Grup permanen (lintas kampanye) — terlalu kompleks untuk MVP
- Chat di dalam squad — komunikasi via WhatsApp
- Hadiah fisik — fokus digital rewards
- Leaderboard publik antar squad — hindari kompetisi tidak sehat
- Squad untuk non-logged-in user — tracking akurat

---

## Open Questions

- Apakah perlu minimum target squad?
- Squad otomatis ditutup setelah target tercapai?
- Bagaimana handle campaign berakhir tapi squad belum tercapai?

---

*Dokumen ini dihasilkan dari sesi Idea Refine pada 13 Mei 2026.*
*Diimplementasikan: Mei 2026.*
