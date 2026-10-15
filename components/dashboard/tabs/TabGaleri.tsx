import React from 'react';

interface TabGaleriProps {
  galeriFotos: string[];
  uploadingGaleri: boolean;
  newGaleriFile: File | null;
  galeriInputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelected: (file: File | null) => void;
  onUploadGaleriPhoto: () => void;
  onDeleteGaleriPhoto: (index: number) => void;
}

export const TabGaleri: React.FC<TabGaleriProps> = ({
  galeriFotos,
  uploadingGaleri,
  newGaleriFile,
  galeriInputRef,
  onFileSelected,
  onUploadGaleriPhoto,
  onDeleteGaleriPhoto,
}) => {
  return (
    <div className="space-y-6">
      {/* Upload New Photo */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
          <i className="fas fa-cloud-upload-alt text-blue-500"></i>
          Tambah Foto Photoshoot
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            ref={galeriInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => onFileSelected(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          <button
            type="button"
            onClick={onUploadGaleriPhoto}
            disabled={!newGaleriFile || uploadingGaleri}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 disabled:opacity-50 shadow-sm"
          >
            <i className={`fas ${uploadingGaleri ? 'fa-spinner fa-spin' : 'fa-plus'}`}></i>
            {uploadingGaleri ? 'Mengunggah...' : 'Upload Foto'}
          </button>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center justify-between text-gray-900 dark:text-white">
          <span>Daftar Foto Galeri ({galeriFotos.length})</span>
        </h3>

        {galeriFotos.length === 0 ? (
          <p className="text-gray-500 text-sm py-8 text-center">
            Belum ada foto galeri. Upload foto momen berdua di atas!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {galeriFotos.map((fotoUrl, idx) => (
              <div
                key={idx}
                className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              >
                <img
                  src={fotoUrl}
                  alt={`Galeri ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Tombol Hapus */}
                <button
                  type="button"
                  onClick={() => onDeleteGaleriPhoto(idx)}
                  className="absolute top-2 right-2 px-2.5 py-1.5 bg-rose-600/90 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md backdrop-blur-sm transition-all hover:scale-105 active:scale-95 z-10"
                  title="Hapus foto ini"
                >
                  <i className="fas fa-trash-alt text-xs"></i>
                  <span>Hapus</span>
                </button>
                {/* Overlay Urutan Foto */}
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
                  <span className="text-[11px] text-white/90 font-medium">Foto #{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabGaleri;
