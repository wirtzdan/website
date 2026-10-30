import { expect, test } from "vite-plus/test";

import { collectPaginated } from "./paginate";

test("collects every page and stops when has_more is false", async () => {
  const cursors: Array<string | undefined> = [];
  let inFlight = 0;
  let maxInFlight = 0;

  const items = await collectPaginated(async (cursor) => {
    inFlight += 1;
    maxInFlight = Math.max(maxInFlight, inFlight);
    cursors.push(cursor);
    await new Promise((resolve) => setTimeout(resolve, 5));
    inFlight -= 1;

    if (cursor == null) {
      return { items: ["a", "b"], hasMore: true, nextCursor: "page-2" };
    }
    if (cursor === "page-2") {
      return { items: ["c"], hasMore: true, nextCursor: "page-3" };
    }
    return { items: ["d"], hasMore: false, nextCursor: null };
  });

  expect(items).toEqual(["a", "b", "c", "d"]);
  expect(cursors).toEqual([undefined, "page-2", "page-3"]);
  expect(maxInFlight).toBe(1);
});

test("stops when Notion repeats a cursor instead of looping", async () => {
  let calls = 0;
  const items = await collectPaginated(async () => {
    calls += 1;
    return { items: ["row"], hasMore: true, nextCursor: "same" };
  });

  expect(items).toEqual(["row", "row"]);
  expect(calls).toBe(2);
});

test("does not start a second page when has_more is true but the cursor is empty", async () => {
  let calls = 0;
  const items = await collectPaginated(async () => {
    calls += 1;
    return { items: ["only"], hasMore: true, nextCursor: "" };
  });

  expect(items).toEqual(["only"]);
  expect(calls).toBe(1);
});
