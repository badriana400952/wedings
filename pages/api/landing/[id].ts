import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "@/lib/cloudinary";
import fs from "fs";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "ID tidak valid" });
  }

  // =============================
  // GET
  // =============================
  if (req.method === "GET") {
    try {
      let templateWeding = await prisma.templateWeding.findUnique({
        where: { userId: id },
        include: {
          user: true,
          galery: true,
          pertemuan: true,
          comments: true,
        },
      });

      if (!templateWeding) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }

      // Pastikan galery selalu ada
      if (!templateWeding.galery) {
        const newGalery = await prisma.galery.create({
          data: {
            fotos: [],
          },
        });

        templateWeding = await prisma.templateWeding.update({
          where: { id: templateWeding.id },
          data: { galeryId: newGalery.id },
          include: {
            user: true,
            galery: true,
            pertemuan: true,
            comments: true,
          },
        });
      }

      return res.status(200).json({ response: templateWeding });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // =============================
  // PUT (UPDATE + UPLOAD)
  // =============================
  if (req.method === "PUT") {
    try {
      console.log('📥 Received PUT request for user:', id);
      
      const form = formidable({ multiples: true });

      const { fields, files } = await new Promise<{
        fields: any;
        files: any;
      }>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

      console.log('📦 Files received:', Object.keys(files));
      console.log('📝 Fields received:', Object.keys(fields));

      const getValue = (field: any) =>
        Array.isArray(field) ? field[0] : field;

      const uploadToCloudinary = async (file: any) => {
        if (!file) return undefined;

        const uploaded = await cloudinary.uploader.upload(file.filepath, {
          folder: "wedding",
        });

        fs.unlinkSync(file.filepath); // hapus file temp

        return uploaded.secure_url;
      };

      const toBoolean = (val: any, defaultVal = true) => {
        if (val === undefined || val === null || val === "") return defaultVal;
        return String(val) === "true" || val === true;
      };

      const updateData: any = {
        namaPutra: getValue(fields.namaPutra) || "",
        namaLengkapPutra: getValue(fields.namaLengkapPutra) || "",
        namaAyahPutra: getValue(fields.namaAyahPutra) || "",
        namaIbuPutra: getValue(fields.namaIbuPutra) || "",
        kelahiranPutra: getValue(fields.kelahiranPutra) || "",
        instagramPutra: getValue(fields.instagramPutra) || "",
        namaPutri: getValue(fields.namaPutri) || "",
        namaLengkapPutri: getValue(fields.namaLengkapPutri) || "",
        namaAyahPutri: getValue(fields.namaAyahPutri) || "",
        namaIbuPutri: getValue(fields.namaIbuPutri) || "",
        kelahiranPutri: getValue(fields.kelahiranPutri) || "",
        instagramPutri: getValue(fields.instagramPutri) || "",
        linkGoogleCalender: getValue(fields.linkGoogleCalender) || "",
        alamatGedungPernikahan: getValue(fields.alamatGedungPernikahan) || "",
        alamatPernikahan: getValue(fields.alamatPernikahan) || "",
        jamMulai: getValue(fields.jamMulai) || "",
        jamResepsi: getValue(fields.jamResepsi) || "",
        jamSelesai: getValue(fields.jamSelesai) || "",
        linkMaps: getValue(fields.linkMaps) || "",
        jamAkad: getValue(fields.jamAkad) || "",
        lokasiAkad: getValue(fields.lokasiAkad) || "",
        alamatAkad: getValue(fields.alamatAkad) || "",
        lokasiResepsi: getValue(fields.lokasiResepsi) || "",
        noAtm: getValue(fields.noAtm) || "",
        namaBank: getValue(fields.namaBank) || "",
        noHp: getValue(fields.noHp) || "",
        isGiftActive: toBoolean(getValue(fields.isGiftActive), true),
        isBankActive: toBoolean(getValue(fields.isBankActive), true),
        isQrisActive: toBoolean(getValue(fields.isQrisActive), true),
        designTheme: getValue(fields.designTheme) || "MODERN",
      };

      // Gambar Bersama: hanya ditulis bila dikirim, supaya simpan form utama
      // tidak menimpa pilihan "Dipakai di" yang sudah disetel di tab Gambar Bersama.
      if (fields.bersamaFotos !== undefined) {
        const raw = getValue(fields.bersamaFotos);
        updateData.bersamaFotos = (Array.isArray(raw) ? raw : String(raw ?? "").split(","))
          .map((v: any) => String((v && typeof v === "object" ? v.url : v) ?? "").trim())
          .filter(Boolean)
          .slice(0, 6);
      }
      if (fields.bersamaDipakai !== undefined) {
        const dipakai = String(getValue(fields.bersamaDipakai) ?? "");
        updateData.bersamaDipakai = ["taman", "cerita"].includes(dipakai) ? dipakai : "taman";
      }

      // tanggalPernikahan
      if (fields.tanggalPernikahan && getValue(fields.tanggalPernikahan)) {
        updateData.tanggalPernikahan = new Date(
          getValue(fields.tanggalPernikahan)
        );
      }

      // tanggalAkad
      if (fields.tanggalAkad && getValue(fields.tanggalAkad)) {
        updateData.tanggalAkad = new Date(
          getValue(fields.tanggalAkad)
        );
      }

      // tanggalResepsi
      if (fields.tanggalResepsi && getValue(fields.tanggalResepsi)) {
        updateData.tanggalResepsi = new Date(
          getValue(fields.tanggalResepsi)
        );
      }

      // =============================
      // HANDLE FILES (UPLOAD)
      // =============================

      const handleFile = async (
        fileKey: string,
        fieldKey: string
      ) => {
        if (files[fileKey]) {
          const file = Array.isArray(files[fileKey])
            ? files[fileKey][0]
            : files[fileKey];

          console.log(`📸 Uploading ${fieldKey}:`, file.originalFilename);
          const uploadedUrl = await uploadToCloudinary(file);
          if (uploadedUrl) {
            console.log(`✅ ${fieldKey} uploaded:`, uploadedUrl);
            updateData[fieldKey] = uploadedUrl;
          }
        } else if (fields[fieldKey]) {
          const value = getValue(fields[fieldKey]);
          console.log(`📝 Keeping existing ${fieldKey}:`, value?.substring(0, 50));
          updateData[fieldKey] = value;
        }
      };

      await handleFile("fotoHeader", "fotoHeader");
      await handleFile("fotoHeader2", "fotoHeader2");
      await handleFile("fotoHeader3", "fotoHeader3");
      await handleFile("fotoHeader4", "fotoHeader4");
      await handleFile("photoPutra", "photoPutra");
      await handleFile("photoPutri", "photoPutri");
      await handleFile("fotoQris", "fotoQris");

      const updated = await prisma.templateWeding.update({
        where: { userId: id },
        data: updateData,
      });

      return res.status(200).json({
        success: true,
        message: "Data berhasil diupdate",
        data: updated,
      });
    } catch (error: any) {
      console.error("❌ ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Gagal mengupdate data",
        details: error.message,
      });
    }
  }

  return res.status(405).json({
    message: "Method not allowed",
  });
}