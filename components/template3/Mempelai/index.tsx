import React from "react";
import ProfilMempelai from "./ProfilMempelai";

/**
 * Dummy data mempelai
 */
const Mempelai = ({ data }: { data?: any }) => {
  const pria = {
    namaLengkap: data?.namaLengkapPutra || data?.namaPutra || "Mempelai Pria",
    foto: data?.photoPutra || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    bg: "#f5f5f5",
    orangTua: {
      pria: data?.namaAyahPutra || "Ayah Pria",
      wanita: data?.namaIbuPutra || "Ibu Pria",
      keterangan: data?.kelahiranPutra ? `Putra dari (${data.kelahiranPutra})` : "Putra tercinta dari",
    },
  };

  const wanita = {
    namaLengkap: data?.namaLengkapPutri || data?.namaPutri || "Mempelai Wanita",
    foto: data?.photoPutri || "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    bg: "#ffffff",
    orangTua: {
      pria: data?.namaAyahPutri || "Ayah Wanita",
      wanita: data?.namaIbuPutri || "Ibu Wanita",
      keterangan: data?.kelahiranPutri ? `Putri dari (${data.kelahiranPutri})` : "Putri tercinta dari",
    },
  };

  return (
    <div className="w-full">
      <ProfilMempelai mempelai={pria} />
      <ProfilMempelai mempelai={wanita} />
    </div>
  );
};

export default Mempelai;