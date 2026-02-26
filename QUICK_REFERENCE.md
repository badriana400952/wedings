# 🚀 Quick Reference - Undangan Digital

## 🔗 URLs Penting

| Halaman | URL | Akses |
|---------|-----|-------|
| Undangan | `https://your-domain.vercel.app` | Public |
| Login | `https://your-domain.vercel.app/login` | Admin only |
| Dashboard | `https://your-domain.vercel.app/dashboard` | Admin only |

## 🔐 Default Credentials

```
Email: admin@undangan.com
Password: admin123
```

## 📁 File Struktur Penting

```
├── components/
│   ├── HomePage.tsx              # Nama, tanggal, Google Calendar
│   ├── WelcomePage.tsx           # Nama di welcome page
│   ├── BrideSection.tsx          # Info mempelai + Instagram
│   ├── WeddingDateSection.tsx    # Tanggal, waktu, lokasi, Maps
│   ├── LoveGiftSection.tsx       # Info rekening transfer
│   ├── GallerySection.tsx        # Galeri foto
│   └── CommentSection.tsx        # Form ucapan
│
├── public/assets/images/
│   ├── a1.jpeg                   # Background home
│   ├── a2.jpeg                   # Foto utama home
│   ├── a7.jpeg                   # Foto welcome page
│   ├── a8.jpeg                   # Foto mempelai pria
│   ├── cewe.webp                 # Foto mempelai wanita
│   └── a3-a9.jpeg                # Galeri foto
│
└── public/assets/music/
    └── music.mp3                 # Musik background
```

## ⚙️ Environment Variables (Vercel)

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=random_secret_key
NEXTAUTH_URL=https://your-domain.vercel.app
```

Generate secret:
```bash
openssl rand -base64 32
```

## 🗄️ Database Commands

```bash
# Migrasi database
npx prisma migrate deploy

# Seed admin user
npx prisma db seed

# Create admin manual
npm run create-admin

# Open Prisma Studio
npx prisma studio
```

## 🎨 Update Konten Cepat

### Nama Mempelai
- `components/HomePage.tsx` → line ~35
- `components/WelcomePage.tsx` → line ~25
- `components/BrideSection.tsx` → line ~15 & ~35

### Tanggal Acara
- `components/WeddingDateSection.tsx` → line ~10
- `components/HomePage.tsx` → line ~40 (Google Calendar)

### Lokasi
- `components/WeddingDateSection.tsx` → line ~60 (Google Maps)
- `components/HomePage.tsx` → line ~40 (Google Calendar)

### Rekening
- `components/LoveGiftSection.tsx` → line ~20-40

## 🧪 Testing Checklist

```
□ Welcome page + confetti
□ Dark mode toggle
□ Audio player
□ Countdown timer
□ Form ucapan
□ Like button
□ Google Maps link
□ Google Calendar link
□ Dashboard login
□ Delete ucapan
□ Responsive mobile
```

## 🚀 Deploy Steps

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy
5. Run migrations
6. Test production

## 📞 Customer Support Template

```
Dashboard: https://your-domain.vercel.app/login
Email: admin@undangan.com
Password: admin123

Fitur:
✅ Lihat ucapan tamu
✅ Hapus ucapan
✅ Statistik

⚠️ Ganti password setelah login!
```

## 🔧 Troubleshooting Cepat

| Masalah | Solusi |
|---------|--------|
| Tidak bisa login | Run `npx prisma db seed` |
| Gambar tidak muncul | Cek file di `public/assets/images/` |
| Musik tidak play | Cek file `music.mp3` ada |
| Dark mode error | Clear cache + hard refresh |
| Build error | Cek `getDiagnostics` |

## 📦 Serah Terima Files

```
✅ PANDUAN_CUSTOMER.md
✅ INFO_AKSES_CUSTOMER.txt
✅ CHECKLIST_SERAH_TERIMA.md
✅ Source code (ZIP atau GitHub access)
✅ Database backup (jika ada data)
```

## 💡 Pro Tips

- Backup database sebelum edit
- Test di incognito mode
- Screenshot ucapan favorit
- Monitor dashboard daily
- Update password regularly

---

**Need help? Check PANDUAN_CUSTOMER.md for detailed guide!**
