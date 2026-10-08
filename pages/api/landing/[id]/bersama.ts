import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

const BERSAMA_MAX = 6;

/**
 * Endpoint khusus "Gambar Bersama".
 * Sengaja dipisah dari PUT /api/landing/[id] karena endpoint tersebut membangun
 * updateData dari SELURUH field dengan default "", sehingga partial update
 * akan menimpa data yang lain dengan kosong.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== 'PUT' && req.method !== 'POST') {
    res.setHeader('Allow', ['PUT', 'POST']);
    return res.status(405).json({ success: false, message: 'Method tidak diizinkan' });
  }

  if (typeof id !== 'string' || !id) {
    return res.status(400).json({ success: false, message: 'ID user tidak valid' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

    const raw = body.bersamaFotos;
    const list = (Array.isArray(raw) ? raw : String(raw ?? '').split(','))
      .map((v: any) => String((v && typeof v === 'object' ? v.url : v) ?? '').trim())
      .filter(Boolean)
      .slice(0, BERSAMA_MAX);

    const dipakai = body.bersamaDipakai === 'cerita' ? 'cerita' : 'taman';

    const updated = await prisma.templateWeding.update({
      where: { userId: id },
      data: {
        bersamaFotos: list,
        bersamaDipakai: dipakai,
      },
      select: { bersamaFotos: true, bersamaDipakai: true },
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error menyimpan Gambar Bersama:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal menyimpan Gambar Bersama',
      error: error?.message,
    });
  }
}
