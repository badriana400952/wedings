import React from 'react';
import { DashboardTab } from './types';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

const TABS: { id: DashboardTab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Statistik & Buku Tamu', icon: 'fa-chart-pie' },
  { id: 'mempelai', label: 'Data Mempelai', icon: 'fa-user-friends' },
  { id: 'acara', label: 'Jadwal & Lokasi Acara', icon: 'fa-calendar-alt' },
  { id: 'gift', label: 'Amplop Digital & QRIS', icon: 'fa-gift' },
  { id: 'musik', label: 'Musik Latar', icon: 'fa-music' },
  { id: 'galeri', label: 'Galeri Foto', icon: 'fa-images' },
  { id: 'bersama', label: 'Gambar Bersama', icon: 'fa-heart' },
  { id: 'ucapan', label: 'Pohon Harapan', icon: 'fa-tree' },
  { id: 'template', label: 'Pilih Template', icon: 'fa-palette' },
  { id: 'links', label: 'Generator Link Undangan', icon: 'fa-paper-plane' },
];

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 space-y-1.5 sticky top-24">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
            }`}
          >
            <i className={`fas ${tab.icon} w-5 text-center`}></i>
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DashboardSidebar;
