import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cool graphite base — deliberately blue-black, never pure #000.
        bg: "#0B0D12",
        surface: {
          DEFAULT: "#12151C",
          raised: "#171B24",
          sunken: "#0E1116",
        },
        line: {
          DEFAULT: "rgba(148, 163, 184, 0.10)",
          strong: "rgba(148, 163, 184, 0.18)",
        },
        // Warm-neutral off-white for temperature contrast against cool darks.
        ink: {
          DEFAULT: "#F3F3F1",
          muted: "#98A0AE",
          faint: "#5A6270",
        },
        // Interactive accent (periwinkle-indigo).
        accent: {
          DEFAULT: "#7D8CFF",
          soft: "#A7B1FF",
          dim: "rgba(125, 140, 255, 0.14)",
        },
        // "Data" signal — reserved for particles / charts glow only.
        signal: {
          cyan: "#57E1CE",
          indigo: "#7D8CFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 6vw, 5.25rem)", { lineHeight: "0.98", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 3.5rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
      },
      maxWidth: {
        shell: "1200px",
      },
      transitionTimingFunction: {
        // Signature eases.
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
