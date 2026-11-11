// Browser checks for the built site. No dependencies: a tiny static server plus headless Edge/Chrome.
//
//   npm run build && npm test                     the website build (dist/, normal paths)
//   npm run build:artifact && npm run test:artifact   the artifact build (dist-artifact/, hash paths)
//
// Each check loads the site inside an exact-size frame (tests/run.html), because headless
// Chromium on Windows will not open a window narrower than about 500 px.
// Set BROWSER_BIN to use a different Chromium-based browser.
import { execFile } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const target = process.argv[2] === 'artifact' ? 'artifact' : 'website'
const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..', target === 'artifact' ? 'dist-artifact' : 'dist')
const spa = target === 'website'
const PORT = 4179

if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error(`No build at ${root}. Run "npm run build${target === 'artifact' ? ':artifact' : ''}" first.`)
  process.exit(2)
}

const BROWSER =
  process.env.BROWSER_BIN ||
  [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find((p) => fs.existsSync(p))
if (!BROWSER) {
  console.error('No Chromium-based browser found. Set BROWSER_BIN to its path.')
  process.exit(2)
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
  '.pdf': 'application/pdf', '.py': 'text/plain; charset=utf-8', '.csv': 'text/csv; charset=utf-8',
  '.wasm': 'application/wasm', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
}

// Serves the build, plus the harness files from tests/ under /__run.html, /__frame.html and /__tests/.
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  let file
  if (url === '/__run.html') file = path.join(here, 'run.html')
  else if (url === '/__frame.html') file = path.join(here, 'frame.html')
  else if (url.startsWith('/__tests/')) file = path.join(here, path.basename(url))
  else file = path.join(root, url.endsWith('/') ? url + 'index.html' : url)

  if (!file.startsWith(here) && !file.startsWith(root)) return res.writeHead(403).end()
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    // Like the real host: an unknown address without a file extension gets the app shell.
    if (spa && !path.extname(url)) file = path.join(root, 'index.html')
    else return res.writeHead(404).end('not found')
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' })
  if (req.method === 'HEAD') return res.end()
  fs.createReadStream(file).pipe(res)
})

function runInBrowser(width, height, run) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-test-'))
  const url = `http://localhost:${PORT}/__run.html?w=${width}&h=${height}&run=${run}${spa ? '&mode=path' : ''}`
  const args = [
    '--headless=new', '--disable-gpu', '--force-device-scale-factor=1', '--no-first-run',
    `--user-data-dir=${profile}`, `--window-size=${Math.max(width, 600)},${height + 200}`,
    '--virtual-time-budget=120000', '--dump-dom', url,
  ]
  return new Promise((resolve) => {
    execFile(BROWSER, args, { maxBuffer: 64 * 1024 * 1024, timeout: 240000 }, (error, stdout) => {
      fs.rmSync(profile, { recursive: true, force: true })
      const match = /<pre id="result">([\s\S]*?)<\/pre>/.exec(stdout || '')
      const text = match ? match[1].replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') : ''
      const parsed = /^RESULT (\{[\s\S]*\}) ERRORS (\[[\s\S]*\])$/.exec(text)
      if (!parsed) return resolve({ crashed: text || String(error || 'no output') })
      resolve({ result: JSON.parse(parsed[1]), errors: JSON.parse(parsed[2]) })
    })
  })
}

const BEHAVIOUR_SIZES = [[320, 568], [375, 812], [768, 1024], [1280, 800], [1920, 1080]]
const AUDIT_SIZES = [
  [320, 568], [360, 740], [375, 812], [390, 844], [430, 932], [812, 375], [768, 1024], [820, 1180],
  [1024, 768], [1280, 800], [1366, 768], [1440, 900], [1920, 1080], [2560, 1440],
]

server.listen(PORT, async () => {
  // "node tests/run.mjs website --serve" only serves the build, for looking at it by hand:
  //   http://localhost:4179/                                   the site
  //   http://localhost:4179/__frame.html?w=375&h=812&r=/resume&mode=path   one page at an exact size
  if (process.argv.includes('--serve')) {
    console.log(`Serving the ${target} build at http://localhost:${PORT}/  (Ctrl+C to stop)`)
    return
  }
  let failed = 0
  console.log(`Testing the ${target} build at ${root}\n`)

  console.log('Behaviour')
  for (const [w, h] of BEHAVIOUR_SIZES) {
    const { result, errors, crashed } = await runInBrowser(w, h, 'behaviour')
    if (crashed) { failed++; console.log(`  ${w}x${h}  CRASHED  ${crashed.slice(0, 300)}`); continue }
    const bad = result.fails.length || errors.length
    if (bad) failed++
    console.log(`  ${w}x${h}  ${result.passed}/${result.total} passed${errors.length ? `, ${errors.length} page errors` : ''}`)
    for (const [name, why] of result.fails) console.log(`      FAIL ${name}: ${why}`)
    for (const e of errors) console.log(`      ERROR ${e}`)
  }

  console.log('\nLayout (overflow, tap targets under 24px or under 40px on small screens, text under 11px)')
  for (const [w, h] of AUDIT_SIZES) {
    const { result, errors, crashed } = await runInBrowser(w, h, 'audit')
    if (crashed) { failed++; console.log(`  ${w}x${h}  CRASHED  ${crashed.slice(0, 300)}`); continue }
    const problems = Object.entries(result.problems)
    if (problems.length || errors.length) failed++
    console.log(`  ${w}x${h}  ${problems.length ? `${problems.length} pages with problems` : 'clean'}  (header ${result.navH}px, ${result.menuBtn ? 'menu' : 'full nav'})`)
    for (const [route, list] of problems) console.log(`      ${route}: ${list.join(' ;; ').slice(0, 400)}`)
    for (const e of errors) console.log(`      ERROR ${e}`)
  }

  server.close()
  console.log(failed ? `\n${failed} run(s) had failures.` : '\nAll checks passed.')
  process.exit(failed ? 1 : 0)
})
