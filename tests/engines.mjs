// Runs the behaviour test and the layout audit in WebKit (Safari's engine, including an emulated
// iPhone and iPad with touch screens) and in Firefox. The default "npm test" covers Chromium.
//
//   npx playwright install webkit      once, downloads the WebKit test browser
//   npm run build && npm run test:engines
//
// WebKit is driven with Playwright. Firefox is the one installed on this computer, driven over its
// built-in WebDriver BiDi port, because Playwright's own Firefox build is unsigned and some Windows
// security settings refuse to run it. Set FIREFOX_BIN if `firefox` is not on the PATH.
//
// WebKit here is Playwright's build of the engine, not Safari itself, and an emulated phone is
// not a real one: this catches engine differences, not every device quirk.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { devices, webkit } from 'playwright'
import { createStaticServer } from '../server.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const PORT = 4182
const BASE = `http://localhost:${PORT}`
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const server = createStaticServer({
  root: path.resolve(here, '..', 'dist'),
  spa: true,
  resolve: (url) => (url.startsWith('/__tests/') ? path.join(here, path.basename(url)) : undefined),
})
await new Promise((ok) => server.listen(PORT, ok))

// Runs inside the page: load one of the test scripts and call it.
const inPage = (script, fn) => `(async () => {
  window.__pathMode = true;
  for (let i = 0; i < 100 && !document.querySelector('.menu-btn'); i++) await new Promise((r) => setTimeout(r, 100)); // wait for the app to mount
  await new Promise((ok, no) => { const s = document.createElement('script'); s.src = '/__tests/${script}.js?' + Date.now(); s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  return await window.${fn}();
})()`

async function withWebkit(context, script, fn) {
  const browser = await webkit.launch()
  const errors = []
  try {
    const page = await (await browser.newContext(context)).newPage()
    page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 200)))
    await page.goto(BASE + '/')
    return { result: JSON.parse(await page.evaluate(inPage(script, fn))), errors }
  } finally {
    await browser.close()
  }
}

// Minimal WebDriver BiDi client for the installed Firefox.
async function withFirefox({ viewport }, script, fn) {
  const port = 9300 + Math.floor(Math.random() * 500)
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-firefox-'))
  const bin = process.env.FIREFOX_BIN || 'firefox'
  const child = spawn(`"${bin}" --headless --no-remote --remote-debugging-port=${port} --profile "${profile}" about:blank`, { shell: true, stdio: 'ignore' })
  let ws
  try {
    for (let i = 0; i < 80 && !ws; i++) {
      await sleep(500)
      ws = await new Promise((resolve) => {
        const socket = new WebSocket(`ws://127.0.0.1:${port}/session`)
        socket.onopen = () => resolve(socket)
        socket.onerror = () => resolve(null)
      })
    }
    if (!ws) throw new Error('Firefox did not open its remote-control port')
    let nextId = 0
    const pending = new Map()
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      const waiter = pending.get(msg.id)
      if (!waiter) return
      pending.delete(msg.id)
      if (msg.type === 'error') waiter.reject(new Error(`${msg.error}: ${msg.message}`))
      else waiter.resolve(msg.result)
    }
    const send = (method, params) =>
      new Promise((resolve, reject) => {
        const id = ++nextId
        pending.set(id, { resolve, reject })
        ws.send(JSON.stringify({ id, method, params }))
      })

    await send('session.new', { capabilities: {} })
    const tree = await send('browsingContext.getTree', {})
    const context = tree.contexts[0].context
    await send('browsingContext.setViewport', { context, viewport })
    await send('browsingContext.navigate', { context, url: BASE + '/', wait: 'complete' })
    const out = await send('script.evaluate', { expression: inPage(script, fn), target: { context }, awaitPromise: true, resultOwnership: 'none' })
    if (out.type !== 'success') throw new Error('script failed: ' + JSON.stringify(out.exceptionDetails?.text ?? out).slice(0, 300))
    await send('browser.close', {}).catch(() => {})
    return { result: JSON.parse(out.result.value), errors: [] }
  } finally {
    try {
      ws?.close()
    } catch {
      // already closed
    }
    child.kill()
    await sleep(800)
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 })
  }
}

const PROFILES = [
  { name: 'WebKit desktop 1280x800', run: withWebkit, context: { viewport: { width: 1280, height: 800 } } },
  { name: 'WebKit iPhone 14 (touch)', run: withWebkit, context: { ...devices['iPhone 14'] } },
  { name: 'WebKit iPad Mini (touch)', run: withWebkit, context: { ...devices['iPad Mini'] } },
  { name: 'Firefox desktop 1280x800', run: withFirefox, context: { viewport: { width: 1280, height: 800 } } },
  { name: 'Firefox narrow 375x812', run: withFirefox, context: { viewport: { width: 375, height: 812 } } },
]

const attempt = (profile, script, fn) =>
  profile.run(profile.context, script, fn).catch((e) => ({ crashed: String(e.message).split('\n')[0], errors: [] }))

let failed = 0
for (const profile of PROFILES) {
  console.log(profile.name)

  const b = await attempt(profile, 'behaviour', '__test')
  if (b.crashed) {
    failed++
    console.log(`  behaviour  CRASHED  ${b.crashed}`)
  } else {
    if (b.result.fails.length || b.errors.length) failed++
    console.log(`  behaviour  ${b.result.passed}/${b.result.total} passed (${b.result.mobile ? 'menu layout' : 'full nav'}, ${b.result.viewport.join('x')})`)
    for (const [name, why] of b.result.fails) console.log(`      FAIL ${name}: ${why}`)
  }
  for (const e of b.errors) console.log(`      page error: ${e}`)

  const a = await attempt(profile, 'audit', '__audit2')
  if (a.crashed) {
    failed++
    console.log(`  layout     CRASHED  ${a.crashed}`)
  } else {
    const problems = Object.entries(a.result.problems)
    if (problems.length || a.errors.length) failed++
    console.log(`  layout     ${problems.length ? `${problems.length} pages with problems` : 'clean'} at ${a.result.vw}x${a.result.vh}`)
    for (const [route, list] of problems) console.log(`      ${route}: ${list.join(' ;; ').slice(0, 400)}`)
  }
  for (const e of a.errors) console.log(`      page error: ${e}`)
}

server.close()
console.log(failed ? `\n${failed} run(s) had failures.` : '\nAll engine checks passed.')
process.exit(failed ? 1 : 0)
