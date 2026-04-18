import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [comments, likes, present, absent] = await Promise.all([
      prisma.comment.count(),
      prisma.like.count(),
      prisma.comment.count({ where: { presence: true } }),
      prisma.comment.count({ where: { presence: false } }),
    ]);

    return res.status(200).json({
      data: {
        comments,
        likes,
        present,
        absent,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
