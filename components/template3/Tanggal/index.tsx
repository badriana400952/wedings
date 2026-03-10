import React from "react";
import { Calendar, Map, MapPin } from "lucide-react";
import TextMask from "../TextMask";

const Tanggal = () => {
  const useDB = (selector: any) => {
    const db = {
      wedding: {
        akad: {
          tanggal: "Sabtu 10 Oktober 2026",
          jam: "08:00 WIB",
          lokasi: "Masjid Agung Bandung",
          alamat: "Jl. Asia Afrika No.1, Bandung",
          gmaps: {
            link: "https://maps.google.com",
          },
        },
        resepsi: {
          tanggal: "Sabtu 10 Oktober 2026",
          jam: "11:00 WIB - Selesai",
          lokasi: "Gedung Serbaguna Bandung",
          alamat: "Jl. Merdeka No.10, Bandung",
          gmaps: {
            link: "https://maps.google.com",
          },
        },
      },
    };

    return selector(db);
  };

  const textHeader = "Rangkaian Acara Akan Diselenggarakan";

  const { akad, resepsi } = useDB((db: any) => db.wedding);

  const CardTanggal = ({
    title,
    tanggal,
    jam,
    lokasi,
    alamat,
    link,
  }: any) => {
    return (
      <div className="border border-gray-300 bg-white">
        <div className="pt-10 px-8 flex flex-col items-center text-center">

          <h3 className="text-3xl font-bold text-gray-700">
            {title.split(" ").map((text: string, key: number) => (
              <TextMask key={key}>{text}</TextMask>
            ))}
          </h3>

          <div className="mt-6 w-[100px] h-[100px] rounded-full border-2 border-gray-500 flex items-center justify-center">
            <Calendar size={60} className="text-gray-600" />
          </div>

          <p className="text-xl font-bold text-gray-700 mt-6">
            {tanggal.split(" ").map((text: string, key: number) => (
              <TextMask key={key}>{text}</TextMask>
            ))}
          </p>

          <p className="text-sm font-bold text-gray-700">
            {jam.split(" ").map((text: string, key: number) => (
              <TextMask key={key}>{text}</TextMask>
            ))}
          </p>

          <div className="mt-8 w-[100px] h-[100px] rounded-full border-2 border-gray-500 flex items-center justify-center">
            <Map size={60} className="text-gray-600" />
          </div>

          <p className="text-xl font-bold text-gray-700 mt-6">
            {lokasi.split(" ").map((text: string, key: number) => (
              <TextMask key={key}>{text}</TextMask>
            ))}
          </p>

          <p className="text-sm font-bold text-gray-700 mt-2">
            {alamat.split(" ").map((text: string, key: number) => (
              <TextMask key={key}>{text}</TextMask>
            ))}
          </p>
        </div>

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

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">

      <div className="text-center mb-10">
        <p className="text-lg">
          {textHeader.split(" ").map((text, key) => (
            <TextMask key={key}>{text}</TextMask>
          ))}
        </p>

        <h2 className="text-4xl font-bold my-4">
          {resepsi.tanggal.split(" ").map((text: string, key: number) => (
            <TextMask key={key}>{text}</TextMask>
          ))}
        </h2>

        <div className="w-full h-[1px] bg-gray-300"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <CardTanggal
          title="Akad Nikah"
          tanggal={akad.tanggal}
          jam={akad.jam}
          lokasi={akad.lokasi}
          alamat={akad.alamat}
          link={akad.gmaps.link}
        />

        <CardTanggal
          title="Resepsi Nikah"
          tanggal={resepsi.tanggal}
          jam={resepsi.jam}
          lokasi={resepsi.lokasi}
          alamat={resepsi.alamat}
          link={resepsi.gmaps.link}
        />
      </div>
    </div>
  );
};

export default Tanggal;