import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  }

  try {
    const { templateWedingId } = req.query;

    // If templateWedingId provided, filter by it
    const whereClause = templateWedingId && typeof templateWedingId === 'string'
      ? { templateWedingId }
      : {};

    const [comments, likes, present, absent] = await Promise.all([
      prisma.comment.count({ where: whereClause }),
      prisma.like.count({
        where: {
          comment: {
            ...whereClause,
          },
        },
      }),
      prisma.comment.count({ 
        where: { 
          ...whereClause,
          presence: true 
        } 
      }),
      prisma.comment.count({ 
        where: { 
          ...whereClause,
          presence: false 
        } 
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        comments,
        likes,
        present,
        absent,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to fetch stats' 
    });
  }
}
