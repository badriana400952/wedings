'use client';

import { ITemplateWeding } from '@/prisma/schema.types';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

interface IPropss {
  payload: ITemplateWeding
  setPayload: React.Dispatch<React.SetStateAction<ITemplateWeding>>
  showPencil: boolean
  setShowPencil: React.Dispatch<React.SetStateAction<boolean>>
  session: string | undefined
}

export default function WeddingDateSection({
  payload, setPayload, showPencil, setShowPencil, session
}: IPropss) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEditingJamMulai, setIsEditingJamMulai] = useState(false)
  const [isEditingJamSelesai, setIsEditingJamSelesai] = useState(false)
  const [isEditingLinkMaps, setIsEditingLinkMaps] = useState(false)
  const [isEditingAlamatPernikahan, setIsEditingAlamatPernikahan] = useState(false)

  useEffect(() => {
    const weddingDate = new Date(payload.tanggalPernikahan).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      // If wedding date has passed, show 0
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
  }, []);

  return (
    <section id="wedding-date" className={clsx('!bg-white', 'dark:!bg-gray-800', 'py-16', 'px-4')}>
      <div className={clsx('max-w-4xl', 'mx-auto', 'text-center')}>
        <h2 className={clsx('font-esthetic', 'text-5xl', 'py-6', 'text-gray-900', 'dark:text-white')}>
          Moment Bahagia
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
          Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, insyaAllah kami akan menyelenggarakan acara:
        </p>
        
        <div className={clsx('space-y-8', 'mt-8')}>
          <div data-aos="fade-right">
            <h2 className={clsx('font-esthetic', 'text-4xl', 'py-4', 'text-gray-900', 'dark:text-white')}>Akad</h2>
            <div className={clsx('text-gray-700', 'dark:text-gray-300')}>
              Pukul{' '}
              {showPencil || (session && isEditingJamMulai) ? (
                <input
                  type="text"
                  placeholder="10:00"
                  value={payload.jamMulai || ''}
                  onChange={(e) => setPayload({ ...payload, jamMulai: e.target.value })}
                  onBlur={() => session && setIsEditingJamMulai(false)}
                  className={clsx('bg-transparent', 'border-none', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-center', 'inline-block', 'w-24')}
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => session && setIsEditingJamMulai(true)}
                  className={clsx(session ? 'cursor-pointer hover:opacity-80' : '')}
                >
                  {payload.jamMulai}
                </span>
              )}{' '}
              WIB
            </div>
          </div>
          
          <div data-aos="fade-left">
            <h2 className={clsx('font-esthetic', 'text-4xl', 'py-4', 'text-gray-900', 'dark:text-white')}>Resepsi</h2>
            <div className={clsx('text-gray-700', 'dark:text-gray-300')}>
              Pukul{' '}
              {showPencil || (session && isEditingJamSelesai) ? (
                <input
                  type="text"
                  placeholder="14:00"
                  value={payload.jamSelesai || ''}
                  onChange={(e) => setPayload({ ...payload, jamSelesai: e.target.value })}
                  onBlur={() => session && setIsEditingJamSelesai(false)}
                  className={clsx('bg-transparent', 'border-none', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-center', 'inline-block', 'w-24')}
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => session && setIsEditingJamSelesai(true)}
                  className={clsx(session ? 'cursor-pointer hover:opacity-80' : '')}
                >
                  {payload.jamSelesai}
                </span>
              )}{' '}
              WIB
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <p className={clsx('py-4', 'text-gray-700', 'dark:text-gray-300')}>
            Demi kehangatan bersama, kami memohon kesediaan Anda untuk mengenakan dress code berikut:
          </p>
          
          <div className={clsx('flex', 'justify-center', 'items-center', 'mb-4')}>
            <div className={clsx('w-12', 'h-12', 'rounded-full', 'border-2', 'border-gray-300', 'dark:border-gray-600', '!bg-white', 'dark:!bg-gray-700', 'shadow-lg')}></div>
            <div className={clsx('w-12', 'h-12', 'rounded-full', 'border-2', 'border-gray-300', 'dark:border-gray-600', '!bg-cyan-300', 'dark:!bg-cyan-600', 'shadow-lg', '-ml-4')}></div>
            <div className={clsx('w-12', 'h-12', 'rounded-full', 'border-2', 'border-gray-300', 'dark:border-gray-600', '!bg-green-500', 'dark:!bg-green-600', 'shadow-lg', '-ml-4')}></div>
          </div>
          
          <p className={clsx('text-gray-700', 'dark:text-gray-300')}>Busana batik dan bersepatu.</p>
        </div>
        
        <div className="mt-8">
          <div className="mb-4">
            {showPencil || (session && isEditingLinkMaps) ? (
              <input
                type="text"
                placeholder="https://maps.google.com/..."
                value={payload.linkMaps || ''}
                onChange={(e) => setPayload({ ...payload, linkMaps: e.target.value })}
                onBlur={() => session && setIsEditingLinkMaps(false)}
                className={clsx('bg-transparent', 'border', 'border-gray-300', 'dark:border-gray-600', 'rounded-full', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-center', 'w-full', 'px-6', 'py-2', 'text-gray-900', 'dark:text-white')}
                autoFocus
              />
            ) : (
              <a
                href={payload.linkMaps}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (session) {
                    e.preventDefault()
                    setIsEditingLinkMaps(true)
                  }
                }}
                className={clsx('inline-block', 'px-6', 'py-2', 'border-2', 'border-gray-900', 'dark:border-white', 'text-gray-900', 'dark:text-white', 'rounded-full', 'hover:bg-gray-900', 'hover:text-white', 'dark:hover:bg-white', 'dark:hover:text-gray-900', 'transition-all', session ? 'cursor-pointer' : '')}
              >
                <i className={clsx('fas', 'fa-map-location-dot', 'mr-2')}></i>
                Lihat Google Maps
              </a>
            )}
          </div>
          
          <div className={clsx('mt-4', 'text-sm', 'text-gray-600', 'dark:text-gray-400')}>
            {showPencil || (session && isEditingAlamatPernikahan) ? (
              <textarea
                placeholder="Alamat lengkap pernikahan..."
                value={payload.alamatPernikahan || ''}
                onChange={(e) => setPayload({ ...payload, alamatPernikahan: e.target.value })}
                onBlur={() => session && setIsEditingAlamatPernikahan(false)}
                className={clsx('bg-transparent', 'border', 'border-gray-300', 'dark:border-gray-600', 'rounded-lg', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-center', 'w-full', 'px-4', 'py-2', 'resize-none', 'h-24')}
                autoFocus
              />
            ) : (
              <p
                onClick={() => session && setIsEditingAlamatPernikahan(true)}
                className={clsx(session ? 'cursor-pointer hover:opacity-80' : '')}
              >
                {payload.alamatPernikahan}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}