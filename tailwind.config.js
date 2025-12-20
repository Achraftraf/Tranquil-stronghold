export default {
  theme: {
    extend: {
      animation: {
        spin: "spin 1s linear infinite", // restore
      },
      keyframes: {
        spin: {
          to: { transform: "rotate(360deg)" }
        }
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        openSans: ['var(--font-open-sans)'],
      },
    },
  },
};
