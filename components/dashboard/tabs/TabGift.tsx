import React from 'react';
import { WeddingFormData } from '../types';

interface TabGiftProps {
  formData: WeddingFormData;
  previews: { [key: string]: string };
  saving: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  onSaveWeddingData: (e: React.FormEvent) => void;
}

export const TabGift: React.FC<TabGiftProps> = ({
  formData,
  previews,
  saving,
  onInputChange,
  onFileChange,
  onSaveWeddingData,
}) => {
  return (
    <form onSubmit={onSaveWeddingData} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <i className="fas fa-gift text-amber-500"></i>
              Pengaturan Amplop Digital (Love Gift)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Aktifkan atau nonaktifkan fitur kirim kado / transfer untuk tamu
            </p>
          </div>

          {/* Main Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isGiftActive"
              checked={formData.isGiftActive}
              onChange={onInputChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-semibold text-gray-900 dark:text-gray-300">
              {formData.isGiftActive ? 'Aktif' : 'Nonaktif'}
            </span>
          </label>
        </div>

        {/* Section Bank Transfer */}
        <div
          className={`space-y-4 p-4 rounded-xl border transition-all ${
            formData.isBankActive
              ? 'bg-gray-50 dark:bg-gray-750 border-gray-200 dark:border-gray-600'
              : 'bg-gray-50/50 opacity-60 border-dashed border-gray-300 dark:border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <i className="fas fa-university text-blue-500"></i>
              Transfer Rekening Bank / E-Wallet
            </h4>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                name="isBankActive"
                checked={formData.isBankActive}
                onChange={onInputChange}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              Tampilkan Rekening Bank
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Nama Bank
              </label>
              <input
                type="text"
                name="namaBank"
                value={formData.namaBank}
                onChange={onInputChange}
                placeholder="Contoh: BCA / Mandiri / BRI"
                disabled={!formData.isBankActive}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Nomor Rekening / ATM
              </label>
              <input
                type="text"
                name="noAtm"
                value={formData.noAtm}
                onChange={onInputChange}
                placeholder="Contoh: 1234567890"
                disabled={!formData.isBankActive}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Nomor HP / DANA / OVO
              </label>
              <input
                type="text"
                name="noHp"
                value={formData.noHp}
                onChange={onInputChange}
                placeholder="Contoh: 08123456789"
                disabled={!formData.isBankActive}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section QRIS */}
        <div
          className={`space-y-4 p-4 rounded-xl border transition-all ${
            formData.isQrisActive
              ? 'bg-gray-50 dark:bg-gray-750 border-gray-200 dark:border-gray-600'
              : 'bg-gray-50/50 opacity-60 border-dashed border-gray-300 dark:border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <i className="fas fa-qrcode text-emerald-500"></i>
              Pembayaran via QRIS
            </h4>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                name="isQrisActive"
                checked={formData.isQrisActive}
                onChange={onInputChange}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              Tampilkan QRIS
            </label>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-36 h-36 rounded-xl overflow-hidden bg-white border border-gray-300 dark:border-gray-600 flex-shrink-0 flex items-center justify-center">
              {previews.fotoQris ? (
                <img
                  src={previews.fotoQris}
                  alt="QRIS Preview"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <i className="fas fa-qrcode text-3xl mb-1"></i>
                  <span className="text-[10px] block">Belum ada QRIS</span>
                </div>
              )}
            </div>

            <div className="flex-1 w-full space-y-2">
              <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                Upload Gambar QRIS
              </label>
              <input
                type="file"
                accept="image/*"
                disabled={!formData.isQrisActive}
                onChange={(e) => onFileChange(e, 'fotoQris')}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer disabled:opacity-50"
              />
              <p className="text-xs text-gray-500">
                Pastikan barcode QRIS terlihat jelas agar mudah di-scan oleh tamu.
              </p>
            </div>
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
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan Gift'}
        </button>
      </div>
    </form>
  );
};

export default TabGift;
