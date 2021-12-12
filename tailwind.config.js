module.exports = {
  mode: "jit",
  purge: ["./content/**/*.md", "./content/**/*.html", "./layouts/**/*.html"],
    theme: {
    fontFamily: {
      sans: [
        "Inter",
        "system-ui",
        "BlinkMacSystemFont",
        "-apple-system",
        "sans-serif",
      ],
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      xxl: "1920px",
      xxxl: "2048px",
    },
    extend: {
      colors: {
        "yellow-50": "#fdfdea",
        "original-gray": "#1A202C"
      },
    },
  },
  variants: {},
  plugins: [],
};