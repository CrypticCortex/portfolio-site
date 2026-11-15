export const slideUp = {
    initial: { y: "100%" },
    open: { y: "0%", transition: { duration: 0.5 } },
    closed: { y: "100%", transition: { duration: 0.5 } }
};

export const opacity = {
    initial: { opacity: 0 },
    open: { opacity: 1, transition: { duration: 0.5 } },
    closed: { opacity: 0, transition: { duration: 0.5 } }
};

// src/anim.js
export const menuVariants = {
    open: {
      width: '300px',
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    closed: {
      width: '0',
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  };
  
  export const linkVariants = {
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: 'easeInOut' },
    }),
    closed: (i) => ({
      opacity: 0,
      x: -50,
      transition: { delay: i * 0.1, duration: 0.5, ease: 'easeInOut' },
    }),
  };
  