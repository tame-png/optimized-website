import { Link, useLocation } from 'react-router-dom';
import { useSeo } from '../lib/seo.js';

export default function NotFound() {
  const { pathname } = useLocation();
  useSeo({ title: 'Not found', description: 'There is no page at this address.', path: pathname });

  return (
    <main className="page wrap notfound" id="main" tabIndex={-1}>
      <p className="mono muted">404 · no chart on this sheet</p>
      <h1>
        Nothing at <span className="surname">{pathname}</span>.
      </h1>
      <p className="measure">
        The notebooks, the working paper and the resume are all one click away. If a link brought you here, it is
        probably from an older version of the site.
      </p>
      <div className="actions">
        <Link className="btn primary" to="/">
          Portfolio
        </Link>
        <Link className="btn" to="/notebooks">
          Notebooks
        </Link>
        <Link className="btn" to="/resume">
          Resume
        </Link>
      </div>
    </main>
  );
}
