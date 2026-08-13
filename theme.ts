import { createSystem, defaultConfig, defineConfig, defineRecipe } from "@chakra-ui/react";
import { blue, blueDark, slate, slateDark } from "@radix-ui/colors";

const wrapColorScale = (scale: Record<string, string>) =>
  Object.fromEntries(Object.entries(scale).map(([key, color]) => [key, { value: color }]));

const transformRadixToChakraFormat = (scale: Record<string, string>) => {
  return Object.values(scale).reduce<Record<string, string>>((accumulator, currentValue, index) => {
    if (index === 0) {
      accumulator["50"] = currentValue;
    } else {
      accumulator[`${index}00`] = currentValue;
    }
    return accumulator;
  }, {});
};

const radixNeutral = wrapColorScale(transformRadixToChakraFormat(slate));
const radixNeutralDark = wrapColorScale(transformRadixToChakraFormat(slateDark));
const radixPrimary = wrapColorScale(transformRadixToChakraFormat(blue));
const radixPrimaryDark = wrapColorScale(transformRadixToChakraFormat(blueDark));

const headingRecipe = defineRecipe({
  className: "heading",
  base: {
    borderBottomWidth: "2px",
    borderColor: { _light: "neutral.500", _dark: "neutralD.500" },
    pb: "2",
    fontWeight: "600",
    color: { _light: "neutral.1100", _dark: "neutralD.1100" },
  },
});

const buttonRecipe = defineRecipe({
  className: "button",
  base: {
    fontWeight: "500",
    borderRadius: "lg",
  },
});

const linkRecipe = defineRecipe({
  className: "link",
  base: {
    fontWeight: "inherit",
    _hover: {
      textDecoration: "none",
    },
  },
});

const config = defineConfig({
  globalCss: {
    html: {
      scrollBehavior: "smooth",
    },
    body: {
      color: { _light: "neutral.1100", _dark: "neutralD.1100" },
      bg: { _light: "neutral.100", _dark: "neutralD.50" },
      fontSize: "1.2em",
    },
    ".deleted": {
      color: "#ff8383 !important",
      fontStyle: "normal !important",
    },
    ".inserted": {
      color: "#b5f4a5 !important",
      fontStyle: "normal !important",
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: {
          value:
            'var(--font-sora), -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"',
        },
        body: {
          value:
            'var(--font-ibm-plex-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"',
        },
      },
      colors: {
        neutral: radixNeutral,
        neutralD: radixNeutralDark,
        gray: {
          50: { value: "hsl(50 20.0% 99.0%)" },
          100: { value: "hsl(60 7.7% 97.5%)" },
          200: { value: "hsl(58 6.1% 92.9%)" },
          300: { value: "hsl(51 6.0% 77.1%)" },
          400: { value: "hsl(50 3.8% 30.6%)" },
          500: { value: "hsl(50 4.0% 42.7%)" },
          600: { value: "hsl(52 3.1% 48.3%)" },
          700: { value: "hsl(58 3.7% 13.1%)" },
          800: { value: "hsl(58 3.7% 13.1%)" },
          900: { value: "hsl(61 2.0% 8.3%)" },
        },
        primary: radixPrimary,
        primaryD: radixPrimaryDark,
      },
    },
    recipes: {
      heading: headingRecipe,
      button: buttonRecipe,
      link: linkRecipe,
    },
  },
});

const customTheme = createSystem(defaultConfig, config);

export default customTheme;
