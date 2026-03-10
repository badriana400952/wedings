import React from "react";
import PropTypes from "prop-types";

/**
 * Komponen TextMask
 */
const TextMask = ({ children }: any) => {
  return (
    <span className="inline-block overflow-hidden align-top pr-[0.2em] pt-[0.2em] pb-[0.2em]">
      <span className="inline-block">{children}</span>
    </span>
  );
};

/**
 * Komponen KeluargaBesar
 */
const KeluargaBesar = ({ title, orangTuaPria, orangTuaWanita }: any) => {
  const header = "Keluarga Besar";
  const orangTua = `Bpk. ${orangTuaPria} & Ibu. ${orangTuaWanita}`;

  return (
    <div className="grid grid-cols-1 gap-2">
      
      {/* Header */}
      <div className="col-span-1 text-center font-[Arizonia] text-white text-3xl">
        {header.split(" ").map((text, key) => (
          <TextMask key={key}>{text}</TextMask>
        ))}
      </div>

      {/* Title */}
      <div className="col-span-1 text-center font-[Arizonia] text-4xl">
        {title.split(" ").map((text: string, key: number) => (
          <TextMask key={key}>{text}</TextMask>
        ))}
      </div>

      {/* Orang Tua */}
      <div className="col-span-1 text-center text-base">
        {orangTua.split(" ").map((text, key) => (
          <TextMask key={key}>{text}</TextMask>
        ))}
      </div>

    </div>
  );
};

/**
 * PropTypes
 */
KeluargaBesar.propTypes = {
  title: PropTypes.string.isRequired,
  orangTuaPria: PropTypes.string.isRequired,
  orangTuaWanita: PropTypes.string.isRequired,
};

export default KeluargaBesar;