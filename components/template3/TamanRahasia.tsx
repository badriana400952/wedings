import React, { useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { getTamanRahasiaHtml } from './tamanRahasiaHtml';
import {
  escapeHtml,
  fetchUcapanes,
  fetchAllComments,
  formatWishDate,
  postRsvp,
  postUcapan,
  toggleLike,
  type ApiComment,
  type RsvpStatus,
  type UcapanItem,
} from './tamanRahasiaApi';
import { RSVP_PREFIX } from '@/lib/comment-kind';

interface TamanRahasiaProps {
  adminId?: string;
  guestName?: string | null;
  templateWedingData?: any;
  isAdminView?: boolean;
}

const TamanRahasia: React.FC<TamanRahasiaProps> = ({
  adminId,
  guestName,
  templateWedingData,
}) => {
  const groom = templateWedingData?.namaPutra || 'Mempelai Pria';
  const bride = templateWedingData?.namaPutri || 'Mempelai Wanita';
  const pageTitle = `${groom} & ${bride} — Undangan Pernikahan`;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const html = useMemo(() => {
    return getTamanRahasiaHtml(templateWedingData || {}, guestName);
  }, [templateWedingData, guestName]);

  useEffect(() => {
    // 0. Persistence key for invitation opened state
    const storageKey = `invitation_opened_${adminId || 'taman'}`;
    const wasAlreadyOpened = () => {
      try {
        return sessionStorage.getItem(storageKey) === 'true';
      } catch {
        return false;
      }
    };

    // 1. Initial Body State setup
    if (wasAlreadyOpened()) {
      const cover = document.getElementById('sec-cover');
      if (cover) {
        cover.classList.add('is-turning', 'is-open', 'is-enter', 'is-gone');
        cover.style.display = 'none';
      }
      document.body.classList.remove('is-locked');
      document.body.classList.add('is-open');
    } else {
      const coverEl = document.getElementById('sec-cover');
      if (coverEl && coverEl.style.display !== 'none' && !coverEl.classList.contains('is-gone')) {
        document.body.classList.add('is-locked');
        document.body.classList.remove('is-open');
      }
    }

    // 2. Pass gallery photos to global window
    const normalizePhotos = (list: any): string[] =>
      (Array.isArray(list) ? list : String(list || '').split(','))
        .map((f: any) => (typeof f === 'string' ? f : (f?.url || '')))
        .map((s: string) => String(s).trim())
        .filter(Boolean);

    // Gambar Bersama yang disetel untuk "Taman Rahasia" menggantikan foto rumah kaca.
    const bersamaList = normalizePhotos((templateWedingData as any)?.bersamaFotos).slice(0, 6);
    const bersamaDipakai = (templateWedingData as any)?.bersamaDipakai === 'cerita' ? 'cerita' : 'taman';
    const bersamaUntukTaman = bersamaDipakai === 'taman' && bersamaList.length > 0 ? bersamaList : [];

    const galeryList = normalizePhotos((templateWedingData as any)?.galery?.fotos);
    const galleryUrls =
      bersamaUntukTaman.length > 0
        ? bersamaUntukTaman
        : galeryList.length > 0
          ? galeryList
          : [
              '/assets/images/a1.jpeg',
              '/assets/images/a2.jpeg',
              '/assets/images/a3.jpeg',
              '/assets/images/a4.jpeg',
              '/assets/images/a5.jpeg',
              '/assets/images/a7.jpeg',
            ];

    (window as any).__TAMAN_GALLERY_URLS__ = galleryUrls;

    // 3. Setup copy rekening function
    (window as any).copyRekening = function (number: string) {
      if (!number) return;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(number).then(function () {
          const toast = document.getElementById('found-toast');
          const txt = document.getElementById('found-toast-text');
          if (toast && txt) {
            txt.textContent = 'Nomor rekening berhasil disalin!';
            toast.classList.add('is-visible');
            setTimeout(function () {
              toast.classList.remove('is-visible');
            }, 3000);
          }
        });
      }
    };

    // 4. Load or execute taman-rahasia interactive engine
    let scriptEl: HTMLScriptElement | null = null;

    // Mesin di taman-rahasia.js menulis ulang href peta & kalender dari data-* saat init,
    // sehingga tautan yang diisi di dashboard harus dipasang ulang sesudahnya.
    const dashboardLinks = {
      maps: (templateWedingData?.linkMaps || '').trim(),
      calendar: (templateWedingData?.linkGoogleCalender || '').trim(),
    };
    const applyDashboardLinks = () => {
      const setHref = (id: string, href: string) => {
        if (!href) return;
        const el = document.getElementById(id) as HTMLAnchorElement | null;
        if (el) el.href = href;
      };
      ['map-btn', 'event-1-map', 'event-2-map'].forEach((id) => setHref(id, dashboardLinks.maps));
      ['event-1-cal', 'event-2-cal'].forEach((id) => setHref(id, dashboardLinks.calendar));
    };

    // 5. Pohon Harapan & Papan Nama Tamu — disambungkan ke /api/comments
    const templateWedingId: string | null =
      templateWedingData?.id || (templateWedingData as any)?.templateWedingId || null;

    const WISH_STYLE_ID = 'taman-wish-style';
    if (!document.getElementById(WISH_STYLE_ID)) {
      const style = document.createElement('style');
      style.id = WISH_STYLE_ID;
      style.textContent =
        '#wish-list.is-loading,#wish-more[hidden]{display:none}';
      document.head.appendChild(style);
    }

    const showFormState = (
      form: HTMLFormElement | null,
      state: 'ok' | 'err' | null
    ) => {
      if (!form) return;
      form.classList.remove('is-submitted', 'is-error');
      if (state === 'ok') form.classList.add('is-submitted');
      if (state === 'err') form.classList.add('is-error');
    };

    const setBusy = (form: HTMLFormElement | null, busy: boolean) => {
      if (!form) return;
      form.classList.toggle('is-busy', busy);
      form
        .querySelectorAll<HTMLButtonElement>('button[type="submit"]')
        .forEach((b) => {
          b.disabled = busy;
        });
    };

    // Bentuk kartu ucapan di Pohon Harapan (Bab XIV) — sumber tabel ucapan_harapan.
    const buildUcapanTag = (
      item: UcapanItem,
      opts: { justSaved?: boolean } = {}
    ): HTMLElement => {
      const tag = document.createElement('div');
      tag.className = 'wish-tag';
      tag.dataset.ucapanId = item.id;
      tag.innerHTML =
        '<span class="wish-string" aria-hidden="true"></span>' +
        `<p class="wish-msg">${escapeHtml(item.ucapan)}</p>` +
        '<p class="wish-meta">' +
        `<span class="wish-name">${escapeHtml(item.name)}</span>` +
        `<span class="wish-date">${
          opts.justSaved ? 'Baru saja' : escapeHtml(formatWishDate(item.createdAt))
        }</span>` +
        '</p>';
      return tag;
    };

    // Bentuk kartu komentar di Papan Nama Tamu (Bab XIII) — seperti Template A
    const buildRsvpCommentCard = (
      c: ApiComment,
      opts: { justSaved?: boolean; liked?: boolean } = {}
    ): HTMLElement => {
      const card = document.createElement('div');
      card.className = 'rsvp-comment-card';
      card.dataset.commentId = c.id;

      let isPresence = c.presence;
      let badgeLabel = isPresence ? '✅ Hadir' : '❌ Berhalangan';
      let badgeClass = isPresence ? 'is-attending' : 'is-absent';
      let cleanComment = c.comment || '';

      if (cleanComment.startsWith(RSVP_PREFIX)) {
        const afterPrefix = cleanComment.slice(RSVP_PREFIX.length).trim();
        const splitIdx = afterPrefix.indexOf(' — ');
        if (splitIdx !== -1) {
          const statusPart = afterPrefix.slice(0, splitIdx).trim();
          cleanComment = afterPrefix.slice(splitIdx + 3).trim();
          if (statusPart.includes('Hadir')) {
            badgeLabel = `✅ ${statusPart}`;
            badgeClass = 'is-attending';
          } else if (statusPart.includes('Berhalangan')) {
            badgeLabel = `❌ ${statusPart}`;
            badgeClass = 'is-absent';
          } else if (statusPart.includes('Ragu')) {
            badgeLabel = `❓ ${statusPart}`;
            badgeClass = 'is-maybe';
          }
        } else {
          if (afterPrefix.includes('Hadir')) {
            badgeLabel = `✅ ${afterPrefix}`;
            badgeClass = 'is-attending';
          } else if (afterPrefix.includes('Berhalangan')) {
            badgeLabel = `❌ ${afterPrefix}`;
            badgeClass = 'is-absent';
          } else if (afterPrefix.includes('Ragu')) {
            badgeLabel = `❓ ${afterPrefix}`;
            badgeClass = 'is-maybe';
          }
          cleanComment = isPresence
            ? 'Turut berbahagia dan mendoakan kelancaran pernikahan.'
            : 'Mohon maaf berhalangan hadir, semoga senantiasa berbahagia.';
        }
      }

      const dateStr = opts.justSaved ? 'Baru saja' : formatWishDate(c.createdAt);
      const isLiked = c.liked || opts.liked;

      card.innerHTML = `
        <div class="rsvp-card-head">
          <div class="rsvp-card-user">
            <h4 class="rsvp-card-name">${escapeHtml(c.name)}</h4>
            <span class="rsvp-card-badge ${badgeClass}">${escapeHtml(badgeLabel)}</span>
          </div>
          <span class="rsvp-card-date">${escapeHtml(dateStr)}</span>
        </div>
        <p class="rsvp-card-msg">${escapeHtml(cleanComment)}</p>
        <div class="rsvp-card-foot">
          <button type="button" class="rsvp-like-btn${isLiked ? ' is-liked' : ''}" aria-pressed="${isLiked ? 'true' : 'false'}" aria-label="Sukai komentar ini">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 20s-7-4.4-7-9.2A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.8C19 15.6 12 20 12 20Z" stroke-linejoin="round"/>
            </svg>
            <span class="rsvp-like-count">${Number(c.likesCount) || 0}</span>
          </button>
        </div>
      `;

      return card;
    };

    let wishOffset = 0;
    const loadUcapan = async (reset = false) => {
      const wishList = document.getElementById('wish-list');
      const wishMore = document.getElementById('wish-more') as HTMLButtonElement | null;
      if (!templateWedingId || !wishList) return;
      if (reset) {
        wishOffset = 0;
        wishList.innerHTML = '';
      }
      wishList.classList.add('is-loading');
      if (wishMore) wishMore.setAttribute('hidden', '');
      try {
        const data = await fetchUcapanes(templateWedingId, wishOffset);
        const frag = document.createDocumentFragment();
        data.ucapan.forEach((c) => frag.appendChild(buildUcapanTag(c)));
        wishList.appendChild(frag);
        wishOffset += data.ucapan.length;
        if (wishMore) {
          if (data.hasMore) {
            wishMore.textContent = `Muat harapan lainnya (${Math.max(
              0,
              data.total - wishOffset
            )})`;
            wishMore.removeAttribute('hidden');
          } else {
            wishMore.setAttribute('hidden', '');
          }
        }
      } catch {
        /* biarkan daftar kosong */
      } finally {
        wishList.classList.remove('is-loading');
      }
    };

    let rsvpOffset = 0;
    const loadRsvpComments = async (reset = false) => {
      const listEl = document.getElementById('rsvp-comments-list');
      const emptyEl = document.getElementById('rsvp-comments-empty');
      const countEl = document.getElementById('rsvp-comments-count');
      const moreBtn = document.getElementById('rsvp-more-btn') as HTMLButtonElement | null;
      if (!templateWedingId || !listEl) return;

      if (reset) {
        rsvpOffset = 0;
        listEl.innerHTML = '';
        // Fast instant render from initial templateWedingData.comments if available
        if (Array.isArray(templateWedingData?.comments) && templateWedingData.comments.length > 0) {
          const initialFrag = document.createDocumentFragment();
          templateWedingData.comments.forEach((c: any) => {
            initialFrag.appendChild(buildRsvpCommentCard(c, { liked: c.liked }));
          });
          listEl.appendChild(initialFrag);
          if (emptyEl) emptyEl.style.display = 'none';
          if (countEl) countEl.textContent = `${templateWedingData.comments.length} Catatan`;
        }
      }

      try {
        const data = await fetchAllComments(templateWedingId, rsvpOffset, 15);
        if (reset) {
          listEl.innerHTML = '';
          if (data.comments.length === 0) {
            if (emptyEl) emptyEl.style.display = 'block';
          } else {
            if (emptyEl) emptyEl.style.display = 'none';
          }
        }

        const frag = document.createDocumentFragment();
        data.comments.forEach((c) => {
          frag.appendChild(buildRsvpCommentCard(c, { liked: c.liked }));
        });
        listEl.appendChild(frag);
        rsvpOffset = reset ? data.comments.length : rsvpOffset + data.comments.length;

        if (countEl) {
          countEl.textContent = `${data.total} Catatan`;
        }

        if (moreBtn) {
          if (data.hasMore) {
            moreBtn.style.display = 'block';
            moreBtn.textContent = `Muat Catatan Tamu Lainnya (${Math.max(0, data.total - rsvpOffset)})`;
          } else {
            moreBtn.style.display = 'none';
          }
        }
      } catch (err) {
        console.error('Failed to load rsvp comments:', err);
      }
    };

    // 6. RSVP Status state & sync
    const RSVP_STATUSES: RsvpStatus[] = ['attending', 'not_attending', 'maybe'];
    let rsvpStatus: RsvpStatus | null = null;

    const syncRsvpButtons = () => {
      RSVP_STATUSES.forEach((status) => {
        const btn = document.querySelector(
          `[data-wedivo-status="${status}"]`
        ) as HTMLButtonElement | null;
        if (!btn) return;
        const on = rsvpStatus === status;
        btn.classList.toggle('is-selected', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    };

    const runInit = () => {
      if (typeof (window as any).initTamanRahasia === 'function') {
        try {
          (window as any).initTamanRahasia();
          if (typeof (window as any).growOrnaments === 'function') {
            (window as any).growOrnaments();
          }
          applyDashboardLinks();
        } catch (err) {
          console.warn('initTamanRahasia error:', err);
        }
      }
      syncRsvpButtons();
      if (templateWedingId) {
        void loadUcapan(true);
        void loadRsvpComments(true);
      }
    };

    const timer = setTimeout(() => {
      if (typeof (window as any).initTamanRahasia === 'function') {
        runInit();
      } else {
        scriptEl = document.createElement('script');
        scriptEl.src = '/dist/taman-rahasia.js';
        scriptEl.async = true;
        scriptEl.onload = runInit;
        document.body.appendChild(scriptEl);
      }
    }, 50);

    // React menulis ulang seluruh isi container lewat dangerouslySetInnerHTML
    // saat data tamu/template baru siap. Tulisan itu menghapus semua DOM yang
    // dibuat mesin (pane galeri, observer, gate), sehingga mesin harus dijalankan
    // ulang SETELAH tulisan itu — setTimeout 50ms saja tidak andal.
    // Hanya anak langsung yang diamati: React mengganti anak langsung, sedangkan
    // mesin hanya mengisi di dalam (mis. #gallery-grid), jadi tidak ada loop.
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

    // Global Delegated Submit Handler (Papan Nama Tamu & Pohon Harapan)
    const handleGlobalSubmit = async (e: Event) => {
      const form = (e.target as HTMLElement | null)?.closest('form') as HTMLFormElement | null;
      if (!form) return;

      // FORM PAPAN NAMA TAMU (RSVP)
      if (form.id === 'rsvp-form') {
        e.preventDefault();
        const nameInput = document.getElementById('rsvp-name') as HTMLInputElement | null;
        const paxInput = document.getElementById('rsvp-pax') as HTMLInputElement | null;
        const msgInput = document.getElementById('rsvp-message') as HTMLTextAreaElement | null;
        const name = nameInput?.value.trim() || '';

        if (!name || !templateWedingId) {
          showFormState(form, 'err');
          return;
        }

        // Default status kehadiran ke 'attending' jika belum dipilih
        const currentStatus: RsvpStatus = rsvpStatus || 'attending';
        const paxRaw = Number.parseInt(paxInput?.value || '1', 10);
        const pax = Math.min(Math.max(Number.isFinite(paxRaw) ? paxRaw : 1, 1), 20);
        const rawMsg = msgInput?.value.trim() || '';
        const messageText = rawMsg || (currentStatus === 'attending'
          ? 'Selamat berbahagia untuk kedua mempelai! Semoga lancar dan penuh berkah.'
          : 'Mohon maaf berhalangan hadir, selamat berbahagia.');

        setBusy(form, true);
        try {
          const { comment } = await postRsvp({
            templateWedingId,
            name,
            status: currentStatus,
            pax,
            message: messageText,
          });

          showFormState(form, 'ok');

          // Prepend ke Papan Catatan Tamu
          const listEl = document.getElementById('rsvp-comments-list');
          const emptyEl = document.getElementById('rsvp-comments-empty');
          const countEl = document.getElementById('rsvp-comments-count');

          if (listEl) {
            listEl.prepend(buildRsvpCommentCard(comment, { justSaved: true, liked: false }));
            if (emptyEl) emptyEl.style.display = 'none';
            if (countEl) {
              const curTotal = (Number.parseInt(countEl.textContent || '0', 10) || 0) + 1;
              countEl.textContent = `${curTotal} Catatan`;
            }
          }

          if (msgInput) msgInput.value = '';

          if (currentStatus === 'attending') {
            import('canvas-confetti')
              .then((m) => m.default({ particleCount: 90, spread: 70, origin: { y: 0.7 } }))
              .catch(() => undefined);
          }
        } catch (err) {
          console.error('Error submitting RSVP comment:', err);
          showFormState(form, 'err');
        } finally {
          setBusy(form, false);
        }
        return;
      }

      // FORM POHON HARAPAN
      if (form.id === 'wish-form') {
        e.preventDefault();
        const nameInput = document.getElementById('wish-name') as HTMLInputElement | null;
        const msgInput = document.getElementById('wish-message') as HTMLTextAreaElement | null;
        const name = nameInput?.value.trim() || '';
        const msg = msgInput?.value.trim() || '';

        if (!name || !msg || !templateWedingId) {
          showFormState(form, 'err');
          return;
        }

        setBusy(form, true);
        try {
          const { ucapan } = await postUcapan({ templateWedingId, name, ucapan: msg });
          const wishList = document.getElementById('wish-list');
          if (wishList) {
            wishList.classList.remove('is-loading');
            wishList.prepend(buildUcapanTag(ucapan, { justSaved: true }));
            wishList.classList.add('in-view');
          }
          const wishMore = document.getElementById('wish-more');
          if (wishMore) wishMore.setAttribute('hidden', '');
          if (msgInput) msgInput.value = '';
          showFormState(form, 'ok');
        } catch {
          showFormState(form, 'err');
        } finally {
          setBusy(form, false);
        }
        return;
      }
    };

    // Global Delegated Click Handler for Buttons
    const handleGlobalClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Tombol status kehadiran RSVP
      const statusBtn = target.closest('[data-wedivo-status]') as HTMLButtonElement | null;
      if (statusBtn) {
        const val = statusBtn.getAttribute('data-wedivo-status');
        if (val && RSVP_STATUSES.includes(val as RsvpStatus)) {
          e.preventDefault();
          rsvpStatus = val as RsvpStatus;
          syncRsvpButtons();
          const form = document.getElementById('rsvp-form') as HTMLFormElement | null;
          if (form?.classList.contains('is-error')) showFormState(form, null);
        }
        return;
      }

      // 2. Tombol ubah jawaban / tulis catatan lain
      const editBtn = target.closest('#rsvp-edit');
      if (editBtn) {
        e.preventDefault();
        const form = document.getElementById('rsvp-form') as HTMLFormElement | null;
        if (form) {
          form.classList.remove('is-submitted', 'is-error');
        }
        rsvpStatus = null;
        syncRsvpButtons();
        return;
      }

      // 3. Tombol Muat Catatan Tamu Lainnya
      const rsvpMoreBtn = target.closest('#rsvp-more-btn');
      if (rsvpMoreBtn) {
        e.preventDefault();
        void loadRsvpComments(false);
        return;
      }

      // 4. Tombol Like pada kartu catatan papan tamu
      const rsvpLikeBtn = target.closest('.rsvp-like-btn') as HTMLButtonElement | null;
      if (rsvpLikeBtn) {
        e.preventDefault();
        const card = rsvpLikeBtn.closest('.rsvp-comment-card') as HTMLElement | null;
        const commentId = card?.dataset.commentId;
        if (!commentId) return;

        rsvpLikeBtn.disabled = true;
        try {
          const { liked } = await toggleLike(commentId);
          rsvpLikeBtn.classList.toggle('is-liked', liked);
          rsvpLikeBtn.setAttribute('aria-pressed', liked ? 'true' : 'false');
          const counter = rsvpLikeBtn.querySelector('.rsvp-like-count');
          const current = Number(counter?.textContent) || 0;
          if (counter) counter.textContent = String(Math.max(0, current + (liked ? 1 : -1)));
        } catch {}
        finally {
          rsvpLikeBtn.disabled = false;
        }
        return;
      }

      // 5. Wish more button
      const wishMoreBtn = target.closest('#wish-more');
      if (wishMoreBtn) {
        e.preventDefault();
        void loadUcapan(false);
        return;
      }
    };

    document.addEventListener('submit', handleGlobalSubmit, true);
    document.addEventListener('click', handleGlobalClick, true);

    if (templateWedingId) {
      void loadUcapan(true);
      void loadRsvpComments(true);
    }

    // 7. Universal Gate Open click listener fallback
    const coverIsVisible = () => {
      const cover = document.getElementById('sec-cover');
      if (!cover) return false;
      if (cover.classList.contains('is-gone')) return false;
      if (cover.style.display === 'none') return false;
      return true;
    };

    const forceCoverOpen = () => {
      try {
        sessionStorage.setItem(storageKey, 'true');
      } catch {}
      const cover = document.getElementById('sec-cover');
      if (cover) {
        cover.classList.add('is-turning', 'is-open', 'is-enter', 'is-gone');
        cover.style.display = 'none';
      }
      document.body.classList.remove('is-locked');
      document.body.classList.add('is-open');
      const hero = document.getElementById('sec-hero');
      if (hero) hero.classList.add('in-view');
    };

    // Membuka undangan tidak boleh bergantung pada mesin taman-rahasia.js:
    // kalau skrip gagal dimuat atau openGate tidak terpasang, animasi dijalankan di sini.
    let gateOpenRequested = false;
    const openInvitation = () => {
      if (gateOpenRequested) return;
      gateOpenRequested = true;
      try {
        sessionStorage.setItem(storageKey, 'true');
      } catch {}

      const audio = document.getElementById('bg-music') as HTMLAudioElement | null;
      if (audio) {
        try {
          void audio.play();
        } catch (err) {}
      }

      if (typeof (window as any).openGate === 'function') {
        (window as any).openGate();
      } else {
        const cover = document.getElementById('sec-cover');
        if (!cover) {
          forceCoverOpen();
          return;
        }
        cover.classList.add('is-turning');
        setTimeout(() => cover.classList.add('is-open'), 950);
        setTimeout(() => cover.classList.add('is-enter'), 1800);
        setTimeout(() => {
          if (coverIsVisible()) forceCoverOpen();
        }, 2500);
      }

      // Pengaman: apa pun yang terjadi pada mesin, undangan harus tetap terbuka.
      setTimeout(() => {
        if (coverIsVisible()) forceCoverOpen();
      }, 4000);
    };

    const handleGateFallback = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isGateTrigger =
        target.closest('#gate-open') ||
        target.closest('.gate-lock-btn') ||
        target.closest('.gate-key') ||
        target.closest('#gate-key') ||
        target.closest('#gate-key-anchor') ||
        target.closest('.btn-open-taman') ||
        target.closest('#btn-open-taman') ||
        target.closest('#sec-cover button') ||
        target.closest('#cover-hint') ||
        target.closest('.gate-action');

      if (isGateTrigger) {
        e.preventDefault();
        e.stopPropagation();
        openInvitation();
      }
    };

    // 8. Robust Navigation Click Delegator
    const handleNavClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const navBtn = target.closest('[data-nav-target]') as HTMLElement | null;
      if (navBtn) {
        e.preventDefault();
        const id = navBtn.getAttribute('data-nav-target');
        if (!id) return;

        const targetSec =
          (document.querySelector(`[data-section="${id}"]`) as HTMLElement | null) ||
          document.getElementById(`sec-${id}`);

        if (targetSec) {
          // Tandai tombol active
          document.querySelectorAll('#garden-path [data-nav-target]').forEach((btn) => {
            btn.classList.toggle('is-active', btn.getAttribute('data-nav-target') === id);
          });

          // Tampilkan section & reveal items
          targetSec.classList.add('is-seen', 'in-view');
          targetSec.querySelectorAll('.reveal').forEach((el) => {
            el.classList.add('in-view');
          });

          // Scroll ke section
          const top = targetSec.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: Math.max(0, top - 10),
            behavior: 'smooth',
          });

          // Pusatkan tombol pada bar jika overflow
          navBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
        return;
      }

      // Hero cue ("Telusuri jalan setapak")
      const cueBtn = target.closest('#hero-cue, .hero-cue');
      if (cueBtn) {
        e.preventDefault();
        const quoteSec =
          (document.querySelector('[data-section="quote"]') as HTMLElement | null) ||
          document.getElementById('sec-quote');
        if (quoteSec) {
          quoteSec.classList.add('is-seen', 'in-view');
          const top = quoteSec.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: Math.max(0, top - 10), behavior: 'smooth' });
        }
        return;
      }

      // Back to top button
      const topBtn = target.closest('#closing-top, .closing-top');
      if (topBtn) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Batu Berlumut / Secret stone click & touch fallback
      const stoneBtn = target.closest('#secret-stone, .secret-stone, #secret-soil, .secret-ground');
      if (stoneBtn) {
        const ground = document.getElementById('secret-ground');
        const letter = document.getElementById('secret-letter');
        const stone = document.getElementById('secret-stone');
        const secSecret = document.getElementById('sec-secret');

        if (ground) ground.classList.add('is-lifted');
        if (stone) stone.setAttribute('aria-expanded', 'true');
        if (secSecret) secSecret.classList.add('is-found');
        if (letter) {
          letter.style.maxHeight = (letter.scrollHeight + 60) + 'px';
          setTimeout(() => {
            letter.style.maxHeight = 'none';
          }, 1500);
        }
      }
    };

    // 9. Intersection Observer Fallback for Scroll Reveals
    let revealObserver: IntersectionObserver | null = null;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
            }
          });
        },
        { threshold: 0.05, rootMargin: '0px 0px 80px 0px' }
      );

      const revealElements = document.querySelectorAll('.reveal, .bab, [data-section]');
      revealElements.forEach((el) => revealObserver?.observe(el));
    }

    document.addEventListener('click', handleGateFallback, true);
    document.addEventListener('click', handleNavClick, true);

    return () => {
      clearTimeout(timer);
      if (moTimer) clearTimeout(moTimer);
      observer.disconnect();
      document.body.classList.remove('is-locked', 'is-open');
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
      if (revealObserver) {
        revealObserver.disconnect();
      }
      document.removeEventListener('submit', handleGlobalSubmit, true);
      document.removeEventListener('click', handleGlobalClick, true);
      document.removeEventListener('click', handleGateFallback, true);
      document.removeEventListener('click', handleNavClick, true);
    };
  }, [templateWedingData, guestName]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=IM+Fell+English:ital@0;1&family=Pinyon+Script&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/taman-rahasia.css" />
        <script src="/dist/taman-rahasia.js" defer></script>
      </Head>

      <div
        id="taman-rahasia-container"
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
};

export default TamanRahasia;

