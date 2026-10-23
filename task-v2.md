# DOKUMEN RENCANA KERJA & ARSITEKTUR: SISTEM FORM DINAMIS BERBASIS TEMPLATE (TASK-V2)

Dokumen ini mendokumentasikan latar belakang masalah, arsitektur solusi, alur kerja (*workflow*), roadmap per template, serta checklist eksekusi untuk mengubah sistem data undangan dari yang semula kaku berbasis database statis menjadi **Sistem Form Dinamis Berbasis Template (*Template-Driven Content System*)**.

---

## 1. LATAR BELAKANG & IDENTIFIKASI MASALAH

### A. Masalah Form Database Kaku (*Database-Centric*)
* Sebelumnya, form di dashboard hanya mengikuti kolom-kolom tabel SQL kaku di database (`namaPutra`, `namaPutri`, `tglAkad`, `lokasiAkad`, dll.).
* Padahal, setiap template undangan pernikahan memiliki **"jiwa" dan narasi bercerita (*storytelling*) yang unik**:
  * **Template C (Kirigami Pastel)**: Keterangan anak (*"Putri kedua dari"*), kutipan seni kertas, 3 kisah lipatan kertas, 3 lipatan rahasia Q&A, dan palet 4 warna busana pastel.
  * **Template B (Taman Rahasia)**: Keterangan anak, petunjuk perawatan benih mempelai pria & wanita, kutipan di prasasti batu, 4 babak kisah musim taman, 3 bunga pilihan & artinya, 5 swatch palet busana, dan surat rahasia di balik batu.
  * **Template D (Tumbuh Bersama)**: Tanah asal & sifat tanah, paket benih, kisah 4 musim tanam, 6 daun gugur interaktif, 5 lingkaran pohon, petunjuk kebun, 4 harapan pernikahan di pohon harapan, dan 5 warna busana.
  * **Template E (Meja Sang Koki)**: Edisi menu & nomor meja, kutipan kaldu, catatan koki, bahan baku mempelai, 4 babak sajian menu degustasi berpadu minuman, resep rumah tangga bahagia, 4 uji rasa menu, dan etiket busana restoran.

### B. Teks Template Selama Ini Hardcoded
* Karena tidak ada wadah input di dashboard, teks-teks puitis dan fitur interaktif di template selama ini terkunci secara *hardcoded* di kode HTML/komponen.
* Pengantin tidak bisa mempersonalisasi kisah cinta, kutipan, aturan busana, maupun pertanyaan lipatan rahasia mereka sendiri.

### C. Alur Pengeditan Belum Runtut
* Pengeditan data idealnya mengikuti **alur pandangan mata tamu dari atas (Hero/Header) sampai ke paling bawah (Penutup & Musik)**, mencakup 13 pilar modul universal:
  1. `Hero` ➡️ 2. `Couple` ➡️ 3. `Story` ➡️ 4. `Events` ➡️ 5. `Rundown` ➡️ 6. `Countdown` ➡️ 7. `Venue` ➡️ 8. `Gallery` ➡️ 9. `Folds / Fitur Tema Khusus` ➡️ 10. `Dresscode` ➡️ 11. `RSVP` ➡️ 12. `Wishes` ➡️ 13. `Closing & Musik`.

---

## 2. ARSITEKTUR SOLUSI (*TEMPLATE-DRIVEN DYNAMIC SYSTEM*)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER MEMILIH TEMPLATE DI DASHBOARD                       │
│    (Template C: Kirigami, Template B: Taman Rahasia, dll.)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. DASHBOARD MEMBUKA FORM EDITOR KHUSUS TEMPLATE TERSEBUT    │
│    - Runtut dari atas ke bawah (Hero s/d Closing)           │
│    - Sudah terisi otomatis dengan PRESET DEFAULT INSPIRATIF │
│    - Pengantin tinggal edit teks & pilih warna busana       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. SIMPAN KE 1 KOLOM UNIVERSAL DI POSTGRESQL                │
│    Kolom: customContent Json? pada tabel TemplateWeding     │
│    Struktur: { "B": { ... }, "C": { ... }, "D": { ... } }   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. HALAMAN UNDANGAN TAMU MERENDER DATA DINAMIS              │
│    - Membaca data editan pengantin                          │
│    - Fallback otomatis ke preset default jika belum diedit  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. SPESIFIKASI KONTEN PER TEMPLATE (ROADMAP)

### A. Template C — Kirigami Pastel [✅ SELESAI]
* **Couple**: Keterangan Anak Wanita (`keteranganAnakWanita`), Pria (`keteranganAnakPria`).
* **Hero**: Kutipan Pembuka Kertas (`heroQuote`).
* **Story (Tiga Guntingan Kisah)**: Babak 1, 2, 3 (Judul, Kisah, Foto).
* **Folds (Lipatan Rahasia / Q&A Interaktif)**: Lipatan 1, 2, 3 (Pertanyaan & Jawaban).
* **Dresscode**: Keterangan Busana & 4 Color Picker pastel.
* **Gifts & Closing**: Catatan Hadiah, Pesan Penutup, Tagar Pernikahan (`#SatuLembarBerdua`).

---

### B. Template B — Taman Rahasia [✅ SELESAI]
Konsep: Taman botani rahasia, bungkus benih cinta, prasasti batu bertuah, bunga bermakna, dan surat tersembunyi.
1. **Couple (Silsilah & Paket Benih Perawatan)**:
   * Keterangan Anak Mempelai Wanita (`keteranganAnakWanita` — misal: *"Putri kedua dari"*).
   * Keterangan Anak Mempelai Pria (`keteranganAnakPria` — misal: *"Putra pertama dari"*).
   * Petunjuk Perawatan Mempelai Wanita (`petunjukPerawatanWanita` — teks multi-baris di balik bungkus benih).
   * Petunjuk Perawatan Mempelai Pria (`petunjukPerawatanPria` — teks multi-baris di balik bungkus benih).
2. **Hero & Gerbang Prasasti**:
   * Kalimat Pembuka Gerbang (`introText` — *"Dengan memohon rahmat dan ridho Tuhan..."*).
   * Kutipan di Prasasti Batu (`quotePrasasti` — *"Cinta tidak tumbuh dalam semalam. Ia ditanam dengan sabar..."*).
   * Sumber Kutipan (`quoteSource` — *"Catatan kecil di pintu taman kami"*).
3. **Story (Musim-Musim Kami / 4 Babak Perjalanan)**:
   * Musim 1: Judul (*"Pot yang Tertukar"*), Waktu (*"Maret 2019"*), Cerita, Foto.
   * Musim 2: Judul (*"Tumbuh Diam-Diam"*), Waktu (*"Agustus 2020"*), Cerita, Foto.
   * Musim 3: Judul (*"Kuncup di Bawah Hujan"*), Waktu (*"Desember 2025"*), Cerita, Foto.
   * Musim 4: Judul (*"Musim Mekar"*), Waktu (*"Musim ini"*), Cerita, Foto.
4. **Bunga Pilihan & Makna (Fitur Khusus Tema Bunga)**:
   * Bunga Pilihan Wanita untuk Pria: Nama Bunga (*"Bunga Matahari"*), Arti (*"Karena kamu selalu jadi arah aku menoleh..."*), Warna (*"#E5A93C"*).
   * Bunga Pilihan Pria untuk Wanita: Nama Bunga (*"Melati"*), Arti (*"Sederhana, harum, dan setia..."*), Warna (*"#FFFFFF"*).
   * Bunga Pilihan Berdua: Nama Bunga (*"Mawar Merah Muda"*), Arti (*"Untuk rasa syukur dan kelembutan..."*), Warna (*"#E8829B"*).
5. **Dresscode (Palet Hari Itu)**:
   * Keterangan Busana (*"Kami ingin taman kami dipenuhi warna yang senada..."*).
   * 5 Warna Busana (Color Picker interaktif untuk swatch `#swatch-1` s/d `#swatch-5`).
6. **Surat Rahasia di Bawah Batu**:
   * Isi Surat Rahasia (*"Kalau kamu menemukan surat ini, berarti kamu tamu yang teliti..."*).
   * Penutup Surat Rahasia (*"Dengan hangat, Nurizzati Islamiyah & Badriana"*).
7. **Gifts, RSVP, Closing & Tagar**:
   * Keterangan Hadiah (*"Doa restumu adalah bunga terindah di taman kami..."*).
   * Catatan RSVP (*"Mohon kabari kami paling lambat dua minggu sebelum hari bahagia, ya."*).
   * Pesan Penutup (*"Terima kasih telah berjalan bersama kami menyusuri taman ini..."*).
   * Tagar Pernikahan (*"#TamanNurizzatiBadriana"*).

---

### C. Template D — Tumbuh Bersama [✅ SELESAI]
Konsep: Kehutanan, bibit pohon, inoskulasi pertemuan pertama, lingkar tahun, daun gugur musiman, petunjuk kebun, dan pohon harapan nanti.
1. **Couple**: Silsilah anak (`keteranganAnakWanita`, `keteranganAnakPria`), Tanah Asal (`kotaAsalWanita`, `kotaAsalPria`, `sifatTanahWanita`, `sifatTanahPria`), Momen tumbuh paling subur (`suburSaatWanita`, `suburSaatPria`).
2. **Hero & Cover**: Tulisan pada paket benih (`tulisanPaketBenih`), kalimat utama hero (`heroHeadline`), salam pembuka (`salamPembuka`), kata pengantar (`kataPengantar`), kutipan ayat (`kutipanAyat`) & sumber (`sumberKutipan`).
3. **Inoskulasi (Penyatuan Dua Pohon)**: Tanggal & tempat pertama bertemu (`tglPertamaBertemu`, `tempatPertamaBertemu`), cerita sentuhan pertama (`ceritaSentuhanPertama`), kalimat dua pohon menyatu (`kalimatDuaPohonMenyatu`).
4. **Kisah 4 Musim**: Musim Semi (tunas), Musim Panas (rimbun), Musim Gugur (melepas), Musim Dingin (mengakar) lengkap dengan judul, waktu, narasi, dan foto. Serta keterangan galeri herbarium (`keteranganGaleri`).
5. **Fitur Daun Gugur (6 Pasang Interaktif)**: Yang dilepaskan vs Yang tumbuh sebagai gantinya (`daunGugur`).
6. **Lingkaran Tahun Pohon (5 Fase)**: Tahun & Catatan pertumbuhan pohon (`lingkaranTahun`).
7. **Dresscode (5 Warna Alam)**: Panduan busana (`dresscodeText`) & 5 swatch warna daun (`dresscodeColors`).
8. **Petunjuk Kebun (6 Aturan Kebun)**: Waktu tanam, jarak tanam, kawan tanam, sinar matahari, penyiraman, hama yang dihindari (`petunjukKebun`).
9. **Pohon Harapan Nanti (4 Tahap)**: Harapan tahun ke-1, ke-5, ke-25, dan ke-50 (`harapanNanti`).
10. **Hadiah, RSVP, Kebun Doa & Penutup**: Catatan tanda kasih (`catatanHadiah`), catatan RSVP (`catatanRsvp`), keterangan kebun doa (`keteranganUcapan`), kalimat penutup (`kalimatPenutup`), salam penutup (`salamPenutup`), nama keluarga (`namaKeluarga`), turut mengundang (`turutMengundang`), dan tagar pernikahan (`tagarPernikahan`).

---

### D. Template E — Meja Sang Koki [✅ SELESAI]
Konsep: Kuliner degustasi fine dining, menu musiman, resep cinta rumah tangga, dan uji rasa.
1. **Header & Menu**: Edisi menu & nomor meja, Kutipan kaldu, Catatan dari dapur.
2. **Couple (Bahan Baku Utama)**: Silsilah anak, catatan karakteristik dan peran bahan mempelai pria & wanita di dapur kehidupan.
3. **Menu Degustasi (4 Sajian)**: Amuse-Bouche, Pembuka, Utama, Penutup (Nama hidangan, padanan minuman & tahun, cerita, foto).
4. **Resep Rumah Tangga Bahagia (Interaktif Masuk Panci)**: Judul resep, takaran porsi, bahan-bahan (multi-line), dan instruksi cara memasak (multi-line).
5. **Uji Rasa Interaktif (4 Sajian Rasa Tamu)**: Manis (Klapertart Pengantin), Gurih (Sup Iga Restu), Pedas (Sambal Matah Nekat), Segar (Es Serbat Kemangi).
6. **Etiket Busana & Palet Piring**: 3 warna swatch busana piring & petunjuk berbusana.
7. **Kotak Tip, Reservasi Kursi & Penutup**: Catatan kotak tip dapur, catatan reservasi RSVP, pesan penutup koki, dan tagar pernikahan.

---

### E. Template A — Simple Modern [✅ SELESAI]
Konsep: Keanggunan kontemporer minimalis, tipografi bersih, perayaan esensial, palet dresscode elegan, dan kutipan suci penuh makna.
1. **Cover & Welcome Screen**: Judul selamat datang (`welcomeTitle`), prefix sapaan tamu (`guestGreetingPrefix`), label tombol buka (`openInvitationText`).
2. **Hero Header**: Subjudul hero (`heroSubtitle`), teks gulir panduan (`scrollDownText`).
3. **Mempelai & Salam (Couple)**: Lafaz salam Arab (`salamArab`), ucapan salam (`salamText`), kalimat pengantar mempelai (`pengantarMempelai`), silsilah anak pria (`keteranganAnakPria`) & wanita (`keteranganAnakWanita`), kartu kutipan suci / romantis (`ceritaKutipan`) & sumber kutipan (`ceritaSumber`).
4. **Waktu, Lokasi & Dresscode (Events)**: Judul momen bahagia (`judulMoment`), kalimat pengantar acara (`pengantarAcara`), label akad nikah (`labelAkad`), label resepsi (`labelResepsi`), catatan etiket pakaian (`dresscodeNote`), keterangan warna busana (`dresscodeText`), dan 3 swatch warna dresscode (`dresscodeColors`).
5. **Tanda Kasih (Love Gift)**: Judul seksi hadiah (`giftTitle`), kalimat pengantar tanda kasih (`giftSubtitle`).
6. **Ucapan & Doa (Wishes)**: Judul seksi doa restu tamu (`commentTitle`).
7. **Pesan Penutup & Tagar (Closing)**: Pesan terima kasih penutup (`closingMessage`), salam penutup (`closingSalam`), hamdalah (`closingHamdalah`), tagar pernikahan resmi (`tagarPernikahan`).

---

## 4. CHECKLIST EKSEKUSI INTEGRASI TEMPLATE D (TUMBUH BERSAMA)

- [x] **Fase 1: Tipe Data & Preset Template D (`lib/templatePresets.ts`)**
  - Definisikan interface `TumbuhBersamaContent` dengan 10 kelompok data lengkap sesuai `projek.mereka.md`.
  - Buat `DEFAULT_TUMBUH_BERSAMA` dengan nilai narasi default botani yang mendalam.
  - Tambahkan helper `getTumbuhBersamaContent(customContent)` dengan fallback otomatis.

- [x] **Fase 2: Form Editor Multi-Template di Dashboard (`TabCustomContent.tsx`)**
  - Tambahkan tombol navigasi switch template (Template D: Tumbuh Bersama, Template B: Taman Rahasia, Template C: Kirigami Pastel, Template E: Meja Sang Koki).
  - Bangun form 10 seksi modul lengkap berurutan untuk Template D:
    1. Profil & Tanah Asal (Silsilah, Kota Asal, Karakteristik Tanah, Waktu Subur)
    2. Cover & Hero (Paket Benih, Headline, Salam, Pengantar, Ayat & Sumber)
    3. Inoskulasi (Tanggal, Tempat, Cerita Sentuhan Pertama, Penyatuan Dua Pohon)
    4. Kisah 4 Musim & Galeri (Semi, Panas, Gugur, Dingin + Keterangan Galeri)
    5. Daun Gugur (6 Pasang Teks: Yang Dilepaskan vs Yang Tumbuh)
    6. Lingkaran Tahun Pohon (5 Fase Tahun & Catatan)
    7. Panduan Busana (Keterangan & 5 Swatch Warna Alam)
    8. Petunjuk Kebun (6 Aturan Praktis Tamu)
    9. Pohon Harapan Nanti (4 Tahap Harapan: Thn 1, 5, 25, 50)
    10. Tanda Kasih, RSVP, Penutup & Tagar

- [x] **Fase 3: Sinkronisasi Template D (`tumbuhBersamaHtml.ts`)**
  - Integrasikan `getTumbuhBersamaContent` ke dalam `getTumbuhBersamaHtml`.
  - Sinkronkan seluruh elemen DOM Template D:
    - Silsilah anak & silsilah orang tua di tanah asal (`#cp-bride-order`, `#cp-bride-parents`, dll.)
    - Tanah asal & sifat tanah (`#cp-bride-no-b`, `#cp-bride-town`, `#cp-bride-soil-v`, dll.)
    - Waktu tumbuh subur (`#cp-bride-grow-v`, `#cp-groom-grow-v`)
    - Paket benih & hero headline (`#packet-note`, `#hero-tagline`)
    - Salam, pengantar, ayat & sumber (`#salam-opening`, `#salam-intro`, `#salam-quote-text`, `#salam-quote-src`)
    - Inoskulasi (`#inos-met-date`, `#inos-since-n`, `#inos-cap-1-place`, `#inos-cap-1-p`, `#inos-cap-3-p`)
    - Kisah 4 musim (waktu & tanggal di `#st-1-date` s/d `#st-4-date`) & keterangan galeri (`#gallery-sh-s`)
    - 6 pasang daun gugur (`#gg-row-1` s/d `#gg-row-6`)
    - 5 lingkaran tahun (`#lk-note-1` s/d `#lk-note-5`, `#lk-met`, `#lk-wed`)
    - 5 warna swatch dresscode (`#dc-leaf-1` s/d `#dc-leaf-5`, `#dc-text`)
    - 6 petunjuk kebun (`#pj-label-1` s/d `#pj-label-6`, `#pj-text-1` s/d `#pj-text-6`)
    - 4 pohon harapan nanti (`#nt-hope-1` s/d `#nt-hope-4`)
    - Hadiah (`#gf-text`), RSVP (`#rs-sh-s`), Kebun Doa (`#ws-sh-s`), Penutup (`#cl-text`, `#cl-salam`, `#cl-family`, `#cl-turut-v`, `#cl-hashtag`)

- [x] **Fase 4: Verifikasi & Kompilasi**
  - Jalankan `npx tsc --noEmit` -> Lolos 100% tanpa error (exit code 0).

- [x] **Fase 5: Audit Menyeluruh & Pembersihan Data Dummy / Hardcoded**
  - Mengubah tanggal hero (`#hero-date`) yang semula kosong menjadi dinamis (`${resepsiDateFormatted || akadDateFormatted}`).
  - Mengubah atribut `alt` gambar mempelai pria dan wanita (`alt="Foto Badriana"` -> `alt="Foto ${groomFull}"` & `alt="Foto Nurizzati Islamiyah"` -> `alt="Foto ${brideFull}"`).
  - Mengubah atribut `alt` 4 babak sajian degustasi dan lightbox viewer menjadi dinamis (`${groom} dan ${bride}`).
  - Mengubah inisial avatar fallback mempelai dari hardcoded `"B"` dan `"K"` menjadi inisial nama mempelai secara dinamis (`${groom.charAt(0).toUpperCase() || 'P'}` dan `${bride.charAt(0).toUpperCase() || 'W'}`).
  - Mengubah iframe Google Maps (`#venue-map`) yang semula terkunci pada `place_id:ChIJVX_KZ1YABDQR8TZ6STtir8M` (mall wwwtc di Hong Kong) menjadi URL embed pencarian lokasi dinamis berbasis alamat venue resepsi / akad pengantin (`https://maps.google.com/maps?q=${mapQuery}&output=embed`).
  - Verifikasi TypeScript lulus tanpa error (`npx tsc --noEmit` exit code 0).

---

## 5. CHECKLIST EKSEKUSI INTEGRASI TEMPLATE E (MEJA SANG KOKI)

- [x] **Fase 1: Tipe Data & Preset Template E (`lib/templatePresets.ts`)**
  - Definisikan interface `MejaKokiContent` lengkap mencakup 7 seksi konten kuliner & degustasi.
  - Buat `DEFAULT_MEJA_KOKI` dengan teks narasi gastronomi inspiratif (kaldu cinta, 4 babak sajian berpadu minuman, resep rumah tangga takaran porsi, 4 rasa tamu, 3 palet piring, kotak tip).
  - Tambahkan helper `getMejaKokiContent(customContent)` dengan fallback otomatis.

- [x] **Fase 2: Form Editor Multi-Template di Dashboard (`TabCustomContent.tsx`)**
  - Tambahkan tombol navigasi switcher Template E: Meja Sang Koki (`activeTab === 'E'`) dengan icon kuliner (`fas fa-utensils`).
  - Bangun form 7 seksi modul terstruktur dari atas ke bawah:
    1. Edisi Menu & Dapur Cinta (Tajuk edisi menu, filosofi kaldu, catatan koki)
    2. Dua Bahan Baku Utama (Silsilah anak & catatan peran bahan mempelai pria dan wanita)
    3. Menu Degustasi 4 Babak (Amuse-Bouche, Pembuka, Utama, Penutup: Nama sajian, pairing minuman & tahun, kisah hidangan, foto sajian)
    4. Resep Rumah Tangga Bahagia (Judul resep, takaran porsi, textarea daftar bahan per baris, textarea cara memasak per baris)
    5. Uji Rasa Tamu (4 Rasa: Manis, Gurih, Pedas, Segar lengkap dengan nama hidangan & catatan personal tamu)
    6. Etiket Busana & Palet Piring (Deskripsi busana & 3 color picker palet serasi piring jamuan)
    7. Kotak Tip Dapur, Reservasi Kursi & Penutup (Catatan kotak tip bumbu dapur, catatan reservasi kursi RSVP, salam penutup koki, tagar pernikahan)
  - Hubungkan state `kokiForm` ke penyimpanan universal `PUT /api/user/custom-content` (`templateCode: 'E'`).

- [x] **Fase 3: Sinkronisasi Template E (`mejaKokiHtml.ts`)**
  - Integrasikan `getMejaKokiContent` ke dalam `getMejaKokiHtml`.
  - Sinkronkan seluruh elemen DOM Template E:
    - Edisi Menu & Hero Kicker (`#hero-kicker`)
    - Kutipan Pembuka / Filosofi Kaldu (`#hero-quote`)
    - Catatan dari Dapur Mempelai (`#chef-note`)
    - Karakteristik Bahan Pria & Wanita (`#ing-note-groom`, `#ing-note-bride`)
    - Silsilah Orang Tua Mempelai di kartu balik (`#ing-parents-lb-groom`, `#ing-parents-lb-bride`)
    - 4 Babak Menu Degustasi: Judul, Padanan Minuman & Tahun (`#course-pairing-1` s/d `4`), Kisah, dan Foto
    - Resep Rumah Tangga: Judul resep (`#resep-title`), Porsi (`#resep-yield`), Render dinamis daftar bahan (`#resep-ing-list`), Penghitung total bahan masuk panci (`#resep-total`), Langkah cara memasak (`#resep-step-list`)
    - Etiket Busana & Swatch Warna: 3 Swatch Warna (`#dc-chip-1` s/d `3`), Deskripsi busana tamu (`#dc-text`)
    - Uji Rasa Tamu: Data hidangan & catatan 4 rasa (`#cicip-data-manis`, `#cicip-data-gurih`, `#cicip-data-pedas`, `#cicip-data-segar`)
    - Kotak Tip Dapur (`#gift-note`), Catatan Kursi RSVP (`#rsvp-seat-note`), Pesan Penutup Koki (`#closing-msg`), Tagar Pernikahan (`#closing-hashtag`)

- [x] **Fase 4: Verifikasi & Kompilasi**
  - Jalankan `npx tsc --noEmit` -> Lolos 100% tanpa error (exit code 0).

- [x] **Fase 5: Audit Menyeluruh & Pembersihan Data Dummy / Hardcoded**
  - Mengubah tanggal hero (`#hero-date`) yang semula kosong menjadi dinamis (`${resepsiDateFormatted || akadDateFormatted}`).
  - Mengubah atribut `alt` gambar mempelai pria dan wanita (`alt="Foto Badriana"` -> `alt="Foto ${groomFull}"` & `alt="Foto Nurizzati Islamiyah"` -> `alt="Foto ${brideFull}"`).
  - Mengubah atribut `alt` 4 babak sajian degustasi dan lightbox viewer menjadi dinamis (`${groom} dan ${bride}`).
  - Mengubah inisial avatar fallback mempelai dari hardcoded `"B"` dan `"K"` menjadi inisial nama mempelai secara dinamis (`${groom.charAt(0).toUpperCase() || 'P'}` dan `${bride.charAt(0).toUpperCase() || 'W'}`).
  - Mengubah iframe Google Maps (`#venue-map`) yang semula terkunci pada `place_id:ChIJVX_KZ1YABDQR8TZ6STtir8M` (mall wwwtc di Hong Kong) menjadi URL embed pencarian lokasi dinamis berbasis alamat venue resepsi / akad pengantin (`https://maps.google.com/maps?q=${mapQuery}&output=embed`).
  - Verifikasi TypeScript lulus tanpa error (`npx tsc --noEmit` exit code 0).

---

## 6. CHECKLIST EKSEKUSI INTEGRASI TEMPLATE A (SIMPLE MODERN)

- [x] **Fase 1: Tipe Data & Preset Template A (`lib/templatePresets.ts`)**
  - Definisikan interface `SimpleModernContent` mencakup 7 kelompok data konten modern kontemporer.
  - Buat `DEFAULT_SIMPLE_MODERN` dengan teks narasi inspiratif default (salam Arab, Ar-Rum 21, etiket 3 warna dresscode, kado kasih, ucapan selamat, dan doa syukur penutup).
  - Tambahkan helper `getSimpleModernContent(customContent)` dengan fallback otomatis bila data belum dikustomisasi.

- [x] **Fase 2: Form Editor Multi-Template di Dashboard (`TabCustomContent.tsx`)**
  - Tambahkan tab navigasi switcher `Template A: Simple Modern` (`activeTab === 'A'`) lengkap dengan icon `fas fa-gem`.
  - Bangun form 7 seksi modul terstruktur:
    1. Seksi Pembuka & Hero Cover (Judul Selamat Datang, Prefix Sapaan Tamu, Teks Tombol Buka Undangan, Subjudul Hero, Teks Gulir)
    2. Seksi Mempelai, Salam & Silsilah (Salam Arab, Ucapan Salam, Pengantar Mempelai, Keterangan Anak Pria & Wanita)
    3. Kutipan Suci & Mutiara Cinta (Isi Kutipan Ayat/Mutiara, Sumber Kutipan)
    4. Rangkaian Waktu, Acara & Dresscode (Judul Momen, Pengantar Acara, Label Akad & Resepsi, Catatan Dresscode, Keterangan Busana, 3 Color Picker Interaktif)
    5. Tanda Kasih & Amplop Digital (Judul Tanda Kasih, Pengantar Hadiah)
    6. Seksi Ucapan, Doa & Buku Tamu (Judul Seksi Ucapan & Doa)
    7. Pesan Terima Kasih, Hamdalah & Tagar (Pesan Penutup, Salam Penutup, Hamdalah Penutup, Tagar Pernikahan Resmi)
  - Hubungkan penyimpanan form ke endpoint API `PUT /api/user/custom-content` (`templateCode: 'A'`).

- [x] **Fase 3: Sinkronisasi Komponen Template A (`components/templateA-simple-modern/*`)**
  - `WelcomePage.tsx`: Dinamiskan judul cover, prefix tamu, dan tombol buka undangan via `aContent`.
  - `HomePage.tsx`: Dinamiskan hero subtitle dan scroll down prompt via `aContent`.
  - `BrideSection.tsx`: Dinamiskan salam Arab, ucapan salam, kalimat pengantar, silsilah mempelai, dan render kartu kutipan suci / romantis (`ceritaKutipan` & `ceritaSumber`).
  - `WeddingDateSection.tsx`: Dinamiskan judul momen, pengantar acara, label akad, label resepsi, dresscode note & text, serta 3 swatch warna dresscode interaktif.
  - `LoveGiftSection.tsx`: Dinamiskan judul tanda kasih dan kalimat pengantar tanda kasih.
  - `CommentSection.tsx`: Dinamiskan judul ucapan & doa buku tamu.
  - `Footer.tsx`: Dinamiskan pesan terima kasih penutup, salam, hamdalah, dan tagar pernikahan resmi.
  - `SimpleModern.tsx`: Teruskan `payload` ke seluruh komponen dan dinamiskan `<title>` halaman.

- [x] **Fase 4: Verifikasi & Kompilasi**
  - Perbarui interface `ITemplateWeding` di `prisma/schema.types.ts` dengan properti `customContent?: Record<string, any> | null`.
  - Bersihkan form duplikat di `TabCustomContent.tsx`.
  - Uji kelulusan TypeScript: `npx tsc --noEmit` -> Lolos 100% tanpa error (exit code 0).

- [x] **Fase 5: Audit Menyeluruh & Pembersihan Data Dummy / Hardcoded**
  - Mengubah fallback cover dari path yang tidak ada (`/default-wedding.jpg`) menjadi asset valid (`/assets/images/bg.webp`).
  - Mengubah jam resepsi menjadi rentang waktu dinamis (`jamResepsi` s/d `jamSelesai`).
  - Menampilkan lokasi dan alamat akad (`lokasiAkad` & `alamatAkad`) serta resepsi (`lokasiResepsi` & `alamatGedungPernikahan`).
  - Membersihkan credit link github/license open-source pada footer dan mendinamiskan info musik pilihan.
  - Memastikan nama penerima amplop digital fleksibel untuk mempelai pria maupun wanita.
  - Verifikasi TypeScript lulus tanpa error (`npx tsc --noEmit` exit code 0).
