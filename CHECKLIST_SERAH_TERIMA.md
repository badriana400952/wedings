# ✅ Checklist Serah Terima ke Customer

## 📋 Persiapan Sebelum Serah Terima

### 1. Konten & Data Customer
- [ ] Dapatkan semua foto dari customer (minimal 9 foto untuk galeri)
- [ ] Nama lengkap mempelai pria & wanita
- [ ] Username Instagram mempelai (opsional)
- [ ] Tanggal & waktu acara (Akad & Resepsi)
- [ ] Alamat lengkap lokasi acara
- [ ] Link Google Maps lokasi
- [ ] Nomor rekening untuk Love Gift (Bank, Nama, Nomor)
- [ ] File musik yang diinginkan (atau gunakan default)

### 2. Update Konten
- [ ] Ganti semua foto di `public/assets/images/`
- [ ] Update nama di `HomePage.tsx`
- [ ] Update nama di `WelcomePage.tsx`
- [ ] Update nama & Instagram di `BrideSection.tsx`
- [ ] Update tanggal di `WeddingDateSection.tsx`
- [ ] Update lokasi & Google Maps di `WeddingDateSection.tsx`
- [ ] Update Google Calendar link di `HomePage.tsx`
- [ ] Update info rekening di `LoveGiftSection.tsx`
- [ ] Upload musik customer (jika ada)

### 3. Testing Lokal
- [ ] Test halaman utama
- [ ] Test welcome page & confetti effect
- [ ] Test countdown timer
- [ ] Test dark mode toggle
- [ ] Test audio player (play/pause)
- [ ] Test form ucapan & doa
- [ ] Test like button
- [ ] Test Google Maps link
- [ ] Test Google Calendar link
- [ ] Test responsive mobile view
- [ ] Test login dashboard
- [ ] Test delete ucapan di dashboard
- [ ] Test logout

---

## 🚀 Deploy Production

### 4. Setup Vercel
- [ ] Push code ke GitHub repository
- [ ] Login ke Vercel
- [ ] Import repository
- [ ] Setup custom domain (jika ada)

### 5. Setup Database
- [ ] Create Vercel Postgres database
- [ ] Copy `DATABASE_URL` connection string
- [ ] Generate `NEXTAUTH_SECRET` (gunakan: `openssl rand -base64 32`)
- [ ] Set environment variables di Vercel:
  ```
  DATABASE_URL=postgresql://...
  NEXTAUTH_SECRET=random_secret_key
  NEXTAUTH_URL=https://your-domain.vercel.app
  ```

### 6. Migrasi Database
- [ ] Run: `npx prisma migrate deploy`
- [ ] Run: `npx prisma db seed` (untuk create admin user)
- [ ] Verify admin user created di database

### 7. Testing Production
- [ ] Test URL production bisa diakses
- [ ] Test semua fitur di production
- [ ] Test login dashboard di production
- [ ] Test submit ucapan di production
- [ ] Test delete ucapan di production
- [ ] Test di berbagai device (mobile, tablet, desktop)
- [ ] Test di berbagai browser (Chrome, Safari, Firefox)

---

## 📦 Yang Diserahkan ke Customer

### 8. Akses & Kredensial
Berikan informasi berikut ke customer:

```
===========================================
UNDANGAN PERNIKAHAN DIGITAL
===========================================

📱 URL UNDANGAN
https://your-domain.vercel.app

🔐 AKSES DASHBOARD
URL: https://your-domain.vercel.app/login
Email: admin@undangan.com
Password: admin123

⚠️ PENTING: Ganti password setelah login pertama!

===========================================
```

### 9. Dokumentasi
- [ ] Berikan file `PANDUAN_CUSTOMER.md`
- [ ] Jelaskan cara akses dashboard
- [ ] Jelaskan cara mengelola ucapan
- [ ] Jelaskan cara logout
- [ ] Berikan contact support (jika ada)

### 10. Repository Access (Opsional)
- [ ] Invite customer ke GitHub repository (jika mereka mau akses code)
- [ ] Atau berikan ZIP file source code

---

## 🎯 Demo ke Customer

### 11. Walkthrough Fitur
Tunjukkan ke customer:
- [ ] Cara buka undangan (welcome page + confetti)
- [ ] Fitur dark mode
- [ ] Fitur audio player
- [ ] Countdown timer
- [ ] Galeri foto (klik untuk zoom)
- [ ] Form ucapan & doa
- [ ] Like button
- [ ] Google Maps link
- [ ] Save to Google Calendar
- [ ] Info Love Gift

### 12. Demo Dashboard
- [ ] Cara login ke dashboard
- [ ] Cara lihat semua ucapan
- [ ] Cara delete ucapan
- [ ] Cara logout
- [ ] Cara ganti password (jika sudah implement)

---

## 📞 Support & Maintenance

### 13. Informasi Support
Beritahu customer tentang:
- [ ] Cara contact Anda jika ada masalah
- [ ] Garansi/support period (jika ada)
- [ ] Biaya maintenance (jika ada)
- [ ] Update konten (apakah customer bisa update sendiri atau harus minta Anda)

### 14. Backup & Security
- [ ] Jelaskan pentingnya backup database
- [ ] Jelaskan cara ganti password admin
- [ ] Jelaskan cara create admin baru (jika perlu)

---

## 💰 Pembayaran & Serah Terima

### 15. Finalisasi
- [ ] Konfirmasi semua fitur sudah sesuai
- [ ] Konfirmasi customer puas dengan hasil
- [ ] Proses pembayaran (jika belum lunas)
- [ ] Serah terima akses & dokumentasi
- [ ] Minta testimonial (opsional)

---

## 📝 Template Email Serah Terima

```
Subject: Serah Terima Undangan Pernikahan Digital

Halo [Nama Customer],

Undangan pernikahan digital Anda sudah selesai dan siap digunakan! 🎉

📱 AKSES UNDANGAN
URL: https://your-domain.vercel.app

🔐 DASHBOARD ADMIN
Login: https://your-domain.vercel.app/login
Email: admin@undangan.com
Password: admin123

⚠️ Mohon segera ganti password setelah login pertama!

📄 PANDUAN LENGKAP
Saya sudah sertakan file PANDUAN_CUSTOMER.md yang berisi:
- Cara menggunakan dashboard
- Cara mengelola ucapan tamu
- Troubleshooting masalah umum
- Dan informasi penting lainnya

✨ FITUR YANG SUDAH AKTIF
✅ Animasi confetti saat buka undangan
✅ Countdown timer
✅ Dark mode
✅ Audio player
✅ Form ucapan & doa
✅ Google Maps & Calendar
✅ Dashboard admin
✅ Dan masih banyak lagi!

📞 SUPPORT
Jika ada pertanyaan atau masalah, silakan hubungi saya:
- WhatsApp: [nomor Anda]
- Email: [email Anda]

Terima kasih dan semoga acara pernikahannya lancar! 💑

Salam,
[Nama Anda]
```

---

## ✅ Final Check

Sebelum kirim ke customer, pastikan:
- [ ] Semua checklist di atas sudah ✅
- [ ] Production URL sudah tested
- [ ] Dashboard login berfungsi
- [ ] Dokumentasi sudah lengkap
- [ ] Customer sudah dapat semua akses
- [ ] Customer sudah paham cara pakai

---

**Good luck dengan serah terima! 🚀**
