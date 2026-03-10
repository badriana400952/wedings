import React from "react";
import TextMask from "../TextMask";

const Hero = () => {
  // Dummy data
  const hero = {
    banner:
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e",
  };

  const wedding = {
    mempelai: {
      pria: { namaDepan: "Ahmad" },
      wanita: { namaDepan: "Siti" },
    },
    resepsi: {
      tanggal: "12 Desember 2026",
    },
  };

  const mempelaiPria = wedding.mempelai.pria.namaDepan;
  const mempelaiWanita = wedding.mempelai.wanita.namaDepan;
  const mempelai = `${mempelaiPria} & ${mempelaiWanita}`;
  const undangan = "The wedding of";

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <img
        src={hero.banner}
        alt="Hero background"
        className="w-full h-screen object-cover object-bottom"
      />

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center bg-gradient-to-b from-transparent to-black/80">
        <div className="max-w-6xl mx-auto px-4 w-full">
          
          {/* Undangan */}
          <h2 className="text-center md:text-left text-[45px] md:text-[70px] text-white drop-shadow-[3px_3px_rgba(60,42,33,0.6)]">
            {undangan.split(" ").map((text, key) => (
              <TextMask key={key}>{text}</TextMask>
            ))}
          </h2>

          {/* Nama mempelai */}
          <h1 className="text-center md:text-left text-[6em] md:text-[10em] text-white drop-shadow-[5px_5px_rgba(60,42,33,0.6)] leading-none">
            {mempelai.split(" ").map((text, key) => (
              <TextMask key={key}>{text}</TextMask>
            ))}
          </h1>

          {/* Divider */}
          <div className="border-b-4 border-gray-300 my-4"></div>

          {/* Tanggal */}
          <p className="mt-2 text-center md:text-left text-[2em] md:text-[3em] text-white drop-shadow-[3px_3px_rgba(60,42,33,0.6)]">
            {wedding.resepsi.tanggal.split(" ").map((text, key) => (
              <TextMask key={key}>{text}</TextMask>
            ))}
          </p>

        </div>
      </div>
    </div>
  );
};

export default Hero;