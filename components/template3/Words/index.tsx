import React from "react";
import TextMask from "../TextMask";

/**
 * Komponen kata-kata pembuka
 */
const Words = () => {
  const salam = "Assalamu'alaikum Warahmatullahi Wabarakatuh.";
  const words =
    "Maha suci Allah yang telah menciptakan mahluk-Nya berpasang-pasangan. Ya Allah, perkenankanlah kami merangkaikan kasih sayang yang Kau ciptakan diantara kami untuk mengikuti Sunnah Rasul-Mu dalam rangka membentuk keluarga yang sakinah, mawaddah, warahmah.";

  return (
    <div className="max-w-4xl mx-auto px-6 my-24 flex flex-col items-center justify-center text-center">
      
      <h2 className="text-3xl md:text-5xl font-semibold">
        {salam.split(" ").map((text, key) => (
          <TextMask key={key}>{text}</TextMask>
        ))}
      </h2>

      <p className="mt-8 text-lg leading-relaxed">
        {words.split(" ").map((text, key) => (
          <TextMask key={key}>{text}</TextMask>
        ))}
      </p>

    </div>
  );
};

export default Words;