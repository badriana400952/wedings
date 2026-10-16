import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

interface TemplateItem {
  code: string;
  name: string;
  category: string;
  categoryIcon: string;
  views: number;
  usedCount: number;
  tags: string[];
  dotColor: string;
  coverImage: string;
  description: string;
}

const TEMPLATES: TemplateItem[] = [
  {
    code: 'E',
    name: 'Meja Sang Koki — Santap Malam & Kisah Cinta',
    category: 'Kuliner',
    categoryIcon: 'fa-utensils',
    views: 342,
    usedCount: 18,
    tags: ['Fine Dining', 'Minimalis', 'Degustasi', 'Interaktif'],
    dotColor: '#d97706',
    coverImage: '/covers/meja sang koki.jpg',
    description: 'Konsep fine dining interaktif: tudung saji cloche, menu degustasi cerita, dan buku resep.',
  },
  {
    code: 'B',
    name: 'Taman Rahasia — Sentuhan Editorial Modern',
    category: 'Botani',
    categoryIcon: 'fa-seedling',
    views: 284,
    usedCount: 29,
    tags: ['Editorial', 'Taman', 'Pohon Harapan', 'Text Mask'],
    dotColor: '#16a34a',
    coverImage: '/covers/Taman Rahasia.jpg',
    description: 'Tipografi bold layar penuh dengan animasi Text Mask, Pohon Harapan, dan tata letak majalah.',
  },
  {
    code: 'D',
    name: 'Tumbuh Bersama — Living Botanical Canvas',
    category: 'Romantis',
    categoryIcon: 'fa-tree',
    views: 198,
    usedCount: 14,
    tags: ['Living Nature', '4 Musim', 'Kanvas Pohon', 'Web Audio'],
    dotColor: '#0284c7',
    coverImage: '/covers/tumbuh bersama.jpg',
    description: 'Kanvas botani hidup dengan jalinan 4 musim, gugur dedaunan interaktif, dan Kebun Doa.',
  },
  {
    code: 'C',
    name: 'Kirigami Pastel — Seni Kertas Jepang Berlapis',
    category: 'Floral',
    categoryIcon: 'fa-feather-alt',
    views: 215,
    usedCount: 21,
    tags: ['Kirigami', 'Pastel', 'Papercraft', 'Layering'],
    dotColor: '#db2777',
    coverImage: '/covers/Kirigami Pastel.jpg',
    description: 'Seni potong kertas bergaya Jepang dengan gradasi warna pastel lembut dan animasi halus.',
  },
  {
    code: 'A',
    name: 'Modern Elegant — Welcome Envelope & Confetti',
    category: 'Classic',
    categoryIcon: 'fa-gem',
    views: 412,
    usedCount: 53,
    tags: ['Modern', 'Split Screen', 'Amplop', 'Confetti'],
    dotColor: '#8b5cf6',
    coverImage: '/covers/modern elegant.jpg',
    description: 'Tata letak split screen sidebar dengan amplop pembuka elegan, efek confetti, dan kado cinta.',
  },
];

interface HomePageProps {
  initialTemplate: string;
  userSlug: string;
  userId: string | null;
  userName: string | null;
}

export default function HomePage({
  initialTemplate,
  userSlug,
  userId,
  userName,
}: HomePageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTemplate, setActiveTemplate] = useState<string>(initialTemplate || 'E');
  const [loadingCode, setLoadingCode] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'preview' | 'setMain' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filter template berdasarkan pencarian
  const filteredTemplates = TEMPLATES.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  // Handler Masuk ke Undangan (Hit API lalu Redirect)
  const handleOpenInvitation = async (tmpl: TemplateItem) => {
    setLoadingCode(tmpl.code);
    setActionType('preview');
    try {
      const res = await fetch('/api/user/template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: tmpl.code, userId }),
      });
      const data = await res.json();
      
      setActiveTemplate(tmpl.code);
      
      const destination = data?.redirectUrl || `/${userSlug}`;
      router.push(destination);
    } catch (err) {
      console.error('Gagal membuka undangan:', err);
      // Fallback tetap arahkan ke undangan
      router.push(`/${userSlug}`);
    } finally {
      setLoadingCode(null);
      setActionType(null);
    }
  };

  // Handler Jadikan Utama
  const handleSetMainTemplate = async (e: React.MouseEvent, tmpl: TemplateItem) => {
    e.stopPropagation(); // Mencegah trigger klik kartu
    setLoadingCode(tmpl.code);
    setActionType('setMain');
    try {
      const res = await fetch('/api/user/template', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: tmpl.code, userId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveTemplate(tmpl.code);
        showToast(`✅ Template "${tmpl.name.split('—')[0].trim()}" berhasil dijadikan Template Utama!`);
      } else {
        showToast('❌ ' + (data?.message || 'Gagal mengubah template utama'));
      }
    } catch (err) {
      console.error('Error saat set template utama:', err);
      showToast('❌ Terjadi kesalahan saat menyimpan template');
    } finally {
      setLoadingCode(null);
      setActionType(null);
    }
  };

  return (
    <>
      <Head>
        <title>Pilih Desain Template Undangan Pernikahan</title>
        <meta name="description" content="Koleksi desain undangan pernikahan digital eksklusif dan interaktif" />
      </Head>

      <div className="min-h-screen bg-[#f8f9fa] text-[#1e293b] font-sans pb-24">
        {/* Toast Notifikasi */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-[#1e293b] text-white px-5 py-3 rounded-2xl shadow-2xl border border-gray-700/50 flex items-center gap-3 animate-fade-in text-sm font-medium">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header & Search Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200/70 shadow-xs px-4 py-3 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Bar Input */}
            <div className="relative w-full sm:max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <i className="fas fa-search text-xs"></i>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari desain..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 text-xs"
                >
                  <i className="fas fa-times-circle"></i>
                </button>
              )}
            </div>

            {/* Quick Links Header */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => router.push(`/${userSlug}`)}
                className="text-xs font-semibold text-gray-700 hover:text-pink-600 px-3.5 py-1.5 rounded-lg border border-gray-200 hover:border-pink-300 bg-white transition-all flex items-center gap-1.5"
              >
                <i className="fas fa-external-link-alt text-[10px]"></i>
                <span>Undangan Saya</span>
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="text-xs font-semibold text-white bg-gray-900 hover:bg-gray-800 px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
              >
                <i className="fas fa-cog text-[10px]"></i>
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
          {/* Judul & Info */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Koleksi Desain Undangan
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Pilih template favorit untuk melihat pratinjau langsung, atau jadikan sebagai template utama undangan Anda.
            </p>
          </div>

          {/* Grid Kartu Template */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredTemplates.map((tmpl) => {
              const isMain = activeTemplate === tmpl.code;
              const isLoading = loadingCode === tmpl.code;

              return (
                <div
                  key={tmpl.code}
                  onClick={() => handleOpenInvitation(tmpl)}
                  className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col relative cursor-pointer shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                    isMain
                      ? 'border-pink-400 ring-2 ring-pink-500/15'
                      : 'border-gray-200/80 hover:border-gray-300'
                  }`}
                >
                  {/* Bagian Cover Image */}
                  <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden">
                    <img
                      src={tmpl.coverImage}
                      alt={tmpl.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback jika file foto belum selesai terbaca
                        (e.target as HTMLImageElement).src =
                          '/assets/templates/meja-koki/1790088231_df639d98.jpg';
                      }}
                    />

                    {/* Overlay bayangan halus */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none"></div>

                    {/* Floating Badges Kiri Atas */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 pointer-events-none">
                      <span className="bg-[#b45309]/90 backdrop-blur-xs text-[#fef3c7] text-[10.5px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
                        <i className="fas fa-crown text-[9px] text-amber-300"></i>
                        <span>Premium</span>
                      </span>
                      <span className="bg-[#047857]/90 backdrop-blur-xs text-[#d1fae5] text-[10.5px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
                        <i className="fas fa-shield-alt text-[9px] text-emerald-300"></i>
                        <span>Resmi</span>
                      </span>
                    </div>

                    {/* Badge Template Utama Kanan Atas */}
                    {isMain && (
                      <div className="absolute top-3 right-3 z-10 pointer-events-none">
                        <span className="bg-blue-600 text-white text-[10.5px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md">
                          <i className="fas fa-check-circle text-[9px]"></i>
                          <span>Utama</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bagian Konten Card */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Baris Judul & Dot Warna */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-[15.5px] text-gray-900 leading-snug group-hover:text-pink-600 transition-colors line-clamp-2">
                          {tmpl.name}
                        </h3>
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 mt-1 shadow-xs"
                          style={{ backgroundColor: tmpl.dotColor }}
                          title={`Kategori: ${tmpl.category}`}
                        ></span>
                      </div>

                      {/* Baris Metadata (Kategori, Views, Dipakai) */}
                      <div className="flex items-center gap-2 text-[11.5px] text-gray-400 mt-2 font-medium">
                        <span className="flex items-center gap-1 text-gray-500">
                          <i className={`fas ${tmpl.categoryIcon} text-[10px]`}></i>
                          <span>{tmpl.category}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <i className="far fa-eye text-[10px]"></i>
                          <span>{tmpl.views}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <i className="far fa-copy text-[10px]"></i>
                          <span>{tmpl.usedCount} kali dipakai</span>
                        </span>
                      </div>

                      {/* Baris Tag Chips */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {tmpl.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-600 text-[10.5px] px-2 py-0.5 rounded-md font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>


                    </div>

                    {/* Tombol Aksi di Bawah */}
                    <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-gray-100">
                      {/* Tombol Pink: Pratinjau */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenInvitation(tmpl);
                        }}
                        disabled={isLoading}
                        className="flex-1 py-2.5 px-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 active:scale-[0.98] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all disabled:opacity-75"
                      >
                        {isLoading && actionType === 'preview' ? (
                          <>
                            <i className="fas fa-spinner fa-spin text-xs"></i>
                            <span>Membuka...</span>
                          </>
                        ) : (
                          <>
                            <i className="far fa-eye text-xs"></i>
                            <span>Pratinjau</span>
                          </>
                        )}
                      </button>

                      {/* Tombol Jadikan Utama */}
                      <button
                        type="button"
                        onClick={(e) => handleSetMainTemplate(e, tmpl)}
                        disabled={isLoading || isMain}
                        title={isMain ? 'Template ini sedang aktif sebagai template utama' : 'Jadikan template ini sebagai template utama'}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-[0.97] shadow-2xs ${
                          isMain
                            ? 'bg-blue-50 border-blue-200 text-blue-700 cursor-default'
                            : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {isLoading && actionType === 'setMain' ? (
                          <i className="fas fa-spinner fa-spin text-xs"></i>
                        ) : isMain ? (
                          <>
                            <i className="fas fa-check text-blue-600 text-xs"></i>
                            <span className="hidden sm:inline">Utama</span>
                          </>
                        ) : (
                          <>
                            <i className="far fa-star text-amber-500 text-xs"></i>
                            <span className="hidden sm:inline">Jadikan Utama</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Kondisi Jika Tidak Ada Hasil Pencarian */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200/70 p-8 shadow-xs mt-4">
              <i className="fas fa-search text-gray-300 text-4xl mb-3"></i>
              <h4 className="text-base font-bold text-gray-700">Desain tidak ditemukan</h4>
              <p className="text-xs text-gray-400 mt-1">Coba gunakan kata kunci lain seperti &quot;Koki&quot;, &quot;Taman&quot;, atau &quot;Pastel&quot;.</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-pink-50 text-pink-600 text-xs font-semibold rounded-xl hover:bg-pink-100 transition-colors"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getServerSession(context.req, context.res, authOptions);
    let user: any = null;

    if (session?.user?.id) {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, name: true, template: true },
      });
    }

    if (!user) {
      user = await prisma.user.findFirst({
        select: { id: true, name: true, template: true },
        orderBy: { createdAt: 'asc' },
      });
    }

    const userSlug = user?.name ? encodeURIComponent(user.name) : (user?.id || 'demo');

    return {
      props: {
        initialTemplate: user?.template || 'E',
        userSlug: userSlug,
        userId: user?.id || null,
        userName: user?.name || null,
      },
    };
  } catch (error) {
    console.warn('Gagal load user awal di getServerSideProps:', error);
    return {
      props: {
        initialTemplate: 'E',
        userSlug: 'demo',
        userId: null,
        userName: null,
      },
    };
  }
};