// See https://tailwindcss.com/docs/configuration for details

module.exports = {
  purge: ["./src/**/*.html", "./src/**/*.vue", "./src/**/*.jsx"]
  theme: {
    extend: {
      fontFamily: {
        display: ['"Red Hat Display"'],
        body: ['"Red Hat Text"'],
      },
      boxShadow: {
        outline: "0 0 0 2px rgba(65, 195, 247,0.8)",
      },
      colors: {
        primary: {
          50: "#E3F8FF",
          100: "#B3ECFF",
          200: "#81DEFD",
          300: "#5ED0FA",
          400: "#40C3F7",
          500: "#2BB0ED",
          600: "#1992D4",
          700: "#127FBF",
          800: "#0B69A3",
          900: "#035388",
        },
        neutral: {
          50: "#F5F7FA",
          100: "#E4E7EB",
          200: "#CBD2D9",
          300: "#9AA5B1",
          400: "#7B8794",
          500: "#616E7C",
          600: "#52606D",
          700: "#3E4C59",
          800: "#323F4B",
          900: "#1F2933",
        },
      },
    },
  },
  variants: {
    backgroundColor: [
      "responsive",
      "hover",
      "dark",
      "dark-hover",
      "dark-group-hover",
    ],
    padding: ["dark", "dark-focus", "dark-focus-within"],
    borderWidth: ["dark", "dark-focus", "dark-focus-within", "hover"],
    borderColor: ["dark", "dark-focus", "dark-focus-within", "hover"],
    textColor: [
      "responsive",
      "hover",
      "dark",
      "dark-hover",
      "dark-group-hover",
    ],
    display: ["responsive", "dark"],
    opacity: ["responsive", "group-hover", "hover", "focus"],
  },
  plugins: [require("tailwindcss-dark-mode")()],
};
