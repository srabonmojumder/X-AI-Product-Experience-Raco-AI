import type { Config } from "tailwindcss";

/**
 * XAI — Living Intelligence.
 * A warm, organic instrument: a soft ivory chassis, one living coral→violet
 * gradient, and deep plum "living fields" where raw signal grows into shape.
 * Deliberately not the cream / high-contrast-serif / terracotta cliché.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm ivory chassis — greige-leaning so it never reads as "cream".
        paper: {
          DEFAULT: "#F3EFE8",
          sunken: "#ECE6DC",
          raised: "#FCFAF5",
        },
        line: {
          DEFAULT: "rgba(36, 31, 26, 0.085)",
          strong: "rgba(36, 31, 26, 0.14)",
        },
        // Warm near-black ink + soft taupe greys.
        ink: {
          DEFAULT: "#241F1A",
          muted: "#6C6459",
          faint: "#A79E90",
        },
        // Primary "life" accent — warm coral.
        coral: {
          DEFAULT: "#FF6A4D",
          soft: "#FF8566",
          dim: "rgba(255, 106, 77, 0.12)",
        },
        // Secondary accent — the cool counterweight.
        violet: {
          DEFAULT: "#7C5CF6",
          soft: "#9B7BFF",
          dim: "rgba(124, 92, 246, 0.12)",
        },
        // Living gradient stops (coral → rose → violet).
        grad: {
          1: "#FF8A5B",
          2: "#FB5A78",
          3: "#8B5CF6",
        },
        // The dark "living field" stage — deep warm plum so particles glow warm.
        field: {
          DEFAULT: "#17121C",
          raised: "#1E1826",
          line: "rgba(255, 240, 228, 0.12)",
          ink: "#E4DBD0",
          faint: "#8B8072",
        },
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "system-ui", "sans-serif"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 6vw, 5.5rem)", { lineHeight: "0.98", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 3.75rem)", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(1.85rem, 3vw, 2.75rem)", { lineHeight: "1.06", letterSpacing: "-0.028em" }],
      },
      maxWidth: {
        shell: "1240px",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.22, 1, 0.32, 1)",
        // Gentle organic overshoot.
        "soft-back": "cubic-bezier(0.34, 1.4, 0.5, 1)",
      },
      boxShadow: {
        soft: "0 20px 44px -30px rgba(70,45,30,0.42), 0 2px 8px -5px rgba(70,45,30,0.12)",
        lift: "0 30px 60px -32px rgba(70,45,30,0.5)",
        window: "0 50px 120px -50px rgba(60,35,25,0.5), 0 8px 24px -14px rgba(60,35,25,0.16)",
        field: "0 40px 92px -46px rgba(60,35,25,0.5)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.32, 1) both",
        breathe: "breathe 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
