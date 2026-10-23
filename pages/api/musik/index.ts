import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

// Katalog musik bawaan. Dipakai untuk mengisi tabel `musik` saat masih kosong,
// supaya fitur pemilihan musik langsung bisa dipakai tanpa seed manual.
const DEFAULT_MUSIK = [
  {
    judul: "Pure Love",
    penyanyi: "Oleksii Kaplunskyi",
    file: "/assets/music/music.mp3",
  },
  {
    judul: "Wedding",
    penyanyi: "MegaJackie",
    file: "/assets/music/wedding.mp3",
  },
  {
    judul: "Ceremony Wedding Invitation",
    penyanyi: "Alex Morgan",
    file: "/assets/music/alex-morgan-ceremony-wedding-invitation-music-583281.mp3",
  },
  {
    judul: "Garden Ceremony Glow",
    penyanyi: "Alex Morgan",
    file: "/assets/music/alex-morgan-wedding-garden-ceremony-glow-578500.mp3",
  },
  {
    judul: "Love",
    penyanyi: "Atlas Audio",
    file: "/assets/music/atlasaudio-love-594867.mp3",
  },
  {
    judul: "Love BGM",
    penyanyi: "Kira Vale",
    file: "/assets/music/kiravale-love-bgm-598115.mp3",
  },
  {
    judul: "Sweet Wedding",
    penyanyi: "Leberch",
    file: "/assets/music/leberch-wedding-584482.mp3",
  },
  {
    judul: "Romantic Inspiring Piano",
    penyanyi: "Paul Yudin",
    file: "/assets/music/paulyudin-romantic-wedding-inspiring-piano-376014.mp3",
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    let musik: any[] = [];
    try {
      if ((prisma as any).musik) {
        musik = await (prisma as any).musik.findMany({
          orderBy: { createdAt: "asc" },
        });

        // Isi otomatis katalog bawaan bila tabel masih kosong.
        if (musik.length === 0) {
          await (prisma as any).musik.createMany({
            data: DEFAULT_MUSIK,
            skipDuplicates: true,
          });
          musik = await (prisma as any).musik.findMany({
            orderBy: { createdAt: "asc" },
          });
        }
      } else {
        const rows: any[] = await prisma.$queryRawUnsafe(
          `SELECT id, judul, penyanyi, file, created_at as "createdAt" FROM "musik" ORDER BY "created_at" ASC`
        );
        musik = rows && rows.length > 0 ? rows : DEFAULT_MUSIK;
      }
    } catch (dbErr: any) {
      console.warn("Query musik DB fallback warning:", dbErr?.message);
      musik = DEFAULT_MUSIK;
    }

    return res.status(200).json({ success: true, musik });
  } catch (error: any) {
    console.error("Gagal mengambil daftar musik:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil daftar musik",
      error: error?.message,
    });
  }
}
