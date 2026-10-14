import React from "react";
import { Calendar, Map, MapPin } from "lucide-react";
import TextMask from "../TextMask";

type Props = {
  title: string;
  tanggal: string;
  jam: string;
  lokasi: string;
  alamat: string;
  link: string;
};

const CardTanggal = ({
  title,
  tanggal,
  jam,
  lokasi,
  alamat,
  link,
}: Props) => {
  return (
    <div className="border border-gray-300 rounded-none bg-white">
      <div className="pt-10 px-8 flex flex-col items-center text-center">

        {/* TITLE */}
        <h3 className="text-3xl font-bold text-gray-700">
          {title.split(" ").map((text, key) => (
            <TextMask key={key}>{text}</TextMask>
          ))}
        </h3>

        {/* ICON TANGGAL */}
        <div className="mt-6 w-[100px] h-[100px] rounded-full border-2 border-gray-500 flex items-center justify-center">
          <Calendar size={60} className="text-gray-600" />
        </div>

        {/* TANGGAL */}
        <p className="text-xl font-bold text-gray-700 mt-6">
          {tanggal.split(" ").map((text, key) => (
            <TextMask key={key}>{text}</TextMask>
          ))}
        </p>

        {/* JAM */}
        <p className="text-sm font-bold text-gray-700">
          {jam.split(" ").map((text, key) => (
            <TextMask key={key}>{text}</TextMask>
          ))}
        </p>

        {/* ICON LOKASI */}
        <div className="mt-8 w-[100px] h-[100px] rounded-full border-2 border-gray-500 flex items-center justify-center">
          <Map size={60} className="text-gray-600" />
        </div>

        {/* LOKASI */}
        <p className="text-xl font-bold text-gray-700 mt-6">
          {lokasi.split(" ").map((text, key) => (
            <TextMask key={key}>{text}</TextMask>
          ))}
        </p>

        {/* ALAMAT */}
        <p className="text-sm font-bold text-gray-700 mt-2">
          {alamat.split(" ").map((text, key) => (
            <TextMask key={key}>{text}</TextMask>
          ))}
        </p>
      </div>

      {/* BUTTON */}
      <div className="p-8">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="
          w-full
          flex
          items-center
          justify-center
          gap-2
          bg-gray-800
          text-white
          py-3
          text-lg
          font-semibold
          hover:bg-gray-900
          transition
          "
        >
          <MapPin size={20} />
          Kunjungi via GMaps
        </a>
      </div>
    </div>
  );
};

export default React.memo(CardTanggal);