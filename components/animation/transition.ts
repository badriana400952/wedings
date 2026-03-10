import { Transition } from "framer-motion";

export const transition: Transition = {
  duration: 1.5,
  ease: [0.6, 0.01, 0, 0.95],
};

export const parentVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
  exit: {
    transition: {
      when: "afterChildren",
    },
  },
};

export default {
  transition,
  parentVariants,
};