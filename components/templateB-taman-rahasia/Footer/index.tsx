"use client";


import KeluargaBesar from "./KeluargaBesar";

const Footer = ({ data }: { data?: any }) => {
  const pria = {
    orangTua: {
      pria: data?.namaAyahPutra || "Ayah Mempelai Pria",
      wanita: data?.namaIbuPutra || "Ibu Mempelai Pria",
    },
  };

  const wanita = {
    orangTua: {
      pria: data?.namaAyahPutri || "Ayah Mempelai Wanita",
      wanita: data?.namaIbuPutri || "Ibu Mempelai Wanita",
    },
  };

  const doaRestu =
    "Doa Restu Anda merupakan karunia yang sangat berarti bagi kami.";
  const berbahagia = "Kami Yang Berbahagia";

  return (
    <div className="py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid gap-10 justify-center items-center text-center">

          {/* Doa Restu */}
          <div>
            <h2 className="text-3xl md:text-4xl font-[Arizonia] leading-relaxed">
              {doaRestu}
            </h2>
          </div>

          {/* Divider */}
          <div className="flex flex-col items-center">
            <div className="w-full border-t my-8"></div>

     <span>xxx</span>

            <div className="w-full border-t my-8"></div>

            <h1 className="text-4xl md:text-5xl font-[Arizonia] mt-6">
              {berbahagia}
            </h1>
          </div>

          {/* Grid keluarga */}
          <div className="grid md:grid-cols-2 gap-10 mt-10">

            {/* Mempelai pria */}
            <div>
              <KeluargaBesar
                title="Mempelai Pria"
                orangTuaPria={pria.orangTua.pria}
                orangTuaWanita={pria.orangTua.wanita}
              />
            </div>

            {/* Mempelai wanita */}
            <div className="mt-6 md:mt-0">
              <KeluargaBesar
                title="Mempelai Wanita"
                orangTuaPria={wanita.orangTua.pria}
                orangTuaWanita={wanita.orangTua.wanita}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;