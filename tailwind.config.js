module.exports = {
  theme: {
    extend: {
      keyframes: {
        'slide-out': {
          '0%':   { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'slide-out': 'slide-out 0.5s ease-in forwards',
      },
    },
  },
};
