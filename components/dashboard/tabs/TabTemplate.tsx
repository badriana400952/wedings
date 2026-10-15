import React from 'react';
import clsx from 'clsx';

interface TabTemplateProps {
  currentTemplate: string;
  loadingTemplate: boolean;
  onSelectTemplate: (templateCode: string) => void;
}

interface TemplateOption {
  code: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  bgGradient: string;
  iconColor: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    code: 'A',
    name: 'Template A: Modern Elegant',
    tagline: 'Split Screen & Welcome Envelope',
    description:
      'Tampilan split sidebar desktop dengan welcome envelope, confetti, love gift, dan musik latar.',
    icon: 'fa-gem',
    bgGradient: 'from-amber-100 to-rose-100 dark:from-gray-700 dark:to-gray-800',
    iconColor: 'text-amber-500/70',
  },
  {
    code: 'B',
    name: 'Template B: Editorial Style',
    tagline: 'Taman Rahasia (Editorial)',
    description:
      'Tipografi bold layar penuh dengan animasi Text Mask, smooth scroll desktop, Pohon Harapan, dan floating navigation.',
    icon: 'fa-newspaper',
    bgGradient: 'from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-800',
    iconColor: 'text-indigo-500/70',
  },
  {
    code: 'C',
    name: 'Template C: Kirigami Pastel',
    tagline: 'Japanese Papercraft Pastel',
    description:
      'Undangan bergaya seni potong kertas berlapis dengan warna pastel lembut, partikel kertas melayang, dan animasi halus.',
    icon: 'fa-feather-alt',
    bgGradient: 'from-emerald-100 to-teal-100 dark:from-gray-700 dark:to-gray-800',
    iconColor: 'text-emerald-500/70',
  },
  {
    code: 'D',
    name: 'Template D: Tumbuh Bersama',
    tagline: 'Living Botanical Tree Canvas',
    description:
      'Undangan botani interaktif: sobek paket benih, jalinan 4 musim, gugur daun interaktif, synthesizer Web Audio & Kebun Doa.',
    icon: 'fa-seedling',
    bgGradient: 'from-lime-100 to-amber-100 dark:from-gray-700 dark:to-gray-800',
    iconColor: 'text-lime-600/70',
  },
  {
    code: 'E',
    name: 'Template E: Meja Sang Koki',
    tagline: 'Fine Dining Degustation Interactive Theme',
    description:
      'Undangan bertema santap malam fine dining: tudung saji cloche interaktif, 4 babak menu degustasi kisah cinta, buku resep, dan nota reservasi meja.',
    icon: 'fa-utensils',
    bgGradient: 'from-amber-200 to-orange-200 dark:from-stone-800 dark:to-stone-900',
    iconColor: 'text-amber-700/75',
  },
];

export const TabTemplate: React.FC<TabTemplateProps> = ({
  currentTemplate,
  loadingTemplate,
  onSelectTemplate,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Koleksi Desain Template Undangan</h3>
        <p className="text-xs text-gray-500 mt-1 mb-6">
          Pilih template desain yang sesuai dengan tema pernikahan Anda. Perubahan langsung aktif pada link undangan.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {TEMPLATES.map((tmpl) => {
            const isCurrent = currentTemplate === tmpl.code;
            return (
              <div
                key={tmpl.code}
                className={clsx(
                  'rounded-2xl border-2 overflow-hidden transition-all flex flex-col',
                  isCurrent
                    ? 'border-blue-600 shadow-lg ring-2 ring-blue-500/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                <div
                  className={clsx(
                    'h-44 bg-gradient-to-br flex items-center justify-center p-4 relative',
                    tmpl.bgGradient
                  )}
                >
                  <i className={clsx('fas text-5xl', tmpl.icon, tmpl.iconColor)}></i>
                  {isCurrent && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm">
                      Sedang Aktif
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-bold text-base text-gray-900 dark:text-white">{tmpl.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{tmpl.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectTemplate(tmpl.code)}
                    disabled={loadingTemplate || isCurrent}
                    className={clsx(
                      'w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all',
                      isCurrent
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 cursor-default'
                        : loadingTemplate
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 cursor-wait'
                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90'
                    )}
                  >
                    {isCurrent
                      ? '✓ Template Terpilih'
                      : loadingTemplate
                      ? 'Loading...'
                      : 'Gunakan Template Ini'}
                  </button>
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
