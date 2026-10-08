import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { RSVP_PREFIX, readCommentKind, stripRsvpPrefix } from '@/lib/comment-kind';

const MAX_NAME = 80;
const MAX_COMMENT = 2000;
const SESSION_COOKIE = 'session_id';
const SESSION_MAX_AGE = 60 * 60 * 24 * 365;

function readInt(value: unknown, fallback: number, max: number): number {
  const n = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return Math.min(n, max);
}

function cleanText(value: unknown, max: number): string {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function newSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { templateWedingId, kind, limit, offset } = req.query;

      if (!templateWedingId || typeof templateWedingId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'templateWedingId is required'
        });
      }

      const requestedKind = readCommentKind(kind);
      const kindFilter =
        requestedKind === 'rsvp'
          ? { comment: { startsWith: RSVP_PREFIX } }
          : requestedKind === 'wish'
            ? { NOT: { comment: { startsWith: RSVP_PREFIX } } }
            : {};

      const take = readInt(limit, 0, 100);
      const skip = readInt(offset, 0, 100000);

      const where = {
        templateWedingId,
        parentId: null, // Only get top-level comments
        ...kindFilter,
      };

      const paginated = take > 0;

      // Cookie `session_id` dibuat di sini juga supaya status "sudah saya suka" bisa
      // dipulihkan saat halaman dimuat ulang, bukan hanya sesudah tamu menekan like.
      const existingSession = req.cookies[SESSION_COOKIE];
      const sessionId = existingSession && existingSession.length > 0 ? existingSession : newSessionId();
      if (!existingSession) {
        res.setHeader(
          'Set-Cookie',
          `${SESSION_COOKIE}=${sessionId}; Max-Age=${SESSION_MAX_AGE}; Path=/; HttpOnly; SameSite=Lax`
        );
      }

      const [comments, total] = await Promise.all([
        prisma.comment.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: paginated ? take : undefined,
          skip: paginated ? skip : undefined,
          include: {
            replies: {
              orderBy: { createdAt: 'asc' },
            },
            likedBy: {
              where: { sessionId },
              select: { sessionId: true },
            },
          },
        }),
        prisma.comment.count({ where }),
      ]);

      const payload = comments.map(({ likedBy, ...rest }) => ({
        ...rest,
        liked: likedBy.length > 0,
      }));

      return res.status(200).json({
        success: true,
        comments: payload,
        total,
        offset: paginated ? skip : 0,
        hasMore: paginated ? skip + comments.length < total : false,
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
      const { name, presence, comment, gif, parentId, templateWedingId, kind } = req.body;

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

      const cleanName = cleanText(name, MAX_NAME);
      let cleanComment = cleanText(comment, MAX_COMMENT);

      if (!cleanName || !cleanComment) {
        return res.status(400).json({
          success: false,
          error: 'Name, presence, and comment are required'
        });
      }

      // Cegah tamu menyamar jadi baris RSVP dengan mengetik awalan marker secara manual.
      if (readCommentKind(kind) !== 'rsvp') {
        cleanComment = stripRsvpPrefix(cleanComment);
        if (!cleanComment) {
          return res.status(400).json({
            success: false,
            error: 'Comment is required'
          });
        }
      }

      // Get IP and User Agent
      const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      const newComment = await prisma.comment.create({
        data: {
          name: cleanName,
          presence,
          comment: cleanComment,
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
