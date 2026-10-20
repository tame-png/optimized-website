Shoreline is the design system for Andy Molina's applied-statistics portfolio: a Long Beach State ("The Beach") editorial site that hosts marimo notebooks, R pipelines, Excel workbooks and certificates for recruiters to open from a resume. It grows out of the repository `tame-png/optimized-website` (React + Vite + react-router, pages Home, Notebooks, NotebookViewer, Resume, LBRHE) and the uploaded first draft "Pacific Editorial" (three tide themes, broadsheet resume, figure plates). Build every new page from the tokens and components here; the draft's inline styles are the source, this system is the rule.

## Voice and content

- Write like a working paper, not a landing page. Figures are numbered ("FIG. 01", "Working Paper № I"), sections take roman numerals in `numeral`, and claims carry a number: "48,204 rows", "20 pytest tests", "11.4% gap". Quote real outputs; never a placeholder statistic.
- The reader is a recruiter with twenty seconds, then a hiring manager with twenty minutes. Every project card answers in `body-sm` what was done, with what, and what came out, and its `label` eyebrow names the tool chain ("R · tidycensus · Tableau"). The deep page carries the method.
- First person is allowed in the hero and postcard ("Greetings from The Beach"); everywhere else the subject is the work ("Volume on the westbound I-94 averages…").
- Sentence case for prose and titles. Uppercase lives only in the mono `label` style: eyebrows, nav links, plate headers, pills.
- No emoji. Status is a word plus a mark: "Verified ✓" in `kelp`, "In progress" in `ink-muted`, never a colour alone.
- Beach references are typographic and cartographic, not pictorial: tide names for themes, a bathymetric plate, a postcard footer, "Go Beach" in the ticker. No stock photos of sand, no surfboards.

## Colour

Three tides, chosen with the TideSwitcher and stored on `html[data-theme]`: `low-tide` (daylight paper, Pacific blue accent, the default), `golden-hour` (sunset vellum, terracotta accent) and `high-tide` (night shore, CSULB gold accent). Every token below has a value in each tide; never hard-code a hex in a page.

- Grounds: `surface` for the page, `surface-raised` for panels, cards and the ticker, `surface-plate` for figure plates and the notebook frame. A plate always sits on a card, a card on the page; never two of the same tone touching without a `rule`.
- Text: `ink` for copy and headings, `ink-muted` for captions, labels and secondary copy. Both pass 4.5:1 on every ground in every tide; keep mono labels at 11px or larger.
- The accent: `accent` is the single hue of a tide. Spend it on links, the active tab, eyebrows, figure numerals, KPI numbers and the primary button (`on-accent` text on it). `accent-soft` is its 14% wash behind pills.
- CSULB gold: `gold` is the same #ffc72a in every tide. It is a fill and a mark (the ticker dot, the flagship card's 4px left edge, the stamp, the highlighted bar) with `on-gold` text on it. It fails as text on every light ground, so it never is.
- Charts: `accent` for the primary series, `gold-deep` for the second, `signal` for the thing that went wrong (uninsured, a loss, a harvest), `kelp` for the thing that went right, `sea-tint` for area fills at 20–40% opacity. A series that must be told apart from another differs in lightness, never hue alone.
- Terracotta as text uses `signal-text`, which is dark enough at low tide; `signal` itself is a mark colour.
- Borders: `rule` for every hairline, `rule-strong` where the line is structure (masthead, section heads, nav). Cards are bordered, never shadowed, except a figure plate and the notebook frame, which take `shadow-card`.
- Focus: a 2px solid `focus` ring with 2px offset on every button, link, tab and the viewer frame. Hover never removes a border, it changes it to `accent`.

## Type

Spectral for display, EB Garamond for text, JetBrains Mono for labels, meta and code. All three load from Google Fonts (the fonts list has no files); the site's `index.html` links them with `display=swap`.

- Set the hero name in `display-xl`, a view title in `display-lg`, a section in `heading-2`, a card in `heading-3`. Headings are weight 400–500; the system never uses bold display type.
- Body copy is `body` at 18px with a `measure` of 42em; the hero's standfirst is `body-lg`; card blurbs, bullets and modal copy are `body-sm`. Captions are `caption`, italic, in `ink-muted`.
- Mono is for machine facts: `label` (uppercase, 0.12em tracking) for eyebrows, nav and pills; `meta` for filenames, credential IDs, dates and row counts; `code` for drawers. Mixed case for `meta`, never for `label`.
- Italic `accent` inside a display heading marks the one word that matters ("Andy *Molina*", "Working *Paper*"). One italic word per heading.
- Numbers in prose take a thin space before a unit and old-style tabular figures are not required; in KPI cells and stat tiles the number is `kpi` in `accent` over a `label` caption.

## Spacing, radius, layout

- The page is `page-max` (1160px) wide with a `space-6` gutter on desktop and `space-4` on phones; the resume broadsheet is 1040px. No horizontal scroll at 360px.
- Grids: hero 5fr / 7fr, figure section 4fr / 8fr, index of works 2 columns with the flagship spanning both, certificates 3 columns, skills 3 columns. All collapse to one column under 900px; the KPI strip goes from 4 to 2 columns under 640px.
- Everything is square (`radius-0`). Pills and badges take `radius-xs`; the tide switcher's frame and the search field `radius-sm`; dots `radius-pill`. No rounded cards.
- Vertical rhythm is `space-6` between cards, `space-12` between sections, a WaveDivider where a section changes subject.
- Sticky nav: `surface` at 92% with an 8px backdrop blur, `line-strong` bottom border in `rule-strong`.

## Motion and states

- Transitions are 0.2s on colour and border, 0.22s on a card's 3px lift; the tide change wipes a `accent` → `sea-tint` → `gold` stinger up the screen in 0.55s. Nothing loops, nothing parallaxes.
- A hovered card lifts 3px, swaps its border to `accent` and gains `shadow-card`. A hovered link gains an `accent` underline. A pressed button goes to `accent` fill with `on-accent` text.
- Loading: the notebook viewer shows its toolbar immediately and a `surface-plate` frame with the mono line "Booting marimo (WASM) · first load ≈ 10–20 s"; never a spinner alone.
- Print: `@media print` hides the ticker, nav, postcard and tide switcher, sets `surface` to white and `ink` to black, and strips the broadsheet's border. The resume is designed to print to one page.

## Iconography

There is no icon font. Marks are inline SVG from `assets/Marks` (the pyramid stamp, the wave divider, the bathymetry plate) and Unicode glyphs in the mono face: ↗ external, ⤓ download, ⛶ fullscreen, § section, № number, · separator, ✓ verified. File-type badges are typeset abbreviations in a Pill ("PY", "R", "XLSX", "CSV", "PDF", "HTML"), not icons. The repository's `favicon.svg` and `hero.png` are Vite template leftovers and are not brand assets; replace the favicon with `assets/Marks/pyramid-stamp.svg`.

## Logo

There is no logo file in the sources. The wordmark is "A. Molina" set in `display` at 22px, weight 600, letter-spacing −0.02em, beside a `gold` Pill reading "The Beach". Do not draw a CSULB mark; the university's own logo is not ours to reproduce.

## What goes where

- `components/` holds the React bundle (`window.Shoreline`), one README and live preview per component: Nav, TideSwitcher, Button, Pill, SectionHead, KpiStrip, Plate, ProjectCard, FilterBar, NotebookViewer, FileArtifact, CertificateCard, CodeDrawer, WaveDivider, PostcardFooter.
- The further section "Artifacts and uploads" lists every kind of file the site publishes (marimo WASM exports, static HTML, R scripts, Excel workbooks, CSV data, certificates) with its folder, its component and its naming rule.
- The section "References" records the outside portfolios and docs this system borrowed from and the three design rules taken from each.

## Not synced

From the repository: the chart helpers in `src/pages/lbrhe-charts.jsx` (HBar, Lollipop, Donut, PairBars, Stat, PumaMap) and `src/components/Components.jsx` (MiniFigure, hero chart) were read for their colour and spacing rules but not bundled; they stay React source in the site and should take their colours from `tokens.css` instead of the `THEME` object in `src/data.js`. The draft's font switcher (Spectral / Garamond / Cormorant) was dropped: one display face.
