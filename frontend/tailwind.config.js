/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F19",
        cardBg: "rgba(17, 24, 39, 0.7)",
        primaryCyan: "#06B6D4",
        accentPurple: "#8B5CF6",
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },
      boxShadow: {
        glowCyan: "0 0 15px rgba(6, 182, 212, 0.4)",
        glowPurple: "0 0 15px rgba(139, 92, 246, 0.4)",
      }
    },
  },
  plugins: [],
}
