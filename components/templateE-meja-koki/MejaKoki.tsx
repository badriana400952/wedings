import React, { useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { getMejaKokiHtml } from './mejaKokiHtml';
import { RSVP_PREFIX } from '@/lib/comment-kind';
import {
  escapeHtml,
  fetchComments,
  fetchUcapanes,
  formatWishDate,
  postRsvp,
  postUcapan,
  toggleLike,
  type ApiComment,
  type RsvpStatus,
  type UcapanItem,
} from './mejaKokiApi';

interface MejaKokiProps {
  adminId?: string;
  guestName?: string | null;
  templateWedingData?: any;
  isAdminView?: boolean;
}

const MejaKoki: React.FC<MejaKokiProps> = ({
  adminId,
  guestName,
  templateWedingData,
}) => {
  const groom = templateWedingData?.namaPutra || 'Mempelai Pria';
  const bride = templateWedingData?.namaPutri || 'Mempelai Wanita';
  const pageTitle = `${groom} & ${bride} — Meja Sang Koki`;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const didInitialLoadRef = useRef(false);
  const isFetchingCommentsRef = useRef(false);
  const isFetchingUcapanRef = useRef(false);

  // 1. Stabilisasi markup dengan useMemo (pola sukses Template B)
  const html = useMemo(() => {
    return getMejaKokiHtml(templateWedingData || {}, guestName || null);
  }, [templateWedingData, guestName]);

  // 2. Jika nama tamu baru datang belakangan dari query router, update teks di DOM tanpa merusak audio player
  useEffect(() => {
    if (!guestName) return;
    const greetingEl = document.getElementById('guest-greeting');
    const greetingGenericEl = document.getElementById('guest-greeting-generic');
    const greetingNameEl = document.getElementById('guest-greeting-name');
    const rsvpNameEl = document.getElementById('rsvp-name') as HTMLInputElement | null;

    if (greetingEl) greetingEl.style.display = 'block';
    if (greetingGenericEl) greetingGenericEl.style.display = 'none';
    if (greetingNameEl) greetingNameEl.textContent = guestName;
    if (rsvpNameEl && !rsvpNameEl.value) rsvpNameEl.value = guestName;
  }, [guestName]);

  useEffect(() => {
    // 0. Persistence key for invitation opened state
    const storageKey = `invitation_opened_${adminId || 'mejakoki'}`;
    (window as any).__MEJA_KOKI_STORAGE_KEY__ = storageKey;
    const wasAlreadyOpened = () => {
      try {
        return sessionStorage.getItem(storageKey) === 'true';
      } catch {
        return false;
      }
    };

    // 1. Audio setup - Hanya dari database
    const audioUrl =
      templateWedingData?.musik?.file ||
      templateWedingData?.audio ||
      '';
    const musicAudioEl = document.getElementById('music-audio') as HTMLAudioElement | null;
    const musicDockEl = document.getElementById('music-dock');
    if (musicAudioEl) {
      if (!audioUrl) {
        musicAudioEl.removeAttribute('src');
        if (musicDockEl) musicDockEl.style.display = 'none';
      } else {
        const curSrc = musicAudioEl.getAttribute('src');
        if (!curSrc || curSrc.includes('__AUDIO_URL__') || curSrc === '') {
          musicAudioEl.src = audioUrl;
        }
      }
    }

    // 2. Cover state
    const coverEl = document.getElementById('sec-cover');
    if (wasAlreadyOpened()) {
      if (coverEl) {
        coverEl.classList.add('is-open', 'is-gone');
        coverEl.style.display = 'none';
      }
      document.body?.classList?.remove('is-locked');
      document.body?.classList?.add('is-open');
    } else {
      if (coverEl && coverEl.style.display !== 'none' && !coverEl.classList?.contains('is-open')) {
        document.body?.classList?.add('is-locked');
      }
    }

    // 3. Normalize & pass gallery photos
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
              '/assets/templates/meja-koki/1790088230_e84ebc64.jpg',
              '/assets/templates/meja-koki/1790088230_6e30a49c.jpg',
              '/assets/templates/meja-koki/1790088231_df639d98.jpg',
            ];

    (window as any).__MEJA_KOKI_GALLERY_URLS__ = galleryUrls;

    // 4. Pass wedding date for countdown & Realtime Timer Engine
    const rawTargetDate =
      templateWedingData?.tanggalPernikahan ||
      templateWedingData?.tanggalAkad ||
      templateWedingData?.tanggalResepsi ||
      '2026-10-30T11:00:00';
    let targetDatePart = '2026-10-30';
    if (typeof rawTargetDate === 'string') {
      targetDatePart = rawTargetDate.split('T')[0];
    } else if (rawTargetDate instanceof Date) {
      targetDatePart = rawTargetDate.toISOString().split('T')[0];
    }

    const rawTargetTime =
      templateWedingData?.jamMulai ||
      templateWedingData?.jamAkad ||
      templateWedingData?.jamResepsi ||
      templateWedingData?.waktuAkad ||
      '10:00';
    const targetTimeMatch = String(rawTargetTime).match(/([01]?\d|2[0-3])[:.]([0-5]\d)/);
    const targetTimePart = targetTimeMatch
      ? `${targetTimeMatch[1].padStart(2, '0')}:${targetTimeMatch[2]}:00`
      : '10:00:00';
    const weddingTargetIso = `${targetDatePart}T${targetTimePart}`;

    (window as any).__MEJA_KOKI_MAIN_DATE__ = weddingTargetIso;

    let cdTargetTs = new Date(weddingTargetIso).getTime();
    if (isNaN(cdTargetTs)) {
      cdTargetTs = new Date(targetDatePart).getTime();
    }

    const updateReactCountdown = () => {
      const daysEl = document.getElementById('cd-days');
      const hoursEl = document.getElementById('cd-hours');
      const minsEl = document.getElementById('cd-mins');
      const secsEl = document.getElementById('cd-secs');
      const cdSection = document.getElementById('sec-countdown');

      if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

      const diff = cdTargetTs - Date.now();
      if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        if (cdSection) cdSection.classList.add('is-served');
        return;
      }

      if (cdSection) cdSection.classList.remove('is-served');

      const totalSec = Math.floor(diff / 1000);
      const d = Math.floor(totalSec / 86400);
      const h = Math.floor((totalSec % 86400) / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      daysEl.textContent = d < 10 ? `0${d}` : String(d);
      hoursEl.textContent = h < 10 ? `0${h}` : String(h);
      minsEl.textContent = m < 10 ? `0${m}` : String(m);
      secsEl.textContent = s < 10 ? `0${s}` : String(s);
    };

    updateReactCountdown();
    const cdInterval = setInterval(updateReactCountdown, 1000);

    // 5. Toast helper
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

    // 6. Bulletproof openInvitation
    let isOpening = false;
    const forceCoverOpen = () => {
      try {
        sessionStorage.setItem(storageKey, 'true');
      } catch {}
      const cover = document.getElementById('sec-cover');
      if (cover) {
        cover.classList.add('is-open', 'is-gone');
        cover.style.display = 'none';
      }
      document.body?.classList?.remove('is-locked');
      document.body?.classList?.add('is-open');

      const hero = document.getElementById('sec-hero');
      if (hero) {
        hero.classList.add('in-view', 'is-seen');
        hero.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view', 'is-seen'));
      }
      document.querySelectorAll('.sec, [data-section]').forEach((sec) => {
        sec.classList.add('in-view', 'is-seen');
        sec.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view', 'is-seen'));
      });
    };

    const openInvitation = () => {
      if (isOpening) return;
      isOpening = true;
      try {
        sessionStorage.setItem(storageKey, 'true');
      } catch {}

      const cover = document.getElementById('sec-cover');
      if (cover) {
        cover.classList.add('is-open');
        window.setTimeout(() => {
          cover.classList.add('is-gone');
          cover.style.display = 'none';
          isOpening = false;
        }, 1200);
      } else {
        isOpening = false;
      }
      document.body?.classList?.remove('is-locked');
      document.body?.classList?.add('is-open');

      const audio = document.getElementById('music-audio') as HTMLAudioElement | null;
      const musicBtn = document.getElementById('music-btn');
      if (audio && audio.getAttribute('src')) {
        audio.volume = 0.55;
        if (audio.paused) {
          const p = audio.play();
          if (p && p.catch) p.catch(() => {});
        }
        if (musicBtn) musicBtn.classList.add('is-playing');
      }

      const hero = document.getElementById('sec-hero');
      if (hero) {
        hero.classList.add('in-view', 'is-seen');
        hero.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view', 'is-seen'));
        hero.scrollIntoView({ behavior: 'smooth' });
      }

      window.setTimeout(() => {
        const c = document.getElementById('sec-cover');
        if (c && c.style.display !== 'none') forceCoverOpen();
        isOpening = false;
      }, 2000);
    };

    const templateWedingId: string | null =
      templateWedingData?.id || (templateWedingData as any)?.templateWedingId || null;

    // RSVP Comment Card Builder
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
          } else if (statusPart.includes('Ragu') || statusPart.includes('Diusahakan')) {
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
          } else if (afterPrefix.includes('Ragu') || afterPrefix.includes('Diusahakan')) {
            badgeLabel = `❓ ${afterPrefix}`;
            badgeClass = 'is-maybe';
          }
          cleanComment = isPresence
            ? 'Turut berbahagia dan mendoakan kelancaran acara.'
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
          <button type="button" class="rsvp-like-btn${isLiked ? ' is-liked' : ''}" aria-pressed="${isLiked ? 'true' : 'false'}" aria-label="Sukai catatan ini">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 20s-7-4.4-7-9.2A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.8C19 15.6 12 20 12 20Z" stroke-linejoin="round"/>
            </svg>
            <span class="rsvp-like-count">${Number(c.likesCount) || 0}</span>
          </button>
        </div>
      `;

      return card;
    };

    let rsvpOffset = 0;
    const RSVP_LIMIT = 15;
    const loadRsvpComments = async (reset: boolean = false) => {
      if (!templateWedingId) return;
      if (isFetchingCommentsRef.current) return;
      isFetchingCommentsRef.current = true;

      const listEl = document.getElementById('rsvp-comments-list');
      const emptyEl = document.getElementById('rsvp-comments-empty');
      const countEl = document.getElementById('rsvp-comments-count');
      const rsvpMoreBtn = document.getElementById('rsvp-more-btn') as HTMLButtonElement | null;

      if (reset) {
        rsvpOffset = 0;
        // Fast instant render dari templateWedingData.comments jika ada
        if (listEl && Array.isArray(templateWedingData?.comments) && templateWedingData.comments.length > 0) {
          if (listEl.children.length === 0) {
            const initialFrag = document.createDocumentFragment();
            templateWedingData.comments.forEach((c: any) => {
              initialFrag.appendChild(buildRsvpCommentCard(c, { liked: c.liked }));
            });
            listEl.appendChild(initialFrag);
            if (emptyEl) emptyEl.style.display = 'none';
            if (countEl) countEl.textContent = `${templateWedingData.comments.length} Konfirmasi`;
          }
        }
      }

      try {
        const data = await fetchComments(templateWedingId, rsvpOffset, RSVP_LIMIT);
        const targetList = document.getElementById('rsvp-comments-list');
        const targetEmpty = document.getElementById('rsvp-comments-empty');
        const targetCount = document.getElementById('rsvp-comments-count');
        const targetMoreBtn = document.getElementById('rsvp-more-btn') as HTMLButtonElement | null;

        if (targetList) {
          if (reset) {
            targetList.innerHTML = '';
          }

          if (data.comments.length === 0) {
            if (targetEmpty && targetList.children.length === 0) {
              targetEmpty.style.display = 'block';
            }
          } else {
            if (targetEmpty) targetEmpty.style.display = 'none';
            const frag = document.createDocumentFragment();
            data.comments.forEach((c) => {
              frag.appendChild(buildRsvpCommentCard(c, { liked: c.liked }));
            });
            targetList.appendChild(frag);
          }
        }

        rsvpOffset = reset ? data.comments.length : rsvpOffset + data.comments.length;

        if (targetCount) {
          targetCount.textContent = `${data.total} Konfirmasi`;
        }

        if (targetMoreBtn) {
          if (data.hasMore) {
            targetMoreBtn.style.display = 'block';
            targetMoreBtn.textContent = `Muat Konfirmasi Lainnya (${Math.max(0, data.total - rsvpOffset)})`;
          } else {
            targetMoreBtn.style.display = 'none';
          }
        }
      } catch (err) {
        console.error('Failed to load rsvp comments:', err);
      } finally {
        isFetchingCommentsRef.current = false;
      }
    };

    let ucapanOffset = 0;
    const UCAPAN_LIMIT = 6;
    let hasMoreUcapan = false;

    const buildWishCard = (
      item: UcapanItem,
      opts: { justSaved?: boolean } = {}
    ): HTMLElement => {
      const card = document.createElement('div');
      card.className = 'comment-card';
      card.dataset.ucapanId = item.id;
      const dateText = opts.justSaved ? 'Baru saja' : formatWishDate(item.createdAt);
      card.innerHTML = `
        <p class="comment-name" data-field="name">${escapeHtml(item.name)}</p>
        <p class="comment-message" data-field="message">${escapeHtml(item.ucapan)}</p>
        <p class="comment-date" data-field="date">${escapeHtml(dateText)}</p>
      `;
      return card;
    };

    const loadWishes = async (reset: boolean = false) => {
      if (!templateWedingId) return;
      if (isFetchingUcapanRef.current) return;
      isFetchingUcapanRef.current = true;

      if (reset) {
        ucapanOffset = 0;
      }

      try {
        const res = await fetchUcapanes(templateWedingId, ucapanOffset, UCAPAN_LIMIT);
        const targetList = document.getElementById('comments-list');
        const targetEmpty = document.getElementById('comments-empty');
        const targetMoreBtn = document.getElementById('comments-more') as HTMLButtonElement | null;

        if (res?.success && Array.isArray(res.ucapan) && targetList) {
          if (reset) targetList.innerHTML = '';
          if (res.ucapan.length === 0) {
            if (targetEmpty && targetList.children.length === 0) {
              targetEmpty.style.display = 'block';
            }
          } else {
            if (targetEmpty) targetEmpty.style.display = 'none';
            const frag = document.createDocumentFragment();
            res.ucapan.forEach((u) => {
              frag.appendChild(buildWishCard(u));
            });
            targetList.appendChild(frag);
          }
          ucapanOffset = reset ? res.ucapan.length : ucapanOffset + res.ucapan.length;
          hasMoreUcapan = res.hasMore;
          if (targetMoreBtn) {
            targetMoreBtn.style.display = hasMoreUcapan ? 'inline-flex' : 'none';
            if (hasMoreUcapan) {
              targetMoreBtn.textContent = `Muat Catatan Lainnya (${Math.max(0, res.total - ucapanOffset)})`;
            }
          }
        }
      } catch (err) {
        console.error('Error fetching wishes:', err);
      } finally {
        isFetchingUcapanRef.current = false;
      }
    };

    let selectedRsvpStatus: RsvpStatus = 'attending';

    // Global Delegated Click Handler
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Handle Music Toggle
      const musicBtn = target.closest('#music-btn');
      if (musicBtn) {
        e.preventDefault();
        e.stopPropagation();
        const audio = document.getElementById('music-audio') as HTMLAudioElement | null;
        if (audio) {
          if (audio.paused) {
            audio.play().then(() => {
              musicBtn.classList.add('is-playing');
              musicBtn.setAttribute('aria-pressed', 'true');
            }).catch(() => {});
          } else {
            audio.pause();
            musicBtn.classList.remove('is-playing');
            musicBtn.setAttribute('aria-pressed', 'false');
          }
        }
        return;
      }

      // 2. Handle Cover Open
      if (
        target.closest('#cover-open-btn') ||
        target.closest('#sec-cover button')
      ) {
        e.preventDefault();
        e.stopPropagation();
        openInvitation();
        return;
      }

      // 3. Handle RSVP Status Selection Buttons
      const statusBtn = target.closest('[data-wedivo-status]') as HTMLButtonElement | null;
      if (statusBtn) {
        e.preventDefault();
        e.stopPropagation();
        const st = statusBtn.getAttribute('data-wedivo-status') as RsvpStatus;
        if (st) {
          selectedRsvpStatus = st;
          const statusRow = document.getElementById('rsvp-status-row');
          statusRow?.querySelectorAll('.status-btn').forEach((b) => {
            b.classList.remove('is-selected', 'is-active');
          });
          statusBtn.classList.add('is-selected', 'is-active');
        }
        return;
      }

      // 4. Handle RSVP More Button
      const rsvpMoreBtn = target.closest('#rsvp-more-btn');
      if (rsvpMoreBtn) {
        e.preventDefault();
        e.stopPropagation();
        void loadRsvpComments(false);
        return;
      }

      // 5. Handle Wishes More Button
      const commentsMoreBtn = target.closest('#comments-more');
      if (commentsMoreBtn) {
        e.preventDefault();
        e.stopPropagation();
        void loadWishes(false);
        return;
      }

      // 6. Handle RSVP Like Button
      const rsvpLikeBtn = target.closest('.rsvp-like-btn') as HTMLButtonElement | null;
      if (rsvpLikeBtn) {
        e.preventDefault();
        e.stopPropagation();
        const card = rsvpLikeBtn.closest('.rsvp-comment-card') as HTMLElement | null;
        const commentId = card?.dataset.commentId;
        if (!commentId) return;

        const countEl = rsvpLikeBtn.querySelector('.rsvp-like-count');
        const curCount = parseInt(countEl?.textContent || '0', 10) || 0;
        const wasLiked = rsvpLikeBtn.classList.contains('is-liked');
        const nextLiked = !wasLiked;
        const nextCount = Math.max(0, curCount + (nextLiked ? 1 : -1));

        rsvpLikeBtn.classList.toggle('is-liked', nextLiked);
        rsvpLikeBtn.setAttribute('aria-pressed', nextLiked ? 'true' : 'false');
        if (countEl) countEl.textContent = String(nextCount);

        toggleLike(commentId).catch((err) => {
          console.error('Failed to toggle like:', err);
          rsvpLikeBtn.classList.toggle('is-liked', wasLiked);
          rsvpLikeBtn.setAttribute('aria-pressed', wasLiked ? 'true' : 'false');
          if (countEl) countEl.textContent = String(curCount);
        });
        return;
      }

      // 7. Handle RSVP Submit Button Click explicitly
      const rsvpSubmitBtn = target.closest('#rsvp-submit');
      if (rsvpSubmitBtn) {
        e.preventDefault();
        e.stopPropagation();
        const form = document.getElementById('rsvp-form') as HTMLFormElement | null;
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
        return;
      }

      // 8. Handle Wishes Submit Button Click explicitly
      const wishesSubmitBtn = target.closest('#wishes-submit');
      if (wishesSubmitBtn) {
        e.preventDefault();
        e.stopPropagation();
        const form = document.getElementById('comments-form') as HTMLFormElement | null;
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
        return;
      }

      // 9. Handle Resep Ingredient Chip Click
      const ingChipBtn = target.closest('.ing-chip') as HTMLButtonElement | null;
      if (ingChipBtn) {
        e.preventDefault();
        e.stopPropagation();
        const on = ingChipBtn.classList.toggle('is-checked');
        ingChipBtn.setAttribute('aria-pressed', on ? 'true' : 'false');

        const ingList = document.getElementById('resep-ing-list');
        const potFill = document.getElementById('pot-fill');
        const countEl = document.getElementById('resep-count');
        const totalEl = document.getElementById('resep-total');
        const resepCard = document.getElementById('resep-card');

        const chips = ingList ? ingList.querySelectorAll('.ing-chip') : document.querySelectorAll('.ing-chip');
        const total = chips.length || 6;
        let checked = 0;
        chips.forEach((c) => {
          if (c.classList.contains('is-checked')) checked++;
        });

        if (countEl) countEl.textContent = String(checked);
        if (totalEl) totalEl.textContent = String(total);
        if (potFill) {
          potFill.style.setProperty('--fill', String(checked / total));
        }
        if (resepCard) {
          resepCard.classList.toggle('is-complete', total > 0 && checked >= total);
        }
        return;
      }

      // 10. Handle Simpan Reservasi ke Kalender (#cd-cal)
      const calBtn = target.closest('#cd-cal') as HTMLElement | null;
      if (calBtn) {
        e.preventDefault();
        e.stopPropagation();
        const customCalUrl =
          calBtn.getAttribute('data-cal-url') ||
          (templateWedingData?.linkGoogleCalender || '').trim();
        if (customCalUrl) {
          window.open(customCalUrl, '_blank', 'noopener,noreferrer');
          return;
        }

        const groomEl = document.getElementById('hero-name-groom');
        const brideEl = document.getElementById('hero-name-bride');
        const venueEl = document.getElementById('venue-name');
        const addrEl = document.getElementById('venue-address');
        const gName = groomEl ? groomEl.textContent?.trim() || '' : '';
        const bName = brideEl ? brideEl.textContent?.trim() || '' : '';
        const place = [
          venueEl ? venueEl.textContent?.trim() || '' : '',
          addrEl ? addrEl.textContent?.trim() || '' : '',
        ].filter(Boolean).join(', ');

        const dt = weddingTargetIso ? new Date(weddingTargetIso) : new Date();
        const validDt = isNaN(dt.getTime()) ? new Date() : dt;
        const ends = new Date(validDt.getTime() + 3 * 3600 * 1000);
        const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        const title = `Pernikahan ${gName} & ${bName}`.trim() || 'Pernikahan Kami';
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${stamp(validDt)}/${stamp(ends)}&details=${encodeURIComponent('Meja Sang Koki — satu malam, satu kisah.')}&location=${encodeURIComponent(place)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }

      // 11. Handle Card Mempelai Flip (.ing-card)
      const coupleCard = target.closest('.ing-card') as HTMLElement | null;
      if (coupleCard) {
        e.preventDefault();
        e.stopPropagation();
        const on = coupleCard.classList.toggle('is-flipped');
        coupleCard.setAttribute('aria-pressed', on ? 'true' : 'false');
        return;
      }

      // 11. Handle Navbar Navigation Click ([data-nav-target])
      const navBtn = target.closest('[data-nav-target]') as HTMLElement | null;
      if (navBtn) {
        e.preventDefault();
        e.stopPropagation();
        const navTargetId = navBtn.getAttribute('data-nav-target');
        if (!navTargetId) return;

        // Tandai active pada nav button
        document.querySelectorAll('#nav-rail [data-nav-target], [data-nav-target]').forEach((btn) => {
          btn.classList.toggle('is-active', btn.getAttribute('data-nav-target') === navTargetId);
        });

        // Center item di rel scroll horizontal nav
        const rail = document.getElementById('nav-rail');
        if (rail && navBtn) {
          const railRect = rail.getBoundingClientRect();
          const btnRect = navBtn.getBoundingClientRect();
          const scrollLeft = rail.scrollLeft + (btnRect.left - railRect.left) - (rail.clientWidth - btnRect.width) / 2;
          rail.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
        }

        // Cari section tujuan
        const targetSec =
          (document.querySelector(`[data-section="${navTargetId}"]`) as HTMLElement | null) ||
          document.getElementById(`sec-${navTargetId}`) ||
          document.getElementById(navTargetId);

        if (targetSec) {
          targetSec.classList.add('is-seen', 'in-view');
          targetSec.querySelectorAll('.reveal').forEach((el) => {
            el.classList.add('in-view', 'is-seen');
          });

          const top = targetSec.getBoundingClientRect().top + window.pageYOffset - 15;
          window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }
        return;
      }
    };
    document.addEventListener('click', handleGlobalClick, true);

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        const target = e.target as HTMLElement | null;
        const coupleCard = target?.closest('.ing-card') as HTMLElement | null;
        if (coupleCard) {
          e.preventDefault();
          const on = coupleCard.classList.toggle('is-flipped');
          coupleCard.setAttribute('aria-pressed', on ? 'true' : 'false');
        }
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown, true);

    // Global Delegated Submit Handler (Papan Kursi RSVP & Buku Catatan Doa)
    const handleGlobalSubmit = async (e: Event) => {
      const form = (e.target as HTMLElement | null)?.closest('form') as HTMLFormElement | null;
      if (!form) return;

      // FORM RSVP (Kami hitung kursinya dari sini)
      if (form.id === 'rsvp-form') {
        e.preventDefault();
        e.stopPropagation();

        const nameInput = form.querySelector<HTMLInputElement>('#rsvp-name') || (document.getElementById('rsvp-name') as HTMLInputElement | null);
        const paxInput = form.querySelector<HTMLInputElement>('#rsvp-pax') || (document.getElementById('rsvp-pax') as HTMLInputElement | null);
        const msgInput = form.querySelector<HTMLTextAreaElement>('#rsvp-message') || (document.getElementById('rsvp-message') as HTMLTextAreaElement | null);
        const submitBtn = form.querySelector<HTMLButtonElement>('#rsvp-submit') || (document.getElementById('rsvp-submit') as HTMLButtonElement | null);
        const errEl = form.querySelector<HTMLElement>('#rsvp-err') || document.getElementById('rsvp-err');
        const doneEl = document.getElementById('rsvp-done');

        const name = nameInput?.value.trim() || '';
        const pax = parseInt(paxInput?.value || '1', 10) || 1;
        const message = msgInput?.value.trim() || '';

        if (!name || !templateWedingId) {
          if (errEl) {
            errEl.textContent = 'Nama tamu wajib diisi.';
            errEl.style.display = 'block';
          }
          return;
        }

        if (submitBtn) submitBtn.disabled = true;
        if (errEl) errEl.style.display = 'none';

        try {
          const res = await postRsvp({
            templateWedingId,
            name,
            status: selectedRsvpStatus,
            pax,
            message,
          });

          if (res.success) {
            if (doneEl) doneEl.style.display = 'block';
            form.style.display = 'none';

            const listEl = document.getElementById('rsvp-comments-list');
            const emptyEl = document.getElementById('rsvp-comments-empty');
            const countEl = document.getElementById('rsvp-comments-count');

            if (res.comment && listEl) {
              listEl.prepend(buildRsvpCommentCard(res.comment, { justSaved: true, liked: false }));
              if (emptyEl) emptyEl.style.display = 'none';
              if (countEl) {
                const curTotal = (parseInt(countEl.textContent || '0', 10) || 0) + 1;
                countEl.textContent = `${curTotal} Konfirmasi`;
              }
            }

            if (selectedRsvpStatus === 'attending') {
              import('canvas-confetti')
                .then((m) => m.default({ particleCount: 80, spread: 70, origin: { y: 0.7 } }))
                .catch(() => undefined);
            }
          } else {
            if (errEl) {
              errEl.textContent = res.error || 'Gagal mengirim konfirmasi RSVP.';
              errEl.style.display = 'block';
            }
          }
        } catch (err: any) {
          if (errEl) {
            errEl.textContent = err.message || 'Terjadi kesalahan sistem.';
            errEl.style.display = 'block';
          }
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
        return;
      }

      // FORM WISHES (Buku Tamu Dapur / Doa Restu)
      if (form.id === 'comments-form') {
        e.preventDefault();
        e.stopPropagation();

        const nameInput = form.querySelector<HTMLInputElement>('#wishes-name') || (document.getElementById('wishes-name') as HTMLInputElement | null);
        const msgInput = form.querySelector<HTMLTextAreaElement>('#wishes-message') || (document.getElementById('wishes-message') as HTMLTextAreaElement | null);
        const submitBtn = form.querySelector<HTMLButtonElement>('#wishes-submit') || (document.getElementById('wishes-submit') as HTMLButtonElement | null);
        const errEl = form.querySelector<HTMLElement>('#wishes-err') || document.getElementById('wishes-err');
        const doneEl = document.getElementById('wishes-done');

        const name = nameInput?.value.trim() || '';
        const ucapan = msgInput?.value.trim() || '';

        if (!name || !ucapan || !templateWedingId) {
          if (errEl) {
            errEl.textContent = 'Nama dan catatan wajib diisi, ya.';
            errEl.style.display = 'block';
          }
          return;
        }

        if (submitBtn) submitBtn.disabled = true;
        if (errEl) errEl.style.display = 'none';

        try {
          const res = await postUcapan({
            templateWedingId,
            name,
            ucapan,
          });

          if (res.success && res.ucapan) {
            if (doneEl) {
              doneEl.style.display = 'block';
              setTimeout(() => {
                doneEl.style.display = 'none';
              }, 5000);
            }
            form.reset();
            const listEl = document.getElementById('comments-list');
            const emptyEl = document.getElementById('comments-empty');
            if (listEl) {
              const newCard = buildWishCard(res.ucapan, { justSaved: true });
              listEl.insertBefore(newCard, listEl.firstChild);
              if (emptyEl) emptyEl.style.display = 'none';
            }
          } else {
            if (errEl) {
              errEl.textContent = res.error || 'Gagal mengirim catatan. Coba lagi.';
              errEl.style.display = 'block';
            }
          }
        } catch (err: any) {
          if (errEl) {
            errEl.textContent = err.message || 'Terjadi kesalahan sistem.';
            errEl.style.display = 'block';
          }
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
        return;
      }
    };
    document.addEventListener('submit', handleGlobalSubmit, true);

    // 7. Load interactive engine & Single initialization guard
    let scriptEl: HTMLScriptElement | null = null;
    let isEngineInitialized = false;
    const runInit = () => {
      if (!isEngineInitialized && typeof (window as any).initMejaKoki === 'function') {
        try {
          (window as any).initMejaKoki();
          isEngineInitialized = true;
        } catch (err) {
          console.warn('initMejaKoki error:', err);
        }
      }
      if (wasAlreadyOpened()) {
        forceCoverOpen();
      }
    };

    let moTimer: ReturnType<typeof setTimeout> | null = null;
    let running = false;
    const reInit = () => {
      if (running) return;
      running = true;
      try {
        runInit();
        if (wasAlreadyOpened()) {
          forceCoverOpen();
        }
        if (revealObserver) {
          const els = document.querySelectorAll('.reveal, .sec, [data-section]');
          els.forEach((el) => revealObserver?.observe(el));
        }
      } finally {
        running = false;
      }
    };

    const mutObserver = new MutationObserver(() => {
      if (moTimer) clearTimeout(moTimer);
      moTimer = setTimeout(reInit, 120);
    });

    if (containerRef.current) {
      mutObserver.observe(containerRef.current, { childList: true });
    }

    const timer = setTimeout(() => {
      if (typeof (window as any).initMejaKoki === 'function') {
        runInit();
      } else {
        scriptEl = document.createElement('script');
        scriptEl.src = '/dist/meja-koki.js';
        scriptEl.async = true;
        scriptEl.onload = runInit;
        document.body.appendChild(scriptEl);
      }
    }, 50);

    // 8. Intersection Observer for Scroll Reveal
    let revealObserver: IntersectionObserver | null = null;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view', 'is-seen');
              if (entry.target.querySelectorAll) {
                entry.target.querySelectorAll('.reveal').forEach((el) => {
                  el.classList.add('in-view', 'is-seen');
                });
              }
            }
          });
        },
        { threshold: 0.05, rootMargin: '0px 0px 80px 0px' }
      );

      const revealElements = document.querySelectorAll('.reveal, .sec, [data-section]');
      revealElements.forEach((el) => revealObserver?.observe(el));
    }

    const handleScrollReveal = () => {
      const vh = window.innerHeight;
      document.querySelectorAll('.sec, [data-section], header, footer').forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < vh * 0.95 && rect.bottom > 0) {
          if (!sec.classList.contains('in-view')) {
            sec.classList.add('in-view', 'is-seen');
            sec.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view', 'is-seen'));
          }
        }
      });
    };
    window.addEventListener('scroll', handleScrollReveal, { passive: true });

    // Direct form submit listeners for maximum reliability
    const rsvpFormEl = document.getElementById('rsvp-form') as HTMLFormElement | null;
    const wishesFormEl = document.getElementById('comments-form') as HTMLFormElement | null;
    if (rsvpFormEl) {
      rsvpFormEl.onsubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        void handleGlobalSubmit(e);
        return false;
      };
    }
    if (wishesFormEl) {
      wishesFormEl.onsubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        void handleGlobalSubmit(e);
        return false;
      };
    }

    // Initial load RSVP comments & wishes (single execution guard)
    if (templateWedingId && !didInitialLoadRef.current) {
      didInitialLoadRef.current = true;
      void loadRsvpComments(true);
      void loadWishes(true);
    }

    // Default RSVP active button styling
    const yesBtn = document.getElementById('rsvp-yes');
    if (yesBtn) {
      yesBtn.classList.add('is-selected', 'is-active');
    }

    return () => {
      // Hentikan pemutaran audio saat unmount agar tidak menjadi detached sound di memory
      const audio = document.getElementById('music-audio') as HTMLAudioElement | null;
      if (audio) {
        try {
          audio.pause();
        } catch {}
      }
      document.body?.classList?.remove('is-locked');
      clearInterval(cdInterval);
      document.removeEventListener('click', handleGlobalClick, true);
      document.removeEventListener('keydown', handleGlobalKeyDown, true);
      document.removeEventListener('submit', handleGlobalSubmit, true);
      window.removeEventListener('scroll', handleScrollReveal);
      if (revealObserver) revealObserver.disconnect();
      mutObserver.disconnect();
      clearTimeout(timer);
      if (moTimer) clearTimeout(moTimer);
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [adminId, templateWedingData]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..800;1,9..144,300..800&family=Plus+Jakarta+Sans:ital,wght@0,300..700;1,300..700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/meja-koki.css" />
        <script src="/dist/meja-koki.js" defer></script>
      </Head>

      <div
        ref={containerRef}
        id="meja-koki-root"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
};

export default MejaKoki;
