function formatTanggalIndo(dateString: string | Date | null | undefined): string {
  if (!dateString) return 'Tanggal tidak tersedia';
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  if (isNaN(date.getTime())) return 'Tanggal tidak valid';
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date);
}

export const BASE_KIRIGAMI_HTML = `<div id="bg-wash" aria-hidden="true"></div>
    <canvas id="bg-particles" aria-hidden="true"></canvas>

    <svg
      id="svg-defs"
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style="position: absolute"
    >
      <defs>
        <symbol id="def-leaf" viewBox="0 0 40 60">
          <path
            d="M20 2C6 16 4 38 20 58 36 38 34 16 20 2Z"
            fill="currentColor"
          />
          <path
            d="M20 8v46"
            stroke="rgba(255,255,255,.55)"
            stroke-width="1.6"
            fill="none"
          />
        </symbol>
        <symbol id="def-petal" viewBox="0 0 40 40">
          <path
            d="M20 2c10 6 14 14 14 20a14 14 0 0 1-28 0c0-6 4-14 14-20Z"
            fill="currentColor"
          />
        </symbol>
        <symbol id="def-star4" viewBox="0 0 24 24">
          <path
            d="M12 0c1.2 7 4 9.8 12 12-8 2.2-10.8 5-12 12-1.2-7-4-9.8-12-12C8 9.8 10.8 7 12 0Z"
            fill="currentColor"
          />
        </symbol>
        <symbol id="def-flower" viewBox="0 0 48 48">
          <g>
            <circle cx="24" cy="10" r="8" fill="currentColor" />
            <circle cx="38" cy="20" r="8" fill="currentColor" />
            <circle cx="33" cy="36" r="8" fill="currentColor" />
            <circle cx="15" cy="36" r="8" fill="currentColor" />
            <circle cx="10" cy="20" r="8" fill="currentColor" />
            <circle cx="24" cy="24" r="6.5" fill="#fffcf8" />
          </g>
        </symbol>
        <symbol id="def-heartcut" viewBox="0 0 40 36">
          <path
            d="M20 34C6 24 2 17 2 11.5A9.5 9.5 0 0 1 20 7a9.5 9.5 0 0 1 18 4.5C38 17 34 24 20 34Z"
            fill="currentColor"
          />
        </symbol>
        <symbol id="def-corner" viewBox="0 0 120 120">
          <path
            d="M4 116C4 66 20 30 60 12"
            stroke="currentColor"
            stroke-width="2.4"
            fill="none"
            stroke-linecap="round"
          />
          <g transform="translate(50 6) rotate(24)">
            <use href="#def-leaf" width="22" height="33" class="sway" />
          </g>
          <g transform="translate(20 30) rotate(-20)">
            <use href="#def-leaf" width="18" height="27" class="sway-slow" />
          </g>
          <g transform="translate(6 66) rotate(-8)">
            <use href="#def-leaf" width="15" height="23" class="sway" />
          </g>
          <g transform="translate(66 26)">
            <use href="#def-petal" width="20" height="20" class="pulse" />
          </g>
          <g transform="translate(28 88)">
            <use href="#def-star4" width="13" height="13" class="twinkle" />
          </g>
        </symbol>
      </defs>
    </svg>

    <section id="cover" data-section="cover" aria-label="Sampul undangan">
      <svg
        id="cover-confetti"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g transform="translate(40 90) rotate(14)">
          <use
            href="#def-petal"
            width="26"
            height="26"
            fill="#f3b8c6"
            class="drift"
          />
        </g>
        <g transform="translate(330 140) rotate(-20)">
          <use
            href="#def-leaf"
            width="22"
            height="33"
            fill="#a8d8c6"
            class="sway"
          />
        </g>
        <g transform="translate(64 640) rotate(-8)">
          <use
            href="#def-flower"
            width="34"
            height="34"
            fill="#cfc0ea"
            class="pulse"
          />
        </g>
        <g transform="translate(320 660) rotate(10)">
          <use
            href="#def-petal"
            width="22"
            height="22"
            fill="#f8cba4"
            class="drift"
            style="animation-delay: -4s"
          />
        </g>
        <g transform="translate(196 60)">
          <use
            href="#def-star4"
            width="16"
            height="16"
            fill="#e2809a"
            class="twinkle"
          />
        </g>
        <g transform="translate(210 730)">
          <use
            href="#def-star4"
            width="13"
            height="13"
            fill="#6cb6a0"
            class="twinkle"
            style="animation-delay: -1.4s"
          />
        </g>
      </svg>

      <div class="gate" id="gate-left" aria-hidden="true">
        <svg viewBox="0 0 200 800" preserveAspectRatio="none">
          <path
            d="M0 0h186c-8 26 8 34 0 60s8 34 0 60 8 34 0 60 8 34 0 60 8 34 0 60 8 34 0 60 8 34 0 60 8 34 0 60 8 34 0 60 8 34 0 60 8 34 0 60 8 34 0 60 8 34 0 60H0Z"
            fill="#f7dfe4"
          />
          <path
            d="M0 0h172c-8 26 8 34 0 60s8 34 0 60 8 34 0 60 8 34 0 60 8 34 0 60 8 34 0 60 8 34 0 60 8 34 0 60 8 34 0 60 8 34 0 60 8 34 0 60 8 34 0 60 8 34 0 60H0Z"
            fill="#fbeef0"
          />
          <g opacity=".7" fill="#e2809a">
            <circle cx="46" cy="150" r="5" />
            <circle cx="96" cy="240" r="4" />
            <circle cx="60" cy="360" r="6" />
            <circle cx="120" cy="470" r="4" />
            <circle cx="52" cy="580" r="5" />
            <circle cx="104" cy="676" r="4" />
          </g>
          <g transform="translate(18 46)">
            <use
              href="#def-leaf"
              width="34"
              height="51"
              fill="#a8d8c6"
              class="sway"
            />
          </g>
          <g transform="translate(112 706) rotate(-14)">
            <use
              href="#def-flower"
              width="44"
              height="44"
              fill="#cfc0ea"
              class="pulse"
            />
          </g>
        </svg>
      </div>
      <div class="gate" id="gate-right" aria-hidden="true">
        <svg viewBox="0 0 200 800" preserveAspectRatio="none">
          <path
            d="M200 0H14c8 26-8 34 0 60s-8 34 0 60-8 34 0 60-8 34 0 60-8 34 0 60-8 34 0 60-8 34 0 60-8 34 0 60-8 34 0 60-8 34 0 60-8 34 0 60-8 34 0 60-8 34 0 60h186Z"
            fill="#dff0e9"
          />
          <path
            d="M200 0H28c8 26-8 34 0 60s-8 34 0 60-8 34 0 60-8 34 0 60-8 34 0 60-8 34 0 60-8 34 0 60-8 34 0 60-8 34 0 60-8 34 0 60-8 34 0 60-8 34 0 60-8 34 0 60h172Z"
            fill="#f0faf6"
          />
          <g opacity=".7" fill="#6cb6a0">
            <circle cx="154" cy="170" r="5" />
            <circle cx="104" cy="270" r="4" />
            <circle cx="140" cy="390" r="6" />
            <circle cx="88" cy="500" r="4" />
            <circle cx="148" cy="600" r="5" />
            <circle cx="98" cy="700" r="4" />
          </g>
          <g transform="translate(146 60) rotate(16)">
            <use
              href="#def-leaf"
              width="32"
              height="48"
              fill="#f8cba4"
              class="sway-slow"
            />
          </g>
          <g transform="translate(44 690) rotate(12)">
            <use
              href="#def-petal"
              width="34"
              height="34"
              fill="#f3b8c6"
              class="drift"
            />
          </g>
        </svg>
      </div>

      <div id="cover-center">
        <div id="cover-medal">
          <svg id="cover-medal-svg" viewBox="0 0 300 300" aria-hidden="true">
            <g class="spin-slow" style="transform-origin: 150px 150px">
              <circle
                cx="150"
                cy="150"
                r="136"
                fill="none"
                stroke="#f3b8c6"
                stroke-width="2"
                stroke-dasharray="3 9"
                stroke-linecap="round"
              />
            </g>
            <circle cx="150" cy="150" r="122" fill="#fffcf8" />
            <circle
              cx="150"
              cy="150"
              r="122"
              fill="none"
              stroke="#a8d8c6"
              stroke-width="1.6"
            />
            <circle
              cx="150"
              cy="150"
              r="112"
              fill="none"
              stroke="#f3b8c6"
              stroke-width="1"
              stroke-dasharray="2 6"
            />
            <g transform="translate(136 6)">
              <use
                href="#def-flower"
                width="28"
                height="28"
                fill="#e2809a"
                class="pulse"
              />
            </g>
            <g transform="translate(138 266)">
              <use
                href="#def-petal"
                width="24"
                height="24"
                fill="#cfc0ea"
                class="pulse"
                style="animation-delay: -2s"
              />
            </g>
            <g transform="translate(8 136) rotate(-90 12 12)">
              <use
                href="#def-leaf"
                width="24"
                height="34"
                fill="#a8d8c6"
                class="sway"
              />
            </g>
            <g transform="translate(268 136) rotate(90 12 12)">
              <use
                href="#def-leaf"
                width="24"
                height="34"
                fill="#f8cba4"
                class="sway-slow"
              />
            </g>
          </svg>
          <div id="cover-medal-inner">
            <p id="cover-kicker">Undangan Pernikahan</p>
            <h1 id="cover-names">
            __BRIDE_NAME__
            <span id="cover-amp">&amp;</span>
            __GROOM_NAME__
          </h1>
            <p id="cover-date"></p>
          </div>
        </div>

        <div id="cover-guest">
          <p id="cover-guest-generic">Kepada Bapak/Ibu/Saudara/i</p>
          <p id="cover-guest-named">
            Kepada Yth.<span id="cover-guest-value">__GUEST_NAME__</span>
          </p>
        </div>

        <button type="button" id="cover-open-btn" onclick="window.openKirigamiInvitation ? window.openKirigamiInvitation() : (function(){var c=document.getElementById('cover');if(c){c.classList.add('is-open');setTimeout(function(){c.style.display='none';},1200);}document.body.classList.remove('is-locked');var a=document.getElementById('music-audio');if(a){a.volume=0.55;var p=a.play();if(p&&p.catch)p.catch(function(){});var mb=document.getElementById('music-btn');if(mb)mb.classList.add('is-playing');}var h=document.getElementById('hero');if(h){h.scrollIntoView({behavior:'smooth'});h.classList.add('in-view');}})()">Buka Undangan</button>
      </div>
    </section>

    <header id="hero" data-section="hero">
      <div id="hero-bg" aria-hidden="true">
        <img
          id="hero-bg-img"
          src="/assets/templates/kirigami-pastel/1787187750_427b1d95.png"
          alt=""
        />
        <div id="hero-tint"></div>
      </div>
      <div id="hero-layers" aria-hidden="true">
        <svg
          id="hero-layer-far"
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0 96c60-30 108 18 168-4s112-44 232-16v124H0Z"
            fill="#cfe6f5"
            opacity=".85"
          />
        </svg>
        <svg
          id="hero-layer-mid"
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0 128c72-34 120 12 190-8s128-34 210-6v86H0Z"
            fill="#bfe3d5"
          />
        </svg>
        <svg
          id="hero-layer-near"
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0 154c84-26 130 14 206-2s122-24 194-4v52H0Z"
            fill="#f7dfe4"
          />
          <g transform="translate(24 132) rotate(-10)">
            <use
              href="#def-leaf"
              width="26"
              height="39"
              fill="#8fc9b4"
              class="sway"
            />
          </g>
          <g transform="translate(348 138) rotate(12)">
            <use
              href="#def-leaf"
              width="24"
              height="36"
              fill="#8fc9b4"
              class="sway-slow"
            />
          </g>
          <g transform="translate(78 146)">
            <use
              href="#def-petal"
              width="18"
              height="18"
              fill="#e2809a"
              class="pulse"
            />
          </g>
          <g transform="translate(304 150)">
            <use
              href="#def-flower"
              width="22"
              height="22"
              fill="#cfc0ea"
              class="pulse"
              style="animation-delay: -1.6s"
            />
          </g>
        </svg>
      </div>

      <div id="hero-inner">
        <div id="hero-card" class="reveal reveal-z">
          <p id="hero-eyebrow" class="reveal">Kami Akan Menikah</p>
          <h2 id="hero-names" class="reveal">
            Nurizzati Islamiyah<span id="hero-amp">&amp;</span>Badriana
          </h2>
          <svg
            id="hero-divider"
            class="reveal reveal-z"
            viewBox="0 0 132 18"
            aria-hidden="true"
          >
            <path
              d="M2 9h40"
              stroke="#e2809a"
              stroke-width="1.4"
              stroke-linecap="round"
            />
            <path
              d="M90 9h40"
              stroke="#e2809a"
              stroke-width="1.4"
              stroke-linecap="round"
            />
            <g transform="translate(56 1)">
              <use
                href="#def-heartcut"
                width="20"
                height="18"
                fill="#e2809a"
                class="pulse"
              />
            </g>
            <g transform="translate(46 5)">
              <use
                href="#def-star4"
                width="8"
                height="8"
                fill="#6cb6a0"
                class="twinkle"
              />
            </g>
            <g transform="translate(78 5)">
              <use
                href="#def-star4"
                width="8"
                height="8"
                fill="#6cb6a0"
                class="twinkle"
                style="animation-delay: -1.2s"
              />
            </g>
          </svg>
          <p id="hero-date" class="reveal"></p>
          <p id="hero-quote" class="reveal">Dua lembar kertas berbeda warna, digunting hati-hati, lalu direkat menjadi satu karya yang utuh.</p>
          <div id="hero-scroll" class="reveal" aria-hidden="true">
            <span id="hero-scroll-line"></span>
            <span id="hero-scroll-text">Gulir</span>
          </div>
        </div>
        <figure id="hero-photo-wrap" class="reveal reveal-r">
          <img
            id="hero-photo"
            src="__HERO_PHOTO__"
            alt="Foto Nurizzati Islamiyah dan Badriana"
          />
          <svg
            id="hero-photo-frame"
            viewBox="0 0 400 500"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M12 250C12 120 96 24 200 24s188 96 188 226v250H12Z"
              fill="none"
              stroke="#fffcf8"
              stroke-width="10"
            />
            <path
              d="M24 250C24 128 104 38 200 38s176 90 176 212v238H24Z"
              fill="none"
              stroke="#f3b8c6"
              stroke-width="2"
              stroke-dasharray="4 8"
            />
          </svg>
        </figure>
      </div>
    </header>

    <section id="couple" class="sec" data-section="couple">
      <svg
        class="corner-orn orn-tl"
        id="orn-couple-tl"
        viewBox="0 0 120 120"
        style="color: #a8d8c6"
        aria-hidden="true"
      >
        <use href="#def-corner" width="120" height="120" />
      </svg>
      <svg
        class="corner-orn orn-br"
        id="orn-couple-br"
        viewBox="0 0 120 120"
        style="color: #f3b8c6"
        aria-hidden="true"
      >
        <use href="#def-corner" width="120" height="120" />
      </svg>
      <div class="wrap">
        <p class="eyebrow reveal" id="couple-eyebrow">
          Bismillahirrahmanirrahim
        </p>
        <h2 class="h-sec reveal" id="couple-title">Mempelai</h2>
        <p class="lead reveal" id="couple-lead">
          Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud
          menyelenggarakan pernikahan putra-putri kami.
        </p>

        <div
          id="couple-tabs"
          class="reveal reveal-z"
          role="tablist"
          aria-label="Pilih mempelai"
        >
          <button
            type="button"
            class="couple-tab is-active"
            id="tab-groom"
            role="tab"
            aria-selected="true"
            aria-controls="card-groom"
          >
            __GROOM_NICK__
          </button>
          <button
            type="button"
            class="couple-tab"
            id="tab-bride"
            role="tab"
            aria-selected="false"
            aria-controls="card-bride"
          >
            __BRIDE_NICK__
          </button>
        </div>

        <div id="couple-stage" class="reveal reveal-cut">
          <article
            class="couple-card is-shown"
            id="card-groom"
            role="tabpanel"
            aria-labelledby="tab-groom"
          >
            <div class="cface" id="cface-groom-front">
              <div class="portrait" id="portrait-groom">
                <img
                  id="img-groom"
                  src="__GROOM_PHOTO__"
                  alt="Foto Nurizzati Islamiyah"
                />
                <svg
                  class="portrait-frame"
                  id="frame-groom"
                  viewBox="0 0 300 400"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M10 200C10 92 72 14 150 14s140 78 140 186v200H10Z"
                    fill="none"
                    stroke="#fffcf8"
                    stroke-width="8"
                  />
                  <path
                    d="M22 200C22 100 78 28 150 28s128 72 128 172v200H22Z"
                    fill="none"
                    stroke="#a8d8c6"
                    stroke-width="2"
                    stroke-dasharray="5 9"
                  />
                </svg>
              </div>
              <p class="crole" id="role-groom">Mempelai Pria</p>
              <h3 class="cname" id="name-groom">Izzah</h3>
              <p class="cparents" id="parents-groom">Madripi</p>
              <button type="button" class="btn-flip" id="flip-groom">Tentang __GROOM_NICK__ &rarr;</button>
            </div>
            <div class="cface cface-back" id="cface-groom-back">
              <svg
                width="54"
                height="54"
                viewBox="0 0 48 48"
                aria-hidden="true"
                id="back-icon-groom"
              >
                <use
                  href="#def-flower"
                  width="48"
                  height="48"
                  fill="#a8d8c6"
                  class="pulse"
                />
              </svg>
              <p class="h-script" id="back-script-groom">Sang Mempelai Pria</p>
              <h3 class="cname" id="back-name-groom">Nurizzati Islamiyah</h3>
              <p class="cparents" id="back-parents-groom">Madripi</p>
              <button type="button" class="flipbtn" id="unflip-groom">
                Kembali
              </button>
            </div>
          </article>

          <article
            class="couple-card"
            id="card-bride"
            role="tabpanel"
            aria-labelledby="tab-bride"
          >
            <div class="cface" id="cface-bride-front">
              <div class="portrait" id="portrait-bride">
                <img
                  id="img-bride"
                  src="__BRIDE_PHOTO__"
                  alt="Foto Badriana"
                />
                <svg
                  class="portrait-frame"
                  id="frame-bride"
                  viewBox="0 0 300 400"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M10 200C10 92 72 14 150 14s140 78 140 186v200H10Z"
                    fill="none"
                    stroke="#fffcf8"
                    stroke-width="8"
                  />
                  <path
                    d="M22 200C22 100 78 28 150 28s128 72 128 172v200H22Z"
                    fill="none"
                    stroke="#f3b8c6"
                    stroke-width="2"
                    stroke-dasharray="5 9"
                  />
                </svg>
              </div>
              <p class="crole" id="role-bride">Mempelai Wanita</p>
              <h3 class="cname" id="name-bride">Badri</h3>
              <p class="cparents" id="parents-bride">Epi</p>
              <button type="button" class="btn-flip" id="flip-bride">Tentang __BRIDE_NICK__ &rarr;</button>
            </div>
            <div class="cface cface-back" id="cface-bride-back">
              <svg
                width="54"
                height="54"
                viewBox="0 0 48 48"
                aria-hidden="true"
                id="back-icon-bride"
              >
                <use
                  href="#def-flower"
                  width="48"
                  height="48"
                  fill="#f3b8c6"
                  class="pulse"
                />
              </svg>
              <p class="h-script" id="back-script-bride">
                Sang Mempelai Wanita
              </p>
              <h3 class="cname" id="back-name-bride">Badriana</h3>
              <p class="cparents" id="back-parents-bride">Epi</p>
              <button type="button" class="flipbtn" id="unflip-bride">
                Kembali
              </button>
            </div>
          </article>
        </div>

        <svg
          id="couple-seam"
          class="reveal reveal-z"
          viewBox="0 0 320 40"
          aria-hidden="true"
        >
          <path
            d="M6 20h120"
            stroke="#cfc0ea"
            stroke-width="1.6"
            stroke-linecap="round"
          />
          <path
            d="M194 20h120"
            stroke="#cfc0ea"
            stroke-width="1.6"
            stroke-linecap="round"
          />
          <g transform="translate(140 8)">
            <use
              href="#def-star4"
              width="16"
              height="16"
              fill="#e2809a"
              class="twinkle"
            />
          </g>
          <g transform="translate(164 10)">
            <use
              href="#def-star4"
              width="12"
              height="12"
              fill="#6cb6a0"
              class="twinkle"
              style="animation-delay: -1.7s"
            />
          </g>
        </svg>
      </div>
    </section>
    <section id="story" class="sec" data-section="story">
      <div class="wrap">
        <p class="eyebrow reveal" id="story-eyebrow">Perjalanan Kami</p>
        <h2 class="h-sec reveal" id="story-title">Tiga Guntingan Kisah</h2>
        <p class="lead reveal" id="story-lead">
          Setiap kenangan seperti lembar kertas yang kami potong dan susun
          berlapis.
        </p>
        <div id="story-track">
          <div id="story-line" aria-hidden="true"></div>
        </div>
      </div>
      <div id="story-data" hidden>
        <span id="story-1-title">__STORY_1_TITLE__</span>
        <span id="story-1-text">__STORY_1_TEXT__</span>
        <img id="story-1-photo" src="__STORY_1_PHOTO__" alt="" />
        <span id="story-2-title">__STORY_2_TITLE__</span>
        <span id="story-2-text">__STORY_2_TEXT__</span>
        <img id="story-2-photo" src="__STORY_2_PHOTO__" alt="" />
        <span id="story-3-title">__STORY_3_TITLE__</span>
        <span id="story-3-text">__STORY_3_TEXT__</span>
        <img id="story-3-photo" src="__STORY_3_PHOTO__" alt="" />
      </div>
    </section>

    <section id="events" class="sec" data-section="events">
      <svg
        class="edge-cut edge-top"
        id="events-edge-top"
        viewBox="0 0 400 26"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 0h400v10c-20 10-40-6-60 2s-40 12-60 2-40-10-60-2-40 12-60 2-40-10-60-2-40 10-40 4Z"
          fill="#fffcf8"
        />
      </svg>
      <div class="wrap">
        <p class="eyebrow reveal" id="events-eyebrow">Save The Date</p>
        <h2 class="h-sec reveal" id="events-title">Waktu &amp; Tempat</h2>
        <div id="events-grid">
          <article class="event-card reveal reveal-l" id="event-1-card">
            <svg
              class="event-card-top"
              id="event-1-top"
              viewBox="0 0 300 70"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0 0h300v34c-30 14-60-10-90 2s-60 16-90 0S30 22 0 34Z"
                fill="#f7dfe4"
              />
            </svg>
            <svg
              class="event-badge"
              id="event-1-badge"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <use
                href="#def-flower"
                width="48"
                height="48"
                fill="#e2809a"
                class="pulse"
              />
            </svg>
            <h3 class="event-name" id="event-1-name">Akad Nikah</h3>
            <p class="event-date" id="event-1-date"></p>
            <p class="event-time" id="event-1-time"></p>
            <svg
              class="event-sep"
              id="event-1-sep"
              viewBox="0 0 70 12"
              aria-hidden="true"
            >
              <path
                d="M2 6h22M46 6h22"
                stroke="#f3b8c6"
                stroke-width="1.4"
                stroke-linecap="round"
              />
              <g transform="translate(28 1)">
                <use
                  href="#def-petal"
                  width="12"
                  height="12"
                  fill="#a8d8c6"
                  class="pulse"
                />
              </g>
            </svg>
            <p class="event-venue" id="event-1-venue">__AKAD_VENUE__</p>
            <p class="event-addr" id="event-1-addr">__AKAD_ADDR__</p>
          </article>

          <article class="event-card reveal reveal-r" id="event-2-card">
            <svg
              class="event-card-top"
              id="event-2-top"
              viewBox="0 0 300 70"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0 0h300v34c-30 14-60-10-90 2s-60 16-90 0S30 22 0 34Z"
                fill="#dff0e9"
              />
            </svg>
            <svg
              class="event-badge"
              id="event-2-badge"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <use
                href="#def-flower"
                width="48"
                height="48"
                fill="#6cb6a0"
                class="pulse"
                style="animation-delay: -1.5s"
              />
            </svg>
            <h3 class="event-name" id="event-2-name">Resepsi Pernikahan</h3>
            <p class="event-date" id="event-2-date-out"></p>
            <p class="event-time" id="event-2-time-out"></p>
            <svg
              class="event-sep"
              id="event-2-sep"
              viewBox="0 0 70 12"
              aria-hidden="true"
            >
              <path
                d="M2 6h22M46 6h22"
                stroke="#a8d8c6"
                stroke-width="1.4"
                stroke-linecap="round"
              />
              <g transform="translate(28 1)">
                <use
                  href="#def-petal"
                  width="12"
                  height="12"
                  fill="#f3b8c6"
                  class="pulse"
                />
              </g>
            </svg>
            <p class="event-venue" id="event-2-venue">__RESEPSI_VENUE__</p>
            <p class="event-addr" id="event-2-addr">__RESEPSI_ADDR__</p>
          </article>
        </div>
        <div id="event-2-data" hidden>
          <span id="event-2-name-raw">__RESEPSI_NAME__</span>
          <span id="event-2-date-raw">__RESEPSI_DATE_RAW__</span>
          <span id="event-2-time-raw">__RESEPSI_TIME_RAW__</span>
        </div>
      </div>
      <svg
        class="edge-cut edge-bottom"
        id="events-edge-bottom"
        viewBox="0 0 400 26"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 0h400v10c-20 10-40-6-60 2s-40 12-60 2-40-10-60-2-40 12-60 2-40-10-60-2-40 10-40 4Z"
          fill="#fffcf8"
        />
      </svg>
    </section>

    <section id="rundown" class="sec" data-section="rundown" hidden>
      <div class="wrap">
        <p class="eyebrow reveal" id="rundown-eyebrow">Rangkaian Acara</p>
        <h2 class="h-sec reveal" id="rundown-title">Susunan Hari Bahagia</h2>
        <p class="lead reveal" id="rundown-lead">
          Setiap potongan waktu kami susun rapi seperti lembaran kertas
          berjajar.
        </p>
        <div id="rundown-list"></div>
      </div>
    </section>

    <section id="countdown" class="sec" data-section="countdown">
      <div class="wrap">
        <p class="eyebrow reveal" id="cd-eyebrow">Menuju Hari Bahagia</p>
        <h2 class="h-sec reveal" id="cd-title">Hitung Mundur</h2>
        <div id="cd-grid" class="reveal reveal-z">
          <div class="cd-box" id="cd-box-days">
            <p class="cd-num" id="cd-days">0</p>
            <p class="cd-lab" id="cd-lab-days">Hari</p>
          </div>
          <div class="cd-box" id="cd-box-hours">
            <p class="cd-num" id="cd-hours">0</p>
            <p class="cd-lab" id="cd-lab-hours">Jam</p>
          </div>
          <div class="cd-box" id="cd-box-min">
            <p class="cd-num" id="cd-min">0</p>
            <p class="cd-lab" id="cd-lab-min">Menit</p>
          </div>
          <div class="cd-box" id="cd-box-sec">
            <p class="cd-num" id="cd-sec">0</p>
            <p class="cd-lab" id="cd-lab-sec">Detik</p>
          </div>
        </div>
        <p id="cd-done">Hari bahagia telah tiba — sampai jumpa di sana!</p>
        <button type="button" id="cal-btn" class="reveal">
          Simpan ke Kalender
        </button>
      </div>
    </section>

    <section id="venue" class="sec" data-section="venue">
      <div class="wrap">
        <p class="eyebrow reveal" id="venue-eyebrow">Lokasi Acara</p>
        <h2 class="h-sec reveal" id="venue-title">__VENUE_NAME__</h2>
        <p class="lead reveal" id="venue-addr">280 Gloucester Rd, Causeway Bay, Hong Kong Island, Hong Kong</p>
        <div id="map-frame" class="reveal reveal-z">
          <iframe
            id="map-embed"
            title="Peta lokasi acara"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCP0LjsvmACU9PshCUvqPg0U0AvWBw1TNo&q=place_id:ChIJVX_KZ1YABDQR8TZ6STtir8M"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          ></iframe>
          <svg
            id="map-corner"
            viewBox="0 0 120 120"
            style="color: #f3b8c6"
            aria-hidden="true"
          >
            <use href="#def-corner" width="120" height="120" />
          </svg>
        </div>
        <a
          id="map-link"
          class="reveal"
          href="https://www.google.com/maps/dir/?api=1&destination=wwwtc mall&travelmode=driving&destination_place_id=ChIJVX_KZ1YABDQR8TZ6STtir8M"
          target="_blank"
          rel="noopener"
          >Buka Peta Lokasi</a
        >
      </div>
    </section>
    <section id="gallery" class="sec" data-section="gallery">
      <div class="wrap">
        <p class="eyebrow reveal" id="gallery-eyebrow">Galeri</p>
        <h2 class="h-sec reveal" id="gallery-title">Lembar Kenangan</h2>
        <p class="lead reveal" id="gallery-lead">
          Bagikan momen Anda di hari kami dengan tagar berikut.
        </p>
        <p id="gallery-hashtag" class="reveal">#SatuLembarBerdua</p>
        <div id="gallery-grid"></div>
      </div>
    </section>

    <section id="folds" class="sec" data-section="folds">
      <div class="wrap">
        <p class="eyebrow reveal" id="folds-eyebrow">Sedikit Tentang Kami</p>
        <h2 class="h-sec reveal" id="folds-title">Lipatan Rahasia</h2>
        <p class="lead reveal" id="folds-lead">
          Ketuk setiap lipatan kertas untuk membukanya.
        </p>
        <div id="folds-list">
          <details class="fold reveal reveal-l" id="fold-1">
            <summary class="fold-q" id="fold-1-q">
              Siapa yang paling sering telat?<span
                class="fold-mark"
                id="fold-1-mark"
                aria-hidden="true"
              ></span>
            </summary>
            <div class="fold-a" id="fold-1-a">Bagas, dengan alasan yang selalu baru dan selalu kreatif.</div>
          </details>
          <details class="fold reveal reveal-r" id="fold-2">
            <summary class="fold-q" id="fold-2-q">
              Lagu wajib di mobil?<span
                class="fold-mark"
                id="fold-2-mark"
                aria-hidden="true"
              ></span>
            </summary>
            <div class="fold-a" id="fold-2-a">Playlist yang sama sejak 2021, diputar berulang tanpa pernah bosan.</div>
          </details>
          <details class="fold reveal reveal-l" id="fold-3">
            <summary class="fold-q" id="fold-3-q">
              Rencana bulan madu?<span
                class="fold-mark"
                id="fold-3-mark"
                aria-hidden="true"
              ></span>
            </summary>
            <div class="fold-a" id="fold-3-a">Menyusuri pulau kecil, membawa buku, dan tidak membuat jadwal sama sekali.</div>
          </details>
        </div>
      </div>
    </section>

    <section id="dresscode" class="sec" data-section="dresscode">
      <div class="wrap">
        <p class="eyebrow reveal" id="dress-eyebrow">Busana</p>
        <h2 class="h-sec reveal" id="dress-title">Palet Hari Itu</h2>
        <p class="lead reveal" id="dress-text">Kami mengundang Anda mengenakan busana bernuansa pastel lembut agar seluruh momen terasa seperti satu karya kertas yang utuh.</p>
        <div id="dress-chips" class="reveal reveal-z"></div>
        <div id="dress-data" hidden>
          <span id="dress-c1">#f3b8c6</span>
          <span id="dress-c2">#a8d8c6</span>
          <span id="dress-c3">#f8cba4</span>
          <span id="dress-c4">#cfc0ea</span>
        </div>
      </div>
    </section>

    __DYNAMIC_GIFTS_SECTION__

    <section id="rsvp" class="sec" data-section="rsvp">
      <svg
        class="corner-orn orn-tl"
        id="orn-rsvp-tl"
        viewBox="0 0 120 120"
        style="color: #cfc0ea"
        aria-hidden="true"
      >
        <use href="#def-corner" width="120" height="120" />
      </svg>
      <svg
        class="corner-orn orn-br"
        id="orn-rsvp-br"
        viewBox="0 0 120 120"
        style="color: #a8d8c6"
        aria-hidden="true"
      >
        <use href="#def-corner" width="120" height="120" />
      </svg>
      <div class="wrap">
        <p class="eyebrow reveal" id="rsvp-eyebrow">Konfirmasi Kehadiran</p>
        <h2 class="h-sec reveal" id="rsvp-title">RSVP</h2>
        <p class="lead reveal" id="rsvp-lead">
          Mohon kesediaannya untuk mengisi formulir di bawah ini.
        </p>
        <form
          class="paperform reveal reveal-cut"
          id="rsvp-form"
          data-wedivo="rsvp"
        >
          <label class="fl" for="rsvp-name" id="rsvp-name-label"
            >Nama Anda</label
          >
          <input
            id="rsvp-name"
            name="name"
            type="text"
            placeholder="Nama Anda"
            required
          />
          <p class="fl" id="rsvp-status-label">Kehadiran</p>
          <div id="rsvp-status-row">
            <button
              type="button"
              id="rsvp-yes"
              class="status-btn"
              data-wedivo-status="attending"
            >
              Hadir
            </button>
            <button
              type="button"
              id="rsvp-no"
              class="status-btn"
              data-wedivo-status="not_attending"
            >
              Tidak Hadir
            </button>
            <button
              type="button"
              id="rsvp-maybe"
              class="status-btn"
              data-wedivo-status="maybe"
            >
              Mungkin
            </button>
          </div>
          <label class="fl" for="rsvp-pax" id="rsvp-pax-label"
            >Jumlah Tamu</label
          >
          <input
            id="rsvp-pax"
            name="pax"
            type="number"
            min="1"
            max="20"
            value="1"
          />
          <label class="fl" for="rsvp-message" id="rsvp-message-label"
            >Pesan (opsional)</label
          >
          <textarea
            id="rsvp-message"
            name="message"
            rows="3"
            placeholder="Pesan untuk mempelai"
          ></textarea>
          <button type="submit" id="rsvp-submit" class="btn-main">
            Kirim Konfirmasi
          </button>
          <p class="form-msg form-ok" id="rsvp-ok">
            Terima kasih, konfirmasi Anda sudah kami terima.
          </p>
          <p class="form-msg form-bad" id="rsvp-bad">
            Mohon pilih status kehadiran terlebih dahulu.
          </p>
        </form>
        <button
          type="button"
          id="checkin-btn"
          class="reveal"
          data-wedivo="checkin-cta"
        >
          Check-in di Lokasi Acara
        </button>
      </div>
    </section>

    <section id="wishes" class="sec" data-section="wishes">
      <div class="wrap">
        <p class="eyebrow reveal" id="wishes-eyebrow">Doa &amp; Harapan</p>
        <h2 class="h-sec reveal" id="wishes-title">Dinding Ucapan</h2>
        <p class="lead reveal" id="wishes-lead">
          Tinggalkan sepotong pesan untuk kami berdua.
        </p>
        <form
          class="paperform reveal reveal-cut"
          id="wishes-form"
          data-wedivo="comments-form"
        >
          <label class="fl" for="wish-name" id="wish-name-label"
            >Nama Anda</label
          >
          <input
            id="wish-name"
            name="name"
            type="text"
            placeholder="Nama Anda"
            required
          />
          <label class="fl" for="wish-message" id="wish-message-label"
            >Ucapan</label
          >
          <textarea
            id="wish-message"
            name="message"
            rows="4"
            placeholder="Tulis doa dan harapan Anda..."
            required
          ></textarea>
          <button type="submit" id="wish-submit" class="btn-main">
            Kirim Ucapan
          </button>
          <p class="form-msg form-ok" id="wish-ok">
            Terima kasih atas doa dan ucapannya.
          </p>
          <p class="form-msg form-bad" id="wish-bad">
            Ucapan gagal terkirim, silakan coba lagi.
          </p>
        </form>
        <div id="wishes-list" class="reveal" data-wedivo="comments-list"></div>
        <template id="wish-template" data-wedivo="comment-template">
          <article class="comment-card">
            <span class="comment-tape" aria-hidden="true"></span>
            <p class="comment-name" data-field="name"></p>
            <p class="comment-message" data-field="message"></p>
            <p class="comment-date" data-field="date"></p>
          </article>
        </template>
        <button type="button" id="wishes-more" data-wedivo="comments-more">
          Muat Ucapan Lainnya
        </button>
      </div>
    </section>

    <footer id="closing" class="sec has-wash" data-section="closing">
      <div class="wash-bg" id="closing-wash" aria-hidden="true"></div>
      <div class="wrap">
        <svg
          id="closing-orn"
          class="reveal reveal-z"
          viewBox="0 0 200 90"
          aria-hidden="true"
        >
          <path
            d="M20 70c22-34 48-46 80-46s58 12 80 46"
            fill="none"
            stroke="#f3b8c6"
            stroke-width="1.6"
            stroke-dasharray="4 8"
          />
          <g transform="translate(84 8)">
            <use
              href="#def-flower"
              width="34"
              height="34"
              fill="#e2809a"
              class="pulse"
            />
          </g>
          <g transform="translate(28 46) rotate(-16)">
            <use
              href="#def-leaf"
              width="20"
              height="30"
              fill="#a8d8c6"
              class="sway"
            />
          </g>
          <g transform="translate(150 46) rotate(16)">
            <use
              href="#def-leaf"
              width="20"
              height="30"
              fill="#cfc0ea"
              class="sway-slow"
            />
          </g>
          <g transform="translate(60 34)">
            <use
              href="#def-star4"
              width="12"
              height="12"
              fill="#6cb6a0"
              class="twinkle"
            />
          </g>
          <g transform="translate(130 30)">
            <use
              href="#def-star4"
              width="10"
              height="10"
              fill="#f8cba4"
              class="twinkle"
              style="animation-delay: -1.9s"
            />
          </g>
        </svg>
        <p class="lead reveal" id="closing-message">__CLOSING_MESSAGE__</p>
        <p class="h-script reveal" id="closing-script">
          Sampai jumpa di hari bahagia kami
        </p>
        <h2 class="h-sec reveal" id="closing-names">
          __BRIDE_NAME__ &amp; __GROOM_NAME__
        </h2>
        <p class="reveal" id="closing-date"></p>
      </div>
    </footer>

    <div
      id="viewer"
      role="dialog"
      aria-modal="true"
      aria-label="Pratinjau foto"
      aria-hidden="true"
    >
      <button type="button" id="viewer-close" aria-label="Tutup">
        &times;
      </button>
      <div id="viewer-stage">
        <img id="viewer-img" src="" alt="Foto galeri" />
      </div>
      <div id="viewer-bar">
        <button type="button" id="viewer-prev" aria-label="Foto sebelumnya">
          &#8592;
        </button>
        <span id="viewer-count"></span>
        <button type="button" id="viewer-next" aria-label="Foto berikutnya">
          &#8594;
        </button>
      </div>
    </div>

    <button type="button" id="music-btn" aria-label="Putar atau hentikan musik">
      <svg id="music-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          id="music-note"
          d="M9 18V6l10-2v12"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
        <circle id="music-dot-1" cx="7" cy="18" r="2.6" fill="currentColor" />
        <circle id="music-dot-2" cx="17" cy="16" r="2.6" fill="currentColor" />
      </svg>
    </button>
    <audio
      id="music-audio"
      src="__AUDIO_URL__"
      loop
      preload="none"
    ></audio>

    

    <style>
      /* ---------- venue ---------- */
      #map-frame {
        position: relative;
        margin: 26px 0 20px;
        border-radius: 24px;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
        background: var(--paper);
        padding: 10px;
      }
      #map-embed {
        display: block;
        width: 100%;
        height: 260px;
        border: 0;
        border-radius: 16px;
        filter: saturate(0.92);
      }
      #map-corner {
        position: absolute;
        top: -10px;
        left: -12px;
        width: 96px;
        height: 96px;
        pointer-events: none;
        z-index: 2;
      }
      #map-link {
        display: block;
        width: 100%;
        max-width: 280px;
        margin: 0 auto;
        text-align: center;
        padding: 14px 22px;
        border-radius: 999px;
        background: var(--rose);
        color: #fff;
        text-decoration: none;
        font-weight: 700;
        font-size: 0.78rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        box-shadow: 0 12px 26px rgba(226, 128, 154, 0.36);
        transition: transform 0.3s ease;
      }
      #map-link:hover {
        transform: translateY(-3px);
      }
      @media (min-width: 768px) {
        #map-embed {
          height: 340px;
        }
      }
      @media (min-width: 1024px) {
        #map-embed {
          height: 420px;
        }
      }

      /* ---------- rundown ---------- */
      #rundown-list {
        margin-top: 30px;
      }
      .rd-day {
        font-family: "Fraunces", serif;
        font-size: 1.05rem;
        text-align: center;
        color: var(--mint-deep);
        margin: 24px 0 14px;
        letter-spacing: 0.04em;
      }
      .rd-item {
        position: relative;
        display: flex;
        gap: 14px;
        align-items: flex-start;
        padding: 16px 18px;
        margin-bottom: 12px;
        border-radius: 18px;
        background: var(--paper);
        box-shadow: var(--shadow);
        background-image: url("/assets/templates/kirigami-pastel/1787187755_c4db14e3.png");
        background-size: 260px;
        opacity: 0;
        transform: translateY(24px);
        transition:
          opacity 0.8s ease,
          transform 0.8s ease;
      }
      .in-view .rd-item {
        opacity: 1;
        transform: none;
      }
      .rd-item::before {
        content: "";
        position: absolute;
        left: 0;
        top: 14px;
        bottom: 14px;
        width: 5px;
        border-radius: 0 6px 6px 0;
        background: var(--blush);
      }
      .rd-icon {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
      }
      .rd-body {
        flex: 1;
        min-width: 0;
      }
      .rd-time {
        font-size: 0.72rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--rose);
        font-weight: 700;
      }
      .rd-title {
        font-family: "Fraunces", serif;
        font-size: 1.1rem;
        line-height: 1.3;
      }
      .rd-desc,
      .rd-loc {
        font-size: 0.88rem;
        color: var(--ink-soft);
      }
      .rd-loc {
        font-weight: 600;
      }
      @media (min-width: 1024px) {
        .rd-list-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
      }

      /* ---------- gallery ---------- */
      #gallery-hashtag {
        text-align: center;
        font-family: "Caveat", cursive;
        font-size: 1.5rem;
        color: var(--rose);
        margin-top: 6px;
      }
      #gallery-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-top: 26px;
      }
      @media (min-width: 768px) {
        #gallery-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
      }
      .gal-cell {
        position: relative;
        aspect-ratio: 1;
        border-radius: 16px;
        overflow: hidden;
        background: var(--paper);
        box-shadow: var(--shadow);
        cursor: pointer;
        opacity: 0;
        transform: translateY(26px) rotate(-2deg) scale(0.94);
        transition:
          opacity 0.8s ease,
          transform 0.8s ease,
          box-shadow 0.4s ease;
        border: 6px solid #fffcf8;
      }
      .in-view .gal-cell {
        opacity: 1;
        transform: none;
      }
      .gal-cell:nth-child(even) {
        border-radius: 16px 16px 60px 16px;
      }
      .gal-cell:hover {
        box-shadow: var(--shadow-lg);
      }
      .gal-cell img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.7s cubic-bezier(0.2, 0.7, 0.3, 1);
      }
      .gal-cell:hover img {
        transform: scale(1.09) rotate(1.2deg);
      }
      #gallery.is-empty {
        display: none;
      }

      /* ---------- viewer ---------- */
      #viewer {
        position: fixed;
        inset: 0;
        z-index: 120;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 26px 18px 100px;
        background: rgba(46, 40, 54, 0.93);
        backdrop-filter: blur(6px);
        opacity: 0;
        visibility: hidden;
        transition:
          opacity 0.45s ease,
          visibility 0.45s ease;
      }
      #viewer.is-open {
        opacity: 1;
        visibility: visible;
      }
      #viewer-stage {
        max-width: min(94vw, 760px);
        max-height: 74vh;
        display: flex;
      }
      #viewer-img {
        max-width: 100%;
        max-height: 74vh;
        object-fit: contain;
        border-radius: 14px;
        border: 8px solid #fffcf8;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
        transform: scale(0.9);
        opacity: 0;
        transition:
          transform 0.5s cubic-bezier(0.2, 0.8, 0.3, 1),
          opacity 0.5s ease;
      }
      #viewer.is-open #viewer-img {
        transform: scale(1);
        opacity: 1;
      }
      #viewer-close {
        position: absolute;
        top: 14px;
        right: 16px;
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: rgba(255, 252, 248, 0.16);
        color: #fff;
        font-size: 1.7rem;
        line-height: 1;
      }
      #viewer-bar {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 26px;
        display: flex;
        gap: 14px;
        align-items: center;
        justify-content: center;
      }
      #viewer-prev,
      #viewer-next {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        background: rgba(255, 252, 248, 0.94);
        color: var(--ink);
        font-size: 1.3rem;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
        transition: transform 0.25s ease;
      }
      #viewer-prev:active,
      #viewer-next:active {
        transform: scale(0.92);
      }
      #viewer-count {
        color: #fffcf8;
        font-size: 0.8rem;
        letter-spacing: 0.18em;
        min-width: 62px;
        text-align: center;
      }
      #viewer-bar.is-single #viewer-prev,
      #viewer-bar.is-single #viewer-next {
        display: none;
      }

      /* ---------- folds ---------- */
      #folds-list {
        margin-top: 28px;
        display: grid;
        gap: 14px;
      }
      @media (min-width: 1024px) {
        #folds-list {
          grid-template-columns: 1fr 1fr;
        }
      }
      .fold {
        position: relative;
        border-radius: 18px;
        background: var(--paper);
        box-shadow: var(--shadow);
        background-image: url("/assets/templates/kirigami-pastel/1787187755_c4db14e3.png");
        background-size: 260px;
        overflow: hidden;
      }
      .fold::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        border-width: 0 22px 22px 0;
        border-style: solid;
        border-color: transparent #f3b8c6 transparent transparent;
        transform: rotate(180deg);
      }
      .fold[open]::before {
        border-color: transparent #a8d8c6 transparent transparent;
      }
      .fold.is-hidden {
        display: none;
      }
      .fold-q {
        list-style: none;
        cursor: pointer;
        padding: 17px 46px 17px 20px;
        font-family: "Fraunces", serif;
        font-size: 1.02rem;
        position: relative;
      }
      .fold-q::-webkit-details-marker {
        display: none;
      }
      .fold-mark {
        position: absolute;
        right: 18px;
        top: 50%;
        width: 14px;
        height: 14px;
        margin-top: -7px;
      }
      .fold-mark::before,
      .fold-mark::after {
        content: "";
        position: absolute;
        background: var(--rose);
        border-radius: 2px;
        transition: transform 0.4s ease;
      }
      .fold-mark::before {
        left: 0;
        right: 0;
        top: 6px;
        height: 2px;
      }
      .fold-mark::after {
        top: 0;
        bottom: 0;
        left: 6px;
        width: 2px;
      }
      .fold[open] .fold-mark::after {
        transform: scaleY(0);
      }
      .fold-a {
        padding: 0 20px 18px;
        color: var(--ink-soft);
        font-size: 0.94rem;
        animation: foldopen 0.5s ease;
      }
      @keyframes foldopen {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }

      /* ---------- dresscode ---------- */
      #dress-chips {
        display: flex;
        gap: 14px;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 26px;
      }
      .chip {
        width: 60px;
        height: 60px;
        border-radius: 50% 50% 50% 12px;
        box-shadow: var(--shadow);
        border: 5px solid #fffcf8;
      }
      @media (prefers-reduced-motion: no-preference) {
        .chip {
          animation: bob 5s ease-in-out infinite;
        }
      }

      /* ---------- washes / forms ---------- */
      .has-wash {
        position: relative;
      }
      .wash-bg {
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background-image: url("/assets/templates/kirigami-pastel/1787187749_4565af9e.png");
        background-size: cover;
        background-position: center;
        opacity: 0.55;
      }
      .has-wash::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 1;
        pointer-events: none;
        background: rgba(253, 247, 242, 0.62);
      }
      .has-wash .wrap {
        z-index: 3;
      }

      .paperform {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 26px;
        padding: 24px 20px 26px;
        border-radius: 24px;
        background: rgba(255, 252, 248, 0.96);
        box-shadow: var(--shadow-lg);
        position: relative;
      }
      .paperform::before {
        content: "";
        position: absolute;
        inset: 9px;
        border-radius: 17px;
        border: 1px dashed rgba(207, 192, 234, 0.75);
        pointer-events: none;
      }
      .paperform > * {
        position: relative;
        z-index: 2;
      }
      .fl {
        font-size: 0.68rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--ink-soft);
        font-weight: 700;
        margin-top: 8px;
      }
      .paperform input,
      .paperform textarea {
        width: 100%;
        box-sizing: border-box;
        font-family: inherit;
        font-size: 16px;
        color: var(--ink);
        padding: 11px 14px;
        border-radius: 13px;
        border: 1.5px solid rgba(207, 192, 234, 0.8);
        background: #fffdfb;
        transition:
          border-color 0.3s ease,
          box-shadow 0.3s ease;
      }
      .paperform textarea {
        resize: vertical;
      }
      .paperform input:focus,
      .paperform textarea:focus {
        outline: none;
        border-color: var(--rose);
        box-shadow: 0 0 0 4px rgba(243, 184, 198, 0.28);
      }
      .paperform input[name="name"].is-locked,
      .paperform input[name="senderName"].is-locked {
        background: #f2eee9;
        color: var(--ink-soft);
        cursor: not-allowed;
        border-style: dashed;
      }
      #rsvp-status-row {
        display: flex;
        gap: 8px;
        width: 100%;
      }
      .status-btn {
        flex: 1;
        padding: 12px 4px;
        border-radius: 13px;
        border: 1.5px solid rgba(226, 128, 154, 0.4);
        background: #fffdfb;
        color: var(--ink-soft);
        font-weight: 700;
        font-size: 0.76rem;
        transition: all 0.3s ease;
      }
      .status-btn.is-selected {
        background: var(--rose);
        color: #fff;
        border-color: var(--rose);
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(226, 128, 154, 0.34);
      }
      .btn-main {
        width: 100%;
        box-sizing: border-box;
        margin-top: 14px;
        padding: 15px 20px;
        border-radius: 999px;
        background: var(--ink);
        color: #fffcf8;
        font-weight: 700;
        font-size: 0.78rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        transition:
          transform 0.3s ease,
          background 0.3s ease;
      }
      .btn-main:hover {
        transform: translateY(-3px);
        background: #4d4659;
      }
      .form-msg {
        font-size: 0.86rem;
        text-align: center;
        margin-top: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        transform: translateY(-6px);
        transition:
          opacity 0.5s ease,
          max-height 0.5s ease,
          transform 0.5s ease,
          padding 0.4s ease;
        padding-top: 0;
        padding-bottom: 0;
      }
      .form-ok {
        background: rgba(168, 216, 198, 0.42);
        color: #2f6a58;
      }
      .form-bad {
        background: rgba(243, 184, 198, 0.4);
        color: #94374f;
      }
      .paperform.is-submitted .form-ok,
      .paperform.is-error .form-bad {
        opacity: 1;
        max-height: 120px;
        transform: none;
        padding-top: 10px;
        padding-bottom: 10px;
      }
      .paperform.is-submitted input,
      .paperform.is-submitted textarea,
      .paperform.is-submitted .btn-main {
        opacity: 0.55;
      }
      #checkin-btn {
        display: block;
        width: 100%;
        max-width: 300px;
        margin: 18px auto 0;
        padding: 13px 20px;
        border-radius: 999px;
        border: 1.6px dashed var(--mint-deep);
        color: var(--mint-deep);
        background: rgba(255, 252, 248, 0.8);
        font-weight: 700;
        font-size: 0.74rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        transition:
          background 0.3s ease,
          transform 0.3s ease;
      }
      #checkin-btn:hover {
        background: rgba(168, 216, 198, 0.28);
        transform: translateY(-2px);
      }

      /* ---------- wishes list ---------- */
      #wishes-list {
        margin-top: 26px;
        display: grid;
        gap: 14px;
      }
      @media (min-width: 768px) {
        #wishes-list {
          grid-template-columns: 1fr 1fr;
        }
      }
      .comment-card {
        position: relative;
        padding: 20px 18px 16px;
        border-radius: 16px;
        background: var(--paper);
        box-shadow: var(--shadow);
        background-image: url("/assets/templates/kirigami-pastel/1787187755_c4db14e3.png");
        background-size: 260px;
      }
      .comment-card:nth-child(odd) {
        transform: rotate(-0.7deg);
      }
      .comment-card:nth-child(even) {
        transform: rotate(0.7deg);
      }
      .comment-tape {
        position: absolute;
        top: -9px;
        left: 50%;
        width: 70px;
        height: 18px;
        margin-left: -35px;
        background: rgba(168, 216, 198, 0.68);
        border-radius: 3px;
        transform: rotate(-2deg);
      }
      .comment-name {
        font-family: "Fraunces", serif;
        font-size: 1.02rem;
      }
      .comment-message {
        color: var(--ink-soft);
        font-size: 0.93rem;
        margin: 4px 0 6px;
      }
      .comment-date {
        font-size: 0.7rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--rose);
      }
      #wishes-more {
        display: block;
        margin: 20px auto 0;
        padding: 12px 26px;
        border-radius: 999px;
        border: 1.5px solid rgba(226, 128, 154, 0.5);
        color: var(--rose);
        background: rgba(255, 252, 248, 0.8);
        font-weight: 700;
        font-size: 0.72rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      /* ---------- closing ---------- */
      #closing {
        text-align: center;
        padding-bottom: 120px;
      }
      #closing-orn {
        width: 200px;
        height: 90px;
        margin: 0 auto 14px;
        display: block;
      }
      #closing-names {
        margin-top: 12px;
      }
      #closing-date {
        font-size: 0.8rem;
        letter-spacing: 0.24em;
        text-transform: uppercase;
        color: var(--ink-soft);
      }

      /* ---------- music ---------- */
      #music-btn {
        position: fixed;
        right: 16px;
        bottom: 18px;
        z-index: 80;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: var(--paper);
        color: var(--rose);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
          transform 0.35s ease,
          background 0.35s ease;
      }
      #music-btn.is-playing {
        background: var(--rose);
        color: #fff;
      }
      #music-icon {
        width: 24px;
        height: 24px;
      }
      @media (prefers-reduced-motion: no-preference) {
        #music-btn.is-playing #music-icon {
          animation: pulse 1.8s ease-in-out infinite;
        }
      }
      #music-btn.is-hidden {
        display: none;
      }
    </style>

    
  


<a href="https://wedivo.id/undangan-digital/" target="_blank" rel="noopener" data-wedivo-free-badge
  style="position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:2147483647;
  background:rgba(17,17,17,0.85);color:#fff;font:500 12px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  padding:7px 14px;border-radius:999px;text-decoration:none;white-space:nowrap;cursor:pointer;
  box-shadow:0 2px 10px rgba(0,0,0,0.25);">
  Undangan digital gratis dari <strong>Wedivo</strong>
</a>
    <div id="found-toast" class="toast-msg"><span id="found-toast-text">Nomor rekening berhasil disalin!</span></div>
`;

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function getKirigamiPastelHtml(data: any, guestName: string | null): string {
  const groom = data?.namaPutra || 'Mempelai Pria';
  const bride = data?.namaPutri || 'Mempelai Wanita';
  const groomFull = data?.namaLengkapPutra || groom;
  const brideFull = data?.namaLengkapPutri || bride;

  const groomParents = data?.kelahiranPutra
    ? `${data.kelahiranPutra} dari Bapak ${data?.namaAyahPutra || '...'} & Ibu ${data?.namaIbuPutra || '...'}`
    : (data?.namaAyahPutra || data?.namaIbuPutra)
      ? `Putra dari Bapak ${data?.namaAyahPutra || '...'} & Ibu ${data?.namaIbuPutra || '...'}`
      : 'Putra tercinta dari keluarga terhormat';

  const brideParents = data?.kelahiranPutri
    ? `${data.kelahiranPutri} dari Bapak ${data?.namaAyahPutri || '...'} & Ibu ${data?.namaIbuPutri || '...'}`
    : (data?.namaAyahPutri || data?.namaIbuPutri)
      ? `Putri dari Bapak ${data?.namaAyahPutri || '...'} & Ibu ${data?.namaIbuPutri || '...'}`
      : 'Putri tercinta dari keluarga terhormat';

  const weddingDateObj = data?.tanggalPernikahan ? new Date(data.tanggalPernikahan) : new Date();
  const weddingDateStr = formatTanggalIndo(weddingDateObj);
  const weddingDateIso = weddingDateObj.toISOString();

  const akadDateObj = data?.tanggalAkad ? new Date(data.tanggalAkad) : weddingDateObj;
  const akadDateStr = formatTanggalIndo(akadDateObj);
  const resepsiDateObj = data?.tanggalResepsi ? new Date(data.tanggalResepsi) : weddingDateObj;
  const resepsiDateStr = formatTanggalIndo(resepsiDateObj);
  const resepsiDateIso = resepsiDateObj.toISOString();
  const hasResepsi = !!data?.tanggalResepsi || !!data?.lokasiResepsi;

  const heroPhoto = data?.fotoHeader || data?.fotoHeader2 || (data?.galery?.fotos && data.galery.fotos[0]) || '/assets/templates/taman-rahasia/1790504088_624a7596.jpg';
  const groomPhoto = data?.photoPutra || '/assets/templates/taman-rahasia/groomPhoto_1790568192.jpg';
  const bridePhoto = data?.photoPutri || '/assets/templates/taman-rahasia/bridePhoto_1790568188.jpg';

  const akadJam = data?.jamAkad ? `${data.jamAkad} WIB – selesai` : '08:00 WIB – selesai';
  const resepsiJam = data?.jamResepsi ? `${data.jamResepsi} WIB – ${data?.jamSelesai ? data.jamSelesai + ' WIB' : 'selesai'}` : '11:00 WIB – selesai';

  const akadVenue = data?.lokasiAkad || data?.alamatGedungPernikahan || 'Kediaman Mempelai';
  const akadAddr = data?.alamatAkad || data?.alamatPernikahan || 'Alamat lengkap acara akad nikah';

  const resepsiVenue = data?.lokasiResepsi || data?.alamatGedungPernikahan || 'Gedung Pernikahan';
  const resepsiAddr = data?.alamatPernikahan || data?.alamatAkad || 'Alamat lengkap acara resepsi pernikahan';

  const mapsLink = data?.linkMaps || 'https://maps.google.com';
  const calLink = data?.linkGoogleCalender || '#';

  const heroQuote = 'Dua lembar kertas berbeda warna, digunting hati-hati, lalu direkat menjadi satu karya yang utuh.';
  const closingMessage = 'Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.';

  // Stories
  const p = data?.pertemuan;
  const bersamaList = Array.isArray(data?.bersamaFotos) ? data.bersamaFotos : [];
  const story1Title = p?.judulPertemuanSatu || 'Guntingan Pertama';
  const story1Text = p?.pertemuanPertama || 'Kisah awal perkenalan kami yang bermula dengan sederhana namun penuh makna.';
  const story1Photo = bersamaList[0] || '';

  const story2Title = p?.judulPertemuanDua || 'Lipatan Kedua';
  const story2Text = p?.pertemuanKedua || 'Perjalanan waktu dan komitmen yang bertumbuh seiring berjalannya hari demi hari bersama.';
  const story2Photo = bersamaList[1] || '';

  const story3Title = p?.judulPertemuanTiga || 'Rekatan Terakhir';
  const story3Text = p?.pertemuanKetiga || 'Keputusan suci untuk mengikat janji seumur hidup dalam sebuah ikatan pernikahan yang berkah.';
  const story3Photo = bersamaList[2] || '';

  // Digital gifts
  const isGiftActive = data?.isGiftActive !== false;
  const namaBank = data?.namaBank || 'BCA';
  const noAtm = data?.noAtm || '';
  const noHp = data?.noHp || '';
  const fotoQris = data?.fotoQris || '';
  const isQrisActive = data?.isQrisActive && !!fotoQris;

  const dynamicGiftsHtml = isGiftActive ? `
    <section id="gifts" class="sec has-wash" data-section="gifts">
      <div class="wash-bg" id="gifts-wash" aria-hidden="true"></div>
      <div class="wrap">
        <p class="eyebrow reveal" id="gift-eyebrow">Tanda Kasih</p>
        <h2 class="h-sec reveal" id="gift-title">Amplop Digital</h2>
        <p class="lead reveal" id="gift-note">Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda ingin memberikan tanda kasih secara digital, dapat melalui:</p>
        
        <div class="paperblock reveal reveal-cut gift-card" style="padding: 28px 22px;">
          ${(data?.namaBank || data?.noAtm) ? `
            <div style="margin-bottom: 20px;">
              <p class="gift-bank-name">${escapeHtml(namaBank)}</p>
              <p class="gift-acc-number" id="bank-number">${escapeHtml(noAtm)}</p>
              <p class="gift-acc-holder">a.n. ${escapeHtml(groomFull)}</p>
              <button type="button" class="gift-copy-btn" onclick="window.copyRekening('${escapeHtml(noAtm)}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Salin Rekening
              </button>
            </div>
          ` : ''}

          ${isQrisActive ? `
            <div class="gift-qris-wrap">
              <p style="font-weight: 700; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 8px;">QRIS Pembayaran</p>
              <img src="${escapeHtml(fotoQris)}" alt="QRIS Code" class="gift-qris-img" />
            </div>
          ` : ''}

          ${noHp ? `
            <div style="margin-top: 22px; border-top: 1px dashed rgba(207, 192, 234, 0.7); padding-top: 16px;">
              <p style="font-size: 0.85rem; color: var(--ink-soft); margin-top: 8px;">Konfirmasi pengiriman tanda kasih melalui WhatsApp:</p>
              <a href="https://wa.me/${noHp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Halo, saya telah mengirimkan tanda kasih untuk pernikahan ' + bride + ' & ' + groom)}" target="_blank" rel="noopener" class="gift-wa-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.053-1.637-.253-1.229-.374-2.112-1.22-2.316-1.49-.033-.044-.814-1.082-.814-2.064 0-.982.515-1.464.7-1.664.184-.2.4-.25.534-.25.133 0 .267.002.383.007.123.006.288-.047.45.342.167.405.57 1.393.62 1.494.05.101.084.22.017.354-.067.133-.101.217-.2.333-.1.117-.21.261-.3.35-.1.1-.205.209-.088.409.117.2.52.858 1.115 1.388.767.683 1.413.896 1.614.996.2.1.317.084.433-.05.117-.134.5-.584.634-.784.133-.2.267-.167.45-.1.183.067 1.164.55 1.364.65.2.1.334.15.384.233.05.084.05.484-.094.889z"/>
                </svg>
                Konfirmasi WhatsApp
              </a>
            </div>
          ` : ''}
        </div>
      </div>
    </section>
  ` : '';

  const groomIg = data?.instagramPutra
    ? `<br><a href="${data.instagramPutra.startsWith('http') ? data.instagramPutra : 'https://instagram.com/' + data.instagramPutra.replace('@', '')}" target="_blank" rel="noopener" style="display:inline-block;margin-top:8px;color:var(--rose);font-weight:700;">📸 @${data.instagramPutra.replace('@', '').replace('https://instagram.com/', '').replace('/', '')}</a>`
    : '';

  const brideIg = data?.instagramPutri
    ? `<br><a href="${data.instagramPutri.startsWith('http') ? data.instagramPutri : 'https://instagram.com/' + data.instagramPutri.replace('@', '')}" target="_blank" rel="noopener" style="display:inline-block;margin-top:8px;color:var(--rose);font-weight:700;">📸 @${data.instagramPutri.replace('@', '').replace('https://instagram.com/', '').replace('/', '')}</a>`
    : '';

  let output = BASE_KIRIGAMI_HTML
    .replace(/__BRIDE_NAME__/g, escapeHtml(bride))
    .replace(/__GROOM_NAME__/g, escapeHtml(groom))
    .replace(/__BRIDE_FULL__/g, escapeHtml(brideFull))
    .replace(/__GROOM_FULL__/g, escapeHtml(groomFull))
    .replace(/__BRIDE_NICK__/g, escapeHtml(bride))
    .replace(/__GROOM_NICK__/g, escapeHtml(groom))
    .replace(/__BRIDE_PARENTS__/g, escapeHtml(brideParents))
    .replace(/__GROOM_PARENTS__/g, escapeHtml(groomParents))
    .replace(/__BRIDE_IG__/g, brideIg)
    .replace(/__GROOM_IG__/g, groomIg)
    .replace(/__GUEST_NAME__/g, escapeHtml(guestName || ''))
    .replace(/__HERO_PHOTO__/g, escapeHtml(heroPhoto))
    .replace(/__GROOM_PHOTO__/g, escapeHtml(groomPhoto))
    .replace(/__BRIDE_PHOTO__/g, escapeHtml(bridePhoto))
    .replace(/__HERO_QUOTE__/g, escapeHtml(heroQuote))
    .replace(/__CLOSING_MESSAGE__/g, escapeHtml(closingMessage))
    .replace(/__STORY_1_TITLE__/g, escapeHtml(story1Title))
    .replace(/__STORY_1_TEXT__/g, escapeHtml(story1Text))
    .replace(/__STORY_1_PHOTO__/g, escapeHtml(story1Photo))
    .replace(/__STORY_2_TITLE__/g, escapeHtml(story2Title))
    .replace(/__STORY_2_TEXT__/g, escapeHtml(story2Text))
    .replace(/__STORY_2_PHOTO__/g, escapeHtml(story2Photo))
    .replace(/__STORY_3_TITLE__/g, escapeHtml(story3Title))
    .replace(/__STORY_3_TEXT__/g, escapeHtml(story3Text))
    .replace(/__STORY_3_PHOTO__/g, escapeHtml(story3Photo))
    .replace(/__AKAD_VENUE__/g, escapeHtml(akadVenue))
    .replace(/__AKAD_ADDR__/g, escapeHtml(akadAddr))
    .replace(/__MAPS_LINK__/g, escapeHtml(mapsLink))
    .replace(/__CAL_LINK__/g, escapeHtml(calLink))
    .replace(/__RESEPSI_NAME__/g, hasResepsi ? 'Resepsi Pernikahan' : '')
    .replace(/__RESEPSI_DATE_RAW__/g, resepsiDateIso.split('T')[0])
    .replace(/__RESEPSI_TIME_RAW__/g, data?.jamResepsi || '11:00')
    .replace(/__RESEPSI_VENUE__/g, escapeHtml(resepsiVenue))
    .replace(/__RESEPSI_ADDR__/g, escapeHtml(resepsiAddr))
    .replace(/__VENUE_NAME__/g, escapeHtml(akadVenue || resepsiVenue))
    .replace(/__VENUE_ADDR__/g, escapeHtml(akadAddr || resepsiAddr))
    .replace(/__DYNAMIC_GIFTS_SECTION__/g, dynamicGiftsHtml)
    .replace(/__AUDIO_URL__/g, '/assets/music/music.mp3');

  return output;
}
