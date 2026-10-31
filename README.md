# danielwirtz.com

Welcome behind the curtain of my personal website/portfolio. Take a look around.

This website is build using [Next.js](https://nextjs.org/) (React Framework), [Chakra UI](https://chakra-ui.com) (Component Library) and [Airtable](https://airtable.com/invite/r/HsvqbADg) as a simple backend. The backend comes into play on the blog, books and tools page.

Read [this article](https://danielwirtz.com/blog/website-rebuild-nextjs-chakra-ui-airtable) to see how I'm using Airtable as a backend.

I think the most interesting pages to look at are:

- https://danielwirtz.com/blog
- https://danielwirtz.com/books
- https://danielwirtz.com/tools

## Get it running locally

You need Node.js 20.9 or newer and pnpm. The exact pnpm version is pinned in `package.json`, so `corepack enable` will pick it up.

```bash
$ git clone https://github.com/wirtzdan/website danielwirtz.com
$ cd danielwirtz.com
$ pnpm install
$ pnpm dev
```

The dev dependency `@aiforui/lapse` (an animation inspector that only loads in development) comes from a private registry, `https://aiforui.dev/npm/`. `pnpm install` fails with a 401 unless you have access. If you have a token, write it to your user-level npm config before installing. Never put it in the project `.npmrc`:

```bash
$ AIFORUI_TOKEN=<your-token> node scripts/configure-aiforui-npm-auth.mjs
```

Make sure to add environment variables if you want to play around with the [Airtable](https://airtable.com/invite/r/HsvqbADg), Notion and [Raindrop](https://raindrop.io) integrations. To do so, create a `.env.local` file similar to [`.env.example`](https://github.com/wirtzdan/website/blob/master/.env.example).

### Scripts

| Command          | What it does                                        |
| ---------------- | --------------------------------------------------- |
| `pnpm dev`       | Start the dev server                                |
| `pnpm build`     | Production build                                    |
| `pnpm start`     | Serve the production build                          |
| `pnpm typecheck` | Type-check with `tsc --noEmit`                      |
| `pnpm check`     | Format, lint and type-check with Vite+ (`vp check`) |
| `pnpm test`      | Run the test suite once with Vite+ (`vp test run`)  |

## Using my code in your website

Read [License.md](https://github.com/wirtzdan/website/blob/master/license.md)

## Questions / Feedback

Do you have questions or feedback? Then the reach out to me on [Twitter](https://twitter.com/wirtzdan)
