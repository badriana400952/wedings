import React, { useState } from 'react';
import clsx from 'clsx';

export interface TabTemplateProps {
  currentTemplate: string;
  loadingTemplate: boolean;
  onSelectTemplate: (templateCode: string) => void | Promise<void>;
  effectiveUserId?: string;
}

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

export const TabTemplate: React.FC<TabTemplateProps> = ({
  currentTemplate,
  loadingTemplate,
  onSelectTemplate,
  effectiveUserId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCode, setSelectedCode] = useState(currentTemplate);
  const [previewLoadingCode, setPreviewLoadingCode] = useState<string | null>(null);

  // Filter template berdasarkan keyword
  const filteredTemplates = TEMPLATES.filter((tmpl) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      tmpl.name.toLowerCase().includes(q) ||
      tmpl.category.toLowerCase().includes(q) ||
      tmpl.description.toLowerCase().includes(q) ||
      tmpl.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const handlePreview = async (tmpl: TemplateItem) => {
    setPreviewLoadingCode(tmpl.code);
    try {
      if (currentTemplate !== tmpl.code) {
        await onSelectTemplate(tmpl.code);
        setSelectedCode(tmpl.code);
      }
      // Buka halaman undangan di tab baru
      const targetUrl = effectiveUserId ? `/${effectiveUserId}` : '/';
      window.open(targetUrl, '_blank');
    } finally {
      setPreviewLoadingCode(null);
    }
  };

  const handleMakeMain = async (tmpl: TemplateItem) => {
    setSelectedCode(tmpl.code);
    await onSelectTemplate(tmpl.code);
  };

  return (
    <div className="space-y-6">
      {/* Container Utama Desain Template */}
      <div className="bg-white dark:bg-gray-800 p-5 sm:p-7 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Header Seksi & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-700">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Koleksi Desain Template Undangan
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">
                Template {currentTemplate} Aktif
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Pilih template desain yang sesuai dengan tema pernikahan Anda. Klik pratinjau untuk melihat tampilan langsung atau jadikan utama.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <i className="fas fa-search text-xs"></i>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari desain..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <i className="fas fa-times-circle text-xs"></i>
              </button>
            )}
          </div>
        </div>

        {/* Info Jika Tidak Ada Hasil */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-xl mb-3">
              <i className="fas fa-search"></i>
            </div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Desain tidak ditemukan
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Coba gunakan kata kunci lain seperti `Rustic`, `Floral`, atau `Modern`.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-1.5 text-xs font-semibold text-pink-600 bg-pink-50 dark:bg-pink-900/30 rounded-lg hover:bg-pink-100 transition-colors"
            >
              Reset Pencarian
            </button>
          </div>
        )}

        {/* Grid Kartu Template Sesuai Desain Index */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {filteredTemplates.map((tmpl) => {
            const isMain = currentTemplate === tmpl.code || selectedCode === tmpl.code;
            const isPreviewing = previewLoadingCode === tmpl.code;

            return (
              <div
                key={tmpl.code}
                className={clsx(
                  'group bg-white dark:bg-gray-800/90 rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col relative shadow-xs hover:shadow-xl hover:-translate-y-1',
                  isMain
                    ? 'border-pink-400 ring-2 ring-pink-500/15'
                    : 'border-gray-200/90 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                {/* Bagian Cover Image */}
                <div className="relative w-full aspect-[16/10] bg-gray-100 dark:bg-gray-900 overflow-hidden">
                  <img
                    src={tmpl.coverImage}
                    alt={tmpl.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/assets/templates/meja-koki/1790088231_df639d98.jpg';
                    }}
                  />

                  {/* Overlay gradien halus */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none"></div>

                  {/* Floating Badges Kiri Atas */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 pointer-events-none">
                    <span className="bg-[#b45309]/90 backdrop-blur-xs text-[#fef3c7] text-[10px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                      <i className="fas fa-crown text-[9px] text-amber-300"></i>
                      <span>Premium</span>
                    </span>
                    <span className="bg-[#047857]/90 backdrop-blur-xs text-[#d1fae5] text-[10px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                      <i className="fas fa-shield-alt text-[9px] text-emerald-300"></i>
                      <span>Resmi</span>
                    </span>
                  </div>

                  {/* Badge Template Utama Kanan Atas */}
                  {isMain && (
                    <div className="absolute top-3 right-3 z-10 pointer-events-none">
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                        <i className="fas fa-check-circle text-[9px]"></i>
                        <span>Sedang Aktif</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Bagian Konten Card */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Baris Judul & Dot Warna */}
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-[15px] text-gray-900 dark:text-white leading-snug group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-2">
                        {tmpl.name}
                      </h4>
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 mt-1 shadow-xs"
                        style={{ backgroundColor: tmpl.dotColor }}
                        title={`Kategori: ${tmpl.category}`}
                      ></span>
                    </div>

                    {/* Baris Metadata (Kategori, Views, Dipakai) */}
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-400 mt-2 font-medium">
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
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

                    {/* Deskripsi Singkat */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2.5 line-clamp-2">
                      {tmpl.description}
                    </p>

                    {/* Baris Tag Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {tmpl.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-0.5 rounded-md font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>


                  </div>

                  {/* Tombol Aksi di Bawah */}
                  <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-gray-100 dark:border-gray-700/80">
                    {/* Tombol Pink: Pratinjau */}
                    <button
                      type="button"
                      onClick={() => handlePreview(tmpl)}
                      disabled={isPreviewing || loadingTemplate}
                      className="flex-1 py-2 px-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 active:scale-[0.98] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all disabled:opacity-75"
                    >
                      {isPreviewing ? (
                        <>
                          <i className="fas fa-spinner fa-spin text-[10px]"></i>
                          <span>Membuka...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-eye text-[10px]"></i>
                          <span>Pratinjau</span>
                        </>
                      )}
                    </button>

                    {/* Tombol Putih/Gelap: Jadikan Utama */}
                    <button
                      type="button"
                      onClick={() => handleMakeMain(tmpl)}
                      disabled={loadingTemplate || isMain}
                      className={clsx(
                        'flex-1 py-2 px-3 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all',
                        isMain
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 cursor-default'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/60 active:scale-[0.98]'
                      )}
                    >
                      {isMain ? (
                        <>
                          <i className="fas fa-check text-[10px]"></i>
                          <span>Terpilih</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-star text-[10px] text-amber-500"></i>
                          <span>Jadikan Utama</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabTemplate;
