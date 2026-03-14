const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
      colors: {
        bg: "var(--bg)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-code": "var(--bg-code)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-comment": "var(--text-comment)",
        accent: "var(--accent)",
        "accent-dim": "var(--accent-dim)",
        border: "var(--border)",
        green: "var(--green)",
        blue: "var(--blue)",
      },
      maxWidth: {
        page: "1200px",
        content: "640px",
      },
      borderWidth: {
        3: "3px",
      },
      fontSize: {
        xs: ["clamp(0.7rem, 0.65rem + 0.25vw, 0.75rem)", { lineHeight: "1.5" }],
        sm: ["clamp(0.8rem, 0.75rem + 0.25vw, 0.875rem)", { lineHeight: "1.6" }],
        base: ["clamp(0.875rem, 0.8rem + 0.375vw, 1rem)", { lineHeight: "1.6" }],
        lg: ["clamp(1.1rem, 1rem + 0.5vw, 1.25rem)", { lineHeight: "1.4" }],
        xl: ["clamp(1.5rem, 1.25rem + 1.25vw, 2rem)", { lineHeight: "1.2" }],
        "2xl": ["clamp(2rem, 1.5rem + 2.5vw, 3rem)", { lineHeight: "1.1" }],
      },
    },
  },
  plugins: [],
};
