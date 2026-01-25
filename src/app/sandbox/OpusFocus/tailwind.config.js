/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Habilitar dark mode baseado na classe 'dark'
  content: [
    "./index.html",
    "./main.js",
    "./src/**/*.{html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}