import { readFileSync } from "node:fs";

import { expect, test } from "vite-plus/test";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

test("the page transition wraps the article and not the fixed chrome", () => {
  const page = read("../layouts/page.tsx");
  const transitionStart = page.indexOf("<PageTransition>");
  const transitionEnd = page.indexOf("</PageTransition>");

  expect(transitionStart).toBeGreaterThan(-1);
  expect(page.indexOf("<Header />")).toBeLessThan(transitionStart);
  expect(page.indexOf("<MobileNavigation />")).toBeGreaterThan(transitionEnd);
  expect(page.indexOf("<Footer />")).toBeGreaterThan(transitionEnd);
  expect(page.slice(transitionStart, transitionEnd)).toContain("<article>");
});

test("the drawer sheet is not nested in the backdrop", () => {
  const drawer = read("./mobile-menu-toggle.tsx");

  expect(drawer).toMatch(/<Drawer\.Backdrop[^>]*\/>/);
  expect(drawer).not.toContain("<Drawer.Backdrop>");
  expect(drawer).toContain('animationDuration: "moderate"');
  expect(drawer).toContain('animationDuration: "fast"');
  expect(drawer).not.toContain("btnRef");
  expect(drawer).not.toContain("finalFocusEl");
  expect(drawer).not.toContain("Newsletter");
});

test("framer-motion is not used for the nav or the home recording dot", () => {
  expect(read("./mobile-navigation.tsx")).not.toContain("framer-motion");
  expect(read("./route-content/home-page.tsx")).not.toContain("RecordingDot");
  expect(read("./route-content/home-page.tsx")).not.toContain("framer-motion");
});
