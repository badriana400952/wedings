import React, { useState } from "react";
import { ITemplateWeding } from "@/prisma/schema.types";
import Countdown from "react-countdown";
import { RevealWrapper } from "./RevealWrapper";
import clsx from "clsx";
import EditableTextSederhana from "./EditableTextSederhana";
import EditableDateSederhana from "./EditableDateSederhana";
import Calendar from "./Calendar";
import { formatTanggalIndo } from "@/date";

interface CountdownCompProps {
  payload: ITemplateWeding;
  setPayload: React.Dispatch<React.SetStateAction<ITemplateWeding>>;
  session?: any;
  showPencil?: boolean;
  setShowPencil?: React.Dispatch<React.SetStateAction<boolean>>;
}

function CountdownComp({
  payload,
  setPayload,
  session,
  showPencil = false,
  setShowPencil,
}: CountdownCompProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [isHoveringBg, setIsHoveringBg] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simpan File object, bukan URL
      setPayload({ ...payload, fotoHeader2: file as any });
    }
  };

  function renderer({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: {
    days: any;
    hours: any;
    minutes: any;
    seconds: any;
    completed: any;
  }) {
    return completed ? (
      <span>Acara sudah berlalu.</span>
    ) : (
      <span>
        {days} day {hours} hr
        <br />
        {minutes} min {seconds} sec
      </span>
    );
  }

  return (
    <section 
      id="countdown"
      onMouseEnter={() => session && setIsHoveringBg(true)}
      onMouseLeave={() => session && setIsHoveringBg(false)}
    >
      <div 
        className={clsx('min-h-screen', 'bg-cover', 'bg-[44.5%]', 'text-white', 'relative', 'py-28', 'flex', 'items-end')}
        style={{ 
          backgroundImage: `url('${
            typeof payload?.fotoHeader2 === 'string'
              ? payload.fotoHeader2
              : payload?.fotoHeader2 instanceof File
                ? URL.createObjectURL(payload.fotoHeader2)
                : ''
          }')` 
        }}
      >
        <div className={clsx('absolute', 'inset-0', 'bg-black/30')} />
        <div className={clsx('relative', 'py-8', 'px-10', 'w-full')}>
          <div
            className={clsx('bg-[#00000021]', 'rounded-tr-[3.125rem]', 'rounded-bl-[3.125rem]', 'absolute', 'inset-x-4', 'inset-y-0', 'z-10', 'backdrop-blur-md')}
          />
          <div className={clsx('relative', 'z-20')}>
            <RevealWrapper duration={1500} origin="right">
              <p className={clsx('text-sm', 'font-light')}>WEDDING INVITATION</p>
              <h1 className={clsx('text-3xl', 'font-light', 'mt-2', 'mb-4')}>
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
              <div className={clsx('grid', 'grid-cols-2', 'border-y', 'border-y-white', 'text-center', 'text-[0.75rem]', 'font-light')}>
                <p className={clsx('leading-[1.85]', 'py-2', 'px-2', 'border-r', 'border-r-white', 'flex', 'flex-col', 'gap-2')}>
                  <span>SAVE THE DATE</span>
                  <span>
                    <EditableDateSederhana
                      value={payload?.tanggalPernikahan || ''}
                      onChange={(value) => setPayload({ ...payload, tanggalPernikahan: value })}
                      formatDisplay={formatTanggalIndo}
                      session={session}
                      showPencil={showPencil}
                      setShowPencil={setShowPencil}
                      onCalendarClick={() => setShowCalendar(true)}
                    />
                  </span>
                </p>
                <p className={clsx('py-2', 'px-2', 'flex', 'flex-col', 'gap-2')}>
                  <span>COUNTDOWN</span>
                  <Countdown
                    date={new Date(payload.tanggalPernikahan)}
                    renderer={renderer}
                  />
                </p>
              </div>
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

export default CountdownComp;
