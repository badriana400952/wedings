import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

/**
 * Endpoint khusus pemilihan musik latar per undangan.
 * Dipisah dari PUT /api/landing/[id] karena endpoint itu membangun updateData
 * dari SELURUH field dengan default "", sehingga partial update akan menimpa
 * data lain. Di sini hanya kolom musikId yang ditulis.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query; // userId

  if (req.method !== 'PUT' && req.method !== 'POST') {
    res.setHeader('Allow', ['PUT', 'POST']);
    return res.status(405).json({ success: false, message: 'Method tidak diizinkan' });
  }

  if (typeof id !== 'string' || !id) {
    return res.status(400).json({ success: false, message: 'ID user tidak valid' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const musikId = typeof body.musikId === 'string' && body.musikId ? body.musikId : null;

    if (musikId) {
      let exists = false;
      if ((prisma as any).musik) {
        const found = await (prisma as any).musik.findUnique({ where: { id: musikId } });
        exists = !!found;
      } else {
        const rows: any[] = await prisma.$queryRawUnsafe(
          `SELECT id FROM "musik" WHERE id = $1 LIMIT 1`,
          musikId
        );
        exists = Boolean(rows && rows.length > 0);
      }

      if (!exists) {
        return res.status(404).json({ success: false, message: 'Musik tidak ditemukan' });
      }
    }

    let updated: any = null;

    try {
      updated = await (prisma.templateWeding as any).update({
        where: { userId: id },
        data: { musikId },
        select: {
          musikId: true,
          musik: {
            select: { id: true, judul: true, penyanyi: true, file: true },
          },
        },
      });
    } catch (prismaUpdateError: any) {
      console.warn('Prisma Client model update failed, using raw SQL fallback:', prismaUpdateError?.message);
      // Fallback update via raw query to ensure update succeeds regardless of stale Prisma client runtime
      await prisma.$executeRawUnsafe(
        `UPDATE "template_wedings" SET "musik_id" = $1, "updated_at" = NOW() WHERE "user_id" = $2`,
        musikId,
        id
      );

      let musikData: any = null;
      if (musikId) {
        try {
          const rows: any[] = await prisma.$queryRawUnsafe(
            `SELECT id, judul, penyanyi, file FROM "musik" WHERE id = $1 LIMIT 1`,
            musikId
          );
          musikData = rows && rows.length > 0 ? rows[0] : null;
        } catch (mErr) {
          console.warn('Raw query musik select warning:', mErr);
        }
      }

      updated = {
        musikId,
        musik: musikData,
      };
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error menyimpan musik:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal menyimpan musik',
      error: error?.message,
    });
  }
}
