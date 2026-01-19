import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f7ff",
          100: "#dbe8ff",
          200: "#b3ceff",
          300: "#8bb4ff",
          400: "#6197ff",
          500: "#3b7bff",
          600: "#2a5ed6",
          700: "#1d43ad",
          800: "#142f7a",
          900: "#0c1d4a"
        }
      }
    }
  },
  plugins: []
};

export default config;
