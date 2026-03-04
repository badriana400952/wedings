import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import clsx from 'clsx';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    template: 'A',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasi
    if (!formData.email || !formData.password) {
      setError('Email dan password harus diisi');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/register', {
        email: formData.email,
        password: formData.password,
        template: formData.template,
      });

      if (response.data.success) {
        alert('✅ Registrasi berhasil! Silakan login.');
        router.push('/login');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Gagal registrasi. Silakan coba lagi.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register - Undangan Digital</title>
      </Head>

      <div className={clsx('min-h-screen', 'flex', 'items-center', 'justify-center', 'bg-gradient-to-br', 'from-pink-100', 'via-purple-100', 'to-blue-100', 'py-12', 'px-4', 'sm:px-6', 'lg:px-8')}>
        <div className={clsx('max-w-md', 'w-full', 'space-y-8', 'bg-white', 'p-8', 'rounded-2xl', 'shadow-xl')}>
          <div>
            <h2 className={clsx('mt-6', 'text-center', 'text-3xl', 'font-extrabold', 'text-gray-900')}>
              Daftar Akun Baru
            </h2>
            <p className={clsx('mt-2', 'text-center', 'text-sm', 'text-gray-600')}>
              Buat undangan digital pernikahan Anda
            </p>
          </div>

          <form className={clsx('mt-8', 'space-y-6')} onSubmit={handleSubmit}>
            {error && (
              <div className={clsx('bg-red-50', 'border', 'border-red-200', 'text-red-700', 'px-4', 'py-3', 'rounded-lg')}>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className={clsx('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={clsx('appearance-none', 'relative', 'block', 'w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'placeholder-gray-500', 'text-gray-900', 'rounded-lg', 'focus:outline-none', 'focus:ring-2', 'focus:ring-pink-500', 'focus:border-transparent')}
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="password" className={clsx('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={clsx('appearance-none', 'relative', 'block', 'w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'placeholder-gray-500', 'text-gray-900', 'rounded-lg', 'focus:outline-none', 'focus:ring-2', 'focus:ring-pink-500', 'focus:border-transparent')}
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className={clsx('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>
                  Konfirmasi Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className={clsx('appearance-none', 'relative', 'block', 'w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'placeholder-gray-500', 'text-gray-900', 'rounded-lg', 'focus:outline-none', 'focus:ring-2', 'focus:ring-pink-500', 'focus:border-transparent')}
                  placeholder="Ulangi password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="template" className={clsx('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')}>
                  Pilih Template
                </label>
                <select
                  id="template"
                  name="template"
                  className={clsx('appearance-none', 'relative', 'block', 'w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'text-gray-900', 'rounded-lg', 'focus:outline-none', 'focus:ring-2', 'focus:ring-pink-500', 'focus:border-transparent')}
                  value={formData.template}
                  onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                >
                  <option value="A">Template A - Sederhana</option>
                  <option value="B">Template B - Classic</option>
                  <option value="C">Template C - Modern</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={clsx('group', 'relative', 'w-full', 'flex', 'justify-center', 'py-3', 'px-4', 'border', 'border-transparent', 'text-sm', 'font-medium', 'rounded-lg', 'text-white', 'bg-gradient-to-r', 'from-pink-500', 'to-purple-600', 'hover:from-pink-600', 'hover:to-purple-700', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'focus:ring-pink-500', 'disabled:opacity-50', 'disabled:cursor-not-allowed', 'transition-all')}
              >
                {loading ? 'Mendaftar...' : 'Daftar'}
              </button>
            </div>

            <div className="text-center">
              <p className={clsx('text-sm', 'text-gray-600')}>
                Sudah punya akun?{' '}
                <a href="/login" className={clsx('font-medium', 'text-pink-600', 'hover:text-pink-500')}>
                  Login di sini
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
