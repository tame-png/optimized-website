import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DatasetCard } from '../components/Cards.jsx';
import { PROJECTS } from '../data.js';
import { parseNotebook, renderMarkdown } from '../lib/marimo.js';
import { ARTIFACT, asset, notebookPaths } from '../lib/paths.js';
import { useSeo } from '../lib/seo.js';
import { useTide } from '../tide/tides.js';

const TABS = [
  ['explainer', 'Explainer'],
  ['outputs', 'Saved outputs'],
  ['live', 'Run live'],
  ['code', 'Read the cells'],
];
const SOURCES = [
  ['note', 'Full notebook'],
  ['explorer', 'Explainer source'],
];

/** Arrow, Home and End keys move between tabs, as the tab roles promise. */
function onTabKeys(e) {
  const tabs = [...e.currentTarget.querySelectorAll('[role="tab"]')];
  const at = tabs.indexOf(document.activeElement);
  const to = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: tabs.length - 1 }[e.key];
  if (at < 0 || to === undefined) return;
  e.preventDefault();
  const next = tabs[(to + tabs.length) % tabs.length];
  next.focus();
  next.click();
}

function CodeCell({ cell }) {
  return (
    <div className="cell code">
      <div className="cell-head">
        <span>
          cell {cell.index + 1}
          {cell.hidden ? ' · code hidden in the app' : ''}
        </span>
        <span>{cell.outputs.length ? `defines ${cell.outputs.join(', ')}` : 'no exports'}</span>
      </div>
      <pre>
        {cell.source.split('\n').map((line, i) => (
          <span key={i} className="ln">
            {line || ' '}
          </span>
        ))}
      </pre>
    </div>
  );
}

/** Fetches a text file. Returns { text, failed }, both empty while loading. */
function useText(url) {
  const [state, setState] = useState({ url: null, text: '', failed: false });
  useEffect(() => {
    if (!url) return;
    let live = true;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.text();
      })
      .then((text) => live && setState({ url, text, failed: false }))
      .catch(() => live && setState({ url, text: '', failed: true }));
    return () => {
      live = false;
    };
  }, [url]);
  return state.url === url ? state : { text: '', failed: false };
}

/** True once a prepared "explainer" build is confirmed to exist at this address. */
function useExists(url) {
  const [found, setFound] = useState(null);
  useEffect(() => {
    if (!url || ARTIFACT) return; // prepared builds ship only with the website
    let live = true;
    fetch(url)
      .then((res) => (res.ok ? res.text() : ''))
      // A host that answers every unknown address with the app shell must not count as a hit.
      .then((html) => live && html && !html.includes('id="root"') && setFound(url))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [url]);
  return found === url && Boolean(url);
}

function NotebookView({ p }) {
  const { tide } = useTide();
  const [tab, setTab] = useState('outputs');
  const [sourceKind, setSourceKind] = useState('note');
  const [frameLoaded, setFrameLoaded] = useState(false);

  const paths = notebookPaths(p.slug);
  const explorer = p.views?.explorer;
  const explainerUrl = p.views?.studio ? asset(p.views.studio) : '';
  const explainerReady = useExists(explainerUrl);

  const sourceUrl = sourceKind === 'explorer' && explorer ? asset(explorer) : paths.source;
  const source = useText(sourceUrl);
  const notebook = useMemo(() => (source.text ? parseNotebook(source.text) : null), [source.text]);

  const themedExplainer = `${explainerUrl}?theme=${tide}`;
  const frameSrc =
    tab === 'explainer' ? themedExplainer : tab === 'outputs' ? paths.saved : tab === 'live' && !ARTIFACT ? paths.live : '';
  const fullScreenHref = tab === 'live' ? paths.live : tab === 'explainer' ? themedExplainer : paths.saved;
  const downloadHref = tab === 'code' ? sourceUrl : paths.source;
  const tabs = TABS.filter(([id]) => id !== 'explainer' || explainerReady);

  return (
    <main className="page wrap" id="main" tabIndex={-1}>
      <p className="no-print" style={{ margin: '18px 0 10px' }}>
        <Link to="/notebooks" className="btn ghost">
          ← All notebooks
        </Link>
      </p>
      <section className="viewer" aria-label={p.title}>
        <div className="toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h1>{p.title}</h1>
            <span className="pill">{p.runtimeLabel}</span>
          </div>
          <div className="actions">
            <div className="tabs" role="tablist" aria-label="Notebook views" onKeyDown={onTabKeys}>
              {tabs.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  className="tab"
                  id={`tab-${id}`}
                  aria-controls="viewer-panel"
                  aria-selected={tab === id}
                  tabIndex={tab === id ? 0 : -1}
                  onClick={() => {
                    setTab(id);
                    setFrameLoaded(false);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <a className="btn sm" href={downloadHref} download>
              Download .py
            </a>
            <a className="btn sm" href={fullScreenHref} target="_blank" rel="noreferrer">
              Open full screen
            </a>
          </div>
        </div>

        {p.brief && (
          <dl className="brief">
            {[
              ['Question', p.brief.question],
              ['Data', p.brief.data],
              ['Method', p.brief.method],
              ['Result', p.brief.result],
              ['Limits', p.brief.limits],
            ].map(([term, text]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
        )}

        {tab === 'code' ? (
          <div className="cells" role="tabpanel" id="viewer-panel" aria-labelledby="tab-code">
            {explorer && (
              <div className="tabs" role="tablist" aria-label="Which source to read" onKeyDown={onTabKeys}>
                {SOURCES.map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    className="tab"
                    aria-selected={sourceKind === id}
                    tabIndex={sourceKind === id ? 0 : -1}
                    onClick={() => setSourceKind(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
            {!notebook && (
              <p className="empty" role="status">
                {source.failed
                  ? 'The notebook source could not be loaded. Use Download .py instead.'
                  : 'Loading the notebook source…'}
              </p>
            )}
            {notebook?.cells.map((cell) =>
              cell.kind === 'markdown' ? (
                // The markdown comes from this site's own notebook files and is escaped before rendering.
                <div key={cell.index} className="cell md" dangerouslySetInnerHTML={{ __html: renderMarkdown(cell.source) }} />
              ) : (
                <CodeCell key={cell.index} cell={cell} />
              ),
            )}
            {notebook && (
              <p className="muted" style={{ fontSize: 14 }}>
                {notebook.cells.length} cells · file written with marimo {notebook.version}. Cells marked &quot;code
                hidden&quot; show only their output in the app view.
              </p>
            )}
          </div>
        ) : (
          <div className="frame" role="tabpanel" id="viewer-panel" aria-labelledby={`tab-${tab}`}>
            {frameSrc && (
              <iframe
                title={p.title}
                src={frameSrc}
                sandbox="allow-scripts allow-same-origin allow-downloads allow-popups allow-forms"
                onLoad={() => setFrameLoaded(true)}
              />
            )}
            {(!frameLoaded || !frameSrc) && (
              <div className={`boot${frameSrc ? '' : ' off'}`}>
                <div>
                  <b>
                    {tab === 'live'
                      ? 'Python runs in your browser'
                      : tab === 'explainer'
                        ? 'Prepared in advance, nothing to load'
                        : 'Loading saved outputs'}
                  </b>
                  {tab === 'live' && ARTIFACT ? (
                    <span>
                      The live runtime is about 30 MB of WebAssembly and ships only with the deployed site.{' '}
                      <a className="btn sm" style={{ marginLeft: 8 }} href={paths.live} target="_blank" rel="noreferrer">
                        Open it there
                      </a>
                    </span>
                  ) : tab === 'live' ? (
                    'First load takes 10–20 s while Pyodide downloads; it is cached after that.'
                  ) : tab === 'explainer' ? (
                    'Every combination of the controls was computed ahead of time, so each click is instant.'
                  ) : (
                    'Every chart and table from the last run, no Python needed.'
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="foot">
          <span>
            {p.rows} rows{p.exported ? ` · exports rebuilt ${p.exported} with marimo 0.25.2` : ''}
          </span>
          <span>
            {tab === 'live'
              ? 'Edit any cell and the dependents re-run'
              : tab === 'explainer'
                ? 'Prepared states, no Python running'
                : tab === 'code'
                  ? 'Reading view, parsed from the .py file'
                  : 'Static HTML export'}
          </span>
        </div>

        {p.datasets?.length ? (
          <details className="drawer data">
            <summary>
              <span>
                Data · {p.datasets.length === 1 ? 'one file' : `${p.datasets.length} files`} shipped with this notebook
              </span>
              <span>{p.datasets.map((d) => d.filename).join(', ')}</span>
            </summary>
            <div style={{ display: 'grid', gap: 12, padding: 14 }}>
              {p.datasets.map((d) => (
                <DatasetCard key={d.filename} d={d} href={paths.data(d.filename)} />
              ))}
            </div>
          </details>
        ) : null}
      </section>
    </main>
  );
}

export default function Viewer() {
  const { slug } = useParams();
  const p = PROJECTS.find((x) => x.slug === slug);

  useSeo({
    title: p ? p.title : 'Notebook',
    description: p
      ? `${p.blurb} A marimo notebook with saved outputs, a live Python runtime in the browser and the source.`
      : 'No notebook with that name.',
    path: `/notebooks/${slug ?? ''}`,
  });

  if (!p) {
    return (
      <main className="page wrap" id="main" tabIndex={-1}>
        <p className="empty">
          No notebook with that name. <Link to="/notebooks">Back to the notebooks.</Link>
        </p>
      </main>
    );
  }
  // Keyed by notebook, so the open tab and loaded source reset when the notebook changes.
  return <NotebookView key={p.slug} p={p} />;
}
