# 📊 DOKUMENTASI LENGKAP SKEMA DATABASE & PENGGUNAAN FIELD TEMPLATE UNDANGAN

Dokumen ini berisi pemetaan lengkap seluruh tabel, field database, tipe data, serta status penggunaannya di berbagai template undangan pernikahan (**Template A, B, C, D, E**, dan template mendatang). Dokumen ini wajib diperbarui setiap kali ada penambahan template atau perubahan skema data.

---

## 📑 DAFTAR TABEL DATABASE

1. [`template_wedings` (Model: `TemplateWeding`)](#1-tabel-template_wedings-model-templateweding) — Tabel utama konten undangan
2. [`pertemuan` (Model: `Pertemuan`)](#2-tabel-pertemuan-model-pertemuan) — 4 Babak Kisah Cinta / Cerita Degustasi
3. [`galeries` (Model: `Galery`)](#3-tabel-galeries-model-galery) — Dokumentasi album galeri foto
4. [`musik` (Model: `Musik`)](#4-tabel-musik-model-musik) — Audio lagu pengiring undangan
5. [`comments` (Model: `Comment`)](#5-tabel-comments-model-comment) — Formulir Reservasi Kehadiran (RSVP)
6. [`likes` (Model: `Like`)](#6-tabel-likes-model-like) — Pelacak suka/like pada kartu RSVP
7. [`ucapan_harapan` (Model: `UcapanHarapan`)](#7-tabel-ucapan_harapan-model-ucapanharapan) — Formulir Buku Tamu / Catatan Doa Restu
8. [`users` (Model: `User`)](#8-tabel-users-model-user) — Routing slug undangan & konfigurasi user

---

## 1. Tabel `template_wedings` (Model: `TemplateWeding`)

Tabel utama yang menyimpan seluruh data konten dan konfigurasi undangan pernikahan.

| Kategori | Nama Field | Tipe Data | Keterangan Penggunaan di Template |
| :--- | :--- | :--- | :--- |
| **Relasi & Tema** | `id` | String (cuid) | ID unik template wedding (relasi ke komentar, ucapan, galeri, musik) |
| | `userId` | String | ID pemilik undangan (relasi ke tabel `users`) |
| | `designTheme` | Enum | Pilihan tema desain undangan di dashboard admin |
| **Mempelai Pria** | `namaPutra` | String | Nama panggilan mempelai pria (tampil di Cover, Hero, Rundown, Countdown, Kalender) |
| | `namaLengkapPutra` | String | Nama lengkap mempelai pria beserta gelar |
| | `namaAyahPutra` | String | Nama ayah mempelai pria |
| | `namaIbuPutra` | String | Nama ibu mempelai pria |
| | `kelahiranPutra` | String | Keterangan anak ke-berapa / putra dari |
| | `instagramPutra` | String | Akun/URL Instagram mempelai pria |
| | `photoPutra` | String | Foto profil kartu mempelai pria & fallback galeri |
| **Mempelai Wanita** | `namaPutri` | String | Nama panggilan mempelai wanita (Cover, Hero, Rundown, Countdown, Kalender) |
| | `namaLengkapPutri` | String | Nama lengkap mempelai wanita beserta gelar |
| | `namaAyahPutri` | String | Nama ayah mempelai wanita |
| | `namaIbuPutri` | String | Nama ibu mempelai wanita |
| | `kelahiranPutri` | String | Keterangan anak ke-berapa / putri dari |
| | `instagramPutri` | String | Akun/URL Instagram mempelai wanita |
| | `photoPutri` | String | Foto profil kartu mempelai wanita & fallback galeri |
| **Waktu & Acara** | `tanggalPernikahan` | DateTime | Tanggal utama acara & dasar kalkulasi Countdown penghitung waktu |
| | `jamMulai` | String | Jam mulai acara utama (digabung ke target Countdown) |
| | `jamSelesai` | String | Jam selesai acara utama |
| | `tanggalAkad` | DateTime | Tanggal Sesi 01 (Akad Nikah / Pemberkatan) |
| | `jamAkad` | String | Jam Sesi 01 (contoh: `08:00 - Selesai`) |
| | `lokasiAkad` | String | Nama tempat/gedung Akad Nikah |
| | `alamatAkad` | String | Alamat lengkap lokasi Akad Nikah |
| | `tanggalResepsi` | DateTime | Tanggal Sesi 02 (Jamuan Resepsi) |
| | `jamResepsi` | String | Jam Sesi 02 (contoh: `11:00 - Selesai`) |
| | `lokasiResepsi` | String | Nama tempat/gedung Resepsi |
| | `alamatResepsi` | String | Alamat lengkap lokasi Resepsi |
| | `linkMaps` | String | Tautan rute ke Google Maps untuk tombol penunjuk lokasi |
| | `linkGoogleCalender` | String | Tautan kustom simpan acara ke Google Calendar |
| **Foto & Media** | `fotoHeader` (1-4) | String? | Foto sampul / header bersama (Template A, B, C, D dan fallback foto bersama) |
| | `bersamaFotos` | String[] | Koleksi foto bersama (foto menu cerita degustasi di Template E & galeri) |
| | `bersamaDipakai` | String | Pilihan mode tampilan foto (`"taman"` / `"cerita"`) |
| | `galeryId` | String? | Relasi ke tabel `galeries` |
| | `musikId` | String? | Relasi ke tabel `musik` |
| **Tanda Kasih (Gift)** | `isGiftActive` | Boolean | Sakelar aktif/nonaktif section hadiah |
| | `isBankActive` | Boolean | Sakelar aktif/nonaktif transfer rekening bank |
| | `namaBank` | String? | Nama bank tujuan (BCA, Mandiri, BRI, BNI, dll.) |
| | `noAtm` | String? | Nomor rekening bank tujuan transfer |
| | `atasNama` | String? | Nama pemilik rekening bank (fallback ke `namaLengkapPutra`) |
| | `isQrisActive` | Boolean | Sakelar aktif/nonaktif pembayaran QRIS |
| | `fotoQris` | String? | URL berkas gambar QRIS |
| | `noHp` | String? | Nomor telepon / dompet digital (GoPay, OVO, Dana) |

---

## 2. Tabel `pertemuan` (Model: `Pertemuan`)

Menyimpan rangkaian cerita perjalanan cinta kedua mempelai. Di **Template E (Meja Sang Koki)**, babak ini diadaptasi menjadi **4 Babak Sajian Menu Degustasi**.

| Nama Field | Tipe Data | Keterangan Penggunaan di Template |
| :--- | :--- | :--- |
| `templateWedingId` | String | Relasi unik ke `TemplateWeding` |
| `judulPertemuanSatu` | String | Judul Cerita 1 (*Sajian Pertama: Pertemuan / Amuse-Bouche*) |
| `pertemuanPertama` | String | Isi teks kisah pertemuan pertama |
| `judulPertemuanDua` | String | Judul Cerita 2 (*Sajian Kedua: Pendekatan / Pembuka*) |
| `pertemuanKedua` | String | Isi teks kisah saling mengenal dan pendekatan |
| `judulPertemuanTiga` | String | Judul Cerita 3 (*Sajian Ketiga: Restu Keluarga / Sajian Utama*) |
| `pertemuanKetiga` | String | Isi teks kisah pertemuan keluarga & restu |
| `judulPertemuanEmpat` | String | Judul Cerita 4 (*Sajian Keempat: Lamaran / Hidangan Penutup*) |
| `pertemuanKeempat` | String | Isi teks kisah lamaran & komitmen |

---

## 3. Tabel `galeries` (Model: `Galery`)

Menyimpan album foto dokumentasi prewedding / galeri kedua mempelai.

| Nama Field | Tipe Data | Keterangan Penggunaan di Template |
| :--- | :--- | :--- |
| `id` | String (uuid) | ID Galeri (primary key) |
| `fotos` | String[] | Daftar URL foto dokumentasi galeri pernikahan |

---

## 4. Tabel `musik` (Model: `Musik`)

Menyimpan audio lagu pengiring undangan pernikahan.

| Nama Field | Tipe Data | Keterangan Penggunaan di Template |
| :--- | :--- | :--- |
| `id` | String (uuid) | ID Musik |
| `judul` | String | Judul lagu (ditampilkan di Template A, B, C) |
| `penyanyi` | String | Nama penyanyi/artis |
| `file` | String | URL berkas audio MP3 untuk tombol pemutar musik latar |

---

## 5. Tabel `comments` (Model: `Comment`)

Digunakan untuk formulir **Konfirmasi Reservasi Kehadiran (RSVP)**:

| Nama Field | Tipe Data | Keterangan Penggunaan di Template |
| :--- | :--- | :--- |
| `id` | String (uuid) | ID Komentar RSVP |
| `templateWedingId` | String? | Relasi ke template undangan terkait |
| `name` | String | Nama tamu undangan yang melakukan reservasi |
| `presence` | Boolean | Status konfirmasi (`true` = Hadir, `false` = Berhalangan) |
| `comment` | Text | Teks status, jumlah kursi (*pax*), dan pesan kehadiran |
| `likesCount` | Int | Jumlah apresiasi/suka pada kartu RSVP |
| `createdAt` | DateTime | Waktu pengiriman RSVP |

---

## 6. Tabel `likes` (Model: `Like`)

Digunakan untuk melacak tamu yang menekan tombol suka pada kartu reservasi:

| Nama Field | Tipe Data | Keterangan Penggunaan di Template |
| :--- | :--- | :--- |
| `id` | String (uuid) | ID Like |
| `commentId` | String | Relasi ke komentar pada tabel `comments` |
| `sessionId` | String | ID sesi pengunjung/browser (mencegah klik ganda) |

---

## 7. Tabel `ucapan_harapan` (Model: `UcapanHarapan`)

Digunakan untuk formulir **Buku Tamu / Catatan Doa Restu**:

| Nama Field | Tipe Data | Keterangan Penggunaan di Template |
| :--- | :--- | :--- |
| `id` | String (cuid) | ID Doa Restu |
| `templateWedingId` | String? | Relasi ke template undangan terkait |
| `name` | String | Nama pengirim doa restu |
| `ucapan` | Text | Pesan doa restu & harapan untuk kedua mempelai |
| `createdAt` | DateTime | Waktu pengiriman doa |

---

## 8. Tabel `users` (Model: `User`)

Digunakan untuk autentikasi admin dan routing halaman publik undangan:

| Nama Field | Tipe Data | Keterangan Penggunaan di Template |
| :--- | :--- | :--- |
| `id` | String (cuid) | Admin ID / User ID untuk slug URL publik (`/[adminId]`) |
| `template` | String | Pilihan template aktif (`"A"`, `"B"`, `"C"`, `"D"`, `"E"`) |
| `tz` | String? | Zona waktu user (`"WIB"`, `"WITA"`, `"WIT"`) |

---

## 🔍 ANALISIS PENGGUNAAN FIELD (DIGUNAKAN VS TIDAK DIGUNAKAN)

Berikut adalah tabel analisis perbandingan setiap field di seluruh tabel database, apakah berstatus **✅ Digunakan**, **⚠️ Parsial/Tertentu**, atau **❌ Tidak Digunakan**:

### 1. Tabel `template_wedings`

| Nama Field | Status | Template yang Menggunakan | Keterangan & Alasan Penggunaan |
| :--- | :---: | :---: | :--- |
| `namaPutra` | ✅ Digunakan | A, B, C, D, E | Nama panggilan mempelai pria (Hero, Cover, Rundown, Countdown, Kalender) |
| `namaLengkapPutra` | ✅ Digunakan | A, B, C, D, E | Nama lengkap mempelai pria beserta gelar & atas nama rekening default |
| `namaAyahPutra` | ✅ Digunakan | A, B, C, D, E | Nama ayah mempelai pria pada kartu keluarga / kartu mempelai |
| `namaIbuPutra` | ✅ Digunakan | A, B, C, D, E | Nama ibu mempelai pria pada kartu keluarga / kartu mempelai |
| `kelahiranPutra` | ✅ Digunakan | A, B, C, D, E | Keterangan putra ke-berapa / anak dari |
| `photoPutra` | ✅ Digunakan | A, B, C, D, E | Foto kartu bahan mempelai pria dan fallback foto galeri |
| `namaPutri` | ✅ Digunakan | A, B, C, D, E | Nama panggilan mempelai wanita (Hero, Cover, Rundown, Countdown, Kalender) |
| `namaLengkapPutri` | ✅ Digunakan | A, B, C, D, E | Nama lengkap mempelai wanita beserta gelar |
| `namaAyahPutri` | ✅ Digunakan | A, B, C, D, E | Nama ayah mempelai wanita pada kartu keluarga / kartu mempelai |
| `namaIbuPutri` | ✅ Digunakan | A, B, C, D, E | Nama ibu mempelai wanita pada kartu keluarga / kartu mempelai |
| `kelahiranPutri` | ✅ Digunakan | A, B, C, D, E | Keterangan putri ke-berapa / anak dari |
| `photoPutri` | ✅ Digunakan | A, B, C, D, E | Foto kartu bahan mempelai wanita dan fallback foto galeri |
| `tanggalPernikahan` | ✅ Digunakan | A, B, C, D, E | Tanggal utama pernikahan & dasar kalkulasi countdown waktu mundur |
| `jamMulai` | ✅ Digunakan | A, B, C, D, E | Jam mulai acara utama (digabung ke target countdown) |
| `tanggalAkad` | ✅ Digunakan | A, B, C, D, E | Tanggal pelaksanaan Sesi 01 (Akad Nikah / Pemberkatan) |
| `jamAkad` | ✅ Digunakan | A, B, C, D, E | Waktu pelaksanaan Sesi 01 (Akad Nikah) |
| `lokasiAkad` | ✅ Digunakan | A, B, C, D, E | Nama gedung/tempat pelaksanaan Sesi 01 |
| `alamatAkad` | ✅ Digunakan | A, B, C, D, E | Alamat lengkap lokasi pelaksanaan Sesi 01 |
| `tanggalResepsi` | ✅ Digunakan | A, B, C, D, E | Tanggal pelaksanaan Sesi 02 (Jamuan Resepsi) |
| `jamResepsi` | ✅ Digunakan | A, B, C, D, E | Waktu pelaksanaan Sesi 02 (Resepsi) |
| `lokasiResepsi` | ✅ Digunakan | A, B, C, D, E | Nama gedung/tempat pelaksanaan Sesi 02 |
| `alamatResepsi` | ✅ Digunakan | A, B, C, D, E | Alamat lengkap lokasi pelaksanaan Sesi 02 |
| `linkMaps` | ✅ Digunakan | A, B, C, D, E | Tautan penunjuk arah rute ke Google Maps |
| `linkGoogleCalender` | ✅ Digunakan | A, B, C, D, E | Tautan kustom tombol simpan reservasi ke Google Calendar |
| `bersamaFotos` | ✅ Digunakan | A, B, C, D, E | Foto bersama (foto sajian degustasi di E & galeri) |
| `galeryId` | ✅ Digunakan | A, B, C, D, E | Relasi foreign key ke tabel galeri foto |
| `musikId` | ✅ Digunakan | A, B, C, D, E | Relasi foreign key ke audio lagu latar |
| `isGiftActive` | ✅ Digunakan | A, B, C, D, E | Sakelar (toggle) menampilkan/menyembunyikan section hadiah |
| `isBankActive` | ✅ Digunakan | A, B, C, D, E | Sakelar menampilkan nomor rekening transfer bank |
| `namaBank` | ✅ Digunakan | A, B, C, D, E | Nama bank tujuan transfer (BCA, Mandiri, BRI, dll.) |
| `noAtm` | ✅ Digunakan | A, B, C, D, E | Nomor rekening bank tujuan transfer |
| `atasNama` | ✅ Digunakan | A, B, C, D, E | Nama pemilik rekening bank |
| `isQrisActive` | ✅ Digunakan | A, B, C, D, E | Sakelar menampilkan barcode pembayaran QRIS |
| `fotoQris` | ✅ Digunakan | A, B, C, D, E | Gambar QRIS barcode pembayaran digital |
| `instagramPutra` | ⚠️ Parsial | A, B, C, E | Badge Instagram mempelai pria (di belakang kartu mempelai) |
| `instagramPutri` | ⚠️ Parsial | A, B, C, E | Badge Instagram mempelai wanita (di belakang kartu mempelai) |
| `fotoHeader (1-4)` | ⚠️ Parsial | A, B, C, D | Header/banner hero; di E sebagai salah satu alternatif foto bersama |
| `noHp` | ⚠️ Parsial | A, B | Nomor dompet digital; di C, D, E difokuskan pada Bank & QRIS |
| `bersamaDipakai` | ⚠️ Parsial | B | Pilihan tata letak foto khusus di Template B (*Taman Rahasia*) |
| `designTheme` | ❌ Tidak Digunakan | Admin Only | Pengaturan enum internal dashboard admin, tidak tampil di UI tamu |
| `comentIds` | ❌ Tidak Digunakan | Legacy | Kolom array legacy; relasi menggunakan `Comment.templateWedingId` |
| `pertemuanId` | ❌ Tidak Digunakan | Relasi Balik | Relasi diarahkan dari tabel `pertemuan.templateWedingId` |
| `alamatGedungPernikahan` | ❌ Tidak Digunakan | Redundan | Duplikasi data dari `lokasiAkad` dan `lokasiResepsi` |
| `alamatPernikahan` | ❌ Tidak Digunakan | Redundan | Duplikasi data dari `alamatAkad` dan `alamatResepsi` |
| `jamSelesai` | ❌ Tidak Digunakan | Redundan | Menggunakan format fleksibel `WIB - Selesai` pada `jamAkad`/`jamResepsi` |
| `createdAt`, `updatedAt` | ❌ Tidak Digunakan | Backend | Timestamp audit database internal, tidak ditampilkan di UI |

---

### 2. Tabel `pertemuan` (Kisah Cinta / Menu Degustasi)

| Nama Field | Status | Template yang Menggunakan | Keterangan & Alasan Penggunaan |
| :--- | :---: | :---: | :--- |
| `judulPertemuanSatu` | ✅ Digunakan | A, B, C, D, E | Judul Babak 1 (*Sajian Pertama: Pertemuan*) |
| `pertemuanPertama` | ✅ Digunakan | A, B, C, D, E | Narasi teks kisah pertemuan pertama |
| `judulPertemuanDua` | ✅ Digunakan | A, B, C, D, E | Judul Babak 2 (*Sajian Kedua: Pendekatan*) |
| `pertemuanKedua` | ✅ Digunakan | A, B, C, D, E | Narasi teks kisah saling mengenal / pendekatan |
| `judulPertemuanTiga` | ✅ Digunakan | A, B, C, D, E | Judul Babak 3 (*Sajian Ketiga: Restu Keluarga*) |
| `pertemuanKetiga` | ✅ Digunakan | A, B, C, D, E | Narasi teks kisah pertemuan keluarga & restu |
| `judulPertemuanEmpat` | ✅ Digunakan | A, B, C, D, E | Judul Babak 4 (*Sajian Keempat: Lamaran/Janji*) |
| `pertemuanKeempat` | ✅ Digunakan | A, B, C, D, E | Narasi teks kisah lamaran & komitmen |
| `id` | ❌ Tidak Digunakan | Database | Primary key internal tabel |
| `templateWedingId` | ❌ Tidak Digunakan | Database | Foreign key relasi ke `TemplateWeding` |

---

### 3. Tabel `galeries` (Album Foto)

| Nama Field | Status | Template yang Menggunakan | Keterangan & Alasan Penggunaan |
| :--- | :---: | :---: | :--- |
| `fotos` | ✅ Digunakan | A, B, C, D, E | Array URL foto dokumentasi galeri pernikahan |
| `id` | ❌ Tidak Digunakan | Database | Primary key internal tabel |

---

### 4. Tabel `musik` (Audio Musik Latar)

| Nama Field | Status | Template yang Menggunakan | Keterangan & Alasan Penggunaan |
| :--- | :---: | :---: | :--- |
| `file` | ✅ Digunakan | A, B, C, D, E | URL file audio MP3 untuk tombol pemutar musik latar |
| `judul` | ⚠️ Parsial | A, B, C | Judul lagu (tampil di badge musik template A, B, C) |
| `penyanyi` | ⚠️ Parsial | A, B, C | Nama artis (tampil di badge musik template A, B, C) |
| `id` | ❌ Tidak Digunakan | Database | Primary key internal tabel |
| `createdAt`, `updatedAt` | ❌ Tidak Digunakan | Backend | Timestamp audit database |

---

### 5. Tabel `comments` (Formulir RSVP Kursi)

| Nama Field | Status | Template yang Menggunakan | Keterangan & Alasan Penggunaan |
| :--- | :---: | :---: | :--- |
| `name` | ✅ Digunakan | A, B, C, D, E | Nama tamu yang melakukan reservasi kehadiran |
| `presence` | ✅ Digunakan | A, B, C, D, E | Status konfirmasi (`true` = Hadir, `false` = Berhalangan) |
| `comment` | ✅ Digunakan | A, B, C, D, E | Catatan reservasi dan jumlah kursi/pax |
| `likesCount` | ✅ Digunakan | A, B, C, D, E | Jumlah suka/like pada kartu RSVP |
| `createdAt` | ✅ Digunakan | A, B, C, D, E | Waktu pengiriman reservasi (format: *x waktu lalu*) |
| `id` | ✅ Digunakan | A, B, C, D, E | ID komentar untuk handler tombol suka (like) |
| `parentId`, `replies` | ❌ Tidak Digunakan | Fitur Nonaktif | Komentar bertingkat/balasan tidak diaktifkan di undangan tamu |
| `gif` | ❌ Tidak Digunakan | Fitur Nonaktif | Gambar GIF tidak disediakan di antarmuka tamu |
| `ip`, `userAgent` | ❌ Tidak Digunakan | Keamanan | Disimpan hanya untuk filter spam & keamanan backend |
| `updatedAt` | ❌ Tidak Digunakan | Backend | Timestamp audit database |

---

### 6. Tabel `likes` (Pelacak Suka RSVP)

| Nama Field | Status | Template yang Menggunakan | Keterangan & Alasan Penggunaan |
| :--- | :---: | :---: | :--- |
| `commentId` | ✅ Digunakan | Backend/API | Menghubungkan like ke catatan komentar tertentu |
| `sessionId` | ✅ Digunakan | Backend/API | Mencegah 1 pengunjung/browser menyukai lebih dari 1 kali |
| `id` | ❌ Tidak Digunakan | Database | Primary key internal tabel |

---

### 7. Tabel `ucapan_harapan` (Buku Tamu / Catatan Doa)

| Nama Field | Status | Template yang Menggunakan | Keterangan & Alasan Penggunaan |
| :--- | :---: | :---: | :--- |
| `name` | ✅ Digunakan | A, B, C, D, E | Nama pengirim ucapan dan doa restu |
| `ucapan` | ✅ Digunakan | A, B, C, D, E | Teks isi doa restu untuk kedua mempelai |
| `createdAt` | ✅ Digunakan | A, B, C, D, E | Waktu kirim doa restu |
| `id` | ❌ Tidak Digunakan | Database | Primary key internal tabel |
| `ip`, `userAgent` | ❌ Tidak Digunakan | Keamanan | Disimpan hanya untuk audit keamanan backend |
| `updatedAt` | ❌ Tidak Digunakan | Backend | Timestamp audit database |

---

### 8. Tabel `users` (Routing & Konfigurasi)

| Nama Field | Status | Template yang Menggunakan | Keterangan & Alasan Penggunaan |
| :--- | :---: | :---: | :--- |
| `id` | ✅ Digunakan | Frontend Routing | ID user untuk slug URL publik undangan (`/[adminId]`) |
| `template` | ✅ Digunakan | Frontend Routing | Menentukan template mana yang di-render (`A`, `B`, `C`, `D`, `E`) |
| `tz` | ✅ Digunakan | Semua Template | Zona waktu user (`WIB`, `WITA`, `WIT`) pada jam acara |
| `email`, `password`, `role` | ❌ Tidak Digunakan | Admin Auth | Autentikasi dan login admin dashboard, tidak tampil di tamu |

---

## 📌 ATURAN PENGEMBANGAN TEMPLATE BARU

Saat menambahkan template baru di masa mendatang:
1. **Daftarkan Template**: Tambahkan identitas template pada enum/field `user.template` (misal: `"F"`).
2. **Reuse Komponen**: Gunakan endpoint API yang ada (`/api/comments`, `/api/ucapanharapan`, `/api/likes`).
3. **Kompatibilitas Field**: Selalu dukung field inti (`linkGoogleCalender`, `instagramPutra`, `instagramPutri`, `isBankActive`, `isQrisActive`).
4. **Update Dokumen**: Perbarui dokumen ini dengan mencantumkan nama template baru dan variasi field yang digunakannya.
