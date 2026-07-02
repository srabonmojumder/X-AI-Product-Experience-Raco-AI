import type { Variants, Transition } from "framer-motion";

/**
 * A single, shared motion vocabulary so every section eases the same way.
 * "out-expo" for entrances (fast start, long settle), "in-out-quart" for morphs.
 */
export const ease = {
  outExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOutQuart: [0.76, 0, 0.24, 1] as [number, number, number, number],
  outQuint: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export const spring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
  mass: 0.9,
};

/** Reveal-on-view for a block of content. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: ease.outExpo },
  },
};

/** Parent that staggers its children into view. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

/** Standard viewport config: fire once, a little before fully in view. */
export const inView = {
  once: true,
  amount: 0.35,
  margin: "0px 0px -10% 0px",
} as const;
