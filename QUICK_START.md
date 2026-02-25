# Quick Start Guide - Undangan Next.js

## 🚀 Setup Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
Pastikan file `.env` sudah berisi connection string database Prisma Cloud:
```env
POSTGRES_URL="postgres://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Push Database Schema
```bash
npx prisma db push
```

### 5. Buat Admin User
```bash
npm run create-admin
```

Default credentials:
- Email: `admin@undangan.com`
- Password: `admin123`

### 6. Jalankan Development Server
```bash
npm run dev
```

Buka browser: `http://localhost:3000`

## 📱 Fitur Aplikasi

### Halaman Utama (/)
- Welcome page dengan nama tamu (dari URL parameter)
- Countdown timer pernikahan
- Informasi mempelai
- Gallery foto
- Form ucapan & doa (comment)
- Like button untuk setiap comment
- Love gift section
- Audio background music
- Dark/Light theme toggle

### Dashboard (/dashboard)
🔒 **Protected - Perlu Login**

Fitur:
- **Home Tab**: 
  - Statistik (total comments, hadir, tidak hadir, likes)
  - List semua comments dengan detail
  - Download CSV export
  
- **Generate Link Tab**:
  - Generate link undangan dengan nama tamu
  - Format: `?Nama`, `?Nama+Tamu`, `?to=Nama`
  - Copy link & preview
  
- **Settings Tab**: Coming soon

### Login (/login)
- Login dengan email & password
- Auto redirect ke dashboard jika sudah login
- Session management dengan NextAuth

## 🔗 Generate Link Undangan

Dari dashboard, tab "Generate Link":

1. Masukkan nama tamu: `Badriana`
2. Klik "Generate Link"
3. Link akan dibuat: `http://localhost:3000/?Badriana`
4. Copy & share ke tamu

Format yang didukung:
- `?Badriana` → Kepada Yth: Badriana
- `?Alumni+Pasir+Durung` → Kepada Yth: Alumni Pasir Durung
- `?to=Nama Tamu` → Kepada Yth: Nama Tamu

## 🎨 Teknologi

- **Framework**: Next.js 15 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Bootstrap 5.3.8
- **Database**: PostgreSQL (Prisma Cloud)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Fonts**: Sacramento, Noto Naskh Arabic, Josefin Sans
- **Icons**: Font Awesome
- **Animation**: AOS (Animate On Scroll)

## 📝 Scripts

```bash
npm run dev              # Development server
npm run build            # Build production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
npm run create-admin     # Create admin user
```

## 🔐 Authentication

Dashboard dilindungi dengan NextAuth:
- Session-based authentication dengan JWT
- Password di-hash dengan bcryptjs
- Auto redirect jika belum login
- Logout functionality

Lihat `AUTH_SETUP.md` untuk detail lengkap.

## 📂 Struktur Project

```
undangan/
├── components/          # React components
│   ├── WelcomePage.tsx
│   ├── HomePage.tsx
│   ├── BrideSection.tsx
│   ├── CommentSection.tsx
│   └── ...
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth].ts
│   │   ├── comments/
│   │   └── stats.ts
│   ├── index.tsx        # Main page
│   ├── dashboard.tsx    # Protected dashboard
│   ├── login.tsx        # Login page
│   ├── _app.tsx         # App wrapper
│   └── _document.tsx
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts
├── scripts/
│   └── create-admin.ts  # Admin user creator
├── styles/
│   ├── globals.css
│   └── animation.css
└── public/
    └── assets/
```

## 🐛 Troubleshooting

### Database Connection Error
Pastikan `POSTGRES_URL` di `.env` sudah benar dan database accessible.

### Login Error
Pastikan sudah menjalankan `npm run create-admin` untuk membuat user.

### NextAuth Error
Pastikan `NEXTAUTH_SECRET` dan `NEXTAUTH_URL` sudah diset di `.env`.

### Build Error
Jalankan `npm run prisma:generate` sebelum build.

## 📞 Support

Untuk pertanyaan atau issue, silakan buat issue di repository.
