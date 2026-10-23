'use client';

import { getSimpleModernContent } from '@/lib/templatePresets';

interface FooterProps {
  payload?: any;
}

export default function Footer({ payload }: FooterProps) {
  const aContent = getSimpleModernContent(payload?.customContent);
  const musikJudul = payload?.musik?.judul;
  const musikArtis = payload?.musik?.artis;

  return (
    <footer className="!bg-white dark:!bg-gray-900 py-12 px-4 text-center">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Thank You Message */}
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          {aContent.closingMessage}
        </p>
        
        {/* Arabic Greeting */}
        <div className="space-y-2">
          <p className="font-esthetic text-2xl text-gray-900 dark:text-white">
            {aContent.closingSalam}
          </p>
          <p className="font-arabic text-2xl text-gray-900 dark:text-white">
            {aContent.closingHamdalah}
          </p>
        </div>

        {aContent.tagarPernikahan && (
          <p className="text-sm font-semibold tracking-wider text-gray-600 dark:text-gray-400 mt-2">
            {aContent.tagarPernikahan}
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 my-6"></div>
        
        {/* Music Credit (hanya jika ada musik dari user) */}
        {(musikJudul || musikArtis) && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <i className="fas fa-music mr-1"></i>
            Musik: {musikJudul || 'Lagu Pernikahan'}
            {musikArtis ? ` — ${musikArtis}` : ''}
          </p>
        )}
      </div>
    </footer>
  );
}
