import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PERSON, SKILLS, PROJECTS, MONO } from '../data';
import { NavBar, ArtImage, HeroChart, Footnote, FigureFocus, SiteFooter } from '../components/Components';

export default function Home({ theme, fontStack }) {
  const { ink, accent, paper, panel } = theme;
  const P = PERSON;
  const projects = PROJECTS;
  const serif = fontStack.serif;
  const display = fontStack.display || serif;
  const mono = MONO;
  const navigate = useNavigate();

  React.useEffect(() => { document.title = 'Andy Molina — Portfolio'; }, []);

  const [query, setQuery] = React.useState('');
  const [focused, setFocused] = React.useState(null);

  const filtered = projects.filter((p) =>
    !query.trim() ||
    (p.title + ' ' + p.field + ' ' + p.methods.join(' ') + ' ' + p.blurb)
      .toLowerCase().includes(query.toLowerCase())
  );

  const firstFour = filtered.slice(0, 4);

  return (
    <div style={{ background: paper, color: ink, fontFamily: serif, minHeight: '100vh', position: 'relative' }}>
      <NavBar ink={ink} accent={accent} mono={mono} active="home" />

      {/* Hero */}
      <section className="hero-grid" style={{
        display: 'grid', gridTemplateColumns: '5fr 7fr',
        gap: 48, padding: '40px 56px 48px', alignItems: 'end',
      }}>
        <figure style={{ margin: 0 }}>
          <div style={{
            aspectRatio: '4 / 5', overflow: 'hidden',
            background: panel, border: `0.5px solid ${ink}33`,
          }}>
            <ArtImage artKey="longbeach" />
          </div>
          <figcaption style={{
            fontFamily: mono, fontSize: 9.5, marginTop: 10,
            color: `${ink}88`, letterSpacing: '0.04em',
          }}>Frontispiece. Long Beach Civic Center, PUMS dashboard 2025.</figcaption>
        </figure>

        <div>
          <div style={{
            fontFamily: mono, fontSize: 10, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: accent, marginBottom: 18,
          }}>{P.name} · portfolio · 2026</div>
          <h1 style={{
            fontFamily: display, fontWeight: 400, fontSize: 86,
            lineHeight: 0.96, letterSpacing: '-0.025em',
            margin: 0, textWrap: 'balance',
          }}>
            Andy reads<br/>
            <em style={{ color: accent, fontStyle: 'italic' }}>cities,</em><br/>
            and counts.
          </h1>
          <p style={{
            marginTop: 26, fontSize: 20, lineHeight: 1.5,
            color: `${ink}cc`, maxWidth: '34em',
          }}>
            Applied Statistics at CSU Long Beach. A working portfolio of
            statistical readings of everyday life — civic data, market data,
            traffic data
            <Footnote n="1" ink={ink} accent={accent} paper={paper}>
              The author makes no claim that counting things <em>is</em> understanding them.
              Only that it sometimes helps.
            </Footnote>
            . Updated when something interesting falls out of the dataset.
          </p>
        </div>
      </section>

      {/* I-94 interactive chart */}
      <section className="chart-section" style={{
        background: panel,
        borderTop: `0.5px solid ${ink}33`, borderBottom: `0.5px solid ${ink}33`,
        padding: '36px 56px',
      }}>
        <div className="chart-inner" style={{
          display: 'grid', gridTemplateColumns: '1fr 2.5fr',
          gap: 36, alignItems: 'start',
        }}>
          <div>
            <div style={{
              fontFamily: mono, fontSize: 10, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: accent, marginBottom: 8,
            }}>Figure of the week</div>
            <h2 style={{
              fontFamily: display, fontWeight: 500, margin: 0,
              fontSize: 34, lineHeight: 1.05, letterSpacing: '-0.01em',
              textWrap: 'balance',
            }}>One week on <em style={{ color: accent }}>I-94</em>.</h2>
            <p style={{
              fontFamily: serif, fontSize: 15, lineHeight: 1.55,
              color: `${ink}c0`, marginTop: 14, fontStyle: 'italic',
            }}>
              Drag the shaded window. Weekdays carry 4,762 vehicles per
              hour on average; weekends, 1,785. The morning peak is
              earlier and sharper than the evening one.
            </p>
          </div>
          <div>
            <HeroChart ink={ink} accent={accent} paper={paper} height={260} />
          </div>
        </div>
      </section>

      {/* Index of works */}
      <section className="index-section" style={{ padding: '60px 56px 0' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 24, gap: 24, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{
              fontFamily: mono, fontSize: 10, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: `${ink}99`, marginBottom: 6,
            }}>Index of works</div>
            <h2 style={{
              fontFamily: display, fontWeight: 400, fontSize: 52, margin: 0,
              letterSpacing: '-0.015em', lineHeight: 1.0,
            }}>Four recent investigations.</h2>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: panel, padding: '8px 14px',
            border: `0.5px solid ${ink}22`, minWidth: 280, borderRadius: 999,
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="5" cy="5" r="3.5" stroke={ink} strokeWidth="0.8" opacity="0.6" />
              <line x1="7.5" y1="7.5" x2="10" y2="10" stroke={ink} strokeWidth="0.8" opacity="0.6" />
            </svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="search the index"
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
        </div>
      </section>

      <section className="cards-section" style={{ padding: '24px 56px 60px' }}>
        <div className="cards-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '48px 36px',
        }}>
          {firstFour.map((p) => (
            <article key={p.id}
              role="button" tabIndex={0}
              onClick={() => { if (p.href) { navigate(p.href); } else { setFocused(p); } }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (p.href) { navigate(p.href); } else { setFocused(p); } } }}
              style={{ cursor: 'pointer' }}>
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
      </section>

      {/* Skills strip */}
      <section className="skills-strip" style={{
        padding: '36px 56px',
        borderTop: `0.5px solid ${ink}33`,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36,
      }}>
        {Object.entries(SKILLS).map(([cat, items]) => (
          <div key={cat}>
            <div style={{
              fontFamily: mono, fontSize: 10, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: accent, marginBottom: 10,
            }}>{cat}</div>
            <div style={{
              fontFamily: serif, fontSize: 17, lineHeight: 1.5, color: ink,
            }}>{items.join(' · ')}</div>
          </div>
        ))}
      </section>

      <SiteFooter ink={ink} accent={accent} serif={serif} mono={mono} P={P} />

      {focused && (
        <FigureFocus project={focused} theme={theme}
          onClose={() => setFocused(null)} />
      )}
    </div>
  );
}
