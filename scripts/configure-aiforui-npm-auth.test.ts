import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { expect, test } from "vite-plus/test";

const script = join(process.cwd(), "scripts/configure-aiforui-npm-auth.mjs");
const projectNpmrc = join(process.cwd(), ".npmrc");

function run(env: NodeJS.ProcessEnv) {
  return execFileSync(process.execPath, [script], {
    cwd: process.cwd(),
    encoding: "utf8",
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

test("project npmrc names the aiforui registry and stores no credential", () => {
  const npmrc = readFileSync(projectNpmrc, "utf8");
  expect(npmrc).toBe("@aiforui:registry=https://aiforui.dev/npm/\n");
  expect(npmrc).not.toMatch(/_authToken|eyJ/);
});

test("lapse stays a direct devDependency without an npm alias", () => {
  const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")) as {
    dependencies?: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  const lockfile = readFileSync(join(process.cwd(), "pnpm-lock.yaml"), "utf8");

  expect(pkg.devDependencies["@aiforui/lapse"]).toMatch(/^[\^~]?\d/);
  expect(pkg.dependencies?.["@aiforui/lapse"]).toBeUndefined();
  expect(JSON.stringify(pkg)).not.toContain("npm:@aiforui/lapse");
  expect(lockfile).not.toContain("npm:@aiforui/lapse");
  expect(lockfile).not.toMatch(/_authToken/);
});

test("writes the registry token to the user npmrc only", () => {
  const home = mkdtempSync(join(tmpdir(), "aiforui-npm-"));
  const before = readFileSync(projectNpmrc, "utf8");

  try {
    const stdout = run({
      PATH: process.env.PATH,
      HOME: home,
      NODE_ENV: "test",
      AIFORUI_TOKEN: "test-token-value",
    });
    const userNpmrc = readFileSync(join(home, ".npmrc"), "utf8");

    expect(userNpmrc).toContain("//aiforui.dev/npm/:_authToken=test-token-value");
    expect(stdout).not.toContain("test-token-value");
    expect(readFileSync(projectNpmrc, "utf8")).toBe(before);
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});

test("refuses a Vercel install when AIFORUI_TOKEN is missing", () => {
  const home = mkdtempSync(join(tmpdir(), "aiforui-npm-"));
  const before = readFileSync(projectNpmrc, "utf8");

  try {
    let failed = false;
    try {
      run({
        PATH: process.env.PATH,
        HOME: home,
        NODE_ENV: "test",
        VERCEL: "1",
      });
    } catch (error) {
      failed = true;
      const stderr = String((error as { stderr?: string }).stderr ?? "");
      const message = error instanceof Error ? error.message : String(error);
      expect(`${message}\n${stderr}`).toContain("AIFORUI_TOKEN");
      expect(`${message}\n${stderr}`).not.toMatch(/eyJ/);
    }
    expect(failed).toBe(true);
    expect(readFileSync(projectNpmrc, "utf8")).toBe(before);
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});
