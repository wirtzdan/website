import path from "node:path";

import { defineConfig } from "vite-plus";

const root = process.cwd();

export default defineConfig({
  resolve: {
    alias: [
      { find: "@/components", replacement: path.join(root, "components") },
      { find: "@/data", replacement: path.join(root, "data") },
      { find: "@/layouts", replacement: path.join(root, "layouts") },
      { find: "@/lib", replacement: path.join(root, "lib") },
      { find: "@/styles", replacement: path.join(root, "styles") },
      { find: "@/types", replacement: path.join(root, "types") },
      { find: "@/theme", replacement: path.join(root, "theme.ts") },
    ],
  },
  staged: {
    "*": "vp check --fix",
  },
});
