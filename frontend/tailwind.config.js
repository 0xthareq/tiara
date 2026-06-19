/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F6F2",
        surface: "#FFFFFF",
        ink: "#14171F",
        inksoft: "#5B6172",
        inkfaint: "#9BA0AC",
        line: "#E4E1D6",
        azure: "#1E4FDE",
        azuredeep: "#122F94",
        azuresoft: "#EAF0FF",
        amber: "#E08A2C",
        ambersoft: "#FCEFDD",
        green: "#2F9E5B",
        greensoft: "#E6F5EC",
      },
      fontFamily: {
        sans:    ["Geist", "system-ui", "sans-serif"],
        display: ["Geist", "system-ui", "sans-serif"],
        serif:   ["Instrument Serif", "Georgia", "serif"],
        body:    ["Geist", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,23,31,0.04), 0 8px 24px rgba(20,23,31,0.05)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
