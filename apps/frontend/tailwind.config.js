// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        'extra': '40px', // Example custom blur size
      },
    },
  },
  darkMode: 'class',
  plugins: [],  // Remove the tailwindcss-backdrop-filter plugin
}