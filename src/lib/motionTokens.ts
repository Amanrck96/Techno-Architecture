import { Transition, Variants } from "framer-motion";

export const motionTokens = {
  fast: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } as Transition,
  standard: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } as Transition,
  slow: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } as Transition,
  imageReveal: { duration: 0.9, ease: [0.25, 1, 0.5, 1] } as Transition,
  textReveal: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } as Transition,
  pageTransition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } as Transition,
};

export const pageFadeVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: motionTokens.pageTransition },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: motionTokens.textReveal },
};

export const imageHoverVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
