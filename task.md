# 📋 DOKUMEN TUGAS PENGEMBANGAN: PEROMBAKAN ALUR KERJA (FLOW) APLIKASI UNDANGAN

Dokumen ini adalah panduan langkah-demi-langkah terstruktur untuk merombak alur kerja aplikasi undangan pernikahan Next.js.
Setiap instruksi disusun dengan **spesifik, detail, dan eksplisit** agar dapat dieksekusi langsung tanpa interpretasi ganda.

---

## 🎯 TUJUAN PERUBAHAN
1. **Menghilangkan Fitur Live Editing di Tampilan Undangan**:
   - Tampilan undangan awal (`/[adminId]` atau `/[adminId]/to/[guestName]`) murni bersifat **Read-Only** untuk tamu.
   - Tidak ada lagi tombol pensil, double-click edit, atau form popup di halaman tamu.
2. **Sentralisasi Pengeditan di Dashboard**:
   - Seluruh pengelolaan data dipindahkan ke dalam halaman Admin Dashboard (`/dashboard`).
3. **Formulir Pengaturan Pernikahan Lengkap**:
   - Data Mempelai Pria & Wanita (Nama, Orang Tua, Kelahiran/Tanggal Lahir, Foto).
   - Informasi Acara (Tanggal Pernikahan, Link Google Calendar, Akad, Resepsi, Alamat & Maps).
   - Galeri Foto Photoshoot (Multiple upload).
   - Amplop Digital / Love Gift (Bank, Rekening, No HP, QRIS dengan toggle/radio aktif/nonaktif).
4. **Pemilihan Template Undangan (Card Selector)**:
   - Memilih template undangan aktif (Template A - Modern, Template B - Editorial Template 3, Template C - Sederhana).
5. **Alur Baru**:
   - `Login` $\rightarrow$ `Dashboard` $\rightarrow$ `Isi Form Pernikahan & Simpan` $\rightarrow$ `Pilih Template` $\rightarrow$ `Generate Link Undangan`.

---

## 📑 DAFTAR FASE PENGERJAAN

```
Fase 1: Update Skema Database & Migrasi Prisma
Fase 2: Pembaruan API Backend (Endpoint Data & Upload)
Fase 3: Pembersihan Fitur Live Edit dari Halaman Undangan (Guest View Read-Only)
Fase 4: Perombakan Total Halaman Dashboard (/dashboard)
Fase 5: Integrasi Data Dinamis ke Komponen Template (Khususnya Template 3)
Fase 6: Pengujian Akhir & Verifikasi Build
```

---

## 🚀 FASE 1: UPDATE SKEMA DATABASE & MIGRASI PRISMA

### Berkas Terkait:
- File Target: `prisma/schema.prisma`
- File Types: `prisma/schema.types.ts`

### Langkah-langkah:
1. Buka berkas `prisma/schema.prisma`.
2. Pada model `TemplateWeding`, tambahkan kolom-kolom baru berikut untuk mengakomodasi kebutuhan data baru:
   ```prisma
   // Informasi Kelahiran Mempelai
   kelahiranPutra   String   @default("") @map("kelahiran_putra")
   kelahiranPutri   String   @default("") @map("kelahiran_putri")

   // Detail Jadwal Akad & Resepsi Terpisah
   tanggalAkad      DateTime @default(now()) @map("tanggal_akad")
   jamAkad          String   @default("") @map("jam_akad")
   lokasiAkad       String   @default("") @map("lokasi_akad")
   alamatAkad       String   @default("") @map("alamat_akad")

   tanggalResepsi   DateTime @default(now()) @map("tanggal_resepsi")
   lokasiResepsi    String   @default("") @map("lokasi_resepsi")

   // Pengaturan Toggle / Radio Status Gift
   isGiftActive     Boolean  @default(true) @map("is_gift_active")
   isBankActive     Boolean  @default(true) @map("is_bank_active")
   isQrisActive     Boolean  @default(true) @map("is_qris_active")
   ```
3. Simpan berkas `prisma/schema.prisma`.
4. Jalankan perintah migrasi dan generate Prisma:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Perbarui `prisma/schema.types.ts` agar interface `ITemplateWeding` mencakup atribut-atribut baru tersebut.

### Kriteria Selesai Fase 1:
- [ ] Kolom baru berhasil terdaftar di skema Prisma.
- [ ] Perintah `npx prisma db push` berhasil dijalankan tanpa error.
- [ ] Prisma Client ter-generate ulang dengan sukses.

---

## 🛠️ FASE 2: PEMBARUAN API BACKEND

### Berkas Terkait:
- File Target 1: `pages/api/landing/[id].ts`
- File Target 2: `pages/api/user/template.ts` (Endpoint baru atau update endpoint)

### Langkah-langkah:
1. **Update Handler PUT di `pages/api/landing/[id].ts`**:
   - Tangani field baru dari `fields`:
     - `kelahiranPutra`, `kelahiranPutri`
     - `tanggalAkad`, `jamAkad`, `lokasiAkad`, `alamatAkad`
     - `tanggalResepsi`, `jamResepsi`, `lokasiResepsi`
     - `isGiftActive` (parse boolean dari string `"true"`/`"false"`)
     - `isBankActive` (parse boolean)
     - `isQrisActive` (parse boolean)
   - Tangani upload file dari `files`:
     - `photoPutra` (upload ke Cloudinary jika dikirim berupa file)
     - `photoPutri` (upload ke Cloudinary jika dikirim berupa file)
     - `fotoQris` (upload ke Cloudinary jika dikirim berupa file)
     - `fotoHeader` (upload ke Cloudinary jika dikirim berupa file)
2. **Buat Endpoint Pemilihan Template User**:
   - Buat file `pages/api/user/template.ts` jika belum ada:
     - Method `PUT`: Menerima `{ template: "A" | "B" | "C" }`.
     - Validasi sesi user yang sedang login (`getServerSession`).
     - Lakukan update ke tabel `User`:
       ```typescript
       await prisma.user.update({
         where: { id: session.user.id },
         data: { template: req.body.template }
       });
       ```
     - Return status `200` dengan JSON sukses.

### Kriteria Selesai Fase 2:
- [ ] API `PUT /api/landing/[id]` dapat menyimpan seluruh field data dan file foto baru.
- [ ] API pemilihan template berhasil mengupdate preferensi template user di database.

---

## 🔒 FASE 3: PEMBERSIHAN FITUR LIVE EDIT DARI HALAMAN UNDANGAN

### Berkas Terkait:
- File Target 1: `pages/[...slug].tsx`
- File Target 2: `components/templates/SimpleModern.tsx`
- File Target 3: `components/templates/SimpleSederhana.tsx`
- File Target 4: `components/EditableText.tsx`, `components/EditableDate.tsx`, `components/EditableLink.tsx`

### Langkah-langkah:
1. **Nonaktifkan Mode Edit di `pages/[...slug].tsx`**:
   - Hapus prop `isAdminView={isAdminView}` atau paksa bernilai `false` secara permanen saat me-render komponen template (`SimpleModern`, `TemplateB`, `SimpleSederhana`).
2. **Hapus State & Pemicu Pensil di `SimpleModern.tsx` & `SimpleSederhana.tsx`**:
   - Hapus `showPencil`, `setShowPencil`, dan event `onDoubleClick={() => setShowPencil(true)}`.
   - Ganti penggunaan komponen input editor inline (`EditableText`, `EditableDate`, `EditableLink`) dengan elemen teks biasa (`<p>`, `<span>`, `<h1>`, `<a>`) yang langsung menampilkan nilai data dari props/database.
3. **Pastikan Halaman Undangan Tamu Bersih**:
   - Pastikan tidak ada floating button simpan data atau modal edit yang muncul di tampilan undangan. Halaman murni untuk dikonsumsi tamu undangan.

### Kriteria Selesai Fase 3:
- [ ] Halaman undangan dibuka oleh siapapun (termasuk admin) tidak memunculkan ikon pensil atau mode edit.
- [ ] Semua data di halaman undangan berstatus murni Read-Only.

---

## 🖥️ FASE 4: PEROMBAKAN TOTAL HALAMAN DASHBOARD (`pages/dashboard.tsx`)

### Berkas Terkait:
- File Target: `pages/dashboard.tsx`
- File Komponen Baru (opsional / modular):
  - `components/dashboard/GroomBrideForm.tsx`
  - `components/dashboard/EventScheduleForm.tsx`
  - `components/dashboard/LoveGiftForm.tsx`
  - `components/dashboard/GalleryUploadForm.tsx`
  - `components/dashboard/TemplateSelector.tsx`

### Struktur Tab / Tata Letak Baru di `pages/dashboard.tsx`:
Buat navigasi tab yang rapi di Dashboard:
* **Tab 1: Informasi Pernikahan (Wedding Data)**
* **Tab 2: Galeri Foto (Gallery)**
* **Tab 3: Amplop Digital (Love Gift)**
* **Tab 4: Pilihan Template (Template Selector)**
* **Tab 5: Generator Link Tamu (Guest Link Generator)**
* **Tab 6: Daftar Ucapan & RSVP (Comments & RSVP)**

### Rincian Form yang Harus Ada:

#### 1. Form Mempelai Pria:
- Input Teks: Nama Lengkap Mempelai Pria (`namaLengkapPutra`).
- Input Teks: Nama Panggilan Pria (`namaPutra`).
- Input Teks: Nama Ayah Pria (`namaAyahPutra`).
- Input Teks: Nama Ibu Pria (`namaIbuPutra`).
- Input Teks: Info Kelahiran / TTL Pria (`kelahiranPutra`).
- Input Teks: Username / Link Instagram Pria (`instagramPutra`).
- Input File: Upload Foto Pria (`photoPutra`) dengan preview gambar.

#### 2. Form Mempelai Wanita:
- Input Teks: Nama Lengkap Mempelai Wanita (`namaLengkapPutri`).
- Input Teks: Nama Panggilan Wanita (`namaPutri`).
- Input Teks: Nama Ayah Wanita (`namaAyahPutri`).
- Input Teks: Nama Ibu Wanita (`namaIbuPutri`).
- Input Teks: Info Kelahiran / TTL Wanita (`kelahiranPutri`).
- Input Teks: Username / Link Instagram Wanita (`instagramPutri`).
- Input File: Upload Foto Wanita (`photoPutri`) dengan preview gambar.

#### 3. Form Rangkaian Acara (Event Schedule):
- Input Date: Tanggal Pernikahan Utama (`tanggalPernikahan`).
- Input URL: Link Google Calendar (`linkGoogleCalender`).
- **Seksi Akad Nikah**:
  - Input Date/Time: Tanggal & Waktu Akad (`tanggalAkad`, `jamAkad`).
  - Input Teks: Lokasi/Gedung Akad (`lokasiAkad`).
  - Input Textarea: Alamat Lengkap Akad (`alamatAkad`).
- **Seksi Resepsi Nikah**:
  - Input Date/Time: Tanggal & Waktu Resepsi (`tanggalResepsi`, `jamResepsi` s/d `jamSelesai`).
  - Input Teks: Lokasi/Gedung Resepsi (`lokasiResepsi`).
  - Input Textarea: Alamat Lengkap Resepsi (`alamatPernikahan`).
  - Input URL: Link Google Maps (`linkMaps`).

#### 4. Form Amplop Digital / Love Gift:
- Toggle Switch / Radio Button Utama: Aktifkan Fitur Love Gift (`isGiftActive`).
- Seksi Transfer Bank:
  - Toggle / Radio: Aktifkan Transfer Bank (`isBankActive`).
  - Input Teks: Nama Bank (`namaBank`, contoh: BCA, Mandiri, BRI).
  - Input Teks: Nomor Rekening / ATM (`noAtm`).
  - Input Teks: Nomor HP / E-Wallet (`noHp`).
- Seksi Pembayaran QRIS:
  - Toggle / Radio: Aktifkan Pembayaran QRIS (`isQrisActive`).
  - Input File: Upload Gambar QRIS (`fotoQris`) dengan preview gambar.

#### 5. Form Galeri Foto:
- Upload multiple foto ke galeri.
- Tampilkan daftar thumbnail foto yang sudah ada dengan tombol "Hapus Foto".

#### 6. Komponen Pemilihan Template (Card Selector):
- Buat visualisasi kartu (Card Grid) untuk setiap template yang tersedia:
  - **Card 1: Template A - Modern Elegant** (Thumbnail preview, badge "Aktif" jika terpilih).
  - **Card 2: Template B - Editorial Modern (Template 3)** (Thumbnail preview, badge "Aktif" jika terpilih).
  - **Card 3: Template C - Simple Minimalist** (Thumbnail preview, badge "Aktif" jika terpilih).
- Tombol: "Pilih Template Ini" pada tiap kartu yang langsung mengirim request update ke `/api/user/template`.

#### 7. Generator Link Undangan Tamu:
- Input Teks: Nama Tamu Undangan (contoh: "Budi Santoso & Partner").
- Output Otomatis:
  - URL Undangan: `https://domain.com/[adminId]/to/Budi%20Santoso%20%26%20Partner`
- Tombol "Salin Link".
- Tombol "Bagikan ke WhatsApp" dengan template teks undangan yang sudah terisi otomatis.
- Tombol "Lihat Undangan" (Buka link di tab baru).

### Kriteria Selesai Fase 4:
- [ ] Admin dapat mengisi seluruh data pernikahan dari dashboard dan menekan tombol "Simpan Perubahan".
- [ ] Tombol simpan memanggil API `PUT /api/landing/[id]` dengan FormData (mendukung file upload).
- [ ] Pemilihan template card berfungsi dan tersimpan ke user session/database.
- [ ] Generator link undangan berfungsi dengan benar.

---

## 🎨 FASE 5: INTEGRASI DATA DINAMIS KE TEMPLATE UNDANGAN

### Berkas Terkait:
- File Target 1: `components/templates/TemplateB.tsx`
- Berkas Komponen: `components/template3/*` (Hero, Words, Mempelai, Tanggal, Lokasi, Galeri, Footer)

### Langkah-langkah:
1. Buka `components/templates/TemplateB.tsx`.
2. Kirim data `templateWedingData` sebagai props ke masing-masing komponen anak:
   ```tsx
   <Hero data={templateWedingData} />
   <Words data={templateWedingData} />
   <Mempelai data={templateWedingData} />
   <Tanggal data={templateWedingData} />
   <Lokasi data={templateWedingData} />
   <Galeri data={templateWedingData?.galery} />
   <Footer data={templateWedingData} />
   ```
3. Ubah komponen di dalam `components/template3/`:
   - Di `Hero/index.tsx`: Ganti mock data "Ahmad & Siti" dengan `data?.namaPutra` & `data?.namaPutri`, serta gambar dari `data?.fotoHeader`.
   - Di `Mempelai/index.tsx`: Tampilkan data nama lengkap, orang tua, dan info kelahiran dari props.
   - Di `Tanggal/index.tsx`: Tampilkan data akad & resepsi asli dari props beserta link Google Maps yang sesuai.
   - Di `Lokasi/index.tsx`: Gunakan link iframe Google Maps dari data database.
   - Di `Galeri/index.tsx`: Render array foto dari relasi galeri database (`data?.fotos`).

### Kriteria Selesai Fase 5:
- [ ] Template 3 tidak lagi menampilkan data dummy statis, melainkan data riil dari database yang diinput melalui Dashboard.
- [ ] Pergantian template (A, B, C) menghasilkan konten yang konsisten sesuai data yang diisi di Dashboard.

---

## ✅ FASE 6: PENGUJIAN AKHIR & VERIFIKASI BUILD

### Langkah-langkah:
1. **Linter & Type Check**:
   ```bash
   npm run lint
   ```
   Pastikan tidak ada error sintaksis TypeScript.
2. **Build Test**:
   ```bash
   npm run build
   ```
   Pastikan proses build Next.js sukses tanpa error halaman atau dependensi.
3. **Uji Alur Pengguna (User Testing Flow)**:
   - Login menggunakan akun admin.
   - Buka `/dashboard`.
   - Isi form data mempelai, jadwal acara, upload foto, dan rekening/QRIS. Klik simpan.
   - Pilih template B (Template 3).
   - Masukkan nama tamu "Keluarga Besar Budi" di generator link.
   - Buka link undangan yang dihasilkan di browser.
   - Pastikan halaman undangan terbuka dengan rapi, data sesuai yang diisi, dan tidak ada fitur edit pensil yang muncul.

---

## 📌 RINGKASAN FILE YANG DIUBAH / DIBUAT
| Lokasi File | Tindakan | Deskripsi |
|---|---|---|
| `prisma/schema.prisma` | Edit | Tambah field kelahiran, detail akad/resepsi, dan status gift |
| `prisma/schema.types.ts` | Edit | Sinkronisasi TypeScript interface `ITemplateWeding` |
| `pages/api/landing/[id].ts` | Edit | Terima field baru dan upload foto Cloudinary |
| `pages/api/user/template.ts` | Buat | Endpoint untuk menyimpan pilihan template user |
| `pages/[...slug].tsx` | Edit | Kunci tampilan tamu menjadi 100% Read-Only |
| `components/templates/*.tsx` | Edit | Hilangkan pemicu pensil live-edit |
| `pages/dashboard.tsx` | Rombak | Formulir lengkap pernikahan, selector template, generator link |
| `components/template3/*` | Edit | Sambungkan props dinamis dari database |
