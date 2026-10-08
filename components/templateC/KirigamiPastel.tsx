import React, { useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { getKirigamiPastelHtml } from './kirigamiPastelHtml';
import {
  escapeHtml,
  fetchUcapanes,
  formatWishDate,
  postRsvp,
  postUcapan,
  type RsvpStatus,
  type UcapanItem,
} from './kirigamiPastelApi';

interface KirigamiPastelProps {
  adminId?: string;
  guestName?: string | null;
  templateWedingData?: any;
  isAdminView?: boolean;
}

const KirigamiPastel: React.FC<KirigamiPastelProps> = ({
  adminId,
  guestName,
  templateWedingData,
}) => {
  const groom = templateWedingData?.namaPutra || 'Mempelai Pria';
  const bride = templateWedingData?.namaPutri || 'Mempelai Wanita';
  const pageTitle = `${bride} & ${groom} — Undangan Pernikahan`;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const html = useMemo(() => {
    return getKirigamiPastelHtml(templateWedingData || {}, guestName || null);
  }, [templateWedingData, guestName]);

  useEffect(() => {
    // 0. Persistence key for invitation opened state
    const storageKey = `invitation_opened_${adminId || 'kirigami'}`;
    const wasAlreadyOpened = () => {
      try {
        return sessionStorage.getItem(storageKey) === 'true';
      } catch {
        return false;
      }
    };

    // 1. Initial lock state for cover
    if (wasAlreadyOpened()) {
      const cover = document.getElementById('cover');
      if (cover) {
        cover.classList.add('is-open');
        cover.style.display = 'none';
      }
      document.body?.classList?.remove('is-locked');
      document.body?.classList?.add('is-open');
    } else {
      const coverEl = document.getElementById('cover');
      if (coverEl && coverEl.style.display !== 'none' && !coverEl.classList?.contains('is-open')) {
        document.body?.classList?.add('is-locked');
      }
    }

    // 2. Normalize and pass gallery photos to global window
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
              '/assets/templates/taman-rahasia/1790504088_624a7596.jpg',
              '/assets/templates/taman-rahasia/1790504089_19c62296.jpg',
              '/assets/templates/taman-rahasia/1790504090_d0a28793.jpg',
              '/assets/templates/taman-rahasia/1790504091_fd748a98.jpg',
              '/assets/templates/taman-rahasia/1790504092_1c6da46b.jpg',
              '/assets/templates/taman-rahasia/1790504093_80887c6c.jpg',
            ];

    (window as any).__KIRIGAMI_GALLERY_URLS__ = galleryUrls;

    // 3. Pass wedding date for countdown
    const weddingDateRaw =
      templateWedingData?.tanggalPernikahan ||
      templateWedingData?.tanggalAkad ||
      '2026-10-30T09:00:00';
    (window as any).__KIRIGAMI_MAIN_DATE__ = weddingDateRaw;

    // 4. Toast notification helper
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

    // 4.5. Bulletproof openInvitation handler (tidak bergantung pada skrip eksternal)
    let isOpening = false;
    const forceCoverOpen = () => {
      try {
        sessionStorage.setItem(storageKey, 'true');
      } catch {}
      const cover = document.getElementById('cover');
      if (cover) {
        cover.classList.add('is-open');
        cover.style.display = 'none';
      }
      document.body?.classList?.remove('is-locked');
      document.body?.classList?.add('is-open');

      const hero = document.getElementById('hero');
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

      const cover = document.getElementById('cover');
      if (cover) {
        cover.classList.add('is-open');
        window.setTimeout(() => {
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
      if (audio) {
        audio.volume = 0.55;
        const p = audio.play();
        if (p && p.catch) p.catch(() => {});
        if (musicBtn) musicBtn.classList.add('is-playing');
      }

      const hero = document.getElementById('hero');
      if (hero) {
        hero.classList.add('in-view', 'is-seen');
        hero.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view', 'is-seen'));
        hero.scrollIntoView({ behavior: 'smooth' });
      }

      // Safety timer: apa pun yang terjadi, cover harus terbuka
      window.setTimeout(() => {
        const c = document.getElementById('cover');
        if (c && c.style.display !== 'none') forceCoverOpen();
        isOpening = false;
      }, 2000);
    };
    (window as any).openKirigamiInvitation = openInvitation;

    // Delegated click listener untuk tombol buka undangan (Capture Phase)
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest('#cover-open-btn') ||
        target.closest('#cover button') ||
        target.closest('.btn-open-kirigami')
      ) {
        e.preventDefault();
        e.stopPropagation();
        openInvitation();
      }
    };
    document.addEventListener('click', handleGlobalClick, true);

    // 5. Load interactive engine & MutationObserver
    const runInit = () => {
      if (typeof (window as any).initKirigamiPastel === 'function') {
        try {
          (window as any).initKirigamiPastel();
        } catch (err) {
          console.warn('initKirigamiPastel error:', err);
        }
      }
    };

    let moTimer: ReturnType<typeof setTimeout> | null = null;
    let running = false;
    const reInit = () => {
      if (running) return;
      running = true;
      try {
        if (wasAlreadyOpened()) {
          forceCoverOpen();
        }
        runInit();
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
      moTimer = setTimeout(reInit, 60);
    });

    if (containerRef.current) {
      mutObserver.observe(containerRef.current, { childList: true });
    }

    const timer = setTimeout(() => {
      runInit();
    }, 50);

    // 5.5. Intersection Observer Fallback untuk Reveal Cards (pola Template B)
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

    // Scroll listener fallback untuk memastikan seluruh card tampil
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

    // 6. Wishes Card Builder
    const templateWedingId: string | null =
      templateWedingData?.id || (templateWedingData as any)?.templateWedingId || null;

    const buildWishCard = (
      item: UcapanItem,
      opts: { justSaved?: boolean } = {}
    ): HTMLElement => {
      const card = document.createElement('div');
      card.className = 'comment-card';
      card.dataset.ucapanId = item.id;
      const dateText = opts.justSaved ? 'Baru saja' : formatWishDate(item.createdAt);
      card.innerHTML = `
        <div class="comment-tape" aria-hidden="true"></div>
        <p class="comment-name">${escapeHtml(item.name)}</p>
        <p class="comment-message">${escapeHtml(item.ucapan)}</p>
        <span class="comment-date">${escapeHtml(dateText)}</span>
      `;
      return card;
    };

    // 7. Load Wishes into #wishes-list
    const loadWishes = async () => {
      const listEl = document.getElementById('wishes-list');
      if (!templateWedingId || !listEl) return;
      try {
        const res = await fetchUcapanes(templateWedingId, 0);
        if (res?.success && Array.isArray(res.ucapan) && res.ucapan.length > 0) {
          listEl.innerHTML = '';
          const frag = document.createDocumentFragment();
          res.ucapan.forEach((u) => {
            frag.appendChild(buildWishCard(u));
          });
          listEl.appendChild(frag);
        }
      } catch (err) {
        console.error('Error fetching wishes:', err);
      }
    };
    loadWishes();

    // 8. Handle Wishes Form Submission
    const wishesForm = document.getElementById('wishes-form') as HTMLFormElement | null;
    const handleWishesSubmit = async (e: Event) => {
      e.preventDefault();
      if (!wishesForm || !templateWedingId) return;

      const nameInput = wishesForm.querySelector<HTMLInputElement>('#wish-name');
      const msgInput = wishesForm.querySelector<HTMLTextAreaElement>('#wish-message');
      const submitBtn = wishesForm.querySelector<HTMLButtonElement>('#wish-submit');
      const okMsg = wishesForm.querySelector<HTMLElement>('#wish-ok');
      const badMsg = wishesForm.querySelector<HTMLElement>('#wish-bad');

      const name = nameInput?.value.trim() || '';
      const ucapan = msgInput?.value.trim() || '';

      if (!name || !ucapan) {
        if (badMsg) badMsg.style.display = 'block';
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (okMsg) okMsg.style.display = 'none';
      if (badMsg) badMsg.style.display = 'none';

      try {
        const res = await postUcapan({
          templateWedingId,
          name,
          ucapan,
        });

        if (res.success && res.ucapan) {
          if (okMsg) okMsg.style.display = 'block';
          wishesForm.reset();
          const listEl = document.getElementById('wishes-list');
          if (listEl) {
            const newCard = buildWishCard(res.ucapan, { justSaved: true });
            listEl.insertBefore(newCard, listEl.firstChild);
          }
        } else {
          if (badMsg) badMsg.style.display = 'block';
        }
      } catch (err) {
        console.error('Gagal mengirim ucapan:', err);
        if (badMsg) badMsg.style.display = 'block';
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    };

    if (wishesForm) {
      wishesForm.addEventListener('submit', handleWishesSubmit);
    }

    // 9. Handle RSVP Form Submission
    const rsvpForm = document.getElementById('rsvp-form') as HTMLFormElement | null;
    let selectedStatus: RsvpStatus | null = 'attending'; // default hadir

    const rsvpButtons = document.querySelectorAll<HTMLButtonElement>('#rsvp-status-row .status-btn');
    // Set initial active state on #rsvp-yes
    const yesBtn = document.getElementById('rsvp-yes');
    if (yesBtn) yesBtn.classList.add('is-selected');

    rsvpButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        rsvpButtons.forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        const st = btn.getAttribute('data-wedivo-status') as RsvpStatus;
        selectedStatus = st || null;
      });
    });

    const handleRsvpSubmit = async (e: Event) => {
      e.preventDefault();
      if (!rsvpForm || !templateWedingId) return;

      const nameInput = rsvpForm.querySelector<HTMLInputElement>('#rsvp-name');
      const paxInput = rsvpForm.querySelector<HTMLInputElement>('#rsvp-pax');
      const msgInput = rsvpForm.querySelector<HTMLTextAreaElement>('#rsvp-message');
      const submitBtn = rsvpForm.querySelector<HTMLButtonElement>('#rsvp-submit');
      const okMsg = rsvpForm.querySelector<HTMLElement>('#rsvp-ok');
      const badMsg = rsvpForm.querySelector<HTMLElement>('#rsvp-bad');

      const name = nameInput?.value.trim() || '';
      const pax = parseInt(paxInput?.value || '1', 10) || 1;
      const message = msgInput?.value.trim() || '';

      if (!name || !selectedStatus) {
        if (badMsg) {
          badMsg.textContent = 'Mohon isi nama dan pilih status kehadiran terlebih dahulu.';
          badMsg.style.display = 'block';
        }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (okMsg) okMsg.style.display = 'none';
      if (badMsg) badMsg.style.display = 'none';

      try {
        const res = await postRsvp({
          templateWedingId,
          name,
          status: selectedStatus,
          pax,
          message,
        });

        if (res.success) {
          if (okMsg) okMsg.style.display = 'block';
          rsvpForm.reset();
          if (yesBtn) {
            rsvpButtons.forEach((b) => b.classList.remove('is-selected'));
            yesBtn.classList.add('is-selected');
            selectedStatus = 'attending';
          }
        } else {
          if (badMsg) {
            badMsg.textContent = 'Konfirmasi gagal terkirim, silakan coba lagi.';
            badMsg.style.display = 'block';
          }
        }
      } catch (err) {
        console.error('Gagal mengirim RSVP:', err);
        if (badMsg) {
          badMsg.textContent = 'Konfirmasi gagal terkirim, silakan coba lagi.';
          badMsg.style.display = 'block';
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    };

    if (rsvpForm) {
      rsvpForm.addEventListener('submit', handleRsvpSubmit);
    }

    return () => {
      clearTimeout(timer);
      if (moTimer) clearTimeout(moTimer);
      mutObserver.disconnect();
      if (revealObserver) {
        revealObserver.disconnect();
      }
      document.body?.classList?.remove('is-locked', 'is-open');
      document.removeEventListener('click', handleGlobalClick, true);
      window.removeEventListener('scroll', handleScrollReveal);
      if (wishesForm) {
        wishesForm.removeEventListener('submit', handleWishesSubmit);
      }
      if (rsvpForm) {
        rsvpForm.removeEventListener('submit', handleRsvpSubmit);
      }
    };
  }, [templateWedingData, guestName]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Undangan Pernikahan ${bride} & ${groom}`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="stylesheet" href="/css/kirigami-pastel.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Quicksand:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script src="/dist/kirigami-pastel.js" defer></script>
      </Head>
      <div
        id="kirigami-pastel-container"
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: html }}
        suppressHydrationWarning
      />
    </>
  );
};

export default KirigamiPastel;
