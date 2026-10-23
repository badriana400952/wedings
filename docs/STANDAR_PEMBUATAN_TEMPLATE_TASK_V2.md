# 🏛️ PANDUAN ARSITEKTUR & STANDAR OPERASIONAL (SOP): PENAMBAHAN TEMPLATE BARU BERBASIS TASK-V2

> [!IMPORTANT]
> **DOKUMEN INI ADALAH STANDAR BAKU (GOLDEN STANDARD) BAGI SETIAP AI AGENT ATAU DEVELOPER YANG AKAN MEMBUAT ATAU MENAMBAHKAN TEMPLATE UNDANGAN PERNIKAHAN BARU DI REPOSITORI INI.**
> Semua template baru (misal: Template F, G, dst.) **WAJIB** mengikuti arsitektur **Task-v2 (*Template-Driven Dynamic Content System*)** agar selaras dengan dashboard, database, dan tidak merusak fitur yang sudah ada.

---

## 💡 1. FILOSOFI & KONSEP UTAMA TASK-V2

### A. Mengapa Task-v2? (Latar Belakang)
Sebelum Task-v2, form dashboard kaku mengikuti tabel database (`namaPutra`, `namaPutri`, `tglAkad`). Setiap kali ada template berkonsep unik (misal: *Kirigami Pastel*, *Taman Botani*, *Fine Dining Sang Koki*), teks puitis, cerita, dan fitur interaktifnya terpaksa di-*hardcode* di komponen. Akibatnya pengantin tidak bisa mengedit narasi cerita dan warnanya.

### B. Solusi Task-v2: Kolom Universal `customContent Json?`
Semua kustomisasi khusus tiap template disimpan ke **1 kolom JSON universal** di PostgreSQL (`custom_content` pada tabel `template_wedings`):
```json
{
  "A": { /* Simple Modern Content */ },
  "B": { /* Taman Rahasia Content */ },
  "C": { /* Kirigami Pastel Content */ },
  "D": { /* Tumbuh Bersama Content */ },
  "E": { /* Meja Sang Koki Content */ },
  "F": { /* Template Baru Anda */ }
}
```

### C. Tiga Prinsip Wajib Task-v2
1. **Zero Hardcoded Narrative**: Tidak boleh ada nama samaran ("Badriana/Nurizzati"), kutipan fiktif, cerita cinta, atau warna yang terkunci mati di kode template.
2. **100% Graceful Fallback**: Setiap template **wajib** memiliki *Preset Default Inspiratif* yang sangat puitis dan siap pakai. Jika pengantin belum menyunting via dashboard, undangan langsung tampil menawan tanpa blank/error.
3. **Alur Pandangan Mata Tamu (*Top-to-Bottom Flow*)**: Urutan pengeditan form di dashboard harus merefleksikan alur scroll tamu dari atas ke bawah:
   `Cover/Hero` ➡️ `Mempelai` ➡️ `Kutipan/Kisah` ➡️ `Acara & Dresscode` ➡️ `Fitur Khusus` ➡️ `Hadiah` ➡️ `Ucapan` ➡️ `Penutup`.

---

## 🛠️ 2. SIKLUS 5 FASE PENAMBAHAN TEMPLATE BARU (SOP EKSEKUSI)

Setiap pembuatan template baru wajib melalui 5 fase terstruktur berikut:

```
┌────────────────────────────────────────────────────────┐
│ FASE 1: DEFINISI TIPE & PRESET (lib/templatePresets.ts)│
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ FASE 2: FORM EDITOR DASHBOARD (TabCustomContent.tsx)   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ FASE 3: KOMPONEN / HTML TEMPLATE (Dinamis 100%)        │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ FASE 4: REGISTRASI ROUTING & SWITCHER (User & Guest)   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ FASE 5: AUDIT ANTI-DUMMY & VERIFIKASI (npx tsc)        │
└────────────────────────────────────────────────────────┘
```

---

### 📝 FASE 1: DEFINISI TIPE & PRESET INSPIRATIF (`lib/templatePresets.ts`)

Buka [`lib/templatePresets.ts`](file:///lib/templatePresets.ts), lalu tambahkan 3 hal:

1. **Definisikan Interface Konten**:
   ```typescript
   export interface TemplateBaruContent {
     // Modul 1: Cover & Hero
     heroGreeting: string;
     heroSubtitle: string;
     
     // Modul 2: Pasangan & Silsilah
     keteranganAnakPria: string;
     keteranganAnakWanita: string;
     
     // Modul 3: Kutipan & Kisah Khusus
     kutipanAyat: string;
     sumberKutipan: string;
     ceritaKisah: Array<{ judul: string; waktu: string; narasi: string; foto: string }>;
     
     // Modul 4: Acara & Dresscode
     dresscodeNote: string;
     dresscodeColors: string[]; // Minimal 3-5 palet hex
     
     // Modul 5: Penutup & Tagar
     closingMessage: string;
     tagarPernikahan: string;
   }
   ```

2. **Buat Preset Default Inspiratif**:
   ```typescript
   export const DEFAULT_TEMPLATE_BARU: TemplateBaruContent = {
     heroGreeting: "Dengan Rahmat Tuhan yang Maha Esa",
     heroSubtitle: "Perayaan Janji Suci Dua Jiwa",
     keteranganAnakPria: "Putra pertama dari",
     keteranganAnakWanita: "Putri kedua dari",
     kutipanAyat: "Dan di antara tanda-tanda kebesaran-Nya...",
     sumberKutipan: "Ar-Rum: 21",
     ceritaKisah: [
       { judul: "Langkah Pertama", waktu: "Januari 2020", narasi: "Di bawah langit sore...", foto: "" }
     ],
     dresscodeNote: "Kami menyambut kehadiran Anda dalam nuansa warna:",
     dresscodeColors: ["#E8D8C8", "#B59E87", "#8C7A6B"],
     closingMessage: "Kehadiran dan doa restu Anda adalah anugerah terindah bagi kami.",
     tagarPernikahan: "#JanjiSuciKita"
   };
   ```

3. **Buat Helper Parser Fallback**:
   ```typescript
   export function getTemplateBaruContent(customContent: any): TemplateBaruContent {
     const saved = customContent?.F || {}; // Misal template F
     return {
       ...DEFAULT_TEMPLATE_BARU,
       ...saved,
       // Jika ada array, pastikan fallback per elemen
       dresscodeColors: Array.isArray(saved.dresscodeColors) && saved.dresscodeColors.length > 0
         ? saved.dresscodeColors
         : DEFAULT_TEMPLATE_BARU.dresscodeColors,
     };
   }
   ```

---

### 🖥️ FASE 2: FORM EDITOR DI DASHBOARD (`TabCustomContent.tsx`)

Buka [`components/dashboard/tabs/TabCustomContent.tsx`](file:///components/dashboard/tabs/TabCustomContent.tsx):

1. **Import Tipe & Helper**:
   ```typescript
   import {
     TemplateBaruContent,
     DEFAULT_TEMPLATE_BARU,
     getTemplateBaruContent
   } from '@/lib/templatePresets';
   ```

2. **Inisialisasi State Form**:
   ```typescript
   const [baruForm, setBaruForm] = useState<TemplateBaruContent>(() => 
     getTemplateBaruContent(initialData?.customContent)
   );
   ```

3. **Sinkronisasi saat `initialData` berubah**:
   ```typescript
   useEffect(() => {
     if (initialData?.customContent) {
       setBaruForm(getTemplateBaruContent(initialData.customContent));
     }
   }, [initialData]);
   ```

4. **Tambahkan Tombol Switcher Navigasi**:
   ```tsx
   <button
     type="button"
     onClick={() => setActiveTab('F')}
     className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
       activeTab === 'F' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
     }`}
   >
     <i className="fas fa-magic"></i>
     <span>Template F: Nama Template</span>
   </button>
   ```

5. **Hubungkan ke Fungsi Simpan (`handleSave`)**:
   ```typescript
   if (activeTab === 'F') payloadContent = baruForm;
   // API PUT /api/user/custom-content akan menyimpan { "F": baruForm }
   ```

6. **Bangun Blok Form `{activeTab === 'F' && (<form ...>)}`**:
   - Susun rapi kartu per seksi (1 s/d 7).
   - Untuk warna busana, gunakan input type `color` + text box hex.
   - Buat tombol submit `"Simpan Seluruh Konten Template F"`.

---

### 🎨 FASE 3: INTEGRASI KOMPONEN TEMPLATE (100% DINAMIS)

Template baru dapat berupa:
- **React Components**: Ditaruh di `components/templateF-nama-template/` (seperti Template A).
- **Bundle HTML Generator**: Ditaruh di `lib/templateFHtml.ts` (seperti Template D & E).

**Aturan Wajib saat Merender Konten:**
1. Panggil parser:
   ```typescript
   const fContent = getTemplateBaruContent(payload?.customContent);
   ```
2. Hubungkan 4 Fitur Database Inti (Sesuai `Rules.md`):
   - **Photoshoot**: Gunakan `payload.galery.fotos` (array foto prewedding).
   - **Kisah Pertemuan**: Gunakan `payload.bersamaFotos` & `fContent.ceritaKisah`.
   - **RSVP**: Simpan ke tabel `comments` (marker `[RSVP]`).
   - **Doa Tamu**: Simpan ke tabel `ucapan_harapan` atau `comments`.
3. Mempelai Pria (`payload.namaLengkapPutra`, `payload.photoPutra`, dll.) dan Mempelai Wanita (`payload.namaLengkapPutri`, `payload.photoPutri`, dll.) **dilarang tertukar**.

---

### 🌐 FASE 4: REGISTRASI ROUTING & VIEW TAMU (`pages/[...slug].tsx`)

Buka [`pages/[...slug].tsx`](file:///pages/[...slug].tsx) atau modul routing:
1. Daftarkan kode template baru pada switcher render view tamu:
   ```tsx
   switch (userTemplate) {
     case 'A': return <SimpleModern ... />;
     case 'B': return <TamanRahasia ... />;
     case 'C': return <KirigamiPastel ... />;
     case 'D': return <TumbuhBersama ... />;
     case 'E': return <MejaSangKoki ... />;
     case 'F': return <TemplateBaru ... />; // Template baru Anda
     default: return <SimpleModern ... />;
   }
   ```
2. Pastikan halaman tamu **MURNI READ-ONLY**:
   - Jangan pernah meletakkan form admin, tombol edit, atau tombol ganti foto di tampilan tamu.

---

### 🛡️ FASE 5: AUDIT ANTI-DUMMY & VERIFIKASI (CHECKLIST AKHIR)

Sebelum mengakhiri pekerjaan, AI **WAJIB** mengecek daftar audit berikut:
- [ ] **Tidak ada nama statis bawaan** (e.g., tidak ada "Badriana", "Nurizzati", "Romeo", "Juliet" yang tertulis hardcoded di template).
- [ ] **Tidak ada broken path foto** (e.g., tidak ada `/default-wedding.jpg` atau URL gambar 404. Gunakan aset yang tersedia di `/assets/images/`).
- [ ] **Peta Google Maps Dinamis**: URL embed maps wajib berbasis `payload.linkMaps` atau query pencarian lokasi dinamis (`https://maps.google.com/maps?q=${mapQuery}&output=embed`). Jangan gunakan place ID statis luar negeri.
- [ ] **Jam & Tanggal Acara Dinamis**: Mendukung rentang jam (`jamMulai` - `jamSelesai`) dan format tanggal bahasa Indonesia via `date.ts`.
- [ ] **Footer Bersih**: Tidak ada link repository GitHub luar atau lisensi fork developer pribadi di halaman undangan tamu.
- [ ] **Kompilasi TypeScript**: Jalankan `$env:PATH = "C:\Program Files\nodejs;" + $env:PATH; npx tsc --noEmit`. Wajib lulus dengan **0 errors** (`exit code 0`).
- [ ] **Dokumentasi Wajib**:
  - Catat sesi di [`docs/CHANGELOG.md`](file:///docs/CHANGELOG.md).
  - Update checklist di [`task-v2.md`](file:///task-v2.md).
