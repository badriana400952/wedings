import { prisma } from '../lib/prisma.ts';

async function fixBlobUrls() {
  try {
    // Cari semua template yang punya blob URL
    const templates = await prisma.templateWeding.findMany({
      where: {
        OR: [
          { photoPutra: { startsWith: 'blob:' } },
          { photoPutri: { startsWith: 'blob:' } },
          { fotoHeader: { startsWith: 'blob:' } },
          { fotoHeader2: { startsWith: 'blob:' } },
          { fotoHeader3: { startsWith: 'blob:' } },
          { fotoHeader4: { startsWith: 'blob:' } },
          { fotoQris: { startsWith: 'blob:' } },
        ]
      },
      include: {
        user: true
      }
    });

    console.log(`Found ${templates.length} templates with blob URLs`);

    for (const template of templates) {
      const updateData: any = {};

      // Reset ke default jika blob URL
      if (template.photoPutra?.startsWith('blob:')) {
        updateData.photoPutra = 'https://res.cloudinary.com/doykilt63/image/upload/v1772183476/udangan/cowo_ycc5zu.webp';
        console.log(`- Reset photoPutra for ${template.user.email}`);
      }
      if (template.photoPutri?.startsWith('blob:')) {
        updateData.photoPutri = 'https://res.cloudinary.com/doykilt63/image/upload/v1772183473/udangan/cewe_ygjnrf.webp';
        console.log(`- Reset photoPutri for ${template.user.email}`);
      }
      if (template.fotoHeader?.startsWith('blob:')) {
        updateData.fotoHeader = 'https://res.cloudinary.com/doykilt63/image/upload/v1772183469/udangan/bg_ogyqgr.webp';
        console.log(`- Reset fotoHeader for ${template.user.email}`);
      }
      if (template.fotoHeader2?.startsWith('blob:')) {
        updateData.fotoHeader2 = 'https://res.cloudinary.com/doykilt63/image/upload/v1772183469/udangan/bg_ogyqgr.webp';
        console.log(`- Reset fotoHeader2 for ${template.user.email}`);
      }
      if (template.fotoHeader3?.startsWith('blob:')) {
        updateData.fotoHeader3 = 'https://res.cloudinary.com/doykilt63/image/upload/v1772183469/udangan/bg_ogyqgr.webp';
        console.log(`- Reset fotoHeader3 for ${template.user.email}`);
      }
      if (template.fotoHeader4?.startsWith('blob:')) {
        updateData.fotoHeader4 = 'https://res.cloudinary.com/doykilt63/image/upload/v1772183469/udangan/bg_ogyqgr.webp';
        console.log(`- Reset fotoHeader4 for ${template.user.email}`);
      }
      if (template.fotoQris?.startsWith('blob:')) {
        updateData.fotoQris = 'https://res.cloudinary.com/doykilt63/image/upload/v1772185007/udangan/sawer_me1xw1.png';
        console.log(`- Reset fotoQris for ${template.user.email}`);
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.templateWeding.update({
          where: { id: template.id },
          data: updateData
        });
        console.log(`✅ Fixed blob URLs for ${template.user.email}`);
      }
    }

    console.log('\n✅ All done!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixBlobUrls();
