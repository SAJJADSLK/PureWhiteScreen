import { Variants } from 'framer-motion';

// Drag and drop animations
export const dragDropVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

// Progress bar animations
export const progressBarVariants: Variants = {
  initial: {
    width: 0,
    opacity: 0,
  },
  animate: {
    width: '100%',
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

// Glowing state animations
export const glowingStateVariants: Variants = {
  initial: {
    boxShadow: '0 0 0 0 rgba(0, 255, 255, 0.4)',
  },
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(0, 255, 255, 0.4)',
      '0 0 0 10px rgba(0, 255, 255, 0)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

// Upload progress animations
export const uploadProgressVariants: Variants = {
  initial: {
    height: 0,
    opacity: 0,
  },
  animate: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// File item animations
export const fileItemVariants: Variants = {
  initial: {
    x: -20,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    x: 20,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
  hover: {
    x: 5,
    transition: {
      duration: 0.2,
    },
  },
};

// Smooth transition animations
export const smoothTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
    },
  },
};

// Stagger container animations
export const staggerContainerVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Stagger item animations
export const staggerItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

// Pulse animations
export const pulseVariants: Variants = {
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

// Bounce animations
export const bounceVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Rotate animations
export const rotateVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Scale animations
export const scaleVariants: Variants = {
  initial: {
    scale: 0.9,
  },
  animate: {
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.95,
  },
};

// Slide animations
export const slideVariants: Variants = {
  initial: {
    x: -100,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    x: 100,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

// Fade animations
export const fadeVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Shimmer loading animation
export const shimmerVariants: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Helper function to create custom animations
export const createCustomAnimation = (
  duration: number = 0.3,
  delay: number = 0,
  ease: string = 'easeOut'
) => ({
  transition: {
    duration,
    delay,
    ease,
  },
});

// Easing functions
export const easingFunctions = {
  easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
  easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};
