'use client';

import React, { useState, useRef } from "react";
import { BaseComponentProps } from "@/types/component-props";
import { RevealWrapper } from "./RevealWrapper";
import clsx from "clsx";
import EditableTextSederhana from "./EditableTextSederhana";

function Footer({ payload, setPayload, session, showPencil, setShowPencil,handleSubmit,loading }: BaseComponentProps) {
  const [isHoveringBg, setIsHoveringBg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPayload({ ...payload, fotoHeader4: file });
    }
  };

  return (
    <section 
      id="footer"
      onMouseEnter={() => session && setIsHoveringBg(true)}
      onMouseLeave={() => session && setIsHoveringBg(false)}
    >
      <div 
        className={clsx('h-screen', 'bg-cover', 'bg-[47.5%]', 'bg-no-repeat', 'flex', 'items-end', 'relative')}
        style={{ 
          backgroundImage: `url('${
            typeof payload?.fotoHeader4 === 'string'
              ? payload.fotoHeader4
              : payload?.fotoHeader4
                ? URL.createObjectURL(payload.fotoHeader4)
                : '/assets/images/a4.jpeg'
          }')` 
        }}
      >
        <div className={clsx('relative', 'w-full')}>
          <div className={clsx('bg-[linear-gradient(180deg,#FFFFFF00_0%,#424242_67%)]', 'absolute', 'inset-x-0', 'bottom-0', '-top-24')}></div>
          <div className={clsx('flex', 'flex-col', 'items-center', 'text-center', 'gap-4', 'text-white', 'p-6', 'z-10', 'relative')}>
            <RevealWrapper duration={1500} origin="top">
              <p className={clsx('text-[0.75rem]', 'font-light', 'leading-relaxed')}>
                Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
                Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu
                kepada kami. Atas kehadiran dan doanya kami mengucapkan
                terimakasih
              </p>
            </RevealWrapper>
            <RevealWrapper duration={1500} origin="top">
              <p className={clsx('text-[0.75rem]', 'font-light', 'leading-relaxed')}>
                Wassalamualaikum Warahmatullahi Wabarakatuh
              </p>
            </RevealWrapper>
            <RevealWrapper duration={1500} origin="bottom">
              <h1 className={clsx('text-[1.75rem]', 'font-light')}>
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
      <div className={clsx('bg-[#424242]', 'p-6', 'flex', 'flex-col', 'items-center', 'justify-center', 'gap-4')}>
        {/* Save Button - Only show for admin */}
        {session && (
          <button
            type="button"
            onClick={handleSubmit}
            className={clsx(
              'w-full',
              'max-w-md',
              'bg-white',
              'text-[#424242]',
              'px-8',
              'py-3',
              'rounded-full',
              'font-semibold',
              'hover:scale-95',
              'transition-transform',
              'shadow-lg',
              'flex',
              'items-center',
              'justify-center',
              'gap-2'
            )}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={clsx('h-5', 'w-5')} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" 
              />
            </svg>
           {loading ? "Loading . . . " : "Simpan Perubahan"} 
          </button>
        )}
        <p className={clsx('text-white', 'text-sm')}>© 2024 Wedding Invitation</p>
      </div>
    </section>
  );
}

export default Footer;
