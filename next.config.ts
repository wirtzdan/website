import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    domains: [
      "dl.airtable.com",
      "v5.airtableusercontent.com",
      "assets-global.website-files.com",
      "www.notion.so",
      "notion.so",
      "secure.notion-static.com",
      "prod-files-secure",
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
        ],
      },
    ];
  },
};

export default withMDX(nextConfig);
