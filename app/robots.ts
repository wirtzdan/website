import type { MetadataRoute } from "next";

import { SITE_URL, absoluteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/book-cover"],
      // Form and webhook endpoints. Book covers stay crawlable for /books.
      disallow: "/api/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
