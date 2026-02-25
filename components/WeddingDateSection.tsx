'use client';

import { useState, useEffect } from 'react';

export default function WeddingDateSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const weddingDate = new Date('2024-01-01T09:30:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = Math.abs(weddingDate - now);

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
    <section id="wedding-date" className="!bg-white dark:!bg-gray-800 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-esthetic text-5xl py-6 text-gray-900 dark:text-white">
          Moment Bahagia
        </h2>
        
        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-full shadow-lg py-4 px-8 mt-4 mb-8 inline-block !bg-white dark:!bg-gray-800">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{timeLeft.days}</p>
              <small className="text-gray-600 dark:text-gray-400">Hari</small>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{timeLeft.hours}</p>
              <small className="text-gray-600 dark:text-gray-400">Jam</small>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{timeLeft.minutes}</p>
              <small className="text-gray-600 dark:text-gray-400">Menit</small>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{timeLeft.seconds}</p>
              <small className="text-gray-600 dark:text-gray-400">Detik</small>
            </div>
          </div>
        </div>
        
        <p className="py-4 text-gray-700 dark:text-gray-300">
          Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, insyaAllah kami akan menyelenggarakan acara:
        </p>
        
        <div className="space-y-8 mt-8">
          <div data-aos="fade-right">
            <h2 className="font-esthetic text-4xl py-4 text-gray-900 dark:text-white">Akad</h2>
            <p className="text-gray-700 dark:text-gray-300">Pukul 10.00 WIB - Selesai</p>
          </div>
          
          <div data-aos="fade-left">
            <h2 className="font-esthetic text-4xl py-4 text-gray-900 dark:text-white">Resepsi</h2>
            <p className="text-gray-700 dark:text-gray-300">Pukul 13.00 WIB - Selesai</p>
          </div>
        </div>
        
        <div className="mt-8">
          <p className="py-4 text-gray-700 dark:text-gray-300">
            Demi kehangatan bersama, kami memohon kesediaan Anda untuk mengenakan dress code berikut:
          </p>
          
          <div className="flex justify-center items-center mb-4">
            <div className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 !bg-white dark:!bg-gray-700 shadow-lg"></div>
            <div className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 !bg-cyan-300 dark:!bg-cyan-600 shadow-lg -ml-4"></div>
            <div className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 !bg-green-500 dark:!bg-green-600 shadow-lg -ml-4"></div>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300">Busana batik dan bersepatu.</p>
        </div>
        
        <div className="mt-8">
          <a
            href="https://goo.gl/maps/ALZR6FJZU3kxVwN86"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-full hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all"
          >
            <i className="fas fa-map-location-dot mr-2"></i>
            Lihat Google Maps
          </a>
          
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            RT 10 RW 02, Desa Pajerukan, Kec. Kalibagor, Kab. Banyumas, Jawa Tengah 53191.
          </p>
        </div>
      </div>
    </section>
  );
}
