// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      keyframes: {
        typing: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        blink: {
          '0%, 100%': { 'border-color': 'transparent' },
          '50%': { 'border-color': 'black' },
        },
      },
      animation: {
        typing: 'typing 3s steps(30, end) forwards, blink 0.7s step-end infinite',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};