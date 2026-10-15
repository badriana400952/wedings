const fs = require('fs');
const path = require('path');

const rawHtmlPath = path.join(__dirname, 'raw-body.html');
let html = fs.readFileSync(rawHtmlPath, 'utf8');

// Replacements in html:
// 1. Cover
html = html.replace(
  '<h1 id="cover-names">Badriana<span>&amp;</span>Nurizzati Islamiyah</h1>',
  '<h1 id="cover-names">${groom}<span>&amp;</span>${bride}</h1>'
);

html = html.replace(
  `<p id="guest-greeting">
          Meja telah kami siapkan untuk
          <span id="guest-greeting-name"></span>
        </p>
        <p id="guest-greeting-generic">
          Sebuah meja telah kami siapkan untuk Anda
        </p>`,
  '${guestGreetingHtml}'
);

// 2. Hero
html = html.replace(
  'src="https://wedivo.id/uploads/PaqKKqe1mjcttlp7BhAqMiY7tsk2/couplePhoto_1790836788.jpg"',
  'src="${couplePhoto}"'
);
html = html.replace(
  'alt="Foto Badriana dan Nurizzati Islamiyah"',
  'alt="Foto ${groom} dan ${bride}"'
);
html = html.replace(
  '<span id="hero-name-groom">Badriana</span>',
  '<span id="hero-name-groom">${groom}</span>'
);
html = html.replace(
  '<span id="hero-name-bride">Nurizzati Islamiyah</span>',
  '<span id="hero-name-bride">${bride}</span>'
);
html = html.replace(
  '<div id="hero-quote" class="reveal lift d5">Cinta yang baik seperti kaldu yang ditunggu semalaman: ia tidak bisa diburu, hanya bisa dijaga apinya.</div>',
  '<div id="hero-quote" class="reveal lift d5">${quote}</div>'
);

// 3. Couple Cards
// Groom
html = html.replace(
  'src="https://wedivo.id/uploads/PaqKKqe1mjcttlp7BhAqMiY7tsk2/groomPhoto_1790836746.jpg"',
  'src="${groomPhoto}"'
);
html = html.replace(
  '<p class="ing-name" id="ing-name-groom">Badriana</p>',
  '<p class="ing-name" id="ing-name-groom">${groom}</p>'
);
html = html.replace(
  '<p class="ing-full" id="ing-full-groom">Badri</p>',
  '<p class="ing-full" id="ing-full-groom">${groomFull}</p>'
);
html = html.replace(
  `<p class="ing-parents" id="ing-parents-groom">
                  Madripi
                </p>`,
  `<p class="ing-parents" id="ing-parents-groom">\${groomParents}</p>`
);

// Bride
html = html.replace(
  'src="https://wedivo.id/uploads/PaqKKqe1mjcttlp7BhAqMiY7tsk2/bridePhoto_1790836741.jpg"',
  'src="${bridePhoto}"'
);
html = html.replace(
  '<p class="ing-name" id="ing-name-bride">Nurizzati Islamiyah</p>',
  '<p class="ing-name" id="ing-name-bride">${bride}</p>'
);
html = html.replace(
  '<p class="ing-full" id="ing-full-bride">Izzah</p>',
  '<p class="ing-full" id="ing-full-bride">${brideFull}</p>'
);
html = html.replace(
  `<p class="ing-parents" id="ing-parents-bride">
                  Epi
                </p>`,
  `<p class="ing-parents" id="ing-parents-bride">\${brideParents}</p>`
);

// 4. Courses (Degustasi)
// Course 1
html = html.replace('src="{{course_1_photo}}"', 'src="${course1Photo}"');
html = html.replace(
  '<h3 class="course-name" id="course-name-1">Amuse-Bouche: Kopi Tumpah</h3>',
  '<h3 class="course-name" id="course-name-1">${course1Title}</h3>'
);
html = html.replace(
  '<p class="course-story" id="course-story-1">Pertemuan pertama di kedai kecil dekat kantor. Satu gelas tumpah, satu permintaan maaf yang kepanjangan, dan nomor telepon yang ditulis di selembar tisu.</p>',
  '<p class="course-story" id="course-story-1">${course1Story}</p>'
);

// Course 2
html = html.replace('src="{{course_2_photo}}"', 'src="${course2Photo}"');
html = html.replace(
  '<h3 class="course-name" id="course-name-2">Pembuka: Salad Musim Hujan</h3>',
  '<h3 class="course-name" id="course-name-2">${course2Title}</h3>'
);
html = html.replace(
  '<p class="course-story" id="course-story-2">Dua tahun saling mengenal rasa. Kami belajar bahwa pahit pun perlu, asal selalu ada yang menyeimbangkan dengan manis.</p>',
  '<p class="course-story" id="course-story-2">${course2Story}</p>'
);

// Course 3
html = html.replace('src="{{course_3_photo}}"', 'src="${course3Photo}"');
html = html.replace(
  '<h3 class="course-name" id="course-name-3">Utama: Rendang Sabar</h3>',
  '<h3 class="course-name" id="course-name-3">${course3Title}</h3>'
);
html = html.replace(
  '<p class="course-story" id="course-story-3">Dimasak delapan jam di atas api kecil. Kami bertemu keluarga, bertukar restu, dan menyadari bahwa rasa terbaik memang selalu butuh waktu.</p>',
  '<p class="course-story" id="course-story-3">${course3Story}</p>'
);

// Course 4
html = html.replace('src="{{course_4_photo}}"', 'src="${course4Photo}"');
html = html.replace(
  '<h3 class="course-name" id="course-name-4">Penutup: Puding Janji</h3>',
  '<h3 class="course-name" id="course-name-4">${course4Title}</h3>'
);
html = html.replace(
  '<p class="course-story" id="course-story-4">Manis yang paling ditunggu. Ia berlutut di dapur, di antara wangi vanila, dan bertanya apakah kami boleh memasak bersama seumur hidup.</p>',
  '<p class="course-story" id="course-story-4">${course4Story}</p>'
);

// 5. Events & Venue
html = html.replace('<p class="chit-val" id="chit-1-date"></p>', '<p class="chit-val" id="chit-1-date">${akadDateFormatted}</p>');
html = html.replace('<p class="chit-val" id="chit-1-time"></p>', '<p class="chit-val" id="chit-1-time">${akadTime}</p>');
html = html.replace('<p class="chit-val" id="chit-2-date"></p>', '<p class="chit-val" id="chit-2-date">${resepsiDateFormatted}</p>');
html = html.replace('<p class="chit-val" id="chit-2-time"></p>', '<p class="chit-val" id="chit-2-time">${resepsiTime}</p>');

html = html.replace(
  '<p class="chit-val" id="chit-1-venue">wwwtc mall</p>',
  '<p class="chit-val" id="chit-1-venue">${akadVenue}</p>'
);
html = html.replace(
  `<p
                    class="chit-val"
                    id="chit-1-address"
                    style="font-size: 14px; color: #5d5142"
                  >
                    280 Gloucester Rd, Causeway Bay, Hong Kong Island, Hong Kong
                  </p>`,
  `<p
                    class="chit-val"
                    id="chit-1-address"
                    style="font-size: 14px; color: #5d5142"
                  >\${akadAddress}</p>`
);

html = html.replace(
  '<p class="chit-val" id="chit-2-venue">Ruang Jamuan, Rumah Kaca Nusantara</p>',
  '<p class="chit-val" id="chit-2-venue">${resepsiVenue}</p>'
);

html = html.replace(
  '<h3 id="venue-name">wwwtc mall</h3>',
  '<h3 id="venue-name">${resepsiVenue}</h3>'
);
html = html.replace(
  '<p id="venue-address">280 Gloucester Rd, Causeway Bay, Hong Kong Island, Hong Kong</p>',
  '<p id="venue-address">${resepsiAddress}</p>'
);
html = html.replace(
  'href="https://www.google.com/maps/dir/?api=1&amp;destination=wwwtc mall&amp;travelmode=driving&amp;destination_place_id=ChIJVX_KZ1YABDQR8TZ6STtir8M"',
  'href="${mapUrl}"'
);

// 6. Gifts
html = html.replace(
  '<div id="gift-jar" class="reveal pop d3">',
  '${bankCardHtml}\n        <div id="gift-jar" class="reveal pop d3">'
);

// 7. Closing
html = html.replace(
  '<p id="closing-names" class="reveal pop d3">\n          Badriana &amp; Nurizzati Islamiyah\n        </p>',
  '<p id="closing-names" class="reveal pop d3">\n          ${groom} &amp; ${bride}\n        </p>'
);

// 8. Music
html = html.replace(
  '<div id="music-dock">',
  '<div id="music-dock"${!audioUrl ? \' style="display: none;"\' : \'\'}>'
);
html = html.replace(
  'src="{{background_music_url}}"',
  '${audioUrl ? `src="${audioUrl}"` : \'\'}'
);

// 9. Toast msg before closing
html += `\n    <div id="found-toast" class="toast-msg"><span id="found-toast-text">Nomor rekening berhasil disalin!</span></div>\n`;

// Escape any backticks and $ in raw html that are NOT our placeholders
// Since rawHtml originally has no \` and no \${...}, only the ones we added above have \${...}.
// Let's ensure proper TypeScript escaping.
// Let's replace any single backtick in raw html with \\`
html = html.split('`').join('\\`');

const tsSource = `import { escapeHtml } from './mejaKokiApi';

export function getMejaKokiHtml(data: any, guestName: string | null = null): string {
  const groom = escapeHtml(data?.namaPutra || 'Mempelai Pria');
  const groomFull = escapeHtml(data?.namaLengkapPutra || data?.namaPutra || 'Mempelai Pria');
  const groomFather = escapeHtml(data?.ayahPutra || '');
  const groomMother = escapeHtml(data?.ibuPutra || '');
  const groomParents = [groomFather, groomMother].filter(Boolean).join(' & ') || 'Keluarga Besar';
  const groomPhoto = data?.fotoPutra || '/assets/templates/meja-koki/1790088230_e84ebc64.jpg';

  const bride = escapeHtml(data?.namaPutri || 'Mempelai Wanita');
  const brideFull = escapeHtml(data?.namaLengkapPutri || data?.namaPutri || 'Mempelai Wanita');
  const brideFather = escapeHtml(data?.ayahPutri || '');
  const brideMother = escapeHtml(data?.ibuPutri || '');
  const brideParents = [brideFather, brideMother].filter(Boolean).join(' & ') || 'Keluarga Besar';
  const bridePhoto = data?.fotoPutri || '/assets/templates/meja-koki/1790088230_6e30a49c.jpg';

  const couplePhoto = data?.fotoSampul || data?.fotoPutra || '/assets/templates/meja-koki/1790088231_df639d98.jpg';

  const quote = escapeHtml(
    data?.ceritaCinta?.quote ||
    data?.quote ||
    'Cinta yang baik seperti kaldu yang ditunggu semalaman: ia tidak bisa diburu, hanya bisa dijaga apinya.'
  );

  const audioUrl = escapeHtml(data?.musik?.file || data?.audio || '');

  // Wedding Date & Time Format
  const akadDateRaw = data?.tanggalAkad || data?.tanggalPernikahan || '2026-10-30T09:00:00';
  const resepsiDateRaw = data?.tanggalResepsi || data?.tanggalPernikahan || '2026-10-30T11:00:00';

  const formatIdDate = (isoStr: string) => {
    try {
      const dt = new Date(isoStr);
      if (isNaN(dt.getTime())) return isoStr;
      return dt.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return isoStr;
    }
  };

  const akadDateFormatted = formatIdDate(akadDateRaw);
  const resepsiDateFormatted = formatIdDate(resepsiDateRaw);

  const akadTime = escapeHtml(data?.jamAkad || data?.waktuAkad || '08:00 - Selesai');
  const resepsiTime = escapeHtml(data?.jamResepsi || data?.waktuResepsi || '11:00 - Selesai');

  const akadVenue = escapeHtml(data?.tempatAkad || data?.lokasiAkad || 'Kediaman Mempelai');
  const akadAddress = escapeHtml(data?.alamatAkad || '');
  const resepsiVenue = escapeHtml(data?.tempatResepsi || data?.lokasiResepsi || 'Gedung Pertemuan');
  const resepsiAddress = escapeHtml(data?.alamatResepsi || '');

  const mapUrl = data?.linkMaps || data?.linkGoogleMaps || 'https://maps.google.com';

  // Story / Courses
  const p = data?.pertemuan || {};
  const bersamaFotos = Array.isArray(data?.bersamaFotos) ? data.bersamaFotos : [];

  const course1Title = escapeHtml(p.judulPertemuanSatu || 'Amuse-Bouche: Kopi Tumpah');
  const course1Story = escapeHtml(p.pertemuanPertama || 'Pertemuan pertama di kedai kecil dekat kantor. Satu gelas tumpah, satu permintaan maaf yang kepanjangan, dan nomor telepon yang ditulis di selembar tisu.');
  const course1Photo = bersamaFotos[0] || '/assets/templates/meja-koki/1790088230_e84ebc64.jpg';

  const course2Title = escapeHtml(p.judulPertemuanDua || 'Pembuka: Salad Musim Hujan');
  const course2Story = escapeHtml(p.pertemuanKedua || 'Dua tahun saling mengenal rasa. Kami belajar bahwa pahit pun perlu, asal selalu ada yang menyeimbangkan dengan manis.');
  const course2Photo = bersamaFotos[1] || '/assets/templates/meja-koki/1790088230_6e30a49c.jpg';

  const course3Title = escapeHtml(p.judulPertemuanTiga || 'Utama: Rendang Sabar');
  const course3Story = escapeHtml(p.pertemuanKetiga || 'Dimasak delapan jam di atas api kecil. Kami bertemu keluarga, bertukar restu, dan menyadari bahwa rasa terbaik memang selalu butuh waktu.');
  const course3Photo = bersamaFotos[2] || '/assets/templates/meja-koki/1790088231_df639d98.jpg';

  const course4Title = escapeHtml(p.judulPertemuanEmpat || 'Penutup: Puding Janji');
  const course4Story = escapeHtml(p.pertemuanKeempat || 'Manis yang paling ditunggu. Ia berlutut di dapur, di antara wangi vanila, dan bertanya apakah kami boleh memasak bersama seumur hidup.');
  const course4Photo = bersamaFotos[3] || '/assets/templates/meja-koki/1790088230_e84ebc64.jpg';

  // Bank & Gifts
  const namaBank = escapeHtml(data?.namaBank || 'BCA');
  const noAtm = escapeHtml(data?.noAtm || '');
  const namaRekening = escapeHtml(data?.atasNama || groomFull);
  const fotoQris = data?.fotoQris || '';
  const isQrisActive = !!fotoQris;

  // Guest Greeting HTML
  const guestGreetingHtml = guestName
    ? \`<p id="guest-greeting" style="display: block;">
          Meja telah kami siapkan untuk
          <span id="guest-greeting-name">\${escapeHtml(guestName)}</span>
        </p>
        <p id="guest-greeting-generic" style="display: none;">
          Sebuah meja telah kami siapkan untuk Anda
        </p>\`
    : \`<p id="guest-greeting" style="display: none;">
          Meja telah kami siapkan untuk
          <span id="guest-greeting-name"></span>
        </p>
        <p id="guest-greeting-generic" style="display: block;">
          Sebuah meja telah kami siapkan untuk Anda
        </p>\`;

  // Bank Transfer Card inside Gifts Section
  const bankCardHtml = (data?.namaBank || data?.noAtm) ? \`
    <div class="gift-bank-card" style="margin: 20px auto 30px auto; max-width: 420px; background: rgba(30, 25, 20, 0.75); border: 1px solid rgba(198, 154, 78, 0.4); border-radius: 8px; padding: 22px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
      <p style="font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #c69a4e; margin-bottom: 6px;">Transfer Rekening</p>
      <h3 style="font-size: 22px; font-weight: 700; color: #ecd199; margin: 4px 0 10px 0; letter-spacing: 1px;">\${namaBank}</h3>
      <p style="font-family: monospace; font-size: 20px; font-weight: 600; color: #f4ecdf; letter-spacing: 2px; margin: 8px 0;">\${noAtm}</p>
      <p style="font-size: 14px; color: #bcaaa4; margin-bottom: 16px;">a.n. \${namaRekening}</p>
      <button type="button" class="submit-btn" style="padding: 10px 24px; font-size: 14px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: 1px solid #c69a4e; background: #c69a4e; color: #1b1712; font-weight: 600;" onclick="window.copyRekening('\${noAtm}')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Salin Nomor Rekening
      </button>
      \${isQrisActive ? \`
        <div style="margin-top: 24px; padding-top: 18px; border-top: 1px dashed rgba(198, 154, 78, 0.3);">
          <p style="font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #c69a4e; margin-bottom: 12px;">Atau Pindai QRIS</p>
          <img src="\${escapeHtml(fotoQris)}" alt="QRIS Code" style="max-width: 200px; width: 100%; border-radius: 8px; border: 2px solid #c69a4e; box-shadow: 0 4px 15px rgba(0,0,0,0.5);" />
        </div>
      \` : ''}
    </div>
  \` : '';

  return \`${html}\`;
}
`;

const outputPath = path.join(__dirname, '..', 'components', 'templateE-meja-koki', 'mejaKokiHtml.ts');
fs.writeFileSync(outputPath, tsSource, 'utf8');
console.log('Successfully written mejaKokiHtml.ts, size:', tsSource.length);
