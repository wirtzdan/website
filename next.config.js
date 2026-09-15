/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  // Notion block fan-out + Retry-After sleeps routinely exceed the 60s default on
  // Vercel's 2-core builders. Prefer finishing (or soft-failing) a page over
  // killing the export worker mid-retry.
  staticPageGenerationTimeout: 180,
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
    // Serialize blog/page SSG so one process-wide Notion queue actually works.
    // Multiple workers each get their own module state / rate limiter.
    cpus: 1,
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 10_000,
    // If a page still times out, keep exporting siblings instead of process.exit(1).
    // Failed paths still fail the build at the end — soft-fail in getPageByPageId
    // is what keeps individual posts from becoming fatal timeouts.
    prerenderEarlyExit: false,
  },
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
