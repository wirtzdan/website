# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

This is a personal website/portfolio (danielwirtz.com) built with **Next.js 14** (Pages Router), **Chakra UI v2**, and **Framer Motion**. Content is fetched from external APIs (Notion, Airtable, Raindrop.io, Buttondown). See `README.md` for general setup.

### Running the dev server

The shell environment may have `NODE_ENV=production` pre-set. You **must** override it when starting the dev server:

```bash
NODE_ENV=development pnpm dev
```

Without this override, SSR will fail with `jsxDEV is not a function` errors.

### Environment variables

Copy `.env.example` to `.env.local`. The dev server starts and serves static pages (e.g. `/about`, `/404`) even with placeholder values. Pages that call external APIs (`/`, `/blog`, `/books`, `/tools`, `/bookmarks`, `/newsletter`) require real API keys to render their full content but will still compile.

Do **not** set `NODE_ENV` inside `.env.local` — Next.js manages it automatically in dev mode.

### No lint/test setup

This project has no ESLint config, no TypeScript, and no test framework. There is no `lint` or `test` script in `package.json`.

### Package manager

Use **pnpm** (lockfile: `pnpm-lock.yaml`). The README mentions `yarn` but pnpm is the canonical package manager.

### Build

```bash
pnpm build
```

Builds successfully with placeholder env vars (external API pages use ISR and fetch at build time from Notion/Airtable).
