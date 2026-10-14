import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const MUSIC_DIR = path.join('C:\\Users\\USER.DESKTOP-UQ662UT.000\\Downloads\\musik weding');
const FOLDER = 'wedding/music';

function capitalizeWords(s: string) {
  return s
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w+\b/g, (m) => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase());
}

function beautifyFilename(filename: string) {
  const base = path.basename(filename, path.extname(filename));
  // remove common suffixes/prefixes & numbers
  let cleaned = base
    .replace(/^\d+\s*[-_.]?\s*/i, '')
    .replace(/\b(bg[m]?|music|wedding|ceremony|invitation|piano|romantic|inspiring|love|garden|glow|bgm)\b/gi, '')
    .replace(/[-_.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) cleaned = base;
  return capitalizeWords(cleaned);
}

function inferSinger(filename: string) {
  const base = path.basename(filename, path.extname(filename));
  const m = base.match(/^\d*\s*[-_.]?\s*(alex[-_.]?morgan|kiravale|paulyudin|leberch|atlasaudio)[-_.]?\s*/i);
  if (m) {
    const map: Record<string, string> = {
      'alex-morgan': 'Alex Morgan',
      'alex.morgan': 'Alex Morgan',
      'alex_morgan': 'Alex Morgan',
      kiravale: 'Kiravale',
      paulyudin: 'Paulyudin',
      leberch: 'Leberch',
      atlasaudio: 'Atlasaudio',
    };
    const key = m[1].toLowerCase().replace(/[^a-z]/g, '');
    if (map[key]) return map[key];
  }
  // fallback: extract first token-ish
  const parts = beautifyFilename(filename).split(' ');
  if (parts.length <= 2) return '';
  return parts[0]; // rough
}

async function main() {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error('❌ CLOUDINARY_CLOUD_NAME missing');
    process.exit(1);
  }

  if (!fs.existsSync(MUSIC_DIR)) {
    console.error('❌ Folder tidak ditemukan:', MUSIC_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(MUSIC_DIR).filter(f => f.toLowerCase().endsWith('.mp3'));
  if (files.length === 0) {
    console.error('❌ Tidak ada file .mp3 di folder');
    process.exit(1);
  }

  console.log('🎵 Mulai upload & sinkron musik ke DB');
  console.log('📁 Folder:', MUSIC_DIR);
  console.log('☁️  Cloudinary folder:', FOLDER);
  console.log('🔢 Jumlah file:', files.length);

  for (const fname of files) {
    const fullPath = path.join(MUSIC_DIR, fname);
    const judul = beautifyFilename(fname);
    const penyanyi = inferSinger(fname) || 'Unknown';

    // cek existing by file? atau judul mirip
    const existing = await prisma.musik.findFirst({
      where: {
        OR: [
          { file: { contains: fname } },
          { judul: { equals: judul, mode: 'insensitive' } },
        ],
      },
    });
    if (existing) {
      console.log(`↺ Skip (exists): ${judul} -> ${existing.file}`);
      continue;
    }

    try {
      console.log(`⬆️  Uploading: ${fname}`);
      const res = await cloudinary.uploader.upload(fullPath, {
        resource_type: 'video', // mp3 dianggap video/audio
        folder: FOLDER,
        public_id: path.basename(fname, '.mp3'),
        overwrite: false,
      });
      const secureUrl = res.secure_url;

      await prisma.musik.create({
        data: {
          judul,
          penyanyi,
          file: secureUrl,
        },
      });
      console.log(`✅ Added: ${judul} [${penyanyi}]`);
      console.log(`   -> ${secureUrl}`);
    } catch (err) {
      console.error(`❌ Failed ${fname}:`, err);
    }
  }

  const total = await prisma.musik.count();
  console.log(`🎵 Total musik di DB: ${total}`);
}

main()
  .catch(e => {
    console.error('Fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
