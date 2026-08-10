# NoteWorthy — marketing site

React + Vite + Tailwind v4, with a Remotion composition played inline for the
hero animation.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the built site
```

## Remotion, and what it is doing here

Remotion renders React to video. It is not a website framework, so the site
itself is plain React; Remotion appears through `@remotion/player`, which plays
`src/remotion/HeroComposition.tsx` in the browser as the hero.

That composition is drawn entirely in code — no images, no web fonts — so it
starts instantly and cannot show a half-loaded frame. On a page whose whole
claim is "no network", that felt worth the constraint.

If you ever want it as an actual video (an App Store preview, a social clip),
the composition is already in the right shape: add `@remotion/cli`, register it
in a `Root.tsx`, and `npx remotion render`.

## Theming

Two independent axes, both written to `<html>` and read by CSS:

- **`data-accent`** — one of the app's six note tints. Picked at **random on
  every load**, changeable from the swatches under the hero. Not persisted; the
  surprise is the point.
- **`data-scheme`** — `light` or `dark`. "System" is resolved in JS and written
  as a concrete value, so the CSS never reasons about a third state. This one
  *is* persisted, because a display mode that forgets itself is annoying.

Colours come verbatim from `NoteTint.swift`, including the separate
`accentInk` / `darkAccentInk` pair. That pair is not a shade of the swatch —
the app authors nudged each hue until it cleared 5.3:1 as text, because the
swatch value fails AA at body size. Reusing the swatch for text would quietly
undo that work, so `--accent` (fills, dots) and `--accent-ink` (text) are
separate tokens.

One trap worth remembering: **React runs child effects before parent effects.**
The provider originally set `data-accent` in a `useEffect`, so the hero — which
reads the resolved variables with `getComputedStyle` — saw the *previous*
theme and stayed butter while the rest of the page turned. The attributes are
now set during render, which is idempotent and safe on `<html>`.

## URL overrides

- `?scheme=light|dark` and `?accent=butter|sky|blossom|mint|lavender|graphite`
  pin a look — for sharing a particular one, and the only way to screenshot a
  specific combination when the default is random.
- `?frame=300` picks the hero's opening frame.

## `?static=1`

Freezes the hero on one frame and shows the player controls. Added because a
looping player never lets a headless browser's virtual clock settle, so the
page could not be screenshotted to check the layout. It doubles as an escape
hatch for anyone who wants the page to hold still. `prefers-reduced-motion` is
honoured separately and does the same thing automatically.

## Assets

- `public/shots/` — App Store screenshots, iPhone (1320×2868) and iPad
  (2064×2752), light and dark. Generated from the app by
  `Tools/capture_app_store_shots.sh` in the NoteWorthy repo.
- `public/icons/` — from the app icon set. `mark.svg` is the gradient-amber
  `stackai` mark, the same artwork as the app icon.

Copy fresh screenshots in and the page picks them up; filenames are listed in
`src/site/data.ts`.

## Layout notes

Two things that cost time and are easy to trip over again:

- **The Player needs a sized box.** `height: auto` gave it nothing to measure
  and it collapsed to an empty band. The wrapper owns an `aspect-video` box and
  the Player fills it.
- **Chrome's headless CLI cannot render below ~485px wide** — it clamps the
  window and then crops the screenshot, which looks exactly like a broken
  responsive layout. It is not. Verify with `document.documentElement.scrollWidth`
  against `clientWidth` rather than by eye, or use real device emulation over
  CDP.

## Deploying

`base: "./"` in `vite.config.ts`, so `dist/` works from any host or
subdirectory — Netlify, Vercel, GitHub Pages, or a plain static bucket — with
no rebuild.
