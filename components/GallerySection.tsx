'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ITemplateWeding } from '@/prisma/schema.types';
import clsx from 'clsx';

export default function GallerySection({ templateWeding }: { templateWeding: ITemplateWeding }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    '/assets/images/a1.jpeg',
    '/assets/images/a2.jpeg',
    '/assets/images/a3.jpeg',
    '/assets/images/a4.jpeg',
    '/assets/images/a5.jpeg',
    '/assets/images/a7.jpeg',
  ];

  return (
    <section id="gallery" className={clsx('!bg-gray-50', 'dark:!bg-gray-900', 'py-16', 'px-4')}>
      <div className={clsx('max-w-4xl', 'mx-auto')}>
        <div className={clsx('border-2', 'border-gray-300', 'dark:border-gray-600', 'rounded-3xl', 'shadow-xl', 'p-6', '!bg-gray-50', 'dark:!bg-gray-800')}>
          <h2 className={clsx('font-esthetic', 'text-5xl', 'text-center', 'py-4', 'text-gray-900', 'dark:text-white')}>
            Galeri
          </h2>
          
          <div className={clsx('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4', 'mt-8')}>
            {templateWeding?.galery?.fotos.map((img, idx) => (
              <div key={idx} className={clsx('relative', 'overflow-hidden', 'rounded-2xl', 'shadow-lg', 'cursor-pointer', 'hover:scale-105', 'transition-transform', 'h-64')}>
                <Image
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  fill
                  className="object-cover"
                  onClick={() => setSelectedImage(img)}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className={clsx('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center', 'bg-black/80', 'p-4')}
          onClick={() => setSelectedImage(null)}
        >
          <div className={clsx('relative', 'max-w-4xl', 'w-full', 'h-[80vh]')}>
            <button
              className={clsx('absolute', 'top-4', 'right-4', 'text-white', 'bg-black/50', 'rounded-full', 'w-10', 'h-10', 'flex', 'items-center', 'justify-center', 'hover:bg-black/70', 'z-10')}
              onClick={() => setSelectedImage(null)}
            >
              <i className={clsx('fas', 'fa-times')}></i>
            </button>
            <Image
              src={selectedImage}
              alt="Selected"
              fill
              className={clsx('object-contain', 'rounded-2xl')}
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </section>
  );
}
