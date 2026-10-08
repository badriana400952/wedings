import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { RSVP_PREFIX } from '@/lib/comment-kind';
import clsx from 'clsx';

interface Stats {
  comments: number;
  likes: number;
  present: number;
  absent: number;
}

interface Comment {
  id: string;
  name: string;
  comment: string;
  presence: boolean;
  likes: number;
  createdAt: string;
}

// Baris "Pohon Harapan" dari tabel khusus ucapan_harapan (per user).
interface UcapanRow {
  id: string;
  name: string;
  ucapan: string;
  createdAt: string;
}

interface DashboardProps {
  initialWeding?: any;
  initialStats?: Stats;
  initialComments?: Comment[];
  sessionUserId?: string;
}

const formatDateForInput = (d: any) => {
  if (!d) return '';
  try {
    const dateObj = new Date(d);
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

type RsvpRow = {
  isRsvp: boolean;
  status: 'attending' | 'not_attending' | 'maybe' | null;
  label: string;
  detail: string;
};

const RSVP_STATUS_STYLES: Record<
  NonNullable<RsvpRow['status']>,
  string
> = {
  attending: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  not_attending:
    'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  maybe: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
};

const RSVP_STATUS_LABELS: Record<NonNullable<RsvpRow['status']>, string> = {
  attending: 'Hadir',
  not_attending: 'Berhalangan',
  maybe: 'Masih Ragu',
};

// RSVP dikirim dari halaman tamu sebagai baris `comments` dengan awalan `[RSVP]`
// (lihat lib/comment-kind.ts). Pisahkan di sini supaya dashboard tidak menampilkan
// marker mentahnya.
const parseRsvp = (raw: string): RsvpRow => {
  const empty: RsvpRow = { isRsvp: false, status: null, label: '', detail: raw };
  if (typeof raw !== 'string' || !raw.startsWith(RSVP_PREFIX)) return empty;

  const body = raw.slice(RSVP_PREFIX.length).trim();
  if (!body) return empty;

  const [head, ...rest] = body.split(/\s+—\s+/);
  const [label, ...paxParts] = head.split(' · ');
  const status = (Object.keys(RSVP_STATUS_LABELS) as NonNullable<RsvpRow['status']>[]).find(
    (s) => RSVP_STATUS_LABELS[s] === label
  );
  if (!status) return empty;

  const detail = [paxParts.join(' · '), rest.join(' — ')]
    .filter(Boolean)
    .join(' — ');

  return { isRsvp: true, status, label: RSVP_STATUS_LABELS[status], detail };
};

export default function Dashboard({
  initialWeding,
  initialStats,
  initialComments,
  sessionUserId,
}: DashboardProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const effectiveUserId = session?.user?.id || sessionUserId;

  // Tab Navigation State
  const [activeTab, setActiveTab] = useState<
    'overview' | 'mempelai' | 'acara' | 'gift' | 'galeri' | 'bersama' | 'ucapan' | 'template' | 'links'
  >('overview');

  const [loading, setLoading] = useState(!initialWeding);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Stats & Comments
  const [stats, setStats] = useState<Stats>(
    initialStats || { comments: 0, likes: 0, present: 0, absent: 0 }
  );
  const [comments, setComments] = useState<Comment[]>(initialComments || []);
  const [ucapanList, setUcapanList] = useState<UcapanRow[]>([]);

  // Selected Template
  const [currentTemplate, setCurrentTemplate] = useState<string>(
    initialWeding?.user?.template || initialWeding?.template || 'A'
  );

  const [loadingTemplate, setLoadingTemplate] = useState<boolean>(false);

  // Form Wedding Data State
  const [formData, setFormData] = useState({
    // Header
    fotoHeader: initialWeding?.fotoHeader || '',
    // Mempelai Pria
    namaLengkapPutra: initialWeding?.namaLengkapPutra || '',
    namaPutra: initialWeding?.namaPutra || '',
    namaAyahPutra: initialWeding?.namaAyahPutra || '',
    namaIbuPutra: initialWeding?.namaIbuPutra || '',
    kelahiranPutra: initialWeding?.kelahiranPutra || '',
    instagramPutra: initialWeding?.instagramPutra || '',
    photoPutra: initialWeding?.photoPutra || '',
    // Mempelai Wanita
    namaLengkapPutri: initialWeding?.namaLengkapPutri || '',
    namaPutri: initialWeding?.namaPutri || '',
    namaAyahPutri: initialWeding?.namaAyahPutri || '',
    namaIbuPutri: initialWeding?.namaIbuPutri || '',
    kelahiranPutri: initialWeding?.kelahiranPutri || '',
    instagramPutri: initialWeding?.instagramPutri || '',
    photoPutri: initialWeding?.photoPutri || '',
    // Acara & Lokasi
    tanggalPernikahan: formatDateForInput(initialWeding?.tanggalPernikahan),
    linkGoogleCalender: initialWeding?.linkGoogleCalender || '',
    tanggalAkad: formatDateForInput(initialWeding?.tanggalAkad || initialWeding?.tanggalPernikahan),
    jamAkad: initialWeding?.jamAkad || initialWeding?.jamMulai || '',
    lokasiAkad: initialWeding?.lokasiAkad || '',
    alamatAkad: initialWeding?.alamatAkad || initialWeding?.alamatPernikahan || '',
    tanggalResepsi: formatDateForInput(initialWeding?.tanggalResepsi || initialWeding?.tanggalPernikahan),
    jamResepsi: initialWeding?.jamResepsi || '',
    jamSelesai: initialWeding?.jamSelesai || '',
    lokasiResepsi: initialWeding?.lokasiResepsi || initialWeding?.alamatGedungPernikahan || '',
    alamatPernikahan: initialWeding?.alamatPernikahan || '',
    linkMaps: initialWeding?.linkMaps || '',
    // Love Gift
    isGiftActive: initialWeding?.isGiftActive !== undefined ? initialWeding.isGiftActive : true,
    isBankActive: initialWeding?.isBankActive !== undefined ? initialWeding.isBankActive : true,
    namaBank: initialWeding?.namaBank || '',
    noAtm: initialWeding?.noAtm || '',
    noHp: initialWeding?.noHp || '',
    isQrisActive: initialWeding?.isQrisActive !== undefined ? initialWeding.isQrisActive : true,
    fotoQris: initialWeding?.fotoQris || '',
  });

  // File Uploads
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    fotoHeader: null,
    photoPutra: null,
    photoPutri: null,
    fotoQris: null,
  });

  // Previews
  const [previews, setPreviews] = useState<{ [key: string]: string }>({
    fotoHeader: initialWeding?.fotoHeader || '',
    photoPutra: initialWeding?.photoPutra || '',
    photoPutri: initialWeding?.photoPutri || '',
    fotoQris: initialWeding?.fotoQris || '',
  });

  // Galeri Fotos
  const [galeriId, setGaleriId] = useState<string>(initialWeding?.galery?.id || '');
  const [galeriFotos, setGaleriFotos] = useState<string[]>(initialWeding?.galery?.fotos || []);
  const [newGaleriFile, setNewGaleriFile] = useState<File | null>(null);
  const [uploadingGaleri, setUploadingGaleri] = useState(false);
  const galeriInputRef = useRef<HTMLInputElement>(null);

  // Gambar Bersama — 6 slot, dipakai di Taman Rahasia atau Kisah Pertemuan
  const BERSAMA_SLOTS = 6;
  const [bersamaFotos, setBersamaFotos] = useState<string[]>(
    Array.isArray(initialWeding?.bersamaFotos) ? (initialWeding.bersamaFotos as string[]) : []
  );
  const [bersamaDipakai, setBersamaDipakai] = useState<string>(initialWeding?.bersamaDipakai || 'taman');
  const [uploadingBersama, setUploadingBersama] = useState<number | null>(null);
  const bersamaInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Link Generator State
  const [guestName, setGuestName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (!initialWeding && effectiveUserId) {
      fetchDashboardData();
    }
  }, [effectiveUserId, initialWeding]);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const fetchDashboardData = async () => {
    const targetId = effectiveUserId;
    if (!targetId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const templateRes = await fetch(`/api/landing/${targetId}`);
      const templateJson = await templateRes.json();
      const weding = templateJson.response;

      if (weding) {
        setFormData({
          fotoHeader: weding.fotoHeader || '',
          namaLengkapPutra: weding.namaLengkapPutra || '',
          namaPutra: weding.namaPutra || '',
          namaAyahPutra: weding.namaAyahPutra || '',
          namaIbuPutra: weding.namaIbuPutra || '',
          kelahiranPutra: weding.kelahiranPutra || '',
          instagramPutra: weding.instagramPutra || '',
          photoPutra: weding.photoPutra || '',
          namaLengkapPutri: weding.namaLengkapPutri || '',
          namaPutri: weding.namaPutri || '',
          namaAyahPutri: weding.namaAyahPutri || '',
          namaIbuPutri: weding.namaIbuPutri || '',
          kelahiranPutri: weding.kelahiranPutri || '',
          instagramPutri: weding.instagramPutri || '',
          photoPutri: weding.photoPutri || '',
          tanggalPernikahan: formatDateForInput(weding.tanggalPernikahan),
          linkGoogleCalender: weding.linkGoogleCalender || '',
          tanggalAkad: formatDateForInput(weding.tanggalAkad || weding.tanggalPernikahan),
          jamAkad: weding.jamAkad || weding.jamMulai || '',
          lokasiAkad: weding.lokasiAkad || '',
          alamatAkad: weding.alamatAkad || weding.alamatPernikahan || '',
          tanggalResepsi: formatDateForInput(weding.tanggalResepsi || weding.tanggalPernikahan),
          jamResepsi: weding.jamResepsi || '',
          jamSelesai: weding.jamSelesai || '',
          lokasiResepsi: weding.lokasiResepsi || weding.alamatGedungPernikahan || '',
          alamatPernikahan: weding.alamatPernikahan || '',
          linkMaps: weding.linkMaps || '',
          isGiftActive: weding.isGiftActive !== undefined ? weding.isGiftActive : true,
          isBankActive: weding.isBankActive !== undefined ? weding.isBankActive : true,
          namaBank: weding.namaBank || '',
          noAtm: weding.noAtm || '',
          noHp: weding.noHp || '',
          isQrisActive: weding.isQrisActive !== undefined ? weding.isQrisActive : true,
          fotoQris: weding.fotoQris || '',
        });

        setPreviews({
          fotoHeader: weding.fotoHeader || '',
          photoPutra: weding.photoPutra || '',
          photoPutri: weding.photoPutri || '',
          fotoQris: weding.fotoQris || '',
        });

        if (weding.user?.template) {
          setCurrentTemplate(weding.user.template);
        }

        if (weding.galery) {
          setGaleriId(weding.galery.id);
          setGaleriFotos(weding.galery.fotos || []);
        }

        // Fetch Stats & Comments
        const [statsRes, commentsRes, ucapanRes] = await Promise.all([
          fetch(`/api/stats?templateWedingId=${weding.id}`),
          fetch(`/api/comments?templateWedingId=${weding.id}`),
          fetch(`/api/ucapan?templateWedingId=${weding.id}`),
        ]);

        const statsData = await statsRes.json();
        const commentsData = await commentsRes.json();
        const ucapanData = await ucapanRes.json();

        setStats(statsData.data || { comments: 0, likes: 0, present: 0, absent: 0 });
        setComments(commentsData.comments || []);
        setUcapanList(ucapanData.ucapan || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      showNotification('error', 'Gagal memuat data dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [key]: file }));
      setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
    }
  };

  const handleSaveWeddingData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveUserId) return;

    try {
      setSaving(true);
      const body = new FormData();

      // Append text fields
      Object.entries(formData).forEach(([key, val]) => {
        if (typeof val === 'boolean') {
          body.append(key, val ? 'true' : 'false');
        } else if (val !== null && val !== undefined) {
          body.append(key, String(val));
        }
      });

      // Append files if selected
      if (files.fotoHeader) body.append('fotoHeader', files.fotoHeader);
      if (files.photoPutra) body.append('photoPutra', files.photoPutra);
      if (files.photoPutri) body.append('photoPutri', files.photoPutri);
      if (files.fotoQris) body.append('fotoQris', files.fotoQris);

      const res = await fetch(`/api/landing/${effectiveUserId}`, {
        method: 'PUT',
        body,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showNotification('success', '✅ Data pernikahan berhasil disimpan!');
        // Clear staged file objects
        setFiles({ fotoHeader: null, photoPutra: null, photoPutri: null, fotoQris: null });
      } else {
        showNotification('error', '❌ ' + (json.message || 'Gagal menyimpan data'));
      }
    } catch (err: any) {
      console.error('Error saving wedding data:', err);
      showNotification('error', '❌ Terjadi kesalahan saat menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectTemplate = async (templateCode: string) => {
    setLoadingTemplate(true)
    try {
      const res = await fetch('/api/user/template', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: templateCode }),
      });
      setLoadingTemplate(false)
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentTemplate(templateCode);
        showNotification('success', `✅ Template berhasil diganti ke Template ${templateCode}!`);
      } else {
        showNotification('error', '❌ Gagal mengganti template: ' + (data.message || ''));
      }
    } catch (err) {
      setLoadingTemplate(false)
      console.error(err);
      showNotification('error', '❌ Terjadi kesalahan saat mengganti template');
    }
  };

  const handleUploadGaleriPhoto = async () => {
    if (!newGaleriFile || !effectiveUserId) {
      alert('Pilih foto terlebih dahulu');
      return;
    }

    try {
      setUploadingGaleri(true);
      const uploadForm = new FormData();
      uploadForm.append('file', newGaleriFile);

      // Upload image
      const uploadRes = await fetch('/api/upload/image', {
        method: 'POST',
        body: uploadForm,
      });
      const uploadJson = await uploadRes.json();

      const newUrl = uploadJson.url || (uploadJson.urls && uploadJson.urls[0]);

      if (!uploadRes.ok || !newUrl) {
        throw new Error(uploadJson.message || uploadJson.error || 'Upload gagal');
      }

      const updatedFotos = [...galeriFotos, newUrl];

      // Update galeri in database (gunakan galeriId atau userId session sebagai fallback)
      const targetGId = galeriId || effectiveUserId;
      const galeryRes = await fetch(`/api/galery/${targetGId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fotos: updatedFotos }),
      });
      const galeryJson = await galeryRes.json();

      if (!galeryRes.ok || !galeryJson.success) {
        throw new Error(galeryJson.message || 'Gagal menyimpan foto ke galeri');
      }

      if (galeryJson.data?.id) {
        setGaleriId(galeryJson.data.id);
      }

      setGaleriFotos(updatedFotos);
      setNewGaleriFile(null);
      if (galeriInputRef.current) {
        galeriInputRef.current.value = '';
      }
      showNotification('success', '✅ Foto berhasil ditambahkan ke galeri!');
    } catch (err: any) {
      console.error(err);
      showNotification('error', '❌ ' + (err.message || 'Gagal upload foto'));
    } finally {
      setUploadingGaleri(false);
    }
  };

  const saveBersama = async (fotos: string[], dipakai: string) => {
    const res = await fetch(`/api/landing/${effectiveUserId}/bersama`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bersamaFotos: fotos, bersamaDipakai: dipakai }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Gagal menyimpan Gambar Bersama');
  };

  const handleUploadBersama = async (index: number, file: File | null) => {
    if (!file || !effectiveUserId) {
      if (file) alert('Silakan masuk terlebih dahulu.');
      return;
    }
    try {
      setUploadingBersama(index);
      const form = new FormData();
      form.append('file', file);
      const uploadRes = await fetch('/api/upload/image', { method: 'POST', body: form });
      const uploadJson = await uploadRes.json();
      const newUrl = uploadJson.url || (uploadJson.urls && uploadJson.urls[0]);
      if (!uploadRes.ok || !newUrl) {
        throw new Error(uploadJson.message || uploadJson.error || 'Upload gagal');
      }

      const next = Array.from({ length: BERSAMA_SLOTS }, (_, i) => bersamaFotos[i] || '');
      next[index] = newUrl;
      const cleaned = next.filter(Boolean);
      setBersamaFotos(cleaned);
      await saveBersama(cleaned, bersamaDipakai);
      showNotification('success', `? Foto bersama ${index + 1} berhasil disimpan!`);
    } catch (err: any) {
      showNotification('error', `? Gagal: ${err.message}`);
    } finally {
      setUploadingBersama(null);
      if (bersamaInputRefs.current[index]) bersamaInputRefs.current[index]!.value = '';
    }
  };

  const handleDeleteBersama = async (index: number) => {
    if (!effectiveUserId) return;
    const next = bersamaFotos.filter((_, i) => i !== index);
    setBersamaFotos(next);
    try {
      await saveBersama(next, bersamaDipakai);
      showNotification('success', '? Foto bersama dihapus');
    } catch (err: any) {
      showNotification('error', `? Gagal: ${err.message}`);
      setBersamaFotos(bersamaFotos);
    }
  };

  const handleBersamaDipakaiChange = async (value: string) => {
    setBersamaDipakai(value);
    if (!effectiveUserId) return;
    try {
      await saveBersama(bersamaFotos, value);
      showNotification('success', '? Lokasi foto diperbarui');
    } catch (err: any) {
      showNotification('error', `? Gagal: ${err.message}`);
    }
  };

  const handleDeleteGaleriPhoto = async (indexToDelete: number) => {
    if (!confirm('Yakin ingin menghapus foto ini dari galeri?')) return;

    try {
      const updatedFotos = galeriFotos.filter((_, idx) => idx !== indexToDelete);
      const targetGId = galeriId || effectiveUserId;
      if (targetGId) {
        const galeryRes = await fetch(`/api/galery/${targetGId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fotos: updatedFotos }),
        });
        const galeryJson = await galeryRes.json();
        if (!galeryRes.ok || !galeryJson.success) {
          throw new Error(galeryJson.message || 'Gagal menghapus foto dari galeri');
        }
      }
      setGaleriFotos(updatedFotos);
      showNotification('success', '✅ Foto berhasil dihapus dari galeri');
    } catch (err: any) {
      console.error(err);
      showNotification('error', '❌ ' + (err.message || 'Gagal menghapus foto'));
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Yakin ingin menghapus komentar ini?')) return;

    try {
      const res = await fetch(`/api/comments/${commentId}/delete`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('success', '✅ Komentar berhasil dihapus');
        fetchDashboardData();
      } else {
        showNotification('error', '❌ ' + (data.error || 'Gagal menghapus komentar'));
      }
    } catch (error) {
      console.error(error);
      showNotification('error', '❌ Gagal menghapus komentar');
    }
  };

  const handleDeleteUcapan = async (ucapanId: string) => {
    if (!confirm('Yakin ingin menghapus ucapan ini dari Pohon Harapan?')) return;

    try {
      const res = await fetch(`/api/ucapan/${ucapanId}/delete`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('success', '✅ Ucapan berhasil dihapus');
        fetchDashboardData();
      } else {
        showNotification('error', '❌ ' + (data.error || 'Gagal menghapus ucapan'));
      }
    } catch (error) {
      console.error(error);
      showNotification('error', '❌ Gagal menghapus ucapan');
    }
  };

  const downloadCSV = () => {
    const csv = [
      ['Name', 'Jenis', 'Kehadiran', 'Isi', 'Likes', 'Date'],
      ...comments.map(c => {
        const rsvp = parseRsvp(c.comment);
        return [
          c.name,
          rsvp.isRsvp ? 'RSVP' : 'Ucapan',
          rsvp.isRsvp ? rsvp.label : c.presence ? 'Hadir' : 'Tidak Hadir',
          rsvp.detail.replace(/"/g, '""'),
          c.likes,
          new Date(c.createdAt).toLocaleString('id-ID'),
        ];
      }),
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ucapan-tamu-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const generateLink = () => {
    if (!guestName.trim()) {
      alert('Mohon masukkan nama tamu undangan');
      return;
    }
    const baseUrl = window.location.origin;
    const encoded = encodeURIComponent(guestName.trim());
    const link = `${baseUrl}/${effectiveUserId}/to/${encoded}`;
    setGeneratedLink(link);
  };

  const copyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      alert('Link berhasil disalin ke clipboard!');
    }
  };

  const getWhatsAppShareUrl = () => {
    const text = `Kepada Yth. Bapak/Ibu/Saudara/i *${guestName}*,

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir dalam acara pernikahan kami.

Detail acara dan undangan lengkap dapat diakses melalui link berikut:
${generatedLink}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Terima kasih.`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard Admin - Pengaturan Undangan</title>
      </Head>

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Undangan Admin
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold">
                  Template {currentTemplate}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Kelola data pernikahan, amplop digital, dan link tamu dari satu tempat.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`/${effectiveUserId}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <i className="fas fa-eye"></i>
                Lihat Undangan
              </a>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Global Notification Banner */}
        {message && (
          <div
            className={clsx(
              'max-w-7xl mx-auto mt-4 px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium shadow-md transition-all',
              message.type === 'success'
                ? 'bg-emerald-500 text-white'
                : 'bg-rose-500 text-white'
            )}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-white hover:opacity-80">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 space-y-1.5 sticky top-24">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'overview'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <i className="fas fa-chart-pie w-5 text-center"></i>
                  Statistik & Buku Tamu
                </button>

                <button
                  onClick={() => setActiveTab('mempelai')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'mempelai'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <i className="fas fa-user-friends w-5 text-center"></i>
                  Data Mempelai
                </button>

                <button
                  onClick={() => setActiveTab('acara')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'acara'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <i className="fas fa-calendar-alt w-5 text-center"></i>
                  Jadwal & Lokasi Acara
                </button>

                <button
                  onClick={() => setActiveTab('gift')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'gift'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <i className="fas fa-gift w-5 text-center"></i>
                  Amplop Digital & QRIS
                </button>

                <button
                  onClick={() => setActiveTab('galeri')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'galeri'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <i className="fas fa-images w-5 text-center"></i>
                  Galeri Foto
                </button>

                <button
                  onClick={() => setActiveTab('bersama')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'bersama'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <i className="fas fa-heart w-5 text-center"></i>
                  Gambar Bersama
                </button>

                <button
                  onClick={() => setActiveTab('ucapan')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'ucapan'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <i className="fas fa-tree w-5 text-center"></i>
                  Pohon Harapan
                </button>

                <button
                  onClick={() => setActiveTab('template')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'template'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <i className="fas fa-palette w-5 text-center"></i>
                  Pilih Template
                </button>

                <button
                  onClick={() => setActiveTab('links')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'links'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <i className="fas fa-paper-plane w-5 text-center"></i>
                  Generator Link Undangan
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* TAB 1: OVERVIEW & BUKU TAMU */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Ucapan</p>
                        <p className="text-2xl font-bold mt-1">{stats.comments}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center text-lg">
                        <i className="fas fa-comment-dots"></i>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Hadir</p>
                        <p className="text-2xl font-bold mt-1 text-emerald-600">{stats.present}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-lg">
                        <i className="fas fa-check-circle"></i>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Tidak Hadir</p>
                        <p className="text-2xl font-bold mt-1 text-rose-600">{stats.absent}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 flex items-center justify-center text-lg">
                        <i className="fas fa-times-circle"></i>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Likes</p>
                        <p className="text-2xl font-bold mt-1 text-amber-500">{stats.likes}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 flex items-center justify-center text-lg">
                        <i className="fas fa-heart"></i>
                      </div>
                    </div>
                  </div>

                  {/* Comments Table */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold">Daftar Ucapan & Doa Tamu</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Kelola ucapan atau hapus komentar yang tidak sesuai</p>
                      </div>
                      <button
                        onClick={downloadCSV}
                        className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
                      >
                        <i className="fas fa-download"></i>
                        Download CSV
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-750 text-gray-600 dark:text-gray-300 uppercase text-xs">
                          <tr>
                            <th className="px-5 py-3.5">Nama Tamu</th>
                            <th className="px-5 py-3.5">Kehadiran</th>
                            <th className="px-5 py-3.5">Ucapan & Pesan</th>
                            <th className="px-5 py-3.5">Waktu</th>
                            <th className="px-5 py-3.5 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {comments.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="text-center py-8 text-gray-500">
                                Belum ada komentar atau ucapan dari tamu.
                              </td>
                            </tr>
                          ) : (
                            comments.map(c => {
                              const rsvp = parseRsvp(c.comment);
                              return (
                              <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-750/50">
                                <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                                  {c.name}
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                  {rsvp.isRsvp && rsvp.status ? (
                                    <span
                                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${RSVP_STATUS_STYLES[rsvp.status]}`}
                                    >
                                      {rsvp.label}
                                    </span>
                                  ) : (
                                    <span
                                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                        c.presence
                                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
                                      }`}
                                    >
                                      {c.presence ? 'Hadir' : 'Tidak Hadir'}
                                    </span>
                                  )}
                                </td>
                                <td className="px-5 py-4 text-gray-700 dark:text-gray-300 max-w-xs truncate">
                                  {rsvp.detail || '—'}
                                </td>
                                <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                                  {new Date(c.createdAt).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </td>
                                <td className="px-5 py-4 text-center">
                                  <button
                                    onClick={() => handleDeleteComment(c.id)}
                                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                                    title={rsvp.isRsvp ? 'Hapus konfirmasi kehadiran' : 'Hapus komentar'}
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                </td>
                              </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DATA MEMPELAI */}
              {activeTab === 'mempelai' && (
                <form onSubmit={handleSaveWeddingData} className="space-y-6">
                  {/* Foto Header / Cover */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <i className="fas fa-image text-blue-500"></i>
                      Foto Utama / Cover Header
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                      <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex-shrink-0">
                        {previews.fotoHeader ? (
                          <img
                            src={previews.fotoHeader}
                            alt="Cover Header"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <i className="fas fa-cloud-upload-alt text-3xl mb-1"></i>
                            <span className="text-xs">Belum ada foto</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Upload Foto Banner / Header
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileChange(e, 'fotoHeader')}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                        <p className="text-xs text-gray-500">Format: JPG, PNG, atau WEBP. Disarankan ukuran lanskap resolusi tinggi.</p>
                      </div>
                    </div>
                  </div>

                  {/* Mempelai Pria */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                      <i className="fas fa-male text-blue-500"></i>
                      Data Mempelai Pria (Groom)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Nama Lengkap Pria
                        </label>
                        <input
                          type="text"
                          name="namaLengkapPutra"
                          value={formData.namaLengkapPutra}
                          onChange={handleInputChange}
                          placeholder="Contoh: Badriana, S.Kom"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Nama Panggilan Pria
                        </label>
                        <input
                          type="text"
                          name="namaPutra"
                          value={formData.namaPutra}
                          onChange={handleInputChange}
                          placeholder="Contoh: Badri"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Nama Ayah
                        </label>
                        <input
                          type="text"
                          name="namaAyahPutra"
                          value={formData.namaAyahPutra}
                          onChange={handleInputChange}
                          placeholder="Nama Ayah Mempelai Pria"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Nama Ibu
                        </label>
                        <input
                          type="text"
                          name="namaIbuPutra"
                          value={formData.namaIbuPutra}
                          onChange={handleInputChange}
                          placeholder="Nama Ibu Mempelai Pria"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Informasi Kelahiran / Putra ke-
                        </label>
                        <input
                          type="text"
                          name="kelahiranPutra"
                          value={formData.kelahiranPutra}
                          onChange={handleInputChange}
                          placeholder="Contoh: Putra pertama, lahir di Bandung 12 Mei 1998"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Instagram Pria
                        </label>
                        <input
                          type="text"
                          name="instagramPutra"
                          value={formData.instagramPutra}
                          onChange={handleInputChange}
                          placeholder="Username Instagram tanpa @"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Foto Pria */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex-shrink-0">
                        {previews.photoPutra ? (
                          <img
                            src={previews.photoPutra}
                            alt="Foto Pria"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <i className="fas fa-user text-2xl"></i>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Foto Mempelai Pria
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileChange(e, 'photoPutra')}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mempelai Wanita */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                      <i className="fas fa-female text-pink-500"></i>
                      Data Mempelai Wanita (Bride)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Nama Lengkap Wanita
                        </label>
                        <input
                          type="text"
                          name="namaLengkapPutri"
                          value={formData.namaLengkapPutri}
                          onChange={handleInputChange}
                          placeholder="Contoh: Izzah Nur Fadilah, S.Pd"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Nama Panggilan Wanita
                        </label>
                        <input
                          type="text"
                          name="namaPutri"
                          value={formData.namaPutri}
                          onChange={handleInputChange}
                          placeholder="Contoh: Izzah"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Nama Ayah
                        </label>
                        <input
                          type="text"
                          name="namaAyahPutri"
                          value={formData.namaAyahPutri}
                          onChange={handleInputChange}
                          placeholder="Nama Ayah Mempelai Wanita"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Nama Ibu
                        </label>
                        <input
                          type="text"
                          name="namaIbuPutri"
                          value={formData.namaIbuPutri}
                          onChange={handleInputChange}
                          placeholder="Nama Ibu Mempelai Wanita"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Informasi Kelahiran / Putri ke-
                        </label>
                        <input
                          type="text"
                          name="kelahiranPutri"
                          value={formData.kelahiranPutri}
                          onChange={handleInputChange}
                          placeholder="Contoh: Putri kedua, lahir di Jakarta 20 Juli 2000"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Instagram Wanita
                        </label>
                        <input
                          type="text"
                          name="instagramPutri"
                          value={formData.instagramPutri}
                          onChange={handleInputChange}
                          placeholder="Username Instagram tanpa @"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Foto Wanita */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex-shrink-0">
                        {previews.photoPutri ? (
                          <img
                            src={previews.photoPutri}
                            alt="Foto Wanita"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <i className="fas fa-female text-2xl"></i>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Foto Mempelai Wanita
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileChange(e, 'photoPutri')}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                      <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
                      {saving ? 'Menyimpan...' : 'Simpan Data Mempelai'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: JADWAL & LOKASI ACARA */}
              {activeTab === 'acara' && (
                <form onSubmit={handleSaveWeddingData} className="space-y-6">
                  {/* Tanggal Utama & Kalender */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                      <i className="fas fa-calendar-check text-blue-500"></i>
                      Informasi Tanggal Pernikahan Utama
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Tanggal Hari-H Pernikahan
                        </label>
                        <input
                          type="date"
                          name="tanggalPernikahan"
                          value={formData.tanggalPernikahan}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Link Google Calendar
                        </label>
                        <input
                          type="url"
                          name="linkGoogleCalender"
                          value={formData.linkGoogleCalender}
                          onChange={handleInputChange}
                          placeholder="https://calendar.google.com/..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Akad Nikah */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                      <i className="fas fa-ring text-amber-500"></i>
                      Rangkaian Acara Akad Nikah
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Tanggal Akad
                        </label>
                        <input
                          type="date"
                          name="tanggalAkad"
                          value={formData.tanggalAkad}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Jam Akad (WIB)
                        </label>
                        <input
                          type="text"
                          name="jamAkad"
                          value={formData.jamAkad}
                          onChange={handleInputChange}
                          placeholder="Contoh: 08:00 WIB - Selesai"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Tempat / Nama Gedung / Masjid
                        </label>
                        <input
                          type="text"
                          name="lokasiAkad"
                          value={formData.lokasiAkad}
                          onChange={handleInputChange}
                          placeholder="Contoh: Masjid Agung Al-Ukhuwah"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Alamat Lengkap Akad
                        </label>
                        <input
                          type="text"
                          name="alamatAkad"
                          value={formData.alamatAkad}
                          onChange={handleInputChange}
                          placeholder="Jl. Wastukencana No. 27, Bandung"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resepsi Nikah */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                      <i className="fas fa-glass-cheers text-purple-500"></i>
                      Rangkaian Acara Resepsi Nikah
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Tanggal Resepsi
                        </label>
                        <input
                          type="date"
                          name="tanggalResepsi"
                          value={formData.tanggalResepsi}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Jam Resepsi (WIB)
                        </label>
                        <input
                          type="text"
                          name="jamResepsi"
                          value={formData.jamResepsi}
                          onChange={handleInputChange}
                          placeholder="Contoh: 11:00 WIB - 14:00 WIB"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Nama Gedung / Tempat Resepsi
                        </label>
                        <input
                          type="text"
                          name="lokasiResepsi"
                          value={formData.lokasiResepsi}
                          onChange={handleInputChange}
                          placeholder="Contoh: Grand Ballroom Hotel Horison"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Link Google Maps
                        </label>
                        <input
                          type="url"
                          name="linkMaps"
                          value={formData.linkMaps}
                          onChange={handleInputChange}
                          placeholder="https://maps.app.goo.gl/..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                          Alamat Lengkap Lokasi Resepsi
                        </label>
                        <textarea
                          rows={2}
                          name="alamatPernikahan"
                          value={formData.alamatPernikahan}
                          onChange={handleInputChange}
                          placeholder="Jl. Pelajar Pejuang 45 No.121, Turangga, Lengkong, Kota Bandung"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                      <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
                      {saving ? 'Menyimpan...' : 'Simpan Jadwal & Lokasi'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: AMPLOP DIGITAL / LOVE GIFT */}
              {activeTab === 'gift' && (
                <form onSubmit={handleSaveWeddingData} className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <i className="fas fa-gift text-amber-500"></i>
                          Pengaturan Amplop Digital (Love Gift)
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Aktifkan atau nonaktifkan fitur kirim kado / transfer untuk tamu
                        </p>
                      </div>

                      {/* Main Toggle Switch */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isGiftActive"
                          checked={formData.isGiftActive}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-semibold text-gray-900 dark:text-gray-300">
                          {formData.isGiftActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </label>
                    </div>

                    {/* Section Bank Transfer */}
                    <div className={`space-y-4 p-4 rounded-xl border transition-all ${
                      formData.isBankActive ? 'bg-gray-50 dark:bg-gray-750 border-gray-200 dark:border-gray-600' : 'bg-gray-50/50 opacity-60 border-dashed border-gray-300 dark:border-gray-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold flex items-center gap-2">
                          <i className="fas fa-university text-blue-500"></i>
                          Transfer Rekening Bank / E-Wallet
                        </h4>
                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            name="isBankActive"
                            checked={formData.isBankActive}
                            onChange={handleInputChange}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          Tampilkan Rekening Bank
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Nama Bank
                          </label>
                          <input
                            type="text"
                            name="namaBank"
                            value={formData.namaBank}
                            onChange={handleInputChange}
                            placeholder="Contoh: BCA / Mandiri / BRI"
                            disabled={!formData.isBankActive}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Nomor Rekening / ATM
                          </label>
                          <input
                            type="text"
                            name="noAtm"
                            value={formData.noAtm}
                            onChange={handleInputChange}
                            placeholder="Contoh: 1234567890"
                            disabled={!formData.isBankActive}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Nomor HP / DANA / OVO
                          </label>
                          <input
                            type="text"
                            name="noHp"
                            value={formData.noHp}
                            onChange={handleInputChange}
                            placeholder="Contoh: 08123456789"
                            disabled={!formData.isBankActive}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section QRIS */}
                    <div className={`space-y-4 p-4 rounded-xl border transition-all ${
                      formData.isQrisActive ? 'bg-gray-50 dark:bg-gray-750 border-gray-200 dark:border-gray-600' : 'bg-gray-50/50 opacity-60 border-dashed border-gray-300 dark:border-gray-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold flex items-center gap-2">
                          <i className="fas fa-qrcode text-emerald-500"></i>
                          Pembayaran via QRIS
                        </h4>
                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            name="isQrisActive"
                            checked={formData.isQrisActive}
                            onChange={handleInputChange}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          Tampilkan QRIS
                        </label>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative w-36 h-36 rounded-xl overflow-hidden bg-white border border-gray-300 dark:border-gray-600 flex-shrink-0 flex items-center justify-center">
                          {previews.fotoQris ? (
                            <img
                              src={previews.fotoQris}
                              alt="QRIS Preview"
                              className="w-full h-full object-contain p-2"
                            />
                          ) : (
                            <div className="text-center text-gray-400">
                              <i className="fas fa-qrcode text-3xl mb-1"></i>
                              <span className="text-[10px] block">Belum ada QRIS</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 w-full space-y-2">
                          <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                            Upload Gambar QRIS
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={!formData.isQrisActive}
                            onChange={e => handleFileChange(e, 'fotoQris')}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer disabled:opacity-50"
                          />
                          <p className="text-xs text-gray-500">
                            Pastikan barcode QRIS terlihat jelas agar mudah di-scan oleh tamu.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                      <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
                      {saving ? 'Menyimpan...' : 'Simpan Pengaturan Gift'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 5: GALERI FOTO */}
              {activeTab === 'galeri' && (
                <div className="space-y-6">
                  {/* Upload New Photo */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <i className="fas fa-cloud-upload-alt text-blue-500"></i>
                      Tambah Foto Photoshoot
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <input
                        ref={galeriInputRef}
                        type="file"
                        accept="image/*"
                        onChange={e => setNewGaleriFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                      <button
                        onClick={handleUploadGaleriPhoto}
                        disabled={!newGaleriFile || uploadingGaleri}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 disabled:opacity-50 shadow-sm"
                      >
                        <i className={`fas ${uploadingGaleri ? 'fa-spinner fa-spin' : 'fa-plus'}`}></i>
                        {uploadingGaleri ? 'Mengunggah...' : 'Upload Foto'}
                      </button>
                    </div>
                  </div>

                  {/* Photos Grid */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
                      <span>Daftar Foto Galeri ({galeriFotos.length})</span>
                    </h3>

                    {galeriFotos.length === 0 ? (
                      <p className="text-gray-500 text-sm py-8 text-center">
                        Belum ada foto galeri. Upload foto momen berdua di atas!
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {galeriFotos.map((fotoUrl, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <img
                              src={fotoUrl}
                              alt={`Galeri ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Tombol Hapus: Selalu terlihat di pojok kanan atas, sangat ramah mobile/desktop */}
                            <button
                              type="button"
                              onClick={() => handleDeleteGaleriPhoto(idx)}
                              className="absolute top-2 right-2 px-2.5 py-1.5 bg-rose-600/90 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md backdrop-blur-sm transition-all hover:scale-105 active:scale-95 z-10"
                              title="Hapus foto ini"
                            >
                              <i className="fas fa-trash-alt text-xs"></i>
                              <span>Hapus</span>
                            </button>
                            {/* Gradient overlay di bagian bawah dengan info urutan foto */}
                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
                              <span className="text-[11px] text-white/90 font-medium">Foto #{idx + 1}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'bersama' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                      <i className="fas fa-heart text-rose-500"></i>
                      Gambar Bersama
                    </h3>
                    <p className="text-xs text-gray-500 mb-5">
                      Maksimal {BERSAMA_SLOTS} foto berdua. Foto ini otomatis muncul di template Taman Rahasia.
                    </p>

                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Tampilkan di bagian mana?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => handleBersamaDipakaiChange('taman')}
                        className={`text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                          bersamaDipakai === 'taman'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30'
                            : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/40'
                        }`}
                      >
                        <i className="fas fa-seedling mr-2"></i>Taman Rahasia
                        <span className="block text-xs font-normal opacity-70 mt-1">
                          Muncul di rumah kaca / galeri taman
                        </span>
                      </button>
                      <button
                        onClick={() => handleBersamaDipakaiChange('cerita')}
                        className={`text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                          bersamaDipakai === 'cerita'
                            ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-900/30'
                            : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/40'
                        }`}
                      >
                        <i className="fas fa-book-open mr-2"></i>Kisah Pertemuan
                        <span className="block text-xs font-normal opacity-70 mt-1">
                          Mengisi 4 kartu Musim-Musim Kami
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold mb-1 flex items-center justify-between">
                      <span>Foto ({bersamaFotos.length}/{BERSAMA_SLOTS})</span>
                    </h3>
                    <p className="text-xs text-gray-500 mb-5">
                      Slot 1-4 dipakai kartu Musim-Musim Kami, sisanya untuk galeri taman.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {Array.from({ length: BERSAMA_SLOTS }).map((_, idx) => {
                        const url = bersamaFotos[idx] || '';
                        return (
                          <div
                            key={idx}
                            className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                          >
                            <div className="relative aspect-square bg-gray-50 dark:bg-gray-700/40">
                              {url ? (
                                <>
                                  <img src={url} alt={`Bersama ${idx + 1}`} className="w-full h-full object-cover" />
                                  <button
                                    onClick={() => handleDeleteBersama(idx)}
                                    className="absolute top-2 right-2 w-8 h-8 bg-rose-600 text-white rounded-lg flex items-center justify-center hover:bg-rose-700 transition-colors shadow-lg"
                                    title="Hapus foto"
                                  >
                                    <i className="fas fa-trash-alt text-xs"></i>
                                  </button>
                                </>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                                  <i className="fas fa-image text-3xl"></i>
                                </div>
                              )}
                            </div>
                            <div className="p-2">
                              <input
                                ref={(el) => {
                                  bersamaInputRefs.current[idx] = el;
                                }}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleUploadBersama(idx, e.target.files?.[0] || null)}
                                className="block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                              />
                              {uploadingBersama === idx && (
                                <p className="text-[11px] text-blue-600 mt-1 flex items-center gap-1">
                                  <i className="fas fa-spinner fa-spin"></i> Mengunggah...
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB UCAPAN: POHON HARAPAN (Template B) */}
              {activeTab === 'ucapan' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                      <div>
                        <h2 className="text-lg font-bold flex items-center gap-2">
                          <i className="fas fa-tree text-emerald-600"></i>
                          Pohon Harapan
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Ucapan &amp; doa dari tamu di template Taman Rahasia (tabel ucapan_harapan). Hapus yang tidak sesuai.
                        </p>
                      </div>
                      <span className="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold text-center">
                        {ucapanList.length} Ucapan
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-750 text-gray-600 dark:text-gray-300 uppercase text-xs">
                          <tr>
                            <th className="px-5 py-3.5">Nama Tamu</th>
                            <th className="px-5 py-3.5">Ucapan &amp; Doa</th>
                            <th className="px-5 py-3.5">Waktu</th>
                            <th className="px-5 py-3.5 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {ucapanList.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="text-center py-8 text-gray-500">
                                Belum ada ucapan yang tergantung di pohon harapan.
                              </td>
                            </tr>
                          ) : (
                            ucapanList.map((u) => (
                              <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-750/50">
                                <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                                  {u.name}
                                </td>
                                <td className="px-5 py-4 text-gray-700 dark:text-gray-300 max-w-sm">
                                  {u.ucapan}
                                </td>
                                <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                                  {new Date(u.createdAt).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </td>
                                <td className="px-5 py-4 text-center">
                                  <button
                                    onClick={() => handleDeleteUcapan(u.id)}
                                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                                    title="Hapus ucapan"
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: PILIH TEMPLATE */}
              {activeTab === 'template' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold">Koleksi Desain Template Undangan</h3>
                    <p className="text-xs text-gray-500 mt-1 mb-6">
                      Pilih template desain yang sesuai dengan tema pernikahan Anda. Perubahan langsung aktif pada link undangan.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Card Template A */}
                      <div
                        className={clsx(
                          'rounded-2xl border-2 overflow-hidden transition-all flex flex-col',
                          currentTemplate === 'A'
                            ? 'border-blue-600 shadow-lg ring-2 ring-blue-500/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        )}
                      >
                        <div className="h-44 bg-gradient-to-br from-amber-100 to-rose-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center p-4 relative">
                          <i className="fas fa-gem text-5xl text-amber-500/70"></i>
                          {currentTemplate === 'A' && (
                            <span className="absolute top-3 right-3 px-2.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm">
                              Sedang Aktif
                            </span>
                          )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <h4 className="font-bold text-base">Template A: Modern Elegant</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              Tampilan split sidebar desktop dengan welcome envelope, confetti, love gift, dan musik latar.
                            </p>
                          </div>
                          <button
                            onClick={() => handleSelectTemplate('A')}
                            className={clsx(
                              'w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all',
                              currentTemplate === 'A'
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 cursor-default'
                                : loadingTemplate ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 cursor-wait' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90'
                            )}
                          >
                            {currentTemplate === 'A' ? '✓ Template Terpilih' : loadingTemplate ? 'Loading...' : 'Gunakan Template Ini'}
                          </button>
                        </div>
                      </div>

                      {/* Card Template B */}
                      <div
                        className={clsx(
                          'rounded-2xl border-2 overflow-hidden transition-all flex flex-col',
                          currentTemplate === 'B'
                            ? 'border-blue-600 shadow-lg ring-2 ring-blue-500/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        )}
                      >
                        <div className="h-44 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center p-4 relative">
                          <i className="fas fa-newspaper text-5xl text-indigo-500/70"></i>
                          {currentTemplate === 'B' && (
                            <span className="absolute top-3 right-3 px-2.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm">
                              Sedang Aktif
                            </span>
                          )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <h4 className="font-bold text-base">Template B: Editorial Style (Template 3)</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              Tipografi bold layar penuh dengan animasi Text Mask, smooth scroll desktop, dan floating navigation icons.
                            </p>
                          </div>
                          <button
                            onClick={() => handleSelectTemplate('B')}
                            className={clsx(
                              'w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all',
                              currentTemplate === 'B'
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 cursor-default'
                                : loadingTemplate ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 cursor-wait' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90'
                            )}
                          >
                            {currentTemplate === 'B' ? '✓ Template Terpilih' : loadingTemplate ? 'Loading...' : 'Gunakan Template Ini'}
                          </button>
                        </div>
                      </div>

                      {/* Card Template C */}
                      <div
                        className={clsx(
                          'rounded-2xl border-2 overflow-hidden transition-all flex flex-col',
                          currentTemplate === 'C'
                            ? 'border-blue-600 shadow-lg ring-2 ring-blue-500/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        )}
                      >
                        <div className="h-44 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center p-4 relative">
                          <i className="fas fa-feather-alt text-5xl text-emerald-500/70"></i>
                          {currentTemplate === 'C' && (
                            <span className="absolute top-3 right-3 px-2.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm">
                              Sedang Aktif
                            </span>
                          )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <h4 className="font-bold text-base">Template C: Kirigami Pastel</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              Undangan bergaya seni potong kertas berlapis dengan warna pastel lembut, partikel kertas melayang, dan animasi hidup di setiap seksi.
                            </p>
                          </div>
                          <button
                            onClick={() => handleSelectTemplate('C')}
                            className={clsx(
                              'w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all',
                              currentTemplate === 'C'
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 cursor-default'
                                : loadingTemplate ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 cursor-wait' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90'
                            )}
                          >
                            {currentTemplate === 'C' ? '✓ Template Terpilih' : loadingTemplate ? 'Loading...' : 'Gunakan Template Ini'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: GENERATOR LINK UNDANGAN */}
              {activeTab === 'links' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <i className="fas fa-magic text-blue-500"></i>
                      Buat Link Khusus untuk Tamu
                    </h3>
                    <p className="text-xs text-gray-500">
                      Masukkan nama tamu untuk membuat tautan yang menampilkan nama mereka di cover undangan secara otomatis.
                    </p>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                        Nama Tamu Undangan
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={e => setGuestName(e.target.value)}
                        placeholder="Contoh: Budi Santoso & Partner"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      onClick={generateLink}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-link"></i>
                      Generate Link Undangan
                    </button>

                    {generatedLink && (
                      <div className="mt-6 p-5 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4">
                        <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-400">
                          Tautan Undangan Siap Disebar:
                        </label>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={generatedLink}
                            readOnly
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                          />
                          <button
                            onClick={copyLink}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors text-sm font-semibold flex items-center gap-2 shadow-sm"
                            title="Salin Link"
                          >
                            <i className="fas fa-copy"></i>
                            Salin
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                          <a
                            href={getWhatsAppShareUrl()}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
                          >
                            <i className="fab fa-whatsapp text-lg"></i>
                            Kirim ke WhatsApp
                          </a>

                          <a
                            href={generatedLink}
                            target="_blank"
                            rel="noreferrer"
                            className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
                          >
                            <i className="fas fa-external-link-alt"></i>
                            Buka Undangan
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const userId = session.user.id;

  try {
    let templateWeding = await prisma.templateWeding.findUnique({
      where: { userId },
      include: {
        user: true,
        galery: true,
      },
    });

    // Pastikan templateWeding & galery selalu ada
    if (!templateWeding) {
      const newGalery = await prisma.galery.create({
        data: { fotos: [] },
      });
      templateWeding = await prisma.templateWeding.create({
        data: {
          userId,
          galeryId: newGalery.id,
          namaPutra: 'Nama Mempelai Pria',
          namaLengkapPutra: 'Nama Lengkap Pria',
          namaAyahPutra: '',
          namaIbuPutra: '',
          photoPutra: 'https://res.cloudinary.com/doykilt63/image/upload/v1772183476/udangan/cowo_ycc5zu.webp',
          namaPutri: 'Nama Mempelai Wanita',
          namaLengkapPutri: 'Nama Lengkap Wanita',
          namaAyahPutri: '',
          namaIbuPutri: '',
          photoPutri: 'https://res.cloudinary.com/doykilt63/image/upload/v1772183473/udangan/cewe_ygjnrf.webp',
          fotoHeader: 'https://res.cloudinary.com/doykilt63/image/upload/v1772183469/udangan/bg_ogyqgr.webp',
          alamatGedungPernikahan: 'Gedung Serbaguna',
          alamatPernikahan: 'Jl. Merdeka No. 123',
          jamMulai: '08:00',
          jamResepsi: '11:00',
          jamSelesai: '13:00',
          linkMaps: '',
          linkGoogleCalender: '',
          designTheme: 'MODERN',
          isGiftActive: true,
          isBankActive: true,
          isQrisActive: true,
        },
        include: {
          user: true,
          galery: true,
        },
      });
    } else if (!templateWeding.galery) {
      const newGalery = await prisma.galery.create({
        data: { fotos: [] },
      });
      templateWeding = await prisma.templateWeding.update({
        where: { id: templateWeding.id },
        data: { galeryId: newGalery.id },
        include: {
          user: true,
          galery: true,
        },
      });
    }

    let initialStats = { comments: 0, likes: 0, present: 0, absent: 0 };
    let initialComments: any[] = [];

    if (templateWeding) {
      const [commentsCount, likesCount, presentCount, absentCount, commentsList] = await Promise.all([
        prisma.comment.count({ where: { templateWedingId: templateWeding.id } }),
        prisma.like.count({ where: { comment: { templateWedingId: templateWeding.id } } }),
        prisma.comment.count({ where: { templateWedingId: templateWeding.id, presence: true } }),
        prisma.comment.count({ where: { templateWedingId: templateWeding.id, presence: false } }),
        prisma.comment.findMany({
          where: { templateWedingId: templateWeding.id, parentId: null },
          orderBy: { createdAt: 'desc' },
          include: { replies: { orderBy: { createdAt: 'asc' } }, likedBy: true },
        }),
      ]);

      initialStats = {
        comments: commentsCount,
        likes: likesCount,
        present: presentCount,
        absent: absentCount,
      };
      initialComments = commentsList;
    }

    return {
      props: {
        initialWeding: JSON.parse(JSON.stringify(templateWeding)),
        initialStats,
        initialComments: JSON.parse(JSON.stringify(initialComments)),
        sessionUserId: userId,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps dashboard:', error);
    return {
      props: {
        initialWeding: null,
        initialStats: { comments: 0, likes: 0, present: 0, absent: 0 },
        initialComments: [],
        sessionUserId: userId,
      },
    };
  }
};
