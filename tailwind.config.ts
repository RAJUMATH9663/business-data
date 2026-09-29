import type { Config } from "tailwindcss";

// Brand palette (the only colours used in the UI)
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F8FAFC", // modern slate-50 background
        "paper-card": "#FFFFFF",
        mist: "#F1F5F9", // slate-100 soft background
        lilac: "#E2E8F0", // crisp modern border slate-200
        brand: "#2563EB", // vibrant electric blue
        "brand-hover": "#1D4ED8",
        "brand-light": "#EFF6FF",
        "brand-dark": "#1E40AF",
        ink: "#0F172A", // crisp slate-900 text
        "ink-muted": "#64748B", // slate-500 secondary text
        accent: "#F59E0B", // amber accent
        success: "#10B981", // emerald success
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.03)",
        card: "0 10px 30px -5px rgba(15, 23, 42, 0.07), 0 4px 10px -2px rgba(15, 23, 42, 0.03)",
        elevated: "0 20px 40px -10px rgba(37, 99, 235, 0.15), 0 1px 3px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
