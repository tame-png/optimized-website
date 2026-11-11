import { Link } from 'react-router-dom';
import { asset } from '../lib/paths.js';
import { Figure } from './Figures.jsx';

const pillRow = { display: 'flex', gap: 6, flexWrap: 'wrap' };

/** One entry in the index of works. The whole card is the link. */
export function ProjectCard({ p }) {
  const to = p.slug ? `/notebooks/${p.slug}` : (p.href ?? '/');
  const action = p.kind === 'notebook' ? 'Open the notebook' : p.kind === 'paper' ? 'Read the working paper' : 'See the workbook';
  return (
    <Link to={to} className={`card${p.flagship ? ' flagship' : ''}`}>
      <div className="plate">
        <div className="plate-head">
          <span>{p.runtimeLabel}</span>
          <span>{p.year}</span>
        </div>
        <Figure kind={p.figure} />
      </div>
      <div>
        <div className="tools">
          {p.tools.map((tool) => (
            <span key={tool} className="pill neutral">
              {tool}
            </span>
          ))}
        </div>
        <h3>{p.title}</h3>
        <p>{p.blurb}</p>
        <div className="foot">
          <span>{p.outcome}</span>
          <span className="go">{action}</span>
        </div>
      </div>
    </Link>
  );
}

/** Verified only with an issuer link, issued with a PDF, otherwise pending. Never claims more. */
export function CertificateCard({ c }) {
  const state = c.verifyHref ? 'verified' : c.pdfHref ? 'issued' : 'pending';
  return (
    <article className={`cert${state === 'pending' ? ' pending' : ''}`}>
      <div className="thumb">
        {c.thumb ? (
          <img src={asset(c.thumb)} alt={`${c.title}, first page`} loading="lazy" />
        ) : (
          <span>{state === 'pending' ? c.expected : 'PDF, no preview yet'}</span>
        )}
        {state === 'verified' && (
          <span className="seal" aria-hidden="true">
            ✓
          </span>
        )}
      </div>
      <div>
        <div className="issuer">{c.issuer}</div>
        <h3>{c.title}</h3>
      </div>
      <div className="row">
        <span>{c.date ? <>Completed {c.date}</> : <>Not yet completed</>}</span>
        <span className={`status${state === 'verified' ? ' ok' : ''}`}>
          {state === 'verified' ? 'Verified ✓' : state === 'issued' ? 'Issued' : c.expected}
        </span>
      </div>
      {c.credentialId && (
        <div className="row">
          <span>
            Credential ID <b>{c.credentialId}</b>
          </span>
        </div>
      )}
      <div className="tools" style={pillRow}>
        {c.skills.map((skill) => (
          <span key={skill} className="pill neutral">
            {skill}
          </span>
        ))}
      </div>
      <div className="foot">
        {c.verifyHref ? (
          <a className="btn sm" href={c.verifyHref} target="_blank" rel="noreferrer">
            Verify with the issuer
          </a>
        ) : (
          <span className="muted" style={{ fontSize: 13, fontStyle: 'italic' }}>
            {c.note ?? ''}
          </span>
        )}
        {c.pdfHref && (
          <a className="btn sm ghost" href={asset(c.pdfHref)} target="_blank" rel="noreferrer">
            PDF
          </a>
        )}
      </div>
    </article>
  );
}

const GLYPH = { xlsx: 'XLSX', r: 'R' };

/** A stand-alone R script or Excel workbook. */
export function FileCard({ f }) {
  return (
    <article className="file" data-kind={f.kind}>
      <div className="glyph" aria-hidden="true">
        {GLYPH[f.kind]}
      </div>
      <div>
        <div className="name">{f.filename}</div>
        <div className="meta">
          {f.size} · {f.project}
        </div>
        <p className="look">
          <strong>What to look at:</strong> {f.look}
        </p>
        {f.sheets && (
          <div className="tools" style={{ ...pillRow, marginBottom: 10 }}>
            {f.sheets.map((sheet) => (
              <span key={sheet} className="pill neutral">
                {sheet}
              </span>
            ))}
          </div>
        )}
        <div className="actions">
          {f.href ? (
            <a className="btn sm" href={asset(f.href)} download>
              Download .{f.kind}
            </a>
          ) : (
            <span className="muted" style={{ fontSize: 14, fontStyle: 'italic' }}>
              File not yet published; described from the working copy.
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/** A CSV that ships with a notebook, with its source and an optional first-rows preview. */
export function DatasetCard({ d, href }) {
  return (
    <article className="file" data-kind="csv">
      <div className="glyph" aria-hidden="true">
        CSV
      </div>
      <div>
        <div className="name">{d.filename}</div>
        <div className="meta">
          {d.size} · {d.rows} rows ·{' '}
          {d.sourceHref ? (
            <a href={d.sourceHref} target="_blank" rel="noreferrer">
              {d.source}
            </a>
          ) : (
            d.source
          )}
        </div>
        <p className="look">
          <strong>What to look at:</strong> {d.look}
        </p>
        <div className="actions">
          <a className="btn sm" href={href} download>
            Download .csv
          </a>
        </div>
        {d.preview && (
          <table>
            <thead>
              <tr>
                {d.preview.columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.preview.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((value, j) => (
                    <td key={j}>{String(value)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </article>
  );
}
