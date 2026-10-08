# 📜 RULES.md — PANDUAN WAJIB SISTEM & DATABASE UNTUK AI AGENT

> [!IMPORTANT]
> **BERKAS INI ADALAH PETUNJUK RESMI & WAJIB DIBACA OLEH SETIAP AI (Antigravity, Claude, Cursor, Copilot, dll.) SEBELUM MEMBACA ATAU MEMODIFIKASI KODE.**
> Seluruh aturan di bawah ini mengikat arsitektur kode dan skema basis data agar penempatan data dinamis dari database ke template tidak tertukar atau salah tabel.

---

## 🧭 1. ATURAN PENEMPATAN 4 FITUR UTAMA KE DATABASE (JANGAN TERTUKAR!)

| No | Fitur / Kebutuhan | Tabel / Kolom di Database | Penjelasan & Alur Teknis |
| :---: | :--- | :--- | :--- |
| **1** | **Kumpulan Image Banyak**<br>*(Photoshoot / Album Galeri)* | **Tabel `galeries`**<br>*(Kolom `fotos: String[]`)* | Menyimpan array teks URL foto prewedding/photoshoot dalam jumlah banyak/dinamis. Terhubung ke `template_wedings` melalui foreign key `galery_id`. Dipakai pada slider/carousel galeri, modal grid foto, dan lightbox. |
| **2** | **Kisah Pertemuan Mempelai**<br>*(Love Story / Timeline / Kenangan)* | **Kolom `bersama_fotos`**<br>*(di tabel `template_wedings`)* | Array teks maksimal **6 slot foto** dokumentasi kebersamaan mempelai. Kolom `bersama_dipakai` (`"taman"` \| `"cerita"`) menentukan lokasi pemakaian. Narasi teksnya diambil dari tabel **`pertemuan`** (`judulPertemuanSatu`–`Empat`, `pertemuanPertama`–`Keempat`). |
| **3** | **Form Kehadiran Tamu**<br>*(RSVP)* | **Tabel `comments`**<br>*(Model `Comment`)* | Menyimpan konfirmasi kehadiran tamu. Kolom `presence: Boolean` (`true` = Hadir, `false` = Berhalangan). Format teks diawali marker **`[RSVP]`** (dikelola via `lib/comment-kind.ts`), mencatat jumlah tamu (pax) dan status kehadiran (Hadir, Berhalangan, Masih Ragu). |
| **4** | **Ucapan dan Doa Tamu**<br>*(Wishes / Pohon Harapan)* | **Tabel `ucapan_harapan`**<br>*(Model `UcapanHarapan`)* | Khusus menyimpan teks doa restu & harapan tamu (Pohon Harapan di Template B & C). Tabel ini independen, ber-scope per `template_weding_id`, ringan, tanpa sistem like/replies hierarkis. |

---

## 👫 2. KAMUS IDENTIFIKASI MEMPELAI: PRIA (GROOM) VS WANITA (BRIDE)

Semua data mempelai tersimpan di tabel **`template_wedings`** (Model: `TemplateWeding`). AI wajib membedakan field mempelai pria dan wanita sebagai berikut:

### 🤵 Mempelai Pria (Putra / Groom)
* **Nama Panggilan**: `namaPutra` (DB: `nama_putra`) — contoh: *"Wahyu"*, *"Badriana"*
* **Nama Lengkap & Gelar**: `namaLengkapPutra` (DB: `nama_lengkap_putra`) — contoh: *"Badriana, S.Kom."*
* **Nama Ayah**: `namaAyahPutra` (DB: `nama_ayah_putra`)
* **Nama Ibu**: `namaIbuPutra` (DB: `nama_ibu_putra`)
* **Urutan/Tanggal Lahir**: `kelahiranPutra` (DB: `kelahiran_putra`) — contoh: *"Putra pertama dari Bapak ... & Ibu ..."*
* **Akun Instagram**: `instagramPutra` (DB: `instagram_putra`) — URL atau username Instagram pria
* **Foto Profil Pria**: `photoPutra` (DB: `photo_putra`) — URL foto Cloudinary mempelai pria

### 👰 Mempelai Wanita (Putri / Bride)
* **Nama Panggilan**: `namaPutri` (DB: `nama_putri`) — contoh: *"Riski"*, *"Izzah"*
* **Nama Lengkap & Gelar**: `namaLengkapPutri` (DB: `nama_lengkap_putri`) — contoh: *"Nurul Izzah, S.Pd."*
* **Nama Ayah**: `namaAyahPutri` (DB: `nama_ayah_putri`)
* **Nama Ibu**: `namaIbuPutri` (DB: `nama_ibu_putri`)
* **Urutan/Tanggal Lahir**: `kelahiranPutri` (DB: `kelahiran_putri`) — contoh: *"Putri kedua dari Bapak ... & Ibu ..."*
* **Akun Instagram**: `instagramPutri` (DB: `instagram_putri`) — URL atau username Instagram wanita
* **Foto Profil Wanita**: `photoPutri` (DB: `photo_putri`) — URL foto Cloudinary mempelai wanita

---

## 🎨 3. PANDUAN PEMETAAN DATABASE KE KOMPONEN TEMPLATE (100% DINAMIS)

Aplikasi memiliki 3 template aktif:
* **Template A**: `components/templates/SimpleModern.tsx` (Modern Layout)
* **Template B**: `components/templates/TemplateB.tsx` $\rightarrow$ `components/template3/TamanRahasia.tsx` (Editorial Taman Rahasia)
* **Template C**: `components/templates/SimpleSederhana.tsx` $\rightarrow$ `components/templateC/KirigamiPastel.tsx` (Wedivo Kirigami Pastel)

Berikut panduan tempat meletakkan data database ke masing-masing bagian template:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      PETA INTEGRASI DATA KE TEMPLATE                            │
├─────────────────────────┬───────────────────────────┬───────────────────────────┤
│ BAGIAN TEMPLATE         │ SUMBER TABEL & KOLOM DB   │ KETERANGAN PENGGUNAAN     │
├─────────────────────────┼───────────────────────────┼───────────────────────────┤
│ 1. Cover / Hero / Buka  │ • template_wedings:       │ Menampilkan nama kedua    │
│    Undangan             │   namaPutra, namaPutri,   │ mempelai, foto latar      │
│                         │   namaLengkapPutra,       │ (hero), tanggal acara,    │
│                         │   namaLengkapPutri,       │ dan nama tamu undangan    │
│                         │   fotoHeader, fotoHeader2 │ (?to= atau /to/[nama])    │
│                         │   tanggalPernikahan       │                           │
│                         │ • Context: guestName      │                           │
├─────────────────────────┼───────────────────────────┼───────────────────────────┤
│ 2. Profil Mempelai      │ • template_wedings:       │ Card/Section Mempelai     │
│    (Groom & Bride)      │   photoPutra,             │ Pria & Mempelai Wanita    │
│                         │   namaLengkapPutra,       │ menampilkan nama, foto,   │
│                         │   namaAyahPutra,          │ orang tua, urutan anak,   │
│                         │   namaIbuPutra,           │ dan tombol IG             │
│                         │   kelahiranPutra,         │                           │
│                         │   instagramPutra          │                           │
│                         │   (dan pasangan Putri)    │                           │
├─────────────────────────┼───────────────────────────┼───────────────────────────┤
│ 3. Waktu & Lokasi Acara │ • template_wedings:       │ • Countdown timer         │
│    (Akad & Resepsi)     │   tanggalPernikahan,      │ • Detail waktu & gedung   │
│                         │   linkGoogleCalender,     │   Akad Nikah              │
│                         │   tanggalAkad, jamAkad,   │ • Detail waktu & gedung   │
│                         │   lokasiAkad, alamatAkad, │   Resepsi Pernikahan      │
│                         │   tanggalResepsi,         │ • Tombol Buka Maps        │
│                         │   jamResepsi, jamSelesai, │ • Tombol Google Calendar  │
│                         │   lokasiResepsi,          │ • Label zona waktu        │
│                         │   alamatPernikahan,       │   (WIB/WITA/WIT)          │
│                         │   linkMaps                │                           │
│                         │ • users: tz               │                           │
├─────────────────────────┼───────────────────────────┼───────────────────────────┤
│ 4. Kisah Cinta          │ • template_wedings:       │ Timeline / 4 babak cerita │
│    (Love Story /        │   bersamaFotos (max 6),   │ perjalanan cinta kedua    │
│    Taman Rahasia)       │   bersamaDipakai          │ mempelai beserta foto     │
│                         │ • pertemuan:              │ kebersamaan               │
│                         │   judulPertemuanSatu-4,   │                           │
│                         │   pertemuanPertama-4      │                           │
├─────────────────────────┼───────────────────────────┼───────────────────────────┤
│ 5. Galeri Foto Album    │ • galeries:               │ Slider carousel foto,     │
│    (Photoshoot)         │   fotos (Array URL)       │ masonry grid album foto,  │
│                         │                           │ dan modal popup zoom      │
├─────────────────────────┼───────────────────────────┼───────────────────────────┤
│ 6. Amplop Digital       │ • template_wedings:       │ • Jika isGiftActive=false │
│    (Love Gift / Hadiah) │   isGiftActive,           │   sembunyikan section ini │
│                         │   isBankActive, namaBank, │ • Nomor rekening + Salin  │
│                         │   noAtm,                  │ • Gambar QRIS digital     │
│                         │   isQrisActive, fotoQris, │ • Konfirmasi WhatsApp     │
│                         │   noHp                    │                           │
├─────────────────────────┼───────────────────────────┼───────────────────────────┤
│ 7. Konfirmasi Kehadiran │ • comments:               │ Form tamu memilih Hadir/  │
│    (Form RSVP)          │   presence, name, comment │ Tidak Hadir + jumlah pax. │
│                         │   (format: [RSVP] ...)    │ Tersimpan di comments.    │
├─────────────────────────┼───────────────────────────┼───────────────────────────┤
│ 8. Ucapan & Doa         │ • ucapan_harapan:         │ List ucapan doa restu     │
│    (Pohon Harapan)      │   name, ucapan, createdAt │ tamu pada pohon harapan   │
│                         │   (di-filter per          │ (Template B & C).         │
│                         │    templateWedingId)      │                           │
├─────────────────────────┼───────────────────────────┼───────────────────────────┤
│ 9. Footer Penutup       │ • template_wedings:       │ Nama mempelai & ucapan    │
│                         │   namaPutra, namaPutri,   │ terima kasih keluarga     │
│                         │   namaAyahPutra, dst.     │ besar kedua mempelai      │
└─────────────────────────┴───────────────────────────┴───────────────────────────┘
```

---

## 🔒 4. ATURAN HAK AKSES TAMPILAN: GUEST VIEW VS ADMIN DASHBOARD

1. **Halaman Tamu (`pages/[...slug].tsx`)**:
   * Akses URL: `/[userId]` atau `/[userId]/to/[guestName]`.
   * **MUTLAK READ-ONLY**: Tamu hanya melihat undangan. Jangan pernah menambahkan tombol pensil, input inline, popup modal edit, atau trigger edit data pada tampilan tamu.
   * Template yang dimuat ditentukan otomatis oleh kolom `user.template` di database.

2. **Halaman Dashboard Admin (`pages/dashboard.tsx`)**:
   * Akses URL: `/dashboard` (dilindungi autentikasi NextAuth `/login`).
   * **PUSAT EDITING**: Tempat seluruh modifikasi data mempelai, jadwal acara, upload foto Cloudinary, amplop digital, manajemen galeri, moderasi ucapan/RSVP, dan pemilihan template (`A`, `B`, `C`).

---

## 🚀 5. CHECKLIST VERIFIKASI UNTUK AI SEBELUM MENYELESAIKAN TUGAS
Sebelum AI menyatakan tugas selesai:
* [ ] Data mempelai pria mengambil kolom `*Putra` dan mempelai wanita mengambil kolom `*Putri`.
* [ ] Foto album galeri mengambil dari tabel `galeries.fotos`.
* [ ] Foto kisah pertemuan mengambil dari `template_wedings.bersamaFotos`.
* [ ] Form kehadiran (RSVP) masuk ke tabel `comments`.
* [ ] Doa dan harapan masuk ke tabel `ucapan_harapan`.
* [ ] Halaman tamu undangan tetap bersifat Read-Only tanpa tombol editing.
