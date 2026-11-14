import type { MetadataRoute } from "next";

import { SITE_URL, absoluteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/book-cover", "/api/tool-icon"],
      // Form and webhook endpoints. Book covers and tool icons stay crawlable.
      disallow: "/api/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
