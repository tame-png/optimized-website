# Andy Molina · applied statistics portfolio

The "Shoreline" site: marimo notebooks, an R working paper, workbooks, certificates and a resume,
in three tide themes that follow the visitor's clock. React + Vite + react-router.

This source was rebuilt in November 2026 from the published build of the redesign (the only copy
that existed), with a responsive and accessibility pass built in.

## Commands

| Command | What it does |
|---|---|
| `npm ci` | Install dependencies from the lockfile |
| `npm run dev` | Local dev server |
| `npm run build` | The website, into `dist/` (normal addresses such as `/resume`) |
| `npm run build:artifact` | A self-contained copy for a claude.ai artifact, into `dist-artifact/` (hash addresses, live notebooks left out) |
| `npm test` | Browser checks against `dist/` (run `npm run build` first) |
| `npm run test:artifact` | The same checks against `dist-artifact/` |
| `npm run lint` | ESLint |

The tests need Edge or Chrome installed; set `BROWSER_BIN` to point at another Chromium browser.
They cover behaviour (menu, tabs, Back button, filters, themes, links) at five screen sizes and
layout (overflow, tap-target size, text size) at fourteen, from 320 px to 2560 px.

## Where things live

```
src/data.js            every title, number and piece of copy
src/lib/paths.js       file paths and the website / artifact switch
src/lib/marimo.js      reads a marimo .py into cells for "Read the cells"
src/tide/              the three themes and the switcher
src/components/        header, footer, cards, figures
src/pages/             one file per page
src/styles/base.css        tokens and components
src/styles/responsive.css  phone, tablet and touch rules (loaded second, so it wins)
public/notebooks/<slug>/        <slug>.py and static.html (saved outputs)
public/notebooks/<slug>-wasm/   the live WebAssembly export and its data in public/
tests/                 the browser checks
```

## Changing the site's address

Set `VITE_SITE_URL` in `.env` (no trailing slash) and rebuild. It feeds the canonical link, the
social-preview tags and, in the artifact build, the links to the live notebooks.

## Hosting

Any static host works. Unknown addresses must fall back to `index.html`:

- **Vercel**: `vercel.json` already does this.
- **Azure Static Web Apps**: `public/staticwebapp.config.json` does this and sets cache and
  security headers. Deploy the `dist/` folder (about 147 MB, under the Free plan's 250 MB limit).

## Known gaps

- The live notebooks under `public/notebooks/*-wasm/` are the May 2026 exports; the saved outputs
  and `.py` files are from 27 October 2026. Re-export with
  `marimo export html-wasm <notebook>.py -o public/notebooks/<slug>-wasm --mode run` to bring them in step.
- `public/notebooks/*-marimo.py`, `*-static.html`, `public/notebooks/public/` and the `temp-dir*`
  folders belong to the previous site and are no longer referenced.
- The "Explainer" tab appears only when `public/builds/i94/studio/index.html` exists; it does not yet.
- The R script and Excel workbook on the R and Excel page have no `href` in `src/data.js`, so the
  page describes them without a download.
