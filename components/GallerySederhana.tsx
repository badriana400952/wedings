'use client';

import React, { useState, useRef } from "react";
import { BaseComponentProps } from "@/types/component-props";
import { RevealWrapper } from "./RevealWrapper";
import SvgCustom from "@/utils/svg";
import clsx from "clsx";
import axios from 'axios';

function Gallery({ payload, setPayload, session, showPencil, setShowPencil }: BaseComponentProps) {
    const { SvgQuot } = SvgCustom();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [isHoveringBg, setIsHoveringBg] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const bgFileInputRef = useRef<HTMLInputElement>(null);

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

    const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPayload({ ...payload, fotoHeader3: file });
        }
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

    const galleryPhotos = payload?.galery?.fotos || [];
    const mainPhoto = galleryPhotos[0] || "/assets/images/a3.jpeg";
    const bigGridPhoto = galleryPhotos[1] || "/assets/images/a4.jpeg";
    const gridPhotos = [
        galleryPhotos[2] || "/assets/images/a5.jpeg",
        galleryPhotos[3] || "/assets/images/a6.jpeg",
        galleryPhotos[4] || "/assets/images/a7.jpeg",
    ];

    return (
        <section 
            id="gallery"
            onMouseEnter={() => session && setIsHoveringBg(true)}
            onMouseLeave={() => session && setIsHoveringBg(false)}
        >
            <div 
                className={clsx('bg-cover', 'bg-center', 'relative', 'px-8', 'py-16')}
                style={{ 
                    backgroundImage: `url('${
                        typeof payload?.fotoHeader3 === 'string'
                            ? payload.fotoHeader3
                            : payload?.fotoHeader3 instanceof File
                                ? URL.createObjectURL(payload.fotoHeader3)
                                : '/assets/images/bg.webp'
                    }')` 
                }}
            >
                <div className={clsx('bg-transparent', 'bg-[linear-gradient(360deg,#EAEAEA_53%,#424242_100%)]', 'opacity-90', 'absolute', 'inset-0')}></div>
                <div className={clsx('z-10', 'relative')}>
                    <h1 className={clsx('text-xl', 'italic', 'font-light', 'text-center', 'text-white')}>
                        Our Gallery
                    </h1>

                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        multiple
                        className="hidden"
                    />

                    <div className={clsx('flex', 'flex-col', 'items-center', 'text-center', 'gap-4', 'my-10')}>
                        <div className="relative">
                            <img
                                src={mainPhoto}
                                alt="quote"
                                className={clsx('w-[170px]', 'h-[220px]', 'object-cover', 'cursor-pointer')}
                                onClick={() => setSelectedImage(mainPhoto)}
                            />
                            {(session || showPencil) && galleryPhotos[0] && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePhoto(0, galleryPhotos[0]);
                                    }}
                                    className={clsx('absolute', 'top-2', 'right-2', 'bg-red-500', 'text-white', 'rounded-full', 'w-6', 'h-6', 'flex', 'items-center', 'justify-center', 'hover:bg-red-600', 'transition-colors', 'text-xs')}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                        <RevealWrapper origin="top" duration={1500}>
                            <span>
                                <SvgQuot color="#4242427A" fontSize="1.75rem" />
                            </span>
                        </RevealWrapper>
                        <RevealWrapper origin="top" duration={1500}>
                            <p className={clsx('text-[0.8rem]', 'font-light', 'leading-loose', 'px-8')}>
                                From when I first saw you, I felt that I was finally home, all I
                                want is to make your dreams come true and share our dreams
                                together.
                            </p>
                        </RevealWrapper>
                    </div>
                    <RevealWrapper origin="right" duration={1500}>
                        <div className="relative">
                            <img
                                src={bigGridPhoto}
                                alt="big-grid"
                                className={clsx('w-full', 'h-96', 'object-cover', 'object-bottom', 'cursor-pointer')}
                                onClick={() => setSelectedImage(bigGridPhoto)}
                            />
                            {(session || showPencil) && galleryPhotos[1] && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePhoto(1, galleryPhotos[1]);
                                    }}
                                    className={clsx('absolute', 'top-2', 'right-2', 'bg-red-500', 'text-white', 'rounded-full', 'w-8', 'h-8', 'flex', 'items-center', 'justify-center', 'hover:bg-red-600', 'transition-colors')}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </RevealWrapper>
                    <RevealWrapper origin="top" duration={1500}>
                        <div className={clsx('grid', 'grid-cols-3', 'gap-1', 'mt-1')}>
                            {gridPhotos.map((photo, idx) => (
                                <div key={idx} className="relative">
                                    <img
                                        src={photo}
                                        alt={`grid-${idx + 1}`}
                                        className={clsx('h-32', 'object-cover', 'w-full', 'cursor-pointer')}
                                        onClick={() => setSelectedImage(photo)}
                                    />
                                    {(session || showPencil) && galleryPhotos[idx + 2] && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeletePhoto(idx + 2, galleryPhotos[idx + 2]);
                                            }}
                                            className={clsx('absolute', 'top-1', 'right-1', 'bg-red-500', 'text-white', 'rounded-full', 'w-6', 'h-6', 'flex', 'items-center', 'justify-center', 'hover:bg-red-600', 'transition-colors', 'text-xs')}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </RevealWrapper>

                    {/* Add photo button */}
                    {(session || showPencil) && (
                        <div className={clsx('mt-6', 'text-center')}>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className={clsx('bg-white', 'text-[#424242]', 'px-6', 'py-2', 'rounded-full', 'hover:scale-95', 'transition-transform', 'disabled:opacity-50', 'disabled:cursor-not-allowed')}
                            >
                                {uploading ? (
                                    <>
                                        <span className={clsx('animate-spin', 'inline-block', 'mr-2')}>⏳</span>
                                        Uploading...
                                    </>
                                ) : (
                                    <>+ Tambah Foto</>
                                )}
                            </button>
                            <p className={clsx('text-white', 'text-xs', 'mt-2')}>
                                Klik foto untuk melihat, klik ✕ untuk menghapus
                            </p>
                        </div>
                    )}
                </div>

                {/* Upload Background Button */}
                {(showPencil || (session && isHoveringBg)) && (
                    <button
                        type="button"
                        onClick={() => bgFileInputRef.current?.click()}
                        className={clsx(
                            'absolute',
                            'top-4',
                            'right-4',
                            'z-30',
                            'bg-white',
                            'text-gray-800',
                            'rounded-full',
                            'p-3',
                            'shadow-lg',
                            'hover:scale-110',
                            'transition-transform',
                            'duration-200'
                        )}
                        title="Ubah Background"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={clsx('h-6', 'w-6')} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                            />
                        </svg>
                    </button>
                )}

                <input
                    ref={bgFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBgUpload}
                />
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
                            ✕
                        </button>
                        <img
                            src={selectedImage}
                            alt="Selected"
                            className={clsx('w-full', 'h-full', 'object-contain', 'rounded-2xl')}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}

export default Gallery;
