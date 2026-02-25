'use client';

import Image from 'next/image';

export default function HomePage() {
  return (
    <section id="home" className="bg-light-dark position-relative overflow-hidden p-0 m-0">
      <div className="position-absolute opacity-25 top-50 start-50 translate-middle" style={{ width: '100%', height: '100%' }}>
        <Image
          src="/assets/images/a1.jpeg"
          alt="bg"
          fill
          className="bg-cover-home"
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      
      <div className="position-relative text-center bg-overlay-auto" style={{ backgroundColor: 'unset' }}>
        <h1 className="font-esthetic pt-5 pb-4 fw-medium text-gray-900 dark:text-white" style={{ fontSize: '2.25rem' }}>
          Undangan Pernikahan
        </h1>
        
        <Image
          src="/assets/images/a2.jpeg"
          alt="bg"
          width={208}
          height={208}
          className="img-center-crop rounded-circle border-4 border-gray-300 dark:border-gray-600 shadow my-4 mx-auto cursor-pointer"
          priority
        />
        
        <h2 className="font-esthetic my-4 text-gray-900 dark:text-white" style={{ fontSize: '2.25rem' }}>
          Wahyu & Riski
        </h2>
        
        <p className="my-2 text-gray-800 dark:text-gray-200" style={{ fontSize: '1.25rem' }}>
          Rabu, 15 Maret 2023
        </p>
        
        <button className="btn btn-outline-auto btn-sm shadow rounded-pill px-3 py-1 text-gray-900 dark:text-white border-gray-900 dark:border-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900" style={{ fontSize: '0.825rem' }}>
          <i className="fa-solid fa-calendar-check me-2"></i>Save Google Calendar
        </button>
        
        <div className="d-flex justify-content-center align-items-center mt-4 mb-2">
          <div className="mouse-animation border border-secondary border-2 rounded-5 px-2 py-1 opacity-50">
            <div className="scroll-animation rounded-4 bg-secondary"></div>
          </div>
        </div>
        
        <p className="pb-4 m-0 text-secondary" style={{ fontSize: '0.825rem' }}>Scroll Down</p>
      </div>
    </section>
  );
}
