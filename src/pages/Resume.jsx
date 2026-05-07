import React from 'react';
import { Link } from 'react-router-dom';
import { MONO, SKILLS } from '../data';

export default function Resume({ theme, fontStack }) {
  const { ink, accent, paper, panel } = theme;
  const serif = fontStack.serif;
  const display = fontStack.display || serif;
  const mono = MONO;

  React.useEffect(() => { document.title = 'Résumé · Andy Molina'; }, []);

  const PERSON = {
    name: 'Andy Molina',
    location: 'Long Beach, CA',
    email: 'AndyxMolina@outlook.com',
    phone: '(714) 679-6494',
    role: 'Applied Statistics · Data Science'
  };
  const EDUCATION = {
    school: 'California State University, Long Beach',
    degree: 'Bachelor of Science, Applied Statistics',
    expected: 'Expected May 2028',
    gpa: '3.38'
  };
  const PROJECTS = [
    {
      fig: 'I',
      title: 'Long Beach Racial & Health Equity Research',
      role: 'Data Scientist',
      dates: 'Jun – Sep 2025',
      org: 'City of Long Beach · CSULB',
      href: '/lbrhe',
      bullets: [
        'Directed by the City of Long Beach to update inequality boards using current U.S. Census data, contributing to the analysis of pressing socio-economic issues and policy-making decisions in the city.',
        'Used the Tidycensus package in R to extract Public Use Microdata Sample (PUMS) data, enhancing data-driven insights for city planning and resource allocation.',
        'Processed and cleaned 5M+ rows of census data, focusing on 500+ relevant variables for Long Beach, streamlining data for efficient analysis and decision-making.',
        'Developed new, custom variables to address socio-economic challenges unique to Long Beach, ensuring the data captured the nuances of local issues.',
        'Created interactive Tableau dashboards that visualized key findings, making complex data accessible to both city officials and residents.',
        'Collaborated with cross-functional teams — local government and social scientists — to ensure findings were actionable and aligned with city objectives.'
      ]
    },
    {
      fig: 'II',
      title: 'Insights for Profitability in the App Store & Google Play',
      role: 'Data Scientist',
      dates: 'Jun – Sep 2025',
      org: 'Independent project',
      bullets: [
        'Conducted comprehensive market research to identify profitable app profiles and the characteristics that drive success in the App Store and Google Play markets.',
        'Analyzed app features, user demographics, and market trends using Python (Pandas, NumPy) for data manipulation and insights extraction.',
        'Leveraged data visualization tools (Matplotlib, Seaborn) to create clear, actionable reports for stakeholders.',
        'Performed sentiment analysis and keyword extraction from app reviews using NLP in Python to inform app optimization strategies.'
      ]
    },
    {
      fig: 'III',
      title: 'eBay Car Sales — Pricing & Market Trends',
      role: 'Data Scientist',
      dates: 'Jun – Sep 2025',
      org: 'Independent project',
      bullets: [
        'Used Python (Pandas, NumPy) to clean, preprocess, and manipulate the raw data for analysis.',
        'Conducted exploratory data analysis (EDA) to identify key features affecting car prices, including make, model, year, and mileage.',
        'Visualized trends and patterns using Matplotlib and Seaborn, producing interactive and clear data visualizations for stakeholders.',
        'Applied regression analysis to predict car prices based on various features, achieving a clear understanding of price determinants.'
      ]
    }
  ];
  const EXPERIENCE = [
    {
      title: 'Crew Member',
      org: "McDonald's",
      dates: 'January 2022 – Present',
      bullets: [
        'Provided exceptional customer service, ensuring quick and accurate order processing in a fast-paced environment.',
        'Maintained cleanliness of workstations and dining areas while assisting with inventory management and restocking supplies.'
      ]
    }
  ];

  function Ornament() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '20px 0', color: `${ink}55` }}>
        <div style={{ flex: 1, borderTop: `0.5px solid ${ink}55` }} />
        <svg width="60" height="14" viewBox="0 0 60 14">
          <line x1="0" y1="7" x2="20" y2="7" stroke={ink} strokeWidth="0.4" />
          <circle cx="30" cy="7" r="1.5" fill={accent} />
          <circle cx="22" cy="7" r="0.7" fill={ink} opacity="0.6" />
          <circle cx="38" cy="7" r="0.7" fill={ink} opacity="0.6" />
          <line x1="40" y1="7" x2="60" y2="7" stroke={ink} strokeWidth="0.4" />
        </svg>
        <div style={{ flex: 1, borderTop: `0.5px solid ${ink}55` }} />
      </div>
    );
  }

  function SectionHead({ roman, label }) {
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 18 }}>
        <span style={{
          fontFamily: display, fontStyle: 'italic', fontSize: 36, color: accent,
          lineHeight: 1, letterSpacing: '-0.01em'
        }}>§ {roman}</span>
        <span style={{
          fontFamily: mono, fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: `${ink}99`
        }}>{label}</span>
        <div style={{ flex: 1, borderBottom: `0.5px solid ${ink}55`, marginBottom: 6 }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: paper, color: ink, fontFamily: serif, padding: '40px 0' }}>
      <article className="resume-article" style={{
        maxWidth: 1080, margin: '0 auto', background: paper,
        border: `0.5px solid ${ink}33`, padding: '60px 72px 80px',
        position: 'relative'
      }}>
        {/* Corner ticks */}
        {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([cx, cy], i) =>
          <div key={i} style={{
            position: 'absolute',
            top: cy ? 'auto' : -1, bottom: cy ? -1 : 'auto',
            left: cx ? 'auto' : -1, right: cx ? -1 : 'auto',
            width: 14, height: 14,
            borderTop: cy ? 'none' : `1.5px solid ${accent}`,
            borderBottom: cy ? `1.5px solid ${accent}` : 'none',
            borderLeft: cx ? 'none' : `1.5px solid ${accent}`,
            borderRight: cx ? `1.5px solid ${accent}` : 'none'
          }} />
        )}

        {/* Masthead */}
        <header style={{
          borderTop: `2px solid ${ink}`, borderBottom: `0.5px solid ${ink}55`,
          paddingTop: 14, paddingBottom: 14,
          display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'baseline',
          fontFamily: mono, fontSize: 10.5, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: `${ink}cc`
        }}>
          <Link to="/" style={{ color: accent }}>← back to portfolio</Link>
          <span style={{ letterSpacing: '0.18em', textAlign: 'center' }}>Molina</span>
          <span style={{ textAlign: 'right' }}>Long Beach, CA</span>
        </header>

        {/* Title block */}
        <section className="resume-title-block" style={{
          display: 'grid', gridTemplateColumns: '200px 1fr',
          gap: 40, marginTop: 56, marginBottom: 56
        }}>
          <aside style={{
            fontFamily: mono, fontSize: 9.5, lineHeight: 1.7,
            color: `${ink}88`, paddingTop: 8,
            letterSpacing: '0.04em', textTransform: 'uppercase'
          }}>
            <div style={{ borderTop: `0.5px solid ${ink}55`, paddingTop: 8 }}>
              <div>Telephone</div>
              <div style={{ color: ink, marginTop: 2, textTransform: 'none', letterSpacing: 0, fontFamily: mono }}>
                {PERSON.phone}
              </div>
            </div>
            <div style={{ marginTop: 18 }}>
              <div>Electronic post</div>
              <div style={{ color: accent, marginTop: 2, textTransform: 'none', letterSpacing: 0, fontFamily: mono, fontSize: 9.5 }}>
                {PERSON.email}
              </div>
            </div>
            <div style={{ marginTop: 18 }}>
              <div>City of residence</div>
              <div style={{ color: ink, marginTop: 2, textTransform: 'none', letterSpacing: 0 }}>
                {PERSON.location}
              </div>
            </div>
            <div style={{ marginTop: 18 }}>
              <div>Status</div>
              <div style={{
                color: ink, marginTop: 2, textTransform: 'none', letterSpacing: 0,
                fontFamily: serif, fontStyle: 'italic'
              }}>
                Available for summer 2026 internships in data science.
              </div>
            </div>
          </aside>

          <div>
            <div style={{
              fontFamily: mono, fontSize: 10, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: accent, marginBottom: 12
            }}>{PERSON.role}</div>
            <h1 style={{
              fontFamily: display, fontWeight: 400, fontSize: 84,
              lineHeight: 0.95, letterSpacing: '-0.022em',
              margin: 0, textWrap: 'balance'
            }}>
              Andy{' '}
              <em style={{ color: accent, fontStyle: 'italic' }}>Molina</em>
            </h1>
            <div style={{
              marginTop: 22, fontSize: 19, lineHeight: 1.5,
              color: `${ink}cc`, maxWidth: '38em', fontStyle: 'italic'
            }}>
              A one-page account of the work, the skills, and the schooling
              of one Long Beach undergraduate, lately of <span style={{ fontStyle: 'normal' }}>CSULB</span>,{' '}
              hereunder set down in plain order for the convenience of any
              hiring party who may chance to read it.
            </div>
          </div>
        </section>

        {/* Education */}
        <SectionHead roman="i" label="education" />
        <section className="resume-education" style={{
          display: 'grid', gridTemplateColumns: '200px 1fr 200px',
          gap: 40, alignItems: 'baseline'
        }}>
          <div style={{
            fontFamily: mono, fontSize: 9.5,
            color: `${ink}77`, letterSpacing: '0.06em',
            textTransform: 'uppercase', paddingTop: 4
          }}>2024 — present</div>
          <div>
            <h3 style={{
              fontFamily: display, fontWeight: 500, fontSize: 28,
              margin: '0 0 4px', letterSpacing: '-0.005em', lineHeight: 1.15
            }}>{EDUCATION.school}</h3>
            <div style={{
              fontFamily: serif, fontStyle: 'italic',
              fontSize: 17, color: `${ink}c0`, marginBottom: 6
            }}>{EDUCATION.degree}</div>
            <div style={{
              fontFamily: mono, fontSize: 10.5, color: `${ink}88`, letterSpacing: '0.04em'
            }}>{EDUCATION.expected} · GPA {EDUCATION.gpa}</div>
          </div>
          <div style={{
            border: `0.5px solid ${ink}55`, padding: '12px 14px',
            background: panel, textAlign: 'center'
          }}>
            <div style={{
              fontFamily: mono, fontSize: 9, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: `${ink}88`, marginBottom: 4
            }}>Cumulative</div>
            <div style={{
              fontFamily: display, fontStyle: 'italic',
              fontSize: 36, color: accent, lineHeight: 1
            }}>{EDUCATION.gpa}</div>
            <div style={{
              fontFamily: serif, fontStyle: 'italic',
              fontSize: 11, color: `${ink}88`, marginTop: 4
            }}>grade-point average</div>
          </div>
        </section>

        <Ornament />

        {/* Skills */}
        <SectionHead roman="ii" label="apparatus & languages" />
        <section className="resume-skills" style={{
          display: 'grid', gridTemplateColumns: '200px 1fr 1fr 1fr',
          gap: 28, marginBottom: 24
        }}>
          <div style={{
            fontFamily: serif, fontStyle: 'italic',
            color: `${ink}88`, fontSize: 13, lineHeight: 1.55, paddingTop: 4
          }}>
            The instruments by which the author makes contact with data,
            arranged for convenience.
          </div>
          {Object.entries(SKILLS).map(([cat, items]) =>
            <div key={cat}>
              <div style={{
                fontFamily: display, fontStyle: 'italic',
                fontSize: 18, color: ink, marginBottom: 10,
                borderBottom: `0.5px solid ${ink}55`, paddingBottom: 6
              }}>{cat}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {items.map((item) =>
                  <span key={item} style={{
                    fontFamily: mono, fontSize: 10.5,
                    color: `${ink}d0`, padding: '3px 8px',
                    border: `0.5px solid ${ink}44`, letterSpacing: '0.02em'
                  }}>{item}</span>
                )}
              </div>
            </div>
          )}
        </section>

        <Ornament />

        {/* Projects */}
        <SectionHead roman="iii" label="projects & extracurricular" />
        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {PROJECTS.map((p, idx) =>
            <li key={p.fig} className="resume-project" style={{
              display: 'grid', gridTemplateColumns: '200px 1fr',
              gap: 40, alignItems: 'start',
              padding: '26px 0',
              borderTop: idx === 0 ? 'none' : `0.5px solid ${ink}33`
            }}>
              <aside style={{
                fontFamily: mono, fontSize: 9.5, lineHeight: 1.7,
                color: `${ink}88`, paddingTop: 4,
                letterSpacing: '0.04em', textTransform: 'uppercase'
              }}>
                <div style={{
                  fontFamily: display, fontStyle: 'italic',
                  fontSize: 30, color: accent,
                  lineHeight: 1, textTransform: 'none', letterSpacing: 0,
                  marginBottom: 6
                }}>№ {p.fig}</div>
                <div>{p.dates}</div>
                <div style={{
                  color: ink, marginTop: 4, textTransform: 'none',
                  letterSpacing: 0, fontFamily: serif, fontStyle: 'italic', fontSize: 12
                }}>{p.org}</div>
                {p.href &&
                  <Link to={p.href} style={{
                    display: 'inline-block', marginTop: 10,
                    fontFamily: mono, fontSize: 10, color: accent,
                    textTransform: 'none', letterSpacing: 0,
                    borderBottom: `0.5px solid ${accent}55`, paddingBottom: 1
                  }}>read deep dive →</Link>
                }
              </aside>
              <div>
                <h3 style={{
                  fontFamily: display, fontWeight: 500, fontSize: 24,
                  margin: '0 0 4px', letterSpacing: '-0.005em',
                  lineHeight: 1.2, textWrap: 'balance'
                }}>{p.title}</h3>
                <div style={{
                  display: 'flex', gap: 14, alignItems: 'baseline',
                  fontFamily: serif, fontStyle: 'italic', fontSize: 14,
                  color: `${ink}99`, marginBottom: 12
                }}>
                  <span>{p.role}</span>
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {p.bullets.map((b, i) =>
                    <li key={i} style={{
                      position: 'relative', paddingLeft: 24,
                      fontFamily: serif, fontSize: 15.5, lineHeight: 1.55,
                      color: `${ink}d8`, marginBottom: 6
                    }}>
                      <span style={{
                        position: 'absolute', left: 0, top: 0,
                        fontFamily: display, fontStyle: 'italic',
                        color: accent, fontSize: 14
                      }}>§</span>
                      {b}
                    </li>
                  )}
                </ul>
              </div>
            </li>
          )}
        </ol>

        <Ornament />

        {/* Experience */}
        <SectionHead roman="iv" label="professional experience" />
        {EXPERIENCE.map((e) =>
          <section key={e.title} className="resume-experience" style={{
            display: 'grid', gridTemplateColumns: '200px 1fr',
            gap: 40, alignItems: 'start'
          }}>
            <aside style={{
              fontFamily: mono, fontSize: 9.5, lineHeight: 1.7,
              color: `${ink}88`, paddingTop: 4,
              letterSpacing: '0.04em', textTransform: 'uppercase'
            }}>
              <div>{e.dates}</div>
              <div style={{
                color: ink, marginTop: 4, textTransform: 'none',
                letterSpacing: 0, fontFamily: serif, fontStyle: 'italic', fontSize: 12
              }}>{e.org}</div>
            </aside>
            <div>
              <h3 style={{
                fontFamily: display, fontWeight: 500, fontSize: 22,
                margin: '0 0 4px', letterSpacing: '-0.005em'
              }}>
                {e.title}{' '}
                <span style={{
                  fontFamily: serif, fontStyle: 'italic',
                  color: `${ink}88`, fontSize: 16, fontWeight: 400
                }}>— {e.org}</span>
              </h3>
              <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0 }}>
                {e.bullets.map((b, i) =>
                  <li key={i} style={{
                    position: 'relative', paddingLeft: 24,
                    fontFamily: serif, fontSize: 15.5, lineHeight: 1.55,
                    color: `${ink}d8`, marginBottom: 6
                  }}>
                    <span style={{
                      position: 'absolute', left: 0, top: 0,
                      fontFamily: display, fontStyle: 'italic',
                      color: accent, fontSize: 14
                    }}>§</span>
                    {b}
                  </li>
                )}
              </ul>
            </div>
          </section>
        )}

        {/* Colophon */}
        <footer className="resume-colophon" style={{
          marginTop: 64, paddingTop: 16,
          borderTop: `2px solid ${ink}`,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          fontFamily: mono, fontSize: 9.5,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: `${ink}99`
        }}>
          <span>© mmxxvi {PERSON.name}</span>
          <span style={{ textAlign: 'center' }}>set in Spectral & JetBrains Mono</span>
          <a href={`mailto:${PERSON.email}`} style={{ textAlign: 'right', color: accent }}>{PERSON.email}</a>
        </footer>
      </article>

      {/* Print button */}
      <div className="no-print" style={{
        maxWidth: 1080, margin: '24px auto 0', padding: '0 64px', textAlign: 'center'
      }}>
        <button onClick={() => window.print()} style={{
          all: 'unset', cursor: 'pointer',
          fontFamily: mono, fontSize: 10.5, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: accent,
          border: `0.5px solid ${accent}`, padding: '10px 20px',
          background: 'transparent'
        }}>print this sheet</button>
      </div>
    </div>
  );
}
