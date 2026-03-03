'use client';

import { ITemplateWeding } from '@/prisma/schema.types';
import clsx from 'clsx';
import Image from 'next/image';
import { useRef, useState } from 'react';
import SvgCustom from '@/utils/svg';

interface IPropss {
  payload: ITemplateWeding
  setPayload: React.Dispatch<React.SetStateAction<ITemplateWeding>>
  showPencil: boolean
  setShowPencil: React.Dispatch<React.SetStateAction<boolean>>
  session: string | undefined
  isAdminView: boolean
}

export default function BrideSection({
  payload, setPayload, showPencil, setShowPencil, session, isAdminView
}: IPropss) {
  const { SvgPencil } = SvgCustom()
  const [isHoveringPhotoPutra, setIsHoveringPhotoPutra] = useState(false)
  const [isHoveringPhotoPutri, setIsHoveringPhotoPutri] = useState(false)
  const [isEditingNamaLengkapPutra, setIsEditingNamaLengkapPutra] = useState(false)
  const [isEditingNamaAyahPutra, setIsEditingNamaAyahPutra] = useState(false)
  const [isEditingNamaIbuPutra, setIsEditingNamaIbuPutra] = useState(false)
  const [isEditingNamaLengkapPutri, setIsEditingNamaLengkapPutri] = useState(false)
  const [isEditingNamaAyahPutri, setIsEditingNamaAyahPutri] = useState(false)
  const [isEditingNamaIbuPutri, setIsEditingNamaIbuPutri] = useState(false)
  
  const fileInputPutraRef = useRef<HTMLInputElement>(null)
  const fileInputPutriRef = useRef<HTMLInputElement>(null)
  return (
    <>
      {/* Wave Separator */}
      <div className="svg-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className={clsx('color-theme-svg', 'no-gap-bottom')}>
          <path fill="currentColor" fillOpacity="1" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,96C960,96,1056,160,1152,154.7C1248,149,1344,75,1392,37.3L1440,0L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <section className={clsx('bg-white-black', 'text-center', 'text-gray-900', 'dark:text-white')} id="bride">
        <h2 className={clsx('font-arabic', 'py-4', 'm-0', 'text-gray-900', 'dark:text-white')} style={{ fontSize: '2rem' }}>
          بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </h2>
        <h2 className={clsx('font-esthetic', 'py-4', 'm-0', 'text-gray-900', 'dark:text-white')} style={{ fontSize: '2rem' }}>
          Assalamualaikum Warahmatullahi Wabarakatuh
        </h2>
        <p className={clsx('pb-4', 'px-2', 'm-0', 'text-gray-700', 'dark:text-gray-300')} style={{ fontSize: '0.95rem' }}>
          Tanpa mengurangi rasa hormat, kami mengundang Anda untuk berkenan menghadiri acara pernikahan kami:
        </p>

        <div className={clsx('overflow-x-hidden', 'pb-4')}>
          <div className="position-relative">
            {/* Love animation */}
            <div className="position-absolute" style={{ top: '0%', right: '5%' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className={clsx('opacity-50', 'animate-love')} viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
              </svg>
            </div>

            <div data-aos="fade-right" data-aos-duration="2000" className="pb-1">
              {/* Container untuk photoPutra dan pencil */}
              <div 
                className={clsx('relative', 'inline-block')}
                onMouseEnter={() => session && setIsHoveringPhotoPutra(true)}
                onMouseLeave={() => session && setIsHoveringPhotoPutra(false)}
              >
                {(showPencil || (session && isHoveringPhotoPutra)) && (
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
                      onClick={() => fileInputPutraRef.current?.click()}
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
                      ref={fileInputPutraRef}
                      id="dropzone-file-putra"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setPayload((prev) => ({
                            ...prev,
                            photoPutra: URL.createObjectURL(file)
                          }))
                        }
                      }}
                    />
                  </div>
                )}

                <Image
                  src={payload.photoPutra}
                  alt="cowo"
                  width={208}
                  height={208}
                  className={clsx(
                    'img-center-crop',
                    'rounded-circle',
                    'border-4',
                    'border-gray-300',
                    'dark:border-gray-600',
                    'shadow',
                    'my-4',
                    'mx-auto',
                    'transition-opacity duration-300',
                    (showPencil || (session && isHoveringPhotoPutra)) ? 'opacity-50 cursor-pointer' : 'opacity-100',
                    session ? 'cursor-pointer' : ''
                  )}
                  onClick={() => {
                    // Jika session ada id-nya (user logged in), maka ketika diklik muncul upload
                    if (session) {
                      fileInputPutraRef.current?.click()
                    }
                  }}
                  onDoubleClick={() => {
                    // Jika data?.user.id ada id nya (user logged in), maka gambar tidak bisa di doubleclick
                    if (session) {
                      return; // Tidak melakukan apa-apa jika user logged in
                    }
                    setShowPencil(prev => !prev)
                  }}
                />
              </div>
              
              <h2 className={clsx('font-esthetic', 'm-0', 'text-gray-900', 'dark:text-white')} style={{ fontSize: '2.125rem' }}>
                {showPencil || (session && isEditingNamaLengkapPutra) ? (
                  <input
                    type="text"
                    placeholder="Nama Lengkap Putra"
                    onDoubleClick={() => {
                      if (session) {
                        return;
                      }
                      setShowPencil(prev => !prev)
                    }}
                    value={payload.namaLengkapPutra || ''}
                    onChange={(e) => setPayload({ ...payload, namaLengkapPutra: e.target.value })}
                    onBlur={() => session && setIsEditingNamaLengkapPutra(false)}
                    className={clsx('bg-transparent', 'border-none', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-center', 'w-full')}
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => session && setIsEditingNamaLengkapPutra(true)}
                    className={clsx(session ? 'cursor-pointer hover:opacity-80' : '')}
                  >
                    {payload.namaLengkapPutra}
                  </span>
                )}
              </h2>
              <p className={clsx('mt-3', 'mb-1', 'text-gray-800', 'dark:text-gray-200')} style={{ fontSize: '1.25rem' }}>Putra ke-1</p>
              <p className={clsx('mb-0', 'text-gray-700', 'dark:text-gray-300')} style={{ fontSize: '0.95rem' }}>
                Bapak{' '}
                {showPencil || (session && isEditingNamaAyahPutra) ? (
                  <input
                    type="text"
                    placeholder="Nama Ayah Putra"
                    onDoubleClick={() => {
                      if (session) {
                        return;
                      }
                      setShowPencil(prev => !prev)
                    }}
                    value={payload.namaAyahPutra || ''}
                    onChange={(e) => setPayload({ ...payload, namaAyahPutra: e.target.value })}
                    onBlur={() => session && setIsEditingNamaAyahPutra(false)}
                    className={clsx('bg-transparent', 'border-none', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-center', 'inline-block', 'w-32')}
                    autoFocus={isEditingNamaAyahPutra}
                  />
                ) : (
                  <span
                    onClick={() => session && setIsEditingNamaAyahPutra(true)}
                    className={clsx(session ? 'cursor-pointer hover:opacity-80' : '')}
                  >
                    {payload.namaAyahPutra}
                  </span>
                )}
              </p>
              <p className={clsx('mb-0', 'text-gray-700', 'dark:text-gray-300')} style={{ fontSize: '0.95rem' }}>dan</p>
              <p className={clsx('mb-0', 'text-gray-700', 'dark:text-gray-300')} style={{ fontSize: '0.95rem' }}>
                Ibu{' '}
                {showPencil || (session && isEditingNamaIbuPutra) ? (
                  <input
                    type="text"
                    placeholder="Nama Ibu Putra"
                    onDoubleClick={() => {
                      if (session) {
                        return;
                      }
                      setShowPencil(prev => !prev)
                    }}
                    value={payload.namaIbuPutra || ''}
                    onChange={(e) => setPayload({ ...payload, namaIbuPutra: e.target.value })}
                    onBlur={() => session && setIsEditingNamaIbuPutra(false)}
                    className={clsx('bg-transparent', 'border-none', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-center', 'inline-block', 'w-32')}
                    autoFocus={isEditingNamaIbuPutra}
                  />
                ) : (
                  <span
                    onClick={() => session && setIsEditingNamaIbuPutra(true)}
                    className={clsx(session ? 'cursor-pointer hover:opacity-80' : '')}
                  >
                    {payload.namaIbuPutra}
                  </span>
                )}
              </p>
            </div>

            {/* Love animation */}
            <div className="position-absolute" style={{ top: '90%', left: '5%' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className={clsx('opacity-50', 'animate-love')} viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
              </svg>
            </div>
          </div>

          <h2 className={clsx('font-esthetic', 'mt-4', 'text-gray-900', 'dark:text-white')} style={{ fontSize: '4.5rem' }}>&amp;</h2>

          <div className="position-relative">
            {/* Love animation */}
            <div className="position-absolute" style={{ top: '0%', right: '5%' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className={clsx('opacity-50', 'animate-love')} viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
              </svg>
            </div>

            <div data-aos="fade-left" data-aos-duration="2000" className="pb-1">
              {/* Container untuk photoPutri dan pencil */}
              <div 
                className={clsx('relative', 'inline-block')}
                onMouseEnter={() => session && setIsHoveringPhotoPutri(true)}
                onMouseLeave={() => session && setIsHoveringPhotoPutri(false)}
              >
                {(showPencil || (session && isHoveringPhotoPutri)) && (
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
                      onClick={() => fileInputPutriRef.current?.click()}
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
                      ref={fileInputPutriRef}
                      id="dropzone-file-putri"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setPayload((prev) => ({
                            ...prev,
                            photoPutri: URL.createObjectURL(file)
                          }))
                        }
                      }}
                    />
                  </div>
                )}

                <Image
                  src={payload.photoPutri}
                  alt="cewe"
                  width={208}
                  height={208}
                  className={clsx(
                    'img-center-crop',
                    'rounded-circle',
                    'border-4',
                    'border-gray-300',
                    'dark:border-gray-600',
                    'shadow',
                    'my-4',
                    'mx-auto',
                    'transition-opacity duration-300',
                    (showPencil || (session && isHoveringPhotoPutri)) ? 'opacity-50 cursor-pointer' : 'opacity-100',
                    session ? 'cursor-pointer' : ''
                  )}
                  onClick={() => {
                    // Jika session ada id-nya (user logged in), maka ketika diklik muncul upload
                    if (session) {
                      fileInputPutriRef.current?.click()
                    }
                  }}
                  onDoubleClick={() => {
                    // Jika data?.user.id ada id nya (user logged in), maka gambar tidak bisa di doubleclick
                    if (session) {
                      return; // Tidak melakukan apa-apa jika user logged in
                    }
                    setShowPencil(prev => !prev)
                  }}
                />
              </div>
              
              <h2 className={clsx('font-esthetic', 'm-0', 'text-gray-900', 'dark:text-white')} style={{ fontSize: '2.125rem' }}>
                {showPencil || (session && isEditingNamaLengkapPutri) ? (
                  <input
                    type="text"
                    placeholder="Nama Lengkap Putri"
                    onDoubleClick={() => {
                      if (session) {
                        return;
                      }
                      setShowPencil(prev => !prev)
                    }}
                    value={payload.namaLengkapPutri || ''}
                    onChange={(e) => setPayload({ ...payload, namaLengkapPutri: e.target.value })}
                    onBlur={() => session && setIsEditingNamaLengkapPutri(false)}
                    className={clsx('bg-transparent', 'border-none', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-center', 'w-full')}
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => session && setIsEditingNamaLengkapPutri(true)}
                    className={clsx(session ? 'cursor-pointer hover:opacity-80' : '')}
                  >
                    {payload.namaLengkapPutri}
                  </span>
                )}
              </h2>
              <p className={clsx('mt-3', 'mb-1', 'text-gray-800', 'dark:text-gray-200')} style={{ fontSize: '1.25rem' }}>Putri ke-2</p>
              <p className={clsx('mb-0', 'text-gray-700', 'dark:text-gray-300')} style={{ fontSize: '0.95rem' }}>
                Bapak{' '}
                {showPencil || (session && isEditingNamaAyahPutri) ? (
                  <input
                    type="text"
                    placeholder="Nama Ayah Putri"
                    onDoubleClick={() => {
                      if (session) {
                        return;
                      }
                      setShowPencil(prev => !prev)
                    }}
                    value={payload.namaAyahPutri || ''}
                    onChange={(e) => setPayload({ ...payload, namaAyahPutri: e.target.value })}
                    onBlur={() => session && setIsEditingNamaAyahPutri(false)}
                    className={clsx('bg-transparent', 'border-none', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-center', 'inline-block', 'w-32')}
                    autoFocus={isEditingNamaAyahPutri}
                  />
                ) : (
                  <span
                    onClick={() => session && setIsEditingNamaAyahPutri(true)}
                    className={clsx(session ? 'cursor-pointer hover:opacity-80' : '')}
                  >
                    {payload.namaAyahPutri}
                  </span>
                )}
              </p>
              <p className={clsx('mb-0', 'text-gray-700', 'dark:text-gray-300')} style={{ fontSize: '0.95rem' }}>dan</p>
              <p className={clsx('mb-0', 'text-gray-700', 'dark:text-gray-300')} style={{ fontSize: '0.95rem' }}>
                Ibu{' '}
                {showPencil || (session && isEditingNamaIbuPutri) ? (
                  <input
                    type="text"
                    placeholder="Nama Ibu Putri"
                    onDoubleClick={() => {
                      if (session) {
                        return;
                      }
                      setShowPencil(prev => !prev)
                    }}
                    value={payload.namaIbuPutri || ''}
                    onChange={(e) => setPayload({ ...payload, namaIbuPutri: e.target.value })}
                    onBlur={() => session && setIsEditingNamaIbuPutri(false)}
                    className={clsx('bg-transparent', 'border-none', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-center', 'inline-block', 'w-32')}
                    autoFocus={isEditingNamaIbuPutri}
                  />
                ) : (
                  <span
                    onClick={() => session && setIsEditingNamaIbuPutri(true)}
                    className={clsx(session ? 'cursor-pointer hover:opacity-80' : '')}
                  >
                    {payload.namaIbuPutri}
                  </span>
                )}
              </p>
            </div>

            {/* Love animation */}
            <div className="position-absolute" style={{ top: '90%', left: '5%' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className={clsx('opacity-50', 'animate-love')} viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
