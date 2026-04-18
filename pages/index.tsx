import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import WelcomePage from '../components/WelcomePage';
import AOSInit from '../components/AOSInit';
import HomePage from '../components/HomePage';
import BrideSection from '../components/BrideSection';
import WeddingDateSection from '../components/WeddingDateSection';
import GallerySection from '../components/GallerySection';
import LoveGiftSection from '../components/LoveGiftSection';
import CommentSection from '../components/CommentSection';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import ThemeButton from '../components/ThemeButton';
import AudioButton from '../components/AudioButton';
// import WelcomePage from '@/components/WelcomePage';
// import HomePage from '@/components/HomePage';
// import BrideSection from '@/components/BrideSection';
// import WeddingDateSection from '@/components/WeddingDateSection';
// import GallerySection from '@/components/GallerySection';
// import LoveGiftSection from '@/components/LoveGiftSection';
// import CommentSection from '@/components/CommentSection';
// import Footer from '@/components/Footer';
// import BottomNav from '@/components/BottomNav';
// import AudioButton from '@/components/AudioButton';
// import ThemeButton from '@/components/ThemeButton';
// import AOSInit from '@/components/AOSInit';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState<string | null>(null);

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

  const handleOpen = () => {
    setIsOpen(true);
    document.body.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) {
    return (
      <>
        <Head>
          <title>Website Undangan Pernikahan Abdulloh Mujaddid dan Ati Sunarti Secara Online</title>
          <meta name="description" content="Website Undangan Pernikahan Abdulloh Mujaddid dan Ati Sunarti Secara Online" />
          <meta name="keywords" content="undangan, wedding, undangan digital, undangan online, wedding invitation" />
          <meta property="og:title" content="Website Undangan Pernikahan Abdulloh Mujaddid dan Ati Sunarti Secara Online" />
          <meta property="og:description" content="Website Undangan Pernikahan Abdulloh Mujaddid dan Ati Sunarti Secara Online" />
          {/* <meta property="og:image" content="/assets/images/a1.jpeg" /> */}
          <meta property="og:image" content="https://wedings.vercel.app/assets/images/link.jpeg" />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="id_ID" />

          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </Head>
        <WelcomePage onOpen={handleOpen} guestName={guestName} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Website Undangan Pernikahan Abdulloh Mujaddid dan Ati Sunarti Secara Online</title>
        <meta name="description" content="Website Undangan Pernikahan Abdulloh Mujaddid dan Ati Sunarti Secara Online" />
        <meta name="keywords" content="undangan, wedding, undangan digital, undangan online, wedding invitation" />
        <meta property="og:title" content="Website Undangan Pernikahan Abdulloh Mujaddid dan Ati Sunarti Secara Online" />
        <meta property="og:description" content="Website Undangan Pernikahan Abdulloh Mujaddid dan Ati Sunarti Secara Online" />
        <meta property="og:image" content="https://wedings.vercel.app/assets/images/link.jpeg" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="id_ID" />
      </Head>
      <AOSInit />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col lg:flex-row">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-1/2 xl:w-2/3 sticky top-0 h-screen">
            <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
              <div className="absolute inset-0 opacity-30">
                <Image
                  src="/assets/images/a1.jpeg"
                  alt="background"
                  fill
                  className="object-cover"
                  priority
                  sizes="50vw"
                />
              </div>
              <div className="relative z-10 text-center text-white bg-black/50 p-8 rounded-3xl">
                <h2 className="font-esthetic text-4xl mb-4">Abdulloh mujaddid <br /> & <br />Ati sunarti</h2>
                <p className="text-lg">Minggu, 31 Mei 2026</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-1/2 xl:w-1/3">
            <main>
              <HomePage />
              <BrideSection />
              <WeddingDateSection />
              <GallerySection />
              <LoveGiftSection />
              <CommentSection guestName={guestName} />
              <Footer />
            </main>

            <BottomNav />
          </div>
        </div>

        {/* Floating Buttons */}
        <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-3">
          <ThemeButton />
          <AudioButton />
        </div>
      </div>
    </>
  );
}
