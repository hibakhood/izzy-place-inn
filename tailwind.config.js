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
        forest: {
          DEFAULT: "#0C3B24",
          50: "#EAF4EE",
          100: "#D3E8DB",
          200: "#A6D1B6",
          300: "#6FAE89",
          400: "#3D8A5C",
          500: "#1F6B42",
          600: "#15803D",
          700: "#0F5E30",
          800: "#0C3B24",
          900: "#082A19",
          950: "#051C10",
        },
        brass: {
          DEFAULT: "#B98A3F",
          50: "#FBF6EC",
          100: "#F4E8D0",
          200: "#E7D2A4",
          300: "#D6B876",
          400: "#C7A055",
          500: "#B98A3F",
          600: "#9A6F2E",
          700: "#7A5623",
          800: "#5C411C",
          900: "#402C14",
        },
        cream: {
          DEFAULT: "#FAF6EF",
          50: "#FDFBF7",
          100: "#FAF6EF",
          200: "#F2EADB",
          300: "#E7DED0",
          400: "#D8CBB6",
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
