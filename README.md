# 💌 Website Undangan Pernikahan - Next.js

![Banner](/public/assets/images/banner.webp)

## 🎉 Next.js Version dengan Pages Router

Website undangan pernikahan modern menggunakan **Next.js 15**, **TypeScript**, **Tailwind CSS**, **Bootstrap 5**, dan **Prisma ORM**.

## ✨ Fitur

### Frontend
- ✅ Responsive design (mobile & desktop)
- ✅ Dark/Light theme toggle
- ✅ Smooth animations dengan AOS
- ✅ Welcome page dengan nama tamu dari URL
- ✅ Countdown timer ke hari pernikahan
- ✅ Gallery dengan modal view
- ✅ Audio player background music
- ✅ Love gift section (Transfer, QRIS, Gift)
- ✅ Comment system dengan like feature
- ✅ Bottom navigation

### Backend
- ✅ Next.js Pages Router dengan API Routes
- ✅ Prisma ORM untuk database
- ✅ PostgreSQL database (Prisma Cloud)
- ✅ RESTful API endpoints
- ✅ Session management untuk likes

### Dashboard Admin
- ✅ Statistics (comments, likes, present, absent)
- ✅ Comments management
- ✅ Download comments as CSV
- ✅ Responsive admin panel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Database PostgreSQL (atau gunakan Prisma Cloud)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env
# Edit .env dengan database credentials

# 3. Push database schema
npx prisma db push

# 4. Seed database (optional)
npx tsx prisma/seed.ts

# 5. Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Project

```
├── pages/                # Next.js Pages Router
│   ├── api/             # API Routes
│   │   ├── comments/    # Comment endpoints
│   │   └── stats.ts     # Statistics
│   ├── _app.tsx         # Custom App
│   ├── _document.tsx    # Custom Document
│   ├── index.tsx        # Homepage
│   └── dashboard.tsx    # Admin dashboard
├── components/          # React components
├── lib/                 # Utilities & Prisma client
├── prisma/             # Database schema & seed
├── public/             # Static assets
├── styles/             # Global styles
└── ...config files
```

## ⚙️ Tech Stack

- **Framework**: Next.js 15 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Bootstrap 5.3.8
- **Database**: Prisma ORM (PostgreSQL)
- **Icons**: Font Awesome 7.1.0
- **Animations**: AOS (Animate On Scroll)
- **Fonts**: Google Fonts (Sacramento, Josefin Sans, Noto Naskh Arabic)

## 🎨 Kustomisasi

### Mengubah Data Mempelai
Edit `components/BrideSection.tsx` dan `components/HomePage.tsx`

### Mengubah Tanggal Pernikahan
Edit `components/WeddingDateSection.tsx`:
```typescript
const weddingDate = new Date('2024-01-01T09:30:00').getTime();
```

### Mengubah Gambar
Ganti file di `public/assets/images/`:
- `bg.webp` - Background
- `cowo.webp` - Foto mempelai pria
- `cewe.webp` - Foto mempelai wanita
- `donate.png` - QR Code donasi

### Mengubah Musik
Ganti file `public/assets/music/pure-love-304010.mp3`

## 🛠️ Available Scripts

```bash
npm run dev          # Run development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma db push   # Push schema to database
npx prisma studio    # Open Prisma Studio
```

## 📦 Build & Deploy

### Build untuk Production
```bash
npm run build
npm start
```

### Deploy ke Vercel
```bash
npm i -g vercel
vercel
```

## 🔐 Default Credentials (Setelah Seed)

```
Email: admin@undangan.com
Password: admin123
```

## 📝 Environment Variables

```env
POSTGRES_URL="your-postgres-connection-string"
```

## 🎨 Credit

- Original design by [dewanakl](https://github.com/dewanakl)
- Visual assets from Pixabay
- Music from Pixabay

## 📜 License

MIT License - Open source

## 🙏 Acknowledgments

Migrated to Next.js with ❤️

---

**Server**: http://localhost:3000
**Dashboard**: http://localhost:3000/dashboard
