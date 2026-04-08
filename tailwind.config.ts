import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel:   ["var(--font-cinzel)", "Palatino Linotype", "Georgia", "serif"],
        lora:     ["var(--font-lora)", "Book Antiqua", "Palatino", "Georgia", "serif"],
        pacifico: ["var(--font-pacifico)", "Dancing Script", "cursive"],
      },
      colors: {
        // Primary palette
        mossmoor:    "#3B4A35",
        fernhollow:  "#5C7A4E",
        morningmist: "#A8B89A",
        // Warm neutrals
        parchment:   "#F5EDD6",
        hearthstone: "#E8D9BB",
        burrowdust:  "#C4A97A",
        // Earthy accents
        copperpot:   "#A0522D",
        barleygold:  "#D4A843",
        plumthicket: "#6B4E6E",
        // Text
        inkwell:     "#2A2118",
        ashwood:     "#5C5046",
        ghostgrass:  "#8A8878",
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease forwards",
        "fade-in":    "fadeIn 0.4s ease forwards",
        "slide-right":"slideRight 0.5s ease forwards",
        "slide-left": "slideLeft 0.5s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideRight: {
          "0%":   { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideLeft: {
          "0%":   { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
