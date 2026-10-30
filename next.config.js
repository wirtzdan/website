/** @type {import('next').NextConfig} */

const path = require("path");
const lapseProdStub = path.join(__dirname, "lib/lapse-prod-stub.js");

const contentSecurityPolicy = [
  "default-src 'self'",
  [
    "script-src 'self' 'unsafe-inline'",
    "https://plausible.io",
    "https://www.clarity.ms",
    "https://scripts.clarity.ms",
    "https://static.cloudflareinsights.com",
    "https://platform.twitter.com",
    "https://cdn.syndication.twimg.com",
    "https://www.youtube.com",
    "https://s.ytimg.com",
    "https://player.vimeo.com",
  ].join(" "),
  "style-src 'self' 'unsafe-inline'",
  [
    "img-src 'self' data: blob:",
    "https://www.notion.so",
    "https://notion.so",
    "https://file.notion.so",
    "https://secure.notion-static.com",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com",
    "https://prod-files-secure.s3.amazonaws.com",
    "https://dl.airtable.com",
    "https://v5.airtableusercontent.com",
    "https://assets-global.website-files.com",
    "https://res.cloudinary.com",
    "https://*.cloudinary.com",
    "https://pbs.twimg.com",
    "https://abs.twimg.com",
    "https://ton.twimg.com",
    "https://i.ytimg.com",
    "https://i.vimeocdn.com",
    "https://c.clarity.ms",
    "https://covers.openlibrary.org",
  ].join(" "),
  "font-src 'self' data:",
  [
    "connect-src 'self'",
    "https://plausible.io",
    "https://*.clarity.ms",
    "https://cloudflareinsights.com",
    "https://static.cloudflareinsights.com",
    "https://syndication.twitter.com",
    "https://cdn.syndication.twimg.com",
    "https://www.youtube.com",
    "https://player.vimeo.com",
  ].join(" "),
  [
    "frame-src",
    "https://www.youtube.com",
    "https://www.youtube-nocookie.com",
    "https://player.vimeo.com",
    "https://platform.twitter.com",
    "https://syndication.twitter.com",
    "https://buttondown.email",
  ].join(" "),
  [
    "media-src 'self' blob:",
    "https://www.notion.so",
    "https://notion.so",
    "https://file.notion.so",
    "https://secure.notion-static.com",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com",
    "https://prod-files-secure.s3.amazonaws.com",
    "https://www.youtube.com",
    "https://www.youtube-nocookie.com",
    "https://player.vimeo.com",
  ].join(" "),
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "camera=()",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "payment=()",
      "usb=()",
      "bluetooth=()",
      "midi=()",
      "interest-cohort=()",
      'fullscreen=(self "https://www.youtube.com" "https://www.youtube-nocookie.com" "https://player.vimeo.com")',
    ].join(", "),
  },
  { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
];

const nextConfig = {
  poweredByHeader: false,
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
        headers: securityHeaders,
      },
    ];
  },
  webpack(config, { dev }) {
    if (!dev) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@aiforui/lapse$": lapseProdStub,
        "@aiforui/lapse/install$": lapseProdStub,
        "@aiforui/lapse/core$": lapseProdStub,
        "@aiforui/lapse/panel$": lapseProdStub,
      };
    }
    return config;
  },
};

// Turbopack is the default production bundler. Alias the private package to a
// no-op so a leftover import cannot ship the inspector. Dev keeps the real module.
if (process.env.NODE_ENV === "production") {
  nextConfig.turbopack = {
    resolveAlias: {
      "@aiforui/lapse": "./lib/lapse-prod-stub.js",
      "@aiforui/lapse/install": "./lib/lapse-prod-stub.js",
      "@aiforui/lapse/core": "./lib/lapse-prod-stub.js",
      "@aiforui/lapse/panel": "./lib/lapse-prod-stub.js",
    },
  };
}

const withMDX = require("@next/mdx")();

module.exports = withMDX(nextConfig);
