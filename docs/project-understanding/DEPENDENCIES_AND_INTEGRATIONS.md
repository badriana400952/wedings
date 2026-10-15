# 📦 DEPENDENCIES & INTEGRATIONS — DEPENDENSI & LAYANAN EKSTERNAL

Dokumen ini mendokumentasikan seluruh paket dependensi pustaka (*libraries*), integrasi layanan pihak ketiga, CDN eksternal, dan variabel lingkungan (*environment variables*).

---

## 1. Matriks Dependensi Utama (`package.json`)

### Dependensi Produksi (Runtime Dependencies)

| Nama Paket | Versi | Fungsi & Peran dalam Sistem |
| :--- | :---: | :--- |
| `next` | `^15.1.6` | Framework server & SSR Pages Router |
| `react` & `react-dom` | `^19.0.0` | Antarmuka pengguna komponen React |
| `@prisma/client` | `^6.19.3` | Klien ORM interaksi database PostgreSQL |
| `next-auth` | `^4.24.13` | Solusi autentikasi & JWT session management |
| `bcryptjs` | `^2.4.3` | Hashing dan verifikasi kata sandi admin |
| `cloudinary` | `^2.9.0` | SDK upload dan hosting media gambar di cloud |
| `formidable` | `^3.5.4` | Parser request stream multipart/form-data |
| `framer-motion` | `^12.34.5` | Pustaka animasi deklaratif komponen React |
| `canvas-confetti` | `^1.9.4` | Efek animasi konfeti selebrasi pada template |
| `use-sound` | `^5.0.0` | Hook pemutaran efek audio interaktif |
| `lucide-react` | `^0.577.0` | Ikon SVG modern untuk komponen UI |
| `axios` | `^1.13.5` | Klien HTTP pemanggilan API dari browser |
| `clsx` | `^2.1.1` | Penggabung kelas CSS kondisional yang efisien |
| `copong-date` | `^3.2.0` | Utilitas format tanggal berbahasa Indonesia |
| `react-countdown` | `^2.3.6` | Komponen hitung mundur hari H pernikahan |
| `react-device-detect` | `^2.2.3` | Deteksi tipe perangkat klien (mobile / desktop) |

### Dependensi Pengembangan (Development Tools)

| Nama Paket | Versi | Peran |
| :--- | :---: | :--- |
| `typescript` | `^5` | Kompilator & pemeriksa tipe data statis |
| `tailwindcss` | `^3.4.1` | Compiler utilitas styling Tailwind CSS |
| `postcss` & `autoprefixer`| `^8` / `^10` | Pemroses CSS build step |
| `prisma` | `^6.2.0` | CLI generator skema, migrasi, dan Prisma Studio |
| `ts-node` | `^10.9.2` | Eksekutor skrip TypeScript di lingkungan Node.js |
| `eslint` & `eslint-config-next`| `^9` / `^15` | Linter kualitas kode |

---

## 2. Integrasi Layanan Pihak Ketiga (External Integrations)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       INTEGRASI LAYANAN EKSTERNAL                           │
├─────────────────────┬────────────────────────────────┬──────────────────────┤
│ LAYANAN EKSTERNAL   │ IMPLEMENTASI DI KODE           │ FUNGSI & TUJUAN      │
├─────────────────────┼────────────────────────────────┼──────────────────────┤
│ PostgreSQL Database │ • lib/prisma.ts                │ Penyimpanan data     │
│ (Cloud / Local)     │ • prisma/schema.prisma         │ persisten aplikasi   │
├─────────────────────┼────────────────────────────────┼──────────────────────┤
│ Cloudinary CDN      │ • lib/cloudinary.ts            │ Hosting foto profil, │
│                     │ • pages/api/upload/image.ts    │ header, galeri album,│
│                     │ • pages/api/landing/[id].ts    │ dan foto QRIS        │
├─────────────────────┼────────────────────────────────┼──────────────────────┤
│ Google Maps         │ • Tautan linkMaps pada tombol  │ Navigasi lokasi akad │
│                     │   "Buka di Google Maps"        │ nikah & resepsi      │
├─────────────────────┼────────────────────────────────┼──────────────────────┤
│ Google Calendar     │ • Tautan linkGoogleCalender    │ Pengingat kalender   │
│                     │   pada tombol "Simpan Tanggal" │ otomatis bagi tamu   │
├─────────────────────┼────────────────────────────────┼──────────────────────┤
│ WhatsApp Web / API  │ • buildWhatsAppUrl()           │ Konfirmasi transfer  │
│                     │ • https://wa.me/{noHp}?text=.. │ amplop digital       │
└─────────────────────┴────────────────────────────────┴──────────────────────┘
```

---

## 3. Integrasi CDN Eksternal (Content Delivery Networks)

Disuntikkan secara global melalui [`pages/_app.tsx`](file:///pages/_app.tsx) dan [`pages/_document.tsx`](file:///pages/_document.tsx):

1. **Google Fonts (`fonts.googleapis.com`)**:
   - `Josefin Sans` (Teks modern elegan)
   - `Sacramento` (Font kaligrafi nama mempelai)
   - `Noto Naskh Arabic` (Kaligrafi ayat Al-Qur'an / doa pembuka)
2. **Bootstrap 5.3.8 (`cdn.jsdelivr.net`)**:
   - Grid layout dan utilitas styling bawaan Template A.
3. **FontAwesome 7.1.0 (`cdn.jsdelivr.net`)**:
   - Ikon font untuk navigasi, tombol media sosial, dan ikon kalender.
4. **AOS 2.3.4 (Animate On Scroll — `unpkg.com`)**:
   - Pustaka scroll reveal bawaan Template A.

---

## 4. Konfigurasi Variabel Lingkungan (`.env`)

Berikut adalah daftar variabel lingkungan yang dibutuhkan sistem tanpa menampilkan nilai kredensial rahasia:

| Nama Variabel | Wajib/Opsional | Deskripsi Fungsi |
| :--- | :---: | :--- |
| `POSTGRES_URL` / `DATABASE_URL` | **Wajib** | Connection string database PostgreSQL (Format: `postgresql://user:password@host:port/dbname`). |
| `NEXTAUTH_SECRET` | **Wajib** | Kunci acak enkripsi token JWT NextAuth untuk keamanan sesi login. |
| `NEXTAUTH_URL` | **Wajib** | URL dasar aplikasi (Contoh: `http://localhost:3000` di lokal atau domain produksi). |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | **Wajib** | Nama akun (*cloud name*) Cloudinary publik. |
| `CLOUDINARY_API_KEY` | **Wajib** | API Key otentikasi upload gambar ke Cloudinary. |
| `CLOUDINARY_API_SECRET` | **Wajib** | Secret Key autentikasi server ke Cloudinary. |
| `CLOUDINARY_URL` | Opsional | URL lengkap koneksi SDK Cloudinary. |
