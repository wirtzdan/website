import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const customTheme = extendTheme({
  fonts: {
    heading: "'Red Hat Display', sans-serif",
    body: "'Red Hat Text', sans-serif",
  },
  styles: {
    global: (props) => ({
      body: {
        color: mode("gray.700", "whiteAlpha.900")(props),
        bg: mode("gray.50", "gray.900")(props),
        ".deleted": {
          color: "#ff8383 !important",
          fontStyle: "normal !important",
        },
        ".inserted": {
          color: "#b5f4a5 !important",
          fontStyle: "normal !important",
        },
      },
    }),
  },
});

export default customTheme;
