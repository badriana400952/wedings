import React, { useState } from "react";
import { BaseComponentProps } from "@/types/component-props";
import { RevealWrapper } from "./RevealWrapper";
import SvgCustom from "@/utils/svg";
import clsx from "clsx";
import { formatTanggalIndo } from "@/date";
import EditableDateSederhana from "./EditableDateSederhana";
import EditableText from "./EditableText";

function WeddingEvents({ payload, setPayload, session, showPencil, setShowPencil }: BaseComponentProps) {
  const { SvgClock } = SvgCustom()
  return (
    <section id="wedding-events">
      <div className={clsx(`bg-[url('/assets/images/a9.jpeg')]`, 'bg-cover', 'bg-center', 'relative', 'px-8', 'pt-8', 'pb-12', 'lg:px-10', 'lg:pt-10', 'lg:pb-14')}>
        <div className={clsx('bg-transparent', 'bg-[linear-gradient(360deg,#EAEAEA_53%,#424242_100%)]', 'opacity-90', 'absolute', 'inset-0')}></div>
        <div className={clsx('z-10', 'relative')}>
          <h1 className={clsx('text-xl', 'italic', 'text-white', 'text-center', 'font-light')}>
            Wedding Events
          </h1>
          <RevealWrapper duration={1500} origin="bottom">
            <div className="mt-10">
              <img
                src="/assets/images/a1.jpeg"
                alt="akad"
                className={clsx('w-full', 'h-72', 'object-cover', 'rounded-t-[1.25rem]')}
              />
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
                    WIB 
                    -  <EditableText
                      value={payload.jamResepsi}
                      onChange={(value) => setPayload({ ...payload, jamResepsi: value })}
                      placeholder="11:00"
                      session={session}
                      showPencil={showPencil}
                      setShowPencil={setShowPencil}
                    /> 
                     WIB
                    </span>
                  </p>
                  <p className={clsx('text-[0.785rem]', 'text-[#5a5a5a]', 'font-light', 'leading-[1.9]')}>
                    <strong className={clsx('text-black', 'font-bold')}>
                      Mercure Bandung City Center
                    </strong>
                    <br />
                    Jl. Lengkong Besar No.8, Cikawao, Kec. Lengkong, Kota
                    Bandung
                  </p>
                  <a
                    href="https://www.google.com/maps/place/Mercure+Bandung+City+Centre/@-6.9238326,107.608777,17z/data=!3m1!4b1!4m9!3m8!1s0x2e68e628c43b0159:0x7ad6a19680a00592!5m2!4m1!1i2!8m2!3d-6.9238326!4d107.6113519!16s%2Fg%2F11c5ggy5hx"
                    className={clsx('text-[0.75rem]', 'text-[#424242]', 'border', 'border-[#424242]', 'px-[0.4375rem]', 'py-1.5', 'rounded-full', 'hover:scale-90', 'ease-linear', 'duration-[0.2s]')}
                  >
                    GOOGLE MAPS
                  </a>
                </div>
              </div>
            </div>
          </RevealWrapper>
          <RevealWrapper duration={1500} origin="bottom">
            <div className="mt-6">
              <img
                src="/assets/images/a2.jpeg"
                alt="resepsi"
                className={clsx('w-full', 'h-72', 'object-cover', 'rounded-t-[1.25rem]', 'object-left')}
              />
              <div className="flex">
                <div className={clsx('w-[80%]', 'bg-white', 'px-4', 'py-6', 'rounded-bl-[1.25rem]', 'flex', 'flex-col', 'gap-5', 'items-baseline')}>
                  <h1 className={clsx('italic', 'text-xl', 'font-light')}>
                    Saturday, 3 June 2023
                  </h1>
                  <hr className={clsx('border', 'border-[#5a5a5a80]', 'w-full')} />
                  <div>
                    <p className={clsx('flex', 'items-center', 'text-[#5a5a5a]', 'font-light', 'text-[0.8rem]', 'gap-1.5')}>
                      <SvgClock />
                      <span>12.00 WIB - 14.00 WIB (Base 1)</span>
                    </p>
                    <p className={clsx('flex', 'items-center', 'text-[#5a5a5a]', 'font-light', 'text-[0.8rem]', 'gap-1.5', 'mt-1')}>
                      <SvgClock />
                      <span>15.00 WIB - 17.00 WIB (Base 2)</span>
                    </p>
                  </div>
                  <p className={clsx('text-[0.785rem]', 'text-[#5a5a5a]', 'font-light', 'leading-[1.9]')}>
                    <strong className={clsx('text-black', 'font-bold')}>
                      Mercure Bandung City Center
                    </strong>
                    <br />
                    Jl. Lengkong Besar No.8, Cikawao, Kec. Lengkong, Kota
                    Bandung
                  </p>
                  <a
                    href="https://www.google.com/maps/place/Mercure+Bandung+City+Centre/@-6.9238326,107.608777,17z/data=!3m1!4b1!4m9!3m8!1s0x2e68e628c43b0159:0x7ad6a19680a00592!5m2!4m1!1i2!8m2!3d-6.9238326!4d107.6113519!16s%2Fg%2F11c5ggy5hx"
                    className={clsx('text-[0.75rem]', 'text-[#424242]', 'border', 'border-[#424242]', 'px-[0.4375rem]', 'py-1.5', 'rounded-full', 'hover:scale-90', 'ease-linear', 'duration-[0.2s]')}
                  >
                    GOOGLE MAPS
                  </a>
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