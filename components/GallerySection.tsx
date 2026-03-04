'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ITemplateWeding } from '@/prisma/schema.types';
import clsx from 'clsx';
import axios from 'axios';

interface IPropss {
  payload: ITemplateWeding
  setPayload: React.Dispatch<React.SetStateAction<ITemplateWeding>>
  showPencil: boolean
  setShowPencil: React.Dispatch<React.SetStateAction<boolean>>
  session: string | undefined
}

export default function GallerySection({
  payload, setPayload, showPencil, setShowPencil, session
}: IPropss) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.urls[0];
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!payload?.galery?.id) {
      alert('❌ Galery ID tidak ditemukan');
      return;
    }

    setUploading(true);

    try {
      // Upload semua file ke Cloudinary
      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);

      // Tambahkan foto ke galery via API
      for (const url of uploadedUrls) {
        await axios.patch(`/api/galery/${payload.galery.id}`, {
          action: 'add',
          foto: url,
        });
      }

      // Update local state
      const currentFotos = payload?.galery?.fotos || [];
      const updatedFotos = [...currentFotos, ...uploadedUrls];
      
      setPayload({
        ...payload,
        galery: {
          ...payload.galery,
          fotos: updatedFotos,
        }
      });

      alert(`✅ ${uploadedUrls.length} foto berhasil ditambahkan!`);
    } catch (error: any) {
      console.error('Error uploading photos:', error);
      alert('❌ Gagal upload foto: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeletePhoto = async (index: number, fotoUrl: string) => {
    if (!payload?.galery?.id) {
      alert('❌ Galery ID tidak ditemukan');
      return;
    }

    if (!confirm('Hapus foto ini?')) {
      return;
    }

    try {
      // Hapus dari database via API
      await axios.patch(`/api/galery/${payload.galery.id}`, {
        action: 'remove',
        foto: fotoUrl,
      });

      // Update local state
      const currentFotos = payload?.galery?.fotos || [];
      const updatedFotos = currentFotos.filter((_, i) => i !== index);
      
      setPayload({
        ...payload,
        galery: {
          ...payload.galery,
          fotos: updatedFotos,
        }
      });

      alert('✅ Foto berhasil dihapus!');
    } catch (error: any) {
      console.error('Error deleting photo:', error);
      alert('❌ Gagal hapus foto: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleGalleryClick = () => {
    if ((session || showPencil) && !uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <section id="gallery" className={clsx('!bg-gray-50', 'dark:!bg-gray-900', 'py-16', 'px-4')}>
      <div className={clsx('max-w-4xl', 'mx-auto')}>
        <div className={clsx('border-2', 'border-gray-300', 'dark:border-gray-600', 'rounded-3xl', 'shadow-xl', 'p-6', '!bg-gray-50', 'dark:!bg-gray-800')}>
          <h2 className={clsx('font-esthetic', 'text-5xl', 'text-center', 'py-4', 'text-gray-900', 'dark:text-white')}>
            Galeri
          </h2>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />

          <div 
            className={clsx('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4', 'mt-8')}
            onClick={handleGalleryClick}
            onDoubleClick={() => {
              if (!session) {
                setShowPencil(true);
              }
            }}
          >
            {payload?.galery?.fotos?.map((img, idx) => (
              <div key={idx} className={clsx('relative', 'overflow-hidden', 'rounded-2xl', 'shadow-lg', 'cursor-pointer', 'hover:scale-105', 'transition-transform', 'h-64')}>
                <Image
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  fill
                  className="object-cover"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(img);
                  }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Delete button */}
                {(session || showPencil) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePhoto(idx, img);
                    }}
                    className={clsx('absolute', 'top-2', 'right-2', 'bg-red-500', 'text-white', 'rounded-full', 'w-8', 'h-8', 'flex', 'items-center', 'justify-center', 'hover:bg-red-600', 'transition-colors', 'z-10')}
                  >
                    <i className={clsx('fas', 'fa-times', 'text-sm')}></i>
                  </button>
                )}
              </div>
            ))}
            
            {/* Add photo placeholder */}
            {(session || showPencil) && (
              <div 
                className={clsx('relative', 'overflow-hidden', 'rounded-2xl', 'shadow-lg', 'cursor-pointer', 'hover:scale-105', 'transition-transform', 'h-64', 'border-2', 'border-dashed', 'border-gray-400', 'dark:border-gray-500', 'flex', 'items-center', 'justify-center')}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <div className={clsx('text-center', 'p-4')}>
                  <i className={clsx('fas', 'fa-plus', 'text-4xl', 'text-gray-400', 'dark:text-gray-500', 'mb-2')}></i>
                  <p className={clsx('text-gray-600', 'dark:text-gray-400')}>Tambah Foto</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Instruction text */}
          {(session || showPencil) && (
            <p className={clsx('text-center', 'text-sm', 'text-gray-600', 'dark:text-gray-400', 'mt-4')}>
              {uploading ? (
                <>
                  <i className={clsx('fas', 'fa-spinner', 'fa-spin', 'mr-2')}></i>
                  Uploading foto...
                </>
              ) : (
                'Klik area galeri untuk menambah foto, klik tombol X untuk menghapus foto'
              )}
            </p>
          )}
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
