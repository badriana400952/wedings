'use client';

import Image from 'next/image';

export default function BrideSection() {
  return (
    <>
      {/* Wave Separator */}
      <div className="svg-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="color-theme-svg no-gap-bottom">
          <path fill="currentColor" fillOpacity="1" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,96C960,96,1056,160,1152,154.7C1248,149,1344,75,1392,37.3L1440,0L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <section className="bg-white-black text-center text-gray-900 dark:text-white" id="bride">
        <h2 className="font-arabic py-4 m-0 text-gray-900 dark:text-white" style={{ fontSize: '2rem' }}>
          بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </h2>
        <h2 className="font-esthetic py-4 m-0 text-gray-900 dark:text-white" style={{ fontSize: '2rem' }}>
          Assalamualaikum Warahmatullahi Wabarakatuh
        </h2>
        <p className="pb-4 px-2 m-0 text-gray-700 dark:text-gray-300" style={{ fontSize: '0.95rem' }}>
          Tanpa mengurangi rasa hormat, kami mengundang Anda untuk berkenan menghadiri acara pernikahan kami:
        </p>

        <div className="overflow-x-hidden pb-4">
          <div className="position-relative">
            {/* Love animation */}
            <div className="position-absolute" style={{ top: '0%', right: '5%' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="opacity-50 animate-love" viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
              </svg>
            </div>

            <div data-aos="fade-right" data-aos-duration="2000" className="pb-1">
              <Image
                src="/assets/images/a8.jpeg"
                alt="cowo"
                width={208}
                height={208}
                className="img-center-crop rounded-circle border-4 border-gray-300 dark:border-gray-600 shadow my-4 mx-auto cursor-pointer"
              />
              <h2 className="font-esthetic m-0 text-gray-900 dark:text-white" style={{ fontSize: '2.125rem' }}>Nama Wahyu Siapa</h2>
              <p className="mt-3 mb-1 text-gray-800 dark:text-gray-200" style={{ fontSize: '1.25rem' }}>Putra ke-1</p>
              <p className="mb-0 text-gray-700 dark:text-gray-300" style={{ fontSize: '0.95rem' }}>Bapak lorem ipsum</p>
              <p className="mb-0 text-gray-700 dark:text-gray-300" style={{ fontSize: '0.95rem' }}>dan</p>
              <p className="mb-0 text-gray-700 dark:text-gray-300" style={{ fontSize: '0.95rem' }}>Ibu lorem ipsum</p>
            </div>

            {/* Love animation */}
            <div className="position-absolute" style={{ top: '90%', left: '5%' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="opacity-50 animate-love" viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
              </svg>
            </div>
          </div>

          <h2 className="font-esthetic mt-4 text-gray-900 dark:text-white" style={{ fontSize: '4.5rem' }}>&amp;</h2>

          <div className="position-relative">
            {/* Love animation */}
            <div className="position-absolute" style={{ top: '0%', right: '5%' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="opacity-50 animate-love" viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
              </svg>
            </div>

            <div data-aos="fade-left" data-aos-duration="2000" className="pb-1">
              <Image
                src="/assets/images/a9.jpeg"
                alt="cewe"
                width={208}
                height={208}
                className="img-center-crop rounded-circle border-4 border-gray-300 dark:border-gray-600 shadow my-4 mx-auto cursor-pointer"
              />
              <h2 className="font-esthetic m-0 text-gray-900 dark:text-white" style={{ fontSize: '2.125rem' }}>Nama Riski Siapa</h2>
              <p className="mt-3 mb-1 text-gray-800 dark:text-gray-200" style={{ fontSize: '1.25rem' }}>Putri ke-2</p>
              <p className="mb-0 text-gray-700 dark:text-gray-300" style={{ fontSize: '0.95rem' }}>Bapak lorem ipsum</p>
              <p className="mb-0 text-gray-700 dark:text-gray-300" style={{ fontSize: '0.95rem' }}>dan</p>
              <p className="mb-0 text-gray-700 dark:text-gray-300" style={{ fontSize: '0.95rem' }}>Ibu lorem ipsum</p>
            </div>

            {/* Love animation */}
            <div className="position-absolute" style={{ top: '90%', left: '5%' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="opacity-50 animate-love" viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
