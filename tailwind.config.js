/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        f1: {
          red: '#e10600',
          dark: '#0a0a0a',
          light: '#f5f5f5',
        }
      }
    },
  },
  plugins: [],
}