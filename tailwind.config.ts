import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "var(--color-bg)",
          surface: "var(--color-surface)",
          border: "var(--color-border)",
          text: "var(--color-text)",
          muted: "var(--color-muted)",
          accent: "var(--color-accent)"
        }
      },
      borderRadius: {
        md: "0.5rem",
        lg: "0.75rem"
      },
      spacing: {
        rhythm: "1.5rem"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
