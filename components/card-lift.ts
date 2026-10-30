import type { BoxProps } from "@chakra-ui/react";

/**
 * The outer element keeps the hit area still. The inner `.card-lift` moves.
 * Shadow uses `_hover`, which Chakra already gates with `(hover: hover)`.
 * The 4px lift is a separate transform so reduced motion can drop it.
 */
export const cardStillProps: BoxProps = {
  display: "block",
  w: "100%",
  _hover: {
    "& > .card-lift": {
      shadow: "lg",
    },
  },
  css: {
    "@media (hover: hover) and (prefers-reduced-motion: no-preference)": {
      "&:hover > .card-lift": {
        transform: "translateY(-4px)",
      },
    },
    "@media (prefers-reduced-motion: reduce)": {
      "& > .card-lift": {
        transition: "none",
      },
    },
  },
};

export const cardLiftProps = {
  className: "card-lift",
  transitionProperty: "transform, box-shadow",
  transitionDuration: "150ms",
  transitionTimingFunction: "ease",
};
