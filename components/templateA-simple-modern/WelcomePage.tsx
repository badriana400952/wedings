'use client';

import Image from 'next/image';
import confetti from 'canvas-confetti';
import { ITemplateWeding } from '@/prisma/schema.types';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

interface WelcomePageProps {
  onOpen: () => void;
  guestName: string | null;
  showPencil?: boolean;
  setShowPencil?: React.Dispatch<React.SetStateAction<boolean>>;
  setPayload?: React.Dispatch<React.SetStateAction<ITemplateWeding>>;
  payload: ITemplateWeding;
  session?: string | undefined;
  isAdminView?: boolean;
}

export default function WelcomePage({ onOpen, guestName, payload }: WelcomePageProps) {
  const router = useRouter();
  const { data } = useSession();

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

    onOpen();
  };

  const handleToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className={clsx('loading-page', 'bg-white-black', 'd-flex', 'justify-content-center', 'align-items-center')} style={{ opacity: 1 }}>
      <div className={clsx('d-flex', 'flex-column', 'text-center', 'overflow-y-auto', 'vh-100', 'justify-content-center', 'align-items-center')}>
        <h2 className={clsx('font-esthetic', 'mb-4')} style={{ fontSize: '2.25rem' }}>The Wedding Of</h2>

        {/* Foto Pasangan */}
        <div className={clsx('relative', 'inline-block')}>
          <Image
            src={
              payload?.fotoHeader 
                ? (typeof payload?.fotoHeader === 'string' 
                    ? payload?.fotoHeader 
                    : '/default-wedding.jpg')
                : '/default-wedding.jpg'
            }
            alt="Foto Mempelai"
            width={220}
            height={220}
            className="img-center-crop rounded-circle border-4 border-gray-300 dark:border-gray-600 shadow mb-4 mx-auto"
            priority
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
          <span>{payload?.namaLengkapPutra || 'Mempelai Pria'}</span>
          <br /> & <br />
          <span>{payload?.namaLengkapPutri || 'Mempelai Wanita'}</span>
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

        {data?.user?.id && (
          <button
            onClick={handleToDashboard}
            type="button"
            className={clsx('btn', 'btn-light', 'shadow', 'rounded-4', 'mt-3', 'mx-auto')}
          >
            To Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
