import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PROJECTS, MONO } from '../data';
import { NavBar } from '../components/Components';

export default function NotebookViewer({ theme, fontStack }) {
  const { ink, accent, paper, panel } = theme;
  const serif = fontStack.serif;
  const display = fontStack.display || serif;
  const mono = MONO;

  // Parse project id from URL params
  const { projectId } = useParams();
  const projects = PROJECTS;
  const project = projects.find((p) => p.id === projectId);

  React.useEffect(() => {
    document.title = project
      ? `${project.title} · Andy Molina`
      : 'Notebooks · Andy Molina';
  }, [project]);

  const [mode, setMode] = React.useState('static'); // 'static' or 'marimo'
  const [iframeLoaded, setIframeLoaded] = React.useState(false);

  // Notebook file mapping — these are served from public/
  const notebookMap = {
    apps: { static: '/notebooks/apps-static.html', marimo: '/notebooks/apps-wasm/index.html' },
    traffic: { static: '/notebooks/i94-static.html', marimo: '/notebooks/i94-wasm/index.html' },
    ebay: { static: '/notebooks/ebay-static.html', marimo: '/notebooks/ebay-wasm/index.html' },
  };

  const nb = notebookMap[projectId];

  if (!project || !nb) {
    return (
      <div style={{ background: paper, color: ink, fontFamily: serif, minHeight: '100vh' }}>
        <NavBar ink={ink} accent={accent} mono={mono} active="notebooks" />
        <div style={{ padding: '120px 56px', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: display, fontWeight: 400, fontSize: 48,
            margin: '0 0 16px', color: ink,
          }}>Notebook not found</h1>
          <p style={{ fontFamily: serif, fontSize: 18, color: `${ink}88` }}>
            This project doesn't have an associated notebook viewer yet.
          </p>
          <Link to="/notebooks" style={{
            fontFamily: mono, fontSize: 12, color: accent,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            borderBottom: `0.5px solid ${accent}`,
            paddingBottom: 2,
          }}>← back to notebooks</Link>
        </div>
      </div>
    );
  }

  const currentSrc = mode === 'static' ? nb.static : nb.marimo;

  return (
    <div style={{ background: paper, color: ink, fontFamily: serif, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header bar */}
      <header className="viewer-header" style={{
        padding: '16px 40px',
        borderBottom: `0.5px solid ${ink}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
        background: panel,
      }}>
        {/* Left: back + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/notebooks" style={{
            fontFamily: mono, fontSize: 10.5, color: accent,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7L9 11" stroke={accent} strokeWidth="1.2" />
            </svg>
            notebooks
          </Link>
          <div style={{ width: 1, height: 24, background: `${ink}22` }} />
          <div>
            <div style={{
              fontFamily: mono, fontSize: 9, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: accent, marginBottom: 2,
            }}>Fig. {project.fig} · {project.field} · {project.year}</div>
            <h1 style={{
              fontFamily: display, fontWeight: 500, fontSize: 20,
              lineHeight: 1.15, margin: 0, letterSpacing: '-0.01em',
            }}>{project.title}</h1>
          </div>
        </div>

        {/* Right: view toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          border: `0.5px solid ${ink}33`,
          borderRadius: 999,
          overflow: 'hidden',
        }}>
          <button onClick={() => { setMode('static'); setIframeLoaded(false); }} style={{
            all: 'unset', cursor: 'pointer',
            fontFamily: mono, fontSize: 10, letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '8px 18px',
            background: mode === 'static' ? accent : 'transparent',
            color: mode === 'static' ? paper : `${ink}99`,
            transition: 'all 0.2s ease',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="1" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="0.8" />
                <line x1="1" y1="4" x2="11" y2="4" stroke="currentColor" strokeWidth="0.6" />
                <line x1="4" y1="4" x2="4" y2="11" stroke="currentColor" strokeWidth="0.6" />
              </svg>
              Static
            </span>
          </button>
          <button onClick={() => { setMode('marimo'); setIframeLoaded(false); }} style={{
            all: 'unset', cursor: 'pointer',
            fontFamily: mono, fontSize: 10, letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '8px 18px',
            background: mode === 'marimo' ? accent : 'transparent',
            color: mode === 'marimo' ? paper : `${ink}99`,
            transition: 'all 0.2s ease',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="0.8" />
                <path d="M4 6L5.5 7.5L8 4.5" stroke="currentColor" strokeWidth="0.8" />
              </svg>
              Marimo
            </span>
          </button>
        </div>
      </header>

      {/* Mode indicator bar */}
      <div className="viewer-bar" style={{
        padding: '10px 40px',
        background: mode === 'marimo' ? `${accent}12` : `${panel}`,
        borderBottom: `0.5px solid ${ink}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: mono, fontSize: 10, letterSpacing: '0.06em',
          color: `${ink}88`,
        }}>
          {mode === 'static' ? (
            <span>
              <span style={{ color: accent }}>●</span> static html · rendered from jupyter notebook · read-only
            </span>
          ) : (
            <span>
              <span style={{ color: '#4ade80' }}>●</span> marimo wasm · interactive notebook · runs in browser via webassembly
            </span>
          )}
        </div>
        <div style={{
          fontFamily: serif, fontStyle: 'italic', fontSize: 12.5,
          color: `${ink}66`,
        }}>
          {mode === 'marimo'
            ? 'First load may take 10–15 s while WebAssembly initializes.'
            : `${project.rows || '—'} rows · ${project.languages?.join(', ') || project.methods?.join(', ')}`}
        </div>
      </div>

      {/* Loading overlay */}
      {!iframeLoaded && (
        <div style={{
          position: 'absolute', top: 140, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 5,
          background: `${paper}ee`,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 36, height: 36, border: `2px solid ${ink}22`,
              borderTop: `2px solid ${accent}`, borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'notebookSpin 0.8s linear infinite',
            }} />
            <div style={{
              fontFamily: mono, fontSize: 11, color: `${ink}88`,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {mode === 'marimo' ? 'initializing wasm runtime…' : 'rendering notebook…'}
            </div>
          </div>
        </div>
      )}

      {/* Notebook iframe */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <iframe
          key={mode}
          src={currentSrc}
          onLoad={() => setIframeLoaded(true)}
          style={{
            width: '100%', height: '100%',
            border: 'none',
            position: 'absolute', top: 0, left: 0,
            background: mode === 'static' ? '#fff' : paper,
          }}
          title={`${project.title} — ${mode === 'static' ? 'Static View' : 'Marimo Interactive'}`}
        />
      </div>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes notebookSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
