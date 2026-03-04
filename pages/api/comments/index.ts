import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { templateWedingId } = req.query;

      if (!templateWedingId || typeof templateWedingId !== 'string') {
        return res.status(400).json({ 
          success: false,
          error: 'templateWedingId is required' 
        });
      }

      const comments = await prisma.comment.findMany({
        where: { 
          templateWedingId: templateWedingId,
          parentId: null, // Only get top-level comments
        },
        orderBy: { createdAt: 'desc' },
        include: {
          replies: {
            orderBy: { createdAt: 'asc' },
          },
          likedBy: true,
        },
      });

      return res.status(200).json({ 
        success: true,
        comments 
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to fetch comments' 
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, presence, comment, gif, parentId, templateWedingId } = req.body;

      if (!name || typeof presence !== 'boolean' || !comment) {
        return res.status(400).json({ 
          success: false,
          error: 'Name, presence, and comment are required' 
        });
      }

      if (!templateWedingId) {
        return res.status(400).json({ 
          success: false,
          error: 'templateWedingId is required' 
        });
      }

      // Verify templateWeding exists
      const templateWeding = await prisma.templateWeding.findUnique({
        where: { id: templateWedingId },
      });

      if (!templateWeding) {
        return res.status(404).json({ 
          success: false,
          error: 'Template wedding not found' 
        });
      }

      // Get IP and User Agent
      const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      const newComment = await prisma.comment.create({
        data: {
          name,
          presence,
          comment,
          gif: gif || null,
          ip: Array.isArray(ip) ? ip[0] : ip,
          userAgent,
          parentId: parentId || null,
          templateWedingId: templateWedingId,
        },
        include: {
          replies: true,
          likedBy: true,
        },
      });

      return res.status(201).json({ 
        success: true,
        comment: newComment 
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to create comment' 
      });
    }
  }

  return res.status(405).json({ 
    success: false,
    error: 'Method not allowed' 
  });
}
