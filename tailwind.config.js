/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14202B",
        slate2: "#4A5B6A",
        mist: "#EEF2F5",
        line: "#D5DDE3",
        sheet: "#FBFCFD",
        teal: { DEFAULT: "#0E7C86", dark: "#0A5E66", soft: "#DDF1F3" },
        mark: "#FFE08A",
        danger: "#B3261E",
        dangerSoft: "#FCE9E7",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
