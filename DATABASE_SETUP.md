# Setup Database

## Local Development

### 1. Install PostgreSQL
Pilih salah satu:

**Opsi A: Install PostgreSQL langsung**
- Download dari https://www.postgresql.org/download/
- Install dan jalankan PostgreSQL
- Buat database baru: `undangan_dev`

**Opsi B: Gunakan Docker**
```bash
docker run --name postgres-undangan -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=undangan_dev -p 5432:5432 -d postgres
```

### 2. Setup Environment Variables
File `.env` sudah dikonfigurasi untuk local development:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/undangan_dev"
POSTGRES_URL="postgresql://postgres:postgres@localhost:5432/undangan_dev"
```

Sesuaikan username, password, dan nama database jika berbeda.

### 3. Jalankan Migrasi
```bash
# Reset database dan buat tabel baru
npx prisma migrate reset

# Atau jika ingin migrasi tanpa reset
npx prisma migrate dev --name init
```

### 4. Generate Prisma Client
```bash
npx prisma generate
```

### 5. Buat Admin User
```bash
npm run create-admin
```

Default credentials:
- Email: admin@undangan.com
- Password: admin123

## Production

### 1. Setup Database Production
Database production sudah dikonfigurasi di `.env.production`:
- Menggunakan Prisma Cloud PostgreSQL
- Connection string sudah ada

### 2. Deploy Migrasi ke Production
```bash
# Gunakan environment production
npx prisma migrate deploy
```

### 3. Vercel Deployment
Tambahkan environment variables di Vercel Dashboard:
- `DATABASE_URL`
- `POSTGRES_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## Switching Between Environments

### Development (Local)
```bash
# Gunakan .env (default)
npm run dev
```

### Production
```bash
# Gunakan .env.production
NODE_ENV=production npm run build
NODE_ENV=production npm start
```

## Troubleshooting

### Error: Can't reach database server
- Pastikan PostgreSQL running
- Cek connection string di `.env`
- Test koneksi: `psql -U postgres -h localhost`

### Error: Database does not exist
```bash
# Buat database manual
createdb undangan_dev
```

### Reset Database
```bash
npx prisma migrate reset
```

### View Database
```bash
npx prisma studio
```
