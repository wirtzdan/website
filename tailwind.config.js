// See https://tailwindcss.com/docs/configuration for details

module.exports = {
  theme: {},
  variants: {
    backgroundColor: [
      "responsive",
      "hover",
      "dark",
      "dark-hover",
      "dark-group-hover"
    ],
    padding: ["dark", "dark-focus", "dark-focus-within"],
    borderWidth: ["dark", "dark-focus", "dark-focus-within"],
    borderColor: ["dark", "dark-focus", "dark-focus-within"],
    textColor: ["hover", "dark", "dark-hover", "dark-active"],
    display: ["responsive", "dark"],
    opacity: ["responsive", "group-hover", "hover", "focus"]
  },
  plugins: [require("tailwindcss-dark-mode")()]
};
