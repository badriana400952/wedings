import React from 'react';
import { WeddingFormData } from '../types';

interface TabMempelaiProps {
  formData: WeddingFormData;
  previews: { [key: string]: string };
  saving: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  onSaveWeddingData: (e: React.FormEvent) => void;
}

export const TabMempelai: React.FC<TabMempelaiProps> = ({
  formData,
  previews,
  saving,
  onInputChange,
  onFileChange,
  onSaveWeddingData,
}) => {
  return (
    <form onSubmit={onSaveWeddingData} className="space-y-6">
      {/* Foto Header / Cover */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
          <i className="fas fa-image text-blue-500"></i>
          Foto Utama / Cover Header
        </h3>
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex-shrink-0">
            {previews.fotoHeader ? (
              <img
                src={previews.fotoHeader}
                alt="Cover Header"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <i className="fas fa-cloud-upload-alt text-3xl mb-1"></i>
                <span className="text-xs">Belum ada foto</span>
              </div>
            )}
          </div>
          <div className="flex-1 w-full space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Upload Foto Banner / Header
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e, 'fotoHeader')}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            <p className="text-xs text-gray-500">
              Format: JPG, PNG, atau WEBP. Disarankan ukuran lanskap resolusi tinggi.
            </p>
          </div>
        </div>
      </div>

      {/* Mempelai Pria */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 text-gray-900 dark:text-white">
          <i className="fas fa-male text-blue-500"></i>
          Data Mempelai Pria (Groom)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Nama Lengkap Pria
            </label>
            <input
              type="text"
              name="namaLengkapPutra"
              value={formData.namaLengkapPutra}
              onChange={onInputChange}
              placeholder="Contoh: Badriana, S.Kom"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Nama Panggilan Pria
            </label>
            <input
              type="text"
              name="namaPutra"
              value={formData.namaPutra}
              onChange={onInputChange}
              placeholder="Contoh: Badri"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Nama Ayah
            </label>
            <input
              type="text"
              name="namaAyahPutra"
              value={formData.namaAyahPutra}
              onChange={onInputChange}
              placeholder="Nama Ayah Mempelai Pria"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Nama Ibu
            </label>
            <input
              type="text"
              name="namaIbuPutra"
              value={formData.namaIbuPutra}
              onChange={onInputChange}
              placeholder="Nama Ibu Mempelai Pria"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Informasi Kelahiran / Putra ke-
            </label>
            <input
              type="text"
              name="kelahiranPutra"
              value={formData.kelahiranPutra}
              onChange={onInputChange}
              placeholder="Contoh: Putra pertama, lahir di Bandung 12 Mei 1998"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Instagram Pria
            </label>
            <input
              type="text"
              name="instagramPutra"
              value={formData.instagramPutra}
              onChange={onInputChange}
              placeholder="Username Instagram tanpa @"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Foto Pria */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex-shrink-0">
            {previews.photoPutra ? (
              <img
                src={previews.photoPutra}
                alt="Foto Pria"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <i className="fas fa-user text-2xl"></i>
              </div>
            )}
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Foto Mempelai Pria
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e, 'photoPutra')}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Mempelai Wanita */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 text-gray-900 dark:text-white">
          <i className="fas fa-female text-pink-500"></i>
          Data Mempelai Wanita (Bride)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Nama Lengkap Wanita
            </label>
            <input
              type="text"
              name="namaLengkapPutri"
              value={formData.namaLengkapPutri}
              onChange={onInputChange}
              placeholder="Contoh: Izzah Nur Fadilah, S.Pd"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Nama Panggilan Wanita
            </label>
            <input
              type="text"
              name="namaPutri"
              value={formData.namaPutri}
              onChange={onInputChange}
              placeholder="Contoh: Izzah"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Nama Ayah
            </label>
            <input
              type="text"
              name="namaAyahPutri"
              value={formData.namaAyahPutri}
              onChange={onInputChange}
              placeholder="Nama Ayah Mempelai Wanita"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Nama Ibu
            </label>
            <input
              type="text"
              name="namaIbuPutri"
              value={formData.namaIbuPutri}
              onChange={onInputChange}
              placeholder="Nama Ibu Mempelai Wanita"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Informasi Kelahiran / Putri ke-
            </label>
            <input
              type="text"
              name="kelahiranPutri"
              value={formData.kelahiranPutri}
              onChange={onInputChange}
              placeholder="Contoh: Putri kedua, lahir di Jakarta 20 Juli 2000"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Instagram Wanita
            </label>
            <input
              type="text"
              name="instagramPutri"
              value={formData.instagramPutri}
              onChange={onInputChange}
              placeholder="Username Instagram tanpa @"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Foto Wanita */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex-shrink-0">
            {previews.photoPutri ? (
              <img
                src={previews.photoPutri}
                alt="Foto Wanita"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <i className="fas fa-female text-2xl"></i>
              </div>
            )}
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Foto Mempelai Wanita
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e, 'photoPutri')}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer"
            />
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
          {saving ? 'Menyimpan...' : 'Simpan Data Mempelai'}
        </button>
      </div>
    </form>
  );
};

export default TabMempelai;
