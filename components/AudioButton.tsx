'use client';

import { useState, useEffect, useRef } from 'react';

export default function AudioButton() {
  const [isPlaying, setIsPlaying] = useState(true); // Start as playing
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
    audioRef.current = new Audio('/assets/music/music.mp3');
    audioRef.current.loop = true;

    // Auto-play music when page loads
    const playAudio = async () => {
      try {
        await audioRef.current?.play();
        setIsPlaying(true);
      } catch (error) {
        // Auto-play might be blocked by browser, user needs to click
        console.log('Auto-play blocked, user needs to click play button');
        setIsPlaying(false);
      }
    };

    playAudio();

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
      audioRef.current?.pause();
      observer.disconnect();
    };
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className="w-12 h-12 bg-gray-200 border-2 border-gray-300 rounded-full shadow-lg"
        aria-label="Toggle audio"
      >
        <i className="fas fa-play text-gray-900"></i>
      </button>
    );
  }

  return (
    <button
      onClick={toggleAudio}
      className={`w-12 h-12 border-2 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-600' 
          : 'bg-white border-gray-300'
      }`}
      aria-label="Toggle audio"
    >
      <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}></i>
    </button>
  );
}
