import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    const { email, password, template } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email dan password harus diisi' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password minimal 6 karakter' 
      });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Email sudah terdaftar' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Extract name from email (before @)
    const name = email.split('@')[0];

    // Create user dengan templateWeding dan galery default
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        accessKey: `access-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        template: template || 'A',
        templateWeding: {
          create: {
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
            
            // Create galery with default photos
            galery: {
              create: {
                fotos: [
                  'https://res.cloudinary.com/doykilt63/image/upload/v1772183469/udangan/bg_ogyqgr.webp',
                  'https://res.cloudinary.com/doykilt63/image/upload/v1772183476/udangan/cowo_ycc5zu.webp',
                  'https://res.cloudinary.com/doykilt63/image/upload/v1772183473/udangan/cewe_ygjnrf.webp',
                ],
              },
            },
          },
        },
      },
      include: {
        templateWeding: {
          include: {
            galery: true,
          },
        },
      },
    });

    console.log('✅ User registered successfully:', user.email);

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        userId: user.id,
        email: user.email,
        template: user.template,
      },
    });
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal melakukan registrasi',
      error: error.message,
    });
  }
}
