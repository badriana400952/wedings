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

interface TemplateBProps {
  adminId: string;
  guestName: string | null;
  templateWedingData: ITemplateWeding | null;
  isAdminView: boolean;
}

export default function TemplateB({ adminId, guestName, isAdminView }: TemplateBProps) {
  const [isOpen, setIsOpen] = useState(false);
    console.log("guestName",guestName)

  const { templateWeding, handleGetTemplateWeding } = useTemplateWedings();
  const [showPencil, setShowPencil] = useState<boolean>(false);
  const [payload, setPayload] = useState<ITemplateWeding>({} as ITemplateWeding);
  const { data } = useSession();

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

  const handleOpen = () => {
    setIsOpen(true);
    document.body.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) {
    return (
      <>
        <Head>
          <title>Undangan Pernikahan - Template B</title>
          <meta name="description" content="Website Undangan Pernikahan Template B" />
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
        <title>Undangan Pernikahan - Template B</title>
        <meta name="description" content="Website Undangan Pernikahan Template B" />
      </Head>
      <AOSInit />
      <div className={clsx('min-h-screen', 'bg-gradient-to-br', 'from-pink-50', 'to-rose-50', 'dark:from-gray-900', 'dark:to-gray-800')}>
        <div className={clsx('flex', 'flex-col', 'lg:flex-row', 'min-h-screen')}>
          {/* Left Side - Modern Design */}
          <div className={clsx('lg:w-1/2', 'p-8', 'lg:p-12', 'flex', 'flex-col', 'justify-center', 'relative')}>
            <div className={clsx('absolute', 'top-8', 'left-8', 'text-2xl', 'font-bold', 'text-rose-600', 'dark:text-rose-400')}>
              💍 The Wedding
            </div>
            
            <div className={clsx('text-center', 'lg:text-left', 'mb-8')}>
              <h1 className={clsx('text-5xl', 'lg:text-6xl', 'font-bold', 'text-gray-900', 'dark:text-white', 'mb-4')}>
                {payload?.namaLengkapPutra ?? "Mempelai Pria"}
                <span className={clsx('block', 'text-4xl', 'lg:text-5xl', 'text-rose-600', 'dark:text-rose-400', 'my-2')}>
                  &
                </span>
                {payload?.namaLengkapPutri ?? "Mempelai Wanita"}
              </h1>
              
              <div className={clsx('inline-flex', 'items-center', 'gap-3', 'bg-white/80', 'dark:bg-gray-800/80', 'px-6', 'py-3', 'rounded-full', 'shadow-lg')}>
                <div className={clsx('text-rose-600', 'dark:text-rose-400')}>
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className={clsx('text-gray-700', 'dark:text-gray-300')}>
                  <div className="font-semibold">{formatTanggalIndo(payload?.tanggalPernikahan)}</div>
                  <div className="text-sm">{payload?.jamMulai} - {payload?.jamSelesai}</div>
                </div>
              </div>
            </div>

            {/* Couple Photos - Modern Layout */}
            <div className={clsx('flex', 'justify-center', 'lg:justify-start', 'gap-6', 'mb-8')}>
              <div className={clsx('relative', 'w-32', 'h-32', 'lg:w-40', 'lg:h-40', 'rounded-2xl', 'overflow-hidden', 'shadow-2xl')}>
                <Image
                  src={payload?.photoPutra || '/default-groom.jpg'}
                  alt="Mempelai Pria"
                  fill
                  className="object-cover"
                />
              </div>
              <div className={clsx('relative', 'w-32', 'h-32', 'lg:w-40', 'lg:h-40', 'rounded-2xl', 'overflow-hidden', 'shadow-2xl', 'mt-8')}>
                <Image
                  src={payload?.photoPutri || '/default-bride.jpg'}
                  alt="Mempelai Wanita"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className={clsx('text-center', 'lg:text-left')}>
              <button
                onClick={handleOpen}
                className={clsx('px-8', 'py-4', 'bg-rose-600', 'text-white', 'rounded-full', 'font-semibold', 'text-lg', 'hover:bg-rose-700', 'transition-colors', 'shadow-lg', 'hover:shadow-xl')}
              >
                Buka Undangan Lengkap
              </button>
            </div>
          </div>

          {/* Right Side - Background Image */}
          <div className={clsx('lg:w-1/2', 'relative', 'min-h-[400px]', 'lg:min-h-screen')}>
            <div className={clsx('absolute', 'inset-0', 'bg-gradient-to-t', 'from-black/60', 'to-transparent')}></div>
            <Image
              src={payload?.fotoHeader as string|| '/default-wedding-bg.jpg'}
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            <div className={clsx('absolute', 'bottom-8', 'left-8', 'right-8', 'text-white')}>
              <div className={clsx('text-center', 'lg:text-right')}>
                <div className={clsx('text-sm', 'opacity-90', 'mb-2')}>Lokasi Acara</div>
                <div className={clsx('text-xl', 'font-semibold')}>{payload?.alamatPernikahan || "Grand Ballroom"}</div>
                <a 
                  href={payload?.linkMaps || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx('inline-flex', 'items-center', 'gap-2', 'mt-4', 'px-4', 'py-2', 'bg-white/20', 'backdrop-blur-sm', 'rounded-full', 'hover:bg-white/30', 'transition-colors')}
                >
                  <i className="fas fa-map-marker-alt"></i>
                  Lihat di Google Maps
                </a>
              </div>
            </div>
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