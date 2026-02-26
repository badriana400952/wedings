# Panduan Penggunaan Undangan Pernikahan Digital

## 🎉 Selamat! Undangan Pernikahan Digital Anda Sudah Siap

---

## 📱 Akses Undangan

### URL Undangan
- **Halaman Utama**: `https://your-domain.vercel.app`
- **Dashboard Admin**: `https://your-domain.vercel.app/dashboard`
- **Login Admin**: `https://your-domain.vercel.app/login`

---

## 🔐 Akun Admin Default

### Kredensial Login
```
Email: admin@undangan.com
Password: admin123
```

⚠️ **PENTING**: Segera ganti password setelah login pertama kali!

---

## 🎯 Fitur-Fitur Undangan

### 1. Halaman Utama (Guest View)
- ✅ Animasi confetti saat buka undangan
- ✅ Countdown timer ke hari pernikahan
- ✅ Informasi mempelai (foto & nama)
- ✅ Detail acara (Akad & Resepsi)
- ✅ Galeri foto
- ✅ Google Maps lokasi
- ✅ Save to Google Calendar
- ✅ Form ucapan & doa
- ✅ Informasi transfer (Love Gift)
- ✅ Musik background
- ✅ Dark mode / Light mode
- ✅ Responsive (mobile & desktop)

### 2. Dashboard Admin
- ✅ Lihat semua ucapan & doa dari tamu
- ✅ Hapus ucapan yang tidak sesuai
- ✅ Statistik total ucapan
- ✅ Logout

---

## 📝 Cara Menggunakan Dashboard

### Login ke Dashboard
1. Buka `https://your-domain.vercel.app/login`
2. Masukkan email: `admin@undangan.com`
3. Masukkan password: `admin123`
4. Klik "Login"

### Mengelola Ucapan
1. Setelah login, Anda akan masuk ke dashboard
2. Lihat semua ucapan dari tamu undangan
3. Klik tombol "Delete" untuk menghapus ucapan yang tidak sesuai
4. Ucapan akan langsung terhapus dari database

### Logout
- Klik tombol "Logout" di pojok kanan atas dashboard

---

## 🎨 Cara Mengganti Konten Undangan

### Mengganti Foto
1. Foto-foto ada di folder: `public/assets/images/`
2. Ganti file dengan nama yang sama:
   - `a1.jpeg` - Background home
   - `a2.jpeg` - Foto utama home
   - `a7.jpeg` - Foto welcome page
   - `a8.jpeg` - Foto mempelai pria
   - `cewe.webp` - Foto mempelai wanita
   - `a3.jpeg` sampai `a9.jpeg` - Galeri foto

### Mengganti Nama Mempelai
Edit file: `components/HomePage.tsx`
```tsx
<h2>Abdul Mujadid & Lorem ipsum</h2>
```

Edit file: `components/WelcomePage.tsx`
```tsx
<h2>Abdulloh mujaddid <br /> & <br />Ati sunarti</h2>
```

Edit file: `components/BrideSection.tsx`
```tsx
// Ganti nama, Instagram, dan deskripsi mempelai
```

### Mengganti Tanggal & Waktu
Edit file: `components/WeddingDateSection.tsx`
```tsx
const weddingDate = new Date('2026-05-31T09:00:00').getTime();
```

### Mengganti Lokasi
Edit file: `components/WeddingDateSection.tsx`
```tsx
<a href="https://goo.gl/maps/ALZR6FJZU3kxVwN86">
```
Ganti dengan link Google Maps lokasi Anda

### Mengganti Musik
1. Upload file musik ke `public/assets/music/music.mp3`
2. Atau gunakan Cloudinary (sudah terintegrasi)

### Mengganti Informasi Transfer
Edit file: `components/LoveGiftSection.tsx`
```tsx
// Ganti nomor rekening dan nama bank
```

---

## 🚀 Deploy ke Vercel

### Langkah Deploy
1. Push code ke GitHub repository
2. Login ke [Vercel](https://vercel.com)
3. Import repository dari GitHub
4. Tambahkan Environment Variables:
   ```
   DATABASE_URL=your_database_url
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```
5. Klik "Deploy"

### Environment Variables
Pastikan sudah set di Vercel:
- `DATABASE_URL` - Connection string database PostgreSQL
- `NEXTAUTH_SECRET` - Secret key untuk NextAuth (generate random string)
- `NEXTAUTH_URL` - URL production Anda

---

## 🗄️ Database Setup

### Menggunakan Vercel Postgres
1. Di dashboard Vercel, pilih project Anda
2. Klik tab "Storage"
3. Create "Postgres Database"
4. Copy connection string ke `DATABASE_URL`

### Migrasi Database
Jalankan command ini setelah setup database:
```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## 🔧 Maintenance & Update

### Mengganti Password Admin
1. Jalankan script: `npm run create-admin`
2. Atau edit langsung di database tabel `User`

### Update Konten
1. Edit file component yang sesuai
2. Push ke GitHub
3. Vercel akan auto-deploy

### Backup Database
- Export data dari Vercel Postgres dashboard
- Atau gunakan command: `pg_dump`

---

## 📞 Support & Troubleshooting

### Masalah Umum

**1. Tidak bisa login dashboard**
- Pastikan sudah run `npx prisma db seed`
- Cek environment variables sudah benar
- Cek database connection

**2. Gambar tidak muncul**
- Pastikan file ada di folder `public/assets/images/`
- Cek nama file sesuai dengan yang di code

**3. Musik tidak play**
- Cek file musik ada di `public/assets/music/music.mp3`
- Atau pastikan Cloudinary URL benar

**4. Dark mode tidak jalan**
- Clear browser cache
- Hard refresh (Ctrl + Shift + R)

---

## 📦 File Penting

```
├── components/           # Komponen React
│   ├── HomePage.tsx     # Halaman utama
│   ├── WelcomePage.tsx  # Halaman welcome
│   ├── BrideSection.tsx # Info mempelai
│   ├── WeddingDateSection.tsx # Tanggal & countdown
│   ├── GallerySection.tsx # Galeri foto
│   ├── CommentSection.tsx # Ucapan & doa
│   └── LoveGiftSection.tsx # Info transfer
├── pages/
│   ├── index.tsx        # Entry point
│   ├── login.tsx        # Halaman login
│   ├── dashboard.tsx    # Dashboard admin
│   └── api/             # API routes
├── public/assets/       # Foto, musik, video
├── prisma/
│   └── schema.prisma    # Database schema
└── .env                 # Environment variables
```

---

## ✅ Checklist Sebelum Serah Terima

- [ ] Ganti semua foto dengan foto customer
- [ ] Update nama mempelai di semua halaman
- [ ] Update tanggal & waktu acara
- [ ] Update lokasi & Google Maps link
- [ ] Update informasi transfer/rekening
- [ ] Update musik background
- [ ] Test login dashboard
- [ ] Test semua fitur (ucapan, like, delete)
- [ ] Test dark mode
- [ ] Test responsive mobile
- [ ] Deploy ke Vercel
- [ ] Setup database production
- [ ] Test production URL
- [ ] Berikan kredensial login ke customer

---

## 🎁 Bonus Features

- ✨ Animasi AOS (Animate On Scroll)
- 🎊 Confetti effect saat buka undangan
- 🌙 Dark mode toggle
- 🎵 Audio player dengan lazy loading
- 📱 Fully responsive
- ⚡ Optimized images dengan Next.js Image
- 🔒 Protected dashboard dengan NextAuth
- 💾 Database dengan Prisma ORM

---

## 📄 Lisensi & Credits

- **Original Template**: [Dewanakl](https://github.com/dewanakl/undangan)
- **Migration to Next.js**: [Badriana400952](https://github.com/badriana400952)
- **Music**: Pure Love by Oleksii Kaplunskyi (Pixabay)

---

**Terima kasih telah menggunakan undangan digital ini! 🎉💒**

Semoga acara pernikahan berjalan lancar dan bahagia selalu! 💑
