import { readFileSync } from "node:fs";

import { expect, test } from "vite-plus/test";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

test("article routes use a skeleton and keep the chrome in the layout", () => {
  const blog = read("../app/(site)/blog/[slug]/loading.tsx");
  const page = read("../app/(site)/[slug]/loading.tsx");

  expect(blog).toContain("<ArticleSkeleton showAuthor />");
  expect(page).toContain("<ArticleSkeleton />");
  expect(blog).not.toContain("Spinner");
  expect(page).not.toContain("Spinner");

  const site = read("../app/(site)/layout.tsx");
  expect(site).toContain("<Layout>{children}</Layout>");
});
