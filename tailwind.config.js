/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "ivory": "rgb(var(--color-ivory) / <alpha-value>)",
        "mist": "rgb(var(--color-mist) / <alpha-value>)",
        "line": "rgb(var(--color-line) / <alpha-value>)",
        "charcoal": "rgb(var(--color-charcoal) / <alpha-value>)",
        "ink": "rgb(var(--color-ink) / <alpha-value>)",
        "ivory-soft": "rgb(var(--color-ivory-soft) / <alpha-value>)",
        "gold": "rgb(var(--color-gold) / <alpha-value>)",
        "gold-deep": "rgb(var(--color-gold-deep) / <alpha-value>)",
        "danger": "rgb(var(--color-danger) / <alpha-value>)",
        "success": "rgb(var(--color-success) / <alpha-value>)",
        forest: {
          "DEFAULT": "rgb(var(--color-forest) / <alpha-value>)",
          "50": "rgb(var(--color-mist) / <alpha-value>)",
          "100": "rgb(var(--color-mist) / <alpha-value>)",
          "200": "rgb(var(--color-line) / <alpha-value>)",
          "300": "rgb(var(--color-muted) / <alpha-value>)",
          "400": "rgb(var(--color-success) / <alpha-value>)",
          "500": "rgb(var(--color-gold-deep) / <alpha-value>)",
          "600": "rgb(var(--color-gold-deep) / <alpha-value>)",
          "700": "rgb(var(--color-forest) / <alpha-value>)",
          "800": "rgb(var(--color-forest) / <alpha-value>)",
          "900": "rgb(var(--color-forest) / <alpha-value>)",
          "950": "rgb(var(--color-forest) / <alpha-value>)",
        },
        brass: {
          "DEFAULT": "rgb(var(--color-gold) / <alpha-value>)",
          "50": "rgb(var(--color-ivory) / <alpha-value>)",
          "100": "rgb(var(--color-ivory-soft) / <alpha-value>)",
          "200": "rgb(var(--color-line) / <alpha-value>)",
          "300": "rgb(var(--color-gold) / <alpha-value>)",
          "400": "rgb(var(--color-gold) / <alpha-value>)",
          "500": "rgb(var(--color-gold) / <alpha-value>)",
          "600": "rgb(var(--color-gold-deep) / <alpha-value>)",
          "700": "rgb(var(--color-gold-deep) / <alpha-value>)",
          "800": "rgb(var(--color-gold-deep) / <alpha-value>)",
          "900": "rgb(var(--color-gold-deep) / <alpha-value>)",
        },
        cream: {
          "DEFAULT": "rgb(var(--color-ivory) / <alpha-value>)",
          "50": "rgb(var(--color-ivory) / <alpha-value>)",
          "100": "rgb(var(--color-ivory) / <alpha-value>)",
          "200": "rgb(var(--color-ivory-soft) / <alpha-value>)",
          "300": "rgb(var(--color-line) / <alpha-value>)",
          "400": "rgb(var(--color-line) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        aptos: ['"Aptos"', '"Aptos Display"', "system-ui", "sans-serif"],
        sans: ['"Manrope"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(11,33,22,0.04), 0 10px 30px -16px rgba(11,33,22,0.12)",
        lift: "0 2px 4px rgba(11,33,22,0.05), 0 24px 48px -24px rgba(11,33,22,0.20)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "marquee-right": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.7s ease-out both",
        "marquee-right": "marquee-right 45s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
