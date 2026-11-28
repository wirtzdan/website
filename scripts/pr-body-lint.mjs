#!/usr/bin/env node
/**
 * Checks that a pull request body follows docs/pr-review-package.md.
 *
 * Usage:
 *   node scripts/pr-body-lint.mjs [file]
 *   node scripts/pr-body-lint.mjs --pr <number>
 *   node scripts/pr-body-lint.mjs --self-test
 *
 * With no arguments, reads the body of the PR for the current branch
 * via `gh pr view --json body`.
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SUMMARY_RE = /^##[ \t]+Summary\b/m;
const TESTING_RE = /^##[ \t]+Testing\b/m;
const VISUALS_RE = /^##[ \t]+Visuals\b/m;
const NEXT_HEADING_RE = /^##[ \t]+/m;
const DETAILS_RE = /<details>\s*<summary>\s*Full details and changelog\s*<\/summary>/i;

const ATTRIBUTION_CHECKS = [
  { name: '"Generated with" attribution', re: /Generated with/i },
  { name: '"Made with Cursor" attribution', re: /Made with Cursor/i },
  {
    name: '"— <bot> bot" footer',
    re: /(?:^|\n)\s*(?:—|--|–)\s+\S.*\bbot\s*$/im,
  },
  {
    name: "robot / coding-agent footer",
    re: /🤖|Generated with coding agent/i,
  },
];

const BRIEF_ABOVE_CHECKS = [
  { name: "`## Brief` above Summary", re: /^##[ \t]+Brief\b/m },
  {
    name: "Problem / Solution / Requirements above Summary",
    re: /^#{2,3}[ \t]+(Problem|Solution|Requirements|Open Questions)\b/m,
  },
];

const TESTING_OMISSION_RE =
  /nothing to click|no (?:preview|url|page) to (?:open|test|check)|docs(?:-|\s+and\s+)?(?:only|tooling)|backend-only|no website preview|cannot be reached by url/i;

const VISUALS_OMISSION_RE =
  /visuals?\s+(were\s+)?omitted|no visuals|nothing to (?:see|screenshot|capture)|docs(?:-|\s+and\s+)?(?:only|tooling)|backend-only|no ui(?:\s+change)?/i;

const CHECKLIST_RE = /^[\t ]*- \[[ xX]\]/m;
const URL_RE = /https?:\/\/[^\s)]+/i;
const MEDIA_RE =
  /!\[[^\]]*]\([^)]+\)|<img\b|https:\/\/github\.com\/user-attachments\/assets\/|https:\/\/cursor\.com\/artifacts\//i;

function sectionAfter(body, headingRe) {
  const match = headingRe.exec(body);
  if (!match) {
    return null;
  }
  const start = match.index + match[0].length;
  const rest = body.slice(start);
  const next = NEXT_HEADING_RE.exec(rest);
  return (next ? rest.slice(0, next.index) : rest).trim();
}

function textBefore(body, headingRe) {
  const match = headingRe.exec(body);
  if (!match) {
    return body;
  }
  return body.slice(0, match.index);
}

function checkSummary(text) {
  const errors = [];
  if (SUMMARY_RE.test(text)) {
    const before = textBefore(text, SUMMARY_RE);
    for (const check of BRIEF_ABOVE_CHECKS) {
      if (check.re.test(before)) {
        errors.push(
          `${check.name}. A Linear brief belongs on the issue, not at the top of the PR.`,
        );
      }
    }
    return errors;
  }
  errors.push("Missing `## Summary` heading.");
  return errors;
}

function checkTesting(text) {
  const errors = [];
  if (TESTING_RE.test(text)) {
    const section = sectionAfter(text, TESTING_RE) || "";
    const hasEvidence =
      CHECKLIST_RE.test(section) || URL_RE.test(section) || TESTING_OMISSION_RE.test(section);
    if (!hasEvidence) {
      errors.push(
        "`## Testing` has no checklist, no link, and no reason there is nothing to click.",
      );
    }
    return errors;
  }
  if (!TESTING_OMISSION_RE.test(text)) {
    errors.push("Missing `## Testing` heading, and no reason that there is nothing to click.");
  }
  return errors;
}

function checkVisuals(text) {
  const errors = [];
  if (VISUALS_RE.test(text)) {
    const section = sectionAfter(text, VISUALS_RE) || "";
    const hasEvidence = MEDIA_RE.test(section) || VISUALS_OMISSION_RE.test(section);
    if (!hasEvidence) {
      errors.push("`## Visuals` has no before/after media and no explicit omission reason.");
    }
    return errors;
  }
  if (!VISUALS_OMISSION_RE.test(text)) {
    errors.push("Missing `## Visuals` heading, and no explicit reason Visuals were omitted.");
  }
  return errors;
}

function checkDetails(text) {
  if (DETAILS_RE.test(text)) {
    return [];
  }
  return ["Missing `<details><summary>Full details and changelog</summary>` block."];
}

function checkAttribution(text) {
  const errors = [];
  for (const check of ATTRIBUTION_CHECKS) {
    if (check.re.test(text)) {
      errors.push(`Body contains ${check.name}.`);
    }
  }
  return errors;
}

function lint(body) {
  const errors = [];
  const text = typeof body === "string" ? body : "";

  if (!text.trim()) {
    errors.push("PR body is empty.");
    return errors;
  }

  errors.push(...checkSummary(text));
  errors.push(...checkTesting(text));
  errors.push(...checkVisuals(text));
  errors.push(...checkDetails(text));
  errors.push(...checkAttribution(text));
  return errors;
}

function readBodyFromGh(pr) {
  const args = ["pr", "view", "--json", "body"];
  if (pr) {
    args.push(String(pr));
  }
  const raw = execFileSync("gh", args, { encoding: "utf8" });
  const parsed = JSON.parse(raw);
  return parsed.body ?? "";
}

function parseArgs(argv) {
  const out = { file: null, pr: null, selfTest: false };
  const pending = [...argv];
  while (pending.length > 0) {
    const arg = pending.shift();
    if (arg === "--self-test") {
      out.selfTest = true;
    } else if (arg === "--pr") {
      const value = pending.shift();
      if (!value) {
        throw new Error("--pr needs a pull request number.");
      }
      out.pr = value;
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown flag: ${arg}`);
    } else if (out.file) {
      throw new Error(`Unexpected argument: ${arg}`);
    } else {
      out.file = arg;
    }
  }
  return out;
}

const PASSING_BODY = `## Summary

Adds the studio pull request review package so every feature or fix PR uses the same format.

Linear: none, docs and tooling rollout with no linked issue.

## Testing

Nothing to click: this change is documentation and a local lint script, with no UI and no preview surface.

QA checklist:

- [ ] \`pnpm pr-body-lint --self-test\` exits 0.

## Visuals

Visuals omitted: docs and tooling only, no UI change.

<details>
<summary>Full details and changelog</summary>

- Added the pull request template, AGENTS.md section, and lint script.

</details>
`;

const FAILING_CASES = [
  {
    body: "",
    expect: /empty/i,
    name: "empty body",
  },
  {
    body: `## Brief

Problem: format drift.

## Summary

A change.

Linear: none, test.

## Testing

Nothing to click: docs only.

## Visuals

Visuals omitted: docs only.

<details>
<summary>Full details and changelog</summary>

Notes.

</details>
`,
    expect: /Brief/i,
    name: "brief above summary",
  },
  {
    body: `## Summary

A change.

Linear: none, test.

## Testing

Nothing to click: docs only.

## Visuals

Visuals omitted: docs only.

— uploadfloorplan.com bot
`,
    expect: /details|footer|bot/i,
    name: "missing details and attribution",
  },
  {
    body: `${PASSING_BODY}\n\n<sub>🤖 Generated with coding agent</sub>\n`,
    expect: /Generated with|robot/i,
    name: "generated-with footer",
  },
];

function selfTest() {
  const errors = [];
  const passErrors = lint(PASSING_BODY);
  if (passErrors.length) {
    errors.push(`expected passing body to lint clean, got:\n- ${passErrors.join("\n- ")}`);
  }
  for (const test of FAILING_CASES) {
    const found = lint(test.body);
    if (!found.some((entry) => test.expect.test(entry))) {
      errors.push(
        `expected ${test.name} to fail matching ${test.expect}, got: ${JSON.stringify(found)}`,
      );
    }
  }
  return errors;
}

function main(argv) {
  const opts = parseArgs(argv);
  if (opts.selfTest) {
    const errors = selfTest();
    if (errors.length) {
      console.error(`pr-body-lint self-test failed:\n- ${errors.join("\n- ")}`);
      process.exit(1);
    }
    console.log("pr-body-lint self-test passed.");
    return;
  }

  const body = opts.file ? readFileSync(opts.file, "utf8") : readBodyFromGh(opts.pr);

  const errors = lint(body);
  if (errors.length) {
    console.error(`pr-body-lint failed:\n- ${errors.join("\n- ")}`);
    process.exit(1);
  }
  console.log("pr-body-lint passed.");
}

export { lint };

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
