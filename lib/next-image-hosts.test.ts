import { expect, test } from "vite-plus/test";

import { isNotionImageProxy, notionContentImageLoader } from "./next-image-hosts";

const proxy =
  "https://www.notion.so/image/https%3A%2F%2Fexample.com%2Fa.jpg?table=block&id=abc&cache=v2";

test("sends Notion proxy images to the proxy with a width", () => {
  expect(isNotionImageProxy(proxy)).toBe(true);
  expect(isNotionImageProxy("https://images.unsplash.com/photo-1")).toBe(false);

  const sized = new URL(notionContentImageLoader({ src: proxy, width: 640 }));
  expect(sized.searchParams.get("width")).toBe("640");
  expect(sized.searchParams.get("table")).toBe("block");
  expect(sized.hostname).toBe("www.notion.so");
});
