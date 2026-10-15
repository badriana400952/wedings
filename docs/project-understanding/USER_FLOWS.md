# 🚶 USER FLOWS — PEMETAAN ALUR PENGGUNA END-TO-END

Dokumen ini memetakan alur interaksi pengguna dari awal hingga akhir, mencakup antarmuka tamu (*Guest View*) dan antarmuka pengantin (*Admin Dashboard*).

---

## 1. Alur Tamu: Membuka Undangan & Melepas Sampul (Invitation Open Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Tamu as Tamu Undangan
    participant Browser as Browser Client
    participant Storage as sessionStorage
    participant SSR as getServerSideProps (Next.js)
    participant DOM as Document DOM

    Tamu->>Browser: Klik tautan /badriana/to/Budi+Santoso
    Browser->>SSR: GET Request dengan Slug & Parameter Tamu
    SSR-->>Browser: Return HTML Hasil SSR + Initial State
    Browser->>Storage: Cek key 'invitation_opened_badriana'
    
    alt Status Sudah Terbuka (Reload / Pindah Tab)
        Storage-->>Browser: Nilai 'true'
        Browser->>DOM: Hilangkan class '.is-locked', sembunyikan #sec-cover
        Browser->>Tamu: Tampilkan langsung beranda / konten utama
    else Status Belum Terbuka (Kunjungan Pertama)
        Storage-->>Browser: Nilai null / 'false'
        Browser->>DOM: Berikan class 'body.is-locked', tampilkan cover
        Browser->>Tamu: Tampilkan amplop sambutan & nama "Budi Santoso"
        Tamu->>Browser: Klik tombol "Buka Undangan" / "Sobek & Tanam"
        Browser->>Browser: Putar audio tear-paper.mp3 & mulai musik latar
        Browser->>DOM: Tambah class '.is-open' / '.is-gone' pada cover
        Browser->>DOM: Hapus class 'body.is-locked'
        Browser->>Storage: Set 'invitation_opened_badriana' = 'true'
        Browser->>Tamu: Transisi mulus (smooth scroll) menuju beranda undangan
    end
```

---

## 2. Alur Tamu: Konfirmasi Kehadiran Tamu (RSVP Flow)

```mermaid
flowchart TD
    START([Tamu Scroll ke Section RSVP]) --> INPUT_NAME[Input Nama Tamu\nAuto-fill dari URL jika ada]
    INPUT_NAME --> CHOOSE_STATUS{Pilih Kehadiran}
    
    CHOOSE_STATUS -->|Hadir| OPT_HADIR[Pilih Jumlah Tamu / Pax\n1 s.d. 5 Orang]
    CHOOSE_STATUS -->|Berhalangan| OPT_ABSENT[Set Pax = 0]
    CHOOSE_STATUS -->|Masih Ragu| OPT_MAYBE[Set Pax = 0]
    
    OPT_HADIR --> INPUT_NOTES[Tulis Pesan / Catatan Konfirmasi]
    OPT_ABSENT --> INPUT_NOTES
    OPT_MAYBE --> INPUT_NOTES
    
    INPUT_NOTES --> SUBMIT_BTN[Klik Tombol Kirim Kehadiran]
    SUBMIT_BTN --> JS_HANDLER[JavaScript menangkap event click\n(Mencegah default form refresh)]
    JS_HANDLER --> API_POST[POST /api/comments\nPayload: name, presence, comment: '[RSVP] ...', kind: 'rsvp']
    
    API_POST --> DB_SAVE[(Simpan di Tabel comments)]
    DB_SAVE --> API_RESP[Kembalikan Status 201 Created]
    
    API_RESP --> ANIMATION[Picukan Animasi Mekar / Sukses\n(Sound seed & bloom di Template D)]
    ANIMATION --> INJECT_DOM[Sisipkan Kartu RSVP ke Feed Tamu\nPerbarui Widget Statistik Kehadiran]
    INJECT_DOM --> SHOW_EDIT_BTN[Tampilkan Tombol 'Ubah Jawaban'\nJika Tamu Ingin Mengoreksi]
    SHOW_EDIT_BTN --> END([Selesai])
```

---

## 3. Alur Tamu: Mengirimkan Ucapan & Doa Restu (Pohon Harapan / Kebun Doa)

```mermaid
sequenceDiagram
    autonumber
    actor Tamu as Tamu Undangan
    participant UI as Komponen Template (DOM)
    participant API as /api/ucapan (POST)
    participant DB as PostgreSQL (ucapan_harapan)

    Tamu->>UI: Scroll ke bagian Kebun Doa / Pohon Harapan
    Tamu->>UI: Masukkan nama pengirim & teks untaian doa
    Tamu->>UI: Klik tombol "Kirim Doa Restu" (type="button")
    UI->>UI: Validasi string non-empty & panjang teks
    UI->>API: POST /api/ucapan { name, ucapan, templateWedingId }
    API->>DB: INSERT INTO ucapan_harapan (name, ucapan, ip, ...)
    DB-->>API: Row ucapan berhasil dibuat
    API-->>UI: HTTP 200 { success: true, ucapan: { id, name, ... } }
    UI->>UI: Buat elemen kartu bunga/daun baru (.ws-card)
    UI->>UI: Sisipkan di posisi teratas container feed (#ws-bed)
    UI->>UI: Kosongkan textarea doa dan tampilkan notifikasi tersimpan
    UI-->>Tamu: Kartu doa langsung muncul seketika di layar!
```

---

## 4. Alur Tamu: Mengirimkan Hadiah & Transfer Bank (Love Gift Flow)

```mermaid
flowchart TD
    GIFT_VIEW([Tamu melihat section Hadiah / Transfer]) --> CHECK_ACTIVE{Apakah isGiftActive true?}
    CHECK_ACTIVE -->|False| HIDE_SECTION[Sembunyikan seluruh section Hadiah]
    CHECK_ACTIVE -->|True| SHOW_SECTION[Tampilkan Nomor Rekening Bank & QRIS]
    
    SHOW_SECTION --> TAMU_ACTION{Aksi yang Dipilih Tamu}
    
    TAMU_ACTION -->|Salin Rekening| COPY_CLICK[Klik tombol 'Salin Nomor Rekening']
    COPY_CLICK --> CLIPBOARD[Salin string noAtm ke clipboard perangkat]
    CLIPBOARD --> FEEDBACK[Ubah teks tombol menjadi '✓ Tersalin!']
    
    TAMU_ACTION -->|Scan QRIS| QRIS_VIEW[Scan foto QRIS dari layar / simpan gambar]
    
    TAMU_ACTION -->|Konfirmasi Transfer| WA_CLICK[Klik 'Konfirmasi via WhatsApp']
    WA_CLICK --> WA_REDIRECT[Buka aplikasi WhatsApp ke noHp mempelai\ndengan pesan format konfirmasi otomatis]
```

---

## 5. Alur Pengantin: Manajemen Undangan di Admin Dashboard

```mermaid
flowchart TD
    ADMIN_START([Pengantin Membuka /login]) --> SUBMIT_LOGIN[Input Email & Password]
    SUBMIT_LOGIN --> AUTH_CHECK{Verifikasi Kredensial NextAuth}
    AUTH_CHECK -->|Gagal| ERROR_MSG[Tampilkan pesan error 'Email/Password salah']
    AUTH_CHECK -->|Berhasil| REDIRECT_DASHBOARD[Masuk ke /dashboard]
    
    REDIRECT_DASHBOARD --> CHOOSE_TAB{Pilih Tab Navigasi}
    
    CHOOSE_TAB -->|Profil Mempelai| TAB_COUPLE[Edit nama, orang tua, foto profil Putra & Putri]
    CHOOSE_TAB -->|Jadwal Acara| TAB_EVENTS[Atur tanggal & jam Akad, Resepsi, Link Maps, Calendar]
    CHOOSE_TAB -->|Galeri Foto| TAB_GALLERY[Upload foto photoshoot baru ke Cloudinary / Hapus foto]
    CHOOSE_TAB -->|Gambar Bersama| TAB_STORY[Upload & atur 6 slot foto kenangan perjalanan cinta]
    CHOOSE_TAB -->|Musik Latar| TAB_MUSIC[Pilih lagu latar dari katalog musik]
    CHOOSE_TAB -->|Pilihan Template| TAB_TEMPLATE[Ganti tema visual: A, B, C, atau D]
    CHOOSE_TAB -->|Generator Tautan| TAB_LINKS[Generate link personal untuk daftar nama tamu]
    
    TAB_COUPLE --> SAVE_ACTION[Klik Simpan Perubahan]
    TAB_EVENTS --> SAVE_ACTION
    TAB_GALLERY --> SAVE_ACTION
    TAB_STORY --> SAVE_ACTION
    TAB_MUSIC --> SAVE_ACTION
    TAB_TEMPLATE --> SAVE_ACTION
    
    SAVE_ACTION --> BACKEND_UPDATE[Kirim request PUT ke API terkait]
    BACKEND_UPDATE --> TOAST_NOTIF[Tampilkan notifikasi berhasil disimpan]
    TOAST_NOTIF --> PREVIEW[Buka link tamu untuk meninjau perubahan live]
```
