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
import { formatTanggalIndo } from '@/date';
import { ITemplateWeding } from '@/prisma/schema.types';

interface TemplateAProps {
  adminId: string;
  guestName: string | null;
  isAdminView: boolean;
}

export default function SimpleModern({ adminId, guestName }: TemplateAProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { templateWeding, handleGetTemplateWeding } = useTemplateWedings();
  const [payload, setPayload] = useState<ITemplateWeding>({} as ITemplateWeding);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(`invitation_opened_${adminId || 'modern'}`) === 'true') {
        setIsOpen(true);
      }
    } catch {}
  }, [adminId]);

  useEffect(() => {
    // Check initial theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    const observer = new MutationObserver(() => {
      // theme tracking if needed
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Load template wedding data
  useEffect(() => {
    if (adminId) {
      handleGetTemplateWeding(adminId);
    }
  }, [adminId]);

  useEffect(() => {
    if (templateWeding?.id) {
      setPayload((prev) => ({ ...prev, ...templateWeding }));
    }
  }, [templateWeding]);

  const handleOpen = () => {
    setIsOpen(true);
    try {
      sessionStorage.setItem(`invitation_opened_${adminId || 'modern'}`, 'true');
    } catch {}
    document.body.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) {
    return (
      <>
        <Head>
          <title>Undangan Pernikahan - Template A</title>
          <meta name="description" content="Website Undangan Pernikahan Template A" />
        </Head>
        <WelcomePage
          onOpen={handleOpen}
          guestName={guestName}
          showPencil={false}
          setShowPencil={() => {}}
          setPayload={setPayload}
          payload={payload}
          session={undefined}
          isAdminView={false}
        />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Undangan Pernikahan - Template A</title>
        <meta name="description" content="Website Undangan Pernikahan Template A" />
      </Head>
      <AOSInit />
      <div className={clsx('min-h-screen', 'bg-gray-50', 'dark:bg-gray-900')}>
        <div className={clsx('flex', 'flex-col', 'lg:flex-row')}>
          {/* Desktop Sidebar */}
          <div className={clsx('hidden', 'lg:block', 'lg:w-1/2', 'xl:w-2/3', 'sticky', 'top-0', 'h-screen')}>
            <div className={clsx('relative', 'w-full', 'h-full', 'bg-gray-900', 'flex', 'items-center', 'justify-center')}>
              <div className={clsx('absolute', 'inset-0', 'opacity-30')}>
                <Image
                  src={
                    typeof payload?.fotoHeader === "string"
                      ? payload.fotoHeader
                      : "/assets/images/bg.webp"
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
                showPencil={false}
                setShowPencil={() => {}}
                session={undefined}
                isAdminView={false}
              />
              <BrideSection
                setPayload={setPayload}
                payload={payload}
                showPencil={false}
                setShowPencil={() => {}}
                session={undefined}
                isAdminView={false}
              />
              <WeddingDateSection
                setPayload={setPayload}
                payload={payload}
                showPencil={false}
                setShowPencil={() => {}}
                session={undefined}
              />
              <GallerySection
                setPayload={setPayload}
                payload={payload}
                showPencil={false}
                setShowPencil={() => {}}
                session={undefined}
              />
              <LoveGiftSection
                setPayload={setPayload}
                payload={payload}
                showPencil={false}
                setShowPencil={() => {}}
                session={undefined}
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