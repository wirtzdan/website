# PR review package

Every feature or fix PR into `master` gives the reviewer the same package. It doesn't matter which runner opened it: T3, Claude Code, a Cursor cloud agent, or a person. The in-repo `create-pr` and `create-pr-description` skills say how to build it. This page is the contract they follow, and `pnpm pr-body-lint` (`scripts/pr-body-lint.mjs`) checks it.

A Linear Planning brief (Problem / Solution / Requirements / Open Questions) belongs on the Linear issue, not at the top of the PR.

## What the body must have

Use these sections, in this order:

1. **Summary.** One to three plain sentences about the user-facing outcome, plus the Linear issue link (`https://linear.app/danielwirtz/issue/<KEY>-<n>/…`). With no issue, write `Linear: none, <reason>`.
2. **Testing.** Deep links into the PR's Vercel preview, one per case, landing on the exact page and state. Use the stable branch alias host, the one with `-git-` in it. Then a `QA checklist:` of `- [ ]` steps a reviewer can tick. If a case cannot be reached by URL (for example a browser extension, or a desktop app), say how to load the local build and still include the checklist.
3. **Visuals.** A table with a `Before` and an `After` column and one row per viewport (Desktop ~1440px, Mobile ~390px). Add rows for distinct states such as error or empty. Then a short video of the flow, on its own line.
4. **Details.** A collapsed `<details><summary>Full details and changelog</summary>` block holding everything else, including local test commands and results.

Drop Testing or Visuals only when there is truly nothing to click or see (backend-only, docs-only, or an extension change with no website preview). If you drop a section, say why in the remaining body. Never leave placeholders.

## Images and video must render inline

GitHub only renders an image inline when its URL is one GitHub can fetch for the viewer:

- `https://github.com/user-attachments/assets/<uuid>`, made by `gh pr create/edit --attach <file>` (GitHub CLI 2.103 or newer). T3, Claude Code and people use this. It follows repo access, so it stays private on private repos.
- `https://cursor.com/artifacts/c/art-…`, written by Cursor's PR tool for cloud agents when **Allow posting artifacts to GitHub** is on.

These never render inline and must not be used:

- `https://cursor.com/agents/<bcId>/artifacts?path=…`, the Cursor artifact viewer. It needs a Cursor sign-in, so GitHub shows only the caption as a link.
- Presigned or short-lived URLs, and a plain committed `.mp4` link.
- Screenshots committed into the repo (for example under `docs/`) and linked as raw GitHub URLs. Attach them instead.

Video plays only from GitHub's attachment host. Put `![](demo.mp4)` alone in its own paragraph, not in a table cell, and pass the file with `--attach`. Limits: 10 MB per image, 10 MB per video (100 MB on a paid plan).

Capture with a headless browser only, such as Playwright with `--headless=new`. Never open a visible window on someone's machine.

## Preview links must actually work

1. Get the host from GitHub, never by hand. Use the Vercel bot comment or the deployment status on the PR. Vercel truncates and hashes long branch names.
2. Open each deep link headless and check the **page content**, not just the status code. The title must not be "Deployment was cancelled", a 404, or a Vercel login page, and the element under test must be visible. Drop any link that fails. Many studio previews sit behind Vercel Authentication; if a headless check hits a login wall, omit the URL and say so, then include the QA checklist for someone on the team to click through.
3. If the preview isn't ready yet, leave the links out and add them on a later pass. Don't poll in a loop. Never paste preview bypass tokens.

## Attribution

No "Made with Cursor", "Generated with Claude Code", "Generated with coding agent", or "— &lt;bot&gt; bot" signature, and no tool-added footers.

## The check

Run `pnpm pr-body-lint` before you call the PR done. It reads a body file, or `gh pr view --json body` when you pass a PR number or are already on the PR branch. It fails when any of these is true:

- No `## Summary`, or a Linear brief (`## Brief`, or Problem / Solution / Requirements) appears above it.
- No `## Testing` section, or that section has no checklist, no link, and no reason there is nothing to click.
- No `## Visuals` section and no explicit reason Visuals were omitted.
- No `<details>` block titled "Full details and changelog".
- The body contains "Generated with", "Made with Cursor", or a "— &lt;bot&gt; bot" footer.

The script does not need GitHub Actions. When Actions billing is working, the same script can be wired as a workflow check.
