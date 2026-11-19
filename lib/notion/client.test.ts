import type { Client } from "@notionhq/client";
import { NotionCompatAPI } from "notion-compat";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

import { DedupedNotionCompatAPI } from "./client";

const ROOT = "11111111-1111-1111-1111-111111111111";
const PARAGRAPH = "22222222-2222-2222-2222-222222222222";
const COLUMN_LIST = "33333333-3333-3333-3333-333333333333";
const COLUMN_A = "44444444-4444-4444-4444-444444444444";
const COLUMN_B = "55555555-5555-5555-5555-555555555555";
const TEXT_A = "66666666-6666-6666-6666-666666666666";
const TEXT_B = "77777777-7777-7777-7777-777777777777";

const timestamps = {
  created_time: "2024-01-01T00:00:00.000Z",
  last_edited_time: "2024-01-01T00:00:00.000Z",
};

function block(id: string, type: string, hasChildren = false, details: object = {}) {
  return { object: "block", id, type, has_children: hasChildren, ...timestamps, [type]: details };
}

const paragraph = (id: string) =>
  block(id, "paragraph", false, {
    rich_text: [{ type: "text", plain_text: "Hi", text: { content: "Hi" }, annotations: {} }],
    color: "default",
  });

const children: Record<string, unknown[]> = {
  [ROOT]: [paragraph(PARAGRAPH), block(COLUMN_LIST, "column_list", true)],
  [COLUMN_LIST]: [block(COLUMN_A, "column", true), block(COLUMN_B, "column", true)],
  [COLUMN_A]: [paragraph(TEXT_A)],
  [COLUMN_B]: [paragraph(TEXT_B)],
};

function fakeClient({ failRoot = false } = {}) {
  const calls: string[] = [];
  const client = {
    pages: {
      retrieve: async ({ page_id }: { page_id: string }) => {
        calls.push(`pages.retrieve ${page_id}`);
        return {
          object: "page",
          id: page_id,
          ...timestamps,
          parent: { type: "workspace", workspace: true },
          properties: { title: { id: "title", type: "title", title: [] } },
        };
      },
    },
    blocks: {
      retrieve: async ({ block_id }: { block_id: string }) => {
        calls.push(`blocks.retrieve ${block_id}`);
        if (failRoot) {
          throw new Error("Request to Notion API failed");
        }
        return block(block_id, "child_page", true, { title: "Race report" });
      },
      children: {
        list: async ({ block_id }: { block_id: string }) => {
          calls.push(`blocks.children.list ${block_id}`);
          return { results: children[block_id] ?? [], next_cursor: null };
        },
      },
    },
  };
  return { calls, client: client as unknown as Client };
}

beforeEach(() => {
  // notion-compat logs every children.list call and warns on swallowed errors.
  vi.spyOn(console, "log").mockImplementation(() => undefined);
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("upstream getPage fetches the root block, page and children twice", async () => {
  const { client, calls } = fakeClient();
  await new NotionCompatAPI(client).getPage(ROOT);

  expect(calls.filter((call) => call === `blocks.children.list ${ROOT}`)).toHaveLength(2);
  expect(calls.filter((call) => call === `blocks.retrieve ${ROOT}`)).toHaveLength(2);
  expect(calls.filter((call) => call === `pages.retrieve ${ROOT}`)).toHaveLength(2);
});

test("DedupedNotionCompatAPI fetches each block once and builds the same record map", async () => {
  const upstream = fakeClient();
  const expected = await new NotionCompatAPI(upstream.client).getPage(ROOT);

  const deduped = fakeClient();
  const recordMap = await new DedupedNotionCompatAPI(deduped.client).getPage(ROOT);

  expect(deduped.calls.toSorted()).toEqual(
    [
      `blocks.retrieve ${ROOT}`,
      `pages.retrieve ${ROOT}`,
      `blocks.children.list ${ROOT}`,
      `blocks.children.list ${COLUMN_LIST}`,
      `blocks.children.list ${COLUMN_A}`,
      `blocks.children.list ${COLUMN_B}`,
    ].toSorted(),
  );
  expect(upstream.calls).toHaveLength(deduped.calls.length + 3);

  const { raw: _raw, ...expectedWithoutRaw } = expected;
  expect(recordMap).toEqual(expectedWithoutRaw);
  expect(Object.keys(recordMap.block)).toEqual(
    expect.arrayContaining([ROOT, PARAGRAPH, COLUMN_LIST, COLUMN_A, COLUMN_B, TEXT_A, TEXT_B]),
  );
});

test("DedupedNotionCompatAPI throws when the root block cannot be fetched", async () => {
  const { client } = fakeClient({ failRoot: true });
  await expect(new DedupedNotionCompatAPI(client).getPage(ROOT)).rejects.toThrow(
    `Notion page ${ROOT} could not be resolved`,
  );
});
