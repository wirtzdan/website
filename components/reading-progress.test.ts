import { expect, test } from "vite-plus/test";

import { readingProgressScale } from "./reading-progress";

test("reading progress is a 0–1 scale written onto the bar", () => {
  expect(readingProgressScale(0, 1000)).toBe(0);
  expect(readingProgressScale(250, 1000)).toBe(0.25);
  expect(readingProgressScale(1000, 1000)).toBe(1);
  expect(readingProgressScale(1400, 1000)).toBe(1);
  expect(readingProgressScale(10, 0)).toBe(1);
  expect(readingProgressScale(10, -40)).toBe(1);
});
