'use client';

import clsx from 'clsx';
import Image from 'next/image';

export default function HomePage() {
  return (
    <section id="home" className={clsx('bg-light-dark', 'position-relative', 'overflow-hidden', 'p-0', 'm-0')}>
      <div className={clsx('position-absolute', 'opacity-25', 'top-50', 'start-50', 'translate-middle')} style={{ width: '100%', height: '100%' }}>
        <Image
          src="/assets/images/a1.jpeg"
          alt="bg"
          fill
          className="bg-cover-home"
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      
      <div className={clsx('position-relative', 'text-center', 'bg-overlay-auto')} style={{ backgroundColor: 'unset' }}>
        <h1 className={clsx('font-esthetic', 'pt-5', 'pb-4', 'fw-medium', 'text-gray-900', 'dark:text-white')} style={{ fontSize: '2.25rem' }}>
          Undangan Pernikahan
        </h1>
        
        <Image
          src="/assets/images/a2.jpeg"
          alt="bg"
          width={208}
          height={208}
          className={clsx('img-center-crop', 'rounded-circle', 'border-4', 'border-gray-300', 'dark:border-gray-600', 'shadow', 'my-4', 'mx-auto', 'cursor-pointer')}
          priority
        />
        
        <h2 className={clsx('font-esthetic', 'my-4', 'text-gray-900', 'dark:text-white')} style={{ fontSize: '2.25rem' }}>
          Abdul Mujadid 
        </h2>
        
        <p className={clsx('my-2', 'text-gray-800', 'dark:text-gray-200')} style={{ fontSize: '1.25rem' }}>
          Minggu, 31 Mei 2026
        </p>
        
        <a
          href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Abdul+Mujadid+%26+Lorem+ipsum&dates=20260531T020000Z/20260531T150000Z&details=Undangan+Pernikahan+Abdul+Mujadid+dan+Lorem+ipsum.+Akad+pukul+09.00+WIB,+Resepsi+pukul+22.00+WIB&location=RT+10+RW+02,+Desa+Pajerukan,+Kec.+Kalibagor,+Kab.+Banyumas,+Jawa+Tengah+53191"
          target="_blank"
          rel="noopener noreferrer"
          className={clsx('btn', 'btn-outline-auto', 'btn-sm', 'shadow', 'rounded-pill', 'px-3', 'py-1', 'text-gray-900', 'dark:text-white', 'border-gray-900', 'dark:border-white', 'hover:bg-gray-900', 'hover:text-white', 'dark:hover:bg-white', 'dark:hover:text-gray-900', 'cursor-pointer')} 
          style={{ fontSize: '0.825rem', textDecoration: 'none' }}
        >
          <i className={clsx('fa-solid', 'fa-calendar-check', 'me-2')}></i>Save Google Calendar
        </a>
        
        <div className={clsx('d-flex', 'justify-content-center', 'align-items-center', 'mt-4', 'mb-2')}>
          <div className={clsx('mouse-animation', 'border', 'border-secondary', 'border-2', 'rounded-5', 'px-2', 'py-1', 'opacity-50')}>
            <div className={clsx('scroll-animation', 'rounded-4', 'bg-secondary')}></div>
          </div>
        </div>
        
        <p className={clsx('pb-4', 'm-0', 'text-secondary')} style={{ fontSize: '0.825rem' }}>Scroll Down</p>
      </div>
    </section>
  );
}
