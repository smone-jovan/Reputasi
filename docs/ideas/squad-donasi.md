# Squad Donasi (Circle of Kindness)

> **Status:** Approved — Ready for Implementation  
> **Disetujui:** 13 Mei 2026  
> **Prioritas:** 🔴 Tinggi  

---

## Problem Statement

**Bagaimana kita bisa memanfaatkan "tekanan sosial positif" dan rasa kebersamaan untuk mempercepat pencapaian target donasi sebuah kampanye?**

## Recommended Direction

**Squad Donasi — Private & Project-Based.** Fitur yang memungkinkan donatur menjadi "influencer" bagi lingkarannya sendiri dengan membuat sub-target donasi di dalam sebuah kampanye. Pengguna bisa membuat "Squad" untuk satu kampanye spesifik, mengundang teman/keluarga via link unik, dan bersama-sama mencapai target kelompok.

Pendekatan ini dipilih karena:
- **Viralitas tinggi.** Setiap squad yang dibuat adalah peluang untuk menarik donatur baru yang sebelumnya tidak mengenal Donaria.
- **Tekanan sosial positif.** Orang cenderung lebih termotivasi saat tahu kontribusinya terlihat oleh kelompoknya ("Ayo dikit lagi target kita tercapai!").
- **Low friction.** Tidak memerlukan teman untuk sudah terdaftar di Donaria terlebih dahulu — cukup klik link squad.

## Key Assumptions to Validate

- [ ] Pengguna mau membagikan link squad ke lingkaran pribadinya (WhatsApp/IG) — **Test:** Pasang tombol share di halaman squad dan lacak CTR.
- [ ] Donatur merasa lebih termotivasi saat melihat bar progres kelompoknya sendiri vs progres total kampanye — **Test:** A/B test halaman detail kampanye dengan/tanpa widget squad.
- [ ] Fitur ini tidak membuat orang merasa "terbebani" oleh persaingan di dalam grup — **Test:** Survey sederhana setelah 50 squad pertama terbentuk.

## User Journey

### 1. Inisiasi (Si Pembuat Squad)
- Andi melihat kampanye "Bantu Renovasi Panti Asuhan".
- Di halaman kampanye, ada tombol: **"Donasi Bareng Teman (Buat Squad)"**.
- Andi klik, memasukkan nama squad: "Keluarga Besar Pak Mulyono" dan target squad: Rp 5.000.000.
- Sistem memberikan **Link Unik / QR Code** khusus squad tersebut.

### 2. Penyebaran (Viral Loop)
- Andi membagikan link ke grup WhatsApp keluarga.
- Budi (sepupu Andi) klik linknya → halaman kampanye terbuka dengan overlay: *"Andi mengajakmu bergabung di Squad Keluarga Pak Mulyono."*

### 3. Partisipasi (Social Proof)
- Budi donasi Rp 200.000 melalui link squad.
- Donasi masuk ke total kampanye utama DAN tercatat di bar progres squad.
- Ada mini leaderboard di dalam squad.

### 4. Pencapaian (Reward & Legacy)
- Target Rp 5jt tercapai → notifikasi selamat ke semua anggota.
- Nama "Keluarga Besar Pak Mulyono" muncul di daftar donatur kampanye sebagai satu entitas.

## MVP Scope

### Backend
| Komponen | Detail |
|:---|:---|
| **Model `Squad`** | `id`, `name`, `campaign_id`, `creator_id`, `target_amount`, `current_amount`, `invite_code` (unique), `status`, `created_at` |
| **Model `SquadMember`** | `id`, `squad_id`, `user_id`, `role` (creator/member), `joined_at` |
| **Routes** | `POST /api/squads` (create), `GET /api/squads/:code` (join page), `POST /api/squads/:code/join`, `GET /api/squads/:id` (detail + leaderboard) |
| **Logika Donasi** | Tambah field opsional `squad_id` di tabel `donations` agar donasi bisa di-track per squad |

### Website
| Halaman | Detail |
|:---|:---|
| **Tombol "Buat Squad"** | Di halaman `campaign-detail.html` (di samping tombol Donasi) |
| **Halaman Squad Detail** | `squad.html?code=XXXX` — bar progres squad, daftar anggota, leaderboard mini |
| **Modal Invite** | Setelah buat squad, tampilkan link + tombol share ke WhatsApp/Copy |

### Flutter App
| Screen | Detail |
|:---|:---|
| **Squad Button** | Di `campaign_detail_screen.dart` |
| **Squad Detail Screen** | `squad_detail_screen.dart` — bar progres, anggota, leaderboard |
| **Deep Link Handler** | Buka squad page dari link yang di-share |

## Not Doing (dan Alasannya)

- **Grup Permanen (lintas kampanye)** — Fitur ini akan sangat kompleks. Kita validasi dulu apakah squad per-kampanye sudah cukup menarik.
- **Chat di Dalam Squad** — Komunikasi cukup lewat WhatsApp. Membangun fitur chat akan sangat memperberat server dan scope.
- **Hadiah Fisik / Merchandise** — Tidak ada budget. Fokus ke digital rewards (badge/e-certificate) di fase awal.
- **Leaderboard Publik Antar Squad** — Bisa menimbulkan kompetisi tidak sehat. Leaderboard hanya internal squad.
- **Squad untuk Non-Logged-In Users** — Untuk MVP, semua anggota squad harus terdaftar. Ini memastikan tracking donasi yang akurat.

## Open Questions

- Apakah perlu minimum target squad atau bebas?
- Apakah squad otomatis ditutup setelah target tercapai, atau tetap buka sampai kampanye berakhir?
- Bagaimana handle jika campaign sudah berakhir tapi squad belum tercapai targetnya?

---

*Dokumen ini dihasilkan dari sesi Idea Refine pada 13 Mei 2026.*
