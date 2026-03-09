import { prisma } from '../lib/prisma.ts';

async function checkUserGalery() {
  try {
    // Cari user badriana
    const user = await prisma.user.findUnique({
      where: {
        email: 'badriana@undangan.com'
      },
      include: {
        templateWeding: {
          include: {
            galery: true
          }
        }
      }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('User:', user.email);
    console.log('User ID:', user.id);
    console.log('Template:', user.templateWeding ? 'EXISTS' : 'NOT EXISTS');
    
    if (user.templateWeding) {
      console.log('Template ID:', user.templateWeding.id);
      console.log('Galery ID:', user.templateWeding.galeryId);
      console.log('Galery:', user.templateWeding.galery ? 'EXISTS' : 'NOT EXISTS');
      
      if (user.templateWeding.galery) {
        console.log('Galery photos count:', user.templateWeding.galery.fotos.length);
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserGalery();
