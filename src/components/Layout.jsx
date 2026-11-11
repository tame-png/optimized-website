import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PROFILE } from '../data.js';
import { asset, telHref } from '../lib/paths.js';
import { memory, savedPosition } from '../lib/scroll.js';
import TideSwitcher from '../tide/TideSwitcher.jsx';

/** Section title with a rule and an optional italic aside on the right. */
export function SectionHead({ title, aside }) {
  return (
    <div className="sec">
      <h2>{title}</h2>
      <span className="line" />
      {aside && <span className="aside">{aside}</span>}
    </div>
  );
}

export function Wave() {
  return (
    <div className="wave" aria-hidden="true">
      <svg viewBox="0 0 1200 28" preserveAspectRatio="none">
        <path className="w1" d="M0,14 C150,26 300,2 450,14 C600,26 750,2 900,14 C1050,26 1150,6 1200,14" />
        <path className="w2" d="M0,20 C180,6 320,26 500,16 C680,6 840,26 1020,14 C1120,8 1170,18 1200,20" />
      </svg>
    </div>
  );
}

/** The footer, set as a postcard: a note on the left, the address block and stamp on the right. */
export function Postcard() {
  return (
    <footer className="postcard wrap" style={{ maxWidth: 'var(--page-max)' }}>
      <div className="left">
        <span className="pill neutral">Field postcard · Long Beach, California</span>
        <h3 style={{ marginTop: 10 }}>Greetings from The Beach.</h3>
        <p>
          If you are hiring for data science, statistical modeling or civic analytics, every notebook and R pipeline here
          is reproducible and open for inspection. The site&apos;s colours follow the sun in Long Beach; pin a tide if you
          prefer one.
        </p>
        <TideSwitcher note />
      </div>
      <div>
        <div className="stamp" aria-hidden="true">
          <b>CSULB</b>
          <svg viewBox="0 0 40 30">
            <polygon points="20,4 4,26 36,26" strokeWidth="1" />
          </svg>
          <span>
            LONG BEACH
            <br />
            MMXXVI
          </span>
        </div>
        <div className="addr">
          <div>
            <b>To:</b> hiring team / technical recruiter
          </div>
          <div>
            <b>Post:</b> <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          </div>
          <div>
            <b>Tel:</b> <a href={telHref(PROFILE.phone)}>{PROFILE.phone}</a>
          </div>
          <div>
            <b>Code:</b>{' '}
            <a href={PROFILE.github} target="_blank" rel="noreferrer">
              github.com/tame-png
            </a>
          </div>
          <div>
            <b>CV:</b>{' '}
            <a href={asset(PROFILE.resumePdf)} download>
              resume, PDF
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * On every navigation: open a new page at the top, return to the saved position on
 * Back/Forward, and hand keyboard focus to the new page's <main>.
 */
export function ScrollManager() {
  const location = useLocation();
  const id = `${location.key}${location.pathname}`;

  useEffect(() => {
    const viaHistory = memory.viaHistory;
    const firstLoad = memory.firstLoad;
    const target = viaHistory ? savedPosition(id) : 0;
    memory.viaHistory = false;
    memory.firstLoad = false;
    memory.current = id;
    if (firstLoad) return;

    let scrollTimer = 0;
    let focusTimer = 0;
    let scrollTries = 0;
    let focusTries = 0;

    // A lazy page may not be tall enough yet; retry until the saved position is reachable.
    const scroll = () => {
      window.scrollTo({ top: target, left: 0, behavior: 'instant' });
      if (target > 0 && Math.abs(window.scrollY - target) > 2 && scrollTries++ < 30) scrollTimer = setTimeout(scroll, 60);
    };
    // While a lazy page loads, React keeps the old <main> in the DOM but hidden; wait for a visible one.
    const focus = () => {
      const main = [...document.querySelectorAll('main[tabindex]')].find((el) => el.offsetHeight);
      main?.focus({ preventScroll: true });
      if (document.activeElement !== main && focusTries++ < 40) focusTimer = setTimeout(focus, 50);
    };

    scroll();
    if (!viaHistory) focus();
    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(focusTimer);
    };
  }, [id]);

  return null;
}
