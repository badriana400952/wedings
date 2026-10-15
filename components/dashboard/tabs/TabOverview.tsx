import React from 'react';
import { DashboardStats, DashboardComment, RsvpRow } from '../types';

interface TabOverviewProps {
  stats: DashboardStats;
  comments: DashboardComment[];
  onDownloadCSV: () => void;
  onDeleteComment: (commentId: string) => void;
  parseRsvp: (raw: string) => RsvpRow;
  rsvpStatusStyles: Record<string, string>;
}

export const TabOverview: React.FC<TabOverviewProps> = ({
  stats,
  comments,
  onDownloadCSV,
  onDeleteComment,
  parseRsvp,
  rsvpStatusStyles,
}) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Ucapan</p>
            <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stats.comments}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center text-lg">
            <i className="fas fa-comment-dots"></i>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Hadir</p>
            <p className="text-2xl font-bold mt-1 text-emerald-600">{stats.present}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-lg">
            <i className="fas fa-check-circle"></i>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Tidak Hadir</p>
            <p className="text-2xl font-bold mt-1 text-rose-600">{stats.absent}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 flex items-center justify-center text-lg">
            <i className="fas fa-times-circle"></i>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Likes</p>
            <p className="text-2xl font-bold mt-1 text-amber-500">{stats.likes}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 flex items-center justify-center text-lg">
            <i className="fas fa-heart"></i>
          </div>
        </div>
      </div>

      {/* Comments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Daftar Ucapan & Doa Tamu</h2>
            <p className="text-xs text-gray-500 mt-0.5">Kelola ucapan atau hapus komentar yang tidak sesuai</p>
          </div>
          <button
            type="button"
            onClick={onDownloadCSV}
            className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors font-medium flex items-center gap-2 shadow-sm"
          >
            <i className="fas fa-download"></i>
            Download CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-750 text-gray-600 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-5 py-3.5">Nama Tamu</th>
                <th className="px-5 py-3.5">Kehadiran</th>
                <th className="px-5 py-3.5">Ucapan & Pesan</th>
                <th className="px-5 py-3.5">Waktu</th>
                <th className="px-5 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {comments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Belum ada komentar atau ucapan dari tamu.
                  </td>
                </tr>
              ) : (
                comments.map((c) => {
                  const rsvp = parseRsvp(c.comment);
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-750/50">
                      <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                        {c.name}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {rsvp.isRsvp && rsvp.status ? (
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              rsvpStatusStyles[rsvp.status] || ''
                            }`}
                          >
                            {rsvp.label}
                          </span>
                        ) : (
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              c.presence
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
                            }`}
                          >
                            {c.presence ? 'Hadir' : 'Tidak Hadir'}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300 max-w-xs truncate">
                        {rsvp.detail || '—'}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString('id-ID', {
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
                          onClick={() => onDeleteComment(c.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                          title={rsvp.isRsvp ? 'Hapus konfirmasi kehadiran' : 'Hapus komentar'}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TabOverview;
