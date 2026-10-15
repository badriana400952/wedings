# 🌟 PROJECT OVERVIEW — UNDANGAN DIGITAL NEXT.JS

## 1. Ringkasan Eksekutif
Aplikasi **Undangan Digital Next.js** adalah platform web undangan pernikahan digital multi-tenant, modern, dan interaktif yang dibangun menggunakan **Next.js (Pages Router)**, **React 19**, **Tailwind CSS**, dan **Prisma ORM** dengan database **PostgreSQL**.

Platform ini memungkinkan pengantin (Admin) untuk mengatur profil mempelai, jadwal acara akad & resepsi, album foto galeri, kisah cinta (*love story*), amplop digital (rekening bank & QRIS), serta memilih katalog musik pengiring dan salah satu dari **4 tema/template visual interaktif**. Tamu undangan dapat mengakses undangan melalui tautan personal (`/[userId]` atau `/[userId]/to/[guestName]`), menikmati pengalaman visual interaktif, mengonfirmasi kehadiran (RSVP), serta memberikan ucapan doa restu secara *real-time* tanpa *page refresh*.

---

## 2. Stack Teknologi Utama

| Layer / Kategori | Teknologi | Versi | Catatan Penggunaan |
| :--- | :--- | :--- | :--- |
| **Framework Web** | Next.js (Pages Router) | `^15.1.6` | SSR untuk SEO & metadata dinamis, API Routes internal |
| **Library UI** | React & React DOM | `^19.0.0` | Client components, hydration, lifecycle state |
| **Bahasa Pemrograman**| TypeScript | `^5` | Tipisasi ketat untuk model, API, dan komponen |
| **Styling & Design** | Tailwind CSS + Bootstrap 5 | `^3.4.1` / `5.3.8` | Utility-first CSS, Bootstrap CSS grid/helpers, FontAwesome |
| **Animasi & Interaksi**| Framer Motion, AOS, Canvas Confetti | `^12.34.5` / `2.3.4` | Transisi kartu, reveal-on-scroll, efek selebrasi |
| **Database ORM** | Prisma ORM | `^6.2.0` / `6.19.3`| Modeling skema, migrasi, dan akses query PostgreSQL |
| **Database Engine** | PostgreSQL | 14+ | Relational storage untuk users, templates, comments, ucapan |
| **Autentikasi** | NextAuth.js | `^4.24.13` | JWT Session strategy untuk Dashboard Admin (`/login`) |
| **Media & File Storage**| Cloudinary SDK | `^2.9.0` | Cloud hosting untuk foto mempelai, banner header, & QRIS |
| **Form & Multipart** | Formidable & Multer | `^3.5.4` | Parsing payload multipart/form-data pada upload foto |
| **Audio Engine** | Use-Sound & HTML5 Audio | `^5.0.0` | Background music (BGM) & audio efek interaktif (sobek kertas) |

---

## 3. Ekosistem Template Undangan

Aplikasi dilengkapi dengan 4 template undangan dengan gaya dan arsitektur visual yang unik:

```
                  ┌───────────────────────────────┐
                  │    KATALOG 4 TEMPLATE AKTIF   │
                  └───────────────┬───────────────┘
                                  │
         ┌────────────────┬───────┴────────┬────────────────┐
         ▼                ▼                ▼                ▼
   [Template A]     [Template B]     [Template C]     [Template D]
  Simple Modern    Taman Rahasia    Kirigami Pastel  Tumbuh Bersama
  (Pure React)      (Editorial)       (Papercraft)    (Living Tree)
```

1. **Template A — Simple Modern** (`@/components/templateA-simple-modern`):
   - Pendekatan 100% murni komponen React modular (WelcomePage, HomePage, BrideSection, WeddingDateSection, GallerySection, CommentSection).
   - Menggunakan Tailwind CSS, AOS scroll animation, dan theme switcher (Light/Dark mode).
2. **Template B — Taman Rahasia** (`@/components/templateB-taman-rahasia`):
   - Desain editorial botani bernuansa estetis, terinspirasi gaya majalah pernikahan premium.
   - Menggunakan hybrid render: generator HTML dinamis (`tamanRahasiaHtml.ts`), engine JS (`taman-rahasia.js`), CSS terisolasi, serta fitur khusus **Pohon Harapan** (`ucapan_harapan`).
3. **Template C — Kirigami Pastel** (`@/components/templateC-kirigami-pastel`):
   - Desain terinspirasi seni potong kertas Jepang (*kirigami*) dengan palet warna pastel lembut.
   - Transisi kartu interaktif, smooth scroll, pop-up lightbox galeri, dan formulir RSVP dinamis.
4. **Template D — Tumbuh Bersama** (`@/components/templateD-tumbuh-bersama`):
   - Desain botani interaktif tingkat lanjut dengan kanvas animasi pohon hidup (*living tree canvas*).
   - Fitur unik: Sampul sobek kertas realistis (*tear paper effect* dengan SFX), bibit mekar saat konfirmasi RSVP, dan **Kebun Doa** dinamis (`ucapan_harapan`).

---

## 4. Dua Domain Pengguna Utama

1. **Pengantin / Admin (`/dashboard`)**:
   - Dilindungi autentikasi NextAuth.
   - Memiliki 10 tab manajemen: Overview, Profil Mempelai, Detail Acara (Akad & Resepsi), Amplop Digital (Bank & QRIS), Album Galeri Foto, 6 Foto Cerita Cinta, Katalog Musik Latar, Moderasi Doa & RSVP, Pemilihan Template, dan Generator Tautan Tamu.
2. **Tamu Undangan (`/[userId]` atau `/[userId]/to/[guestName]`)**:
   - Bersifat **100% Read-Only** untuk tampilan konten mempelai.
   - Interaksi tamu terbatas pada:
     - Membuka sampul undangan (*Cover Open* / *Sobek Undangan*).
     - Memutar / menghentikan audio musik latar.
     - Mengisi kehadiran (RSVP) ke tabel `comments`.
     - Mengirimkan doa restu ke tabel `ucapan_harapan`.
     - Menyalin nomor rekening bank & konfirmasi via tautan WhatsApp.
     - Menekan tombol suka (*like*) pada ucapan tamu lain.

---

## 5. Nilai Kunci & Desain Sistem

- **Multi-Tenant Scoped Data**: Setiap pengguna memiliki `User.id` unik dan relasi `TemplateWeding` satu-ke-satu (`@relation(fields: [userId], references: [id])`).
- **Zero Page Reload**: Seluruh pengiriman formulir di sisi tamu menggunakan `event.preventDefault()`, tombol bertipe `type="button"`, dan manipulasi DOM lokal instan tanpa merefresh halaman browser.
- **Session-Persistent Invitation State**: Status sampul undangan yang sudah dibuka disimpan pada `sessionStorage` per `userId`, memastikan tamu yang berpindah tab atau me-reload halaman tidak terkunci di sampul depan.
- **Pemisahan 4 Fitur Utama Database**: Database menerapkan pemisahan ketat antara Album Galeri Foto (`galeries.fotos`), Kisah Pertemuan (`template_wedings.bersamaFotos`), Konfirmasi Kehadiran (`comments`), dan Pohon Harapan (`ucapan_harapan`).
