import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@undangan.com' },
    update: {},
    create: {
      email: 'admin@undangan.com',
      name: 'Admin Undangan',
      password: hashedPassword,
      accessKey: 'd9faced3377732b0edf19e90d1bde0cd5de04801c75eb41743',
      tz: 'Asia/Jakarta',
      isFilter: true,
      isConfettiAnimation: true,
      canReply: true,
      canEdit: true,
      canDelete: true,
    },
  });

  console.log('✅ Created admin user:', user.email);

  // Create sample comments
  await prisma.comment.create({
    data: {
      name: 'Budi Santoso',
      presence: true,
      comment: 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fi khair.',
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      likes: 5,
    },
  });

  await prisma.comment.create({
    data: {
      name: 'Siti Nurhaliza',
      presence: true,
      comment: 'MasyaAllah, bahagia sekali melihat kalian berdua. Semoga langgeng sampai kakek nenek ya! 💕',
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      likes: 3,
    },
  });

  await prisma.comment.create({
    data: {
      name: 'Ahmad Fauzi',
      presence: false,
      comment: 'Maaf tidak bisa hadir, tapi doa selalu menyertai kalian. Semoga Allah memberkahi pernikahan kalian.',
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      likes: 2,
    },
  });

  console.log('✅ Created sample comments');

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Login credentials:');
  console.log('   Email: admin@undangan.com');
  console.log('   Password: admin123');
  console.log('   Access Key:', user.accessKey);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
