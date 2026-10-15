import React from 'react';
import clsx from 'clsx';

interface TabMusikProps {
  musikList: any[];
  currentMusikId: string;
  playingMusikId: string | null;
  loadingMusik: boolean;
  onTogglePreviewMusik: (musik: any) => void;
  onSelectMusik: (musikId: string) => void;
}

export const TabMusik: React.FC<TabMusikProps> = ({
  musikList,
  currentMusikId,
  playingMusikId,
  loadingMusik,
  onTogglePreviewMusik,
  onSelectMusik,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <i className="fas fa-music text-blue-500"></i>
          Koleksi Musik Latar
        </h3>
        <p className="text-xs text-gray-500 mt-1 mb-6">
          Pilih satu musik untuk diputar otomatis saat tamu membuka undangan Anda. Tekan tombol putar untuk mendengarkan preview.
        </p>

        {musikList.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            Belum ada musik tersedia.
          </div>
        ) : (
          <div className="space-y-3">
            {musikList.map((m: any) => {
              const isActive = currentMusikId === m.id;
              const isPlaying = playingMusikId === m.id;
              return (
                <div
                  key={m.id}
                  className={clsx(
                    'flex items-center gap-4 p-4 rounded-2xl border-2 transition-all',
                    isActive
                      ? 'border-blue-600 shadow-sm ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-900/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onTogglePreviewMusik(m)}
                    className="w-11 h-11 flex-shrink-0 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
                    aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
                  >
                    <i className={clsx('fas', isPlaying ? 'fa-pause' : 'fa-play')}></i>
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate text-gray-900 dark:text-white">{m.judul}</p>
                    <p className="text-xs text-gray-500 truncate">{m.penyanyi || 'Tidak diketahui'}</p>
                  </div>

                  {isActive && (
                    <span className="hidden sm:inline-flex px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold">
                      Aktif
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectMusik(m.id)}
                    disabled={loadingMusik || isActive}
                    className={clsx(
                      'px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex-shrink-0',
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 cursor-default'
                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90'
                    )}
                  >
                    {isActive ? '✓ Terpilih' : loadingMusik ? 'Loading...' : 'Gunakan'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabMusik;
