/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#343a40',
        'info': '#17a2b8',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'spin-medium': 'spin 3s linear infinite',
        'spin-fast': 'spin 1.5s linear infinite',
      },
    },
  },
  plugins: [],
} 