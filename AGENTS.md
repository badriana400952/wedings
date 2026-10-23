# AGENTS.md — Petunjuk Operasional untuk AI Agent

Dokumen ini adalah instruksi tingkat tinggi untuk setiap AI Agent (Antigravity, Cursor, Claude Code, GitHub Copilot, dsb.) yang bekerja pada repositori ini.

---

## 🚨 PROTOKOL WAJIB DIIKUTI (NON-NEGOTIABLE)

### 1. SEBELUM MEMULAI PEKERJAAN (FIRST STEP)
Setiap AI Agent baru atau yang melanjutkan sesi **WAJIB membaca berkas-berkas berikut**:
1. **`docs/CHANGELOG.md`**: Membaca seluruh riwayat perubahan, fitur apa saja yang sudah dibuat, file apa saja yang disentuh, dan status pekerjaan terkini.
2. **`docs/isue-clear.md`**: Membaca seluruh ensiklopedia masalah dan solusi teknis agar langsung memahami penyebab dan penanganan error tanpa mengulangi kesalahan masa lalu.
3. **`Rules.md`**: Memahami aturan ketat arsitektur, database, pemisahan 4 fitur utama (`galeries`, `bersamaFotos`, `comments` RSVP, `ucapan_harapan`), larangan menukar mempelai pria vs wanita, dan aturan view tamu harus selalu Read-Only.
4. **`DB.md`**: Memahami skema Prisma dan relasi tabel.
5. **`task-v2.md` & `docs/STANDAR_PEMBUATAN_TEMPLATE_TASK_V2.md`**: Jika membuat atau menambahkan template baru, AI WAJIB mematuhi arsitektur *Template-Driven Dynamic Content System* melalui 5 fase (Definisi Tipe Preset, Form Dashboard, Komponen Dinamis, Routing, dan Audit Anti-Dummy).

### 2. SETELAH MENYELESAIKAN PEKERJAAN (FINAL STEP)
Setiap AI Agent yang telah melakukan perbaikan bug, refactor, atau penambahan fitur **WAJIB memperbarui `docs/CHANGELOG.md`** dengan:
- Tanggal dan waktu pembaruan.
- Deskripsi masalah yang diselesaikan.
- Daftar file yang diubah / dibuat beserta fungsinya.
- Detail teknis apa saja yang ditambahkan atau diperbaiki.
- Status server / testing terakhir.

> Pastikan juga menyelaraskan ke:
> `C:\Users\USER.DESKTOP-UQ662UT.000\OneDrive\Dokumen\project\undangan projek\undangan\docs\CHANGELOG.md` jika folder tersebut tersedia di sistem user.

---

## 📌 Ringkasan Arsitektur & Aturan Inti
- **Framework**: Next.js (Pages Router) + React + Tailwind CSS + Prisma + PostgreSQL.
- **Guest View (`pages/[...slug].tsx`)**: Murni tampilan tamu (Read-Only). Tidak boleh ada tombol edit/admin di halaman ini.
- **Photoshoot Album**: Tabel `galeries.fotos` (banyak foto).
- **Cerita/Love Story**: Kolom `template_wedings.bersamaFotos` (maksimal 6 foto).
- **RSVP Form**: Tabel `comments` dengan format text diawali tag `[RSVP]`.
- **Ucapan / Pohon Harapan**: Tabel `ucapan_harapan`.
- **Mempelai Pria (`*Putra`) vs Wanita (`*Putri`)**: Jangan pernah tertukar kolomnya.
- **Sistem Template Dinamis (Task-v2)**: Semua template (A: Simple Modern, B: Taman Rahasia, C: Kirigami Pastel, D: Tumbuh Bersama, E: Meja Sang Koki) dan template baru di masa depan terintegrasi 100% dinamis melalui kolom `template_wedings.customContent` JSON. Dilarang keras meng-hardcode teks naratif/cerita di template! Panduan lengkap penambahan template baru ada di `docs/STANDAR_PEMBUATAN_TEMPLATE_TASK_V2.md`.
