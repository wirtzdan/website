import { extendTheme } from "@chakra-ui/react";
import { blue, blueDark, slate, slateDark } from "@radix-ui/colors";

const mode =
  (light: string, dark: string) =>
  (props: { colorMode?: string }) =>
    props.colorMode === "dark" ? dark : light;

const transformRadixToChakraFormat = (scale: Record<string, string>) => {
  return Object.values(scale).reduce<Record<string, string>>(
    (accumulator, currentValue, index) => {
      if (index === 0) {
        accumulator["50"] = currentValue;
      } else {
        accumulator[`${index}00`] = currentValue;
      }

      return accumulator;
    },
    {}
  );
};

const radixNeutral = transformRadixToChakraFormat(slate);
const radixNeutralDark = transformRadixToChakraFormat(slateDark);
const radixPrimary = transformRadixToChakraFormat(blue);
const radixPrimaryDark = transformRadixToChakraFormat(blueDark);

const customTheme = extendTheme({
  fonts: {
    heading:
      '"Sora", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"',
    body: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  colors: {
    neutral: {
      ...radixNeutral,
    },
    neutralD: {
      ...radixNeutralDark,
    },
    gray: {
      50: "hsl(50 20.0% 99.0%)",
      100: "hsl(60 7.7% 97.5%)",
      200: "hsl(58 6.1% 92.9%)",
      300: "hsl(51 6.0% 77.1%)",
      400: "hsl(50 3.8% 30.6%)",
      500: "hsl(50 4.0% 42.7%)",
      600: "hsl(52 3.1% 48.3%)",
      700: "hsl(58 3.7% 13.1%)",
      800: "hsl(58 3.7% 13.1%)",
      900: "hsl(61 2.0% 8.3%)",
    },
    primary: {
      ...radixPrimary,
    },
    primaryD: {
      ...radixPrimaryDark,
    },
  },
  styles: {
    global: (props: Record<string, unknown>) => ({
      html: {
        scrollBehavior: "smooth",
      },
      body: {
        color: mode("neutral.1100", "neutralD.1100")(props),
        bg: mode("neutral.100", "neutralD.50")(props),
        fontSize: "1.2em",
        ".deleted": {
          color: "#ff8383 !important",
          fontStyle: "normal !important",
        },
        ".inserted": {
          color: "#b5f4a5 !important",
          fontStyle: "normal !important",
        },
        MozOsxFontSmoothing: "grayscale",
        WebkitFontSmoothing: "antialiased",
        textRendering: "optimizeLegibility",
      },
    }),
  },
  components: {
    MenuButton: {
      baseStyle: (props: Record<string, unknown>) => ({
        _hover: {
          backgroundColor: mode("neutral.400", "neutralD.400")(props),
        },
      }),
    },
    Heading: {
      baseStyle: (props: Record<string, unknown>) => ({
        borderBottom: "2px",
        borderColor: mode("neutral.500", "neutralD.500")(props),
        pb: 2,
        fontWeight: "600",
        color: mode("neutral.1100", "neutralD.1100")(props),
      }),
    },
    Button: {
      baseStyle: {
        fontWeight: "500",
        rounded: "lg",
      },
    },
    Tag: {
      baseStyle: {
        rounded: "lg",
      },
    },
    textarea: {
      baseStyle: {
        background: "green.300",
      },
    },
    Link: {
      baseStyle: {
        fontWeight: "inherit",
        _hover: {
          textDecoration: "none",
        },
      },
    },
  },
  mdx: {
    h1: {
      mt: "2rem",
      mb: ".25rem",
      lineHeight: 1.2,
      fontWeight: "bold",
      fontSize: "1.875rem",
      fontFamily: "var(--chakra-fonts-heading)",
      letterSpacing: "-.025em",
    },
    h2: {
      mt: "4rem",
      mb: "0.5rem",
      lineHeight: 1.3,
      fontWeight: "semibold",
      fontSize: "1.5rem",
      fontFamily: "var(--chakra-fonts-heading)",
      "& + h3": {
        mt: "1.5rem",
      },
    },
    h3: {
      mt: "3rem",
      lineHeight: 1.25,
      fontWeight: "semibold",
      fontFamily: "var(--chakra-fonts-heading)",
      fontSize: "1.25rem",
    },
    h4: {
      mt: "3rem",
      lineHeight: 1.375,
      fontWeight: "semibold",
      fontFamily: "var(--chakra-fonts-heading)",
      fontSize: "1.125rem",
    },
    p: {
      mt: "1.25rem",
      lineHeight: 1.7,
      "blockquote &": {
        mt: 0,
      },
    },
    hr: {
      my: "4rem",
    },
    blockquote: {
      bg: "orange.100",
      borderWidth: "1px",
      borderColor: "orange.200",
      rounded: "lg",
      px: "1.25rem",
      py: "1rem",
      my: "1.5rem",
    },
    ul: {
      mt: "1.5rem",
      ml: "1.25rem",
      "blockquote &": { mt: 0 },
      "& > * + *": {
        mt: "0.25rem",
      },
    },
    code: {
      rounded: "sm",
      px: "1",
      fontSize: "0.875em",
      py: "2px",
      whiteSpace: "nowrap",
      lineHeight: "normal",
    },
  },
});

export default customTheme;
