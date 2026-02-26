import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id: commentId } = req.query;

    if (typeof commentId !== 'string') {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }

    // Get or create session ID from cookie
    const sessionId = req.cookies.session_id || 
      `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        commentId_sessionId: {
          commentId,
          sessionId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id },
      });

      await prisma.comment.update({
        where: { id: commentId },
        data: { likesCount: { decrement: 1 } },
      });

      return res.status(200).json({ liked: false });
    } else {
      // Like
      await prisma.like.create({
        data: {
          commentId,
          sessionId,
        },
      });

      await prisma.comment.update({
        where: { id: commentId },
        data: { likesCount: { increment: 1 } },
      });

      // Set cookie
      res.setHeader(
        'Set-Cookie',
        `session_id=${sessionId}; Max-Age=${60 * 60 * 24 * 365}; Path=/; HttpOnly; SameSite=Lax`
      );

      return res.status(200).json({ liked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return res.status(500).json({ error: 'Failed to toggle like' });
  }
}
