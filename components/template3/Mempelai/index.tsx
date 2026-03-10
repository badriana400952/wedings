import React from "react";
import ProfilMempelai from "./ProfilMempelai";

/**
 * Dummy data mempelai
 */
const pria = {
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

const wanita = {
  namaDepan: "Siti",
  namaBelakang: "Aisyah",
  foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  bg: "#ffffff",
  orangTua: {
    pria: "H. Hasan",
    wanita: "Hj. Fatimah",
    keterangan: "Putri dari",
  },
};

/**
 * Komponent mempelai
 */
const Mempelai = () => {
  return (
    <div className="w-full">
      <ProfilMempelai mempelai={pria} />
      <ProfilMempelai mempelai={wanita} />
    </div>
  );
};

export default Mempelai;