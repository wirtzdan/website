import { defineConfig } from "@chakra-ui/react";

/** Site fonts and global CSS layered on top of the ejected Chakra theme. */
export const siteOverrides = defineConfig({
  globalCss: {
    html: {
      scrollBehavior: "smooth",
    },
    body: {
      fontSize: "1.2em",
      "& .deleted": {
        color: "#ff8383 !important",
        fontStyle: "normal !important",
      },
      "& .inserted": {
        color: "#b5f4a5 !important",
        fontStyle: "normal !important",
      },
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
    },
  },
});
