import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "loading-color-change": {
          "0%": { 
            backgroundColor: "#e5e7eb" // gray-200 (starting color)
          },
          "20%": { 
            backgroundColor: "#60a5fa" // blue-400 (intermediate color)
          },
          "40%": { 
            backgroundColor: "#2563eb" 
          },
          "60%": { 
            backgroundColor: "#1e40af"
          },
          "80%": { 
            backgroundColor: "#172554" 
          },
          "100%": { 
            backgroundColor: "#1e40af" // blue-600 (ending color, more intense)
          },
        },
        highlight: {
          "0%": { backgroundColor: "yellow" },
          "100%": { backgroundColor: "transparent" },
        },
      },
      animation: {
        "loading-color-change": "loading-color-change 3s ease-in-out forwards",
        highlight: "highlight 2s ease-in-out",
      },
    },
  },
  plugins: [],
} satisfies Config;