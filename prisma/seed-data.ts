import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Hapus data lama (optional)
  console.log('🗑️  Cleaning old data...');
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.pertemuan.deleteMany();
  await prisma.templateWeding.deleteMany();
  await prisma.galery.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // 2. Buat User
  console.log('👤 Creating user...');
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const user = await prisma.user.create({
    data: {
      email: 'admin@undangan.com',
      name: 'Admin Wedding',
      password: hashedPassword,
      accessKey: `access-${Date.now()}`,
      tz: 'Asia/Jakarta',
      isFilter: true,
      isConfettiAnimation: true,
      canReply: true,
      canEdit: true,
      canDelete: true,
      role: 'ADMIN',
      isActive: true,
    },
  });

  // 3. Buat Galery
  console.log('🖼️  Creating gallery...');
  const galery = await prisma.galery.create({
    data: {
      fotos: [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w-800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&auto=format&fit=crop',
      ],
    },
  });

  // 4. Buat Template Wedding
  console.log('💍 Creating wedding template...');
  const weddingDate = new Date();
  weddingDate.setMonth(weddingDate.getMonth() + 3); // 3 bulan dari sekarang

  const templateWeding = await prisma.templateWeding.create({
    data: {
      userId: user.id,
      designTheme: 'CLASSIC',
      fotoHeader: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=1200&auto=format&fit=crop',
      
      // Groom
      namaPutra: 'John',
      namaLengkapPutra: 'John Doe',
      namaAyahPutra: 'Mr. Doe Senior',
      namaIbuPutra: 'Mrs. Doe',
      instagramPutra: '@johndoe',
      photoPutra: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop',
      
      // Bride
      namaPutri: 'Jane',
      namaLengkapPutri: 'Jane Smith',
      namaAyahPutri: 'Mr. Smith',
      namaIbuPutri: 'Mrs. Smith',
      instagramPutri: '@janesmith',
      photoPutri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop',
      
      // Wedding Info
      tanggalPernikahan: weddingDate,
      linkGoogleCalender: 'https://calendar.google.com/calendar/event?action=TEMPLATE&dates=20250101T100000Z/20250101T120000Z&text=John+%26+Jane+Wedding&location=Grand+Hotel+Ballroom',
      alamatPernikahan: 'Grand Hotel Ballroom, Jl. Merdeka No. 123, Jakarta',
      jamMulai: '10:00',
      jamSelesai: '14:00',
      linkMaps: 'https://maps.google.com/?q=Grand+Hotel+Jakarta',
      
      // Love Gift
      noAtm: '1234567890',
      namaBank: 'Bank Central',
      fotoQris: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://payment.example.com',
      noHp: '+6281234567890',
      
      galeryId: galery.id,
    },
  });

  // 5. Buat Pertemuan Story
  console.log('📖 Creating meeting story...');
  await prisma.pertemuan.create({
    data: {
      templateWedingId: templateWeding.id,
      judulPertemuanSatu: 'Pertemuan Pertama',
      judulPertemuanDua: 'Pertunangan',
      judulPertemuanTiga: 'Lamaran',
      judulPertemuanEmpat: 'Pernikahan',
      pertemuanPertama: 'Kami pertama kali bertemu di kampus tahun 2018. Saat itu John sedang presentasi dan Jane adalah asisten dosen.',
      pertemuanKedua: 'Setelah 2 tahun berpacaran, kami memutuskan untuk bertunangan di pantai Bali dengan keluarga.',
      pertemuanKetiga: 'Lamaran resmi dilakukan di rumah Jane dengan restu dari kedua keluarga.',
      pertemuanKeempat: 'Dan akhirnya kami memutuskan untuk mengikat janji suci di hadapan Tuhan dan keluarga.',
    },
  });

  // 6. Buat Comments
  console.log('💬 Creating comments...');
  const comments = [
    {
      name: 'Alex Johnson',
      presence: true,
      comment: 'Selamat ya John & Jane! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Doa terbaik untuk kalian! 🎉',
      gif: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
    },
    {
      name: 'Sarah Miller',
      presence: true,
      comment: 'Akhirnya! Sudah lama nunggu hari bahagia kalian. Semoga langgeng sampai akhir hayat! 💕',
    },
    {
      name: 'Michael Brown',
      presence: false,
      comment: 'Maaf tidak bisa hadir, ada urusan keluarga di luar kota. Tapi doa terbaik selalu untuk kalian! 🙏',
    },
    {
      name: 'Emily Davis',
      presence: true,
      comment: 'Wah akhirnya menikah juga! Semoga menjadi pasangan yang saling melengkapi dan menginspirasi! ✨',
    },
    {
      name: 'David Wilson',
      presence: true,
      comment: 'Selamat menempuh hidup baru! Semoga rumah tangga kalian penuh berkah dan kebahagiaan! 🏡',
    },
  ];

  for (const commentData of comments) {
    await prisma.comment.create({
      data: {
        ...commentData,
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        templateWedingId: templateWeding.id,
      },
    });
  }

  // 7. Buat Likes untuk beberapa comments
  console.log('❤️  Creating likes...');
  const allComments = await prisma.comment.findMany();
  
  // Like comment pertama 5x
  for (let i = 0; i < 5; i++) {
    await prisma.like.create({
      data: {
        commentId: allComments[0].id,
        sessionId: `session-like-${i}`,
      },
    });
  }

  // Update likes count
  await prisma.comment.update({
    where: { id: allComments[0].id },
    data: { likesCount: 5 },
  });

  // Like comment kedua 3x
  for (let i = 0; i < 3; i++) {
    await prisma.like.create({
      data: {
        commentId: allComments[1].id,
        sessionId: `session-like2-${i}`,
      },
    });
  }

  await prisma.comment.update({
    where: { id: allComments[1].id },
    data: { likesCount: 3 },
  });

  console.log('✅ Seeding completed!');
  console.log('📊 Data created:');
  console.log(`   👤 Users: 1 (admin@undangan.com / admin123)`);
  console.log(`   💍 Template Wedding: 1`);
  console.log(`   🖼️  Gallery: 1 (5 photos)`);
  console.log(`   📖 Pertemuan Story: 1`);
  console.log(`   💬 Comments: ${comments.length}`);
  console.log(`   ❤️  Likes: 8`);
  console.log(`\n🔗 Template ID: ${templateWeding.id}`);
  console.log(`🔗 User ID: ${user.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });