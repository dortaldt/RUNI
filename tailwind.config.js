/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        highlight: {
          DEFAULT: "hsl(var(--highlight))",
          foreground: "hsl(var(--highlight-foreground))",
        },
        rule: "hsl(var(--rule))",
        border: "hsl(var(--border))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // Libre Franklin = the open-source Franklin Gothic, NYT's label/UI sans.
        sans: ["Libre Franklin", "ui-sans-serif", "system-ui", "sans-serif"],
        // Newsreader = a screen-designed news serif (NYT Cheltenham/Imperial spirit).
        serif: ["Newsreader", "ui-serif", "Georgia", "serif"],
      },
      // 8pt spacing scale (tokens the course teaches)
      spacing: {
        1: "8px",
        2: "16px",
        3: "24px",
        4: "32px",
        5: "40px",
        6: "48px",
        8: "64px",
        10: "80px",
        12: "96px",
      },
      fontSize: {
        // modular type scale — pushed up for stronger hierarchy
        caption: ["0.8125rem", { lineHeight: "1.1rem" }],
        body: ["1.25rem", { lineHeight: "1.7rem" }],
        h3: ["1.75rem", { lineHeight: "2.1rem" }],
        h2: ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h1: ["4.5rem", { lineHeight: "1.04", letterSpacing: "-0.02em" }],
        display: ["6rem", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
      },
    },
  },
  plugins: [],
};
