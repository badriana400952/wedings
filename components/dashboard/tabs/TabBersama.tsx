import React from 'react';

interface TabBersamaProps {
  bersamaFotos: string[];
  bersamaDipakai: string;
  uploadingBersama: number | null;
  bersamaSlots: number;
  bersamaInputRefs: React.MutableRefObject<Array<HTMLInputElement | null>>;
  onUploadBersama: (index: number, file: File | null) => void;
  onDeleteBersama: (index: number) => void;
  onBersamaDipakaiChange: (value: string) => void;
}

export const TabBersama: React.FC<TabBersamaProps> = ({
  bersamaFotos,
  bersamaDipakai,
  uploadingBersama,
  bersamaSlots,
  bersamaInputRefs,
  onUploadBersama,
  onDeleteBersama,
  onBersamaDipakaiChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-bold mb-1 flex items-center gap-2 text-gray-900 dark:text-white">
          <i className="fas fa-heart text-rose-500"></i>
          Gambar Bersama
        </h3>
        <p className="text-xs text-gray-500 mb-5">
          Maksimal {bersamaSlots} foto berdua. Foto ini otomatis muncul di template Taman Rahasia.
        </p>

        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Tampilkan di bagian mana?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onBersamaDipakaiChange('taman')}
            className={`text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
              bersamaDipakai === 'taman'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30'
                : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/40 text-gray-700 dark:text-gray-300'
            }`}
          >
            <i className="fas fa-seedling mr-2 text-emerald-600"></i>Taman Rahasia
            <span className="block text-xs font-normal opacity-70 mt-1">
              Muncul di rumah kaca / galeri taman
            </span>
          </button>
          <button
            type="button"
            onClick={() => onBersamaDipakaiChange('cerita')}
            className={`text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
              bersamaDipakai === 'cerita'
                ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-900/30'
                : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/40 text-gray-700 dark:text-gray-300'
            }`}
          >
            <i className="fas fa-book-open mr-2 text-rose-600"></i>Kisah Pertemuan
            <span className="block text-xs font-normal opacity-70 mt-1">
              Mengisi 4 kartu Musim-Musim Kami
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-bold mb-1 flex items-center justify-between text-gray-900 dark:text-white">
          <span>
            Foto ({bersamaFotos.length}/{bersamaSlots})
          </span>
        </h3>
        <p className="text-xs text-gray-500 mb-5">
          Slot 1-4 dipakai kartu Musim-Musim Kami, sisanya untuk galeri taman.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: bersamaSlots }).map((_, idx) => {
            const url = bersamaFotos[idx] || '';
            return (
              <div
                key={idx}
                className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="relative aspect-square bg-gray-50 dark:bg-gray-700/40">
                  {url ? (
                    <>
                      <img
                        src={url}
                        alt={`Bersama ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => onDeleteBersama(idx)}
                        className="absolute top-2 right-2 w-8 h-8 bg-rose-600 text-white rounded-lg flex items-center justify-center hover:bg-rose-700 transition-colors shadow-lg"
                        title="Hapus foto"
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                      <i className="fas fa-image text-3xl"></i>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <input
                    ref={(el) => {
                      bersamaInputRefs.current[idx] = el;
                    }}
                    type="file"
                    accept="image/*"
                    onChange={(e) => onUploadBersama(idx, e.target.files?.[0] || null)}
                    className="block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  {uploadingBersama === idx && (
                    <p className="text-[11px] text-blue-600 mt-1 flex items-center gap-1">
                      <i className="fas fa-spinner fa-spin"></i> Mengunggah...
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabBersama;
