// Checks that each live notebook really runs: opens the notebook page, switches to "Run live",
// and waits in real time for Python (Pyodide) to boot and the last section of the notebook to render.
//
//   npm run build && npm run test:live
//
// Needs the internet (Pyodide and its packages come from a CDN) and takes one to three minutes.
// Uses Playwright with the installed Edge or Chrome, so no browser download is needed for this one.
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { createStaticServer } from '../server.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const PORT = 4181
const TIMEOUT = 300_000

// A heading near the top and one from the last section: seeing the last one means every cell ran.
const NOTEBOOKS = [
  { slug: 'i94', first: 'Indicators of Heavy Traffic on I-94', last: 'Time Indicators', minImages: 4 },
  { slug: 'apps', first: 'Profitable App Profiles', last: 'Takeaways', minImages: 0 },
  { slug: 'ebay', first: 'Analyzing Used Car Listings', last: 'Exploring the milleage', minImages: 0 },
]

const server = createStaticServer({ root: path.resolve(here, '..', 'dist'), spa: true })
await new Promise((ok) => server.listen(PORT, ok))

let browser
for (const channel of ['msedge', 'chrome']) {
  try {
    browser = await chromium.launch({ channel })
    break
  } catch {
    // try the next installed browser
  }
}
if (!browser) {
  console.error('Neither Edge nor Chrome could be started.')
  process.exit(2)
}

let failed = 0
for (const nb of NOTEBOOKS) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 200)))
  const started = Date.now()
  try {
    await page.goto(`http://localhost:${PORT}/notebooks/${nb.slug}`)
    await page.click('#tab-live')
    // Poll the notebook frame itself: visibility checks are unreliable because marimo repeats
    // every heading in a (sometimes hidden) outline.
    const read = async () => {
      const frame = page.frames().find((f) => f.url().includes('-wasm/index.html'))
      if (!frame) return null
      return frame.evaluate(() => ({
        text: document.body.innerText,
        images: document.querySelectorAll('img[src^="data:image"]').length,
        tables: document.querySelectorAll('table').length,
        tracebacks: document.body.innerText.split('Traceback (most recent call last)').length - 1,
        errors: [...document.querySelectorAll('.marimo-error, .alert-destructive')].map((el) => el.innerText.slice(0, 160)),
      })).catch(() => null)
    }
    let stats = null
    let booted = null
    while (Date.now() - started < TIMEOUT) {
      stats = await read()
      if (stats?.text.includes(nb.first) && booted === null) booted = ((Date.now() - started) / 1000).toFixed(0)
      if (stats?.text.includes(nb.first) && stats.text.includes(nb.last) && stats.images >= nb.minImages) break
      await page.waitForTimeout(1000)
    }
    if (!stats?.text.includes(nb.last)) throw new Error(`timed out; ${stats ? stats.text.length + ' characters on screen' : 'notebook frame never appeared'}`)
    await page.waitForTimeout(3000) // let late outputs settle, then take the final reading
    stats = (await read()) ?? stats
    stats.text = stats.text.length
    const total = ((Date.now() - started) / 1000).toFixed(0)
    const ok = stats.tracebacks === 0 && stats.errors.length === 0 && stats.images >= nb.minImages
    if (!ok) failed++
    console.log(
      `${ok ? 'PASS' : 'FAIL'}  ${nb.slug}: first output after ${booted}s, last section after ${total}s; ` +
        `${stats.images} images, ${stats.tables} tables, ${stats.text} characters, ${stats.tracebacks} tracebacks`,
    )
    for (const e of stats.errors) console.log(`      notebook error: ${e}`)
  } catch (e) {
    failed++
    console.log(`FAIL  ${nb.slug}: ${String(e.message).split('\n')[0]}`)
  }
  for (const e of errors) console.log(`      page error: ${e}`)
  await page.close()
}

await browser.close()
server.close()
console.log(failed ? `\n${failed} notebook(s) did not finish cleanly.` : '\nAll three notebooks ran to the end.')
process.exit(failed ? 1 : 0)
