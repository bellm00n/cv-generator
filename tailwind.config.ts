import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Segoe UI"', '"Helvetica Neue"', "Arial", "sans-serif"],
      },
    },
  },
};

export default config;
