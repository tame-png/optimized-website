import { EXPERIENCE, PROFILE, SKILLS } from '../data.js';
import { asset, telHref } from '../lib/paths.js';
import { useSeo } from '../lib/seo.js';

const accent = { color: 'var(--accent)' };

function Heading({ children, first = false }) {
  return (
    <h2 className="sec" style={{ margin: first ? '0 0 8px' : '24px 0 8px' }}>
      <span>{children}</span>
      <span className="line" />
    </h2>
  );
}

export default function Resume() {
  useSeo({
    title: 'Resume',
    description: `${PROFILE.name}: ${PROFILE.degree} at ${PROFILE.school}. Education, tools, projects and experience on one page, with the PDF.`,
    path: '/resume',
  });

  return (
    <main className="page wrap" id="main" tabIndex={-1}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
        <a className="btn primary" href={asset(PROFILE.resumePdf)} download>
          Download the PDF
        </a>
        <button type="button" className="btn" onClick={() => window.print()}>
          Print this page
        </button>
      </div>

      <article className="resume">
        <section className="title">
          <aside className="contact">
            <div>
              <small>Telephone</small>
              <a href={telHref(PROFILE.phone)} style={accent}>
                {PROFILE.phone}
              </a>
            </div>
            <div>
              <small>Email</small>
              <a href={`mailto:${PROFILE.email}`} style={accent}>
                {PROFILE.email}
              </a>
            </div>
            <div>
              <small>Code</small>
              <a href={PROFILE.github} target="_blank" rel="noreferrer" style={accent}>
                github.com/tame-png
              </a>
            </div>
            <div>
              <small>Status</small>
              <em>Available for data science and statistical analyst internships.</em>
            </div>
            <div>
              <small>PDF</small>
              <span className="muted">Last revised {PROFILE.resumeUpdated}</span>
            </div>
          </aside>
          <div>
            <h1>
              Andy <span className="surname">Molina</span>
            </h1>
            <p className="lede">
              A one-page account of the civic research, quantitative engineering and statistical schooling of one Long
              Beach undergraduate.
            </p>
          </div>
        </section>

        <Heading first>Education</Heading>
        <div className="row">
          <div className="when">
            2024 – May 2028
            <b>{PROFILE.school}</b>
          </div>
          <div className="edu">
            <div>
              <h3>Bachelor of Science, Applied Statistics</h3>
              <p className="muted" style={{ margin: 0, fontSize: 15 }}>
                Statistical distributions and inference, linear algebra, investments and portfolio management,
                fundamentals of data science in R and Python.
              </p>
            </div>
            <div className="gpa">
              <b>{PROFILE.gpa}</b>
              <small>grade-point average</small>
            </div>
          </div>
        </div>

        <Heading>Tools</Heading>
        <div className="row">
          <div className="when">
            <em>The instruments by which the author makes contact with data.</em>
          </div>
          <div className="tools-cols">
            {Object.entries(SKILLS).map(([group, items]) => (
              <div key={group}>
                <b style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 17 }}>{group}</b>
                <p style={{ margin: '4px 0 0', fontSize: 15 }}>{items.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>

        <Heading>Projects and experience</Heading>
        {EXPERIENCE.map((job) => (
          <div key={job.title} className="row">
            <div className="when">
              {job.when}
              <b>{job.org}</b>
            </div>
            <div>
              <h3>{job.title}</h3>
              <ul>
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </article>
    </main>
  );
}
