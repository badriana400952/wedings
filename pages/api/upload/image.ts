import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  const form = formidable({ multiples: true });

  const parseForm = (): Promise<{ fields: any; files: any }> => {
    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });
  };

  try {
    const { files } = await parseForm();
    
    // Handle single or multiple files
    const fileArray = Array.isArray(files.file) ? files.file : [files.file];
    const uploadedUrls: string[] = [];

    for (const file of fileArray) {
      if (!file) continue;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: 'udangan/gallery',
        resource_type: 'auto',
      });

      uploadedUrls.push(result.secure_url);

      // Delete temp file
      fs.unlinkSync(file.filepath);
    }

    return res.status(200).json({
      success: true,
      message: 'Upload berhasil',
      urls: uploadedUrls,
    });
  } catch (error: any) {
    console.error('❌ Upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal upload gambar',
      error: error.message,
    });
  }
}
