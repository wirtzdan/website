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
    ".deleted, .inserted": {
      fontStyle: "normal !important",
    },
    // These greens and reds are for the dark code surface. On a light block they
    // are about 1.3:1 and 2.4:1, so they only apply once `.dark` is on <html>.
    ".dark .deleted": {
      color: "oklch(0.749 0.151 21.33) !important",
    },
    ".dark .inserted": {
      color: "oklch(0.905 0.123 139.389) !important",
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
