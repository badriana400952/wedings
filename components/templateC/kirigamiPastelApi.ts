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
  not_attending: 'Tidak Hadir',
  maybe: 'Mungkin',
};

const RSVP_PRESENCE: Record<RsvpStatus, boolean> = {
  attending: true,
  not_attending: false,
  maybe: false,
};

const WISH_PAGE_SIZE = 10;

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

export function fetchUcapanes(
  templateWedingId: string,
  offset: number = 0,
  signal?: AbortSignal
): Promise<UcapanListResponse> {
  const qs = new URLSearchParams({
    templateWedingId,
    limit: String(WISH_PAGE_SIZE),
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

export function escapeHtml(value: string): string {
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
