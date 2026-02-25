import { useState, useEffect } from 'react';
import Head from 'next/head';
import WelcomePage from '@/components/WelcomePage';
import HomePage from '@/components/HomePage';
import BrideSection from '@/components/BrideSection';
import WeddingDateSection from '@/components/WeddingDateSection';
import GallerySection from '@/components/GallerySection';
import LoveGiftSection from '@/components/LoveGiftSection';
import CommentSection from '@/components/CommentSection';
import BottomNav from '@/components/BottomNav';
import AudioButton from '@/components/AudioButton';
import ThemeButton from '@/components/ThemeButton';
import AOSInit from '@/components/AOSInit';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState<string | null>(null);

  useEffect(() => {
    // Get guest name from URL
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) {
      setGuestName(decodeURIComponent(to));
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
          <title>Website Undangan Pernikahan Wahyu dan Riski Secara Online</title>
          <meta name="description" content="Website Undangan Pernikahan Wahyu dan Riski Secara Online" />
          <meta name="keywords" content="undangan, wedding, undangan digital, undangan online, wedding invitation" />
          <meta property="og:title" content="Website Undangan Pernikahan Wahyu dan Riski Secara Online" />
          <meta property="og:description" content="Website Undangan Pernikahan Wahyu dan Riski Secara Online" />
          <meta property="og:image" content="/assets/images/bg.webp" />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="id_ID" />
        </Head>
        <WelcomePage onOpen={handleOpen} guestName={guestName} />
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
        <meta property="og:image" content="/assets/images/bg.webp" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="id_ID" />
      </Head>
      <AOSInit />
      <div className="min-h-screen">
        <div className="flex flex-col lg:flex-row">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-1/2 xl:w-2/3 sticky top-0 h-screen">
            <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
              <div className="absolute inset-0 opacity-30">
                <img
                  src="/assets/images/bg.webp"
                  alt="background"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 text-center text-white bg-black/50 p-8 rounded-3xl">
                <h2 className="font-esthetic text-4xl mb-4">Wahyu & Riski</h2>
                <p className="text-lg">Rabu, 15 Maret 2023</p>
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
