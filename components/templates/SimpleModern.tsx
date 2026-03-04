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
import axios from 'axios';

interface TemplateAProps {
  adminId: string;
  guestName: string | null;
  isAdminView: boolean;
}

export default function SimpleModern({ adminId, guestName, isAdminView }: TemplateAProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { templateWeding, handleGetTemplateWeding } = useTemplateWedings();
  const [showPencil, setShowPencil] = useState<boolean>(false);
  const [payload, setPayload] = useState<ITemplateWeding>({} as ITemplateWeding);
  const { data } = useSession();
  const [loading, setLoading] = useState(false)

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {

    // Check initial theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
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
          <title>Undangan Pernikahan - Template A</title>
          <meta name="description" content="Website Undangan Pernikahan Template A" />
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

  const handleSubmit = async () => {
    const formData = new FormData();

    // Header & Photos - cek apakah File object
    if (payload.fotoHeader && typeof payload.fotoHeader !== 'string') {
      formData.append('fotoHeader', payload.fotoHeader as File);
    } else if (typeof payload.fotoHeader === 'string') {
      formData.append('fotoHeader', payload.fotoHeader);
    }

    if (payload.photoPutra && typeof payload.photoPutra !== 'string') {
      formData.append('photoPutra', payload.photoPutra as File);
    } else if (typeof payload.photoPutra === 'string') {
      formData.append('photoPutra', payload.photoPutra);
    }

    if (payload.photoPutri && typeof payload.photoPutri !== 'string') {
      formData.append('photoPutri', payload.photoPutri as File);
    } else if (typeof payload.photoPutri === 'string') {
      formData.append('photoPutri', payload.photoPutri);
    }

    if (payload.fotoQris && typeof payload.fotoQris !== 'string') {
      formData.append('fotoQris', payload.fotoQris as File);
    } else if (typeof payload.fotoQris === 'string') {
      formData.append('fotoQris', payload.fotoQris);
    }

    // Groom Data
    formData.append('namaPutra', payload.namaPutra || '');
    formData.append('namaLengkapPutra', payload.namaLengkapPutra || '');
    formData.append('namaAyahPutra', payload.namaAyahPutra || '');
    formData.append('namaIbuPutra', payload.namaIbuPutra || '');
    formData.append('instagramPutra', payload.instagramPutra || '');

    // Bride Data
    formData.append('namaPutri', payload.namaPutri || '');
    formData.append('namaLengkapPutri', payload.namaLengkapPutri || '');
    formData.append('namaAyahPutri', payload.namaAyahPutri || '');
    formData.append('namaIbuPutri', payload.namaIbuPutri || '');
    formData.append('instagramPutri', payload.instagramPutri || '');

    // Wedding Info
    if (payload.tanggalPernikahan) {
      formData.append('tanggalPernikahan', new Date(payload.tanggalPernikahan).toISOString());
    }
    formData.append('linkGoogleCalender', payload.linkGoogleCalender || '');
    formData.append('alamatPernikahan', payload.alamatPernikahan || '');
    formData.append('jamMulai', payload.jamMulai || '');
    formData.append('jamSelesai', payload.jamSelesai || '');
    formData.append('linkMaps', payload.linkMaps || '');

    // Love Gift
    formData.append('noAtm', payload.noAtm || '');
    formData.append('namaBank', payload.namaBank || '');
    formData.append('noHp', payload.noHp || '');

    // Design Theme
    formData.append('designTheme', payload.designTheme || 'MODERN');

    // Gallery
    if (payload.galeryId) {
      formData.append('galeryId', payload.galeryId);
    }
    setLoading(true)
    try {
      const response = await axios.put(`/api/landing/${data?.user.id}`, formData, {
      });
      console.log({ response });
      setLoading(false)
      if (response.data.success) {
        alert('✅ Data berhasil disimpan!');
        setLoading(false)
        window.location.reload();
      } else {
        alert(`❌ ${response.data.message || 'Gagal menyimpan data'}`);
        setLoading(false)

      }
    } catch (error: any) {
      console.error('Error saving data:', error);
      setLoading(false)

      // Tampilkan pesan error yang lebih detail
      const errorMessage = error.response?.data?.details
        || error.response?.data?.message
        || error.message
        || 'Gagal menyimpan data. Silakan coba lagi.';

      alert(`❌ Error: ${errorMessage}`);

      // Log detail error untuk debugging
      if (error.response?.data) {
        console.error('Server error details:', error.response.data);
        setLoading(false)

      }
    }
  };


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
              />
              <GallerySection
                setPayload={setPayload}
                payload={payload}
                showPencil={showPencil}
                setShowPencil={setShowPencil}
                session={data?.user.id}
              />
              <LoveGiftSection
                setPayload={setPayload}
                payload={payload}
                showPencil={showPencil}
                setShowPencil={setShowPencil}
                session={data?.user.id}
              />
              <div className={clsx('p-3', 'w-full')}>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full p-3 rounded-2xl transition-colors disabled:opacity-50 ${theme === 'dark'
                    ? '!bg-white !text-gray-900 hover:!bg-gray-100'
                    : '!bg-gray-900 !text-white hover:!bg-gray-800'
                    }`}
                  onClick={handleSubmit}
                >
                  <i className={clsx('fas', 'fa-paper-plane', 'mr-2')}></i>
                  {loading ? 'Mengirim...' : 'Send'}
                </button>
              </div>
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