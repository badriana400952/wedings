'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  name: string;
  comment: string;
  presence: boolean;
  likes: number;
  createdAt: string;
  gif?: string;
}

interface CommentSectionProps {
  guestName: string | null;
}

export default function CommentSection({ guestName }: CommentSectionProps) {
  const [name, setName] = useState(guestName || '');
  const [presence, setPresence] = useState('0');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    fetchComments();
    
    // Check initial theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch('/api/comments');
      const data = await res.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !comment || presence === '0') {
      alert('Mohon lengkapi semua field');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          presence: presence === '1',
          comment,
        }),
      });

      if (res.ok) {
        setComment('');
        setPresence('0');
        fetchComments();
        alert('Terima kasih atas ucapan dan doanya! 🎉');
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      alert('Gagal mengirim komentar');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      });
      fetchComments();
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  return (
    <section id="comment" className="!bg-white dark:!bg-gray-800 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-3xl shadow-xl p-6 !bg-gray-50 dark:!bg-gray-900">
          <h2 className="font-esthetic text-5xl text-center mt-4 mb-8 text-gray-900 dark:text-white">
            Ucapan & Doa
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-gray-900 dark:text-white">
                <i className="fas fa-person mr-2"></i>Nama
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border-2 border-gray-300 dark:border-gray-600 !bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white focus:outline-none focus:border-gray-500"
                placeholder="Isikan Nama Anda"
                minLength={2}
                maxLength={50}
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-900 dark:text-white">
                <i className="fas fa-person-circle-question mr-2"></i>Presensi
              </label>
              <select
                value={presence}
                onChange={(e) => setPresence(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border-2 border-gray-300 dark:border-gray-600 !bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white focus:outline-none focus:border-gray-500"
              >
                <option value="0">Konfirmasi Presensi</option>
                <option value="1">✅ Datang</option>
                <option value="2">❌ Berhalangan</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-gray-900 dark:text-white">
                <i className="fas fa-comment mr-2"></i>Ucapan & Doa
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border-2 border-gray-300 dark:border-gray-600 !bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white focus:outline-none focus:border-gray-500"
                rows={4}
                placeholder="Tulis Ucapan dan Doa"
                minLength={1}
                maxLength={1000}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-2xl transition-colors disabled:opacity-50 ${
                theme === 'dark'
                  ? '!bg-white !text-gray-900 hover:!bg-gray-100'
                  : '!bg-gray-900 !text-white hover:!bg-gray-800'
              }`}
            >
              <i className="fas fa-paper-plane mr-2"></i>
              {loading ? 'Mengirim...' : 'Send'}
            </button>
          </form>

          {/* Comments List */}
          <div className="mt-8 space-y-4">
            {comments.map((c) => (
              <div
                key={c.id}
                className="!bg-gray-50 dark:!bg-gray-700 rounded-2xl p-4 shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {c.name}
                      </h4>
                      <span className="text-sm">
                        {c.presence ? '✅' : '❌'}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {c.comment}
                    </p>
                    {c.gif && (
                      <img src={c.gif} alt="gif" className="mt-2 rounded-lg max-w-xs" />
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                      <button
                        onClick={() => handleLike(c.id)}
                        className="flex items-center gap-1 hover:text-red-500"
                      >
                        <i className="fas fa-heart"></i>
                        <span>{c.likes}</span>
                      </button>
                      <span>{new Date(c.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
