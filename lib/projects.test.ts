import { expect, test } from "vite-plus/test";

import { displayHost, PROJECTS, withUtm } from "@/lib/projects";

test("withUtm appends the referral params", () => {
  expect(withUtm("https://clipper.so")).toBe(
    "https://clipper.so/?utm_source=danielwirtz.com&utm_medium=referral",
  );
});

test("withUtm keeps existing query params", () => {
  expect(withUtm("https://markway.io/pricing?plan=pro#faq")).toBe(
    "https://markway.io/pricing?plan=pro&utm_source=danielwirtz.com&utm_medium=referral#faq",
  );
});

test("withUtm leaves UTM values that are already set", () => {
  const already = "https://bordmate.com/?utm_source=danielwirtz.com&utm_medium=referral";
  expect(withUtm(already)).toBe(already);
  expect(withUtm("https://jumpstack.dev/?utm_source=newsletter")).toBe(
    "https://jumpstack.dev/?utm_source=newsletter&utm_medium=referral",
  );
});

test("projects are the five live apps in order, on their official domains", () => {
  expect(PROJECTS.map((project) => displayHost(project.url))).toEqual([
    "clipper.so",
    "markway.io",
    "uploadfloorplan.com",
    "jumpstack.dev",
    "bordmate.com",
  ]);
  for (const project of PROJECTS) {
    expect(project.url).not.toContain("utm_");
    expect(project.status).not.toBe("Live");
  }
});
