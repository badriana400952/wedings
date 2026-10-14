import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';
import { ITemplateWeding } from '@/prisma/schema.types';

// Import templates dari sentral modular
import {
  SimpleModern,
  TamanRahasia,
  KirigamiPastel,
  TumbuhBersama,
} from '@/components/templates';
import { useSession } from 'next-auth/react';

interface SlugPageProps {
  guestName: string | null;
  templateWedingData: ITemplateWeding | null;
  adminId: string;
  namaTemplate: string;
}

export default function SlugPage({guestName: initialGuestName, templateWedingData, adminId: propsAdminId, namaTemplate }: SlugPageProps) {
  const router = useRouter();
  const { data } = useSession();
  const [guestName, setGuestName] = useState<string | null>(initialGuestName);
  
  // Gunakan adminId dari props (URL) untuk guest
  const adminId = propsAdminId || data?.user?.id || '';
  const isAdminView = false; // Halaman undangan murni Read-Only untuk tamu
  useEffect(() => {
    if (!router.isReady) return;
    const { to, slug, ...rest } = router.query;
    if (typeof to === "string") {
      setGuestName(decodeURIComponent(to));
      return;
    }
    const keys = Object.keys(rest);

    if (keys.length > 0) {
      setGuestName(decodeURIComponent(keys[0]));
    }

  }, [router.isReady, router.query]);

  // Gunakan template dari database (namaTemplate) atau fallback ke session
  const templateToUse = namaTemplate || data?.user.template || 'A';

  switch (templateToUse) {
    case 'A':
      return (
        <SimpleModern
          adminId={adminId}
          guestName={guestName}
          templateWedingData={templateWedingData}
          isAdminView={false} 
        />
      );
    case 'B':
      return (
        <TamanRahasia
          adminId={adminId}
          guestName={guestName}
          templateWedingData={templateWedingData}
          isAdminView={false} 
        />
      );
    case 'C':
      return (
        <KirigamiPastel
          adminId={adminId}
          guestName={guestName}
          templateWedingData={templateWedingData}
          isAdminView={false} 
        />
      );
    case 'D':
      return (
        <TumbuhBersama
          adminId={adminId}
          guestName={guestName}
          templateWedingData={templateWedingData}
          isAdminView={false}
        />
      );
    default:
      // Default ke SimpleModern jika tidak ada template
      return (
        <SimpleModern
          adminId={adminId}
          guestName={guestName}
          isAdminView={false}
        />
      );
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string[] };

  // Format: /adminId atau /adminId/to/guestName
  let adminId = '';
  let guestName: string | null = null;

  if (slug.length === 1) {
    // Format: /adminId
    adminId = slug[0];
  } else if (slug.length >= 2 && slug[1] === 'to') {
    // Format: /adminId/to/guestName
    adminId = slug[0];
    guestName = slug.slice(2).join(' '); // Gabungkan semua bagian setelah 'to'
  } else {
    // Format tidak valid
    return {
      notFound: true,
    };
  }

  try {
    // Cari user berdasarkan adminId (bisa ID atau nama)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: adminId },
          { name: { equals: adminId, mode: 'insensitive' } },
          { email: adminId }
        ]
      },
      include: {
        templateWeding: {
          include: {
            galery: true,
            pertemuan: true,
            comments: true,
          }
        }
      }
    });

    if (!user) {
      return {
        notFound: true,
      };
    }

    let musikData: any = null;
    if (user.templateWeding) {
      let mId = (user.templateWeding as any).musikId || (user.templateWeding as any).musik_id;
      if (!mId && user.templateWeding.id) {
        try {
          const twRows: any[] = await prisma.$queryRawUnsafe(
            `SELECT musik_id FROM "template_wedings" WHERE id = $1 LIMIT 1`,
            user.templateWeding.id
          );
          if (twRows && twRows.length > 0) {
            mId = twRows[0].musik_id;
          }
        } catch (twErr) {
          console.warn('Gagal query musik_id:', twErr);
        }
      }

      if (mId) {
        try {
          const mRows: any[] = await prisma.$queryRawUnsafe(
            `SELECT id, judul, penyanyi, file FROM "musik" WHERE id = $1 LIMIT 1`,
            mId
          );
          if (mRows && mRows.length > 0) {
            musikData = mRows[0];
          }
        } catch (e) {
          console.warn('Gagal load musik undangan:', e);
        }
      }
    }

    // Convert Date objects to strings for JSON serialization
    const serializedTemplateWeding = user.templateWeding ? {
      ...user.templateWeding,
      // Relasi musik latar yang dipilih
      musik: musikData,
      audio: musikData?.file || (user.templateWeding as any).audio || null,
      // Zona waktu user dipakai template untuk label WIB/WITA/WIT pada jam acara.
      tz: user.tz || null,
      tanggalPernikahan: user.templateWeding.tanggalPernikahan ? user.templateWeding.tanggalPernikahan.toISOString() : null,
      tanggalAkad: user.templateWeding.tanggalAkad ? user.templateWeding.tanggalAkad.toISOString() : null,
      tanggalResepsi: user.templateWeding.tanggalResepsi ? user.templateWeding.tanggalResepsi.toISOString() : null,
      createdAt: user.templateWeding.createdAt ? user.templateWeding.createdAt.toISOString() : null,
      updatedAt: user.templateWeding.updatedAt ? user.templateWeding.updatedAt.toISOString() : null,
      // Convert nested Date objects
      comments: user.templateWeding.comments ? user.templateWeding.comments.map(comment => ({
        ...comment,
        createdAt: comment.createdAt ? comment.createdAt.toISOString() : null,
        updatedAt: comment.updatedAt ? comment.updatedAt.toISOString() : null,
      })) : [],
    } : null;

    return {
      props: {
        adminId: user.id,
        guestName,
        templateWedingData: serializedTemplateWeding,
        namaTemplate: (user as any).template || 'A', // Ambil dari field template atau default A
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        adminId,
        guestName,
        templateWedingData: null,
        namaTemplate: 'A',
      },
    };
  }
};

