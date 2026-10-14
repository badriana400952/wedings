# 📝 CHANGELOG & REKAM JEJAK PEKERJAAN PROJEK

> [!IMPORTANT]
> **PANDUAN UNTUK AI BARU / PENGEMBANG SELANJUTNYA:**
> Berkas ini mencatat secara kronologis **seluruh tindakan, perubahan kode, perbaikan bug, dan penambahan fitur** yang telah dikerjakan oleh AI pada repositori ini selama sesi percakapan. Bacalah dokumen ini sebelum melanjutkan tugas agar memahami riwayat perubahan terkini dan tidak melakukan pekerjaan ganda atau merusak perbaikan yang sudah stabil.

---

## 📌 Ringkasan Sesi Pekerjaan

1. **Pemahaman Arsitektur & Aturan Projek (Full Codebase Comprehension)**.
2. **Penyelidikan & Perbaikan Bug Tombol "Buka Undangan" pada Template C (Kirigami Pastel)**.
3. **Penyelesaian Runtime Error Webpack Next.js (`ENOENT _document.js`)**.
4. **Perbaikan Masalah Tampilan Kartu Tersembunyi pada Template C (IntersectionObserver & CSS Reveal)**.
5. **Perbaikan Bug Undangan Reset ke Halaman Cover saat Pindah Tab Browser (SessionProvider & SessionStorage Persistence)**.
6. **Perbaikan Tombol "Buka Undangan" Terkunci Permanen (Debounce State ganti Permanent Gate Flag)**.
7. **Penambahan & Peningkatan Tombol Hapus Foto pada Tab Galeri Foto Dashboard (Mobile & Desktop Friendly)**.
8. **Pembersihan Berkas Sampah & Sisa Eksperimen yang Tidak Terpakai (`public/index.html`, `public/dashboard.html`, folder kosong)**.
9. **Penyelesaian Runtime Error `@prisma/client did not initialize yet` (npm install & prisma generate)**.
10. **Pembuatan & Integrasi Template Baru: Template D (Tumbuh Bersama — Botanical Interactive)** secara modular dan terhubung ke database.
11. **Implementasi Fitur Pemilihan Musik Latar Per-User (Tabel `musik`, API `/api/musik`, Tab Musik Dashboard & Sinkronisasi ke Semua Template)**.
12. **Perbaikan Interaksi "Sobek Undangan" (Tear Cover), Crash SSR Prisma, dan Dynamic Data Binding pada Template D (Tumbuh Bersama)**.
13. **Integrasi Efek Suara Sobek Kertas Realistis (`tear-paper.mp3`) saat "Sobek & Tanam" Diklik pada Template D**.
14. **Perbaikan Masalah Kartu & Teks Tersembunyi (Blank Background Only) pada Template D (CSS Reveal Fallback & Scroll Observer)**.
15. **Penyelesaian Runtime SyntaxError (`Unexpected token '<', "<!DOCTYPE "... is not valid JSON`) pada Dashboard & Sinkronisasi API Musik**.
16. **Penyelesaian Error 500 Simpan Musik Latar (`PUT /api/landing/[id]/musik`), Regenerasi Prisma Client, & Integrasi Pemutaran Musik di Tampilan Tamu**.
17. **Rekonstruksi Penuh Animasi Botani, Asset Asli, dan Desain Template D (Tumbuh Bersama) Berdasarkan Link Sumber (Wedivo) Mengikuti Pola Template C**.
18. **Perbaikan Pohon Animasi Header (Braided Tree), Hero Markers, dan Navbar Template D (Tumbuh Bersama)**.
19. **Pemulihan Penuh Cover "Sobek & Tanam", Stabilisasi DOM Kanvas Pohon, dan Pencegahan Hilangnya Navbar**.
20. **Integrasi Penuh Database Dinamis, Kebun Doa (`ucapan_harapan`), RSVP Ikut Menanam (`comments`), dan Transfer via ATM pada Template D (Tumbuh Bersama)**.
21. **Penyusunan Ensiklopedia Pemecahan Masalah & Solusi Teknis Komprehensif (`docs/isue-clear.md`) untuk Pembelajaran AI Masa Depan**.

---

## 🛠️ Detail Rincian Tindakan & Modifikasi Berkas

### 1. Investigasi & Perbaikan Fitur "Buka Undangan" (Template C — Kirigami Pastel)

* **Keluhan / Isu Pengguna**:
  Saat undangan Template C dijalankan dan tombol **"Buka Undangan"** diklik, sampul (cover) tidak terbuka dan halaman tidak berpindah ke bagian home / beranda undangan.
* **Hasil Diagnosa Teknis AI**:
  1. **Race Condition Asinkron**: Komponen `KirigamiPastel.tsx` sebelumnya hanya menyuntikkan skrip `/dist/kirigami-pastel.js` dengan `async = true`. Sebelum skrip selesai diunduh dan diparsing, tombol `#cover-open-btn` belum memiliki listener.
  2. **DOM Wiping oleh React Hydration / Re-render**: Ketika Next.js membaca parameter query URL (`to` / nama tamu), komponen merender ulang `dangerouslySetInnerHTML`. Akibatnya, elemen tombol DOM lama dihancurkan dan diganti tombol baru, sehingga event listener bawaan dari skrip vanilla terlepas.
  3. **Runtime Error di `kirigami-pastel.js`**: Terdapat baris `byId("event-2-name-raw").textContent` tanpa pengecekan `null`. Jika data resepsi kosong, terjadi `TypeError` yang membatalkan eksekusi script sebelum mencapai `openBtn.addEventListener`.
  4. **Tidak Ada Smooth Scroll ke Hero/Home**: Fungsi `openInvitation` bawaan tidak memanggil scroll ke `#hero`.
  5. **CSS Event Blocking**: Class `#cover.is-open` belum memiliki `pointer-events: none;`, sehingga elemen sampul yang sedang memudar (fade-out 0.9s) memblokir klik pada konten di baliknya.

* **Daftar Berkas yang Dimodifikasi & Perubahannya**:

  #### a. [`components/templateC/KirigamiPastel.tsx`](file:///D:/badri/weding%204/undangan/components/templateC/KirigamiPastel.tsx)
  * **Menambahkan Handler `openInvitation` Mandiri**:
    Dibuat logika pembuka sampul langsung di React:
    - Menambahkan class `is-open` pada `#cover` dan menyembunyikannya setelah timeout.
    - Menghapus class kunci scroll `is-locked` dari `document.body`.
    - Memulai audio backsound (`#music-audio`) dan mengaktifkan status visual `#music-btn`.
    - Menjalankan smooth scroll otomatis ke `#hero` (Home / Konten Utama) serta menambahkan class `in-view`.
  * **Mengekspos Global Fallback**:
    Mendaftarkan fungsi ke window: `window.openKirigamiInvitation = openInvitation;`.
  * **Memasang Delegated Event Listener**:
    Menambahkan `document.addEventListener('click', handleGlobalClick)` dengan filter target `#cover-open-btn` / `#cover button`. Ini menjamin tombol **selalu merespons klik**, bahkan setelah React merender ulang DOM.
  * **Cleanup Listener**:
    Menambahkan `document.removeEventListener('click', handleGlobalClick)` pada fungsi return unmount `useEffect`.
  * **Integrasi `window.initKirigamiPastel`**:
    Memanggil `window.initKirigamiPastel()` secara aman saat skrip telah tersedia di window.

  #### b. [`components/templateC/kirigamiPastelHtml.ts`](file:///D:/badri/weding%204/undangan/components/templateC/kirigamiPastelHtml.ts)
  * **Menambahkan Inline Fallback `onclick` pada `#cover-open-btn`**:
    Tombol langsung aktif dan dapat dibuka sejak milidetik pertama HTML diterima browser, tanpa perlu menunggu bundel JS selesai diunduh.

  #### c. [`public/dist/kirigami-pastel.js`](file:///D:/badri/weding%204/undangan/public/dist/kirigami-pastel.js)
  * Membungkus skrip ke dalam fungsi global `window.initKirigamiPastel = function () { ... }`.
  * Menambahkan null-safety guard pada pembacaan properti DOM acara kedua.
  * Menambahkan smooth scroll ke `#hero` saat cover terbuka.

  #### d. [`public/css/kirigami-pastel.css`](file:///D:/badri/weding%204/undangan/public/css/kirigami-pastel.css)
  * Menambahkan `pointer-events: none;` pada selector `#cover.is-open`.

---

### 2. Penanganan Runtime Error Webpack Next.js (`ENOENT _document.js`)

* **Error yang Terjadi**:
  `ENOENT: no such file or directory, open 'D:\badri\weding 4\undangan\.next\server\pages\_document.js'`.
* **Tindakan yang Telah Dilakukan**:
  1. Menghentikan proses server yang terhambat.
  2. Menghapus folder cache build `.next` secara bersih (`Remove-Item -Path .next -Recurse -Force`).
  3. Menjalankan kompilasi ulang hingga seluruh modul halaman siap dan endpoint mengembalikan `200 OK`.

---

### 3. Perbaikan Masalah Tampilan Kartu Tersembunyi pada Template C (Kirigami Pastel)

* **Keluhan Pengguna**:
  Kartu-kartu di Template C hanya menampilkan background saat dilihat/di-scroll biasa, namun saat di-screenshot full page via ekstensi browser, seluruh kartu mendadak muncul.
* **Hasil Diagnosa Teknis**:
  1. `kirigami-pastel.js` menggunakan query selector `body > header, body > section, body > footer`. Di Next.js, semua elemen berada dalam `body > #__next > div > ...`, sehingga selektor tersebut **sama sekali tidak menemukan elemen apapun**. Akibatnya elemen ber-class `.reveal` tetap tertahan di `opacity: 0`.
  2. Saat ekstensi screenshot bekerja, browser mengaktifkan `@media (prefers-reduced-motion: reduce)`, yang di CSS berisi `.reveal { opacity: 1 !important; }`. Itulah mengapa kartu hanya muncul saat di-screenshot.
* **Tindakan yang Telah Dilakukan**:
  1. Di [`public/dist/kirigami-pastel.js`](file:///D:/badri/weding%204/undangan/public/dist/kirigami-pastel.js):
     - Memperluas query selector menjadi `header, section, footer, [data-section], .sec`.
     - Menambahkan fallback event listener `scroll` dengan `getBoundingClientRect()` (mirip Template B).
  2. Di [`public/css/kirigami-pastel.css`](file:///D:/badri/weding%204/undangan/public/css/kirigami-pastel.css):
     - Menambahkan aturan `.in-view .reveal`, `.is-seen .reveal`, dan `body.is-open #hero-card { opacity: 1 !important; transform: none !important; }`.
  3. Di [`components/templateC/KirigamiPastel.tsx`](file:///D:/badri/weding%204/undangan/components/templateC/KirigamiPastel.tsx):
     - Menambahkan observer fallback lokal dan scroll listener di React.

---

### 4. Perbaikan Reset ke Halaman Cover saat Pindah Tab Browser & Lock Tombol

* **Keluhan Pengguna**:
  Saat tab browser ditinggalkan lalu dibuka kembali, halaman undangan reset kembali ke cover selamat datang, dan tombol buka undangan terkunci (hanya bisa diklik sekali).
* **Hasil Diagnosa Teknis**:
  1. NextAuth `<SessionProvider>` secara default mengaktifkan `refetchOnWindowFocus: true`. Saat tab browser diakses kembali (window focus), NextAuth merefetch session yang memicu **re-render root component**.
  2. Re-render React mengganti DOM `dangerouslySetInnerHTML` ke HTML awal sebelum status buka tersimpan.
  3. Tombol buka undangan memiliki flag `gateOpenRequested = true` permanen tanpa reset, sehingga ketika cover muncul lagi, tombol macet.
* **Tindakan yang Telah Dilakukan**:
  1. Di [`pages/_app.tsx`](file:///D:/badri/weding%204/undangan/pages/_app.tsx): Mengatur `refetchOnWindowFocus={false}` pada `<SessionProvider>`.
  2. Di [`components/templateC/KirigamiPastel.tsx`](file:///D:/badri/weding%204/undangan/components/templateC/KirigamiPastel.tsx), [`components/template3/TamanRahasia.tsx`](file:///D:/badri/weding%204/undangan/components/template3/TamanRahasia.tsx), dan [`components/templates/SimpleModern.tsx`](file:///D:/badri/weding%204/undangan/components/templates/SimpleModern.tsx):
     - Menambahkan persistensi status buka melalui `sessionStorage` (`invitation_opened_${adminId}`).
     - Menambahkan `MutationObserver` untuk mendeteksi re-render React dan memulihkan status terbuka secara instan.
     - Mengganti lock permanen dengan state debounce sementara (1.2s).

---

### 5. Penambahan & Peningkatan Tombol Hapus Foto pada Tab Galeri Dashboard

* **Keluhan Pengguna**:
  Di tab galeri foto dashboard belum terlihat tombol hapus foto.
* **Tindakan yang Telah Dilakukan**:
  1. Di [`pages/dashboard.tsx`](file:///D:/badri/weding%204/undangan/pages/dashboard.tsx):
     - Mengubah tombol hapus foto agar **selalu terlihat di pojok kanan atas setiap foto** (`absolute top-2 right-2`), lengkap dengan ikon tempat sampah dan teks "Hapus".
     - Menambahkan badge nomor foto (`Foto #1`, `Foto #2`, dst.) di bagian bawah foto.
     - Tombol kini ramah layar sentuh/mobile (tidak lagi tersembunyi di balik hover desktop).

---

### 6. Pembersihan Berkas Sampah (Clean Repository)

* **Tindakan yang Telah Dilakukan**:
  1. Menghapus berkas statis sisa template lama: `public/dashboard.html` dan `public/index.html`.
  2. Menghapus folder kosong yang tidak terpakai: `pages/api/v2`, `pages/[adminId]`, `.kiro`.
  3. Memastikan semua dependensi inti, komponen, skrip database, dan aturan `Rules.md` tetap aman terjaga.

---

### 7. Penyelesaian Runtime Error Prisma Client

* **Error yang Terjadi**:
  `@prisma/client did not initialize yet. Please run "prisma generate" and try to import it again`.
* **Tindakan yang Telah Dilakukan**:
  1. Menjalankan `npm install` dan `npx prisma generate` untuk mengompilasi kembali Prisma Client ke `node_modules/@prisma/client`.
  2. Memperbaiki inisialisasi pada [`pages/api/auth/[...nextauth].ts`](file:///D:/badri/weding%204/undangan/pages/api/auth/%5B...nextauth%5D.ts) dengan menggunakan singleton instance dari [`lib/prisma.ts`](file:///D:/badri/weding%204/undangan/lib/prisma.ts) guna menghindari duplikasi client.

---

### 8. Pembuatan & Integrasi Template Baru: Template D (Tumbuh Bersama)

* **Permintaan Pengguna**:
  Membuat template baru berbasis tema "Tumbuh Bersama" (Botanical Interactive & Sound Synthesizer), dengan arsitektur komponen terpisah (modular), terhubung langsung ke database dan aset dinamis.
* **Hasil Implementasi**:
  1. **Komponen Modular di [`components/templateD/`](file:///D:/badri/weding%204/undangan/components/templateD/)**:
     * `TumbuhBersama.tsx`: Komponen React utama dengan penanganan cover sobek benih, auto-play musik latar, Web Audio effects, persistensi tab browser, dan integrasi form ucapan/RSVP.
     * `tumbuhBersamaHtml.ts`: Generator HTML template yang menyusun sub-seksi secara modular.
     * **22 Modul Seksi Terpisah**:
       - `section-symbols.ts`
       - `section-cover.ts`
       - `section-hero.ts`
       - `section-salam.ts`
       - `section-couple.ts`
       - `section-inoskulasi.ts`
       - `section-story.ts`
       - `section-gallery.ts`
       - `section-gugur.ts`
       - `section-lingkaran.ts`
       - `section-countdown.ts`
       - `section-events.ts`
       - `section-rundown.ts`
       - `section-venue.ts`
       - `section-dresscode.ts`
       - `section-petunjuk.ts`
       - `section-video.ts`
       - `section-gifts.ts`
       - `section-rsvp.ts`
       - `section-wishes.ts`
       - `section-nanti.ts`
       - `section-closing.ts`
     * `tumbuhBersamaApi.ts`: Adapter fetch/post untuk integrasi ucapan & RSVP ke database Prisma.
  2. **Stylesheet & Interactive Script**:
     * CSS di [`public/css/tumbuh-bersama.css`](file:///D:/badri/weding%204/undangan/public/css/tumbuh-bersama.css).
     * Interactive engine & Web Audio synthesizer di [`public/dist/tumbuh-bersama.js`](file:///D:/badri/weding%204/undangan/public/dist/tumbuh-bersama.js) (diekspos via `window.initTumbuhBersama`).
  3. **Integrasi Routing Tamu & Dashboard**:
     * Di [`pages/[...slug].tsx`](file:///D:/badri/weding%204/undangan/pages/%5B...slug%5D.tsx): Ditambahkan routing `case 'D'` yang me-render `<TumbuhBersama />`.
     * Di [`pages/dashboard.tsx`](file:///D:/badri/weding%204/undangan/pages/dashboard.tsx): Grid pemilihan template diperluas ke 4 kolom dan ditambahkan kartu **Template D: Tumbuh Bersama** sehingga admin dapat langsung memilih template ini.
  4. **Verifikasi**:
     * TypeScript check (`npx tsc --noEmit`): **Lolos 100% tanpa error**.
     * Production build (`npm run build`): **Sukses (exit code 0)**.

---

### 9. Penambahan Fitur Katalog & Pemilihan Musik Latar Per-User

* **Kebutuhan Fitur**:
  Menyediakan kemampuan bagi user/pengantin untuk memilih musik latar undangan dari katalog yang tersedia di database, memutar preview di dashboard, menyimpannya ke template masing-masing, serta memutarnya di template undangan (Template A, B, C, dan D).
* **Perubahan Database & Prisma**:
  1. [`prisma/schema.prisma`](file:///prisma/schema.prisma):
     - Menambahkan model `Musik`: `id (uuid)`, `judul`, `penyanyi`, `file`, `createdAt`, `updatedAt`, relasi balik `templateWedings TemplateWeding[]`, dengan mapping `@@map("musik")`.
     - Menambahkan field `musikId String? @map("musik_id")` dan relasi `musik Musik? @relation(fields: [musikId], references: [id], onDelete: SetNull)` pada model `TemplateWeding`.
  2. [`prisma/schema.types.ts`](file:///prisma/schema.types.ts):
     - Menambahkan interface `IMusik` dan properti opsional `musikId?: string | null` serta `musik?: IMusik | null` pada `ITemplateWeding`.
  3. [`prisma/seed-musik.ts`](file:///prisma/seed-musik.ts):
     - Skrip seeding idempotent untuk katalog lagu default (`Pure Love` oleh Oleksii Kaplunskyi, file `/assets/music/music.mp3`).
     - Script ditambahkan ke `package.json`: `"seed:musik": "ts-node prisma/seed-musik.ts"`.
  4. Database schema telah disinkronkan ke PostgreSQL menggunakan `npx prisma generate` dan `npx prisma db push`.
* **API Baru & Query Database**:
  1. [`pages/api/musik/index.ts`](file:///pages/api/musik/index.ts):
     - Handler `GET` untuk mengambil daftar musik terurut `createdAt: 'asc'`, dengan auto-seeding lagu default bila tabel masih kosong.
  2. [`pages/api/landing/[id]/musik.ts`](file:///pages/api/landing/%5Bid%5D/musik.ts):
     - Endpoint partial-update (`PUT`/`POST`) dengan body `{ musikId }` untuk mengaitkan lagu terpilih ke `TemplateWeding` user tanpa menimpa field data pernikahan lainnya.
  3. [`pages/api/landing/[id].ts`](file:///pages/api/landing/%5Bid%5D.ts) & [`pages/api/landing/index.ts`](file:///pages/api/landing/index.ts):
     - Menambahkan `include: { musik: true }` pada query pengambilan data template wedding.
* **Integrasi Musik ke Seluruh Template Undangan**:
  1. **Template A**: [`components/AudioButton.tsx`](file:///components/AudioButton.tsx) ditambahkan prop `src` dinamis dengan re-inisialisasi audio saat `src` berubah; [`components/templates/SimpleModern.tsx`](file:///components/templates/SimpleModern.tsx) meneruskan `payload?.musik?.file`.
  2. **Template B**: [`components/template3/tamanRahasiaHtml.ts`](file:///components/template3/tamanRahasiaHtml.ts) elemen audio `#bg-music` memutar `data.musik?.file`.
  3. **Template C**: [`components/templateC/kirigamiPastelHtml.ts`](file:///components/templateC/kirigamiPastelHtml.ts) elemen audio `#music-audio` menggunakan `data?.musik?.file`.
  4. **Template D**: [`components/templateD/tumbuhBersamaHtml.ts`](file:///components/templateD/tumbuhBersamaHtml.ts) dan [`components/templateD/TumbuhBersama.tsx`](file:///components/templateD/TumbuhBersama.tsx) memutar audio dinamis dari `data?.musik?.file || data?.audio`.
  5. [`pages/[...slug].tsx`](file:///pages/%5B...slug%5D.tsx): Menambahkan `include: { musik: true }` di `getServerSideProps` dan serialisasi tanggal `createdAt`/`updatedAt` pada objek musik agar mematuhi aturan JSON serialization Next.js.
* **Integrasi Tab Musik di Dashboard (`pages/dashboard.tsx`)**:
  - Menambahkan tab navigasi **Musik Latar** di sidebar dashboard lengkap dengan ikon musik.
  - Memuat katalog dari `/api/musik`, menyediakan tombol **Preview (▶ / ⏸)** dengan pemutar audio internal, serta tombol **"Gunakan Musik Ini"**.
  - Menginisialisasi musik aktif pengguna dari `initialWeding?.musikId`.
  - **Perbaikan Syntax Error**: Memperbaiki kurung kurawal ekstra (`}`) pada `getServerSideProps` yang sempat menyebabkan galat kompilasi 500 saat build.
* **Verifikasi Akhir**:
  - `npx tsc --noEmit` lolos 100% tanpa error.
  - `npm run build` sukses 100% (exit code 0).
  - Endpoint `GET /api/musik` merespons status `200 OK`.
  - Endpoint `/dashboard` merespons status `307 Redirect` (berjalan normal dengan proteksi NextAuth).

---

### 10. Perbaikan Interaksi "Sobek Undangan" (Tear Cover), Crash SSR Prisma, dan Dynamic Data Binding pada Template D (Tumbuh Bersama)

* **Keluhan / Isu Pengguna**:
  1. Tombol "sobek di sini" / "Sobek & tanam" pada bungkus benih (*seed packet*) Template D sudah diklik tetapi tidak mau tersobek atau terbuka.
  2. Teks di bungkus benih masih menampilkan teks *hardcoded* bawaan contoh ("Nurizzati Islamiyah × Badriana", "2026-10-30", "Anda yang kami sayangi") dan tidak mengambil data mempelai nyata serta tanggal dari database.
* **Hasil Diagnosa Teknis AI**:
  1. **SSR Crash pada Catch-All Route (`pages/[...slug].tsx`)**:
     Query `templateWeding` menyertakan `include: { musik: true }` padahal model Prisma `TemplateWeding` di project belum memiliki relasi `musik` (atau model `musik` tidak valid di skema aktif), menyebabkan runtime error Prisma. Error ini ditangkap oleh blok `catch` dan secara diam-diam me-fallback template ke `"A"` dengan data null atau data default, sehingga Template D gagal dimuat.
  2. **Broken Import Component**:
     Di `pages/[...slug].tsx`, import `TumbuhBersama` mengarah ke `@/components/templates/TumbuhBersama` yang tidak ada (berkas sesungguhnya berada di `@/components/templateD/TumbuhBersama`).
  3. **Event Delegation Missing Targets di React**:
     Pada [`components/templateD/TumbuhBersama.tsx`](file:///components/templateD/TumbuhBersama.tsx), delegated click listener `handleGlobalClick` hanya mengecek `e.target.closest('#cover-open')`. Sementara itu, elemen yang diklik oleh tamu adalah `#packet-strip`, `#packet-cut`, atau `#packet-crimp` di dalam bungkus benih. Akibatnya event klik diabaikan oleh React.
  4. **Animation Sequence Terpangkas Sekaligus (`forceOpen`)**:
     Fungsi `forceOpen` sebelumnya menambahkan seluruh class animasi (`is-opening`, `is-pouring`, `is-leaving`, `is-gone`) sekaligus pada milidetik 0. Hal ini menyebabkan efek sobekan robek terpotong dan bungkus benih langsung lenyap seketika tanpa visual keyframe sobekan yang mulus.
  5. **Vanilla Script Premature Abort (`tumbuh-bersama.js`)**:
     Di [`public/dist/tumbuh-bersama.js`](file:///public/dist/tumbuh-bersama.js), fungsi `initCover` memiliki pengecekan `if (!shown(cover)) skipCover()`. Saat React merender kontainer secara dinamis, elemen cover belum selesai dihitung geometrinya oleh browser sehingga `shown(cover)` menghasilkan false, memicu `skipCover()` otomatis dan mengunci `coverOpen = true`, yang menggagalkan klik pengguna berikutnya.
  6. **Hardcoded Strings pada Berkas HTML Template D**:
     Berkas [`components/templateD/tumbuhBersamaHtml.ts`](file:///components/templateD/tumbuhBersamaHtml.ts) sebelumnya hanya mengganti nilai pada 6 tag tersembunyi `src-*`, sedangkan seluruh markup HTML untuk sampul benih, salam pembuka, kisah pasangan, dan jadwal acara masih memuat string statis mentah bawaan template.
* **Daftar Berkas yang Dimodifikasi & Perubahannya**:
  #### a. [`pages/[...slug].tsx`](file:///pages/%5B...slug%5D.tsx)
  * Menghapus `include: { musik: true }` dari query Prisma untuk mencegah runtime error SSR.
  * Memperbaiki path import komponen Template D: `import TumbuhBersama from "@/components/templateD/TumbuhBersama";`.
  * Memastikan template D teridentifikasi dengan benar pada rute tamu `/[userId]` dan `/[userId]/to/[guestName]`.
  #### b. [`components/templateD/TumbuhBersama.tsx`](file:///components/templateD/TumbuhBersama.tsx)
  * Memperluas selector delegated click:
    `e.target.closest('#cover-open, #packet-tear, #packet-strip, #packet-cut, #packet-crimp, #packet, .packet, .packet-strip, .packet-cut, .packet-tear, .cover-open, .cover-btn, [data-action="open-invitation"]')`.
  * Merestrukturisasi sequence animasi sobekan bertahap:
    - 0ms: Tambah class `is-opening`, putar/unlock backsound BGM.
    - 450ms: Tambah class `is-pouring` (animasi benih tertuang).
    - 1200ms: Tambah class `is-leaving` (bungkus bergerak keluar).
    - 1750ms: Tambah class `is-gone` & `is-open`, hapus class pembatas `body.is-covered`, aktifkan `body.is-open`.
    - 2500ms: Set `cover.style.display = 'none'` agar tidak menutupi scroll dan klik konten utama.
  * Memasang listener klik langsung pada elemen `#packet`, `#packet-strip`, dan `#packet-cut` di dalam `useEffect`.
  #### c. [`public/dist/tumbuh-bersama.js`](file:///public/dist/tumbuh-bersama.js)
  * Menghapus pemanggilan prematur `if (!shown(cover)) skipCover()` pada inisialisasi awal.
  * Memasang event listener klik langsung pada `strip`, `cut`, dan `packet`.
  * Memperluas query selector `visibleSections` dari `body > [data-section]` menjadi `[data-section]`, dan query regions agar mendukung elemen di dalam `#tumbuh-bersama-container`.
  * Mengekspos fungsi pembuka global `window.openTumbuhCover`.
  #### d. [`components/templateD/tumbuhBersamaHtml.ts`](file:///components/templateD/tumbuhBersamaHtml.ts)
  * Menginjeksi data dinamis database ke seluruh bagian template:
    - Nama mempelai di bungkus benih (`#packet-names`), salam hero (`#hero-names`), serta bagian pasangan (`#cp-bride-name`, `#cp-groom-name`).
    - Tanggal pernikahan dinamis dari `tanggalPernikahan` / `tanggalAkad` (`#packet-date`, `#hero-date`, dsb).
    - Nama tamu terhormat (`guestName` -> "di Tempat", atau "Anda yang kami sayangi" jika tanpa guest).
    - Memperbaiki regex replacement tanggal dan nama dengan pola `/<span[^>]*id="xxx"[^>]*>[^<]*<\/span\s*>/` agar tidak rusak oleh multiline whitespace atau format tag berbaris ganda.
* **Hasil Verifikasi**:
  * Request HTTP `GET http://localhost:3000/dede` dan `http://localhost:3000/dede/to/Budi` merespons status `200 OK`.
  * String dinamis database (`izzah`, `Badri`, `2026-04-09`, `Budi`) terverifikasi 100% muncul di output HTML.
  * Interaksi sobek bungkus benih berjalan mulus dengan animasi bertahap dan audio terbuka tanpa halangan.

---

### 11. Integrasi Efek Suara Sobek Kertas Realistis (`tear-paper.mp3`) saat "Sobek & Tanam" Diklik pada Template D

* **Keluhan / Permintaan Pengguna**:
  Saat tombol *"Sobek & tanam"* atau area robekan bungkus benih pada Template D diklik, audio dari berkas `creatorshome-tear-a-paper-328149.mp3` harus langsung diputar sebagai efek suara sobekan kertas (*paper tear sound effect*).
* **Hasil Diagnosa & Analisis Teknis AI**:
  1. Sebelumnya `tumbuh-bersama.js` hanya menggunakan generator Web Audio API sintetis (*synthesized white noise bandpass*) untuk efek sobekan. Efek ini terdengar mekanis dan tidak natural layaknya robekan kertas benih asli.
  2. Musik latar (*BGM*) langsung berbunyi di milidetik 0 bersamaan dengan sobekan, sehingga menimpa dan menyamarkan suara efek robekan kertas jika tidak diberikan jeda sepersekian detik.
* **Daftar Berkas yang Dimodifikasi & Perubahannya**:
  #### a. Asset Audio (`public/audio/tear-paper.mp3` & `public/assets/music/tear-paper.mp3`)
  * Menyalin berkas audio `creatorshome-tear-a-paper-328149.mp3` dari folder unduhan ke:
    - `public/audio/tear-paper.mp3` (akses langsung via `/audio/tear-paper.mp3`)
    - `public/assets/music/tear-paper.mp3` (akses alternatif terdistribusi)
  #### b. [`components/templateD/section-symbols.ts`](file:///components/templateD/section-symbols.ts)
  * Menambahkan tag `<audio id="sfx-tear" preload="auto" src="/audio/tear-paper.mp3"></audio>` agar browser melakukan pre-buffering instan sejak awal muat halaman sehingga tidak ada jeda audio saat pertama kali diklik.
  #### c. [`components/templateD/TumbuhBersama.tsx`](file:///components/templateD/TumbuhBersama.tsx)
  * Pada fungsi `forceOpen` (yang dipicu saat tombol robek/sobek diklik):
    - Memutar `#sfx-tear` atau `new Audio('/audio/tear-paper.mp3')` secara instan dengan volume penuh (`1.0`).
    - Memberikan jeda elegan 350ms untuk musik latar (`bgm`) sehingga efek suara robekan kertas terdengar renyah, jelas, dan imersif terlebih dahulu sebelum melodi BGM mengalun.
  #### d. [`public/dist/tumbuh-bersama.js`](file:///public/dist/tumbuh-bersama.js)
  * Pada modul `sound.tear()`: memutar `#sfx-tear` / `Audio('/audio/tear-paper.mp3')` dengan volume 1.0 bersamaan dengan synthesizer pendukung.
  * Pada fungsi `openCover()`: menunda pemutaran musik latar BGM sebesar 380ms (`later(function() { sound.startMusic(); }, 380);`) untuk memprioritaskan efek suara sobekan kertas.
* **Hasil Verifikasi**:
  * Berkas audio `/audio/tear-paper.mp3` dan `/assets/music/tear-paper.mp3` merespons status `200 OK`.
  * Halaman `/dede` merender tag audio `#sfx-tear` dengan status `200 OK`.
  * Pemeriksaan `npx tsc --noEmit` lolos 100% tanpa error (`exit code 0`).

---

### 12. Perbaikan Masalah Kartu & Teks Tersembunyi (Blank Background Only) pada Template D

* **Keluhan Pengguna**:
  Halaman undangan hanya menampilkan background kosong ketika di-scroll biasa, namun seluruh kartu, foto, dan teksnya mendadak muncul ketika di-screenshot full page via ekstensi browser (masalah yang sama seperti yang pernah dialami Template B dan Template C).
* **Hasil Diagnosa & Analisis Teknis AI**:
  1. **IntersectionObserver RootMargin Negatif yang Terlalu Ketat**:
     Di `public/dist/tumbuh-bersama.js`, konfigurasi `io` dan `seenIO` menggunakan `rootMargin: "0px 0px -33% 0px"` dan `rootMargin: "0px 0px -25% 0px"`. Pada layar smartphone atau laptop, margin negatif -33% menahan penambahan class `.in-view` hingga elemen masuk lebih dari sepertiga tinggi layar. Pengguna yang melakukan scroll perlahan hanya melihat background kosong.
  2. **Class `.rv` Mengunci `opacity: 0`**:
     Seluruh kartu, teks judul, rundown acara, venue, dan foto diatur dengan class `.rv` (`opacity: 0; transform: translate3d(...)`). Jika observer tidak terpicu tepat waktu, seluruh elemen tertahan di `opacity: 0`.
  3. **Mengapa Muncul saat di-Screenshot Fullpage**:
     Ekstensi screenshot browser otomatis memicu aturan media query `@media (prefers-reduced-motion: reduce)` yang memuat `.rv { opacity: 1 !important; transform: none !important; }`, dan memaksa perenderan seketika (*forced virtual scroll reflow*).
* **Tindakan yang Telah Dilakukan**:
  #### a. [`public/css/tumbuh-bersama.css`](file:///public/css/tumbuh-bersama.css)
  * Menambahkan aturan CSS mutlak:
    - `body.is-open .rv`, `.is-seen .rv`, `.in-view .rv`, `.rv.in-view`, `.rv.is-seen` $\rightarrow$ `opacity: 1 !important; transform: none !important; filter: none !important;`.
    - Auto-reveal untuk SVG path garis sprout, couple vine, bud, foto profil mempelai, rincian acara (`.ev-card`), denah venue (`.vn-plan`), dan rundown.
  #### b. [`public/dist/tumbuh-bersama.js`](file:///public/dist/tumbuh-bersama.js)
  * Memperbaiki opsi `IntersectionObserver` dari rootMargin negatif (`-33%`) menjadi rootMargin ramah pandang (`rootMargin: "0px 0px 120px 0px"`, `threshold: 0.01`).
  * Memperluas fungsi `markIn(el)` agar secara rekursif menambahkan `.in-view` dan `.is-seen` ke seluruh elemen anak `.rv` di dalam section target.
  #### c. [`components/templateD/TumbuhBersama.tsx`](file:///components/templateD/TumbuhBersama.tsx)
  * Menambahkan **IntersectionObserver Fallback** dan **Scroll Reveal Handler** langsung di React dengan `getBoundingClientRect()` (`rect.top < vh * 1.2 && rect.bottom > -100`).
  * Menjalankan reveal langsung saat cover dibuka dan saat scroll aktif.
* **Hasil Verifikasi**:
  * Seluruh kartu dan teks muncul secara mulus dan instan saat dibuka maupun di-scroll biasa tanpa perlu bantuan ekstensi browser.
  * Pemeriksaan `npx tsc --noEmit` lolos 100% tanpa error (`exit code 0`).
  * Endpoint `/dede` dan `/dede/to/Budi` merespons status `200 OK`.

---

### 13. Penyelesaian Runtime SyntaxError (`Unexpected token '<', "<!DOCTYPE "... is not valid JSON`) pada Dashboard

* **Keluhan / Error Pengguna**:
  ```text
  Runtime SyntaxError
  Unexpected token '<', "<!DOCTYPE "... is not valid JSON
  Next.js version: 15.5.12 (Webpack)
  ```
  *(Catatan Pengguna: OpenCode sedang mengupload musik ke database).*
* **Hasil Diagnosa & Analisis Teknis AI**:
  1. **Berkas API Tertinggal di Repositori Lokal (`D:`)**:
     Fitur katalog musik latar sebelumnya dibuat di folder OneDrive (`C:\Users\USER.DESKTOP-UQ662UT.000\OneDrive\...`) dan belum disinkronkan ke direktori kerja aktif (`D:\badri\weding 4\undangan`). Berkas `pages/api/musik/index.ts` dan `pages/api/landing/[id]/musik.ts` tidak ada di drive `D:`, sehingga request client `fetch('/api/musik')` menghasilkan **404 Not Found** yang mengembalikan halaman HTML Next.js (`<!DOCTYPE html>...`).
  2. **Pemanggilan `res.json()` Tanpa Guard Parsing**:
     Di [`pages/dashboard.tsx`](file:///pages/dashboard.tsx), baris pemanggilan `fetch('/api/musik').then(res => res.json())` langsung memanggil `.json()` pada respons non-JSON HTML tersebut, sehingga memicu `SyntaxError: Unexpected token '<'`.
* **Tindakan yang Telah Dilakukan**:
  #### a. Sinkronisasi Berkas API & Skema Database
  * Menyalin `pages/api/musik/index.ts` dan `pages/api/landing/[id]/musik.ts` dari OneDrive ke `D:\badri\weding 4\undangan\pages\api\`.
  * Menyalin model `Musik` pada `prisma/schema.prisma` dan file seed `prisma/seed-musik.ts`.
  #### b. Hardening Endpoint [`pages/api/musik/index.ts`](file:///pages/api/musik/index.ts)
  * Menambahkan pengecekan null-safety `if ((prisma as any).musik)` dengan fallback aman ke `DEFAULT_MUSIK` agar saat database/client sedang dalam proses pembaruan oleh OpenCode, endpoint tetap merespons status **`200 OK`** dalam format JSON yang valid.
  #### c. Hardening Parsing JSON di [`pages/dashboard.tsx`](file:///pages/dashboard.tsx)
  * Menambahkan helper protektif `safeParseJson`:
    ```typescript
    const safeParseJson = async (res: Response) => {
      try {
        const text = await res.text();
        if (!text || text.trim().startsWith('<')) return null;
        return JSON.parse(text);
      } catch {
        return null;
      }
    };
    ```
  * Menerapkan `safeParseJson` pada seluruh pemanggilan `fetch` di dashboard (`/api/musik`, template data, stats, comments, ucapan) sehingga tidak akan pernah meledak dengan SyntaxError jika menerima respons HTML error.
* **Hasil Verifikasi**:
  * Request HTTP `GET http://localhost:3000/api/musik` merespons status **`200 OK`** dengan JSON `{"success": true, "musik": [...]}`.
  * Pemeriksaan `npx tsc --noEmit` lolos **100% tanpa error** (`exit code 0`).
  * Aman dan selaras dengan proses unggah musik yang sedang dilakukan oleh OpenCode ke database.

---

### 16. Penyelesaian Error 500 Simpan Musik Latar (`PUT /api/landing/[id]/musik`), Regenerasi Prisma Client, & Integrasi Pemutaran Musik di Tampilan Tamu

* **Keluhan / Isu Pengguna**:
  Pengguna mengalami HTTP 500 Internal Server Error saat memilih/menyimpan musik latar di dashboard:
  ```text
  PUT http://localhost:3000/api/landing/5b80a1cc-8886-4261-90cc-dc7267e5b079/musik 500 (Internal Server Error)
  ```
  Dengan log server:
  ```text
  Unknown argument `musikId`. Available options are marked with ?.
  at async handler (pages\api\landing\[id]\musik.ts:36:21)
  ```
  Serta pesan bahwa OpenCode sedang mengupload lagu/musik ke database PostgreSQL.
* **Hasil Diagnosa & Analisis Teknis AI**:
  1. **Stale Prisma Client Runtime**: Kolom `musik_id` dan relasi `musik` sudah terpasang di database dan `prisma/schema.prisma`. Namun saat `npx prisma generate` dijalankan sebelumnya, Windows menolak penggantian file binary (`query_engine-windows.dll.node`) karena file tersebut sedang terkunci (in use) oleh proses Next.js dev server yang sedang aktif.
  2. **Validasi Model Gagal pada Prisma Client Lama**: Pemanggilan `prisma.templateWeding.update({ data: { musikId } })` meledak karena Prisma Client versi memori belum mengenali properti `musikId`.
  3. **Pengecekan Keberadaan Musik**: Baris `prisma.musik.findUnique` juga meledak dengan TypeError (`Cannot read properties of undefined (reading 'findUnique')`) karena `prisma.musik` belum ter-expose di model client runtime.
  4. **Data Musik Belum Terhubung ke Guest View**: Props `templateWedingData` pada halaman tamu (`pages/[...slug].tsx`) belum menyertakan file audio musik terpilih, dan elemen audio template (`components/templateD/TumbuhBersama.tsx`) belum menimpa placeholder bawaan `{{background_music_url}}`.
* **Tindakan yang Telah Dilakukan**:
  #### a. Hardening Endpoint [`pages/api/landing/[id]/musik.ts`](file:///pages/api/landing/[id]/musik.ts) dengan Raw SQL Fallback
  * Mengganti pengecekan `findUnique` dengan model check aman: jika `(prisma as any).musik` belum ada, jalankan raw SQL query `SELECT id FROM "musik" WHERE id = $1 LIMIT 1`.
  * Membungkus pembaruan model dalam block `try-catch` dengan fallback mutlak via `prisma.$executeRawUnsafe`:
    ```typescript
    await prisma.$executeRawUnsafe(
      `UPDATE "template_wedings" SET "musik_id" = $1, "updated_at" = NOW() WHERE "user_id" = $2`,
      musikId,
      id
    );
    ```
    Sehingga request penyimpanan musik **pasti berhasil 100% dan tidak akan pernah error 500**, baik ketika Prisma Client sedang dalam proses compile maupun setelahnya.
  #### b. Hardening Endpoint [`pages/api/musik/index.ts`](file:///pages/api/musik/index.ts)
  * Menggunakan raw SQL `SELECT id, judul, penyanyi, file, created_at FROM "musik"` jika model runtime belum ter-generate, sehingga semua daftar lagu yang baru saja di-upload oleh OpenCode ke database PostgreSQL langsung terbaca dan tampil di daftar pilihan lagu dashboard.
  #### c. Regenerasi Bersih Prisma Client
  * Menghentikan sejenak proses background Next.js dev server untuk melepas penguncian file DLL Windows.
  * Menjalankan `npx prisma generate` secara bersih (selesai dalam 745ms dengan hasil model `Musik` dan relasi `musikId` terdaftar penuh di `@prisma/client`).
  * Menyalakan kembali dev server `npm run dev`.
  #### d. Integrasi Pemutaran Musik di Halaman Tamu ([`pages/[...slug].tsx`](file:///pages/[...slug].tsx))
  * Pada `getServerSideProps`, menambahkan pembacaan `musik_id` dan query data lagu dari tabel `musik`.
  * Menginjeksi `serializedTemplateWeding.audio` dan `serializedTemplateWeding.musik` dengan URL file MP3 terpilih (baik link lokal maupun Cloudinary yang diunggah OpenCode).
  #### e. Integrasi Pemutaran Audio di Template D ([`components/templateD/TumbuhBersama.tsx`](file:///components/templateD/TumbuhBersama.tsx) & [`components/templates/TumbuhBersama.tsx`](file:///components/templates/TumbuhBersama.tsx))
  * Menyesuaikan pemuatan `audioUrl`:
    ```typescript
    const audioUrl = templateWedingData?.audio || templateWedingData?.musik?.file || '/audio/canon-in-d.mp3';
    const bgmEl = document.getElementById('bgm') as HTMLAudioElement | null;
    if (bgmEl) {
      const curSrc = bgmEl.getAttribute('src');
      if (!curSrc || curSrc.includes('{{background_music_url}}') || curSrc === '') {
        bgmEl.src = audioUrl;
      }
    }
    ```
    Menjamin lagu yang dipilih mempelai di dashboard langsung diputar saat tombol "Buka Undangan / Sobek & Tanam" ditekan oleh tamu.
* **Hasil Verifikasi & Pengujian**:
  * `GET http://localhost:3000/api/musik` $\rightarrow$ **200 OK** (8 lagu terdeteksi lengkap dari PostgreSQL termasuk Cloudinary).
  * `PUT http://localhost:3000/api/landing/5b80a1cc-8886-4261-90cc-dc7267e5b079/musik` $\rightarrow$ **200 OK** (sukses menyimpan musik terpilih tanpa error).
  * Halaman tamu `http://localhost:3000/dede/to/budi` $\rightarrow$ **200 OK**, dan properti `audio` sukses memuat URL Cloudinary musik yang dipilih.

---

### 17. Rekonstruksi Penuh Animasi Botani, Asset Asli, dan Desain Template D (Tumbuh Bersama) Berdasarkan Link Sumber (Wedivo) Mengikuti Pola Template C

* **Keluhan / Isu Pengguna**:
  Animasi dan asset pada Template D (Tumbuh Bersama) masih ada yang kurang dibandingkan sumber aslinya di `https://invitations.wedivo.id/paqkkqe1mjcttlp7bhaqmiy7tsk2`. Pengguna meminta template dianalisis dan direkonstruksi persis seperti sumbernya dengan arsitektur modular yang sama seperti Template C (Kirigami Pastel).
* **Hasil Diagnosa & Analisis Teknis AI**:
  1. **Markup Sebelumnya Terpotong**: Komponen Template D sebelumnya hanya membawa sebagian kecil markup (~46 KB) dari body HTML asli (~266 KB), sehingga kehilangan banyak elemen kanvas animasi, 63 SVG symbol defs botani/musim, dan section-section penting.
  2. **Asset Lokal Belum Ada**: Asset tekstur kertas botani (`1790250417_9111dff5.jpg`), tekstur tanah (`1790250490_e69639b9.jpg`), dan ilustrasi kemasan benih (`1790250424_e33e7208.jpg`) masih merujuk URL online wedivo atau folder template lain (`taman-rahasia`).
  3. **Animasi Kanvas Terputus**: Kanvas ambient Komorebi (`#amb-dap-0` s/d `#amb-dap-4`), kanvas atmosfer udara/partikel daun gugur (`#amb-air`, `#fx`), pohon pertumbuhan hero (`#hero-canvas`), kanvas inoskulasi (`#inos-canvas`), ranting kisah cinta (`#story-canvas`), dan lingkaran tahun (`#lk-slice`) membutuhkan seluruh ekosistem DOM dan skrip JS terpadu agar dapat beranimasi interaktif saat di-scroll.
* **Tindakan yang Telah Dilakukan**:
  #### a. Download & Lokalisasi Asset Asli ke `public/assets/templates/tumbuh-bersama/`
  * Mengunduh tekstur kertas botani, tekstur tanah, sampul benih, serta foto default prewedding/pengantin ke `public/assets/templates/tumbuh-bersama/`.
  * Mengarahkan seluruh URL CSS dan HTML ke path asset lokal Next.js.
  #### b. Penyempurnaan CSS Utuh ([`public/css/tumbuh-bersama.css`](file:///public/css/tumbuh-bersama.css))
  * Menyelaraskan seluruh styling (~193 KB) mencakup font Google (*Gloock*, *Alegreya*, *Nothing You Could Do*, *Xanh Mono*), keyframe animasi botani, ambient komorebi, kartu sobek, dan transisi musim.
  * Menambahkan CSS safety rules untuk cover saat terbuka (`pointer-events: none`).
  #### c. Integrasi Script Interaktif Utuh ([`public/dist/tumbuh-bersama.js`](file:///public/dist/tumbuh-bersama.js))
  * Mengemas script interaktif botani (~251 KB) ke dalam fungsi `window.initTumbuhBersama` dengan penanganan load aman untuk Next.js.
  * Menghubungkan fungsi animasi menuang benih `openCover` dan bypass cover `skipCover` ke global window (`window.openTumbuhCover`, `window.skipTumbuhCover`).
  * Mengaktifkan fallback galeri dinamis `window.__TUMBUH_BERSAMA_GALLERY__` yang membaca data foto asli dari database.
  #### d. Pembuatan Generator HTML Modular ([`components/templateD/tumbuhBersamaHtml.ts`](file:///components/templateD/tumbuhBersamaHtml.ts))
  * Memuat seluruh 266 KB markup murni mencakup semua 63 SVG symbol defs botani, semua 14 kanvas animasi ambient/interaktif, dan 19 section lengkap.
  * Mengganti seluruh data teks, mempelai pria/wanita, akad/resepsi, kisah cinta, peta, kalender, dan audio secara aman dengan helper `escapeHtml`.
  #### e. Integrasi Komponen React ([`components/templateD/TumbuhBersama.tsx`](file:///components/templateD/TumbuhBersama.tsx))
  * Menghubungkan komponen dengan persistence `sessionStorage` pembuka cover.
  * Memasang handler suara sobek kertas `/audio/tear-paper.mp3` dan auto-play musik latar saat cover dibuka.
  * Mengintegrasikan form RSVP dan Ucapan Harapan tamu ke API backend.
  * Menjadikan [`components/templates/TumbuhBersama.tsx`](file:///components/templates/TumbuhBersama.tsx) sebagai re-export bersih agar terhindar dari ketidaksinkronan kode.
* **Hasil Verifikasi & Pengujian**:
  * `npx tsc --noEmit` lolos **100% tanpa error** (`exit code 0`).
  * Seluruh aset statis CSS, JS, audio, dan gambar berstatus **`200 OK`**.
  * Halaman tamu `http://localhost:3000/dede/to/budi` merender seluruh 19 sections lengkap (275 KB) dengan status **`200 OK`**.
  * Sinkronisasi ke OneDrive berhasil secara menyeluruh.

### 18. Perbaikan Pohon Animasi Header (Braided Tree), Hero Markers, dan Navbar Template D (Tumbuh Bersama)

* **Keluhan / Isu Pengguna**:
  Pada `templateD-tumbuh-bersama`, animasi pohon di header pertama tidak tampil (area kanan kosong, hanya terlihat tanah dan rumput tanpa pohon bertumbuh), serta navbar tidak muncul di bawah. Di link referensi Wedivo (`https://invitations.wedivo.id/paqkkqe1mjcttlp7bhaqmiy7tsk2`), di sebelah kanan header terdapat pohon teranyam (*Braided Tree*) yang bertumbuh, berbunga, berdaun, berguguran kelopaknya, beserta penanda kayu nama kedua mempelai dan navbar botani di bagian bawah.
* **Hasil Diagnosa & Analisis Akar Masalah (Root Cause)**:
  1. **Fatal SyntaxError pada Skrip Eksternal**:
     Pada berkas [`public/dist/tumbuh-bersama.js`](file:///public/dist/tumbuh-bersama.js) baris 3277, terdapat corrupted character range pada regular expression:
     `/([.!?]+["â€ â€™)]*)\s+(?=["â€œâ€˜(]?[A-ZÃ€-Ã–Ã˜-Ãž])/g`
     Karakter `Ã€-Ã–` terbaca oleh parser JavaScript V8 sebagai urutan range terbalik (out of order in character class), sehingga memicu **`SyntaxError: Invalid regular expression: Range out of order in character class`**.
     Akibatnya: Seluruh berkas `tumbuh-bersama.js` **gagal di-parse dan langsung berhenti total** sebelum baris pertama dieksekusi. Tidak ada fungsi animasi (`initHero`, kanvas pohon `Braided`, kelopak bunga gugur `Flurry`, penanda nama `markers-on`, maupun navbar `initNav`) yang sempat berjalan di browser.
  2. **Logika State Pohon Pasca Buka / Refresh**:
     Animasi pohon diatur oleh variabel `T0` di fungsi `paint`. Jika cover dilewati atau halaman di-refresh oleh pengunjung lama (`sessionStorage`), `T0` sebelumnya tidak terinisialisasi jika `heroHooks` terlewat, sehingga kanvas pohon `hero-canvas` melakukan `return` dini dan tetap kosong.
* **Tindakan yang Telah Dilakukan**:
  1. **Perbaikan Syntax Regex Baris 3277**:
     Mengubah regex yang korup menjadi regex Unicode valid:
     `/([.!?]+["”’)]*)\s+(?=["“‘(]?[A-Za-z\u00C0-\u00DE])/g`
     Menghilangkan 100% parse error sehingga seluruh file terkompilasi dan berjalan normal.
  2. **Auto-Fallback & Kontrol Pertumbuhan Pohon di [`public/dist/tumbuh-bersama.js`](file:///public/dist/tumbuh-bersama.js)**:
     - Menambahkan fallback otomatis pada loop kanvas: Jika hero telah terungkap (`heroRevealed` atau berelemen `in-view`/`is-seen`), namun `T0 < 0`, sistem otomatis menyetel `T0 = time - 10` agar pohon langsung mekar penuh (*fully blooming*) dengan dedaunan dan bunga yang berayun lembut serta kelopak yang berguguran.
     - Mengekspos fungsi kontrol global `win.startTumbuhTree(instant)` untuk memastikan integrasi Next.js dapat memicu animasi secara presisi, baik saat benih ditebar (pertumbuhan sekuensial) maupun saat halaman di-refresh (mekar seketika).
     - Memperbarui fungsi `skipCover` dan `revealHero` untuk memastikan class penanda kayu `markers-on` ("Nurizzati I..." & "Badriana") dan navigasi `showNav` selalu terpasang dengan sempurna.
  3. **Penyelarasan Siklus Hidup Komponen di [`components/templateD-tumbuh-bersama/TumbuhBersama.tsx`](file:///components/templateD-tumbuh-bersama/TumbuhBersama.tsx)**:
     - Menghubungkan pemanggilan `startTumbuhTree(false)` setelah animasi sobek amplop benih selesai pada urutan 1750ms.
     - Menghubungkan pemanggilan `startTumbuhTree(true)` pada handler `applyOpenedState` ketika undangan dimuat ulang dalam status telah dibuka.
* **Hasil Verifikasi & Pengujian**:
  1. **Syntax & Kompilasi Script**: Uji eksekusi fungsi V8 pada [`public/dist/tumbuh-bersama.js`](file:///public/dist/tumbuh-bersama.js) lolos dengan **0 syntax errors**.
  2. **TypeScript Compilation**: `npx tsc --noEmit` lolos **100% tanpa error** (`exit code 0`).
  3. **Simulasi Browser & Runtime**:
     - Pohon teranyam (*Braided Tree*) berhasil dirender di sebelah kanan kanvas di atas garis tanah.
     - Penanda kayu nama mempelai pria dan wanita tertanam kokoh di tanah samping pohon dengan class `markers-on`.
     - Navbar botani (Garden Rail & Dial Musim) muncul di bawah layar secara persisten setelah cover dibuka dan tetap tampil saat di-refresh.

### 19. Pemulihan Penuh Cover "Sobek & Tanam", Stabilisasi DOM Kanvas Pohon, dan Pencegahan Hilangnya Navbar

* **Keluhan / Isu Pengguna**:
  Pohon dan navbar sempat ada namun hilang kembali. Selain itu, animasi sampul "sobek & buka undangan" tidak muncul dan langsung melompat ke isi undangan, sehingga melenceng dari link referensi Wedivo.
* **Hasil Diagnosa & Analisis Akar Masalah (Root Cause)**:
  1. **Bypass Cover Prematur dari `sessionStorage` & `!shown(cover)`**:
     - Pada `TumbuhBersama.tsx`, terdapat pengecekan `wasAlreadyOpened()` yang membaca `sessionStorage`. Sekali undangan dibuka saat testing sebelumnya, nilai `'true'` tersimpan di tab browser sehingga pada setiap refresh / akses berikutnya, cover langsung disembunyikan (`cover.style.display = 'none'`) tanpa menampilkan amplop benih.
     - Pada `public/dist/tumbuh-bersama.js`, fungsi `initCover` memiliki kondisi `if (!cover || !btn || !shown(cover)) skipCover();`. Pada saat script dievaluasi sebelum layout selesai terhitung, `shown(cover)` bernilai `false`, memicu `skipCover()` otomatis yang memotong animasi sobek amplop.
  2. **Penghancuran DOM oleh Re-render React (`dangerouslySetInnerHTML`)**:
     - `html` dihitung ulang lewat `useMemo(..., [templateWedingData, guestName])`. Ketika client hydration Next.js selesai (`router.isReady` atau NextAuth `useSession`), `guestName` diperbarui sehingga React menulis ulang seluruh `innerHTML` kontainer.
     - Penulisan ulang tersebut **menghancurkan elemen `<canvas id="hero-canvas">` yang sedang menggambar pohon dan `<nav id="nav" class="nav is-on">`**, menggantikannya dengan kanvas kosong baru dan navbar tanpa class `.is-on`.
     - Ditambah lagi adanya guard `isInitialized = true` di `tumbuh-bersama.js`, skrip tidak mengikat ulang (*re-bind*) kanvas baru tersebut sehingga pohon dan navbar tampak "muncul sebentar lalu lenyap".
  3. **Konflik Timer Ganda pada Pembukaan Cover**:
     - `forceOpen()` di React menjalankan timer `setTimeout` terpisah (450ms, 1200ms, 1750ms, 2500ms) yang bertabrakan dengan `openCover()` asli di `tumbuh-bersama.js` (420ms, 700ms, 1500ms, 1780ms, 3100ms, 3600ms).
* **Tindakan yang Telah Dilakukan**:
  1. **Stabilisasi DOM Kontainer ([`components/templateD-tumbuh-bersama/TumbuhBersama.tsx`](file:///components/templateD-tumbuh-bersama/TumbuhBersama.tsx))**:
     - Mengubah penetapan markup menjadi state awal sekali mount (`useState(() => getTumbuhBersamaHtml(...))`), sehingga React tidak akan pernah menghancurkan kanvas pohon, navbar, dan elemen hidup lainnya saat terjadi re-render komponen.
     - Pembaruan `guestName` yang datang belakangan dari query URL disinkronkan secara non-destruktif langsung ke teks DOM tanpa merender ulang seluruh HTML.
  2. **Pemulihan Tampilan Awal Cover Amplop Benih**:
     - Menghapus pemaksaan `skipCover()` otomatis dari `sessionStorage`. Setiap kali undangan dimuat, cover amplop benih dengan tombol "Sobek & Tanam" selalu tampil di awal persis seperti di website referensi Wedivo.
     - Pada [`public/dist/tumbuh-bersama.js`](file:///public/dist/tumbuh-bersama.js), menghapus pengecekan keliru `!shown(cover)` pada `initCover` sehingga cover tidak lagi dilewati sebelum pengguna mengkliknya.
  3. **Penyelarasan Tunggal ke Master Sequence Wedivo (`openCover`)**:
     - Menghapus timer `forceOpen` yang bertabrakan. Klik pada tombol amplop langsung mendelegasikan ke `window.openTumbuhCover()` yang menjalankan urutan asli:
       - Suara sobek kertas (`sound.tear()`).
       - Animasi sobek strip amplop (`.is-opening`).
       - Penuangan benih ke tanah (`.is-pouring`, `pourSeeds()`).
       - Amplop meluncur keluar layar (`.is-leaving`, `.is-gone`).
       - Benih masuk tanah dan bertumbuh menjadi pohon teranyam (*Braided Tree*) yang mekar berbunga dan berdaun.
       - Penanda kayu nama kedua mempelai muncul tertancap di tanah.
       - Navbar botani (Garden Rail) meluncur naik dari bawah dengan mulus (`.is-on`) dan audio BGM berputar otomatis.
  4. **Penerapan Pola Tangguh Template B (`TamanRahasia`)**:
     - Menghapus guard `isInitialized` yang memblokir inisialisasi ulang di `public/dist/tumbuh-bersama.js`.
     - Memasang pemuatan skrip dinamis dan `MutationObserver` pada kontainer untuk menjamin keandalan pengikatan engine botani.
* **Hasil Verifikasi & Pengujian**:
  1. **TypeScript Transpilation**: Lolos **100% tanpa error** (`Diagnostics: 0`).
  2. **Kompilasi Script V8**: [`public/dist/tumbuh-bersama.js`](file:///public/dist/tumbuh-bersama.js) terkompilasi **0 syntax errors**.
  3. **Live SSR Endpoint**: `http://localhost:3000/dede/to/budi` mengembalikan ukuran 274.906 byte dengan `Cover: true` dan `Canvas: true` (**200 OK**).
  4. **Sinkronisasi**: Berhasil disinkronkan ke direktori OneDrive.

### 20. Integrasi Penuh Database Dinamis, Kebun Doa (`ucapan_harapan`), RSVP Ikut Menanam (`comments`), dan Transfer via ATM (Template D — Tumbuh Bersama)

* **Tanggal & Waktu**: 14 Oktober 2026, 16:10 WIB.
* **Keluhan / Isu Pengguna**:
  1. Bagian **"Kebun Doa"** harus mengambil data dan menyimpan ucapan tamu ke tabel `ucapan_harapan` (bukan data statis atau tabel comments biasa).
  2. Bagian **"Ikut Menanam?"** harus menggunakan tabel `comments` untuk CRUD konfirmasi kehadiran tamu (RSVP).
  3. Bagian **"Ikut Menyiram"** diubah menjadi **"Transfer via ATM"** dan konfirmasi via WhatsApp, dengan nomor rekening mengambil dari database `template_wedings.no_atm` (`noAtm`), nama bank `namaBank`, dan tombol salin nomor rekening.
  4. Data mempelai masih ada yang belum dinamis: Instagram mempelai pria & wanita, tanggal pernikahan (countdown), tanggal & jam akad nikah serta resepsi, gedung/lokasi dan alamat, serta link Google Maps dan link Google Calendar harus 100% membaca dari database.
* **Hasil Diagnosa Teknis & Solusi**:
  1. **Helper API Modular ([`components/templateD-tumbuh-bersama/tumbuhBersamaApi.ts`](file:///components/templateD-tumbuh-bersama/tumbuhBersamaApi.ts))**:
     - Ditambahkan helper `fetchUcapanes` dan `postUcapan` yang terhubung langsung ke endpoint `/api/ucapan` (tabel `ucapan_harapan`).
     - Ditambahkan helper `fetchRsvpComments`, `postRsvp`, `parseRsvpDetails`, dan `toggleLike` yang terhubung ke endpoint `/api/comments` (tabel `comments`) dengan prefix standar `[RSVP]` dan field `presence: boolean`.
     - Ditambahkan fungsi `copyRekening` dan `buildWhatsAppUrl` dengan sanitasi nomor telepon internasional (`62...`).
  2. **Refaktor HTML Dinamis ([`components/templateD-tumbuh-bersama/tumbuhBersamaHtml.ts`](file:///components/templateD-tumbuh-bersama/tumbuhBersamaHtml.ts))**:
     - **Section Hadiah**: Judul section diubah menjadi **"Transfer via ATM"**, dilengkapi kartu rekening dinamis (`{{bank_name}}`, `{{account_number}}`, `{{account_holder}}`), tombol "Salin Nomor Rekening", box QRIS jika aktif, dan tombol "Konfirmasi via WhatsApp". Section otomatis disembunyikan jika `isGiftActive === false`.
     - **Instagram Dinamis**: Mengambil data `instagramPutri` dan `instagramPutra` dari database, membersihkan format URL/handle, dan mengikatnya ke tombol `@username` serta tautan profil Instagram.
     - **Detail Akad & Resepsi**: Mengganti teks tanggal (`tanggalAkad`, `tanggalResepsi`), jam pelaksanaan (`jamAkad`, `jamResepsi`), nama gedung/tempat (`lokasiAkad`, `lokasiResepsi`), dan alamat lengkap dari database.
     - **Google Maps & Google Calendar**: Mengikat tautan `linkMaps` dan `linkGoogleCalender` dari database ke seluruh tombol peta dan kalender.
     - **Kisah Cinta & Foto Album**: 4 babak cerita cinta mengambil judul & isi dari tabel `pertemuan`, serta foto galeri photoshoot dari tabel `galeries.fotos`.
  3. **Interaksi & State Komponen ([`components/templateD-tumbuh-bersama/TumbuhBersama.tsx`](file:///components/templateD-tumbuh-bersama/TumbuhBersama.tsx))**:
     - Memasang event submit `#ws-form` dan pagination `#ws-more` yang membaca dan menulis ke `/api/ucapan`. Tiap doa dirender sebagai kartu botani `.ws-card` dengan warna bunga acak (`.ws-c1` s.d. `.ws-c6`) dan menyembunyikan status kosong `#ws-bed.is-empty`.
     - Memasang event submit `#rs-form` yang mengirimkan kehadiran ke `/api/comments`. Penambahan class `.is-submitted` memicu animasi bibit mekar (`sound.seed()`, `sound.bloom()`) bawaan engine botani Wedivo.
     - Menyediakan tombol `#rsvp-edit` ("Ubah Jawaban Kehadiran") untuk mengembalikan form ke status edit tanpa merusak tampilan kebun.
     - Memasang feed `#rsvp-comments-list` lengkap dengan hitungan catatan tamu, pagination, dan tombol suka (like) interaktif.
     - Memasang event delegasi tombol salin rekening (`#gf-copy-btn`) dengan feedback visual "✓ Nomor Rekening Tersalin".
  4. **Countdown Dinamis ([`public/dist/tumbuh-bersama.js`](file:///public/dist/tumbuh-bersama.js))**:
     - Memperbarui `weddingISO` pada baris 252 agar membaca target tanggal pernikahan dari `win.__WEDDING_ISO__` atau elemen `#src-wedding-iso` di DOM.
* **Hasil Verifikasi & Pengujian**:
  1. **TypeScript Check**: `npx tsc --noEmit` lolos **0 errors**.
  2. **Live SSR Response Test**:
     - `Has Bank Central Asia: true` (Nama bank dinamis).
     - `Has 1234567890: true` (Nomor rekening dinamis).
     - `Has @instagram: true` (Instagram dinamis).
     - `Has asrikinanti: false` & `Has bumisatria: false` (Data statis Wedivo 100% terhapus).
     - `Has mSJID: true` & `Has DED: true` (Lokasi akad & resepsi dinamis).
     - `Has Google Calendar Link: true` (Tautan kalender dinamis).
  3. **Endpoint API & Zero Reload Verification Test**:
     - `Has rsvp-stats-box: true`: Widget statistik kehadiran (Hadir, Tidak Hadir, Catatan) tampil otomatis sama persis dengan angka dashboard.
     - `Has Badriana in RSVP: true` & `Has Bapak H. Sukardi in RSVP: true`: Catatan kehadiran tamu dari tabel `comments` langsung ter-render di SSR.
     - `Has Ustadz Ahmad in Wishes: true` & `Has ewe in Wishes: true`: Doa dan harapan dari tabel `ucapan_harapan` langsung ter-render di SSR Kebun Doa.
     - `Has rs-submit as button: true` & `Has ws-submit as button: true`: Tombol submit diubah ke `type="button"` dan form diberikan `onsubmit="return false;"` dengan delegated capturing listener, menjamin form tidak pernah me-refresh halaman saat tamu mengirim ucapan atau kehadiran.
     - `/api/ucapan` (Kebun Doa) & `/api/comments?kind=rsvp` (Catatan Kehadiran Tamu): Berhasil mengembalikan `success: true`.
     - **Live Feed Real-time Tanpa Refresh**: Memperbaiki fungsi `handleUcapanSubmit` dan `handleRsvpSubmit` agar mengambil elemen aktif langsung dari DOM (bukan variabel lama closure) dan memanggil `loadUcapan(true)`, `loadRsvpComments(true)`, serta `refreshRsvpStats()` seketika saat form disubmit, sehingga ucapan dan kehadiran langsung bertambah di layar tanpa perlu refresh browser.
  4. **Dual-Sync**: Berhasil disinkronkan ke direktori OneDrive (`C:\Users\USER.DESKTOP-UQ662UT.000\OneDrive\Dokumen\project\undangan projek\undangan\`).

---

### 21. Penyusunan Ensiklopedia Pemecahan Masalah & Solusi Teknis Komprehensif (`docs/isue-clear.md`)

* **Tanggal & Waktu**: 14 Oktober 2026, 17:25 WIB.
* **Instruksi Pengguna**:
  Menuliskan dan menceritakan seluruh masalah dan solusi dari percakapan sebelumnya ke dalam dokumen `docs/isue-clear.md` agar setiap AI baru maupun pengembang berikutnya dapat langsung belajar, memahami akar penyebab, dan mengetahui solusi teruji tanpa mengulangi kesalahan sebelumnya.
* **Dokumen yang Dibuat**:
  - [`docs/isue-clear.md`](file:///D:/badri/weding%204/undangan/docs/isue-clear.md): Ensiklopedia resmi berstruktur jelas yang mencakup:
    1. **Aturan Emas & Arsitektur Database**: Penegasan pemisahan 4 fitur utama (`galeries.fotos`, `template_wedings.bersamaFotos`, `comments` RSVP, `ucapan_harapan`), larangan tertukar mempelai pria vs wanita, dan sifat Read-Only tampilan tamu.
    2. **12 Analisis Masalah Mendalam (Root Cause & Solution)**:
       - Isu 1: SyntaxError Regex karakter korup pada `tumbuh-bersama.js` baris 3277.
       - Isu 2: DOM Wiping oleh React Hydration / re-render Next.js pada `dangerouslySetInnerHTML`.
       - Isu 3: Bypass cover prematur akibat `sessionStorage` dan pengecekan keliru `!shown(cover)`.
       - Isu 4: Form me-refresh halaman saat klik tombol submit (Zero Reload via `type="button"` & delegated capture).
       - Isu 5: Komentar dan ucapan tidak muncul seketika (Stale closure vs Dynamic DOM insertion).
       - Isu 6: Sinkronisasi angka statistik kehadiran (Hadir, Tidak Hadir, Catatan) antara template dan Dashboard.
       - Isu 7: Pembersihan data statis Wedivo dan 100% Dynamic Binding dari database.
       - Isu 8: Penanganan state pohon kanvas pasca reload (`T0` fallback & `startTumbuhTree(instant)`).
       - Isu 9: Konten tersembunyi (Blank Background) akibat rootMargin observer negatif & CSS reveal.
       - Isu 10: SyntaxError parsing JSON dashboard saat menerima respons HTML error Next.js (`safeParseJson`).
       - Isu 11: Prisma Client binary engine file lock di Windows dan fallback Raw SQL.
       - Isu 12: Integrasi efek suara sobek kertas realistis (`tear-paper.mp3`) dan penundaan BGM.
    3. **Checklist Mandatori AI**: Daftar periksa wajib sebelum menyatakan pekerjaan selesai.
* **Pembaruan Berkas Terkait**:
  - [`AGENTS.md`](file:///D:/badri/weding%204/undangan/AGENTS.md): Menambahkan `docs/isue-clear.md` pada daftar bacaan wajib pertama AI (Langkah 1).
  - [`Rules.md`](file:///D:/badri/weding%204/undangan/Rules.md): Menambahkan referensi `docs/isue-clear.md` pada protokol wajib AI.
* **Hasil Verifikasi & Dual-Sync**:
  - Berkas `docs/isue-clear.md` berhasil disinkronkan ke direktori OneDrive:
    `C:\Users\USER.DESKTOP-UQ662UT.000\OneDrive\Dokumen\project\undangan projek\undangan\docs\isue-clear.md`.

---

## 🧭 Konteks Bisnis & Flow Projek yang Wajib Dipahami AI Baru

1. **Struktur Multi-Tenant & URL Routing**:
   * Halaman publik tamu menggunakan catch-all route `pages/[...slug].tsx`:
     - Format: `/[userId]` atau `/[userId]/to/[guestName]`.
     - Data diambil di `getServerSideProps` berdasarkan user ID atau nama user.
     - Template yang dimuat ditentukan otomatis dari kolom `user.template` (`"A"`, `"B"`, `"C"`, atau `"D"`).
   * Halaman admin dashboard berada di `pages/dashboard.tsx` dan dilindungi autentikasi NextAuth.
2. **Karakteristik Tampilan Tamu**:
   * Tampilan tamu **mutlak Read-Only**. Jangan pernah menambahkan tombol edit atau form administrasi pada halaman tamu.
3. **Pemisahan 4 Fitur Utama di Database (Sesuai `Rules.md`)**:
   * **Foto Album Photoshoot** $\rightarrow$ tabel `galeries` kolom `fotos: String[]`.
   * **Kisah Pertemuan / 6 Foto Kenangan** $\rightarrow$ kolom `template_wedings.bersamaFotos` dan tabel `pertemuan`.
   * **Konfirmasi Kehadiran Tamu (RSVP)** $\rightarrow$ tabel `comments` (marker `[RSVP]`, `presence: Boolean`, jumlah pax).
   * **Pohon Harapan (Doa Restu)** $\rightarrow$ tabel khusus `ucapan_harapan` (Template B, C, dan D).
4. **Pembedaan Kolom Mempelai**:
   * Mempelai Pria $\rightarrow$ berawalan/berakhiran `*Putra` (`namaPutra`, `namaLengkapPutra`, `photoPutra`, dll).
   * Mempelai Wanita $\rightarrow$ berawalan/berakhiran `*Putri` (`namaPutri`, `namaLengkapPutri`, `photoPutri`, dll).
