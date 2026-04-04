/** @type {import('next').NextConfig} */
const nextConfig = {
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

const withMDX = require("@next/mdx")();

module.exports = withMDX(nextConfig);
