import type { Variants } from 'framer-motion';

/* ─── Page Transition Variants ─── */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/* ─── Fade In Up ─── */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

/* ─── Stagger Container ─── */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/* ─── Stagger Item ─── */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

/* ─── Scale In ─── */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

/* ─── Slide In from Left ─── */
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

/* ─── Slide In from Right ─── */
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

/* ─── Mobile Menu ─── */
export const mobileMenuVariants: Variants = {
  closed: {
    x: '100%',
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  open: {
    x: 0,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

/* ─── Dropdown ─── */
export const dropdownVariants: Variants = {
  closed: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2 },
  },
};

/* ─── Modal ─── */
export const modalOverlay: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};
