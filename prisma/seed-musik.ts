import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Katalog musik lengkap untuk undangan pernikahan.
export const MUSIK_DATA = [
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
  {
    judul: 'Ceremony Wedding Invitation',
    penyanyi: 'Alex Morgan',
    file: '/assets/music/alex-morgan-ceremony-wedding-invitation-music-583281.mp3',
  },
  {
    judul: 'Garden Ceremony Glow',
    penyanyi: 'Alex Morgan',
    file: '/assets/music/alex-morgan-wedding-garden-ceremony-glow-578500.mp3',
  },
  {
    judul: 'Love',
    penyanyi: 'Atlas Audio',
    file: '/assets/music/atlasaudio-love-594867.mp3',
  },
  {
    judul: 'Love BGM',
    penyanyi: 'Kira Vale',
    file: '/assets/music/kiravale-love-bgm-598115.mp3',
  },
  {
    judul: 'Sweet Wedding',
    penyanyi: 'Leberch',
    file: '/assets/music/leberch-wedding-584482.mp3',
  },
  {
    judul: 'Romantic Inspiring Piano',
    penyanyi: 'Paul Yudin',
    file: '/assets/music/paulyudin-romantic-wedding-inspiring-piano-376014.mp3',
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
    console.log(`✅ Ditambahkan: ${track.judul} (${track.penyanyi})`);
  }

  const total = await prisma.musik.count();
  console.log(`🎵 Total musik di katalog database: ${total}`);
}

main()
  .catch((e) => {
    console.error('❌ Gagal seeding musik:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
