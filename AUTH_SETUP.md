# Authentication Setup

Dashboard sekarang sudah dilindungi dengan NextAuth authentication.

## Setup Awal

1. Pastikan environment variables sudah diset di `.env`:
```env
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

2. Generate secret key yang aman (opsional, untuk production):
```bash
openssl rand -base64 32
```

## Membuat Admin User

Jalankan command berikut untuk membuat user admin:

```bash
npm run create-admin
```

Atau dengan custom credentials:

```bash
npm run create-admin admin@example.com password123 "Admin Name"
```

Default credentials jika tidak diisi:
- Email: `admin@undangan.com`
- Password: `admin123`
- Name: `Admin`

## Login ke Dashboard

1. Jalankan development server:
```bash
npm run dev
```

2. Buka browser dan akses:
```
http://localhost:3000/dashboard
```

3. Anda akan diarahkan ke halaman login

4. Masukkan email dan password yang sudah dibuat

5. Setelah login berhasil, Anda akan masuk ke dashboard

## Fitur Authentication

- ✅ Login dengan email & password
- ✅ Session management dengan JWT
- ✅ Protected dashboard route
- ✅ Logout functionality
- ✅ Auto redirect jika belum login
- ✅ Auto redirect ke dashboard jika sudah login

## Struktur File

```
pages/
├── api/
│   └── auth/
│       └── [...nextauth].ts    # NextAuth configuration
├── login.tsx                    # Login page
├── dashboard.tsx                # Protected dashboard
└── _app.tsx                     # SessionProvider wrapper

scripts/
└── create-admin.ts              # Script untuk membuat admin user

types/
└── next-auth.d.ts              # TypeScript types untuk NextAuth
```

## Troubleshooting

### Error: User tidak ditemukan
Pastikan sudah menjalankan `npm run create-admin` untuk membuat user.

### Error: NEXTAUTH_SECRET tidak diset
Tambahkan `NEXTAUTH_SECRET` di file `.env`.

### Error: Database connection
Pastikan database sudah running dan connection string di `.env` sudah benar.
