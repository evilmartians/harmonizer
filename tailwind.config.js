/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
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
        secondary: "#00000096",
        "secondary-inverted": "#ffffff96",
        button: "#00000020",
        "button-inverted": "#ffffff20",
        "button-hover": "#00000040",
        "button-hover-inverted": "#ffffff40",
        border: "#00000040",
        "border-inverted": "#ffffff40",
      },
      fontSize: {
        xs: [
          "7.5px",
          {
            lineHeight: "10px",
            fontStretch: "100%",
          },
        ],
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

export default tailwindConfig;
