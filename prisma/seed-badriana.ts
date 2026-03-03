import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding data for Badriana...');

  // 1. Cek atau buat user Badriana
  let user = await prisma.user.findUnique({
    where: { email: 'badriana@undangan.com' }
  });

  if (!user) {
    console.log('👤 Creating Badriana user...');
    const hashedPassword = await bcrypt.hash('123456789', 12);
    user = await prisma.user.create({
      data: {
        email: 'badriana@undangan.com',
        name: 'Badriana',
        password: hashedPassword,
        accessKey: `access-${Date.now()}`,
        tz: 'Asia/Jakarta',
        role: 'ADMIN',
        isActive: true,
        isFilter: true,
        isConfettiAnimation: true,
        canReply: true,
        canEdit: true,
        canDelete: true,
      },
    });
    console.log('✅ User Badriana created');
  }

  // 2. Buat Galeri
  console.log('🖼️  Creating gallery...');
  const galery = await prisma.galery.create({
    data: {
      fotos: [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511984804829-3d3a0d0a4c1a?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511984820141-6f85b92f5a3d?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511984820142-56ae8555c4b5?w=800&auto=format&fit=crop',
      ],
    },
  });

  // 3. Cek atau buat Template Wedding untuk Badriana
  console.log('💍 Checking wedding template...');
  let templateWeding = await prisma.templateWeding.findUnique({
    where: { userId: user.id }
  });

  if (!templateWeding) {
    console.log('💍 Creating wedding template...');
    const weddingDate = new Date();
    weddingDate.setMonth(weddingDate.getMonth() + 2); // 2 bulan dari sekarang

    templateWeding = await prisma.templateWeding.create({
    data: {
      userId: user.id,
      designTheme: 'MODERN',
      fotoHeader: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop',
      
      // Groom
      namaPutra: 'Ahmad',
      namaLengkapPutra: 'Ahmad Fauzi',
      namaAyahPutra: 'Budi Santoso',
      namaIbuPutra: 'Siti Aminah',
      instagramPutra: '@ahmadfauzi',
      photoPutra: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop',
      
      // Bride
      namaPutri: 'Sari',
      namaLengkapPutri: 'Sari Dewi',
      namaAyahPutri: 'Bambang',
      namaIbuPutri: 'Siti',
      instagramPutri: '@sari_dewi',
      photoPutri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop',
      
      // Wedding Info
      tanggalPernikahan: weddingDate,
      linkGoogleCalender: 'https://calendar.google.com/calendar/event?action=TEMPLATE&dates=20241215T100000Z/20241215T140000Z&text=Wedding+Ahmad+%26+Sari&location=Grand+Hotel+Ballroom',
      alamatPernikahan: 'Grand Hotel Ballroom, Jl. Sudirman No. 123, Jakarta',
      jamMulai: '10:00',
      jamSelesai: '14:00',
      linkMaps: 'https://maps.google.com/?q=Grand+Hotel+Jakarta',
      
      // Love Gift
      noAtm: '1234567890',
      namaBank: 'Bank Central',
      fotoQris: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=payment-badriana-wedding',
      noHp: '+6281234567890',
      
      galeryId: galery.id,
    },
  });

  console.log('📖 Creating meeting story...');
  await prisma.pertemuan.create({
    data: {
      templateWedingId: templateWeding.id,
      judulPertemuanSatu: 'Pertemuan Pertama',
      judulPertemuanDua: 'Pertunangan',
      judulPertemuanTiga: 'Lamaran',
      judulPertemuanEmpat: 'Pernikahan',
      pertemuanPertama: 'Kami pertama bertemu di kampus tahun 2018. Ahmad adalah senior di fakultas teknik, sementara Sari adalah mahasiswa baru yang tersesat mencari ruang kuliah.',
      pertemuanKedua: 'Setelah 2 tahun berpacaran, kami memutuskan untuk bertunangan di pantai Bali dengan restu dari kedua keluarga.',
      pertemuanKetiga: 'Lamaran resmi dilakukan di rumah Sari dengan restu dari kedua orang tua. Momen yang sangat berkesan bagi kami berdua.',
      pertemuanKeempat: 'Dan akhirnya, kami memutuskan untuk mengikat janji suci di hadapan Tuhan dan keluarga.',
    },
  });

  console.log('💬 Creating comments...');
  const comments = [
    {
      name: 'Budi Santoso',
      presence: true,
      comment: 'Selamat ya Ahmad & Sari! Semoga menjadi keluarga yang sakinah mawaddah warahmah! 🎉',
      gif: 'https://media.giphy.com/media/26tknCqiJrBv5eI9q/giphy.gif',
    },
    {
      name: 'Siti Nurhaliza',
      presence: true,
      comment: 'Akhirnya! Sudah lama nunggu kabar baik ini. Semoga langgeng sampai kakek nenek ya! 💕',
    },
    {
      name: 'Rudi Hartono',
      presence: false,
      comment: 'Maaf tidak bisa hadir, tapi doa terbaik untuk kalian berdua! 🙏',
    },
    {
      name: 'Maya Sari',
      presence: true,
      comment: 'Wah akhirnya! Selamat menempuh hidup baru! Semoga jadi keluarga yang sakinah mawaddah warahmah ✨',
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

  console.log('❤️  Creating likes...');
  const allComments = await prisma.comment.findMany();
  
  // Like untuk komentar pertama
  for (let i = 0; i < 3; i++) {
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
    data: { likesCount: 3 },
  });

  console.log('✅ Seeding completed for Badriana!');
  console.log('📊 Data created:');
  console.log(`   👤 User: ${user.email}`);
  console.log(`   💍 Template Wedding: 1`);
  console.log(`   🖼️  Gallery: 1 (4 photos)`);
  console.log(`   📖 Pertemuan Story: 1`);
  console.log(`   💬 Comments: ${comments.length}`);
  console.log(`   ❤️  Likes: 3`);
  console.log(`\n🔗 Template Wedding ID: ${templateWeding.id}`);
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