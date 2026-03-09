import { useEffect, useState } from "react";
import { ITemplateWeding } from "@/prisma/schema.types";
import { RevealWrapper } from "../RevealWrapper";
import Hero from "../Hero";
import CountdownComp from "../Countdown";
import ArRum from "../ArRum";
import Profile from "../ProfileSederhana";
import WeddingEvents from "../WeddingEvents";
import Reservation from "../Reservation";
import Gallery from "../GallerySederhana";
import Footer from "../FooterSederhana";
import CommentSection from "../CommentSection";
import AudioPlayer from "../AudioPlayer";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import useTemplateWedings from "@/hooks/useTemplateWweding";
import axios from "axios";
import { useRouter } from "next/router";

interface SimpleSederhanaProps {

  guestName: string | null;
  isAdminView?: boolean;
  adminId?: string;
}

export default function SimpleSederhana({
  guestName,
  isAdminView = false,
  adminId,
}: SimpleSederhanaProps) {
  const { templateWeding, handleGetTemplateWeding } = useTemplateWedings();
  const [payload, setPayload] = useState<ITemplateWeding>({} as ITemplateWeding);
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const [currentOverflow, setCurrentOverflow] = useState("hidden");
  const [showPencil, setShowPencil] = useState(false);
  const { data } = useSession();

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


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.style.overflowY = currentOverflow;
  }, [currentOverflow]);

  // Double click untuk enable edit mode (guest only)
  const handleDoubleClick = () => {
    if (!data?.user.id && !showPencil) {
      setShowPencil(true);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (!confirm('Simpan semua perubahan?')) return;



    //Header & Photos - cek apakah File object
    if (payload.fotoHeader && typeof payload.fotoHeader !== 'string') {
      formData.append('fotoHeader', payload.fotoHeader as File);
    } else if (typeof payload.fotoHeader === 'string') {
      formData.append('fotoHeader', payload.fotoHeader);
    }

    if (payload.fotoHeader2 && typeof payload.fotoHeader2 !== 'string') {
      formData.append('fotoHeader2', payload.fotoHeader2 as File);
    } else if (typeof payload.fotoHeader2 === 'string') {
      formData.append('fotoHeader2', payload.fotoHeader2);
    }

    if (payload.fotoHeader3 && typeof payload.fotoHeader3 !== 'string') {
      formData.append('fotoHeader3', payload.fotoHeader3 as File);
    } else if (typeof payload.fotoHeader3 === 'string') {
      formData.append('fotoHeader3', payload.fotoHeader3);
    }

    if (payload.fotoHeader4 && typeof payload.fotoHeader4 !== 'string') {
      formData.append('fotoHeader4', payload.fotoHeader4 as File);
    } else if (typeof payload.fotoHeader4 === 'string') {
      formData.append('fotoHeader4', payload.fotoHeader4);
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

    //Groom Data
    formData.append('namaPutra', payload.namaPutra || '');
    formData.append('namaLengkapPutra', payload.namaLengkapPutra || '');
    formData.append('namaAyahPutra', payload.namaAyahPutra || '');
    formData.append('namaIbuPutra', payload.namaIbuPutra || '');
    formData.append('instagramPutra', payload.instagramPutra || '');

    //Bride Data
    formData.append('namaPutri', payload.namaPutri || '');
    formData.append('namaLengkapPutri', payload.namaLengkapPutri || '');
    formData.append('namaAyahPutri', payload.namaAyahPutri || '');
    formData.append('namaIbuPutri', payload.namaIbuPutri || '');
    formData.append('instagramPutri', payload.instagramPutri || '');

    //Wedding Info
    if (payload.tanggalPernikahan) {
      formData.append('tanggalPernikahan', new Date(payload.tanggalPernikahan).toISOString());
    }
    formData.append('linkGoogleCalender', payload.linkGoogleCalender || '');
    formData.append('alamatGedungPernikahan', payload.alamatGedungPernikahan || '');
    formData.append('alamatPernikahan', payload.alamatPernikahan || '');
    formData.append('jamMulai', payload.jamMulai || '');
    formData.append('jamResepsi', payload.jamResepsi || '');
    formData.append('jamSelesai', payload.jamSelesai || '');
    formData.append('linkMaps', payload.linkMaps || '');

    //Love Gift
    formData.append('noAtm', payload.noAtm || '');
    formData.append('namaBank', payload.namaBank || '');
    formData.append('noHp', payload.noHp || '');

    //Design Theme
    formData.append('designTheme', payload.designTheme || 'CLASSIC');


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
        // Simpan hash sebelum reload
        const currentHash = window.location.hash;
        // Reload dengan hash yang sama
        window.location.href = window.location.pathname + window.location.search + currentHash;
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
    <main
      className={clsx('max-w-[28.125rem]', 'mx-auto')}
      onDoubleClick={handleDoubleClick}
    >
      <RevealWrapper duration={1500}>
        <Hero
          setCurrentOverflow={setCurrentOverflow}
          payload={payload}
          setPayload={setPayload}
          session={data?.user.id}
          showPencil={showPencil}
          setShowPencil={setShowPencil}
        />
      </RevealWrapper>

      <CountdownComp
        payload={payload}
        setPayload={setPayload}
        session={data?.user.id}
        showPencil={showPencil}
        setShowPencil={setShowPencil}
      />

      <ArRum
        payload={payload}
        setPayload={setPayload}
        session={data?.user.id}
        showPencil={showPencil}
        setShowPencil={setShowPencil}
      />

      <Profile
        payload={payload}
        setPayload={setPayload}
        session={data?.user.id}
        showPencil={showPencil}
        setShowPencil={setShowPencil}
      />

      <WeddingEvents
        payload={payload}
        setPayload={setPayload}
        session={data?.user.id}
        showPencil={showPencil}
        setShowPencil={setShowPencil}
      />

      <Reservation
        payload={payload}
        setPayload={setPayload}
        session={data?.user.id}
        showPencil={showPencil}
        setShowPencil={setShowPencil}
        guestName={guestName}
        adminId={adminId}
      />

      <Gallery
        payload={payload}
        setPayload={setPayload}
        session={data?.user.id}
        showPencil={showPencil}
        setShowPencil={setShowPencil}
      />



      <Footer
        payload={payload}
        setPayload={setPayload}
        session={data?.user.id}
        showPencil={showPencil}
        setShowPencil={setShowPencil}
        handleSubmit={handleSubmit}
        loading={loading}
      />

      {/* Audio Player */}
      <AudioPlayer
        audioUrl="/audio/backsound.mp3"
        volume={0.25}
        autoPlay={false}
        loop={true}
      />

      {/* Edit Mode Indicator */}
      {showPencil && (
        <div className={clsx('fixed', 'top-4', 'left-4', 'z-50', 'bg-yellow-500', 'text-white', 'px-4', 'py-2', 'rounded-lg', 'shadow-lg')}>
          <i className={clsx('fas', 'fa-pencil', 'mr-2')}></i>
          Edit Mode Active
        </div>
      )}
    </main>
  );
}