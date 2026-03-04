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
    // Check authentication
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
        error: 'Invalid comment ID' 
      });
    }

    // Get comment to verify ownership
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        templateWeding: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({ 
        success: false,
        error: 'Comment not found' 
      });
    }

    // Verify user owns the template wedding
    if (comment.templateWeding?.userId !== session.user.id) {
      return res.status(403).json({ 
        success: false,
        error: 'Forbidden: You can only delete comments from your own wedding invitation' 
      });
    }

    // Delete comment (cascade will delete replies and likes)
    await prisma.comment.delete({
      where: { id },
    });

    return res.status(200).json({ 
      success: true,
      message: 'Comment deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to delete comment',
      details: error.message,
    });
  }
}
