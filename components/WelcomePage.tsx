'use client';

import Image from 'next/image';
import confetti from 'canvas-confetti';
import { ITemplateWeding } from '@/prisma/schema.types';
import clsx from 'clsx';

import SvgCustom from '@/utils/svg';
import { useRef, useState } from 'react';

interface WelcomePageProps {
  onOpen: () => void;
  guestName: string | null;
  showPencil: boolean
  setShowPencil: React.Dispatch<React.SetStateAction<boolean>>
  setPayload: React.Dispatch<React.SetStateAction<ITemplateWeding>>
  payload: ITemplateWeding
  session: string | undefined
  isAdminView?: boolean
}

export default function WelcomePage({ onOpen, guestName, payload, showPencil, setShowPencil, setPayload, session, isAdminView = false }: WelcomePageProps) {
  const { SvgPencil } = SvgCustom()
  const handleOpen = () => {
    // Trigger confetti effect
    console.log("guestName",guestName)
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    // Call the original onOpen function
    onOpen();
  };
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isHoveringImage, setIsHoveringImage] = useState(false)
  const [isEditingNamaPutra, setIsEditingNamaPutra] = useState(false)
  const [isEditingNamaPutri, setIsEditingNamaPutri] = useState(false)
  
  return (
    <div className={clsx('loading-page', 'bg-white-black', 'd-flex', 'justify-content-center', 'align-items-center')} style={{ opacity: 1 }}>
      <div className={clsx('d-flex', 'flex-column', 'text-center', 'overflow-y-auto', 'vh-100', 'justify-content-center', 'align-items-center')}>
        <h2 className={clsx('font-esthetic', 'mb-4')} style={{ fontSize: '2.25rem' }}>The Wedding Of</h2>

        {/* Container untuk image dan pencil */}
        <div 
          className={clsx('relative', 'inline-block')}
          onMouseEnter={() => isAdminView && setIsHoveringImage(true)}
          onMouseLeave={() => isAdminView && setIsHoveringImage(false)}
        >
          {(showPencil || (isAdminView && isHoveringImage)) && (
            <div
              className={clsx(
                "absolute",
                "top-1/2",
                "left-1/2",
                "transform",
                "-translate-x-1/2",
                "-translate-y-1/2",
                "z-10"
              )}
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={clsx(
                  'inline-flex',
                  'items-center',
                  'text-white',
                  'bg-brand',
                  'hover:bg-brand-strong',
                  'box-border',
                  'border-none',
                  'border-transparent',
                  'shadow-xs',
                  'font-medium',
                  'leading-5',
                  'rounded-base',
                  'text-sm',
                  'px-3',
                  'py-2',
                  'focus:outline-none',
                  'focus:ring-0'
                )}
              >
                <SvgPencil className={clsx('w-9', 'h-9', 'text-gray-800')} />
              </button>

              <input
                ref={fileInputRef}
                id="dropzone-file-2"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setPayload((prev) => ({
                      ...prev,
                      fotoHeader: file
                    }))
                  }
                }}
              />
            </div>
          )}

          <Image
            src={
              payload?.fotoHeader 
                ? (typeof payload.fotoHeader === 'string' 
                    ? payload.fotoHeader 
                    : URL.createObjectURL(payload.fotoHeader))
                : '/default-wedding.jpg'
            }
            alt="background"
            width={220}
            height={220}
            className={clsx(
              'img-center-crop rounded-circle border-4 border-gray-300 dark:border-gray-600 shadow mb-4 mx-auto transition-opacity duration-300',
              (showPencil || (isAdminView && isHoveringImage)) ? 'opacity-50 cursor-pointer' : 'opacity-100',
              isAdminView ? 'cursor-pointer' : ''
            )}
            priority
            onClick={() => {
              // Hanya admin yang sama bisa edit
              if (isAdminView) {
                fileInputRef.current?.click()
              }
            }}
            onDoubleClick={() => {
              // Jika data?.user.id ada id nya (user logged in), maka gambar tidak bisa di doubleclick
              if (session) {
                return; // Tidak melakukan apa-apa jika user logged in
              }
              setShowPencil(prev => !prev)
            }}
            style={{
              width: '220px',
              height: '220px',
              objectFit: 'cover',
              objectPosition: '65% 35%'
            }}
          />
        </div>

        <h2
          className={clsx(
            'font-esthetic',
            'mb-4',
            'text-center'
          )}
          style={{ fontSize: '2.25rem' }}
        >
          {showPencil || (session && isEditingNamaPutra) ? (
            <input
              type="text"
              placeholder="Isi Nama"
              onDoubleClick={() => {
                // Jika data?.user.id ada id nya (user logged in), maka gambar tidak bisa di doubleclick
                if (session) {
                  return; // Tidak melakukan apa-apa jika user logged in
                }
                setShowPencil(prev => !prev)
              }}
              onChange={((e) => setPayload({ ...payload, namaLengkapPutra: e.target.value }))}
              onBlur={() => session && setIsEditingNamaPutra(false)}
              className={clsx('bg-transparent', 'border-none', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-center', 'w-full')}
              autoFocus
            />
          ) : (
            <span 
              onClick={() => session && setIsEditingNamaPutra(true)}
              className={clsx(session ? 'cursor-pointer hover:opacity-80' : '')}
            >
              {payload.namaLengkapPutra}
            </span>
          )}

          <br /> & <br />

          {showPencil || (session && isEditingNamaPutri) ? (
            <input
              type="text"
              placeholder="Isi Nama"
              onDoubleClick={() => {
                // Jika data?.user.id ada id nya (user logged in), maka gambar tidak bisa di doubleclick
                if (session) {
                  return; // Tidak melakukan apa-apa jika user logged in
                }
                setShowPencil(prev => !prev)
              }}
              onChange={((e) => setPayload({ ...payload, namaLengkapPutri: e.target.value }))}
              onBlur={() => session && setIsEditingNamaPutri(false)}
              className={clsx('bg-transparent', 'border-none', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-center', 'w-full')}
              autoFocus={isEditingNamaPutri}
            />
          ) : (
            <span 
              onClick={() => session && setIsEditingNamaPutri(true)}
              className={clsx(session ? 'cursor-pointer hover:opacity-80' : '')}
            >
              {payload.namaLengkapPutri}
            </span>
          )}
        </h2>

        {guestName && (
          <div id="guest-name" className="mb-2">
            <small className={clsx('d-block', 'mt-0', 'mb-1', 'mx-0', 'p-0')}>Kepada Yth Bapak/Ibu/Saudara/i</small>
            <p className={clsx('m-0', 'p-0')} style={{ fontSize: '1.25rem' }}>{guestName}</p>
          </div>
        )}

        <button
          onClick={handleOpen}
          type="button"
          className={clsx('btn', 'btn-light', 'shadow', 'rounded-4', 'mt-3', 'mx-auto')}
        >
          <i className={clsx('fa-solid', 'fa-envelope-open', 'fa-bounce', 'me-2')}></i>
          Open Invitation
        </button>
      </div>
    </div>
  );
}
