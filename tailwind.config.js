const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#2AC8EB",
          200: "#00A7CC",
          300: "#2AC8EB38",
          400: "#2AC8EB26",
        },
        success: {
          100: "#3DB81F",
          200: "#3DB81F38",
          300: "#3DB81F26",
        },
        error: {
          100: "#C32424",
          200: "#C3242438",
          300: "#C3242426",
        },
        shade: {
          100: "#141436",
          200: "#181840",
          300: "#2F2F63",
          400: "#FFFFFF",
          500: "#FFFFFF80",
          600: "#FFFFFF4D",
        },
        "black-blue": "#040626",
      },
      backgroundImage: {
        "gradient-100": "linear-gradient(180deg, #2AC8EB 0%, #00A7CC 100%)",
        "gradient-200":
          "linear-gradient(155.54deg, #2AC8EB 1.22%, rgba(42, 200, 235, 0.17) 95.96%)",
      },
      boxShadow: {
        custom: "5px 5px 40px",
      },
      fontWeight: {
        "body-1": "400",
        "body-2": "400",
        "body-3": "600",
      },
      fontSize: {
        h1: ["32px", "39px"],
        h2: ["20px", "24px"],
        h3: ["16px", "20px"],
        h4: ["16px", "20px"],
        "body-1": ["16px", "20px"],
        "body-2": ["12px", "15px"],
        "body-3": ["12px", "15px"],
      },
      rotate: {
        360: "360deg",
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        h1: {
          fontSize: "32px",
          fontWeight: "700",
          lineHeight: "39px",
          fontStyle: "normal",
        },
        h2: {
          fontSize: "20px",
          fontWeight: "700",
          lineHeight: "24px",
          fontStyle: "normal",
        },
        h3: {
          fontSize: "16px",
          fontWeight: "700",
          lineHeight: "20px",
          fontStyle: "normal",
        },
        h4: {
          fontSize: "16px",
          fontWeight: "600",
          lineHeight: "20px",
          fontStyle: "normal",
        },
      });
    }),
    require("tailwind-scrollbar"),
  ],
  important: true,
};
