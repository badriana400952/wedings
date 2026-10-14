'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ITemplateWeding } from '@/prisma/schema.types';
import clsx from 'clsx';

interface IPropss {
  payload: ITemplateWeding;
  setPayload?: React.Dispatch<React.SetStateAction<ITemplateWeding>>;
  showPencil?: boolean;
  setShowPencil?: React.Dispatch<React.SetStateAction<boolean>>;
  session?: string | undefined;
}

export default function LoveGiftSection({ payload }: IPropss) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (payload.isGiftActive === false) {
    return null;
  }

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const hasBank = payload.isBankActive !== false && (payload.namaBank || payload.noAtm);
  const hasQris = payload.isQrisActive !== false && payload.fotoQris;
  const hasGiftAddress = payload.noHp || payload.alamatPernikahan;

  if (!hasBank && !hasQris && !hasGiftAddress) {
    return null;
  }

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
          {hasBank && (
            <div className={clsx('!bg-white', 'dark:!bg-gray-800', 'rounded-2xl', 'shadow-lg', 'p-6', 'text-left')}>
              <div className={clsx('flex', 'items-center', 'justify-between')}>
                <div>
                  <i className={clsx('fas', 'fa-money-bill-transfer', 'mr-2', 'text-gray-900', 'dark:text-white')}></i>
                  <span className={clsx('font-semibold', 'text-gray-900', 'dark:text-white')}>Transfer Bank</span>
                </div>
                <button
                  onClick={() => setOpenSection(openSection === 'transfer' ? null : 'transfer')}
                  className={clsx('px-4', 'py-1', 'border', 'border-gray-300', 'dark:border-gray-600', 'rounded-full', 'text-sm', 'text-gray-900', 'dark:text-white', 'hover:bg-gray-100', 'dark:hover:bg-gray-700')}
                >
                  <i className={clsx('fas', 'fa-circle-info', 'mr-1')}></i>Info
                </button>
              </div>
              
              <p className={clsx('mt-4', 'text-gray-700', 'dark:text-gray-300')}>
                <i className={clsx('fas', 'fa-user', 'mr-2')}></i>{payload.namaLengkapPutra || 'Mempelai'}
              </p>
              
              {openSection === 'transfer' && (
                <div className={clsx('mt-4', 'pt-4', 'border-t', 'border-gray-200', 'dark:border-gray-700')}>
                  {payload.namaBank && (
                    <div className={clsx('mb-3 flex items-center text-gray-700 dark:text-gray-300')}>
                      <i className={clsx('fas', 'fa-building-columns', 'mr-2')}></i>
                      <span className="font-medium">{payload.namaBank}</span>
                    </div>
                  )}
                  
                  {payload.noAtm && (
                    <div className={clsx('flex', 'items-center', 'justify-between', 'mt-2')}>
                      <div className={clsx('flex', 'items-center')}>
                        <i className={clsx('fas', 'fa-credit-card', 'mr-2', 'text-gray-700', 'dark:text-gray-300')}></i>
                        <span className="font-mono text-base">{payload.noAtm}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(`${payload.noAtm}`)}
                        className={clsx('px-3', 'py-1', 'border', 'border-gray-300', 'dark:border-gray-600', 'rounded-full', 'text-sm', 'text-gray-900', 'dark:text-white', 'hover:bg-gray-100', 'dark:hover:bg-gray-700', 'flex-shrink-0')}
                      >
                        <i className={clsx('fas', 'fa-copy', 'mr-1')}></i> Salin
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* QRIS */}
          {hasQris && (
            <div className={clsx('!bg-white', 'dark:!bg-gray-800', 'rounded-2xl', 'shadow-lg', 'p-6', 'text-left')}>
              <div className={clsx('flex', 'items-center', 'justify-between')}>
                <div>
                  <i className={clsx('fas', 'fa-qrcode', 'mr-2', 'text-gray-900', 'dark:text-white')}></i>
                  <span className={clsx('font-semibold', 'text-gray-900', 'dark:text-white')}>QRIS</span>
                </div>
                <button
                  onClick={() => setOpenSection(openSection === 'qris' ? null : 'qris')}
                  className={clsx('px-4', 'py-1', 'border', 'border-gray-300', 'dark:border-gray-600', 'rounded-full', 'text-sm', 'text-gray-900', 'dark:text-white', 'hover:bg-gray-100', 'dark:hover:bg-gray-700')}
                >
                  <i className={clsx('fas', 'fa-circle-info', 'mr-1')}></i>Info
                </button>
              </div>
              
              <p className={clsx('mt-4', 'text-gray-700', 'dark:text-gray-300')}>
                <i className={clsx('fas', 'fa-user', 'mr-2')}></i>{payload.namaLengkapPutra || 'Mempelai'}
              </p>
              
              {openSection === 'qris' && (
                <div className={clsx('mt-4', 'pt-4', 'border-t', 'border-gray-200', 'dark:border-gray-700')}>
                  <div className={clsx('flex', 'justify-center')}>
                    <Image
                      src={payload.fotoQris || ''}
                      alt="QRIS"
                      width={280}
                      height={280}
                      className={clsx('max-w-xs', 'rounded-lg', 'bg-white', 'dark:bg-gray-100', 'p-2', 'shadow')}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Gift / Kado Fisik */}
          {hasGiftAddress && (
            <div className={clsx('!bg-white', 'dark:!bg-gray-800', 'rounded-2xl', 'shadow-lg', 'p-6', 'text-left')}>
              <div className={clsx('flex', 'items-center', 'justify-between')}>
                <div>
                  <i className={clsx('fas', 'fa-gift', 'mr-2', 'text-gray-900', 'dark:text-white')}></i>
                  <span className={clsx('font-semibold', 'text-gray-900', 'dark:text-white')}>Kirim Kado</span>
                </div>
                <button
                  onClick={() => setOpenSection(openSection === 'gift' ? null : 'gift')}
                  className={clsx('px-4', 'py-1', 'border', 'border-gray-300', 'dark:border-gray-600', 'rounded-full', 'text-sm', 'text-gray-900', 'dark:text-white', 'hover:bg-gray-100', 'dark:hover:bg-gray-700')}
                >
                  <i className={clsx('fas', 'fa-circle-info', 'mr-1')}></i>Info
                </button>
              </div>
              
              <p className={clsx('mt-4', 'text-gray-700', 'dark:text-gray-300')}>
                <i className={clsx('fas', 'fa-user', 'mr-2')}></i>{payload.namaLengkapPutra || 'Mempelai'}
              </p>
              
              {openSection === 'gift' && (
                <div className={clsx('mt-4', 'pt-4', 'border-t', 'border-gray-200', 'dark:border-gray-700', 'space-y-3')}>
                  {payload.noHp && (
                    <div className={clsx('flex', 'items-center', 'justify-between')}>
                      <div className={clsx('flex', 'items-center')}>
                        <i className={clsx('fas', 'fa-phone-volume', 'mr-2', 'text-gray-700', 'dark:text-gray-300')}></i>
                        <span className="font-mono">{payload.noHp}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(`${payload.noHp}`)}
                        className={clsx('px-3', 'py-1', 'border', 'border-gray-300', 'dark:border-gray-600', 'rounded-full', 'text-sm', 'text-gray-900', 'dark:text-white', 'hover:bg-gray-100', 'dark:hover:bg-gray-700', 'flex-shrink-0')}
                      >
                        <i className={clsx('fas', 'fa-copy', 'mr-1')}></i> Salin
                      </button>
                    </div>
                  )}
                  {payload.alamatPernikahan && (
                    <div className={clsx('flex', 'items-center', 'justify-between')}>
                      <p className={clsx('text-gray-700', 'dark:text-gray-300', 'truncate', 'mr-2')}>
                        <i className={clsx('fas', 'fa-location-dot', 'mr-2')}></i>
                        {payload.alamatPernikahan}
                      </p>
                      <button
                        onClick={() => copyToClipboard(payload.alamatPernikahan || '')}
                        className={clsx('px-3', 'py-1', 'border', 'border-gray-300', 'dark:border-gray-600', 'rounded-full', 'text-sm', 'text-gray-900', 'dark:text-white', 'hover:bg-gray-100', 'dark:hover:bg-gray-700', 'flex-shrink-0')}
                      >
                        <i className={clsx('fas', 'fa-copy', 'mr-1')}></i> Salin
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
