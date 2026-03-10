'use client';

import { useEffect, useState } from 'react';
import useSound from 'use-sound';

interface AudioPlayerProps {
  audioUrl?: string;
  volume?: number;
  autoPlay?: boolean;
  loop?: boolean;
}

export default function AudioPlayer({
  audioUrl = 'assets/music/music.mp3',
  volume = 0.25,
  autoPlay = false,
  loop = true,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { stop, pause }] = useSound(audioUrl, {
    volume,
    loop,
    onend: () => {
      if (!loop) {
        setIsPlaying(false);
      }
    },
  });

  useEffect(() => {
    if (autoPlay) {
      handlePlay();
    }

    return () => {
      stop();
    };
  }, []);

  const handlePlay = () => {
    play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    pause();
    setIsPlaying(false);
  };

  const handleToggle = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
    >
      {isPlaying ? (
        <i className="fas fa-pause"></i>
      ) : (
        <i className="fas fa-play"></i>
      )}
    </button>
  );
}
