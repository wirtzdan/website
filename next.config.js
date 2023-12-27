const withMDX = require("@next/mdx")();

const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx"],
  images: {
    domains: [
      "dl.airtable.com",
      "v5.airtableusercontent.com",
      "assets-global.website-files.com",
      "www.notion.so",
    ],
  },
};

module.exports = withMDX(nextConfig);
