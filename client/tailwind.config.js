/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#0b0c10", // deepest background
          800: "#1f2833", // surface background
        },
        primary: "#66fcf1", // cyan accent
        secondary: "#45a29e", // muted cyan
        textMuted: "#c5c6c7", // gray text
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
      },
    }
  },
  plugins: []
};