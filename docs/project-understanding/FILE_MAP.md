# 🗺️ FILE MAP — PETA DIREKTORI & TANGGUNG JAWAB BERKAS

Dokumen ini memetakan seluruh berkas dan direktori penting di dalam codebase beserta tanggung jawab fungsional masing-masing.

---

## 1. Struktur Direktori Tingkat Atas (Top-Level Structure)

```
undangan/
├── components/          # Komponen UI React, template visual, dan generator HTML
├── docs/                # Dokumentasi sistem, rekam jejak changelog, & solusi isu
├── hooks/               # Custom React hooks untuk data fetching & state
├── lib/                 # Utilitas server, Prisma client, Cloudinary, & parser
├── pages/               # Routing Next.js Pages Router (SSR, Views, & REST APIs)
├── prisma/              # Skema database Prisma, migrations, & data seeders
├── public/              # Berkas statis (audio MP3, CSS template, engine JS vanilla)
├── scripts/             # CLI utility scripts (manajemen admin, fix galeri, dsb.)
├── styles/              # Global CSS styling & Tailwind directives
├── types/               # Definisi tipe TypeScript global & deklarasi NextAuth
├── Rules.md             # Aturan fundamental sistem & database untuk AI Agent
└── AGENTS.md            # Instruksi operasional kerja AI Agent
```

---

## 2. Rincian Direktori & Tanggung Jawab Berkas

### 📁 `pages/` — Halaman Aplikasi & REST API

| Berkas | Tanggung Jawab & Peran |
| :--- | :--- |
| `pages/_app.tsx` | Entry point global aplikasi Next.js: menyuntikkan `SessionProvider`, Google Fonts, Bootstrap 5, FontAwesome, dan AOS. |
| `pages/_document.tsx` | Struktur HTML dasar (`<html>`, `<head>`, `<body>`, `<NextScript>`). |
| `pages/index.tsx` | Halaman utama awal (sekarang menjadi placeholder stub, alur pengguna dialihkan ke `/[...slug].tsx` dan `/dashboard`). |
| `pages/login.tsx` | Halaman login pengantin/admin dengan `signIn('credentials')` NextAuth. |
| `pages/register.tsx` | Halaman pendaftaran user baru (jika registrasi publik diaktifkan). |
| `pages/dashboard.tsx` | **Admin Dashboard Utama**: 10 tab konfigurasi lengkap (mempelai, acara, galeri, musik, amplop, dsb.) terhubung ke API. |
| `pages/[...slug].tsx` | **Guest View Catch-All SSR**: Membaca parameter slug (`/[userId]` atau `/[userId]/to/[guestName]`), query data dari PostgreSQL via Prisma, dan merender template yang aktif (A, B, C, atau D) secara Read-Only. |

#### 📂 `pages/api/` — Endpoint API Backend

| Endpoint | Method | Tanggung Jawab |
| :--- | :---: | :--- |
| `api/auth/[...nextauth].ts` | `*` | Konfigurasi NextAuth JWT provider, validasi bcrypt password, dan injeksi atribut user ke token session. |
| `api/auth/register.ts` | `POST` | Pendaftaran akun admin baru dengan hashing password bcrypt. |
| `api/comments/index.ts` | `GET, POST` | Mengambil dan membuat konfirmasi kehadiran (RSVP) di tabel `comments`. Mendukung filter query `?kind=rsvp` atau `?kind=wish`. |
| `api/comments/[id]/like.ts` | `POST` | Toggle like komentar/RSVP berbasis cookie `session_id`. Mengupdate `likesCount` dan mencatat entri di tabel `likes`. |
| `api/comments/[id]/delete.ts` | `DELETE` | Menghapus komentar/RSVP oleh admin pemilik undangan (`userId` check). |
| `api/ucapan/index.ts` | `GET, POST` | Mengambil dan membuat ucapan doa restu tamu di tabel khusus `ucapan_harapan` (Pohon Harapan / Kebun Doa). |
| `api/ucapan/[id]/delete.ts` | `DELETE` | Menghapus entri ucapan doa oleh admin pemilik undangan. |
| `api/landing/index.ts` | `GET` | Mengambil ringkasan data undangan. |
| `api/landing/[id].ts` | `GET, PUT` | Mengambil dan memperbarui data profil mempelai & jadwal via multipart form (`formidable`) serta upload foto Cloudinary. |
| `api/landing/[id]/bersama.ts` | `PUT, POST` | Endpoint khusus mengupdate array **6 foto kebersamaan** (`bersamaFotos`) dan target penempatan (`bersamaDipakai: 'taman' \| 'cerita'`). |
| `api/landing/[id]/musik.ts` | `PUT, POST` | Endpoint khusus menetapkan ID musik latar (`musikId`) yang dipilih pengantin. |
| `api/galery/[id].ts` | `GET, PUT` | Mengambil dan mengupdate kumpulan foto album photoshoot pada tabel `galeries.fotos`. |
| `api/musik/index.ts` | `GET` | Mengambil daftar katalog seluruh audio musik latar yang tersedia dari tabel `musik`. |
| `api/stats.ts` | `GET` | Mengambil statistik ringkas kehadiran: total komentar, likes, jumlah hadir, dan tidak hadir. |
| `api/upload/image.ts` | `POST` | Menerima upload file gambar tunggal/ganda via `formidable` dan mengunggahnya ke Cloudinary folder `udangan/gallery`. |
| `api/user/template.ts` | `PUT` | Memperbarui pilihan template aktif user (`"A"`, `"B"`, `"C"`, `"D"`). |

---

### 📁 `components/` — Arsitektur Komponen UI & Template Undangan

#### 📂 `components/dashboard/` — Modular Admin Dashboard Components
- `types.ts`: Interface TypeScript untuk state form, tab, komentar, dan statistik dashboard.
- `DashboardHeader.tsx`: Header bilah atas admin (indikator template, link live preview, logout).
- `DashboardSidebar.tsx`: Navigasi sidebar 10 tab dengan status aktif dan ikon interaktif.
- `tabs/TabOverview.tsx`: Tab ringkasan statistik (ucapan, hadir, absent, likes) & tabel komentar.
- `tabs/TabMempelai.tsx`: Form profil mempelai pria (`*Putra`) dan wanita (`*Putri`).
- `tabs/TabAcara.tsx`: Form pengaturan jadwal hari-H, akad nikah, resepsi, maps, dan calendar.
- `tabs/TabGift.tsx`: Pengaturan amplop digital, nomor rekening bank, QRIS, dan konfirmasi WhatsApp.
- `tabs/TabGaleri.tsx`: Manajemen album foto galeri photoshoot (`galeries.fotos`).
- `tabs/TabBersama.tsx`: Manajemen 6 slot foto bersama (`bersamaFotos`) & target lokasi (`bersamaDipakai`).
- `tabs/TabUcapan.tsx`: Tabel moderasi ucapan doa tamu pada Pohon Harapan (`ucapan_harapan`).
- `tabs/TabMusik.tsx`: Katalog musik latar dengan audio preview & pemilihan lagu aktif.
- `tabs/TabTemplate.tsx`: Katalog pemilihan 4 template (`A`, `B`, `C`, `D`).
- `tabs/TabLinks.tsx`: Generator tautan tamu personal dengan salin clipboard & pesan WhatsApp.
- `index.ts`: Sentral ekspor seluruh komponen dashboard.

#### 📂 `components/templates/` — Sentral Registrasi Template
- `index.ts`: Ekspor sentral seluruh template (`SimpleModern`, `TamanRahasia`, `KirigamiPastel`, `TumbuhBersama`) dan object mapping `default { A, B, C, D }`.
- `SimpleModern.tsx`, `TemplateB.tsx`, `SimpleSederhana.tsx`, `TumbuhBersama.tsx`: Re-ekspor modul ke folder spesifik.

#### 📂 `components/templateA-simple-modern/` (Template A)
- `SimpleModern.tsx`: Komponen utama wrapper Template A.
- `WelcomePage.tsx`: Halaman cover / amplop sambutan dengan animasi buka undangan.
- `HomePage.tsx`: Beranda utama mempelai.
- `BrideSection.tsx`: Profil mempelai pria dan wanita.
- `WeddingDateSection.tsx`: Hitung mundur, jadwal akad, dan resepsi.
- `GallerySection.tsx`: Masonry grid album foto galeri.
- `LoveGiftSection.tsx`: Nomor rekening bank, penyalinan rekening, dan QRIS.
- `CommentSection.tsx`: Formulir kehadiran dan ucapan.
- `BottomNav.tsx`, `AudioButton.tsx`, `ThemeButton.tsx`, `Footer.tsx`: Navigasi dan kontrol UI.

#### 📂 `components/templateB-taman-rahasia/` (Template B — Taman Rahasia)
- `TamanRahasia.tsx`: Wrapper React yang mengelola state cover, inisialisasi musik latar, integrasi galeri, dan event form.
- `tamanRahasiaHtml.ts`: Generator markup HTML lengkap bergaya majalah editorial botani.
- `tamanRahasiaApi.ts`: Helper API untuk `fetchUcapanes`, `postUcapan`, `postRsvp`, dan `toggleLike`.

#### 📂 `components/templateC-kirigami-pastel/` (Template C — Kirigami Pastel)
- `KirigamiPastel.tsx`: Wrapper React yang menangani buka sampul (*paper open*), transisi kartu kirigami, dan scroll observer.
- `kirigamiPastelHtml.ts`: Generator markup HTML berbasis motif potongan kertas Jepang (*kirigami*).
- `kirigamiPastelApi.ts`: Helper API untuk formulir RSVP dan Pohon Harapan.

#### 📂 `components/templateD-tumbuh-bersama/` (Template D — Tumbuh Bersama)
- `TumbuhBersama.tsx`: Wrapper React utama untuk kanvas pohon hidup (*living tree*), kontrol audio sobek kertas, dan event submit zero-reload.
- `tumbuhBersamaHtml.ts`: Generator markup induk yang merangkai 20+ sub-bagian menjadi satu dokumen utuh.
- `tumbuhBersamaApi.ts`: Helper API untuk Kebun Doa (`/api/ucapan`), RSVP Menanam (`/api/comments`), dan salin rekening ATM.
- `section-*.ts`: File modular pemecah bagian HTML:
  - `section-cover.ts`: Sampul amplop sobek benih (*Tear & Plant*).
  - `section-hero.ts`: Header utama dan kanvas pohon hidup.
  - `section-couple.ts`: Profil kedua mempelai botani.
  - `section-events.ts`: Jadwal akad & resepsi.
  - `section-countdown.ts`: Hitung mundur hari H.
  - `section-story.ts`: 4 babak kisah cinta dari tabel `pertemuan`.
  - `section-gallery.ts`: Album foto botani.
  - `section-gifts.ts`: Transfer via ATM, tombol salin, dan QRIS.
  - `section-rsvp.ts`: Formulir interaktif RSVP "Ikut Menanam?".
  - `section-wishes.ts`: Formulir dan feed "Kebun Doa".
  - `section-closing.ts`: Kalimat penutup dan doa restu.

---

### 📁 `lib/` — Utilitas & Konfigurasi Server

| Berkas | Tanggung Jawab |
| :--- | :--- |
| `lib/prisma.ts` | Inisialisasi Prisma Client singleton dengan pencegahan multiple instance saat hot-reload di environment development. |
| `lib/cloudinary.ts` | Konfigurasi instance Cloudinary SDK menggunakan kredensial lingkungan. |
| `lib/comment-kind.ts` | Helper parsing dan penandaan jenis komentar: `RSVP_PREFIX = '[RSVP]'`, `readCommentKind()`, dan `stripRsvpPrefix()`. |

---

### 📁 `prisma/` — Skema Database & Migrasi

| Berkas | Tanggung Jawab |
| :--- | :--- |
| `schema.prisma` | Definisi seluruh model relasional: `User`, `TemplateWeding`, `UcapanHarapan`, `Pertemuan`, `Galery`, `Musik`, `Comment`, `Like`, `Session`. |
| `schema.types.ts` | Tipe data antarmuka TypeScript untuk model-model Prisma. |
| `seed-musik.ts` | Skrip pengisian awal katalog musik pernikahan ke dalam tabel `musik`. |
| `seed-badriana.ts`, `seed.ts` | Skrip seeder contoh akun pengantin dan data pernikahan lengkap. |

---

### 📁 `public/` — Aset Statis & Vanilla Engine

| Direktori / Berkas | Tanggung Jawab |
| :--- | :--- |
| `public/dist/tumbuh-bersama.js` | Engine kanvas pohon botani, procedural branch rendering, particle leaves, sound synthesizer, dan scroll controller untuk Template D. |
| `public/dist/kirigami-pastel.js`| Engine interaksi kartu, lightbox galeri foto, dan countdown timer untuk Template C. |
| `public/dist/taman-rahasia.js`  | Engine visual dan interaksi kartu majalah untuk Template B. |
| `public/css/tumbuh-bersama.css` | Stylesheet komprehensif untuk animasi, kanvas, kartu bunga, dan tata letak Template D. |
| `public/css/kirigami-pastel.css`| Stylesheet tema potongan kertas pastel Template C. |
| `public/css/taman-rahasia.css`  | Stylesheet editorial botani Template B. |
| `public/audio/tear-paper.mp3`   | Efek suara realistis saat tamu merobek amplop cover Template D. |
