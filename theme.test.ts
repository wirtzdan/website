import { readFileSync } from "node:fs";

import { expect, test } from "vite-plus/test";

import theme from "./theme";

const globalCss = JSON.stringify(theme.getGlobalCss());

test("touch fields stay 16px and fine pointers keep the input recipe", () => {
  expect(globalCss).toContain(
    '"&input, &select, &textarea":{"@media (pointer: coarse), (max-width: 47.999em)":{"fontSize":"16px !important"}}',
  );
});

test("buttons are not selectable and press in", () => {
  expect(globalCss).toContain(
    '"&button, &[role=button]":{"userSelect":"none","WebkitUserSelect":"none","WebkitTouchCallout":"none"}',
  );
  expect(theme.getRecipe("button", {}).base?._active).toMatchObject({
    transform: "scale(0.97)",
  });
});

test("in-page smooth scrolling is limited to motion-safe visitors", () => {
  expect(globalCss).toContain(
    '"scrollBehavior":"auto","--safe-top":"env(safe-area-inset-top, 0px)"',
  );
  expect(globalCss).toContain(
    '"@media (prefers-reduced-motion: no-preference)":{"scrollBehavior":"smooth"}',
  );
});

test("safe-area insets are available once the viewport covers the screen", () => {
  const layout = readFileSync(new URL("./app/layout.tsx", import.meta.url), "utf8");

  expect(globalCss).toContain('"--safe-bottom":"env(safe-area-inset-bottom, 0px)"');
  expect(layout).toContain('viewportFit: "cover"');
  expect(layout).not.toMatch(/maximumScale|userScalable/);
});

test("html paints the same background as body in both modes", () => {
  expect(globalCss).toMatch(/"&html":\{[^}]*"background":"var\(--chakra-colors-neutral-100\)"/);
  expect(globalCss).toContain('"&.dark":{"background":"var(--chakra-colors-neutral-d-50)"');
});

test("every focus-visible element shares one 2px blue ring with a 2px offset", () => {
  expect(globalCss).toContain(
    '"--focus-ring-color":"var(--chakra-colors-blue-500)","&:is(:focus-visible, [data-focus-visible])":{"outlineWidth":"var(--focus-ring-width, 2px)","outlineOffset":"var(--focus-ring-offset, 2px)"',
  );
  // Recipe-styled controls take their ring from the palette; gray is the default.
  expect(JSON.stringify(theme.getTokenCss())).toContain(
    '"--chakra-colors-gray-focus-ring":"var(--chakra-colors-blue-500)"',
  );
});
