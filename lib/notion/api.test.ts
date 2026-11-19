import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

import { resetSingleflightForTests } from "@/lib/content-cache";
import { NEXT_PRODUCTION_BUILD_PHASE } from "./rate-limited-fetch";

const getPage = vi.fn();

vi.mock("./client", () => ({
  notionAPI: {},
  notionPrivateAPI: { getPage: (pageId: string) => getPage(pageId) },
}));

const { getPageByPageId } = await import("./api");

beforeEach(() => {
  resetSingleflightForTests();
  getPage.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

test("getPageByPageId rethrows Notion failures at runtime so ISR keeps the stale page", async () => {
  vi.stubEnv("NEXT_PHASE", "");
  getPage.mockRejectedValue(new Error("Request to Notion API failed"));

  await expect(getPageByPageId("runtime-failure")).rejects.toThrow("Request to Notion API failed");
});

test("getPageByPageId still soft-fails to null during next build", async () => {
  vi.stubEnv("NEXT_PHASE", NEXT_PRODUCTION_BUILD_PHASE);
  getPage.mockRejectedValue(new Error("Request to Notion API failed"));

  await expect(getPageByPageId("build-failure")).resolves.toBeNull();
});

test("getPageByPageId returns the record map when Notion succeeds", async () => {
  vi.stubEnv("NEXT_PHASE", "");
  getPage.mockResolvedValue({ block: { a: { value: { id: "a", type: "page" } } } });

  await expect(getPageByPageId("ok")).resolves.toEqual({
    block: { a: { value: { id: "a", type: "page" } } },
  });
});
