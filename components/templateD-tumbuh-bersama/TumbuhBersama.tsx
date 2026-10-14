import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { getTumbuhBersamaHtml } from './tumbuhBersamaHtml';
import {
  escapeHtml,
  fetchUcapanes,
  fetchRsvpComments,
  formatWishDate,
  parseRsvpDetails,
  postRsvp,
  postUcapan,
  toggleLike,
  copyRekening,
  type ApiComment,
  type RsvpStatus,
  type UcapanItem,
} from './tumbuhBersamaApi';

interface TumbuhBersamaProps {
  adminId?: string;
  guestName?: string | null;
  templateWedingData?: any;
  isAdminView?: boolean;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const TumbuhBersama: React.FC<TumbuhBersamaProps> = ({
  adminId,
  guestName,
  templateWedingData,
}) => {
  const groom = templateWedingData?.namaPutra || 'Bumi';
  const bride = templateWedingData?.namaPutri || 'Asri';
  const pageTitle = `${bride} & ${groom} — Tumbuh Bersama`;
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 1. Stabilisasi HTML: Buat markup sekali saat mount agar React tidak menghapus canvas/DOM hidup saat re-render
  const [initialHtml] = useState(() => {
    return getTumbuhBersamaHtml(templateWedingData || {}, guestName || null);
  });

  // 2. Jika nama tamu baru datang belakangan dari query router, update teks di DOM tanpa merusak canvas
  useEffect(() => {
    if (!guestName) return;
    const nameEls = document.querySelectorAll(
      '#cover-guest, .cover-guest-name, .guest-name, [data-guest-name], #rs-tag-name'
    );
    nameEls.forEach((el) => {
      el.textContent = guestName;
    });
    const rsNameIn = document.getElementById('rs-name') as HTMLInputElement | null;
    if (rsNameIn && !rsNameIn.value) {
      rsNameIn.value = guestName;
    }
    const wsNameIn = document.getElementById('ws-name') as HTMLInputElement | null;
    if (wsNameIn && !wsNameIn.value) {
      wsNameIn.value = guestName;
    }
  }, [guestName]);

  useEffect(() => {
    const templateWedingId = templateWedingData?.id;

    // 3. Status awal Cover: Selalu tampilkan cover amplop benih seperti link asli Wedivo
    const coverEl = document.getElementById('sec-cover');
    if (coverEl && !coverEl.classList.contains('is-gone')) {
      document.body?.classList?.add('is-covered');
      document.body?.classList?.remove('is-open');
    }

    // 4. Pass Gallery Photos dari Database
    const normalizePhotos = (list: any): string[] =>
      (Array.isArray(list) ? list : String(list || '').split(','))
        .map((f: any) => (typeof f === 'string' ? f : f?.url || ''))
        .map((s: string) => String(s).trim())
        .filter(Boolean);

    const galeryList = normalizePhotos(templateWedingData?.galery?.fotos);
    const bersamaList = normalizePhotos(templateWedingData?.bersamaFotos);

    const galleryUrls =
      galeryList.length > 0
        ? galeryList
        : bersamaList.length > 0
          ? bersamaList
          : [
              '/assets/templates/tumbuh-bersama/gallery_1.jpg',
              '/assets/templates/tumbuh-bersama/gallery_2.jpg',
              '/assets/templates/tumbuh-bersama/gallery_3.jpg',
            ];

    (window as any).__TUMBUH_BERSAMA_GALLERY__ = galleryUrls;

    // 5. Audio / BGM Source
    const audioUrl =
      templateWedingData?.audio ||
      templateWedingData?.musik?.file ||
      '/audio/canon-in-d.mp3';
    const bgmEl = document.getElementById('bgm') as HTMLAudioElement | null;
    if (bgmEl) {
      const curSrc = bgmEl.getAttribute('src');
      if (!curSrc || curSrc.includes('{{background_music_url}}') || curSrc === '') {
        bgmEl.src = audioUrl;
      }
    }

    // 6. Eksekusi Buka Undangan (Sobek & Tanam) — Master sequence dari tumbuh-bersama.js
    let openingStarted = false;
    const handleOpenInvitation = () => {
      if (openingStarted) return;
      openingStarted = true;

      if (typeof (window as any).openTumbuhCover === 'function') {
        try {
          (window as any).openTumbuhCover();
        } catch {}
      }

      const bgm = document.getElementById('bgm') as HTMLAudioElement | null;
      if (bgm) {
        bgm.volume = 0.55;
        setTimeout(() => {
          bgm.play().catch(() => {});
        }, 400);
      }
    };

    (window as any).forceOpenTumbuhInvitation = handleOpenInvitation;

    // =========================================================================
    // STATE & HELPERS: KEBUN DOA (ucapan_harapan)
    // =========================================================================
    let ucapanOffset = 0;
    const UCAPAN_LIMIT = 6;
    let ucapanTotal = 0;

    const createFlowerCardHtml = (item: UcapanItem, index: number): string => {
      const tone = 1 + (hashString((item.name || '') + '|' + index) % 6);
      return `
        <article class="comment-card ws-card ws-c${tone}" id="ws-card-${item.id}">
          <svg class="ws-flower" viewBox="0 0 60 76" aria-hidden="true">
            <use href="#sym-flower"></use>
          </svg>
          <div class="ws-tag">
            <p class="comment-message ws-msg" data-field="message">${escapeHtml(item.ucapan)}</p>
            <p class="comment-name ws-name" data-field="name">${escapeHtml(item.name)}</p>
            <p class="comment-date ws-date" data-field="date">${formatWishDate(item.createdAt)}</p>
          </div>
        </article>
      `;
    };

    const renderUcapanList = (items: UcapanItem[], append: boolean = false) => {
      const activeWsList = document.getElementById('ws-list');
      const activeWsEmpty = document.getElementById('ws-empty');
      const activeWsBed = document.getElementById('ws-bed');
      const activeWsMore = document.getElementById('ws-more');

      if (!activeWsList) return;
      if (!append) {
        activeWsList.innerHTML = '';
      }

      if (items.length === 0 && activeWsList.children.length === 0) {
        if (activeWsEmpty) activeWsEmpty.style.display = 'block';
        if (activeWsBed) activeWsBed.classList.add('is-empty');
        if (activeWsMore) activeWsMore.style.display = 'none';
        return;
      }

      if (activeWsEmpty) activeWsEmpty.style.display = 'none';
      if (activeWsBed) activeWsBed.classList.remove('is-empty');

      const html = items
        .map((item, idx) => createFlowerCardHtml(item, ucapanOffset + idx))
        .join('');
      if (append) {
        activeWsList.insertAdjacentHTML('beforeend', html);
      } else {
        activeWsList.innerHTML = html;
      }

      if (activeWsMore) {
        const currentCount = activeWsList.querySelectorAll('.ws-card').length;
        activeWsMore.style.display = currentCount < ucapanTotal ? 'inline-flex' : 'none';
      }
    };

    const loadUcapan = async (reset: boolean = false) => {
      if (!templateWedingId) return;
      try {
        const offset = reset ? 0 : ucapanOffset;
        const res = await fetchUcapanes(templateWedingId, offset, UCAPAN_LIMIT);
        if (res.success && Array.isArray(res.ucapan)) {
          ucapanTotal = res.total;
          if (reset) {
            ucapanOffset = res.ucapan.length;
            renderUcapanList(res.ucapan, false);
          } else {
            ucapanOffset += res.ucapan.length;
            renderUcapanList(res.ucapan, true);
          }
        }
      } catch (err) {
        console.error('Gagal memuat Kebun Doa:', err);
      }
    };

    const handleUcapanSubmit = async (e?: Event) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!templateWedingId) {
        console.warn('templateWedingId tidak ditemukan');
        return;
      }

      const nameIn = document.getElementById('ws-name') as HTMLInputElement | null;
      const msgIn = document.getElementById('ws-msg') as HTMLTextAreaElement | null;
      const submitBtn = document.getElementById('ws-submit') as HTMLButtonElement | null;
      const wsError = document.getElementById('ws-error');

      const name = nameIn?.value.trim() || '';
      const ucapanText = msgIn?.value.trim() || '';

      if (!name || !ucapanText) {
        if (wsError) {
          wsError.textContent = 'Mohon isi nama dan doa terlebih dahulu.';
          wsError.style.display = 'block';
          setTimeout(() => {
            if (wsError) wsError.style.display = 'none';
          }, 3500);
        }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await postUcapan({
          templateWedingId,
          name,
          ucapan: ucapanText,
        });

        if (res.success && res.ucapan) {
          const doneEl = document.getElementById('ws-done');
          if (doneEl) {
            doneEl.style.display = 'block';
            setTimeout(() => {
              if (doneEl) doneEl.style.display = 'none';
            }, 4000);
          }

          const activeWsList = document.getElementById('ws-list');
          const activeWsEmpty = document.getElementById('ws-empty');
          const activeWsBed = document.getElementById('ws-bed');

          if (activeWsEmpty) activeWsEmpty.style.display = 'none';
          if (activeWsBed) activeWsBed.classList.remove('is-empty');

          if (activeWsList) {
            const newCardHtml = createFlowerCardHtml(res.ucapan, 0);
            activeWsList.insertAdjacentHTML('afterbegin', newCardHtml);
            ucapanTotal += 1;
            ucapanOffset += 1;
          }

          // Fetch data segar dari server agar seluruh feed tersinkronkan
          await loadUcapan(true);

          if (msgIn) msgIn.value = '';
          const activeForm = document.getElementById('ws-form') as HTMLFormElement | null;
          if (activeForm) activeForm.reset();
        }
      } catch (err: any) {
        console.error('Gagal menanam doa:', err);
        if (wsError) {
          wsError.textContent = err?.message || 'Gagal mengirim doa, coba beberapa saat lagi.';
          wsError.style.display = 'block';
          setTimeout(() => {
            if (wsError) {
              wsError.textContent = 'Mohon isi nama dan doa terlebih dahulu.';
              wsError.style.display = 'none';
            }
          }, 4000);
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    };

    // =========================================================================
    // STATE & HELPERS: IKUT MENANAM? (comments RSVP)
    // =========================================================================
    let rsvpOffset = 0;
    const RSVP_LIMIT = 6;
    let rsvpTotal = 0;
    let currentRsvpStatus: RsvpStatus = 'attending';

    const defaultAttendingBtn = document.getElementById('rs-yes');
    if (defaultAttendingBtn) {
      defaultAttendingBtn.classList.add('is-selected');
    }

    const refreshRsvpStats = async () => {
      if (!templateWedingId) return;
      try {
        const statsRes = await fetch(`/api/stats?templateWedingId=${encodeURIComponent(templateWedingId)}`);
        const statsData = await statsRes.json();
        if (statsData?.success && statsData?.data) {
          const presEl = document.getElementById('rsvp-stat-present');
          const absEl = document.getElementById('rsvp-stat-absent');
          const totEl = document.getElementById('rsvp-stat-total');
          if (presEl) presEl.textContent = String(statsData.data.present || 0);
          if (absEl) absEl.textContent = String(statsData.data.absent || 0);
          if (totEl) totEl.textContent = String(statsData.data.comments || 0);
        }
      } catch (e) {
        console.warn('Gagal refresh stats:', e);
      }
    };

    const updateStatsDisplay = (presentDelta: number, absentDelta: number, totalDelta: number) => {
      const presEl = document.getElementById('rsvp-stat-present');
      const absEl = document.getElementById('rsvp-stat-absent');
      const totEl = document.getElementById('rsvp-stat-total');

      if (presEl) {
        const cur = parseInt(presEl.textContent || '0', 10);
        presEl.textContent = String(Math.max(0, cur + presentDelta));
      }
      if (absEl) {
        const cur = parseInt(absEl.textContent || '0', 10);
        absEl.textContent = String(Math.max(0, cur + absentDelta));
      }
      if (totEl) {
        const cur = parseInt(totEl.textContent || '0', 10);
        totEl.textContent = String(Math.max(0, cur + totalDelta));
      }
    };

    const createRsvpCardHtml = (c: ApiComment): string => {
      const { statusLabel, paxText, note } = parseRsvpDetails(c.comment);
      const isAttending = c.presence;
      const badgeBg = isAttending
        ? 'rgba(90,118,69,0.12)'
        : statusLabel.includes('Ragu')
          ? 'rgba(217,119,6,0.12)'
          : 'rgba(154,71,96,0.12)';
      const badgeColor = isAttending
        ? '#445b32'
        : statusLabel.includes('Ragu')
          ? '#92400e'
          : '#9a4760';

      return `
        <div class="rsvp-card-item" id="rsvp-item-${c.id}" style="padding:13px 15px; border-radius:14px; background:rgba(255,255,255,0.85); border:1px solid var(--line); box-shadow:0 2px 6px -3px rgba(40,30,15,0.08); display:grid; gap:6px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <strong style="font-family:var(--f-serif); font-size:15px; color:var(--ink);">${escapeHtml(c.name)}</strong>
              <span style="font-size:11px; padding:2px 8px; border-radius:999px; background:${badgeBg}; color:${badgeColor}; font-family:var(--f-sans); font-weight:600;">
                ${escapeHtml(statusLabel)} ${paxText ? `· ${escapeHtml(paxText)}` : ''}
              </span>
            </div>
            <span style="font-family:var(--f-mono); font-size:11px; color:var(--ink-3); white-space:nowrap;">${formatWishDate(c.createdAt)}</span>
          </div>
          ${
            note
              ? `<p style="font-family:var(--f-sans); font-size:13px; line-height:1.5; color:var(--ink-2); margin:0;">${escapeHtml(note)}</p>`
              : ''
          }
          <div style="display:flex; justify-content:flex-end; align-items:center;">
            <button type="button" class="rsvp-like-btn" data-comment-id="${c.id}" style="background:none; border:none; padding:3px 6px; cursor:pointer; display:inline-flex; align-items:center; gap:4px; font-size:12px; color:${c.liked ? '#9a4760' : 'var(--ink-3)'};">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="${c.liked ? '#9a4760' : 'none'}" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span class="rsvp-like-count">${c.likesCount || 0}</span>
            </button>
          </div>
        </div>
      `;
    };

    const renderRsvpComments = (comments: ApiComment[], append: boolean = false) => {
      const activeRsvpList = document.getElementById('rsvp-comments-list');
      const activeRsvpEmpty = document.getElementById('rsvp-comments-empty');
      const activeRsvpCount = document.getElementById('rsvp-comments-count');
      const activeRsvpMore = document.getElementById('rsvp-more-btn');

      if (!activeRsvpList) return;
      if (!append) {
        activeRsvpList.innerHTML = '';
      }

      if (comments.length === 0 && activeRsvpList.children.length === 0) {
        if (activeRsvpEmpty) activeRsvpEmpty.style.display = 'block';
        if (activeRsvpCount) activeRsvpCount.textContent = '0 Catatan';
        if (activeRsvpMore) activeRsvpMore.style.display = 'none';
        return;
      }

      if (activeRsvpEmpty) activeRsvpEmpty.style.display = 'none';
      if (activeRsvpCount) activeRsvpCount.textContent = `${rsvpTotal} Catatan`;

      const html = comments.map((c) => createRsvpCardHtml(c)).join('');
      if (append) {
        activeRsvpList.insertAdjacentHTML('beforeend', html);
      } else {
        activeRsvpList.innerHTML = html;
      }

      if (activeRsvpMore) {
        const currentCount = activeRsvpList.querySelectorAll('.rsvp-card-item').length;
        activeRsvpMore.style.display = currentCount < rsvpTotal ? 'inline-flex' : 'none';
      }
    };

    const loadRsvpComments = async (reset: boolean = false) => {
      if (!templateWedingId) return;
      try {
        const offset = reset ? 0 : rsvpOffset;
        const res = await fetchRsvpComments(templateWedingId, offset, RSVP_LIMIT);
        if (res.success && Array.isArray(res.comments)) {
          rsvpTotal = res.total;
          if (reset) {
            rsvpOffset = res.comments.length;
            renderRsvpComments(res.comments, false);
          } else {
            rsvpOffset += res.comments.length;
            renderRsvpComments(res.comments, true);
          }
        }
      } catch (err) {
        console.error('Gagal memuat catatan RSVP:', err);
      }
    };

    const handleRsvpSubmit = async (e?: Event) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!templateWedingId) {
        console.warn('templateWedingId tidak ditemukan');
        return;
      }

      const nameIn = document.getElementById('rs-name') as HTMLInputElement | null;
      const paxIn = document.getElementById('rs-pax-in') as HTMLInputElement | null;
      const msgIn = document.getElementById('rs-msg') as HTMLTextAreaElement | null;
      const submitBtn = document.getElementById('rs-submit') as HTMLButtonElement | null;
      const rsError = document.getElementById('rs-error');

      const name = nameIn?.value.trim() || '';
      const pax = parseInt(paxIn?.value || '1', 10);
      const message = msgIn?.value.trim() || '';

      const selectedBtn = document.querySelector('#rs-status [data-wedivo-status].is-selected');
      const status =
        (selectedBtn?.getAttribute('data-wedivo-status') as RsvpStatus) ||
        currentRsvpStatus ||
        'attending';

      if (!name) {
        if (rsError) {
          rsError.textContent = 'Mohon masukkan nama Anda terlebih dahulu.';
          rsError.style.display = 'block';
          setTimeout(() => {
            if (rsError) rsError.style.display = 'none';
          }, 3500);
        }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await postRsvp({
          templateWedingId,
          name,
          status,
          pax,
          message,
        });

        if (res.success && res.comment) {
          const formEl = document.getElementById('rs-form');
          const rsScene = document.getElementById('rs-scene');
          const rsDone = document.getElementById('rs-done');
          const rsvpEditBtn = document.getElementById('rsvp-edit');

          if (formEl) formEl.classList.add('is-submitted');
          if (rsScene) rsScene.classList.add('is-planted');
          if (rsDone) rsDone.style.display = 'block';

          if (rsvpEditBtn) {
            rsvpEditBtn.style.display = 'inline-flex';
          }

          const activeRsvpList = document.getElementById('rsvp-comments-list');
          const activeRsvpEmpty = document.getElementById('rsvp-comments-empty');
          const activeRsvpCount = document.getElementById('rsvp-comments-count');

          if (activeRsvpEmpty) activeRsvpEmpty.style.display = 'none';

          if (activeRsvpList) {
            const newCommentHtml = createRsvpCardHtml(res.comment);
            activeRsvpList.insertAdjacentHTML('afterbegin', newCommentHtml);
            rsvpTotal += 1;
            rsvpOffset += 1;
            if (activeRsvpCount) {
              activeRsvpCount.textContent = `${rsvpTotal} Catatan`;
            }
          }

          // Sinkronkan seluruh daftar dan statistik secara real-time
          await loadRsvpComments(true);
          await refreshRsvpStats();
        }
      } catch (err: any) {
        console.error('Gagal mengirim RSVP:', err);
        if (rsError) {
          rsError.textContent = err?.message || 'Gagal menyimpan kehadiran, coba beberapa saat lagi.';
          rsError.style.display = 'block';
          setTimeout(() => {
            if (rsError) {
              rsError.textContent = 'Pilih dulu status kehadiran Anda, ya — atau periksa kembali isiannya.';
              rsError.style.display = 'none';
            }
          }, 4000);
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    };

    // =========================================================================
    // 7. DELEGATED GLOBAL CLICK LISTENER
    // =========================================================================
    const handleGlobalClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 7.1 Tombol Sobek & Tanam / Buka Undangan
      const openBtn = target.closest(
        '#cover-open, #packet-tear, #packet-strip, #packet-cut, #packet-crimp, #packet, .packet, .packet-strip, .packet-cut, .packet-tear, .cover-open, .cover-btn, [data-action="open-invitation"]'
      );
      if (openBtn) {
        e.preventDefault();
        handleOpenInvitation();
        return;
      }

      // 7.2 Garden Rail Navigasi ([data-nav-target])
      const navBtn = target.closest('[data-nav-target]') as HTMLElement | null;
      if (navBtn) {
        e.preventDefault();
        const id = navBtn.getAttribute('data-nav-target');
        if (!id) return;

        const targetSec =
          (document.querySelector(`[data-section="${id}"]`) as HTMLElement | null) ||
          document.getElementById(`sec-${id}`) ||
          document.getElementById(id);

        if (targetSec) {
          document
            .querySelectorAll('#nav-rail [data-nav-target], .nav [data-nav-target]')
            .forEach((btn) => {
              btn.classList.toggle('is-active', btn.getAttribute('data-nav-target') === id);
            });

          targetSec.classList.add('is-seen', 'in-view');
          targetSec
            .querySelectorAll('.rv, .rv-pop, .rv-down, .rv-fall, .sh-sprout')
            .forEach((el) => {
              el.classList.add('in-view', 'is-seen');
            });

          const top = targetSec.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: Math.max(0, top - 10),
            behavior: 'smooth',
          });

          navBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
        return;
      }

      // 7.3 Kembali ke benih (Back to top)
      const topBtn = target.closest('#cl-top, .cl-top');
      if (topBtn) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // 7.4 Tombol Suara BGM (#nav-sound)
      const soundBtn = target.closest('#nav-sound, .nav-sound');
      if (soundBtn) {
        e.preventDefault();
        const bgm = document.getElementById('bgm') as HTMLAudioElement | null;
        if (bgm) {
          if (bgm.paused) {
            bgm.play().catch(() => {});
            soundBtn.setAttribute('aria-pressed', 'true');
          } else {
            bgm.pause();
            soundBtn.setAttribute('aria-pressed', 'false');
          }
        }
        return;
      }

      // 7.5 Tombol Salin Nomor Rekening ATM
      const copyBtn = target.closest('#gf-copy-btn, [data-copy-account]') as HTMLElement | null;
      if (copyBtn) {
        e.preventDefault();
        const noRek =
          copyBtn.getAttribute('data-copy-account') ||
          document.getElementById('gf-account-number')?.textContent?.trim() ||
          '';
        if (noRek) {
          copyRekening(noRek);
          const copyTextEl = document.getElementById('gf-copy-text');
          if (copyTextEl) {
            const original = copyTextEl.textContent;
            copyTextEl.textContent = '✓ Nomor Rekening Tersalin';
            setTimeout(() => {
              copyTextEl.textContent = original;
            }, 2500);
          }
        }
        return;
      }

      // 7.6 Tombol Submit RSVP "Kirim & tanam bibitku"
      const rsSubmitTarget = target.closest('#rs-submit');
      if (rsSubmitTarget) {
        e.preventDefault();
        e.stopPropagation();
        handleRsvpSubmit(e);
        return;
      }

      // 7.7 Tombol Submit Kebun Doa "Tanam doa"
      const wsSubmitTarget = target.closest('#ws-submit');
      if (wsSubmitTarget) {
        e.preventDefault();
        e.stopPropagation();
        handleUcapanSubmit(e);
        return;
      }

      // 7.8 Pilihan Status RSVP
      const statusBtn = target.closest('#rs-status [data-wedivo-status]') as HTMLElement | null;
      if (statusBtn) {
        const val = statusBtn.getAttribute('data-wedivo-status') as RsvpStatus;
        if (val) {
          currentRsvpStatus = val;
          document.querySelectorAll('#rs-status [data-wedivo-status]').forEach((b) => {
            b.classList.remove('is-selected');
          });
          statusBtn.classList.add('is-selected');
        }
        return;
      }

      // 7.9 Tombol Ubah Jawaban RSVP
      const editBtn = target.closest('#rsvp-edit');
      if (editBtn) {
        e.preventDefault();
        const formEl = document.getElementById('rs-form');
        const rsScene = document.getElementById('rs-scene');
        const rsDone = document.getElementById('rs-done');
        const rsvpEditBtn = document.getElementById('rsvp-edit');
        if (formEl) formEl.classList.remove('is-submitted');
        if (rsScene) rsScene.classList.remove('is-planted');
        if (rsDone) rsDone.style.display = 'none';
        if (rsvpEditBtn) rsvpEditBtn.style.display = 'none';
        return;
      }

      // 7.10 Tombol Like pada Feed RSVP
      const likeBtn = target.closest('.rsvp-like-btn') as HTMLElement | null;
      if (likeBtn) {
        e.preventDefault();
        const commentId = likeBtn.getAttribute('data-comment-id');
        if (!commentId) return;

        try {
          const res = await toggleLike(commentId);
          const countEl = likeBtn.querySelector('.rsvp-like-count');
          const currentCount = parseInt(countEl?.textContent || '0', 10);
          if (countEl) {
            countEl.textContent = String(
              res.liked ? currentCount + 1 : Math.max(0, currentCount - 1)
            );
          }
          likeBtn.style.color = res.liked ? '#9a4760' : 'var(--ink-3)';
          const svgPath = likeBtn.querySelector('svg');
          if (svgPath) {
            svgPath.setAttribute('fill', res.liked ? '#9a4760' : 'none');
          }
        } catch (err) {
          console.error('Like error:', err);
        }
        return;
      }
    };

    // 7.11 Delegated Form Submit Listener (useCapture = true)
    const handleGlobalSubmit = (e: Event) => {
      const form = e.target as HTMLElement | null;
      if (!form) return;
      if (form.id === 'rs-form' || form.closest('#rs-form')) {
        e.preventDefault();
        e.stopPropagation();
        handleRsvpSubmit(e);
        return;
      }
      if (form.id === 'ws-form' || form.closest('#ws-form')) {
        e.preventDefault();
        e.stopPropagation();
        handleUcapanSubmit(e);
        return;
      }
    };

    // 7.12 Cegah Enter pada Input me-refresh halaman
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const target = e.target as HTMLElement | null;
        if (target && target.tagName === 'INPUT') {
          if (target.closest('#rs-form')) {
            e.preventDefault();
            handleRsvpSubmit(e);
          } else if (target.closest('#ws-form')) {
            e.preventDefault();
            handleUcapanSubmit(e);
          }
        }
      }
    };

    document.addEventListener('click', handleGlobalClick, true);
    document.addEventListener('submit', handleGlobalSubmit, true);
    document.addEventListener('keydown', handleGlobalKeyDown, true);

    // 8. IntersectionObserver Scroll Reveal Handler
    let revealObserver: IntersectionObserver | null = null;
    const handleScrollReveal = () => {
      const vh = window.innerHeight;
      document
        .querySelectorAll('section, [data-section], .sec, header, footer')
        .forEach((sec) => {
          const rect = sec.getBoundingClientRect();
          if (rect.top < vh * 1.2 && rect.bottom > -100) {
            sec.classList.add('in-view', 'is-seen');
            sec
              .querySelectorAll('.rv, .rv-pop, .rv-down, .rv-fall, .sh-sprout')
              .forEach((el) => {
                el.classList.add('in-view', 'is-seen');
              });
          }
        });
    };

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view', 'is-seen');
              entry.target
                .querySelectorAll('.rv, .rv-pop, .rv-down, .rv-fall, .sh-sprout')
                .forEach((el) => {
                  el.classList.add('in-view', 'is-seen');
                });
            }
          });
        },
        { threshold: 0.02, rootMargin: '0px 0px 120px 0px' }
      );

      const revealElements = document.querySelectorAll(
        'section, [data-section], .sec, .rv, .sh-sprout, header, footer'
      );
      revealElements.forEach((el) => revealObserver?.observe(el));
    }

    window.addEventListener('scroll', handleScrollReveal, { passive: true });
    handleScrollReveal();

    // 9. Load & Execute Engine Botani (Pola Sukses Template B)
    const runInit = () => {
      if (typeof (window as any).initTumbuhBersama === 'function') {
        try {
          (window as any).initTumbuhBersama();
        } catch (err) {
          console.warn('initTumbuhBersama error:', err);
        }
      }
    };

    let scriptEl: HTMLScriptElement | null = null;
    const initTimer = setTimeout(() => {
      if (typeof (window as any).initTumbuhBersama === 'function') {
        runInit();
      } else {
        scriptEl = document.createElement('script');
        scriptEl.src = '/dist/tumbuh-bersama.js';
        scriptEl.async = true;
        scriptEl.onload = runInit;
        document.body.appendChild(scriptEl);
      }
    }, 50);

    // 10. MutationObserver Pengaman Re-render (Pola Tangguh Template B)
    let moTimer: ReturnType<typeof setTimeout> | null = null;
    let running = false;
    const reInit = () => {
      if (running) return;
      running = true;
      try {
        runInit();
      } finally {
        running = false;
      }
    };
    const observer = new MutationObserver(() => {
      if (moTimer) clearTimeout(moTimer);
      moTimer = setTimeout(reInit, 60);
    });
    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true });
    }

    // Load initial feed pagination
    if (templateWedingId) {
      loadUcapan(true);
      loadRsvpComments(true);
    }

    const handleUcapanMore = (e: Event) => {
      e.preventDefault();
      loadUcapan(false);
    };

    const wsMoreBtn = document.getElementById('ws-more');
    if (wsMoreBtn) {
      wsMoreBtn.addEventListener('click', handleUcapanMore);
    }

    const handleRsvpMore = (e: Event) => {
      e.preventDefault();
      loadRsvpComments(false);
    };

    const rsvpMoreBtn = document.getElementById('rsvp-more-btn');
    if (rsvpMoreBtn) {
      rsvpMoreBtn.addEventListener('click', handleRsvpMore);
    }

    // =========================================================================
    // CLEANUP
    // =========================================================================
    return () => {
      clearTimeout(initTimer);
      if (moTimer) clearTimeout(moTimer);
      observer.disconnect();
      if (revealObserver) {
        revealObserver.disconnect();
      }
      window.removeEventListener('scroll', handleScrollReveal);
      document.body?.classList?.remove('is-covered', 'is-open');

      document.removeEventListener('click', handleGlobalClick, true);
      document.removeEventListener('submit', handleGlobalSubmit, true);
      document.removeEventListener('keydown', handleGlobalKeyDown, true);

      if (wsMoreBtn) wsMoreBtn.removeEventListener('click', handleUcapanMore);
      if (rsvpMoreBtn) rsvpMoreBtn.removeEventListener('click', handleRsvpMore);

      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [templateWedingData]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Undangan Pernikahan ${bride} & ${groom} — Tumbuh Bersama`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="stylesheet" href="/css/tumbuh-bersama.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gloock&family=Alegreya:ital,wght@0,400;0,500;1,400;1,500&family=Alegreya+Sans:ital,wght@0,400;0,500;0,700;1,400&family=Nothing+You+Could+Do&family=Xanh+Mono&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        id="tumbuh-bersama-container"
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: initialHtml }}
        suppressHydrationWarning
      />
    </>
  );
};

export default TumbuhBersama;
