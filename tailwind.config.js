/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "martian-grotesk": ["Martian Grotesk", "sans-serif"],
        "martian-mono": ["Martian Mono", "monospace"],
      },
      colors: {
        primary: "#000000",
        "primary-inverted": "#ffffff",
        secondary: "#00000080",
        "secondary-inverted": "#ffffff80",
        button: "#00000020",
        "button-inverted": "#ffffff20",
        "button-hover": "#00000040",
        "button-hover-inverted": "#ffffff40",
      },
      fontSize: {
        s: [
          "10px",
          {
            lineHeight: "16px",
            fontStretch: "100%",
          },
        ],
        "ui-s": [
          "10px",
          {
            lineHeight: "12px",
            fontStretch: "100%",
          },
        ],
        m: [
          "12.5px",
          {
            lineHeight: "16px",
            fontStretch: "100%",
          },
        ],
        "ui-m": [
          "12.5px",
          {
            lineHeight: "16px",
            fontStretch: "100%",
          },
        ],
        l: [
          "25px",
          {
            lineHeight: "32px",
            fontStretch: "100%",
          },
        ],
        "ui-l": [
          "25px",
          {
            lineHeight: "24px",
            fontStretch: "100%",
          },
        ],
      },
    },
  },
  plugins: [],
};
