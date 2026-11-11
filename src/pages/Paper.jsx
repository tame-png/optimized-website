import { Link } from 'react-router-dom';
import { SectionHead } from '../components/Layout.jsx';
import { asset } from '../lib/paths.js';
import { useSeo } from '../lib/seo.js';

// Share of residents by race and ethnicity, Long Beach, ACS 2023 (percent).
const RESIDENTS = [
  ['Latinx', 41],
  ['White', 30],
  ['AAPI', 15],
  ['Black', 9],
  ['Other', 5],
];

// Insured share by neighborhood: [name, lowest income quintile, highest income quintile] (percent).
const INSURED = [
  ['West LB', 78.2, 94.1],
  ['North LB', 80.4, 95],
  ['Central LB', 75.8, 92.8],
  ['East LB', 91.2, 97.6],
];

const PIPELINE = `library(tidycensus)
library(dplyr)
library(srvyr)

lb_pumas <- c("03764", "03765", "03766", "03767")
pums_raw <- get_pums(
  variables = c("PUMA", "AGEP", "RAC1P", "HISP", "HICOV", "POVPIP", "GRPIP", "LANX"),
  state = "CA", survey = "acs5", year = 2024, rep_weights = "person"
)

lb_equity <- pums_raw |>
  filter(PUMA %in% lb_pumas) |>
  mutate(
    severe_rent_burden = if_else(GRPIP >= 30, 1L, 0L),
    uninsured_flag     = if_else(HICOV == "2", 1L, 0L),
    equity_priority_ix = severe_rent_burden * 0.45 + uninsured_flag * 0.35 + (POVPIP < 150) * 0.20
  )`;

const label = { textAlign: 'right', color: 'var(--ink-muted)' };
const caption = { fontSize: 14, fontStyle: 'italic' };

export default function Paper() {
  useSeo({
    title: 'Racial and health equity in Long Beach',
    description:
      'Working paper: five million ACS PUMS rows read with tidycensus in R for the City of Long Beach, four neighborhoods compared, presented at the CSULB Student Research Symposium 2025.',
    path: '/paper/lbrhe',
  });

  return (
    <main className="page wrap" id="main" tabIndex={-1}>
      <p style={{ margin: '18px 0 0' }}>
        <Link to="/" className="btn ghost">
          ← Portfolio
        </Link>
      </p>
      <article className="paper">
        <span className="pill gold">Commissioned by the City of Long Beach</span>
        <h1>Racial and health equity in Long Beach</h1>
        <p className="standfirst">
          A reading of the 2023 American Community Survey, narrowed to four neighborhoods and the people inside them.
          Built in R with tidycensus from five million PUMS rows; delivered as Tableau dashboards for city officials and
          residents.
        </p>
        <dl className="meta">
          <div>
            <dt>Partner</dt>
            <dd>Department of Health and Human Services, City of Long Beach</dd>
          </div>
          <div>
            <dt>Presented</dt>
            <dd>CSULB Student Research Symposium, poster 28, September 2025</dd>
          </div>
          <div>
            <dt>Data</dt>
            <dd>ACS 1-year PUMS, 2021 and 2023, 5,000,000+ rows, 500+ variables</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>Data scientist; faculty mentor Dr. Seungjoon Lee</dd>
          </div>
          <div>
            <dt>Team</dt>
            <dd>
              With Robby Born and Nicholas Andrade (CSULB), Michelle Ibanez, Marine Karapetyan and John Seng (Long Beach
              City College), Torriano Knight and Hernan Zelaya
            </dd>
          </div>
          <div>
            <dt>Files</dt>
            <dd>
              <a href={asset('paper/lbrhe-presentation.pdf')} target="_blank" rel="noreferrer">
                Presentation slides (PDF, 8 MB)
              </a>
              {' · '}
              <a href={asset('paper/cnsm-symposium-abstract-booklet-2025.pdf')} target="_blank" rel="noreferrer">
                Symposium abstract booklet
              </a>
            </dd>
          </div>
        </dl>

        <SectionHead title="Who lives here" />
        {RESIDENTS.map(([group, share]) => (
          <div key={group} className="hbar">
            <span style={label}>{group}</span>
            <div className="track">
              {/* 2.2 scales the largest share (41%) to about 90% of the track */}
              <div className="bar" style={{ width: `${share * 2.2}%` }} />
            </div>
            <b>{share}%</b>
          </div>
        ))}
        <p className="muted" style={caption}>
          Share of residents by race and ethnicity, Long Beach, ACS 2023.
        </p>

        <SectionHead title="Who is insured" />
        <p>
          Health insurance coverage for the lowest and highest income quintiles, by neighborhood. The gap is widest in
          Central and West Long Beach and nearly closed near the campus.
        </p>
        {INSURED.map(([place, low, high]) => (
          <div key={place} className="hbar two">
            <span style={label}>{place}</span>
            <div className="track">
              <div className="bar" style={{ width: `${low}%`, background: 'var(--signal)' }} />
              <div className="bar hi" style={{ width: `${high}%` }} />
            </div>
            <b>
              {low}% → {high}%
            </b>
          </div>
        ))}
        <p className="muted" style={caption}>
          Insured share, low-income quintile (terracotta) and high-income quintile (gold).
        </p>

        <SectionHead title="How it was built" />
        <p>
          Replicate weights from the PUMS let each estimate carry a proper standard error, so the dashboards show margins
          rather than point estimates alone. The pipeline is one R script; the first forty lines are below, and the
          script itself is listed under{' '}
          <Link to="/files" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
            R and Excel
          </Link>
          .
        </p>
        <details className="drawer" open>
          <summary>
            <span>tidycensus_lbrhe_pums.R</span>
            <span>R 4.4 · tidycensus, dplyr, srvyr</span>
          </summary>
          <pre>{PIPELINE}</pre>
        </details>
      </article>
    </main>
  );
}
