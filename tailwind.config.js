/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "var(--dark)",
        info: "var(--nature)",
        sand: "var(--sand)",
        sandLight: "var(--sand-light)",
        sandDark: "var(--sand-dark)",
        tribal: "var(--tribal)",
        nature: "var(--nature)",
        charcoal: "var(--charcoal)",
      },
      animation: {
        "spin-slow": "spin 2s linear infinite",
        "spin-medium": "spin 3s linear infinite",
        "spin-fast": "spin 1.5s linear infinite",
      },
      backgroundImage: {
        'sand-texture': "url('/img/sand-texture.jpg')",
      },
      fontFamily: {
        okami: ["Okami", "serif"],
        roboto: ["Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
