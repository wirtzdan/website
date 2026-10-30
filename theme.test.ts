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

test("safe-area insets are available once the viewport covers the screen", () => {
  const layout = readFileSync(new URL("./app/layout.tsx", import.meta.url), "utf8");

  expect(globalCss).toContain('"--safe-bottom":"env(safe-area-inset-bottom, 0px)"');
  expect(layout).toContain('viewportFit: "cover"');
  expect(layout).not.toMatch(/maximumScale|userScalable/);
});
