import React, { ReactNode } from "react";
import PropTypes from "prop-types";

/**
 * Komponen TextMask
 */
interface TextMaskProps {
  children: ReactNode;
  // other props...
}

const TextMask = ({ children, ...rest }: TextMaskProps) => {
  return (
    <span
      className="
      inline-block
      overflow-hidden
      align-top
      pr-[0.2em]
      pt-[0.2em]
      pb-[0.2em]
      "
    >
      <span className="inline-block" {...rest}>
        {children}
      </span>
    </span>
  );
};

/**
 * PropTypes
 */
TextMask.propTypes = {
  children: PropTypes.node.isRequired,
  // other props...
};

export default TextMask;