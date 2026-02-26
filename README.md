# 💌 Website Undangan Pernikahan - Next.js

![Banner](/public/assets/images/banner.webp)

## 🎉 Next.js Version dengan Pages Router

Website undangan pernikahan modern menggunakan **Next.js 15**, **TypeScript**, **Tailwind CSS**, **Bootstrap 5**, **Prisma ORM**, dan **NextAuth.js**.

## ✨ Fitur Lengkap

### Frontend (Guest View)
- ✅ Welcome page dengan animasi confetti
- ✅ Responsive design (mobile & desktop)
- ✅ Dark/Light theme toggle
- ✅ Smooth animations dengan AOS
- ✅ Countdown timer ke hari pernikahan
- ✅ Gallery interaktif dengan modal zoom
- ✅ Audio player background music (lazy loading)
- ✅ Google Maps integration
- ✅ Save to Google Calendar
- ✅ Love gift section (Transfer info)
- ✅ Comment system dengan like feature
- ✅ Bottom navigation
- ✅ Image optimization dengan Next.js Image

### Backend & Admin
- ✅ Next.js Pages Router dengan API Routes
- ✅ NextAuth.js authentication
- ✅ Protected dashboard route
- ✅ Prisma ORM untuk database
- ✅ PostgreSQL database support
- ✅ RESTful API endpoints
- ✅ Session management
- ✅ CRUD operations untuk comments

### Dashboard Admin
- ✅ Secure login dengan NextAuth
- ✅ View all comments dari tamu
- ✅ Delete inappropriate comments
- ✅ Statistics (total comments)
- ✅ Logout functionality
- ✅ Responsive admin panel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Database PostgreSQL (atau SQLite untuk development)
- npm atau yarn

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd undangan-nextjs

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env dengan database credentials

# 4. Generate Prisma Client
npx prisma generate

# 5. Push database schema
npx prisma db push

# 6. Seed admin user
npx prisma db seed

# 7. Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Project

```
├── pages/                # Next.js Pages Router
│   ├── api/             # API Routes
│   │   ├── auth/        # NextAuth endpoints
│   │   ├── comments/    # Comment CRUD
│   │   └── stats.ts     # Statistics
│   ├── _app.tsx         # Custom App (SessionProvider)
│   ├── _document.tsx    # Custom Document
│   ├── index.tsx        # Homepage
│   ├── login.tsx        # Admin login
│   └── dashboard.tsx    # Admin dashboard (protected)
├── components/          # React components
│   ├── HomePage.tsx
│   ├── WelcomePage.tsx
│   ├── BrideSection.tsx
│   ├── WeddingDateSection.tsx
│   ├── GallerySection.tsx
│   ├── CommentSection.tsx
│   ├── LoveGiftSection.tsx
│   ├── ThemeButton.tsx
│   ├── AudioButton.tsx
│   ├── BottomNav.tsx
│   ├── Footer.tsx
│   └── AOSInit.tsx
├── lib/                 # Utilities
│   └── prisma.ts        # Prisma client
├── prisma/             # Database
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed script
├── scripts/            # Utility scripts
│   ├── create-admin.ts
│   └── change-password.ts
├── public/             # Static assets
│   └── assets/
│       ├── images/      # Photos
│       ├── music/       # Background music
│       └── video/       # Videos
├── styles/             # Global styles
│   ├── globals.css
│   └── animation.css
├── types/              # TypeScript types
│   └── next-auth.d.ts
└── ...config files
```

## ⚙️ Tech Stack

- **Framework**: Next.js 15 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Bootstrap 5.3.8
- **Database**: Prisma ORM (PostgreSQL/SQLite)
- **Authentication**: NextAuth.js
- **Icons**: Font Awesome 7.1.0
- **Animations**: AOS (Animate On Scroll), Canvas Confetti
- **Fonts**: Google Fonts (Sacramento, Josefin Sans, Noto Naskh Arabic)
- **Image Optimization**: Next.js Image component

## 🎨 Kustomisasi

### Mengubah Data Mempelai
Edit file berikut:
- `components/HomePage.tsx` - Nama di halaman utama
- `components/WelcomePage.tsx` - Nama di welcome page
- `components/BrideSection.tsx` - Info detail mempelai & Instagram

### Mengubah Tanggal Pernikahan
Edit `components/WeddingDateSection.tsx`:
```typescript
const weddingDate = new Date('2026-05-31T09:00:00').getTime();
```

Edit `components/HomePage.tsx` untuk Google Calendar link.

### Mengubah Lokasi
Edit `components/WeddingDateSection.tsx`:
- Google Maps link
- Alamat lengkap

### Mengubah Gambar
Ganti file di `public/assets/images/`:
- `a1.jpeg` - Background home
- `a2.jpeg` - Foto utama home
- `a7.jpeg` - Foto welcome page
- `a8.jpeg` - Foto mempelai pria
- `cewe.webp` - Foto mempelai wanita
- `a3.jpeg` sampai `a9.jpeg` - Galeri foto

### Mengubah Musik
Ganti file `public/assets/music/music.mp3`

### Mengubah Info Transfer
Edit `components/LoveGiftSection.tsx`:
- Nomor rekening
- Nama bank
- Nama pemilik rekening

## 🛠️ Available Scripts

```bash
# Development
npm run dev                    # Run development server

# Production
npm run build                  # Build for production
npm start                      # Start production server

# Database
npx prisma generate            # Generate Prisma Client
npx prisma db push             # Push schema to database
npx prisma migrate deploy      # Deploy migrations (production)
npx prisma studio              # Open Prisma Studio GUI
npx prisma db seed             # Seed admin user

# Admin Management
npm run create-admin           # Create new admin user
npm run change-password        # Change admin password

# Code Quality
npm run lint                   # Run ESLint
```

## 📦 Build & Deploy

### Build untuk Production
```bash
npm run build
npm start
```

### Deploy ke Vercel

1. Push code ke GitHub
2. Import repository di [Vercel](https://vercel.com)
3. Add environment variables:
   ```env
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```
4. Deploy
5. Run migrations:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

## 🔐 Default Admin Credentials

Setelah run `npx prisma db seed`:

```
Email: admin@undangan.com
Password: admin123
```

⚠️ **PENTING**: Ganti password setelah login pertama!

## 📝 Environment Variables

### Development (.env)
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Production (Vercel)
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="random-secret-key"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

## 📚 Dokumentasi Lengkap

Untuk panduan lengkap, lihat file:
- `PANDUAN_CUSTOMER.md` - Panduan untuk customer
- `QUICK_REFERENCE.md` - Quick reference
- `CHECKLIST_SERAH_TERIMA.md` - Checklist deployment
- `INFO_AKSES_CUSTOMER.txt` - Info akses & credentials

## 🎨 Credits

- **Original Template**: [Dewanakl](https://github.com/dewanakl/undangan)
- **Migration to Next.js**: [Badriana400952](https://github.com/badriana400952)
- **Music**: Pure Love by Oleksii Kaplunskyi (Pixabay)
- **Visual Assets**: Pixabay
- **Icons**: Font Awesome

## 📜 License

MIT License - Open source and free to use

## 🙏 Acknowledgments

Migrated to Next.js with ❤️

Special thanks to:
- Next.js team for amazing framework
- Prisma team for excellent ORM
- NextAuth.js for authentication
- Vercel for hosting platform

---

## 📞 Support

Jika ada pertanyaan atau butuh bantuan:
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Email: your-email@example.com

---

**Development**: http://localhost:3000
**Dashboard**: http://localhost:3000/dashboard
**Login**: http://localhost:3000/login

**Happy Wedding! 💑🎉**
