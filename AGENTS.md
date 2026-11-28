# danielwirtz.com

## Pull requests

Every feature or fix PR into `master` uses the same review package, whichever runner opens it (T3, Claude Code, a Cursor cloud agent, or a person). The contract is [`docs/pr-review-package.md`](docs/pr-review-package.md). Build it with the in-repo `create-pr-description` skill. A Linear Planning brief (Problem / Solution / Requirements / Open Questions) belongs on the Linear issue, not at the top of the PR.

Use exactly these sections, in this order. Drop Testing or Visuals only when there is truly nothing to click or see (for example backend-only, or an extension change with no website preview). Never leave placeholders.

1. **Summary.** One to three plain sentences on the user-facing outcome, plus the Linear link (`https://linear.app/danielwirtz/issue/KEY-123/…`). If there is no issue, write `Linear: none, <reason>`.
2. **Testing.** Deep links on the stable Vercel `-git-` alias, one per case, checked headless for page content (not just status). Drop any link that is a Vercel login, a cancelled deployment, or a 404. Then a `QA checklist:` of `- [ ]` steps with the expected result. If a case cannot be reached by URL (for example a browser extension), say how to load the local build and still include the checklist.
3. **Visuals.** A before/after table at desktop (~1440px) and mobile (~390px). For UI changes, also a short video on its own line. Capture headless only. Attach files with `gh pr create/edit --attach` so they render as `github.com/user-attachments/assets/…`. Do not commit screenshots into the repo.
4. **Details.** A collapsed `<details><summary>Full details and changelog</summary>` block for everything else, including local test commands and results.

No "Made with Cursor", "Generated with Claude Code", "Generated with coding agent", or "— <bot> bot" attribution, and no tool-added footers. Run the repo's `pr-body-lint` script before you call the PR done. Do not merge unless the owner asked.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Running Scripts

Run TypeScript and JavaScript files with `vpx <file>`, for example `vpx ./scripts/seed.ts --dry-run`. It handles enums, decorators, JSX, and tsconfig `paths`, so do not add `tsx` or `ts-node` to run scripts. `vpx --watch <file>` reruns the file when a file it uses changes, in place of `tsx watch`. `vp node <file>` runs plain Node.js.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
