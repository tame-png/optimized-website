import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CertificateCard, ProjectCard } from '../components/Cards.jsx';
import { Bathymetry, Kpi } from '../components/Figures.jsx';
import { SectionHead, Wave } from '../components/Layout.jsx';
import { CERTIFICATES, KPIS, PROFILE, PROJECTS, SITE, SKILLS } from '../data.js';
import { asset } from '../lib/paths.js';
import { useSeo } from '../lib/seo.js';
import { TIDES, useTide } from '../tide/tides.js';

const FILTERS = [
  { id: 'all', label: `All work (${PROJECTS.length})` },
  { id: 'marimo', label: 'marimo notebooks' },
  { id: 'r', label: 'R' },
  { id: 'excel', label: 'Excel' },
];

export default function Home() {
  useSeo({ title: SITE.name, description: SITE.description, path: '/' });
  const [filter, setFilter] = useState('all');
  const { tide } = useTide();
  const tideName = TIDES.find((t) => t.id === tide)?.label.toLowerCase();
  const shown = PROJECTS.filter((p) => filter === 'all' || p.runtime === filter);

  return (
    <main className="page wrap" id="main" tabIndex={-1}>
      <section className="hero">
        <div className="plate ticks">
          <span className="t" />
          <div className="plate-head">
            <span>Plate I · San Pedro Bay bathymetry</span>
            <span>{PROFILE.coordinates}</span>
          </div>
          <Bathymetry />
          <div className="plate-cap">
            <span>Now showing: {tideName}, by your clock</span>
            <b>Fig. 0</b>
          </div>
        </div>
        <div>
          <h1>
            Andy <span className="surname">Molina</span>
          </h1>
          <p className="lede">
            Applied statistics at Long Beach State. I turn public microdata, freeway sensors and marketplace scrapes into
            reproducible notebooks that run in your browser.
          </p>
          <p className="sub">{PROFILE.tagline}</p>
          <div className="actions">
            <Link className="btn primary" to="/notebooks">
              Open the notebooks
            </Link>
            <Link className="btn" to="/resume">
              Read the resume
            </Link>
            <a className="btn ghost" href={asset(PROFILE.resumePdf)} download>
              Resume PDF ↓
            </a>
          </div>
          <div className="kpis">
            {KPIS.map((kpi) => (
              <Kpi key={kpi.label} {...kpi} />
            ))}
          </div>
        </div>
      </section>

      <Wave />

      <SectionHead title="Index of works" aside="newest first" />
      <div className="filter">
        <div className="chips">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" className="chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {shown.length ? (
        <div className="grid">
          {shown.map((p) => (
            <ProjectCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <p className="empty">Nothing in that category yet.</p>
      )}

      <SectionHead title="Certificates" aside="newest first" />
      <div className="grid-3">
        {CERTIFICATES.map((c) => (
          <CertificateCard key={c.title} c={c} />
        ))}
      </div>

      <SectionHead title="Tools I work with" />
      <div className="skills">
        {Object.entries(SKILLS).map(([group, items]) => (
          <div key={group}>
            <h4>{group}</h4>
            <div className="tools" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {items.map((item) => (
                <span key={item} className="pill neutral">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
