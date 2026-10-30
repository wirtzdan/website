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
    _active: {
      transform: "scale(0.97)",
    },
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
      "--safe-top": "env(safe-area-inset-top, 0px)",
      "--safe-right": "env(safe-area-inset-right, 0px)",
      "--safe-bottom": "env(safe-area-inset-bottom, 0px)",
      "--safe-left": "env(safe-area-inset-left, 0px)",
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
    // iOS Safari zooms a focused field under 16px and does not zoom back.
    // The input recipe (14px) lives in a later cascade layer, so this needs
    // !important, and only where a phone would actually focus the field.
    // Coarse covers a landscape phone, which is often wider than md. Narrow
    // windows stay at 16px too. A fine pointer at md+ keeps the recipe size.
    "input, select, textarea": {
      "@media (pointer: coarse), (max-width: 47.999em)": {
        fontSize: "16px !important",
      },
    },
    "button, [role=button]": {
      userSelect: "none",
      WebkitUserSelect: "none",
      WebkitTouchCallout: "none",
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
