import { PrismaClient } from '@prisma/client';

async function main() {
  const p = new PrismaClient();
  try {
    const list = await p.musik.findMany({ orderBy: { createdAt: 'asc' } });
    console.log('TOTAL:', list.length);
    list.forEach((m, i) => {
      const fileShort = m.file.length > 60 ? m.file.slice(0, 60) + '...' : m.file;
      console.log(`${i + 1}. ${m.judul} | ${m.penyanyi} | ${fileShort}`);
    });
  } finally {
    await p.$disconnect();
  }
}
main();
