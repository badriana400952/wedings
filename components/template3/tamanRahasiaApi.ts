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

// Baris ucapan dari tabel khusus `ucapan_harapan` (Pohon Harapan Template B).
// Hanya baca-tulis — tanpa like maupun balasan.
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

const WISH_PAGE_SIZE = 6;
const MAX_WISH_LENGTH = 2000;

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    /* abaikan body non-JSON */
  }
  if (!res.ok || !body?.success) {
    throw new Error(body?.error || `Permintaan gagal (${res.status})`);
  }
  return body as T;
}

export function fetchWishes(
  templateWedingId: string,
  offset: number,
  signal?: AbortSignal
): Promise<CommentListResponse> {
  const qs = new URLSearchParams({
    templateWedingId,
    kind: 'wish',
    limit: String(WISH_PAGE_SIZE),
    offset: String(offset),
  });
  return request<CommentListResponse>(`/api/comments?${qs.toString()}`, { signal });
}

export function fetchAllComments(
  templateWedingId: string,
  offset: number = 0,
  limit: number = 20,
  signal?: AbortSignal
): Promise<CommentListResponse> {
  const qs = new URLSearchParams({
    templateWedingId,
    limit: String(limit),
    offset: String(offset),
  });
  return request<CommentListResponse>(`/api/comments?${qs.toString()}`, { signal });
}

export function postWish(input: {
  templateWedingId: string;
  name: string;
  message: string;
}): Promise<{ success: boolean; comment: ApiComment }> {
  return request('/api/comments', {
    method: 'POST',
    body: JSON.stringify({
      templateWedingId: input.templateWedingId,
      name: input.name,
      presence: true,
      comment: input.message,
      kind: 'wish',
    }),
  });
}

/**
 * RSVP disimpan sebagai baris `comments` dengan awalan `[RSVP]` pada kolom `comment`
 * karena model `Comment` hanya punya boolean `presence` (tidak ada kolom status 3-state).
 * `presence` dipakai untuk badge Hadir/Tidak Hadir di dashboard, sedangkan label exact
 * "Hadir / Berhalangan / Masih Ragu" ikut disimpan agar tidak hilang informasinya.
 */
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

const UCAPAN_PAGE_SIZE = 6;

export function fetchUcapanes(
  templateWedingId: string,
  offset: number,
  signal?: AbortSignal
): Promise<UcapanListResponse> {
  const qs = new URLSearchParams({
    templateWedingId,
    limit: String(UCAPAN_PAGE_SIZE),
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
    /* abaikan body non-JSON */
  }
  if (!res.ok || typeof body?.liked !== 'boolean') {
    throw new Error(body?.error || 'Gagal menyimpan suka');
  }
  return body as { liked: boolean };
}

/** Samarkan input agar aman disisipkan lewat innerHTML. */
export function escapeHtml(value: string): string {
  return value
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
