import React from "react";
import { BaseComponentProps } from "@/types/component-props";
import { RevealWrapper } from "./RevealWrapper";
import SvgCustom from "@/utils/svg";
import clsx from "clsx";
import { formatTanggalIndo } from "@/date";

function WeddingEvents({ payload }: BaseComponentProps) {
  const { SvgClock } = SvgCustom();

  return (
    <section id="wedding-events">
      <div 
        className={clsx('bg-cover', 'bg-center', 'relative', 'px-8', 'pt-8', 'pb-12', 'lg:px-10', 'lg:pt-10', 'lg:pb-14')}
        style={{
          backgroundImage: `url(${
            typeof payload?.fotoHeader2 === 'string'
              ? payload.fotoHeader2
              : '/assets/images/a9.jpeg'
          })`
        }}
      >
        <div className={clsx('bg-transparent', 'bg-[linear-gradient(360deg,#EAEAEA_53%,#424242_100%)]', 'opacity-90', 'absolute', 'inset-0')}></div>
        <div className={clsx('z-10', 'relative')}>
          <h1 className={clsx('text-xl', 'italic', 'text-white', 'text-center', 'font-light')}>
            Wedding Events
          </h1>
          <RevealWrapper duration={1500} origin="bottom">
            <div className="mt-10">
              <div className={clsx('relative', 'inline-block', 'w-full')}>
                <img
                  src={
                    typeof payload?.fotoHeader3 === 'string'
                      ? payload.fotoHeader3
                      : '/assets/images/a1.jpeg'
                  }
                  alt="akad"
                  className={clsx('w-full', 'h-72', 'object-cover', 'rounded-t-[1.25rem]')}
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
                    {formatTanggalIndo(payload.tanggalAkad || payload.tanggalPernikahan)}
                  </h1>
                  <hr className={clsx('border', 'border-[#5a5a5a80]', 'w-full')} />
                  <p className={clsx('flex', 'items-center', 'text-[#5a5a5a]', 'font-light', 'text-sm', 'gap-1.5')}>
                    <SvgClock />
                    <span>
                      <span>{payload.jamMulai || payload.jamAkad || '08:00'}</span>
                      <span className='ml-1'>WIB</span>
                      {payload.jamSelesai && (
                        <>
                          {' '}- <span>{payload.jamSelesai}</span>
                          <span className='ml-1'>WIB</span>
                        </>
                      )}
                    </span>
                  </p>
                  <p className={clsx('text-[0.785rem]', 'text-[#5a5a5a]', 'font-light', 'leading-[1.9]')}>
                    <strong className={clsx('text-black', 'font-bold')}>
                      {payload.lokasiAkad || payload.alamatGedungPernikahan || 'Lokasi Akad'}
                    </strong>
                    <br />
                    {payload.alamatAkad || payload.alamatPernikahan}
                  </p>
                  {payload.linkMaps && (
                    <a
                      href={payload.linkMaps}
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
              <div className={clsx('relative', 'inline-block', 'w-full')}>
                <img
                  src={
                    typeof payload?.fotoHeader4 === 'string'
                      ? payload.fotoHeader4
                      : '/assets/images/a2.jpeg'
                  }
                  alt="resepsi"
                  className={clsx('w-full', 'h-72', 'object-cover', 'rounded-t-[1.25rem]', 'object-left')}
                />
              </div>
              <div className="flex">
                <div className={clsx('w-[80%]', 'bg-white', 'px-4', 'py-6', 'rounded-bl-[1.25rem]', 'flex', 'flex-col', 'gap-5', 'items-baseline')}>
                  <h1 className={clsx('italic', 'text-xl', 'font-light')}>
                    {formatTanggalIndo(payload.tanggalResepsi || payload.tanggalPernikahan)}
                  </h1>
                  <hr className={clsx('border', 'border-[#5a5a5a80]', 'w-full')} />
                  <div>
                    <p className={clsx('flex', 'items-center', 'text-[#5a5a5a]', 'font-light', 'text-[0.8rem]', 'gap-1.5')}>
                      <SvgClock />
                      <span>
                        <span>{payload.jamResepsi || payload.jamSelesai || '11:00'}</span>
                        <span className='mx-1'>WIB</span>
                        - Selesai
                      </span>
                    </p>
                  </div>
                  <p className={clsx('text-[0.785rem]', 'text-[#5a5a5a]', 'font-light', 'leading-[1.9]')}>
                    <strong className={clsx('text-black', 'font-bold')}>
                      {payload.lokasiResepsi || payload.alamatGedungPernikahan || 'Lokasi Resepsi'}
                    </strong>
                    <br />
                    {payload.alamatPernikahan}
                  </p>
                  {payload.linkMaps && (
                    <a
                      href={payload.linkMaps}
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