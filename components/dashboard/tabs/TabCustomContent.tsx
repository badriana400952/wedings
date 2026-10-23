import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import {
  DEFAULT_KIRIGAMI_PASTEL,
  getKirigamiPastelContent,
  type KirigamiPastelContent,
  DEFAULT_TAMAN_RAHASIA,
  getTamanRahasiaContent,
  type TamanRahasiaContent,
  DEFAULT_TUMBUH_BERSAMA,
  getTumbuhBersamaContent,
  type TumbuhBersamaContent,
  DEFAULT_MEJA_KOKI,
  getMejaKokiContent,
  type MejaKokiContent,
  DEFAULT_SIMPLE_MODERN,
  getSimpleModernContent,
  type SimpleModernContent,
} from '@/lib/templatePresets';

interface TabCustomContentProps {
  currentTemplate: string;
  initialCustomContent?: any;
  showNotification: (type: 'success' | 'error', text: string) => void;
  onRefresh?: () => void;
}

// Konfigurasi visual & identitas untuk setiap tema
const TEMPLATE_META: Record<
  string,
  { name: string; icon: string; badgeClass: string; saveBtnClass: string; desc: string }
> = {
  A: {
    name: 'Template A: Simple Modern',
    icon: 'fas fa-gem',
    badgeClass: 'bg-blue-600 text-white border-blue-600 shadow-sm',
    saveBtnClass: 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800',
    desc: 'Amplop pembuka elegan, efek confetti cinta, dan kisah cinta modern.',
  },
  B: {
    name: 'Template B: Taman Rahasia',
    icon: 'fas fa-seedling',
    badgeClass: 'bg-emerald-600 text-white border-emerald-600 shadow-sm',
    saveBtnClass: 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800',
    desc: 'Editorial botani majalah, bunga pilihan, dan petunjuk perawatan benih.',
  },
  C: {
    name: 'Template C: Kirigami Pastel',
    icon: 'fas fa-cut',
    badgeClass: 'bg-pink-600 text-white border-pink-600 shadow-sm',
    saveBtnClass: 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700',
    desc: 'Seni potong kertas Jepang berlapis, lipatan rahasia, dan nuansa pastel.',
  },
  D: {
    name: 'Template D: Tumbuh Bersama',
    icon: 'fas fa-tree',
    badgeClass: 'bg-lime-700 text-white border-lime-700 shadow-sm',
    saveBtnClass: 'bg-gradient-to-r from-lime-700 to-emerald-800 hover:from-lime-800 hover:to-emerald-900',
    desc: 'Living botanical canvas, kisah 4 musim tanam, pohon inoskulasi, dan Kebun Doa.',
  },
  E: {
    name: 'Template E: Meja Sang Koki',
    icon: 'fas fa-utensils',
    badgeClass: 'bg-amber-800 text-white border-amber-800 shadow-sm',
    saveBtnClass: 'bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950',
    desc: 'Konsep fine dining interaktif: hidangan cerita degustasi dan buku resep cinta.',
  },
};

export const TabCustomContent: React.FC<TabCustomContentProps> = ({
  currentTemplate,
  initialCustomContent,
  showNotification,
  onRefresh,
}) => {
  // Tab template aktif otomatis mengikuti template yang sedang dipilih pengantin (A, B, C, D, E)
  const activeTab =
    currentTemplate === 'A' ||
    currentTemplate === 'B' ||
    currentTemplate === 'C' ||
    currentTemplate === 'D' ||
    currentTemplate === 'E'
      ? currentTemplate
      : 'A';

  const currentMeta = TEMPLATE_META[activeTab] || TEMPLATE_META.A;

  // State form Simple Modern (Template A)
  const [modernForm, setModernForm] = useState<SimpleModernContent>(() =>
    getSimpleModernContent(initialCustomContent)
  );

  // State form Kirigami Pastel (Template C)
  const [kirigamiForm, setKirigamiForm] = useState<KirigamiPastelContent>(() =>
    getKirigamiPastelContent(initialCustomContent)
  );

  // State form Taman Rahasia (Template B)
  const [tamanForm, setTamanForm] = useState<TamanRahasiaContent>(() =>
    getTamanRahasiaContent(initialCustomContent)
  );

  // State form Tumbuh Bersama (Template D)
  const [tumbuhForm, setTumbuhForm] = useState<TumbuhBersamaContent>(() =>
    getTumbuhBersamaContent(initialCustomContent)
  );

  // State form Meja Sang Koki (Template E)
  const [kokiForm, setKokiForm] = useState<MejaKokiContent>(() =>
    getMejaKokiContent(initialCustomContent)
  );

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialCustomContent) {
      setKirigamiForm(getKirigamiPastelContent(initialCustomContent));
      setTamanForm(getTamanRahasiaContent(initialCustomContent));
      setTumbuhForm(getTumbuhBersamaContent(initialCustomContent));
      setKokiForm(getMejaKokiContent(initialCustomContent));
      setModernForm(getSimpleModernContent(initialCustomContent));
    }
  }, [initialCustomContent]);


  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      let payloadContent: any = modernForm;
      if (activeTab === 'A') payloadContent = modernForm;
      else if (activeTab === 'B') payloadContent = tamanForm;
      else if (activeTab === 'C') payloadContent = kirigamiForm;
      else if (activeTab === 'D') payloadContent = tumbuhForm;
      else if (activeTab === 'E') payloadContent = kokiForm;

      const res = await fetch('/api/user/custom-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateCode: activeTab,
          content: payloadContent,
        }),
      });

      const data = await res.json();
      setSaving(false);

      if (res.ok && data.success) {
        showNotification(
          'success',
          `✓ Cerita & konten khusus Template ${activeTab} berhasil disimpan!`
        );
        if (onRefresh) onRefresh();
      } else {
        showNotification(
          'error',
          '✗ Gagal menyimpan konten: ' + (data.message || '')
        );
      }
    } catch (err: any) {
      setSaving(false);
      console.error(err);
      showNotification('error', '✗ Terjadi kesalahan saat menyimpan konten.');
    }
  };

  // Helper untuk Kirigami
  const handleKirigamiFoldChange = (
    index: number,
    field: 'pertanyaan' | 'jawaban',
    val: string
  ) => {
    setKirigamiForm((prev) => {
      const updated = [...prev.secretFolds];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, secretFolds: updated };
    });
  };

  const handleKirigamiColorChange = (index: number, colorVal: string) => {
    setKirigamiForm((prev) => {
      const updated = [...prev.dresscodeColors];
      updated[index] = colorVal;
      return { ...prev, dresscodeColors: updated };
    });
  };

  // Helper untuk Taman Rahasia
  const handleTamanColorChange = (index: number, colorVal: string) => {
    setTamanForm((prev) => {
      const updated = [...prev.dresscodeColors];
      updated[index] = colorVal;
      return { ...prev, dresscodeColors: updated };
    });
  };

  // Helper untuk Tumbuh Bersama
  const handleTumbuhColorChange = (index: number, colorVal: string) => {
    setTumbuhForm((prev) => {
      const updated = [...prev.dresscodeColors];
      updated[index] = colorVal;
      return { ...prev, dresscodeColors: updated };
    });
  };

  const handleDaunGugurChange = (
    index: number,
    field: 'dilepaskan' | 'tumbuh',
    val: string
  ) => {
    setTumbuhForm((prev) => {
      const updated = [...prev.daunGugur];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, daunGugur: updated };
    });
  };

  const handleLingkaranChange = (
    index: number,
    field: 'tahun' | 'catatan',
    val: string
  ) => {
    setTumbuhForm((prev) => {
      const updated = [...prev.lingkaranTahun];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, lingkaranTahun: updated };
    });
  };

  const handlePetunjukChange = (
    index: number,
    field: 'judul' | 'keterangan',
    val: string
  ) => {
    setTumbuhForm((prev) => {
      const updated = [...prev.petunjukKebun];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, petunjukKebun: updated };
    });
  };

  const handleHarapanChange = (
    index: number,
    field: 'tahunKe' | 'isiHarapan',
    val: string
  ) => {
    setTumbuhForm((prev) => {
      const updated = [...prev.harapanNanti];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, harapanNanti: updated };
    });
  };

  // Helper untuk Meja Sang Koki
  const handleKokiColorChange = (index: number, colorVal: string) => {
    setKokiForm((prev) => {
      const updated = [...prev.dresscodeColors];
      updated[index] = colorVal;
      return { ...prev, dresscodeColors: updated };
    });
  };

  // Helper untuk Simple Modern
  const handleModernColorChange = (index: number, colorVal: string) => {
    setModernForm((prev) => {
      const updated = [...prev.dresscodeColors];
      updated[index] = colorVal;
      return { ...prev, dresscodeColors: updated };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Info & Template Switcher */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="w-3 h-3 rounded-full bg-lime-600 animate-pulse"></span>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Kustomisasi Cerita & Alur Template
            </h3>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-300">
              Template Aktif Pengantin: {currentTemplate}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Formulir di bawah otomatis menampilkan pengaturan cerita & narasi khusus untuk tema aktif undangan Anda.
          </p>

          {/* Badge Template yang Sedang Aktif (Terpilih Otomatis) */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <div
              className={clsx(
                'px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2.5 border shadow-sm',
                currentMeta.badgeClass
              )}
            >
              <i className={clsx(currentMeta.icon, 'text-sm')}></i>
              <span>{currentMeta.name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className={clsx(
              'inline-flex items-center justify-center gap-2 px-6 py-2.5 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-60',
              currentMeta.saveBtnClass
            )}
          >
            {saving ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* FORM EDITOR: TEMPLATE D - TUMBUH BERSAMA                       */}
      {/* ============================================================== */}
      {activeTab === 'D' && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* SEKSI 1: PROFIL MEMPELAI, SILSILAH & TANAH ASAL */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-lime-100 dark:bg-lime-900/40 text-lime-800 dark:text-lime-300 flex items-center justify-center text-sm font-bold">
                1
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Profil Mempelai & Tanah Asal (Bibit Pohon)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Silsilah anak, kota asal, karakter tanah, dan saat tumbuh paling subur
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mempelai Wanita */}
              <div className="space-y-3 bg-lime-50/40 dark:bg-gray-900/40 p-4 rounded-xl border border-lime-200/60 dark:border-gray-700">
                <span className="text-xs font-bold text-lime-900 dark:text-lime-300 block">
                  🌿 Mempelai Wanita
                </span>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Urutan Anak (Silsilah)
                  </label>
                  <input
                    type="text"
                    value={tumbuhForm.keteranganAnakWanita}
                    onChange={(e) =>
                      setTumbuhForm({ ...tumbuhForm, keteranganAnakWanita: e.target.value })
                    }
                    placeholder="Contoh: Putri kedua dari"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Kota Asal (Tanah Asal)
                    </label>
                    <input
                      type="text"
                      value={tumbuhForm.kotaAsalWanita}
                      onChange={(e) =>
                        setTumbuhForm({ ...tumbuhForm, kotaAsalWanita: e.target.value })
                      }
                      placeholder="Wonosobo"
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Sifat Tanah Asal
                    </label>
                    <input
                      type="text"
                      value={tumbuhForm.sifatTanahWanita}
                      onChange={(e) =>
                        setTumbuhForm({ ...tumbuhForm, sifatTanahWanita: e.target.value })
                      }
                      placeholder="vulkanik, sejuk, dan gembur"
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tumbuh Paling Subur Saat...
                  </label>
                  <input
                    type="text"
                    value={tumbuhForm.suburSaatWanita}
                    onChange={(e) =>
                      setTumbuhForm({ ...tumbuhForm, suburSaatWanita: e.target.value })
                    }
                    placeholder="hujan sore, ditemani segelas wedang jahe"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Mempelai Pria */}
              <div className="space-y-3 bg-lime-50/40 dark:bg-gray-900/40 p-4 rounded-xl border border-lime-200/60 dark:border-gray-700">
                <span className="text-xs font-bold text-lime-900 dark:text-lime-300 block">
                  🌳 Mempelai Pria
                </span>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Urutan Anak (Silsilah)
                  </label>
                  <input
                    type="text"
                    value={tumbuhForm.keteranganAnakPria}
                    onChange={(e) =>
                      setTumbuhForm({ ...tumbuhForm, keteranganAnakPria: e.target.value })
                    }
                    placeholder="Contoh: Putra pertama dari"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Kota Asal (Tanah Asal)
                    </label>
                    <input
                      type="text"
                      value={tumbuhForm.kotaAsalPria}
                      onChange={(e) =>
                        setTumbuhForm({ ...tumbuhForm, kotaAsalPria: e.target.value })
                      }
                      placeholder="Balikpapan"
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Sifat Tanah Asal
                    </label>
                    <input
                      type="text"
                      value={tumbuhForm.sifatTanahPria}
                      onChange={(e) =>
                        setTumbuhForm({ ...tumbuhForm, sifatTanahPria: e.target.value })
                      }
                      placeholder="merah, hangat, dan tahan kemarau"
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tumbuh Paling Subur Saat...
                  </label>
                  <input
                    type="text"
                    value={tumbuhForm.suburSaatPria}
                    onChange={(e) =>
                      setTumbuhForm({ ...tumbuhForm, suburSaatPria: e.target.value })
                    }
                    placeholder="matahari pagi, sesudah kopi pertama"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEKSI 2: PAKET BENIH & HERO */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-lime-100 dark:bg-lime-900/40 text-lime-800 dark:text-lime-300 flex items-center justify-center text-sm font-bold">
                2
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Paket Benih Sampul, Hero & Kata Pengantar
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Sapaan di amplop bibit, headline pembuka pohon, dan kutipan ayat sakral
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tulisan di Paket Benih (Sampul Depan)
                  </label>
                  <input
                    type="text"
                    value={tumbuhForm.tulisanPaketBenih}
                    onChange={(e) =>
                      setTumbuhForm({ ...tumbuhForm, tulisanPaketBenih: e.target.value })
                    }
                    placeholder="Dua benih, satu musim tanam."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-lime-800 dark:text-lime-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Kalimat Utama di Hero
                  </label>
                  <input
                    type="text"
                    value={tumbuhForm.heroHeadline}
                    onChange={(e) =>
                      setTumbuhForm({ ...tumbuhForm, heroHeadline: e.target.value })
                    }
                    placeholder="Tumbuh bersama, musim demi musim."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-serif italic text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Salam Pembuka
                  </label>
                  <input
                    type="text"
                    value={tumbuhForm.salamPembuka}
                    onChange={(e) =>
                      setTumbuhForm({ ...tumbuhForm, salamPembuka: e.target.value })
                    }
                    placeholder="Assalamu'alaikum Warahmatullahi Wabarakatuh"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Sumber Kutipan / Ayat
                  </label>
                  <input
                    type="text"
                    value={tumbuhForm.sumberKutipan}
                    onChange={(e) =>
                      setTumbuhForm({ ...tumbuhForm, sumberKutipan: e.target.value })
                    }
                    placeholder="QS. Ar-Rum: 21"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Kata Pengantar Undangan
                </label>
                <textarea
                  rows={2}
                  value={tumbuhForm.kataPengantar}
                  onChange={(e) =>
                    setTumbuhForm({ ...tumbuhForm, kataPengantar: e.target.value })
                  }
                  placeholder="Dengan memohon rahmat dan rida Allah Swt..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Isi Kutipan / Ayat Suci
                </label>
                <textarea
                  rows={2}
                  value={tumbuhForm.kutipanAyat}
                  onChange={(e) =>
                    setTumbuhForm({ ...tumbuhForm, kutipanAyat: e.target.value })
                  }
                  placeholder="Dan di antara tanda-tanda kekuasaan-Nya ialah..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none italic font-serif"
                />
              </div>
            </div>
          </div>

          {/* SEKSI 3: INOSKULASI (SENTUHAN PERTAMA & DUA POHON MENYATU) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-lime-100 dark:bg-lime-900/40 text-lime-800 dark:text-lime-300 flex items-center justify-center text-sm font-bold">
                3
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Inoskulasi (Kisah Sentuhan Pertama & Penyatuan Dua Batang)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Momen awal perjumpaan dan ikatan kedua pohon yang kini tumbuh menjadi satu tajuk
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tanggal Pertama Bertemu
                  </label>
                  <input
                    type="text"
                    value={tumbuhForm.tglPertamaBertemu}
                    onChange={(e) =>
                      setTumbuhForm({ ...tumbuhForm, tglPertamaBertemu: e.target.value })
                    }
                    placeholder="13/04/2019"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tempat Pertama Bertemu
                  </label>
                  <input
                    type="text"
                    value={tumbuhForm.tempatPertamaBertemu}
                    onChange={(e) =>
                      setTumbuhForm({ ...tumbuhForm, tempatPertamaBertemu: e.target.value })
                    }
                    placeholder="Lereng Merapi, di hari relawan menanam pohon"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Cerita Sentuhan Pertama
                </label>
                <textarea
                  rows={2}
                  value={tumbuhForm.ceritaSentuhanPertama}
                  onChange={(e) =>
                    setTumbuhForm({ ...tumbuhForm, ceritaSentuhanPertama: e.target.value })
                  }
                  placeholder="Ia menggali lubang, aku memegang bibitnya..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Kalimat Saat Dua Pohon Menyatu
                </label>
                <textarea
                  rows={2}
                  value={tumbuhForm.kalimatDuaPohonMenyatu}
                  onChange={(e) =>
                    setTumbuhForm({ ...tumbuhForm, kalimatDuaPohonMenyatu: e.target.value })
                  }
                  placeholder="Dua batang, satu tajuk. Akar kami tetap dua..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none italic font-serif"
                />
              </div>
            </div>
          </div>

          {/* SEKSI 4: KISAH 4 MUSIM (STORY) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-lime-100 dark:bg-lime-900/40 text-lime-800 dark:text-lime-300 flex items-center justify-center text-sm font-bold">
                4
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Kisah 4 Musim (Semi, Panas, Gugur, Dingin)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Empat fase musim perjalanan cinta Anda
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
              {/* Musim 1 */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 space-y-2.5">
                <span className="text-xs font-bold text-lime-800 dark:text-lime-400 block">
                  🌱 Kisah 1 (Musim Semi — Bertunas)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={tumbuhForm.story1Title}
                    onChange={(e) => setTumbuhForm({ ...tumbuhForm, story1Title: e.target.value })}
                    placeholder="Judul (Musim tunas pertama)"
                    className="px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-semibold"
                  />
                  <input
                    type="text"
                    value={tumbuhForm.story1Time}
                    onChange={(e) => setTumbuhForm({ ...tumbuhForm, story1Time: e.target.value })}
                    placeholder="Waktu (April 2019)"
                    className="px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
                <textarea
                  rows={3}
                  value={tumbuhForm.story1Story}
                  onChange={(e) => setTumbuhForm({ ...tumbuhForm, story1Story: e.target.value })}
                  placeholder="Cerita musim 1..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                />
                <input
                  type="text"
                  value={tumbuhForm.story1Photo || ''}
                  onChange={(e) => setTumbuhForm({ ...tumbuhForm, story1Photo: e.target.value })}
                  placeholder="URL Foto Musim 1 (opsional)"
                  className="w-full px-3 py-1 text-[11px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-500"
                />
              </div>

              {/* Musim 2 */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 space-y-2.5">
                <span className="text-xs font-bold text-lime-800 dark:text-lime-400 block">
                  ☀️ Kisah 2 (Musim Panas — Rimbun)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={tumbuhForm.story2Title}
                    onChange={(e) => setTumbuhForm({ ...tumbuhForm, story2Title: e.target.value })}
                    placeholder="Judul (Musim yang rimbun)"
                    className="px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-semibold"
                  />
                  <input
                    type="text"
                    value={tumbuhForm.story2Time}
                    onChange={(e) => setTumbuhForm({ ...tumbuhForm, story2Time: e.target.value })}
                    placeholder="Waktu (2020 – 2022)"
                    className="px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
                <textarea
                  rows={3}
                  value={tumbuhForm.story2Story}
                  onChange={(e) => setTumbuhForm({ ...tumbuhForm, story2Story: e.target.value })}
                  placeholder="Cerita musim 2..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                />
                <input
                  type="text"
                  value={tumbuhForm.story2Photo || ''}
                  onChange={(e) => setTumbuhForm({ ...tumbuhForm, story2Photo: e.target.value })}
                  placeholder="URL Foto Musim 2 (opsional)"
                  className="w-full px-3 py-1 text-[11px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-500"
                />
              </div>

              {/* Musim 3 */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 space-y-2.5">
                <span className="text-xs font-bold text-lime-800 dark:text-lime-400 block">
                  🍂 Kisah 3 (Musim Gugur — Melepas)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={tumbuhForm.story3Title}
                    onChange={(e) => setTumbuhForm({ ...tumbuhForm, story3Title: e.target.value })}
                    placeholder="Judul (Musim melepas)"
                    className="px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-semibold"
                  />
                  <input
                    type="text"
                    value={tumbuhForm.story3Time}
                    onChange={(e) => setTumbuhForm({ ...tumbuhForm, story3Time: e.target.value })}
                    placeholder="Waktu (2023)"
                    className="px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
                <textarea
                  rows={3}
                  value={tumbuhForm.story3Story}
                  onChange={(e) => setTumbuhForm({ ...tumbuhForm, story3Story: e.target.value })}
                  placeholder="Cerita musim 3..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                />
                <input
                  type="text"
                  value={tumbuhForm.story3Photo || ''}
                  onChange={(e) => setTumbuhForm({ ...tumbuhForm, story3Photo: e.target.value })}
                  placeholder="URL Foto Musim 3 (opsional)"
                  className="w-full px-3 py-1 text-[11px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-500"
                />
              </div>

              {/* Musim 4 */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 space-y-2.5">
                <span className="text-xs font-bold text-lime-800 dark:text-lime-400 block">
                  ❄️ Kisah 4 (Musim Dingin — Mengakar)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={tumbuhForm.story4Title}
                    onChange={(e) => setTumbuhForm({ ...tumbuhForm, story4Title: e.target.value })}
                    placeholder="Judul (Musim mengakar)"
                    className="px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-semibold"
                  />
                  <input
                    type="text"
                    value={tumbuhForm.story4Time}
                    onChange={(e) => setTumbuhForm({ ...tumbuhForm, story4Time: e.target.value })}
                    placeholder="Waktu (Desember 2025)"
                    className="px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
                <textarea
                  rows={3}
                  value={tumbuhForm.story4Story}
                  onChange={(e) => setTumbuhForm({ ...tumbuhForm, story4Story: e.target.value })}
                  placeholder="Cerita musim 4..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                />
                <input
                  type="text"
                  value={tumbuhForm.story4Photo || ''}
                  onChange={(e) => setTumbuhForm({ ...tumbuhForm, story4Photo: e.target.value })}
                  placeholder="URL Foto Musim 4 (opsional)"
                  className="w-full px-3 py-1 text-[11px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Keterangan Galeri Spesimen Foto
              </label>
              <input
                type="text"
                value={tumbuhForm.keteranganGaleri}
                onChange={(e) =>
                  setTumbuhForm({ ...tumbuhForm, keteranganGaleri: e.target.value })
                }
                placeholder="Setiap foto adalah spesimen dari satu musim yang pernah kami lewati."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none italic"
              />
            </div>
          </div>

          {/* SEKSI 5: DAUN GUGUR (6 PASANG YANG DILEPASKAN VS YANG TUMBUH) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-lime-100 dark:bg-lime-900/40 text-lime-800 dark:text-lime-300 flex items-center justify-center text-sm font-bold">
                5
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Fitur Daun Gugur (6 Daun: Yang Dilepaskan vs Yang Tumbuh)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Interaksi botani saat tamu mengetuk daun yang berguguran untuk melihat kedewasaan cinta
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {tumbuhForm.daunGugur.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <div>
                    <label className="block text-[11px] font-semibold text-amber-700 dark:text-amber-400 mb-1">
                      🍂 Daun {idx + 1} — Yang Dilepaskan
                    </label>
                    <input
                      type="text"
                      value={item.dilepaskan}
                      onChange={(e) => handleDaunGugurChange(idx, 'dilepaskan', e.target.value)}
                      placeholder="Gengsi untuk minta maaf duluan"
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                      🌱 Daun {idx + 1} — Yang Tumbuh Sebagai Gantinya
                    </label>
                    <input
                      type="text"
                      value={item.tumbuh}
                      onChange={(e) => handleDaunGugurChange(idx, 'tumbuh', e.target.value)}
                      placeholder="Kebiasaan bilang 'maaf, aku salah'"
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-medium"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEKSI 6: LINGKARAN TAHUN POHON (5 FASE) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-lime-100 dark:bg-lime-900/40 text-lime-800 dark:text-lime-300 flex items-center justify-center text-sm font-bold">
                6
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Lingkaran Tahun Pohon (5 Fase Pertumbuhan Batang)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Catatan pertumbuhan lingkar batang pohon kayu cinta Anda
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {tumbuhForm.lingkaranTahun.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
                >
                  <div className="w-full sm:w-28 flex-none">
                    <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">
                      Tahun Fase {idx + 1}
                    </label>
                    <input
                      type="text"
                      value={item.tahun}
                      onChange={(e) => handleLingkaranChange(idx, 'tahun', e.target.value)}
                      placeholder="2019"
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-bold text-lime-800 dark:text-lime-300"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">
                      Catatan Lingkaran Tahun
                    </label>
                    <input
                      type="text"
                      value={item.catatan}
                      onChange={(e) => handleLingkaranChange(idx, 'catatan', e.target.value)}
                      placeholder="Lingkaran pertama. Tipis, karena..."
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEKSI 7: PANDUAN BUSANA (DRESSCODE 5 WARNA ALAM) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-lime-100 dark:bg-lime-900/40 text-lime-800 dark:text-lime-300 flex items-center justify-center text-sm font-bold">
                7
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Panduan Busana & 5 Warna Alam (Dresscode)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Keterangan busana bertema alam dan 5 swatch warna dedaunan
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Keterangan Panduan Busana Tamu
                </label>
                <textarea
                  rows={2}
                  value={tumbuhForm.dresscodeText}
                  onChange={(e) =>
                    setTumbuhForm({ ...tumbuhForm, dresscodeText: e.target.value })
                  }
                  placeholder="Kami mengundang Anda mengenakan warna-warna musim semi..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  5 Warna Swatch Alam (Pilih Warna)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {tumbuhForm.dresscodeColors.slice(0, 5).map((color, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-3"
                    >
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => handleTumbuhColorChange(idx, e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600 bg-transparent flex-none"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] text-gray-400 block font-medium">
                          Warna {idx + 1}
                        </span>
                        <span className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200 uppercase truncate">
                          {color}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SEKSI 8: PETUNJUK KEBUN (6 ATURAN) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-lime-100 dark:bg-lime-900/40 text-lime-800 dark:text-lime-300 flex items-center justify-center text-sm font-bold">
                8
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Petunjuk Kebun (6 Poin Informasi Tamu)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Panduan waktu datang, jarak parkir, kawan tanam, sinar matahari, penyiraman, dan etiket
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tumbuhForm.petunjukKebun.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 space-y-1.5"
                >
                  <label className="block text-[11px] font-bold text-lime-900 dark:text-lime-300">
                    Petunjuk #{idx + 1}
                  </label>
                  <input
                    type="text"
                    value={item.judul}
                    onChange={(e) => handlePetunjukChange(idx, 'judul', e.target.value)}
                    placeholder="Judul petunjuk"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={item.keterangan}
                    onChange={(e) => handlePetunjukChange(idx, 'keterangan', e.target.value)}
                    placeholder="Keterangan..."
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SEKSI 9: POHON HARAPAN / NANTI (4 HARAPAN) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-lime-100 dark:bg-lime-900/40 text-lime-800 dark:text-lime-300 flex items-center justify-center text-sm font-bold">
                9
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Pohon Harapan (Nanti — Tahun ke-1, 5, 25, 50)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Visi masa depan yang dipajang di dahan pohon harapan Anda
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tumbuhForm.harapanNanti.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-lime-900 dark:text-lime-300">
                      Harapan #{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      Tahun ke-{item.tahunKe}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={item.isiHarapan}
                    onChange={(e) => handleHarapanChange(idx, 'isiHarapan', e.target.value)}
                    placeholder="Isi harapan..."
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-serif italic"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SEKSI 10: TANDA KASIH, RSVP, PENUTUP, KELUARGA & TAGAR */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-lime-100 dark:bg-lime-900/40 text-lime-800 dark:text-lime-300 flex items-center justify-center text-sm font-bold">
                10
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Tanda Kasih, RSVP, Penutup, Nama Keluarga & Tagar
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Kalimat apresiasi, salam perpisahan, daftar keluarga besar yang turut mengundang, dan tagar pernikahan
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Keterangan Tanda Kasih (Hadiah)
                  </label>
                  <textarea
                    rows={2}
                    value={tumbuhForm.catatanHadiah}
                    onChange={(e) =>
                      setTumbuhForm({ ...tumbuhForm, catatanHadiah: e.target.value })
                    }
                    placeholder="Doa dan kehadiran Anda adalah hadiah terbaik..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Keterangan RSVP (Konfirmasi Kehadiran)
                  </label>
                  <textarea
                    rows={2}
                    value={tumbuhForm.catatanRsvp}
                    onChange={(e) =>
                      setTumbuhForm({ ...tumbuhForm, catatanRsvp: e.target.value })
                    }
                    placeholder="Setiap tamu yang datang adalah satu bibit baru..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Kalimat Penutup
                  </label>
                  <textarea
                    rows={3}
                    value={tumbuhForm.kalimatPenutup}
                    onChange={(e) =>
                      setTumbuhForm({ ...tumbuhForm, kalimatPenutup: e.target.value })
                    }
                    placeholder="Merupakan suatu kehormatan dan kebahagiaan bagi kami..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Turut Mengundang (Satu per baris)
                  </label>
                  <textarea
                    rows={3}
                    value={tumbuhForm.turutMengundang}
                    onChange={(e) =>
                      setTumbuhForm({ ...tumbuhForm, turutMengundang: e.target.value })
                    }
                    placeholder="Keluarga besar Riyadi di Wonosobo&#10;Keluarga besar Wicaksono di Balikpapan"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Nama Keluarga yang Berbahagia
                  </label>
                  <input
                    type="text"
                    value={tumbuhForm.namaKeluarga}
                    onChange={(e) =>
                      setTumbuhForm({ ...tumbuhForm, namaKeluarga: e.target.value })
                    }
                    placeholder="Keluarga Besar Bapak Sugeng Riyadi & ..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Salam Penutup
                  </label>
                  <input
                    type="text"
                    value={tumbuhForm.salamPenutup}
                    onChange={(e) =>
                      setTumbuhForm({ ...tumbuhForm, salamPenutup: e.target.value })
                    }
                    placeholder="Wassalamu'alaikum Warahmatullahi Wabarakatuh"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tagar Pernikahan
                  </label>
                  <input
                    type="text"
                    value={tumbuhForm.tagarPernikahan}
                    onChange={(e) =>
                      setTumbuhForm({ ...tumbuhForm, tagarPernikahan: e.target.value })
                    }
                    placeholder="#AsriBumiTumbuhBersama"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-lime-800 dark:text-lime-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Simpan Bawah Template D */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-lime-700 to-emerald-800 hover:from-lime-800 hover:to-emerald-900 text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Menyimpan Cerita Tumbuh Bersama...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle"></i>
                  <span>Simpan Seluruh Cerita & Tema Tumbuh Bersama</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}



      {/* ============================================================== */}
      {/* FORM EDITOR: TEMPLATE B - TAMAN RAHASIA                        */}
      {/* ============================================================== */}
      {activeTab === 'B' && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* SEKSI 1: SILSILAH MEMPELAI & PETUNJUK PERAWATAN BENIH */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-sm font-bold">
                1
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Silsilah Mempelai & Petunjuk Perawatan Benih
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Keterangan urutan anak dan pesan petunjuk unik di balik bungkus benih kartu mempelai
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mempelai Wanita */}
              <div className="space-y-3 bg-emerald-50/40 dark:bg-gray-900/40 p-4 rounded-xl border border-emerald-100 dark:border-gray-700">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                  🌸 Mempelai Wanita
                </span>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Keterangan Anak (Silsilah)
                  </label>
                  <input
                    type="text"
                    value={tamanForm.keteranganAnakWanita}
                    onChange={(e) =>
                      setTamanForm({ ...tamanForm, keteranganAnakWanita: e.target.value })
                    }
                    placeholder="Contoh: Putri kedua dari"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Petunjuk Perawatan Benih (Satu per baris)
                  </label>
                  <textarea
                    rows={3}
                    value={tamanForm.petunjukPerawatanWanita}
                    onChange={(e) =>
                      setTamanForm({ ...tamanForm, petunjukPerawatanWanita: e.target.value })
                    }
                    placeholder="Siram dengan kopi susu setiap pagi..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 leading-relaxed font-mono"
                  />
                </div>
              </div>

              {/* Mempelai Pria */}
              <div className="space-y-3 bg-emerald-50/40 dark:bg-gray-900/40 p-4 rounded-xl border border-emerald-100 dark:border-gray-700">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                  🌿 Mempelai Pria
                </span>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Keterangan Anak (Silsilah)
                  </label>
                  <input
                    type="text"
                    value={tamanForm.keteranganAnakPria}
                    onChange={(e) =>
                      setTamanForm({ ...tamanForm, keteranganAnakPria: e.target.value })
                    }
                    placeholder="Contoh: Putra pertama dari"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Petunjuk Perawatan Benih (Satu per baris)
                  </label>
                  <textarea
                    rows={3}
                    value={tamanForm.petunjukPerawatanPria}
                    onChange={(e) =>
                      setTamanForm({ ...tamanForm, petunjukPerawatanPria: e.target.value })
                    }
                    placeholder="Butuh sinar matahari dan sepiring nasi padang..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 leading-relaxed font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEKSI 2: GERBANG TAMAN & PRASASTI BATU */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-sm font-bold">
                2
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Gerbang Taman & Prasasti Batu
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Kalimat pembuka saat tamu tiba dan kutipan sakral di atas prasasti batu berlumut
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Kalimat Pembuka Gerbang Taman
                </label>
                <textarea
                  rows={2}
                  value={tamanForm.kalimatPembuka}
                  onChange={(e) =>
                    setTamanForm({ ...tamanForm, kalimatPembuka: e.target.value })
                  }
                  placeholder="Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Kutipan di Prasasti Batu
                  </label>
                  <textarea
                    rows={3}
                    value={tamanForm.kutipanPrasasti}
                    onChange={(e) =>
                      setTamanForm({ ...tamanForm, kutipanPrasasti: e.target.value })
                    }
                    placeholder="Cinta tidak tumbuh dalam semalam. Ia ditanam dengan sabar..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 italic font-serif"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Sumber Kutipan
                  </label>
                  <input
                    type="text"
                    value={tamanForm.sumberKutipan}
                    onChange={(e) =>
                      setTamanForm({ ...tamanForm, sumberKutipan: e.target.value })
                    }
                    placeholder="Catatan kecil di pintu taman kami"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEKSI 3: MUSIM-MUSIM KAMI (4 BABAK KISAH PERJALANAN) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-sm font-bold">
                3
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Musim-Musim Kami (4 Babak Kisah Perjalanan)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Empat tahapan tumbuhnya kisah cinta Anda (Benih, Tunas, Kuncup, Mekar)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Kisah 1 */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 space-y-2.5">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
                  Babak 1 (Tahap Benih)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={tamanForm.story1Title}
                    onChange={(e) => setTamanForm({ ...tamanForm, story1Title: e.target.value })}
                    placeholder="Judul (Pot yang Tertukar)"
                    className="px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-semibold"
                  />
                  <input
                    type="text"
                    value={tamanForm.story1Time}
                    onChange={(e) => setTamanForm({ ...tamanForm, story1Time: e.target.value })}
                    placeholder="Waktu (Maret 2019)"
                    className="px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
                <textarea
                  rows={3}
                  value={tamanForm.story1Story}
                  onChange={(e) => setTamanForm({ ...tamanForm, story1Story: e.target.value })}
                  placeholder="Cerita babak 1..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                />
                <input
                  type="text"
                  value={tamanForm.story1Photo || ''}
                  onChange={(e) => setTamanForm({ ...tamanForm, story1Photo: e.target.value })}
                  placeholder="URL Foto Babak 1 (opsional)"
                  className="w-full px-3 py-1.5 text-[11px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-500"
                />
              </div>

              {/* Kisah 2 */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 space-y-2.5">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
                  Babak 2 (Tahap Tunas)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={tamanForm.story2Title}
                    onChange={(e) => setTamanForm({ ...tamanForm, story2Title: e.target.value })}
                    placeholder="Judul (Tumbuh Diam-Diam)"
                    className="px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-semibold"
                  />
                  <input
                    type="text"
                    value={tamanForm.story2Time}
                    onChange={(e) => setTamanForm({ ...tamanForm, story2Time: e.target.value })}
                    placeholder="Waktu (Agustus 2020)"
                    className="px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
                <textarea
                  rows={3}
                  value={tamanForm.story2Story}
                  onChange={(e) => setTamanForm({ ...tamanForm, story2Story: e.target.value })}
                  placeholder="Cerita babak 2..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                />
                <input
                  type="text"
                  value={tamanForm.story2Photo || ''}
                  onChange={(e) => setTamanForm({ ...tamanForm, story2Photo: e.target.value })}
                  placeholder="URL Foto Babak 2 (opsional)"
                  className="w-full px-3 py-1.5 text-[11px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-500"
                />
              </div>

              {/* Kisah 3 */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 space-y-2.5">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
                  Babak 3 (Tahap Kuncup)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={tamanForm.story3Title}
                    onChange={(e) => setTamanForm({ ...tamanForm, story3Title: e.target.value })}
                    placeholder="Judul (Kuncup di Bawah Hujan)"
                    className="px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-semibold"
                  />
                  <input
                    type="text"
                    value={tamanForm.story3Time}
                    onChange={(e) => setTamanForm({ ...tamanForm, story3Time: e.target.value })}
                    placeholder="Waktu (Desember 2025)"
                    className="px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
                <textarea
                  rows={3}
                  value={tamanForm.story3Story}
                  onChange={(e) => setTamanForm({ ...tamanForm, story3Story: e.target.value })}
                  placeholder="Cerita babak 3..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                />
                <input
                  type="text"
                  value={tamanForm.story3Photo || ''}
                  onChange={(e) => setTamanForm({ ...tamanForm, story3Photo: e.target.value })}
                  placeholder="URL Foto Babak 3 (opsional)"
                  className="w-full px-3 py-1.5 text-[11px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-500"
                />
              </div>

              {/* Kisah 4 */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 space-y-2.5">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
                  Babak 4 (Tahap Musim Mekar)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={tamanForm.story4Title}
                    onChange={(e) => setTamanForm({ ...tamanForm, story4Title: e.target.value })}
                    placeholder="Judul (Musim Mekar)"
                    className="px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-semibold"
                  />
                  <input
                    type="text"
                    value={tamanForm.story4Time}
                    onChange={(e) => setTamanForm({ ...tamanForm, story4Time: e.target.value })}
                    placeholder="Waktu (Musim ini)"
                    className="px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
                <textarea
                  rows={3}
                  value={tamanForm.story4Story}
                  onChange={(e) => setTamanForm({ ...tamanForm, story4Story: e.target.value })}
                  placeholder="Cerita babak 4..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                />
                <input
                  type="text"
                  value={tamanForm.story4Photo || ''}
                  onChange={(e) => setTamanForm({ ...tamanForm, story4Photo: e.target.value })}
                  placeholder="URL Foto Babak 4 (opsional)"
                  className="w-full px-3 py-1.5 text-[11px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* SEKSI 4: BUNGA PILIHAN & ARTINYA */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-sm font-bold">
                4
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Bunga Pilihan & Makna (Fitur Interaktif Tab Kuncup)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  3 Bunga yang dipilih mempelai dengan makna cinta di baliknya
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Bunga 1 */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-amber-50/30 dark:bg-gray-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                    🌻 Pilihan Pria untuk Wanita
                  </span>
                  <input
                    type="color"
                    value={tamanForm.bungaWanitaWarna || '#e7b75a'}
                    onChange={(e) =>
                      setTamanForm({ ...tamanForm, bungaWanitaWarna: e.target.value })
                    }
                    className="w-6 h-6 rounded cursor-pointer border-0"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Nama Bunga
                  </label>
                  <input
                    type="text"
                    value={tamanForm.bungaWanitaNama}
                    onChange={(e) =>
                      setTamanForm({ ...tamanForm, bungaWanitaNama: e.target.value })
                    }
                    placeholder="Bunga Matahari"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Makna / Arti Bunga
                  </label>
                  <textarea
                    rows={3}
                    value={tamanForm.bungaWanitaArti}
                    onChange={(e) =>
                      setTamanForm({ ...tamanForm, bungaWanitaArti: e.target.value })
                    }
                    placeholder="Karena kamu selalu jadi arah aku menoleh..."
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* Bunga 2 */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    🌼 Pilihan Wanita untuk Pria
                  </span>
                  <input
                    type="color"
                    value={tamanForm.bungaPriaWarna || '#ffffff'}
                    onChange={(e) =>
                      setTamanForm({ ...tamanForm, bungaPriaWarna: e.target.value })
                    }
                    className="w-6 h-6 rounded cursor-pointer border-0"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Nama Bunga
                  </label>
                  <input
                    type="text"
                    value={tamanForm.bungaPriaNama}
                    onChange={(e) =>
                      setTamanForm({ ...tamanForm, bungaPriaNama: e.target.value })
                    }
                    placeholder="Melati"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Makna / Arti Bunga
                  </label>
                  <textarea
                    rows={3}
                    value={tamanForm.bungaPriaArti}
                    onChange={(e) =>
                      setTamanForm({ ...tamanForm, bungaPriaArti: e.target.value })
                    }
                    placeholder="Sederhana, harum, dan setia..."
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* Bunga 3 */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-rose-50/30 dark:bg-gray-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
                    🌹 Pilihan Kami Berdua
                  </span>
                  <input
                    type="color"
                    value={tamanForm.bungaBerduaWarna || '#eba6b1'}
                    onChange={(e) =>
                      setTamanForm({ ...tamanForm, bungaBerduaWarna: e.target.value })
                    }
                    className="w-6 h-6 rounded cursor-pointer border-0"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Nama Bunga
                  </label>
                  <input
                    type="text"
                    value={tamanForm.bungaBerduaNama}
                    onChange={(e) =>
                      setTamanForm({ ...tamanForm, bungaBerduaNama: e.target.value })
                    }
                    placeholder="Mawar Merah Muda"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Makna / Arti Bunga
                  </label>
                  <textarea
                    rows={3}
                    value={tamanForm.bungaBerduaArti}
                    onChange={(e) =>
                      setTamanForm({ ...tamanForm, bungaBerduaArti: e.target.value })
                    }
                    placeholder="Untuk rasa syukur dan kelembutan..."
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEKSI 5: DRESSCODE */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-sm font-bold">
                5
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Panduan Busana & 5 Palet Warna Alam (Dresscode)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Keterangan busana tamu dan 5 warna kelopak bunga yang dianjurkan
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Keterangan Busana Tamu
                </label>
                <textarea
                  rows={2}
                  value={tamanForm.dresscodeText}
                  onChange={(e) =>
                    setTamanForm({ ...tamanForm, dresscodeText: e.target.value })
                  }
                  placeholder="Kami ingin taman kami dipenuhi warna yang senada..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  5 Warna Swatch Busana (Pilih Warna)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {tamanForm.dresscodeColors.slice(0, 5).map((color, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-3"
                    >
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => handleTamanColorChange(idx, e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600 bg-transparent flex-none"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] text-gray-400 block font-medium">
                          Warna {idx + 1}
                        </span>
                        <span className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200 uppercase truncate">
                          {color}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SEKSI 6: SURAT RAHASIA */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-sm font-bold">
                6
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Surat Rahasia di Bawah Batu (Easter Egg Interaktif)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Surat khusus yang terbuka ketika tamu mengangkat batu berlumut di dalam taman
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Isi Surat Rahasia
                </label>
                <textarea
                  rows={4}
                  value={tamanForm.suratRahasiaIsi}
                  onChange={(e) =>
                    setTamanForm({ ...tamanForm, suratRahasiaIsi: e.target.value })
                  }
                  placeholder="Kalau kamu menemukan surat ini, berarti kamu tamu yang teliti..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Salam Penutup Surat Rahasia
                </label>
                <input
                  type="text"
                  value={tamanForm.suratRahasiaPenutup}
                  onChange={(e) =>
                    setTamanForm({ ...tamanForm, suratRahasiaPenutup: e.target.value })
                  }
                  placeholder="Dengan hangat, Nurizzati Islamiyah & Badriana"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* SEKSI 7: PENUTUP */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-sm font-bold">
                7
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Tanda Kasih, RSVP, Pesan Penutup & Tagar
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Informasi hadiah, catatan batas konfirmasi, salam pamungkas, dan tagar taman
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Keterangan Keranjang Tanda Kasih (Hadiah)
                </label>
                <textarea
                  rows={2}
                  value={tamanForm.catatanHadiah}
                  onChange={(e) =>
                    setTamanForm({ ...tamanForm, catatanHadiah: e.target.value })
                  }
                  placeholder="Doa restumu adalah bunga terindah di taman kami..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Catatan Batas RSVP
                </label>
                <input
                  type="text"
                  value={tamanForm.catatanRsvp}
                  onChange={(e) =>
                    setTamanForm({ ...tamanForm, catatanRsvp: e.target.value })
                  }
                  placeholder="Mohon kabari kami paling lambat dua minggu..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Pesan Penutup Senja di Taman
                </label>
                <textarea
                  rows={2}
                  value={tamanForm.pesanPenutup}
                  onChange={(e) =>
                    setTamanForm({ ...tamanForm, pesanPenutup: e.target.value })
                  }
                  placeholder="Terima kasih telah berjalan bersama kami menyusuri taman ini..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Tagar Pernikahan
                </label>
                <input
                  type="text"
                  value={tamanForm.tagarPernikahan}
                  onChange={(e) =>
                    setTamanForm({ ...tamanForm, tagarPernikahan: e.target.value })
                  }
                  placeholder="#TamanNurizzatiBadriana"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Tombol Simpan Bawah Template B */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Menyimpan Cerita Taman...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle"></i>
                  <span>Simpan Seluruh Cerita & Tema Taman Rahasia</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}



      {/* ============================================================== */}
      {/* FORM EDITOR: TEMPLATE C - KIRIGAMI PASTEL                      */}
      {/* ============================================================== */}
      {activeTab === 'C' && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* SEKSI 1: PROFIL & KETERANGAN MEMPELAI */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 flex items-center justify-center text-sm font-bold">
                1
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Keterangan Anak (Profil Mempelai)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Keterangan urutan anak yang tampil di kartu profil mempelai
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Keterangan Anak (Mempelai Wanita)
                </label>
                <input
                  type="text"
                  value={kirigamiForm.keteranganAnakWanita}
                  onChange={(e) =>
                    setKirigamiForm({
                      ...kirigamiForm,
                      keteranganAnakWanita: e.target.value,
                    })
                  }
                  placeholder="Contoh: Putri kedua dari"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Keterangan Anak (Mempelai Pria)
                </label>
                <input
                  type="text"
                  value={kirigamiForm.keteranganAnakPria}
                  onChange={(e) =>
                    setKirigamiForm({
                      ...kirigamiForm,
                      keteranganAnakPria: e.target.value,
                    })
                  }
                  placeholder="Contoh: Putra pertama dari"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* SEKSI 2: KUTIPAN PEMBUKA */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 flex items-center justify-center text-sm font-bold">
                2
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Kutipan Pembuka Seni Kertas (Hero)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Kutipan puitis yang menyambut tamu di halaman awal
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Kutipan Kertas Kirigami
              </label>
              <textarea
                rows={3}
                value={kirigamiForm.heroQuote}
                onChange={(e) =>
                  setKirigamiForm({ ...kirigamiForm, heroQuote: e.target.value })
                }
                placeholder="Dua lembar kertas berbeda warna, digunting hati-hati..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none italic font-serif leading-relaxed"
              />
            </div>
          </div>

          {/* SEKSI 3: TIGA GUNTINGAN KISAH */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 flex items-center justify-center text-sm font-bold">
                3
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Tiga Guntingan Kisah Perjalanan Cinta
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Babak 1, 2, dan 3 yang menjadi alur narasi cinta Anda
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 space-y-3">
                <span className="text-xs font-bold text-pink-600 dark:text-pink-400 block">
                  Babak 1: Guntingan Pertama (Pertemuan)
                </span>
                <input
                  type="text"
                  value={kirigamiForm.story1Title}
                  onChange={(e) =>
                    setKirigamiForm({ ...kirigamiForm, story1Title: e.target.value })
                  }
                  placeholder="Judul Babak 1"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-semibold"
                />
                <textarea
                  rows={2}
                  value={kirigamiForm.story1Story}
                  onChange={(e) =>
                    setKirigamiForm({ ...kirigamiForm, story1Story: e.target.value })
                  }
                  placeholder="Isi kisah babak 1..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                />
              </div>

              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 space-y-3">
                <span className="text-xs font-bold text-pink-600 dark:text-pink-400 block">
                  Babak 2: Lipatan Kedua (Perjalanan)
                </span>
                <input
                  type="text"
                  value={kirigamiForm.story2Title}
                  onChange={(e) =>
                    setKirigamiForm({ ...kirigamiForm, story2Title: e.target.value })
                  }
                  placeholder="Judul Babak 2"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-semibold"
                />
                <textarea
                  rows={2}
                  value={kirigamiForm.story2Story}
                  onChange={(e) =>
                    setKirigamiForm({ ...kirigamiForm, story2Story: e.target.value })
                  }
                  placeholder="Isi kisah babak 2..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                />
              </div>

              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 space-y-3">
                <span className="text-xs font-bold text-pink-600 dark:text-pink-400 block">
                  Babak 3: Rekatan Terakhir (Lamaran & Komitmen)
                </span>
                <input
                  type="text"
                  value={kirigamiForm.story3Title}
                  onChange={(e) =>
                    setKirigamiForm({ ...kirigamiForm, story3Title: e.target.value })
                  }
                  placeholder="Judul Babak 3"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-semibold"
                />
                <textarea
                  rows={2}
                  value={kirigamiForm.story3Story}
                  onChange={(e) =>
                    setKirigamiForm({ ...kirigamiForm, story3Story: e.target.value })
                  }
                  placeholder="Isi kisah babak 3..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                />
              </div>
            </div>
          </div>

          {/* SEKSI 4: LIPATAN RAHASIA */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 flex items-center justify-center text-sm font-bold">
                4
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Lipatan Rahasia (Fitur Interaktif Tanya-Jawab)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  3 Lipatan kertas interaktif untuk fakta unik Anda
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {kirigamiForm.secretFolds.map((fold, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 space-y-2.5"
                >
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                    Lipatan Rahasia #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={fold.pertanyaan}
                    onChange={(e) =>
                      handleKirigamiFoldChange(idx, 'pertanyaan', e.target.value)
                    }
                    placeholder="Pertanyaan (cth: Siapa yang paling sering telat?)"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-medium"
                  />
                  <textarea
                    rows={2}
                    value={fold.jawaban}
                    onChange={(e) =>
                      handleKirigamiFoldChange(idx, 'jawaban', e.target.value)
                    }
                    placeholder="Jawaban unik..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SEKSI 5: DRESSCODE */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 flex items-center justify-center text-sm font-bold">
                5
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Panduan Busana & Palet Pastel (Dresscode)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Deskripsi aturan busana dan 4 warna pastel
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Keterangan Panduan Busana
                </label>
                <textarea
                  rows={2}
                  value={kirigamiForm.dresscodeText}
                  onChange={(e) =>
                    setKirigamiForm({ ...kirigamiForm, dresscodeText: e.target.value })
                  }
                  placeholder="Kami mengundang Anda mengenakan busana bernuansa pastel..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  4 Warna Busana Pastel (Pilih Warna)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {kirigamiForm.dresscodeColors.map((color, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-3"
                    >
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => handleKirigamiColorChange(idx, e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600 bg-transparent flex-none"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] text-gray-400 block font-medium">
                          Warna {idx + 1}
                        </span>
                        <span className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200 uppercase truncate">
                          {color}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SEKSI 6: PENUTUP */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 flex items-center justify-center text-sm font-bold">
                6
              </span>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Tanda Kasih, Pesan Penutup & Tagar Pernikahan
                </h4>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Catatan Hadiah & Tanda Kasih
                </label>
                <textarea
                  rows={2}
                  value={kirigamiForm.catatanHadiah}
                  onChange={(e) =>
                    setKirigamiForm({ ...kirigamiForm, catatanHadiah: e.target.value })
                  }
                  placeholder="Kehadiran Anda sudah menjadi hadiah terindah..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Pesan Penutup Doa Restu
                </label>
                <textarea
                  rows={2}
                  value={kirigamiForm.pesanPenutup}
                  onChange={(e) =>
                    setKirigamiForm({ ...kirigamiForm, pesanPenutup: e.target.value })
                  }
                  placeholder="Merupakan suatu kebahagiaan bagi kami..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Tagar Pernikahan
                </label>
                <input
                  type="text"
                  value={kirigamiForm.tagarPernikahan}
                  onChange={(e) =>
                    setKirigamiForm({ ...kirigamiForm, tagarPernikahan: e.target.value })
                  }
                  placeholder="#SatuLembarBerdua"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-pink-600"
                />
              </div>
            </div>
          </div>

          {/* Tombol Simpan Bawah Template C */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Menyimpan Cerita...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle"></i>
                  <span>Simpan Seluruh Cerita & Tema Kirigami</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}



      {/* ========================================================= */}
      {/* FORM EDITOR TEMPLATE E (MEJA SANG KOKI)                   */}
      {/* ========================================================= */}
      {activeTab === 'E' && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Banner Mode Template E */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/40 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <i className="fas fa-utensils text-sm"></i>
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Mode Sunting: Template E — Meja Sang Koki
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300/80 mt-0.5 leading-relaxed">
                Sesuaikan narasi jamuan kuliner, 4 babak degustasi cinta, resep rumah tangga bahagia, dan uji rasa interaktif tamu agar pesta Anda terasa eksklusif dan berkesan.
              </p>
            </div>
          </div>

          {/* Seksi 1: Edisi Menu & Dapur Cinta */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xs font-bold">
                1
              </span>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  Edisi Menu & Catatan Dapur Koki
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tajuk pembuka menu degustasi, filosofi kaldu cinta, dan sambutan dari dapur mempelai.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Tajuk Edisi Menu & Nomor Meja
                </label>
                <input
                  type="text"
                  value={kokiForm.edisiMenu}
                  onChange={(e) =>
                    setKokiForm({ ...kokiForm, edisiMenu: e.target.value })
                  }
                  placeholder="Edisi Panen Juni — Meja No. 01"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Kutipan Pembuka (Filosofi Kaldu Cinta)
                </label>
                <textarea
                  rows={2}
                  value={kokiForm.kutipanPembuka}
                  onChange={(e) =>
                    setKokiForm({ ...kokiForm, kutipanPembuka: e.target.value })
                  }
                  placeholder="Cinta yang baik seperti kaldu yang ditunggu semalaman: ia tidak bisa diburu, hanya bisa dijaga apinya."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-amber-600 italic"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Catatan dari Dapur (Sambutan Utama Koki)
                </label>
                <textarea
                  rows={3}
                  value={kokiForm.catatanDapur}
                  onChange={(e) =>
                    setKokiForm({ ...kokiForm, catatanDapur: e.target.value })
                  }
                  placeholder="Selamat datang di meja kami. Malam ini dapur tidak menyajikan apa-apa yang mewah, hanya satu kisah yang dimasak perlahan sejak 2019..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Seksi 2: Bahan Baku Utama (Dua Mempelai) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  Dua Bahan Baku Utama (Karakter & Silsilah Mempelai)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Kartu interaktif bolak-balik yang menggambarkan peran dan latar belakang masing-masing mempelai di dapur kehidupan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Mempelai Pria */}
              <div className="p-4 rounded-xl border border-amber-200/60 dark:border-amber-800/30 bg-amber-50/20 dark:bg-amber-950/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                  <i className="fas fa-fire text-amber-600"></i>
                  <span>Bahan No. 01 — Mempelai Pria</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Silsilah Anak (Misal: Putra pertama dari)
                  </label>
                  <input
                    type="text"
                    value={kokiForm.keteranganAnakPria}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, keteranganAnakPria: e.target.value })
                    }
                    placeholder="Putra pertama dari"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Catatan Karakter Bahan Pria
                  </label>
                  <textarea
                    rows={2}
                    value={kokiForm.catatanBahanPria}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, catatanBahanPria: e.target.value })
                    }
                    placeholder="Dipetik dari Yogyakarta, 1994 — bertugas menjaga api tetap menyala"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              {/* Mempelai Wanita */}
              <div className="p-4 rounded-xl border border-orange-200/60 dark:border-orange-800/30 bg-orange-50/20 dark:bg-orange-950/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-900 dark:text-orange-300">
                  <i className="fas fa-seedling text-orange-600"></i>
                  <span>Bahan No. 02 — Mempelai Wanita</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Silsilah Anak (Misal: Putri kedua dari)
                  </label>
                  <input
                    type="text"
                    value={kokiForm.keteranganAnakWanita}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, keteranganAnakWanita: e.target.value })
                    }
                    placeholder="Putri kedua dari"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-orange-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Catatan Karakter Bahan Wanita
                  </label>
                  <textarea
                    rows={2}
                    value={kokiForm.catatanBahanWanita}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, catatanBahanWanita: e.target.value })
                    }
                    placeholder="Dipetik dari Bandung, 1996 — bertugas menyeimbangkan setiap rasa"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-orange-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seksi 3: Menu Degustasi (4 Babak Kisah) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xs font-bold">
                3
              </span>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  Menu Degustasi (Empat Sajian, Satu Kisah)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Empat babak jamuan yang mengisahkan awal pertemuan hingga lamaran di atas piring sajian elegan.
                </p>
              </div>
            </div>

            {/* Sajian 1 */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 font-mono">Babak I</span>
                  <span>Amuse-Bouche (Pertemuan Awal)</span>
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Nama Hidangan
                  </label>
                  <input
                    type="text"
                    value={kokiForm.course1Title}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, course1Title: e.target.value })
                    }
                    placeholder="Amuse-Bouche: Kopi Tumpah"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Padanan Minuman & Tahun (Pairing)
                  </label>
                  <input
                    type="text"
                    value={kokiForm.course1Pairing}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, course1Pairing: e.target.value })
                    }
                    placeholder="Dipadukan dengan kopi susu gula aren, 2019"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Kisah Hidangan Pertama
                </label>
                <textarea
                  rows={2}
                  value={kokiForm.course1Story}
                  onChange={(e) =>
                    setKokiForm({ ...kokiForm, course1Story: e.target.value })
                  }
                  placeholder="Pertemuan pertama di kedai kecil dekat kantor. Satu gelas tumpah..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  URL Foto Sajian (Opsional, kosongkan untuk foto bawaan)
                </label>
                <input
                  type="text"
                  value={kokiForm.course1Photo || ''}
                  onChange={(e) =>
                    setKokiForm({ ...kokiForm, course1Photo: e.target.value })
                  }
                  placeholder="https://... / path foto"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-mono"
                />
              </div>
            </div>

            {/* Sajian 2 */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 font-mono">Babak II</span>
                  <span>Pembuka (Dua Tahun Saling Mengenal Rasa)</span>
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Nama Hidangan
                  </label>
                  <input
                    type="text"
                    value={kokiForm.course2Title}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, course2Title: e.target.value })
                    }
                    placeholder="Pembuka: Salad Musim Hujan"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Padanan Minuman & Tahun (Pairing)
                  </label>
                  <input
                    type="text"
                    value={kokiForm.course2Pairing}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, course2Pairing: e.target.value })
                    }
                    placeholder="Dipadukan dengan teh melati hangat, 2021"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Kisah Hidangan Kedua
                </label>
                <textarea
                  rows={2}
                  value={kokiForm.course2Story}
                  onChange={(e) =>
                    setKokiForm({ ...kokiForm, course2Story: e.target.value })
                  }
                  placeholder="Dua tahun saling mengenal rasa. Kami belajar bahwa pahit pun perlu..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  URL Foto Sajian (Opsional)
                </label>
                <input
                  type="text"
                  value={kokiForm.course2Photo || ''}
                  onChange={(e) =>
                    setKokiForm({ ...kokiForm, course2Photo: e.target.value })
                  }
                  placeholder="https://... / path foto"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-mono"
                />
              </div>
            </div>

            {/* Sajian 3 */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 font-mono">Babak III</span>
                  <span>Sajian Utama (Bertemu Keluarga & Restu)</span>
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Nama Hidangan
                  </label>
                  <input
                    type="text"
                    value={kokiForm.course3Title}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, course3Title: e.target.value })
                    }
                    placeholder="Utama: Rendang Sabar"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Padanan Minuman & Tahun (Pairing)
                  </label>
                  <input
                    type="text"
                    value={kokiForm.course3Pairing}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, course3Pairing: e.target.value })
                    }
                    placeholder="Dipadukan dengan beras solok & air kelapa, 2024"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Kisah Hidangan Ketiga
                </label>
                <textarea
                  rows={2}
                  value={kokiForm.course3Story}
                  onChange={(e) =>
                    setKokiForm({ ...kokiForm, course3Story: e.target.value })
                  }
                  placeholder="Dimasak delapan jam di atas api kecil. Kami bertemu keluarga..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  URL Foto Sajian (Opsional)
                </label>
                <input
                  type="text"
                  value={kokiForm.course3Photo || ''}
                  onChange={(e) =>
                    setKokiForm({ ...kokiForm, course3Photo: e.target.value })
                  }
                  placeholder="https://... / path foto"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-mono"
                />
              </div>
            </div>

            {/* Sajian 4 */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 font-mono">Babak IV</span>
                  <span>Penutup (Lamaran & Janji Seumur Hidup)</span>
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Nama Hidangan
                  </label>
                  <input
                    type="text"
                    value={kokiForm.course4Title}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, course4Title: e.target.value })
                    }
                    placeholder="Penutup: Puding Janji"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Padanan Minuman & Tahun (Pairing)
                  </label>
                  <input
                    type="text"
                    value={kokiForm.course4Pairing}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, course4Pairing: e.target.value })
                    }
                    placeholder="Dipadukan dengan satu kata: iya, 2026"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Kisah Hidangan Keempat
                </label>
                <textarea
                  rows={2}
                  value={kokiForm.course4Story}
                  onChange={(e) =>
                    setKokiForm({ ...kokiForm, course4Story: e.target.value })
                  }
                  placeholder="Manis yang paling ditunggu. Ia berlutut di dapur, di antara wangi vanila..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  URL Foto Sajian (Opsional)
                </label>
                <input
                  type="text"
                  value={kokiForm.course4Photo || ''}
                  onChange={(e) =>
                    setKokiForm({ ...kokiForm, course4Photo: e.target.value })
                  }
                  placeholder="https://... / path foto"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Seksi 4: Resep Rumah Tangga Bahagia (Interaktif Masuk Panci) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xs font-bold">
                4
              </span>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  Resep Rumah Tangga Bahagia (Interaktif Panci Masak)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Resep keluarga yang dapat disentuh tamu untuk memasukkan bahan ke dalam panci hingga mendidih sempurna.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Judul Kartu Resep
                </label>
                <input
                  type="text"
                  value={kokiForm.resepJudul}
                  onChange={(e) =>
                    setKokiForm({ ...kokiForm, resepJudul: e.target.value })
                  }
                  placeholder="Resep Rumah Tangga Bahagia"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-amber-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Takaran Porsi / Yield
                </label>
                <input
                  type="text"
                  value={kokiForm.resepPorsi}
                  onChange={(e) =>
                    setKokiForm({ ...kokiForm, resepPorsi: e.target.value })
                  }
                  placeholder="Untuk 2 porsi — disajikan seumur hidup"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Daftar Bahan-bahan (1 bahan per baris)
                </label>
                <span className="text-[11px] text-amber-700 dark:text-amber-400">
                  Tamu dapat mencentang setiap butir bahan ini
                </span>
              </div>
              <textarea
                rows={6}
                value={kokiForm.resepBahan}
                onChange={(e) =>
                  setKokiForm({ ...kokiForm, resepBahan: e.target.value })
                }
                placeholder="200 gram kesabaran, disaring halus&#10;3 sendok makan tawa sebelum tidur&#10;1 genggam maaf yang tidak ditunda&#10;1 batang kejujuran, memarkan&#10;Secukupnya doa dari kedua keluarga&#10;Sejumput rindu untuk hari-hari sibuk"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-amber-600 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Cara Memasak (1 langkah per baris)
                </label>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  Tercetak runtut bernomor pada kartu resep
                </span>
              </div>
              <textarea
                rows={5}
                value={kokiForm.resepCaraMasak}
                onChange={(e) =>
                  setKokiForm({ ...kokiForm, resepCaraMasak: e.target.value })
                }
                placeholder="Panaskan niat di atas api kecil, jangan terburu-buru.&#10;Masukkan kesabaran, aduk searah sampai harum.&#10;Tuang tawa sedikit demi sedikit agar tidak pecah.&#10;Bumbui dengan maaf setiap kali terasa gosong.&#10;Sajikan hangat setiap hari, untuk berdua."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-amber-600 font-mono"
              />
            </div>
          </div>

          {/* Seksi 5: Uji Rasa Tamu (4 Sajian Rasa) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xs font-bold">
                5
              </span>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  Uji Rasa Tamu (Empat Rasa Interaktif)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tamu memilih suasana rasa yang dibawanya (Manis, Gurih, Pedas, Segar) dan menerima hidangan personal di atas piring interaktif.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Manis */}
              <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-900/20 space-y-2">
                <span className="text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1.5">
                  <i className="fas fa-cookie-bite"></i>
                  <span>Pilihan 1: Rasa Manis</span>
                </span>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Nama Sajian Manis
                  </label>
                  <input
                    type="text"
                    value={kokiForm.ujiManisNama}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, ujiManisNama: e.target.value })
                    }
                    placeholder="Klapertart Pengantin"
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Catatan untuk Tamu
                  </label>
                  <textarea
                    rows={2}
                    value={kokiForm.ujiManisCatatan}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, ujiManisCatatan: e.target.value })
                    }
                    placeholder="Untuk Anda yang percaya bahwa akhir bahagia memang harus manis..."
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* Gurih */}
              <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-900/20 space-y-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <i className="fas fa-bowl-rice"></i>
                  <span>Pilihan 2: Rasa Gurih</span>
                </span>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Nama Sajian Gurih
                  </label>
                  <input
                    type="text"
                    value={kokiForm.ujiGurihNama}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, ujiGurihNama: e.target.value })
                    }
                    placeholder="Sup Iga Restu"
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Catatan untuk Tamu
                  </label>
                  <textarea
                    rows={2}
                    value={kokiForm.ujiGurihCatatan}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, ujiGurihCatatan: e.target.value })
                    }
                    placeholder="Hangat, dalam, dan selalu ditunggu. Cocok untuk tamu yang membawa pelukan..."
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* Pedas */}
              <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-900/20 space-y-2">
                <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <i className="fas fa-pepper-hot"></i>
                  <span>Pilihan 3: Rasa Pedas</span>
                </span>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Nama Sajian Pedas
                  </label>
                  <input
                    type="text"
                    value={kokiForm.ujiPedasNama}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, ujiPedasNama: e.target.value })
                    }
                    placeholder="Sambal Matah Nekat"
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Catatan untuk Tamu
                  </label>
                  <textarea
                    rows={2}
                    value={kokiForm.ujiPedasCatatan}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, ujiPedasCatatan: e.target.value })
                    }
                    placeholder="Berani, jujur, sedikit membuat mata berair — persis seperti keputusan menikah..."
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* Segar */}
              <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-900/20 space-y-2">
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                  <i className="fas fa-leaf"></i>
                  <span>Pilihan 4: Rasa Segar</span>
                </span>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Nama Sajian Segar
                  </label>
                  <input
                    type="text"
                    value={kokiForm.ujiSegarNama}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, ujiSegarNama: e.target.value })
                    }
                    placeholder="Es Serbat Kemangi"
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Catatan untuk Tamu
                  </label>
                  <textarea
                    rows={2}
                    value={kokiForm.ujiSegarCatatan}
                    onChange={(e) =>
                      setKokiForm({ ...kokiForm, ujiSegarCatatan: e.target.value })
                    }
                    placeholder="Ringan dan menenangkan, untuk tamu yang membawa kabar baik dan cerita enteng..."
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seksi 6: Etiket Busana & Palet Piring (Dresscode) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xs font-bold">
                6
              </span>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  Etiket Busana & Palet Piring Jamuan
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Instruksi berbusana tamu dan 3 swatch warna serasi meja jamuan.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Petunjuk Berbusana Tamu
              </label>
              <textarea
                rows={3}
                value={kokiForm.dresscodeText}
                onChange={(e) =>
                  setKokiForm({ ...kokiForm, dresscodeText: e.target.value })
                }
                placeholder="Kami menata meja dengan nuansa hangat. Mohon hadir dengan busana rapi bernuansa hijau zaitun, kuningan, dan krem..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                3 Pilihan Warna Palet (Color Swatches)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {kokiForm.dresscodeColors.map((color, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                  >
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleKokiColorChange(idx, e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                    />
                    <div className="flex-1">
                      <span className="text-[10px] text-gray-400 block font-medium">
                        Warna #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => handleKokiColorChange(idx, e.target.value)}
                        className="w-full font-mono text-xs uppercase bg-transparent outline-none font-semibold text-gray-700 dark:text-gray-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seksi 7: Kotak Tip Dapur, Reservasi Kursi & Penutup */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xs font-bold">
                7
              </span>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  Kotak Tip Dapur, Reservasi Kursi & Penutup
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Pesan tanda kasih/hadiah, peringatan reservasi tempat duduk RSVP, serta salam penutup koki.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Catatan Kotak Tip Dapur (Pemberian Hadiah)
                </label>
                <textarea
                  rows={2}
                  value={kokiForm.catatanKotakTip}
                  onChange={(e) =>
                    setKokiForm({ ...kokiForm, catatanKotakTip: e.target.value })
                  }
                  placeholder="Kehadiran Anda sudah menjadi bumbu utamanya. Namun bila ingin menambah sedikit garam untuk dapur kami kelak..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Catatan Reservasi Kursi Tamu (RSVP)
                </label>
                <textarea
                  rows={2}
                  value={kokiForm.catatanRsvp}
                  onChange={(e) =>
                    setKokiForm({ ...kokiForm, catatanRsvp: e.target.value })
                  }
                  placeholder="Satu kursi kosong membuat satu sajian kembali ke dapur. Beri tahu kami, ya."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Pesan Penutup dari Koki
                </label>
                <textarea
                  rows={2}
                  value={kokiForm.pesanPenutup}
                  onChange={(e) =>
                    setKokiForm({ ...kokiForm, pesanPenutup: e.target.value })
                  }
                  placeholder="Terima kasih telah mencicipi kisah kami dari sajian pertama sampai habis. Pintu dapur kami akan selalu terbuka untuk Anda."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Tagar Pernikahan
                </label>
                <input
                  type="text"
                  value={kokiForm.tagarPernikahan}
                  onChange={(e) =>
                    setKokiForm({ ...kokiForm, tagarPernikahan: e.target.value })
                  }
                  placeholder="#MejaPerjamuanDuaKeluarga"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-amber-800 dark:text-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Tombol Simpan Bawah Template E */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Menyimpan Cerita...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle"></i>
                  <span>Simpan Seluruh Cerita & Alur Meja Sang Koki</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* FORM EDITOR TEMPLATE A (SIMPLE MODERN)                    */}
      {/* ========================================================= */}
      {activeTab === 'A' && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Banner Mode Template A */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/40 flex items-start gap-3">
            <span className="p-2 rounded-lg bg-blue-600 text-white text-sm">
              <i className="fas fa-gem"></i>
            </span>
            <div>
              <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">
                Mode Sunting: Template A - Simple Modern
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300/80 mt-0.5 leading-relaxed">
                Sesuaikan teks pembuka cover, sambutan mempelai, kutipan suci / romantis, sesi akad &amp; resepsi, etiket 3 warna dresscode, kado kasih, serta pesan terima kasih penutup.
              </p>
            </div>
          </div>

          {/* Seksi 1: Cover & Teks Sambutan (Welcome Page) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Cover &amp; Sambutan Pembuka (Welcome Page)</h4>
                <p className="text-xs text-gray-500">Teks yang pertama kali dilihat tamu sebelum membuka undangan</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Judul Pembuka Cover
                </label>
                <input
                  type="text"
                  value={modernForm.welcomeTitle}
                  onChange={(e) =>
                    setModernForm({ ...modernForm, welcomeTitle: e.target.value })
                  }
                  placeholder="The Wedding Of"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Keterangan Tamu (Prefix)
                </label>
                <input
                  type="text"
                  value={modernForm.guestGreetingPrefix}
                  onChange={(e) =>
                    setModernForm({ ...modernForm, guestGreetingPrefix: e.target.value })
                  }
                  placeholder="Kepada Yth Bapak/Ibu/Saudara/i"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Teks Tombol Buka Undangan
                </label>
                <input
                  type="text"
                  value={modernForm.openInvitationText}
                  onChange={(e) =>
                    setModernForm({ ...modernForm, openInvitationText: e.target.value })
                  }
                  placeholder="Open Invitation"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Seksi 2: Beranda & Header (Hero Page) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Beranda &amp; Judul Header (Hero Page)</h4>
                <p className="text-xs text-gray-500">Subtitle dan petunjuk gulir di halaman beranda utama</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Subtitle Judul Beranda
                </label>
                <input
                  type="text"
                  value={modernForm.heroSubtitle}
                  onChange={(e) =>
                    setModernForm({ ...modernForm, heroSubtitle: e.target.value })
                  }
                  placeholder="Undangan Pernikahan"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Petunjuk Gulir Halaman
                </label>
                <input
                  type="text"
                  value={modernForm.scrollDownText}
                  onChange={(e) =>
                    setModernForm({ ...modernForm, scrollDownText: e.target.value })
                  }
                  placeholder="Scroll Down"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Seksi 3: Mempelai & Kalimat Suci Pembuka */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Mempelai &amp; Kalimat Suci Pembuka</h4>
                <p className="text-xs text-gray-500">Salam pembuka Islami/universal dan keterangan silsilah mempelai</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tulisan Arab Pembuka (Basmalah / Kalimat Suci)
                  </label>
                  <input
                    type="text"
                    value={modernForm.salamArab}
                    onChange={(e) =>
                      setModernForm({ ...modernForm, salamArab: e.target.value })
                    }
                    placeholder="بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-arabic text-right text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Salam Pembuka
                  </label>
                  <input
                    type="text"
                    value={modernForm.salamText}
                    onChange={(e) =>
                      setModernForm({ ...modernForm, salamText: e.target.value })
                    }
                    placeholder="Assalamualaikum Warahmatullahi Wabarakatuh"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Kalimat Pengantar Undangan
                </label>
                <textarea
                  rows={2}
                  value={modernForm.pengantarMempelai}
                  onChange={(e) =>
                    setModernForm({ ...modernForm, pengantarMempelai: e.target.value })
                  }
                  placeholder="Tanpa mengurangi rasa hormat, kami mengundang Anda untuk berkenan menghadiri acara pernikahan kami:"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Keterangan Silsilah Mempelai Pria
                  </label>
                  <input
                    type="text"
                    value={modernForm.keteranganAnakPria}
                    onChange={(e) =>
                      setModernForm({ ...modernForm, keteranganAnakPria: e.target.value })
                    }
                    placeholder="Putra pertama dari"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Contoh: Putra pertama dari, Putra tercinta dari</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Keterangan Silsilah Mempelai Wanita
                  </label>
                  <input
                    type="text"
                    value={modernForm.keteranganAnakWanita}
                    onChange={(e) =>
                      setModernForm({ ...modernForm, keteranganAnakWanita: e.target.value })
                    }
                    placeholder="Putri kedua dari"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Contoh: Putri kedua dari, Putri bungsu dari</p>
                </div>
              </div>
            </div>
          </div>

          {/* Seksi 4: Kutipan Romantis / Ayat Suci */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">4</span>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Kutipan Ayat Suci / Cerita Cinta</h4>
                <p className="text-xs text-gray-500">Kutipan indah atau ayat suci yang ditampilkan dalam kartu kutipan berbingkai elegan</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Teks Kutipan / Ayat
                </label>
                <textarea
                  rows={3}
                  value={modernForm.ceritaKutipan}
                  onChange={(e) =>
                    setModernForm({ ...modernForm, ceritaKutipan: e.target.value })
                  }
                  placeholder="Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Sumber Kutipan / Nama Surat
                </label>
                <input
                  type="text"
                  value={modernForm.ceritaSumber}
                  onChange={(e) =>
                    setModernForm({ ...modernForm, ceritaSumber: e.target.value })
                  }
                  placeholder="QS. Ar-Rum: 21"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Seksi 5: Momen Bahagia & Sesi Acara (Akad & Resepsi) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">5</span>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Momen Bahagia &amp; Sesi Acara</h4>
                <p className="text-xs text-gray-500">Judul seksi, pengantar dan label kartu sesi acara</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Judul Seksi Acara
                  </label>
                  <input
                    type="text"
                    value={modernForm.judulMoment}
                    onChange={(e) =>
                      setModernForm({ ...modernForm, judulMoment: e.target.value })
                    }
                    placeholder="Moment Bahagia"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Teks Pengantar Acara
                  </label>
                  <input
                    type="text"
                    value={modernForm.pengantarAcara}
                    onChange={(e) =>
                      setModernForm({ ...modernForm, pengantarAcara: e.target.value })
                    }
                    placeholder="Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, insyaAllah kami akan menyelenggarakan acara:"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Label Sesi Pertama
                  </label>
                  <input
                    type="text"
                    value={modernForm.labelAkad}
                    onChange={(e) =>
                      setModernForm({ ...modernForm, labelAkad: e.target.value })
                    }
                    placeholder="Akad"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Label Sesi Kedua
                  </label>
                  <input
                    type="text"
                    value={modernForm.labelResepsi}
                    onChange={(e) =>
                      setModernForm({ ...modernForm, labelResepsi: e.target.value })
                    }
                    placeholder="Resepsi"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seksi 6: Etiket Busana & Palet 3 Warna (Dresscode) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">6</span>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Etiket Busana &amp; Palet 3 Warna (Dresscode)</h4>
                <p className="text-xs text-gray-500">Panduan busana tamu beserta 3 lingkaran swatch warna yang tampil serasi</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Catatan Pengantar Dresscode
                </label>
                <input
                  type="text"
                  value={modernForm.dresscodeNote}
                  onChange={(e) =>
                    setModernForm({ ...modernForm, dresscodeNote: e.target.value })
                  }
                  placeholder="Demi kehangatan bersama, kami memohon kesediaan Anda untuk mengenakan dress code berikut:"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Palet 3 Warna Busana (Pilih Warna)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {modernForm.dresscodeColors.map((color, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 flex items-center gap-3"
                    >
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => handleModernColorChange(idx, e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600 p-0.5 bg-white"
                      />
                      <div className="flex-1">
                        <span className="text-[11px] font-semibold text-gray-500 block">Warna #{idx + 1}</span>
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => handleModernColorChange(idx, e.target.value)}
                          className="w-full text-xs font-mono font-bold text-gray-900 dark:text-white bg-transparent border-none p-0 focus:outline-none uppercase"
                        />
                      </div>
                      <div
                        className="w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                        style={{ backgroundColor: color }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Deskripsi / Aturan Busana Tamu
                </label>
                <input
                  type="text"
                  value={modernForm.dresscodeText}
                  onChange={(e) =>
                    setModernForm({ ...modernForm, dresscodeText: e.target.value })
                  }
                  placeholder="Busana batik dan bersepatu."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Seksi 7: Tanda Kasih & Hadiah (Love Gift) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">7</span>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Tanda Kasih &amp; Hadiah (Love Gift)</h4>
                <p className="text-xs text-gray-500">Judul dan teks pengantar bagi tamu yang ingin mengirim kado digital / fisik</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Judul Seksi Hadiah
                </label>
                <input
                  type="text"
                  value={modernForm.giftTitle}
                  onChange={(e) =>
                    setModernForm({ ...modernForm, giftTitle: e.target.value })
                  }
                  placeholder="Love Gift"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Pengantar Tanda Kasih
                </label>
                <input
                  type="text"
                  value={modernForm.giftSubtitle}
                  onChange={(e) =>
                    setModernForm({ ...modernForm, giftSubtitle: e.target.value })
                  }
                  placeholder="Dengan hormat, bagi Anda yang ingin memberikan tanda kasih kepada kami, dapat melalui:"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Seksi 8: Ucapan Doa & Penutup (Wishes & Closing) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">8</span>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Ucapan Doa &amp; Penutup (Wishes &amp; Closing)</h4>
                <p className="text-xs text-gray-500">Judul kolom ucapan, salam penutup, dan tagar pernikahan resmi</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Judul Seksi Ucapan
                  </label>
                  <input
                    type="text"
                    value={modernForm.commentTitle}
                    onChange={(e) =>
                      setModernForm({ ...modernForm, commentTitle: e.target.value })
                    }
                    placeholder="Ucapan & Doa"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tagar Pernikahan Resmi (Hashtag)
                  </label>
                  <input
                    type="text"
                    value={modernForm.tagarPernikahan}
                    onChange={(e) =>
                      setModernForm({ ...modernForm, tagarPernikahan: e.target.value })
                    }
                    placeholder="#ModernLoveStory"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Pesan Terima Kasih Penutup
                </label>
                <textarea
                  rows={2}
                  value={modernForm.closingMessage}
                  onChange={(e) =>
                    setModernForm({ ...modernForm, closingMessage: e.target.value })
                  }
                  placeholder="Terima kasih atas perhatian dan doa restu Anda, yang menjadi kebahagiaan serta kehormatan besar bagi kami."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Salam Penutup
                  </label>
                  <input
                    type="text"
                    value={modernForm.closingSalam}
                    onChange={(e) =>
                      setModernForm({ ...modernForm, closingSalam: e.target.value })
                    }
                    placeholder="Wassalamualaikum Warahmatullahi Wabarakatuh"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tulisan Arab Penutup (Hamdalah)
                  </label>
                  <input
                    type="text"
                    value={modernForm.closingHamdalah}
                    onChange={(e) =>
                      setModernForm({ ...modernForm, closingHamdalah: e.target.value })
                    }
                    placeholder="اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-arabic text-right text-base"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Menyimpan Perubahan...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle"></i>
                  <span>Simpan Seluruh Cerita &amp; Alur Simple Modern</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TabCustomContent;
