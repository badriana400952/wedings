# 🏗️ ARCHITECTURE — ARSITEKTUR SISTEM & DESAIN TEKNIS

## 1. Diagram Arsitektur Tingkat Tinggi (High-Level Architecture)

Aplikasi dibangun menggunakan model arsitektur **Next.js Pages Router Monolith**, di mana server menangani Server-Side Rendering (SSR) untuk SEO dan halaman publik, melayani REST API internal, serta mengelola autentikasi berbasis sesi JWT.

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Layer (Browser)"]
        GUEST["Tamu Undangan (Mobile/Desktop Browser)\nURL: /[userId] atau /[userId]/to/[guestName]"]
        ADMIN["Pengantin / Admin\nURL: /dashboard & /login"]
    end

    subgraph AppLayer ["Next.js Application Layer (Node.js)"]
        ROUTER["Next.js Pages Router Engine"]
        SSR["Server-Side Rendering (getServerSideProps)\n- pages/[...slug].tsx\n- pages/dashboard.tsx"]
        AUTH["NextAuth.js Session Handler\n- JWT Strategy (30 days)\n- CredentialsProvider"]
        APIS["Next.js API Routes (/api/*)\n- /api/comments\n- /api/ucapan\n- /api/landing\n- /api/galery\n- /api/musik\n- /api/stats\n- /api/upload/image"]
        TEMPLATES["Template Orchestration Hub\n- Template A (SimpleModern)\n- Template B (TamanRahasia)\n- Template C (KirigamiPastel)\n- Template D (TumbuhBersama)"]
    end

    subgraph DataStorage ["Data & External Service Layer"]
        PRISMA["Prisma ORM Client\n(@prisma/client 6.19)"]
        PG[("PostgreSQL Database\n(Users, Templates, Comments, etc.)")]
        CLOUDINARY["Cloudinary Media CDN\n(Foto Mempelai, Header, QRIS)"]
        ASSETS["Static Public Assets\n(Music MP3, CSS, Vanilla JS Engine)"]
    end

    GUEST -->|HTTP GET Request| ROUTER
    ADMIN -->|HTTP GET / POST| ROUTER
    ROUTER --> SSR
    ROUTER --> APIS
    ADMIN -.->|Authenticate| AUTH
    SSR -->|Fetch Wedding & User Data| PRISMA
    APIS -->|CRUD Operations| PRISMA
    PRISMA --> PG
    APIS -->|Upload Images| CLOUDINARY
    SSR --> TEMPLATES
    GUEST -.->|Fetch CSS / JS / Audio| ASSETS
```

---

## 2. Paradigma Rendering: Dual-Layer Render (Hybrid SSR + Vanilla Canvas/DOM Engine)

Projek ini menerapkan dua pola render yang berbeda tergantung jenis template yang dipilih oleh pengguna:

```mermaid
graph TD
    REQUEST["Permintaan Halaman: /[slug]"] --> SSR_CHECK["getServerSideProps (pages/[...slug].tsx)"]
    SSR_CHECK --> FETCH_DB["Query prisma.user.findFirst\n+ templateWeding + galery + pertemuan + musik"]
    FETCH_DB --> SERIALIZE["Serialisasi Data Date -> ISO String"]
    SERIALIZE --> RENDER_DECISION{"Cek templateToUse\n('A' | 'B' | 'C' | 'D')"}

    RENDER_DECISION -->|Template A| REACT_FLOW["Render Pure React Component\n<SimpleModern />\n• React State & Props\n• Tailwind CSS\n• AOS Library"]

    RENDER_DECISION -->|Template B, C, D| HYBRID_FLOW["Render Hybrid HTML Generator\n1. Generate Static HTML String\n   (tamanRahasiaHtml / kirigamiPastelHtml / tumbuhBersamaHtml)\n2. Injeksi via dangerouslySetInnerHTML\n3. Mount Vanilla Animation & Canvas Script (/dist/*.js)\n4. Pasang Delegated Event Listeners di useEffect"]
```

### Mengapa Pendekatan Hybrid Digunakan untuk Template B, C, dan D?
Template B, C, dan D berasal dari desain interaktif berbobot visual tinggi (efek kanvas pohon yang tumbuh dinamis, animasi potong kertas kirigami, sobek kertas amplop, dan audio synth). Agar performa tetap optimal dan tidak terganggu siklus re-render React berulang-ulang:
1. **Markup HTML di-render sekali** saat halaman dimuat.
2. **Skrip Vanilla Engine (`/dist/*.js`)** mengontrol rendering kanvas 60 FPS di luar virtual DOM React.
3. **Komponen React wrapper (`TamanRahasia.tsx`, `KirigamiPastel.tsx`, `TumbuhBersama.tsx`)** bertindak sebagai *bridge*: menangani sinkronisasi data API, event klik, salin rekening, audio BGM, dan validasi formulir tanpa memicu re-render virtual DOM yang dapat merusak status kanvas.

---

## 3. Arsitektur Tampilan Tamu (Guest View) vs Admin Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PEMISAHAN HAK AKSES                              │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ 👤 GUEST VIEW (pages/[...slug].tsx)  │ 🛡️ ADMIN DASHBOARD (pages/dashboard) │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • URL: /[userId] atau /[userId]/to/.. │ • URL: /dashboard                    │
│ • Hak Akses: Publik (Tamu Undangan)  │ • Hak Akses: Terproteksi (NextAuth)  │
│ • Sifat: MURNI READ-ONLY             │ • Sifat: FULL CRUD READ-WRITE        │
│ • Tidak ada tombol edit / admin panel│ • Memuat 10 tab pengaturan lengkap   │
│ • Form hanya untuk RSVP & Doa Restu  │ • Upload media langsung ke Cloudinary│
│ • State cover di-lock di awal        │ • Mengubah pilihan template aktif    │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 4. Arsitektur Aliran Data (Data Flow Architecture)

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Tamu Undangan (Browser)
    participant SlugPage as pages/[...slug].tsx (SSR)
    participant TemplateComp as TumbuhBersama.tsx (Client)
    participant ApiComments as /api/comments (API Route)
    participant Prisma as Prisma Client
    participant DB as PostgreSQL Database

    Guest->>SlugPage: Buka URL /dede/to/Budi
    SlugPage->>Prisma: Query User by Slug + TemplateWeding + Galery + Musik
    Prisma->>DB: SELECT * FROM users JOIN template_wedings...
    DB-->>Prisma: Return Record
    Prisma-->>SlugPage: Return Data Object
    SlugPage-->>Guest: Kembalikan HTML Hasil SSR (Initial Hydration)
    
    Guest->>TemplateComp: Tamu klik "Buka / Sobek Undangan"
    TemplateComp->>TemplateComp: Putar tear-paper.mp3 + Fade-out Cover + Mainkan BGM
    
    Guest->>TemplateComp: Tamu mengisi Form RSVP ("Hadir", 2 Orang)
    TemplateComp->>ApiComments: POST /api/comments (payload: name, presence, comment, kind='rsvp')
    ApiComments->>Prisma: prisma.comment.create(...)
    Prisma->>DB: INSERT INTO comments ...
    DB-->>Prisma: Created Comment Row
    Prisma-->>ApiComments: Return Comment
    ApiComments-->>TemplateComp: HTTP 201 JSON { success: true }
    TemplateComp->>Guest: Tampilkan bibit mekar + Render kartu di feed tanpa reload!
```

---

## 5. Pola Zero Page Reload & Event Delegation

Untuk memastikan interaksi tamu terasa mulus di perangkat mobile:
1. **Form Attribute**: Semua formulir di Template B, C, dan D diberi atribut `onsubmit="return false;"`.
2. **Tombol Submit**: Menggunakan `<button type="button">` (bukan `type="submit"` default HTML form yang me-refresh halaman).
3. **Delegated Event Listener**: Komponen React wrapper memasang listener level dokumen menggunakan fase capture (`useCapture = true`) pada ID form (`#rs-form`, `#ws-form`, `#gf-copy-btn`). Hal ini menjamin event selalu tertangkap meskipun elemen DOM dirender ulang.
4. **Optimistic & Live DOM Update**: Setelah respons `200/201 OK` dari backend diterima, fungsi JavaScript langsung menyisipkan elemen card baru ke container feed (`#ws-bed`, `#rsvp-comments-list`) dan mengupdate angka statistik secara langsung.
