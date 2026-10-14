import React from "react";
import PropTypes from "prop-types";

/**
 * Komponen TextMask
 */
const TextMask = ({ children, ...rest }: any) => {
  return (
    <span
      className="inline-block overflow-hidden align-top pr-[0.2em] pt-[0.2em] pb-[0.2em]"
    >
      <span className="inline-block" {...rest}>
        {children}
      </span>
    </span>
  );
};

/**
 * Prop types
 */
TextMask.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TextMask;