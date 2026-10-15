import React from 'react';

interface TabLinksProps {
  guestName: string;
  generatedLink: string;
  onGuestNameChange: (name: string) => void;
  onGenerateLink: () => void;
  onCopyLink: () => void;
  whatsAppShareUrl: string;
}

export const TabLinks: React.FC<TabLinksProps> = ({
  guestName,
  generatedLink,
  onGuestNameChange,
  onGenerateLink,
  onCopyLink,
  whatsAppShareUrl,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <i className="fas fa-magic text-blue-500"></i>
          Buat Link Khusus untuk Tamu
        </h3>
        <p className="text-xs text-gray-500">
          Masukkan nama tamu untuk membuat tautan yang menampilkan nama mereka di cover undangan secara otomatis.
        </p>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
            Nama Tamu Undangan
          </label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => onGuestNameChange(e.target.value)}
            placeholder="Contoh: Budi Santoso & Partner"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>

        <button
          type="button"
          onClick={onGenerateLink}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <i className="fas fa-link"></i>
          Generate Link Undangan
        </button>

        {generatedLink && (
          <div className="mt-6 p-5 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4">
            <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-400">
              Tautan Undangan Siap Disebar:
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={generatedLink}
                readOnly
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={onCopyLink}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors text-sm font-semibold flex items-center gap-2 shadow-sm"
                title="Salin Link"
              >
                <i className="fas fa-copy"></i>
                Salin
              </button>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={whatsAppShareUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <i className="fab fa-whatsapp text-lg"></i>
                Kirim ke WhatsApp
              </a>

              <a
                href={generatedLink}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <i className="fas fa-external-link-alt"></i>
                Buka Undangan
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabLinks;
