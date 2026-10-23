'use client';

import { ITemplateWeding } from '@/prisma/schema.types';
import { getSimpleModernContent } from '@/lib/templatePresets';
import clsx from 'clsx';
import Image from 'next/image';

interface IPropss {
  payload: ITemplateWeding;
  setPayload?: React.Dispatch<React.SetStateAction<ITemplateWeding>>;
  showPencil?: boolean;
  setShowPencil?: React.Dispatch<React.SetStateAction<boolean>>;
  session?: string | undefined;
  isAdminView?: boolean;
}

export default function BrideSection({ payload }: IPropss) {
  const aContent = getSimpleModernContent(payload?.customContent);
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
          {aContent.salamArab}
        </h2>
        <h2 className={clsx('font-esthetic', 'py-4', 'm-0', 'text-gray-900', 'dark:text-white')} style={{ fontSize: '2rem' }}>
          {aContent.salamText}
        </h2>
        <p className={clsx('pb-4', 'px-2', 'm-0', 'text-gray-700', 'dark:text-gray-300')} style={{ fontSize: '0.95rem' }}>
          {aContent.pengantarMempelai}
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
              <div className={clsx('relative', 'inline-block')}>
                <Image
                  src={
                    typeof payload.photoPutra === 'string'
                      ? payload.photoPutra
                      : payload.photoPutra instanceof File
                        ? URL.createObjectURL(payload.photoPutra)
                        : "/assets/images/cowo.webp"
                  }
                  alt="Mempelai Pria"
                  width={208}
                  height={208}
                  className="img-center-crop rounded-circle border-4 border-gray-300 dark:border-gray-600 shadow my-4 mx-auto"
                />
              </div>
              
              <h2 className={clsx('font-esthetic', 'm-0', 'text-gray-900', 'dark:text-white')} style={{ fontSize: '2.125rem' }}>
                <span>{payload.namaLengkapPutra || 'Mempelai Pria'}</span>
              </h2>
              <p className={clsx('mt-3', 'mb-1', 'text-gray-800', 'dark:text-gray-200')} style={{ fontSize: '1.25rem' }}>
                {aContent.keteranganAnakPria || payload.kelahiranPutra || 'Putra tercinta'}
              </p>
              <p className={clsx('mb-0', 'text-gray-700', 'dark:text-gray-300')} style={{ fontSize: '0.95rem' }}>
                Bapak <span>{payload.namaAyahPutra || '-'}</span>
              </p>
              <p className={clsx('mb-0', 'text-gray-700', 'dark:text-gray-300')} style={{ fontSize: '0.95rem' }}>dan</p>
              <p className={clsx('mb-0', 'text-gray-700', 'dark:text-gray-300')} style={{ fontSize: '0.95rem' }}>
                Ibu <span>{payload.namaIbuPutra || '-'}</span>
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
              <div className={clsx('relative', 'inline-block')}>
                <Image
                  src={
                    typeof payload.photoPutri === 'string'
                      ? payload.photoPutri
                      : payload.photoPutri instanceof File
                        ? URL.createObjectURL(payload.photoPutri)
                        : "/assets/images/cewe.webp"
                  }
                  alt="Mempelai Wanita"
                  width={208}
                  height={208}
                  className="img-center-crop rounded-circle border-4 border-gray-300 dark:border-gray-600 shadow my-4 mx-auto"
                />
              </div>
              
              <h2 className={clsx('font-esthetic', 'm-0', 'text-gray-900', 'dark:text-white')} style={{ fontSize: '2.125rem' }}>
                <span>{payload.namaLengkapPutri || 'Mempelai Wanita'}</span>
              </h2>
              <p className={clsx('mt-3', 'mb-1', 'text-gray-800', 'dark:text-gray-200')} style={{ fontSize: '1.25rem' }}>
                {aContent.keteranganAnakWanita || payload.kelahiranPutri || 'Putri tercinta'}
              </p>
              <p className={clsx('mb-0', 'text-gray-700', 'dark:text-gray-300')} style={{ fontSize: '0.95rem' }}>
                Bapak <span>{payload.namaAyahPutri || '-'}</span>
              </p>
              <p className={clsx('mb-0', 'text-gray-700', 'dark:text-gray-300')} style={{ fontSize: '0.95rem' }}>dan</p>
              <p className={clsx('mb-0', 'text-gray-700', 'dark:text-gray-300')} style={{ fontSize: '0.95rem' }}>
                Ibu <span>{payload.namaIbuPutri || '-'}</span>
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
        {aContent.ceritaKutipan && (
          <div className="max-w-xl mx-auto px-6 pb-8 pt-2">
            <div className="p-6 rounded-3xl bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm text-center">
              <i className="fas fa-quote-left text-2xl text-gray-400 dark:text-gray-500 mb-3 block"></i>
              <p className="text-gray-700 dark:text-gray-300 italic text-sm md:text-base leading-relaxed">
                &ldquo;{aContent.ceritaKutipan}&rdquo;
              </p>
              {aContent.ceritaSumber && (
                <p className="mt-3 font-semibold text-xs tracking-wider uppercase text-gray-900 dark:text-gray-200">
                  — {aContent.ceritaSumber}
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
