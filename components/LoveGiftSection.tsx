'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ITemplateWeding } from '@/prisma/schema.types';
import clsx from 'clsx';

interface IPropss {
  payload: ITemplateWeding
  setPayload: React.Dispatch<React.SetStateAction<ITemplateWeding>>
  showPencil: boolean
  setShowPencil: React.Dispatch<React.SetStateAction<boolean>>
  session: string | undefined
}

export default function LoveGiftSection({
  payload, setPayload, showPencil, setShowPencil, session
}: IPropss) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [isEditingNamaBank, setIsEditingNamaBank] = useState(false);
  const [isEditingNoAtm, setIsEditingNoAtm] = useState(false);
  const [isEditingNoHp, setIsEditingNoHp] = useState(false);
  const qrisFileInputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleQrisFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPayload({
        ...payload,
        fotoQris: result
      });
    };
    reader.readAsDataURL(file);

    // Reset file input
    if (qrisFileInputRef.current) {
      qrisFileInputRef.current.value = '';
    }
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
        
        {/* Hidden file input for QRIS */}
        <input
          type="file"
          ref={qrisFileInputRef}
          onChange={handleQrisFileChange}
          accept="image/*"
          className="hidden"
        />

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
              <i className={clsx('fas', 'fa-user', 'mr-2')}></i>{payload.namaLengkapPutra}
            </p>
            
            {openSection === 'transfer' && (
              <div className={clsx('mt-4', 'pt-4', 'border-t', 'border-gray-200', 'dark:border-gray-700')}>
                <div className={clsx('mb-4')}>
                  <div className={clsx('flex', 'items-center')}>
                    <i className={clsx('fas', 'fa-building-columns', 'mr-2', 'text-gray-700', 'dark:text-gray-300')}></i>
                    {(session && isEditingNamaBank) || showPencil ? (
                      <input
                        type="text"
                        placeholder="Nama Bank"
                        value={payload.namaBank || ''}
                        onChange={(e) => setPayload({ ...payload, namaBank: e.target.value })}
                        onBlur={() => {
                          if (session) {
                            setIsEditingNamaBank(false);
                          } else {
                            setShowPencil(false);
                          }
                        }}
                        className={clsx('bg-transparent', 'border-none', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-gray-700', 'dark:text-gray-300', 'w-full')}
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={() => {
                          if (session) {
                            setIsEditingNamaBank(true);
                          }
                        }}
                        onDoubleClick={() => {
                          if (!session) {
                            setShowPencil(true);
                          }
                        }}
                        className={clsx(session ? 'cursor-pointer hover:opacity-80' : 'cursor-pointer')}
                      >
                        {payload.namaBank || 'Nama Bank'}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className={clsx('flex', 'items-center', 'justify-between', 'mt-2')}>
                  <div className={clsx('flex', 'items-center')}>
                    <i className={clsx('fas', 'fa-credit-card', 'mr-2', 'text-gray-700', 'dark:text-gray-300')}></i>
                    {(session && isEditingNoAtm) || showPencil ? (
                      <input
                        type="text"
                        placeholder="Nomor ATM"
                        value={payload.noAtm || ''}
                        onChange={(e) => setPayload({ ...payload, noAtm: e.target.value })}
                        onBlur={() => {
                          if (session) {
                            setIsEditingNoAtm(false);
                          } else {
                            setShowPencil(false);
                          }
                        }}
                        className={clsx('bg-transparent', 'border-none', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-gray-700', 'dark:text-gray-300', 'w-full')}
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={() => {
                          if (session) {
                            setIsEditingNoAtm(true);
                          }
                        }}
                        onDoubleClick={() => {
                          if (!session) {
                            setShowPencil(true);
                          }
                        }}
                        className={clsx(session ? 'cursor-pointer hover:opacity-80' : 'cursor-pointer')}
                      >
                        {payload.noAtm || 'Nomor ATM'}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${payload.noAtm}`)}
                    className={clsx('px-3', 'py-1', 'border', 'border-gray-300', 'dark:border-gray-600', 'rounded-full', 'text-sm', 'text-gray-900', 'dark:text-white', 'hover:bg-gray-100', 'dark:hover:bg-gray-700', 'flex-shrink-0')}
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
              <i className={clsx('fas', 'fa-user', 'mr-2')}></i>{payload.namaLengkapPutra}
            </p>
            
            {openSection === 'qris' && (
              <div className={clsx('mt-4', 'pt-4', 'border-t', 'border-gray-200', 'dark:border-gray-700')}>
                <div 
                  className={clsx('flex', 'justify-center', 'cursor-pointer')}
                  onClick={() => {
                    if (session || showPencil) {
                      qrisFileInputRef.current?.click();
                    }
                  }}
                  onDoubleClick={() => {
                    if (!session) {
                      setShowPencil(true);
                    }
                  }}
                >
                  <div className={clsx('relative')}>
                    <Image
                      src={payload?.fotoQris || "https://res.cloudinary.com/doykilt63/image/upload/v1772185007/udangan/sawer_me1xw1.png"}
                      alt="QRIS"
                      width={300}
                      height={300}
                      className={clsx('max-w-xs', 'rounded-lg', 'bg-white', 'dark:bg-gray-100', 'p-2', (session || showPencil) ? 'hover:opacity-80' : '')}
                    />
                    {(session || showPencil) && (
                      <div className={clsx('absolute', 'inset-0', 'bg-black/50', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'opacity-0', 'hover:opacity-100', 'transition-opacity')}>
                        <i className={clsx('fas', 'fa-upload', 'text-white', 'text-2xl')}></i>
                      </div>
                    )}
                  </div>
                </div>
                {(session || showPencil) && (
                  <p className={clsx('text-center', 'text-sm', 'text-gray-600', 'dark:text-gray-400', 'mt-2')}>
                    Klik gambar QRIS untuk mengupload gambar baru
                  </p>
                )}
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
              <i className={clsx('fas', 'fa-user', 'mr-2')}></i>{payload.namaLengkapPutra}
            </p>
            
            {openSection === 'gift' && (
              <div className={clsx('mt-4', 'pt-4', 'border-t', 'border-gray-200', 'dark:border-gray-700', 'space-y-2')}>
                <div className={clsx('flex', 'items-center', 'justify-between')}>
                  <div className={clsx('flex', 'items-center')}>
                    <i className={clsx('fas', 'fa-phone-volume', 'mr-2', 'text-gray-700', 'dark:text-gray-300')}></i>
                    {(session && isEditingNoHp) || showPencil ? (
                      <input
                        type="text"
                        placeholder="Nomor HP"
                        value={payload.noHp || ''}
                        onChange={(e) => setPayload({ ...payload, noHp: e.target.value })}
                        onBlur={() => {
                          if (session) {
                            setIsEditingNoHp(false);
                          } else {
                            setShowPencil(false);
                          }
                        }}
                        className={clsx('bg-transparent', 'border-none', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-gray-700', 'dark:text-gray-300', 'w-full')}
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={() => {
                          if (session) {
                            setIsEditingNoHp(true);
                          }
                        }}
                        onDoubleClick={() => {
                          if (!session) {
                            setShowPencil(true);
                          }
                        }}
                        className={clsx(session ? 'cursor-pointer hover:opacity-80' : 'cursor-pointer')}
                      >
                        {payload.noHp || 'Nomor HP'}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${payload.noHp}`)}
                    className={clsx('px-3', 'py-1', 'border', 'border-gray-300', 'dark:border-gray-600', 'rounded-full', 'text-sm', 'text-gray-900', 'dark:text-white', 'hover:bg-gray-100', 'dark:hover:bg-gray-700', 'flex-shrink-0')}
                  >
                    <i className={clsx('fas', 'fa-copy')}></i>
                  </button>
                </div>
                <div className={clsx('flex', 'items-center', 'justify-between')}>
                  <p className={clsx('text-gray-700', 'dark:text-gray-300', 'truncate', 'mr-2')}>
                    <i className={clsx('fas', 'fa-location-dot', 'mr-2')}></i>
                    {payload.alamatPernikahan}
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
