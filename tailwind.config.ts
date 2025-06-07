import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "gray-700": "var(--ds-gray-700)",
        "gray-1000": "var(--ds-gray-1000)",
        "shadow": "var(--ds-shadow)",
      }
    }
  },
  plugins: [],
};

export default config; 