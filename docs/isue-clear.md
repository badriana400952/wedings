# 📘 BUKU PANDUAN PEMECAHAN MASALAH & ARSITEKTUR SISTEM (ISSUE-CLEAR.MD)
## *Knowledge Base & Troubleshooting Solutif untuk AI Agent & Pengembang Masa Depan*

> [!IMPORTANT]
> **DOKUMEN INI ADALAH ENSIKLOPEDIA RESMI PEMECAHAN MASALAH PROJEK INI.**
> Setiap AI Agent (Antigravity, Claude Code, Cursor, GitHub Copilot, dsb.) yang melanjutkan pekerjaan di repositori ini **WAJIB membaca dokumen ini**.
> Dokumen ini merangkum seluruh masalah nyata, akar penyebab (*root cause analysis*), kode sumber yang bermasalah, dan solusi teruji (*battle-tested*) yang telah berhasil diterapkan.

---

## 📑 DAFTAR ISI CEPAT (QUICK NAVIGATION)

1. [Aturan Emas & Arsitektur Database (Rules.md & DB.md Recap)](#1-aturan-emas--arsitektur-database-rulesmd--dbmd-recap)
2. [Isu 1: Pohon Animasi (#hero-canvas) & Navbar Hilang Total (SyntaxError Regex V8 Engine)](#isu-1-pohon-animasi-hero-canvas--navbar-hilang-total-syntaxerror-regex-v8-engine)
3. [Isu 2: Pohon & Navbar Sempat Muncul Lalu Lenyap (DOM Wiping oleh React Hydration)](#isu-2-pohon--navbar-sempat-muncul-lalu-lenyap-dom-wiping-oleh-react-hydration)
4. [Isu 3: Cover Amplop Sobek Terlewat Otomatis / Langsung ke Undangan](#isu-3-cover-amplop-sobek-terlewat-otomatis--langsung-ke-undangan)
5. [Isu 4: Form Reload/Refresh Browser saat Klik "Kirim & Tanam Bibitku" atau "Tanam Doa"](#isu-4-form-reloadrefresh-browser-saat-klik-kirim--tanam-bibitku-atau-tanam-doa)
6. [Isu 5: Komentar dan Ucapan Harus di-Refresh Browser Baru Muncul (Tidak Real-time)](#isu-5-komentar-dan-ucapan-harus-di-refresh-browser-baru-muncul-tidak-real-time)
7. [Isu 6: Inkonsistensi Angka Statistik Kehadiran dengan Dashboard Admin](#isu-6-inkonsistensi-angka-statistik-kehadiran-dengan-dashboard-admin)
8. [Isu 7: Data Masih Statis & Tidak Terkoneksi ke Database (100% Dynamic Binding)](#isu-7-data-masih-statis--tidak-terkoneksi-ke-database-100-dynamic-binding)
9. [Isu 8: State Pohon Botani Pasca Reload (Variabel T0 Kanvas & Instant Blooming)](#isu-8-state-pohon-botani-pasca-reload-variabel-t0-kanvas--instant-blooming)
10. [Isu 9: Konten Tersembunyi (Blank Background Only) & Baru Muncul saat Screenshot](#isu-9-konten-tersembunyi-blank-background-only--baru-muncul-saat-screenshot)
11. [Isu 10: SyntaxError Parsing JSON Dashboard (`Unexpected token '<', "<!DOCTYPE "...`)](#isu-10-syntaxerror-parsing-json-dashboard-unexpected-token---doctype-)
12. [Isu 11: Prisma Client Runtime Lock (`query_engine-windows.dll.node in use`)](#isu-11-prisma-client-runtime-lock-query_engine-windowsdllnode-in-use)
13. [Isu 12: Efek Suara Sobek Kertas Realistis & Urutan Buka Undangan](#isu-12-efek-suara-sobek-kertas-realistis--urutan-buka-undangan)
14. [Checklist Mandatori AI Sebelum Menyelesaikan Tugas](#checklist-mandatori-ai-sebelum-menyelesaikan-tugas)

---

## 1. ATURAN EMAS & ARSITEKTUR DATABASE (RULES.MD & DB.MD RECAP)

Sebelum menyentuh satu baris kode pun, AI **HARUS** memahami 4 pilar database berikut:

### A. Pemisahan 4 Fitur Utama (JANGAN PERNAH TERTUKAR!)
| No | Fitur / Kebutuhan | Tabel & Kolom Database | Larangan Keras |
| :---: | :--- | :--- | :--- |
| **1** | **Album Foto Photoshoot** (Galeri Banyak Foto) | **Tabel `galeries`**<br>Kolom: `fotos: String[]` | ❌ **JANGAN** simpan foto galeri photoshoot ke `template_wedings.bersamaFotos`! |
| **2** | **Kisah Pertemuan / 4 Babak Cinta** (Love Story) | **Tabel `pertemuan`** (Teks cerita)<br>**`template_wedings.bersamaFotos`** (Maks 6 Foto) | ❌ **JANGAN** gunakan `galeries.fotos` untuk cerita cinta! Slot ini maksimal 6 foto kenangan kebersamaan. |
| **3** | **Form Konfirmasi Kehadiran Tamu (RSVP)** | **Tabel `comments`**<br>Marker: `[RSVP]` di awal teks komentar<br>Kolom: `presence: Boolean` (`true`=Hadir, `false`=Tidak) | ❌ **JANGAN** masukkan data kehadiran RSVP ke tabel `ucapan_harapan`! |
| **4** | **Kebun Doa / Pohon Harapan** (Doa Restu Tamu) | **Tabel `ucapan_harapan`**<br>Kolom: `name`, `ucapan`, `template_weding_id` | ❌ **JANGAN** masukkan ucapan kebun doa ke tabel `comments` biasa! |

### B. Kamus Mempelai: Pria (*Putra) vs Wanita (*Putri)
* **Pria (Groom)**: Kolom `namaPutra`, `namaLengkapPutra`, `namaAyahPutra`, `namaIbuPutra`, `kelahiranPutra`, `instagramPutra`, `photoPutra`.
* **Wanita (Bride)**: Kolom `namaPutri`, `namaLengkapPutri`, `namaAyahPutri`, `namaIbuPutri`, `kelahiranPutri`, `instagramPutri`, `photoPutri`.
> ⚠️ **HUKUM PATEN**: Jangan pernah menukar data pria ke putri atau sebaliknya.

### C. Hak Akses Tampilan Tamu
* File: `pages/[...slug].tsx` (`/[userId]` atau `/[userId]/to/[guestName]`).
* Sifat: **MUTLAK READ-ONLY**. Tamu hanya melihat undangan. Tidak boleh ada tombol edit, ikon pensil, modal form edit data pengantin, atau tombol admin di halaman ini.

---

## ISU 1: POHON ANIMASI (#hero-canvas) & NAVBAR HILANG TOTAL (SYNTAXERROR REGEX V8 ENGINE)

### 🔴 Gejala Masalah
- Pada Template D (Tumbuh Bersama), area kanan header kosong melompong (hanya terlihat rumput dan bukit tanah cokelat tanpa batang pohon, bunga, dan daun).
- Penanda kayu nama kedua mempelai (`#hero-marker-a` & `#hero-marker-b`) tidak muncul (`opacity: 0`).
- Navbar melayang di bawah layar (`#nav`) tidak pernah muncul.
- Di link sumber asli Wedivo, pohon teranyam mekar dengan dahan bergoyang, bunga mekar, dan kelopak gugur.

### 🔍 Akar Masalah (Root Cause Analysis)
Di dalam berkas JavaScript eksternal `public/dist/tumbuh-bersama.js` pada baris 3277, terdapat ekspresi reguler (Regex) dengan karakter yang korup akibat encoding UTF-8:
```javascript
// KODE YANG RUSAK (BARIS 3277):
/([.!?]+["â€ â€™)]*)\s+(?=["â€œâ€˜(]?[A-ZÃ€-Ã–Ã˜-Ãž])/g
```
Karakter `Ã€-Ã–` terbaca oleh parser V8 JavaScript sebagai rentang terbalik (*range out of order in character class*).
Hal ini memicu:
```text
SyntaxError: Invalid regular expression: Range out of order in character class
```
> [!CRITICAL]
> **Dampak Fatal SyntaxError:**
> Ketika file `.js` memiliki SyntaxError pada tahap parsing, mesin JavaScript browser **langsung menghentikan pembacaan seluruh file sejak baris pertama**. Tidak ada satu pun fungsi di file tersebut yang dieksekusi (fungsi `initHero()`, lukisan kanvas `Braided()`, partikel gugur `Flurry()`, class penanda nama `markers-on`, dan inisialisasi navbar `initNav()` gagal total).

### 🛠️ Solusi Teruji
1. Buka `public/dist/tumbuh-bersama.js` baris 3277.
2. Ganti regex korup tersebut dengan kode Unicode valid:
```javascript
// SOLUSI VALID:
/([.!?]+["”’)]*)\s+(?=["“‘(]?[A-Za-z\u00C0-\u00DE])/g
```
3. Uji kompilasi file script dengan Node.js CLI:
```powershell
node -e "try { new Function(require('fs').readFileSync('public/dist/tumbuh-bersama.js', 'utf8')); console.log('Syntax OK'); } catch(e) { console.error(e); }"
```

---

## ISU 2: POHON & NAVBAR SEMPAT MUNCUL LALU LENYAP (DOM WIPING OLEH REACT HYDRATION)

### 🔴 Gejala Masalah
Saat halaman pertama kali dibuka, pohon dan navbar sempat muncul sekilas (selama ~500ms), namun tiba-tiba lenyap kembali menjadi kanvas kosong dan navbar turun ke bawah layar.

### 🔍 Akar Masalah (Root Cause Analysis)
1. **Siklus Hidup Next.js & Client Hydration**:
   Komponen `TumbuhBersama.tsx` awalnya menggunakan:
   ```typescript
   // SALAH: Dihitung ulang saat dependency berubah
   const html = useMemo(() => getTumbuhBersamaHtml(templateWedingData, guestName), [templateWedingData, guestName]);
   ```
2. Ketika client hydration selesai (`router.isReady` bernilai `true` atau NextAuth selesai memeriksa session), properti `guestName` diperbarui dari URL.
3. React merender ulang elemen dengan `dangerouslySetInnerHTML={{ __html: html }}`.
4. **DOM Wiping**: React menghancurkan seluruh DOM anak di dalam kontainer dan menggantinya dengan HTML baru.
   - Kanvas `<canvas id="hero-canvas">` yang sedang aktif menggambar pohon dihancurkan dan diganti elemen kanvas baru yang kosong.
   - Elemen `<nav id="nav" class="nav is-on">` dihancurkan dan diganti `<nav id="nav" class="nav">` (tanpa class `.is-on`).
   - Karena skrip vanilla memiliki flag `isInitialized = true`, script tidak mau mengaitkan kanvas baru tersebut. Hasilnya: pohon dan navbar hilang permanen.

### 🛠️ Solusi Teruji
1. **Pola Mount-Once (Komponen Kebal Re-render)**:
   Simpan HTML awal di dalam `useState` dengan lazy initializer agar hanya dirender **SATU KALI** saat mount:
   ```typescript
   // BENAR: Di-mount satu kali saja, tidak pernah dihancurkan oleh re-render React
   const [initialHtml] = useState<string>(() => {
     return getTumbuhBersamaHtml(templateWedingData, guestName);
   });
   ```
2. **Sinkronisasi Nama Tamu Non-Destruktif**:
   Jika `guestName` berubah dari router, ubah teks DOM-nya secara spesifik tanpa menghancurkan kontainer:
   ```typescript
   useEffect(() => {
     if (guestName) {
       const guestElements = document.querySelectorAll('.guest-name-text, #packet-guest-name');
       guestElements.forEach(el => {
         el.textContent = guestName;
       });
     }
   }, [guestName]);
   ```
3. Hapus guard pembatas `isInitialized` yang memblokir inisialisasi ulang pada script JS vanilla.

---

## ISU 3: COVER AMPLOP SOBEK TERLEWAT OTOMATIS / LANGSUNG KE UNDANGAN

### 🔴 Gejala Masalah
Saat membuka undangan, amplop benih berserta tombol "Sobek & Tanam" tidak muncul sama sekali. Undangan langsung menampilkan isi dalam kondisi terbuka, atau sebaliknya amplop tertahan dan tidak bisa dibuka saat diklik.

### 🔍 Akar Masalah (Root Cause Analysis)
1. **SessionStorage Terkunci**:
   Komponen React memeriksa `sessionStorage.getItem('invitation_opened_...')`. Sekali undangan dibuka saat pengujian, nilai `'true'` tersimpan di tab browser. Setiap kali halaman dimuat ulang, skrip langsung mengeksekusi `cover.style.display = 'none'`.
2. **Pengecekan Dini `!shown(cover)` di `initCover`**:
   Di `public/dist/tumbuh-bersama.js`, terdapat baris:
   ```javascript
   if (!cover || !btn || !shown(cover)) skipCover();
   ```
   Pada milidetik pertama saat layout browser belum selesai menghitung geometri elemen, `shown(cover)` menghasilkan `false`. Fungsi tersebut mengira cover disembunyikan CSS, lalu memanggil `skipCover()` otomatis!
3. **Tabrakan Timer Ganda**:
   Fungsi `forceOpen` di React memiliki `setTimeout` (450ms, 1200ms, 1750ms) yang bertabrakan dengan animasi internal `openCover()` di JavaScript (420ms, 700ms, 1500ms, 1780ms).

### 🛠️ Solusi Teruji
1. Hapus pemaksaan `skipCover()` otomatis dari `sessionStorage` pada initial mount agar amplop benih selalu tampil untuk pengunjung.
2. Di `public/dist/tumbuh-bersama.js`, hapus baris `if (!shown(cover)) skipCover()`. Pastikan `skipCover()` hanya dipanggil jika ada aksi eksplisit.
3. Selaraskan klik tombol amplop langsung ke fungsi master sequence Wedivo:
   ```typescript
   // Di TumbuhBersama.tsx:
   const handleOpenCover = () => {
     if (typeof (window as any).openTumbuhCover === 'function') {
       (window as any).openTumbuhCover();
     }
   };
   ```
4. **Urutan Animasi Master Wedivo**:
   - `0ms`: Bunyikan suara sobek kertas (`sound.tear()`).
   - `420ms`: Potong strip amplop (`.is-opening`).
   - `700ms`: Tuangkan benih ke tanah (`.is-pouring` & `pourSeeds()`).
   - `1500ms`: Bungkus amplop meluncur keluar layar (`.is-leaving`).
   - `1780ms`: Amplop hilang (`.is-gone`), benih tertanam, pohon bertumbuh (`BraidedTree`), penanda nama tertancap (`.markers-on`), dan navbar muncul (`#nav.is-on`).
   - `3500ms`: Musik latar BGM mengalun lembut.

---

## ISU 4: FORM RELOAD/REFRESH BROWSER SAAT KLIK "KIRIM & TANAM BIBITKU" ATAU "TANAM DOA"

### 🔴 Gejala Masalah
Ketika tamu mengisi form RSVP ("Ikut Menanam?") atau Kebun Doa ("Tanam Doa"), lalu mengklik tombol submit, halaman web langsung me-refresh/reload layar (seperti menekan F5). Akibatnya formulir kembali kosong dan data tidak tersimpan.

### 🔍 Akar Masalah (Root Cause Analysis)
1. Tombol `#rs-submit` dan `#ws-submit` memiliki tipe `type="submit"` atau berada di dalam tag `<form id="rs-form">` dan `<form id="ws-form">` tanpa pencegah aksi default (`event.preventDefault()`).
2. Browser HTML5 secara otomatis memicu pengiriman form standar via HTTP GET/POST ke URL halaman saat ini saat tombol form ditekan. Halaman langsung reload sebelum request asinkron JavaScript (`fetch('/api/comments')` atau `fetch('/api/ucapan')`) sempat terkirim atau menyelesaikan tugasnya.

### 🛠️ Solusi Teruji
1. **Ubah Tipe Tombol di HTML**:
   Ganti `type="submit"` menjadi `type="button"`:
   ```html
   <!-- FORM RSVP -->
   <form id="rs-form" onsubmit="return false;" action="javascript:void(0);">
     ...
     <button id="rs-submit" type="button" class="btn">Kirim &amp; tanam bibitku</button>
   </form>

   <!-- FORM KEBUN DOA -->
   <form id="ws-form" onsubmit="return false;" action="javascript:void(0);">
     ...
     <button id="ws-submit" type="button" class="btn">Tanam doa</button>
   </form>
   ```
2. **Pasang Delegated Event Capturing di React (`TumbuhBersama.tsx`)**:
   Gunakan parameter `useCapture = true` untuk mencegat event sebelum mencapai browser default:
   ```typescript
   useEffect(() => {
     const preventFormReload = (e: Event) => {
       const target = e.target as HTMLElement;
       if (target && target.closest('#rs-form, #ws-form')) {
         e.preventDefault();
         e.stopPropagation();
       }
     };

     document.addEventListener('submit', preventFormReload, true);
     return () => document.removeEventListener('submit', preventFormReload, true);
   }, []);
   ```
3. **Cegah Penekanan Tombol Enter pada Input Teks**:
   ```typescript
   const handleKeyDown = (e: KeyboardEvent) => {
     if (e.key === 'Enter') {
       const target = e.target as HTMLElement;
       if (target.matches('#rs-name, #rs-pax, #ws-name')) {
         e.preventDefault();
       }
     }
   };
   document.addEventListener('keydown', handleKeyDown, true);
   ```

---

## ISU 5: KOMENTAR DAN UCAPAN HARUS DI-REFRESH BROWSER BARU MUNCUL (TIDAK REAL-TIME)

### 🔴 Gejala Masalah
Setelah form disubmit dan status berhasil, komentar atau kartu doa baru **tidak muncul di layar**. Tamu harus me-refresh browser secara manual baru komentarnya terlihat.

### 🔍 Akar Masalah (Root Cause Analysis)
1. **Stale DOM Closure Reference**: Variabel DOM kontainer (misalnya `const wsList = document.getElementById('ws-list')`) hanya diambil sekali di dalam `useEffect` saat mount. Jika React atau DOM memodifikasi node, variabel tersebut menjadi referensi usang (*stale reference*) yang mengarah ke detached DOM node.
2. **Tidak Ada Panggilan Mutasi DOM Langsung**: Handler submit hanya memanggil `fetch()` tanpa langsung memanggil fungsi render kartu baru ke layar secara optimis atau sinkronisasi feed.

### 🛠️ Solusi Teruji
1. **Ambil Elemen DOM Aktif Secara Dinamis di Dalam Handler**:
   Jangan gunakan variabel closure luar, selalu panggil `document.getElementById` tepat saat event submit terjadi.
2. **Optimistic DOM Insertion + Re-sync**:
   Segera masukkan kartu baru ke posisi paling atas dengan `insertAdjacentHTML('afterbegin', ...)` dan panggil reload feed:
   ```typescript
   // Di TumbuhBersama.tsx (handleUcapanSubmit):
   const res = await postUcapan(templateWedingId, { name, ucapan });
   if (res.success && res.data) {
     const listEl = document.getElementById('ws-list');
     if (listEl) {
       const newCardHtml = renderWishCardHtml(res.data);
       listEl.insertAdjacentHTML('afterbegin', newCardHtml);
     }
     // Sembunyikan status kosong
     const bedEl = document.getElementById('ws-bed');
     if (bedEl) bedEl.classList.remove('is-empty');
     
     // Sinkronisasi ulang data latar belakang
     await loadUcapan(true);
   }
   ```
3. **Hal yang Sama pada RSVP**:
   Setelah POST RSVP sukses, sisipkan kartu kehadiran di baris teratas `#rsvp-comments-list`, aktifkan scene bibit tertanam (`.is-planted`), dan panggil `refreshRsvpStats()`.

---

## ISU 6: INKONSISTENSI ANGKA STATISTIK KEHADIRAN DENGAN DASHBOARD ADMIN

### 🔴 Gejala Masalah
Di Dashboard Admin tertera: *Hadir: 4, Tidak Hadir: 0, Catatan: 3*, namun di halaman tamu section "Ikut Menanam?" angkanya berbeda, 0, atau widget statistik tidak muncul.

### 🔍 Akar Masalah (Root Cause Analysis)
1. **Perhitungan Tidak Seragam**: Dashboard menghitung tamu hadir berdasarkan kolom `presence === true` dan menjumlahkan pax dari komentar ber-tag `[RSVP]`. Halaman tamu sebelumnya belum memiliki rumus agregasi yang sama.
2. **Pre-render SSR Kosong**: Data komentar belum di-query secara server-side di `pages/[...slug].tsx`, sehingga SSR menghasilkan nilai default kosong.

### 🛠️ Solusi Teruji
1. **Query Relasi di `pages/[...slug].tsx` (`getServerSideProps`)**:
   ```typescript
   const wedding = await prisma.templateWeding.findUnique({
     where: { id: templateWedingId },
     include: {
       comments: { orderBy: { createdAt: 'desc' } },
       ucapanHarapan: { orderBy: { createdAt: 'desc' } },
       musik: true,
     }
   });
   ```
2. **Hitung Agregasi Identik**:
   ```typescript
   // Helper penghitung di tumbuhBersamaHtml.ts:
   let hadirCount = 0;
   let tidakHadirCount = 0;
   let catatanCount = 0;

   comments.forEach(c => {
     if (c.comment && c.comment.startsWith('[RSVP]')) {
       catatanCount++;
       const parsed = parseRsvpDetails(c.comment);
       if (c.presence) {
         hadirCount += (parsed.pax || 1);
       } else {
         tidakHadirCount++;
       }
     }
   });
   ```
3. **Pre-render Widget Statistik (#rsvp-stats-box)**:
   Tampilkan kotak statistik ini di atas feed komentar RSVP:
   ```html
   <div id="rsvp-stats-box" class="rsvp-stats-grid">
     <div class="stat-item"><span class="num">${hadirCount}</span> Tamu Hadir</div>
     <div class="stat-item"><span class="num">${tidakHadirCount}</span> Berhalangan</div>
     <div class="stat-item"><span class="num">${catatanCount}</span> Catatan</div>
   </div>
   ```

---

## ISU 7: DATA MASIH STATIS & TIDAK TERKONEKSI KE DATABASE (100% DYNAMIC BINDING)

### 🔴 Gejala Masalah
Halaman undangan masih menampilkan nama contoh bawaan Wedivo (`@asrikinanti`, `@bumisatria`, tanggal `2026-10-30`, atau nomor rekening palsu), bukan data asli pengantin dari database.

### 🔍 Akar Masalah (Root Cause Analysis)
File template HTML (`tumbuhBersamaHtml.ts`) masih memuat markup statis mentah hasil cloning dari Wedivo tanpa proses templating/string interpolation.

### 🛠️ Solusi Teruji (Daftar Pemetaan Kolom Database)
Ganti seluruh teks statis dengan properti dari `data` (`TemplateWeding`):
```typescript
// 1. Instagram Mempelai
const igPria = cleanIg(data.instagramPutra); // URL atau @username
const igWanita = cleanIg(data.instagramPutri);

// 2. Akad & Resepsi
const tglAkad = formatDateIndo(data.tanggalAkad);
const jamAkad = data.jamAkad;
const tempatAkad = data.lokasiAkad;
const alamatAkad = data.alamatAkad;

const tglResepsi = formatDateIndo(data.tanggalResepsi);
const jamResepsi = data.jamResepsi;
const tempatResepsi = data.lokasiResepsi;
const alamatResepsi = data.alamatPernikahan;

// 3. Tautan Peta & Kalender
const mapsUrl = data.linkMaps || '#';
const calUrl = data.linkGoogleCalender || '#';

// 4. Rekening Bank & Hadiah (Transfer via ATM)
const namaBank = data.namaBank || 'Bank Central Asia';
const noRekening = data.noAtm || '-';
const atasNama = data.namaLengkapPutra || data.namaPutra;
const noHpWa = cleanPhone(data.noHp); // Format 628xxx untuk link WhatsApp
```

---

## ISU 8: STATE POHON BOTANI PASCA RELOAD (VARIABEL T0 KANVAS & INSTANT BLOOMING)

### 🔴 Gejala Masalah
Jika pengunjung me-refresh browser saat posisi sudah di dalam undangan, kanvas pohon `#hero-canvas` kosong karena animasi pertumbuhan benih terlewat.

### 🔍 Akar Masalah (Root Cause Analysis)
Di dalam fungsi `paint` kanvas pohon pada `tumbuh-bersama.js`, pohon membutuhkan variabel waktu awal `T0`. Jika benih tidak dituangkan (karena halaman dimuat ulang dan cover dilewati), nilai `T0` bernilai `-1`. Akibatnya, fungsi `paint` melakukan `return` dini dan pohon tidak digambar.

### 🛠️ Solusi Teruji
1. **Auto-Fallback Loop Kanvas (`tumbuh-bersama.js`)**:
   ```javascript
   // Jika hero sudah terlihat tetapi T0 belum diinisialisasi:
   if (T0 < 0 && (heroRevealed || heroEl.classList.contains('in-view') || heroEl.classList.contains('is-seen'))) {
     T0 = time - 10; // Setel waktu 10 detik di masa lalu agar pohon langsung mekar penuh!
   }
   ```
2. **Ekspos API Global Kontrol Pohon**:
   ```javascript
   win.startTumbuhTree = function(instant) {
     if (instant) {
       T0 = performance.now() / 1000 - 10; // Langsung mekar seketika (refresh)
     } else {
       T0 = performance.now() / 1000; // Tumbuh perlahan dari benih
     }
   };
   ```
3. Panggil `window.startTumbuhTree(true)` saat status `applyOpenedState` dijalankan di React.

---

## ISU 9: KONTEN TERSEMBUNYI (BLANK BACKGROUND ONLY) & BARU MUNCUL SAAT SCREENSHOT

### 🔴 Gejala Masalah
Halaman undangan hanya menampilkan latar belakang kosong saat di-scroll biasa. Namun ketika diambil tangkapan layar full page via ekstensi browser, seluruh teks, foto, dan kartu mendadak muncul.

### 🔍 Akar Masalah (Root Cause Analysis)
1. **RootMargin Negatif Terlalu Ketat**: Skrip menggunakan `IntersectionObserver` dengan konfigurasi `rootMargin: "0px 0px -33% 0px"`. Pada layar ponsel atau monitor tertentu, elemen harus masuk lebih dari sepertiga tinggi layar baru observer terpicu. Jika pengguna berhenti sebelum batas itu, kartu tetap memiliki class `.rv` (`opacity: 0`).
2. **Kenapa Muncul saat Screenshot**: Ekstensi browser screenshot memicu media query `@media (prefers-reduced-motion: reduce)`, yang di CSS berisi `.rv { opacity: 1 !important; transform: none !important; }`.

### 🛠️ Solusi Teruji
1. **Perbaiki CSS Safety Rule di `public/css/tumbuh-bersama.css`**:
   ```css
   /* Pastikan saat section aktif atau body terbuka, konten langsung terlihat */
   body.is-open .rv,
   .is-seen .rv,
   .in-view .rv,
   .rv.in-view,
   .rv.is-seen {
     opacity: 1 !important;
     transform: none !important;
     filter: none !important;
     visibility: visible !important;
   }
   ```
2. **Ganti RootMargin Menjadi Positif**:
   Ubah root margin observer di JS menjadi `rootMargin: "0px 0px 120px 0px"`, sehingga elemen sudah mulai dimunculkan 120px sebelum masuk ke layar.
3. **Scroll Reveal Fallback di React**:
   Gunakan listener scroll dengan `getBoundingClientRect()` sebagai pengaman jika `IntersectionObserver` terlambat diproses oleh browser.

---

## ISU 10: SYNTAXERROR PARSING JSON DASHBOARD (`UNEXPECTED TOKEN '<', "<!DOCTYPE "...`)

### 🔴 Gejala Masalah
Layar dashboard menampilkan error merah:
```text
Runtime SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

### 🔍 Akar Masalah (Root Cause Analysis)
Kode di dashboard memanggil `fetch('/api/endpoint').then(res => res.json())`. Jika endpoint API mengembalikan status error 404/500 atau sedang di-restart, server Next.js mengembalikan halaman HTML error yang diawali dengan `<!DOCTYPE html>`. Ketika fungsi `.json()` membaca string HTML tersebut, parser JSON meledak dengan SyntaxError.

### 🛠️ Solusi Teruji
Buat helper `safeParseJson` protektif di `pages/dashboard.tsx` dan gunakan pada seluruh pemanggilan fetch:
```typescript
const safeParseJson = async (res: Response) => {
  try {
    const text = await res.text();
    // Jika respons kosong atau berupa halaman HTML error Next.js
    if (!text || text.trim().startsWith('<')) {
      console.warn('Respons API bukan JSON yang valid:', text.slice(0, 100));
      return null;
    }
    return JSON.parse(text);
  } catch (err) {
    console.error('Gagal parsing JSON:', err);
    return null;
  }
};
```

---

## ISU 11: PRISMA CLIENT RUNTIME LOCK (`QUERY_ENGINE-WINDOWS.DLL.NODE IN USE`)

### 🔴 Gejala Masalah
Saat menjalankan `npx prisma generate` di Windows, muncul error:
```text
EPERM: operation not permitted, unlink '...node_modules\.prisma\client\query_engine-windows.dll.node'
```
Atau di runtime muncul error:
```text
Unknown argument `musikId`. Available options are marked with ?.
```

### 🔍 Akar Masalah (Root Cause Analysis)
File binary engine Prisma (`query_engine-windows.dll.node`) sedang dikunci (*locked by process*) oleh proses Next.js dev server yang sedang aktif di terminal background. Akibatnya generator tidak bisa memperbarui client Prisma.

### 🛠️ Solusi Teruji
1. Matikan sementara proses Next.js dev server (`taskkill` atau stop background process).
2. Jalankan `npx prisma generate`.
3. Nyalakan kembali dev server: `npm run dev`.
4. **Proteksi Kode (Raw SQL Fallback)**:
   Pada endpoint kritis seperti simpan musik (`pages/api/landing/[id]/musik.ts`), selalu sediakan fallback Raw SQL jika model client Prisma belum mengenali kolom baru:
   ```typescript
   try {
     await prisma.templateWeding.update({ where: { userId: id }, data: { musikId } });
   } catch {
     await prisma.$executeRawUnsafe(
       `UPDATE "template_wedings" SET "musik_id" = $1, "updated_at" = NOW() WHERE "user_id" = $2`,
       musikId, id
     );
   }
   ```

---

## ISU 12: EFEK SUARA SOBEK KERTAS REALISTIS & URUTAN BUKA UNDANGAN

### 🔴 Gejala Masalah
Suara sobekan terdengar seperti suara desis robotik sintetis (white noise bandpass) dan musik latar langsung menimpa suara sobekan kertas.

### 🛠️ Solusi Teruji
1. Gunakan file audio rekaman asli: `/audio/tear-paper.mp3`.
2. Pre-load audio di HTML menggunakan tag:
   ```html
   <audio id="sfx-tear" preload="auto" src="/audio/tear-paper.mp3"></audio>
   ```
3. Putar `#sfx-tear` dengan volume `1.0` tepat saat amplop diklik.
4. Tunda pemutaran musik latar (BGM) selama **350ms - 400ms** agar suara sobekan kertas terdengar renyah dan dramatis sebelum musik pengiring masuk.

---

## 📋 CHECKLIST MANDATORI AI SEBELUM MENYELESAIKAN TUGAS

Setiap kali menyelesaikan tugas di repositori ini, AI wajib memverifikasi poin-poin berikut:
- [ ] **Bebas Error Tipe**: Jalankan `npx tsc --noEmit` dan pastikan `exit code: 0`.
- [ ] **Bebas SyntaxError JS**: Pastikan skrip vanilla di `public/dist/` tidak mengandung karakter range regex korup.
- [ ] **Zero Reload**: Pastikan form RSVP dan Ucapan Harapan tidak me-refresh browser saat disubmit.
- [ ] **Live Feed**: Komentar atau ucapan baru langsung muncul di baris teratas tanpa perlu me-refresh browser.
- [ ] **Pemisahan 4 Fitur**:
  - [ ] Foto album galeri dari `galeries.fotos`.
  - [ ] Cerita cinta dari `pertemuan` dan `template_wedings.bersamaFotos`.
  - [ ] Kehadiran dari tabel `comments` (marker `[RSVP]`).
  - [ ] Doa & harapan dari tabel `ucapan_harapan`.
- [ ] **Kesesuaian Mempelai**: Mempelai Pria (`*Putra`) dan Wanita (`*Putri`) tidak boleh terbalik.
- [ ] **Guest View Read-Only**: Halaman tamu `pages/[...slug].tsx` tidak memuat kontrol edit.
- [ ] **Dual Sync**: Selaraskan perubahan ke repositori lokal dan ke direktori OneDrive:
  `C:\Users\USER.DESKTOP-UQ662UT.000\OneDrive\Dokumen\project\undangan projek\undangan\`
- [ ] **Update CHANGELOG.md**: Catat seluruh rincian pekerjaan di `docs/CHANGELOG.md`.

---

## ISU 13: HYDRATION MISMATCH PADA `next/dynamic` DENGAN LOADING FALLBACK

### 1. Gejala Error
```text
Hydration failed because the server rendered HTML didn't match the client.
...
- <div className="space-y-6"> (Server HTML TabOverview)
+ <div className="bg-white ... TabLoading"> (Client Fallback)
```

### 2. Akar Penyebab Teknis
Ketika komponen default awal (seperti `TabOverview` di dashboard) dibungkus `dynamic(..., { loading: () => <TabLoading /> })`:
- Di **Server (SSR)**: Next.js merender HTML asli komponen (`space-y-6`).
- Di **Client**: Saat proses hydration pertama di browser, dynamic import masih berada pada state `loading: true`, sehingga browser merender `<TabLoading>`.
- Terjadilah perbedaan pohon DOM (*Hydration Mismatch*).

### 3. Solusi Teruji
1. **Komponen Default Awal Wajib Static Import**: Tab atau komponen yang langsung tampil pada first-render (seperti `TabOverview`) diimpor statis `import TabOverview from '@/components/dashboard/tabs/TabOverview'`.
2. **Tab Sekunder Menggunakan `{ ssr: false }`**: Tab-tab lain yang hanya diakses setelah user berinteraksi (`TabMempelai`, `TabAcara`, `TabCustomContent`, dll.) dibungkus `dynamic(..., { ssr: false, loading: () => <TabLoading /> })`.
3. **Template Undangan Tamu**: Pada `[...slug].tsx`, gunakan `dynamic(() => import(...))` tanpa loading fallback yang berbeda dari HTML server agar SSR langsung menghidrasi markup yang sama.
