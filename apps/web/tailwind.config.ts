import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#08090d",
        foreground: "#f8fafc",
        muted: "#a4adbb",
        panel: "rgba(255,255,255,0.06)",
        line: "rgba(255,255,255,0.12)",
        brand: "#39e6b5",
        cyan: "#5cc8ff",
        rose: "#ff6b98",
        amber: "#ffcc66"
      },
      boxShadow: {
        glow: "0 0 60px rgba(57,230,181,0.18)",
        panel: "0 24px 90px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: [animate]
};

export default config;
