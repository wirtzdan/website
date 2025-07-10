const withMDX = require("@next/mdx")();

const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx"],
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
  // Enable video loading from various sources
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

module.exports = withMDX(nextConfig);
