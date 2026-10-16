import { escapeHtml } from './mejaKokiApi';

export function getMejaKokiHtml(data: any, guestName: string | null = null): string {
  const groom = escapeHtml(data?.namaPutra || 'Mempelai Pria');
  const groomFull = escapeHtml(data?.namaLengkapPutra || data?.namaPutra || 'Mempelai Pria');
  const groomFather = escapeHtml(data?.namaAyahPutra || data?.ayahPutra || '');
  const groomMother = escapeHtml(data?.namaIbuPutra || data?.ibuPutra || '');
  const groomParents = (groomFather && groomMother)
    ? `Bpk. ${groomFather} & Ibu ${groomMother}`
    : (groomFather || groomMother)
      ? `${groomFather || groomMother}`
      : 'Keluarga Besar';
  const groomPhoto = data?.photoPutra || data?.fotoPutra || '/assets/templates/meja-koki/1790088230_e84ebc64.jpg';
  const groomNote = escapeHtml(
    data?.kelahiranPutra
      ? `${data.kelahiranPutra} — bertugas menjaga api tetap menyala`
      : 'Bertugas menjaga api tetap menyala'
  );

  const bride = escapeHtml(data?.namaPutri || 'Mempelai Wanita');
  const brideFull = escapeHtml(data?.namaLengkapPutri || data?.namaPutri || 'Mempelai Wanita');
  const brideFather = escapeHtml(data?.namaAyahPutri || data?.ayahPutri || '');
  const brideMother = escapeHtml(data?.namaIbuPutri || data?.ibuPutri || '');
  const brideParents = (brideFather && brideMother)
    ? `Bpk. ${brideFather} & Ibu ${brideMother}`
    : (brideFather || brideMother)
      ? `${brideFather || brideMother}`
      : 'Keluarga Besar';
  const bridePhoto = data?.photoPutri || data?.fotoPutri || '/assets/templates/meja-koki/1790088230_6e30a49c.jpg';
  const brideNote = escapeHtml(
    data?.kelahiranPutri
      ? `${data.kelahiranPutri} — bertugas menyeimbangkan setiap rasa`
      : 'Bertugas menyeimbangkan setiap rasa'
  );

  const couplePhoto =
    data?.fotoHeader ||
    data?.fotoHeader2 ||
    data?.fotoHeader3 ||
    data?.fotoHeader4 ||
    data?.fotoSampul ||
    data?.photoPutra ||
    data?.fotoPutra ||
    '/assets/templates/meja-koki/1790088231_df639d98.jpg';

  const quote = escapeHtml(
    data?.ceritaCinta?.quote ||
    data?.quote ||
    'Cinta yang baik seperti kaldu yang ditunggu semalaman: ia tidak bisa diburu, hanya bisa dijaga apinya.'
  );

  const audioUrl = escapeHtml(data?.audio || data?.musik?.file || '');
  const linkGoogleCalendar = escapeHtml(data?.linkGoogleCalender || data?.linkGoogleCalendar || '');

  // Wedding Date & Time Format
  const akadDateRaw = data?.tanggalAkad || data?.tanggalPernikahan || '2026-10-30T09:00:00';
  const resepsiDateRaw = data?.tanggalResepsi || data?.tanggalPernikahan || '2026-10-30T11:00:00';

  // Target Wedding Date & Time for Countdown
  const rawTargetDate = data?.tanggalPernikahan || data?.tanggalAkad || data?.tanggalResepsi || '2026-10-30T11:00:00';
  let targetDatePart = '2026-10-30';
  if (typeof rawTargetDate === 'string') {
    targetDatePart = rawTargetDate.split('T')[0];
  } else if (rawTargetDate instanceof Date) {
    targetDatePart = rawTargetDate.toISOString().split('T')[0];
  }

  const rawTargetTime = data?.jamMulai || data?.jamAkad || data?.jamResepsi || data?.waktuAkad || '10:00';
  const targetTimeMatch = String(rawTargetTime).match(/([01]?\d|2[0-3])[:.]([0-5]\d)/);
  const targetTimePart = targetTimeMatch ? `${targetTimeMatch[1].padStart(2, '0')}:${targetTimeMatch[2]}:00` : '10:00:00';
  const weddingTargetDateIso = `${targetDatePart}T${targetTimePart}`;

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
  const isGiftActive = (data as any)?.isGiftActive !== false;
  const namaBank = escapeHtml(data?.namaBank || 'BCA');
  const noAtm = escapeHtml(data?.noAtm || '');
  const namaRekening = escapeHtml(data?.atasNama || groomFull);
  const fotoQris = data?.fotoQris || '';
  const isBankActive = (data as any)?.isBankActive !== false && Boolean(data?.namaBank || data?.noAtm);
  const isQrisActive = (data as any)?.isQrisActive !== false && Boolean(fotoQris);

  // Guest Greeting HTML
  const guestGreetingHtml = guestName
    ? `<p id="guest-greeting" style="display: block;">
          Meja telah kami siapkan untuk
          <span id="guest-greeting-name">${escapeHtml(guestName)}</span>
        </p>
        <p id="guest-greeting-generic" style="display: none;">
          Sebuah meja telah kami siapkan untuk Anda
        </p>`
    : `<p id="guest-greeting" style="display: none;">
          Meja telah kami siapkan untuk
          <span id="guest-greeting-name"></span>
        </p>
        <p id="guest-greeting-generic" style="display: block;">
          Sebuah meja telah kami siapkan untuk Anda
        </p>`;

  // Bank Transfer Card inside Gifts Section
  let bankCardHtml = '';
  if (isBankActive || isQrisActive) {
    bankCardHtml = `
    <div class="gift-bank-card" style="margin: 20px auto 30px auto; max-width: 420px; background: rgba(30, 25, 20, 0.75); border: 1px solid rgba(198, 154, 78, 0.4); border-radius: 8px; padding: 22px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
      ${isBankActive ? `
        <p style="font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #c69a4e; margin-bottom: 6px;">Transfer Rekening</p>
        <h3 style="font-size: 22px; font-weight: 700; color: #ecd199; margin: 4px 0 10px 0; letter-spacing: 1px;">${namaBank}</h3>
        <p style="font-family: monospace; font-size: 20px; font-weight: 600; color: #f4ecdf; letter-spacing: 2px; margin: 8px 0;">${noAtm}</p>
        <p style="font-size: 14px; color: #bcaaa4; margin-bottom: 16px;">a.n. ${namaRekening}</p>
        <button type="button" class="submit-btn" style="padding: 10px 24px; font-size: 14px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: 1px solid #c69a4e; background: #c69a4e; color: #1b1712; font-weight: 600;" onclick="window.copyRekening('${noAtm}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Salin Nomor Rekening
        </button>
      ` : ''}
      ${isQrisActive ? `
        <div style="${isBankActive ? 'margin-top: 24px; padding-top: 18px; border-top: 1px dashed rgba(198, 154, 78, 0.3);' : ''}">
          <p style="font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #c69a4e; margin-bottom: 12px;">Atau Pindai QRIS</p>
          <img src="${escapeHtml(fotoQris)}" alt="QRIS Code" style="max-width: 200px; width: 100%; border-radius: 8px; border: 2px solid #c69a4e; box-shadow: 0 4px 15px rgba(0,0,0,0.5); margin: 0 auto; display: block;" />
          <p style="font-size: 12px; color: #bcaaa4; margin-top: 8px;">Pindai menggunakan aplikasi e-wallet atau mobile banking apa saja</p>
        </div>
      ` : ''}
    </div>
    `;
  }

  return `    <div id="bg-stack" aria-hidden="true">
      <div id="bg-room"></div>
      <div id="bg-wash"></div>
      <div id="bg-spot"></div>
      <canvas id="bg-particles"></canvas>
      <div id="bg-vig"></div>
    </div>

    <section id="sec-cover" data-section="cover">
      <div id="cover-room"></div>
      <div id="cover-beam"></div>
      <div id="cover-vig"></div>

      <div id="cover-stage">
        <div id="cover-plate">
          <svg
            id="cover-plate-svg"
            viewBox="0 0 300 300"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="grad-plate" cx="38%" cy="32%" r="70%">
                <stop offset="0%" stop-color="#3a332a" />
                <stop offset="62%" stop-color="#1b1712" />
                <stop offset="100%" stop-color="#0c0a08" />
              </radialGradient>
            </defs>
            <circle
              id="cover-plate-body"
              cx="150"
              cy="150"
              r="142"
              fill="url(#grad-plate)"
            />
            <circle
              id="cover-plate-rim1"
              cx="150"
              cy="150"
              r="141"
              stroke="#c69a4e"
              stroke-opacity=".7"
              stroke-width="1.6"
            />
            <circle
              id="cover-plate-rim2"
              cx="150"
              cy="150"
              r="126"
              stroke="#ecd199"
              stroke-opacity=".35"
              stroke-width=".9"
            />
            <circle
              id="cover-plate-rim3"
              cx="150"
              cy="150"
              r="96"
              stroke="#c69a4e"
              stroke-opacity=".28"
              stroke-width=".8"
              stroke-dasharray="3 7"
            />
          </svg>
        </div>
        <span id="cover-monogram">&amp;</span>
        <svg
          id="cover-steam"
          viewBox="0 0 150 170"
          fill="none"
          aria-hidden="true"
        >
          <path id="cover-steam-1" d="M46 160c-10-22 10-30 0-52s8-30 2-48" />
          <path id="cover-steam-2" d="M76 164c-11-26 12-34 1-58s9-32 3-52" />
          <path id="cover-steam-3" d="M106 160c-10-22 10-30 0-52s8-30 2-48" />
        </svg>
        <svg
          id="cover-cloche"
          viewBox="0 0 300 200"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="grad-dome" x1="18%" y1="4%" x2="86%" y2="96%">
              <stop offset="0%" stop-color="#f4ecdf" />
              <stop offset="22%" stop-color="#c9bda6" />
              <stop offset="46%" stop-color="#6e6354" />
              <stop offset="72%" stop-color="#3a332a" />
              <stop offset="100%" stop-color="#1b1712" />
            </linearGradient>
            <linearGradient
              id="grad-cloche-base"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stop-color="#5d5142" />
              <stop offset="34%" stop-color="#ecd199" />
              <stop offset="66%" stop-color="#8a7a60" />
              <stop offset="100%" stop-color="#3a332a" />
            </linearGradient>
            <linearGradient id="grad-knob" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stop-color="#f6e4bb" />
              <stop offset="55%" stop-color="#c69a4e" />
              <stop offset="100%" stop-color="#6d5223" />
            </linearGradient>
          </defs>
          <path
            id="cover-dome"
            d="M20 164C20 84 78 30 150 30s130 54 130 134z"
            fill="url(#grad-dome)"
          />
          <path
            id="cover-dome-gloss"
            d="M56 150c0-56 34-98 80-104-30 22-48 60-48 104z"
            fill="#f4ecdf"
            fill-opacity=".26"
          />
          <path
            id="cover-dome-gloss2"
            d="M214 152c0-40-14-74-36-94 34 16 58 52 58 94z"
            fill="#f4ecdf"
            fill-opacity=".1"
          />
          <ellipse
            id="cover-knob-stem"
            cx="150"
            cy="34"
            rx="12"
            ry="7"
            fill="#6d5223"
          />
          <circle
            id="cover-knob"
            cx="150"
            cy="20"
            r="14"
            fill="url(#grad-knob)"
          />
          <circle
            id="cover-knob-shine"
            cx="145"
            cy="15"
            r="4.4"
            fill="#fff6e2"
            fill-opacity=".72"
          />
          <rect
            id="cover-cloche-rim"
            x="8"
            y="162"
            width="284"
            height="15"
            rx="7.5"
            fill="url(#grad-cloche-base)"
          />
          <rect
            id="cover-cloche-rim-line"
            x="8"
            y="166"
            width="284"
            height="1.4"
            fill="#0d0b09"
            fill-opacity=".38"
          />
        </svg>
      </div>

      <div id="cover-card">
        <p id="cover-kicker">Meja Sang Koki</p>
        <h1 id="cover-names">${groom}<span>&amp;</span>${bride}</h1>
        <p id="cover-date-line">Menu Degustasi Pernikahan</p>
        <svg
          id="cover-rule"
          viewBox="0 0 160 12"
          fill="none"
          class="brass-line"
          aria-hidden="true"
        >
          <path
            id="cover-rule-l"
            d="M0 6h62"
            stroke="currentColor"
            stroke-opacity=".55"
          />
          <path
            id="cover-rule-r"
            d="M98 6h62"
            stroke="currentColor"
            stroke-opacity=".55"
          />
          <path
            id="cover-rule-gem"
            d="M80 1.4l4.4 4.6-4.4 4.6-4.4-4.6z"
            stroke="currentColor"
            stroke-width="1"
            stroke-linejoin="round"
          />
          <circle
            id="cover-rule-dot-l"
            cx="69"
            cy="6"
            r="1.5"
            fill="currentColor"
          />
          <circle
            id="cover-rule-dot-r"
            cx="91"
            cy="6"
            r="1.5"
            fill="currentColor"
          />
        </svg>
        ${guestGreetingHtml}
        <button type="button" id="cover-open-btn">Angkat Tudung Saji</button>
        <p id="cover-hint">Sajian pertama menunggu di bawahnya</p>
      </div>
    </section>

    <header id="sec-hero" data-section="hero">
      <div id="hero-glow"></div>
      <div id="hero-inner" class="wrap">
        <p id="hero-kicker" class="reveal drop">Edisi Panen Juni — Meja No. 01</p>

        <div id="hero-plate" class="reveal pop d1">
          <div id="hero-photo-mask">
            <img
              id="hero-photo"
              src="${couplePhoto}"
              alt="Foto ${groom} dan ${bride}"
              data-optional="1"
            />
            <div id="hero-photo-fallback" hidden>&amp;</div>
          </div>
          <div id="hero-plate-shine"></div>
          <svg
            id="hero-plate-ring"
            viewBox="0 0 300 300"
            fill="none"
            aria-hidden="true"
          >
            <circle
              id="hero-ring-1"
              cx="150"
              cy="150"
              r="146"
              stroke="#c69a4e"
              stroke-opacity=".55"
              stroke-width="1.4"
            />
            <circle
              id="hero-ring-2"
              cx="150"
              cy="150"
              r="138"
              stroke="#ecd199"
              stroke-opacity=".28"
              stroke-width=".8"
            />
            <circle
              id="hero-ring-3"
              cx="150"
              cy="150"
              r="118"
              stroke="#c69a4e"
              stroke-opacity=".4"
              stroke-width=".8"
              stroke-dasharray="2 8"
            />
            <g
              id="hero-ring-ticks"
              stroke="#ecd199"
              stroke-opacity=".6"
              stroke-width="1.2"
              stroke-linecap="round"
            >
              <path id="hero-tick-t" d="M150 4v12" />
              <path id="hero-tick-b" d="M150 284v12" />
              <path id="hero-tick-l" d="M4 150h12" />
              <path id="hero-tick-r" d="M284 150h12" />
            </g>
          </svg>
          <svg
            id="hero-sprig-l"
            viewBox="0 0 80 160"
            fill="none"
            aria-hidden="true"
          >
            <path
              id="hero-sprig-l-stem"
              d="M40 158C40 110 34 70 20 30"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <g id="hero-sprig-l-leaves" fill="currentColor" fill-opacity=".85">
              <ellipse
                id="hero-leaf-l1"
                cx="27"
                cy="120"
                rx="15"
                ry="7"
                transform="rotate(-28 27 120)"
              />
              <ellipse
                id="hero-leaf-l2"
                cx="50"
                cy="104"
                rx="14"
                ry="6.5"
                transform="rotate(24 50 104)"
              />
              <ellipse
                id="hero-leaf-l3"
                cx="24"
                cy="86"
                rx="13"
                ry="6"
                transform="rotate(-32 24 86)"
              />
              <ellipse
                id="hero-leaf-l4"
                cx="44"
                cy="68"
                rx="12"
                ry="5.5"
                transform="rotate(20 44 68)"
              />
              <ellipse
                id="hero-leaf-l5"
                cx="22"
                cy="52"
                rx="10"
                ry="4.8"
                transform="rotate(-36 22 52)"
              />
            </g>
          </svg>
          <svg id="hero-sprig-r" viewBox="0 0 80 160" fill="none" aria-hidden="true" style="left: 314px; right: -40px;">
            <path id="hero-sprig-r-stem" d="M40 158C40 110 34 70 20 30" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
            <g id="hero-sprig-r-leaves" fill="currentColor" fill-opacity=".85">
              <ellipse id="hero-leaf-r1" cx="27" cy="120" rx="15" ry="7" transform="rotate(-28 27 120)"></ellipse>
              <ellipse id="hero-leaf-r2" cx="50" cy="104" rx="14" ry="6.5" transform="rotate(24 50 104)"></ellipse>
              <ellipse id="hero-leaf-r3" cx="24" cy="86" rx="13" ry="6" transform="rotate(-32 24 86)"></ellipse>
              <ellipse id="hero-leaf-r4" cx="44" cy="68" rx="12" ry="5.5" transform="rotate(20 44 68)"></ellipse>
            </g>
          </svg>
        </div>

        <h1 id="hero-title" class="reveal d2">
          <span id="hero-name-groom">${groom}</span>
          <span id="hero-amp">&amp;</span>
          <span id="hero-name-bride">${bride}</span>
        </h1>
        <p id="hero-sub" class="reveal d3">
          Chef&rsquo;s Table &middot; Satu Malam, Satu Kisah
        </p>
        <p id="hero-date" class="reveal d4"></p>
        <div id="hero-quote" class="reveal lift d5">${quote}</div>
        <p id="hero-scroll" class="reveal d6">
          Gulir untuk mencicipi
          <svg
            id="hero-scroll-arrow"
            viewBox="0 0 16 26"
            fill="none"
            aria-hidden="true"
          >
            <path
              id="hero-scroll-path"
              d="M8 2v20m0 0l-5-5m5 5l5-5"
              stroke="currentColor"
              stroke-width="1.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </p>
      </div>
    </header>

    <section id="sec-countdown" data-section="countdown" data-wedding-date="${weddingTargetDateIso}">
      <div id="cd-wrap" class="wrap center">
        <p id="cd-kicker" class="kicker reveal">Api Sudah Menyala</p>
        <h2 id="cd-title" class="htitle reveal d1" style="margin-bottom: 15px;">
          Sajian utama disajikan dalam
        </h2>
        <div id="cd-board" class="reveal lift d2" data-wedding-date="${weddingTargetDateIso}">
          <span id="wedding-date-raw" style="display:none;">${weddingTargetDateIso}</span>
          <svg id="cd-steam" viewBox="0 0 56 60" fill="none" aria-hidden="true">
            <path id="cd-steam-1" d="M14 56c-6-14 7-18 0-31" />
            <path id="cd-steam-2" d="M28 58c-7-16 8-20 1-34" />
            <path id="cd-steam-3" d="M42 56c-6-14 7-18 0-31" />
          </svg>
          <p id="cd-board-lb" class="kicker">Penghitung Waktu Dapur</p>
          <div id="cd-dials">
            <div class="cd-dial" id="cd-dial-d">
              <div class="cd-face" id="cd-face-d">
                <span class="cd-num" id="cd-days">00</span>
              </div>
              <p class="cd-lb" id="cd-lb-d">Hari</p>
            </div>
            <div class="cd-dial" id="cd-dial-h">
              <div class="cd-face" id="cd-face-h">
                <span class="cd-num" id="cd-hours">00</span>
              </div>
              <p class="cd-lb" id="cd-lb-h">Jam</p>
            </div>
            <div class="cd-dial" id="cd-dial-m">
              <div class="cd-face" id="cd-face-m">
                <span class="cd-num" id="cd-mins">00</span>
              </div>
              <p class="cd-lb" id="cd-lb-m">Menit</p>
            </div>
            <div class="cd-dial" id="cd-dial-s">
              <div class="cd-face" id="cd-face-s">
                <span class="cd-num" id="cd-secs">00</span>
              </div>
              <p class="cd-lb" id="cd-lb-s">Detik</p>
            </div>
          </div>
          <p id="cd-done">Hari ini sajian kami naik ke meja. Selamat datang!</p>
          <button type="button" id="cd-cal"${linkGoogleCalendar ? ` data-cal-url="${linkGoogleCalendar}"` : ''}>
            Simpan Reservasi ke Kalender
          </button>
        </div>
      </div>
    </section>
    <section id="sec-couple" data-section="couple">
      <div id="couple-wrap" class="wrap center">
        <p id="couple-kicker" class="kicker reveal">Dua Bahan Utama</p>
        <h2 id="couple-title" class="htitle reveal d1">
          Dapur ini berdiri di atas <em>dua bahan</em> yang tak tergantikan
        </h2>
        <p id="couple-lede" class="lede reveal d2">
          Ketuk setiap kartu bahan untuk membaca asal-usulnya.
        </p>

        <div id="ing-grid">
          <div
            class="ing-card reveal left d1"
            id="ing-card-groom"
            role="button"
            tabindex="0"
            aria-pressed="false"
            aria-label="Kartu bahan mempelai pria, ketuk untuk membalik"
          >
            <div class="ing-inner" id="ing-inner-groom">
              <div class="ing-face ing-front" id="ing-front-groom">
                <div class="ing-photo-wrap" id="ing-photo-wrap-groom">
                  <img
                    class="ing-photo"
                    id="ing-photo-groom"
                    src="${groomPhoto}"
                    alt="Foto Badriana"
                    data-optional="1"
                  />
                  <div
                    class="ing-photo-fallback"
                    id="ing-photo-fb-groom"
                    hidden
                  >
                    B
                  </div>
                </div>
                <div class="ing-shade" id="ing-shade-groom"></div>
                <svg
                  class="ing-frame"
                  id="ing-frame-groom"
                  viewBox="0 0 300 396"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <rect
                    id="ing-frame-groom-box"
                    x="10"
                    y="10"
                    width="280"
                    height="376"
                    stroke="currentColor"
                    stroke-opacity=".45"
                    stroke-width="1"
                  />
                  <path
                    id="ing-frame-groom-c1"
                    d="M10 44V10h34"
                    stroke="currentColor"
                    stroke-width="2.4"
                  />
                  <path
                    id="ing-frame-groom-c2"
                    d="M256 10h34v34"
                    stroke="currentColor"
                    stroke-width="2.4"
                  />
                  <path
                    id="ing-frame-groom-c3"
                    d="M290 352v34h-34"
                    stroke="currentColor"
                    stroke-width="2.4"
                  />
                  <path
                    id="ing-frame-groom-c4"
                    d="M44 386H10v-34"
                    stroke="currentColor"
                    stroke-width="2.4"
                  />
                </svg>
                <span class="ing-tag" id="ing-tag-groom">Bahan No. 01</span>
                <div class="ing-body" id="ing-body-groom">
                  <p class="ing-role" id="ing-role-groom">Mempelai Pria</p>
                  <p class="ing-name" id="ing-name-groom">${groom}</p>
                  <p class="ing-note" id="ing-note-groom">${groomNote}</p>
                  <span class="ing-flip-hint" id="ing-hint-groom">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      id="ing-hint-ic-groom"
                      aria-hidden="true"
                    >
                      <path
                        d="M21 12a9 9 0 11-3-6.7M21 4v5h-5"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    Balik kartu
                  </span>
                </div>
              </div>
              <div class="ing-face ing-back" id="ing-back-groom">
                <svg
                  class="ing-back-orn"
                  id="ing-back-orn-groom"
                  viewBox="0 0 120 30"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    id="ing-orn-groom-l"
                    d="M2 15h38"
                    stroke="currentColor"
                    stroke-width="1"
                  />
                  <path
                    id="ing-orn-groom-r"
                    d="M80 15h38"
                    stroke="currentColor"
                    stroke-width="1"
                  />
                  <path
                    id="ing-orn-groom-leaf"
                    d="M60 4c-7 5-11 8-11 11s4 6 11 11c7-5 11-8 11-11s-4-6-11-11z"
                    stroke="currentColor"
                    stroke-width="1.2"
                  />
                  <circle
                    id="ing-orn-groom-dot"
                    cx="60"
                    cy="15"
                    r="2"
                    fill="currentColor"
                  />
                </svg>
                <p class="ing-full" id="ing-full-groom">${groomFull}</p>
                <span class="ing-sep" id="ing-sep-groom"></span>
                <p class="ing-parents-lb" id="ing-parents-lb-groom">
                  Dibesarkan oleh
                </p>
                <p class="ing-parents" id="ing-parents-groom">${groomParents}</p>
                <p class="ing-back-hint" id="ing-back-hint-groom">
                  Ketuk untuk kembali
                </p>
              </div>
            </div>
          </div>

          <div id="ing-amp" class="reveal pop d2" aria-hidden="true">
            <svg id="ing-amp-orn" viewBox="0 0 120 26" fill="none">
              <path
                id="ing-amp-l"
                d="M0 13h40"
                stroke="currentColor"
                stroke-width=".9"
              />
              <path
                id="ing-amp-r"
                d="M80 13h40"
                stroke="currentColor"
                stroke-width=".9"
              />
              <path
                id="ing-amp-fork"
                d="M54 4v7m4-7v7m-4 4v7m0-11h4v11"
                stroke="currentColor"
                stroke-width="1.1"
                stroke-linecap="round"
              />
              <path
                id="ing-amp-spoon"
                d="M66 4c3 0 4 3 4 5s-1 4-4 4-4-2-4-4 1-5 4-5zm0 9v9"
                stroke="currentColor"
                stroke-width="1.1"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <div
            class="ing-card reveal right d3"
            id="ing-card-bride"
            role="button"
            tabindex="0"
            aria-pressed="false"
            aria-label="Kartu bahan mempelai wanita, ketuk untuk membalik"
          >
            <div class="ing-inner" id="ing-inner-bride">
              <div class="ing-face ing-front" id="ing-front-bride">
                <div class="ing-photo-wrap" id="ing-photo-wrap-bride">
                  <img
                    class="ing-photo"
                    id="ing-photo-bride"
                    src="${bridePhoto}"
                    alt="Foto Nurizzati Islamiyah"
                    data-optional="1"
                  />
                  <div
                    class="ing-photo-fallback"
                    id="ing-photo-fb-bride"
                    hidden
                  >
                    K
                  </div>
                </div>
                <div class="ing-shade" id="ing-shade-bride"></div>
                <svg
                  class="ing-frame"
                  id="ing-frame-bride"
                  viewBox="0 0 300 396"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <rect
                    id="ing-frame-bride-box"
                    x="10"
                    y="10"
                    width="280"
                    height="376"
                    stroke="currentColor"
                    stroke-opacity=".45"
                    stroke-width="1"
                  />
                  <path
                    id="ing-frame-bride-c1"
                    d="M10 44V10h34"
                    stroke="currentColor"
                    stroke-width="2.4"
                  />
                  <path
                    id="ing-frame-bride-c2"
                    d="M256 10h34v34"
                    stroke="currentColor"
                    stroke-width="2.4"
                  />
                  <path
                    id="ing-frame-bride-c3"
                    d="M290 352v34h-34"
                    stroke="currentColor"
                    stroke-width="2.4"
                  />
                  <path
                    id="ing-frame-bride-c4"
                    d="M44 386H10v-34"
                    stroke="currentColor"
                    stroke-width="2.4"
                  />
                </svg>
                <span class="ing-tag" id="ing-tag-bride">Bahan No. 02</span>
                <div class="ing-body" id="ing-body-bride">
                  <p class="ing-role" id="ing-role-bride">Mempelai Wanita</p>
                  <p class="ing-name" id="ing-name-bride">${bride}</p>
                  <p class="ing-note" id="ing-note-bride">${brideNote}</p>
                  <span class="ing-flip-hint" id="ing-hint-bride">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      id="ing-hint-ic-bride"
                      aria-hidden="true"
                    >
                      <path
                        d="M21 12a9 9 0 11-3-6.7M21 4v5h-5"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    Balik kartu
                  </span>
                </div>
              </div>
              <div class="ing-face ing-back" id="ing-back-bride">
                <svg
                  class="ing-back-orn"
                  id="ing-back-orn-bride"
                  viewBox="0 0 120 30"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    id="ing-orn-bride-l"
                    d="M2 15h38"
                    stroke="currentColor"
                    stroke-width="1"
                  />
                  <path
                    id="ing-orn-bride-r"
                    d="M80 15h38"
                    stroke="currentColor"
                    stroke-width="1"
                  />
                  <path
                    id="ing-orn-bride-leaf"
                    d="M60 4c-7 5-11 8-11 11s4 6 11 11c7-5 11-8 11-11s-4-6-11-11z"
                    stroke="currentColor"
                    stroke-width="1.2"
                  />
                  <circle
                    id="ing-orn-bride-dot"
                    cx="60"
                    cy="15"
                    r="2"
                    fill="currentColor"
                  />
                </svg>
                <p class="ing-full" id="ing-full-bride">${brideFull}</p>
                <span class="ing-sep" id="ing-sep-bride"></span>
                <p class="ing-parents-lb" id="ing-parents-lb-bride">
                  Dibesarkan oleh
                </p>
                <p class="ing-parents" id="ing-parents-bride">${brideParents}</p>
                <p class="ing-back-hint" id="ing-back-hint-bride">
                  Ketuk untuk kembali
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="sec-tasting" data-section="tasting">
      <div id="tasting-wrap" class="wrap">
        <div id="tasting-head" class="center">
          <p id="tasting-kicker" class="kicker reveal">Menu Degustasi</p>
          <h2 id="tasting-title" class="htitle reveal d1">
            Empat sajian, <em>satu kisah</em>
          </h2>
        </div>
        <div id="chef-note" class="reveal lift d2">
          <span id="chef-note-lb">Catatan dari Dapur</span>
          Selamat datang di meja kami. Malam ini dapur tidak menyajikan apa-apa yang mewah, hanya satu kisah yang dimasak perlahan sejak 2019 — dan Anda adalah tamu yang kami tunggu untuk mencicipinya.
          <span id="chef-sign">Sang Koki</span>
        </div>

        <div id="course-list">
          <article class="course" id="course-1">
            <div class="course-plate reveal pop" id="course-plate-1">
              <svg
                class="course-sauce"
                id="course-sauce-1"
                viewBox="0 0 200 200"
                fill="none"
                aria-hidden="true"
              >
                <path
                  id="course-sauce-1-p"
                  d="M40 128c18-26 46-34 72-24 20 8 38 4 46-10-2 30-26 48-58 44-24-3-44 0-60-10z"
                  fill="currentColor"
                  fill-opacity=".5"
                />
                <circle
                  id="course-sauce-1-d1"
                  cx="146"
                  cy="70"
                  r="4"
                  fill="currentColor"
                  fill-opacity=".45"
                />
                <circle
                  id="course-sauce-1-d2"
                  cx="58"
                  cy="76"
                  r="3"
                  fill="currentColor"
                  fill-opacity=".38"
                />
              </svg>
              <div class="course-photo-mask" id="course-mask-1">
                <img
                  class="course-photo"
                  id="course-photo-1"
                  src="${course1Photo}"
                  alt="Foto kenangan sajian pertama Badriana dan Nurizzati Islamiyah"
                  data-optional="1"
                />
                <div class="course-photo-fallback" id="course-fb-1" hidden>
                  <svg
                    viewBox="0 0 48 48"
                    fill="none"
                    id="course-fb-ic-1"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 40c0-12 7-20 16-20s16 8 16 20"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                    />
                    <circle
                      cx="24"
                      cy="13"
                      r="7"
                      stroke="currentColor"
                      stroke-width="1.6"
                    />
                  </svg>
                </div>
              </div>
              <svg
                class="course-plate-ring"
                id="course-ring-1"
                viewBox="0 0 300 300"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="150"
                  cy="150"
                  r="144"
                  stroke="currentColor"
                  stroke-opacity=".55"
                  stroke-width="1.3"
                  id="course-ring-1-a"
                />
                <circle
                  cx="150"
                  cy="150"
                  r="130"
                  stroke="currentColor"
                  stroke-opacity=".3"
                  stroke-width=".8"
                  stroke-dasharray="2 7"
                  id="course-ring-1-b"
                />
              </svg>
              <span class="course-no" id="course-no-1">I</span>
            </div>
            <div class="course-body reveal right d1" id="course-body-1">
              <p class="course-step" id="course-step-1">Sajian Pertama</p>
              <h3 class="course-name" id="course-name-1">${course1Title}</h3>
              <span class="course-dots" id="course-dots-1"></span>
              <p class="course-pairing" id="course-pairing-1">
                Dipadukan dengan kopi susu gula aren, 2019
              </p>
              <p class="course-story" id="course-story-1">${course1Story}</p>
            </div>
          </article>

          <article class="course" id="course-2">
            <div class="course-plate reveal pop" id="course-plate-2">
              <svg
                class="course-sauce"
                id="course-sauce-2"
                viewBox="0 0 200 200"
                fill="none"
                aria-hidden="true"
              >
                <path
                  id="course-sauce-2-p"
                  d="M46 96c22 22 52 26 76 12 18-10 36-10 46 2-8-28-34-40-64-32-22 6-42 4-58 18z"
                  fill="currentColor"
                  fill-opacity=".5"
                />
                <circle
                  id="course-sauce-2-d1"
                  cx="140"
                  cy="126"
                  r="4"
                  fill="currentColor"
                  fill-opacity=".45"
                />
                <circle
                  id="course-sauce-2-d2"
                  cx="62"
                  cy="122"
                  r="3"
                  fill="currentColor"
                  fill-opacity=".38"
                />
              </svg>
              <div class="course-photo-mask" id="course-mask-2">
                <img
                  class="course-photo"
                  id="course-photo-2"
                  src="${course2Photo}"
                  alt="Foto kenangan sajian kedua Badriana dan Nurizzati Islamiyah"
                  data-optional="1"
                />
                <div class="course-photo-fallback" id="course-fb-2" hidden>
                  <svg
                    viewBox="0 0 48 48"
                    fill="none"
                    id="course-fb-ic-2"
                    aria-hidden="true"
                  >
                    <path
                      d="M10 38c2-10 8-16 14-16s12 6 14 16"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                    />
                    <path
                      d="M24 22c-6-4-8-10-4-14 3 4 8 6 4 14z"
                      stroke="currentColor"
                      stroke-width="1.6"
                    />
                  </svg>
                </div>
              </div>
              <svg
                class="course-plate-ring"
                id="course-ring-2"
                viewBox="0 0 300 300"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="150"
                  cy="150"
                  r="144"
                  stroke="currentColor"
                  stroke-opacity=".55"
                  stroke-width="1.3"
                  id="course-ring-2-a"
                />
                <circle
                  cx="150"
                  cy="150"
                  r="130"
                  stroke="currentColor"
                  stroke-opacity=".3"
                  stroke-width=".8"
                  stroke-dasharray="2 7"
                  id="course-ring-2-b"
                />
              </svg>
              <span class="course-no" id="course-no-2">II</span>
            </div>
            <div class="course-body reveal left d1" id="course-body-2">
              <p class="course-step" id="course-step-2">Sajian Kedua</p>
              <h3 class="course-name" id="course-name-2">${course2Title}</h3>
              <span class="course-dots" id="course-dots-2"></span>
              <p class="course-pairing" id="course-pairing-2">
                Dipadukan dengan teh melati hangat, 2021
              </p>
              <p class="course-story" id="course-story-2">${course2Story}</p>
            </div>
          </article>

          <article class="course" id="course-3">
            <div class="course-plate reveal pop" id="course-plate-3">
              <svg
                class="course-sauce"
                id="course-sauce-3"
                viewBox="0 0 200 200"
                fill="none"
                aria-hidden="true"
              >
                <path
                  id="course-sauce-3-p"
                  d="M52 140c10-32 36-50 66-44 22 4 38-4 44-18 4 34-20 62-56 66-24 2-42 2-54-4z"
                  fill="currentColor"
                  fill-opacity=".5"
                />
                <circle
                  id="course-sauce-3-d1"
                  cx="150"
                  cy="96"
                  r="4"
                  fill="currentColor"
                  fill-opacity=".45"
                />
                <circle
                  id="course-sauce-3-d2"
                  cx="66"
                  cy="94"
                  r="3"
                  fill="currentColor"
                  fill-opacity=".38"
                />
              </svg>
              <div class="course-photo-mask" id="course-mask-3">
                <img
                  class="course-photo"
                  id="course-photo-3"
                  src="${course3Photo}"
                  alt="Foto kenangan sajian ketiga Badriana dan Nurizzati Islamiyah"
                  data-optional="1"
                />
                <div class="course-photo-fallback" id="course-fb-3" hidden>
                  <svg
                    viewBox="0 0 48 48"
                    fill="none"
                    id="course-fb-ic-3"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 34h24M14 34c0-8 4-14 10-14s10 6 10 14"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                    />
                    <path
                      d="M24 16v-6"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
              </div>
              <svg
                class="course-plate-ring"
                id="course-ring-3"
                viewBox="0 0 300 300"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="150"
                  cy="150"
                  r="144"
                  stroke="currentColor"
                  stroke-opacity=".55"
                  stroke-width="1.3"
                  id="course-ring-3-a"
                />
                <circle
                  cx="150"
                  cy="150"
                  r="130"
                  stroke="currentColor"
                  stroke-opacity=".3"
                  stroke-width=".8"
                  stroke-dasharray="2 7"
                  id="course-ring-3-b"
                />
              </svg>
              <span class="course-no" id="course-no-3">III</span>
            </div>
            <div class="course-body reveal right d1" id="course-body-3">
              <p class="course-step" id="course-step-3">Sajian Ketiga</p>
              <h3 class="course-name" id="course-name-3">${course3Title}</h3>
              <span class="course-dots" id="course-dots-3"></span>
              <p class="course-pairing" id="course-pairing-3">
                Dipadukan dengan restu dua keluarga, 2024
              </p>
              <p class="course-story" id="course-story-3">${course3Story}</p>
            </div>
          </article>

          <article class="course" id="course-4">
            <div class="course-plate reveal pop" id="course-plate-4">
              <svg
                class="course-sauce"
                id="course-sauce-4"
                viewBox="0 0 200 200"
                fill="none"
                aria-hidden="true"
              >
                <path
                  id="course-sauce-4-p"
                  d="M44 110c26 14 54 10 74-10 14-14 30-18 42-10-14-26-42-30-68-12-18 12-36 16-48 32z"
                  fill="currentColor"
                  fill-opacity=".5"
                />
                <circle
                  id="course-sauce-4-d1"
                  cx="144"
                  cy="128"
                  r="4"
                  fill="currentColor"
                  fill-opacity=".45"
                />
                <circle
                  id="course-sauce-4-d2"
                  cx="60"
                  cy="86"
                  r="3"
                  fill="currentColor"
                  fill-opacity=".38"
                />
              </svg>
              <div class="course-photo-mask" id="course-mask-4">
                <img
                  class="course-photo"
                  id="course-photo-4"
                  src="${course4Photo}"
                  alt="Foto kenangan sajian keempat Badriana dan Nurizzati Islamiyah"
                  data-optional="1"
                />
                <div class="course-photo-fallback" id="course-fb-4" hidden>
                  <svg
                    viewBox="0 0 48 48"
                    fill="none"
                    id="course-fb-ic-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M24 40c8-6 14-12 14-19a7 7 0 00-14-3 7 7 0 00-14 3c0 7 6 13 14 19z"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <svg
                class="course-plate-ring"
                id="course-ring-4"
                viewBox="0 0 300 300"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="150"
                  cy="150"
                  r="144"
                  stroke="currentColor"
                  stroke-opacity=".55"
                  stroke-width="1.3"
                  id="course-ring-4-a"
                />
                <circle
                  cx="150"
                  cy="150"
                  r="130"
                  stroke="currentColor"
                  stroke-opacity=".3"
                  stroke-width=".8"
                  stroke-dasharray="2 7"
                  id="course-ring-4-b"
                />
              </svg>
              <span class="course-no" id="course-no-4">IV</span>
            </div>
            <div class="course-body reveal left d1" id="course-body-4">
              <p class="course-step" id="course-step-4">Sajian Penutup</p>
              <h3 class="course-name" id="course-name-4">${course4Title}</h3>
              <span class="course-dots" id="course-dots-4"></span>
              <p class="course-pairing" id="course-pairing-4">
                Dipadukan dengan satu kata: iya, 2026
              </p>
              <p class="course-story" id="course-story-4">${course4Story}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="sec-resep" data-section="resep">
      <div id="resep-outer" class="wrap center">
        <p id="resep-kicker" class="kicker reveal">Resep Keluarga</p>
        <h2 id="resep-head" class="htitle reveal d1">
          Yang kami masak <em>setiap hari</em>, bukan hanya hari ini
        </h2>
        <p id="resep-lede" class="lede reveal d2">
          Ketuk setiap bahan untuk memasukkannya ke panci. Doakan agar tak ada
          yang terlewat.
        </p>

        <div id="resep-card" class="paper ink reveal lift d3">
          <svg
            id="resep-pin"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
          >
            <circle
              id="resep-pin-head"
              cx="14"
              cy="10"
              r="8"
              fill="currentColor"
            />
            <circle
              id="resep-pin-shine"
              cx="11"
              cy="7"
              r="2.6"
              fill="#f4ecdf"
              fill-opacity=".55"
            />
            <path
              id="resep-pin-needle"
              d="M14 18v9"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
          <h3 id="resep-title">Resep Rumah Tangga Bahagia</h3>
          <p id="resep-yield">Untuk 2 porsi — disajikan seumur hidup</p>

          <div id="resep-grid">
            <div id="resep-ing-col">
              <p class="resep-h" id="resep-h-ing">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  id="resep-h-ing-ic"
                  aria-hidden="true"
                >
                  <path
                    d="M4 9h16M6 9l1.4 10.2A2 2 0 009.4 21h5.2a2 2 0 002-1.8L18 9M9 9V6a3 3 0 016 0v3"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Bahan-bahan
              </p>
              <ul id="resep-ing-list">
                <li id="resep-ing-item-1">
                  <button type="button" class="ing-chip" id="resep-ing-chip-1" aria-pressed="false">
                    <span class="ing-box" id="resep-ing-box-1">
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8.6l4 4L14 3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                    <span class="ing-txt" id="resep-ing-txt-1">200 gram kesabaran, disaring halus</span>
                  </button>
                </li>
                <li id="resep-ing-item-2">
                  <button type="button" class="ing-chip" id="resep-ing-chip-2" aria-pressed="false">
                    <span class="ing-box" id="resep-ing-box-2">
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8.6l4 4L14 3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                    <span class="ing-txt" id="resep-ing-txt-2">3 sendok makan tawa sebelum tidur</span>
                  </button>
                </li>
                <li id="resep-ing-item-3">
                  <button type="button" class="ing-chip" id="resep-ing-chip-3" aria-pressed="false">
                    <span class="ing-box" id="resep-ing-box-3">
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8.6l4 4L14 3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                    <span class="ing-txt" id="resep-ing-txt-3">1 genggam maaf yang tidak ditunda</span>
                  </button>
                </li>
                <li id="resep-ing-item-4">
                  <button type="button" class="ing-chip" id="resep-ing-chip-4" aria-pressed="false">
                    <span class="ing-box" id="resep-ing-box-4">
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8.6l4 4L14 3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                    <span class="ing-txt" id="resep-ing-txt-4">1 batang kejujuran, memarkan</span>
                  </button>
                </li>
                <li id="resep-ing-item-5">
                  <button type="button" class="ing-chip" id="resep-ing-chip-5" aria-pressed="false">
                    <span class="ing-box" id="resep-ing-box-5">
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8.6l4 4L14 3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                    <span class="ing-txt" id="resep-ing-txt-5">Secukupnya doa dari kedua keluarga</span>
                  </button>
                </li>
                <li id="resep-ing-item-6">
                  <button type="button" class="ing-chip" id="resep-ing-chip-6" aria-pressed="false">
                    <span class="ing-box" id="resep-ing-box-6">
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8.6l4 4L14 3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                    <span class="ing-txt" id="resep-ing-txt-6">Sejumput rindu untuk hari-hari sibuk</span>
                  </button>
                </li>
              </ul>
              <div id="resep-gauge">
                <div id="resep-pot">
                  <svg
                    viewBox="0 0 80 80"
                    fill="none"
                    id="resep-pot-svg"
                    aria-hidden="true"
                  >
                    <g id="pot-bubbles">
                      <circle cx="34" cy="30" r="2.6" fill="#7b8a5c" />
                      <circle cx="44" cy="26" r="2" fill="#7b8a5c" />
                      <circle cx="39" cy="22" r="1.6" fill="#7b8a5c" />
                    </g>
                    <rect
                      id="pot-fill"
                      x="18"
                      y="38"
                      width="44"
                      height="30"
                      rx="3"
                    />
                    <path
                      id="pot-body"
                      d="M16 36h48v22a8 8 0 01-8 8H24a8 8 0 01-8-8z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linejoin="round"
                    />
                    <path
                      id="pot-lid"
                      d="M12 36h56"
                      stroke="currentColor"
                      stroke-width="2.4"
                      stroke-linecap="round"
                    />
                    <path
                      id="pot-handle-l"
                      d="M16 42H9"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      id="pot-handle-r"
                      d="M64 42h7"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
                <p id="resep-progress">
                  <b id="resep-count">0</b> dari <b id="resep-total">6</b> bahan
                  sudah masuk panci
                </p>
              </div>
            </div>
            <div id="resep-step-col">
              <p class="resep-h" id="resep-h-step">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  id="resep-h-step-ic"
                  aria-hidden="true"
                >
                  <path
                    d="M5 20c0-4 3-7 7-7s7 3 7 7zM12 10a3 3 0 100-6 3 3 0 000 6zM3 20h18"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Cara Memasak
              </p>
              <ol id="resep-step-list">
                <li class="resep-step" id="resep-step-item-1">Panaskan niat di atas api kecil, jangan terburu-buru.</li>
                <li class="resep-step" id="resep-step-item-2">Masukkan kesabaran, aduk searah sampai harum.</li>
                <li class="resep-step" id="resep-step-item-3">Tuang tawa sedikit demi sedikit agar tidak pecah.</li>
                <li class="resep-step" id="resep-step-item-4">Bumbui dengan maaf setiap kali terasa gosong.</li>
                <li class="resep-step" id="resep-step-item-5">Sajikan hangat setiap hari, untuk berdua.</li>
              </ol>
            </div>
          </div>

          <div id="resep-stamp">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              id="resep-stamp-svg"
              aria-hidden="true"
            >
              <circle
                id="resep-stamp-o1"
                cx="50"
                cy="50"
                r="46"
                stroke="currentColor"
                stroke-width="2.4"
              />
              <circle
                id="resep-stamp-o2"
                cx="50"
                cy="50"
                r="39"
                stroke="currentColor"
                stroke-width="1"
                stroke-dasharray="3 4"
              />
            </svg>
            <span id="resep-stamp-txt">Siap Disajikan</span>
          </div>
        </div>
        <div id="resep-src-ing" hidden>200 gram kesabaran, disaring halus
3 sendok makan tawa sebelum tidur
1 genggam maaf yang tidak ditunda
1 batang kejujuran, memarkan
Secukupnya doa dari kedua keluarga
Sejumput rindu untuk hari-hari sibuk</div>
        <div id="resep-src-steps" hidden>Panaskan niat di atas api kecil, jangan terburu-buru.
Masukkan kesabaran, aduk searah sampai harum.
Tuang tawa sedikit demi sedikit agar tidak pecah.
Bumbui dengan maaf setiap kali terasa gosong.
Sajikan hangat setiap hari, untuk berdua.</div>
      </div>
    </section>
    <section id="sec-events" data-section="events">
      <div id="events-wrap" class="wrap center">
        <p id="events-kicker" class="kicker reveal">Reservasi Meja</p>
        <h2 id="events-title" class="htitle reveal d1">
          Dua kali duduk, <em>satu hari yang sama</em>
        </h2>

        <div id="chit-list">
          <article class="chit reveal lift d2" id="chit-1">
            <span class="chit-no" id="chit-1-no">Sesi 01</span>
            <span class="chit-punch" id="chit-1-punch-a"></span>
            <span class="chit-punch b" id="chit-1-punch-b"></span>
            <svg
              class="chit-ic"
              id="chit-1-ic"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
            >
              <circle
                id="chit-1-ring-a"
                cx="19"
                cy="29"
                r="11"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <circle
                id="chit-1-ring-b"
                cx="30"
                cy="29"
                r="11"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <path
                id="chit-1-spark"
                d="M24 8v6m-5-3l2 3m8-3l-2 3"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
            <h3 class="chit-name" id="chit-1-name">Akad Nikah</h3>
            <svg
              class="chit-rule"
              id="chit-1-rule"
              viewBox="0 0 240 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                id="chit-1-rule-l"
                d="M0 5h96"
                stroke="currentColor"
                stroke-width=".9"
                stroke-dasharray="2 4"
              />
              <path
                id="chit-1-rule-r"
                d="M144 5h96"
                stroke="currentColor"
                stroke-width=".9"
                stroke-dasharray="2 4"
              />
              <path
                id="chit-1-rule-m"
                d="M120 1l4 4-4 4-4-4z"
                stroke="currentColor"
                stroke-width="1"
              />
            </svg>
            <div class="chit-rows" id="chit-1-rows">
              <div class="chit-row" id="chit-1-row-date">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  id="chit-1-ic-date"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <path
                    d="M3 10h18M8 3v4m8-4v4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
                <div id="chit-1-date-box">
                  <p class="chit-lb" id="chit-1-date-lb">Tanggal</p>
                  <p class="chit-val" id="chit-1-date">${akadDateFormatted}</p>
                </div>
              </div>
              <div class="chit-row" id="chit-1-row-time">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  id="chit-1-ic-time"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <path
                    d="M12 7v5l3 2"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
                <div id="chit-1-time-box">
                  <p class="chit-lb" id="chit-1-time-lb">Waktu</p>
                  <p class="chit-val" id="chit-1-time">${akadTime}</p>
                </div>
              </div>
              <div class="chit-row" id="chit-1-row-place">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  id="chit-1-ic-place"
                >
                  <path
                    d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="10"
                    r="2.6"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                </svg>
                <div id="chit-1-place-box">
                  <p class="chit-lb" id="chit-1-place-lb">Tempat</p>
                  <p class="chit-val" id="chit-1-venue">${akadVenue}</p>
                  <p
                    class="chit-val"
                    id="chit-1-address"
                    style="font-size: 14px; color: #5d5142"
                  >${akadAddress}</p>
                </div>
              </div>
            </div>
            <p class="chit-note" id="chit-1-note">
              Mohon hadir 15 menit lebih awal — kami ingin semua kursi terisi
              saat sajian pertama keluar.
            </p>
          </article>

          <div id="chit-link" aria-hidden="true"></div>

          <article
            class="chit reveal lift d3 is-on"
            id="chit-2"
            data-date="${resepsiDateRaw || '2026-10-30'}"
            data-time="${(data?.jamResepsi || data?.waktuResepsi || '11:00').slice(0, 5)}"
          >
            <span class="chit-no" id="chit-2-no">Sesi 02</span>
            <span class="chit-punch" id="chit-2-punch-a"></span>
            <span class="chit-punch b" id="chit-2-punch-b"></span>
            <svg
              class="chit-ic"
              id="chit-2-ic"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
            >
              <circle
                id="chit-2-plate"
                cx="24"
                cy="26"
                r="13"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <circle
                id="chit-2-plate-in"
                cx="24"
                cy="26"
                r="7"
                stroke="currentColor"
                stroke-width="1"
                stroke-dasharray="2 4"
              />
              <path
                id="chit-2-fork"
                d="M8 8v8m3-8v8m-3 4v16m0-20h3v20"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                id="chit-2-knife"
                d="M40 8c2 4 2 10 0 14v14"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
            <h3 class="chit-name" id="chit-2-name">Jamuan Resepsi</h3>
            <svg
              class="chit-rule"
              id="chit-2-rule"
              viewBox="0 0 240 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                id="chit-2-rule-l"
                d="M0 5h96"
                stroke="currentColor"
                stroke-width=".9"
                stroke-dasharray="2 4"
              />
              <path
                id="chit-2-rule-r"
                d="M144 5h96"
                stroke="currentColor"
                stroke-width=".9"
                stroke-dasharray="2 4"
              />
              <path
                id="chit-2-rule-m"
                d="M120 1l4 4-4 4-4-4z"
                stroke="currentColor"
                stroke-width="1"
              />
            </svg>
            <div class="chit-rows" id="chit-2-rows">
              <div class="chit-row" id="chit-2-row-date">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  id="chit-2-ic-date"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <path
                    d="M3 10h18M8 3v4m8-4v4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
                <div id="chit-2-date-box">
                  <p class="chit-lb" id="chit-2-date-lb">Tanggal</p>
                  <p class="chit-val" id="chit-2-date">${resepsiDateFormatted}</p>
                </div>
              </div>
              <div class="chit-row" id="chit-2-row-time">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  id="chit-2-ic-time"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <path
                    d="M12 7v5l3 2"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
                <div id="chit-2-time-box">
                  <p class="chit-lb" id="chit-2-time-lb">Waktu</p>
                  <p class="chit-val" id="chit-2-time">${resepsiTime}</p>
                </div>
              </div>
              <div class="chit-row" id="chit-2-row-place">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  id="chit-2-ic-place"
                >
                  <path
                    d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="10"
                    r="2.6"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                </svg>
                <div id="chit-2-place-box">
                  <p class="chit-lb" id="chit-2-place-lb">Tempat</p>
                  <p class="chit-val" id="chit-2-venue">${resepsiVenue}</p>
                </div>
              </div>
            </div>
            <p class="chit-note" id="chit-2-note">Makan malam bersama dan ramah tamah</p>
          </article>
        </div>
      </div>
    </section>

    <section id="sec-rundown" data-section="rundown">
      <div id="rundown-wrap" class="wrap">
        <div id="rundown-head" class="center">
          <p id="rundown-kicker" class="kicker reveal">Papan Pesanan Dapur</p>
          <h2 id="rundown-title" class="htitle reveal d1">
            Urutan sajian <em>sepanjang hari</em>
          </h2>
          <p id="rundown-lede" class="lede reveal d2">
            Setiap pesanan dijepit di rel, satu per satu, sampai semua naik ke
            meja.
          </p>
        </div>
        <div id="rundown-rail"></div>
      </div>
    </section>

    <section id="sec-dresscode" data-section="dresscode">
      <div id="dc-wrap" class="wrap center">
        <p id="dc-kicker" class="kicker reveal">Etiket Meja</p>
        <h2 id="dc-title" class="htitle reveal d1">
          Satu meja, <em>satu palet warna</em>
        </h2>
        <div id="dc-setting" class="reveal pop d2">
          <svg
            id="dc-plate-svg"
            viewBox="0 0 300 300"
            fill="none"
            aria-hidden="true"
          >
            <circle
              id="dc-plate-a"
              cx="150"
              cy="150"
              r="128"
              stroke="currentColor"
              stroke-opacity=".5"
              stroke-width="1.4"
            />
            <circle
              id="dc-plate-b"
              cx="150"
              cy="150"
              r="112"
              stroke="currentColor"
              stroke-opacity=".28"
              stroke-width=".9"
            />
            <circle
              id="dc-plate-c"
              cx="150"
              cy="150"
              r="92"
              stroke="currentColor"
              stroke-opacity=".22"
              stroke-width=".8"
              stroke-dasharray="2 8"
            />
          </svg>
          <svg id="dc-fork" viewBox="0 0 30 160" fill="none" aria-hidden="true">
            <path
              id="dc-fork-p"
              d="M8 6v34m7-34v34m7-34v34M8 40h14v10a7 7 0 01-7 7 7 7 0 01-7-7zm7 17v97"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            id="dc-knife"
            viewBox="0 0 30 160"
            fill="none"
            aria-hidden="true"
          >
            <path
              id="dc-knife-p"
              d="M15 6c7 12 7 34 0 46v102"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
            />
          </svg>
          <div id="dc-napkin"><span id="dc-napkin-mono">&amp;</span></div>
        </div>
        <div id="dc-chips" class="reveal d3">
          <span
            class="dc-chip"
            id="dc-chip-1"
            data-color="#3f4a38"
            style="background:#3f4a38"
          ></span>
          <span
            class="dc-chip"
            id="dc-chip-2"
            data-color="#c69a4e"
            style="background:#c69a4e"
          ></span>
          <span
            class="dc-chip"
            id="dc-chip-3"
            data-color="#efe3cd"
            style="background:#efe3cd"
          ></span>
        </div>
        <p id="dc-text" class="lede reveal d4">Kami menata meja dengan nuansa hangat. Mohon hadir dengan busana rapi bernuansa hijau zaitun, kuningan, dan krem — agar setiap foto terasa seperti satu piring yang selaras.</p>
      </div>
    </section>

    <section id="sec-cicip" data-section="cicip">
      <div id="cicip-wrap" class="wrap center">
        <p id="cicip-kicker" class="kicker reveal">Uji Rasa Tamu</p>
        <h2 id="cicip-title" class="htitle reveal d1">
          Rasa apa <em>yang Anda bawa</em> malam itu?
        </h2>
        <p id="cicip-lede" class="lede reveal d2">
          Pilih satu. Kami akan menyisihkan satu porsi khusus di meja Anda.
        </p>

        <div id="cicip-choices">
          <button
            type="button"
            class="cicip-btn reveal pop d2"
            id="cicip-btn-manis"
            data-flavor="manis"
            aria-pressed="false"
          >
            <svg
              class="cicip-ic"
              viewBox="0 0 40 40"
              fill="none"
              id="cicip-ic-manis"
              aria-hidden="true"
            >
              <path
                d="M8 30c0-8 5-14 12-14s12 6 12 14z"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linejoin="round"
              />
              <path
                d="M20 16c-4-3-5-8-2-11 2 3 6 5 2 11z"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linejoin="round"
              />
              <path
                d="M6 30h28"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
              />
            </svg>
            <span class="cicip-lb">Manis</span>
          </button>
          <button
            type="button"
            class="cicip-btn reveal pop d3"
            id="cicip-btn-gurih"
            data-flavor="gurih"
            aria-pressed="false"
          >
            <svg
              class="cicip-ic"
              viewBox="0 0 40 40"
              fill="none"
              id="cicip-ic-gurih"
              aria-hidden="true"
            >
              <path
                d="M7 20h26a13 13 0 01-26 0z"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linejoin="round"
              />
              <path
                d="M5 20h30"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
              />
              <path
                d="M14 12c0-3 2-4 2-6m4 6c0-3 2-4 2-6m4 6c0-3 2-4 2-6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
            <span class="cicip-lb">Gurih</span>
          </button>
          <button
            type="button"
            class="cicip-btn reveal pop d4"
            id="cicip-btn-pedas"
            data-flavor="pedas"
            aria-pressed="false"
          >
            <svg
              class="cicip-ic"
              viewBox="0 0 40 40"
              fill="none"
              id="cicip-ic-pedas"
              aria-hidden="true"
            >
              <path
                d="M22 10c8 0 12 7 10 14-2 6-9 9-16 6-5-2-7-6-6-8 2-3 6-1 8-4s0-8 4-8z"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linejoin="round"
              />
              <path
                d="M22 10c0-3 3-4 6-3"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
              />
            </svg>
            <span class="cicip-lb">Pedas</span>
          </button>
          <button
            type="button"
            class="cicip-btn reveal pop d5"
            id="cicip-btn-segar"
            data-flavor="segar"
            aria-pressed="false"
          >
            <svg
              class="cicip-ic"
              viewBox="0 0 40 40"
              fill="none"
              id="cicip-ic-segar"
              aria-hidden="true"
            >
              <path
                d="M12 8h16l-2 12a6 6 0 01-12 0z"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linejoin="round"
              />
              <path
                d="M20 26v8m-5 0h10"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
              />
              <circle
                cx="27"
                cy="11"
                r="3"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
            <span class="cicip-lb">Segar</span>
          </button>
        </div>

        <div id="cicip-result" aria-live="polite">
          <div id="cicip-inner">
            <div id="cicip-plate">
              <svg
                id="cicip-plate-ring"
                viewBox="0 0 120 120"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="56"
                  stroke="currentColor"
                  stroke-opacity=".7"
                  stroke-width="1.4"
                  id="cicip-ring-a"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  stroke="currentColor"
                  stroke-opacity=".4"
                  stroke-width=".8"
                  stroke-dasharray="2 6"
                  id="cicip-ring-b"
                />
              </svg>
              <svg
                id="cicip-plate-food"
                viewBox="0 0 120 120"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="60"
                  cy="56"
                  r="15"
                  fill="#7d2231"
                  fill-opacity=".8"
                />
                <circle
                  cx="44"
                  cy="70"
                  r="6"
                  fill="#7b8a5c"
                  fill-opacity=".85"
                />
                <circle
                  cx="76"
                  cy="70"
                  r="5"
                  fill="#c69a4e"
                  fill-opacity=".9"
                />
                <circle
                  cx="60"
                  cy="80"
                  r="3.4"
                  fill="#5d5142"
                  fill-opacity=".8"
                />
                <path
                  d="M34 44c8-6 18-8 26-6"
                  stroke="#7d2231"
                  stroke-opacity=".6"
                  stroke-width="2.4"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <p id="cicip-serve">Disajikan untuk Anda</p>
            <h3 id="cicip-dish">&mdash;</h3>
            <p id="cicip-note">Pilih salah satu rasa di atas.</p>
            <div id="cicip-seal">
              <svg
                viewBox="0 0 74 74"
                fill="none"
                id="cicip-seal-svg"
                aria-hidden="true"
              >
                <circle
                  cx="37"
                  cy="37"
                  r="34"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-dasharray="4 5"
                />
                <circle
                  cx="37"
                  cy="37"
                  r="27"
                  stroke="currentColor"
                  stroke-width=".9"
                />
              </svg>
              <span id="cicip-seal-mono">&amp;</span>
            </div>
          </div>
        </div>

        <div id="cicip-data" hidden>
          <span
            id="cicip-data-manis"
            data-flavor="manis"
            data-name="Klapertart Pengantin"
            >Untuk Anda yang percaya bahwa akhir bahagia memang harus manis. Satu porsi sudah kami sisihkan di meja Anda.</span
          >
          <span
            id="cicip-data-gurih"
            data-flavor="gurih"
            data-name="Sup Iga Restu"
            >Hangat, dalam, dan selalu ditunggu. Cocok untuk tamu yang datang membawa pelukan lebih dulu.</span
          >
          <span
            id="cicip-data-pedas"
            data-flavor="pedas"
            data-name="Sambal Matah Nekat"
            >Berani, jujur, sedikit membuat mata berair — persis seperti keputusan kami untuk menikah.</span
          >
          <span
            id="cicip-data-segar"
            data-flavor="segar"
            data-name="Es Serbat Kemangi"
            >Ringan dan menenangkan, untuk tamu yang membawa kabar baik dan cerita yang enteng.</span
          >
        </div>
      </div>
    </section>
    <section id="sec-venue" data-section="venue">
      <div id="venue-wrap" class="wrap center">
        <p id="venue-kicker" class="kicker reveal">Lokasi Dapur Kami</p>
        <h2 id="venue-title" class="htitle reveal d1">
          Tempat semua ini <em>disajikan</em>
        </h2>
        <div id="venue-card" class="reveal lift d2">
          <svg
            id="venue-corner-tl"
            viewBox="0 0 34 34"
            fill="none"
            aria-hidden="true"
          >
            <path
              id="venue-corner-tl-p"
              d="M0 34V0h34"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              id="venue-corner-tl-q"
              d="M6 26V6h20"
              stroke="currentColor"
              stroke-opacity=".45"
              stroke-width="1"
            />
          </svg>
          <svg
            id="venue-corner-br"
            viewBox="0 0 34 34"
            fill="none"
            aria-hidden="true"
          >
            <path
              id="venue-corner-br-p"
              d="M0 34V0h34"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              id="venue-corner-br-q"
              d="M6 26V6h20"
              stroke="currentColor"
              stroke-opacity=".45"
              stroke-width="1"
            />
          </svg>
          <svg
            id="venue-compass"
            viewBox="0 0 56 56"
            fill="none"
            aria-hidden="true"
          >
            <circle
              id="venue-compass-ring"
              cx="28"
              cy="28"
              r="25"
              stroke="currentColor"
              stroke-width="1.4"
            />
            <circle
              id="venue-compass-ring2"
              cx="28"
              cy="28"
              r="20"
              stroke="currentColor"
              stroke-opacity=".4"
              stroke-width=".8"
              stroke-dasharray="2 5"
            />
            <path
              id="venue-needle"
              d="M28 12l5 14-5 4-5-4z"
              fill="currentColor"
              fill-opacity=".85"
            />
            <circle
              id="venue-compass-dot"
              cx="28"
              cy="28"
              r="2.2"
              fill="currentColor"
            />
          </svg>
          <h3 id="venue-name">${resepsiVenue}</h3>
          <p id="venue-address">${resepsiAddress}</p>
          <div id="venue-map-frame">
            <iframe
              id="venue-map"
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCP0LjsvmACU9PshCUvqPg0U0AvWBw1TNo&amp;q=place_id:ChIJVX_KZ1YABDQR8TZ6STtir8M"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Peta lokasi wwwtc mall"
            ></iframe>
            <div id="venue-map-glare"></div>
          </div>
          <a
            id="venue-btn"
            href="${mapUrl}"
            target="_blank"
            rel="noopener"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              id="venue-btn-ic"
              aria-hidden="true"
            >
              <path
                d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linejoin="round"
              />
              <circle
                cx="12"
                cy="10"
                r="2.6"
                stroke="currentColor"
                stroke-width="1.6"
              />
            </svg>
            Buka Peta Menuju Meja
          </a>
        </div>
      </div>
    </section>

    <section id="sec-gallery" data-section="gallery">
      <div id="gallery-wrap" class="wrap center">
        <p id="gallery-kicker" class="kicker reveal">Galeri Sajian</p>
        <h2 id="gallery-title" class="htitle reveal d1">
          Cetakan foto yang <em>dijepit di papan pass</em>
        </h2>
        <p id="gallery-lede" class="lede reveal d2">
          Ketuk satu cetakan untuk melihatnya lebih besar.
        </p>
        <div id="gallery-grid"></div>
        <p id="gallery-empty">
          Album dapur masih kosong — foto menyusul setelah sesi pemotretan.
        </p>
      </div>
    </section>

    <section id="sec-gifts" data-section="gifts">
      <div id="gifts-wrap" class="wrap center">
        <p id="gifts-kicker" class="kicker reveal">Kotak Tip Dapur</p>
        <h2 id="gifts-title" class="htitle reveal d1">
          Untuk <em>dapur kami</em> nanti
        </h2>
        <p id="gift-note" class="lede reveal d2">Kehadiran Anda sudah menjadi bumbu utamanya. Namun bila ingin menambah sedikit garam untuk dapur kami kelak, kotak tip ini kami sediakan dengan senang hati.</p>
        ${bankCardHtml}
        <div id="gift-jar" class="reveal pop d3">
          <svg
            viewBox="0 0 96 110"
            fill="none"
            id="gift-jar-svg"
            aria-hidden="true"
          >
            <circle
              id="gift-coin"
              cx="48"
              cy="26"
              r="11"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
            />
            <path
              id="gift-jar-body"
              d="M20 44h56l-5 54a8 8 0 01-8 7H33a8 8 0 01-8-7z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              id="gift-jar-lip"
              d="M14 44h68"
              stroke="currentColor"
              stroke-width="2.6"
              stroke-linecap="round"
            />
            <path
              id="gift-jar-slot"
              d="M36 38h24"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
            />
            <path
              id="gift-jar-label"
              d="M32 68h32M32 78h22"
              stroke="currentColor"
              stroke-opacity=".55"
              stroke-width="1.6"
              stroke-linecap="round"
            />
        </div>
      </div>
    </section>

    <section id="sec-rsvp" data-section="rsvp">
      <div id="rsvp-wrap" class="wrap center">
        <p id="rsvp-kicker" class="kicker reveal">Konfirmasi Reservasi</p>
        <h2 id="rsvp-title" class="htitle reveal d1">
          Kami hitung <em>kursinya</em> dari sini
        </h2>
        <div id="rsvp-card" class="form-card reveal lift d2">
          <p id="rsvp-seat-note">
            Satu kursi kosong membuat satu sajian kembali ke dapur. Beri tahu
            kami, ya.
          </p>
          <form data-wedivo="rsvp" class="w-form" id="rsvp-form" onsubmit="return false;">
            <p class="f-lb" id="rsvp-lb-name">Nama Tamu</p>
            <input
              name="name"
              id="rsvp-name"
              placeholder="Nama Anda"
              required
            />
            <p class="f-lb" id="rsvp-lb-status">Konfirmasi Kehadiran</p>
            <div class="status-row" id="rsvp-status-row">
              <button
                type="button"
                class="status-btn"
                data-wedivo-status="attending"
                id="rsvp-yes"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  id="rsvp-yes-ic"
                >
                  <path
                    d="M4 13l5 5L20 7"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Hadir
              </button>
              <button
                type="button"
                class="status-btn"
                data-wedivo-status="maybe"
                id="rsvp-maybe"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  id="rsvp-maybe-ic"
                >
                  <path
                    d="M9 9a3 3 0 115 2.2c-1 .9-2 1.6-2 3"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                  <circle cx="12" cy="18" r="1.2" fill="currentColor" />
                </svg>
                Diusahakan
              </button>
              <button
                type="button"
                class="status-btn"
                data-wedivo-status="not_attending"
                id="rsvp-no"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  id="rsvp-no-ic"
                >
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                </svg>
                Berhalangan
              </button>
            </div>
            <p class="f-lb" id="rsvp-lb-pax">Jumlah Kursi</p>
            <input
              name="pax"
              id="rsvp-pax"
              type="number"
              min="1"
              max="20"
              value="1"
            />
            <p class="f-lb" id="rsvp-lb-msg">Pesan untuk Dapur (opsional)</p>
            <textarea
              name="message"
              id="rsvp-message"
              placeholder="Alergi, pantangan, atau sekadar salam hangat..."
            ></textarea>
            <div class="form-err" id="rsvp-err">
              Mohon pilih status kehadiran Anda terlebih dahulu.
            </div>
            <button type="submit" class="submit-btn" id="rsvp-submit">
              Kirim Konfirmasi
            </button>
          </form>
          <div class="form-done" id="rsvp-done">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              id="rsvp-done-ic"
              aria-hidden="true"
            >
              <circle
                cx="24"
                cy="24"
                r="21"
                stroke="currentColor"
                stroke-width="1.6"
              />
              <path
                d="M15 24.5l6.5 6.5L34 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <b>Kursi Anda tercatat</b>
            <span>Sampai bertemu di meja. Kami siapkan sajiannya.</span>
          </div>
          <button
            type="button"
            data-wedivo="checkin-cta"
            class="ghost-btn"
            id="checkin-cta"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              id="checkin-ic"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1.4"
                stroke="currentColor"
                stroke-width="1.6"
              />
              <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1.4"
                stroke="currentColor"
                stroke-width="1.6"
              />
              <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1.4"
                stroke="currentColor"
                stroke-width="1.6"
              />
              <path
                d="M14 14h3v3m4 0v4h-7v-3"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Check-in di Meja Resepsionis
          </button>
          <p id="checkin-hint">
            Tekan tombol ini saat Anda tiba di lokasi untuk memindai kode meja.
          </p>
        </div>

        <div id="rsvp-board-comments" style="max-width: 580px; margin: 38px auto 0; width: 100%;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; border-bottom: 1px solid rgba(198, 154, 78, 0.35); padding-bottom: 10px;">
            <h3 style="font-size: 13px; letter-spacing: 0.16em; text-transform: uppercase; color: #ecd199; margin: 0; display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="color: #c69a4e;">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Daftar Kursi &amp; Catatan Tamu
            </h3>
            <span id="rsvp-comments-count" style="font-size: 13.5px; color: #b6a894; font-style: italic;">
              0 Konfirmasi
            </span>
          </div>
          <div id="rsvp-comments-list" style="display: flex; flex-direction: column; gap: 14px;"></div>
          <div id="rsvp-comments-empty" style="text-align: center; padding: 24px 16px; color: #b6a894; font-style: italic; background: rgba(30, 25, 20, 0.6); border-radius: 8px; border: 1px dashed rgba(198, 154, 78, 0.35);">
            Belum ada konfirmasi kursi yang tercatat. Beri tahu kami kehadiran Anda!
          </div>
          <button id="rsvp-more-btn" type="button" class="submit-btn" style="margin-top: 16px; display: none; background: transparent; border: 1px solid #c69a4e; color: #ecd199; width: 100%; border-radius: 4px; padding: 10px;">
            Muat Konfirmasi Lainnya
          </button>
        </div>
      </div>
    </section>

    <section id="sec-wishes" data-section="wishes">
      <div id="wishes-wrap" class="wrap center">
        <p id="wishes-kicker" class="kicker reveal">Buku Tamu Dapur</p>
        <h2 id="wishes-title" class="htitle reveal d1">
          Tinggalkan <em>catatan</em> untuk kami
        </h2>
        <div id="wishes-card" class="form-card reveal lift d2">
          <form data-wedivo="comments-form" class="w-form" id="comments-form" onsubmit="return false;">
            <p class="f-lb" id="wishes-lb-name">Nama Anda</p>
            <input
              name="name"
              id="wishes-name"
              placeholder="Nama Anda"
              required
            />
            <p class="f-lb" id="wishes-lb-msg">Catatan</p>
            <textarea
              name="message"
              id="wishes-message"
              placeholder="Tulis doa atau pesan hangat di sini..."
              required
            ></textarea>
            <div class="form-err" id="wishes-err">
              Nama dan catatan wajib diisi, ya.
            </div>
            <button type="submit" class="submit-btn" id="wishes-submit">
              Jepit di Papan
            </button>
          </form>
          <div class="form-done" id="wishes-done">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              id="wishes-done-ic"
              aria-hidden="true"
            >
              <circle
                cx="24"
                cy="24"
                r="21"
                stroke="currentColor"
                stroke-width="1.6"
              />
              <path
                d="M15 24.5l6.5 6.5L34 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <b>Catatan terjepit</b>
            <span>Terima kasih, pesan Anda kami baca di dapur.</span>
          </div>
        </div>
        <div id="comments-empty" style="text-align: center; padding: 24px 16px; color: #b6a894; font-style: italic; background: rgba(30, 25, 20, 0.6); border-radius: 8px; border: 1px dashed rgba(198, 154, 78, 0.35); display: none; margin-top: 24px;">
          Belum ada catatan yang terjepit di papan. Jadilah yang pertama meninggalkan pesan hangat!
        </div>
        <div data-wedivo="comments-list" id="comments-list"></div>
        <template data-wedivo="comment-template" id="comment-template">
          <div class="comment-card">
            <p class="comment-name" data-field="name"></p>
            <p class="comment-message" data-field="message"></p>
            <p class="comment-date" data-field="date"></p>
          </div>
        </template>
        <button data-wedivo="comments-more" id="comments-more" type="button">
          Muat Catatan Lainnya
        </button>
      </div>
    </section>

    <footer id="sec-closing" data-section="closing">
      <div id="closing-wrap" class="wrap center">
        <svg
          id="closing-orn"
          viewBox="0 0 132 34"
          fill="none"
          class="reveal drop"
          aria-hidden="true"
        >
          <path
            id="closing-orn-l"
            d="M0 17h44"
            stroke="currentColor"
            stroke-opacity=".6"
            stroke-width="1"
          />
          <path
            id="closing-orn-r"
            d="M88 17h44"
            stroke="currentColor"
            stroke-opacity=".6"
            stroke-width="1"
          />
          <path
            id="closing-orn-leaf-l"
            d="M56 17c0-6 4-11 10-11-4 4-6 7-6 11s2 7 6 11c-6 0-10-5-10-11z"
            stroke="currentColor"
            stroke-width="1.1"
          />
          <path
            id="closing-orn-leaf-r"
            d="M76 17c0-6-4-11-10-11 4 4 6 7 6 11s-2 7-6 11c6 0 10-5 10-11z"
            stroke="currentColor"
            stroke-width="1.1"
          />
          <circle
            id="closing-orn-dot"
            cx="66"
            cy="17"
            r="2.2"
            fill="currentColor"
          />
        </svg>
        <p id="closing-msg" class="reveal d1">Terima kasih telah mencicipi kisah kami dari sajian pertama sampai habis. Pintu dapur kami akan selalu terbuka untuk Anda.</p>
        <p id="closing-thanks" class="reveal d2">
          Dengan hangat dari dapur kami
        </p>
        <p id="closing-names" class="reveal pop d3">
          ${groom} &amp; ${bride}
        </p>
        <svg
          id="closing-spoons"
          viewBox="0 0 96 40"
          fill="none"
          class="reveal d4"
          aria-hidden="true"
        >
          <g id="closing-spoon-l">
            <path
              id="closing-spoon-l-handle"
              d="M28 36L56 13"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
            <ellipse
              id="closing-spoon-l-bowl"
              cx="60"
              cy="9"
              rx="4.6"
              ry="6.4"
              transform="rotate(39 60 9)"
              stroke="currentColor"
              stroke-width="1.4"
            />
          </g>
          <g id="closing-spoon-r">
            <path
              id="closing-spoon-r-handle"
              d="M68 36L40 13"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
            <ellipse
              id="closing-spoon-r-bowl"
              cx="36"
              cy="9"
              rx="4.6"
              ry="6.4"
              transform="rotate(-39 36 9)"
              stroke="currentColor"
              stroke-width="1.4"
            />
          </g>
        </svg>
        <div id="closing-flame" class="reveal d5"></div>
        <div id="closing-candle" class="reveal d5"></div>
      </div>
    </footer>

    <nav data-wedivo="nav" id="nav-pass" aria-label="Navigasi bagian undangan">
      <div id="nav-bar" aria-hidden="true"></div>
      <div id="nav-rail">
        <button
          type="button"
          class="nav-chit"
          id="nav-hero"
          data-nav-target="hero"
        >
          <span class="nav-ic" id="nav-ic-hero"
            ><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 11l9-7 9 7M5 10v10h14V10"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              /></svg
          ></span>
          <span class="nav-lb" id="nav-lb-hero">Pintu</span>
        </button>
        <button
          type="button"
          class="nav-chit"
          id="nav-couple"
          data-nav-target="couple"
        >
          <span class="nav-ic" id="nav-ic-couple"
            ><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle
                cx="9"
                cy="14"
                r="5.4"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <circle
                cx="15"
                cy="14"
                r="5.4"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M12 5v3"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              /></svg
          ></span>
          <span class="nav-lb" id="nav-lb-couple">Bahan</span>
        </button>
        <button
          type="button"
          class="nav-chit"
          id="nav-tasting"
          data-nav-target="tasting"
        >
          <span class="nav-ic" id="nav-ic-tasting"
            ><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle
                cx="12"
                cy="12"
                r="8.4"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <circle
                cx="12"
                cy="12"
                r="4"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-dasharray="2 3"
              /></svg
          ></span>
          <span class="nav-lb" id="nav-lb-tasting">Degustasi</span>
        </button>
        <button
          type="button"
          class="nav-chit"
          id="nav-resep"
          data-nav-target="resep"
        >
          <span class="nav-ic" id="nav-ic-resep"
            ><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 9h14v8a3 3 0 01-3 3H8a3 3 0 01-3-3zM3 9h18M8 5c0-1 1-1.6 1-2.6M12 5c0-1 1-1.6 1-2.6M16 5c0-1 1-1.6 1-2.6"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              /></svg
          ></span>
          <span class="nav-lb" id="nav-lb-resep">Resep</span>
        </button>
        <button
          type="button"
          class="nav-chit"
          id="nav-events"
          data-nav-target="events"
        >
          <span class="nav-ic" id="nav-ic-events"
            ><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="3"
                y="5"
                width="18"
                height="16"
                rx="2"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M3 10h18M8 3v4m8-4v4"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              /></svg
          ></span>
          <span class="nav-lb" id="nav-lb-events">Reservasi</span>
        </button>
        <button
          type="button"
          class="nav-chit"
          id="nav-rundown"
          data-nav-target="rundown"
        >
          <span class="nav-ic" id="nav-ic-rundown"
            ><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 6h16M7 6v14h10V6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 11h4M10 15h4"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linecap="round"
              /></svg
          ></span>
          <span class="nav-lb" id="nav-lb-rundown">Pesanan</span>
        </button>
        <button
          type="button"
          class="nav-chit"
          id="nav-cicip"
          data-nav-target="cicip"
        >
          <span class="nav-ic" id="nav-ic-cicip"
            ><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M8 3h8l-1 8a3 3 0 01-6 0z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
              <path
                d="M12 14v7m-3 0h6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              /></svg
          ></span>
          <span class="nav-lb" id="nav-lb-cicip">Uji Rasa</span>
        </button>
        <button
          type="button"
          class="nav-chit"
          id="nav-venue"
          data-nav-target="venue"
        >
          <span class="nav-ic" id="nav-ic-venue"
            ><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
              <circle
                cx="12"
                cy="10"
                r="2.4"
                stroke="currentColor"
                stroke-width="1.4"
              /></svg
          ></span>
          <span class="nav-lb" id="nav-lb-venue">Lokasi</span>
        </button>
        <button
          type="button"
          class="nav-chit"
          id="nav-gallery"
          data-nav-target="gallery"
        >
          <span class="nav-ic" id="nav-ic-gallery"
            ><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M6 16l4-4 3 3 2-2 3 3"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="9" cy="9.5" r="1.3" fill="currentColor" /></svg
          ></span>
          <span class="nav-lb" id="nav-lb-gallery">Galeri</span>
        </button>
        <button
          type="button"
          class="nav-chit"
          id="nav-gifts"
          data-nav-target="gifts"
        >
          <span class="nav-ic" id="nav-ic-gifts"
            ><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 10h14l-1.2 10H6.2z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
              <path
                d="M3.5 10h17M9 8h6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <circle
                cx="12"
                cy="5"
                r="2"
                stroke="currentColor"
                stroke-width="1.4"
              /></svg
          ></span>
          <span class="nav-lb" id="nav-lb-gifts">Tip</span>
        </button>
        <button
          type="button"
          class="nav-chit"
          id="nav-rsvp"
          data-nav-target="rsvp"
        >
          <span class="nav-ic" id="nav-ic-rsvp"
            ><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="3"
                y="6"
                width="18"
                height="12"
                rx="2"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M6 10l6 4 6-4"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              /></svg
          ></span>
          <span class="nav-lb" id="nav-lb-rsvp">RSVP</span>
        </button>
        <button
          type="button"
          class="nav-chit"
          id="nav-wishes"
          data-nav-target="wishes"
        >
          <span class="nav-ic" id="nav-ic-wishes"
            ><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 5h16v11H9l-5 4z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
              <path
                d="M8 9h8M8 12h5"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linecap="round"
              /></svg
          ></span>
          <span class="nav-lb" id="nav-lb-wishes">Catatan</span>
        </button>
      </div>
    </nav>

    <div id="music-dock"${!audioUrl ? ' style="display: none;"' : ''}>
      <audio
        id="music-audio"
        loop
        preload="none"
        ${audioUrl ? `src="${audioUrl}"` : ''}
      ></audio>
      <button
        type="button"
        id="music-btn"
        aria-label="Nyalakan atau matikan musik latar"
      >
        <span id="music-wave" aria-hidden="true"></span>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" id="music-ic">
          <path
            id="music-candle"
            d="M9.5 20h5M12 20v-8"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            id="music-note"
            d="M15 6.5v6a2.4 2.4 0 11-1.6-2.3V5l4-1v5.6"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="music-flame"
            d="M12 11c2-1.4 2.6-3.2 1-5 .6 2-2.6 1.8-1 5z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>

    <div id="viewer" aria-hidden="true">
      <button type="button" id="viewer-close" aria-label="Tutup tampilan foto">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          id="viewer-close-ic"
          aria-hidden="true"
        >
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <img
        id="viewer-img"
        alt="Foto galeri Badriana dan Nurizzati Islamiyah"
      />
      <div id="viewer-bar">
        <button
          type="button"
          class="viewer-nav"
          id="viewer-prev"
          aria-label="Foto sebelumnya"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            id="viewer-prev-ic"
            aria-hidden="true"
          >
            <path
              d="M15 5l-7 7 7 7"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <span id="viewer-count">1 / 1</span>
        <button
          type="button"
          class="viewer-nav"
          id="viewer-next"
          aria-label="Foto berikutnya"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            id="viewer-next-ic"
            aria-hidden="true"
          >
            <path
              d="M9 5l7 7-7 7"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>

    
`;
}
