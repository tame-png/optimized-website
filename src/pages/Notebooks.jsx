import { ProjectCard } from '../components/Cards.jsx';
import { SectionHead } from '../components/Layout.jsx';
import { PROJECTS } from '../data.js';
import { useSeo } from '../lib/seo.js';

export default function Notebooks() {
  useSeo({
    title: 'Notebooks',
    description:
      'Three marimo notebooks, each with saved outputs, a live Python runtime in the browser, the data and the source: I-94 traffic, app-store profiles, eBay used cars.',
    path: '/notebooks',
  });
  const notebooks = PROJECTS.filter((p) => p.kind === 'notebook');

  return (
    <main className="page wrap" id="main" tabIndex={-1}>
      <SectionHead title="Notebooks" aside="marimo, exported to WebAssembly" />
      <p className="measure" style={{ fontSize: 18, marginTop: 0 }}>
        Each notebook is a marimo file. Open one to read the brief, see the saved outputs, run the Python live in your
        browser, or read the cells; the data ships with the page and can be downloaded from its drawer.
      </p>
      <div className="grid">
        {notebooks.map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>
    </main>
  );
}
