'use client';

import { useState, useEffect } from 'react';

export default function ThemeButton() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    // For Tailwind dark mode
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // For Bootstrap dark mode
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    
    // For body background
    if (newTheme === 'dark') {
      document.body.style.backgroundColor = 'rgb(33, 37, 41)';
      document.body.style.color = 'rgb(248, 249, 250)';
    } else {
      document.body.style.backgroundColor = 'rgb(248, 249, 250)';
      document.body.style.color = 'rgb(33, 37, 41)';
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className="w-12 h-12 bg-gray-200 border-2 border-gray-300 rounded-full shadow-lg"
        aria-label="Toggle theme"
      >
        <i className="fas fa-moon text-gray-900"></i>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`w-12 h-12 border-2 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-600' 
          : 'bg-white border-gray-300'
      }`}
      aria-label="Toggle theme"
    >
      <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'} ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}></i>
    </button>
  );
}
