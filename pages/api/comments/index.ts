import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const comments = await prisma.comment.findMany({
        where: { parentId: null },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          replies: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      return res.status(200).json({ comments });
    } catch (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, presence, comment, gif, parentId } = req.body;

      if (!name || typeof presence !== 'boolean' || !comment) {
        return res.status(400).json({ error: 'Invalid input' });
      }

      // Get IP and User Agent
      const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      // Get first template_weding (or create one if doesn't exist)
      let templateWeding = await prisma.templateWeding.findFirst();
      
      if (!templateWeding) {
        // If no template exists, create a default one
        const firstUser = await prisma.user.findFirst();
        if (firstUser) {
          templateWeding = await prisma.templateWeding.create({
            data: {
              userId: firstUser.id,
              fotoHeader: '',
              namaPutra: '',
              namaLengkapPutra: '',
              namaAyahPutra: '',
              namaIbuPutra: '',
              instagramPutra: '',
              photoPutra: '',
              namaPutri: '',
              namaLengkapPutri: '',
              namaAyahPutri: '',
              namaIbuPutri: '',
              instagramPutri: '',
              photoPutri: '',
              tanggalPernikahan: new Date(),
              linkGoogleCalender: '',
              alamatPernikahan: '',
              jamMulai: '',
              jamSelesai: '',
              linkMaps: '',
            },
          });
        }
      }

      const newComment = await prisma.comment.create({
        data: {
          name,
          presence,
          comment,
          gif: gif || null,
          ip: Array.isArray(ip) ? ip[0] : ip,
          userAgent,
          parentId: parentId || null,
          templateWedingId: templateWeding?.id || null,
        },
      });

      return res.status(201).json({ comment: newComment });
    } catch (error) {
      console.error('Error creating comment:', error);
      return res.status(500).json({ error: 'Failed to create comment' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
