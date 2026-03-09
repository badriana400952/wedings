import { prisma } from '../lib/prisma.ts';

async function checkIzzah() {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: 'izzah@undangan.com'
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
    console.log('Template field:', user.template);
    console.log('Template exists:', user.templateWeding ? 'YES' : 'NO');
    
    if (user.templateWeding) {
      console.log('\nTemplate Data:');
      console.log('- namaPutra:', user.templateWeding.namaPutra);
      console.log('- namaPutri:', user.templateWeding.namaPutri);
      console.log('- fotoHeader:', user.templateWeding.fotoHeader?.substring(0, 50) + '...');
      console.log('- photoPutra:', user.templateWeding.photoPutra?.substring(0, 50) + '...');
      console.log('- photoPutri:', user.templateWeding.photoPutri?.substring(0, 50) + '...');
      console.log('- Galery ID:', user.templateWeding.galeryId);
      console.log('- Galery photos:', user.templateWeding.galery?.fotos.length || 0);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkIzzah();
