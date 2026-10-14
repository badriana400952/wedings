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

export default function GallerySection({ payload }: IPropss) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fotos = payload?.galery?.fotos || [];

  if (!fotos || fotos.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className={clsx('!bg-gray-50', 'dark:!bg-gray-900', 'py-16', 'px-4')}>
      <div className={clsx('max-w-4xl', 'mx-auto')}>
        <div className={clsx('border-2', 'border-gray-300', 'dark:border-gray-600', 'rounded-3xl', 'shadow-xl', 'p-6', '!bg-gray-50', 'dark:!bg-gray-800')}>
          <h2 className={clsx('font-esthetic', 'text-5xl', 'text-center', 'py-4', 'text-gray-900', 'dark:text-white')}>
            Galeri
          </h2>

          <div className={clsx('grid', 'grid-cols-2', 'md:grid-cols-3', 'gap-4', 'mt-8')}>
            {fotos.map((foto, index) => (
              <div 
                key={index} 
                className={clsx('relative', 'group', 'overflow-hidden', 'rounded-2xl', 'aspect-square', 'cursor-pointer', 'shadow')}
                onClick={() => setSelectedImage(foto)}
              >
                <Image
                  src={foto}
                  alt={`Foto Galeri ${index + 1}`}
                  fill
                  className={clsx('object-cover', 'rounded-2xl', 'group-hover:scale-105', 'transition-transform', 'duration-300')}
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className={clsx('absolute', 'inset-0', 'bg-black/20', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'flex', 'items-center', 'justify-center')}>
                  <i className="fas fa-magnifying-glass-plus text-white text-2xl drop-shadow"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className={clsx('fixed', 'inset-0', 'bg-black/85', 'z-50', 'flex', 'items-center', 'justify-center', 'p-4')}
          onClick={() => setSelectedImage(null)}
        >
          <div className={clsx('relative', 'max-w-4xl', 'w-full', 'max-h-[90vh]', 'flex', 'items-center', 'justify-center')}>
            <button
              onClick={() => setSelectedImage(null)}
              className={clsx('absolute', '-top-12', 'right-0', 'text-white', 'text-3xl', 'hover:text-gray-300', 'z-50')}
            >
              <i className="fas fa-times"></i>
            </button>
            <div className="relative w-full h-[75vh]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={selectedImage}
                alt="Selected preview"
                fill
                className="object-contain rounded-lg"
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
