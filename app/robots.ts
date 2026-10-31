import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/book-cover"],
      // Form and webhook endpoints. Book covers stay crawlable for /books.
      disallow: "/api/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
