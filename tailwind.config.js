/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFB800",
        "primary-container": "#FFB800",
        secondary: "#525f71",
        background: "#f8f9ff",
        surface: "#f8f9ff",
        "on-surface": "#0f1c2c",
        outline: "#6c7b6a",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
