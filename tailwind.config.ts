import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-hover": "var(--color-surface-hover)",
        "surface-muted": "var(--color-surface-muted)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
        "accent-dark": "var(--color-accent-dark)",
      },
      fontFamily: {
        sans: ["var(--font-source-sans)", "Source Sans 3", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["var(--font-archivo)", "Archivo", "sans-serif"],
        serif: ["Cinzel", "Playfair Display", "serif"],
      },
      letterSpacing: {
        "arch-tight": "-0.02em",
        "arch-wide": "0.15em",
        "arch-wider": "0.25em",
        "arch-title": "5px",
        "arch-meta": "1.5px",
      },
      maxWidth: {
        "architectural": "1720px",
      },
      transitionTimingFunction: {
        "editorial": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
