# References

Outside work this system borrowed from, read in October 2026, and the rules taken from each. Nothing is copied; the rules are restated as Shoreline tokens and components.

## Notebook embedding (marimo, webR, Quarto)

- marimo's embedding guide gives the canonical frame: `width="100%" height="600"`, `sandbox="allow-scripts allow-same-origin allow-downloads allow-popups allow-forms"`, `allowfullscreen`, `loading="lazy"`. There is no auto-resize, so `NotebookViewer` uses a fixed height plus a Fullscreen button and never measures the frame.
- marimo's export guide: `marimo export html-wasm nb.py -o dir --mode run|edit`, `--show-code / --no-show-code`, `--single-file`, `--offline`, `--execute`; the folder must be served over HTTP with its `assets/` beside the HTML; data goes in `public/` and is read with `mo.notebook_location()`. Run mode is the locked app, edit mode the full editor: the viewer's Run / Edit tabs point at two separate exports, never one URL with a flag.
- marimo's thumbnail export (`marimo export thumbnail nb.py --execute --scale 2`) yields a 1200×630 PNG. Use it as the project card's plate image and the page's Open Graph image.
- The molab gallery's card is a thumbnail, a one-sentence description and lowercase tag chips. `ProjectCard` keeps the one sentence; tags are `Pill`s in `neutral`.
- webR needs cross-origin isolation headers for its SharedArrayBuffer channel; GitHub Pages and Vercel static cannot set them, so it runs in PostMessage mode without interrupts. A webR page's runtime pill says "R · webR · no interrupt" and the boot note warns about the ≈ 60 MB download.
- quarto-webr's cell contexts (`interactive`, `output`, `setup`, `read-only`, `autorun`) are the model for which cells a recruiter may edit: default `output`, one `interactive` cell per page.

## Certificates

- DataCamp's statement URL ends in the credential ID; Coursera, Google and University certificates print one on the PDF. `CertificateCard` shows it in `meta` and links the issuer's verification page, which is what LinkedIn's credential fields also ask for (name, issuer, URL, ID).
- Coursera's course pages list "Skills you'll gain" as chips. Each certificate carries 2–5 skill `Pill`s so the certificates section reads as a skills matrix, not a trophy case.
- A list beats a gallery when there are fewer than six: issuer as text (no logos, avoids trademark use), title, date, ID, Verify ↗, PDF in a disclosure. The grid is for six or more.

## Excel and R work

- Excel project write-ups that work on GitHub use one table (Project · Description · Key skills) and a per-project Objective → Approach → Result trio with a number in each. `FileArtifact`'s "What to look at" sentence is the shortest form of that trio.
- R visualisation galleries (rbind.io sites) label each card "Made with R in 2024" with a Source link and filter by year and software. `FilterBar` filters by runtime and year for the same reason.
- Quarto listings (`type: grid`, three columns, categories, image placeholder) are the layout the certificates and index of works follow.

## Coastal editorial design

- "Tidewater" (Kombai gallery): slate ground, cream paper, brass accent, serif display with a mono italic eyebrow for coordinates, zero radius, hairline rules. Shoreline's `radius-0`, `rule` hairlines and the coordinate line in a `Plate` header come from here; CSULB's print gold (Pantone 124C, #eba91b) is already `gold-deep`.
- "Blue Tides" (Kombai gallery): sand surface and italic species names in the display face. The italic `accent` word inside a heading follows this.
- NOAA tide predictions: a plain data table with Plot / Calendar / Data-only toggles and CSV downloads. The notebook viewer's Static HTML and the file artifact's CSV preview are its "Data only" view.
- Nautical-chart hotel sites use the chart as a background and ship vocabulary in navigation. Shoreline keeps one bathymetric plate on the hero and the tide names on the theme switcher, and nothing nautical in the nav labels.
