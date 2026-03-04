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