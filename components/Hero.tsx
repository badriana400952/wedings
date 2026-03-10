"use client";

import React, { useState } from "react";
import { ITemplateWeding } from "@/prisma/schema.types";
import useSound from "use-sound";
import { RevealWrapper } from "./RevealWrapper";
import clsx from "clsx";
import SvgCustom from "@/utils/svg";
import EditableTextSederhana from "./EditableTextSederhana";
import EditableDateSederhana from "./EditableDateSederhana";
import Calendar from "./Calendar";
import { formatTanggalIndo } from "@/date";

interface HeroProps {
  setCurrentOverflow: React.Dispatch<React.SetStateAction<string>>;
  payload: ITemplateWeding;
  setPayload: React.Dispatch<React.SetStateAction<ITemplateWeding>>;
  session?: any;
  showPencil?: boolean;
  setShowPencil?: React.Dispatch<React.SetStateAction<boolean>>;
}

function Hero({
  setCurrentOverflow,
  payload,
  setPayload,
  session,
  showPencil = false,
  setShowPencil,
}: HeroProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [isHoveringBg, setIsHoveringBg] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [play] = useSound("assets/music/music.mp3", {
    volume: 0.25,
  });
  const {SvgMail} = SvgCustom();

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log({file})
    if (file) {
      // Simpan File object, bukan URL
      setPayload({ ...payload, fotoHeader: file });
    }
  };

  return (
    <section 
      id="hero"
      onMouseEnter={() => session && setIsHoveringBg(true)}
      onMouseLeave={() => session && setIsHoveringBg(false)}
    >
      <div 
        className={clsx('min-h-screen', 'bg-cover', 'bg-center', 'text-white', 'relative')}
        style={{ 
          backgroundImage: `url('${
            typeof payload?.fotoHeader === 'string' 
              ? payload.fotoHeader 
              : payload?.fotoHeader instanceof File
                ? URL.createObjectURL(payload.fotoHeader) 
                : ''
          }')` 
        }}
      >
        <div className={clsx('absolute', 'inset-0', 'bg-black/70', 'z-10')} />
        <div className={clsx('flex', 'flex-col', 'justify-between', 'py-28', 'px-12', 'text-center', 'z-20', 'relative', 'h-screen')}>
          <div>
            <p className={clsx('font-extralight', 'text-[0.75rem]')}>The Wedding of</p>
            <h1 className={clsx('text-4xl', 'font-light', 'mt-2')}>
              <EditableTextSederhana
                value={payload.namaPutra}
                onChange={(value) => setPayload({ ...payload, namaPutra: value })}
                placeholder="Nama Putra"
                session={session}
                showPencil={showPencil}
                setShowPencil={setShowPencil}
              />
              {' & '}
              <EditableTextSederhana
                value={payload.namaPutri}
                onChange={(value) => setPayload({ ...payload, namaPutri: value })}
                placeholder="Nama Putri"
                session={session}
                showPencil={showPencil}
                setShowPencil={setShowPencil}
              />
            </h1>
            <p className={clsx('font-extralight', 'text-[0.8rem]', 'mt-4')}>
              <EditableDateSederhana
                value={payload.tanggalPernikahan}
                onChange={(value) => setPayload({ ...payload, tanggalPernikahan: value })}
                formatDisplay={formatTanggalIndo}
                session={session}
                showPencil={showPencil}
                setShowPencil={setShowPencil}
                onCalendarClick={() => setShowCalendar(true)}
              />
            </p>
          </div>
          <div className={clsx('flex', 'flex-col', 'items-center', 'gap-2')}>
            <p className="text-[0.8rem]">
              <EditableTextSederhana
                value={payload.alamatPernikahan}
                onChange={(value) => setPayload({ ...payload, alamatPernikahan: value })}
                placeholder="Nama Gedung"
                session={session}
                showPencil={showPencil}
                setShowPencil={setShowPencil}
                multiline={true}
                rows={2}
              />
            </p>
            <RevealWrapper duration={4000} origin="bottom">
              <a
                href="#countdown"
                onClick={() => {
                  setCurrentOverflow("auto");
                  play();
                }}
                className={clsx('font-bold', 'text-sm', 'bg-[#ffffff36]', 'border', 'border-[#bdb08f8c]', 'rounded-lg', 'flex', 'items-center', 'gap-2', 'px-6', 'py-3', 'mt-6', 'hover:scale-90', 'ease-linear', 'duration-[0.2s]')}
              >
                <SvgMail />
                <span>Buka Undangan</span>
              </a>
            </RevealWrapper>
          </div>
        </div>

        {/* Upload Background Button */}
        {(showPencil || (session && isHoveringBg)) && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={clsx(
              'absolute',
              'bottom-4',
              'right-4',
              'z-30',
              'bg-white',
              'text-gray-800',
              'rounded-full',
              'p-3',
              'shadow-lg',
              'hover:scale-110',
              'transition-transform',
              'duration-200'
            )}
            title="Ubah Background"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={clsx('h-6', 'w-6')} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleBgUpload}
        />
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <Calendar
          selectedDate={payload?.tanggalPernikahan || ''}
          onDateSelect={(date) => {
            setPayload({ ...payload, tanggalPernikahan: date });
            setShowCalendar(false);
          }}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </section>
  );
}

export default Hero;