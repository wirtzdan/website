import { expect, test } from "vite-plus/test";

import robots from "./robots";

test("points crawlers at the sitemap and keeps assets crawlable", () => {
  const result = robots();

  expect(result.sitemap).toBe("https://danielwirtz.com/sitemap.xml");
  expect(result.host).toBe("https://danielwirtz.com");
  expect(result.rules).toEqual({
    userAgent: "*",
    allow: ["/", "/api/book-cover"],
    disallow: "/api/",
  });
});
