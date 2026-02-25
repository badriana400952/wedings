'use client';

import { useState, useEffect, useRef } from 'react';

export default function AudioButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/assets/music/pure-love-304010.mp3');
    audioRef.current.loop = true;

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <button
      onClick={toggleAudio}
      className="w-12 h-12 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
      aria-label="Toggle audio"
    >
      <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-gray-900 dark:text-white`}></i>
    </button>
  );
}
