import React from 'react';
import { UcapanRow } from '../types';

interface TabUcapanProps {
  ucapanList: UcapanRow[];
  onDeleteUcapan: (ucapanId: string) => void;
}

export const TabUcapan: React.FC<TabUcapanProps> = ({
  ucapanList,
  onDeleteUcapan,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <i className="fas fa-tree text-emerald-600"></i>
              Pohon Harapan
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Ucapan &amp; doa dari tamu di template Taman Rahasia (tabel ucapan_harapan). Hapus yang tidak sesuai.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold text-center">
            {ucapanList.length} Ucapan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-750 text-gray-600 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-5 py-3.5">Nama Tamu</th>
                <th className="px-5 py-3.5">Ucapan &amp; Doa</th>
                <th className="px-5 py-3.5">Waktu</th>
                <th className="px-5 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {ucapanList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    Belum ada ucapan yang tergantung di pohon harapan.
                  </td>
                </tr>
              ) : (
                ucapanList.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-750/50">
                    <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      {u.name}
                    </td>
                    <td className="px-5 py-4 text-gray-700 dark:text-gray-300 max-w-sm">
                      {u.ucapan}
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => onDeleteUcapan(u.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                        title="Hapus ucapan"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TabUcapan;
