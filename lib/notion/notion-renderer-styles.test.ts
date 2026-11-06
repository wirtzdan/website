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
  expect(declarations).toContain("--fg-color-3: var(--chakra-colors-neutral-d-1000)");
  expect(declarations).toContain("--bg-color-1: var(--chakra-colors-neutral-d-300)");
  expect(declarations).toContain("--bg-color-2: var(--chakra-colors-neutral-d-400)");

  expect(stylesheet).toContain("html.dark .notion-link");
  expect(stylesheet).toContain("color: var(--chakra-colors-primary-d-900)");
  expect(stylesheet).toContain("color: var(--chakra-colors-primary-1000)");
});

test("notion link and page-link hover only apply to fine pointers", () => {
  for (const rule of [".notion-link:hover", ".notion-page-link:hover"]) {
    const hoverIndex = stylesheet.indexOf(rule);
    expect(hoverIndex).toBeGreaterThan(-1);
    const mediaIndex = stylesheet.lastIndexOf(
      "@media (hover: hover) and (pointer: fine)",
      hoverIndex,
    );
    expect(mediaIndex).toBeGreaterThan(-1);
  }
});

function ruleBody(selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return stylesheet.match(new RegExp(`(?:^|\\n)${escaped} \\{([^}]+)\\}`))?.[1] ?? "";
}

test("inline code uses the body text colour, not the low-contrast Notion red", () => {
  expect(ruleBody(".notion-inline-code")).toContain("color: inherit;");
  expect(stylesheet).not.toContain("#eb5757");
});

test("notion headings step down one size below md", () => {
  const mobile = stylesheet.match(
    /@media \(max-width: 47\.999em\) \{\s*\.notion-h1 \{\s*font-size: 1\.5em;\s*\}\s*\.notion-h2 \{\s*font-size: 1\.25em;\s*\}/,
  );
  expect(mobile).not.toBeNull();
});

test("long notion links wrap instead of widening the page", () => {
  expect(ruleBody(".notion-link")).toContain("overflow-wrap: anywhere;");
});
