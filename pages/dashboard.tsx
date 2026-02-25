import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

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

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ comments: 0, likes: 0, present: 0, absent: 0 });
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'settings' | 'links'>('home');
  const [loading, setLoading] = useState(true);
  const [guestName, setGuestName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, commentsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/comments'),
      ]);

      const statsData = await statsRes.json();
      const commentsData = await commentsRes.json();

      setStats(statsData.data);
      setComments(commentsData.comments || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const csv = [
      ['Name', 'Presence', 'Comment', 'Likes', 'Date'],
      ...comments.map(c => [
        c.name,
        c.presence ? 'Hadir' : 'Tidak Hadir',
        c.comment.replace(/"/g, '""'),
        c.likes,
        new Date(c.createdAt).toLocaleString('id-ID'),
      ]),
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const generateLink = () => {
    if (!guestName.trim()) {
      alert('Mohon isi nama tamu');
      return;
    }
    
    const baseUrl = window.location.origin;
    // Generate link dengan format: ?nama+tamu (spasi jadi +)
    const encodedName = guestName.trim().replace(/\s+/g, '+');
    const link = `${baseUrl}/?${encodedName}`;
    setGeneratedLink(link);
  };

  const copyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      alert('Link berhasil disalin!');
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Dashboard - Undangan</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - Undangan</title>
      </Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Undangan<i className="fas fa-fire text-red-500 ml-2"></i>
            </h1>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              <i className="fas fa-home mr-2"></i>Back to Home
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'home'
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <i className="fas fa-house mr-3"></i>Home
                </button>
                <button
                  onClick={() => setActiveTab('links')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'links'
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <i className="fas fa-link mr-3"></i>Generate Link
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <i className="fas fa-gear mr-3"></i>Settings
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'home' && (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-purple-500 rounded-2xl shadow-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">Comments</p>
                          <p className="text-3xl font-bold mt-1">{stats.comments}</p>
                        </div>
                        <i className="fas fa-comments text-4xl opacity-50"></i>
                      </div>
                    </div>

                    <div className="bg-indigo-500 rounded-2xl shadow-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">Present</p>
                          <p className="text-3xl font-bold mt-1">{stats.present}</p>
                        </div>
                        <i className="fas fa-circle-check text-4xl opacity-50"></i>
                      </div>
                    </div>

                    <div className="bg-blue-500 rounded-2xl shadow-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">Absent</p>
                          <p className="text-3xl font-bold mt-1">{stats.absent}</p>
                        </div>
                        <i className="fas fa-circle-xmark text-4xl opacity-50"></i>
                      </div>
                    </div>

                    <div className="bg-violet-600 rounded-2xl shadow-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">Likes</p>
                          <p className="text-3xl font-bold mt-1">{stats.likes}</p>
                        </div>
                        <i className="fas fa-heart text-4xl opacity-50"></i>
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
                    <button
                      onClick={downloadCSV}
                      className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                    >
                      <i className="fas fa-download mr-2"></i>Download CSV
                    </button>
                  </div>

                  {/* Comments List */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                      Recent Comments
                    </h2>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {comments.map((c) => (
                        <div
                          key={c.id}
                          className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {c.name}
                                </h4>
                                <span>{c.presence ? '✅' : '❌'}</span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {c.comment}
                              </p>
                              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                                <span>
                                  <i className="fas fa-heart mr-1"></i>
                                  {c.likes}
                                </span>
                                <span>
                                  {new Date(c.createdAt).toLocaleDateString('id-ID')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'links' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                    <i className="fas fa-link mr-2"></i>Generate Link Undangan
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                        Nama Tamu
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Contoh: Badriana atau Alumni Pasir Durung"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                      <small className="text-gray-500 dark:text-gray-400 mt-1 block">
                        Spasi akan otomatis diubah menjadi tanda +
                      </small>
                    </div>

                    <button
                      onClick={generateLink}
                      className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
                    >
                      <i className="fas fa-magic mr-2"></i>Generate Link
                    </button>

                    {generatedLink && (
                      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                          Link Undangan:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={generatedLink}
                            readOnly
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          <button
                            onClick={copyLink}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <i className="fas fa-copy"></i>
                          </button>
                        </div>
                        
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            <i className="fas fa-info-circle mr-2"></i>
                            Preview: Saat tamu membuka link ini, akan muncul "Kepada Yth: <strong>{guestName}</strong>"
                          </p>
                        </div>

                        <div className="mt-4">
                          <a
                            href={generatedLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                          >
                            <i className="fas fa-external-link-alt mr-2"></i>
                            Test Link
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                      <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        <i className="fas fa-lightbulb mr-2"></i>Tips:
                      </h3>
                      <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                        <li>• Format 1: <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">?Badriana</code></li>
                        <li>• Format 2: <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">?Alumni+Pasir+Durung</code></li>
                        <li>• Format 3: <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">?to=Nama Tamu</code></li>
                        <li>• Bisa untuk grup: <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">?Keluarga+Besar+Pak+Ahmad</code></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                    Settings
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Settings panel - Coming soon
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
