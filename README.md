# Thrive 360 — site project

Design lives in `src/`. Content lives in `content/site.json`. They never mix.
That separation is the whole point: content can be edited safely without touching the layout.

## Layout

```
src/
  style.css      the design (colours, type, spacing) — do not edit unless you want a redesign
  index.njk      the page structure with {{ placeholders }}
  scorecard.html static page, copied through unchanged
content/
  site.json      every word and image on the page
assets/          images
.pages.yml       describes the editing form (Pages CMS)
build.mjs        renders src + content -> dist/
dist/            build output; this is what gets deployed
```

## Build

```bash
npm install     # once
npm run build   # renders dist/index.html
```

## Edit content

Change a value in `content/site.json`, run `npm run build`, reload the page.
Nothing else moves. The design cannot break because the design isn't in that file.

## Deploy

Currently Surge (`thrive-movement.surge.sh`). Once on GitHub + Cloudflare Pages,
every commit to `content/site.json` rebuilds and redeploys automatically.

## Editing with Pages CMS

`.pages.yml` defines the form Raj sees at pagescms.org — labelled fields for each
headline, paragraph, card, image and link. Image fields upload straight into `assets/`.
