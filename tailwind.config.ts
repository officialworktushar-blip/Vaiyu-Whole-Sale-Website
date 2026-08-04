import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "brand-navy": "#1B2A4A",
        "brand-orange": "#FF6A00",
        "brand-red": "#E8281C",
        "brand-purple": "#7B2FF7",
        "brand-gray": "#4B5563",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(90deg, #FF6A00 0%, #E8281C 50%, #7B2FF7 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
