import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Two targets from one source (see src/lib/paths.js):
//   npm run build            -> dist/           the website
//   npm run build:artifact   -> dist-artifact/  a self-contained copy for a claude.ai artifact
export default defineConfig(({ mode }) => {
  const artifact = mode === 'artifact'
  return {
    base: artifact ? './' : '/',
    plugins: [react(), artifact && leaveOutHeavyFiles()],
    build: { outDir: artifact ? 'dist-artifact' : 'dist' },
  }
})

// The artifact build links to the deployed site for the live WebAssembly notebooks,
// so their folders (about 45 MB each) and the host-specific config are dropped from its output.
function leaveOutHeavyFiles() {
  return {
    name: 'leave-out-heavy-files',
    apply: 'build',
    closeBundle() {
      const out = path.resolve('dist-artifact')
      const notebooks = path.join(out, 'notebooks')
      for (const name of fs.readdirSync(notebooks)) {
        // keep only the per-notebook folders: <slug>/<slug>.py and <slug>/static.html
        const keep = fs.statSync(path.join(notebooks, name)).isDirectory() && !name.endsWith('-wasm') && name !== 'public'
        if (!keep) fs.rmSync(path.join(notebooks, name), { recursive: true, force: true })
      }
      for (const name of ['staticwebapp.config.json', 'favicon.svg', 'icons.svg']) {
        fs.rmSync(path.join(out, name), { force: true })
      }
    },
  }
}
