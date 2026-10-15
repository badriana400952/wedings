/**
 * Sentral Registrasi Seluruh Template Undangan (A, B, C, D)
 * Menghubungkan template-template dengan nama folder modular:
 * - Template A: Simple Modern (@/components/templateA-simple-modern)
 * - Template B: Taman Rahasia (@/components/templateB-taman-rahasia)
 * - Template C: Kirigami Pastel (@/components/templateC-kirigami-pastel)
 * - Template D: Tumbuh Bersama (@/components/templateD-tumbuh-bersama)
 */

import SimpleModern from '@/components/templateA-simple-modern/SimpleModern';
import TamanRahasia from '@/components/templateB-taman-rahasia/TamanRahasia';
import KirigamiPastel from '@/components/templateC-kirigami-pastel/KirigamiPastel';
import TumbuhBersama from '@/components/templateD-tumbuh-bersama/TumbuhBersama';
import MejaKoki from '@/components/templateE-meja-koki/MejaKoki';

// Ekspor dengan nama resmi tema
export { SimpleModern, TamanRahasia, KirigamiPastel, TumbuhBersama, MejaKoki };

// Ekspor dengan alias kode template (TemplateA, TemplateB, TemplateC, TemplateD, TemplateE)
export const TemplateA = SimpleModern;
export const TemplateB = TamanRahasia;
export const TemplateC = KirigamiPastel;
export const TemplateD = TumbuhBersama;
export const TemplateE = MejaKoki;

export default {
  A: SimpleModern,
  B: TamanRahasia,
  C: KirigamiPastel,
  D: TumbuhBersama,
  E: MejaKoki,
};
