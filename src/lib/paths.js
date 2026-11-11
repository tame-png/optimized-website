// Two builds come from this source:
//   npm run build            the website: normal addresses (/resume), live notebooks in the page
//   npm run build:artifact   a self-contained copy for a claude.ai artifact: hash addresses
//                            (#/resume), relative files, and the heavy live notebooks left out
export const ARTIFACT = import.meta.env.MODE === 'artifact';

// '/' on the website, './' in the artifact build.
export const BASE = import.meta.env.BASE_URL;

// Public address of the deployed site. Set VITE_SITE_URL in .env when the domain changes.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://andymolinaportfolio.vercel.app').replace(/\/$/, '');

/** A file under public/. */
export const asset = (path) => `${BASE}${path}`;

// The live WebAssembly notebooks and their CSVs are about 45 MB each, so the artifact build
// links to the deployed site for them instead of carrying its own copy.
const HEAVY = ARTIFACT ? `${SITE_URL}/` : BASE;

export function notebookPaths(slug) {
  return {
    source: asset(`notebooks/${slug}/${slug}.py`),
    saved: asset(`notebooks/${slug}/static.html`),
    live: `${HEAVY}notebooks/${slug}-wasm/index.html`,
    data: (filename) => `${HEAVY}notebooks/${slug}-wasm/public/${filename}`,
  };
}

/** tel: link for a US number written like (714) 679-6494. */
export const telHref = (phone) => `tel:+1${phone.replace(/\D/g, '')}`;
