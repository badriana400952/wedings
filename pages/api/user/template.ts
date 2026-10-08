import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { template } = req.body;
  if (!template || typeof template !== "string") {
    return res.status(400).json({ message: "Template harus diisi (contoh: 'A', 'B', 'C')" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { template },
      select: {
        id: true,
        email: true,
        name: true,
        template: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Template berhasil diperbarui",
      user: updatedUser,
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
