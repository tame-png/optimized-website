// Behaviour test: drives the real UI inside tests/run.html and reports pass/fail per behaviour.
window.__test = async function () {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const q = (s) => document.querySelector(s), qa = (s) => [...document.querySelectorAll(s)];
  // Hash addresses in the artifact build, normal paths on the website build.
  const HASH = !window.__pathMode;
  const go = async (r, ms = 700) => {
    if (HASH) location.hash = r;
    else { history.pushState({}, "", r); window.dispatchEvent(new PopStateEvent("popstate")); }
    await sleep(ms);
  };
  const route = () => (HASH ? location.hash.slice(1) || "/" : location.pathname);
  const R = {}; const ok = (k, v, info) => { R[k] = v ? 'PASS' : 'FAIL ' + JSON.stringify(info ?? null); };
  const mobile = getComputedStyle(q('.menu-btn')).display !== 'none';
  await go('/', 700); window.scrollTo(0, 0);

  if (mobile) {
    const btn = q('.menu-btn'), menu = q('#site-menu');
    ok('menu closed at start', getComputedStyle(menu).display === 'none' && btn.getAttribute('aria-expanded') === 'false');
    btn.click(); await sleep(150);
    ok('menu opens', getComputedStyle(menu).display !== 'none' && btn.getAttribute('aria-expanded') === 'true' && btn.textContent.trim() === 'Close');
    const mb = menu.getBoundingClientRect();
    ok('menu fits viewport', mb.right <= innerWidth + 1 && mb.bottom <= innerHeight + 1, [mb.right, mb.bottom, innerWidth, innerHeight]);
    ok('menu links >=44px', qa('#site-menu .links a').every((a) => a.getBoundingClientRect().height >= 44), qa('#site-menu .links a').map((a) => a.getBoundingClientRect().height));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await sleep(150);
    ok('Escape closes menu and returns focus', btn.getAttribute('aria-expanded') === 'false' && document.activeElement === btn);
    btn.click(); await sleep(150);
    qa('#site-menu .links a').find((a) => a.textContent.includes('Notebooks')).click(); await sleep(700);
    ok('menu link navigates and closes', route() === '/notebooks' && q('.menu-btn').getAttribute('aria-expanded') === 'false', route());
    await go('/', 700);
  } else {
    const links = qa('.links a');
    ok('desktop nav on one row', new Set(links.map((a) => Math.round(a.getBoundingClientRect().top))).size === 1 && Math.abs(q('.brand').getBoundingClientRect().top - links[0].getBoundingClientRect().top) < 30);
    links.find((a) => a.textContent === 'Notebooks').click(); await sleep(700);
    ok('nav link navigates', route() === '/notebooks' && q('.links a.active').textContent === 'Notebooks');
    await go('/', 700);
  }

  // sticky header
  window.scrollTo(0, 900); await sleep(200);
  ok('header stays on screen when scrolled', Math.abs(q('header.nav').getBoundingClientRect().top) < 1, q('header.nav').getBoundingClientRect().top);

  // filter chips
  const chips = qa('.chip');
  chips.find((c) => c.textContent === 'R').click(); await sleep(150);
  ok('filter chip narrows the list', qa('.grid .card').length === 1 && qa('.chip').find((c) => c.textContent === 'R').getAttribute('aria-pressed') === 'true', qa('.grid .card').length);
  qa('.chip')[0].click(); await sleep(150);
  ok('filter resets', qa('.grid .card').length === 5);

  // scroll restoration + focus
  window.scrollTo(0, 1400); await sleep(250);
  const y0 = window.scrollY;
  qa('.grid .card').find((c) => c.getAttribute('href').includes('/notebooks/i94')).click(); await sleep(900);
  ok('new page starts at top', window.scrollY === 0 && route() === '/notebooks/i94', [window.scrollY, route()]);
  ok('focus moves to the page content', document.activeElement && document.activeElement.tagName === 'MAIN', document.activeElement && document.activeElement.tagName);
  history.back(); await sleep(1200);
  ok('Back restores scroll position', route() === '/' && Math.abs(window.scrollY - y0) < 5, [y0, window.scrollY, route()]);

  // viewer
  await go('/notebooks/i94', 1500);
  const tabs = () => qa('.toolbar [role=tab]');
  // The saved-output page builds itself with scripts from a CDN, so give it real time to finish.
  let inner = 0;
  for (let i = 0; i < 60 && inner <= 500; i++) {
    try { inner = q('.frame iframe').contentDocument.body.innerText.length; } catch { /* frame not readable yet */ }
    if (inner <= 500) await sleep(500);
  }
  ok('saved outputs load in the frame', inner > 500, inner);
  tabs()[0].focus();
  tabs()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })); await sleep(300);
  ok('ArrowRight selects next tab', tabs()[1].getAttribute('aria-selected') === 'true' && document.activeElement === tabs()[1]);
  if (HASH) ok('live tab explains itself and links out', /Open it there/.test(q('.frame').textContent) && !!q('.frame .boot a[href*="i94-wasm/index.html"]'));
  else ok('live tab loads the notebook in the page', !!q('.frame iframe[src$="notebooks/i94-wasm/index.html"]'), q('.frame iframe') && q('.frame iframe').getAttribute('src'));
  tabs()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true })); await sleep(1200);
  ok('End selects last tab, cells render', tabs()[2].getAttribute('aria-selected') === 'true' && qa('.cells .cell').length > 5, qa('.cells .cell').length);
  ok('tabpanel is labelled', q('[role=tabpanel]').getAttribute('aria-labelledby') === 'tab-code' && !!document.getElementById('tab-code'));
  ok('code cells do not widen the page', document.documentElement.scrollWidth <= document.documentElement.clientWidth, [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  const src = qa('.cells [role=tab]');
  ok('source switch present', src.length === 2);
  if (src[1]) { src[1].click(); await sleep(900); }
  ok('explainer source renders', qa('.cells .cell').length > 2, qa('.cells .cell').length);
  tabs()[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true })); await sleep(600);
  ok('Home returns to first tab', tabs()[0].getAttribute('aria-selected') === 'true');
  const dr = q('details.drawer.data'); dr.querySelector('summary').click(); await sleep(200);
  ok('data drawer opens without overflow', dr.open && document.documentElement.scrollWidth <= document.documentElement.clientWidth && q('.file').getBoundingClientRect().right <= innerWidth, [document.documentElement.scrollWidth, q('.file').getBoundingClientRect().right]);
  ok('download + full-screen links', /notebooks\/i94\/i94\.py,.*notebooks\/i94\/static\.html$/.test(qa('.toolbar .actions a').map((a) => a.getAttribute('href')).join()), qa('.toolbar .actions a').map((a) => a.getAttribute('href')));

  // failed source fetch
  const realFetch = window.fetch; window.fetch = () => Promise.reject(new Error('offline'));
  await go('/notebooks/apps', 900);
  tabs()[2].click(); await sleep(500);
  ok('failed source load shows a message', /could not be loaded/.test(q('.cells').textContent), q('.cells').textContent.slice(0, 80));
  window.fetch = realFetch;
  tabs()[0].click(); await sleep(300);

  // other pages
  for (const [r, sel] of [['/notebooks/ebay', '.frame iframe'], ['/files', '.file'], ['/certificates', '.cert'], ['/paper/lbrhe', '.hbar.two'], ['/resume', '.resume .edu'], ['/nope', '.notfound']]) {
    await go(r, 800);
    ok('renders ' + r, !!q(sel));
  }
  await go('/resume', 700);
  ok('phone number dials', q('.contact a[href^="tel:"]').getAttribute('href') === 'tel:+17146796494' && q('.addr a[href^="tel:"]').getAttribute('href') === 'tel:+17146796494');
  ok('resume PDF link', q('.no-print a').getAttribute('href').endsWith('resume/Andy_Molina_Resume.pdf'));
  const pdf = await fetch(q('.no-print a').href, { method: 'HEAD' });
  ok('resume PDF exists', pdf.ok, pdf.status);

  // themes
  const tideBtn = (t) => qa('.postcard .tides button').find((b) => b.textContent === t);
  tideBtn('High tide').click(); await sleep(700);
  ok('theme switch applies', document.documentElement.getAttribute('data-theme') === 'high-tide' && localStorage.getItem('tide') === 'high-tide');
  ok('browser chrome colour follows theme', qa('meta[name="theme-color"]').every((m) => m.content === '#161b22' && !m.media), qa('meta[name="theme-color"]').map((m) => m.content + '|' + m.media));
  ok('dark theme sets color-scheme', getComputedStyle(document.documentElement).colorScheme === 'dark', getComputedStyle(document.documentElement).colorScheme);
  tideBtn('Golden hour').click(); await sleep(700);
  ok('golden hour applies', document.documentElement.getAttribute('data-theme') === 'golden-hour' && q('meta[name="theme-color"]').content === '#f4ebd9');
  tideBtn('Auto').click(); await sleep(700);
  ok('auto clears the pin', localStorage.getItem('tide') === null);

  await go('/', 400); window.scrollTo(0, 0);
  const fails = Object.entries(R).filter(([, v]) => v !== 'PASS');
  return JSON.stringify({ viewport: [innerWidth, innerHeight], mobile, total: Object.keys(R).length, passed: Object.keys(R).length - fails.length, fails });
};
