'use client';

import { useState } from 'react';

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    'https://picsum.photos/1280/720?random=1',
    'https://picsum.photos/1280/720?random=2',
    'https://picsum.photos/1280/720?random=3',
    'https://picsum.photos/1280/720?random=4',
    'https://picsum.photos/1280/720?random=5',
    'https://picsum.photos/1280/720?random=6',
  ];

  return (
    <section id="gallery" className="!bg-gray-50 dark:!bg-gray-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-3xl shadow-xl p-6 !bg-gray-50 dark:!bg-gray-800">
          <h2 className="font-esthetic text-5xl text-center py-4 text-gray-900 dark:text-white">
            Galeri
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {images.map((img, idx) => (
              <div key={idx} className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform">
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-64 object-cover"
                  onClick={() => setSelectedImage(img)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
              onClick={() => setSelectedImage(null)}
            >
              <i className="fas fa-times"></i>
            </button>
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full rounded-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}
