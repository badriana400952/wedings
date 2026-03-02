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
import SvgCustom from '@/utils/svg';
import { ITemplateWeding } from '@/prisma/schema.types';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState<string | null>(null);
  const { templateWeding, handleGetTemplateWeding } = useTemplateWedings()
  const [showPencil, setShowPencil] = useState<boolean>(false)
  const [payload, setPayload] = useState<ITemplateWeding>({} as ITemplateWeding)
  const { data } = useSession()

  useEffect(() => {
    if (data?.user.id) {
      handleGetTemplateWeding(data?.user?.id || '')
    }
  }, [data])

  useEffect(() => {
    if (templateWeding?.id) {
      setPayload({...payload,...templateWeding})
    }
  }, [templateWeding])

  useEffect(() => {
    // Get guest name from URL - support both ?to= and direct slug
    const params = new URLSearchParams(window.location.search);
    let guestNameFromUrl = params.get('to');

    // If no 'to' parameter, check for direct slug after ?
    if (!guestNameFromUrl) {
      const queryString = window.location.search.substring(1); // Remove '?'
      if (queryString && !queryString.includes('=')) {
        // It's a direct slug like ?badriana or ?alumni+pasirdurung
        guestNameFromUrl = queryString.replace(/\+/g, ' ');
      }
    }

    if (guestNameFromUrl) {
      setGuestName(decodeURIComponent(guestNameFromUrl));
    }
  }, []);

  console.log("payload", payload)

  const handleOpen = () => {
    setIsOpen(true);
    document.body.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) {
    return (
      <>
        <Head>
          <title>Website Undangan Pernikahan Wahyu dan Riski Secara Online</title>
          <meta name="description" content="Website Undangan Pernikahan Wahyu dan Riski Secara Online" />
          <meta name="keywords" content="undangan, wedding, undangan digital, undangan online, wedding invitation" />
          <meta property="og:title" content="Website Undangan Pernikahan Wahyu dan Riski Secara Online" />
          <meta property="og:description" content="Website Undangan Pernikahan Wahyu dan Riski Secara Online" />
          <meta property="og:image" content="/assets/images/a1.jpeg" />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="id_ID" />
        </Head>
        <WelcomePage
          onOpen={handleOpen}
          guestName={guestName}
          showPencil={showPencil}
          setShowPencil={setShowPencil}
          setPayload={setPayload}
          payload={payload}
          session={data?.user.id}
        />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Website Undangan Pernikahan Wahyu dan Riski Secara Online</title>
        <meta name="description" content="Website Undangan Pernikahan Wahyu dan Riski Secara Online" />
        <meta name="keywords" content="undangan, wedding, undangan digital, undangan online, wedding invitation" />
        <meta property="og:title" content="Website Undangan Pernikahan Wahyu dan Riski Secara Online" />
        <meta property="og:description" content="Website Undangan Pernikahan Wahyu dan Riski Secara Online" />
        <meta property="og:image" content="/assets/images/a1.jpeg" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="id_ID" />
      </Head>
      <AOSInit />
      <div className={clsx('min-h-screen', 'bg-gray-50', 'dark:bg-gray-900')}>
        <div className={clsx('flex', 'flex-col', 'lg:flex-row')}>
          {/* Desktop Sidebar */}
          <div className={clsx('hidden', 'lg:block', 'lg:w-1/2', 'xl:w-2/3', 'sticky', 'top-0', 'h-screen')} onDoubleClick={() => setShowPencil(true)}>
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
                <h2 className={clsx('font-esthetic', 'text-4xl', 'mb-4')}>{payload?.namaLengkapPutra ?? "Badriana"} <br /> & <br />{payload?.namaLengkapPutri ?? "Izzah"}</h2>
                <p className="text-lg">{formatTanggalIndo(payload?.tanggalPernikahan)}</p>
              </div>
            </div>
          </div>


          {/* Main Content */}
          <div className={clsx('w-full', 'lg:w-1/2', 'xl:w-1/3')}>
            <main>
              <HomePage  setPayload={setPayload} payload={payload}         showPencil={showPencil}
          setShowPencil={setShowPencil} session={data?.user.id}/>
              <BrideSection  setPayload={setPayload} payload={payload} />
              <WeddingDateSection  setPayload={setPayload} payload={payload} />
              <GallerySection  setPayload={setPayload} payload={payload} />
              <LoveGiftSection  setPayload={setPayload} payload={payload} />
              <CommentSection guestName={guestName} setPayload={setPayload} payload={payload} />
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
