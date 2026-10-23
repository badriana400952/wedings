import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);

    let targetUserId = (session?.user as any)?.id;

    // Fallback jika belum login saat pengujian lokal
    if (!targetUserId) {
      const firstUser = await prisma.user.findFirst({
        select: { id: true },
      });
      if (firstUser) {
        targetUserId = firstUser.id;
      }
    }

    if (!targetUserId) {
      return res.status(401).json({
        success: false,
        message: 'Pengguna tidak ditemukan atau belum login.',
      });
    }

    if (req.method === 'GET') {
      const templateWeding = await (prisma as any).templateWeding.findUnique({
        where: { userId: targetUserId },
        select: { customContent: true },
      });

      return res.status(200).json({
        success: true,
        customContent: templateWeding?.customContent || {},
      });
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const { templateCode, content } = req.body || {};

      if (!templateCode || typeof content !== 'object') {
        return res.status(400).json({
          success: false,
          message: 'Parameter templateCode dan content (objek) wajib diisi.',
        });
      }

      // Ambil data customContent saat ini untuk dilakukan deep merge per template
      const current = await (prisma as any).templateWeding.findUnique({
        where: { userId: targetUserId },
        select: { customContent: true },
      });

      const existingContent =
        typeof current?.customContent === 'object' && current?.customContent !== null
          ? (current.customContent as Record<string, any>)
          : {};

      const updatedContent = {
        ...existingContent,
        [templateCode]: {
          ...(existingContent[templateCode] || {}),
          ...content,
        },
      };

      const updated = await (prisma as any).templateWeding.update({
        where: { userId: targetUserId },
        data: {
          customContent: updatedContent,
        },
        select: { customContent: true },
      });

      return res.status(200).json({
        success: true,
        message: `Konten untuk Template ${templateCode} berhasil disimpan!`,
        customContent: updated.customContent,
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Gunakan GET atau PUT/POST.',
    });
  } catch (error: any) {
    console.error('Error in /api/user/custom-content:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server: ' + (error?.message || ''),
    });
  }
}
