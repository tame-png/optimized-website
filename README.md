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
| `npm run serve` | Serve `dist/` at http://localhost:8080 with the built-in server (`server.mjs`, no dependencies) |
| `npm test` | Browser checks against `dist/` in Edge or Chrome (run `npm run build` first) |
| `npm run test:artifact` | The same checks against `dist-artifact/` |
| `npm run test:engines` | The same checks in WebKit (desktop, emulated iPhone and iPad) and in the installed Firefox |
| `npm run test:live` | Opens each live notebook and waits for Python to run it to the end (needs the internet) |
| `npm run lint` | ESLint |

`npm test` needs Edge or Chrome installed; set `BROWSER_BIN` to point at another Chromium browser.
The checks cover behaviour (menu, tabs, Back button, filters, themes, links) at five screen sizes
and layout (overflow, tap-target size, text size) at fourteen, from 320 px to 2560 px.
`test:engines` and `test:live` use Playwright (a dev dependency); run `npx playwright install webkit` once.

## Where things live

```
src/data.js            every title, number and piece of copy
src/lib/paths.js       file paths and the website / artifact switch
src/lib/marimo.js      reads a marimo .py into cells for "Read the cells"
src/tide/              the three themes and the switcher
src/components/        header, footer, cards, figures
src/pages/             one file per page
src/styles/fonts.css       the three typefaces, served from the site itself
src/styles/base.css        tokens and components
src/styles/responsive.css  phone, tablet and touch rules (loaded last, so it wins)
public/notebooks/<slug>/        <slug>.py and static.html (saved outputs)
public/notebooks/<slug>-wasm/   the live WebAssembly export and its data in public/
server.mjs             small static server for running the build anywhere Node runs
tests/                 the browser checks
```

## Changing the site's address

Set `VITE_SITE_URL` in `.env` (no trailing slash) and rebuild. It feeds the canonical link, the
social-preview tags and, in the artifact build, the links to the live notebooks.

## Running it

The build is plain static files. Nothing runs on the server, so a static host needs no database
and no application process.

- **On your own machine**: `npm run build && npm run serve`, then open http://localhost:8080.
  Everything except the notebooks works with no internet connection: fonts, styles and scripts
  are all in the build. The notebook views (saved outputs and live) load marimo and Pyodide from a CDN.
- **On a static host** (Azure Static Web Apps, Vercel, nginx, Caddy): upload `dist/`. Unknown
  addresses must fall back to `index.html`. `vercel.json` and `public/staticwebapp.config.json`
  already do this and set long-lived caching for `/assets/`.
- **On a VM or container with Node**: copy `dist/` and `server.mjs`, then run `node server.mjs`
  (set `PORT` to change the port). It compresses text with Brotli or gzip, sends cache headers
  and ETags, and was measured at about 65 MB of memory idle and 70 MB after 1,400 requests.

## What it costs to serve

Measured on the November 2026 build with compression on:

| | Size |
|---|---|
| `dist/` in total | 106 MB |
| of which the three live notebooks | 98 MB |
| of which PDFs | 9 MB |
| everything else (pages, scripts, styles, fonts, saved outputs) | under 2 MB |
| First visit to the home page | about 310 KB in 12 requests: fonts 220, scripts 79, styles 7, page 2 |
| Requests to third-party servers, on any page except a notebook | none |

Later pages in the same visit reuse the cached scripts and fonts and add 1 to 4 KB each.
The fonts are the largest part of a first visit. They are served from the site so that it works
offline and opens no third-party connection; the price is that the host carries those 220 KB itself.

## Known gaps

- The apps notebook reports its results with `print()`. marimo does not show printed output in
  its app view, so its "Run live" tab shows the prose only; the "Saved outputs" tab has the numbers.
  Returning the values from the cells, or exporting that notebook with `--mode edit`, would fix it.
- The live notebooks are marimo 0.25.2 exports made with
  `marimo export html-wasm <slug>.py -o public/notebooks/<slug>-wasm --mode run`, each next to a
  `public/` folder holding only the CSV it reads. Re-run that after editing a notebook.
- The `temp-dir*` folders at the top of the repository belong to the previous site. They are not
  used or deployed.
- The "Explainer" tab appears only when `public/builds/i94/studio/index.html` exists; it does not yet.
- The R script and Excel workbook on the R and Excel page have no `href` in `src/data.js`, so the
  page describes them without a download.
- `paper/lbrhe-presentation.pdf` is 8 MB of lossless images in three slides; lossless recompression
  saves about 1%. Re-exporting the slides with compressed images would cut it to a few MB.
