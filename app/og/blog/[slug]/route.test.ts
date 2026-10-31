import { expect, test, vi } from "vite-plus/test";

vi.mock("@/lib/notion/api", () => ({
  getBlogPosts: async () => ({
    results: [{ id: "b1", title: "Gmail URL paste", slug: "gmail-url-paste" }],
  }),
}));

const { GET } = await import("./route");

const call = (slug: string) =>
  GET(new Request(`https://danielwirtz.com/og/blog/${slug}`), {
    params: Promise.resolve({ slug }),
  });

test("unknown posts get a 404 instead of a card", async () => {
  const response = await call("nope");
  expect(response.status).toBe(404);
});

test("known posts get a PNG title card", async () => {
  const response = await call("gmail-url-paste");
  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toBe("image/png");
  const bytes = new Uint8Array(await response.arrayBuffer());
  expect(Array.from(bytes.slice(1, 4), (b) => String.fromCharCode(b)).join("")).toBe("PNG");
});
