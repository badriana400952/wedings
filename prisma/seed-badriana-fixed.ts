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
  } else {
    console.log('✅ User Badriana already exists');
  }

  // 2. Cek atau buat Galeri
  console.log('🖼️  Checking gallery...');
  let galery = await prisma.galery.findFirst({
    where: { templateWedings: { some: { userId: user.id } } }
  });

  if (!galery) {
    console.log('🖼️  Creating gallery...');
    galery = await prisma.galery.create({
      data: {
        fotos: [
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1511984804829-3d3a0d0a4c1a?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1511984820141-6f85b92f5a3d?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1511984820142-56ae8555c4b5?w=800&auto=format&fit=crop',
        ],
      },
    });
  }

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
        
        // Groom (Badriana)
        namaPutra: 'Badriana',
        namaLengkapPutra: 'Badriana',
        namaAyahPutra: 'Budi Santoso',
        namaIbuPutra: 'Siti Aminah',
        instagramPutra: '@badriana',
        photoPutra: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop',
        
        // Bride (Izzah)
        namaPutri: 'Izzah',
        namaLengkapPutri: 'Izzah',
        namaAyahPutri: 'Bambang',
        namaIbuPutri: 'Siti',
        instagramPutri: '@izzah',
        photoPutri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop',
        
        // Wedding Info
        tanggalPernikahan: weddingDate,
        linkGoogleCalender: 'https://calendar.google.com/calendar/event?action=TEMPLATE&dates=20241215T100000Z/20241215T140000Z&text=Wedding+Badriana+%26+Izzah&location=Grand+Hotel+Ballroom',
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
    console.log('✅ Wedding template created');
  } else {
    console.log('✅ Wedding template already exists');
    
    // Update existing template dengan data Badriana & Izzah
    console.log('💍 Updating wedding template...');
    templateWeding = await prisma.templateWeding.update({
      where: { id: templateWeding.id },
      data: {
        // Groom (Badriana)
        namaPutra: 'Badriana',
        namaLengkapPutra: 'Badriana',
        instagramPutra: '@badriana',
        
        // Bride (Izzah)
        namaPutri: 'Izzah',
        namaLengkapPutri: 'Izzah',
        instagramPutri: '@izzah',
        
        linkGoogleCalender: 'https://calendar.google.com/calendar/event?action=TEMPLATE&dates=20241215T100000Z/20241215T140000Z&text=Wedding+Badriana+%26+Izzah&location=Grand+Hotel+Ballroom',
      },
    });
    console.log('✅ Wedding template updated');
  }

  // 4. Cek atau buat Pertemuan Story
  console.log('📖 Checking meeting story...');
  let pertemuan = await prisma.pertemuan.findUnique({
    where: { templateWedingId: templateWeding.id }
  });

  if (!pertemuan) {
    console.log('📖 Creating meeting story...');
    await prisma.pertemuan.create({
      data: {
        templateWedingId: templateWeding.id,
        judulPertemuanSatu: 'Pertemuan Pertama',
        judulPertemuanDua: 'Pertunangan',
        judulPertemuanTiga: 'Lamaran',
        judulPertemuanEmpat: 'Pernikahan',
        pertemuanPertama: 'Kami pertama bertemu di kampus tahun 2018. Badriana adalah senior di fakultas teknik, sementara Izzah adalah mahasiswa baru yang tersesat mencari ruang kuliah.',
        pertemuanKedua: 'Setelah 2 tahun berpacaran, kami memutuskan untuk bertunangan di pantai Bali dengan restu dari kedua keluarga.',
        pertemuanKetiga: 'Lamaran resmi dilakukan di rumah Izzah dengan restu dari kedua orang tua. Momen yang sangat berkesan bagi kami berdua.',
        pertemuanKeempat: 'Dan akhirnya, kami memutuskan untuk mengikat janji suci di hadapan Tuhan dan keluarga.',
      },
    });
    console.log('✅ Meeting story created');
  }

  console.log('✅ Seeding completed for Badriana!');
  console.log('📊 Data summary:');
  console.log(`   👤 User ID: ${user.id}`);
  console.log(`   👤 User Name: ${user.name}`);
  console.log(`   👤 User Email: ${user.email}`);
  console.log(`   💍 Template Wedding ID: ${templateWeding.id}`);
  console.log(`\n🔗 Admin URL: http://localhost:3000/${user.id}`);
  console.log(`🔗 Guest URL: http://localhost:3000/${user.id}/to/NamaTamu`);
  console.log(`\n📧 Login: ${user.email}`);
  console.log(`🔑 Password: 123456789`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });