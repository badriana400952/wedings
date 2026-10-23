/**
 * Konfigurasi Preset Konten Dinamis untuk Seluruh Template Undangan
 * Sumber inspirasi: projek.mereka.md
 */

export interface KirigamiPastelContent {
  // Couple
  keteranganAnakWanita: string; // cth: "Putri kedua dari"
  keteranganAnakPria: string; // cth: "Putra pertama dari"

  // Hero
  heroQuote: string; // cth: "Dua lembar kertas berbeda warna, digunting hati-hati, lalu direkat menjadi satu karya yang utuh."

  // Story (Tiga Guntingan Kisah)
  story1Title: string;
  story1Story: string;
  story1Photo?: string;

  story2Title: string;
  story2Story: string;
  story2Photo?: string;

  story3Title: string;
  story3Story: string;
  story3Photo?: string;

  // Folds (Lipatan Rahasia / Q&A Interaktif)
  secretFolds: Array<{
    pertanyaan: string;
    jawaban: string;
  }>;

  // Events & Venue (Tambahan spesifik jika beda)
  namaAcaraPertama: string;
  namaAcaraKedua: string;
  waktuAcaraKedua: string;
  tempatAcaraKedua: string;
  alamatAcaraKedua: string;

  // Dresscode (Palet Hari Itu)
  dresscodeText: string;
  dresscodeColors: string[]; // 4 warna hex

  // Gifts & Closing
  catatanHadiah: string;
  pesanPenutup: string;
  tagarPernikahan: string;
}

export const DEFAULT_KIRIGAMI_PASTEL: KirigamiPastelContent = {
  keteranganAnakWanita: 'Putri kedua dari',
  keteranganAnakPria: 'Putra pertama dari',

  heroQuote:
    'Dua lembar kertas berbeda warna, digunting hati-hati, lalu direkat menjadi satu karya yang utuh.',

  story1Title: 'Guntingan Pertama',
  story1Story:
    'Kami bertemu di sebuah lokakarya kertas kecil di sudut kota. Ia meminjam gunting, dan sejak itu tidak pernah dikembalikan.',
  story1Photo: '',

  story2Title: 'Lipatan Kedua',
  story2Story:
    'Tiga tahun berjalan bersama, melipat rencana kecil satu per satu hingga membentuk sesuatu yang kokoh.',
  story2Photo: '',

  story3Title: 'Rekatan Terakhir',
  story3Story:
    'Di bawah lampu taman, ia berlutut sambil menyodorkan cincin di dalam kotak kertas buatannya sendiri.',
  story3Photo: '',

  secretFolds: [
    {
      pertanyaan: 'Siapa yang paling sering telat?',
      jawaban: 'Bagas, dengan alasan yang selalu baru dan selalu kreatif.',
    },
    {
      pertanyaan: 'Lagu wajib di mobil?',
      jawaban: 'Playlist yang sama sejak 2021, diputar berulang tanpa pernah bosan.',
    },
    {
      pertanyaan: 'Rencana bulan madu?',
      jawaban: 'Menyusuri pulau kecil, membawa buku, dan tidak membuat jadwal sama sekali.',
    },
  ],

  namaAcaraPertama: 'Akad Nikah',
  namaAcaraKedua: 'Resepsi Pernikahan',
  waktuAcaraKedua: '13:00',
  tempatAcaraKedua: 'Pendopo Kertaraharja',
  alamatAcaraKedua: 'Jl. Melati Putih No. 27, Sleman, Yogyakarta',

  dresscodeText:
    'Kami mengundang Anda mengenakan busana bernuansa pastel lembut agar seluruh momen terasa seperti satu karya kertas yang utuh.',
  dresscodeColors: ['#E8D5C4', '#D0E8D7', '#FAD2E1', '#C5DFF8'],

  catatanHadiah:
    'Kehadiran Anda sudah menjadi hadiah terindah. Namun bila ingin mengirim tanda kasih, silakan konfirmasi melalui formulir di bawah ini.',
  pesanPenutup:
    'Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.',
  tagarPernikahan: '#SatuLembarBerdua',
};

/**
 * Helper untuk mengambil konten Kirigami Pastel dengan fallback default
 */
export function getKirigamiPastelContent(
  customContentJson: any
): KirigamiPastelContent {
  const custom =
    typeof customContentJson === 'object' && customContentJson !== null
      ? (customContentJson.C as Partial<KirigamiPastelContent>) ||
        (customContentJson as Partial<KirigamiPastelContent>)
      : {};

  return {
    keteranganAnakWanita:
      custom.keteranganAnakWanita?.trim() ||
      DEFAULT_KIRIGAMI_PASTEL.keteranganAnakWanita,
    keteranganAnakPria:
      custom.keteranganAnakPria?.trim() ||
      DEFAULT_KIRIGAMI_PASTEL.keteranganAnakPria,

    heroQuote:
      custom.heroQuote?.trim() || DEFAULT_KIRIGAMI_PASTEL.heroQuote,

    story1Title:
      custom.story1Title?.trim() || DEFAULT_KIRIGAMI_PASTEL.story1Title,
    story1Story:
      custom.story1Story?.trim() || DEFAULT_KIRIGAMI_PASTEL.story1Story,
    story1Photo: custom.story1Photo || '',

    story2Title:
      custom.story2Title?.trim() || DEFAULT_KIRIGAMI_PASTEL.story2Title,
    story2Story:
      custom.story2Story?.trim() || DEFAULT_KIRIGAMI_PASTEL.story2Story,
    story2Photo: custom.story2Photo || '',

    story3Title:
      custom.story3Title?.trim() || DEFAULT_KIRIGAMI_PASTEL.story3Title,
    story3Story:
      custom.story3Story?.trim() || DEFAULT_KIRIGAMI_PASTEL.story3Story,
    story3Photo: custom.story3Photo || '',

    secretFolds:
      Array.isArray(custom.secretFolds) && custom.secretFolds.length > 0
        ? custom.secretFolds.map((item, idx) => ({
            pertanyaan:
              item?.pertanyaan?.trim() ||
              DEFAULT_KIRIGAMI_PASTEL.secretFolds[idx]?.pertanyaan ||
              'Pertanyaan',
            jawaban:
              item?.jawaban?.trim() ||
              DEFAULT_KIRIGAMI_PASTEL.secretFolds[idx]?.jawaban ||
              'Jawaban',
          }))
        : DEFAULT_KIRIGAMI_PASTEL.secretFolds,

    namaAcaraPertama:
      custom.namaAcaraPertama?.trim() ||
      DEFAULT_KIRIGAMI_PASTEL.namaAcaraPertama,
    namaAcaraKedua:
      custom.namaAcaraKedua?.trim() || DEFAULT_KIRIGAMI_PASTEL.namaAcaraKedua,
    waktuAcaraKedua:
      custom.waktuAcaraKedua?.trim() || DEFAULT_KIRIGAMI_PASTEL.waktuAcaraKedua,
    tempatAcaraKedua:
      custom.tempatAcaraKedua?.trim() ||
      DEFAULT_KIRIGAMI_PASTEL.tempatAcaraKedua,
    alamatAcaraKedua:
      custom.alamatAcaraKedua?.trim() ||
      DEFAULT_KIRIGAMI_PASTEL.alamatAcaraKedua,

    dresscodeText:
      custom.dresscodeText?.trim() || DEFAULT_KIRIGAMI_PASTEL.dresscodeText,
    dresscodeColors:
      Array.isArray(custom.dresscodeColors) &&
      custom.dresscodeColors.length > 0
        ? custom.dresscodeColors
        : DEFAULT_KIRIGAMI_PASTEL.dresscodeColors,

    catatanHadiah:
      custom.catatanHadiah?.trim() || DEFAULT_KIRIGAMI_PASTEL.catatanHadiah,
    pesanPenutup:
      custom.pesanPenutup?.trim() || DEFAULT_KIRIGAMI_PASTEL.pesanPenutup,
    tagarPernikahan:
      custom.tagarPernikahan?.trim() ||
      DEFAULT_KIRIGAMI_PASTEL.tagarPernikahan,
  };
}

export interface TamanRahasiaContent {
  // Couple & Perawatan Benih
  keteranganAnakWanita: string;
  keteranganAnakPria: string;
  petunjukPerawatanWanita: string;
  petunjukPerawatanPria: string;

  // Hero & Prasasti
  kalimatPembuka: string;
  kutipanPrasasti: string;
  sumberKutipan: string;

  // Musim-Musim Kami (4 Babak Kisah)
  story1Title: string;
  story1Time: string;
  story1Story: string;
  story1Photo?: string;

  story2Title: string;
  story2Time: string;
  story2Story: string;
  story2Photo?: string;

  story3Title: string;
  story3Time: string;
  story3Story: string;
  story3Photo?: string;

  story4Title: string;
  story4Time: string;
  story4Story: string;
  story4Photo?: string;

  // 3 Bunga Pilihan & Artinya
  bungaWanitaNama: string;
  bungaWanitaArti: string;
  bungaWanitaWarna?: string;

  bungaPriaNama: string;
  bungaPriaArti: string;
  bungaPriaWarna?: string;

  bungaBerduaNama: string;
  bungaBerduaArti: string;
  bungaBerduaWarna?: string;

  // Dresscode (5 Warna Busana)
  dresscodeText: string;
  dresscodeColors: string[];

  // Surat Rahasia di Bawah Batu
  suratRahasiaIsi: string;
  suratRahasiaPenutup: string;

  // Hadiah, RSVP, Penutup & Tagar
  catatanHadiah: string;
  catatanRsvp: string;
  pesanPenutup: string;
  tagarPernikahan: string;
}

export const DEFAULT_TAMAN_RAHASIA: TamanRahasiaContent = {
  keteranganAnakWanita: 'Putri kedua dari',
  keteranganAnakPria: 'Putra pertama dari',
  petunjukPerawatanWanita:
    'Siram dengan kopi susu setiap pagi\nPaling mekar saat diajak ke toko buku\nLayu sebentar kalau lupa dipuji',
  petunjukPerawatanPria:
    'Butuh sinar matahari dan sepiring nasi padang\nTumbuh cepat kalau cerita bolanya didengarkan\nTahan segala cuaca, kecuali lapar',

  kalimatPembuka:
    'Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami membuka gerbang taman kecil kami — tempat kisah kami tumbuh — dan mengundangmu untuk turut merayakan hari pernikahan kami.',
  kutipanPrasasti:
    'Cinta tidak tumbuh dalam semalam. Ia ditanam dengan sabar, disiram dengan doa, dan dirawat setiap hari — sampai suatu pagi, ia mekar dan memenuhi seluruh taman.',
  sumberKutipan: 'Catatan kecil di pintu taman kami',

  story1Title: 'Pot yang Tertukar',
  story1Time: 'Maret 2019',
  story1Story:
    'Di sebuah pameran tanaman, Badriana tanpa sengaja membawa pulang pot kaktus milik Nurizzati Islamiyah. Ia mengembalikannya keesokan harinya sambil tersipu — dan kami menghabiskan sore itu membahas cara merawat kaktus yang ternyata sama-sama tidak kami pahami.',
  story1Photo: '',

  story2Title: 'Tumbuh Diam-Diam',
  story2Time: 'Agustus 2020',
  story2Story:
    'Obrolan soal kaktus berubah menjadi kebiasaan: saling mengirim foto tanaman setiap pagi. Tanpa kami sadari, ada sesuatu yang ikut tumbuh di sela pesan-pesan itu, pelan tapi pasti.',
  story2Photo: '',

  story3Title: 'Kuncup di Bawah Hujan',
  story3Time: 'Desember 2025',
  story3Story:
    'Di bawah payung yang terlalu kecil untuk berdua, Badriana bertanya apakah Nurizzati Islamiyah mau merawat taman yang sama seumur hidup. Jawabannya datang lebih cepat dari hujan yang reda: iya.',
  story3Photo: '',

  story4Title: 'Musim Mekar',
  story4Time: 'Musim ini',
  story4Story:
    'Dan kini kami membuka gerbang taman kecil kami untukmu — untuk merayakan musim yang paling lama kami nantikan, bersama orang-orang yang kami sayangi.',
  story4Photo: '',

  bungaWanitaNama: 'Bunga Matahari',
  bungaWanitaArti:
    'Karena kamu selalu jadi arah aku menoleh, bahkan di hari yang paling mendung.',
  bungaWanitaWarna: '#e7b75a',

  bungaPriaNama: 'Melati',
  bungaPriaArti:
    'Sederhana, harum, dan setia — seperti caramu mencintai tanpa perlu banyak kata.',
  bungaPriaWarna: '#ffffff',

  bungaBerduaNama: 'Mawar Merah Muda',
  bungaBerduaArti:
    'Untuk rasa syukur dan kelembutan yang ingin kami jaga di taman rumah tangga kami, setiap hari.',
  bungaBerduaWarna: '#eba6b1',

  dresscodeText:
    'Kami ingin taman kami dipenuhi warna yang senada. Kenakan busana dengan salah satu warna dari palet di bawah ini — yang lembut, seperti kelopak di pagi hari.',
  dresscodeColors: ['#8fa688', '#a8ba9a', '#d9c5b2', '#e8d5c4', '#c98a70'],

  suratRahasiaIsi:
    'Kalau kamu menemukan surat ini, berarti kamu tamu yang teliti — yang mau mengangkat batu berlumut hanya untuk melihat apa yang tersembunyi di bawahnya.\nTerima kasih sudah menjelajah sejauh ini. Datanglah dengan senyum terbaikmu, dan izinkan kami berterima kasih secara langsung.',
  suratRahasiaPenutup: 'Dengan hangat, Nurizzati Islamiyah & Badriana',

  catatanHadiah:
    'Doa restumu adalah bunga terindah di taman kami. Namun jika kamu ingin menitipkan tanda kasih, keranjang kecil ini siap menampungnya.',
  catatanRsvp:
    'Mohon kabari kami paling lambat dua minggu sebelum hari bahagia, ya.',
  pesanPenutup:
    'Terima kasih telah berjalan bersama kami menyusuri taman ini. Kehadiran dan doa restumu adalah bunga paling indah yang akan kami simpan selamanya.',
  tagarPernikahan: '#TamanNurizzatiBadriana',
};

/**
 * Helper untuk mengambil konten Taman Rahasia dengan fallback default
 */
export function getTamanRahasiaContent(
  customContentJson: any
): TamanRahasiaContent {
  const custom =
    typeof customContentJson === 'object' && customContentJson !== null
      ? (customContentJson.B as Partial<TamanRahasiaContent>) ||
        (customContentJson as Partial<TamanRahasiaContent>)
      : {};

  return {
    keteranganAnakWanita:
      custom.keteranganAnakWanita?.trim() ||
      DEFAULT_TAMAN_RAHASIA.keteranganAnakWanita,
    keteranganAnakPria:
      custom.keteranganAnakPria?.trim() ||
      DEFAULT_TAMAN_RAHASIA.keteranganAnakPria,
    petunjukPerawatanWanita:
      custom.petunjukPerawatanWanita !== undefined &&
      custom.petunjukPerawatanWanita !== null
        ? custom.petunjukPerawatanWanita
        : DEFAULT_TAMAN_RAHASIA.petunjukPerawatanWanita,
    petunjukPerawatanPria:
      custom.petunjukPerawatanPria !== undefined &&
      custom.petunjukPerawatanPria !== null
        ? custom.petunjukPerawatanPria
        : DEFAULT_TAMAN_RAHASIA.petunjukPerawatanPria,

    kalimatPembuka:
      custom.kalimatPembuka?.trim() || DEFAULT_TAMAN_RAHASIA.kalimatPembuka,
    kutipanPrasasti:
      custom.kutipanPrasasti?.trim() || DEFAULT_TAMAN_RAHASIA.kutipanPrasasti,
    sumberKutipan:
      custom.sumberKutipan?.trim() || DEFAULT_TAMAN_RAHASIA.sumberKutipan,

    story1Title:
      custom.story1Title?.trim() || DEFAULT_TAMAN_RAHASIA.story1Title,
    story1Time: custom.story1Time?.trim() || DEFAULT_TAMAN_RAHASIA.story1Time,
    story1Story:
      custom.story1Story?.trim() || DEFAULT_TAMAN_RAHASIA.story1Story,
    story1Photo: custom.story1Photo || '',

    story2Title:
      custom.story2Title?.trim() || DEFAULT_TAMAN_RAHASIA.story2Title,
    story2Time: custom.story2Time?.trim() || DEFAULT_TAMAN_RAHASIA.story2Time,
    story2Story:
      custom.story2Story?.trim() || DEFAULT_TAMAN_RAHASIA.story2Story,
    story2Photo: custom.story2Photo || '',

    story3Title:
      custom.story3Title?.trim() || DEFAULT_TAMAN_RAHASIA.story3Title,
    story3Time: custom.story3Time?.trim() || DEFAULT_TAMAN_RAHASIA.story3Time,
    story3Story:
      custom.story3Story?.trim() || DEFAULT_TAMAN_RAHASIA.story3Story,
    story3Photo: custom.story3Photo || '',

    story4Title:
      custom.story4Title?.trim() || DEFAULT_TAMAN_RAHASIA.story4Title,
    story4Time: custom.story4Time?.trim() || DEFAULT_TAMAN_RAHASIA.story4Time,
    story4Story:
      custom.story4Story?.trim() || DEFAULT_TAMAN_RAHASIA.story4Story,
    story4Photo: custom.story4Photo || '',

    bungaWanitaNama:
      custom.bungaWanitaNama?.trim() || DEFAULT_TAMAN_RAHASIA.bungaWanitaNama,
    bungaWanitaArti:
      custom.bungaWanitaArti?.trim() || DEFAULT_TAMAN_RAHASIA.bungaWanitaArti,
    bungaWanitaWarna:
      custom.bungaWanitaWarna || DEFAULT_TAMAN_RAHASIA.bungaWanitaWarna,

    bungaPriaNama:
      custom.bungaPriaNama?.trim() || DEFAULT_TAMAN_RAHASIA.bungaPriaNama,
    bungaPriaArti:
      custom.bungaPriaArti?.trim() || DEFAULT_TAMAN_RAHASIA.bungaPriaArti,
    bungaPriaWarna:
      custom.bungaPriaWarna || DEFAULT_TAMAN_RAHASIA.bungaPriaWarna,

    bungaBerduaNama:
      custom.bungaBerduaNama?.trim() || DEFAULT_TAMAN_RAHASIA.bungaBerduaNama,
    bungaBerduaArti:
      custom.bungaBerduaArti?.trim() || DEFAULT_TAMAN_RAHASIA.bungaBerduaArti,
    bungaBerduaWarna:
      custom.bungaBerduaWarna || DEFAULT_TAMAN_RAHASIA.bungaBerduaWarna,

    dresscodeText:
      custom.dresscodeText?.trim() || DEFAULT_TAMAN_RAHASIA.dresscodeText,
    dresscodeColors:
      Array.isArray(custom.dresscodeColors) &&
      custom.dresscodeColors.length > 0
        ? custom.dresscodeColors
        : DEFAULT_TAMAN_RAHASIA.dresscodeColors,

    suratRahasiaIsi:
      custom.suratRahasiaIsi !== undefined && custom.suratRahasiaIsi !== null
        ? custom.suratRahasiaIsi
        : DEFAULT_TAMAN_RAHASIA.suratRahasiaIsi,
    suratRahasiaPenutup:
      custom.suratRahasiaPenutup?.trim() ||
      DEFAULT_TAMAN_RAHASIA.suratRahasiaPenutup,

    catatanHadiah:
      custom.catatanHadiah?.trim() || DEFAULT_TAMAN_RAHASIA.catatanHadiah,
    catatanRsvp:
      custom.catatanRsvp?.trim() || DEFAULT_TAMAN_RAHASIA.catatanRsvp,
    pesanPenutup:
      custom.pesanPenutup?.trim() || DEFAULT_TAMAN_RAHASIA.pesanPenutup,
    tagarPernikahan:
      custom.tagarPernikahan?.trim() || DEFAULT_TAMAN_RAHASIA.tagarPernikahan,
  };
}

export interface TumbuhBersamaContent {
  // Couple: Silsilah & Tanah Asal
  keteranganAnakWanita: string;
  keteranganAnakPria: string;
  kotaAsalWanita: string;
  kotaAsalPria: string;
  sifatTanahWanita: string;
  sifatTanahPria: string;
  suburSaatWanita: string;
  suburSaatPria: string;

  // Cover & Hero
  tulisanPaketBenih: string;
  heroHeadline: string;
  salamPembuka: string;
  kataPengantar: string;
  kutipanAyat: string;
  sumberKutipan: string;

  // Inoskulasi (Sentuhan Pertama & Dua Pohon Menyatu)
  tglPertamaBertemu: string;
  tempatPertamaBertemu: string;
  ceritaSentuhanPertama: string;
  kalimatDuaPohonMenyatu: string;

  // Story: Kisah 4 Musim
  story1Title: string;
  story1Time: string;
  story1Story: string;
  story1Photo?: string;

  story2Title: string;
  story2Time: string;
  story2Story: string;
  story2Photo?: string;

  story3Title: string;
  story3Time: string;
  story3Story: string;
  story3Photo?: string;

  story4Title: string;
  story4Time: string;
  story4Story: string;
  story4Photo?: string;

  keteranganGaleri: string;

  // Daun Gugur (6 Pasang)
  daunGugur: Array<{
    dilepaskan: string;
    tumbuh: string;
  }>;

  // Lingkaran Tahun (5 Fase)
  lingkaranTahun: Array<{
    tahun: string;
    catatan: string;
  }>;

  // Dresscode (5 Warna Busana)
  dresscodeText: string;
  dresscodeColors: string[];

  // Petunjuk Kebun (6 Aturan)
  petunjukKebun: Array<{
    judul: string;
    keterangan: string;
  }>;

  // Pohon Harapan (Nanti - 4 Harapan)
  harapanNanti: Array<{
    tahunKe: string;
    isiHarapan: string;
  }>;

  // Penutup, Hadiah, RSVP & Tagar
  catatanHadiah: string;
  catatanRsvp: string;
  keteranganUcapan: string;
  kalimatPenutup: string;
  salamPenutup: string;
  namaKeluarga: string;
  turutMengundang: string;
  tagarPernikahan: string;
}

export const DEFAULT_TUMBUH_BERSAMA: TumbuhBersamaContent = {
  keteranganAnakWanita: 'Putri kedua dari',
  keteranganAnakPria: 'Putra pertama dari',
  kotaAsalWanita: 'Wonosobo',
  kotaAsalPria: 'Balikpapan',
  sifatTanahWanita: 'vulkanik, sejuk, dan gembur',
  sifatTanahPria: 'merah, hangat, dan tahan kemarau',
  suburSaatWanita: 'hujan sore, ditemani segelas wedang jahe',
  suburSaatPria: 'matahari pagi, sesudah kopi pertama',

  tulisanPaketBenih: 'Dua benih, satu musim tanam.',
  heroHeadline: 'Tumbuh bersama, musim demi musim.',
  salamPembuka: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
  kataPengantar:
    'Dengan memohon rahmat dan rida Allah Swt., kami bermaksud menyelenggarakan pernikahan kami. Seperti benih yang membutuhkan tanah, air, dan cahaya untuk tumbuh, kami membutuhkan doa restu Bapak/Ibu/Saudara/i untuk memulai musim yang baru ini.',
  kutipanAyat:
    'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan-pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.',
  sumberKutipan: 'QS. Ar-Rum: 21',

  tglPertamaBertemu: '13/04/2019',
  tempatPertamaBertemu: 'Lereng Merapi, di hari relawan menanam pohon',
  ceritaSentuhanPertama:
    'Ia menggali lubang, aku memegang bibitnya. Kami menanam sebelas pohon hari itu, dan pulang membawa nomor telepon masing-masing.',
  kalimatDuaPohonMenyatu:
    'Dua batang, satu tajuk. Akar kami tetap dua—membawa tanah asal masing-masing—tapi mulai hari ini, yang mengalir di antara kami adalah satu.',

  story1Title: 'Musim tunas pertama',
  story1Time: 'April 2019',
  story1Story:
    'Kami bertemu di lereng Merapi, di antara bibit-bibit mahoni. Obrolan pertama kami tentang kenapa daun muda warnanya lebih terang. Sejak itu, kami selalu punya alasan untuk bertemu lagi.',
  story1Photo: '',

  story2Title: 'Musim yang rimbun',
  story2Time: '2020 – 2022',
  story2Story:
    'Tahun-tahun yang hangat: skripsi, pekerjaan pertama, dan ratusan perjalanan motor ke pasar kembang. Kami tumbuh cepat—kadang terlalu cepat—dan belajar saling memberi ruang.',
  story2Photo: '',

  story3Title: 'Musim melepas',
  story3Time: '2023',
  story3Story:
    'Bumi pindah kerja ke Balikpapan. Ada yang harus kami lepas: temu setiap akhir pekan, rencana-rencana kecil, dan gengsi. Yang tertinggal justru yang paling penting.',
  story3Photo: '',

  story4Title: 'Musim mengakar',
  story4Time: 'Desember 2025',
  story4Story:
    'Di musim yang paling sunyi, akar tumbuh paling dalam. Di bawah hujan Desember, Bumi bertanya, dan Asri menjawab ya—sambil menahan tawa karena cincinnya kebesaran.',
  story4Photo: '',

  keteranganGaleri:
    'Setiap foto adalah spesimen dari satu musim yang pernah kami lewati.',

  daunGugur: [
    {
      dilepaskan: 'Gengsi untuk minta maaf duluan',
      tumbuh: 'Kebiasaan bilang "maaf, aku salah"',
    },
    {
      dilepaskan: 'Rencana hidup versi sendirian',
      tumbuh: 'Rencana yang ditulis berdua, pakai pensil',
    },
    {
      dilepaskan: 'Keinginan untuk selalu menang',
      tumbuh: 'Senang mengalah, sesekali',
    },
    {
      dilepaskan: 'Takut terlihat rapuh',
      tumbuh: 'Berani bercerita apa adanya',
    },
    {
      dilepaskan: 'Jam tidur yang berantakan',
      tumbuh: 'Sarapan bersama setiap pagi',
    },
    {
      dilepaskan: 'Kata "aku" yang terlalu sering',
      tumbuh: 'Kata "kita"',
    },
  ],

  lingkaranTahun: [
    {
      tahun: '2019',
      catatan: 'Lingkaran pertama. Tipis, karena kami masih saling mengira-ngira.',
    },
    {
      tahun: '2020',
      catatan: 'Tahun yang sempit untuk semua orang. Lingkaran kami ikut tipis, tapi tidak putus.',
    },
    {
      tahun: '2022',
      catatan: 'Lingkaran paling lebar: tahun penuh hujan, tawa, dan perjalanan ke pasar kembang.',
    },
    {
      tahun: '2023',
      catatan: 'Ada garis gelap di sini—tahun jarak jauh. Kayu yang tumbuh di tahun sulit justru paling padat.',
    },
    {
      tahun: '2025',
      catatan: 'Tahun lamaran. Cincin pertama yang bukan dari kayu.',
    },
  ],

  dresscodeText:
    'Kami mengundang Anda mengenakan warna-warna musim semi: hijau daun muda, merah muda kelopak, dan krem tanah. Batik dan kebaya sangat dipersilakan.',
  dresscodeColors: ['#7a9a60', '#a3b899', '#f0c6c6', '#d9c5b2', '#8c6d58'],

  petunjukKebun: [
    {
      judul: 'Waktu tanam terbaik',
      keterangan: 'Datanglah 30 menit sebelum acara dimulai, supaya bisa menyaksikan akad dengan tenang.',
    },
    {
      judul: 'Jarak tanam',
      keterangan: 'Parkir mobil di halaman timur, motor di sisi utara. Petugas berpakaian hijau siap membantu.',
    },
    {
      judul: 'Kawan tanam',
      keterangan: 'Anak-anak sangat dipersilakan. Kami menyiapkan pojok kecil untuk menanam bibit bersama mereka.',
    },
    {
      judul: 'Sinar matahari',
      keterangan: 'Sebagian acara berlangsung di taman terbuka. Topi dan alas kaki yang nyaman akan sangat membantu.',
    },
    {
      judul: 'Penyiraman',
      keterangan: 'Air minum tersedia di setiap sudut. Bawalah botol minum sendiri untuk mengurangi sampah plastik.',
    },
    {
      judul: 'Hama yang dihindari',
      keterangan: 'Mohon aktifkan mode senyap pada ponsel selama akad berlangsung.',
    },
  ],

  harapanNanti: [
    {
      tahunKe: '1',
      isiHarapan: 'Rumah kecil dengan jendela menghadap timur, supaya pagi selalu masuk lebih dulu.',
    },
    {
      tahunKe: '5',
      isiHarapan: 'Ayunan di dahan paling rendah, dan kebun sayur yang separuhnya dimakan ulat.',
    },
    {
      tahunKe: '25',
      isiHarapan: 'Pernikahan perak. Masih berebut selimut, masih saling menunggu pulang.',
    },
    {
      tahunKe: '50',
      isiHarapan: 'Pernikahan emas. Bangku yang sama, pohon yang sama, dan tangan yang masih saling mencari.',
    },
  ],

  catatanHadiah:
    'Doa dan kehadiran Anda adalah hadiah terbaik. Namun bila Anda ingin ikut menyiram musim baru kami dengan tanda kasih, kami menerimanya dengan sepenuh hati.',
  catatanRsvp: 'Setiap tamu yang datang adalah satu bibit baru di kebun kami.',
  keteranganUcapan: 'Tanamkan doamu di sini. Kami akan merawatnya lama sekali.',
  kalimatPenutup:
    'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Terima kasih telah menjadi bagian dari musim-musim kami.',
  salamPenutup: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
  namaKeluarga:
    'Keluarga Besar Bapak Sugeng Riyadi & Keluarga Besar Bapak Hendro Wicaksono',
  turutMengundang:
    'Keluarga besar Riyadi di Wonosobo\nKeluarga besar Wicaksono di Balikpapan\nRekan-rekan Relawan Seribu Pohon',
  tagarPernikahan: '#AsriBumiTumbuhBersama',
};

/**
 * Helper untuk mengambil konten Tumbuh Bersama dengan fallback default
 */
export function getTumbuhBersamaContent(
  customContentJson: any
): TumbuhBersamaContent {
  const custom =
    typeof customContentJson === 'object' && customContentJson !== null
      ? (customContentJson.D as Partial<TumbuhBersamaContent>) ||
        (customContentJson as Partial<TumbuhBersamaContent>)
      : {};

  return {
    keteranganAnakWanita:
      custom.keteranganAnakWanita?.trim() ||
      DEFAULT_TUMBUH_BERSAMA.keteranganAnakWanita,
    keteranganAnakPria:
      custom.keteranganAnakPria?.trim() ||
      DEFAULT_TUMBUH_BERSAMA.keteranganAnakPria,
    kotaAsalWanita:
      custom.kotaAsalWanita?.trim() || DEFAULT_TUMBUH_BERSAMA.kotaAsalWanita,
    kotaAsalPria:
      custom.kotaAsalPria?.trim() || DEFAULT_TUMBUH_BERSAMA.kotaAsalPria,
    sifatTanahWanita:
      custom.sifatTanahWanita?.trim() ||
      DEFAULT_TUMBUH_BERSAMA.sifatTanahWanita,
    sifatTanahPria:
      custom.sifatTanahPria?.trim() || DEFAULT_TUMBUH_BERSAMA.sifatTanahPria,
    suburSaatWanita:
      custom.suburSaatWanita?.trim() ||
      DEFAULT_TUMBUH_BERSAMA.suburSaatWanita,
    suburSaatPria:
      custom.suburSaatPria?.trim() || DEFAULT_TUMBUH_BERSAMA.suburSaatPria,

    tulisanPaketBenih:
      custom.tulisanPaketBenih?.trim() ||
      DEFAULT_TUMBUH_BERSAMA.tulisanPaketBenih,
    heroHeadline:
      custom.heroHeadline?.trim() || DEFAULT_TUMBUH_BERSAMA.heroHeadline,
    salamPembuka:
      custom.salamPembuka?.trim() || DEFAULT_TUMBUH_BERSAMA.salamPembuka,
    kataPengantar:
      custom.kataPengantar?.trim() || DEFAULT_TUMBUH_BERSAMA.kataPengantar,
    kutipanAyat:
      custom.kutipanAyat?.trim() || DEFAULT_TUMBUH_BERSAMA.kutipanAyat,
    sumberKutipan:
      custom.sumberKutipan?.trim() || DEFAULT_TUMBUH_BERSAMA.sumberKutipan,

    tglPertamaBertemu:
      custom.tglPertamaBertemu?.trim() ||
      DEFAULT_TUMBUH_BERSAMA.tglPertamaBertemu,
    tempatPertamaBertemu:
      custom.tempatPertamaBertemu?.trim() ||
      DEFAULT_TUMBUH_BERSAMA.tempatPertamaBertemu,
    ceritaSentuhanPertama:
      custom.ceritaSentuhanPertama?.trim() ||
      DEFAULT_TUMBUH_BERSAMA.ceritaSentuhanPertama,
    kalimatDuaPohonMenyatu:
      custom.kalimatDuaPohonMenyatu?.trim() ||
      DEFAULT_TUMBUH_BERSAMA.kalimatDuaPohonMenyatu,

    story1Title:
      custom.story1Title?.trim() || DEFAULT_TUMBUH_BERSAMA.story1Title,
    story1Time: custom.story1Time?.trim() || DEFAULT_TUMBUH_BERSAMA.story1Time,
    story1Story:
      custom.story1Story?.trim() || DEFAULT_TUMBUH_BERSAMA.story1Story,
    story1Photo: custom.story1Photo || '',

    story2Title:
      custom.story2Title?.trim() || DEFAULT_TUMBUH_BERSAMA.story2Title,
    story2Time: custom.story2Time?.trim() || DEFAULT_TUMBUH_BERSAMA.story2Time,
    story2Story:
      custom.story2Story?.trim() || DEFAULT_TUMBUH_BERSAMA.story2Story,
    story2Photo: custom.story2Photo || '',

    story3Title:
      custom.story3Title?.trim() || DEFAULT_TUMBUH_BERSAMA.story3Title,
    story3Time: custom.story3Time?.trim() || DEFAULT_TUMBUH_BERSAMA.story3Time,
    story3Story:
      custom.story3Story?.trim() || DEFAULT_TUMBUH_BERSAMA.story3Story,
    story3Photo: custom.story3Photo || '',

    story4Title:
      custom.story4Title?.trim() || DEFAULT_TUMBUH_BERSAMA.story4Title,
    story4Time: custom.story4Time?.trim() || DEFAULT_TUMBUH_BERSAMA.story4Time,
    story4Story:
      custom.story4Story?.trim() || DEFAULT_TUMBUH_BERSAMA.story4Story,
    story4Photo: custom.story4Photo || '',

    keteranganGaleri:
      custom.keteranganGaleri?.trim() ||
      DEFAULT_TUMBUH_BERSAMA.keteranganGaleri,

    daunGugur:
      Array.isArray(custom.daunGugur) && custom.daunGugur.length > 0
        ? custom.daunGugur.map((item, idx) => ({
            dilepaskan:
              item?.dilepaskan?.trim() ||
              DEFAULT_TUMBUH_BERSAMA.daunGugur[idx]?.dilepaskan ||
              '',
            tumbuh:
              item?.tumbuh?.trim() ||
              DEFAULT_TUMBUH_BERSAMA.daunGugur[idx]?.tumbuh ||
              '',
          }))
        : DEFAULT_TUMBUH_BERSAMA.daunGugur,

    lingkaranTahun:
      Array.isArray(custom.lingkaranTahun) && custom.lingkaranTahun.length > 0
        ? custom.lingkaranTahun.map((item, idx) => ({
            tahun:
              item?.tahun?.trim() ||
              DEFAULT_TUMBUH_BERSAMA.lingkaranTahun[idx]?.tahun ||
              '',
            catatan:
              item?.catatan?.trim() ||
              DEFAULT_TUMBUH_BERSAMA.lingkaranTahun[idx]?.catatan ||
              '',
          }))
        : DEFAULT_TUMBUH_BERSAMA.lingkaranTahun,

    dresscodeText:
      custom.dresscodeText?.trim() || DEFAULT_TUMBUH_BERSAMA.dresscodeText,
    dresscodeColors:
      Array.isArray(custom.dresscodeColors) &&
      custom.dresscodeColors.length > 0
        ? custom.dresscodeColors
        : DEFAULT_TUMBUH_BERSAMA.dresscodeColors,

    petunjukKebun:
      Array.isArray(custom.petunjukKebun) && custom.petunjukKebun.length > 0
        ? custom.petunjukKebun.map((item, idx) => ({
            judul:
              item?.judul?.trim() ||
              DEFAULT_TUMBUH_BERSAMA.petunjukKebun[idx]?.judul ||
              '',
            keterangan:
              item?.keterangan?.trim() ||
              DEFAULT_TUMBUH_BERSAMA.petunjukKebun[idx]?.keterangan ||
              '',
          }))
        : DEFAULT_TUMBUH_BERSAMA.petunjukKebun,

    harapanNanti:
      Array.isArray(custom.harapanNanti) && custom.harapanNanti.length > 0
        ? custom.harapanNanti.map((item, idx) => ({
            tahunKe:
              item?.tahunKe?.trim() ||
              DEFAULT_TUMBUH_BERSAMA.harapanNanti[idx]?.tahunKe ||
              '',
            isiHarapan:
              item?.isiHarapan?.trim() ||
              DEFAULT_TUMBUH_BERSAMA.harapanNanti[idx]?.isiHarapan ||
              '',
          }))
        : DEFAULT_TUMBUH_BERSAMA.harapanNanti,

    catatanHadiah:
      custom.catatanHadiah?.trim() || DEFAULT_TUMBUH_BERSAMA.catatanHadiah,
    catatanRsvp:
      custom.catatanRsvp?.trim() || DEFAULT_TUMBUH_BERSAMA.catatanRsvp,
    keteranganUcapan:
      custom.keteranganUcapan?.trim() ||
      DEFAULT_TUMBUH_BERSAMA.keteranganUcapan,
    kalimatPenutup:
      custom.kalimatPenutup?.trim() || DEFAULT_TUMBUH_BERSAMA.kalimatPenutup,
    salamPenutup:
      custom.salamPenutup?.trim() || DEFAULT_TUMBUH_BERSAMA.salamPenutup,
    namaKeluarga:
      custom.namaKeluarga?.trim() || DEFAULT_TUMBUH_BERSAMA.namaKeluarga,
    turutMengundang:
      custom.turutMengundang !== undefined && custom.turutMengundang !== null
        ? custom.turutMengundang
        : DEFAULT_TUMBUH_BERSAMA.turutMengundang,
    tagarPernikahan:
      custom.tagarPernikahan?.trim() ||
      DEFAULT_TUMBUH_BERSAMA.tagarPernikahan,
  };
}

export interface MejaKokiContent {
  // 1. Cover & Hero & Dapur
  edisiMenu: string;
  kutipanPembuka: string;
  catatanDapur: string;

  // 2. Mempelai (Dua Bahan Utama)
  keteranganAnakWanita: string;
  keteranganAnakPria: string;
  catatanBahanPria: string;
  catatanBahanWanita: string;

  // 3. Menu Degustasi (4 Babak Kisah)
  course1Title: string;
  course1Pairing: string;
  course1Story: string;
  course1Photo?: string;

  course2Title: string;
  course2Pairing: string;
  course2Story: string;
  course2Photo?: string;

  course3Title: string;
  course3Pairing: string;
  course3Story: string;
  course3Photo?: string;

  course4Title: string;
  course4Pairing: string;
  course4Story: string;
  course4Photo?: string;

  // 4. Resep Rumah Tangga Bahagia
  resepJudul: string;
  resepPorsi: string;
  resepBahan: string;
  resepCaraMasak: string;

  // 5. Uji Rasa Tamu (4 Sajian Rasa)
  ujiManisNama: string;
  ujiManisCatatan: string;

  ujiGurihNama: string;
  ujiGurihCatatan: string;

  ujiPedasNama: string;
  ujiPedasCatatan: string;

  ujiSegarNama: string;
  ujiSegarCatatan: string;

  // 6. Etiket Busana (3 Swatch Warna)
  dresscodeText: string;
  dresscodeColors: string[];

  // 7. Kotak Tip, RSVP, & Penutup
  catatanKotakTip: string;
  catatanRsvp: string;
  pesanPenutup: string;
  tagarPernikahan: string;
}

export const DEFAULT_MEJA_KOKI: MejaKokiContent = {
  edisiMenu: 'Edisi Panen Juni — Meja No. 01',
  kutipanPembuka:
    'Cinta yang baik seperti kaldu yang ditunggu semalaman: ia tidak bisa diburu, hanya bisa dijaga apinya.',
  catatanDapur:
    'Selamat datang di meja kami. Malam ini dapur tidak menyajikan apa-apa yang mewah, hanya satu kisah yang dimasak perlahan sejak 2019 — dan Anda adalah tamu yang kami tunggu untuk mencicipinya.',

  keteranganAnakWanita: 'Putri kedua dari',
  keteranganAnakPria: 'Putra pertama dari',
  catatanBahanPria:
    'Dipetik dari Yogyakarta, 1994 — bertugas menjaga api tetap menyala',
  catatanBahanWanita:
    'Dipetik dari Bandung, 1996 — bertugas menyeimbangkan setiap rasa',

  course1Title: 'Amuse-Bouche: Kopi Tumpah',
  course1Pairing: 'Dipadukan dengan kopi susu gula aren, 2019',
  course1Story:
    'Pertemuan pertama di kedai kecil dekat kantor. Satu gelas tumpah, satu permintaan maaf yang kepanjangan, dan nomor telepon yang ditulis di selembar tisu.',
  course1Photo: '',

  course2Title: 'Pembuka: Salad Musim Hujan',
  course2Pairing: 'Dipadukan dengan teh melati hangat, 2021',
  course2Story:
    'Dua tahun saling mengenal rasa. Kami belajar bahwa pahit pun perlu, asal selalu ada yang menyeimbangkan dengan manis.',
  course2Photo: '',

  course3Title: 'Utama: Rendang Sabar',
  course3Pairing: 'Dipadukan dengan restu dua keluarga, 2024',
  course3Story:
    'Dimasak delapan jam di atas api kecil. Kami bertemu keluarga, bertukar restu, dan menyadari bahwa rasa terbaik memang selalu butuh waktu.',
  course3Photo: '',

  course4Title: 'Penutup: Puding Janji',
  course4Pairing: 'Dipadukan dengan satu kata: iya, 2026',
  course4Story:
    'Manis yang paling ditunggu. Ia berlutut di dapur, di antara wangi vanila, dan bertanya apakah kami boleh memasak bersama seumur hidup.',
  course4Photo: '',

  resepJudul: 'Resep Rumah Tangga Bahagia',
  resepPorsi: 'Untuk 2 porsi — disajikan seumur hidup',
  resepBahan:
    '200 gram kesabaran, disaring halus\n3 sendok makan tawa sebelum tidur\n1 genggam maaf yang tidak ditunda\n1 batang kejujuran, memarkan\nSecukupnya doa dari kedua keluarga\nSejumput rindu untuk hari-hari sibuk',
  resepCaraMasak:
    'Panaskan niat di atas api kecil, jangan terburu-buru.\nMasukkan kesabaran, aduk searah sampai harum.\nTuang tawa sedikit demi sedikit agar tidak pecah.\nBumbui dengan maaf setiap kali terasa gosong.\nSajikan hangat setiap hari, untuk berdua.',

  ujiManisNama: 'Klapertart Pengantin',
  ujiManisCatatan:
    'Untuk Anda yang percaya bahwa akhir bahagia memang harus manis. Satu porsi sudah kami sisihkan di meja Anda.',

  ujiGurihNama: 'Sup Iga Restu',
  ujiGurihCatatan:
    'Hangat, dalam, dan selalu ditunggu. Cocok untuk tamu yang datang membawa pelukan lebih dulu.',

  ujiPedasNama: 'Sambal Matah Nekat',
  ujiPedasCatatan:
    'Berani, jujur, sedikit membuat mata berair — persis seperti keputusan kami untuk menikah.',

  ujiSegarNama: 'Es Serbat Kemangi',
  ujiSegarCatatan:
    'Ringan dan menenangkan, untuk tamu yang membawa kabar baik dan cerita yang enteng.',

  dresscodeText:
    'Kami menata meja dengan nuansa hangat. Mohon hadir dengan busana rapi bernuansa hijau zaitun, kuningan, dan krem — agar setiap foto terasa seperti satu piring yang selaras.',
  dresscodeColors: ['#3f4a38', '#c69a4e', '#efe3cd'],

  catatanKotakTip:
    'Kehadiran Anda sudah menjadi bumbu utamanya. Namun bila ingin menambah sedikit garam untuk dapur kami kelak, kotak tip ini kami sediakan dengan senang hati.',
  catatanRsvp:
    'Satu kursi kosong membuat satu sajian kembali ke dapur. Beri tahu kami, ya.',
  pesanPenutup:
    'Terima kasih telah mencicipi kisah kami dari sajian pertama sampai habis. Pintu dapur kami akan selalu terbuka untuk Anda.',
  tagarPernikahan: '#MejaPerjamuanDuaKeluarga',
};

export function getMejaKokiContent(customContentJson: any): MejaKokiContent {
  const custom =
    typeof customContentJson === 'object' && customContentJson !== null
      ? (customContentJson.E as Partial<MejaKokiContent>) ||
        (customContentJson as Partial<MejaKokiContent>)
      : {};

  return {
    edisiMenu: custom.edisiMenu?.trim() || DEFAULT_MEJA_KOKI.edisiMenu,
    kutipanPembuka:
      custom.kutipanPembuka?.trim() || DEFAULT_MEJA_KOKI.kutipanPembuka,
    catatanDapur: custom.catatanDapur?.trim() || DEFAULT_MEJA_KOKI.catatanDapur,

    keteranganAnakWanita:
      custom.keteranganAnakWanita?.trim() ||
      DEFAULT_MEJA_KOKI.keteranganAnakWanita,
    keteranganAnakPria:
      custom.keteranganAnakPria?.trim() || DEFAULT_MEJA_KOKI.keteranganAnakPria,
    catatanBahanPria:
      custom.catatanBahanPria?.trim() || DEFAULT_MEJA_KOKI.catatanBahanPria,
    catatanBahanWanita:
      custom.catatanBahanWanita?.trim() || DEFAULT_MEJA_KOKI.catatanBahanWanita,

    course1Title:
      custom.course1Title?.trim() || DEFAULT_MEJA_KOKI.course1Title,
    course1Pairing:
      custom.course1Pairing?.trim() || DEFAULT_MEJA_KOKI.course1Pairing,
    course1Story:
      custom.course1Story?.trim() || DEFAULT_MEJA_KOKI.course1Story,
    course1Photo: custom.course1Photo || '',

    course2Title:
      custom.course2Title?.trim() || DEFAULT_MEJA_KOKI.course2Title,
    course2Pairing:
      custom.course2Pairing?.trim() || DEFAULT_MEJA_KOKI.course2Pairing,
    course2Story:
      custom.course2Story?.trim() || DEFAULT_MEJA_KOKI.course2Story,
    course2Photo: custom.course2Photo || '',

    course3Title:
      custom.course3Title?.trim() || DEFAULT_MEJA_KOKI.course3Title,
    course3Pairing:
      custom.course3Pairing?.trim() || DEFAULT_MEJA_KOKI.course3Pairing,
    course3Story:
      custom.course3Story?.trim() || DEFAULT_MEJA_KOKI.course3Story,
    course3Photo: custom.course3Photo || '',

    course4Title:
      custom.course4Title?.trim() || DEFAULT_MEJA_KOKI.course4Title,
    course4Pairing:
      custom.course4Pairing?.trim() || DEFAULT_MEJA_KOKI.course4Pairing,
    course4Story:
      custom.course4Story?.trim() || DEFAULT_MEJA_KOKI.course4Story,
    course4Photo: custom.course4Photo || '',

    resepJudul: custom.resepJudul?.trim() || DEFAULT_MEJA_KOKI.resepJudul,
    resepPorsi: custom.resepPorsi?.trim() || DEFAULT_MEJA_KOKI.resepPorsi,
    resepBahan:
      custom.resepBahan !== undefined && custom.resepBahan !== null
        ? custom.resepBahan
        : DEFAULT_MEJA_KOKI.resepBahan,
    resepCaraMasak:
      custom.resepCaraMasak !== undefined && custom.resepCaraMasak !== null
        ? custom.resepCaraMasak
        : DEFAULT_MEJA_KOKI.resepCaraMasak,

    ujiManisNama:
      custom.ujiManisNama?.trim() || DEFAULT_MEJA_KOKI.ujiManisNama,
    ujiManisCatatan:
      custom.ujiManisCatatan?.trim() || DEFAULT_MEJA_KOKI.ujiManisCatatan,

    ujiGurihNama:
      custom.ujiGurihNama?.trim() || DEFAULT_MEJA_KOKI.ujiGurihNama,
    ujiGurihCatatan:
      custom.ujiGurihCatatan?.trim() || DEFAULT_MEJA_KOKI.ujiGurihCatatan,

    ujiPedasNama:
      custom.ujiPedasNama?.trim() || DEFAULT_MEJA_KOKI.ujiPedasNama,
    ujiPedasCatatan:
      custom.ujiPedasCatatan?.trim() || DEFAULT_MEJA_KOKI.ujiPedasCatatan,

    ujiSegarNama:
      custom.ujiSegarNama?.trim() || DEFAULT_MEJA_KOKI.ujiSegarNama,
    ujiSegarCatatan:
      custom.ujiSegarCatatan?.trim() || DEFAULT_MEJA_KOKI.ujiSegarCatatan,

    dresscodeText:
      custom.dresscodeText?.trim() || DEFAULT_MEJA_KOKI.dresscodeText,
    dresscodeColors:
      Array.isArray(custom.dresscodeColors) &&
      custom.dresscodeColors.length > 0
        ? custom.dresscodeColors
        : DEFAULT_MEJA_KOKI.dresscodeColors,

    catatanKotakTip:
      custom.catatanKotakTip?.trim() || DEFAULT_MEJA_KOKI.catatanKotakTip,
    catatanRsvp:
      custom.catatanRsvp?.trim() || DEFAULT_MEJA_KOKI.catatanRsvp,
    pesanPenutup:
      custom.pesanPenutup?.trim() || DEFAULT_MEJA_KOKI.pesanPenutup,
    tagarPernikahan:
      custom.tagarPernikahan?.trim() || DEFAULT_MEJA_KOKI.tagarPernikahan,
  };
}

// ============================================================================
// TEMPLATE A: SIMPLE MODERN
// ============================================================================

export interface SimpleModernContent {
  // 1. Cover & Welcome
  welcomeTitle: string;
  guestGreetingPrefix: string;
  openInvitationText: string;

  // 2. Hero & Home
  heroSubtitle: string;
  scrollDownText: string;

  // 3. Mempelai (Couple)
  salamArab: string;
  salamText: string;
  pengantarMempelai: string;
  keteranganAnakPria: string;
  keteranganAnakWanita: string;

  // 4. Moment Bahagia (Events & Countdown)
  judulMoment: string;
  pengantarAcara: string;
  labelAkad: string;
  labelResepsi: string;

  // 5. Dresscode & Palet Warna
  dresscodeNote: string;
  dresscodeColors: string[];
  dresscodeText: string;

  // 6. Kisah Cerita Cinta & Ayat Suci (Quote)
  ceritaKutipan: string;
  ceritaSumber: string;

  // 7. Love Gift & Tanda Kasih
  giftTitle: string;
  giftSubtitle: string;

  // 8. Ucapan, Doa & Penutup
  commentTitle: string;
  closingMessage: string;
  closingSalam: string;
  closingHamdalah: string;
  tagarPernikahan: string;
}

export const DEFAULT_SIMPLE_MODERN: SimpleModernContent = {
  welcomeTitle: 'The Wedding Of',
  guestGreetingPrefix: 'Kepada Yth Bapak/Ibu/Saudara/i',
  openInvitationText: 'Open Invitation',

  heroSubtitle: 'Undangan Pernikahan',
  scrollDownText: 'Scroll Down',

  salamArab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
  salamText: 'Assalamualaikum Warahmatullahi Wabarakatuh',
  pengantarMempelai: 'Tanpa mengurangi rasa hormat, kami mengundang Anda untuk berkenan menghadiri acara pernikahan kami:',
  keteranganAnakPria: 'Putra pertama dari',
  keteranganAnakWanita: 'Putri kedua dari',

  judulMoment: 'Moment Bahagia',
  pengantarAcara: "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, insyaAllah kami akan menyelenggarakan acara:",
  labelAkad: 'Akad',
  labelResepsi: 'Resepsi',

  dresscodeNote: 'Demi kehangatan bersama, kami memohon kesediaan Anda untuk mengenakan dress code berikut:',
  dresscodeColors: ['#FFFFFF', '#06b6d4', '#22c55e'],
  dresscodeText: 'Busana batik dan bersepatu.',

  ceritaKutipan: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
  ceritaSumber: 'QS. Ar-Rum: 21',

  giftTitle: 'Love Gift',
  giftSubtitle: 'Dengan hormat, bagi Anda yang ingin memberikan tanda kasih kepada kami, dapat melalui:',

  commentTitle: 'Ucapan & Doa',
  closingMessage: 'Terima kasih atas perhatian dan doa restu Anda, yang menjadi kebahagiaan serta kehormatan besar bagi kami.',
  closingSalam: 'Wassalamualaikum Warahmatullahi Wabarakatuh',
  closingHamdalah: 'اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ',
  tagarPernikahan: '#ModernLoveStory',
};

export function getSimpleModernContent(customContent: any): SimpleModernContent {
  const custom =
    customContent?.A ||
    (customContent && !customContent.B && !customContent.C && !customContent.D && !customContent.E
      ? customContent
      : {}) ||
    {};

  return {
    welcomeTitle: custom.welcomeTitle?.trim() || DEFAULT_SIMPLE_MODERN.welcomeTitle,
    guestGreetingPrefix: custom.guestGreetingPrefix?.trim() || DEFAULT_SIMPLE_MODERN.guestGreetingPrefix,
    openInvitationText: custom.openInvitationText?.trim() || DEFAULT_SIMPLE_MODERN.openInvitationText,

    heroSubtitle: custom.heroSubtitle?.trim() || DEFAULT_SIMPLE_MODERN.heroSubtitle,
    scrollDownText: custom.scrollDownText?.trim() || DEFAULT_SIMPLE_MODERN.scrollDownText,

    salamArab: custom.salamArab?.trim() || DEFAULT_SIMPLE_MODERN.salamArab,
    salamText: custom.salamText?.trim() || DEFAULT_SIMPLE_MODERN.salamText,
    pengantarMempelai: custom.pengantarMempelai?.trim() || DEFAULT_SIMPLE_MODERN.pengantarMempelai,
    keteranganAnakPria: custom.keteranganAnakPria?.trim() || DEFAULT_SIMPLE_MODERN.keteranganAnakPria,
    keteranganAnakWanita: custom.keteranganAnakWanita?.trim() || DEFAULT_SIMPLE_MODERN.keteranganAnakWanita,

    judulMoment: custom.judulMoment?.trim() || DEFAULT_SIMPLE_MODERN.judulMoment,
    pengantarAcara: custom.pengantarAcara?.trim() || DEFAULT_SIMPLE_MODERN.pengantarAcara,
    labelAkad: custom.labelAkad?.trim() || DEFAULT_SIMPLE_MODERN.labelAkad,
    labelResepsi: custom.labelResepsi?.trim() || DEFAULT_SIMPLE_MODERN.labelResepsi,

    dresscodeNote: custom.dresscodeNote?.trim() || DEFAULT_SIMPLE_MODERN.dresscodeNote,
    dresscodeColors:
      Array.isArray(custom.dresscodeColors) && custom.dresscodeColors.length > 0
        ? custom.dresscodeColors
        : DEFAULT_SIMPLE_MODERN.dresscodeColors,
    dresscodeText: custom.dresscodeText?.trim() || DEFAULT_SIMPLE_MODERN.dresscodeText,

    ceritaKutipan: custom.ceritaKutipan?.trim() || DEFAULT_SIMPLE_MODERN.ceritaKutipan,
    ceritaSumber: custom.ceritaSumber?.trim() || DEFAULT_SIMPLE_MODERN.ceritaSumber,

    giftTitle: custom.giftTitle?.trim() || DEFAULT_SIMPLE_MODERN.giftTitle,
    giftSubtitle: custom.giftSubtitle?.trim() || DEFAULT_SIMPLE_MODERN.giftSubtitle,

    commentTitle: custom.commentTitle?.trim() || DEFAULT_SIMPLE_MODERN.commentTitle,
    closingMessage: custom.closingMessage?.trim() || DEFAULT_SIMPLE_MODERN.closingMessage,
    closingSalam: custom.closingSalam?.trim() || DEFAULT_SIMPLE_MODERN.closingSalam,
    closingHamdalah: custom.closingHamdalah?.trim() || DEFAULT_SIMPLE_MODERN.closingHamdalah,
    tagarPernikahan: custom.tagarPernikahan?.trim() || DEFAULT_SIMPLE_MODERN.tagarPernikahan,
  };
}
