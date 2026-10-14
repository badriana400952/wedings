import { RSVP_PREFIX } from '@/lib/comment-kind';

export interface ApiComment {
  id: string;
  name: string;
  presence: boolean;
  comment: string;
  likesCount: number;
  createdAt: string;
  liked?: boolean;
}

export interface CommentListResponse {
  success: boolean;
  comments: ApiComment[];
  total: number;
  hasMore: boolean;
  error?: string;
}

export interface UcapanItem {
  id: string;
  name: string;
  ucapan: string;
  createdAt: string;
}

export interface UcapanListResponse {
  success: boolean;
  ucapan: UcapanItem[];
  total: number;
  hasMore: boolean;
  error?: string;
}

export type RsvpStatus = 'attending' | 'not_attending' | 'maybe';

export const RSVP_LABELS: Record<RsvpStatus, string> = {
  attending: 'Hadir',
  not_attending: 'Berhalangan',
  maybe: 'Masih Ragu',
};

const RSVP_PRESENCE: Record<RsvpStatus, boolean> = {
  attending: true,
  not_attending: false,
  maybe: false,
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    /* ignore non-json */
  }
  if (!res.ok || !body?.success) {
    throw new Error(body?.error || `Permintaan gagal (${res.status})`);
  }
  return body as T;
}

export function buildRsvpComment(input: {
  status: RsvpStatus;
  pax: number;
  message: string;
}): string {
  const parts = [`${RSVP_PREFIX} ${RSVP_LABELS[input.status]}`];
  if (input.status === 'attending' && input.pax > 1) {
    parts.push(`${input.pax} tamu`);
  }
  const line = parts.join(' · ');
  return input.message ? `${line} — ${input.message}` : line;
}

export function parseRsvpDetails(rawComment: string): {
  statusLabel: string;
  paxText: string;
  note: string;
} {
  const c = rawComment || '';
  if (!c.startsWith(RSVP_PREFIX)) {
    return { statusLabel: 'Hadir', paxText: '', note: c };
  }
  const withoutPrefix = c.slice(RSVP_PREFIX.length).trim();
  const [head, ...rest] = withoutPrefix.split(' — ');
  const note = rest.join(' — ');
  const headParts = head.split(' · ');
  const statusLabel = headParts[0]?.trim() || 'Hadir';
  const paxText = headParts[1]?.trim() || '';
  return { statusLabel, paxText, note };
}

export function postRsvp(input: {
  templateWedingId: string;
  name: string;
  status: RsvpStatus;
  pax: number;
  message: string;
}): Promise<{ success: boolean; comment: ApiComment }> {
  return request('/api/comments', {
    method: 'POST',
    body: JSON.stringify({
      templateWedingId: input.templateWedingId,
      name: input.name,
      presence: RSVP_PRESENCE[input.status],
      comment: buildRsvpComment(input),
      kind: 'rsvp',
    }),
  });
}

export function fetchRsvpComments(
  templateWedingId: string,
  offset: number = 0,
  limit: number = 10,
  signal?: AbortSignal
): Promise<CommentListResponse> {
  const qs = new URLSearchParams({
    templateWedingId,
    kind: 'rsvp',
    limit: String(limit),
    offset: String(offset),
  });
  return request<CommentListResponse>(`/api/comments?${qs.toString()}`, { signal });
}

export function fetchUcapanes(
  templateWedingId: string,
  offset: number = 0,
  limit: number = 10,
  signal?: AbortSignal
): Promise<UcapanListResponse> {
  const qs = new URLSearchParams({
    templateWedingId,
    limit: String(limit),
    offset: String(offset),
  });
  return request<UcapanListResponse>(`/api/ucapan?${qs.toString()}`, { signal });
}

export function postUcapan(input: {
  templateWedingId: string;
  name: string;
  ucapan: string;
}): Promise<{ success: boolean; ucapan: UcapanItem }> {
  return request('/api/ucapan', {
    method: 'POST',
    body: JSON.stringify({
      templateWedingId: input.templateWedingId,
      name: input.name,
      ucapan: input.ucapan,
    }),
  });
}

export async function toggleLike(
  commentId: string
): Promise<{ liked: boolean }> {
  const res = await fetch(`/api/comments/${encodeURIComponent(commentId)}/like`, {
    method: 'POST',
  });
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    /* ignore non-json */
  }
  if (!res.ok || typeof body?.liked !== 'boolean') {
    throw new Error(body?.error || 'Gagal menyimpan suka');
  }
  return body as { liked: boolean };
}

export function copyRekening(noRek: string): boolean {
  if (!noRek) return false;
  if (!navigator.clipboard) {
    const input = document.createElement('input');
    input.value = noRek;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    alert(`Nomor rekening ${noRek} berhasil disalin!`);
    return true;
  }
  navigator.clipboard
    .writeText(noRek)
    .then(() => {
      alert(`Nomor rekening ${noRek} berhasil disalin!`);
    })
    .catch(() => {
      alert('Gagal menyalin nomor rekening');
    });
  return true;
}

export function buildWhatsAppUrl(
  noHp: string | null | undefined,
  bride: string,
  groom: string
): string {
  if (!noHp) return '';
  let clean = noHp.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  } else if (!clean.startsWith('62')) {
    clean = '62' + clean;
  }
  const text = encodeURIComponent(
    `Halo ${bride} & ${groom}, saya ingin konfirmasi pengiriman tanda kasih / hadiah pernikahan. Terima kasih.`
  );
  return `https://api.whatsapp.com/send?phone=${clean}&text=${text}`;
}

export function escapeHtml(value: string | null | undefined): string {
  return (value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatWishDate(iso: string): string {
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
