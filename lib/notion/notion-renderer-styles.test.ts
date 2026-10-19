import { readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "vite-plus/test";

const stylesheet = readFileSync(
  path.join(process.cwd(), "lib/notion/notion-renderer-styles.css"),
  "utf8",
);

test("notion dark text follows the site color mode and dash-cased tokens", () => {
  expect(stylesheet).not.toMatch(/\.chakra-ui-dark\s*[,{]/);
  expect(stylesheet).not.toMatch(/--chakra-colors-neutralD-/);
  expect(stylesheet).not.toMatch(/--chakra-colors-primaryD-/);

  const darkBlock = stylesheet.match(/html\.dark,\s*\.dark-mode\s*\{([^}]+)\}/);
  expect(darkBlock).not.toBeNull();
  const declarations = darkBlock?.[1] ?? "";
  expect(declarations).toContain("--fg-color: var(--chakra-colors-neutral-d-1100)");
  expect(declarations).toContain("--fg-color-3: var(--chakra-colors-neutral-d-900)");
  expect(declarations).toContain("--bg-color-1: var(--chakra-colors-neutral-d-300)");
  expect(declarations).toContain("--bg-color-2: var(--chakra-colors-neutral-d-400)");

  expect(stylesheet).toContain("html.dark .notion-link");
  expect(stylesheet).toContain("color: var(--chakra-colors-primary-d-900)");
  expect(stylesheet).toContain("color: var(--chakra-colors-primary-900)");
});
