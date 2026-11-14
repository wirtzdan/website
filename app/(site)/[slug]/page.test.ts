import { expect, test, vi } from "vite-plus/test";

import type { Metadata } from "next";

vi.mock("@/lib/notion/api", () => ({
  getAllPages: async () => ({
    results: [
      { id: "p1", title: "Now", slug: "now", description: "What I do now.", isPublished: true },
      { id: "p2", title: "Privacy", slug: "privacy", isPublished: true },
      { id: "p3", title: "Uses", slug: "uses", isPublished: true },
    ],
  }),
  getPageByPageId: async (id: string) =>
    id === "p2"
      ? { block: { a: { value: { type: "text", properties: { title: [["No cookies here."]] } } } } }
      : null,
}));
vi.mock("@/components/notion-page", () => ({ default: () => null }));
vi.mock("@/layouts/page", () => ({ default: () => null }));

const { default: Page, generateMetadata } = await import("./page");

const metadataFor = (slug: string): Promise<Metadata> =>
  generateMetadata({ params: Promise.resolve({ slug }) });

test("Notion pages use their Description property", async () => {
  const metadata = await metadataFor("now");
  expect(metadata.description).toBe("What I do now.");
  expect(metadata.openGraph).toMatchObject({
    url: "https://danielwirtz.com/now",
    title: "Now – Daniel Wirtz",
    description: "What I do now.",
  });
  expect(metadata.twitter).toMatchObject({ site: "@wirtzdan", title: "Now – Daniel Wirtz" });
});

test("Notion pages without a Description use their first paragraph", async () => {
  expect((await metadataFor("privacy")).description).toBe("No cookies here.");
});

test("Notion pages without text get a page-specific fallback", async () => {
  expect((await metadataFor("uses")).description).toContain("Uses");
});

test("a failed Notion fetch throws instead of caching a 404", async () => {
  // getPageByPageId returns null when Notion fails. notFound() would replace the
  // last good ISR render with a 404 (audit X2); a thrown error keeps it.
  await expect(Page({ params: Promise.resolve({ slug: "uses" }) })).rejects.toThrow(
    "Could not load Notion page p3",
  );
});
