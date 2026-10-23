// @ts-nocheck
import { getTumbuhBersamaContent } from '@/lib/templatePresets';
/**
 * Tumbuh Bersama â€” Botanical Interactive Template HTML Generator
 * Faithful replica of wedivo.id/paqkkqe1mjcttlp7bhaqmiy7tsk2
 */

export function escapeHtml(value: string | null | undefined): string {
  return (value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatTanggalIndo(dateString: string | Date | null | undefined): string {
  if (!dateString) return 'Tanggal belum ditentukan';
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  if (isNaN(date.getTime())) return 'Tanggal belum ditentukan';
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function formatWishDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  try {
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

function parseRsvpDetails(rawComment: string): {
  statusLabel: string;
  paxText: string;
  note: string;
} {
  const c = rawComment || '';
  if (!c.startsWith('[RSVP]')) {
    return { statusLabel: 'Hadir', paxText: '', note: c };
  }
  const withoutPrefix = c.slice(6).trim();
  const [head, ...rest] = withoutPrefix.split(' — ');
  const note = rest.join(' — ');
  const headParts = head.split(' · ');
  const statusLabel = headParts[0]?.trim() || 'Hadir';
  const paxText = headParts[1]?.trim() || '';
  return { statusLabel, paxText, note };
}

export const BASE_TUMBUH_BERSAMA_HTML = `
    <!-- SYMBOLS â€” season glyphs, section icons, rundown icons, leaves & flowers
(line icons use currentColor so every season can tint them) -->
    <svg
      id="sprite"
      class="sprite"
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
    >
      <defs id="sprite-defs">
        <!-- seasons -->
        <symbol id="sym-musim-0" viewBox="0 0 24 24">
          <g
            id="pg_1"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
            stroke-linecap="round"
          >
            <path id="pg_2" d="M12 21v-6.4"></path>
            <path
              id="pg_3"
              d="M12 17.6c-2.8-.1-4.5-1.7-4.9-4.2 2.8.1 4.5 1.7 4.9 4.2z"
            ></path>
            <path
              id="pg_4"
              d="M12 16.4c1.9-2.2 4.1-2.8 6-2.2-1 2-3.3 2.9-6 2.2z"
            ></path>
            <path
              id="pg_5"
              d="M12 10.6c-1.3-1.7-1-3.9 0-5 1 1.1 1.3 3.3 0 5z"
            ></path>
            <path
              id="pg_6"
              d="M12 10.6c-2-.2-3.4-1.8-3.4-3.4 1.6 0 3.2 1.4 3.4 3.4z"
            ></path>
            <path
              id="pg_7"
              d="M12 10.6c.2-2 1.8-3.4 3.4-3.4 0 1.6-1.4 3.2-3.4 3.4z"
            ></path>
          </g>
        </symbol>
        <symbol id="sym-musim-1" viewBox="0 0 24 24">
          <g
            id="pg_8"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          >
            <circle id="pg_9" cx="12" cy="12" r="4.1"></circle>
            <path
              id="pg_10"
              d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M5.5 18.5l1.8-1.8M16.7 7.3l1.8-1.8"
            ></path>
          </g>
        </symbol>
        <symbol id="sym-musim-2" viewBox="0 0 24 24">
          <g
            id="pg_11"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linejoin="round"
            stroke-linecap="round"
          >
            <path
              id="pg_12"
              d="M12 16.2 7.3 17.6l1.1-2.3-4.2-1.8 1.9-1.1-1.3-3.3 3.1 1.1.6-2.3 2.1 2.1-.3-4.4L12 7.2l1.6-1.6-.3 4.4 2.1-2.1.6 2.3 3.1-1.1-1.3 3.3 1.9 1.1-4.2 1.8 1.1 2.3z"
            ></path>
            <path id="pg_13" d="M12 16.2V21M12 16.2V10.4"></path>
          </g>
        </symbol>
        <symbol id="sym-musim-3" viewBox="0 0 24 24">
          <g
            id="pg_14"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path id="pg_15" d="M12 2.8v18.4M4 7.4l16 9.2M4 16.6l16-9.2"></path>
            <path
              id="pg_16"
              d="M9.8 4.4 12 6.2l2.2-1.8M9.8 19.6 12 17.8l2.2 1.8M4.5 10.6l2.7-.9-.5-2.8M19.5 13.4l-2.7.9.5 2.8M4.5 13.4l2.7.9-.5 2.8M19.5 10.6l-2.7-.9.5-2.8"
            ></path>
          </g>
        </symbol>
        <symbol id="sym-musim-4" viewBox="0 0 24 24">
          <g
            id="pg_17"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linejoin="round"
            stroke-linecap="round"
          >
            <path
              id="pg_18"
              d="M12 10.3c-1.5-2-1.3-4.4 0-5.9 1.3 1.5 1.5 3.9 0 5.9z"
            ></path>
            <path
              id="pg_19"
              d="M12 10.3c-1.5-2-1.3-4.4 0-5.9 1.3 1.5 1.5 3.9 0 5.9z"
              transform="rotate(72 12 12)"
            ></path>
            <path
              id="pg_20"
              d="M12 10.3c-1.5-2-1.3-4.4 0-5.9 1.3 1.5 1.5 3.9 0 5.9z"
              transform="rotate(144 12 12)"
            ></path>
            <path
              id="pg_21"
              d="M12 10.3c-1.5-2-1.3-4.4 0-5.9 1.3 1.5 1.5 3.9 0 5.9z"
              transform="rotate(216 12 12)"
            ></path>
            <path
              id="pg_22"
              d="M12 10.3c-1.5-2-1.3-4.4 0-5.9 1.3 1.5 1.5 3.9 0 5.9z"
              transform="rotate(288 12 12)"
            ></path>
            <circle id="pg_23" cx="12" cy="12" r="1.5"></circle>
            <path
              id="pg_24"
              d="M20 2.6v2.8M18.6 4h2.8M3.6 18.4v2.4M2.4 19.6h2.4"
            ></path>
          </g>
        </symbol>

        <!-- section icons (navigation) -->
        <symbol id="nv-hero" viewBox="0 0 24 24">
          <g
            id="pg_25"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <ellipse
              id="pg_26"
              cx="8.4"
              cy="15"
              rx="3.1"
              ry="4.3"
              transform="rotate(-20 8.4 15)"
            ></ellipse>
            <ellipse
              id="pg_27"
              cx="15.6"
              cy="15"
              rx="3.1"
              ry="4.3"
              transform="rotate(20 15.6 15)"
            ></ellipse>
            <path id="pg_28" d="M9.6 10.9c.3-2.7 1.5-4.4 3.5-5.4"></path>
            <path
              id="pg_29"
              d="M13.1 5.5c.9-1.5 2.5-2 4-1.6-.7 1.5-2.2 2.1-4 1.6z"
            ></path>
          </g>
        </symbol>
        <symbol id="nv-salam" viewBox="0 0 24 24">
          <g
            id="pg_30"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect
              id="pg_31"
              x="2.8"
              y="5.6"
              width="18.4"
              height="3.6"
              rx="1.8"
            ></rect>
            <rect
              id="pg_32"
              x="2.8"
              y="10.2"
              width="18.4"
              height="3.6"
              rx="1.8"
            ></rect>
            <rect
              id="pg_33"
              x="2.8"
              y="14.8"
              width="18.4"
              height="3.6"
              rx="1.8"
            ></rect>
            <path id="pg_34" d="M7.4 3.6v17.2"></path>
            <circle id="pg_35" cx="7.4" cy="21" r=".6"></circle>
          </g>
        </symbol>
        <symbol id="nv-couple" viewBox="0 0 24 24">
          <g
            id="pg_36"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path id="pg_37" d="M2.8 20.4h18.4"></path>
            <path id="pg_38" d="M8 20.4v-7"></path>
            <path
              id="pg_39"
              d="M8 13.4c-2.6-.1-4.1-1.6-4.4-3.9 2.5.1 4 1.5 4.4 3.9z"
            ></path>
            <path id="pg_40" d="M16 20.4v-9.4"></path>
            <path
              id="pg_41"
              d="M16 11c2.6-.1 4.1-1.6 4.4-3.9-2.5.1-4 1.5-4.4 3.9z"
            ></path>
            <path
              id="pg_42"
              d="M16 14.8c-1.9-.2-3-1.3-3.2-3 1.9.1 2.9 1.2 3.2 3z"
            ></path>
          </g>
        </symbol>
        <symbol id="nv-inoskulasi" viewBox="0 0 24 24">
          <g
            id="pg_43"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path id="pg_44" d="M3 21h18"></path>
            <path
              id="pg_45"
              d="M6.2 21c.3-4 1.2-7.1 3.2-9.3 1.2-1.4 2-2.5 2.6-4.1"
            ></path>
            <path
              id="pg_46"
              d="M17.8 21c-.3-4-1.2-7.1-3.2-9.3-1.2-1.4-2-2.5-2.6-4.1"
            ></path>
            <path
              id="pg_47"
              d="M12 7.6c-1-1.9-.7-3.7.6-4.9 1 1.5.9 3.4-.6 4.9z"
            ></path>
            <path
              id="pg_48"
              d="M8.2 13.4c-1.6.2-3-.4-3.7-1.7 1.5-.3 2.9.3 3.7 1.7zM15.8 13.4c1.6.2 3-.4 3.7-1.7-1.5-.3-2.9.3-3.7 1.7z"
            ></path>
          </g>
        </symbol>
        <symbol id="nv-story" viewBox="0 0 24 24">
          <g
            id="pg_49"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle id="pg_50" cx="12" cy="12" r="8.8"></circle>
            <path id="pg_51" d="M12 3.2v17.6M3.2 12h17.6"></path>
            <circle id="pg_52" cx="7.6" cy="7.6" r="1.3"></circle>
            <path id="pg_53" d="M16.4 5.6v1.2M15.2 7.6h2.4"></path>
            <path
              id="pg_54"
              d="M6.3 15.6c.8.8 1.8 1.1 2.8.9-.2-1-.9-1.8-1.9-2.1"
            ></path>
            <path id="pg_55" d="M15.4 15.1l2 2M17.4 15.1l-2 2"></path>
          </g>
        </symbol>
        <symbol id="nv-gallery" viewBox="0 0 24 24">
          <g
            id="pg_56"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect
              id="pg_57"
              x="4.6"
              y="2.8"
              width="14.8"
              height="18.4"
              rx="1.2"
            ></rect>
            <path id="pg_58" d="M11 17.6V9.4"></path>
            <circle id="pg_59" cx="11" cy="7.6" r="1.8"></circle>
            <path
              id="pg_60"
              d="M11 13.6c-1.8 0-3-1-3.4-2.6 1.8 0 3 1 3.4 2.6zM11 12.4c1.8 0 3-1 3.4-2.6-1.8 0-3 1-3.4 2.6z"
            ></path>
            <path id="pg_61" d="M14 18.4h3"></path>
            <path id="pg_62" d="M9 17.6l4-1.4"></path>
          </g>
        </symbol>
        <symbol id="nv-gugur" viewBox="0 0 24 24">
          <g
            id="pg_63"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              id="pg_64"
              d="M8.6 16c-.9-4.4 2-8.4 8.8-9.3-.2 6.9-4.4 10-8.8 9.3z"
            ></path>
            <path id="pg_65" d="M8.6 16 14 10.6"></path>
            <path id="pg_66" d="M8.6 16 6.8 18"></path>
            <path
              id="pg_67"
              d="M4 7.4c1.4-.5 2.8 0 3.4 1.1M3.4 12.6c1.1-.6 2.1-.5 2.8.1"
              stroke-dasharray="1.2 2.2"
            ></path>
          </g>
        </symbol>
        <symbol id="nv-lingkaran" viewBox="0 0 24 24">
          <g
            id="pg_68"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              id="pg_69"
              d="M12.3 2.9c5.2.1 8.9 4 8.8 9.2-.1 5-4.1 8.9-9.3 8.9-5 0-8.9-4.3-8.8-9.2.2-5.1 4.2-9 9.3-8.9z"
            ></path>
            <path
              id="pg_70"
              d="M12.4 5.6c3.6.1 6 2.8 6 6.3 0 3.6-2.8 6.3-6.4 6.3-3.5 0-6.2-2.9-6.1-6.4.1-3.5 2.9-6.3 6.5-6.2z"
            ></path>
            <path
              id="pg_71"
              d="M12.3 8.6c1.9 0 3.3 1.5 3.3 3.4 0 1.8-1.5 3.3-3.4 3.3-1.8 0-3.3-1.6-3.2-3.4 0-1.9 1.5-3.3 3.3-3.3z"
            ></path>
            <circle id="pg_72" cx="12.3" cy="12" r=".7"></circle>
            <path id="pg_73" d="M21 12.4h-2.8l-.9.7"></path>
          </g>
        </symbol>
        <symbol id="nv-countdown" viewBox="0 0 24 24">
          <g
            id="pg_74"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path id="pg_75" d="M2.8 19.4c4.2-.4 8-2.2 11-5.4"></path>
            <path id="pg_76" d="M6.6 18.8c-.2-1.4.2-2.6 1.3-3.4"></path>
            <path
              id="pg_77"
              d="M13.8 14c-.8-3 .3-6 3.3-8.1 1.5 3.4.6 6.4-3.3 8.1z"
            ></path>
            <path id="pg_78" d="M13.8 14c.8-1.4 1.8-2.4 3.2-3.2"></path>
            <path id="pg_79" d="M19.8 3.2v2M18.8 4.2h2"></path>
          </g>
        </symbol>
        <symbol id="nv-events" viewBox="0 0 24 24">
          <g
            id="pg_80"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect
              id="pg_81"
              x="3.4"
              y="5"
              width="17.2"
              height="15.4"
              rx="2"
            ></rect>
            <path id="pg_82" d="M3.4 9.6h17.2M8 3v4M16 3v4"></path>
            <path id="pg_83" d="M12 17.8v-4.2"></path>
            <path
              id="pg_84"
              d="M12 14.9c-1.7 0-2.7-.9-3-2.4 1.7 0 2.7.9 3 2.4zM12 14.1c1.2-1.3 2.6-1.6 3.8-1.2-.6 1.2-2 1.7-3.8 1.2z"
            ></path>
          </g>
        </symbol>
        <symbol id="nv-rundown" viewBox="0 0 24 24">
          <g
            id="pg_85"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              id="pg_86"
              d="M11.4 2.8c-4.2 3-4.2 6.2 0 9.2s4.2 6.2 0 9.2"
            ></path>
            <path
              id="pg_87"
              d="M13.2 7c1.8-1 3.7-.7 4.8.6-1.7 1.1-3.5 1-4.8-.6z"
            ></path>
            <path
              id="pg_88"
              d="M9.8 16.6c-1.8-1-3.7-.7-4.8.6 1.7 1.1 3.5 1 4.8-.6z"
            ></path>
            <circle id="pg_89" cx="9.4" cy="6.2" r="1"></circle>
            <circle id="pg_90" cx="13.6" cy="15.4" r="1"></circle>
          </g>
        </symbol>
        <symbol id="nv-venue" viewBox="0 0 24 24">
          <g
            id="pg_91"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              id="pg_92"
              d="M12 21.2s-6.6-6.1-6.6-10.9a6.6 6.6 0 0 1 13.2 0c0 4.8-6.6 10.9-6.6 10.9z"
            ></path>
            <path id="pg_93" d="M12 13.4V8.8"></path>
            <path
              id="pg_94"
              d="M12 10.4c-1.5 0-2.5-.8-2.8-2.2 1.5 0 2.5.8 2.8 2.2zM12 9.8c1.1-1.2 2.4-1.5 3.5-1-.6 1.2-1.9 1.6-3.5 1z"
            ></path>
          </g>
        </symbol>
        <symbol id="nv-dresscode" viewBox="0 0 24 24">
          <g
            id="pg_95"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              id="pg_96"
              d="M12 7.4a1.9 1.9 0 1 1 1.9-1.9c0 .9-.6 1.4-1.2 1.8-.5.3-.7.6-.7 1.1V9"
            ></path>
            <path
              id="pg_97"
              d="M12 9 3.4 15.3c-.9.7-.4 1.9.7 1.9h15.8c1.1 0 1.6-1.2.7-1.9z"
            ></path>
            <path
              id="pg_98"
              d="M16.2 13.4c.5-1.6 1.8-2.4 3.3-2.3-.4 1.6-1.7 2.4-3.3 2.3z"
            ></path>
          </g>
        </symbol>
        <symbol id="nv-petunjuk" viewBox="0 0 24 24">
          <g
            id="pg_99"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              id="pg_100"
              d="M5.4 5l1.3-1 1.3 1 1.3-1 1.4 1 1.3-1 1.3 1 1.3-1 1.4 1 1.3-1 1.3 1V20a1 1 0 0 1-1 1H6.4a1 1 0 0 1-1-1z"
            ></path>
            <path id="pg_101" d="M8.4 9.4h7.2M8.4 12.4h7.2M8.4 15.4h4.4"></path>
            <path id="pg_102" d="M15.6 18.4c.4-1.3 1.4-2 2.6-1.9"></path>
          </g>
        </symbol>
        <symbol id="nv-video" viewBox="0 0 24 24">
          <g
            id="pg_103"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path id="pg_104" d="M4.8 21V10.2a7.2 7.2 0 0 1 14.4 0V21z"></path>
            <path id="pg_105" d="M4.8 21h14.4"></path>
            <path id="pg_106" d="M10.4 11.6v5.2l4.4-2.6z"></path>
          </g>
        </symbol>
        <symbol id="nv-gifts" viewBox="0 0 24 24">
          <g
            id="pg_107"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              id="pg_108"
              d="M6 10h8.6v8.4a1.6 1.6 0 0 1-1.6 1.6H7.6A1.6 1.6 0 0 1 6 18.4z"
            ></path>
            <path id="pg_109" d="M14.6 12.6 19 8.6l1.2 1.1-4.8 5"></path>
            <path
              id="pg_110"
              d="M6 12.2c-2.4 0-3.4 1.4-3.4 3.1S3.6 18.4 6 18.4"
            ></path>
            <path id="pg_111" d="M8 10V8.6a2.3 2.3 0 0 1 4.6 0V10"></path>
            <path id="pg_112" d="M21.2 12.6v.8M21.8 15.2v.8M20.2 15v.8"></path>
          </g>
        </symbol>
        <symbol id="nv-rsvp" viewBox="0 0 24 24">
          <g
            id="pg_113"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path id="pg_114" d="M6.2 14h11.6"></path>
            <path
              id="pg_115"
              d="M7 14h10l-1.4 6.2a1 1 0 0 1-1 .8H9.4a1 1 0 0 1-1-.8z"
            ></path>
            <path id="pg_116" d="M12 14V8.4"></path>
            <path
              id="pg_117"
              d="M12 10.6c-2.1 0-3.4-1.1-3.8-3 2.1 0 3.4 1.1 3.8 3zM12 9.4c1.5-1.6 3.2-2 4.7-1.5-.8 1.5-2.5 2.1-4.7 1.5z"
            ></path>
          </g>
        </symbol>
        <symbol id="nv-wishes" viewBox="0 0 24 24">
          <g
            id="pg_118"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path id="pg_119" d="M12 21v-9.4"></path>
            <path
              id="pg_120"
              d="M12 8.2c-1.3-1.5-1.1-3.4 0-4.6 1.1 1.2 1.3 3.1 0 4.6z"
            ></path>
            <path
              id="pg_121"
              d="M12 8.2c-1.9 0-3.3-1.4-3.4-3 1.6 0 3.2 1.2 3.4 3zM12 8.2c.2-1.8 1.8-3 3.4-3-.1 1.6-1.5 3-3.4 3z"
            ></path>
            <path id="pg_122" d="M12 16.2l4.4 1.6v3l-4.4-1.6z"></path>
            <circle id="pg_123" cx="15.4" cy="18.4" r=".5"></circle>
          </g>
        </symbol>
        <symbol id="nv-nanti" viewBox="0 0 24 24">
          <g
            id="pg_124"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path id="pg_125" d="M2.8 20.6h18.4"></path>
            <path id="pg_126" d="M16.4 20.6v-7.4"></path>
            <path
              id="pg_127"
              d="M12.2 11.4a4.4 4.4 0 0 1 3.6-6.8 4.6 4.6 0 0 1 5.2 4.8 3.6 3.6 0 0 1-2.6 4H14.2a2.6 2.6 0 0 1-2-2z"
            ></path>
            <path
              id="pg_128"
              d="M3.4 16.4h8.2M4.4 16.4v4.2M10.6 16.4v4.2M3.8 13.8h7.4"
            ></path>
          </g>
        </symbol>
        <symbol id="nv-closing" viewBox="0 0 24 24">
          <g
            id="pg_129"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path id="pg_130" d="M12 21v-7M12 16.2l-3-2.4M12 15.2l3-2.2"></path>
            <path
              id="pg_131"
              d="M5.4 11.6a4 4 0 0 1 3-6.4 4.6 4.6 0 0 1 7.2 0 4 4 0 0 1 3 6.4 3.4 3.4 0 0 1-3.2 2.4H8.6a3.4 3.4 0 0 1-3.2-2.4z"
            ></path>
            <circle id="pg_132" cx="9.4" cy="9" r=".8"></circle>
            <circle id="pg_133" cx="14.6" cy="8.2" r=".8"></circle>
            <circle id="pg_134" cx="12.2" cy="11.2" r=".8"></circle>
            <path id="pg_135" d="M3 21h18"></path>
          </g>
        </symbol>

        <!-- rundown icon hints (loose inspiration, drawn in the same line) -->
        <symbol id="ri-heart" viewBox="0 0 24 24">
          <path
            id="pg_136"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
            d="M12 20s-7.2-4.5-7.2-10.2A4.1 4.1 0 0 1 12 7.2a4.1 4.1 0 0 1 7.2 2.6C19.2 15.5 12 20 12 20z"
          ></path>
        </symbol>
        <symbol id="ri-users" viewBox="0 0 24 24">
          <g
            id="pg_137"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          >
            <circle id="pg_138" cx="9" cy="8.4" r="3"></circle>
            <path id="pg_139" d="M3.4 19c.5-3.2 2.7-5 5.6-5s5 1.8 5.5 5"></path>
            <circle id="pg_140" cx="16.6" cy="9.4" r="2.4"></circle>
            <path id="pg_141" d="M15.6 14.1c2.6-.2 4.6 1.4 5 4.4"></path>
          </g>
        </symbol>
        <symbol id="ri-utensils" viewBox="0 0 24 24">
          <g
            id="pg_142"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              id="pg_143"
              d="M7 3v8.2M5 3v5a2 2 0 0 0 4 0V3M7 11.2V21"
            ></path>
            <path
              id="pg_144"
              d="M17 21V3c-2.2 1.4-3.4 4-3.4 7.2 0 1.6.8 2.8 2.2 2.8H17"
            ></path>
          </g>
        </symbol>
        <symbol id="ri-camera" viewBox="0 0 24 24">
          <g
            id="pg_145"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          >
            <rect id="pg_146" x="3" y="7" width="18" height="13" rx="2"></rect>
            <path id="pg_147" d="M8.5 7l1.4-2.5h4.2L15.5 7"></path>
            <circle id="pg_148" cx="12" cy="13.4" r="3.6"></circle>
          </g>
        </symbol>
        <symbol id="ri-mic2" viewBox="0 0 24 24">
          <g
            id="pg_149"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          >
            <rect id="pg_150" x="9" y="3" width="6" height="11" rx="3"></rect>
            <path
              id="pg_151"
              d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"
            ></path>
          </g>
        </symbol>
        <symbol id="ri-cake" viewBox="0 0 24 24">
          <g
            id="pg_152"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              id="pg_153"
              d="M4 21h16M5 21v-6.5a1.5 1.5 0 0 1 1.5-1.5h11a1.5 1.5 0 0 1 1.5 1.5V21"
            ></path>
            <path
              id="pg_154"
              d="M5 16.6c1.5 1 2.8 1 4 0s2.5-1 4 0 2.8 1 4 0"
            ></path>
            <path id="pg_155" d="M12 13V9.6"></path>
            <path
              id="pg_156"
              d="M12 8c-.9-.8-.9-2 0-3.5.9 1.5.9 2.7 0 3.5z"
            ></path>
          </g>
        </symbol>
        <symbol id="ri-music" viewBox="0 0 24 24">
          <g
            id="pg_157"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path id="pg_158" d="M9 18V5.5l11-2.5v12.5"></path>
            <circle id="pg_159" cx="6.5" cy="18" r="2.5"></circle>
            <circle id="pg_160" cx="17.5" cy="15.5" r="2.5"></circle>
          </g>
        </symbol>
        <symbol id="ri-gift" viewBox="0 0 24 24">
          <g
            id="pg_161"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect id="pg_162" x="3.5" y="9" width="17" height="4" rx="1"></rect>
            <path
              id="pg_163"
              d="M5 13v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7M12 9v12"
            ></path>
            <path
              id="pg_164"
              d="M12 9c-1.5-3-5.5-4-5.5-1.4C6.5 9 9 9 12 9zM12 9c1.5-3 5.5-4 5.5-1.4C17.5 9 15 9 12 9z"
            ></path>
          </g>
        </symbol>
        <symbol id="ri-party-popper" viewBox="0 0 24 24">
          <g
            id="pg_165"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path id="pg_166" d="M4 20l4.5-12.5 8 8z"></path>
            <path
              id="pg_167"
              d="M13 4.5c.5 1.5 0 2.5-1 3.2M19.5 11c-1.5-.5-2.5 0-3.2 1M16 3.5l.5 1.2M20.5 7.5l-1.2.5M18 5.8l.8-.8"
            ></path>
          </g>
        </symbol>
        <symbol id="ri-sparkles" viewBox="0 0 24 24">
          <g
            id="pg_168"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          >
            <path
              id="pg_169"
              d="M11 3l1.8 4.9L18 9.8l-5.2 1.9L11 16.6l-1.8-4.9L4 9.8l5.2-1.9z"
            ></path>
            <path
              id="pg_170"
              d="M18.5 14.6l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"
            ></path>
          </g>
        </symbol>
        <symbol id="ri-flower2" viewBox="0 0 24 24">
          <g
            id="pg_171"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path id="pg_172" d="M12 21v-8.4"></path>
            <path
              id="pg_173"
              d="M12 17.6c-2.2-.1-3.6-1.4-4-3.4 2.2.1 3.6 1.4 4 3.4z"
            ></path>
            <circle id="pg_174" cx="12" cy="8" r="1.8"></circle>
            <path
              id="pg_175"
              d="M12 6.2c-.9-2.2.1-3.4 0-3.4s.9 1.2 0 3.4zM13.8 8c2.2-.9 3.4.1 3.4 0s-1.2.9-3.4 0zM12 9.8c.9 2.2-.1 3.4 0 3.4s-.9-1.2 0-3.4zM10.2 8c-2.2.9-3.4-.1-3.4 0s1.2-.9 3.4 0z"
            ></path>
          </g>
        </symbol>
        <symbol id="ri-home" viewBox="0 0 24 24">
          <path
            id="pg_176"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
            d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"
          ></path>
        </symbol>
        <symbol id="ri-car" viewBox="0 0 24 24">
          <g
            id="pg_177"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              id="pg_178"
              d="M3.5 16.5v-3.2l2.2-5.1A2 2 0 0 1 7.5 7h9a2 2 0 0 1 1.8 1.2l2.2 5.1v3.2z"
            ></path>
            <circle id="pg_179" cx="7.5" cy="17.4" r="1.8"></circle>
            <circle id="pg_180" cx="16.5" cy="17.4" r="1.8"></circle>
            <path id="pg_181" d="M5 12.5h14"></path>
          </g>
        </symbol>
        <symbol id="ri-shirt" viewBox="0 0 24 24">
          <path
            id="pg_182"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
            d="M8.5 3.5 4 6l1.6 4 2-.8v11.3h8.8V9.2l2 .8L20 6l-4.5-2.5c-.6 1.6-1.9 2.5-3.5 2.5S9.1 5.1 8.5 3.5z"
          ></path>
        </symbol>
        <symbol id="ri-clock" viewBox="0 0 24 24">
          <g
            id="pg_183"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          >
            <circle id="pg_184" cx="12" cy="12" r="8.5"></circle>
            <path id="pg_185" d="M12 7v5.2l3.4 2"></path>
          </g>
        </symbol>
        <symbol id="ri-star" viewBox="0 0 24 24">
          <path
            id="pg_186"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
            d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z"
          ></path>
        </symbol>
        <symbol id="ri-leaf" viewBox="0 0 24 24">
          <g
            id="pg_187"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              id="pg_188"
              d="M5 19c-.6-7.6 4.4-13.4 14-14 .4 9.4-5.2 14.6-14 14z"
            ></path>
            <path id="pg_189" d="M5 19l8-8"></path>
          </g>
        </symbol>

        <!-- practical icons (buttons) -->
        <symbol id="ic-pin" viewBox="0 0 24 24">
          <g
            id="pg_190"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              id="pg_191"
              d="M12 21s-6.5-6-6.5-10.7a6.5 6.5 0 0 1 13 0C18.5 15 12 21 12 21z"
            ></path>
            <circle id="pg_192" cx="12" cy="10.3" r="2.3"></circle>
          </g>
        </symbol>
        <symbol id="ic-copy" viewBox="0 0 24 24">
          <g
            id="pg_193"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linejoin="round"
          >
            <rect
              id="pg_194"
              x="8.5"
              y="8.5"
              width="11.5"
              height="12"
              rx="2"
            ></rect>
            <path
              id="pg_195"
              d="M15.5 8.5V5.5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2V15a2 2 0 0 0 2 2h2.5"
            ></path>
          </g>
        </symbol>
        <symbol id="ic-cal" viewBox="0 0 24 24">
          <g
            id="pg_196"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect
              id="pg_197"
              x="3.5"
              y="5"
              width="17"
              height="15.5"
              rx="2"
            ></rect>
            <path
              id="pg_198"
              d="M3.5 9.6h17M8 3v4M16 3v4M12 12.6v4.8M9.6 15h4.8"
            ></path>
          </g>
        </symbol>
        <symbol id="ic-download" viewBox="0 0 24 24">
          <path
            id="pg_199"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4v11M7 10.5l5 5 5-5M5 20h14"
          ></path>
        </symbol>
        <symbol id="ic-close" viewBox="0 0 24 24">
          <path
            id="pg_200"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            d="M6 6l12 12M18 6 6 18"
          ></path>
        </symbol>
        <symbol id="ic-prev" viewBox="0 0 24 24">
          <path
            id="pg_201"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 5l-7 7 7 7"
          ></path>
        </symbol>
        <symbol id="ic-next" viewBox="0 0 24 24">
          <path
            id="pg_202"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 5l7 7-7 7"
          ></path>
        </symbol>
        <symbol id="ic-play" viewBox="0 0 24 24">
          <path
            id="pg_203"
            fill="currentColor"
            d="M8 5.6v12.8a.8.8 0 0 0 1.2.7l10.4-6.4a.8.8 0 0 0 0-1.4L9.2 4.9A.8.8 0 0 0 8 5.6z"
          ></path>
        </symbol>
        <symbol id="ic-pause" viewBox="0 0 24 24">
          <g id="pg_204" fill="currentColor">
            <rect id="pg_205" x="6.5" y="5" width="4" height="14" rx="1"></rect>
            <rect
              id="pg_206"
              x="13.5"
              y="5"
              width="4"
              height="14"
              rx="1"
            ></rect>
          </g>
        </symbol>
        <symbol id="ic-replay" viewBox="0 0 24 24">
          <path
            id="pg_207"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.6 12a7.4 7.4 0 1 0 2.2-5.2M4.6 4.6v4.4H9"
          ></path>
        </symbol>
        <symbol id="ic-ig" viewBox="0 0 24 24">
          <g id="pg_208" fill="none" stroke="currentColor" stroke-width="1.7">
            <rect
              id="pg_209"
              x="3.5"
              y="3.5"
              width="17"
              height="17"
              rx="5"
            ></rect>
            <circle id="pg_210" cx="12" cy="12" r="4"></circle>
            <circle
              id="pg_211"
              cx="17.3"
              cy="6.7"
              r=".6"
              fill="currentColor"
            ></circle>
          </g>
        </symbol>
        <symbol id="ic-shake" viewBox="0 0 24 24">
          <g
            id="pg_212"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path id="pg_213" d="M12 21v-8"></path>
            <path
              id="pg_214"
              d="M12 13c-4 0-6.6-2.8-6.6-6.1 0-2.6 2.2-4.4 4-4.4 1 0 1.8.4 2.6 1 .8-.6 1.6-1 2.6-1 1.8 0 4 1.8 4 4.4 0 3.3-2.6 6.1-6.6 6.1z"
            ></path>
            <path
              id="pg_215"
              d="M2.6 9.6c-.5 1-.5 2 0 3M21.4 9.6c.5 1 .5 2 0 3"
            ></path>
          </g>
        </symbol>
        <symbol id="ic-drop" viewBox="0 0 24 24">
          <path
            id="pg_216"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linejoin="round"
            d="M12 3.2s6 6.4 6 10.6a6 6 0 0 1-12 0C6 9.6 12 3.2 12 3.2z"
          ></path>
        </symbol>
        <symbol id="ic-gate" viewBox="0 0 24 24">
          <g
            id="pg_217"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path id="pg_218" d="M4 21V9.5a8 8 0 0 1 16 0V21"></path>
            <path
              id="pg_219"
              d="M9 21V10.5M15 21V10.5M4 14.5h16M12 5.5v15.5"
            ></path>
          </g>
        </symbol>
        <symbol id="ic-seed" viewBox="0 0 24 24">
          <g
            id="pg_220"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              id="pg_221"
              d="M12 20.6c-3.6 0-6-2.9-6-6.6 0-4.4 3.6-8.6 6-10.6 2.4 2 6 6.2 6 10.6 0 3.7-2.4 6.6-6 6.6z"
            ></path>
            <path id="pg_222" d="M12 8.4c-1 2.6-1 6.2 0 9.4"></path>
          </g>
        </symbol>
        <symbol id="ic-chime" viewBox="0 0 24 24">
          <g
            id="pg_223"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path id="pg_224" d="M5 4.5h14"></path>
            <path id="pg_225" d="M8 4.5v9M12 4.5v12M16 4.5v7"></path>
            <rect
              id="pg_226"
              x="6.8"
              y="13.4"
              width="2.4"
              height="4.2"
              rx="1.2"
            ></rect>
            <rect
              id="pg_227"
              x="10.8"
              y="16.4"
              width="2.4"
              height="4.2"
              rx="1.2"
            ></rect>
            <rect
              id="pg_228"
              x="14.8"
              y="11.4"
              width="2.4"
              height="4.2"
              rx="1.2"
            ></rect>
          </g>
        </symbol>

        <!-- filled shapes -->
        <symbol id="sym-leaf" viewBox="0 0 40 64">
          <path
            id="pg_229"
            d="M20 62C7 49 3.4 27 20 2c16.6 25 13 47 0 60z"
          ></path>
          <path
            id="pg_230"
            d="M20 60V10"
            fill="none"
            stroke="rgba(0,0,0,.18)"
            stroke-width="1.3"
            stroke-linecap="round"
          ></path>
          <path
            id="pg_231"
            d="M20 44l-8-7M20 34l-7.4-6.6M20 24l-5.6-5M20 44l8-7M20 34l7.4-6.6M20 24l5.6-5"
            fill="none"
            stroke="rgba(0,0,0,.12)"
            stroke-width="1"
            stroke-linecap="round"
          ></path>
        </symbol>
        <symbol id="sym-maple" viewBox="0 0 100 110">
          <path
            id="pg_232"
            d="M50 96 30.5 101l4.4-9.4L13 84.4l7.6-4.4L15 66.2l12.6 4.4 2.6-9.6 8.8 8.8L37.8 50l7.2 6.8L50 34l5 22.8L62.2 50 61 69.8l8.8-8.8 2.6 9.6L85 66.2 79.4 80l7.6 4.4-21.9 7.2 4.4 9.4z"
          ></path>
          <path
            id="pg_233"
            d="M50 108V38M50 80 26 70M50 80l24-10M50 66l-10-12M50 66l10-12"
            fill="none"
            stroke="rgba(0,0,0,.2)"
            stroke-width="1.6"
            stroke-linecap="round"
          ></path>
        </symbol>
        <symbol id="sym-flower" viewBox="0 0 60 76">
          <path
            id="pg_234"
            d="M30 74V36"
            fill="none"
            stroke="var(--fl-stem, #5a7645)"
            stroke-width="2.4"
            stroke-linecap="round"
          ></path>
          <path
            id="pg_235"
            d="M30 60c-9-.4-14.2-5.4-15.6-12.6 9 .4 14.2 5.2 15.6 12.6z"
            fill="var(--fl-leaf, #7c985c)"
          ></path>
          <path
            id="pg_236"
            d="M30 52c6.4-7.4 13.6-9.2 19.6-7.2-3.4 6.6-10.8 9.6-19.6 7.2z"
            fill="var(--fl-leaf, #7c985c)"
          ></path>
          <g id="pg_237" fill="var(--fl-petal, #e7a3b1)">
            <ellipse id="pg_238" cx="30" cy="12.4" rx="6.2" ry="9.4"></ellipse>
            <ellipse
              id="pg_239"
              cx="30"
              cy="12.4"
              rx="6.2"
              ry="9.4"
              transform="rotate(72 30 24)"
            ></ellipse>
            <ellipse
              id="pg_240"
              cx="30"
              cy="12.4"
              rx="6.2"
              ry="9.4"
              transform="rotate(144 30 24)"
            ></ellipse>
            <ellipse
              id="pg_241"
              cx="30"
              cy="12.4"
              rx="6.2"
              ry="9.4"
              transform="rotate(216 30 24)"
            ></ellipse>
            <ellipse
              id="pg_242"
              cx="30"
              cy="12.4"
              rx="6.2"
              ry="9.4"
              transform="rotate(288 30 24)"
            ></ellipse>
          </g>
          <circle
            id="pg_243"
            cx="30"
            cy="24"
            r="5"
            fill="var(--fl-heart, #e8b746)"
          ></circle>
        </symbol>
        <symbol id="sym-blossom" viewBox="0 0 40 40">
          <g id="pg_244" fill="currentColor">
            <ellipse id="pg_245" cx="20" cy="10" rx="5.6" ry="8"></ellipse>
            <ellipse
              id="pg_246"
              cx="20"
              cy="10"
              rx="5.6"
              ry="8"
              transform="rotate(72 20 20)"
            ></ellipse>
            <ellipse
              id="pg_247"
              cx="20"
              cy="10"
              rx="5.6"
              ry="8"
              transform="rotate(144 20 20)"
            ></ellipse>
            <ellipse
              id="pg_248"
              cx="20"
              cy="10"
              rx="5.6"
              ry="8"
              transform="rotate(216 20 20)"
            ></ellipse>
            <ellipse
              id="pg_249"
              cx="20"
              cy="10"
              rx="5.6"
              ry="8"
              transform="rotate(288 20 20)"
            ></ellipse>
          </g>
          <circle id="pg_250" cx="20" cy="20" r="4" fill="#f2cf6b"></circle>
        </symbol>
        <symbol id="sym-seed" viewBox="0 0 20 28">
          <path
            id="pg_251"
            d="M10 27c-5.4 0-8.6-4-8.6-9.2C1.4 11.4 6.4 5 10 1c3.6 4 8.6 10.4 8.6 16.8C18.6 23 15.4 27 10 27z"
          ></path>
          <path
            id="pg_252"
            d="M10 8c-1.4 3.8-1.4 9.4 0 14.4"
            fill="none"
            stroke="rgba(255,255,255,.28)"
            stroke-width="1.4"
            stroke-linecap="round"
          ></path>
        </symbol>
      </defs>
    </svg>

    <!-- THE AIR UNDER THE TREE â€” season-tinted sky, dappled leaf shadows
(komorebi) that change with the season, drifting petals/seeds/leaves/snow -->
    <div id="amb" class="amb" aria-hidden="true">
      <div id="amb-sky" class="amb-sky"></div>
      <div id="amb-sun" class="amb-sun"></div>
      <div id="amb-dapple" class="amb-dapple">
        <div id="amb-dapple-inner" class="amb-dapple-inner">
          <canvas id="amb-dap-0" class="amb-dap" width="8" height="8"></canvas>
          <canvas id="amb-dap-1" class="amb-dap" width="8" height="8"></canvas>
          <canvas id="amb-dap-2" class="amb-dap" width="8" height="8"></canvas>
          <canvas id="amb-dap-3" class="amb-dap" width="8" height="8"></canvas>
          <canvas id="amb-dap-4" class="amb-dap" width="8" height="8"></canvas>
        </div>
      </div>
      <canvas id="amb-air" class="amb-air" width="8" height="8"></canvas>
      <div id="amb-grain" class="amb-grain"></div>
    </div>
    <canvas id="fx" class="fx" width="8" height="8" aria-hidden="true"></canvas>

    <!-- text sources read by the script (never JS string literals) -->
    <div id="src" class="src" aria-hidden="true">
      <span id="src-bride">Nurizzati Islamiyah<\/span>
      <span id="src-groom">Badriana<\/span>
      <span id="src-bride-full">Izzah<\/span>
      <span id="src-groom-full">Badri<\/span>
      <span id="src-venue">wwwtc mall<\/span>
      <span id="src-address">280 Gloucester Rd, Causeway Bay, Hong Kong Island, Hong Kong<\/span>
      <span id="src-tz">WIB<\/span>
      <span id="src-ev1">Akad Nikah<\/span>
      <span id="src-met-place">Lereng Merapi, di hari relawan menanam pohon<\/span>
    </div>
    <audio
      id="bgm"
      class="bgm"
      loop
      preload="none"
      src="{{background_music_url}}"
    ></audio>

    <!-- COVER â€” a seed packet on the potting table. Tear it, and plant. -->
    <section
      id="sec-cover"
      class="cover is-near"
      data-section="cover"
      data-musim="0"
      aria-label="Sampul undangan"
    >
      <div id="cover-table" class="cover-table" aria-hidden="true">
        <!-- a terracotta pot seen from above -->
        <svg id="cover-pot" class="cover-deco cover-pot" viewBox="0 0 160 160">
          <circle id="cv_1" cx="80" cy="80" r="74" fill="#b8643e"></circle>
          <circle
            id="cv_2"
            cx="80"
            cy="80"
            r="74"
            fill="none"
            stroke="#8f4829"
            stroke-width="3"
          ></circle>
          <circle id="cv_3" cx="80" cy="80" r="62" fill="#9c5232"></circle>
          <circle id="cv_4" cx="80" cy="80" r="56" fill="#4a3527"></circle>
          <g id="cv_5" fill="#6b5140" opacity=".8">
            <circle id="cv_6" cx="60" cy="70" r="2.2"></circle>
            <circle id="cv_7" cx="96" cy="58" r="1.8"></circle>
            <circle id="cv_8" cx="104" cy="96" r="2.6"></circle>
            <circle id="cv_9" cx="66" cy="104" r="1.6"></circle>
            <circle id="cv_10" cx="84" cy="112" r="2"></circle>
            <circle id="cv_11" cx="52" cy="90" r="1.4"></circle>
          </g>
          <g id="cv_12" class="cover-pot-sprout" transform="translate(80 80)">
            <g id="cv_13" class="sway-soft">
              <path
                id="cv_14"
                d="M0 0C-4 -14 -20 -22 -34 -18C-28 -4 -14 2 0 0Z"
                fill="#8db870"
              ></path>
              <path
                id="cv_15"
                d="M0 0C6 -12 22 -18 34 -12C26 0 12 4 0 0Z"
                fill="#6f9a52"
              ></path>
              <path
                id="cv_16"
                d="M0 0C-2 -8 -1 -16 3 -24"
                fill="none"
                stroke="#5a7645"
                stroke-width="2.4"
                stroke-linecap="round"
              ></path>
            </g>
          </g>
        </svg>
        <!-- a ball of twine with a loose end -->
        <svg
          id="cover-twine"
          class="cover-deco cover-twine"
          viewBox="0 0 170 150"
        >
          <circle id="cv_17" cx="62" cy="64" r="50" fill="#d6b88a"></circle>
          <g
            id="cv_18"
            fill="none"
            stroke="#b8976a"
            stroke-width="3"
            stroke-linecap="round"
          >
            <path id="cv_19" d="M18 48C40 30 88 26 110 50"></path>
            <path id="cv_20" d="M14 66C40 48 92 46 112 70"></path>
            <path id="cv_21" d="M20 86C44 70 90 70 108 92"></path>
            <path id="cv_22" d="M34 104C54 94 84 94 96 108"></path>
            <path id="cv_23" d="M40 20C30 50 34 90 52 112"></path>
            <path id="cv_24" d="M62 14C54 46 58 92 74 114"></path>
            <path id="cv_25" d="M86 18C80 50 84 92 96 108"></path>
          </g>
          <path
            id="cv_26"
            class="cover-twine-end"
            d="M104 96C122 110 132 120 128 132S104 140 112 126 150 118 160 138"
            fill="none"
            stroke="#c9a978"
            stroke-width="3"
            stroke-linecap="round"
          ></path>
        </svg>
        <!-- a garden trowel -->
        <svg
          id="cover-trowel"
          class="cover-deco cover-trowel"
          viewBox="0 0 90 260"
        >
          <defs id="cv_27">
            <linearGradient id="cover-trowel-blade" x1="0" x2="1">
              <stop id="cv_28" offset="0" stop-color="#aab4b7"></stop>
              <stop id="cv_29" offset=".5" stop-color="#dfe5e6"></stop>
              <stop id="cv_30" offset="1" stop-color="#9aa5a8"></stop>
            </linearGradient>
          </defs>
          <rect
            id="cv_31"
            x="31"
            y="8"
            width="28"
            height="92"
            rx="14"
            fill="#b88756"
          ></rect>
          <path
            id="cv_32"
            d="M38 18v70M46 14v78M53 20v66"
            stroke="#9c6f43"
            stroke-width="1.4"
            stroke-linecap="round"
            opacity=".7"
          ></path>
          <circle id="cv_33" cx="45" cy="22" r="4" fill="#8e643c"></circle>
          <rect
            id="cv_34"
            x="33"
            y="96"
            width="24"
            height="18"
            rx="3"
            fill="#8f999c"
          ></rect>
          <path
            id="cv_35"
            d="M45 112C24 120 14 150 16 184C18 214 32 238 45 252C58 238 72 214 74 184C76 150 66 120 45 112Z"
            fill="url(#cover-trowel-blade)"
          ></path>
          <path
            id="cv_36"
            d="M45 124V238"
            stroke="#8a9598"
            stroke-width="2"
            stroke-linecap="round"
          ></path>
        </svg>
        <!-- loose seeds and two pressed leaves -->
        <svg
          id="cover-seeds"
          class="cover-deco cover-seeds"
          viewBox="0 0 200 150"
        >
          <g id="cv_37" fill="#7b573b">
            <use
              id="cv_38"
              href="#sym-seed"
              x="20"
              y="60"
              width="14"
              height="20"
              transform="rotate(-30 27 70)"
            ></use>
            <use
              id="cv_39"
              href="#sym-seed"
              x="52"
              y="92"
              width="12"
              height="17"
              transform="rotate(40 58 100)"
            ></use>
            <use
              id="cv_40"
              href="#sym-seed"
              x="84"
              y="54"
              width="13"
              height="18"
              transform="rotate(12 90 63)"
            ></use>
            <use
              id="cv_41"
              href="#sym-seed"
              x="112"
              y="104"
              width="11"
              height="16"
              transform="rotate(-64 117 112)"
            ></use>
            <use
              id="cv_42"
              href="#sym-seed"
              x="40"
              y="120"
              width="12"
              height="17"
              transform="rotate(84 46 128)"
            ></use>
          </g>
          <g id="cv_43" class="cover-leaf-a" fill="#8ea86e">
            <use
              id="cv_44"
              href="#sym-leaf"
              x="130"
              y="18"
              width="34"
              height="56"
              transform="rotate(38 147 46)"
            ></use>
          </g>
          <g id="cv_45" class="cover-leaf-b" fill="#c9a56a">
            <use
              id="cv_46"
              href="#sym-leaf"
              x="150"
              y="70"
              width="28"
              height="46"
              transform="rotate(-24 164 93)"
            ></use>
          </g>
        </svg>
      </div>
      <div id="cover-vignette" class="cover-vignette" aria-hidden="true"></div>

      <div id="cover-stage" class="cover-stage">
        <p id="cover-kicker" class="cover-kicker">Undangan Pernikahan</p>

        <div id="packet" class="packet">
          <div
            id="packet-shadow"
            class="packet-shadow"
            aria-hidden="true"
          ></div>
          <div id="packet-strip" class="packet-strip">
            <span
              id="packet-crimp"
              class="packet-crimp"
              aria-hidden="true"
            ><\/span>
            <span id="packet-cut" class="packet-cut" aria-hidden="true">
              <svg id="packet-cut-ic" class="packet-cut-ic" viewBox="0 0 24 24">
                <g
                  id="cv_47"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                >
                  <circle id="cv_48" cx="6" cy="7" r="2.6"></circle>
                  <circle id="cv_49" cx="6" cy="17" r="2.6"></circle>
                  <path id="cv_50" d="M8.2 8.4 20 17M8.2 15.6 20 7"></path>
                </g>
              </svg>
              sobek di sini
            <\/span>
          </div>
          <div id="packet-body" class="packet-body">
            <div id="packet-band" class="packet-band">
              <span id="packet-band-a" class="packet-band-a"
                >Benih pilihan</span
              >
              <span id="packet-band-b" class="packet-band-b"
                >Seri empat musim</span
              >
            </div>
            <div id="packet-window" class="packet-window">
              <img
                id="packet-art"
                class="packet-art"
                src="/assets/templates/tumbuh-bersama/1790250424_e33e7208.jpg"
                alt=""
                loading="eager"
              />
              <svg
                id="packet-art-fallback"
                class="packet-art-fallback"
                viewBox="0 0 240 220"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
              >
                <defs id="cv_51">
                  <linearGradient id="paf-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop id="cv_52" offset="0" stop-color="#f3dfe0"></stop>
                    <stop id="cv_53" offset=".6" stop-color="#f6ecd9"></stop>
                    <stop id="cv_54" offset="1" stop-color="#eef0dc"></stop>
                  </linearGradient>
                  <clipPath id="paf-crown">
                    <circle id="cv_55" cx="120" cy="88" r="62"></circle>
                  </clipPath>
                </defs>
                <rect
                  id="cv_56"
                  width="240"
                  height="220"
                  fill="url(#paf-sky)"
                ></rect>
                <circle
                  id="cv_57"
                  cx="186"
                  cy="46"
                  r="18"
                  fill="#f7dfa6"
                  opacity=".8"
                ></circle>
                <path
                  id="cv_58"
                  d="M0 176C40 158 80 152 120 156S200 170 240 160V220H0Z"
                  fill="#a9bf85"
                ></path>
                <path
                  id="cv_59"
                  d="M0 192C50 180 110 178 160 184S220 194 240 190V220H0Z"
                  fill="#8ea86e"
                ></path>
                <path
                  id="cv_60"
                  d="M114 170C116 150 116 132 112 110M126 170C124 150 124 132 128 110"
                  stroke="#6a4e39"
                  stroke-width="7"
                  fill="none"
                  stroke-linecap="round"
                ></path>
                <g id="cv_61" clip-path="url(#paf-crown)">
                  <rect
                    id="cv_62"
                    x="58"
                    y="26"
                    width="62"
                    height="62"
                    fill="#f1bfca"
                  ></rect>
                  <rect
                    id="cv_63"
                    x="120"
                    y="26"
                    width="62"
                    height="62"
                    fill="#6f9a52"
                  ></rect>
                  <rect
                    id="cv_64"
                    x="120"
                    y="88"
                    width="62"
                    height="62"
                    fill="#d58b2c"
                  ></rect>
                  <rect
                    id="cv_65"
                    x="58"
                    y="88"
                    width="62"
                    height="62"
                    fill="#dfe7ea"
                  ></rect>
                  <g id="cv_66" fill="#fbf2f3">
                    <circle id="cv_67" cx="80" cy="50" r="5"></circle>
                    <circle id="cv_68" cx="98" cy="40" r="4"></circle>
                    <circle id="cv_69" cx="92" cy="66" r="6"></circle>
                    <circle id="cv_70" cx="72" cy="74" r="4"></circle>
                  </g>
                  <g id="cv_71" fill="#4f8a3c">
                    <circle id="cv_72" cx="140" cy="48" r="8"></circle>
                    <circle id="cv_73" cx="160" cy="62" r="9"></circle>
                    <circle id="cv_74" cx="138" cy="74" r="7"></circle>
                  </g>
                  <g id="cv_75" fill="#b1502a">
                    <circle id="cv_76" cx="142" cy="104" r="7"></circle>
                    <circle id="cv_77" cx="162" cy="100" r="6"></circle>
                    <circle id="cv_78" cx="150" cy="124" r="8"></circle>
                  </g>
                  <g
                    id="cv_79"
                    fill="none"
                    stroke="#8a6a4f"
                    stroke-width="2.2"
                    stroke-linecap="round"
                  >
                    <path
                      id="cv_80"
                      d="M120 120L92 102M104 110 98 124M92 102 76 106M110 116 86 132"
                    ></path>
                  </g>
                  <g id="cv_81" fill="#ffffff">
                    <circle id="cv_82" cx="84" cy="100" r="2"></circle>
                    <circle id="cv_83" cx="96" cy="126" r="1.6"></circle>
                    <circle id="cv_84" cx="74" cy="118" r="1.8"></circle>
                  </g>
                </g>
                <circle
                  id="cv_85"
                  cx="120"
                  cy="88"
                  r="62"
                  fill="none"
                  stroke="rgba(60,50,30,.25)"
                  stroke-width="1.4"
                ></circle>
              </svg>
              <span
                id="packet-window-frame"
                class="packet-window-frame"
                aria-hidden="true"
              ><\/span>
            </div>
            <p id="packet-variety" class="packet-variety">Varietas hibrida</p>
            <p id="packet-names" class="packet-names">
              <span id="packet-name-a" class="packet-name">Nurizzati Islamiyah<\/span>
              <span id="packet-x" class="packet-x" aria-label="dan">Ã—<\/span>
              <span id="packet-name-b" class="packet-name">Badriana<\/span>
            </p>
            <p id="packet-cultivar" class="packet-cultivar">â€˜Tumbuh Bersamaâ€™</p>
            <dl id="packet-facts" class="packet-facts">
              <div id="packet-fact-1" class="packet-fact">
                <dt id="packet-fact-1-t">Waktu tanam</dt>
                <dd id="packet-fact-1-d">
                  <span
                    id="packet-date"
                    class="js-date"
                    data-date="2026-10-30"
                    data-format="short"
                    >2026-10-30</span
                  >
                </dd>
              </div>
              <div id="packet-fact-2" class="packet-fact">
                <dt id="packet-fact-2-t">Isi</dt>
                <dd id="packet-fact-2-d">2 benih</dd>
              </div>
              <div id="packet-fact-3" class="packet-fact">
                <dt id="packet-fact-3-t">Masa tumbuh</dt>
                <dd id="packet-fact-3-d">seumur hidup</dd>
              </div>
            </dl>
            <p id="packet-note" class="packet-note">Dua benih, satu musim tanam.</p>
          </div>
          <div id="packet-label" class="packet-label">
            <p id="packet-label-k" class="packet-label-k">
              Dikemas khusus untuk
            </p>
            <p id="guest-greeting" class="packet-label-name">
              <span id="guest-greeting-name"><\/span>
            </p>
            <p id="guest-greeting-generic" class="packet-label-name">
              Anda yang kami sayangi
            </p>
          </div>
          <button
            id="packet-tear"
            class="packet-tear"
            type="button"
            aria-label="Sobek paket benih dan buka undangan"
          ></button>
        </div>

        <button id="cover-open" class="cover-open" type="button">
          <svg
            id="cover-open-ic"
            class="ic"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <use id="cover-open-use" href="#ic-seed"></use>
          </svg>
          <span id="cover-open-t">Sobek &amp; tanam<\/span>
        </button>
        <p id="cover-hint" class="cover-hint">
          Ketuk untuk menyobek paket dan menanam benihnya
        </p>
      </div>
      <span id="cover-seed-a" class="cover-seed" aria-hidden="true"><\/span>
      <span id="cover-seed-b" class="cover-seed" aria-hidden="true"><\/span>
    </section>
    <!-- HERO â€” two seeds fall into the soil, root, braid into one trunk, bloom -->
    <header id="sec-hero" class="hero" data-section="hero" data-musim="0">
      <div id="hero-glow" class="hero-glow" aria-hidden="true"></div>
      <div id="hero-soil" class="hero-soil" aria-hidden="true">
        <svg
          id="hero-grass"
          class="hero-grass"
          viewBox="0 0 400 40"
          preserveAspectRatio="none"
        >
          <path
            id="hero-grass-edge"
            d="M0 30C20 26 34 31 52 28S88 24 110 29 150 32 176 27 214 25 240 30 280 33 306 28 350 25 372 29 390 27 400 28V40H0Z"
            fill="#5f4634"
          ></path>
        </svg>
        <div id="hero-tufts" class="hero-tufts">
          <svg id="hero-tuft-1" class="hero-tuft" viewBox="0 0 40 30">
            <g id="hr_1" class="tuft-sway">
              <path
                id="hr_2"
                d="M8 30C8 20 5 12 1 6M14 30C14 18 16 9 21 2M20 30C19 22 22 15 28 10M26 30C27 24 31 19 38 16"
                fill="none"
                stroke="#6f9a52"
                stroke-width="2"
                stroke-linecap="round"
              ></path>
            </g>
          </svg>
          <svg id="hero-tuft-2" class="hero-tuft" viewBox="0 0 40 30">
            <g id="hr_3" class="tuft-sway">
              <path
                id="hr_4"
                d="M6 30C7 22 4 15 2 11M13 30C12 20 14 12 18 6M21 30C22 20 26 14 33 11M28 30C29 25 33 22 38 21"
                fill="none"
                stroke="#8db870"
                stroke-width="2"
                stroke-linecap="round"
              ></path>
            </g>
          </svg>
          <svg id="hero-tuft-3" class="hero-tuft" viewBox="0 0 40 30">
            <g id="hr_5" class="tuft-sway">
              <path
                id="hr_6"
                d="M9 30C9 21 6 13 3 8M16 30C16 19 19 11 24 5M24 30C24 23 28 17 35 14"
                fill="none"
                stroke="#5a7645"
                stroke-width="2"
                stroke-linecap="round"
              ></path>
            </g>
          </svg>
          <svg id="hero-tuft-4" class="hero-tuft" viewBox="0 0 40 30">
            <g id="hr_7" class="tuft-sway">
              <path
                id="hr_8"
                d="M7 30C8 22 5 16 1 12M14 30C14 20 16 11 20 4M22 30C22 22 25 16 31 12M30 30C31 25 34 22 39 20"
                fill="none"
                stroke="#7c985c"
                stroke-width="2"
                stroke-linecap="round"
              ></path>
            </g>
          </svg>
        </div>
      </div>
      <canvas
        id="hero-canvas"
        class="hero-canvas"
        width="8"
        height="8"
        aria-hidden="true"
      ></canvas>

      <div id="hero-markers" class="hero-markers" aria-hidden="true">
        <span id="hero-marker-a" class="hero-marker hero-marker-a"
          ><span id="hero-marker-a-t" class="hero-marker-t"
            >Nurizzati Islamiyah</span
          ></span
        >
        <span id="hero-marker-b" class="hero-marker hero-marker-b"
          ><span id="hero-marker-b-t" class="hero-marker-t"
            >Badriana</span
          ></span
        >
      </div>

      <div id="hero-copy" class="hero-copy">
        <p id="hero-kicker" class="hero-kicker rv">
          <svg
            id="hero-kicker-ic"
            class="hero-kicker-ic"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <use id="hero-kicker-use" href="#sym-musim-0"></use>
          </svg>
          <span id="hero-kicker-t">Undangan Pernikahan<\/span>
        </p>
        <h1 id="hero-names" class="hero-names">
          <span id="hero-name-a" class="hero-name rv">Nurizzati Islamiyah<\/span>
          <span id="hero-amp" class="hero-amp rv" style="--d: 0.18s"
            ><span id="hero-amp-t" class="hero-amp-t">&amp;<\/span></span
          >
          <span id="hero-name-b" class="hero-name rv" style="--d: 0.3s"
            >Badriana</span
          >
        </h1>
        <p id="hero-tagline" class="hero-tagline rv" style="--d: 0.46s">
          Tumbuh bersama, musim demi musim.
        </p>
        <p id="hero-when" class="hero-when rv" style="--d: 0.6s">
          <span
            id="hero-date"
            class="js-date"
            data-date="2026-10-30"
            data-format="long"
            >2026-10-30</span
          >
          <span
            id="hero-when-dot"
            class="hero-when-dot"
            aria-hidden="true"
          ><\/span>
          <span id="hero-time-wrap" class="hero-time-wrap"
            ><span id="hero-time" class="js-time" data-time="08:00"
              >08:00</span
            >
            <span id="hero-tz" class="tz">WIB<\/span></span
          >
        </p>
      </div>

      <button
        id="hero-tree-hit"
        class="hero-tree-hit"
        type="button"
        aria-label="Goyangkan pohon kecil kami"
      ></button>

      <p id="hero-hint" class="hero-hint rv" style="--d: 1.4s">
        <span id="hero-hint-t"
          >Gulir pelan-pelan â€” kami tumbuh bersama Anda</span
        >
        <svg
          id="hero-hint-ic"
          class="hero-hint-ic"
          viewBox="0 0 24 40"
          aria-hidden="true"
        >
          <path
            id="hero-hint-root"
            d="M12 2C12 12 8 16 10 24S14 32 12 38"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          ></path>
          <path
            id="hero-hint-tip"
            d="M7.5 33 12 38.5 16.5 33"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </p>
    </header>

    <!-- SALAM â€” "sepucuk salam", written on lontar palm-leaf strips -->
    <section
      id="sec-salam"
      class="sec salam"
      data-section="salam"
      data-musim="0"
    >
      <div id="salam-wrap" class="wrap">
        <header class="sh" id="salam-sh">
          <p class="sh-kicker rv" id="salam-sh-k">
            <svg
              class="sh-glyph"
              id="salam-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-0" id="salam-sh-gu"></use></svg
            ><span class="sh-no" id="salam-sh-no">No. 00</span
            ><span class="sh-season" id="salam-sh-season">Musim Semi<\/span>
          </p>
          <h2 class="sh-title rv" id="salam-sh-t" style="--d: 0.08s">
            Sepucuk Salam
          </h2>
          <p class="sh-sub rv" id="salam-sh-s" style="--d: 0.16s">
            Kami menuliskannya di atas daun, sebab semua yang kami tanam berawal
            dari daun juga.
          </p>
        </header>
        <div id="lontar" class="lontar">
          <span
            id="lontar-thread"
            class="lontar-thread"
            aria-hidden="true"
          ><\/span>
          <div
            id="lontar-cover-top"
            class="lontar-cover lontar-cover-top rv rv-down"
          >
            <svg
              id="lontar-cover-top-orn"
              class="lontar-orn"
              viewBox="0 0 120 24"
              aria-hidden="true"
            >
              <path
                id="sl_1"
                d="M4 12h38M78 12h38"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linecap="round"
              ></path>
              <path
                id="sl_2"
                d="M60 3c-4 5-4 13 0 18 4-5 4-13 0-18zM60 12c-6-4-12-4-16 0 4 4 10 4 16 0zM60 12c6-4 12-4 16 0-4 4-10 4-16 0z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.2"
              ></path>
            </svg>
            <p id="salam-opening" class="lontar-opening">
              Assalamu'alaikum Warahmatullahi Wabarakatuh
            </p>
          </div>
          <div id="lontar-leaves" class="lontar-leaves">
            <p id="salam-intro" class="lontar-leaf lontar-leaf-src rich rv">Dengan memohon rahmat dan rida Allah Swt., kami bermaksud menyelenggarakan pernikahan kami. Seperti benih yang membutuhkan tanah, air, dan cahaya untuk tumbuh, kami membutuhkan doa restu Bapak/Ibu/Saudara/i untuk memulai musim yang baru ini.</p>
          </div>
          <blockquote
            id="salam-quote"
            class="lontar-leaf lontar-quote rv rv-fall"
          >
            <span
              id="salam-quote-mark"
              class="lontar-quote-mark"
              aria-hidden="true"
              >â€œ</span
            >
            <p id="salam-quote-text" class="lontar-quote-text rich">Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan-pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.</p>
            <cite id="salam-quote-src" class="lontar-quote-src"
              >QS. Ar-Rum: 21</cite
            >
          </blockquote>
          <div
            id="lontar-cover-bottom"
            class="lontar-cover lontar-cover-bottom rv"
          >
            <p id="lontar-sign" class="lontar-sign">
              <span id="lontar-sign-a">Nurizzati Islamiyah<\/span>
              <span id="lontar-sign-amp" class="lontar-sign-amp">&amp;<\/span>
              <span id="lontar-sign-b">Badriana<\/span>
            </p>
          </div>
        </div>
        <p id="salam-tap" class="salam-tap rv">
          Ketuk lembarnya untuk membaliknya pelan-pelan.
        </p>
      </div>
    </section>

    <!-- COUPLE â€” two seeds from two soils; the roots carry the parents' names -->
    <section
      id="sec-couple"
      class="sec couple"
      data-section="couple"
      data-musim="0"
    >
      <div id="couple-wrap" class="wrap">
        <header class="sh" id="couple-sh">
          <p class="sh-kicker rv" id="couple-sh-k">
            <svg
              class="sh-glyph"
              id="couple-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-0" id="couple-sh-gu"></use></svg
            ><span class="sh-no" id="couple-sh-no">No. 00</span
            ><span class="sh-season" id="couple-sh-season">Musim Semi<\/span>
          </p>
          <h2 class="sh-title rv" id="couple-sh-t" style="--d: 0.08s">
            Dua Benih, Dua Tanah
          </h2>
          <p class="sh-sub rv" id="couple-sh-s" style="--d: 0.16s">
            Sebelum tumbuh bersama, kami tumbuh sendiri-sendiri dulu â€” di tanah
            yang berbeda, dengan akar yang berbeda.
          </p>
        </header>
        <div id="cp-grid" class="cp-grid">
          <article id="cp-bride" class="cp cp-bride rv" data-who="bride">
            <div id="cp-bride-card" class="cp-card paper">
              <p id="cp-bride-no" class="cp-no">
                <span id="cp-bride-no-a">Benih No. 01</span
                ><span id="cp-bride-no-b" class="cp-no-town"
                  >Wonosobo</span
                >
              </p>
              <div id="cp-bride-pw" class="cp-photo-wrap">
                <div
                  id="cp-bride-photo"
                  class="cp-photo"
                  data-photo="https://wedivo.id/uploads/PaqKKqe1mjcttlp7BhAqMiY7tsk2/bridePhoto_1790836741.jpg"
                >
                  <img
                    id="cp-bride-img"
                    class="photo-img"
                    src="https://wedivo.id/uploads/PaqKKqe1mjcttlp7BhAqMiY7tsk2/bridePhoto_1790836741.jpg"
                    alt="Foto Nurizzati Islamiyah"
                    loading="lazy"
                  />
                  <span id="cp-bride-fb" class="photo-fallback cp-fallback"
                    ><span id="cp-bride-fb-i" class="cp-fallback-i"></span
                  ><\/span>
                </div>
                <svg
                  id="cp-bride-frame"
                  class="cp-frame"
                  viewBox="0 0 300 380"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    id="cp_1"
                    class="cp-frame-arch"
                    d="M14 372V150C14 72 76 14 150 14S286 72 286 150V372Z"
                  ></path>
                  <path
                    id="cp_2"
                    class="cp-frame-arch cp-frame-arch-in"
                    d="M24 364V152C24 80 80 24 150 24S276 80 276 152V364Z"
                  ></path>
                </svg>
                <svg
                  id="cp-bride-vine"
                  class="cp-vine"
                  viewBox="0 0 300 380"
                  aria-hidden="true"
                >
                  <path
                    id="cp_3"
                    class="cp-vine-stem"
                    d="M20 372C30 330 8 300 22 262S30 200 40 160 70 90 112 52"
                  ></path>
                  <g id="cp_4" class="cp-vine-leaves" fill="#8db870">
                    <path
                      id="cp_5"
                      class="cp-vl"
                      style="--i: 0"
                      d="M21 322c-12-2-19-10-19-20 11 1 18 9 19 20z"
                    ></path>
                    <path
                      id="cp_6"
                      class="cp-vl"
                      style="--i: 1"
                      d="M24 268c12-4 21-1 26 8-10 4-20 1-26-8z"
                    ></path>
                    <path
                      id="cp_7"
                      class="cp-vl"
                      style="--i: 2"
                      d="M34 196c-12-5-17-14-15-24 11 4 16 13 15 24z"
                    ></path>
                    <path
                      id="cp_8"
                      class="cp-vl"
                      style="--i: 3"
                      d="M58 118c10-8 21-8 28-1-9 7-20 8-28 1z"
                    ></path>
                    <path
                      id="cp_9"
                      class="cp-vl"
                      style="--i: 4"
                      d="M96 64c-2-12 3-21 13-25 3 11-2 20-13 25z"
                    ></path>
                  </g>
                </svg>
                <div id="cp-bride-bloom" class="cp-bloom" aria-hidden="true">
                  <svg
                    id="cp-bride-bloom-svg"
                    class="cp-bloom-svg"
                    viewBox="0 0 60 60"
                  >
                    <g id="cp_10" class="cp-bloom-petals" fill="#f1b8c4">
                      <ellipse
                        id="cp_11"
                        cx="30"
                        cy="15"
                        rx="7"
                        ry="12"
                      ></ellipse>
                      <ellipse
                        id="cp_12"
                        cx="30"
                        cy="15"
                        rx="7"
                        ry="12"
                        transform="rotate(72 30 30)"
                      ></ellipse>
                      <ellipse
                        id="cp_13"
                        cx="30"
                        cy="15"
                        rx="7"
                        ry="12"
                        transform="rotate(144 30 30)"
                      ></ellipse>
                      <ellipse
                        id="cp_14"
                        cx="30"
                        cy="15"
                        rx="7"
                        ry="12"
                        transform="rotate(216 30 30)"
                      ></ellipse>
                      <ellipse
                        id="cp_15"
                        cx="30"
                        cy="15"
                        rx="7"
                        ry="12"
                        transform="rotate(288 30 30)"
                      ></ellipse>
                    </g>
                    <circle
                      id="cp_16"
                      cx="30"
                      cy="30"
                      r="6"
                      fill="#e8b746"
                    ></circle>
                  </svg>
                  <span id="cp-bride-bud" class="cp-bud"><\/span>
                </div>
                <div id="cp-bride-can" class="cp-can" aria-hidden="true">
                  <svg id="cp-bride-can-svg" viewBox="0 0 90 60">
                    <path
                      id="cp_17"
                      d="M20 22h36v26a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6z"
                      fill="#7c985c"
                    ></path>
                    <path
                      id="cp_18"
                      d="M56 30 80 12l5 5-26 22"
                      fill="#6f8a52"
                    ></path>
                    <path
                      id="cp_19"
                      d="M20 28c-10 0-14 5-14 11s4 11 14 11"
                      fill="none"
                      stroke="#5a7645"
                      stroke-width="4"
                      stroke-linecap="round"
                    ></path>
                    <path
                      id="cp_20"
                      d="M28 22v-5a10 10 0 0 1 20 0v5"
                      fill="none"
                      stroke="#5a7645"
                      stroke-width="4"
                    ></path>
                    <circle
                      id="cp_21"
                      cx="84"
                      cy="14"
                      r="5"
                      fill="#5a7645"
                    ></circle>
                  </svg>
                </div>
                <div id="cp-bride-drops" class="cp-drops" aria-hidden="true">
                  <i id="cp_22" class="cp-drop" style="--i: 0"></i
                  ><i id="cp_23" class="cp-drop" style="--i: 1"></i
                  ><i id="cp_24" class="cp-drop" style="--i: 2"></i
                  ><i id="cp_25" class="cp-drop" style="--i: 3"></i
                  ><i id="cp_26" class="cp-drop" style="--i: 4"></i
                  ><i id="cp_27" class="cp-drop" style="--i: 5"></i>
                </div>
              </div>
              <h3 id="cp-bride-name" class="cp-name">Izzah</h3>
              <p id="cp-bride-nick" class="cp-nick">
                dipanggil <em id="cp-bride-nick-v">Nurizzati Islamiyah</em>
              </p>
              <p id="cp-bride-grow" class="cp-grow">
                <span id="cp-bride-grow-k" class="cp-grow-k"
                  >Tumbuh paling subur saat</span
                >
                <span id="cp-bride-grow-v" class="cp-grow-v"
                  >hujan sore, ditemani segelas wedang jahe</span
                >
              </p>
              <div id="cp-bride-actions" class="cp-actions">
                <button
                  id="cp-bride-water"
                  class="cp-water btn btn-ghost btn-sm"
                  type="button"
                  data-target="bride"
                >
                  <svg
                    id="cp-bride-water-ic"
                    class="ic"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <use id="cp_28" href="#ic-drop"></use>
                  </svg>
                  <span id="cp-bride-water-t" class="cp-water-t"
                    >Siram benihnya</span
                  >
                </button>
                <a
                  id="cp-bride-ig"
                  class="cp-ig btn btn-ghost btn-sm"
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener"
                  data-handle="@asrikinanti"
                >
                  <svg
                    id="cp-bride-ig-ic"
                    class="ic"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <use id="cp_29" href="#ic-ig"></use>
                  </svg>
                  <span id="cp-bride-ig-t" class="cp-ig-t"
                    >@asrikinanti</span
                  >
                </a>
              </div>
            </div>
            <div id="cp-bride-soil" class="cp-soil cp-soil-vulkanik">
              <svg
                id="cp-bride-roots"
                class="cp-roots"
                viewBox="0 0 320 170"
                preserveAspectRatio="xMidYMin slice"
                aria-hidden="true"
              >
                <path
                  id="cp_30"
                  class="cp-root cp-root-main"
                  d="M160 0C158 30 166 52 156 84S150 130 160 170"
                ></path>
                <path
                  id="cp_31"
                  class="cp-root"
                  d="M158 30C132 42 110 40 84 62S44 96 20 104"
                ></path>
                <path
                  id="cp_32"
                  class="cp-root"
                  d="M162 42C190 52 214 50 240 72S282 102 304 108"
                ></path>
                <path
                  id="cp_33"
                  class="cp-root cp-root-thin"
                  d="M156 84C136 100 116 120 108 150"
                ></path>
                <path
                  id="cp_34"
                  class="cp-root cp-root-thin"
                  d="M158 92C178 104 196 128 206 160"
                ></path>
                <path
                  id="cp_35"
                  class="cp-root cp-root-thin"
                  d="M84 62C74 76 70 88 58 94"
                ></path>
                <path
                  id="cp_36"
                  class="cp-root cp-root-thin"
                  d="M240 72C250 84 262 90 276 92"
                ></path>
              </svg>
              <div id="cp-bride-soil-in" class="cp-soil-in">
                <p id="cp-bride-order" class="cp-order">
                  Putri kedua dari
                </p>
                <p id="cp-bride-parents" class="cp-parents">
                  Epi
                </p>
                <p id="cp-bride-soiltype" class="cp-soiltype">
                  Tanah asal
                  <span id="cp-bride-town" class="cp-town"
                    >Wonosobo</span
                  ><span id="cp-bride-soil-sep" class="cp-soil-sep">â€”</span
                  ><em id="cp-bride-soil-v">vulkanik, sejuk, dan gembur</em>
                </p>
              </div>
            </div>
          </article>

          <div id="cp-x" class="cp-x rv rv-pop" aria-hidden="true">
            <span id="cp-x-ring" class="cp-x-ring"
              ><span id="cp-x-sign" class="cp-x-sign">Ã—<\/span></span
            >
            <span id="cp-x-t" class="cp-x-t">hibrida, tumbuh bersama<\/span>
          </div>

          <article
            id="cp-groom"
            class="cp cp-groom rv"
            data-who="groom"
            style="--d: 0.12s"
          >
            <div id="cp-groom-card" class="cp-card paper">
              <p id="cp-groom-no" class="cp-no">
                <span id="cp-groom-no-a">Benih No. 02</span
                ><span id="cp-groom-no-b" class="cp-no-town"
                  >Balikpapan</span
                >
              </p>
              <div id="cp-groom-pw" class="cp-photo-wrap">
                <div
                  id="cp-groom-photo"
                  class="cp-photo"
                  data-photo="https://wedivo.id/uploads/PaqKKqe1mjcttlp7BhAqMiY7tsk2/groomPhoto_1790836746.jpg"
                >
                  <img
                    id="cp-groom-img"
                    class="photo-img"
                    src="https://wedivo.id/uploads/PaqKKqe1mjcttlp7BhAqMiY7tsk2/groomPhoto_1790836746.jpg"
                    alt="Foto Badriana"
                    loading="lazy"
                  />
                  <span id="cp-groom-fb" class="photo-fallback cp-fallback"
                    ><span id="cp-groom-fb-i" class="cp-fallback-i"></span
                  ><\/span>
                </div>
                <svg
                  id="cp-groom-frame"
                  class="cp-frame"
                  viewBox="0 0 300 380"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    id="cp_37"
                    class="cp-frame-arch"
                    d="M14 372V150C14 72 76 14 150 14S286 72 286 150V372Z"
                  ></path>
                  <path
                    id="cp_38"
                    class="cp-frame-arch cp-frame-arch-in"
                    d="M24 364V152C24 80 80 24 150 24S276 80 276 152V364Z"
                  ></path>
                </svg>
                <svg
                  id="cp-groom-vine"
                  class="cp-vine cp-vine-r"
                  viewBox="0 0 300 380"
                  aria-hidden="true"
                >
                  <path
                    id="cp_39"
                    class="cp-vine-stem"
                    d="M280 372C270 330 292 300 278 262S270 200 260 160 230 90 188 52"
                  ></path>
                  <g id="cp_40" class="cp-vine-leaves" fill="#7c985c">
                    <path
                      id="cp_41"
                      class="cp-vl"
                      style="--i: 0"
                      d="M279 322c12-2 19-10 19-20-11 1-18 9-19 20z"
                    ></path>
                    <path
                      id="cp_42"
                      class="cp-vl"
                      style="--i: 1"
                      d="M276 268c-12-4-21-1-26 8 10 4 20 1 26-8z"
                    ></path>
                    <path
                      id="cp_43"
                      class="cp-vl"
                      style="--i: 2"
                      d="M266 196c12-5 17-14 15-24-11 4-16 13-15 24z"
                    ></path>
                    <path
                      id="cp_44"
                      class="cp-vl"
                      style="--i: 3"
                      d="M242 118c-10-8-21-8-28-1 9 7 20 8 28 1z"
                    ></path>
                    <path
                      id="cp_45"
                      class="cp-vl"
                      style="--i: 4"
                      d="M204 64c2-12-3-21-13-25-3 11 2 20 13 25z"
                    ></path>
                  </g>
                </svg>
                <div id="cp-groom-bloom" class="cp-bloom" aria-hidden="true">
                  <svg
                    id="cp-groom-bloom-svg"
                    class="cp-bloom-svg"
                    viewBox="0 0 60 60"
                  >
                    <g id="cp_46" class="cp-bloom-petals" fill="#f3dc8e">
                      <ellipse
                        id="cp_47"
                        cx="30"
                        cy="15"
                        rx="7"
                        ry="12"
                      ></ellipse>
                      <ellipse
                        id="cp_48"
                        cx="30"
                        cy="15"
                        rx="7"
                        ry="12"
                        transform="rotate(72 30 30)"
                      ></ellipse>
                      <ellipse
                        id="cp_49"
                        cx="30"
                        cy="15"
                        rx="7"
                        ry="12"
                        transform="rotate(144 30 30)"
                      ></ellipse>
                      <ellipse
                        id="cp_50"
                        cx="30"
                        cy="15"
                        rx="7"
                        ry="12"
                        transform="rotate(216 30 30)"
                      ></ellipse>
                      <ellipse
                        id="cp_51"
                        cx="30"
                        cy="15"
                        rx="7"
                        ry="12"
                        transform="rotate(288 30 30)"
                      ></ellipse>
                    </g>
                    <circle
                      id="cp_52"
                      cx="30"
                      cy="30"
                      r="6"
                      fill="#c9763a"
                    ></circle>
                  </svg>
                  <span id="cp-groom-bud" class="cp-bud"><\/span>
                </div>
                <div id="cp-groom-can" class="cp-can" aria-hidden="true">
                  <svg id="cp-groom-can-svg" viewBox="0 0 90 60">
                    <path
                      id="cp_53"
                      d="M20 22h36v26a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6z"
                      fill="#7c985c"
                    ></path>
                    <path
                      id="cp_54"
                      d="M56 30 80 12l5 5-26 22"
                      fill="#6f8a52"
                    ></path>
                    <path
                      id="cp_55"
                      d="M20 28c-10 0-14 5-14 11s4 11 14 11"
                      fill="none"
                      stroke="#5a7645"
                      stroke-width="4"
                      stroke-linecap="round"
                    ></path>
                    <path
                      id="cp_56"
                      d="M28 22v-5a10 10 0 0 1 20 0v5"
                      fill="none"
                      stroke="#5a7645"
                      stroke-width="4"
                    ></path>
                    <circle
                      id="cp_57"
                      cx="84"
                      cy="14"
                      r="5"
                      fill="#5a7645"
                    ></circle>
                  </svg>
                </div>
                <div id="cp-groom-drops" class="cp-drops" aria-hidden="true">
                  <i id="cp_58" class="cp-drop" style="--i: 0"></i
                  ><i id="cp_59" class="cp-drop" style="--i: 1"></i
                  ><i id="cp_60" class="cp-drop" style="--i: 2"></i
                  ><i id="cp_61" class="cp-drop" style="--i: 3"></i
                  ><i id="cp_62" class="cp-drop" style="--i: 4"></i
                  ><i id="cp_63" class="cp-drop" style="--i: 5"></i>
                </div>
              </div>
              <h3 id="cp-groom-name" class="cp-name">Badri</h3>
              <p id="cp-groom-nick" class="cp-nick">
                dipanggil <em id="cp-groom-nick-v">Badriana</em>
              </p>
              <p id="cp-groom-grow" class="cp-grow">
                <span id="cp-groom-grow-k" class="cp-grow-k"
                  >Tumbuh paling subur saat</span
                >
                <span id="cp-groom-grow-v" class="cp-grow-v"
                  >matahari pagi, sesudah kopi pertama</span
                >
              </p>
              <div id="cp-groom-actions" class="cp-actions">
                <button
                  id="cp-groom-water"
                  class="cp-water btn btn-ghost btn-sm"
                  type="button"
                  data-target="groom"
                >
                  <svg
                    id="cp-groom-water-ic"
                    class="ic"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <use id="cp_64" href="#ic-drop"></use>
                  </svg>
                  <span id="cp-groom-water-t" class="cp-water-t"
                    >Siram benihnya</span
                  >
                </button>
                <a
                  id="cp-groom-ig"
                  class="cp-ig btn btn-ghost btn-sm"
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener"
                  data-handle="@bumisatria"
                >
                  <svg
                    id="cp-groom-ig-ic"
                    class="ic"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <use id="cp_65" href="#ic-ig"></use>
                  </svg>
                  <span id="cp-groom-ig-t" class="cp-ig-t"
                    >@bumisatria</span
                  >
                </a>
              </div>
            </div>
            <div id="cp-groom-soil" class="cp-soil cp-soil-merah">
              <svg
                id="cp-groom-roots"
                class="cp-roots"
                viewBox="0 0 320 170"
                preserveAspectRatio="xMidYMin slice"
                aria-hidden="true"
              >
                <path
                  id="cp_66"
                  class="cp-root cp-root-main"
                  d="M160 0C162 30 154 52 164 84S170 130 160 170"
                ></path>
                <path
                  id="cp_67"
                  class="cp-root"
                  d="M162 30C188 42 210 40 236 62S276 96 300 104"
                ></path>
                <path
                  id="cp_68"
                  class="cp-root"
                  d="M158 42C130 52 106 50 80 72S38 102 16 108"
                ></path>
                <path
                  id="cp_69"
                  class="cp-root cp-root-thin"
                  d="M164 84C184 100 204 120 212 150"
                ></path>
                <path
                  id="cp_70"
                  class="cp-root cp-root-thin"
                  d="M162 92C142 104 124 128 114 160"
                ></path>
                <path
                  id="cp_71"
                  class="cp-root cp-root-thin"
                  d="M236 62C246 76 250 88 262 94"
                ></path>
                <path
                  id="cp_72"
                  class="cp-root cp-root-thin"
                  d="M80 72C70 84 58 90 44 92"
                ></path>
              </svg>
              <div id="cp-groom-soil-in" class="cp-soil-in">
                <p id="cp-groom-order" class="cp-order">
                  Putra pertama dari
                </p>
                <p id="cp-groom-parents" class="cp-parents">
                  Madripi
                </p>
                <p id="cp-groom-soiltype" class="cp-soiltype">
                  Tanah asal
                  <span id="cp-groom-town" class="cp-town"
                    >Balikpapan</span
                  ><span id="cp-groom-soil-sep" class="cp-soil-sep">â€”</span
                  ><em id="cp-groom-soil-v">merah, hangat, dan tahan kemarau</em>
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- INOSKULASI â€” two trees that grow close enough to graft into one
(inosculation: from Latin osculari, "to kiss") -->
    <section
      id="sec-inos"
      class="sec inos"
      data-section="inoskulasi"
      data-musim="0"
    >
      <div id="inos-wrap" class="wrap">
        <header class="sh" id="inos-sh">
          <p class="sh-kicker rv" id="inos-sh-k">
            <svg
              class="sh-glyph"
              id="inos-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-0" id="inos-sh-gu"></use></svg
            ><span class="sh-no" id="inos-sh-no">No. 00</span
            ><span class="sh-season" id="inos-sh-season">Musim Semi<\/span>
          </p>
          <h2 class="sh-title rv" id="inos-sh-t" style="--d: 0.08s">
            Inoskulasi
          </h2>
          <p class="sh-sub rv" id="inos-sh-s" style="--d: 0.16s">
            Kadang dua pohon tumbuh terlalu dekat. Setiap angin datang, dahan
            mereka bergesekan â€” musim demi musim â€” sampai kulit kayunya luruh
            dan keduanya menyatu. Ahli botani menyebutnya
            <em id="in_1">inoskulasi</em>, dari bahasa Latin
            <em id="in_2">osculari</em>: mencium.
          </p>
        </header>
        <div id="inos-grid" class="inos-grid">
          <figure id="inos-stage" class="inos-stage rv rv-pop">
            <canvas
              id="inos-canvas"
              class="inos-canvas"
              width="8"
              height="8"
              aria-hidden="true"
            ></canvas>
            <div id="inos-hud" class="inos-hud" aria-hidden="true">
              <p id="inos-season" class="inos-season">
                <svg
                  id="inos-season-ic"
                  class="inos-season-ic"
                  viewBox="0 0 24 24"
                >
                  <use id="inos-season-use" href="#sym-musim-0"></use>
                </svg>
                <span id="inos-season-t">Musim Semi<\/span>
              </p>
              <p id="inos-count" class="inos-count">
                musim ke-<span id="inos-count-n">1<\/span>
              </p>
            </div>
            <span id="inos-lbl-a" class="inos-lbl inos-lbl-a" aria-hidden="true"
              >Nurizzati Islamiyah</span
            >
            <span id="inos-lbl-b" class="inos-lbl inos-lbl-b" aria-hidden="true"
              >Badriana</span
            >
            <span id="inos-kiss" class="inos-kiss" aria-hidden="true"
              ><span id="inos-kiss-ring" class="inos-kiss-ring"></span
            ><\/span>
            <figcaption id="inos-fig" class="inos-fig">
              Gbr. 1 â€” dua pohon, dua akar, satu tajuk
            </figcaption>
          </figure>

          <div id="inos-side" class="inos-side">
            <div id="inos-ctrl" class="inos-ctrl rv">
              <div id="inos-ctrl-row" class="inos-ctrl-row">
                <button
                  id="inos-play"
                  class="inos-play"
                  type="button"
                  aria-label="Putar waktu"
                >
                  <svg
                    id="inos-play-ic"
                    class="inos-play-ic"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <use id="inos-play-use" href="#ic-play"></use>
                  </svg>
                </button>
                <div id="inos-range-wrap" class="inos-range-wrap">
                  <label id="inos-range-l" class="inos-range-l" for="inos-range"
                    >Geser waktunya</label
                  >
                  <input
                    id="inos-range"
                    class="inos-range"
                    type="range"
                    min="0"
                    max="1000"
                    step="1"
                    value="60"
                  />
                </div>
              </div>
              <div id="inos-chips" class="inos-chips">
                <button
                  id="inos-chip-0"
                  class="inos-chip is-on"
                  type="button"
                  data-v="120"
                >
                  Tumbuh sendiri
                </button>
                <button
                  id="inos-chip-1"
                  class="inos-chip"
                  type="button"
                  data-v="380"
                >
                  Sentuhan pertama
                </button>
                <button
                  id="inos-chip-2"
                  class="inos-chip"
                  type="button"
                  data-v="660"
                >
                  Bergesekan
                </button>
                <button
                  id="inos-chip-3"
                  class="inos-chip"
                  type="button"
                  data-v="1000"
                >
                  Menyatu
                </button>
              </div>
            </div>

            <div id="inos-caps" class="inos-caps rv" aria-live="polite">
              <article id="inos-cap-0" class="inos-cap is-on" data-stage="0">
                <p id="inos-cap-0-k" class="inos-cap-k">01 Â· Tumbuh sendiri</p>
                <h3 id="inos-cap-0-t" class="inos-cap-t">
                  Dua pohon, dua kota
                </h3>
                <p id="inos-cap-0-p" class="inos-cap-p">
                  Bertahun-tahun kami tumbuh di tanah masing-masing: cukup dekat
                  untuk merasakan angin yang sama, belum cukup dekat untuk
                  bersentuhan.
                </p>
              </article>
              <article id="inos-cap-1" class="inos-cap" data-stage="1">
                <p id="inos-cap-1-k" class="inos-cap-k">
                  02 Â· Sentuhan pertama
                </p>
                <h3 id="inos-cap-1-t" class="inos-cap-t">
                  <span
                    id="inos-met-date"
                    class="js-date"
                    data-date="2019-04-13"
                    data-format="long"
                    >2019-04-13</span
                  >
                </h3>
                <p id="inos-cap-1-place" class="inos-cap-place">
                  Lereng Merapi, di hari relawan menanam pohon
                </p>
                <p id="inos-cap-1-p" class="inos-cap-p rich">Ia menggali lubang, aku memegang bibitnya. Kami menanam sebelas pohon hari itu, dan pulang membawa nomor telepon masing-masing.</p>
              </article>
              <article id="inos-cap-2" class="inos-cap" data-stage="2">
                <p id="inos-cap-2-k" class="inos-cap-k">03 Â· Bergesekan</p>
                <h3 id="inos-cap-2-t" class="inos-cap-t">Musim demi musim</h3>
                <p id="inos-cap-2-p" class="inos-cap-p">
                  Setiap angin datang, dahan kami bergesekan. Tidak selalu
                  nyaman â€” tapi dari gesekan itulah kulit kayu terbuka, dan kami
                  mulai saling mengisi.
                </p>
              </article>
              <article id="inos-cap-3" class="inos-cap" data-stage="3">
                <p id="inos-cap-3-k" class="inos-cap-k">04 Â· Menyatu</p>
                <h3 id="inos-cap-3-t" class="inos-cap-t">Satu tajuk</h3>
                <p id="inos-cap-3-p" class="inos-cap-p rich">Dua batang, satu tajuk. Akar kami tetap duaâ€”membawa tanah asal masing-masingâ€”tapi mulai hari ini, yang mengalir di antara kami adalah satu.</p>
                <p id="inos-since" class="inos-since">
                  Sudah
                  <strong
                    id="inos-since-n"
                    class="js-since"
                    data-date="2019-04-13"
                    >0</strong
                  >
                  hari sejak dahan kami pertama bersentuhan.
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STORY â€” "Musim-Musim Kita": the tree turns through four seasons as the
guest scrolls past each chapter of the love story -->
    <section
      id="sec-story"
      class="sec story"
      data-section="story"
      data-musim="1"
    >
      <div id="story-head" class="wrap story-head">
        <header class="sh" id="story-sh">
          <p class="sh-kicker rv" id="story-sh-k">
            <svg
              class="sh-glyph"
              id="story-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-1" id="story-sh-gu"></use></svg
            ><span class="sh-no" id="story-sh-no">No. 00</span
            ><span class="sh-season" id="story-sh-season">Musim Panas<\/span>
          </p>
          <h2 class="sh-title rv" id="story-sh-t" style="--d: 0.08s">
            Musim-Musim Kita
          </h2>
          <p class="sh-sub rv" id="story-sh-s" style="--d: 0.16s">
            Tidak ada pohon yang tumbuh hanya di satu musim. Begitu juga kami:
            ada yang tumbuh, ada yang gugur, ada yang menunggu.
          </p>
        </header>
      </div>
      <div id="story-scroller" class="story-scroller">
        <div id="story-stage" class="story-stage" aria-hidden="true">
          <canvas
            id="story-canvas"
            class="story-canvas"
            width="8"
            height="8"
          ></canvas>
          <div id="story-dial" class="story-dial">
            <svg id="story-dial-svg" class="story-dial-svg" viewBox="0 0 64 64">
              <circle
                id="story-dial-q0"
                class="story-dial-q"
                cx="32"
                cy="32"
                r="24"
                stroke-dasharray="37.7 150.8"
                stroke-dashoffset="0"
                style="stroke: #e7a3b1"
              ></circle>
              <circle
                id="story-dial-q1"
                class="story-dial-q"
                cx="32"
                cy="32"
                r="24"
                stroke-dasharray="37.7 150.8"
                stroke-dashoffset="-37.7"
                style="stroke: #8db870"
              ></circle>
              <circle
                id="story-dial-q2"
                class="story-dial-q"
                cx="32"
                cy="32"
                r="24"
                stroke-dasharray="37.7 150.8"
                stroke-dashoffset="-75.4"
                style="stroke: #d58b2c"
              ></circle>
              <circle
                id="story-dial-q3"
                class="story-dial-q"
                cx="32"
                cy="32"
                r="24"
                stroke-dasharray="37.7 150.8"
                stroke-dashoffset="-113.1"
                style="stroke: #9fb9c6"
              ></circle>
              <g id="story-dial-hand" class="story-dial-hand">
                <path
                  id="st_1"
                  d="M32 32 32 12"
                  stroke="#2d3a24"
                  stroke-width="2.4"
                  stroke-linecap="round"
                ></path>
                <circle
                  id="st_2"
                  cx="32"
                  cy="32"
                  r="3.4"
                  fill="#2d3a24"
                ></circle>
              </g>
            </svg>
            <p id="story-dial-t" class="story-dial-t">Musim Semi</p>
          </div>
        </div>

        <div id="story-cards" class="story-cards">
          <article id="st-1" class="st-card paper rv" data-season="0">
            <header id="st-1-head" class="st-head">
              <svg
                id="st-1-ic"
                class="st-ic"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <use id="st_3" href="#sym-musim-0"></use>
              </svg>
              <span id="st-1-season" class="st-season">Musim semi<\/span>
              <span id="st-1-date" class="st-date">April 2019<\/span>
            </header>
            <div
              id="st-1-photo"
              class="st-photo"
              data-photo="{{love_story_1_photo}}"
            >
              <img
                id="st-1-img"
                class="photo-img"
                src="{{love_story_1_photo}}"
                alt="Musim tunas pertama"
                loading="lazy"
              />
              <svg
                id="st-1-orn"
                class="st-orn st-orn-0"
                viewBox="0 0 120 80"
                aria-hidden="true"
              >
                <g id="st_4" fill="#f1b8c4">
                  <circle id="st_5" cx="16" cy="18" r="7"></circle>
                  <circle id="st_6" cx="30" cy="10" r="5"></circle>
                  <circle id="st_7" cx="8" cy="34" r="5"></circle>
                </g>
                <path
                  id="st_8"
                  d="M0 50C14 38 22 24 40 4"
                  fill="none"
                  stroke="#6a4e39"
                  stroke-width="2.4"
                  stroke-linecap="round"
                ></path>
                <g id="st_9" fill="#9cc47a">
                  <path
                    id="st_10"
                    d="M24 30c-6-4-8-10-5-15 5 3 7 9 5 15z"
                  ></path>
                </g>
              </svg>
            </div>
            <h3 id="st-1-title" class="st-title">Musim tunas pertama</h3>
            <p id="st-1-text" class="st-text rich">Kami bertemu di lereng Merapi, di antara bibit-bibit mahoni. Obrolan pertama kami tentang kenapa daun muda warnanya lebih terang. Sejak itu, kami selalu punya alasan untuk bertemu lagi.</p>
          </article>

          <article id="st-2" class="st-card paper rv" data-season="1">
            <header id="st-2-head" class="st-head">
              <svg
                id="st-2-ic"
                class="st-ic"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <use id="st_11" href="#sym-musim-1"></use>
              </svg>
              <span id="st-2-season" class="st-season">Musim panas<\/span>
              <span id="st-2-date" class="st-date">2020 â€“ 2022<\/span>
            </header>
            <div
              id="st-2-photo"
              class="st-photo"
              data-photo="{{love_story_2_photo}}"
            >
              <img
                id="st-2-img"
                class="photo-img"
                src="{{love_story_2_photo}}"
                alt="Musim yang rimbun"
                loading="lazy"
              />
              <svg
                id="st-2-orn"
                class="st-orn st-orn-1"
                viewBox="0 0 120 80"
                aria-hidden="true"
              >
                <circle
                  id="st_12"
                  cx="24"
                  cy="24"
                  r="12"
                  fill="#f3c64f"
                ></circle>
                <g
                  id="st_13"
                  stroke="#f3c64f"
                  stroke-width="2.4"
                  stroke-linecap="round"
                >
                  <path
                    id="st_14"
                    d="M24 4v5M24 39v5M4 24h5M39 24h5M10 10l3.5 3.5M34.5 34.5 38 38M10 38l3.5-3.5M34.5 13.5 38 10"
                  ></path>
                </g>
              </svg>
            </div>
            <h3 id="st-2-title" class="st-title">Musim yang rimbun</h3>
            <p id="st-2-text" class="st-text rich">Tahun-tahun yang hangat: skripsi, pekerjaan pertama, dan ratusan perjalanan motor ke pasar kembang. Kami tumbuh cepatâ€”kadang terlalu cepatâ€”dan belajar saling memberi ruang.</p>
          </article>

          <article id="st-3" class="st-card paper rv" data-season="2">
            <header id="st-3-head" class="st-head">
              <svg
                id="st-3-ic"
                class="st-ic"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <use id="st_15" href="#sym-musim-2"></use>
              </svg>
              <span id="st-3-season" class="st-season">Musim gugur<\/span>
              <span id="st-3-date" class="st-date">2023<\/span>
            </header>
            <div
              id="st-3-photo"
              class="st-photo"
              data-photo="{{love_story_3_photo}}"
            >
              <img
                id="st-3-img"
                class="photo-img"
                src="{{love_story_3_photo}}"
                alt="Musim melepas"
                loading="lazy"
              />
              <svg
                id="st-3-orn"
                class="st-orn st-orn-2"
                viewBox="0 0 120 80"
                aria-hidden="true"
              >
                <g id="st_16" fill="#d58b2c">
                  <use
                    id="st_17"
                    href="#sym-maple"
                    x="4"
                    y="2"
                    width="30"
                    height="33"
                  ></use>
                </g>
                <g id="st_18" fill="#b1502a">
                  <use
                    id="st_19"
                    href="#sym-maple"
                    x="30"
                    y="24"
                    width="22"
                    height="24"
                  ></use>
                </g>
              </svg>
            </div>
            <h3 id="st-3-title" class="st-title">Musim melepas</h3>
            <p id="st-3-text" class="st-text rich">Bumi pindah kerja ke Balikpapan. Ada yang harus kami lepas: temu setiap akhir pekan, rencana-rencana kecil, dan gengsi. Yang tertinggal justru yang paling penting.</p>
          </article>

          <article id="st-4" class="st-card paper rv" data-season="3">
            <header id="st-4-head" class="st-head">
              <svg
                id="st-4-ic"
                class="st-ic"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <use id="st_20" href="#sym-musim-3"></use>
              </svg>
              <span id="st-4-season" class="st-season">Musim dingin<\/span>
              <span id="st-4-date" class="st-date">Desember 2025<\/span>
            </header>
            <div
              id="st-4-photo"
              class="st-photo"
              data-photo="{{love_story_4_photo}}"
            >
              <img
                id="st-4-img"
                class="photo-img"
                src="{{love_story_4_photo}}"
                alt="Musim mengakar"
                loading="lazy"
              />
              <svg
                id="st-4-orn"
                class="st-orn st-orn-3"
                viewBox="0 0 120 80"
                aria-hidden="true"
              >
                <g
                  id="st_21"
                  fill="none"
                  stroke="#ffffff"
                  stroke-width="2"
                  stroke-linecap="round"
                >
                  <path id="st_22" d="M20 6v28M8 13l24 14M8 27l24-14"></path>
                  <path
                    id="st_23"
                    d="M44 30v14M37 33.5l14 7M37 40.5l14-7"
                  ></path>
                </g>
              </svg>
            </div>
            <h3 id="st-4-title" class="st-title">Musim mengakar</h3>
            <p id="st-4-text" class="st-text rich">Di musim yang paling sunyi, akar tumbuh paling dalam. Di bawah hujan Desember, Bumi bertanya, dan Asri menjawab yaâ€”sambil menahan tawa karena cincinnya kebesaran.</p>
          </article>

          <p id="st-end" class="st-end rv">
            <svg
              id="st-end-ic"
              class="st-end-ic"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use id="st_24" href="#sym-musim-4"></use>
            </svg>
            <span id="st-end-t"
              >â€¦dan musim semi berikutnya adalah hari pernikahan kami.</span
            >
          </p>
        </div>
      </div>
    </section>

    <!-- GALLERY â€” "Herbarium Kenangan": photos mounted like pressed specimens -->
    <section
      id="sec-gallery"
      class="sec gallery"
      data-section="gallery"
      data-musim="1"
    >
      <div id="gallery-wrap" class="wrap">
        <header class="sh" id="gallery-sh">
          <p class="sh-kicker rv" id="gallery-sh-k">
            <svg
              class="sh-glyph"
              id="gallery-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-1" id="gallery-sh-gu"></use></svg
            ><span class="sh-no" id="gallery-sh-no">No. 00</span
            ><span class="sh-season" id="gallery-sh-season">Musim Panas<\/span>
          </p>
          <h2 class="sh-title rv" id="gallery-sh-t" style="--d: 0.08s">
            Herbarium Kenangan
          </h2>
          <p class="sh-sub rv" id="gallery-sh-s" style="--d: 0.16s">
            Setiap foto adalah spesimen dari satu musim yang pernah kami lewati.
          </p>
        </header>
        <div id="hb-grid" class="hb-grid"></div>
        <p id="hb-foot" class="hb-foot rv">
          <svg
            id="hb-foot-ic"
            class="hb-foot-ic"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <use id="gl_1" href="#nv-gallery"></use>
          </svg>
          <span id="hb-foot-t"
            >Koleksi pribadi <span id="hb-foot-a">Nurizzati Islamiyah<\/span> &amp;
            <span id="hb-foot-b">Badriana<\/span> â€” dikeringkan dengan
            sabar, disimpan baik-baik.</span
          >
        </p>
      </div>
    </section>

    <!-- GUGUR â€” "Yang Kami Biarkan Gugur": tap a leaf to let it fall; at the
base of every fallen leaf a bud for next season is already waiting -->
    <section
      id="sec-gugur"
      class="sec gugur"
      data-section="gugur"
      data-musim="2"
    >
      <div id="gugur-sky" class="gugur-sky" aria-hidden="true"></div>
      <div id="gugur-wrap" class="wrap">
        <header class="sh" id="gugur-sh">
          <p class="sh-kicker rv" id="gugur-sh-k">
            <svg
              class="sh-glyph"
              id="gugur-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-2" id="gugur-sh-gu"></use></svg
            ><span class="sh-no" id="gugur-sh-no">No. 00</span
            ><span class="sh-season" id="gugur-sh-season">Musim Gugur<\/span>
          </p>
          <h2 class="sh-title rv" id="gugur-sh-t" style="--d: 0.08s">
            Yang Kami Biarkan Gugur
          </h2>
          <p class="sh-sub rv" id="gugur-sh-s" style="--d: 0.16s">
            Pohon yang meranggas tidak sedang kalah. Di pangkal setiap daun yang
            gugur, sudah menunggu satu kuncup untuk musim berikutnya.
          </p>
        </header>
        <div id="gg-grid" class="gg-grid">
          <div id="gg-stage-col" class="gg-stage-col">
            <div id="gg-stage" class="gg-stage rv rv-pop">
              <svg
                id="gg-tree"
                class="gg-tree"
                viewBox="0 0 400 360"
                aria-hidden="true"
              >
                <path
                  id="gg-ground"
                  d="M0 334C70 318 140 328 200 324S320 314 400 330V360H0Z"
                  fill="#c69a5c"
                ></path>
                <path
                  id="gg-ground-2"
                  d="M0 346C90 336 170 342 230 340S340 334 400 342V360H0Z"
                  fill="#b1864c"
                ></path>
                <g id="gg-sway" class="gg-sway">
                  <path
                    id="gg-trunk"
                    d="M176 346C184 312 182 280 188 248C192 226 190 206 194 190H206C210 206 208 226 212 248C218 280 216 312 224 346Z"
                    fill="#5d4130"
                  ></path>
                  <path
                    id="gg-trunk-hl"
                    d="M196 330C198 300 196 270 199 244C201 226 199 210 201 196"
                    fill="none"
                    stroke="#7a5a42"
                    stroke-width="3"
                    stroke-linecap="round"
                  ></path>
                  <g
                    id="gg-branches"
                    fill="none"
                    stroke="#5d4130"
                    stroke-linecap="round"
                  >
                    <path
                      id="gg_1"
                      d="M196 234C168 208 128 172 92 128"
                      stroke-width="9"
                    ></path>
                    <path
                      id="gg_2"
                      d="M198 198C178 162 160 122 140 84"
                      stroke-width="7"
                    ></path>
                    <path
                      id="gg_3"
                      d="M200 192C203 150 204 102 206 58"
                      stroke-width="7"
                    ></path>
                    <path
                      id="gg_4"
                      d="M202 198C226 162 248 124 266 88"
                      stroke-width="7"
                    ></path>
                    <path
                      id="gg_5"
                      d="M204 234C236 206 282 170 318 132"
                      stroke-width="9"
                    ></path>
                    <path
                      id="gg_6"
                      d="M207 216C224 202 240 188 250 168"
                      stroke-width="5"
                    ></path>
                    <path
                      id="gg_7"
                      d="M150 188C130 180 112 180 96 186"
                      stroke-width="3.4"
                    ></path>
                    <path
                      id="gg_8"
                      d="M122 158C112 142 106 128 108 112"
                      stroke-width="3"
                    ></path>
                    <path
                      id="gg_9"
                      d="M168 128C176 112 184 100 196 92"
                      stroke-width="3"
                    ></path>
                    <path
                      id="gg_10"
                      d="M204 110C220 100 232 96 246 98"
                      stroke-width="3"
                    ></path>
                    <path
                      id="gg_11"
                      d="M254 114C270 110 284 112 296 120"
                      stroke-width="3"
                    ></path>
                    <path
                      id="gg_12"
                      d="M276 166C292 170 306 178 314 190"
                      stroke-width="3.4"
                    ></path>
                    <path
                      id="gg_13"
                      d="M150 112C140 100 134 90 132 76"
                      stroke-width="2.4"
                    ></path>
                    <path
                      id="gg_14"
                      d="M290 150C304 146 316 148 330 156"
                      stroke-width="2.4"
                    ></path>
                  </g>
                  <g id="gg-foliage" class="gg-foliage">
                    <circle
                      id="gg_15"
                      cx="100"
                      cy="186"
                      r="11"
                      fill="#d58b2c"
                      opacity=".85"
                    ></circle>
                    <circle
                      id="gg_16"
                      cx="112"
                      cy="110"
                      r="10"
                      fill="#e3a93c"
                      opacity=".85"
                    ></circle>
                    <circle
                      id="gg_17"
                      cx="130"
                      cy="72"
                      r="8"
                      fill="#b1502a"
                      opacity=".8"
                    ></circle>
                    <circle
                      id="gg_18"
                      cx="196"
                      cy="90"
                      r="10"
                      fill="#e3a93c"
                      opacity=".85"
                    ></circle>
                    <circle
                      id="gg_19"
                      cx="246"
                      cy="96"
                      r="9"
                      fill="#d58b2c"
                      opacity=".8"
                    ></circle>
                    <circle
                      id="gg_20"
                      cx="298"
                      cy="120"
                      r="10"
                      fill="#b1502a"
                      opacity=".8"
                    ></circle>
                    <circle
                      id="gg_21"
                      cx="316"
                      cy="192"
                      r="11"
                      fill="#e3a93c"
                      opacity=".85"
                    ></circle>
                    <circle
                      id="gg_22"
                      cx="332"
                      cy="156"
                      r="8"
                      fill="#d58b2c"
                      opacity=".8"
                    ></circle>
                    <circle
                      id="gg_23"
                      cx="164"
                      cy="150"
                      r="9"
                      fill="#c46a2a"
                      opacity=".75"
                    ></circle>
                    <circle
                      id="gg_24"
                      cx="232"
                      cy="140"
                      r="9"
                      fill="#e3a93c"
                      opacity=".75"
                    ></circle>
                    <circle
                      id="gg_25"
                      cx="150"
                      cy="104"
                      r="6"
                      fill="#d58b2c"
                      opacity=".8"
                    ></circle>
                    <circle
                      id="gg_26"
                      cx="272"
                      cy="176"
                      r="7"
                      fill="#b1502a"
                      opacity=".75"
                    ></circle>
                  </g>
                  <g id="gg-buds" class="gg-buds">
                    <g
                      id="gg-bud-1"
                      class="gg-bud"
                      data-i="1"
                      transform="translate(92 128)"
                    >
                      <path
                        id="gg_27"
                        class="gg-bud-p"
                        d="M0 0C-5-6-5-14 0-20 5-14 5-6 0 0Z"
                      ></path>
                    </g>
                    <g
                      id="gg-bud-2"
                      class="gg-bud"
                      data-i="2"
                      transform="translate(140 84)"
                    >
                      <path
                        id="gg_28"
                        class="gg-bud-p"
                        d="M0 0C-5-6-5-14 0-20 5-14 5-6 0 0Z"
                      ></path>
                    </g>
                    <g
                      id="gg-bud-3"
                      class="gg-bud"
                      data-i="3"
                      transform="translate(206 58)"
                    >
                      <path
                        id="gg_29"
                        class="gg-bud-p"
                        d="M0 0C-5-6-5-14 0-20 5-14 5-6 0 0Z"
                      ></path>
                    </g>
                    <g
                      id="gg-bud-4"
                      class="gg-bud"
                      data-i="4"
                      transform="translate(266 88)"
                    >
                      <path
                        id="gg_30"
                        class="gg-bud-p"
                        d="M0 0C-5-6-5-14 0-20 5-14 5-6 0 0Z"
                      ></path>
                    </g>
                    <g
                      id="gg-bud-5"
                      class="gg-bud"
                      data-i="5"
                      transform="translate(318 132)"
                    >
                      <path
                        id="gg_31"
                        class="gg-bud-p"
                        d="M0 0C-5-6-5-14 0-20 5-14 5-6 0 0Z"
                      ></path>
                    </g>
                    <g
                      id="gg-bud-6"
                      class="gg-bud"
                      data-i="6"
                      transform="translate(250 168)"
                    >
                      <path
                        id="gg_32"
                        class="gg-bud-p"
                        d="M0 0C-5-6-5-14 0-20 5-14 5-6 0 0Z"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
              <div id="gg-leaves" class="gg-leaves">
                <button
                  id="gg-leaf-1"
                  class="gg-leaf"
                  type="button"
                  data-i="1"
                  style="--x: 23%; --y: 35.6%; --rot: -24deg; --c: #d58b2c"
                >
                  <svg
                    id="gg-leaf-1-svg"
                    viewBox="0 0 100 110"
                    aria-hidden="true"
                  >
                    <use id="gg_33" href="#sym-maple"></use></svg
                  ><span id="gg-leaf-1-n" class="gg-leaf-n">I<\/span>
                </button>
                <button
                  id="gg-leaf-2"
                  class="gg-leaf"
                  type="button"
                  data-i="2"
                  style="--x: 35%; --y: 23.3%; --rot: -12deg; --c: #b1502a"
                >
                  <svg
                    id="gg-leaf-2-svg"
                    viewBox="0 0 100 110"
                    aria-hidden="true"
                  >
                    <use id="gg_34" href="#sym-maple"></use></svg
                  ><span id="gg-leaf-2-n" class="gg-leaf-n">II<\/span>
                </button>
                <button
                  id="gg-leaf-3"
                  class="gg-leaf"
                  type="button"
                  data-i="3"
                  style="--x: 51.5%; --y: 16.1%; --rot: 4deg; --c: #e3a93c"
                >
                  <svg
                    id="gg-leaf-3-svg"
                    viewBox="0 0 100 110"
                    aria-hidden="true"
                  >
                    <use id="gg_35" href="#sym-maple"></use></svg
                  ><span id="gg-leaf-3-n" class="gg-leaf-n">III<\/span>
                </button>
                <button
                  id="gg-leaf-4"
                  class="gg-leaf"
                  type="button"
                  data-i="4"
                  style="--x: 66.5%; --y: 24.4%; --rot: 14deg; --c: #c46a2a"
                >
                  <svg
                    id="gg-leaf-4-svg"
                    viewBox="0 0 100 110"
                    aria-hidden="true"
                  >
                    <use id="gg_36" href="#sym-maple"></use></svg
                  ><span id="gg-leaf-4-n" class="gg-leaf-n">IV<\/span>
                </button>
                <button
                  id="gg-leaf-5"
                  class="gg-leaf"
                  type="button"
                  data-i="5"
                  style="--x: 79.5%; --y: 36.7%; --rot: 26deg; --c: #9a3b22"
                >
                  <svg
                    id="gg-leaf-5-svg"
                    viewBox="0 0 100 110"
                    aria-hidden="true"
                  >
                    <use id="gg_37" href="#sym-maple"></use></svg
                  ><span id="gg-leaf-5-n" class="gg-leaf-n">V<\/span>
                </button>
                <button
                  id="gg-leaf-6"
                  class="gg-leaf"
                  type="button"
                  data-i="6"
                  style="--x: 62.5%; --y: 46.7%; --rot: 10deg; --c: #e09b36"
                >
                  <svg
                    id="gg-leaf-6-svg"
                    viewBox="0 0 100 110"
                    aria-hidden="true"
                  >
                    <use id="gg_38" href="#sym-maple"></use></svg
                  ><span id="gg-leaf-6-n" class="gg-leaf-n">VI<\/span>
                </button>
              </div>
              <div id="gg-pile" class="gg-pile" aria-hidden="true"></div>
              <p id="gg-live" class="gg-live" aria-live="polite"></p>
            </div>
            <div id="gg-actions" class="gg-actions rv">
              <button id="gg-shake" class="btn btn-sm" type="button">
                <svg
                  id="gg-shake-ic"
                  class="ic"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <use id="gg_39" href="#ic-shake"></use>
                </svg>
                <span id="gg-shake-t">Goyangkan pohonnya<\/span>
              </button>
              <button
                id="gg-reset"
                class="btn btn-ghost btn-sm"
                type="button"
                hidden
              >
                <svg
                  id="gg-reset-ic"
                  class="ic"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <use id="gg_40" href="#ic-replay"></use>
                </svg>
                <span id="gg-reset-t">Musim berganti lagi<\/span>
              </button>
              <p id="gg-count" class="gg-count">
                <span id="gg-count-n">0<\/span> dari
                <span id="gg-count-of">6<\/span> daun sudah gugur
              </p>
            </div>
          </div>

          <ol id="gg-list" class="gg-list">
            <li id="gg-row-1" class="gg-row rv" data-i="1">
              <span id="gg-row-1-n" class="gg-row-n">I<\/span>
              <div id="gg-row-1-b" class="gg-row-b">
                <p id="gg-row-1-k1" class="gg-row-k">Yang kami lepaskan</p>
                <p id="gg-row-1-a" class="gg-lepas">
                  <span id="gg-row-1-at" class="gg-lepas-t"
                    >Gengsi untuk minta maaf duluan</span
                  >
                </p>
                <p id="gg-row-1-k2" class="gg-row-k gg-row-k2">
                  Yang tumbuh sebagai gantinya
                </p>
                <p id="gg-row-1-c" class="gg-tumbuh">Kebiasaan bilang â€œmaaf, aku salahâ€</p>
              </div>
            </li>
            <li id="gg-row-2" class="gg-row rv" data-i="2" style="--d: 0.06s">
              <span id="gg-row-2-n" class="gg-row-n">II<\/span>
              <div id="gg-row-2-b" class="gg-row-b">
                <p id="gg-row-2-k1" class="gg-row-k">Yang kami lepaskan</p>
                <p id="gg-row-2-a" class="gg-lepas">
                  <span id="gg-row-2-at" class="gg-lepas-t"
                    >Rencana hidup versi sendirian</span
                  >
                </p>
                <p id="gg-row-2-k2" class="gg-row-k gg-row-k2">
                  Yang tumbuh sebagai gantinya
                </p>
                <p id="gg-row-2-c" class="gg-tumbuh">Rencana yang ditulis berdua, pakai pensil</p>
              </div>
            </li>
            <li id="gg-row-3" class="gg-row rv" data-i="3" style="--d: 0.12s">
              <span id="gg-row-3-n" class="gg-row-n">III<\/span>
              <div id="gg-row-3-b" class="gg-row-b">
                <p id="gg-row-3-k1" class="gg-row-k">Yang kami lepaskan</p>
                <p id="gg-row-3-a" class="gg-lepas">
                  <span id="gg-row-3-at" class="gg-lepas-t"
                    >Keinginan untuk selalu menang</span
                  >
                </p>
                <p id="gg-row-3-k2" class="gg-row-k gg-row-k2">
                  Yang tumbuh sebagai gantinya
                </p>
                <p id="gg-row-3-c" class="gg-tumbuh">Senang mengalah, sesekali</p>
              </div>
            </li>
            <li id="gg-row-4" class="gg-row rv" data-i="4" style="--d: 0.18s">
              <span id="gg-row-4-n" class="gg-row-n">IV<\/span>
              <div id="gg-row-4-b" class="gg-row-b">
                <p id="gg-row-4-k1" class="gg-row-k">Yang kami lepaskan</p>
                <p id="gg-row-4-a" class="gg-lepas">
                  <span id="gg-row-4-at" class="gg-lepas-t"
                    >Takut terlihat rapuh</span
                  >
                </p>
                <p id="gg-row-4-k2" class="gg-row-k gg-row-k2">
                  Yang tumbuh sebagai gantinya
                </p>
                <p id="gg-row-4-c" class="gg-tumbuh">Berani bercerita apa adanya</p>
              </div>
            </li>
            <li id="gg-row-5" class="gg-row rv" data-i="5" style="--d: 0.24s">
              <span id="gg-row-5-n" class="gg-row-n">V<\/span>
              <div id="gg-row-5-b" class="gg-row-b">
                <p id="gg-row-5-k1" class="gg-row-k">Yang kami lepaskan</p>
                <p id="gg-row-5-a" class="gg-lepas">
                  <span id="gg-row-5-at" class="gg-lepas-t"
                    >Jam tidur yang berantakan</span
                  >
                </p>
                <p id="gg-row-5-k2" class="gg-row-k gg-row-k2">
                  Yang tumbuh sebagai gantinya
                </p>
                <p id="gg-row-5-c" class="gg-tumbuh">Sarapan bersama setiap pagi</p>
              </div>
            </li>
            <li id="gg-row-6" class="gg-row rv" data-i="6" style="--d: 0.3s">
              <span id="gg-row-6-n" class="gg-row-n">VI<\/span>
              <div id="gg-row-6-b" class="gg-row-b">
                <p id="gg-row-6-k1" class="gg-row-k">Yang kami lepaskan</p>
                <p id="gg-row-6-a" class="gg-lepas">
                  <span id="gg-row-6-at" class="gg-lepas-t"
                    >Kata â€œakuâ€ yang terlalu sering</span
                  >
                </p>
                <p id="gg-row-6-k2" class="gg-row-k gg-row-k2">
                  Yang tumbuh sebagai gantinya
                </p>
                <p id="gg-row-6-c" class="gg-tumbuh">Kata â€œkitaâ€</p>
              </div>
            </li>
          </ol>
        </div>
        <p id="gg-outro" class="gg-outro">
          Semua daun sudah gugur, dan setiap kuncupnya sudah menunggu. Musim
          berikutnya, kami tumbuh dengan yang baru.
        </p>
      </div>
    </section>
    <!-- LINGKARAN TAHUN â€” a slice of the trunk: one ring for every year since
the couple met. The outermost ring is the one they wear on their finger. -->
    <section
      id="sec-lingkaran"
      class="sec lingkaran is-dark"
      data-section="lingkaran"
      data-musim="2"
    >
      <div id="lk-floor" class="lk-floor" aria-hidden="true">
        <svg
          id="lk-moss"
          class="lk-moss"
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid slice"
        >
          <g id="lk-moss-leaves" class="lk-moss-leaves">
            <g id="lk_1" transform="translate(40 40) rotate(-30)">
              <use
                id="lk_2"
                href="#sym-maple"
                width="46"
                height="50"
                fill="#8a3f1c"
                opacity=".55"
              ></use>
            </g>
            <g id="lk_3" transform="translate(340 60) rotate(40)">
              <use
                id="lk_4"
                href="#sym-maple"
                width="38"
                height="42"
                fill="#a35a24"
                opacity=".5"
              ></use>
            </g>
            <g id="lk_5" transform="translate(360 240) rotate(-70)">
              <use
                id="lk_6"
                href="#sym-leaf"
                width="26"
                height="42"
                fill="#6f5a2a"
                opacity=".5"
              ></use>
            </g>
            <g id="lk_7" transform="translate(24 250) rotate(20)">
              <use
                id="lk_8"
                href="#sym-leaf"
                width="22"
                height="36"
                fill="#8a6a2a"
                opacity=".45"
              ></use>
            </g>
            <g id="lk_9" transform="translate(200 16) rotate(80)">
              <use
                id="lk_10"
                href="#sym-leaf"
                width="20"
                height="32"
                fill="#7a4a22"
                opacity=".4"
              ></use>
            </g>
          </g>
        </svg>
      </div>
      <div id="lk-wrap" class="wrap">
        <header class="sh" id="lk-sh">
          <p class="sh-kicker rv" id="lk-sh-k">
            <svg
              class="sh-glyph"
              id="lk-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-2" id="lk-sh-gu"></use></svg
            ><span class="sh-no" id="lk-sh-no">No. 00</span
            ><span class="sh-season" id="lk-sh-season">Musim Gugur<\/span>
          </p>
          <h2 class="sh-title rv" id="lk-sh-t" style="--d: 0.08s">
            Lingkaran Tahun
          </h2>
          <p class="sh-sub rv" id="lk-sh-s" style="--d: 0.16s">
            Setiap pohon menyimpan umurnya di dalam batang: satu lingkaran untuk
            setiap tahun. Lebar saat subur, sempit saat kering â€” dan keduanya
            sama-sama membuatnya kuat.
          </p>
        </header>
        <div id="lk-grid" class="lk-grid">
          <div id="lk-stage" class="lk-stage rv rv-pop">
            <canvas
              id="lk-slice"
              class="lk-slice"
              width="8"
              height="8"
              aria-hidden="true"
            ></canvas>
            <canvas
              id="lk-hl"
              class="lk-hl"
              width="8"
              height="8"
              aria-hidden="true"
            ></canvas>
            <p id="lk-tip" class="lk-tip" aria-hidden="true">
              Sentuh lingkarannya
            </p>
          </div>
          <div id="lk-side" class="lk-side">
            <div id="lk-card" class="lk-card rv" aria-live="polite">
              <p id="lk-card-k" class="lk-card-k">
                Lingkaran ke-<span id="lk-card-no">1<\/span>
                <span id="lk-card-of" class="lk-card-of">dari 9<\/span>
              </p>
              <p id="lk-card-year" class="lk-card-year">2019</p>
              <p id="lk-card-text" class="lk-card-text">Lingkaran pertama.</p>
              <p id="lk-card-width" class="lk-card-width">
                <span id="lk-card-width-bar" class="lk-card-width-bar"
                  ><span
                    id="lk-card-width-fill"
                    class="lk-card-width-fill"
                  ><\/span></span
                ><span id="lk-card-width-t">lebar lingkaran<\/span>
              </p>
            </div>
            <div
              id="lk-years"
              class="lk-years rv"
              role="group"
              aria-label="Pilih tahun"
            ></div>
            <p id="lk-ring-note" class="lk-ring-note rv">
              <svg
                id="lk-ring-note-ic"
                class="lk-ring-note-ic"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  id="lk_11"
                  cx="12"
                  cy="12"
                  r="7.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.2"
                ></circle>
                <path
                  id="lk_12"
                  d="M9.6 5.2 12 2.6l2.4 2.6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                ></path>
              </svg>
              <span id="lk-ring-note-t"
                >Lingkaran terluar selalu yang paling baru. Yang ini tidak kami
                simpan di batang â€” kami memakainya di jari manis.</span
              >
            </p>
          </div>
        </div>
        <div id="lk-notes" class="src" aria-hidden="true">
          <span id="lk-note-1" data-year="2019"
            >Lingkaran pertama. Tipis, karena kami masih saling mengira-ngira.</span
          >
          <span id="lk-note-2" data-year="2020"
            >Tahun yang sempit untuk semua orang. Lingkaran kami ikut tipis, tapi tidak putus.</span
          >
          <span id="lk-note-3" data-year="2022"
            >Lingkaran paling lebar: tahun penuh hujan, tawa, dan perjalanan ke pasar kembang.</span
          >
          <span id="lk-note-4" data-year="2023"
            >Ada garis gelap di siniâ€”tahun jarak jauh. Kayu yang tumbuh di tahun sulit justru paling padat.</span
          >
          <span id="lk-note-5" data-year="2025"
            >Tahun lamaran. Cincin pertama yang bukan dari kayu.</span
          >
          <span id="lk-met" data-date="2019-04-13"><\/span>
          <span id="lk-wed" data-date="2026-10-30"><\/span>
        </div>
      </div>
    </section>

    <!-- COUNTDOWN â€” "Menunggu Musim Semi": a magnolia bud on a snowy branch,
opening a little more every day; hold it to warm it early -->
    <section
      id="sec-countdown"
      class="sec countdown"
      data-section="countdown"
      data-musim="3"
    >
      <div id="cd-snow" class="cd-snow" aria-hidden="true">
        <i
          id="cd_1"
          class="cd-flake"
          style="--x: 6%; --s: 5px; --t: 11s; --dl: -2s"
        ></i
        ><i
          id="cd_2"
          class="cd-flake"
          style="--x: 14%; --s: 3px; --t: 9s; --dl: -6s"
        ></i>
        <i
          id="cd_3"
          class="cd-flake"
          style="--x: 22%; --s: 6px; --t: 13s; --dl: -1s"
        ></i
        ><i
          id="cd_4"
          class="cd-flake"
          style="--x: 31%; --s: 4px; --t: 10s; --dl: -8s"
        ></i>
        <i
          id="cd_5"
          class="cd-flake"
          style="--x: 39%; --s: 3px; --t: 8s; --dl: -3s"
        ></i
        ><i
          id="cd_6"
          class="cd-flake"
          style="--x: 47%; --s: 5px; --t: 12s; --dl: -9s"
        ></i>
        <i
          id="cd_7"
          class="cd-flake"
          style="--x: 55%; --s: 4px; --t: 9.5s; --dl: -4s"
        ></i
        ><i
          id="cd_8"
          class="cd-flake"
          style="--x: 63%; --s: 6px; --t: 14s; --dl: -7s"
        ></i>
        <i
          id="cd_9"
          class="cd-flake"
          style="--x: 71%; --s: 3px; --t: 8.5s; --dl: -1.5s"
        ></i
        ><i
          id="cd_10"
          class="cd-flake"
          style="--x: 79%; --s: 5px; --t: 11.5s; --dl: -5s"
        ></i>
        <i
          id="cd_11"
          class="cd-flake"
          style="--x: 87%; --s: 4px; --t: 10.5s; --dl: -10s"
        ></i
        ><i
          id="cd_12"
          class="cd-flake"
          style="--x: 95%; --s: 6px; --t: 13.5s; --dl: -2.5s"
        ></i>
        <i
          id="cd_13"
          class="cd-flake"
          style="--x: 10%; --s: 3px; --t: 12.5s; --dl: -11s"
        ></i
        ><i
          id="cd_14"
          class="cd-flake"
          style="--x: 35%; --s: 5px; --t: 9.2s; --dl: -0.5s"
        ></i>
        <i
          id="cd_15"
          class="cd-flake"
          style="--x: 59%; --s: 3px; --t: 10.8s; --dl: -6.5s"
        ></i
        ><i
          id="cd_16"
          class="cd-flake"
          style="--x: 83%; --s: 4px; --t: 12.2s; --dl: -3.5s"
        ></i>
      </div>
      <svg
        id="cd-drift"
        class="cd-drift"
        viewBox="0 0 400 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          id="cd_17"
          d="M0 34C40 22 80 30 120 26S200 14 250 24 330 36 400 22V60H0Z"
          fill="#fbfdfd"
        ></path>
        <path
          id="cd_18"
          d="M0 44C60 36 110 42 170 38S290 30 400 40V60H0Z"
          fill="#eef4f6"
        ></path>
      </svg>
      <div id="cd-wrap" class="wrap">
        <header class="sh" id="cd-sh">
          <p class="sh-kicker rv" id="cd-sh-k">
            <svg
              class="sh-glyph"
              id="cd-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-3" id="cd-sh-gu"></use></svg
            ><span class="sh-no" id="cd-sh-no">No. 00</span
            ><span class="sh-season" id="cd-sh-season">Musim Dingin<\/span>
          </p>
          <h2 class="sh-title rv" id="cd-sh-t" style="--d: 0.08s">
            Menunggu Musim Semi
          </h2>
          <p class="sh-sub rv" id="cd-sh-s" style="--d: 0.16s">
            Kuncup magnolia sudah terbentuk sejak musim gugur. Sepanjang musim
            dingin ia hanya menunggu â€” dan setiap hari, sedikit lebih siap.
          </p>
        </header>
        <div id="cd-grid" class="cd-grid">
          <div id="cd-stage" class="cd-stage rv rv-pop" style="--open: 0.1">
            <svg
              id="cd-art"
              class="cd-art"
              viewBox="0 0 400 360"
              aria-hidden="true"
            >
              <g id="cd-hills" opacity=".9">
                <path
                  id="cd_19"
                  d="M0 300C60 280 120 290 180 282S300 262 400 276V360H0Z"
                  fill="#e6eef2"
                ></path>
                <path
                  id="cd_20"
                  d="M0 322C80 306 170 316 240 310S340 300 400 306V360H0Z"
                  fill="#f3f7f8"
                ></path>
              </g>
              <g id="cd-branch" class="cd-branch">
                <path
                  id="cd_21"
                  d="M-12 206C60 190 128 196 196 182S310 150 392 160"
                  fill="none"
                  stroke="#5b4636"
                  stroke-width="10"
                  stroke-linecap="round"
                ></path>
                <path
                  id="cd_22"
                  d="M196 182C250 170 310 150 392 160"
                  fill="none"
                  stroke="#6d5442"
                  stroke-width="6"
                  stroke-linecap="round"
                ></path>
                <path
                  id="cd_23"
                  d="M280 164C290 150 296 142 300 134"
                  fill="none"
                  stroke="#5b4636"
                  stroke-width="5"
                  stroke-linecap="round"
                ></path>
                <path
                  id="cd_24"
                  d="M118 198C114 186 116 176 124 168"
                  fill="none"
                  stroke="#5b4636"
                  stroke-width="3.4"
                  stroke-linecap="round"
                ></path>
                <path
                  id="cd_25"
                  d="M206 182C214 170 222 164 232 160"
                  fill="none"
                  stroke="#5b4636"
                  stroke-width="3.4"
                  stroke-linecap="round"
                ></path>
                <path
                  id="cd_26"
                  d="M340 158C348 146 350 136 348 126"
                  fill="none"
                  stroke="#5b4636"
                  stroke-width="3"
                  stroke-linecap="round"
                ></path>
                <path
                  id="cd_27"
                  class="cd-snowcap"
                  d="M-10 200C60 184 128 190 196 176S310 144 390 154"
                  fill="none"
                  stroke="#ffffff"
                  stroke-width="4.4"
                  stroke-linecap="round"
                  stroke-dasharray="46 10 30 14 60 8 34 12"
                ></path>
                <g id="cd_28" fill="#8a7a66">
                  <path
                    id="cd_29"
                    d="M124 168c-3-4-3-10 0-14 3 4 3 10 0 14z"
                  ></path>
                  <path
                    id="cd_30"
                    d="M232 160c-3-4-3-10 0-14 3 4 3 10 0 14z"
                  ></path>
                  <path
                    id="cd_31"
                    d="M348 126c-3-4-3-10 0-14 3 4 3 10 0 14z"
                  ></path>
                </g>
              </g>
              <g id="cd-bud" class="cd-bud" transform="translate(300 134)">
                <g id="cd-glow" class="cd-glow">
                  <circle
                    id="cd_32"
                    r="46"
                    cy="-40"
                    fill="url(#cd-glow-grad)"
                  ></circle>
                </g>
                <path
                  id="cd_33"
                  class="cd-petal cd-petal-back"
                  style="--a: -44deg"
                  d="M0 0C-15-20-15-60 0-80 15-60 15-20 0 0Z"
                ></path>
                <path
                  id="cd_34"
                  class="cd-petal cd-petal-back"
                  style="--a: 44deg"
                  d="M0 0C-15-20-15-60 0-80 15-60 15-20 0 0Z"
                ></path>
                <path
                  id="cd_35"
                  class="cd-petal cd-petal-back"
                  style="--a: 4deg"
                  d="M0 0C-15-20-15-62 0-84 15-62 15-20 0 0Z"
                ></path>
                <path
                  id="cd_36"
                  class="cd-petal cd-petal-front"
                  style="--a: -24deg"
                  d="M0 0C-14-18-15-56 0-74 15-56 14-18 0 0Z"
                ></path>
                <path
                  id="cd_37"
                  class="cd-petal cd-petal-front"
                  style="--a: 24deg"
                  d="M0 0C-14-18-15-56 0-74 15-56 14-18 0 0Z"
                ></path>
                <path
                  id="cd_38"
                  class="cd-petal cd-petal-front"
                  style="--a: -2deg"
                  d="M0 0C-12-16-12-50 0-68 12-50 12-16 0 0Z"
                ></path>
                <g id="cd_39" class="cd-stamens">
                  <path id="cd_40" d="M-4-6 0-26 4-6Z" fill="#e8b746"></path>
                  <circle id="cd_41" cy="-28" r="3" fill="#d58b2c"></circle>
                </g>
                <path
                  id="cd_42"
                  class="cd-scale cd-scale-l"
                  d="M0 2C-14-8-17-40-4-70-2-44-2-20 0 2Z"
                ></path>
                <path
                  id="cd_43"
                  class="cd-scale cd-scale-r"
                  d="M0 2C14-8 17-40 4-70 2-44 2-20 0 2Z"
                ></path>
                <g id="cd_44" class="cd-frost" fill="#ffffff">
                  <circle id="cd_45" cx="-6" cy="-40" r="1.6"></circle>
                  <circle id="cd_46" cx="5" cy="-54" r="1.3"></circle>
                  <circle id="cd_47" cx="-3" cy="-22" r="1.2"></circle>
                  <circle id="cd_48" cx="7" cy="-30" r="1.5"></circle>
                </g>
              </g>
              <defs id="cd_49">
                <radialGradient id="cd-glow-grad">
                  <stop
                    id="cd_50"
                    offset="0"
                    stop-color="#fff4d6"
                    stop-opacity=".95"
                  ></stop>
                  <stop
                    id="cd_51"
                    offset="1"
                    stop-color="#fff4d6"
                    stop-opacity="0"
                  ></stop>
                </radialGradient>
              </defs>
            </svg>
            <button
              id="cd-bud-hit"
              class="cd-bud-hit"
              type="button"
              aria-label="Tahan untuk menghangatkan kuncup"
            ></button>

            <div id="cd-tags" class="cd-tags">
              <div
                id="cd-tag-d"
                class="cd-tag"
                style="--x: 11%; --y: 55%; --len: 44px; --sw: 3.6s; --sd: -0.4s"
              >
                <span id="cd-tag-d-str" class="cd-str"><\/span>
                <span id="cd-tag-d-card" class="cd-card"
                  ><span id="cd-days" class="cd-num">000</span
                  ><span id="cd-days-u" class="cd-unit">hari<\/span></span
                >
              </div>
              <div
                id="cd-tag-h"
                class="cd-tag"
                style="
                  --x: 31%;
                  --y: 53.6%;
                  --len: 70px;
                  --sw: 4.2s;
                  --sd: -1.8s;
                "
              >
                <span id="cd-tag-h-str" class="cd-str"><\/span>
                <span id="cd-tag-h-card" class="cd-card"
                  ><span id="cd-hours" class="cd-num">00</span
                  ><span id="cd-hours-u" class="cd-unit">jam<\/span></span
                >
              </div>
              <div
                id="cd-tag-m"
                class="cd-tag"
                style="
                  --x: 51%;
                  --y: 50.2%;
                  --len: 50px;
                  --sw: 3.9s;
                  --sd: -2.6s;
                "
              >
                <span id="cd-tag-m-str" class="cd-str"><\/span>
                <span id="cd-tag-m-card" class="cd-card"
                  ><span id="cd-mins" class="cd-num">00</span
                  ><span id="cd-mins-u" class="cd-unit">menit<\/span></span
                >
              </div>
              <div
                id="cd-tag-s"
                class="cd-tag cd-tag-s"
                style="--x: 88%; --y: 43.6%; --len: 34px; --sw: 3.2s; --sd: -1s"
              >
                <span id="cd-tag-s-str" class="cd-str"><\/span>
                <span id="cd-tag-s-card" class="cd-card"
                  ><span id="cd-secs" class="cd-num">00</span
                  ><span id="cd-secs-u" class="cd-unit">detik<\/span></span
                >
              </div>
            </div>
          </div>

          <div id="cd-side" class="cd-side">
            <p id="cd-status" class="cd-status rv" aria-live="polite">
              Belum waktunya mekar.
            </p>
            <p id="cd-when" class="cd-when rv">
              <span
                id="cd-when-date"
                class="js-date"
                data-date="2026-10-30"
                data-format="long"
                >2026-10-30</span
              >
              <span id="cd-when-sep" class="cd-when-sep" aria-hidden="true"
                >Â·</span
              >
              <span
                id="cd-when-time"
                class="js-time"
                data-time="08:00"
                >08:00</span
              >
              <span id="cd-when-tz" class="tz">WIB<\/span>
            </p>
            <p id="cd-hold" class="cd-hold rv">
              Tekan dan tahan kuncupnya untuk menghangatkannya sebentar.
            </p>
            <div id="cd-cal" class="cd-cal btn-row rv">
              <a
                id="cal-google"
                class="btn btn-sm"
                href="https://calendar.google.com/"
                target="_blank"
                rel="noopener"
              >
                <svg
                  id="cal-google-ic"
                  class="ic"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <use id="cd_52" href="#ic-cal"></use>
                </svg>
                <span id="cal-google-t">Simpan di Google Kalender<\/span>
              </a>
              <button id="cal-ics" class="btn btn-ghost btn-sm" type="button">
                <svg
                  id="cal-ics-ic"
                  class="ic"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <use id="cd_53" href="#ic-download"></use>
                </svg>
                <span id="cal-ics-t">Unduh .ics<\/span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- EVENTS â€” "Hari Menanam": two botanical plates, each drawn line by line -->
    <section
      id="sec-events"
      class="sec events"
      data-section="events"
      data-musim="4"
    >
      <div id="events-wrap" class="wrap">
        <header class="sh" id="ev-sh">
          <p class="sh-kicker rv" id="ev-sh-k">
            <svg
              class="sh-glyph"
              id="ev-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-4" id="ev-sh-gu"></use></svg
            ><span class="sh-no" id="ev-sh-no">No. 00</span
            ><span class="sh-season" id="ev-sh-season">Musim Mekar<\/span>
          </p>
          <h2 class="sh-title rv" id="ev-sh-t" style="--d: 0.08s">
            Hari Menanam
          </h2>
          <p class="sh-sub rv" id="ev-sh-s" style="--d: 0.16s">
            Di beberapa tempat, pengantin menanam sebatang pohon di hari
            pernikahannya. Kami ingin Anda ada di sana ketika kami menanam milik
            kami.
          </p>
        </header>
        <div id="ev-grid" class="ev-grid">
          <article id="ev-1" class="ev-card paper rv">
            <div id="ev-1-fig" class="ev-fig">
              <svg
                id="ev-1-illus"
                class="ev-illus"
                viewBox="0 0 240 150"
                aria-hidden="true"
              >
                <path id="ev_1" class="ev-line" d="M20 132H220"></path>
                <path
                  id="ev_2"
                  class="ev-line"
                  d="M84 132 92 96H148L156 132"
                ></path>
                <path
                  id="ev_3"
                  class="ev-line"
                  d="M88 96H152M90 104H150"
                ></path>
                <path
                  id="ev_4"
                  class="ev-line ev-line-g"
                  d="M114 96C112 80 108 70 100 60S88 40 94 26"
                ></path>
                <path
                  id="ev_5"
                  class="ev-line ev-line-g"
                  d="M126 96C128 80 132 70 140 60S152 40 146 26"
                ></path>
                <path
                  id="ev_6"
                  class="ev-line ev-line-g"
                  d="M100 60C90 58 82 52 78 44 88 44 96 50 100 60Z"
                ></path>
                <path
                  id="ev_7"
                  class="ev-line ev-line-g"
                  d="M140 60C150 58 158 52 162 44 152 44 144 50 140 60Z"
                ></path>
                <path
                  id="ev_8"
                  class="ev-line ev-line-g"
                  d="M94 26C88 20 86 12 88 6 94 10 96 18 94 26Z"
                ></path>
                <path
                  id="ev_9"
                  class="ev-line ev-line-g"
                  d="M146 26C152 20 154 12 152 6 146 10 144 18 146 26Z"
                ></path>
                <ellipse
                  id="ev_10"
                  class="ev-line ev-line-gold"
                  cx="120"
                  cy="74"
                  rx="16"
                  ry="6"
                ></ellipse>
                <path
                  id="ev_11"
                  class="ev-line ev-line-soft"
                  d="M40 132C44 124 50 122 56 124M190 132C194 126 200 124 206 126"
                ></path>
              </svg>
              <p id="ev-1-figno" class="ev-figno">
                Gbr. 1 â€” dua tunas melewati satu cincin
              </p>
            </div>
            <h3 id="ev-1-name" class="ev-name">Akad Nikah</h3>
            <dl id="ev-1-dl" class="ev-dl">
              <div id="ev-1-row-d" class="ev-row">
                <dt id="ev-1-dt-d">Tanggal</dt>
                <dd id="ev-1-dd-d">
                  <span
                    id="ev-1-date"
                    class="js-date"
                    data-date="2026-10-30"
                    data-format="long"
                    >2026-10-30</span
                  >
                </dd>
              </div>
              <div id="ev-1-row-t" class="ev-row">
                <dt id="ev-1-dt-t">Pukul</dt>
                <dd id="ev-1-dd-t">
                  <span
                    id="ev-1-time"
                    class="js-range"
                    data-start="08:00"
                    data-end="09:30"
                    >08:00</span
                  >
                  <span id="ev-1-tz" class="tz">WIB<\/span>
                </dd>
              </div>
              <div id="ev-1-row-p" class="ev-row">
                <dt id="ev-1-dt-p">Tempat</dt>
                <dd id="ev-1-dd-p">
                  <strong id="ev-1-venue" class="ev-venue"
                    >wwwtc mall</strong
                  ><span id="ev-1-addr" class="ev-addr">280 Gloucester Rd, Causeway Bay, Hong Kong Island, Hong Kong<\/span>
                </dd>
              </div>
            </dl>
            <p id="ev-1-note" class="ev-note">Dihadiri keluarga inti dan kerabat dekat.</p>
            <a
              id="ev-1-map"
              class="btn btn-sm ev-map"
              href="https://www.google.com/maps/dir/?api=1&amp;destination_place_id=ChIJVX_KZ1YABDQR8TZ6STtir8M"
              target="_blank"
              rel="noopener"
            >
              <svg
                id="ev-1-map-ic"
                class="ic"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <use id="ev_12" href="#ic-pin"></use>
              </svg>
              <span id="ev-1-map-t">Petunjuk arah<\/span>
            </a>
          </article>

          <article id="ev-2" class="ev-card paper rv" style="--d: 0.12s">
            <div id="ev-2-fig" class="ev-fig">
              <svg
                id="ev-2-illus"
                class="ev-illus"
                viewBox="0 0 240 150"
                aria-hidden="true"
              >
                <path id="ev_13" class="ev-line" d="M10 132H230"></path>
                <path
                  id="ev_14"
                  class="ev-line"
                  d="M118 132C120 110 116 96 120 80"
                ></path>
                <path
                  id="ev_15"
                  class="ev-line"
                  d="M120 96 104 84M120 88 136 76"
                ></path>
                <path
                  id="ev_16"
                  class="ev-line ev-line-g"
                  d="M74 70C60 64 60 44 76 40 76 24 96 16 108 26 116 12 140 12 146 28 160 20 180 30 176 46 190 50 188 70 172 74 164 84 140 84 132 78 122 86 98 86 92 78 84 82 74 78 74 70Z"
                ></path>
                <path
                  id="ev_17"
                  class="ev-line ev-line-soft"
                  d="M52 92C80 84 100 90 120 88S170 82 196 92"
                ></path>
                <circle
                  id="ev_18"
                  class="ev-dot"
                  cx="64"
                  cy="90"
                  r="2.4"
                ></circle>
                <circle
                  id="ev_19"
                  class="ev-dot"
                  cx="92"
                  cy="89"
                  r="2.4"
                ></circle>
                <circle
                  id="ev_20"
                  class="ev-dot"
                  cx="148"
                  cy="86"
                  r="2.4"
                ></circle>
                <circle
                  id="ev_21"
                  class="ev-dot"
                  cx="178"
                  cy="89"
                  r="2.4"
                ></circle>
                <path
                  id="ev_22"
                  class="ev-line"
                  d="M60 118H180M72 118V132M168 118V132"
                ></path>
                <path
                  id="ev_23"
                  class="ev-line ev-line-soft"
                  d="M84 118V112H92V118M112 118V110H120V118M140 118V112H148V118"
                ></path>
                <circle
                  id="ev_24"
                  class="ev-blossom"
                  cx="92"
                  cy="44"
                  r="4"
                ></circle>
                <circle
                  id="ev_25"
                  class="ev-blossom"
                  cx="140"
                  cy="36"
                  r="4"
                ></circle>
                <circle
                  id="ev_26"
                  class="ev-blossom"
                  cx="160"
                  cy="58"
                  r="3.4"
                ></circle>
                <circle
                  id="ev_27"
                  class="ev-blossom"
                  cx="108"
                  cy="66"
                  r="3.4"
                ></circle>
              </svg>
              <p id="ev-2-figno" class="ev-figno">
                Gbr. 2 â€” pohon yang sama, meja yang panjang
              </p>
            </div>
            <h3 id="ev-2-name" class="ev-name">Resepsi</h3>
            <dl id="ev-2-dl" class="ev-dl">
              <div id="ev-2-row-d" class="ev-row">
                <dt id="ev-2-dt-d">Tanggal</dt>
                <dd id="ev-2-dd-d">
                  <span
                    id="ev-2-date"
                    class="js-date"
                    data-date="2027-03-20"
                    data-format="long"
                    >2027-03-20</span
                  >
                </dd>
              </div>
              <div id="ev-2-row-t" class="ev-row">
                <dt id="ev-2-dt-t">Pukul</dt>
                <dd id="ev-2-dd-t">
                  <span
                    id="ev-2-time"
                    class="js-range"
                    data-start="11:00"
                    data-end="14:00"
                    >11:00</span
                  >
                  <span id="ev-2-tz" class="tz">WIB<\/span>
                </dd>
              </div>
              <div id="ev-2-row-p" class="ev-row">
                <dt id="ev-2-dt-p">Tempat</dt>
                <dd id="ev-2-dd-p">
                  <strong id="ev-2-venue" class="ev-venue"
                    >Kebun Belakang Taman Kenanga</strong
                  ><span id="ev-2-addr" class="ev-addr"
                    >Jl. Kaliurang Km 12,5, Sleman, Daerah Istimewa Yogyakarta</span
                  >
                </dd>
              </div>
            </dl>
            <p id="ev-2-note" class="ev-note">Jamuan di bawah pohon, sambil menanam bibit bersama.</p>
            <a
              id="ev-2-map"
              class="btn btn-sm ev-map"
              href="https://www.google.com/maps/search/?api=1"
              target="_blank"
              rel="noopener"
            >
              <svg
                id="ev-2-map-ic"
                class="ic"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <use id="ev_28" href="#ic-pin"></use>
              </svg>
              <span id="ev-2-map-t">Petunjuk arah<\/span>
            </a>
          </article>
        </div>
      </div>
    </section>

    <!-- RUNDOWN â€” "Urutan Tumbuh": a climbing vine grows down the schedule -->
    <section
      id="sec-rundown"
      class="sec rundown"
      data-section="rundown"
      data-musim="4"
    >
      <div id="rundown-wrap" class="wrap">
        <header class="sh" id="rd-sh">
          <p class="sh-kicker rv" id="rd-sh-k">
            <svg
              class="sh-glyph"
              id="rd-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-4" id="rd-sh-gu"></use></svg
            ><span class="sh-no" id="rd-sh-no">No. 00</span
            ><span class="sh-season" id="rd-sh-season">Musim Mekar<\/span>
          </p>
          <h2 class="sh-title rv" id="rd-sh-t" style="--d: 0.08s">
            Urutan Tumbuh
          </h2>
          <p class="sh-sub rv" id="rd-sh-s" style="--d: 0.16s">
            Susunan acara hari itu â€” dari tunas pertama sampai kelopak terakhir.
          </p>
        </header>
        <div id="rd-body" class="rd-body">
          <svg id="rd-vine" class="rd-vine" aria-hidden="true">
            <path id="rd-vine-track" class="rd-vine-track" d="M0 0"></path>
            <path id="rd-vine-grow" class="rd-vine-grow" d="M0 0"></path>
          </svg>
          <div id="rd-list" class="rd-list"></div>
        </div>
      </div>
    </section>

    <!-- VENUE â€” "Petak Tanam": a hand-drawn planting plan with a sprouting pin -->
    <section
      id="sec-venue"
      class="sec venue"
      data-section="venue"
      data-musim="4"
    >
      <div id="venue-wrap" class="wrap">
        <header class="sh" id="vn-sh">
          <p class="sh-kicker rv" id="vn-sh-k">
            <svg
              class="sh-glyph"
              id="vn-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-4" id="vn-sh-gu"></use></svg
            ><span class="sh-no" id="vn-sh-no">No. 00</span
            ><span class="sh-season" id="vn-sh-season">Musim Mekar<\/span>
          </p>
          <h2 class="sh-title rv" id="vn-sh-t" style="--d: 0.08s">
            Petak Tanam
          </h2>
          <p class="sh-sub rv" id="vn-sh-s" style="--d: 0.16s">
            Di sinilah benih kami akan ditanam. Denahnya kami gambar sendiri â€”
            petanya yang asli ada di bawahnya.
          </p>
        </header>
        <div id="vn-grid" class="vn-grid">
          <figure id="vn-plan" class="vn-plan paper rv rv-pop">
            <div id="vn-art" class="vn-art">
              <svg
                id="vn-svg"
                class="vn-svg"
                viewBox="0 0 400 300"
                aria-hidden="true"
              >
                <defs id="vn_1">
                  <pattern
                    id="vn-grid-pat"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      id="vn_2"
                      d="M20 0H0V20"
                      fill="none"
                      stroke="rgba(79,107,58,.12)"
                      stroke-width="1"
                    ></path>
                  </pattern>
                  <pattern
                    id="vn-hatch"
                    width="6"
                    height="6"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                  >
                    <path
                      id="vn_3"
                      d="M0 0V6"
                      stroke="rgba(79,107,58,.35)"
                      stroke-width="1.4"
                    ></path>
                  </pattern>
                </defs>
                <rect
                  id="vn_4"
                  width="400"
                  height="300"
                  fill="url(#vn-grid-pat)"
                ></rect>
                <g id="vn_5" class="vn-draw">
                  <path
                    id="vn_6"
                    class="vn-path"
                    d="M-10 214C60 200 110 214 170 196S280 150 410 164"
                  ></path>
                  <path
                    id="vn_7"
                    class="vn-path vn-path-2"
                    d="M-10 226C60 212 112 226 172 208S282 162 410 176"
                  ></path>
                  <path id="vn_8" class="vn-bed" d="M40 60H150V130H40Z"></path>
                  <path id="vn_9" class="vn-bed" d="M40 148H120V184H40Z"></path>
                  <path
                    id="vn_10"
                    class="vn-bed"
                    d="M250 40C290 30 340 40 356 70S330 120 290 118 236 80 250 40Z"
                  ></path>
                  <ellipse
                    id="vn_11"
                    class="vn-pond"
                    cx="300"
                    cy="238"
                    rx="54"
                    ry="26"
                  ></ellipse>
                  <path
                    id="vn_12"
                    class="vn-bridge"
                    d="M246 232C270 222 330 222 354 232"
                  ></path>
                </g>
                <g id="vn_13" class="vn-trees">
                  <g id="vn_14" transform="translate(70 96)">
                    <circle id="vn_15" class="vn-tree" r="18"></circle>
                    <path
                      id="vn_16"
                      class="vn-tree-x"
                      d="M-12 0H12M0-12V12M-8-8 8 8M-8 8 8-8"
                    ></path>
                  </g>
                  <g id="vn_17" transform="translate(122 84)">
                    <circle id="vn_18" class="vn-tree" r="13"></circle>
                    <path id="vn_19" class="vn-tree-x" d="M-9 0H9M0-9V9"></path>
                  </g>
                  <g id="vn_20" transform="translate(96 166)">
                    <circle id="vn_21" class="vn-tree" r="11"></circle>
                    <path id="vn_22" class="vn-tree-x" d="M-7 0H7M0-7V7"></path>
                  </g>
                  <g id="vn_23" transform="translate(306 74)">
                    <circle id="vn_24" class="vn-tree" r="20"></circle>
                    <path
                      id="vn_25"
                      class="vn-tree-x"
                      d="M-14 0H14M0-14V14M-10-10 10 10M-10 10 10-10"
                    ></path>
                  </g>
                  <g id="vn_26" transform="translate(210 268)">
                    <circle id="vn_27" class="vn-tree" r="15"></circle>
                    <path
                      id="vn_28"
                      class="vn-tree-x"
                      d="M-10 0H10M0-10V10"
                    ></path>
                  </g>
                  <g id="vn_29" transform="translate(372 132)">
                    <circle id="vn_30" class="vn-tree" r="12"></circle>
                    <path id="vn_31" class="vn-tree-x" d="M-8 0H8M0-8V8"></path>
                  </g>
                </g>
                <g id="vn_32" class="vn-labels">
                  <text id="vn_33" x="95" y="52" class="vn-label">
                    kebun sayur
                  </text>
                  <text id="vn_34" x="300" y="30" class="vn-label">
                    taman bunga
                  </text>
                  <text id="vn_35" x="300" y="276" class="vn-label">kolam</text>
                  <text id="vn_36" x="40" y="244" class="vn-label">
                    jalan masuk
                  </text>
                </g>
                <g id="vn_37" class="vn-compass" transform="translate(356 214)">
                  <circle
                    id="vn_38"
                    r="14"
                    fill="none"
                    stroke="rgba(74,70,54,.45)"
                    stroke-width="1"
                  ></circle>
                  <path
                    id="vn_39"
                    d="M0-12 4 0 0 12-4 0Z"
                    fill="rgba(74,70,54,.55)"
                  ></path>
                  <text id="vn_40" y="-18" class="vn-label vn-label-n">U</text>
                </g>
                <g id="vn_41" class="vn-venue" transform="translate(206 146)">
                  <circle id="vn_42" class="vn-ripple" r="10"></circle>
                  <circle
                    id="vn_43"
                    class="vn-ripple vn-ripple-2"
                    r="10"
                  ></circle>
                  <rect
                    id="vn_44"
                    class="vn-house"
                    x="-26"
                    y="-16"
                    width="52"
                    height="30"
                    rx="3"
                  ></rect>
                  <path
                    id="vn_45"
                    class="vn-roof"
                    d="M-32-14 0-36 32-14"
                  ></path>
                </g>
              </svg>
              <div id="vn-pin" class="vn-pin" aria-hidden="true">
                <svg id="vn-pin-svg" class="vn-pin-svg" viewBox="0 0 48 64">
                  <path
                    id="vn_46"
                    class="vn-pin-body"
                    d="M24 62S4 40 4 24a20 20 0 0 1 40 0c0 16-20 38-20 38z"
                  ></path>
                  <circle
                    id="vn_47"
                    cx="24"
                    cy="24"
                    r="12"
                    fill="#fbf7ee"
                  ></circle>
                  <g id="vn_48" class="vn-pin-sprout">
                    <path
                      id="vn_49"
                      d="M24 32V20"
                      stroke="#4f6b3a"
                      stroke-width="2.4"
                      stroke-linecap="round"
                    ></path>
                    <path
                      id="vn_50"
                      d="M24 23c-5 0-8-2.6-8.6-6.6 5 0 8 2.6 8.6 6.6z"
                      fill="#7c985c"
                    ></path>
                    <path
                      id="vn_51"
                      d="M24 21.6c3.6-3.6 7.2-4.4 10-3.2-1.6 3.2-5.4 4.4-10 3.2z"
                      fill="#8db870"
                    ></path>
                  </g>
                </svg>
              </div>
            </div>
            <figcaption id="vn-title" class="vn-title">
              <span id="vn-title-a">Denah tanam Â· lembar 1/1<\/span>
              <span id="vn-title-b">skala: secukupnya<\/span>
            </figcaption>
          </figure>

          <div id="vn-info" class="vn-info">
            <p id="vn-kicker" class="vn-kicker rv">Tempat kami menanam</p>
            <h3 id="vn-name" class="vn-name rv">wwwtc mall</h3>
            <p id="vn-addr" class="vn-addr rv">280 Gloucester Rd, Causeway Bay, Hong Kong Island, Hong Kong</p>
            <p id="vn-note" class="vn-note rv">Parkir tersedia di halaman timur. Ikuti papan kayu bertanda daun.</p>
            <div id="vn-btns" class="vn-btns btn-row rv">
              <a
                id="vn-dir"
                class="btn btn-sm"
                href="https://www.google.com/maps/dir/?api=1&amp;destination_place_id=ChIJVX_KZ1YABDQR8TZ6STtir8M"
                target="_blank"
                rel="noopener"
              >
                <svg
                  id="vn-dir-ic"
                  class="ic"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <use id="vn_52" href="#ic-pin"></use>
                </svg>
                <span id="vn-dir-t">Buka di Google Maps<\/span>
              </a>
              <button id="vn-copy" class="btn btn-ghost btn-sm" type="button">
                <svg
                  id="vn-copy-ic"
                  class="ic"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <use id="vn_53" href="#ic-copy"></use>
                </svg>
                <span id="vn-copy-t">Salin alamat<\/span>
              </button>
            </div>
            <div id="vn-map" class="vn-map rv" hidden>
              <iframe
                id="vn-iframe"
                class="vn-iframe"
                title="Peta lokasi acara"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                data-src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCP0LjsvmACU9PshCUvqPg0U0AvWBw1TNo&amp;q=place_id:ChIJVX_KZ1YABDQR8TZ6STtir8M"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- DRESS CODE â€” "Warna Musim Ini": leaves in the palette; tap one and the
two garments hanging from the branch take its colour -->
    <section
      id="sec-dresscode"
      class="sec dresscode"
      data-section="dresscode"
      data-musim="4"
    >
      <div id="dresscode-wrap" class="wrap">
        <header class="sh" id="dc-sh">
          <p class="sh-kicker rv" id="dc-sh-k">
            <svg
              class="sh-glyph"
              id="dc-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-4" id="dc-sh-gu"></use></svg
            ><span class="sh-no" id="dc-sh-no">No. 00</span
            ><span class="sh-season" id="dc-sh-season">Musim Mekar<\/span>
          </p>
          <h2 class="sh-title rv" id="dc-sh-t" style="--d: 0.08s">
            Warna Musim Ini
          </h2>
        </header>
        <p id="dc-text" class="dc-text rich rv">Kami mengundang Anda mengenakan warna-warna musim semi: hijau daun muda, merah muda kelopak, dan krem tanah. Batik dan kebaya sangat dipersilakan.</p>
        <div id="dc-stage" class="dc-stage rv rv-pop">
          <svg
            id="dc-branch"
            class="dc-branch"
            viewBox="0 0 400 80"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              id="dc_1"
              d="M-8 34C60 26 120 40 200 30S330 22 408 34"
              fill="none"
              stroke="#6a4e39"
              stroke-width="7"
              stroke-linecap="round"
            ></path>
            <path
              id="dc_2"
              d="M120 36C128 48 132 58 128 70M290 28C300 40 304 50 302 62"
              fill="none"
              stroke="#6a4e39"
              stroke-width="3"
              stroke-linecap="round"
            ></path>
          </svg>
          <div id="dc-leaves" class="dc-leaves">
            <button
              id="dc-leaf-1"
              class="dc-leaf"
              type="button"
              data-color="#8DB870"
              style="--c:#8DB870"
              aria-label="Warna busana 1"
            >
              <svg id="dc-leaf-1-svg" viewBox="0 0 40 64" aria-hidden="true">
                <use
                  id="dc_3"
                  href="#sym-leaf"
                  transform="rotate(180 20 32)"
                ></use>
              </svg>
            </button>
            <button
              id="dc-leaf-2"
              class="dc-leaf"
              type="button"
              data-color="#E7A3B1"
              style="--c:#E7A3B1"
              aria-label="Warna busana 2"
            >
              <svg id="dc-leaf-2-svg" viewBox="0 0 40 64" aria-hidden="true">
                <use
                  id="dc_4"
                  href="#sym-leaf"
                  transform="rotate(180 20 32)"
                ></use>
              </svg>
            </button>
            <button
              id="dc-leaf-3"
              class="dc-leaf"
              type="button"
              data-color="#EFE3C8"
              style="--c:#EFE3C8"
              aria-label="Warna busana 3"
            >
              <svg id="dc-leaf-3-svg" viewBox="0 0 40 64" aria-hidden="true">
                <use
                  id="dc_5"
                  href="#sym-leaf"
                  transform="rotate(180 20 32)"
                ></use>
              </svg>
            </button>
            <button
              id="dc-leaf-4"
              class="dc-leaf"
              type="button"
              data-color="#5E7A48"
              style="--c:#5E7A48"
              aria-label="Warna busana 4"
            >
              <svg id="dc-leaf-4-svg" viewBox="0 0 40 64" aria-hidden="true">
                <use
                  id="dc_6"
                  href="#sym-leaf"
                  transform="rotate(180 20 32)"
                ></use>
              </svg>
            </button>
            <button
              id="dc-leaf-5"
              class="dc-leaf"
              type="button"
              data-color="#C9A45C"
              style="--c:#C9A45C"
              aria-label="Warna busana 5"
            >
              <svg id="dc-leaf-5-svg" viewBox="0 0 40 64" aria-hidden="true">
                <use
                  id="dc_7"
                  href="#sym-leaf"
                  transform="rotate(180 20 32)"
                ></use>
              </svg>
            </button>
          </div>
          <div id="dc-hangers" class="dc-hangers" aria-hidden="true">
            <div id="dc-hang-a" class="dc-hang dc-hang-a">
              <svg id="dc-dress" class="dc-garment" viewBox="0 0 120 190">
                <path
                  id="dc_8"
                  class="dc-hook"
                  d="M60 22V14a6 6 0 1 1 6-6"
                ></path>
                <path id="dc_9" class="dc-bar" d="M60 22 20 40H100Z"></path>
                <path
                  id="dc_10"
                  class="dc-cloth"
                  d="M44 38C46 50 50 56 60 58 70 56 74 50 76 38L92 44 86 70 78 72 92 180H28L42 72 34 70 28 44Z"
                ></path>
                <path
                  id="dc_11"
                  class="dc-shade"
                  d="M42 72 28 180H44L54 72Z"
                ></path>
                <path
                  id="dc_12"
                  class="dc-detail"
                  d="M50 58C54 64 66 64 70 58M40 100C60 106 80 106 84 100M34 140C58 148 84 148 88 140"
                ></path>
                <g id="dc_13" class="dc-flowers">
                  <circle id="dc_14" cx="48" cy="120" r="3"></circle>
                  <circle id="dc_15" cx="70" cy="126" r="2.6"></circle>
                  <circle id="dc_16" cx="58" cy="158" r="3"></circle>
                  <circle id="dc_17" cx="80" cy="162" r="2.4"></circle>
                  <circle id="dc_18" cx="40" cy="166" r="2.4"></circle>
                </g>
              </svg>
            </div>
            <div id="dc-hang-b" class="dc-hang dc-hang-b">
              <svg id="dc-shirt" class="dc-garment" viewBox="0 0 120 190">
                <path
                  id="dc_19"
                  class="dc-hook"
                  d="M60 22V14a6 6 0 1 1 6-6"
                ></path>
                <path id="dc_20" class="dc-bar" d="M60 22 20 40H100Z"></path>
                <path
                  id="dc_21"
                  class="dc-cloth"
                  d="M46 36 60 48 74 36 100 48 108 96 94 100 90 76 90 168H30V76L26 100 12 96 20 48Z"
                ></path>
                <path id="dc_22" class="dc-shade" d="M30 76V168H42V80Z"></path>
                <path
                  id="dc_23"
                  class="dc-detail"
                  d="M60 48V168M52 66h2M52 90h2M52 114h2M52 138h2M46 36 56 60M74 36 64 60"
                ></path>
                <g id="dc_24" class="dc-batik">
                  <path
                    id="dc_25"
                    d="M68 80c6 0 8 6 14 6M68 100c6 0 8 6 14 6M68 120c6 0 8 6 14 6M68 140c6 0 8 6 14 6M36 88c6 0 8 6 14 6M36 108c6 0 8 6 14 6M36 128c6 0 8 6 14 6"
                  ></path>
                </g>
              </svg>
            </div>
          </div>
          <p id="dc-picked" class="dc-picked" aria-live="polite">
            <span id="dc-picked-dot" class="dc-picked-dot"></span
            ><span id="dc-picked-t">Ketuk daunnya untuk mencoba warnanya<\/span>
          </p>
        </div>
      </div>
    </section>

    <!-- PETUNJUK â€” "Petunjuk Menanam": the back of the seed packet, with the
practical notes for guests written as planting instructions -->
    <section
      id="sec-petunjuk"
      class="sec petunjuk"
      data-section="petunjuk"
      data-musim="4"
    >
      <div id="petunjuk-wrap" class="wrap">
        <header class="sh" id="pj-sh">
          <p class="sh-kicker rv" id="pj-sh-k">
            <svg
              class="sh-glyph"
              id="pj-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-4" id="pj-sh-gu"></use></svg
            ><span class="sh-no" id="pj-sh-no">No. 00</span
            ><span class="sh-season" id="pj-sh-season">Musim Mekar<\/span>
          </p>
          <h2 class="sh-title rv" id="pj-sh-t" style="--d: 0.08s">
            Petunjuk Menanam
          </h2>
          <p class="sh-sub rv" id="pj-sh-s" style="--d: 0.16s">
            Seperti di balik setiap paket benih, ada beberapa hal kecil yang
            sebaiknya Anda tahu sebelum datang.
          </p>
        </header>
        <article id="pj-packet" class="pj-packet rv rv-fall">
          <header id="pj-head" class="pj-head">
            <p id="pj-head-a" class="pj-head-a">Sisi belakang paket</p>
            <p id="pj-head-b" class="pj-head-b">Petunjuk menanam</p>
            <p id="pj-head-c" class="pj-head-c">
              <span id="pj-head-c1">Nurizzati Islamiyah<\/span> Ã—
              <span id="pj-head-c2">Badriana<\/span> Â· â€˜Tumbuh Bersamaâ€™
            </p>
          </header>
          <ul id="pj-list" class="pj-list">
            <li id="pj-item-1" class="pj-item rv" style="--d: 0.05s">
              <span id="pj-ic-1" class="pj-ic pj-ic-clock" aria-hidden="true"
                ><svg id="pt_1" viewBox="0 0 48 48">
                  <circle
                    id="pt_2"
                    cx="24"
                    cy="24"
                    r="17"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.4"
                  ></circle>
                  <path
                    id="pt_3"
                    class="pj-hand"
                    d="M24 24V13"
                    stroke="currentColor"
                    stroke-width="2.6"
                    stroke-linecap="round"
                  ></path>
                  <path
                    id="pt_4"
                    d="M24 24l7 5"
                    stroke="currentColor"
                    stroke-width="2.6"
                    stroke-linecap="round"
                  ></path>
                  <circle
                    id="pt_5"
                    cx="24"
                    cy="24"
                    r="2.4"
                    fill="currentColor"
                  ></circle></svg
              ><\/span>
              <div id="pj-body-1" class="pj-body">
                <h3 id="pj-label-1" class="pj-label">Waktu tanam terbaik</h3>
                <p id="pj-text-1" class="pj-text">Datanglah 30 menit sebelum acara dimulai, supaya bisa menyaksikan akad dengan tenang.</p>
              </div>
            </li>
            <li id="pj-item-2" class="pj-item rv" style="--d: 0.1s">
              <span id="pj-ic-2" class="pj-ic pj-ic-space" aria-hidden="true"
                ><svg id="pt_6" viewBox="0 0 48 48">
                  <path
                    id="pt_7"
                    d="M8 34h32"
                    stroke="currentColor"
                    stroke-width="2.4"
                    stroke-linecap="round"
                  ></path>
                  <path
                    id="pt_8"
                    d="M8 30v8M40 30v8M24 32v4"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  ></path>
                  <g id="pt_9" class="pj-sprouts">
                    <path
                      id="pt_10"
                      d="M14 30V20M14 23c-4 0-6-2-6.6-5.4 4 0 6 2 6.6 5.4zM34 30V18M34 21c4 0 6-2 6.6-5.4-4 0-6 2-6.6 5.4z"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                      stroke-linecap="round"
                    ></path>
                  </g></svg
              ><\/span>
              <div id="pj-body-2" class="pj-body">
                <h3 id="pj-label-2" class="pj-label">Jarak tanam</h3>
                <p id="pj-text-2" class="pj-text">Parkir mobil di halaman timur, motor di sisi utara. Petugas berpakaian hijau siap membantu.</p>
              </div>
            </li>
            <li id="pj-item-3" class="pj-item rv" style="--d: 0.15s">
              <span id="pj-ic-3" class="pj-ic pj-ic-friends" aria-hidden="true"
                ><svg id="pt_11" viewBox="0 0 48 48">
                  <path
                    id="pt_12"
                    d="M6 38h36"
                    stroke="currentColor"
                    stroke-width="2.4"
                    stroke-linecap="round"
                  ></path>
                  <g id="pt_13" class="pj-sway-a">
                    <path
                      id="pt_14"
                      d="M16 38V20"
                      stroke="currentColor"
                      stroke-width="2.4"
                      stroke-linecap="round"
                    ></path>
                    <circle
                      id="pt_15"
                      cx="16"
                      cy="16"
                      r="5"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                    ></circle>
                  </g>
                  <g id="pt_16" class="pj-sway-b">
                    <path
                      id="pt_17"
                      d="M32 38V26"
                      stroke="currentColor"
                      stroke-width="2.4"
                      stroke-linecap="round"
                    ></path>
                    <path
                      id="pt_18"
                      d="M32 30c4 0 7-3 7-7-4 0-7 3-7 7zM32 28c-3-1-5-4-5-7 3 1 5 4 5 7z"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    ></path>
                  </g></svg
              ><\/span>
              <div id="pj-body-3" class="pj-body">
                <h3 id="pj-label-3" class="pj-label">Kawan tanam</h3>
                <p id="pj-text-3" class="pj-text">Anak-anak sangat dipersilakan. Kami menyiapkan pojok kecil untuk menanam bibit bersama mereka.</p>
              </div>
            </li>
            <li id="pj-item-4" class="pj-item rv" style="--d: 0.2s">
              <span id="pj-ic-4" class="pj-ic pj-ic-sun" aria-hidden="true"
                ><svg id="pt_19" viewBox="0 0 48 48">
                  <circle
                    id="pt_20"
                    cx="24"
                    cy="24"
                    r="8"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.4"
                  ></circle>
                  <g id="pt_21" class="pj-rays">
                    <path
                      id="pt_22"
                      d="M24 6v6M24 36v6M6 24h6M36 24h6M11.3 11.3l4.2 4.2M32.5 32.5l4.2 4.2M11.3 36.7l4.2-4.2M32.5 15.5l4.2-4.2"
                      stroke="currentColor"
                      stroke-width="2.4"
                      stroke-linecap="round"
                    ></path>
                  </g></svg
              ><\/span>
              <div id="pj-body-4" class="pj-body">
                <h3 id="pj-label-4" class="pj-label">Sinar matahari</h3>
                <p id="pj-text-4" class="pj-text">Sebagian acara berlangsung di taman terbuka. Topi dan alas kaki yang nyaman akan sangat membantu.</p>
              </div>
            </li>
            <li id="pj-item-5" class="pj-item rv" style="--d: 0.25s">
              <span id="pj-ic-5" class="pj-ic pj-ic-water" aria-hidden="true"
                ><svg id="pt_23" viewBox="0 0 48 48">
                  <path
                    id="pt_24"
                    d="M24 8s11 12 11 20a11 11 0 0 1-22 0c0-8 11-20 11-20z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.4"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    id="pt_25"
                    class="pj-drop"
                    d="M19 29a5 5 0 0 0 5 5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  ></path></svg
              ><\/span>
              <div id="pj-body-5" class="pj-body">
                <h3 id="pj-label-5" class="pj-label">Penyiraman</h3>
                <p id="pj-text-5" class="pj-text">Air minum tersedia di setiap sudut. Bawalah botol minum sendiri untuk mengurangi sampah plastik.</p>
              </div>
            </li>
            <li id="pj-item-6" class="pj-item rv" style="--d: 0.3s">
              <span id="pj-ic-6" class="pj-ic pj-ic-bug" aria-hidden="true"
                ><svg id="pt_26" viewBox="0 0 48 48">
                  <g id="pt_27" class="pj-bug">
                    <ellipse
                      id="pt_28"
                      cx="24"
                      cy="26"
                      rx="8"
                      ry="10"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.4"
                    ></ellipse>
                    <circle
                      id="pt_29"
                      cx="24"
                      cy="14"
                      r="4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                    ></circle>
                    <path
                      id="pt_30"
                      d="M24 16v20M16 22l-6-3M16 30l-6 2M32 22l6-3M32 30l6 2M21 11l-3-4M27 11l3-4"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    ></path>
                  </g>
                  <path
                    id="pt_31"
                    d="M8 40 40 8"
                    stroke="currentColor"
                    stroke-width="2.6"
                    stroke-linecap="round"
                    opacity=".75"
                  ></path></svg
              ><\/span>
              <div id="pj-body-6" class="pj-body">
                <h3 id="pj-label-6" class="pj-label">Hama yang dihindari</h3>
                <p id="pj-text-6" class="pj-text">Mohon aktifkan mode senyap pada ponsel selama akad berlangsung.</p>
              </div>
            </li>
          </ul>
          <footer id="pj-foot" class="pj-foot">
            <p id="pj-foot-a" class="pj-foot-a">
              Simpan di tempat yang sejuk dan kering. Jauhkan dari jangkauan
              gengsi.
            </p>
            <div id="pj-barcode" class="pj-barcode" aria-hidden="true"></div>
          </footer>
        </article>
      </div>
    </section>
    <!-- VIDEO â€” "Rekaman dari Kebun": prewedding video or a live stream,
seen through the arched window of a greenhouse -->
    <section
      id="sec-video"
      class="sec video"
      data-section="video"
      data-musim="4"
    >
      <div id="video-wrap" class="wrap">
        <header class="sh" id="vd-sh">
          <p class="sh-kicker rv" id="vd-sh-k">
            <svg
              class="sh-glyph"
              id="vd-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-4" id="vd-sh-gu"></use></svg
            ><span class="sh-no" id="vd-sh-no">No. 00</span
            ><span class="sh-season" id="vd-sh-season">Musim Mekar<\/span>
          </p>
          <h2 class="sh-title rv" id="vd-sh-t" style="--d: 0.08s">
            Rekaman dari Kebun
          </h2>
          <p class="sh-sub rv" id="vd-sh-s" style="--d: 0.16s">
            Bagi yang berhalangan hadir, akad akan kami siarkan langsung dari kebun.
          </p>
        </header>
        <div id="vd-house" class="vd-house rv rv-pop">
          <div id="vd-screen" class="vd-screen">
            <video
              id="vd-video"
              class="vd-video"
              controls
              playsinline
              preload="metadata"
              src="{{prewedding_video}}"
            ></video>
            <div
              id="vd-embed"
              class="vd-embed"
              data-link="{{live_stream_link}}"
            ></div>
          </div>
          <svg
            id="vd-frame"
            class="vd-frame"
            viewBox="0 0 400 260"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              id="vd_1"
              d="M6 254V96C6 46 96 6 200 6S394 46 394 96V254Z"
              fill="none"
              stroke="#f6efe0"
              stroke-width="10"
              vector-effect="non-scaling-stroke"
            ></path>
            <path
              id="vd_2"
              d="M200 6V254M6 110H394M100 18V254M300 18V254"
              fill="none"
              stroke="#f6efe0"
              stroke-width="4"
              vector-effect="non-scaling-stroke"
              opacity=".55"
            ></path>
          </svg>
          <div id="vd-vines" class="vd-vines" aria-hidden="true">
            <svg id="vd-vine-l" class="vd-vine vd-vine-l" viewBox="0 0 60 200">
              <path
                id="vd_3"
                d="M50 200C30 170 44 140 26 110S20 50 40 10"
                fill="none"
                stroke="#5a7645"
                stroke-width="3"
                stroke-linecap="round"
              ></path>
              <g id="vd_4" fill="#8db870">
                <path
                  id="vd_5"
                  d="M30 150c-10-2-16-8-16-16 9 0 15 7 16 16z"
                ></path>
                <path
                  id="vd_6"
                  d="M28 104c10-3 18 0 22 7-9 4-17 1-22-7z"
                ></path>
                <path
                  id="vd_7"
                  d="M30 58c-9-4-13-11-11-19 8 3 12 11 11 19z"
                ></path>
              </g>
              <g id="vd_8" fill="#f1b8c4">
                <circle id="vd_9" cx="40" cy="12" r="5"></circle>
                <circle id="vd_10" cx="18" cy="132" r="4"></circle>
              </g>
            </svg>
            <svg id="vd-vine-r" class="vd-vine vd-vine-r" viewBox="0 0 60 200">
              <path
                id="vd_11"
                d="M10 200C30 170 16 140 34 110S40 50 20 10"
                fill="none"
                stroke="#5a7645"
                stroke-width="3"
                stroke-linecap="round"
              ></path>
              <g id="vd_12" fill="#7c985c">
                <path
                  id="vd_13"
                  d="M30 150c10-2 16-8 16-16-9 0-15 7-16 16z"
                ></path>
                <path
                  id="vd_14"
                  d="M32 104c-10-3-18 0-22 7 9 4 17 1 22-7z"
                ></path>
                <path
                  id="vd_15"
                  d="M30 58c9-4 13-11 11-19-8 3-12 11-11 19z"
                ></path>
              </g>
              <g id="vd_16" fill="#f3dc8e">
                <circle id="vd_17" cx="20" cy="12" r="5"></circle>
                <circle id="vd_18" cx="42" cy="132" r="4"></circle>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- GIFTS â€” "Ikut Menyiram": the watering can pours when a gift is confirmed -->
    <section
      id="sec-gifts"
      class="sec gifts"
      data-section="gifts"
      data-musim="4"
    >
      <div id="gifts-wrap" class="wrap">
        <header class="sh" id="gf-sh">
          <p class="sh-kicker rv" id="gf-sh-k">
            <svg
              class="sh-glyph"
              id="gf-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-4" id="gf-sh-gu"></use></svg
            ><span class="sh-no" id="gf-sh-no">No. 00</span
            ><span class="sh-season" id="gf-sh-season">Musim Mekar<\/span>
          </p>
          <h2 class="sh-title rv" id="gf-sh-t" style="--d: 0.08s">
            Transfer via ATM
          </h2>
        </header>
        <p id="gf-text" class="gf-text rich rv">Doa dan kehadiran Anda adalah hadiah terbaik bagi kami. Namun jika Anda bermaksud memberikan tanda kasih, Anda dapat mengirimkannya melalui transfer rekening ATM berikut dan konfirmasi melalui WhatsApp:</p>
        <div id="gf-grid" class="gf-grid">
          <div id="gf-scene" class="gf-scene rv rv-pop" aria-hidden="true">
            <svg id="gf-svg" class="gf-svg" viewBox="0 0 300 240">
              <ellipse
                id="gf_1"
                cx="150"
                cy="222"
                rx="110"
                ry="10"
                fill="rgba(60,40,20,.14)"
              ></ellipse>
              <g id="gf-can" class="gf-can">
                <g id="gf-can-in" transform="translate(-100 -24)">
                  <path
                    id="gf_2"
                    d="M150 64h78v58a12 12 0 0 1-12 12h-54a12 12 0 0 1-12-12z"
                    fill="#7c985c"
                  ></path>
                  <path id="gf_3" d="M150 64h78v10h-78z" fill="#6f8a52"></path>
                  <path
                    id="gf_4"
                    d="M150 78c-22 0-30 10-30 24s8 24 30 24"
                    fill="none"
                    stroke="#5a7645"
                    stroke-width="8"
                    stroke-linecap="round"
                  ></path>
                  <path
                    id="gf_5"
                    d="M168 64V52a21 21 0 0 1 42 0v12"
                    fill="none"
                    stroke="#5a7645"
                    stroke-width="8"
                  ></path>
                  <path
                    id="gf_6"
                    d="M228 86 268 52l8 8-44 40"
                    fill="#6f8a52"
                  ></path>
                  <ellipse
                    id="gf_7"
                    cx="274"
                    cy="54"
                    rx="9"
                    ry="6"
                    transform="rotate(-42 274 54)"
                    fill="#5a7645"
                  ></ellipse>
                  <path
                    id="gf_8"
                    d="M162 96h40"
                    stroke="rgba(255,255,255,.35)"
                    stroke-width="4"
                    stroke-linecap="round"
                  ></path>
                </g>
              </g>
              <g id="gf-water" class="gf-water">
                <path
                  id="gf_9"
                  class="gf-stream"
                  d="M184 74C188 102 192 132 198 166"
                ></path>
                <path
                  id="gf_10"
                  class="gf-stream gf-stream-2"
                  d="M192 72C198 102 204 134 210 166"
                ></path>
                <circle
                  id="gf_11"
                  class="gf-splash"
                  cx="200"
                  cy="170"
                  r="3"
                ></circle>
                <circle
                  id="gf_12"
                  class="gf-splash"
                  cx="212"
                  cy="169"
                  r="2.4"
                ></circle>
                <circle
                  id="gf_13"
                  class="gf-splash"
                  cx="190"
                  cy="169"
                  r="2"
                ></circle>
              </g>
              <g id="gf-pot" class="gf-pot">
                <path
                  id="gf_14"
                  d="M176 176h72l-9 44a6 6 0 0 1-6 5h-42a6 6 0 0 1-6-5z"
                  fill="#c26e45"
                ></path>
                <path id="gf_15" d="M170 168h84v12h-84z" fill="#a95a36"></path>
                <path
                  id="gf_16"
                  d="M178 176h68"
                  stroke="rgba(0,0,0,.18)"
                  stroke-width="2"
                ></path>
                <ellipse
                  id="gf_17"
                  cx="212"
                  cy="170"
                  rx="38"
                  ry="5"
                  fill="#4a3527"
                ></ellipse>
              </g>
              <g id="gf-plant" class="gf-plant">
                <path
                  id="gf_18"
                  class="gf-stem"
                  d="M212 168C212 148 208 132 214 110"
                ></path>
                <path
                  id="gf_19"
                  class="gf-leaf gf-leaf-1"
                  d="M212 150c-14 0-22-6-24-18 12 0 20 6 24 18z"
                ></path>
                <path
                  id="gf_20"
                  class="gf-leaf gf-leaf-2"
                  d="M213 136c10-12 22-15 32-10-6 10-18 14-32 10z"
                ></path>
                <g id="gf_21" class="gf-flower">
                  <circle
                    id="gf_22"
                    cx="214"
                    cy="100"
                    r="7"
                    fill="#f1b8c4"
                  ></circle>
                  <circle
                    id="gf_23"
                    cx="224"
                    cy="106"
                    r="7"
                    fill="#f1b8c4"
                  ></circle>
                  <circle
                    id="gf_24"
                    cx="221"
                    cy="118"
                    r="7"
                    fill="#f1b8c4"
                  ></circle>
                  <circle
                    id="gf_25"
                    cx="207"
                    cy="118"
                    r="7"
                    fill="#f1b8c4"
                  ></circle>
                  <circle
                    id="gf_26"
                    cx="204"
                    cy="106"
                    r="7"
                    fill="#f1b8c4"
                  ></circle>
                  <circle
                    id="gf_27"
                    cx="214"
                    cy="110"
                    r="5"
                    fill="#e8b746"
                  ></circle>
                </g>
              </g>
            </svg>
          </div>
          <div id="gf-form" class="form gf-form rv" data-wedivo="gift-card" style="background:rgba(251,247,238,0.92); border:1px solid var(--line); border-radius:20px; padding:22px 20px; box-shadow:0 12px 24px -16px rgba(40,30,15,0.25);">
            <!-- Bank Transfer Box -->
            <div id="gf-atm-box" style="margin-bottom:18px; text-align:center;">
              <p style="font-family:var(--f-mono); font-size:11.5px; text-transform:uppercase; letter-spacing:0.12em; color:var(--acc-1); margin:0 0 6px;">Transfer Rekening ATM</p>
              <h3 id="gf-bank-name" style="font-family:var(--f-serif); font-size:22px; font-weight:700; color:var(--ink); margin:0 0 4px;">{{bank_name}}</h3>
              <p id="gf-account-number" style="font-family:var(--f-mono); font-size:22px; font-weight:600; letter-spacing:0.08em; color:#9a4760; margin:6px 0;">{{account_number}}</p>
              <p id="gf-account-holder" style="font-family:var(--f-sans); font-size:14px; color:var(--ink-2); margin:0 0 14px;">a.n. {{account_holder}}</p>
              <button id="gf-copy-btn" class="btn form-submit" type="button" style="width:100%; min-height:44px; font-size:14px; display:inline-flex; align-items:center; justify-content:center; gap:8px;" data-copy-account="{{account_number}}">
                <svg class="ic" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <rect x="9" y="3" width="12" height="16" rx="2"></rect>
                  <path d="M6 7H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" stroke-linecap="round"></path>
                </svg>
                <span id="gf-copy-text">Salin Nomor Rekening</span>
              </button>
            </div>

            <!-- QRIS Box jika ada -->
            <div id="gf-qris-box" style="{{qris_box_display}} margin-bottom:18px; text-align:center; padding-top:16px; border-top:1px dashed var(--line);">
              <p style="font-family:var(--f-mono); font-size:11.5px; text-transform:uppercase; letter-spacing:0.12em; color:var(--acc-1); margin:0 0 8px;">Pindai QRIS</p>
              <img id="gf-qris-img" src="{{qris_image_url}}" alt="QRIS Pembayaran" style="max-width:180px; width:100%; border-radius:10px; border:1px solid rgba(0,0,0,0.1); margin:0 auto 6px; display:block;" />
              <p style="font-size:12px; font-family:var(--f-sans); color:var(--ink-3); margin:0;">Mendukung seluruh aplikasi e-wallet & mobile banking</p>
            </div>

            <!-- WhatsApp Confirmation Box -->
            <div id="gf-wa-box" style="{{wa_box_display}} text-align:center; padding-top:16px; border-top:1px dashed var(--line);">
              <p style="font-family:var(--f-serif); font-style:italic; font-size:14.5px; color:var(--ink-2); margin:0 0 10px;">Setelah transfer, mohon konfirmasikan tanda kasih Anda lewat WhatsApp:</p>
              <a id="gf-wa-btn" class="btn btn-ghost" href="{{whatsapp_url}}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; justify-content:center; gap:8px; width:100%; min-height:46px; border-radius:12px; background:rgba(37,211,102,0.12); color:#128c7e; border:1.5px solid rgba(37,211,102,0.4); font-family:var(--f-sans); font-weight:700; font-size:14.5px; text-decoration:none; transition:all 0.2s ease;">
                <svg class="ic" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"></path>
                </svg>
                <span>Konfirmasi via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- RSVP â€” "Ikut Menanam?": the guest's own seedling reacts to the answer
and is planted in the garden bed once the RSVP is sent -->
    <section id="sec-rsvp" class="sec rsvp" data-section="rsvp" data-musim="4">
      <div id="rsvp-wrap" class="wrap">
        <header class="sh" id="rs-sh">
          <p class="sh-kicker rv" id="rs-sh-k">
            <svg
              class="sh-glyph"
              id="rs-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-4" id="rs-sh-gu"></use></svg
            ><span class="sh-no" id="rs-sh-no">No. 00</span
            ><span class="sh-season" id="rs-sh-season">Musim Mekar<\/span>
          </p>
          <h2 class="sh-title rv" id="rs-sh-t" style="--d: 0.08s">
            Ikut Menanam?
          </h2>
          <p class="sh-sub rv" id="rs-sh-s" style="--d: 0.16s">Setiap tamu yang datang adalah satu bibit baru di kebun kami.</p>
        </header>
        <p id="rs-deadline" class="rs-deadline rv">
          Mohon beri kabar sebelum
          <strong
            id="rs-deadline-d"
            class="js-date"
            data-date="2027-03-06"
            data-format="long"
            >2027-03-06</strong
          >
        </p>
        <div id="rs-grid" class="rs-grid">
          <div id="rs-scene" class="rs-scene rv rv-pop" aria-hidden="true">
            <svg id="rs-svg" class="rs-svg" viewBox="0 0 360 230">
              <g id="rs-bed" class="rs-bed">
                <path id="rs_1" d="M8 168H352V222H8Z" fill="#5b4332"></path>
                <path id="rs_2" d="M8 168H352V178H8Z" fill="#6d513d"></path>
                <path
                  id="rs_3"
                  d="M4 164H356V172H4ZM4 214H356V226H4Z"
                  fill="#b4895c"
                ></path>
                <path
                  id="rs_4"
                  d="M40 164V172M110 164V172M200 164V172M290 164V172M60 214V226M160 214V226M260 214V226"
                  stroke="#8f6a45"
                  stroke-width="2"
                ></path>
              </g>
              <g id="rs-others" class="rs-others">
                <g id="rs_5" class="rs-seedling" transform="translate(34 168)">
                  <g id="rs_6" class="rs-sw" style="--sd: -0.3s">
                    <path
                      id="rs_7"
                      d="M0 0V-22"
                      stroke="#5a7645"
                      stroke-width="2.4"
                      stroke-linecap="round"
                    ></path>
                    <path
                      id="rs_8"
                      d="M0-14c-7 0-11-3-12-9 7 0 11 3 12 9zM0-18c5-5 10-6 14-4-3 4-8 6-14 4z"
                      fill="#7c985c"
                    ></path>
                    <circle id="rs_9" cy="-24" r="3.4" fill="#f1b8c4"></circle>
                  </g>
                </g>
                <g id="rs_10" class="rs-seedling" transform="translate(76 168)">
                  <g id="rs_11" class="rs-sw" style="--sd: -1.1s">
                    <path
                      id="rs_12"
                      d="M0 0V-16"
                      stroke="#5a7645"
                      stroke-width="2.2"
                      stroke-linecap="round"
                    ></path>
                    <path
                      id="rs_13"
                      d="M0-10c-6 0-9-3-10-8 6 0 9 3 10 8zM0-13c4-4 8-5 12-3-3 3-7 5-12 3z"
                      fill="#8db870"
                    ></path>
                  </g>
                </g>
                <g
                  id="rs_14"
                  class="rs-seedling"
                  transform="translate(118 168)"
                >
                  <g id="rs_15" class="rs-sw" style="--sd: -2s">
                    <path
                      id="rs_16"
                      d="M0 0V-26"
                      stroke="#5a7645"
                      stroke-width="2.4"
                      stroke-linecap="round"
                    ></path>
                    <path
                      id="rs_17"
                      d="M0-16c-8 0-12-4-13-10 8 0 12 4 13 10zM0-21c6-6 12-7 16-4-4 5-10 7-16 4z"
                      fill="#6f9a52"
                    ></path>
                    <circle id="rs_18" cy="-28" r="3.6" fill="#f3dc8e"></circle>
                  </g>
                </g>
                <g
                  id="rs_19"
                  class="rs-seedling"
                  transform="translate(246 168)"
                >
                  <g id="rs_20" class="rs-sw" style="--sd: -0.7s">
                    <path
                      id="rs_21"
                      d="M0 0V-20"
                      stroke="#5a7645"
                      stroke-width="2.2"
                      stroke-linecap="round"
                    ></path>
                    <path
                      id="rs_22"
                      d="M0-12c-7 0-10-3-11-8 7 0 10 3 11 8zM0-16c5-5 10-6 13-3-3 4-8 5-13 3z"
                      fill="#7c985c"
                    ></path>
                  </g>
                </g>
                <g
                  id="rs_23"
                  class="rs-seedling"
                  transform="translate(288 168)"
                >
                  <g id="rs_24" class="rs-sw" style="--sd: -1.6s">
                    <path
                      id="rs_25"
                      d="M0 0V-24"
                      stroke="#5a7645"
                      stroke-width="2.4"
                      stroke-linecap="round"
                    ></path>
                    <path
                      id="rs_26"
                      d="M0-15c-8 0-12-4-13-9 8 0 12 4 13 9zM0-19c6-6 11-7 15-4-3 5-9 6-15 4z"
                      fill="#8db870"
                    ></path>
                    <circle id="rs_27" cy="-26" r="3.4" fill="#e7a3b1"></circle>
                  </g>
                </g>
                <g
                  id="rs_28"
                  class="rs-seedling"
                  transform="translate(328 168)"
                >
                  <g id="rs_29" class="rs-sw" style="--sd: -2.4s">
                    <path
                      id="rs_30"
                      d="M0 0V-14"
                      stroke="#5a7645"
                      stroke-width="2"
                      stroke-linecap="round"
                    ></path>
                    <path
                      id="rs_31"
                      d="M0-9c-6 0-8-3-9-7 6 0 8 3 9 7zM0-11c4-4 8-4 11-2-3 3-7 4-11 2z"
                      fill="#6f9a52"
                    ></path>
                  </g>
                </g>
              </g>
              <g id="rs-spot" class="rs-spot">
                <ellipse id="rs_32" cx="182" cy="170" rx="22" ry="6"></ellipse>
              </g>
              <g id="rs-planted" class="rs-planted">
                <g id="rs-planted-in" transform="translate(182 168)">
                  <g id="rs_33" class="rs-sw" style="--sd: -0.2s">
                    <path
                      id="rs_34"
                      d="M0 0V-30"
                      stroke="#4f6b3a"
                      stroke-width="2.8"
                      stroke-linecap="round"
                    ></path>
                    <path
                      id="rs_35"
                      d="M0-18c-9 0-14-4-15-11 9 0 14 4 15 11zM0-24c7-7 13-8 18-5-4 6-11 8-18 5z"
                      fill="#7c985c"
                    ></path>
                    <g id="rs_36" fill="#f1b8c4">
                      <circle id="rs_37" cx="0" cy="-36" r="4.4"></circle>
                      <circle id="rs_38" cx="5" cy="-32" r="4.4"></circle>
                      <circle id="rs_39" cx="-5" cy="-32" r="4.4"></circle>
                    </g>
                    <circle
                      id="rs_40"
                      cy="-33.5"
                      r="2.6"
                      fill="#e8b746"
                    ></circle>
                  </g>
                </g>
              </g>
              <g id="rs-pot" class="rs-pot">
                <g id="rs-pot-in" class="rs-pot-in">
                  <path
                    id="rs_41"
                    d="M152 92h60l-8 40a6 6 0 0 1-6 5h-32a6 6 0 0 1-6-5z"
                    fill="#c26e45"
                  ></path>
                  <path id="rs_42" d="M148 84h68v12h-68z" fill="#a95a36"></path>
                  <ellipse
                    id="rs_43"
                    cx="182"
                    cy="86"
                    rx="30"
                    ry="4"
                    fill="#4a3527"
                  ></ellipse>
                  <g id="rs-seed" class="rs-seed">
                    <ellipse
                      id="rs_44"
                      cx="182"
                      cy="84"
                      rx="5"
                      ry="6.4"
                      fill="#7b573b"
                    ></ellipse>
                  </g>
                  <g id="rs-sprout" class="rs-sprout">
                    <path
                      id="rs_45"
                      d="M182 84V56"
                      stroke="#4f6b3a"
                      stroke-width="3"
                      stroke-linecap="round"
                    ></path>
                    <path
                      id="rs_46"
                      class="rs-leaf-l"
                      d="M182 70c-10 0-16-5-17-12 10 0 16 5 17 12z"
                      fill="#7c985c"
                    ></path>
                    <path
                      id="rs_47"
                      class="rs-leaf-r"
                      d="M182 64c8-8 15-9 20-6-4 7-12 9-20 6z"
                      fill="#8db870"
                    ></path>
                    <g id="rs_48" class="rs-bloom" fill="#f1b8c4">
                      <circle id="rs_49" cx="182" cy="48" r="5"></circle>
                      <circle id="rs_50" cx="188" cy="52" r="5"></circle>
                      <circle id="rs_51" cx="176" cy="52" r="5"></circle>
                      <circle
                        id="rs_52"
                        cx="182"
                        cy="52"
                        r="3"
                        fill="#e8b746"
                      ></circle>
                    </g>
                  </g>
                  <g id="rs-pax" class="rs-pax">
                    <g id="rs_53" class="rs-pax-s" data-n="2">
                      <g id="rs_54" transform="translate(162 84)">
                        <path
                          id="rs_55"
                          d="M0 0V-12M0-7c-4 0-6-2-7-5 4 0 6 2 7 5z"
                          stroke="#5a7645"
                          stroke-width="1.8"
                          fill="#8db870"
                          stroke-linecap="round"
                        ></path>
                      </g>
                    </g>
                    <g id="rs_56" class="rs-pax-s" data-n="3">
                      <g id="rs_57" transform="translate(202 84)">
                        <path
                          id="rs_58"
                          d="M0 0V-12M0-7c4 0 6-2 7-5-4 0-6 2-7 5z"
                          stroke="#5a7645"
                          stroke-width="1.8"
                          fill="#8db870"
                          stroke-linecap="round"
                        ></path>
                      </g>
                    </g>
                    <g id="rs_59" class="rs-pax-s" data-n="4">
                      <g id="rs_60" transform="translate(170 84)">
                        <path
                          id="rs_61"
                          d="M0 0V-9M0-5c-3 0-5-2-6-4 3 0 5 2 6 4z"
                          stroke="#5a7645"
                          stroke-width="1.6"
                          fill="#7c985c"
                          stroke-linecap="round"
                        ></path>
                      </g>
                    </g>
                    <g id="rs_62" class="rs-pax-s" data-n="5">
                      <g id="rs_63" transform="translate(194 84)">
                        <path
                          id="rs_64"
                          d="M0 0V-9M0-5c3 0 5-2 6-4-3 0-5 2-6 4z"
                          stroke="#5a7645"
                          stroke-width="1.6"
                          fill="#7c985c"
                          stroke-linecap="round"
                        ></path>
                      </g>
                    </g>
                  </g>
                  <g id="rs-maybe" class="rs-maybe">
                    <circle
                      id="rs_65"
                      cx="214"
                      cy="48"
                      r="11"
                      fill="#fbf7ee"
                      stroke="#9a4760"
                      stroke-width="1.6"
                    ></circle>
                    <text
                      id="rs_66"
                      x="214"
                      y="53"
                      text-anchor="middle"
                      class="rs-q"
                    >
                      ?
                    </text>
                  </g>
                  <g id="rs-letter" class="rs-letter">
                    <rect
                      id="rs_67"
                      x="206"
                      y="40"
                      width="34"
                      height="24"
                      rx="3"
                      fill="#fbf7ee"
                      stroke="#8a6a4f"
                      stroke-width="1.6"
                    ></rect>
                    <path
                      id="rs_68"
                      d="M206 42 223 54 240 42"
                      fill="none"
                      stroke="#8a6a4f"
                      stroke-width="1.6"
                    ></path>
                    <path
                      id="rs_69"
                      d="M223 60c-3-3-6-5-6-7.6a2.8 2.8 0 0 1 6-1.4 2.8 2.8 0 0 1 6 1.4c0 2.6-3 4.6-6 7.6z"
                      fill="#e7a3b1"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
            <span id="rs-tag" class="rs-tag"
              ><span id="rs-tag-k" class="rs-tag-k">bibit</span
              ><span id="rs-tag-name" class="rs-tag-name">Nama Anda<\/span></span
            >
            <span id="rs-spot-t" class="rs-spot-t">tempatmu<\/span>
            <p id="rs-mood" class="rs-mood">
              Pilih jawabanmu, bibitnya akan ikut merespons.
            </p>
          </div>

          <div id="rs-form-col" class="rs-form-col">
            <form id="rs-form" class="form rs-form rv" data-wedivo="rsvp" onsubmit="return false;" action="javascript:void(0);">
              <label id="rs-l-name" class="form-l" for="rs-name">Nama</label>
              <input
                id="rs-name"
                class="form-in"
                name="name"
                type="text"
                placeholder="Nama Anda"
                autocomplete="name"
                required
              />
              <p id="rs-l-status" class="form-l">Apakah Anda akan hadir?</p>
              <div id="rs-status" class="rs-status">
                <button
                  id="rs-yes"
                  class="rs-opt"
                  type="button"
                  data-wedivo-status="attending"
                >
                  <span
                    id="rs-yes-ic"
                    class="rs-opt-ic"
                    aria-hidden="true"
                  ></span
                  ><span id="rs-yes-t">Hadir<\/span>
                </button>
                <button
                  id="rs-no"
                  class="rs-opt"
                  type="button"
                  data-wedivo-status="not_attending"
                >
                  <span
                    id="rs-no-ic"
                    class="rs-opt-ic"
                    aria-hidden="true"
                  ></span
                  ><span id="rs-no-t">Berhalangan<\/span>
                </button>
                <button
                  id="rs-maybe-b"
                  class="rs-opt"
                  type="button"
                  data-wedivo-status="maybe"
                >
                  <span
                    id="rs-maybe-ic"
                    class="rs-opt-ic"
                    aria-hidden="true"
                  ></span
                  ><span id="rs-maybe-t">Masih ragu<\/span>
                </button>
              </div>
              <label id="rs-l-pax" class="form-l" for="rs-pax-in"
                >Jumlah tamu</label
              >
              <div id="rs-pax-wrap" class="rs-pax-wrap">
                <button
                  id="rs-pax-minus"
                  class="rs-pax-btn rs-pax-minus"
                  type="button"
                  aria-label="Kurangi jumlah tamu"
                >
                  âˆ’
                </button>
                <input
                  id="rs-pax-in"
                  class="form-in rs-pax-in"
                  name="pax"
                  type="number"
                  min="1"
                  max="20"
                  value="1"
                  inputmode="numeric"
                />
                <button
                  id="rs-pax-plus"
                  class="rs-pax-btn rs-pax-plus"
                  type="button"
                  aria-label="Tambah jumlah tamu"
                >
                  +
                </button>
              </div>
              <label id="rs-l-msg" class="form-l" for="rs-msg"
                >Pesan untuk kami (opsional)</label
              >
              <textarea
                id="rs-msg"
                class="form-in form-ta"
                name="message"
                rows="3"
                placeholder="Pesan untuk kedua mempelai (opsional)"
              ></textarea>
              <button id="rs-submit" class="btn form-submit" type="button">
                <svg
                  id="rs-submit-ic"
                  class="ic"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <use id="rs_70" href="#ic-seed"></use>
                </svg>
                <span id="rs-submit-t">Kirim &amp; tanam bibitku<\/span>
              </button>
              <p id="rs-error" class="form-error">
                Pilih dulu status kehadiran Anda, ya â€” atau periksa kembali
                isiannya.
              </p>
              <p id="rs-done" class="form-done">
                Terima kasih! Bibit Anda sudah kami tanam di kebun kami.
              </p>
            </form>
            <button id="rsvp-edit" class="btn btn-ghost btn-sm" type="button" style="display:none; width:100%; margin:12px auto 0; font-size:13px; color:var(--acc-1); border-radius:999px;">
              ↺ Ubah Jawaban Kehadiran
            </button>
            <div id="rsvp-comments-container" class="rv" style="margin-top:28px; padding-top:20px; border-top:1px dashed var(--line);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <h3 style="font-family:var(--f-serif); font-size:18px; color:var(--ink); margin:0;">Catatan Kehadiran Tamu</h3>
                <span id="rsvp-comments-count" style="font-family:var(--f-mono); font-size:12px; color:var(--acc-2); background:rgba(154,71,96,0.1); padding:2px 8px; border-radius:999px;">0 Catatan</span>
              </div>
              <p id="rsvp-comments-empty" style="text-align:center; font-style:italic; padding:14px; color:var(--ink-3); font-size:13.5px; margin:0;">Belum ada catatan kehadiran. Jadilah yang pertama memberi kabar!</p>
              <div id="rsvp-comments-list" style="display:grid; gap:10px;"></div>
              <button id="rsvp-more-btn" class="btn btn-ghost btn-sm" type="button" style="display:none; margin:14px auto 0; font-size:13px; border-radius:999px;">
                Muat Catatan Tamu Lainnya
              </button>
            </div>
            <button
              id="rs-checkin"
              class="rs-checkin rv"
              type="button"
              data-wedivo="checkin-cta"
            >
              <svg
                id="rs-checkin-ic"
                class="ic"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <use id="rs_71" href="#ic-gate"></use>
              </svg>
              <span id="rs-checkin-t">Sudah tiba? Check-in di lokasi<\/span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- WISHES â€” "Kebun Doa": every wish grows as a flower with a plant tag -->
    <section
      id="sec-wishes"
      class="sec wishes"
      data-section="wishes"
      data-musim="4"
    >
      <div id="wishes-wrap" class="wrap">
        <header class="sh" id="ws-sh">
          <p class="sh-kicker rv" id="ws-sh-k">
            <svg
              class="sh-glyph"
              id="ws-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-4" id="ws-sh-gu"></use></svg
            ><span class="sh-no" id="ws-sh-no">No. 00</span
            ><span class="sh-season" id="ws-sh-season">Musim Mekar<\/span>
          </p>
          <h2 class="sh-title rv" id="ws-sh-t" style="--d: 0.08s">Kebun Doa</h2>
          <p class="sh-sub rv" id="ws-sh-s" style="--d: 0.16s">
            Tanamkan doamu di sini. Kami akan merawatnya lama sekali.
          </p>
        </header>
        <div id="ws-grid" class="ws-grid">
          <form
            id="ws-form"
            class="form ws-form rv"
            data-wedivo="comments-form"
            onsubmit="return false;"
            action="javascript:void(0);"
          >
            <label id="ws-l-name" class="form-l" for="ws-name">Nama</label>
            <input
              id="ws-name"
              class="form-in"
              name="name"
              type="text"
              placeholder="Nama Anda"
              autocomplete="name"
              required
            />
            <label id="ws-l-msg" class="form-l" for="ws-msg"
              >Doa &amp; harapan</label
            >
            <textarea
              id="ws-msg"
              class="form-in form-ta"
              name="message"
              rows="4"
              placeholder="Tuliskan doa dan harapan untuk kamiâ€¦"
              required
            ></textarea>
            <button id="ws-submit" class="btn form-submit" type="button">
              <svg
                id="ws-submit-ic"
                class="ic"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <use id="ws_1" href="#ri-flower2"></use>
              </svg>
              <span id="ws-submit-t">Tanam doa<\/span>
            </button>
            <p id="ws-error" class="form-error">
              Mohon isi nama dan doa terlebih dahulu.
            </p>
            <p id="ws-done" class="form-done">
              Doa Anda sudah tumbuh di kebun kami. Terima kasih!
            </p>
          </form>
          <div id="ws-bed" class="ws-bed">
            <div id="ws-list" class="ws-list" data-wedivo="comments-list"></div>
            <p id="ws-empty" class="ws-empty">
              Belum ada doa yang tumbuh di sini. Jadilah yang pertama menanam.
            </p>
            <template id="ws-template" data-wedivo="comment-template">
              <article class="comment-card ws-card">
                <svg class="ws-flower" viewBox="0 0 60 76" aria-hidden="true">
                  <use href="#sym-flower"></use>
                </svg>
                <div class="ws-tag">
                  <p class="comment-message ws-msg" data-field="message"></p>
                  <p class="comment-name ws-name" data-field="name"></p>
                  <p class="comment-date ws-date" data-field="date"></p>
                </div>
              </article>
            </template>
            <button
              id="ws-more"
              class="btn btn-ghost btn-sm ws-more"
              type="button"
              data-wedivo="comments-more"
            >
              <svg
                id="ws-more-ic"
                class="ic"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <use id="ws_2" href="#ri-leaf"></use>
              </svg>
              <span id="ws-more-t">Lihat doa lainnya<\/span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- NANTI â€” "Tumbuh Tua Bersama": drag the years forward; the tree grows,
the seasons turn, and small proofs of a shared life gather under it -->
    <section
      id="sec-nanti"
      class="sec nanti"
      data-section="nanti"
      data-musim="1"
    >
      <div id="nanti-wrap" class="wrap">
        <header class="sh" id="nt-sh">
          <p class="sh-kicker rv" id="nt-sh-k">
            <svg
              class="sh-glyph"
              id="nt-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-1" id="nt-sh-gu"></use></svg
            ><span class="sh-no" id="nt-sh-no">No. 00</span
            ><span class="sh-season" id="nt-sh-season">Musim Panas<\/span>
          </p>
          <h2 class="sh-title rv" id="nt-sh-t" style="--d: 0.08s">
            Tumbuh Tua Bersama
          </h2>
          <p class="sh-sub rv" id="nt-sh-s" style="--d: 0.16s">
            Kami tidak tahu seperti apa musim-musim berikutnya. Tapi kami tahu
            ingin melewatinya di mana: di bawah pohon yang sama.
          </p>
        </header>
        <div id="nt-grid" class="nt-grid">
          <figure id="nt-stage" class="nt-stage rv rv-pop">
            <canvas
              id="nt-canvas"
              class="nt-canvas"
              width="8"
              height="8"
              aria-hidden="true"
            ></canvas>
            <p id="nt-badge" class="nt-badge" aria-hidden="true">
              <span id="nt-badge-k">tahun ke-</span
              ><span id="nt-badge-n" class="nt-badge-n">0<\/span>
            </p>
            <p id="nt-season" class="nt-season" aria-hidden="true">
              <svg id="nt-season-ic" class="nt-season-ic" viewBox="0 0 24 24">
                <use id="nt-season-use" href="#sym-musim-0"></use>
              </svg>
              <span id="nt-season-t">Musim Semi<\/span>
            </p>
          </figure>
          <div id="nt-side" class="nt-side">
            <div id="nt-ctrl" class="nt-ctrl rv">
              <label id="nt-range-l" class="nt-range-l" for="nt-range"
                >Geser tahunnya</label
              >
              <input
                id="nt-range"
                class="nt-range"
                type="range"
                min="0"
                max="500"
                step="1"
                value="0"
              />
              <div id="nt-scale" class="nt-scale" aria-hidden="true">
                <span id="nt-scale-a">hari ini</span
                ><span id="nt-scale-b"
                  >tahun ke-<span id="nt-scale-max">50<\/span></span
                >
              </div>
            </div>
            <ol id="nt-hopes" class="nt-hopes">
              <li
                id="nt-hope-1"
                class="nt-hope rv"
                data-year="1"
              >
                <button id="nt-hope-1-b" class="nt-hope-b" type="button">
                  <span id="nt-hope-1-y" class="nt-hope-y"
                    >Tahun ke-<span id="nt-hope-1-yv"
                      >1</span
                    ></span
                  ><span id="nt-hope-1-t" class="nt-hope-t"
                    >Rumah kecil dengan jendela menghadap timur, supaya pagi selalu masuk lebih dulu.</span
                  >
                </button>
              </li>
              <li
                id="nt-hope-2"
                class="nt-hope rv"
                data-year="5"
                style="--d: 0.06s"
              >
                <button id="nt-hope-2-b" class="nt-hope-b" type="button">
                  <span id="nt-hope-2-y" class="nt-hope-y"
                    >Tahun ke-<span id="nt-hope-2-yv"
                      >5</span
                    ></span
                  ><span id="nt-hope-2-t" class="nt-hope-t"
                    >Ayunan di dahan paling rendah, dan kebun sayur yang separuhnya dimakan ulat.</span
                  >
                </button>
              </li>
              <li
                id="nt-hope-3"
                class="nt-hope rv"
                data-year="25"
                style="--d: 0.12s"
              >
                <button id="nt-hope-3-b" class="nt-hope-b" type="button">
                  <span id="nt-hope-3-y" class="nt-hope-y"
                    >Tahun ke-<span id="nt-hope-3-yv"
                      >25</span
                    ></span
                  ><span id="nt-hope-3-t" class="nt-hope-t"
                    >Pernikahan perak. Masih berebut selimut, masih saling menunggu pulang.</span
                  >
                </button>
              </li>
              <li
                id="nt-hope-4"
                class="nt-hope rv"
                data-year="50"
                style="--d: 0.18s"
              >
                <button id="nt-hope-4-b" class="nt-hope-b" type="button">
                  <span id="nt-hope-4-y" class="nt-hope-y"
                    >Tahun ke-<span id="nt-hope-4-yv"
                      >50</span
                    ></span
                  ><span id="nt-hope-4-t" class="nt-hope-t"
                    >Pernikahan emas. Bangku yang sama, pohon yang sama, dan tangan yang masih saling mencari.</span
                  >
                </button>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <!-- CLOSING â€” "Musim Semi Berikutnya": the braided tree in full bloom,
every guest's seedling in the grass around it -->
    <footer
      id="sec-closing"
      class="closing"
      data-section="closing"
      data-musim="4"
    >
      <div id="cl-scene" class="cl-scene" aria-hidden="true">
        <canvas id="cl-canvas" class="cl-canvas" width="8" height="8"></canvas>
      </div>
      <button
        id="cl-tree-hit"
        class="cl-tree-hit"
        type="button"
        aria-label="Goyangkan pohon kami"
      ></button>
      <div id="cl-wrap" class="cl-wrap">
        <header class="sh" id="cl-sh">
          <p class="sh-kicker rv" id="cl-sh-k">
            <svg
              class="sh-glyph"
              id="cl-sh-g"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="#sym-musim-4" id="cl-sh-gu"></use></svg
            ><span class="sh-no" id="cl-sh-no">No. 00</span
            ><span class="sh-season" id="cl-sh-season">Musim Mekar<\/span>
          </p>
          <h2 class="sh-title rv" id="cl-sh-t" style="--d: 0.08s">
            Musim Semi Berikutnya
          </h2>
        </header>
        <div id="cl-card" class="cl-card paper rv">
          <figure id="cl-photo" class="cl-photo" data-photo="https://wedivo.id/uploads/PaqKKqe1mjcttlp7BhAqMiY7tsk2/couplePhoto_1790836788.jpg">
            <span id="cl-photo-in" class="cl-photo-in"
              ><img
                id="cl-photo-img"
                class="photo-img"
                src="https://wedivo.id/uploads/PaqKKqe1mjcttlp7BhAqMiY7tsk2/couplePhoto_1790836788.jpg"
                alt="Foto Nurizzati Islamiyah dan Badriana"
                loading="lazy"
            /><\/span>
            <svg
              id="cl-wreath"
              class="cl-wreath"
              viewBox="0 0 200 200"
              aria-hidden="true"
            >
              <circle
                id="cl_1"
                cx="100"
                cy="100"
                r="86"
                fill="none"
                stroke="#b89a62"
                stroke-width="1.4"
              ></circle>
              <g id="cl_2" class="cl-wreath-l" fill="#7c985c">
                <path
                  id="cl_3"
                  d="M40 150c-9-2-15-9-15-18 9 1 15 8 15 18z"
                ></path>
                <path
                  id="cl_4"
                  d="M26 118c-8-5-11-13-9-21 8 4 11 12 9 21z"
                ></path>
                <path id="cl_5" d="M24 84c-5-8-5-16-1-23 6 6 7 15 1 23z"></path>
                <path id="cl_6" d="M34 54c-2-9 1-17 7-22 3 8 1 17-7 22z"></path>
              </g>
              <g id="cl_7" class="cl-wreath-r" fill="#8db870">
                <path
                  id="cl_8"
                  d="M160 150c9-2 15-9 15-18-9 1-15 8-15 18z"
                ></path>
                <path
                  id="cl_9"
                  d="M174 118c8-5 11-13 9-21-8 4-11 12-9 21z"
                ></path>
                <path
                  id="cl_10"
                  d="M176 84c5-8 5-16 1-23-6 6-7 15-1 23z"
                ></path>
                <path
                  id="cl_11"
                  d="M166 54c2-9-1-17-7-22-3 8-1 17 7 22z"
                ></path>
              </g>
              <g id="cl_12" class="cl-wreath-b" fill="#f1b8c4">
                <circle id="cl_13" cx="100" cy="186" r="6"></circle>
                <circle id="cl_14" cx="90" cy="182" r="4.5"></circle>
                <circle id="cl_15" cx="110" cy="182" r="4.5"></circle>
                <circle
                  id="cl_16"
                  cx="100"
                  cy="186"
                  r="2.4"
                  fill="#e8b746"
                ></circle>
              </g>
            </svg>
          </figure>
          <p id="cl-text" class="cl-text rich">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Terima kasih telah menjadi bagian dari musim-musim kami.</p>
          <p id="cl-salam" class="cl-salam">Wassalamu'alaikum Warahmatullahi Wabarakatuh</p>
          <p id="cl-we" class="cl-we">Kami yang berbahagia,</p>
          <p id="cl-names" class="cl-names">
            <span id="cl-name-a">Nurizzati Islamiyah<\/span>
            <span id="cl-amp" class="cl-amp">&amp;<\/span>
            <span id="cl-name-b">Badriana<\/span>
          </p>
          <p id="cl-family" class="cl-family">Keluarga Besar Bapak Sugeng Riyadi & Keluarga Besar Bapak Hendro Wicaksono</p>
          <div id="cl-turut" class="cl-turut">
            <p id="cl-turut-k" class="cl-turut-k">Turut mengundang</p>
            <p id="cl-turut-v" class="cl-turut-v rich">Keluarga besar Riyadi di Wonosobo
Keluarga besar Wicaksono di Balikpapan
Rekan-rekan Relawan Seribu Pohon</p>
          </div>
          <p id="cl-hashtag" class="cl-hashtag">#AsriBumiTumbuhBersama</p>
        </div>
        <button id="cl-top" class="btn btn-ghost cl-top rv" type="button">
          <svg id="cl-top-ic" class="ic" viewBox="0 0 24 24" aria-hidden="true">
            <use id="cl_17" href="#ic-seed"></use>
          </svg>
          <span id="cl-top-t">Kembali ke benih<\/span>
        </button>
        <p id="cl-foot" class="cl-foot">Tumbuh bersama, musim demi musim.</p>
      </div>
    </footer>

    <!-- NAVIGATION â€” a garden rail: every section is a plant; the season dial
opens the whole "Peta Kebun" (garden map). Items are flat siblings. -->
    <nav id="nav" class="nav" data-wedivo="nav" aria-label="Navigasi undangan">
      <div id="nav-head" class="nav-head">
        <p id="nav-head-k" class="nav-head-k">Peta kebun</p>
        <p id="nav-head-t" class="nav-head-t">Semua petak di undangan kami</p>
        <button
          id="nav-close"
          class="nav-close"
          type="button"
          aria-label="Tutup peta kebun"
        >
          <svg
            id="nav-close-ic"
            class="ic"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <use id="cl_18" href="#ic-close"></use>
          </svg>
        </button>
      </div>
      <button
        id="nav-dial"
        class="nav-dial"
        type="button"
        aria-label="Buka peta kebun"
        aria-expanded="false"
        aria-controls="nav-rail"
      >
        <svg
          id="nav-dial-svg"
          class="nav-dial-svg"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <g id="nav-dial-ring" transform="rotate(-90 24 24)">
            <circle
              id="nav-dial-q0"
              cx="24"
              cy="24"
              r="19"
              fill="none"
              stroke="#e7a3b1"
              stroke-width="6"
              stroke-dasharray="28.8 90.6"
            ></circle>
            <circle
              id="nav-dial-q1"
              cx="24"
              cy="24"
              r="19"
              fill="none"
              stroke="#8db870"
              stroke-width="6"
              stroke-dasharray="28.8 90.6"
              stroke-dashoffset="-29.85"
            ></circle>
            <circle
              id="nav-dial-q2"
              cx="24"
              cy="24"
              r="19"
              fill="none"
              stroke="#d58b2c"
              stroke-width="6"
              stroke-dasharray="28.8 90.6"
              stroke-dashoffset="-59.7"
            ></circle>
            <circle
              id="nav-dial-q3"
              cx="24"
              cy="24"
              r="19"
              fill="none"
              stroke="#9fb9c6"
              stroke-width="6"
              stroke-dasharray="28.8 90.6"
              stroke-dashoffset="-89.55"
            ></circle>
          </g>
          <g id="nav-dial-hand" class="nav-dial-hand">
            <path
              id="cl_19"
              d="M24 24V9"
              stroke="#2d3a24"
              stroke-width="2.4"
              stroke-linecap="round"
            ></path>
            <circle id="cl_20" cx="24" cy="24" r="3.2" fill="#2d3a24"></circle>
          </g>
        </svg>
        <span id="nav-dial-t" class="nav-dial-t">Semi<\/span>
      </button>
      <div id="nav-rail" class="nav-rail">
        <button
          id="nav-i-hero"
          class="nv"
          type="button"
          data-nav-target="hero"
          data-m="0"
          aria-label="Benih"
        >
          <span id="nav-i-hero-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-hero-svg" viewBox="0 0 24 24">
              <use id="cl_21" href="#nv-hero"></use></svg></span
          ><span id="nav-i-hero-tx" class="nv-tx"
            ><span id="nav-i-hero-no" class="nv-no">00</span
            ><span id="nav-i-hero-lbl" class="nv-lbl">Benih</span
            ><span id="nav-i-hero-m" class="nv-m">Musim Semi<\/span></span
          >
        </button>
        <button
          id="nav-i-salam"
          class="nv"
          type="button"
          data-nav-target="salam"
          data-m="0"
          aria-label="Salam"
        >
          <span id="nav-i-salam-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-salam-svg" viewBox="0 0 24 24">
              <use id="cl_22" href="#nv-salam"></use></svg></span
          ><span id="nav-i-salam-tx" class="nv-tx"
            ><span id="nav-i-salam-no" class="nv-no">00</span
            ><span id="nav-i-salam-lbl" class="nv-lbl">Salam</span
            ><span id="nav-i-salam-m" class="nv-m">Musim Semi<\/span></span
          >
        </button>
        <button
          id="nav-i-couple"
          class="nv"
          type="button"
          data-nav-target="couple"
          data-m="0"
          aria-label="Mempelai"
        >
          <span id="nav-i-couple-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-couple-svg" viewBox="0 0 24 24">
              <use id="cl_23" href="#nv-couple"></use></svg></span
          ><span id="nav-i-couple-tx" class="nv-tx"
            ><span id="nav-i-couple-no" class="nv-no">00</span
            ><span id="nav-i-couple-lbl" class="nv-lbl">Mempelai</span
            ><span id="nav-i-couple-m" class="nv-m">Musim Semi<\/span></span
          >
        </button>
        <button
          id="nav-i-inoskulasi"
          class="nv"
          type="button"
          data-nav-target="inoskulasi"
          data-m="0"
          aria-label="Inoskulasi"
        >
          <span id="nav-i-inoskulasi-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-inoskulasi-svg" viewBox="0 0 24 24">
              <use id="cl_24" href="#nv-inoskulasi"></use></svg></span
          ><span id="nav-i-inoskulasi-tx" class="nv-tx"
            ><span id="nav-i-inoskulasi-no" class="nv-no">00</span
            ><span id="nav-i-inoskulasi-lbl" class="nv-lbl">Inoskulasi</span
            ><span id="nav-i-inoskulasi-m" class="nv-m">Musim Semi<\/span></span
          >
        </button>
        <button
          id="nav-i-story"
          class="nv"
          type="button"
          data-nav-target="story"
          data-m="1"
          aria-label="Kisah"
        >
          <span id="nav-i-story-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-story-svg" viewBox="0 0 24 24">
              <use id="cl_25" href="#nv-story"></use></svg></span
          ><span id="nav-i-story-tx" class="nv-tx"
            ><span id="nav-i-story-no" class="nv-no">00</span
            ><span id="nav-i-story-lbl" class="nv-lbl">Kisah</span
            ><span id="nav-i-story-m" class="nv-m">Musim Panas<\/span></span
          >
        </button>
        <button
          id="nav-i-gallery"
          class="nv"
          type="button"
          data-nav-target="gallery"
          data-m="1"
          aria-label="Galeri"
        >
          <span id="nav-i-gallery-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-gallery-svg" viewBox="0 0 24 24">
              <use id="cl_26" href="#nv-gallery"></use></svg></span
          ><span id="nav-i-gallery-tx" class="nv-tx"
            ><span id="nav-i-gallery-no" class="nv-no">00</span
            ><span id="nav-i-gallery-lbl" class="nv-lbl">Galeri</span
            ><span id="nav-i-gallery-m" class="nv-m">Musim Panas<\/span></span
          >
        </button>
        <button
          id="nav-i-gugur"
          class="nv"
          type="button"
          data-nav-target="gugur"
          data-m="2"
          aria-label="Gugur"
        >
          <span id="nav-i-gugur-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-gugur-svg" viewBox="0 0 24 24">
              <use id="cl_27" href="#nv-gugur"></use></svg></span
          ><span id="nav-i-gugur-tx" class="nv-tx"
            ><span id="nav-i-gugur-no" class="nv-no">00</span
            ><span id="nav-i-gugur-lbl" class="nv-lbl">Gugur</span
            ><span id="nav-i-gugur-m" class="nv-m">Musim Gugur<\/span></span
          >
        </button>
        <button
          id="nav-i-lingkaran"
          class="nv"
          type="button"
          data-nav-target="lingkaran"
          data-m="2"
          aria-label="Lingkaran"
        >
          <span id="nav-i-lingkaran-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-lingkaran-svg" viewBox="0 0 24 24">
              <use id="cl_28" href="#nv-lingkaran"></use></svg></span
          ><span id="nav-i-lingkaran-tx" class="nv-tx"
            ><span id="nav-i-lingkaran-no" class="nv-no">00</span
            ><span id="nav-i-lingkaran-lbl" class="nv-lbl">Lingkaran</span
            ><span id="nav-i-lingkaran-m" class="nv-m">Musim Gugur<\/span></span
          >
        </button>
        <button
          id="nav-i-countdown"
          class="nv"
          type="button"
          data-nav-target="countdown"
          data-m="3"
          aria-label="Menanti"
        >
          <span id="nav-i-countdown-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-countdown-svg" viewBox="0 0 24 24">
              <use id="cl_29" href="#nv-countdown"></use></svg></span
          ><span id="nav-i-countdown-tx" class="nv-tx"
            ><span id="nav-i-countdown-no" class="nv-no">00</span
            ><span id="nav-i-countdown-lbl" class="nv-lbl">Menanti</span
            ><span id="nav-i-countdown-m" class="nv-m">Musim Dingin<\/span></span
          >
        </button>
        <button
          id="nav-i-events"
          class="nv"
          type="button"
          data-nav-target="events"
          data-m="4"
          aria-label="Acara"
        >
          <span id="nav-i-events-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-events-svg" viewBox="0 0 24 24">
              <use id="cl_30" href="#nv-events"></use></svg></span
          ><span id="nav-i-events-tx" class="nv-tx"
            ><span id="nav-i-events-no" class="nv-no">00</span
            ><span id="nav-i-events-lbl" class="nv-lbl">Acara</span
            ><span id="nav-i-events-m" class="nv-m">Musim Mekar<\/span></span
          >
        </button>
        <button
          id="nav-i-rundown"
          class="nv"
          type="button"
          data-nav-target="rundown"
          data-m="4"
          aria-label="Susunan"
        >
          <span id="nav-i-rundown-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-rundown-svg" viewBox="0 0 24 24">
              <use id="cl_31" href="#nv-rundown"></use></svg></span
          ><span id="nav-i-rundown-tx" class="nv-tx"
            ><span id="nav-i-rundown-no" class="nv-no">00</span
            ><span id="nav-i-rundown-lbl" class="nv-lbl">Susunan</span
            ><span id="nav-i-rundown-m" class="nv-m">Musim Mekar<\/span></span
          >
        </button>
        <button
          id="nav-i-venue"
          class="nv"
          type="button"
          data-nav-target="venue"
          data-m="4"
          aria-label="Lokasi"
        >
          <span id="nav-i-venue-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-venue-svg" viewBox="0 0 24 24">
              <use id="cl_32" href="#nv-venue"></use></svg></span
          ><span id="nav-i-venue-tx" class="nv-tx"
            ><span id="nav-i-venue-no" class="nv-no">00</span
            ><span id="nav-i-venue-lbl" class="nv-lbl">Lokasi</span
            ><span id="nav-i-venue-m" class="nv-m">Musim Mekar<\/span></span
          >
        </button>
        <button
          id="nav-i-dresscode"
          class="nv"
          type="button"
          data-nav-target="dresscode"
          data-m="4"
          aria-label="Busana"
        >
          <span id="nav-i-dresscode-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-dresscode-svg" viewBox="0 0 24 24">
              <use id="cl_33" href="#nv-dresscode"></use></svg></span
          ><span id="nav-i-dresscode-tx" class="nv-tx"
            ><span id="nav-i-dresscode-no" class="nv-no">00</span
            ><span id="nav-i-dresscode-lbl" class="nv-lbl">Busana</span
            ><span id="nav-i-dresscode-m" class="nv-m">Musim Mekar<\/span></span
          >
        </button>
        <button
          id="nav-i-petunjuk"
          class="nv"
          type="button"
          data-nav-target="petunjuk"
          data-m="4"
          aria-label="Petunjuk"
        >
          <span id="nav-i-petunjuk-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-petunjuk-svg" viewBox="0 0 24 24">
              <use id="cl_34" href="#nv-petunjuk"></use></svg></span
          ><span id="nav-i-petunjuk-tx" class="nv-tx"
            ><span id="nav-i-petunjuk-no" class="nv-no">00</span
            ><span id="nav-i-petunjuk-lbl" class="nv-lbl">Petunjuk</span
            ><span id="nav-i-petunjuk-m" class="nv-m">Musim Mekar<\/span></span
          >
        </button>
        <button
          id="nav-i-video"
          class="nv"
          type="button"
          data-nav-target="video"
          data-m="4"
          aria-label="Video"
        >
          <span id="nav-i-video-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-video-svg" viewBox="0 0 24 24">
              <use id="cl_35" href="#nv-video"></use></svg></span
          ><span id="nav-i-video-tx" class="nv-tx"
            ><span id="nav-i-video-no" class="nv-no">00</span
            ><span id="nav-i-video-lbl" class="nv-lbl">Video</span
            ><span id="nav-i-video-m" class="nv-m">Musim Mekar<\/span></span
          >
        </button>
        <button
          id="nav-i-gifts"
          class="nv"
          type="button"
          data-nav-target="gifts"
          data-m="4"
          aria-label="Kado"
        >
          <span id="nav-i-gifts-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-gifts-svg" viewBox="0 0 24 24">
              <use id="cl_36" href="#nv-gifts"></use></svg></span
          ><span id="nav-i-gifts-tx" class="nv-tx"
            ><span id="nav-i-gifts-no" class="nv-no">00</span
            ><span id="nav-i-gifts-lbl" class="nv-lbl">Kado</span
            ><span id="nav-i-gifts-m" class="nv-m">Musim Mekar<\/span></span
          >
        </button>
        <button
          id="nav-i-rsvp"
          class="nv"
          type="button"
          data-nav-target="rsvp"
          data-m="4"
          aria-label="Kehadiran"
        >
          <span id="nav-i-rsvp-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-rsvp-svg" viewBox="0 0 24 24">
              <use id="cl_37" href="#nv-rsvp"></use></svg></span
          ><span id="nav-i-rsvp-tx" class="nv-tx"
            ><span id="nav-i-rsvp-no" class="nv-no">00</span
            ><span id="nav-i-rsvp-lbl" class="nv-lbl">Kehadiran</span
            ><span id="nav-i-rsvp-m" class="nv-m">Musim Mekar<\/span></span
          >
        </button>
        <button
          id="nav-i-wishes"
          class="nv"
          type="button"
          data-nav-target="wishes"
          data-m="4"
          aria-label="Doa"
        >
          <span id="nav-i-wishes-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-wishes-svg" viewBox="0 0 24 24">
              <use id="cl_38" href="#nv-wishes"></use></svg></span
          ><span id="nav-i-wishes-tx" class="nv-tx"
            ><span id="nav-i-wishes-no" class="nv-no">00</span
            ><span id="nav-i-wishes-lbl" class="nv-lbl">Doa</span
            ><span id="nav-i-wishes-m" class="nv-m">Musim Mekar<\/span></span
          >
        </button>
        <button
          id="nav-i-nanti"
          class="nv"
          type="button"
          data-nav-target="nanti"
          data-m="1"
          aria-label="Nanti"
        >
          <span id="nav-i-nanti-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-nanti-svg" viewBox="0 0 24 24">
              <use id="cl_39" href="#nv-nanti"></use></svg></span
          ><span id="nav-i-nanti-tx" class="nv-tx"
            ><span id="nav-i-nanti-no" class="nv-no">00</span
            ><span id="nav-i-nanti-lbl" class="nv-lbl">Nanti</span
            ><span id="nav-i-nanti-m" class="nv-m">Musim Panas<\/span></span
          >
        </button>
        <button
          id="nav-i-closing"
          class="nv"
          type="button"
          data-nav-target="closing"
          data-m="4"
          aria-label="Penutup"
        >
          <span id="nav-i-closing-ic" class="nv-ic" aria-hidden="true"
            ><svg id="nav-i-closing-svg" viewBox="0 0 24 24">
              <use id="cl_40" href="#nv-closing"></use></svg></span
          ><span id="nav-i-closing-tx" class="nv-tx"
            ><span id="nav-i-closing-no" class="nv-no">00</span
            ><span id="nav-i-closing-lbl" class="nv-lbl">Penutup</span
            ><span id="nav-i-closing-m" class="nv-m">Musim Mekar<\/span></span
          >
        </button>
      </div>
      <button
        id="nav-sound"
        class="nav-sound"
        type="button"
        aria-label="Suara"
        aria-pressed="true"
      >
        <svg
          id="nav-sound-ic"
          class="ic"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <use id="cl_41" href="#ic-chime"></use>
        </svg>
        <span id="nav-sound-x" class="nav-sound-x" aria-hidden="true"><\/span>
      </button>
    </nav>

    <!-- PHOTO VIEWER â€” opens a herbarium sheet full screen -->
    <div
      id="viewer"
      class="viewer"
      role="dialog"
      aria-modal="true"
      aria-label="Penampil foto"
      aria-hidden="true"
    >
      <div id="viewer-bg" class="viewer-bg"></div>
      <figure id="viewer-fig" class="viewer-fig">
        <div id="viewer-sheet" class="viewer-sheet">
          <img
            id="viewer-img"
            class="viewer-img"
            src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
            alt=""
          />
        </div>
        <figcaption id="viewer-cap" class="viewer-cap"></figcaption>
      </figure>
      <div id="viewer-bar" class="viewer-bar">
        <button
          id="viewer-prev"
          class="viewer-btn"
          type="button"
          aria-label="Foto sebelumnya"
        >
          <svg
            id="viewer-prev-ic"
            class="ic"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <use id="cl_42" href="#ic-prev"></use>
          </svg>
        </button>
        <span id="viewer-count" class="viewer-count">1 / 1<\/span>
        <button
          id="viewer-next"
          class="viewer-btn"
          type="button"
          aria-label="Foto berikutnya"
        >
          <svg
            id="viewer-next-ic"
            class="ic"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <use id="cl_43" href="#ic-next"></use>
          </svg>
        </button>
        <button
          id="viewer-close"
          class="viewer-btn viewer-close"
          type="button"
          aria-label="Tutup penampil"
        >
          <svg
            id="viewer-close-ic"
            class="ic"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <use id="cl_44" href="#ic-close"></use>
          </svg>
        </button>
      </div>
    </div>
    
  

`;

export function getTumbuhBersamaHtml(data: any, guestName?: string | null): string {
  const bride = data?.namaPutri || 'Nurizzati';
  const groom = data?.namaPutra || 'Badri';
  const brideFull = data?.namaLengkapPutri || data?.namaPutri || 'Nurizzati Islamiyah';
  const groomFull = data?.namaLengkapPutra || data?.namaPutra || 'Badriana';

  const brideFather = data?.namaAyahPutri ? 'Bpk. ' + data.namaAyahPutri : '';
  const brideMother = data?.namaIbuPutri ? 'Ibu ' + data.namaIbuPutri : '';
  const brideParents = [brideFather, brideMother].filter(Boolean).join(' & ') || 'Keluarga Mempelai Wanita';

  const groomFather = data?.namaAyahPutra ? 'Bpk. ' + data.namaAyahPutra : '';
  const groomMother = data?.namaIbuPutra ? 'Ibu ' + data.namaIbuPutra : '';
  const groomParents = [groomFather, groomMother].filter(Boolean).join(' & ') || 'Keluarga Mempelai Pria';

  const bridePhoto = data?.photoPutri || '/assets/templates/tumbuh-bersama/bridePhoto_1790836741.jpg';
  const groomPhoto = data?.photoPutra || '/assets/templates/tumbuh-bersama/groomPhoto_1790836746.jpg';
  const couplePhoto = data?.fotoHeader || data?.fotoHeader2 || '/assets/templates/tumbuh-bersama/couplePhoto_1790836788.jpg';

  // Acara Akad
  const akadDate = data?.tanggalAkad || data?.tanggalPernikahan;
  const akadDateFormatted = formatTanggalIndo(akadDate);
  const akadVenue = data?.lokasiAkad || data?.alamatGedungPernikahan || 'Kediaman Mempelai Wanita';
  const akadAddr = data?.alamatAkad || data?.alamatPernikahan || 'Alamat lengkap acara akad';

  // Acara Resepsi
  const resepsiDate = data?.tanggalResepsi || data?.tanggalPernikahan;
  const resepsiDateFormatted = formatTanggalIndo(resepsiDate);
  const resepsiVenue = data?.lokasiResepsi || data?.alamatGedungPernikahan || 'Gedung Pernikahan';
  const resepsiAddr = data?.alamatResepsi || data?.alamatPernikahan || 'Alamat lengkap resepsi';

  // Helper konversi format YYYY-MM-DD
  const toYmd = (dateVal: any, fallback: string) => {
    if (!dateVal) return fallback;
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return fallback;
    return d.toISOString().slice(0, 10);
  };

  const weddingDate = data?.tanggalPernikahan || data?.tanggalAkad || new Date();
  const weddingDateFormatted = formatTanggalIndo(weddingDate);
  const weddingDateYmd = toYmd(weddingDate, '2026-10-30');
  const akadDateYmd = toYmd(akadDate, weddingDateYmd);
  const resepsiDateYmd = toYmd(resepsiDate, weddingDateYmd);

  // Helper pemecah jam mulai & selesai
  const parseRange = (raw: string | undefined, defaultStart: string, defaultEnd: string) => {
    if (!raw) return { start: defaultStart, end: defaultEnd };
    const parts = raw.split(/[-–—]/).map((s) => s.trim().replace('.', ':').slice(0, 5));
    return {
      start: parts[0] || defaultStart,
      end: parts[1] || defaultEnd,
    };
  };

  const akadTimes = parseRange(data?.jamAkad || data?.jamMulai, '08:00', '10:00');
  const resepsiTimes = parseRange(
    data?.jamResepsi || (data?.jamMulai && data?.jamSelesai ? `${data.jamMulai} - ${data.jamSelesai}` : undefined),
    '11:00',
    '14:00'
  );

  const mapsLink = data?.linkMaps || 'https://maps.google.com';
  const calLink = data?.linkGoogleCalender || 'https://calendar.google.com';
  const audioUrl = data?.audio || data?.musik?.file || '/audio/canon-in-d.mp3';

  // Instagram Groom & Bride
  const cleanIg = (raw: string | undefined | null) => {
    if (!raw) return '';
    let handle = String(raw).trim();
    if (handle.startsWith('https://instagram.com/')) {
      handle = handle.replace('https://instagram.com/', '').replace('/', '');
    } else if (handle.startsWith('http://instagram.com/')) {
      handle = handle.replace('http://instagram.com/', '').replace('/', '');
    } else if (handle.startsWith('@')) {
      handle = handle.slice(1);
    }
    return handle;
  };

  const brideIgHandle = cleanIg(data?.instagramPutri) ? `@${cleanIg(data?.instagramPutri)}` : `@${bride.toLowerCase().replace(/\s+/g, '')}`;
  const brideIgUrl = cleanIg(data?.instagramPutri)
    ? `https://instagram.com/${cleanIg(data?.instagramPutri)}`
    : `https://instagram.com/`;
  const groomIgHandle = cleanIg(data?.instagramPutra) ? `@${cleanIg(data?.instagramPutra)}` : `@${groom.toLowerCase().replace(/\s+/g, '')}`;
  const groomIgUrl = cleanIg(data?.instagramPutra)
    ? `https://instagram.com/${cleanIg(data?.instagramPutra)}`
    : `https://instagram.com/`;

  // Bio & Kelahiran
  const brideKelahiran = data?.kelahiranPutri || 'Putri tercinta';
  const groomKelahiran = data?.kelahiranPutra || 'Putra tercinta';

  // Love Gift (Rekening ATM & WhatsApp)
  const namaBank = data?.namaBank || 'Bank BCA';
  const noAtm = data?.noAtm || '';
  const fotoQris = data?.fotoQris || '';
  const noHp = data?.noHp || '';
  const isGiftActive = data?.isGiftActive !== false;
  const isBankActive = data?.isBankActive !== false && !!noAtm;
  const isQrisActive = data?.isQrisActive !== false && !!fotoQris;

  let cleanPhone = (noHp || '').replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
  else if (cleanPhone && !cleanPhone.startsWith('62')) cleanPhone = '62' + cleanPhone;
  const waMessage = encodeURIComponent(
    `Halo ${bride} & ${groom}, saya ingin konfirmasi pengiriman tanda kasih / hadiah pernikahan. Terima kasih.`
  );
  const whatsappUrl = cleanPhone ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${waMessage}` : '#';

  // Love Story (Pertemuan 1 - 4 & Foto Bersama)
  let bersamaList: any[] = [];
  if (Array.isArray(data?.bersamaFotos)) {
    bersamaList = data.bersamaFotos;
  } else if (typeof data?.bersamaFotos === 'string' && data.bersamaFotos) {
    try {
      const parsed = JSON.parse(data.bersamaFotos);
      if (Array.isArray(parsed)) bersamaList = parsed;
    } catch {}
  }

  const story1Photo = bersamaList[0] || '/assets/templates/tumbuh-bersama/gallery_1.jpg';
  const story2Photo = bersamaList[1] || '/assets/templates/tumbuh-bersama/gallery_2.jpg';
  const story3Photo = bersamaList[2] || '/assets/templates/tumbuh-bersama/gallery_3.jpg';
  const story4Photo = bersamaList[3] || '/assets/templates/tumbuh-bersama/1790250424_e33e7208.jpg';

  const dContent = getTumbuhBersamaContent(data?.customContent);

  const pertemuan = data?.pertemuan;
  const story1Title = dContent.story1Title || pertemuan?.judulPertemuanSatu || 'Musim tunas pertama';
  const story1Time = dContent.story1Time || 'April 2019';
  const story1Text =
    dContent.story1Story ||
    pertemuan?.pertemuanPertama ||
    'Kami pertama kali bertemu dan saling menyapa, mengawali kisah perjalanan indah yang mulai berakar perlahan.';
  const story2Title = dContent.story2Title || pertemuan?.judulPertemuanDua || 'Musim yang rimbun';
  const story2Time = dContent.story2Time || '2020 – 2022';
  const story2Text =
    dContent.story2Story ||
    pertemuan?.pertemuanKedua ||
    'Tahun-tahun hangat saat kami saling belajar, bertumbuh dewasa bersama, dan saling menguatkan dalam setiap langkah.';
  const story3Title = dContent.story3Title || pertemuan?.judulPertemuanTiga || 'Musim melepas';
  const story3Time = dContent.story3Time || '2023';
  const story3Text =
    dContent.story3Story ||
    pertemuan?.pertemuanKetiga ||
    'Bumi pindah kerja ke Balikpapan. Ada yang harus kami lepas: temu setiap akhir pekan, rencana-rencana kecil, dan gengsi. Yang tertinggal justru yang paling penting.';
  const story4Title = dContent.story4Title || pertemuan?.judulPertemuanEmpat || 'Musim mengakar';
  const story4Time = dContent.story4Time || 'Desember 2025';
  const story4Text =
    dContent.story4Story ||
    pertemuan?.pertemuanKeempat ||
    'Di musim yang paling sunyi, akar tumbuh paling dalam. Di bawah hujan Desember, Bumi bertanya, dan Asri menjawab ya—sambil menahan tawa karena cincinnya kebesaran.';

  const finalStory1Photo = dContent.story1Photo || story1Photo;
  const finalStory2Photo = dContent.story2Photo || story2Photo;
  const finalStory3Photo = dContent.story3Photo || story3Photo;
  const finalStory4Photo = dContent.story4Photo || story4Photo;

  // Tanggal pertama bertemu (Inoskulasi & Lingkaran Tahun)
  let metYmd = '2019-04-13';
  if (dContent.tglPertamaBertemu) {
    const rawMet = dContent.tglPertamaBertemu.trim();
    if (rawMet.includes('/')) {
      const parts = rawMet.split('/');
      if (parts.length === 3) {
        metYmd = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    } else if (rawMet.includes('-')) {
      metYmd = rawMet;
    }
  }

  let output = BASE_TUMBUH_BERSAMA_HTML;

  // 1. Data teks sumber (#src)
  output = output.replace(new RegExp('<span id="src-bride">[^<]*<\\/span>'), '<span id="src-bride">' + escapeHtml(bride) + '</span>');
  output = output.replace(new RegExp('<span id="src-groom">[^<]*<\\/span>'), '<span id="src-groom">' + escapeHtml(groom) + '</span>');
  output = output.replace(new RegExp('<span id="src-bride-full">[^<]*<\\/span>'), '<span id="src-bride-full">' + escapeHtml(brideFull) + '</span>');
  output = output.replace(new RegExp('<span id="src-groom-full">[^<]*<\\/span>'), '<span id="src-groom-full">' + escapeHtml(groomFull) + '</span>');
  output = output.replace(new RegExp('<span id="src-venue">[^<]*<\\/span>'), '<span id="src-venue">' + escapeHtml(akadVenue) + '</span>');
  output = output.replace(new RegExp('<span id="src-address">[^<]*<\\/span>'), '<span id="src-address">' + escapeHtml(akadAddr) + '</span>');

  // Suntikkan wedding ISO untuk countdown dinamis di engine botani
  const weddingIsoStr = `${weddingDateYmd}T${akadTimes.start}:00`;
  output = output.replace(
    '<span id="src-address">',
    `<span id="src-wedding-iso" style="display:none!important;">${weddingIsoStr}</span><span id="src-address">`
  );

  // 2. Audio Latar
  output = output.split('{{background_music_url}}').join(escapeHtml(audioUrl));

  // 3. Nama Mempelai di teks umum
  output = output.split('Nurizzati Islamiyah').join(escapeHtml(brideFull));
  output = output.split('Badriana').join(escapeHtml(groomFull));
  output = output.split('Izzah').join(escapeHtml(bride));
  output = output.split('Badri').join(escapeHtml(groom));

  // 4. Foto Mempelai
  output = output.split('https://wedivo.id/uploads/PaqKKqe1mjcttlp7BhAqMiY7tsk2/bridePhoto_1790836741.jpg').join(escapeHtml(bridePhoto));
  output = output.split('https://wedivo.id/uploads/PaqKKqe1mjcttlp7BhAqMiY7tsk2/groomPhoto_1790836746.jpg').join(escapeHtml(groomPhoto));
  output = output.split('https://wedivo.id/uploads/PaqKKqe1mjcttlp7BhAqMiY7tsk2/couplePhoto_1790836788.jpg').join(escapeHtml(couplePhoto));

  // 5. Instagram Mempelai
  output = output.replace(
    new RegExp('<a[^>]*id="cp-bride-ig"[^>]*>[\\s\\S]*?<\\/a>'),
    `<a id="cp-bride-ig" class="cp-ig btn btn-ghost btn-sm" href="${escapeHtml(brideIgUrl)}" target="_blank" rel="noopener" data-handle="${escapeHtml(brideIgHandle)}">` +
      `<svg id="cp-bride-ig-ic" class="ic" viewBox="0 0 24 24" aria-hidden="true"><use id="cp_29" href="#ic-ig"></use></svg>` +
      `<span id="cp-bride-ig-t" class="cp-ig-t">${escapeHtml(brideIgHandle)}</span></a>`
  );

  output = output.replace(
    new RegExp('<a[^>]*id="cp-groom-ig"[^>]*>[\\s\\S]*?<\\/a>'),
    `<a id="cp-groom-ig" class="cp-ig btn btn-ghost btn-sm" href="${escapeHtml(groomIgUrl)}" target="_blank" rel="noopener" data-handle="${escapeHtml(groomIgHandle)}">` +
      `<svg id="cp-groom-ig-ic" class="ic" viewBox="0 0 24 24" aria-hidden="true"><use id="cp_65" href="#ic-ig"></use></svg>` +
      `<span id="cp-groom-ig-t" class="cp-ig-t">${escapeHtml(groomIgHandle)}</span></a>`
  );

  // 6. Silsilah, Orang Tua & Tanah Asal (Bride & Groom)
  // Bride
  output = output.replace(
    new RegExp('<span id="cp-bride-no-b"[^>]*>[^<]*<\\/span>'),
    `<span id="cp-bride-no-b" class="cp-no-town">${escapeHtml(dContent.kotaAsalWanita)}</span>`
  );
  output = output.replace(
    new RegExp('<p id="cp-bride-grow"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p id="cp-bride-grow" class="cp-grow"><span id="cp-bride-grow-k" class="cp-grow-k">Tumbuh paling subur saat</span><span id="cp-bride-grow-v" class="cp-grow-v">${escapeHtml(dContent.suburSaatWanita)}</span></p>`
  );
  output = output.replace(
    new RegExp('<p id="cp-bride-order"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p id="cp-bride-order" class="cp-order">${escapeHtml(dContent.keteranganAnakWanita)}</p>`
  );
  output = output.replace(
    new RegExp('<p id="cp-bride-parents"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p id="cp-bride-parents" class="cp-parents">${escapeHtml(brideParents)}</p>`
  );
  output = output.replace(
    new RegExp('<span id="cp-bride-town"[^>]*>[^<]*<\\/span>'),
    `<span id="cp-bride-town" class="cp-town">${escapeHtml(dContent.kotaAsalWanita)}</span>`
  );
  output = output.replace(
    new RegExp('<em id="cp-bride-soil-v"[^>]*>[^<]*<\\/em>'),
    `<em id="cp-bride-soil-v">${escapeHtml(dContent.sifatTanahWanita)}</em>`
  );

  // Groom
  output = output.replace(
    new RegExp('<span id="cp-groom-no-b"[^>]*>[^<]*<\\/span>'),
    `<span id="cp-groom-no-b" class="cp-no-town">${escapeHtml(dContent.kotaAsalPria)}</span>`
  );
  output = output.replace(
    new RegExp('<p id="cp-groom-grow"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p id="cp-groom-grow" class="cp-grow"><span id="cp-groom-grow-k" class="cp-grow-k">Tumbuh paling subur saat</span><span id="cp-groom-grow-v" class="cp-grow-v">${escapeHtml(dContent.suburSaatPria)}</span></p>`
  );
  output = output.replace(
    new RegExp('<p id="cp-groom-order"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p id="cp-groom-order" class="cp-order">${escapeHtml(dContent.keteranganAnakPria)}</p>`
  );
  output = output.replace(
    new RegExp('<p id="cp-groom-parents"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p id="cp-groom-parents" class="cp-parents">${escapeHtml(groomParents)}</p>`
  );
  output = output.replace(
    new RegExp('<span id="cp-groom-town"[^>]*>[^<]*<\\/span>'),
    `<span id="cp-groom-town" class="cp-town">${escapeHtml(dContent.kotaAsalPria)}</span>`
  );
  output = output.replace(
    new RegExp('<em id="cp-groom-soil-v"[^>]*>[^<]*<\\/em>'),
    `<em id="cp-groom-soil-v">${escapeHtml(dContent.sifatTanahPria)}</em>`
  );

  // 7. Cover & Hero Headline
  output = output.replace(
    new RegExp('<p id="packet-note"[^>]*>[^<]*<\\/p>'),
    `<p id="packet-note" class="packet-note">${escapeHtml(dContent.tulisanPaketBenih)}</p>`
  );
  output = output.replace(
    new RegExp('<p id="hero-tagline"[^>]*>[^<]*<\\/p>'),
    `<p id="hero-tagline" class="hero-tagline rv" style="--d: 0.46s">${escapeHtml(dContent.heroHeadline)}</p>`
  );

  // 8. Salam, Pengantar, Ayat & Sumber
  output = output.replace(
    new RegExp('<p id="salam-opening"[^>]*>[^<]*<\\/p>'),
    `<p id="salam-opening" class="lontar-opening">${escapeHtml(dContent.salamPembuka)}</p>`
  );
  output = output.replace(
    new RegExp('<p id="salam-intro"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p id="salam-intro" class="lontar-leaf lontar-leaf-src rich rv">${escapeHtml(dContent.kataPengantar)}</p>`
  );
  output = output.replace(
    new RegExp('<p id="salam-quote-text"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p id="salam-quote-text" class="lontar-quote-text rich">${escapeHtml(dContent.kutipanAyat)}</p>`
  );
  output = output.replace(
    new RegExp('<cite id="salam-quote-src"[^>]*>[^<]*<\\/cite>'),
    `<cite id="salam-quote-src" class="lontar-quote-src">${escapeHtml(dContent.sumberKutipan)}</cite>`
  );

  // 9. Inoskulasi (Sentuhan Pertama & Dua Pohon Menyatu)
  output = output.replace(
    new RegExp('<span id="inos-met-date"[^>]*>[\\s\\S]*?<\\/span>'),
    `<span id="inos-met-date" class="js-date" data-date="${escapeHtml(metYmd)}" data-format="long">${escapeHtml(dContent.tglPertamaBertemu || '2019-04-13')}</span>`
  );
  output = output.replace(
    new RegExp('<strong id="inos-since-n"[^>]*>[\\s\\S]*?<\\/strong>'),
    `<strong id="inos-since-n" class="js-since" data-date="${escapeHtml(metYmd)}">0</strong>`
  );
  output = output.replace(
    new RegExp('<p id="inos-cap-1-place"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p id="inos-cap-1-place" class="inos-cap-place">${escapeHtml(dContent.tempatPertamaBertemu)}</p>`
  );
  output = output.replace(
    new RegExp('<p id="inos-cap-1-p"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p id="inos-cap-1-p" class="inos-cap-p rich">${escapeHtml(dContent.ceritaSentuhanPertama)}</p>`
  );
  output = output.replace(
    new RegExp('<p id="inos-cap-3-p"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p id="inos-cap-3-p" class="inos-cap-p rich">${escapeHtml(dContent.kalimatDuaPohonMenyatu)}</p>`
  );

  // 10. Love Story Photos, Texts & Waktu
  output = output.split('{{love_story_1_photo}}').join(escapeHtml(finalStory1Photo));
  output = output.split('{{love_story_2_photo}}').join(escapeHtml(finalStory2Photo));
  output = output.split('{{love_story_3_photo}}').join(escapeHtml(finalStory3Photo));
  output = output.split('{{love_story_4_photo}}').join(escapeHtml(finalStory4Photo));

  output = output.replace(new RegExp('<h3 id="st-1-title"[^>]*>[^<]*<\\/h3>'), `<h3 id="st-1-title" class="st-title">${escapeHtml(story1Title)}</h3>`);
  output = output.replace(new RegExp('<span id="st-1-date"[^>]*>[^<]*<\\/span>'), `<span id="st-1-date" class="st-date">${escapeHtml(story1Time)}</span>`);
  output = output.replace(new RegExp('<p id="st-1-text"[^>]*>[^<]*<\\/p>'), `<p id="st-1-text" class="st-text rich">${escapeHtml(story1Text)}</p>`);

  output = output.replace(new RegExp('<h3 id="st-2-title"[^>]*>[^<]*<\\/h3>'), `<h3 id="st-2-title" class="st-title">${escapeHtml(story2Title)}</h3>`);
  output = output.replace(new RegExp('<span id="st-2-date"[^>]*>[^<]*<\\/span>'), `<span id="st-2-date" class="st-date">${escapeHtml(story2Time)}</span>`);
  output = output.replace(new RegExp('<p id="st-2-text"[^>]*>[^<]*<\\/p>'), `<p id="st-2-text" class="st-text rich">${escapeHtml(story2Text)}</p>`);

  output = output.replace(new RegExp('<h3 id="st-3-title"[^>]*>[^<]*<\\/h3>'), `<h3 id="st-3-title" class="st-title">${escapeHtml(story3Title)}</h3>`);
  output = output.replace(new RegExp('<span id="st-3-date"[^>]*>[^<]*<\\/span>'), `<span id="st-3-date" class="st-date">${escapeHtml(story3Time)}</span>`);
  output = output.replace(new RegExp('<p id="st-3-text"[^>]*>[^<]*<\\/p>'), `<p id="st-3-text" class="st-text rich">${escapeHtml(story3Text)}</p>`);

  output = output.replace(new RegExp('<h3 id="st-4-title"[^>]*>[^<]*<\\/h3>'), `<h3 id="st-4-title" class="st-title">${escapeHtml(story4Title)}</h3>`);
  output = output.replace(new RegExp('<span id="st-4-date"[^>]*>[^<]*<\\/span>'), `<span id="st-4-date" class="st-date">${escapeHtml(story4Time)}</span>`);
  output = output.replace(new RegExp('<p id="st-4-text"[^>]*>[^<]*<\\/p>'), `<p id="st-4-text" class="st-text rich">${escapeHtml(story4Text)}</p>`);

  // Keterangan Galeri
  output = output.replace(
    new RegExp('<p class="sh-sub rv" id="gallery-sh-s"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p class="sh-sub rv" id="gallery-sh-s" style="--d: 0.16s">${escapeHtml(dContent.keteranganGaleri)}</p>`
  );

  // 11. Daun Gugur (6 Pasang)
  if (Array.isArray(dContent.daunGugur)) {
    dContent.daunGugur.forEach((dg, i) => {
      const idx = i + 1;
      if (idx > 6) return;
      if (dg.dilepaskan) {
        output = output.replace(
          new RegExp(`<span id="gg-row-${idx}-at"[^>]*>[\\s\\S]*?<\\/span>`),
          `<span id="gg-row-${idx}-at" class="gg-lepas-t">${escapeHtml(dg.dilepaskan)}</span>`
        );
      }
      if (dg.tumbuh) {
        output = output.replace(
          new RegExp(`<p id="gg-row-${idx}-c"[^>]*>[\\s\\S]*?<\\/p>`),
          `<p id="gg-row-${idx}-c" class="gg-tumbuh">${escapeHtml(dg.tumbuh)}</p>`
        );
      }
    });
  }

  // 12. Lingkaran Tahun (5 Fase)
  output = output.replace(
    new RegExp('<span id="lk-met"[^>]*><\\/span>'),
    `<span id="lk-met" data-date="${escapeHtml(metYmd)}"></span>`
  );
  output = output.replace(
    new RegExp('<span id="lk-wed"[^>]*><\\/span>'),
    `<span id="lk-wed" data-date="${escapeHtml(weddingDateYmd)}"></span>`
  );
  if (Array.isArray(dContent.lingkaranTahun)) {
    dContent.lingkaranTahun.forEach((lk, i) => {
      const idx = i + 1;
      if (idx > 5) return;
      output = output.replace(
        new RegExp(`<span id="lk-note-${idx}"[^>]*>[\\s\\S]*?<\\/span>`),
        `<span id="lk-note-${idx}" data-year="${escapeHtml(lk.tahun || '')}">${escapeHtml(lk.catatan || '')}</span>`
      );
    });
  }

  // 13. Dresscode (Teks & 5 Swatch Warna)
  output = output.replace(
    new RegExp('<p id="dc-text"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p id="dc-text" class="dc-text rich rv">${escapeHtml(dContent.dresscodeText)}</p>`
  );
  if (Array.isArray(dContent.dresscodeColors)) {
    dContent.dresscodeColors.forEach((color, i) => {
      const idx = i + 1;
      if (idx > 5) return;
      const cleanCol = color || '#7a9a60';
      output = output.replace(
        new RegExp(`<button[^>]*id="dc-leaf-${idx}"[^>]*>[\\s\\S]*?<\\/button>`),
        (matched) => {
          return matched
            .replace(/data-color="[^"]*"/, `data-color="${escapeHtml(cleanCol)}"`)
            .replace(/style="--c:[^"]*"/, `style="--c:${escapeHtml(cleanCol)}"`);
        }
      );
    });
  }

  // 14. Petunjuk Kebun (6 Aturan)
  if (Array.isArray(dContent.petunjukKebun)) {
    dContent.petunjukKebun.forEach((pt, i) => {
      const idx = i + 1;
      if (idx > 6) return;
      if (pt.judul) {
        output = output.replace(
          new RegExp(`<h3 id="pj-label-${idx}"[^>]*>[\\s\\S]*?<\\/h3>`),
          `<h3 id="pj-label-${idx}" class="pj-label">${escapeHtml(pt.judul)}</h3>`
        );
      }
      if (pt.keterangan) {
        output = output.replace(
          new RegExp(`<p id="pj-text-${idx}"[^>]*>[\\s\\S]*?<\\/p>`),
          `<p id="pj-text-${idx}" class="pj-text">${escapeHtml(pt.keterangan)}</p>`
        );
      }
    });
  }

  // 15. Pohon Harapan Nanti (4 Harapan)
  if (Array.isArray(dContent.harapanNanti)) {
    dContent.harapanNanti.forEach((hr, i) => {
      const idx = i + 1;
      if (idx > 4) return;
      const yearVal = hr.tahunKe || String(idx);
      output = output.replace(
        new RegExp(`<li id="nt-hope-${idx}"[^>]*data-year="[^"]*"`),
        `<li id="nt-hope-${idx}" class="nt-hope rv" data-year="${escapeHtml(yearVal)}"`
      );
      output = output.replace(
        new RegExp(`<span id="nt-hope-${idx}-yv"[^>]*>[\\s\\S]*?<\\/span>`),
        `<span id="nt-hope-${idx}-yv">${escapeHtml(yearVal)}</span>`
      );
      output = output.replace(
        new RegExp(`<span id="nt-hope-${idx}-t"[^>]*>[\\s\\S]*?<\\/span>`),
        `<span id="nt-hope-${idx}-t">${escapeHtml(hr.isiHarapan || '')}</span>`
      );
    });
  }

  // 16. Catatan Hadiah, RSVP, Kebun Doa & Penutup
  output = output.replace(
    new RegExp('<p id="gf-text"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p id="gf-text" class="gf-text rich rv">${escapeHtml(dContent.catatanHadiah)}</p>`
  );
  output = output.replace(
    new RegExp('<p class="sh-sub rv" id="rs-sh-s"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p class="sh-sub rv" id="rs-sh-s" style="--d: 0.16s">${escapeHtml(dContent.catatanRsvp)}</p>`
  );
  output = output.replace(
    new RegExp('<p class="sh-sub rv" id="ws-sh-s"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p class="sh-sub rv" id="ws-sh-s" style="--d: 0.16s">${escapeHtml(dContent.keteranganUcapan)}</p>`
  );
  output = output.replace(
    new RegExp('<p id="cl-text"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p id="cl-text" class="cl-text rich">${escapeHtml(dContent.kalimatPenutup)}</p>`
  );
  output = output.replace(
    new RegExp('<p id="cl-salam"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p id="cl-salam" class="cl-salam">${escapeHtml(dContent.salamPenutup)}</p>`
  );
  output = output.replace(
    new RegExp('<p id="cl-family"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p id="cl-family" class="cl-family">${escapeHtml(dContent.namaKeluarga)}</p>`
  );
  output = output.replace(
    new RegExp('<p id="cl-turut-v"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p id="cl-turut-v" class="cl-turut-v rich">${escapeHtml(dContent.turutMengundang)}</p>`
  );
  output = output.replace(
    new RegExp('<p id="cl-hashtag"[^>]*>[\\s\\S]*?<\\/p>'),
    `<p id="cl-hashtag" class="cl-hashtag">${escapeHtml(dContent.tagarPernikahan)}</p>`
  );

  // 8. Countdown (Target Date & Google Calendar)
  output = output.replace(
    new RegExp('<span id="cd-when-date"[^>]*>[^<]*<\\/span>'),
    `<span id="cd-when-date" class="js-date" data-date="${escapeHtml(weddingDateYmd)}" data-format="long">${escapeHtml(weddingDateFormatted)}</span>`
  );
  output = output.replace(
    new RegExp('<span id="cd-when-time"[^>]*>[^<]*<\\/span>'),
    `<span id="cd-when-time" class="js-time" data-time="${escapeHtml(akadTimes.start)}">${escapeHtml(akadTimes.start)}</span>`
  );

  // 9. Events (Akad & Resepsi)
  // Akad
  output = output.replace(
    new RegExp('<span id="ev-1-date"[^>]*>[^<]*<\\/span>'),
    `<span id="ev-1-date" class="js-date" data-date="${escapeHtml(akadDateYmd)}" data-format="long">${escapeHtml(akadDateFormatted)}</span>`
  );
  output = output.replace(
    new RegExp('<span id="ev-1-time"[^>]*>[^<]*<\\/span>'),
    `<span id="ev-1-time" class="js-range" data-start="${escapeHtml(akadTimes.start)}" data-end="${escapeHtml(akadTimes.end)}">${escapeHtml(akadTimes.start)}</span>`
  );
  output = output.replace(
    new RegExp('<strong id="ev-1-venue"[^>]*>[^<]*<\\/strong>'),
    `<strong id="ev-1-venue" class="ev-venue">${escapeHtml(akadVenue)}</strong>`
  );
  output = output.replace(
    new RegExp('<span id="ev-1-addr"[^>]*>[^<]*<\\/span>'),
    `<span id="ev-1-addr" class="ev-addr">${escapeHtml(akadAddr)}</span>`
  );

  // Resepsi
  output = output.replace(
    new RegExp('<span id="ev-2-date"[^>]*>[^<]*<\\/span>'),
    `<span id="ev-2-date" class="js-date" data-date="${escapeHtml(resepsiDateYmd)}" data-format="long">${escapeHtml(resepsiDateFormatted)}</span>`
  );
  output = output.replace(
    new RegExp('<span id="ev-2-time"[^>]*>[^<]*<\\/span>'),
    `<span id="ev-2-time" class="js-range" data-start="${escapeHtml(resepsiTimes.start)}" data-end="${escapeHtml(resepsiTimes.end)}">${escapeHtml(resepsiTimes.start)}</span>`
  );
  output = output.replace(
    new RegExp('<strong id="ev-2-venue"[^>]*>[^<]*<\\/strong>'),
    `<strong id="ev-2-venue" class="ev-venue">${escapeHtml(resepsiVenue)}</strong>`
  );
  output = output.replace(
    new RegExp('<span id="ev-2-addr"[^>]*>[^<]*<\\/span>'),
    `<span id="ev-2-addr" class="ev-addr">${escapeHtml(resepsiAddr)}</span>`
  );

  // 10. Venue Section (Petak Tanam)
  output = output.replace(
    new RegExp('<h3 id="vn-name"[^>]*>[^<]*<\\/h3>'),
    `<h3 id="vn-name" class="vn-name rv">${escapeHtml(resepsiVenue || akadVenue)}</h3>`
  );
  output = output.replace(
    new RegExp('<p id="vn-addr"[^>]*>[^<]*<\\/p>'),
    `<p id="vn-addr" class="vn-addr rv">${escapeHtml(resepsiAddr || akadAddr)}</p>`
  );

  // 11. Links Peta Google Maps & Kalender Google
  output = output.split('https://www.google.com/maps/dir/?api=1&amp;destination_place_id=ChIJVX_KZ1YABDQR8TZ6STtir8M').join(escapeHtml(mapsLink));
  output = output.split('https://www.google.com/maps/dir/?api=1&destination_place_id=ChIJVX_KZ1YABDQR8TZ6STtir8M').join(escapeHtml(mapsLink));
  output = output.split('https://www.google.com/maps/search/?api=1').join(escapeHtml(mapsLink));
  output = output.split('https://calendar.google.com/').join(escapeHtml(calLink));
  output = output.split('https://calendar.google.com/calendar/render?action=TEMPLATE').join(escapeHtml(calLink));

  // 12. Love Gift: Transfer via ATM, QRIS, & WhatsApp
  output = output.split('{{bank_name}}').join(escapeHtml(namaBank || 'Bank Transfer'));
  output = output.split('{{account_number}}').join(escapeHtml(noAtm || '—'));
  output = output.split('{{account_holder}}').join(escapeHtml(groomFull || brideFull));
  output = output.split('{{whatsapp_url}}').join(escapeHtml(whatsappUrl));
  output = output.split('{{qris_image_url}}').join(escapeHtml(fotoQris));
  output = output.split('{{qris_box_display}}').join(isQrisActive ? 'display:block;' : 'display:none;');
  output = output.split('{{wa_box_display}}').join(cleanPhone ? 'display:block;' : 'display:none;');

  if (!isGiftActive) {
    output = output.replace('id="sec-gifts"', 'id="sec-gifts" style="display:none!important;"');
    output = output.replace('id="nav-i-gifts"', 'id="nav-i-gifts" style="display:none!important;"');
  }

  // 13. Nama Tamu Undangan
  if (guestName) {
    output = output.split('Bapak/Ibu/Saudara/i').join(escapeHtml(guestName));
  }

  // 14. Pre-render SSR: Kebun Doa (tabel ucapan_harapan)
  const ucapanList = Array.isArray(data?.ucapanHarapan) ? data.ucapanHarapan : [];
  if (ucapanList.length > 0) {
    const ucapanHtml = ucapanList
      .map((item: any, idx: number) => {
        const tone = 1 + (Math.abs(hashString((item.name || '') + '|' + idx)) % 6);
        const dateStr = item.createdAt ? formatWishDate(item.createdAt) : '';
        return (
          `<article class="comment-card ws-card ws-c${tone}" id="ws-card-${escapeHtml(item.id)}">` +
          `<svg class="ws-flower" viewBox="0 0 60 76" aria-hidden="true"><use href="#sym-flower"></use></svg>` +
          `<div class="ws-tag">` +
          `<p class="comment-message ws-msg" data-field="message">${escapeHtml(item.ucapan)}</p>` +
          `<p class="comment-name ws-name" data-field="name">${escapeHtml(item.name)}</p>` +
          `<p class="comment-date ws-date" data-field="date">${escapeHtml(dateStr)}</p>` +
          `</div></article>`
        );
      })
      .join('');

    output = output.replace(
      '<div id="ws-list" class="ws-list" data-wedivo="comments-list"></div>',
      `<div id="ws-list" class="ws-list" data-wedivo="comments-list">${ucapanHtml}</div>`
    );
    output = output.replace(
      'id="ws-empty" class="ws-empty"',
      'id="ws-empty" class="ws-empty" style="display:none;"'
    );
    output = output.replace(
      'id="ws-bed" class="ws-bed is-empty"',
      'id="ws-bed" class="ws-bed"'
    );
  }

  // 15. Pre-render SSR: Ikut Menanam? RSVP (tabel comments)
  const commentsList = Array.isArray(data?.comments) ? data.comments : [];
  let presentGuests = 0;
  let absentGuests = 0;

  commentsList.forEach((c: any) => {
    const raw = String(c.comment || '');
    let pax = 1;
    const paxMatch = raw.match(/(\d+)\s+tamu/i);
    if (paxMatch && paxMatch[1]) {
      pax = parseInt(paxMatch[1], 10) || 1;
    }
    if (c.presence) {
      presentGuests += pax;
    } else {
      absentGuests += 1;
    }
  });

  const statsBadgeHtml = `
    <div id="rsvp-stats-box" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:16px; text-align:center;">
      <div style="background:rgba(90,118,69,0.14); padding:10px 8px; border-radius:12px; border:1px solid rgba(90,118,69,0.25);">
        <span id="rsvp-stat-present" style="display:block; font-family:var(--f-serif); font-size:20px; font-weight:700; color:#445b32;">${presentGuests}</span>
        <span style="font-size:11px; font-family:var(--f-sans); color:var(--ink-2); font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Hadir</span>
      </div>
      <div style="background:rgba(154,71,96,0.14); padding:10px 8px; border-radius:12px; border:1px solid rgba(154,71,96,0.25);">
        <span id="rsvp-stat-absent" style="display:block; font-family:var(--f-serif); font-size:20px; font-weight:700; color:#9a4760;">${absentGuests}</span>
        <span style="font-size:11px; font-family:var(--f-sans); color:var(--ink-2); font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Tidak Hadir</span>
      </div>
      <div style="background:rgba(217,119,6,0.14); padding:10px 8px; border-radius:12px; border:1px solid rgba(217,119,6,0.25);">
        <span id="rsvp-stat-total" style="display:block; font-family:var(--f-serif); font-size:20px; font-weight:700; color:#92400e;">${commentsList.length}</span>
        <span style="font-size:11px; font-family:var(--f-sans); color:var(--ink-2); font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Catatan</span>
      </div>
    </div>
  `;

  if (commentsList.length > 0) {
    const rsvpCardsHtml = commentsList
      .map((c: any) => {
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
        const dateStr = c.createdAt ? formatWishDate(c.createdAt) : '';

        return (
          `<div class="rsvp-card-item" id="rsvp-item-${escapeHtml(c.id)}" style="padding:13px 15px; border-radius:14px; background:rgba(255,255,255,0.85); border:1px solid var(--line); box-shadow:0 2px 6px -3px rgba(40,30,15,0.08); display:grid; gap:6px;">` +
          `<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">` +
          `<div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">` +
          `<strong style="font-family:var(--f-serif); font-size:15px; color:var(--ink);">${escapeHtml(c.name)}</strong>` +
          `<span style="font-size:11px; padding:2px 8px; border-radius:999px; background:${badgeBg}; color:${badgeColor}; font-family:var(--f-sans); font-weight:600;">` +
          `${escapeHtml(statusLabel)} ${paxText ? `· ${escapeHtml(paxText)}` : ''}` +
          `</span></div>` +
          `<span style="font-family:var(--f-mono); font-size:11px; color:var(--ink-3); white-space:nowrap;">${escapeHtml(dateStr)}</span>` +
          `</div>` +
          (note ? `<p style="font-family:var(--f-sans); font-size:13px; line-height:1.5; color:var(--ink-2); margin:0;">${escapeHtml(note)}</p>` : '') +
          `<div style="display:flex; justify-content:flex-end; align-items:center;">` +
          `<button type="button" class="rsvp-like-btn" data-comment-id="${escapeHtml(c.id)}" style="background:none; border:none; padding:3px 6px; cursor:pointer; display:inline-flex; align-items:center; gap:4px; font-size:12px; color:var(--ink-3);">` +
          `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>` +
          `<span class="rsvp-like-count">${c.likesCount || 0}</span></button></div></div>`
        );
      })
      .join('');

    output = output.replace(
      '<div id="rsvp-comments-list" style="display:grid; gap:10px;"></div>',
      `${statsBadgeHtml}<div id="rsvp-comments-list" style="display:grid; gap:10px;">${rsvpCardsHtml}</div>`
    );
    output = output.replace(
      'id="rsvp-comments-count" style="font-family:var(--f-mono); font-size:12px; color:var(--acc-2); background:rgba(154,71,96,0.1); padding:2px 8px; border-radius:999px;">0 Catatan</span>',
      `id="rsvp-comments-count" style="font-family:var(--f-mono); font-size:12px; color:var(--acc-2); background:rgba(154,71,96,0.1); padding:2px 8px; border-radius:999px;">${commentsList.length} Catatan</span>`
    );
    output = output.replace(
      'id="rsvp-comments-empty" style="text-align:center; font-style:italic; padding:14px; color:var(--ink-3); font-size:13.5px; margin:0;"',
      'id="rsvp-comments-empty" style="display:none; text-align:center; font-style:italic; padding:14px; color:var(--ink-3); font-size:13.5px; margin:0;"'
    );
  } else {
    output = output.replace(
      '<div id="rsvp-comments-list" style="display:grid; gap:10px;"></div>',
      `${statsBadgeHtml}<div id="rsvp-comments-list" style="display:grid; gap:10px;"></div>`
    );
  }

  return output;
}

