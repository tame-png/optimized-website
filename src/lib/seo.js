import { useEffect } from 'react';
import { SITE } from '../data.js';
import { SITE_URL } from './paths.js';

function setMeta(selector, attribute, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    const match = /\[(\w+(?::\w+)?)="([^"]+)"\]/.exec(selector);
    if (match) el.setAttribute(match[1], match[2]);
    document.head.appendChild(el);
  }
  el.setAttribute(attribute, value);
}

/** Sets the tab title, description, canonical address and social-preview tags for a page. */
export function useSeo({ title, description, path, image }) {
  useEffect(() => {
    const fullTitle = title === SITE.name ? SITE.name : `${title} · ${SITE.name}`;
    const url = `${SITE_URL}${path}`;
    const img = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : `${SITE_URL}/og.png`;
    document.title = fullTitle;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:image"]', 'content', img);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', img);
  }, [title, description, path, image]);
}
