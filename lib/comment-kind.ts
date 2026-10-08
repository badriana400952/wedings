// Pohon harapan (wish) dan konfirmasi kehadiran (RSVP) berbagi tabel `comments`.
// Karena model `Comment` tidak punya kolom penentu jenis, RSVP ditandai lewat awalan
// teks pada kolom `comment`. Semua pembacaan di codebase harus memakai konstanta ini
// atau query param `kind`, jangan menulis ulang string-nya.
export const RSVP_PREFIX = '[RSVP]';

export type CommentKind = 'all' | 'wish' | 'rsvp';

export function readCommentKind(value: unknown): CommentKind {
  return value === 'wish' || value === 'rsvp' ? value : 'all';
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Buang marker RSVP yang mungkin diketik manual oleh tamu pada kolom `comment`. */
export function stripRsvpPrefix(value: string): string {
  return value.replace(new RegExp(`^(?:${escapeRegExp(RSVP_PREFIX)}\\s*)+`), '');
}
