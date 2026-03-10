import React from "react";
import TextMask from "../TextMask";

const mempelai = {
  namaDepan: "Ahmad",
  namaBelakang: "Fauzan",
  foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  bg: "#f5f5f5",
  orangTua: {
    pria: "H. Abdullah",
    wanita: "Hj. Siti Aminah",
    keterangan: "Putra dari",
  },
};

const ProfilMempelai = ({mempelai}: any) => {
  const { namaDepan, namaBelakang, orangTua } = mempelai;

  const namaLengkap = `${namaDepan} ${namaBelakang}`;
  const namaOrangTua = `Bpk. ${orangTua.pria} & Ibu. ${orangTua.wanita}`;

  return (
    <div
      className="grid md:grid-cols-2 items-center"
      style={{ backgroundColor: mempelai.bg }}
    >
      {/* TEXT */}
      <div className="flex items-center py-16 md:min-h-screen">
        <div className="max-w-3xl mx-auto px-4 w-full text-center">
          <h2 className="text-4xl md:text-[5em] mb-6">
            {namaLengkap.split(" ").map((text:string, key:number) => (
              <TextMask key={key}>{text}</TextMask>
            ))}
          </h2>

          <p className="text-lg mb-6">
            {orangTua.keterangan.split(" ").map((text:string, key:number) => (
              <TextMask key={key}>{text}</TextMask>
            ))}
          </p>

          <p className="text-xl">
            {namaOrangTua.split(" ").map((text:string, key:number) => (
              <TextMask key={key}>{text}</TextMask>
            ))}
          </p>
        </div>
      </div>

      {/* FOTO */}
      <div className="overflow-hidden h-[450px] md:h-screen">
        <img
          src={mempelai.foto}
          alt={namaLengkap}
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
};

export default ProfilMempelai;