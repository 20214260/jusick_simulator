// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        'spacing': 'margin, padding'
      },

      animation: {
        'shake': 'shake 0.6s infinite',
        'ping-fast': 'ping 0.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'bg-transition': 'bgChange 5s ease-in-out forwards',
        'pulse': 'pulse 1s infinite',
        'float': 'float 3s ease-in-out inrinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-out': 'fadeOut 0.5s ease-in forwards',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '10%': { transform: 'translate(-2px, 2px) rotate(-1deg)' },
          '20%': { transform: 'translate(-3px, 0px) rotate(1deg)' },
          '30%': { transform: 'translate(3px, 2px) rotate(0deg)' },
          '40%': { transform: 'translate(-1px, -2px) rotate(1deg)' },
          '50%': { transform: 'translate(2px, 2px) rotate(-1deg)' },
          '60%': { transform: 'translate(-3px, 1px) rotate(0deg)' },
          '70%': { transform: 'translate(2px, 1px) rotate(-1deg)' },
          '80%': { transform: 'translate(-1px, -1px) rotate(1deg)' },
          '90%': { transform: 'translate(2px, 2px) rotate(0deg)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 10px #facc15, 0 0 20px #facc15' },
          '50%': { boxShadow: '0 0 20px #fbbf24, 0 0 30px #fbbf24' },
        },
        bgChange: {
          '0%': { backgroundColor: '#e0f2fe' }, // 시작색 (sky-100)
          '100%': { backgroundColor: '#fef9c3' }, // 끝색 (yellow-100)
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(-10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)' },
          '100%': { opacity: '0', transform: 'scale(0.95) translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
