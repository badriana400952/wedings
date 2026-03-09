import { prisma } from '../lib/prisma.ts';

async function fixMissingGalery() {
  try {
    // Cari semua templateWeding yang belum punya galery
    const templatesWithoutGalery = await prisma.templateWeding.findMany({
      where: {
        galeryId: null
      },
      include: {
        user: true
      }
    });

    console.log(`Found ${templatesWithoutGalery.length} templates without galery`);

    for (const template of templatesWithoutGalery) {
      // Buat galery baru
      const galery = await prisma.galery.create({
        data: {
          fotos: [
            'https://res.cloudinary.com/doykilt63/image/upload/v1772183469/udangan/bg_ogyqgr.webp',
            'https://res.cloudinary.com/doykilt63/image/upload/v1772183476/udangan/cowo_ycc5zu.webp',
            'https://res.cloudinary.com/doykilt63/image/upload/v1772183473/udangan/cewe_ygjnrf.webp',
          ],
        },
      });

      // Update template dengan galery ID
      await prisma.templateWeding.update({
        where: { id: template.id },
        data: { galeryId: galery.id }
      });

      console.log(`✅ Created galery for user: ${template.user.email} (${template.userId})`);
    }

    console.log('✅ All done!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixMissingGalery();
