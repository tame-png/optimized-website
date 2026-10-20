# Shoreline Portfolio design system (repository copy)

The living version is the Design System artifact (https://claude.ai/artifact/TuG6YUVL6mNzMdqcBv6cAH); this folder is a copy of its source files so the Vite site can consume them.

- `tokens.json` — the tokens (three tides: low-tide, golden-hour, high-tide). `tokens.css` is generated from it: `:root, [data-theme="low-tide"]` plus a block per tide, then spacing, radius, border, font families and one class per type style.
- `components/bundle.css`, `components/bundle.js` — the React 18 component bundle (`window.Shoreline`) used by the design-system previews; `index.d.ts` documents the props. The site runs React 19, so port components into `src/` as JSX rather than loading the bundle.
- `README.md` — the brand book; `artifacts-and-uploads.md` — what the site publishes (marimo exports, R, Excel, CSV, certificates) and where; `references.md` — outside work consulted.
- `assets/Marks/` — the three inline marks.

To use the tokens in the site: import `design-system/tokens.css` from `src/main.jsx`, set `data-theme` on `<html>` from the tide switcher, and replace the `THEME` hex object in `src/data.js` with `var(--…)` references.
