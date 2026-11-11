import { useEffect, useRef, useState } from 'react';
import { useTide } from '../tide/tides.js';

/** Plate I: San Pedro Bay isobaths with the Walter Pyramid. The sun crosses with the visitor's clock. */
export function Bathymetry() {
  const { tide } = useTide();
  const [hour] = useState(() => {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
  });
  const day = Math.min(1, Math.max(0, (hour - 6) / 14)); // 0 at 6 am, 1 at 8 pm
  const night = tide === 'high-tide';
  const sunX = 40 + day * 340;
  const x = night ? 360 : sunX;
  const y = night ? 46 : 60 + Math.pow(day - 0.5, 2) * 160;

  return (
    <svg viewBox="0 0 420 230" className="bathy" role="img" aria-label="San Pedro Bay isobaths with the Walter Pyramid">
      <path className="iso faint" d="M-10,40 Q90,20 190,45 T430,30" />
      <path className="iso" style={{ opacity: 0.45 }} d="M-10,72 Q110,52 210,79 T430,65" />
      <path className="iso" style={{ opacity: 0.65 }} d="M-10,105 Q130,82 230,112 T430,99" />
      <path className="iso" style={{ opacity: 0.85 }} d="M-10,139 Q140,117 250,145 T430,135" />
      <path className="iso faint" d="M-10,173 Q150,155 270,179 T430,169" />
      <g>
        {night ? (
          <>
            <circle className="halo" cx={x} cy={y} r="20" />
            <circle className="sun" cx={x} cy={y} r="13" opacity=".9" />
            <circle cx={x + 6} cy={y - 4} r="11" fill="var(--surface)" />
          </>
        ) : (
          <>
            <circle className="halo" cx={x} cy={y} r="31" />
            <circle className="sun" cx={x} cy={y} r="24" opacity=".9" />
          </>
        )}
      </g>
      <polygon className="pyr" points="240,110 185,170 295,170" />
      <line x1="240" y1="110" x2="240" y2="170" stroke="var(--accent)" />
      <circle className="node" cx="135" cy="94" r="3" fill="var(--gold)" />
      <circle className="node" cx="195" cy="81" r="3.5" fill="var(--accent)" />
      <circle className="node" cx="318" cy="126" r="3" fill="var(--gold)" />
      <circle className="node" cx="355" cy="93" r="4" fill="var(--signal)" />
      <line x1="16" y1="200" x2="404" y2="200" stroke="var(--ink)" strokeOpacity=".4" strokeWidth=".6" />
      <text className="mono" x="20" y="214">
        Depth −15 m to −120 m isobath
      </text>
      <text className="mono accent" x="290" y="214">
        Walter Pyramid · CSULB
      </text>
    </svg>
  );
}

/** A headline number that counts up the first time it scrolls into view. */
export function Kpi({ display, label }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(display);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const parts = /^([\d.,]+)(.*)$/.exec(display);
    if (reduced || !parts || !ref.current) return;

    const target = parseFloat(parts[1].replace(/,/g, ''));
    const suffix = parts[2];
    const decimals = (parts[1].split('.')[1] || '').length;
    const grouped = parts[1].includes(',');
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - start) / 1100);
          const value = target * (1 - Math.pow(1 - t, 3));
          setShown((grouped ? Math.round(value).toLocaleString('en-US') : value.toFixed(decimals)) + suffix);
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [display]);

  return (
    <div className="kpi" ref={ref}>
      <b>{shown}</b>
      <span>{label}</span>
    </div>
  );
}

const MONO = { fontFamily: 'JetBrains Mono', fontSize: '8.5' };

/** The small schematic chart at the top of each project card. */
export function Figure({ kind }) {
  if (kind === 'pyramid') {
    return (
      <svg className="fig" viewBox="0 0 360 110">
        <line x1="180" y1="6" x2="180" y2="104" stroke="var(--ink)" />
        {[
          [85, 95, 110],
          [105, 75, 125],
          [65, 115, 95],
          [130, 50, 145],
        ].map(([x, left, right], i) => (
          <g key={i}>
            <rect x={x} y={10 + i * 24} width={left} height="16" fill="var(--signal)" opacity={0.6 + i * 0.1} />
            <rect x="180" y={10 + i * 24} width={right} height="16" fill={i === 3 ? 'var(--gold)' : 'var(--accent)'} opacity=".9" />
          </g>
        ))}
        {['West', 'North', 'Central', 'East'].map((name, i) => (
          <text key={name} x="12" y={22 + i * 24} {...MONO} fill="var(--ink-muted)">
            {name}
          </text>
        ))}
      </svg>
    );
  }
  if (kind === 'traffic') {
    return (
      <svg className="fig" viewBox="0 0 320 110">
        <path
          d="M4,98 C30,96 50,60 70,32 C90,10 110,22 130,52 C150,82 170,92 190,88 C210,80 230,30 250,22 C270,16 290,46 316,96"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.6"
        />
        <rect x="52" y="8" width="60" height="92" fill="var(--gold)" fillOpacity=".22" stroke="var(--gold-deep)" strokeDasharray="4 2" />
        <text x="56" y="20" {...MONO} fill="var(--ink)">
          weekdays
        </text>
        <text x="236" y="20" {...MONO} fill="var(--ink)">
          weekend
        </text>
        <line x1="4" y1="100" x2="316" y2="100" stroke="var(--ink)" strokeOpacity=".4" strokeWidth=".6" />
      </svg>
    );
  }
  if (kind === 'bars') {
    return (
      <svg className="fig" viewBox="0 0 320 110">
        {[
          [0.95, 'Games'],
          [0.62, 'Entertainment'],
          [0.48, 'Photo'],
          [0.41, 'Education'],
          [0.33, 'Social'],
          [0.28, 'Shopping'],
        ].map(([share, name], i) => (
          <g key={i}>
            <rect x="70" y={8 + i * 16} width={share * 230} height="11" fill={i === 0 ? 'var(--gold)' : 'var(--accent)'} opacity={i === 0 ? 1 : 0.55} />
            <text x="64" y={17 + i * 16} textAnchor="end" {...MONO} fill="var(--ink-muted)">
              {name}
            </text>
          </g>
        ))}
      </svg>
    );
  }
  if (kind === 'decay') {
    return (
      <svg className="fig" viewBox="0 0 320 110">
        {Array.from({ length: 40 }, (_, i) => {
          const h = Math.exp((-i / 40) * 3.2) * (1 + 0.25 * Math.sin(i * 0.9));
          return <rect key={i} x={6 + i * 7.6} y={100 - h * 86} width="5.5" height={h * 86} fill={i < 6 ? 'var(--signal)' : 'var(--accent)'} opacity=".8" />;
        })}
        <text x="150" y="30" {...MONO} fill="var(--ink-muted)">
          price vs. registration year
        </text>
        <line x1="4" y1="100" x2="316" y2="100" stroke="var(--ink)" strokeOpacity=".4" strokeWidth=".6" />
      </svg>
    );
  }
  // 'sheet': rows of a workbook
  return (
    <svg className="fig" viewBox="0 0 320 110">
      {[0, 1, 2, 3, 4, 5].map((row) => (
        <g key={row}>
          <line x1="10" y1={14 + row * 17} x2="310" y2={14 + row * 17} stroke="var(--rule)" />
          <rect x="14" y={5 + row * 17} width={60 + ((row * 37) % 80)} height="9" fill={row === 2 ? 'var(--kelp)' : 'var(--ink)'} opacity={row === 2 ? 0.9 : 0.22} />
          <rect x="200" y={5 + row * 17} width={40 + ((row * 53) % 60)} height="9" fill={row === 3 ? 'var(--signal)' : 'var(--accent)'} opacity=".7" />
        </g>
      ))}
    </svg>
  );
}
