import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';
import { ITemplateWeding } from '@/prisma/schema.types';

// Import templates
import SimpleModern from '@/components/templates/SimpleModern';
import TemplateB from '@/components/templates/TemplateB';
import { useSession } from 'next-auth/react';

interface SlugPageProps {
  adminId: string;
  guestName: string | null;
  templateWedingData: ITemplateWeding | null;
}

export default function SlugPage({ adminId, guestName: initialGuestName, templateWedingData, }: SlugPageProps) {
  const router = useRouter();
  const { data } = useSession();
  const [guestName, setGuestName] = useState<string | null>(initialGuestName);
  
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

  switch (data?.user.template) {
    case 'A':
      return (
        <SimpleModern
          adminId={adminId}
          guestName={guestName}
          isAdminView={false} 
        />
      );
    case 'B':
      return (
        <TemplateB
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

    // Convert Date objects to strings for JSON serialization
    const serializedTemplateWeding = user.templateWeding ? {
      ...user.templateWeding,
      tanggalPernikahan: user.templateWeding.tanggalPernikahan ? user.templateWeding.tanggalPernikahan.toISOString() : null,
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

