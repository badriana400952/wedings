import React from 'react';
import { WeddingFormData } from '../types';

interface TabAcaraProps {
  formData: WeddingFormData;
  saving: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSaveWeddingData: (e: React.FormEvent) => void;
}

export const TabAcara: React.FC<TabAcaraProps> = ({
  formData,
  saving,
  onInputChange,
  onSaveWeddingData,
}) => {
  return (
    <form onSubmit={onSaveWeddingData} className="space-y-6">
      {/* Tanggal Utama & Kalender */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 text-gray-900 dark:text-white">
          <i className="fas fa-calendar-check text-blue-500"></i>
          Informasi Tanggal Pernikahan Utama
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Tanggal Hari-H Pernikahan
            </label>
            <input
              type="date"
              name="tanggalPernikahan"
              value={formData.tanggalPernikahan}
              onChange={onInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Link Google Calendar
            </label>
            <input
              type="url"
              name="linkGoogleCalender"
              value={formData.linkGoogleCalender}
              onChange={onInputChange}
              placeholder="https://calendar.google.com/..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Akad Nikah */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 text-gray-900 dark:text-white">
          <i className="fas fa-ring text-amber-500"></i>
          Rangkaian Acara Akad Nikah
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Tanggal Akad
            </label>
            <input
              type="date"
              name="tanggalAkad"
              value={formData.tanggalAkad}
              onChange={onInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Jam Akad (WIB)
            </label>
            <input
              type="text"
              name="jamAkad"
              value={formData.jamAkad}
              onChange={onInputChange}
              placeholder="Contoh: 08:00 WIB - Selesai"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Tempat / Nama Gedung / Masjid
            </label>
            <input
              type="text"
              name="lokasiAkad"
              value={formData.lokasiAkad}
              onChange={onInputChange}
              placeholder="Contoh: Masjid Agung Al-Ukhuwah"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Alamat Lengkap Akad
            </label>
            <input
              type="text"
              name="alamatAkad"
              value={formData.alamatAkad}
              onChange={onInputChange}
              placeholder="Jl. Wastukencana No. 27, Bandung"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Resepsi Nikah */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 text-gray-900 dark:text-white">
          <i className="fas fa-glass-cheers text-purple-500"></i>
          Rangkaian Acara Resepsi Nikah
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Tanggal Resepsi
            </label>
            <input
              type="date"
              name="tanggalResepsi"
              value={formData.tanggalResepsi}
              onChange={onInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Jam Resepsi (WIB)
            </label>
            <input
              type="text"
              name="jamResepsi"
              value={formData.jamResepsi}
              onChange={onInputChange}
              placeholder="Contoh: 11:00 WIB - 14:00 WIB"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Nama Gedung / Tempat Resepsi
            </label>
            <input
              type="text"
              name="lokasiResepsi"
              value={formData.lokasiResepsi}
              onChange={onInputChange}
              placeholder="Contoh: Grand Ballroom Hotel Horison"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Link Google Maps
            </label>
            <input
              type="url"
              name="linkMaps"
              value={formData.linkMaps}
              onChange={onInputChange}
              placeholder="https://maps.app.goo.gl/..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Alamat Lengkap Lokasi Resepsi
            </label>
            <textarea
              rows={2}
              name="alamatPernikahan"
              value={formData.alamatPernikahan}
              onChange={onInputChange}
              placeholder="Jl. Pelajar Pejuang 45 No.121, Turangga, Lengkong, Kota Bandung"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
        >
          <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
          {saving ? 'Menyimpan...' : 'Simpan Jadwal & Lokasi'}
        </button>
      </div>
    </form>
  );
};

export default TabAcara;
