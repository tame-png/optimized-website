// Layout audit: walks every route inside tests/run.html and reports overflow, small tap targets and small text.
window.__audit2 = async function () {
  const routes = ['/', '/notebooks', '/notebooks/i94', '/notebooks/apps', '/notebooks/ebay', '/files', '/certificates', '/paper/lbrhe', '/resume', '/nope'];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const sel = (el) => { let s = el.tagName.toLowerCase(); if (el.className && typeof el.className === 'string') s += '.' + el.className.trim().split(/\s+/).join('.'); return s; };
  // Hash addresses in the artifact build, normal paths on the website build.
  const HASH = !window.__pathMode;
  const go = async (r, ms = 700) => {
    if (HASH) location.hash = r;
    else { history.pushState({}, "", r); window.dispatchEvent(new PopStateEvent("popstate")); }
    await sleep(ms);
  };
  let vw = document.documentElement.clientWidth; const vh = innerHeight;
  const out = { vw, vh, problems: {} };
  for (const r of routes) {
    await go(r, 900);
    document.querySelectorAll('details').forEach((d) => (d.open = true)); await sleep(100);
    const P = []; vw = document.documentElement.clientWidth;
    if (document.documentElement.scrollWidth > vw) P.push('docScrollW=' + document.documentElement.scrollWidth);
    const clipped = (el) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') return true; } return false; };
    const over = new Set(), small = new Set(), tiny = new Set(), fonts = new Set();
    document.querySelectorAll('body *').forEach((el) => {
      const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return;
      const b = el.getBoundingClientRect(); if (!b.width || !b.height) return;
      if ((b.right > vw + 1 || b.left < -1) && !clipped(el) && !el.closest('svg') && !el.closest('.stinger')) over.add(sel(el) + '→' + Math.round(b.right));
      if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'SUMMARY') {
        if (el.classList.contains('skip')) return;
        if (cs.display === 'inline' && el.closest('p,li,dd,em')) return;
        const t = (el.textContent || '').trim().slice(0, 16);
        if (b.height < 24 || b.width < 24) small.add(sel(el) + ' ' + Math.round(b.width) + 'x' + Math.round(b.height) + ' "' + t + '"');
        else if (b.height < 39.5 && innerWidth <= 900) tiny.add(sel(el) + ':' + Math.round(b.height) + ' "' + t + '"');
      }
    });
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) { const t = w.currentNode; if (!t.nodeValue.trim()) continue; const p = t.parentElement; if (!p || p.closest('svg') || p.closest('noscript') || p.closest('.stamp')) continue; const cs = getComputedStyle(p); if (cs.display === 'none') continue; const f = parseFloat(cs.fontSize); if (f < (vw <= 720 ? 11 : 10)) fonts.add(sel(p) + '@' + f); }
    if (over.size) P.push('OVERFLOW: ' + [...over].slice(0, 6).join(' | '));
    if (small.size) P.push('<24px: ' + [...small].slice(0, 8).join(' | '));
    if (tiny.size) P.push('<40px: ' + [...tiny].slice(0, 8).join(' | '));
    if (fonts.size) P.push('smallfont: ' + [...fonts].slice(0, 8).join(' | '));
    if (P.length) out.problems[r] = P;
    const nav = document.querySelector('header.nav');
    out.navH = Math.round(nav.getBoundingClientRect().height);
    out.navSticky = getComputedStyle(nav).position;
    out.menuBtn = getComputedStyle(document.querySelector('.menu-btn')).display !== 'none';
    const tops = [...nav.querySelectorAll('.brand, .links a, .nav-actions > *, .menu-btn')].filter((e) => e.getBoundingClientRect().height).map((e) => { const b = e.getBoundingClientRect(); return Math.round((b.top + b.height / 2) / 12); });
    out.navRows = new Set(tops).size;
    if (r === '/') { const a = document.querySelector('.hero .actions').getBoundingClientRect(); out.ctaBottom = Math.round(a.bottom); }
    if (r === '/notebooks/i94') { const f = document.querySelector('.frame').getBoundingClientRect(); out.frame = [Math.round(f.width), Math.round(f.height)]; }
  }
  await go('/', 100);
  return JSON.stringify(out);
};
