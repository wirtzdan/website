/**
 * Writes the private @aiforui registry token to the user-level npmrc.
 * The project .npmrc only names the registry. pnpm does not expand
 * credentials from a project .npmrc, and this file must never contain one.
 *
 * Vercel installs devDependencies, so a missing token 401s `pnpm install`
 * before `next build`. Set AIFORUI_TOKEN on the Vercel project for
 * Production and Preview, available at build time.
 */
import { execFileSync } from "node:child_process";

const token = process.env.AIFORUI_TOKEN?.trim() ?? "";

if (!token) {
  if (process.env.VERCEL) {
    console.error(
      "AIFORUI_TOKEN is not set. Vercel installs devDependencies, including @aiforui/lapse from https://aiforui.dev/npm/. Add AIFORUI_TOKEN to this project's Vercel environment variables for Production and Preview, available during the build, then redeploy.",
    );
    process.exit(1);
  }

  console.log("AIFORUI_TOKEN is unset; using the existing user-level npm credentials.");
  process.exit(0);
}

if (token.includes("\n") || token.includes("\r")) {
  console.error("AIFORUI_TOKEN must be a single line. It was not written.");
  process.exit(1);
}

try {
  execFileSync(
    "npm",
    ["config", "set", "--location=user", "//aiforui.dev/npm/:_authToken", token],
    {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
} catch (error) {
  const stderr = String(error.stderr ?? error.message ?? "npm config set failed").replaceAll(
    token,
    "[redacted]",
  );
  console.error(stderr);
  process.exit(typeof error.status === "number" ? error.status : 1);
}
