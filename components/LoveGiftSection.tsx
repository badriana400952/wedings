'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function LoveGiftSection() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <section className="!bg-gray-50 dark:!bg-gray-900 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-esthetic text-5xl pt-6 mb-8 text-gray-900 dark:text-white">
          Love Gift
        </h2>
        
        <p className="mb-8 text-gray-700 dark:text-gray-300">
          Dengan hormat, bagi Anda yang ingin memberikan tanda kasih kepada kami, dapat melalui:
        </p>
        
        <div className="space-y-4 max-w-2xl mx-auto">
          {/* Transfer */}
          <div className="!bg-white dark:!bg-gray-800 rounded-2xl shadow-lg p-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <i className="fas fa-money-bill-transfer mr-2 text-gray-900 dark:text-white"></i>
                <span className="font-semibold text-gray-900 dark:text-white">Transfer</span>
              </div>
              <button
                onClick={() => setOpenSection(openSection === 'transfer' ? null : 'transfer')}
                className="px-4 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <i className="fas fa-circle-info mr-1"></i>Info
              </button>
            </div>
            
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              <i className="fas fa-user mr-2"></i>Riski Siapa?
            </p>
            
            {openSection === 'transfer' && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300">
                  <i className="fas fa-building-columns mr-2"></i>Bank Central Asia
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    <i className="fas fa-credit-card mr-2"></i>1234567891234
                  </p>
                  <button
                    onClick={() => copyToClipboard('1234567891234')}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* QRIS */}
          <div className="!bg-white dark:!bg-gray-800 rounded-2xl shadow-lg p-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <i className="fas fa-qrcode mr-2 text-gray-900 dark:text-white"></i>
                <span className="font-semibold text-gray-900 dark:text-white">Qris</span>
              </div>
              <button
                onClick={() => setOpenSection(openSection === 'qris' ? null : 'qris')}
                className="px-4 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <i className="fas fa-circle-info mr-1"></i>Info
              </button>
            </div>
            
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              <i className="fas fa-user mr-2"></i>Wahyu Siapa?
            </p>
            
            {openSection === 'qris' && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-center">
                  <Image
                    src="/assets/images/donate.png"
                    alt="QRIS"
                    width={300}
                    height={300}
                    className="max-w-xs rounded-lg bg-white dark:bg-gray-100 p-2"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Gift */}
          <div className="!bg-white dark:!bg-gray-800 rounded-2xl shadow-lg p-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <i className="fas fa-gift mr-2 text-gray-900 dark:text-white"></i>
                <span className="font-semibold text-gray-900 dark:text-white">Gift</span>
              </div>
              <button
                onClick={() => setOpenSection(openSection === 'gift' ? null : 'gift')}
                className="px-4 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <i className="fas fa-circle-info mr-1"></i>Info
              </button>
            </div>
            
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              <i className="fas fa-user mr-2"></i>Wahyu Siapa?
            </p>
            
            {openSection === 'gift' && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-gray-700 dark:text-gray-300">
                    <i className="fas fa-phone-volume mr-2"></i>0812345678
                  </p>
                  <button
                    onClick={() => copyToClipboard('0812345678')}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-700 dark:text-gray-300 truncate mr-2">
                    <i className="fas fa-location-dot mr-2"></i>
                    RT 10 RW 02, Desa Pajerukan, Kec. Kalibagor, Kab. Banyumas, Jawa Tengah 53191.
                  </p>
                  <button
                    onClick={() => copyToClipboard('RT 10 RW 02, Desa Pajerukan, Kec. Kalibagor, Kab. Banyumas, Jawa Tengah 53191.')}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
