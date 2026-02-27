import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query
    if (typeof id !== "string") {
        return res.status(400).json({ message: "ID tidak valid" })
    }
    if (req.method === "GET") {
        try {
            const response = await prisma.templateWeding.findUnique({
                where: {
                    userId: id
                },
                include: {
                    user: true,
                    galery: true,
                    pertemuan: true,
                    comments: true,
                }
            })

            if (!response) {
                return res.status(404).json({ message: "Data tidak ditemukan" })
            }
            return res.status(200).json({ response })
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: "Internal server error",
                error
            })
        }
    }
    if (req.method === "POST") {
        try {
            const { userId, fotoHeader, namaPutra, namaLengkapPutra, namaAyahPutra, namaIbuPutra, instagramPutra, photoPutra, namaPutri, namaLengkapPutri, namaAyahPutri, namaIbuPutri, instagramPutri, photoPutri, tanggalPernikahan, linkGoogleCalender, alamatPernikahan, jamMulai, jamSelesai, linkMaps, noAtm, namaBank, fotoQris, noHp, galeryId, pertemuanId, comentIds } = req.body
            const responses = await prisma.templateWeding.create({
                data: {
                    userId, fotoHeader, namaPutra, namaLengkapPutra, namaAyahPutra, namaIbuPutra, instagramPutra, photoPutra, namaPutri, namaLengkapPutri, namaAyahPutri, namaIbuPutri, instagramPutri, photoPutri, tanggalPernikahan, linkGoogleCalender, alamatPernikahan, jamMulai, jamSelesai, linkMaps, noAtm, namaBank, fotoQris, noHp, galeryId, pertemuanId, comentIds

                }
            })
            return res.status(201).json({ res: responses })
        } catch (error) {
            return res.status(500).json({ errors: 'Failed data to created', error })
        }
    }
}