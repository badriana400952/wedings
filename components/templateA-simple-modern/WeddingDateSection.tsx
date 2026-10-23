'use client';

import { ITemplateWeding } from '@/prisma/schema.types';
import { getSimpleModernContent } from '@/lib/templatePresets';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

interface IPropss {
  payload: ITemplateWeding;
  setPayload?: React.Dispatch<React.SetStateAction<ITemplateWeding>>;
  showPencil?: boolean;
  setShowPencil?: React.Dispatch<React.SetStateAction<boolean>>;
  session?: string | undefined;
}

export default function WeddingDateSection({ payload }: IPropss) {
  const aContent = getSimpleModernContent(payload?.customContent);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const weddingDate = new Date(payload.tanggalPernikahan).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [payload.tanggalPernikahan]);

  return (
    <section id="wedding-date" className={clsx('!bg-white', 'dark:!bg-gray-800', 'py-16', 'px-4')}>
      <div className={clsx('max-w-4xl', 'mx-auto', 'text-center')}>
        <h2 className={clsx('font-esthetic', 'text-5xl', 'py-6', 'text-gray-900', 'dark:text-white')}>
          {aContent.judulMoment}
        </h2>
        
        <div className={clsx('border-2', 'border-gray-300', 'dark:border-gray-600', 'rounded-full', 'shadow-lg', 'py-4', 'px-8', 'mt-4', 'mb-8', 'inline-block', '!bg-white', 'dark:!bg-gray-800')}>
          <div className={clsx('grid', 'grid-cols-4', 'gap-4')}>
            <div>
              <p className={clsx('text-2xl', 'font-bold', 'text-gray-900', 'dark:text-white')}>{timeLeft.days}</p>
              <small className={clsx('text-gray-600', 'dark:text-gray-400')}>Hari</small>
            </div>
            <div>
              <p className={clsx('text-2xl', 'font-bold', 'text-gray-900', 'dark:text-white')}>{timeLeft.hours}</p>
              <small className={clsx('text-gray-600', 'dark:text-gray-400')}>Jam</small>
            </div>
            <div>
              <p className={clsx('text-2xl', 'font-bold', 'text-gray-900', 'dark:text-white')}>{timeLeft.minutes}</p>
              <small className={clsx('text-gray-600', 'dark:text-gray-400')}>Menit</small>
            </div>
            <div>
              <p className={clsx('text-2xl', 'font-bold', 'text-gray-900', 'dark:text-white')}>{timeLeft.seconds}</p>
              <small className={clsx('text-gray-600', 'dark:text-gray-400')}>Detik</small>
            </div>
          </div>
        </div>
        
        <p className={clsx('py-4', 'text-gray-700', 'dark:text-gray-300')}>
          {aContent.pengantarAcara}
        </p>
        
        <div className={clsx('space-y-8', 'mt-8')}>
          <div data-aos="fade-right">
            <h2 className={clsx('font-esthetic', 'text-4xl', 'py-4', 'text-gray-900', 'dark:text-white')}>{aContent.labelAkad}</h2>
            <div className={clsx('text-gray-700', 'dark:text-gray-300')}>
              Pukul <span>{payload.jamMulai || payload.jamAkad || '08:00'}</span> WIB
            </div>
            {payload.lokasiAkad && (
              <p className={clsx('mt-2', 'font-semibold', 'text-gray-900', 'dark:text-white')}>
                <i className="fas fa-location-dot mr-1 text-gray-500"></i> {payload.lokasiAkad}
              </p>
            )}
            {payload.alamatAkad && (
              <p className={clsx('text-xs', 'text-gray-600', 'dark:text-gray-400', 'max-w-md', 'mx-auto', 'mt-1')}>
                {payload.alamatAkad}
              </p>
            )}
          </div>
          
          <div data-aos="fade-left">
            <h2 className={clsx('font-esthetic', 'text-4xl', 'py-4', 'text-gray-900', 'dark:text-white')}>{aContent.labelResepsi}</h2>
            <div className={clsx('text-gray-700', 'dark:text-gray-300')}>
              Pukul <span>{payload.jamResepsi ? `${payload.jamResepsi} - ${payload.jamSelesai || 'Selesai'}` : (payload.jamSelesai || '11:00 - Selesai')}</span> WIB
            </div>
            {payload.lokasiResepsi && (
              <p className={clsx('mt-2', 'font-semibold', 'text-gray-900', 'dark:text-white')}>
                <i className="fas fa-location-dot mr-1 text-gray-500"></i> {payload.lokasiResepsi}
              </p>
            )}
            {payload.alamatGedungPernikahan && (
              <p className={clsx('text-xs', 'text-gray-600', 'dark:text-gray-400', 'max-w-md', 'mx-auto', 'mt-1')}>
                {payload.alamatGedungPernikahan}
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <p className={clsx('py-4', 'text-gray-700', 'dark:text-gray-300')}>
            {aContent.dresscodeNote}
          </p>
          
          <div className={clsx('flex', 'justify-center', 'items-center', 'gap-2', 'mb-4')}>
            {aContent.dresscodeColors.map((color, idx) => (
              <div
                key={idx}
                className={clsx('w-12', 'h-12', 'rounded-full', 'border-2', 'border-gray-300', 'dark:border-gray-600', 'shadow-lg')}
                style={{ backgroundColor: color }}
                title={`Warna ${idx + 1}: ${color}`}
              ></div>
            ))}


          </div>
          
          <p className={clsx('text-gray-700', 'dark:text-gray-300')}>{aContent.dresscodeText}</p>
        </div>
        
        <div className="mt-8">
          {payload.linkMaps && (
            <div className="mb-4">
              <a
                href={payload.linkMaps}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx('inline-block', 'px-6', 'py-2', 'border-2', 'border-gray-900', 'dark:border-white', 'text-gray-900', 'dark:text-white', 'rounded-full', 'hover:bg-gray-900', 'hover:text-white', 'dark:hover:bg-white', 'dark:hover:text-gray-900', 'transition-all')}
              >
                <i className={clsx('fas', 'fa-map-location-dot', 'mr-2')}></i>
                Lihat Google Maps
              </a>
            </div>
          )}
          
          {payload.alamatPernikahan && (
            <div className={clsx('mt-4', 'text-sm', 'text-gray-600', 'dark:text-gray-400', 'max-w-md', 'mx-auto')}>
              <p>{payload.alamatPernikahan}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}