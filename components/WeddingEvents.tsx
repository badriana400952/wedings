import React, { useState, useRef } from "react";
import { BaseComponentProps } from "@/types/component-props";
import { RevealWrapper } from "./RevealWrapper";
import SvgCustom from "@/utils/svg";
import clsx from "clsx";
import { formatTanggalIndo } from "@/date";
import EditableDateSederhana from "./EditableDateSederhana";
import EditableText from "./EditableText";

function WeddingEvents({ payload, setPayload, session, showPencil, setShowPencil }: BaseComponentProps) {
  const { SvgClock, SvgPencil } = SvgCustom()
  const [isHoveringBg, setIsHoveringBg] = useState(false)
  const [isHoveringAkad, setIsHoveringAkad] = useState(false)
  const [isHoveringResepsi, setIsHoveringResepsi] = useState(false)
  const fileInputBgRef = useRef<HTMLInputElement>(null)
  const fileInputAkadRef = useRef<HTMLInputElement>(null)
  const fileInputResepsiRef = useRef<HTMLInputElement>(null)

  return (
    <section id="wedding-events">
      <div 
        className={clsx('bg-cover', 'bg-center', 'relative', 'px-8', 'pt-8', 'pb-12', 'lg:px-10', 'lg:pt-10', 'lg:pb-14')}
        style={{
          backgroundImage: `url(${
            typeof payload?.fotoHeader2 === 'string'
              ? payload.fotoHeader2
              : (payload?.fotoHeader2 && typeof payload.fotoHeader2 === 'object' && 'name' in payload.fotoHeader2)
                ? URL.createObjectURL(payload.fotoHeader2 as File)
                : '/assets/images/a9.jpeg'
          })`
        }}
        onMouseEnter={() => session && setIsHoveringBg(true)}
        onMouseLeave={() => session && setIsHoveringBg(false)}
      >
        {(showPencil || (session && isHoveringBg)) && (
          <div className={clsx('absolute', 'top-4', 'right-4', 'z-20')}>
            <button
              type="button"
              onClick={() => fileInputBgRef.current?.click()}
              className={clsx('inline-flex', 'items-center', 'bg-white', 'rounded-full', 'p-2', 'shadow-lg')}
            >
              <SvgPencil className={clsx('w-6', 'h-6', 'text-gray-800')} />
            </button>
            <input
              ref={fileInputBgRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPayload((prev) => ({
                    ...prev,
                    fotoHeader2: file as any
                  }));
                }
              }}
            />
          </div>
        )}
        <div className={clsx('bg-transparent', 'bg-[linear-gradient(360deg,#EAEAEA_53%,#424242_100%)]', 'opacity-90', 'absolute', 'inset-0')}></div>
        <div className={clsx('z-10', 'relative')}>
          <h1 className={clsx('text-xl', 'italic', 'text-white', 'text-center', 'font-light')}>
            Wedding Events
          </h1>
          <RevealWrapper duration={1500} origin="bottom">
            <div className="mt-10">
              <div 
                className={clsx('relative', 'inline-block', 'w-full')}
                onMouseEnter={() => session && setIsHoveringAkad(true)}
                onMouseLeave={() => session && setIsHoveringAkad(false)}
              >
                {(showPencil || (session && isHoveringAkad)) && (
                  <div className={clsx('absolute', 'top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2', 'z-10')}>
                    <button
                      type="button"
                      onClick={() => fileInputAkadRef.current?.click()}
                      className={clsx('inline-flex', 'items-center', 'bg-white', 'rounded-full', 'p-2', 'shadow-lg')}
                    >
                      <SvgPencil className={clsx('w-6', 'h-6', 'text-gray-800')} />
                    </button>
                    <input
                      ref={fileInputAkadRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPayload((prev) => ({
                            ...prev,
                            fotoHeader3: file as any
                          }));
                        }
                      }}
                    />
                  </div>
                )}
                <img
                  src={
                    typeof payload?.fotoHeader3 === 'string'
                      ? payload.fotoHeader3
                      : (payload?.fotoHeader3 && typeof payload.fotoHeader3 === 'object' && 'name' in payload.fotoHeader3)
                        ? URL.createObjectURL(payload.fotoHeader3 as File)
                        : '/assets/images/a1.jpeg'
                  }
                  alt="akad"
                  className={clsx(
                    'w-full', 
                    'h-72', 
                    'object-cover', 
                    'rounded-t-[1.25rem]',
                    'transition-opacity duration-300',
                    (showPencil || (session && isHoveringAkad)) ? 'opacity-50 cursor-pointer' : 'opacity-100',
                    session ? 'cursor-pointer' : ''
                  )}
                  onClick={() => {
                    if (session) {
                      fileInputAkadRef.current?.click();
                    }
                  }}
                  onDoubleClick={() => {
                    if (!session && setShowPencil) {
                      setShowPencil(prev => !prev);
                    }
                  }}
                />
              </div>
              <div className="flex">
                <div className={clsx('w-[20%]', 'bg-[#424242]', 'rounded-bl-[1.25rem]', 'flex', 'items-center')}>
                  <p className={clsx('rotate-90', 'text-center', 'text-white', 'font-bold', 'text-[1.75rem]', '-translate-x-5', 'lg:-translate-x-3.5', 'tracking-[5px]')}>
                    AKAD
                  </p>
                </div>
                <div className={clsx('w-[80%]', 'bg-white', 'px-4', 'py-6', 'rounded-br-[1.25rem]', 'flex', 'flex-col', 'gap-5', 'items-baseline')}>
                  <h1 className={clsx('italic', 'text-xl', 'font-light')}>
                    {formatTanggalIndo(payload.tanggalPernikahan)}
                  </h1>
                  <hr className={clsx('border', 'border-[#5a5a5a80]', 'w-full')} />
                  <p className={clsx('flex', 'items-center', 'text-[#5a5a5a]', 'font-light', 'text-sm', 'gap-1.5')}>
                    <SvgClock />
                    <span>
                      <EditableText
                        value={payload.jamMulai}
                        onChange={(value) => setPayload({ ...payload, jamMulai: value })}
                        placeholder="10:00"
                        session={session}
                        showPencil={showPencil}
                        setShowPencil={setShowPencil}
                      />
                      <span className='ml-1'>WIB</span>
                      -  <EditableText
                        value={payload.jamSelesai}
                        onChange={(value) => setPayload({ ...payload, jamSelesai: value })}
                        placeholder="11:00"
                        session={session}
                        showPencil={showPencil}
                        setShowPencil={setShowPencil}
                      />
                      <span className='ml-1'>WIB</span>

                    </span>
                  </p>
                  <p className={clsx('text-[0.785rem]', 'text-[#5a5a5a]', 'font-light', 'leading-[1.9]')}>
                    <strong className={clsx('text-black', 'font-bold')}>
                      <EditableText
                        value={payload.alamatGedungPernikahan}
                        onChange={(value) => setPayload({ ...payload, alamatGedungPernikahan: value })}
                        placeholder="Mercure Bandung City Center"
                        session={session}
                        showPencil={showPencil}
                        setShowPencil={setShowPencil}
                      />
                    </strong>
                    <br />
                    <EditableText
                      value={payload.alamatPernikahan}
                      onChange={(value) => setPayload({ ...payload, alamatPernikahan: value })}
                      placeholder=" Jl. Lengkong Besar No.8, Cikawao, Kec. Lengkong, Kota
                    Bandung"
                      session={session}
                      showPencil={showPencil}
                      setShowPencil={setShowPencil}
                    />
                  </p>
                  {session ? (
                    <div
                      className={clsx('text-[0.75rem]', 'text-[#424242]', 'border', 'border-[#424242]', 'px-[0.4375rem]', 'py-1.5', 'rounded-full', 'inline-block')}
                    >
                      <EditableText
                        value={payload.linkMaps}
                        onChange={(value) => setPayload({ ...payload, linkMaps: value })}
                        placeholder="Link Google Maps"
                        session={session}
                        showPencil={showPencil}
                        setShowPencil={setShowPencil}
                      />
                    </div>
                  ) : (
                    <a
                      href={payload.linkMaps || "https://www.google.com/maps"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx('text-[0.75rem]', 'text-[#424242]', 'border', 'border-[#424242]', 'px-[0.4375rem]', 'py-1.5', 'rounded-full', 'hover:scale-90', 'ease-linear', 'duration-[0.2s]')}
                    >
                      GOOGLE MAPS
                    </a>
                  )}
                </div>
              </div>
            </div>
          </RevealWrapper>
          <RevealWrapper duration={1500} origin="bottom">
            <div className="mt-6">
              <div 
                className={clsx('relative', 'inline-block', 'w-full')}
                onMouseEnter={() => session && setIsHoveringResepsi(true)}
                onMouseLeave={() => session && setIsHoveringResepsi(false)}
              >
                {(showPencil || (session && isHoveringResepsi)) && (
                  <div className={clsx('absolute', 'top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2', 'z-10')}>
                    <button
                      type="button"
                      onClick={() => fileInputResepsiRef.current?.click()}
                      className={clsx('inline-flex', 'items-center', 'bg-white', 'rounded-full', 'p-2', 'shadow-lg')}
                    >
                      <SvgPencil className={clsx('w-6', 'h-6', 'text-gray-800')} />
                    </button>
                    <input
                      ref={fileInputResepsiRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPayload((prev) => ({
                            ...prev,
                            fotoHeader4: file as any
                          }));
                        }
                      }}
                    />
                  </div>
                )}
                <img
                  src={
                    typeof payload?.fotoHeader4 === 'string'
                      ? payload.fotoHeader4
                      : (payload?.fotoHeader4 && typeof payload.fotoHeader4 === 'object' && 'name' in payload.fotoHeader4)
                        ? URL.createObjectURL(payload.fotoHeader4 as File)
                        : '/assets/images/a2.jpeg'
                  }
                  alt="resepsi"
                  className={clsx(
                    'w-full', 
                    'h-72', 
                    'object-cover', 
                    'rounded-t-[1.25rem]', 
                    'object-left',
                    'transition-opacity duration-300',
                    (showPencil || (session && isHoveringResepsi)) ? 'opacity-50 cursor-pointer' : 'opacity-100',
                    session ? 'cursor-pointer' : ''
                  )}
                  onClick={() => {
                    if (session) {
                      fileInputResepsiRef.current?.click();
                    }
                  }}
                  onDoubleClick={() => {
                    if (!session && setShowPencil) {
                      setShowPencil(prev => !prev);
                    }
                  }}
                />
              </div>
              <div className="flex">
                <div className={clsx('w-[80%]', 'bg-white', 'px-4', 'py-6', 'rounded-bl-[1.25rem]', 'flex', 'flex-col', 'gap-5', 'items-baseline')}>
                  <h1 className={clsx('italic', 'text-xl', 'font-light')}>
                    Saturday, 3 June 2023
                  </h1>
                  <hr className={clsx('border', 'border-[#5a5a5a80]', 'w-full')} />
                  <div>
                    <p className={clsx('flex', 'items-center', 'text-[#5a5a5a]', 'font-light', 'text-[0.8rem]', 'gap-1.5')}>
                      <SvgClock />
                      <span>
                        <EditableText
                          value={payload.jamResepsi}
                          onChange={(value) => setPayload({ ...payload, jamResepsi: value })}
                          placeholder="10:00"
                          session={session}
                          showPencil={showPencil}
                          setShowPencil={setShowPencil}
                        />
                        <span className='mx-1'>WIB</span>
                        -   Selesai
                      </span>
                    </p>

                  </div>
                  <p className={clsx('text-[0.785rem]', 'text-[#5a5a5a]', 'font-light', 'leading-[1.9]')}>
                    <strong className={clsx('text-black', 'font-bold')}>
                      <EditableText
                        value={payload.alamatGedungPernikahan}
                        onChange={(value) => setPayload({ ...payload, alamatGedungPernikahan: value })}
                        placeholder="Mercure Bandung City Center"
                        session={session}
                        showPencil={showPencil}
                        setShowPencil={setShowPencil}
                      />
                    </strong>
                    <br />
                    <EditableText
                      value={payload.alamatPernikahan}
                      onChange={(value) => setPayload({ ...payload, alamatPernikahan: value })}
                      placeholder=" Jl. Lengkong Besar No.8, Cikawao, Kec. Lengkong, Kota
                    Bandung"
                      session={session}
                      showPencil={showPencil}
                      setShowPencil={setShowPencil}
                    />
                  </p>
                  {session ? (
                    <div
                      className={clsx('text-[0.75rem]', 'text-[#424242]', 'border', 'border-[#424242]', 'px-[0.4375rem]', 'py-1.5', 'rounded-full', 'inline-block')}
                    >
                      <EditableText
                        value={payload.linkMaps}
                        onChange={(value) => setPayload({ ...payload, linkMaps: value })}
                        placeholder="Link Google Maps"
                        session={session}
                        showPencil={showPencil}
                        setShowPencil={setShowPencil}
                      />
                    </div>
                  ) : (
                    <a
                      href={payload.linkMaps || "https://www.google.com/maps"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx('text-[0.75rem]', 'text-[#424242]', 'border', 'border-[#424242]', 'px-[0.4375rem]', 'py-1.5', 'rounded-full', 'hover:scale-90', 'ease-linear', 'duration-[0.2s]')}
                    >
                      GOOGLE MAPS
                    </a>
                  )}
                </div>
                <div className={clsx('w-[20%]', 'bg-[#424242]', 'rounded-br-[1.25rem]', 'flex', 'items-center')}>
                  <p className={clsx('-rotate-90', 'text-center', 'text-white', 'font-bold', 'text-[1.75rem]', '-translate-x-[3rem]', 'lg:-translate-x-[2.35rem]', 'tracking-[5px]')}>
                    RESEPSI
                  </p>
                </div>
              </div>
            </div>
          </RevealWrapper>
        </div>
      </div>
    </section>
  );
}

export default WeddingEvents;