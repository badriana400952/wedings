import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import WelcomePage from '@/components/WelcomePage';
import HomePage from '@/components/HomePage';
import BrideSection from '@/components/BrideSection';
import WeddingDateSection from '@/components/WeddingDateSection';
import GallerySection from '@/components/GallerySection';
import LoveGiftSection from '@/components/LoveGiftSection';
import CommentSection from '@/components/CommentSection';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import AudioButton from '@/components/AudioButton';
import ThemeButton from '@/components/ThemeButton';
import AOSInit from '@/components/AOSInit';
import clsx from 'clsx';
import useTemplateWedings from '@/hooks/useTemplateWweding';
import { useSession } from 'next-auth/react';
import { formatTanggalIndo } from '@/date';
import { ITemplateWeding } from '@/prisma/schema.types';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';

interface SlugPageProps {
  adminId: string;
  guestName: string | null;
  templateWedingData: ITemplateWeding | null;
}

export default function SlugPage({ adminId, guestName: initialGuestName, templateWedingData }: SlugPageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState<string | null>(initialGuestName);
  const { templateWeding, handleGetTemplateWeding } = useTemplateWedings();
  const [showPencil, setShowPencil] = useState<boolean>(false);
  const [payload, setPayload] = useState<ITemplateWeding>({} as ITemplateWeding);
  const { data } = useSession();
  const router = useRouter();
  console.log(router.pathname)
  // Cek apakah user adalah admin yang benar (hanya bisa edit jika login sebagai admin yang sama)
  const isAdminView = data?.user.id === adminId;

  // Load template wedding data
  useEffect(() => {
    if (adminId) {
      handleGetTemplateWeding(adminId);
    }
  }, [adminId]);

  useEffect(() => {
    if (templateWeding?.id) {
      setPayload({ ...payload, ...templateWeding });
    }
  }, [templateWeding]);

  // Get guest name from URL query parameters
useEffect(() => {
  if (!router.isReady) return;

  const { to, slug, ...rest } = router.query;

  // 1️⃣ Kalau pakai ?to=nama
  if (typeof to === "string") {
    setGuestName(decodeURIComponent(to));
    return;
  }

  // 2️⃣ Kalau pakai ?alumni%20sma=
  const keys = Object.keys(rest);

  if (keys.length > 0) {
    setGuestName(decodeURIComponent(keys[0]));
  }

}, [router.isReady, router.query]);
  const handleOpen = () => {
    setIsOpen(true);
    document.body.scrollIntoView({ behavior: 'smooth' });
  };
console.log("guestName",guestName)
  if (!isOpen) {
    return (
      <>
        <Head>
          <title>Undangan Pernikahan</title>
          <meta name="description" content="Website Undangan Pernikahan" />
        </Head>
        <WelcomePage
          onOpen={handleOpen}
          guestName={guestName}
          showPencil={showPencil}
          setShowPencil={setShowPencil}
          setPayload={setPayload}
          payload={payload}
          session={data?.user.id}
          isAdminView={isAdminView}
        />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Undangan Pernikahan</title>
        <meta name="description" content="Website Undangan Pernikahan" />
      </Head>
      <AOSInit />
      <div className={clsx('min-h-screen', 'bg-gray-50', 'dark:bg-gray-900')}>
        <div className={clsx('flex', 'flex-col', 'lg:flex-row')}>
          {/* Desktop Sidebar */}
          <div className={clsx('hidden', 'lg:block', 'lg:w-1/2', 'xl:w-2/3', 'sticky', 'top-0', 'h-screen')} onDoubleClick={() => {
            // Hanya admin yang sama bisa trigger edit mode
            if (isAdminView) {
              setShowPencil(true);
            }
          }}>
            <div className={clsx('relative', 'w-full', 'h-full', 'bg-gray-900', 'flex', 'items-center', 'justify-center')}>
              <div className={clsx('absolute', 'inset-0', 'opacity-30')}>
                <Image
                  src={
                    typeof payload.fotoHeader === "string"
                      ? payload.fotoHeader
                      : URL.createObjectURL(payload.fotoHeader)
                  }
                  alt="background"
                  fill
                  className="object-cover"
                  priority
                  sizes="50vw"
                />
              </div>
              <div className={clsx('relative', 'z-10', 'text-center', 'text-white', 'bg-black/50', 'p-8', 'rounded-3xl')}>
                <h2 className={clsx('font-esthetic', 'text-4xl', 'mb-4')}>
                  {payload?.namaLengkapPutra ?? "Mempelai Pria"} <br /> & <br />
                  {payload?.namaLengkapPutri ?? "Mempelai Wanita"}
                </h2>
                <p className="text-lg">{formatTanggalIndo(payload?.tanggalPernikahan)}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={clsx('w-full', 'lg:w-1/2', 'xl:w-1/3')}>
            <main>
              <HomePage 
                setPayload={setPayload} 
                payload={payload} 
                showPencil={showPencil} 
                setShowPencil={setShowPencil} 
                session={data?.user.id}
                isAdminView={isAdminView}
              />
              <BrideSection 
                setPayload={setPayload} 
                payload={payload} 
                showPencil={showPencil} 
                setShowPencil={setShowPencil} 
                session={data?.user.id}
                isAdminView={isAdminView}
              />
              <WeddingDateSection 
                setPayload={setPayload} 
                payload={payload} 
                showPencil={showPencil} 
                setShowPencil={setShowPencil} 
                session={data?.user.id}
                isAdminView={isAdminView}
              />
              <GallerySection 
                setPayload={setPayload} 
                payload={payload} 
                showPencil={showPencil} 
                setShowPencil={setShowPencil} 
                session={data?.user.id}
                isAdminView={isAdminView}
              />
              <LoveGiftSection 
                setPayload={setPayload} 
                payload={payload} 
                showPencil={showPencil} 
                setShowPencil={setShowPencil} 
                session={data?.user.id}
                isAdminView={isAdminView}
              />
              <CommentSection 
                guestName={guestName} 
                setPayload={setPayload} 
                payload={payload} 
                adminId={adminId}
              />
              <Footer />
            </main>

            <BottomNav />
          </div>
        </div>

        {/* Floating Buttons */}
        <div className={clsx('fixed', 'bottom-24', 'right-4', 'z-50', 'flex', 'flex-col', 'gap-3')}>
          <ThemeButton />
          <AudioButton />
        </div>
      </div>
    </>
  );
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
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        adminId,
        guestName,
        templateWedingData: null,
      },
    };
  }
};