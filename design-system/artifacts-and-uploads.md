# Artifacts and uploads

What the site publishes, where each file lives in the repository, which component shows it and how it is named. The inventory comes from the repository's `public/notebooks/` and the draft's index of works; the Leicester course certificates are expected but were not in the sources, so their fields are set from the common MOOC certificate formats.

## Folder plan

```
public/
  notebooks/<slug>/            marimo export html-wasm output (index.html + assets/)
  notebooks/<slug>.py          the marimo source, downloadable
  notebooks/<slug>-static.html marimo export html (no runtime) fallback
  r/<slug>/                    R scripts, .Rmd or Quarto, rendered HTML
  workbooks/<slug>.xlsx        Excel workbooks (+ <slug>.csv extracts)
  data/<name>.csv              datasets referenced by notebooks (≤ 25 MB each)
  certificates/<issuer>-<slug>.pdf  and  .png  (first page, 1200px wide)
  posters/<slug>.pdf           symposium posters
```

Slugs are lowercase, hyphenated, no dates (`i94-traffic`, `ebay-kleinanzeigen`, `apps-profitability`, `lbrhe-pums`). A file's display title lives in `src/data.js`, never in the filename.

## Marimo notebooks (Python)

- Export with `marimo export html-wasm notebook.py -o public/notebooks/<slug> --mode run` for the recruiter view and `--mode edit` for the "open the code" view; the repository already holds `apps-wasm`, `ebay-wasm`, `i94-wasm` built this way. The export is a static folder; host it as is, do not rename its `assets/`.
- Show it with `NotebookViewer`: title, a `Pill` reading "marimo · WASM", the run / edit toggle, fullscreen, "Download .py", "Static HTML" (the `-static.html` fallback for phones and slow connections) and the dataset list. The frame is an `<iframe>` with `sandbox="allow-scripts allow-same-origin"`, height 70vh, min 560px.
- Note the cold boot: Pyodide takes 10–20 s on first load. The viewer prints that line in `meta` until the frame fires `load`.
- Each notebook's first markdown cell is its abstract; the project card's blurb is a two-sentence cut of it.

## R work

- R scripts and Quarto documents live under `public/r/<slug>/`. Render Quarto to HTML (`quarto render --to html --embed-resources`) and show it in `NotebookViewer` with a "R · Quarto" pill; a plain `.R` script is shown with `FileArtifact` (kind "r") and a `CodeDrawer` holding its first 60 lines.
- webR (R in the browser) is optional and heavy (≈ 60 MB); use it only for a page whose point is live R, with the same boot note as marimo.
- The LBRHE page's PUMS pipeline is the model: a `CodeDrawer` labelled with the engine ("R 4.4 · tidycensus / dplyr") above the figures it produced.

## Excel and spreadsheet work

- Workbooks go in `public/workbooks/` as `.xlsx` plus a CSV of the sheet that matters. Show them with `FileArtifact` (kind "xlsx"): filename, size, sheet list, "what to look at" (a sentence naming the sheet, the pivot or the formula), and two buttons: "Download .xlsx" and "Preview CSV" (a `<table>` of the first 25 rows rendered in `meta`).
- Never embed a third-party spreadsheet viewer; a screenshot of the key sheet in a `Plate` is the preview.

## Datasets

- CSVs referenced by notebooks sit in `public/data/` and are listed on the viewer's toolbar as "Data: googleplaystore.csv · AppleStore.csv". Each gets a `FileArtifact` (kind "csv") with row count, columns and source line in `caption`.

## Certificates

- Each certificate is one `CertificateCard`: issuer, course title, completion date, credential ID in `meta`, a "Verify ↗" link to the issuer's verification URL, the first page as a PNG thumbnail in a `Plate`, and the PDF as "Download PDF". Skills tags are `Pill`s.
- The issuer field is the awarding body as printed ("University of Leicester via Coursera", "DataCamp", "Google"). Expected uploads: University of Leicester course certificates (statistics / data science MOOC modules, as PDF with a verification URL), vendor certificates (AWS, Google, DataCamp, Coursera specialisations) and CSULB symposium participation (the LBRHE poster #28).
- Three states: `verified` (a verification link exists, "Verified ✓" in `kelp`), `issued` (PDF only, no link; "Issued" in `ink-muted`), `in-progress` (no file yet; dashed `rule` border, expected date). A certificate without a credential ID or a verify link never claims "Verified".
- The certificates section sits between the index of works and the skills strip on Home, three columns, newest first, filterable by issuer with `FilterBar`. The resume's Education section links to it ("Certificates →").

## Posters and papers

- The symposium poster (PDF) is shown with `FileArtifact` (kind "pdf") inside the LBRHE page's deliverables grid, with its first page as a `Plate` thumbnail at 600px wide.

## Resume

- The broadsheet resume is a page of this system (masthead, 200px marginalia column, roman section heads) and prints to one page; the "Print broadsheet (PDF)" button is a `Button` variant "outline". Keep a flat PDF copy at `public/resume.pdf` for the resume link itself.
