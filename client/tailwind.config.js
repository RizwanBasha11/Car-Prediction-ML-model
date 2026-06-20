/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        autoverseBg: "#050816",
        autoversePrimary: "#00E5FF",
        autoverseSecondary: "#7C3AED",
        autoverseAccent: "#00FFA3",
        autoverseText: "#FFFFFF",
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "sans-serif"],
      },
      boxShadow: {
        neonPrimary: "0 0 15px rgba(0, 229, 255, 0.4)",
        neonSecondary: "0 0 15px rgba(124, 58, 237, 0.4)",
        neonAccent: "0 0 15px rgba(0, 255, 163, 0.4)",
        glass: "0 8px 32px 0 rgba(255, 255, 255, 0.05)",
      },
      backdropBlur: {
        glass: "12px",
      }
    },
  },
  plugins: [],
}
