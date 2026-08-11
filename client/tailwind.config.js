/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          900: "rgb(var(--color-dark-900) / <alpha-value>)", // deepest background
          800: "rgb(var(--color-dark-800) / <alpha-value>)", // surface background
        },
        primary: "rgb(var(--color-primary) / <alpha-value>)", // accent
        secondary: "rgb(var(--color-secondary) / <alpha-value>)", // muted accent
        textMuted: "rgb(var(--color-text-muted) / <alpha-value>)", // gray text
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
      },
    }
  },
  plugins: []
};