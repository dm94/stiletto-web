/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#2E2A26",
        info: "#5A7742", /* Changed from blue to nature green for info color */
        sand: "#C2A57C",
        sandLight: "#E0C9A6",
        sandDark: "#4A3B31",
        tribal: "#D95F32",
        nature: "#5A7742",
        charcoal: "#1B1B1B",
      },
      animation: {
        "spin-slow": "spin 2s linear infinite",
        "spin-medium": "spin 3s linear infinite",
        "spin-fast": "spin 1.5s linear infinite",
      },
      backgroundImage: {
        'sand-texture': "url('/img/sand-texture.jpg')",
      },
    },
  },
  plugins: [],
};
