import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    const { id } = req.query;
    if (typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ucapan ID'
      });
    }

    const ucapan = await prisma.ucapanHarapan.findUnique({
      where: { id },
      include: {
        templateWeding: {
          select: { userId: true },
        },
      },
    });

    if (!ucapan) {
      return res.status(404).json({
        success: false,
        error: 'Ucapan not found'
      });
    }

    // Hanya pemilik undangan yang boleh menghapus ucapan di papan miliknya.
    if (ucapan.templateWeding?.userId !== session.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You can only delete ucapan from your own wedding invitation'
      });
    }

    await prisma.ucapanHarapan.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Ucapan deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting ucapan:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete ucapan',
      details: error?.message,
    });
  }
}