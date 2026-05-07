import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PERSON, PROJECTS, MONO } from '../data';
import { NavBar, ArtImage, FigureFocus, SiteFooter } from '../components/Components';

export default function Notebooks({ theme, fontStack }) {
  const { ink, accent, paper, panel } = theme;
  const P = PERSON;
  const projects = PROJECTS;
  const serif = fontStack.serif;
  const display = fontStack.display || serif;
  const mono = MONO;
  const navigate = useNavigate();

  const [query, setQuery] = React.useState('');
  const [focused, setFocused] = React.useState(null);

  const filtered = projects.filter((p) =>
    !query.trim() ||
    (p.title + ' ' + p.field + ' ' + p.methods.join(' ') + ' ' + p.blurb)
      .toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ background: paper, color: ink, fontFamily: serif, minHeight: '100vh', position: 'relative' }}>
      <NavBar ink={ink} accent={accent} mono={mono} active="notebooks" />

      <section className="notebooks-header" style={{ padding: '52px 56px 0' }}>
        <div style={{
          fontFamily: mono, fontSize: 10, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: accent, marginBottom: 12,
        }}>Index of notebooks · {filtered.length} entries</div>
        <h1 style={{
          fontFamily: display, fontWeight: 400, fontSize: 64,
          lineHeight: 0.96, letterSpacing: '-0.025em',
          margin: '0 0 16px', textWrap: 'balance',
        }}>
          All <em style={{ color: accent, fontStyle: 'italic' }}>notebooks.</em>
        </h1>
        <p style={{
          fontSize: 19, lineHeight: 1.55, color: `${ink}bb`,
          maxWidth: '42em', margin: '0 0 32px',
        }}>
          Each notebook is a self-contained investigation — civic datasets,
          market surveys, traffic logs, NLP experiments. Click any card
          to read the figure and summary.
        </p>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: panel, padding: '10px 16px',
          border: `0.5px solid ${ink}22`, maxWidth: 420, borderRadius: 999,
          marginBottom: 48,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="5" cy="5" r="3.5" stroke={ink} strokeWidth="0.8" opacity="0.6" />
            <line x1="7.5" y1="7.5" x2="10" y2="10" stroke={ink} strokeWidth="0.8" opacity="0.6" />
          </svg>
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="search notebooks…"
            style={{
              flex: 1, border: 'none', background: 'transparent',
              fontFamily: serif, fontStyle: 'italic',
              fontSize: 14, color: ink, outline: 'none',
            }} />
          {query && (
            <button onClick={() => setQuery('')} style={{
              all: 'unset', color: accent, fontFamily: mono,
              fontSize: 11, cursor: 'pointer',
            }}>clear</button>
          )}
        </div>
      </section>

      <section className="notebooks-cards" style={{ padding: '0 56px 60px' }}>
        <div className="cards-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '48px 36px',
        }}>
          {filtered.map((p) => (
            <article key={p.id} onClick={() => {
              if (p.href) { navigate(p.href); }
              else { setFocused(p); }
            }} style={{ cursor: 'pointer' }}>
              <div style={{
                aspectRatio: '3 / 2', overflow: 'hidden',
                background: panel, border: `0.5px solid ${ink}22`,
                marginBottom: 14, position: 'relative',
              }}>
                <ArtImage artKey={p.art} />
                <div style={{
                  position: 'absolute', top: 12, left: 12,
                  background: paper, color: ink, padding: '4px 10px',
                  fontFamily: mono, fontSize: 9.5, letterSpacing: '0.08em',
                  textTransform: 'uppercase', border: `0.5px solid ${ink}33`,
                }}>{p.field} · {p.year}</div>
              </div>
              <div style={{
                fontFamily: mono, fontSize: 9.5, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: accent, marginBottom: 6,
              }}>Notebook № {p.fig}</div>
              <h3 style={{
                fontFamily: display, fontWeight: 500,
                fontSize: 28, lineHeight: 1.1, margin: '0 0 6px',
                letterSpacing: '-0.01em', textWrap: 'balance',
              }}>{p.title}</h3>
              <div style={{
                fontFamily: serif, fontStyle: 'italic',
                color: `${ink}88`, fontSize: 13, marginBottom: 10,
              }}>{p.role}</div>
              <p style={{
                fontFamily: serif, fontSize: 16, lineHeight: 1.55,
                color: `${ink}c0`, margin: '0 0 14px',
              }}>{p.blurb}</p>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                paddingTop: 12, borderTop: `0.5px solid ${ink}22`,
              }}>
                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: 6,
                  fontFamily: mono, fontSize: 10, color: `${ink}aa`, flex: 1,
                }}>
                  {[...new Set([...p.methods, ...p.tools])].slice(0, 6).map((m) => (
                    <span key={m} style={{
                      padding: '3px 8px', border: `0.5px solid ${ink}33`, borderRadius: 2
                    }}>{m}</span>
                  ))}
                </div>
                <span style={{
                  fontFamily: mono, fontSize: 13, fontWeight: 500,
                  color: accent, whiteSpace: 'nowrap', textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>{p.href ? 'deep dive →' : 'figure →'}</span>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            fontFamily: serif, fontStyle: 'italic',
            fontSize: 18, color: `${ink}88`,
          }}>
            No notebooks match "{query}".
          </div>
        )}
      </section>

      <SiteFooter ink={ink} accent={accent} serif={serif} mono={mono} P={P} />

      {focused && (
        <FigureFocus project={focused} theme={theme}
          onClose={() => setFocused(null)} />
      )}
    </div>
  );
}
