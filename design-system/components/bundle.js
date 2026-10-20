/* @ds-bundle: {"format":4,"namespace":"Shoreline","components":[{"name":"Button"},{"name":"Pill"},{"name":"SectionHead"},{"name":"KpiStrip"},{"name":"Plate"},{"name":"ProjectCard"},{"name":"FilterBar"},{"name":"NotebookViewer"},{"name":"FileArtifact"},{"name":"CertificateCard"},{"name":"CodeDrawer"},{"name":"WaveDivider"},{"name":"TideSwitcher"},{"name":"Nav"},{"name":"PostcardFooter"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;
  var useState = React.useState;

  function cx() { var out = []; for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]); return out.join(' '); }

  function Button(p) {
    var variant = p.variant || 'outline';
    var Tag = p.href ? 'a' : 'button';
    return h(Tag, {
      className: cx('sl', 'sl-btn', p.className), 'data-variant': variant, 'data-size': p.size || 'md',
      href: p.href, target: p.href && p.external ? '_blank' : undefined, rel: p.href && p.external ? 'noreferrer' : undefined,
      onClick: p.onClick, disabled: p.disabled, type: p.href ? undefined : (p.type || 'button'), download: p.download, 'aria-label': p['aria-label']
    }, p.glyph ? h('span', { 'aria-hidden': true }, p.glyph) : null, p.children);
  }

  function Pill(p) {
    return h('span', { className: cx('sl', 'sl-pill', p.className), 'data-tone': p.tone || 'accent' },
      p.dot ? h('span', { className: 'sl-dot', 'aria-hidden': true }) : null, p.children);
  }

  function SectionHead(p) {
    if (p.variant === 'paper') {
      return h('div', { className: cx('sl', 'sl-sec'), 'data-variant': 'paper' },
        h('div', { className: 'sl-sec-kicker' }, '§ ' + (p.numeral || '') + (p.kicker ? ' · ' + p.kicker : '')),
        h('h2', null, p.title));
    }
    return h('div', { className: cx('sl', 'sl-sec') },
      h('span', { className: 'sl-sec-num' }, '§ ' + (p.numeral || 'i')),
      h('span', { className: 'sl-sec-label' }, p.title),
      h('div', { className: 'sl-sec-line' }));
  }

  function KpiStrip(p) {
    return h('div', { className: cx('sl', 'sl-kpis'), style: p.columns ? { gridTemplateColumns: 'repeat(' + p.columns + ',1fr)' } : undefined },
      (p.items || []).map(function (it, i) {
        return h('div', { key: i, className: 'sl-kpi', 'data-tone': it.tone || 'accent' },
          h('div', { className: 'sl-kpi-num' }, it.value),
          h('div', { className: 'sl-kpi-lbl' }, it.label));
      }));
  }

  function Plate(p) {
    return h('figure', { className: cx('sl', 'sl-plate', p.className), 'data-ticks': p.ticks ? 'true' : 'false', style: { margin: 0 } },
      p.ticks ? h('span', { className: 'sl-tick', 'aria-hidden': true }) : null,
      (p.figure || p.meta) ? h('div', { className: 'sl-plate-head' }, h('span', null, p.figure), h('span', null, p.meta)) : null,
      h('div', { className: 'sl-plate-body' }, p.children),
      (p.caption || p.tag) ? h('figcaption', { className: 'sl-plate-cap' }, h('span', null, p.caption), h('b', null, p.tag)) : null);
  }

  function ProjectCard(p) {
    var plate = h(Plate, { figure: p.figure, meta: p.runtime ? h(Pill, { tone: p.runtimeTone || 'accent' }, p.runtime) : null }, p.children);
    var body = h('div', null,
      h('span', { className: 'sl-card-label' }, p.label),
      h('h3', null, p.title),
      h('p', null, p.blurb),
      h('div', { className: 'sl-card-foot' },
        h('span', null, p.outcomeLabel ? p.outcomeLabel + ': ' : null, h('b', null, p.outcome)),
        h('span', { className: 'sl-go' }, (p.cta || 'Open') + ' →')));
    return h(p.href ? 'a' : 'button', { className: cx('sl', 'sl-card'), 'data-flagship': p.flagship ? 'true' : 'false', href: p.href, onClick: p.onClick, type: p.href ? undefined : 'button' },
      plate, body);
  }

  function FilterBar(p) {
    var st = useState(p.active || 'all'); var active = st[0], setActive = st[1];
    var qs = useState(''); var q = qs[0], setQ = qs[1];
    function pick(id) { setActive(id); if (p.onChange) p.onChange({ category: id, query: q }); }
    function type(v) { setQ(v); if (p.onChange) p.onChange({ category: active, query: v }); }
    return h('div', { className: cx('sl', 'sl-filter') },
      h('div', { className: 'sl-pills', role: 'group', 'aria-label': 'Filter' },
        (p.categories || []).map(function (c) {
          return h('button', { key: c.id, type: 'button', className: 'sl-catpill', 'aria-pressed': active === c.id ? 'true' : 'false', onClick: function () { pick(c.id); } },
            c.label + (c.count != null ? ' (' + c.count + ')' : ''));
        })),
      p.search === false ? null : h('div', { className: 'sl-search' },
        h('span', { className: 'sl-mono', style: { fontSize: 11, color: 'var(--ink-muted)' }, 'aria-hidden': true }, '⌕'),
        h('input', { type: 'search', value: q, placeholder: p.placeholder || 'Search works…', 'aria-label': 'Search', onChange: function (e) { type(e.target.value); } }),
        q ? h('button', { type: 'button', onClick: function () { type(''); } }, 'clear') : null));
  }

  function NotebookViewer(p) {
    var ms = useState(p.mode || 'run'); var mode = ms[0], setMode = ms[1];
    var ls = useState(false); var loaded = ls[0], setLoaded = ls[1];
    var src = mode === 'edit' && p.editSrc ? p.editSrc : p.src;
    var runtime = p.runtime || 'marimo · WASM';
    return h('section', { className: cx('sl', 'sl-viewer'), 'aria-label': p.title },
      h('div', { className: 'sl-toolbar' },
        h('div', { className: 'sl-viewer-title' },
          p.figure ? h('span', { className: 'sl-label', style: { color: 'var(--accent)' } }, p.figure) : null,
          h('h3', null, p.title),
          h(Pill, { tone: p.runtimeTone || 'accent' }, runtime)),
        h('div', { className: 'sl-actions' },
          p.editSrc ? h('div', { className: 'sl-tabs', role: 'tablist' },
            h('button', { type: 'button', role: 'tab', className: 'sl-tab', 'aria-selected': mode === 'run' ? 'true' : 'false', onClick: function () { setMode('run'); setLoaded(false); } }, 'Run (app)'),
            h('button', { type: 'button', role: 'tab', className: 'sl-tab', 'aria-selected': mode === 'edit' ? 'true' : 'false', onClick: function () { setMode('edit'); setLoaded(false); } }, 'Edit (code)')) : null,
          p.sourceHref ? h(Button, { size: 'sm', href: p.sourceHref, download: true, glyph: '⤓' }, p.sourceLabel || 'Download .py') : null,
          p.staticHref ? h(Button, { size: 'sm', href: p.staticHref, glyph: '↗', external: true }, 'Static HTML') : null,
          src ? h(Button, { size: 'sm', href: src, external: true, glyph: '⛶' }, 'Fullscreen') : null)),
      h('div', { className: 'sl-frame', style: p.height ? { '--sl-frame-h': p.height } : undefined },
        src && !p.placeholder ? h('iframe', { src: src, title: p.title, sandbox: 'allow-scripts allow-same-origin allow-downloads allow-popups', loading: 'lazy', onLoad: function () { setLoaded(true); } }) : null,
        (!loaded || p.placeholder) ? h('div', { className: 'sl-frame-boot', style: src && !p.placeholder ? { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' } : undefined },
          h('div', null, h('b', null, p.placeholder ? (p.placeholderTitle || 'Notebook frame') : 'Booting ' + runtime),
            p.bootNote || 'First load ≈ 10–20 s while Pyodide downloads · cached after that')) : null),
      h('div', { className: 'sl-viewer-foot' },
        h('span', null, p.data && p.data.length ? 'Data: ' + p.data.join(' · ') : (p.source || '')),
        h('span', null, p.note || ('Mode: ' + mode + ' · sandboxed iframe'))));
  }

  var KIND_LABEL = { xlsx: 'XLSX', csv: 'CSV', r: 'R', py: 'PY', pdf: 'PDF', html: 'HTML', qmd: 'QMD', rmd: 'RMD' };
  function FileArtifact(p) {
    var kind = (p.kind || 'csv').toLowerCase();
    var rows = p.preview && p.preview.rows ? p.preview.rows.slice(0, p.previewRows || 6) : null;
    return h('article', { className: cx('sl', 'sl-file'), 'data-kind': kind },
      h('div', { className: 'sl-file-badge', 'aria-hidden': true }, KIND_LABEL[kind] || kind.toUpperCase()),
      h('div', null,
        h('div', { className: 'sl-file-name' }, p.filename),
        h('div', { className: 'sl-file-meta' }, [p.size, p.rows ? p.rows + ' rows' : null, p.updated].filter(Boolean).join(' · ')),
        p.look ? h('p', { className: 'sl-file-look' }, h('b', null, 'What to look at: '), p.look) : null,
        p.sheets && p.sheets.length ? h('div', { className: 'sl-file-sheets' }, p.sheets.map(function (s, i) { return h(Pill, { key: i, tone: 'neutral' }, s); })) : null,
        h('div', { className: 'sl-actions' },
          p.href ? h(Button, { size: 'sm', href: p.href, download: true, glyph: '⤓' }, p.downloadLabel || ('Download .' + kind)) : null,
          p.previewHref ? h(Button, { size: 'sm', href: p.previewHref, external: true, glyph: '↗' }, p.previewLabel || 'Open preview') : null,
          p.sourceNote ? h('span', { className: 'sl-caption' }, p.sourceNote) : null),
        rows ? h('table', null,
          h('thead', null, h('tr', null, p.preview.columns.map(function (c, i) { return h('th', { key: i }, c); }))),
          h('tbody', null, rows.map(function (r, i) { return h('tr', { key: i }, r.map(function (v, j) { return h('td', { key: j }, String(v)); })); }))) : null));
  }

  function CertificateCard(p) {
    var state = p.state || (p.verifyHref ? 'verified' : (p.pdfHref ? 'issued' : 'in-progress'));
    var statusText = state === 'verified' ? 'Verified ✓' : state === 'issued' ? 'Issued' : 'In progress';
    return h('article', { className: cx('sl', 'sl-cert'), 'data-state': state },
      h('div', { className: 'sl-cert-thumb' },
        p.thumb ? h('img', { src: p.thumb, alt: p.thumbAlt || (p.title + ' certificate, first page') }) : h('span', { className: 'sl-cert-empty' }, state === 'in-progress' ? 'Expected ' + (p.expected || 'soon') : 'PDF · no preview'),
        state === 'verified' ? h('span', { className: 'sl-cert-seal', 'aria-hidden': true }, 'VER') : null),
      h('div', null,
        h('div', { className: 'sl-cert-issuer' }, p.issuer),
        h('h3', null, p.title)),
      h('div', { className: 'sl-cert-row' },
        h('span', null, p.date ? h(React.Fragment, null, 'Completed ', h('b', null, p.date)) : null),
        h('span', { className: 'sl-cert-status', 'data-state': state }, statusText)),
      p.credentialId ? h('div', { className: 'sl-cert-row' }, h('span', null, 'Credential ID ', h('b', null, p.credentialId))) : null,
      p.skills && p.skills.length ? h('div', { className: 'sl-pills' }, p.skills.map(function (s, i) { return h(Pill, { key: i, tone: 'neutral' }, s); })) : null,
      h('div', { className: 'sl-cert-foot' },
        p.verifyHref ? h(Button, { size: 'sm', href: p.verifyHref, external: true, glyph: '↗' }, 'Verify') : h('span', { className: 'sl-caption' }, p.note || ''),
        p.pdfHref ? h(Button, { size: 'sm', variant: 'ghost', href: p.pdfHref, download: true, glyph: '⤓' }, 'PDF') : null));
  }

  function CodeDrawer(p) {
    return h('details', { className: cx('sl', 'sl-drawer'), open: p.open },
      h('summary', null, h('span', null, p.title), h('span', null, p.engine)),
      h('pre', null, h('code', null, p.code || p.children)));
  }

  function WaveDivider(p) {
    return h('div', { className: cx('sl', 'sl-wave'), 'aria-hidden': true },
      h('svg', { viewBox: '0 0 1200 28', preserveAspectRatio: 'none' },
        h('path', { className: 'w1', d: 'M0,14 C150,26 300,2 450,14 C600,26 750,2 900,14 C1050,26 1150,6 1200,14', fill: 'none', strokeWidth: 1.2 }),
        p.single ? null : h('path', { className: 'w2', d: 'M0,20 C180,6 320,26 500,16 C680,6 840,26 1020,14 C1120,8 1170,18 1200,20', fill: 'none', strokeWidth: 0.9 })));
  }

  var TIDES = [{ id: 'low-tide', label: 'Low Tide' }, { id: 'golden-hour', label: 'Golden Hr' }, { id: 'high-tide', label: 'High Tide' }];
  function TideSwitcher(p) {
    var st = useState(p.value || 'low-tide'); var v = st[0], setV = st[1];
    function pick(id) { setV(id); if (p.onChange) p.onChange(id); else document.documentElement.setAttribute('data-theme', id); }
    return h('div', { className: cx('sl', 'sl-tides'), role: 'group', 'aria-label': 'Tide theme' },
      (p.tides || TIDES).map(function (t) { return h('button', { key: t.id, type: 'button', className: 'sl-tide', 'aria-pressed': v === t.id ? 'true' : 'false', onClick: function () { pick(t.id); } }, t.label); }));
  }

  function Nav(p) {
    return h('header', { className: 'sl' },
      p.ticker !== false ? h('div', { className: 'sl-ticker' },
        h('span', { className: 'sl-ticker-l' }, h('span', { className: 'sl-dot', 'aria-hidden': true }), p.tickerLeft || 'Long Beach, CA · CSULB Applied Statistics · Go Beach'),
        h('span', { className: 'sl-ticker-r' }, p.tickerRight || '')) : null,
      h('nav', { className: 'sl-nav', 'aria-label': 'Primary' },
        h('div', { className: 'sl-brand' }, h('span', { className: 'sl-brand-name' }, p.brand || 'A. Molina'), h(Pill, { tone: 'gold' }, p.badge || 'The Beach')),
        h('div', { className: 'sl-links' }, (p.links || []).map(function (l, i) {
          return h('a', { key: i, className: 'sl-link', href: l.href || '#', 'aria-current': l.active ? 'page' : undefined, onClick: l.onClick }, (i + 1 < 10 ? '0' + (i + 1) : i + 1) + '. ' + l.label);
        })),
        h('div', { className: 'sl-nav-actions' }, p.tides === false ? null : h(TideSwitcher, { value: p.tide, onChange: p.onTide }), p.email ? h(Button, { size: 'sm', href: 'mailto:' + p.email, glyph: '↩' }, 'Email') : null)));
  }

  function PostcardFooter(p) {
    return h('footer', { className: cx('sl', 'sl-postcard') },
      h('div', { className: 'sl-postcard-l' },
        h(Pill, { tone: 'neutral' }, p.kicker || 'Field postcard · Long Beach, California'),
        h('h3', null, p.title || 'Greetings from The Beach.'),
        h('p', null, p.children),
        p.extra),
      h('div', null,
        h('div', { className: 'sl-stamp', 'aria-hidden': true }, h('b', null, 'CSULB'),
          h('svg', { viewBox: '0 0 40 30' }, h('polygon', { className: 'py', points: '20,4 4,26 36,26', strokeWidth: 1 })),
          h('span', null, 'LONG BEACH', h('br'), p.year || 'MMXXVI')),
        h('div', { className: 'sl-addr' },
          h('div', null, h('b', null, 'TO: '), p.to || 'Hiring team / technical recruiter'),
          p.email ? h('div', null, h('b', null, 'POST: '), h('a', { href: 'mailto:' + p.email }, p.email)) : null,
          p.phone ? h('div', null, h('b', null, 'TEL: '), p.phone) : null,
          h('div', null, h('b', null, 'LOC: '), p.location || 'California State University, Long Beach'))));
  }

  window.Shoreline = { Button: Button, Pill: Pill, SectionHead: SectionHead, KpiStrip: KpiStrip, Plate: Plate, ProjectCard: ProjectCard, FilterBar: FilterBar, NotebookViewer: NotebookViewer, FileArtifact: FileArtifact, CertificateCard: CertificateCard, CodeDrawer: CodeDrawer, WaveDivider: WaveDivider, TideSwitcher: TideSwitcher, Nav: Nav, PostcardFooter: PostcardFooter };
})();
