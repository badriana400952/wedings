'use client';

import Image from 'next/image';
import confetti from 'canvas-confetti';
import { ITemplateWeding } from '@/prisma/schema.types';
import clsx from 'clsx';
import { ReactNode } from 'react';
import SvgCustom from '@/utils/svg';

interface WelcomePageProps {
  onOpen: () => void;
  guestName: string | null;
  templateWeding: ITemplateWeding
  showPencil: boolean
  setShowPencil: React.Dispatch<React.SetStateAction<boolean>>

}

export default function WelcomePage({ onOpen, guestName, templateWeding, showPencil, setShowPencil }: WelcomePageProps) {
  const { SvgPencil } = SvgCustom()
  const handleOpen = () => {
    // Trigger confetti effect
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

  return (
    <div className={clsx('loading-page', 'bg-white-black', 'd-flex', 'justify-content-center', 'align-items-center')} style={{ opacity: 1 }}>
      <div className={clsx('d-flex', 'flex-column', 'text-center', 'overflow-y-auto', 'vh-100', 'justify-content-center', 'align-items-center')}>
        <h2 className={clsx('font-esthetic', 'mb-4')} style={{ fontSize: '2.25rem' }}>The Wedding Of</h2>
        {showPencil && <div className={clsx('z-100 w-64', 'absolute')} >
          <SvgPencil />
        </div>}
        <Image
          src={templateWeding.fotoHeader}
          alt="background"
          width={220}
          height={220}
          className={clsx('img-center-crop', 'rounded-circle', 'border-4', 'border-gray-300', 'dark:border-gray-600', 'shadow', 'mb-4', 'mx-auto')}
          priority
          onDoubleClick={() => setShowPencil(true)}
          style={{
            width: '220px',
            height: '220px',
            objectFit: 'cover',
            objectPosition: '65% 35%'
          }}
        />

        <h2 className={clsx('font-esthetic', 'mb-4')} style={{ fontSize: '2.25rem' }}>{templateWeding.namaLengkapPutra} <br /> & <br />{templateWeding.namaLengkapPutri}</h2>

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
