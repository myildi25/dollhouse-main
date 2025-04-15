import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#4B6F44", // Updated to forest green
          foreground: "hsl(var(--primary-foreground))",
          50: "#F4F6F0",
          100: "#E9EDE1",
          200: "#D3DBC3",
          300: "#BDC9A5",
          400: "#A7B787",
          500: "#91A569",
          600: "#7B934B",
          700: "#65812D",
          800: "#4F6F0F",
          900: "#395D00",
        },
        secondary: {
          DEFAULT: "#A9B388", // Lighter sage - complementary to primary
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "#B99470", // Warm terracotta/clay - adds warmth and sophistication
          foreground: "#FFFFFF",
          light: "#D4B996", // Lighter version for hover states
        },
        destructive: {
          DEFAULT: "#A27B5C", // Warm brown - less harsh than red
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#F2EFE9", // Warm off-white - softer than pure white
          foreground: "#4B6F44", // Using primary color for contrast
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Design-focused accent colors
        design: {
          charcoal: "#3A3A3A", // Deep charcoal for text and accents
          cream: "#F9F7F3", // Warm cream for backgrounds
          gold: "#D4AF37", // Gold accent for luxury touches
          navy: "#2C3E50", // Deep navy for contrast elements
          olive: "#708238", // Olive green for natural elements
          forest: "#4B6F44", // Forest green for buttons and accents
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
