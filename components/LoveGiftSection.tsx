'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ITemplateWeding } from '@/prisma/schema.types';
import clsx from 'clsx';

export default function LoveGiftSection({ templateWeding }: { templateWeding: ITemplateWeding }) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <section className={clsx('!bg-gray-50', 'dark:!bg-gray-900', 'py-16', 'px-4')}>
      <div className={clsx('max-w-4xl', 'mx-auto', 'text-center')}>
        <h2 className={clsx('font-esthetic', 'text-5xl', 'pt-6', 'mb-8', 'text-gray-900', 'dark:text-white')}>
          Love Gift
        </h2>
        
        <p className={clsx('mb-8', 'text-gray-700', 'dark:text-gray-300')}>
          Dengan hormat, bagi Anda yang ingin memberikan tanda kasih kepada kami, dapat melalui:
        </p>
        
        <div className={clsx('space-y-4', 'max-w-2xl', 'mx-auto')}>
          {/* Transfer */}
          <div className={clsx('!bg-white', 'dark:!bg-gray-800', 'rounded-2xl', 'shadow-lg', 'p-6', 'text-left')}>
            <div className={clsx('flex', 'items-center', 'justify-between')}>
              <div>
                <i className={clsx('fas', 'fa-money-bill-transfer', 'mr-2', 'text-gray-900', 'dark:text-white')}></i>
                <span className={clsx('font-semibold', 'text-gray-900', 'dark:text-white')}>Transfer</span>
              </div>
              <button
                onClick={() => setOpenSection(openSection === 'transfer' ? null : 'transfer')}
                className={clsx('px-4', 'py-1', 'border', 'border-gray-300', 'dark:border-gray-600', 'rounded-full', 'text-sm', 'text-gray-900', 'dark:text-white', 'hover:bg-gray-100', 'dark:hover:bg-gray-700')}
              >
                <i className={clsx('fas', 'fa-circle-info', 'mr-1')}></i>Info
              </button>
            </div>
            
            <p className={clsx('mt-4', 'text-gray-700', 'dark:text-gray-300')}>
              <i className={clsx('fas', 'fa-user', 'mr-2')}></i>{templateWeding.namaLengkapPutra}
            </p>
            
            {openSection === 'transfer' && (
              <div className={clsx('mt-4', 'pt-4', 'border-t', 'border-gray-200', 'dark:border-gray-700')}>
                <p className={clsx('text-gray-700', 'dark:text-gray-300')}>
                  <i className={clsx('fas', 'fa-building-columns', 'mr-2')}></i>{templateWeding.namaBank}
                </p>
                <div className={clsx('flex', 'items-center', 'justify-between', 'mt-2')}>
                  <p className={clsx('text-gray-700', 'dark:text-gray-300')}>
                    <i className={clsx('fas', 'fa-credit-card', 'mr-2')}></i>{templateWeding.noAtm}
                  </p>
                  <button
                    onClick={() => copyToClipboard(`${templateWeding.noAtm}`)}
                    className={clsx('px-3', 'py-1', 'border', 'border-gray-300', 'dark:border-gray-600', 'rounded-full', 'text-sm', 'text-gray-900', 'dark:text-white', 'hover:bg-gray-100', 'dark:hover:bg-gray-700')}
                  >
                    <i className={clsx('fas', 'fa-copy')}></i>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* QRIS */}
          <div className={clsx('!bg-white', 'dark:!bg-gray-800', 'rounded-2xl', 'shadow-lg', 'p-6', 'text-left')}>
            <div className={clsx('flex', 'items-center', 'justify-between')}>
              <div>
                <i className={clsx('fas', 'fa-qrcode', 'mr-2', 'text-gray-900', 'dark:text-white')}></i>
                <span className={clsx('font-semibold', 'text-gray-900', 'dark:text-white')}>Qris</span>
              </div>
              <button
                onClick={() => setOpenSection(openSection === 'qris' ? null : 'qris')}
                className={clsx('px-4', 'py-1', 'border', 'border-gray-300', 'dark:border-gray-600', 'rounded-full', 'text-sm', 'text-gray-900', 'dark:text-white', 'hover:bg-gray-100', 'dark:hover:bg-gray-700')}
              >
                <i className={clsx('fas', 'fa-circle-info', 'mr-1')}></i>Info
              </button>
            </div>
            
            <p className={clsx('mt-4', 'text-gray-700', 'dark:text-gray-300')}>
              <i className={clsx('fas', 'fa-user', 'mr-2')}></i>{templateWeding.namaLengkapPutra}
            </p>
            
            {openSection === 'qris' && (
              <div className={clsx('mt-4', 'pt-4', 'border-t', 'border-gray-200', 'dark:border-gray-700')}>
                <div className={clsx('flex', 'justify-center')}>
                  <Image
                    src={templateWeding?.fotoQris || "https://res.cloudinary.com/doykilt63/image/upload/v1772185007/udangan/sawer_me1xw1.png"}
                    alt="QRIS"
                    width={300}
                    height={300}
                    className={clsx('max-w-xs', 'rounded-lg', 'bg-white', 'dark:bg-gray-100', 'p-2')}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Gift */}
          <div className={clsx('!bg-white', 'dark:!bg-gray-800', 'rounded-2xl', 'shadow-lg', 'p-6', 'text-left')}>
            <div className={clsx('flex', 'items-center', 'justify-between')}>
              <div>
                <i className={clsx('fas', 'fa-gift', 'mr-2', 'text-gray-900', 'dark:text-white')}></i>
                <span className={clsx('font-semibold', 'text-gray-900', 'dark:text-white')}>Gift</span>
              </div>
              <button
                onClick={() => setOpenSection(openSection === 'gift' ? null : 'gift')}
                className={clsx('px-4', 'py-1', 'border', 'border-gray-300', 'dark:border-gray-600', 'rounded-full', 'text-sm', 'text-gray-900', 'dark:text-white', 'hover:bg-gray-100', 'dark:hover:bg-gray-700')}
              >
                <i className={clsx('fas', 'fa-circle-info', 'mr-1')}></i>Info
              </button>
            </div>
            
            <p className={clsx('mt-4', 'text-gray-700', 'dark:text-gray-300')}>
              <i className={clsx('fas', 'fa-user', 'mr-2')}></i>{templateWeding.namaLengkapPutra}
            </p>
            
            {openSection === 'gift' && (
              <div className={clsx('mt-4', 'pt-4', 'border-t', 'border-gray-200', 'dark:border-gray-700', 'space-y-2')}>
                <div className={clsx('flex', 'items-center', 'justify-between')}>
                  <p className={clsx('text-gray-700', 'dark:text-gray-300')}>
                    <i className={clsx('fas', 'fa-phone-volume', 'mr-2')}></i>{templateWeding.noHp}
                  </p>
                  <button
                    onClick={() => copyToClipboard(`${templateWeding.noHp}`)}
                    className={clsx('px-3', 'py-1', 'border', 'border-gray-300', 'dark:border-gray-600', 'rounded-full', 'text-sm', 'text-gray-900', 'dark:text-white', 'hover:bg-gray-100', 'dark:hover:bg-gray-700')}
                  >
                    <i className={clsx('fas', 'fa-copy')}></i>
                  </button>
                </div>
                <div className={clsx('flex', 'items-center', 'justify-between')}>
                  <p className={clsx('text-gray-700', 'dark:text-gray-300', 'truncate', 'mr-2')}>
                    <i className={clsx('fas', 'fa-location-dot', 'mr-2')}></i>
                    {templateWeding.alamatPernikahan}
                  </p>
                  <button
                    onClick={() => copyToClipboard('Gg. Rahwana, Gintung, Kec. Sukadiri, Kabupaten Tangerang, Banten 15330')}
                    className={clsx('px-3', 'py-1', 'border', 'border-gray-300', 'dark:border-gray-600', 'rounded-full', 'text-sm', 'text-gray-900', 'dark:text-white', 'hover:bg-gray-100', 'dark:hover:bg-gray-700', 'flex-shrink-0')}
                  >
                    <i className={clsx('fas', 'fa-copy')}></i>
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
