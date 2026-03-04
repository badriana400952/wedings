import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "@/lib/cloudinary";
import multer from "multer";

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ storage: multer.memoryStorage() });

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: any
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "ID tidak valid" });
  }

  // =========================
  // GET
  // =========================
  if (req.method === "GET") {
    try {
      const response = await prisma.templateWeding.findUnique({
        where: { userId: id },
        include: {
          user: true,
          galery: true,
          pertemuan: true,
          comments: true,
        },
      });

      if (!response) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }

      return res.status(200).json({ response });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error,
      });
    }
  }

  // =========================
  // POST (UPLOAD CLOUDINARY)
  // =========================
  if (req.method === "POST") {
    try {
      await runMiddleware(
        req,
        res,
        upload.fields([
          { name: "fotoHeader" },
          { name: "photoPutra" },
          { name: "photoPutri" },
          { name: "fotoQris" },
        ])
      );

      const files = req.files as any;

      const uploadImage = async (file: any) => {
        if (!file) return null;

        const base64 = `data:${file.mimetype};base64,${file.buffer.toString(
          "base64"
        )}`;

        const result = await cloudinary.uploader.upload(base64, {
          folder: "wedding",
        });

        return result.secure_url;
      };

      const fotoHeaderUrl = await uploadImage(files?.fotoHeader?.[0]);
      const photoPutraUrl = await uploadImage(files?.photoPutra?.[0]);
      const photoPutriUrl = await uploadImage(files?.photoPutri?.[0]);
      const fotoQrisUrl = await uploadImage(files?.fotoQris?.[0]);

      const {
        namaPutra,
        namaLengkapPutra,
        namaAyahPutra,
        namaIbuPutra,
        instagramPutra,
        namaPutri,
        namaLengkapPutri,
        namaAyahPutri,
        namaIbuPutri,
        instagramPutri,
        tanggalPernikahan,
        linkGoogleCalender,
        alamatPernikahan,
        jamMulai,
        jamSelesai,
        linkMaps,
        noAtm,
        namaBank,
        noHp,
        galeryId,
        pertemuanId,
        comentIds,
      } = req.body;

      const responses = await prisma.templateWeding.create({
        data: {
          userId: id, // pakai dari query
       fotoHeader: fotoHeaderUrl ?? undefined,
          photoPutra: photoPutraUrl ?? undefined,
          photoPutri: photoPutriUrl ?? undefined,
          fotoQris: fotoQrisUrl,
          namaPutra,
          namaLengkapPutra,
          namaAyahPutra,
          namaIbuPutra,
          instagramPutra,
          namaPutri,
          namaLengkapPutri,
          namaAyahPutri,
          namaIbuPutri,
          instagramPutri,
          tanggalPernikahan,
          linkGoogleCalender,
          alamatPernikahan,
          jamMulai,
          jamSelesai,
          linkMaps,
          noAtm,
          namaBank,
          noHp,
          galeryId,
          pertemuanId,
          comentIds,
        },
      });

      return res.status(201).json({ res: responses });
    } catch (error) {
      return res.status(500).json({
        errors: "Failed data to created",
        error,
      });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}