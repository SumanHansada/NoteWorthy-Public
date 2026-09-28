# NoteWorthy marketing site

React + Vite + Tailwind v4. The hero is the 90-second "Everywhere" film
(iPhone, iPad, Mac), looping muted from `public/video/`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the built site
```

## The hero film

`public/video/everywhere-1080.mp4` is a muted 1080p/30 cut of
`video/library/renders/noteworthy-everywhere-v10-plain-16x9-4k.mp4` from the
NoteWorthy repo, about 4 MB. The poster is its frame at 1:20, the one with all
three devices on screen (the film opens on a blank gradient). To re-cut:

```bash
ffmpeg -i noteworthy-everywhere-v10-plain-16x9-4k.mp4 -an \
  -vf "scale=1920:1080:flags=lanczos,fps=30" -c:v libx264 -profile:v high \
  -pix_fmt yuv420p -preset slow -crf 30 -movflags faststart everywhere-1080.mp4
```

Phones (below 640px) get `everywhere-720x1280.mp4` instead, the same edit cut
from `noteworthy-everywhere-v10-plain-9x16-4k.mp4` at 720x1280 (CRF 29, about
3 MB), capped at 75% of the screen's height. Its "Watch with sound" opens the
vertical upload, a Short, rather than the wide video.

It is served from this site rather than embedded from YouTube so that the page
calls nobody until the reader asks. "Watch with sound" swaps in the
youtube-nocookie player at the loop's current time.

`src/remotion/HeroComposition.tsx` is the code-drawn note card that was the
hero before the Mac shipped. It is no longer on the page; it is kept because it
is already in the shape to render as a clip (`@remotion/cli`, a `Root.tsx`,
`npx remotion render`).

## Theming

Two independent axes, both written to `<html>` and read by CSS:

- **`data-accent`**: one of the app's six note tints. Picked at **random on
  every load**, changeable from the swatches under the hero. Not persisted; the
  surprise is the point.
- **`data-scheme`**: `light` or `dark`. "System" is resolved in JS and written
  as a concrete value, so the CSS never reasons about a third state. This one
  *is* persisted, because a display mode that forgets itself is annoying.

Colours come verbatim from `NoteTint.swift`, including the separate
`accentInk` / `darkAccentInk` pair. That pair is not a shade of the swatch;
the app authors nudged each hue until it cleared 5.3:1 as text, because the
swatch value fails AA at body size. Reusing the swatch for text would quietly
undo that work, so `--accent` (fills, dots) and `--accent-ink` (text) are
separate tokens.

One trap worth remembering: **React runs child effects before parent effects.**
The provider originally set `data-accent` in a `useEffect`, so the hero, which
reads the resolved variables with `getComputedStyle`, saw the *previous*
theme and stayed butter while the rest of the page turned. The attributes are
now set during render, which is idempotent and safe on `<html>`.

## URL overrides

- `?scheme=light|dark` and `?accent=butter|sky|blossom|mint|lavender|graphite`
  pin a look for sharing a particular one, and the only way to screenshot a
  specific combination when the default is random.

## `?static=1`

Holds the hero film on its poster and shows the video controls. Added because a
looping video never lets a headless browser's virtual clock settle, so the
page could not be screenshotted to check the layout. It doubles as an escape
hatch for anyone who wants the page to hold still. `prefers-reduced-motion` is
honoured separately and does the same thing automatically.

## Assets

- `public/shots/`: App Store screenshots, iPhone (1320×2868) and iPad
  (2064×2752), light and dark. Generated from the app by
  `Tools/capture_app_store_shots.sh` in the NoteWorthy repo.
- `public/shots/mac/`: the Mac Tasks board, light and dark, 2160 wide WebP,
  from `video/library/media/stills-{light,dark}/mac.png` in the NoteWorthy repo.
  It sits in `public/mockups/macbook-{silver,midnight}.png` (silver in light,
  midnight in dark), whose screen hole is exactly the capture's 2880x1864.
- `public/icons/`: from the app icon set. `mark.svg` is the gradient-amber
  `stackai` mark, the same artwork as the app icon.

Copy fresh screenshots in and the page picks them up; filenames are listed in
`src/site/data.ts`.

## Layout notes

Two things that cost time and are easy to trip over again:

- **The Player needs a sized box.** `height: auto` gave it nothing to measure
  and it collapsed to an empty band. The wrapper owns an `aspect-video` box and
  the Player fills it.
- **Chrome's headless CLI cannot render below ~485px wide**. It clamps the
  window and then crops the screenshot, which looks exactly like a broken
  responsive layout. It is not. Verify with `document.documentElement.scrollWidth`
  against `clientWidth` rather than by eye, or use real device emulation over
  CDP.

## Deploying

`base: "./"` in `vite.config.ts`, so `dist/` works from any host or
subdirectory, including Netlify, Vercel, GitHub Pages, or a plain static bucket, with
no rebuild.
