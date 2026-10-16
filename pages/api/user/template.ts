import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT" && req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  let targetUserId = session?.user?.id || (req.body?.userId as string) || null;

  try {
    if (!targetUserId) {
      // Fallback: Cari user pertama di database jika sesi belum login
      const firstUser = await prisma.user.findFirst({
        select: { id: true, name: true, template: true },
        orderBy: { createdAt: "asc" },
      });
      if (firstUser) {
        targetUserId = firstUser.id;
      }
    }

    if (!targetUserId) {
      return res.status(401).json({ message: "Pengguna tidak ditemukan atau belum login" });
    }

    const { template } = req.body;
    if (!template || typeof template !== "string") {
      return res.status(400).json({ message: "Template harus diisi (contoh: 'A', 'B', 'C', 'D', 'E')" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { template: template.toUpperCase() },
      select: {
        id: true,
        email: true,
        name: true,
        template: true,
      },
    });

    const redirectSlug = updatedUser.name ? encodeURIComponent(updatedUser.name) : updatedUser.id;

    return res.status(200).json({
      success: true,
      message: `Template berhasil diperbarui ke Template ${updatedUser.template}`,
      user: updatedUser,
      redirectUrl: `/${redirectSlug}`,
    });
  } catch (error: any) {
    console.error("Gagal update template:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
}
