# 💌 Website Undangan Pernikahan - Next.js Version

![Thumbnail](/assets/images/banner.webp)

[![GitHub repo size](https://img.shields.io/github/repo-size/dewanakl/undangan?color=brightgreen)](https://shields.io)
[![GitHub License](https://img.shields.io/github/license/dewanakl/undangan?color=brightgreen)](https://shields.io)

## 🎉 Versi 4.0 - Full Stack Next.js

Project undangan pernikahan yang telah **dimigrasi 100%** dari vanilla HTML/CSS/JS ke **Next.js 15** dengan **Pages Router**, **TypeScript**, **Tailwind CSS**, dan **Prisma ORM**.

## ✨ Fitur Utama

### 🎨 Frontend
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

### 🔧 Backend
- ✅ Next.js App Router dengan API Routes
- ✅ Prisma ORM untuk database management
- ✅ PostgreSQL/MySQL/SQLite support
- ✅ RESTful API endpoints
- ✅ Session management
- ✅ Like system dengan session tracking

### 📊 Dashboard Admin
- ✅ Statistics (comments, likes, present, absent)
- ✅ Comments management
- ✅ Download comments as CSV
- ✅ Responsive admin panel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (atau database lain)
- npm atau yarn

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd undangan

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env dengan database credentials Anda

# 4. Generate Prisma Client
npm run prisma:generate

# 5. Run database migrations
npm run prisma:migrate

# 6. (Optional) Seed database dengan sample data
npx tsx prisma/seed.ts

# 7. Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Struktur Project

```
├── app/
│   ├── api/              # API Routes
│   │   ├── comments/     # Comment endpoints
│   │   └── stats/        # Statistics endpoint
│   ├── dashboard/        # Dashboard admin
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── WelcomePage.tsx
│   ├── HomePage.tsx
│   ├── BrideSection.tsx
│   ├── WeddingDateSection.tsx
│   ├── GallerySection.tsx
│   ├── LoveGiftSection.tsx
│   ├── CommentSection.tsx
│   ├── BottomNav.tsx
│   ├── AudioButton.tsx
│   └── ThemeButton.tsx
├── lib/
│   └── prisma.ts         # Prisma client
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeder
└── public/
    └── assets/           # Static assets
```

## ⚙️ Tech Stack

- **Framework**: Next.js 15 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM (PostgreSQL/MySQL/SQLite)
- **Icons**: Font Awesome 6
- **Animations**: AOS (Animate On Scroll)
- **Fonts**: Google Fonts (Josefin Sans)

## 🎨 Kustomisasi

### Mengubah Data Mempelai
Edit file `components/BrideSection.tsx` dan `components/HomePage.tsx`

### Mengubah Tanggal Pernikahan
Edit file `components/WeddingDateSection.tsx`:
```typescript
const weddingDate = new Date('2024-01-01T09:30:00').getTime();
```

### Mengubah Gambar
Ganti file di folder `public/assets/images/`:
- `bg.webp` - Background
- `cowo.webp` - Foto mempelai pria
- `cewe.webp` - Foto mempelai wanita
- `donate.png` - QR Code donasi

### Mengubah Musik
Ganti file `public/assets/music/pure-love-304010.mp3`

## 📚 Dokumentasi Lengkap

- [SETUP.md](./SETUP.md) - Panduan setup lengkap
- [README-MIGRATION.md](./README-MIGRATION.md) - Detail migrasi dari versi lama

## 🔐 Default Credentials (Setelah Seed)

```
Email: admin@undangan.com
Password: admin123
```

## 📦 Build & Deploy

### Build untuk Production
```bash
npm run build
npm start
```

### Deploy ke Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy ke Railway/Render
1. Push code ke GitHub
2. Connect repository di platform
3. Set environment variables
4. Deploy!

## 🛠️ Available Scripts

```bash
npm run dev          # Run development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
```

## 🐛 Troubleshooting

Lihat [SETUP.md](./SETUP.md) untuk troubleshooting lengkap.

## 🎨 Credit

- Original design by [dewanakl](https://github.com/dewanakl)
- Visual assets from Pixabay
- Music from Pixabay

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🙏 Acknowledgments

- Original project: [dewanakl/undangan](https://github.com/dewanakl/undangan)
- Migrated to Next.js with ❤️

---

**Note**: Ini adalah versi 4.0 yang telah dimigrasi ke Next.js. Untuk versi vanilla JS, lihat branch `v3.x`.

## 📞 Support

Jika ada pertanyaan atau butuh bantuan:
- Open an issue di GitHub
- Email: [dewanakretarta29@gmail.com](mailto:dewanakretarta29@gmail.com)

---

Made with 💕 by the community
# wedings
