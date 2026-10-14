import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Katalog musik bawaan. Tambahkan baris baru di sini untuk menambah pilihan lagu.
// `file` bisa berupa path aset lokal (mis. /assets/music/music.mp3) atau URL Cloudinary.
const MUSIK_DATA = [
  {
    judul: 'Pure Love',
    penyanyi: 'Oleksii Kaplunskyi',
    file: '/assets/music/music.mp3',
  },
  {
    judul: 'Wedding',
    penyanyi: 'MegaJackie',
    file: '/assets/music/wedding.mp3',
  },
];

async function main() {
  console.log('🌱 Seeding katalog musik...');

  for (const track of MUSIK_DATA) {
    const existing = await prisma.musik.findFirst({
      where: { judul: track.judul, file: track.file },
    });

    if (existing) {
      console.log(`↺ Lewati (sudah ada): ${track.judul}`);
      continue;
    }

    await prisma.musik.create({ data: track });
    console.log(`✅ Ditambahkan: ${track.judul}`);
  }

  const total = await prisma.musik.count();
  console.log(`🎵 Total musik di katalog: ${total}`);
}

main()
  .catch((e) => {
    console.error('❌ Gagal seeding musik:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
