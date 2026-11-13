# UI/UX audit decisions, 2026-11-06

Decisions on every finding in [ui-ux-audit-2026-11-06.md](ui-ux-audit-2026-11-06.md). The bar was small, low-risk polish that keeps the UI invisible: fix what's broken, prefer removing over adding, and leave copy, content data, new features and redesigns to Daniel.

**57 findings: 31 do, 6 modified, 20 skip.** The #1 finding, **C1** (the `172.79999999999998%` baker's total), is **do**.

## Decisions

| ID  | Decision | Reason                                                                                                                                                                  |
| --- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| N1  | do       | P1 bug. Close the drawer on navigation.                                                                                                                                 |
| N2  | do       | P1 bug. Fix it with a z-index on the mobile `nav` only. Don't touch the book cards (another session owns them).                                                         |
| N3  | do       | P1 a11y bug. Remove the per-item `bg` and style `_highlighted` like `_hover`.                                                                                           |
| N4  | skip     | Changing Zag focus restoration risks breaking focus return for keyboard users. Not worth it for a cosmetic ring.                                                        |
| N5  | do       | Fixed by the same change as N3.                                                                                                                                         |
| N6  | skip     | Adds a new nav state. Prefer not adding.                                                                                                                                |
| N7  | skip     | Hover tint is a taste call, not a bug.                                                                                                                                  |
| N8  | do       | Match the desktop order and make the drawer title `srOnly`. Small, and it removes visual noise.                                                                         |
| N9  | skip     | Adds a new state to the tab bar. Prefer not adding.                                                                                                                     |
| N10 | do       | One `textStyle` change on the footer links.                                                                                                                             |
| N11 | do       | Internal links shouldn't use the external ↗ glyph. Use the set's → (or no icon).                                                                                        |
| H1  | do       | Casing fix: "Latest posts".                                                                                                                                             |
| A1  | do       | Obvious typo ("on on").                                                                                                                                                 |
| A2  | skip     | Changes the voice of the About copy. Needs Daniel.                                                                                                                      |
| A3  | skip     | Rewrites About copy. Needs Daniel.                                                                                                                                      |
| A4  | skip     | Copy formatting of the experience entries. Needs Daniel.                                                                                                                |
| A5  | skip     | Tag text is content. Needs Daniel.                                                                                                                                      |
| B1  | skip     | Needs Daniel or a look at the Notion data. Not a one-line site bug.                                                                                                     |
| B2  | do       | Set `pre` code to `0.875em`. One CSS rule.                                                                                                                              |
| B3  | do       | Contrast fix for inline code (body text colour on the grey chip, or a darker red), so it reaches ≥4.5:1 in both modes.                                                  |
| B4  | do       | A `minW` on the Copy link button.                                                                                                                                       |
| B5  | do       | Remove the "· Article" label. Removing beats adding.                                                                                                                    |
| B6  | do       | Halve the subscribe section's `mt` below `md`.                                                                                                                          |
| B7  | do       | Step Notion `h2` down one size below `md`. CSS only.                                                                                                                    |
| K1  | skip     | Munging titles at render time is a content/data concern, and the bookmark card overlaps with the image-loading session.                                                 |
| K2  | skip     | Same file as the image-loading session (bookmark card). Revisit after it lands.                                                                                         |
| C1  | do       | **#1 finding.** Round in `formatBakersPercent` (e.g. `Number(value.toFixed(2))`), in both pizza and bread.                                                              |
| C2  | do       | Grid column change only.                                                                                                                                                |
| C3  | do       | The warning gives wrong advice. Drop the Emergency clause when Emergency is selected (pizza); use "Start time is in the past. Pick a later start time." (bread).        |
| C4  | skip     | Reworking SSR/hydration of the schedule isn't a small fix. Separate task.                                                                                               |
| C5  | do       | `aria-label` template string (`About ${step.label}`, and "About baking").                                                                                               |
| C6  | modified | Restore the last valid value on blur only. Don't add a `max`; picking the upper bound is a product call.                                                                |
| C7  | do       | `whiteSpace="nowrap"` on the Baker's % header. Keep the header text.                                                                                                    |
| T1  | do       | `minW={0}` on the trigger's flex children and `truncate` on the name.                                                                                                   |
| T2  | skip     | Icon set and header redesign are out of scope.                                                                                                                          |
| T3  | modified | Hide the avatar below `md` so the title fits. Don't change the title text.                                                                                              |
| T4  | do       | `h="100%"` on the card and the neutral title colour, to match the other cards.                                                                                          |
| T5  | skip     | Link target is a product decision, and the descriptions are Airtable content.                                                                                           |
| T6  | skip     | Grid layout rework. Too big for this pass.                                                                                                                              |
| T7  | do       | Put the lightbox above the mobile nav (z-index), so the caption isn't drawn on top of it.                                                                               |
| T8  | do       | Restore focus to the triggering thumbnail (`finalFocusEl`).                                                                                                             |
| T9  | skip     | Changes the embed and the CSP. Needs Daniel.                                                                                                                            |
| T10 | do       | Darker orange (orange.700) for badge backgrounds.                                                                                                                       |
| F1  | do       | red.600 or red.700 for error text in light mode.                                                                                                                        |
| F2  | do       | Darken the primary button on hover (blue.700).                                                                                                                          |
| F3  | modified | Make the stacked Subscribe button `w="full"` below `md`. Don't reserve space for the error line.                                                                        |
| F4  | skip     | Removing it or mounting it is a product decision. Out of scope.                                                                                                         |
| G1  | modified | Set one global `focusVisibleRing` in the theme (2px blue.500, 2px offset). Apply it to the avatar link and the footer "Contact" link only. Don't touch `book-card.tsx`. |
| G2  | do       | Give `html` the same background as `body`. One CSS rule.                                                                                                                |
| G3  | skip     | `theme-toggle.tsx` is being edited by the theme-toggle sound session. Do it after that lands.                                                                           |
| G4  | do       | Wrap the footer in `<footer>`, and render the Notion root as a `div` instead of a second `<main>`.                                                                      |
| X1  | modified | Remove the "Read past newsletters" list from /newsletter and keep the preview. Don't guess Buttondown URLs.                                                             |
| X2  | skip     | Needs Daniel or a look at revalidation and Notion. Not a clear one-line site bug.                                                                                       |
| X3  | do       | `.notion-link { overflow-wrap: anywhere; }`                                                                                                                             |
| X4  | do       | Style "Return home" as the site's link.                                                                                                                                 |
| X5  | skip     | Touches metadata across several routes. Low value.                                                                                                                      |
| X6  | modified | Only change "... or see how it looks first" to "…or see how it looks first". The dates go away with X1, and the mobile alignment is covered by F3.                      |

## Implementation batches

Five batches, each with its own files. **Stay inside these files.** If a fix seems to need a file outside its batch, stop and flag it; don't edit it.

### 1. `nav`: N1, N2, N3, N5, N8, N10, G4 (footer part)

- `components/mobile-navigation.tsx`
- `components/mobile-menu-toggle.tsx`
- `components/mobile-menu-item.tsx`
- `components/mobile-menu-button.tsx`
- `components/lists-menu.tsx`, `lib/lists-menu.ts` (+ `lib/lists-menu.test.ts`)
- `components/header.tsx`
- `components/footer.tsx`

Notes: N2 is a z-index on the mobile nav only. G4 here means only wrapping the footer in `<footer>`.

### 2. `calculators`: C1, C2, C3, C5, C6 (modified), C7

- `components/route-content/pizza-page.tsx`
- `components/route-content/bread-page.tsx`
- `lib/pizza-calendar.ts`, `lib/bread-calendar.ts` (+ their tests), only if the C3 warning text lives there
- `lib/pizza-recipes.ts`, `lib/bread-recipes.ts`, read only unless C1 needs them

### 3. `content-pages`: H1, N11, A1, B2, B3, B4, B5, B6, B7, G4 (Notion `main` part), X3

- `components/route-content/home-page.tsx` (H1, N11)
- `components/route-content/about-page.tsx` (A1 only)
- `components/blog-card.tsx`, `components/blog-list-item.tsx` (B5)
- `components/author-card.tsx` (B4)
- `layouts/blog.tsx` (B6)
- `components/notion-page.tsx`, `components/notion-page-view.tsx` (G4 Notion root)
- `lib/notion/notion-renderer-styles.css`, `lib/notion/notion-custom-styles.css` (+ `notion-renderer-styles.test.ts`) (B2, B3, B7, X3)
- `components/codeblock/codeblock.tsx`, only if B2's font size is set there

### 4. `tools-photos`: T1, T3 (modified), T4, T7, T8, T10

- `components/route-content/fuse-box-page.tsx`, `lib/fuse-box.ts` (T1, T3, T10)
- `components/tool-card.tsx`, `components/route-content/tools-browser.tsx` (T4)
- `components/photo-trip-gallery.tsx`, `components/route-content/photos-page.tsx` (T7, T8)

### 5. `global-forms-misc`: F1, F2, F3 (modified), G1 (modified), G2, X1 (modified), X4, X6 (modified)

- `theme.ts` (+ `theme.test.ts`) (G1 ring, G2 `html` background, F2 if the button recipe lives here)
- `components/subscribe.tsx`, `components/subscribe-card.tsx` (F1, F2, F3)
- `components/route-content/newsletter-page.tsx` (X1, X6)
- `components/not-found-body.tsx` (X4)
- `components/avatar-navigation.tsx` (G1 avatar ring)

Note on G1: apply the ring to the footer "Contact" link through the theme's global link style if possible. If it needs an edit in `footer.tsx`, leave that to the `nav` batch or skip it, so `footer.tsx` stays in one batch.

## DO NOT implement

N4, N6, N7, N9, A2, A3, A4, A5, B1, K1, K2, C4, T2, T5, T6, T9, F4, G3, X2, X5.

Also out of bounds for every batch: book-cover and bookmark image loading (`book-card.tsx`, `bookmark-card.tsx`, `lib/book-covers.ts`, `app/api/book-cover`), the theme-toggle sound (`theme-toggle.tsx`), Notion post data, and copy changes beyond A1, H1, C3 and X6.
