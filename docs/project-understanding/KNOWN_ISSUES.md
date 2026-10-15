# ⚠️ KNOWN ISSUES — ISU DIKETAHUI, RISIKO, & AREA PERHATIAN

Dokumen ini mencatat rekam jejak masalah teknis yang telah diselesaikan (berdasarkan `docs/isue-clear.md` dan `docs/CHANGELOG.md`), potensi risiko arsitektur, ketidakpastian, dan area yang perlu diperhatikan oleh pengembang berikutnya.

---

## 1. Rekam Jejak Masalah Teknis Kritis & Solusinya (Resolved Issues)

| No | Masalah Teknis | Akar Penyebab (Root Cause) | Solusi yang Diterapkan |
| :---: | :--- | :--- | :--- |
| **1** | **DOM Wiping oleh React Hydration pada Template B, C, & D** | Re-render React saat membaca query URL menghapus elemen DOM asli vanilla script, memutuskan event listener tombol buka undangan. | Memasang delegated event listener di level `document` dengan capture phase, dan mengisolasi generator HTML agar di-mount stabil. |
| **2** | **Bypass Cover Prematur** | Pengecekan `sessionStorage` salah membaca status ketika browser baru pertama kali dibuka. | Standarisasi key `invitation_opened_{adminId}` dan memastikan status awal cover dicek sebelum manipulasi class `is-locked`. |
| **3** | **Page Refresh saat Submit Form** | Form HTML memiliki behavior default reload saat tombol submit diklik. | Mengganti tombol submit menjadi `type="button"`, menambahkan `onsubmit="return false;"` pada `<form>`, serta menangani submit via `fetch()` asinkron. |
| **4** | **Kartu Tersembunyi (Blank Background)** | Selektor IntersectionObserver `body > section` tidak cocok dengan struktur Next.js `body > #__next > div > ...`, sehingga elemen tetap tertahan `opacity: 0`. | Memperluas query selector observer menjadi `header, section, footer, [data-section], .sec`, serta memperbaiki margin negatif observer. |
| **5** | **SyntaxError JSON Parsing di Dashboard** | Ketika server mengembalikan halaman HTML error 500, fungsi `res.json()` melempar `SyntaxError: Unexpected token '<'`. | Menambahkan fungsi pembungkus `safeParseJson(response)` untuk menangani respon non-JSON secara aman. |
| **6** | **Prisma Client Binary Lock di Windows** | Hot-reload Next.js di Windows mengunci file `.dll` / binary engine Prisma saat migrasi atau regenerasi skema. | Menambahkan fallback query menggunakan Raw SQL (`prisma.$queryRawUnsafe` & `prisma.$executeRawUnsafe`) pada endpoint kritis seperti `/api/landing/[id]/musik`. |

---

## 2. Potensi Risiko & Area Perhatian Arsitektur (Potential Risks)

### A. Dual Engine Maintenance Overhead (React vs Vanilla JS)
- **Kondisi**: Template A menggunakan 100% komponen React, sedangkan Template B, C, dan D menggunakan generator string HTML dinamis yang dikendalikan oleh berkas vanilla JS besar di `/public/dist/` (`tumbuh-bersama.js` mencapai 3000+ baris).
- **Risiko**: Setiap perubahan skema kolom database atau styling baru harus disinkronkan di dua tempat: komponen React dan string template HTML.
- **Rekomendasi**: Pertahankan helper API terpusat (`tumbuhBersamaApi.ts`, `kirigamiPastelApi.ts`, `tamanRahasiaApi.ts`) untuk meminimalisir duplikasi logika.

### B. Otentikasi & Otorisasi Endpoint Publik
- **Kondisi**: Endpoint `/api/comments` dan `/api/ucapan` bersifat publik agar tamu tanpa login dapat mengirim konfirmasi kehadiran dan doa restu.
- **Risiko**: Risiko potensi *spamming* atau *flooding* pengiriman data dari bot/script otomatis.
- **Mitigasi Saat Ini**: Telah diterapkan pemangkasan teks (`cleanText`), pembatasan karakter maksimal (80 karakter nama, 2000 karakter pesan), serta pembacaan IP / User-Agent.
- **Rekomendasi Lanjutan**: Tambahkan rate limiting berbasis IP (misal via Redis / Upstash) atau integrasi Cloudflare Turnstile captcha jika aplikasi sudah go-live publik.

### C. File Upload Size & Cloudinary Quota
- **Kondisi**: Upload foto di Dashboard (`/api/upload/image` dan `/api/landing/[id]`) langsung dikirimkan ke Cloudinary menggunakan kredensial server.
- **Risiko**: Jika pengguna mengunggah foto resolusi tinggi (misal 20MB+ langsung dari kamera DSLR), proses upload dapat mengalami timeout pada jaringan lambat, serta memakan kuota bandwidth Cloudinary gratis.
- **Rekomendasi**: Tambahkan kompresi gambar di sisi klien (client-side image compression via canvas atau `browser-image-compression`) sebelum form di-submit ke backend.

### D. File `pages/index.tsx` Saat Ini Adalah Stub
- **Kondisi**: Berkas `pages/index.tsx` memiliki implementasi lama yang dikomentari (*commented out*) dan saat ini hanya merender teks stub `<h1>pagr</h1>`.
- **Dampak**: Pengunjung yang mengakses root URL `/` akan melihat halaman kosong/stub tersebut. Pengguna semestinya diarahkan langsung ke `/login` atau halaman landing profil tertentu.
- **Rekomendasi**: Konfirmasikan kepada pemilik projek apakah `pages/index.tsx` sebaiknya dialihkan otomatis (*redirect*) ke `/login` atau menampilkan direktori undangan.

---

## 3. Area yang Perlu Dikonfirmasi kepada Developer / User

1. **Pengalihan Root Route (`/`)**: Apakah halaman utama `pages/index.tsx` perlu dibuatkan redirect otomatis `router.push('/dashboard')` jika sudah login, atau ke `/login` jika belum?
2. **Katalog Musik Baru**: Bagaimana SOP penambahan lagu pernikahan baru ke dalam tabel `musik` — apakah cukup melalui script seeder `npm run seed:musik` atau perlu disediakan tab upload file MP3 langsung di dashboard admin?
3. **Penyimpanan Foto Bersama (Love Story)**: Apakah kuota 6 foto bersama sudah final untuk seluruh tema, atau ada kebutuhan penambahan slot di masa depan?
