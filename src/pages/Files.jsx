import { Link } from 'react-router-dom';
import { FileCard } from '../components/Cards.jsx';
import { SectionHead } from '../components/Layout.jsx';
import { FILES, PROJECTS } from '../data.js';
import { useSeo } from '../lib/seo.js';

export default function Files() {
  useSeo({
    title: 'R and Excel',
    description:
      'Stand-alone R scripts and Excel workbooks: the tidycensus pipeline behind the Long Beach equity paper and the portfolio exit ledger.',
    path: '/files',
  });
  const withData = PROJECTS.filter((p) => p.kind === 'notebook' && p.datasets?.length);

  return (
    <main className="page wrap" id="main" tabIndex={-1}>
      <SectionHead title="R scripts and workbooks" aside="stand-alone work" />
      <p className="measure" style={{ fontSize: 18, marginTop: 0 }}>
        Work that stands on its own outside a notebook: the R pipeline behind the working paper and the Excel ledger.
        Each one says what to open first.
      </p>
      <div style={{ display: 'grid', gap: 16 }}>
        {FILES.map((f) => (
          <FileCard key={f.filename} f={f} />
        ))}
      </div>

      <SectionHead title="Data used by the notebooks" aside="bundled with each notebook" />
      <p className="measure" style={{ fontSize: 16, marginTop: 0 }}>
        The CSV files travel with the notebook that reads them. Open a notebook and use its <em>Data</em> drawer to
        download the file or see its first rows.
      </p>
      <ul className="datalist">
        {withData.map((p) => (
          <li key={p.id}>
            <Link to={`/notebooks/${p.slug}`}>{p.title}</Link>
            <span className="muted">{p.datasets.map((d) => `${d.filename} (${d.size})`).join(' · ')}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
