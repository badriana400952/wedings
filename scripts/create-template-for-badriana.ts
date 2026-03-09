import { prisma } from '../lib/prisma.ts';

async function createTemplateForBadriana() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'badriana@undangan.com' }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('Creating template for user:', user.email);

    // Buat galery dulu
    const galery = await prisma.galery.create({
      data: {
        fotos: [
          'https://res.cloudinary.com/doykilt63/image/upload/v1772183469/udangan/bg_ogyqgr.webp',
          'https://res.cloudinary.com/doykilt63/image/upload/v1772183476/udangan/cowo_ycc5zu.webp',
          'https://res.cloudinary.com/doykilt63/image/upload/v1772183473/udangan/cewe_ygjnrf.webp',
        ],
      },
    });

    console.log('✅ Galery created:', galery.id);

    // Buat template dengan galery
    const template = await prisma.templateWeding.create({
      data: {
        userId: user.id,
        galeryId: galery.id,
        designTheme: 'CLASSIC',
        fotoHeader: 'https://res.cloudinary.com/doykilt63/image/upload/v1772183469/udangan/bg_ogyqgr.webp',
        fotoHeader2: 'https://res.cloudinary.com/doykilt63/image/upload/v1772183469/udangan/bg_ogyqgr.webp',
        fotoHeader3: 'https://res.cloudinary.com/doykilt63/image/upload/v1772183469/udangan/bg_ogyqgr.webp',
        fotoHeader4: 'https://res.cloudinary.com/doykilt63/image/upload/v1772183469/udangan/bg_ogyqgr.webp',
        
        // Groom default
        namaPutra: 'Nama Mempelai Pria',
        namaLengkapPutra: 'Nama Lengkap Mempelai Pria',
        namaAyahPutra: 'Nama Ayah',
        namaIbuPutra: 'Nama Ibu',
        instagramPutra: '@instagram',
        photoPutra: 'https://res.cloudinary.com/doykilt63/image/upload/v1772183476/udangan/cowo_ycc5zu.webp',
        
        // Bride default
        namaPutri: 'Nama Mempelai Wanita',
        namaLengkapPutri: 'Nama Lengkap Mempelai Wanita',
        namaAyahPutri: 'Nama Ayah',
        namaIbuPutri: 'Nama Ibu',
        instagramPutri: '@instagram',
        photoPutri: 'https://res.cloudinary.com/doykilt63/image/upload/v1772183473/udangan/cewe_ygjnrf.webp',
        
        // Wedding info default
        tanggalPernikahan: new Date(),
        linkGoogleCalender: '',
        alamatGedungPernikahan: 'Nama Gedung Pernikahan',
        alamatPernikahan: 'Alamat Lengkap Gedung Pernikahan',
        jamMulai: '10:00',
        jamResepsi: '12:00',
        jamSelesai: '14:00',
        linkMaps: '',
        
        // Love gift default
        noAtm: '1234567890',
        namaBank: 'Bank Central Asia',
        fotoQris: 'https://res.cloudinary.com/doykilt63/image/upload/v1772185007/udangan/sawer_me1xw1.png',
        noHp: '+628123456789',
      },
      include: {
        galery: true
      }
    });

    console.log('✅ Template created successfully!');
    console.log('Template ID:', template.id);
    console.log('Galery ID:', template.galeryId);
    console.log('Galery photos:', template.galery?.fotos.length);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTemplateForBadriana();
