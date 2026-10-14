import React from "react";
import { Play, Pause } from "lucide-react";

const Backsound = () => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlay, setPlay] = React.useState(false);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlay) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlay((prev) => !prev);
  };

  React.useEffect(() => {
    if (!audioRef.current) return;

    const playPromise = audioRef.current.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setPlay(true);
        })
        .catch(() => {
          setPlay(false);
        });
    }
  }, []);

  return (
    <div
      className="
      fixed
      left-3
      top-1/2
      -translate-y-1/2
      z-[2000]
      bg-[rgba(213,206,163,0.7)]
      p-2
      rounded-full
      shadow-xl
      flex
      items-center
      justify-center
      "
    >
      <audio ref={audioRef} preload="auto" loop autoPlay className="hidden">
        <source src="/assets/audio/backsound.mp3" type="audio/mp3" />
      </audio>

      <button
        onClick={toggleAudio}
        className="
        w-10
        h-10
        flex
        items-center
        justify-center
        rounded-full
        bg-black
        text-white
        hover:scale-110
        transition
        "
      >
        {isPlay ? <Pause size={18} /> : <Play size={18} />}
      </button>
    </div>
  );
};

export default Backsound;