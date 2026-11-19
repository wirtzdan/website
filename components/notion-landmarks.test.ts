import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NotionRenderer } from "react-notion-x";
import { expect, test } from "vite-plus/test";

// The site layout already renders the page's only <main id="content">.
// react-notion-x hard-codes a <main> for the root block when fullPage is off,
// so patches/react-notion-x@7.3.0.patch renders it as a <div> instead.
test("the Notion root block does not add a second <main> landmark", () => {
  const pageId = "00000000-0000-0000-0000-000000000001";
  const textId = "00000000-0000-0000-0000-000000000002";
  const recordMap = {
    block: {
      [pageId]: {
        role: "reader",
        value: {
          id: pageId,
          type: "page",
          properties: { title: [["Privacy"]] },
          content: [textId],
          parent_table: "space",
        },
      },
      [textId]: {
        role: "reader",
        value: {
          id: textId,
          type: "text",
          properties: { title: [["No cookies here."]] },
          parent_id: pageId,
          parent_table: "block",
        },
      },
    },
    collection: {},
    collection_view: {},
    notion_user: {},
    collection_query: {},
    signed_urls: {},
  };

  const html = renderToStaticMarkup(
    createElement(NotionRenderer, {
      recordMap: recordMap as unknown as Parameters<typeof NotionRenderer>[0]["recordMap"],
      fullPage: false,
      disableHeader: true,
    }),
  );

  expect(html).toContain("No cookies here.");
  expect(html).toMatch(/<div class="notion [^"]*notion-page/);
  expect(html).not.toContain("<main");
});
