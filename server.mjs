// A small static server for the built site. No dependencies.
//
//   npm run build && npm run serve          http://localhost:8080
//   PORT=3000 node server.mjs               another port
//   node server.mjs dist-artifact           another folder (no address fallback)
//
// Any static host does the same job (Azure Static Web Apps, Vercel, nginx, Caddy); this is for
// running the site on your own machine or on a plain VM or container with only Node installed.
// Measured on Node 26: about 65 MB of memory idle, 70 MB after 1,400 requests, and no CPU while idle.
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
  '.pdf': 'application/pdf', '.py': 'text/plain; charset=utf-8', '.csv': 'text/csv; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.wasm': 'application/wasm', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.map': 'application/json; charset=utf-8', '.whl': 'application/octet-stream', '.zip': 'application/zip',
}
// Text formats shrink 3 to 5 times; fonts, images, PDFs and wasm archives are already compressed.
const COMPRESSIBLE = new Set(['.html', '.js', '.mjs', '.css', '.json', '.svg', '.py', '.csv', '.txt', '.map', '.webmanifest'])
const MAX_COMPRESS_BYTES = 4 * 1024 * 1024

function cacheControl(urlPath, ext) {
  if (ext === '.html') return 'no-cache' // always revalidate pages
  if (/^\/assets\/|\/assets\//.test(urlPath)) return 'public, max-age=31536000, immutable' // hashed file names
  return 'public, max-age=3600'
}

/**
 * @param {object} options
 * @param {string} options.root      folder to serve
 * @param {boolean} [options.spa]    answer unknown extension-less addresses with index.html
 * @param {(urlPath: string) => string | undefined} [options.resolve]  optional override: return a file path for a URL
 */
export function createStaticServer({ root, spa = true, resolve }) {
  const base = path.resolve(root)
  const compressed = new Map() // file path -> { mtimeMs, br, gzip }

  function encode(file, stat, accepts) {
    const ext = path.extname(file).toLowerCase()
    if (!COMPRESSIBLE.has(ext) || stat.size > MAX_COMPRESS_BYTES || stat.size < 512) return null
    const kind = /\bbr\b/.test(accepts) ? 'br' : /\bgzip\b/.test(accepts) ? 'gzip' : null
    if (!kind) return null
    let entry = compressed.get(file)
    if (!entry || entry.mtimeMs !== stat.mtimeMs) {
      entry = { mtimeMs: stat.mtimeMs }
      compressed.set(file, entry)
    }
    if (!entry[kind]) {
      const raw = fs.readFileSync(file)
      entry[kind] = kind === 'br'
        ? zlib.brotliCompressSync(raw, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 9 } })
        : zlib.gzipSync(raw, { level: 9 })
    }
    return { kind, body: entry[kind] }
  }

  return http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return res.writeHead(405, { allow: 'GET, HEAD' }).end()
    let urlPath
    try {
      urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    } catch {
      return res.writeHead(400).end()
    }

    let file = resolve?.(urlPath)
    if (!file) {
      file = path.join(base, urlPath)
      if (file !== base && !file.startsWith(base + path.sep)) return res.writeHead(403).end() // no escaping the folder
    }
    let stat = fs.existsSync(file) ? fs.statSync(file) : null
    if (stat?.isDirectory()) {
      file = path.join(file, 'index.html')
      stat = fs.existsSync(file) ? fs.statSync(file) : null
    }
    if (!stat) {
      // Like a real host: /resume has no file, so the app shell answers and the router takes over.
      if (!spa || path.extname(urlPath)) return res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found')
      file = path.join(base, 'index.html')
      stat = fs.statSync(file)
    }

    const ext = path.extname(file).toLowerCase()
    const etag = `"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`
    const headers = {
      'content-type': TYPES[ext] || 'application/octet-stream',
      'cache-control': cacheControl(urlPath, ext),
      etag,
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'strict-origin-when-cross-origin',
      vary: 'Accept-Encoding',
    }
    if (req.headers['if-none-match'] === etag) return res.writeHead(304, headers).end()

    const packed = encode(file, stat, String(req.headers['accept-encoding'] || ''))
    if (packed) {
      headers['content-encoding'] = packed.kind
      headers['content-length'] = packed.body.length
      res.writeHead(200, headers)
      return res.end(req.method === 'HEAD' ? undefined : packed.body)
    }
    headers['content-length'] = stat.size
    res.writeHead(200, headers)
    if (req.method === 'HEAD') return res.end()
    fs.createReadStream(file).pipe(res)
  })
}

// Run directly: serve dist/ (or the folder given as the first argument).
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const folder = process.argv[2] || 'dist'
  const root = path.resolve(here, folder)
  if (!fs.existsSync(path.join(root, 'index.html'))) {
    console.error(`Nothing to serve at ${root}. Run "npm run build" first.`)
    process.exit(2)
  }
  const port = Number(process.env.PORT) || 8080
  createStaticServer({ root, spa: folder === 'dist' }).listen(port, () => {
    console.log(`Serving ${folder}/ at http://localhost:${port}/  (Ctrl+C to stop)`)
  })
}
