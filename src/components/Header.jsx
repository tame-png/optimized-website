import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { PROFILE } from '../data.js';
import TideSwitcher from '../tide/TideSwitcher.jsx';

const LINKS = [
  { to: '/', label: 'Portfolio' },
  { to: '/notebooks', label: 'Notebooks' },
  { to: '/files', label: 'R and Excel' },
  { to: '/certificates', label: 'Certificates' },
  { to: '/resume', label: 'Resume' },
];

export function SkipLink() {
  return (
    <a
      className="skip"
      href="#main"
      onClick={(e) => {
        e.preventDefault();
        document.querySelector('main')?.focus();
      }}
    >
      Skip to content
    </a>
  );
}

/** The ticker strip plus the sticky bar. Under 900px the links and controls fold into a menu. */
export default function Header() {
  const { key: historyKey, pathname } = useLocation();
  const key = `${historyKey}${pathname}`;
  // The menu remembers which page it was opened on, so any navigation closes it.
  const [openOn, setOpenOn] = useState(null);
  const open = openOn === key;
  const button = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpenOn(null);
        button.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div className="ticker">
        <div className="wrap">
          <span>
            <span className="dot" />
            Long Beach, CA
            <span className="tk-wide"> · CSULB applied statistics, class of 2028</span>
            <span className="tk-narrow"> · CSULB statistics, 2028</span>
          </span>
          <span className="right">{PROFILE.coordinates}</span>
        </div>
      </div>
      <header className="nav">
        <nav className="wrap" aria-label="Primary">
          <div className="brand">
            <NavLink to="/" className="brand-name">
              A. Molina
            </NavLink>
            <span className="badge">The Beach</span>
          </div>
          <button
            ref={button}
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpenOn(open ? null : key)}
          >
            <span className="bars" aria-hidden="true" />
            {open ? 'Close' : 'Menu'}
          </button>
          <div id="site-menu" className="nav-menu" data-open={open}>
            <div className="links">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setOpenOn(null)}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className="nav-actions">
              <TideSwitcher />
              <a className="btn sm" href={`mailto:${PROFILE.email}`}>
                Email
              </a>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
