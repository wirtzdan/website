---
name: create-pr-description
description: Write or rewrite a GitHub pull request description for this repo. Use when opening a PR, when asked to write or fix a PR description, or when filling Summary, Testing, Visuals, or Details.
---

# Creating a PR description

Write the complete GitHub PR body. This is the review package, not the Linear Planning brief: Problem / Solution / Requirements / Open Questions stay on the Linear issue.

Follow [docs/pr-review-package.md](../../../docs/pr-review-package.md). Run `pnpm pr-body-lint` (or `npm run pr-body-lint`) before you call the PR done. `.github/pull_request_template.md` is the same skeleton.

If you are mid-change, finish the work first. If you only have the description, write it now.

## The four sections, in this order

### 1. Summary

One to three plain sentences about the user-facing outcome, plus the Linear issue:

`Linear: [KEY-123 Title](https://linear.app/danielwirtz/issue/KEY-123/slug)`

If there is no issue, write `Linear: none, <reason>`.

### 2. Testing

A bullet list of deep links, then a `QA checklist:`.

- One link per case. Each URL must land on the exact page and state under test, not a generic preview homepage. For a website PR, use the Vercel preview's stable branch alias (the host with `-git-` in it). Get the host from the Vercel bot comment or the deployment status on the PR, never by guessing from the branch name.
- Check every link headless (Playwright `--headless=new` is fine). Confirm the **page content**: the title is not "Deployment was cancelled" or a 404 or a Vercel login wall, and the element under test is visible. Drop any link that fails. Many studio previews sit behind Vercel Authentication; if a headless check hits a login wall, omit the URL, say so, and keep the checklist for someone on the team.
- If the preview is not ready, leave the links out and add them later. Don't poll in a loop. Never paste preview bypass tokens.
- If there is no URL to open (docs-only, backend-only, a browser extension, a desktop app), say how to exercise the change and still include the checklist.

Then:

```markdown
QA checklist:

- [ ] Step, and what the reviewer should see
```

### 3. Visuals

A table, then a video on its own line.

- Rows: **Desktop** (~1440px) and **Mobile** (~390px). Add a row for each distinct state (error, empty, success).
- Columns: `Before` and `After`, each a screenshot.
- Then a short video of the flow, alone in its own paragraph: `![](demo.mp4)`.
- Capture with a headless browser only. Never open a visible window on someone's machine.
- Attach files with `gh pr create --attach` / `gh pr edit --attach` (GitHub CLI 2.103 or newer) so they render as `https://github.com/user-attachments/assets/<uuid>`. Cursor cloud agents may also use `https://cursor.com/artifacts/c/art-…` when posting artifacts is allowed.
- Do not commit screenshots into the repo. Do not use `cursor.com/agents/…/artifacts?path=` links, presigned URLs, or a committed `.mp4`.

Drop this section only when there is truly nothing to see (backend-only or docs-only). If you drop it, say why in the remaining body.

### 4. Details

A collapsed block for everything else, including local test commands and results:

```markdown
<details>
<summary>Full details and changelog</summary>

Leave a blank line after the summary tag, then the changelog and notes.

</details>
```

## Attribution

Do not add "Made with Cursor", "Generated with Claude Code", "Generated with coding agent", "— &lt;bot&gt; bot", or any tool-added footer.

## How to write it

1. Read [docs/pr-review-package.md](../../../docs/pr-review-package.md) and this repo's `.github/pull_request_template.md`.
2. Draft the four sections from the current diff. No "this PR", no "I", no fluff.
3. Attach images and video, or state why Visuals are omitted.
4. Run the lint: `pnpm pr-body-lint --pr <n>` after the PR exists, or `node scripts/pr-body-lint.mjs /tmp/pr-body.md` before it does.
5. Create or update the PR with `gh pr create` / `gh pr edit`, or the GitHub MCP / `gh api` equivalent. Include `Linear: …`.
6. If you opened the PR before preview URLs existed, add them in a later pass once the deployment is ready.

Replace the entire body. Do not merge unless the owner asked.
