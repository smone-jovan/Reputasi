# donaria - Mobile App

Aplikasi mobile Donaria dibangun menggunakan Flutter untuk memberikan pengalaman donasi yang mulus di Android dan iOS.

## Fitur
- Login & Registrasi
- Jelajah Kampanye dengan Filter
- Donasi via QRIS & VA (Tripay)
- **Squad Donasi:** Buat dan gabung grup donasi
- Leaderboard internal squad
- Notifikasi real-time

## Persiapan
1. Pastikan Flutter SDK sudah terinstall.
2. Jalankan `flutter pub get` untuk instal dependensi.
3. Hubungkan device atau emulator.
4. Jalankan `flutter run`.

## Struktur Folder
- `lib/models/`: Definisi data (Squad, User, Donation, dll)
- `lib/providers/`: State management
- `lib/screens/`: Layar aplikasi
- `lib/services/`: Integrasi API
- `lib/widgets/`: Komponen UI reusable

## Konfigurasi API
Base URL API dapat diatur di `lib/config/api_config.dart`.
