import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

const MAX_NAME = 80;
const MAX_UCAPAN = 2000;
const MAX_PAGE = 100;

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { templateWedingId, limit, offset } = req.query;

      if (!templateWedingId || typeof templateWedingId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'templateWedingId is required'
        });
      }

      const take = readInt(limit, 0, MAX_PAGE);
      const skip = readInt(offset, 0, 100000);
      const paginated = take > 0;

      const where = { templateWedingId };

      const [ucapanList, total] = await Promise.all([
        prisma.ucapanHarapan.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: paginated ? take : undefined,
          skip: paginated ? skip : undefined,
        }),
        prisma.ucapanHarapan.count({ where }),
      ]);

      return res.status(200).json({
        success: true,
        ucapan: ucapanList,
        total,
        offset: paginated ? skip : 0,
        hasMore: paginated ? skip + ucapanList.length < total : false,
      });
    } catch (error) {
      console.error('Error fetching ucapan:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch ucapan'
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, ucapan, templateWedingId } = req.body;

      if (!name || !ucapan || !templateWedingId) {
        return res.status(400).json({
          success: false,
          error: 'Name, ucapan, and templateWedingId are required'
        });
      }

      const cleanName = cleanText(name, MAX_NAME);
      const cleanUcapan = cleanText(ucapan, MAX_UCAPAN);
      if (!cleanName || !cleanUcapan) {
        return res.status(400).json({
          success: false,
          error: 'Name and ucapan are required'
        });
      }

      const templateWeding = await prisma.templateWeding.findUnique({
        where: { id: templateWedingId },
        select: { id: true },
      });
      if (!templateWeding) {
        return res.status(404).json({
          success: false,
          error: 'Template wedding not found'
        });
      }

      const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      const created = await prisma.ucapanHarapan.create({
        data: {
          name: cleanName,
          ucapan: cleanUcapan,
          ip: Array.isArray(ip) ? ip[0] : ip,
          userAgent,
          templateWedingId,
        },
      });

      return res.status(201).json({
        success: true,
        ucapan: created,
      });
    } catch (error) {
      console.error('Error creating ucapan:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create ucapan'
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  });
}