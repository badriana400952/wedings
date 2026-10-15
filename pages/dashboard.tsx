import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { RSVP_PREFIX } from '@/lib/comment-kind';
import clsx from 'clsx';

// Modular Dashboard Components
import {
  DashboardTab,
  DashboardStats,
  DashboardComment,
  UcapanRow,
  RsvpRow,
  WeddingFormData,
  DashboardHeader,
  DashboardSidebar,
  TabOverview,
  TabMempelai,
  TabAcara,
  TabGift,
  TabGaleri,
  TabBersama,
  TabUcapan,
  TabMusik,
  TabTemplate,
  TabLinks,
} from '@/components/dashboard';

interface DashboardProps {
  initialWeding?: any;
  initialStats?: DashboardStats;
  initialComments?: DashboardComment[];
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

const RSVP_STATUS_STYLES: Record<NonNullable<RsvpRow['status']>, string> = {
  attending: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  not_attending: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  maybe: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
};

const RSVP_STATUS_LABELS: Record<NonNullable<RsvpRow['status']>, string> = {
  attending: 'Hadir',
  not_attending: 'Berhalangan',
  maybe: 'Masih Ragu',
};

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

  const detail = [paxParts.join(' · '), rest.join(' — ')].filter(Boolean).join(' — ');

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
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  const [loading, setLoading] = useState(!initialWeding);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Stats & Comments
  const [stats, setStats] = useState<DashboardStats>(
    initialStats || { comments: 0, likes: 0, present: 0, absent: 0 }
  );
  const [comments, setComments] = useState<DashboardComment[]>(initialComments || []);
  const [ucapanList, setUcapanList] = useState<UcapanRow[]>([]);

  // Selected Template
  const [currentTemplate, setCurrentTemplate] = useState<string>(
    initialWeding?.user?.template || initialWeding?.template || 'A'
  );
  const [loadingTemplate, setLoadingTemplate] = useState<boolean>(false);

  // Form Wedding Data State
  const [formData, setFormData] = useState<WeddingFormData>({
    fotoHeader: initialWeding?.fotoHeader || '',
    namaLengkapPutra: initialWeding?.namaLengkapPutra || '',
    namaPutra: initialWeding?.namaPutra || '',
    namaAyahPutra: initialWeding?.namaAyahPutra || '',
    namaIbuPutra: initialWeding?.namaIbuPutra || '',
    kelahiranPutra: initialWeding?.kelahiranPutra || '',
    instagramPutra: initialWeding?.instagramPutra || '',
    photoPutra: initialWeding?.photoPutra || '',
    namaLengkapPutri: initialWeding?.namaLengkapPutri || '',
    namaPutri: initialWeding?.namaPutri || '',
    namaAyahPutri: initialWeding?.namaAyahPutri || '',
    namaIbuPutri: initialWeding?.namaIbuPutri || '',
    kelahiranPutri: initialWeding?.kelahiranPutri || '',
    instagramPutri: initialWeding?.instagramPutri || '',
    photoPutri: initialWeding?.photoPutri || '',
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

  // Gambar Bersama — 6 slot
  const BERSAMA_SLOTS = 6;
  const [bersamaFotos, setBersamaFotos] = useState<string[]>(
    Array.isArray(initialWeding?.bersamaFotos) ? (initialWeding.bersamaFotos as string[]) : []
  );
  const [bersamaDipakai, setBersamaDipakai] = useState<string>(initialWeding?.bersamaDipakai || 'taman');
  const [uploadingBersama, setUploadingBersama] = useState<number | null>(null);
  const bersamaInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Musik State
  const [musikList, setMusikList] = useState<any[]>([]);
  const [currentMusikId, setCurrentMusikId] = useState<string>(initialWeding?.musikId || '');
  const [playingMusikId, setPlayingMusikId] = useState<string | null>(null);
  const [loadingMusik, setLoadingMusik] = useState(false);
  const musikAudioRef = useRef<HTMLAudioElement | null>(null);

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

  const safeParseJson = async (res: Response) => {
    try {
      const text = await res.text();
      if (!text || text.trim().startsWith('<')) return null;
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    fetch('/api/musik')
      .then(safeParseJson)
      .then((data) => {
        if (data?.success) setMusikList(data.musik || []);
      })
      .catch((err) => console.error('Gagal memuat musik:', err));

    return () => {
      musikAudioRef.current?.pause();
    };
  }, []);

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
      const templateJson = (await safeParseJson(templateRes)) || {};
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

        if (weding.musikId) {
          setCurrentMusikId(weding.musikId);
        }

        const [statsRes, commentsRes, ucapanRes] = await Promise.all([
          fetch(`/api/stats?templateWedingId=${weding.id}`),
          fetch(`/api/comments?templateWedingId=${weding.id}`),
          fetch(`/api/ucapan?templateWedingId=${weding.id}`),
        ]);

        const statsData = (await safeParseJson(statsRes)) || {};
        const commentsData = (await safeParseJson(commentsRes)) || {};
        const ucapanData = (await safeParseJson(ucapanRes)) || {};

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
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file }));
      setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
    }
  };

  const handleSaveWeddingData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveUserId) return;

    try {
      setSaving(true);
      const body = new FormData();

      Object.entries(formData).forEach(([key, val]) => {
        if (typeof val === 'boolean') {
          body.append(key, val ? 'true' : 'false');
        } else if (val !== null && val !== undefined) {
          body.append(key, String(val));
        }
      });

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
    setLoadingTemplate(true);
    try {
      const res = await fetch('/api/user/template', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: templateCode }),
      });
      setLoadingTemplate(false);
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentTemplate(templateCode);
        showNotification('success', `✅ Template berhasil diganti ke Template ${templateCode}!`);
      } else {
        showNotification('error', '❌ Gagal mengganti template: ' + (data.message || ''));
      }
    } catch (err) {
      setLoadingTemplate(false);
      console.error(err);
      showNotification('error', '❌ Terjadi kesalahan saat mengganti template');
    }
  };

  const handleSelectMusik = async (musikId: string) => {
    if (!effectiveUserId) return;
    try {
      setLoadingMusik(true);
      const res = await fetch(`/api/landing/${effectiveUserId}/musik`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ musikId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentMusikId(musikId);
        showNotification('success', '✅ Musik berhasil disimpan ke template undangan!');
      } else {
        showNotification('error', '❌ ' + (data.message || 'Gagal menyimpan musik'));
      }
    } catch (err) {
      console.error(err);
      showNotification('error', '❌ Terjadi kesalahan saat menyimpan musik');
    } finally {
      setLoadingMusik(false);
    }
  };

  const togglePreviewMusik = (musik: any) => {
    if (!musikAudioRef.current) {
      musikAudioRef.current = new Audio();
    }
    const audio = musikAudioRef.current;

    if (playingMusikId === musik.id) {
      audio.pause();
      setPlayingMusikId(null);
      return;
    }

    audio.src = musik.file;
    audio.currentTime = 0;
    audio
      .play()
      .then(() => setPlayingMusikId(musik.id))
      .catch(() => setPlayingMusikId(null));
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
      showNotification('success', `✅ Foto bersama ${index + 1} berhasil disimpan!`);
    } catch (err: any) {
      showNotification('error', `❌ Gagal: ${err.message}`);
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
      showNotification('success', '✅ Foto bersama dihapus');
    } catch (err: any) {
      showNotification('error', `❌ Gagal: ${err.message}`);
      setBersamaFotos(bersamaFotos);
    }
  };

  const handleBersamaDipakaiChange = async (value: string) => {
    setBersamaDipakai(value);
    if (!effectiveUserId) return;
    try {
      await saveBersama(bersamaFotos, value);
      showNotification('success', '✅ Lokasi foto diperbarui');
    } catch (err: any) {
      showNotification('error', `❌ Gagal: ${err.message}`);
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
      ...comments.map((c) => {
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
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

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
        <DashboardHeader
          currentTemplate={currentTemplate}
          effectiveUserId={effectiveUserId}
          onSignOut={() => signOut({ callbackUrl: '/login' })}
        />

        {/* Global Notification Banner */}
        {message && (
          <div
            className={clsx(
              'max-w-7xl mx-auto mt-4 px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium shadow-md transition-all',
              message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
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
              <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {activeTab === 'overview' && (
                <TabOverview
                  stats={stats}
                  comments={comments}
                  onDownloadCSV={downloadCSV}
                  onDeleteComment={handleDeleteComment}
                  parseRsvp={parseRsvp}
                  rsvpStatusStyles={RSVP_STATUS_STYLES}
                />
              )}

              {activeTab === 'mempelai' && (
                <TabMempelai
                  formData={formData}
                  previews={previews}
                  saving={saving}
                  onInputChange={handleInputChange}
                  onFileChange={handleFileChange}
                  onSaveWeddingData={handleSaveWeddingData}
                />
              )}

              {activeTab === 'acara' && (
                <TabAcara
                  formData={formData}
                  saving={saving}
                  onInputChange={handleInputChange}
                  onSaveWeddingData={handleSaveWeddingData}
                />
              )}

              {activeTab === 'gift' && (
                <TabGift
                  formData={formData}
                  previews={previews}
                  saving={saving}
                  onInputChange={handleInputChange}
                  onFileChange={handleFileChange}
                  onSaveWeddingData={handleSaveWeddingData}
                />
              )}

              {activeTab === 'galeri' && (
                <TabGaleri
                  galeriFotos={galeriFotos}
                  uploadingGaleri={uploadingGaleri}
                  newGaleriFile={newGaleriFile}
                  galeriInputRef={galeriInputRef}
                  onFileSelected={setNewGaleriFile}
                  onUploadGaleriPhoto={handleUploadGaleriPhoto}
                  onDeleteGaleriPhoto={handleDeleteGaleriPhoto}
                />
              )}

              {activeTab === 'bersama' && (
                <TabBersama
                  bersamaFotos={bersamaFotos}
                  bersamaDipakai={bersamaDipakai}
                  uploadingBersama={uploadingBersama}
                  bersamaSlots={BERSAMA_SLOTS}
                  bersamaInputRefs={bersamaInputRefs}
                  onUploadBersama={handleUploadBersama}
                  onDeleteBersama={handleDeleteBersama}
                  onBersamaDipakaiChange={handleBersamaDipakaiChange}
                />
              )}

              {activeTab === 'ucapan' && (
                <TabUcapan
                  ucapanList={ucapanList}
                  onDeleteUcapan={handleDeleteUcapan}
                />
              )}

              {activeTab === 'musik' && (
                <TabMusik
                  musikList={musikList}
                  currentMusikId={currentMusikId}
                  playingMusikId={playingMusikId}
                  loadingMusik={loadingMusik}
                  onTogglePreviewMusik={togglePreviewMusik}
                  onSelectMusik={handleSelectMusik}
                />
              )}

              {activeTab === 'template' && (
                <TabTemplate
                  currentTemplate={currentTemplate}
                  loadingTemplate={loadingTemplate}
                  onSelectTemplate={handleSelectTemplate}
                />
              )}

              {activeTab === 'links' && (
                <TabLinks
                  guestName={guestName}
                  generatedLink={generatedLink}
                  onGuestNameChange={setGuestName}
                  onGenerateLink={generateLink}
                  onCopyLink={copyLink}
                  whatsAppShareUrl={getWhatsAppShareUrl()}
                />
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
