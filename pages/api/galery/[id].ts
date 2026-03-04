import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query; // galeryId

  if (typeof id !== 'string') {
    return res.status(400).json({ 
      success: false,
      message: 'ID tidak valid' 
    });
  }

  // GET: Ambil galery by ID
  if (req.method === 'GET') {
    try {
      const galery = await prisma.galery.findUnique({
        where: { id },
        include: {
          templateWedings: true,
        },
      });

      if (!galery) {
        return res.status(404).json({ 
          success: false,
          message: 'Galery tidak ditemukan' 
        });
      }

      return res.status(200).json({
        success: true,
        data: galery,
      });
    } catch (error: any) {
      console.error('❌ Error fetching galery:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data galery',
        error: error.message,
      });
    }
  }

  // PUT: Update galery (replace semua foto)
  if (req.method === 'PUT') {
    try {
      const { fotos } = req.body;

      if (!Array.isArray(fotos)) {
        return res.status(400).json({
          success: false,
          message: 'Fotos harus berupa array',
        });
      }

      const updatedGalery = await prisma.galery.update({
        where: { id },
        data: {
          fotos,
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Galery berhasil diupdate',
        data: updatedGalery,
      });
    } catch (error: any) {
      console.error('❌ Error updating galery:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengupdate galery',
        error: error.message,
      });
    }
  }

  // PATCH: Update galery (tambah/hapus foto tertentu)
  if (req.method === 'PATCH') {
    try {
      const { action, foto } = req.body;

      if (!action || !foto) {
        return res.status(400).json({
          success: false,
          message: 'Action dan foto harus diisi',
        });
      }

      const galery = await prisma.galery.findUnique({
        where: { id },
      });

      if (!galery) {
        return res.status(404).json({
          success: false,
          message: 'Galery tidak ditemukan',
        });
      }

      let newFotos = [...galery.fotos];

      if (action === 'add') {
        // Tambah foto baru
        newFotos.push(foto);
      } else if (action === 'remove') {
        // Hapus foto tertentu
        newFotos = newFotos.filter(f => f !== foto);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Action harus "add" atau "remove"',
        });
      }

      const updatedGalery = await prisma.galery.update({
        where: { id },
        data: {
          fotos: newFotos,
        },
      });

      return res.status(200).json({
        success: true,
        message: `Foto berhasil ${action === 'add' ? 'ditambahkan' : 'dihapus'}`,
        data: updatedGalery,
      });
    } catch (error: any) {
      console.error('❌ Error patching galery:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengupdate galery',
        error: error.message,
      });
    }
  }

  // DELETE: Hapus galery
  if (req.method === 'DELETE') {
    try {
      await prisma.galery.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: 'Galery berhasil dihapus',
      });
    } catch (error: any) {
      console.error('❌ Error deleting galery:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal menghapus galery',
        error: error.message,
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed',
  });
}
