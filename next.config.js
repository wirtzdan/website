/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "dl.airtable.com", pathname: "/**" },
      { protocol: "https", hostname: "v5.airtableusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "assets-global.website-files.com", pathname: "/**" },
      { protocol: "https", hostname: "www.notion.so", pathname: "/**" },
      { protocol: "https", hostname: "notion.so", pathname: "/**" },
      { protocol: "https", hostname: "secure.notion-static.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "prod-files-secure.s3.amazonaws.com", pathname: "/**" },
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
