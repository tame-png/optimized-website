import React from 'react';
import { HERO_SERIES, DAY_LABELS, MONO } from '../data';

// ─── MiniFigure ──────────────────────────────────────────────
export function MiniFigure({ kind, ink, accent, w = 220, h = 70 }) {
  const stroke = ink, fill = accent;
  if (kind === 'lineMini') {
    const pts = Array.from({ length: 24 }, (_, hod) => {
      const morning = 3200 * Math.exp(-Math.pow((hod - 7) / 1.6, 2));
      const evening = 3500 * Math.exp(-Math.pow((hod - 17) / 2.0, 2));
      const base = 1100 + 1500 * Math.exp(-Math.pow((hod - 13) / 6, 2));
      return base + morning + evening;
    });
    const max = Math.max(...pts);
    const xs = (i) => (i / 23) * (w - 8) + 4;
    const ys = (v) => h - 6 - (v / max) * (h - 12);
    const d = pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${xs(i).toFixed(1)},${ys(v).toFixed(1)}`).join(' ');
    return (
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
        <path d={d} fill="none" stroke={stroke} strokeWidth="0.9" />
        <line x1="4" y1={h - 6} x2={w - 4} y2={h - 6} stroke={stroke} strokeWidth="0.4" />
      </svg>
    );
  }
  if (kind === 'paletteStrip') {
    const bars = [0.95, 0.62, 0.48, 0.41, 0.33, 0.28, 0.21, 0.18, 0.14, 0.11];
    const sw = (w - 8) / bars.length;
    return (
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
        {bars.map((v, i) => (
          <rect key={i} x={4 + i * sw} y={h - 6 - v * (h - 12)}
            width={sw - 2} height={v * (h - 12)}
            fill={i === 0 ? fill : stroke} opacity={i === 0 ? 1 : 0.7} />
        ))}
        <line x1="4" y1={h - 6} x2={w - 4} y2={h - 6} stroke={stroke} strokeWidth="0.4" />
      </svg>
    );
  }
  if (kind === 'sentiment') {
    const N = 40;
    const series = Array.from({ length: N }, (_, i) => {
      const x = i / N;
      return Math.exp(-x * 4) * (1 + 0.3 * Math.sin(i * 0.9));
    });
    const xs = (i) => (i / (N - 1)) * (w - 8) + 4;
    const sw = (w - 8) / N;
    return (
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
        <line x1="4" y1={h - 6} x2={w - 4} y2={h - 6} stroke={stroke} strokeWidth="0.4" />
        {series.map((v, i) => (
          <rect key={i} x={xs(i)} y={h - 6 - v * (h - 12)}
            width={sw - 1} height={v * (h - 12)}
            fill={i < 3 ? fill : stroke} opacity={i < 3 ? 0.95 : 0.65} />
        ))}
      </svg>
    );
  }
  if (kind === 'pyramid') {
    const bins = [3, 6, 11, 18, 26, 22, 17, 11, 6, 3];
    const bh = (h - 8) / bins.length;
    const maxv = Math.max(...bins);
    return (
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
        <line x1={w / 2} y1={4} x2={w / 2} y2={h - 4} stroke={stroke} strokeWidth="0.3" />
        {bins.map((v, i) => {
          const len = (v / maxv) * (w / 2 - 6);
          return (
            <g key={i}>
              <rect x={w / 2 - len} y={4 + i * bh + 1} width={len} height={bh - 2} fill={stroke} opacity="0.7" />
              <rect x={w / 2} y={4 + i * bh + 1} width={len * 0.85} height={bh - 2} fill={fill} opacity="0.85" />
            </g>
          );
        })}
      </svg>
    );
  }
  return null;
}

// ─── HeroChart ───────────────────────────────────────────────
export function HeroChart({ ink, accent, paper, height = 260 }) {
  const W = 720, H = height;
  const padL = 44, padR = 16, padT = 18, padB = 32;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const N = HERO_SERIES.length;
  const clipId = React.useId().replace(/:/g, '');

  const xs = (h) => padL + (h / (N - 1)) * innerW;
  const maxV = 7300;
  const ys = (v) => padT + (1 - v / maxV) * innerH;

  const path = HERO_SERIES.map((p, i) =>
    `${i === 0 ? 'M' : 'L'}${xs(p.hour).toFixed(1)},${ys(p.value).toFixed(1)}`
  ).join(' ');

  const [brush, setBrush] = React.useState([24, 24 * 5]);
  const [dragging, setDragging] = React.useState(null);
  const svgRef = React.useRef(null);

  const hourAt = (clientX) => {
    const r = svgRef.current.getBoundingClientRect();
    const xInSvg = ((clientX - r.left) / r.width) * W;
    const h = Math.round(((xInSvg - padL) / innerW) * (N - 1));
    return Math.max(0, Math.min(N - 1, h));
  };

  const onDown = (mode) => (e) => {
    e.preventDefault();
    setDragging(mode);
    if (mode === 'm') {
      const h = hourAt(e.clientX);
      const span = brush[1] - brush[0];
      const half = Math.round(span / 2);
      setBrush([h - half, h + (span - half)]);
    }
  };

  React.useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const h = hourAt(e.clientX);
      setBrush(([a, b]) => {
        if (dragging === 'l') return [Math.min(h, b - 4), b];
        if (dragging === 'r') return [a, Math.max(h, a + 4)];
        if (dragging === 'm') {
          const span = b - a, half = Math.round(span / 2);
          let na = h - half, nb = h + (span - half);
          if (na < 0) { na = 0; nb = na + span; }
          if (nb > N - 1) { nb = N - 1; na = nb - span; }
          return [na, nb];
        }
        return [a, b];
      });
    };
    const onUp = () => setDragging(null);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragging]);

  const inWindow = HERO_SERIES.filter((p) => p.hour >= brush[0] && p.hour <= brush[1]);
  const mean = inWindow.length > 0
    ? inWindow.reduce((s, p) => s + p.value, 0) / inWindow.length
    : 0;
  const peak = inWindow.length > 0
    ? inWindow.reduce((m, p) => (p.value > m.value ? p : m), inWindow[0])
    : null;

  const bx0 = xs(brush[0]);
  const bx1 = xs(brush[1]);

  const yticks = [0, 2000, 4000, 6000];
  const dayTicks = DAY_LABELS.map((_, i) => i * 24);

  const fmtHour = (h) => {
    const day = DAY_LABELS[Math.floor(h / 24)];
    const hod = h % 24;
    return `${day} ${String(hod).padStart(2, '0')}:00`;
  };

  return (
    <div>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" height={H}
        style={{ display: 'block', cursor: dragging ? 'grabbing' : 'default' }}>
        {yticks.map((v) => (
          <g key={v}>
            <line x1={padL} y1={ys(v)} x2={W - padR} y2={ys(v)}
              stroke={ink} strokeWidth="0.3" opacity="0.18" />
            <text x={padL - 6} y={ys(v) + 3} textAnchor="end"
              fontSize="9" fill={ink} opacity="0.55"
              fontFamily="'JetBrains Mono', ui-monospace, monospace">
              {v.toLocaleString()}
            </text>
          </g>
        ))}
        {dayTicks.map((h, i) => (
          <g key={i}>
            <line x1={xs(h)} y1={padT} x2={xs(h)} y2={padT + innerH}
              stroke={ink} strokeWidth="0.4" opacity="0.18" />
            <text x={xs(h + 12)} y={padT + innerH + 14} textAnchor="middle"
              fontSize="9.5" fill={ink} opacity="0.7"
              fontFamily="'JetBrains Mono', ui-monospace, monospace">
              {DAY_LABELS[i]}
            </text>
          </g>
        ))}
        <g>
          <text x={padL + 6} y={padT + 11} fontSize="8.5"
            fill={ink} opacity="0.55" fontStyle="italic"
            fontFamily="'JetBrains Mono', monospace">
            weekly volume — westbound I-94, hourly
          </text>
        </g>
        <path d={path} fill="none" stroke={ink} strokeWidth="1.0" />
        <rect x={bx0} y={padT} width={Math.max(1, bx1 - bx0)} height={innerH}
          fill={accent} opacity="0.13" />
        <clipPath id={clipId}>
          <rect x={bx0} y={padT} width={Math.max(1, bx1 - bx0)} height={innerH} />
        </clipPath>
        <path d={path} fill="none" stroke={accent} strokeWidth="1.6" clipPath={`url(#${clipId})`} />
        <rect x={bx0} y={padT} width={Math.max(1, bx1 - bx0)} height={innerH}
          fill="transparent" style={{ cursor: 'grab' }} onPointerDown={onDown('m')} />
        <rect x={bx0 - 4} y={padT} width="8" height={innerH}
          fill="transparent" style={{ cursor: 'ew-resize' }} onPointerDown={onDown('l')} />
        <line x1={bx0} y1={padT} x2={bx0} y2={padT + innerH} stroke={accent} strokeWidth="1.2" />
        <rect x={bx1 - 4} y={padT} width="8" height={innerH}
          fill="transparent" style={{ cursor: 'ew-resize' }} onPointerDown={onDown('r')} />
        <line x1={bx1} y1={padT} x2={bx1} y2={padT + innerH} stroke={accent} strokeWidth="1.2" />
        <line x1={padL} y1={padT + innerH} x2={W - padR} y2={padT + innerH}
          stroke={ink} strokeWidth="0.6" />
      </svg>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto auto auto 1fr',
        gap: '18px', marginTop: 6,
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 10.5, color: ink,
      }}>
        <span><span style={{ opacity: 0.55 }}>WINDOW </span>{fmtHour(brush[0])} – {fmtHour(brush[1])}</span>
        <span><span style={{ opacity: 0.55 }}>MEAN </span>{Math.round(mean).toLocaleString()} veh/hr</span>
        <span><span style={{ opacity: 0.55 }}>PEAK </span>{peak ? `${fmtHour(peak.hour)} (${peak.value.toLocaleString()})` : '—'}</span>
        <span style={{ opacity: 0.55, textAlign: 'right' }}>drag handles or window</span>
      </div>
    </div>
  );
}

// ─── Footnote ────────────────────────────────────────────────
export function Footnote({ n, children, ink, accent, paper }) {
  const [open, setOpen] = React.useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}>
      <sup style={{
        color: accent, fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: '0.65em', cursor: 'help', padding: '0 2px',
        fontWeight: 500,
      }}>{n}</sup>
      {open && (
        <span style={{
          position: 'absolute', left: 0, top: '1.2em', zIndex: 50,
          width: 280, background: paper, color: ink,
          border: `0.5px solid ${ink}88`, padding: '10px 12px',
          fontFamily: "'Spectral', 'EB Garamond', serif", fontStyle: 'italic',
          fontSize: 12.5, lineHeight: 1.5, boxShadow: `2px 2px 0 ${ink}33`,
        }}>
          <span style={{ color: accent, fontFamily: "'JetBrains Mono', monospace", fontStyle: 'normal', marginRight: 6 }}>
            [{n}]
          </span>
          {children}
        </span>
      )}
    </span>
  );
}

// ─── FigureFocus ─────────────────────────────────────────────
export function FigureFocus({ project, theme, onClose }) {
  if (!project) return null;
  const { ink, accent, paper, panel } = theme;
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 80,
      background: `${ink}b0`, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: 32, backdropFilter: 'blur(2px)',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: paper, color: ink, width: 'min(720px, 90%)',
        maxHeight: '88%', overflow: 'auto',
        border: `0.5px solid ${ink}33`,
        boxShadow: `0 30px 80px ${ink}55`,
        padding: '36px 44px',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: `${ink}99`, marginBottom: 16,
        }}>
          <span>Fig. {project.fig} · {project.field}</span>
          <span>{project.year} · press esc</span>
        </div>
        <h2 style={{
          fontFamily: "'Spectral', 'EB Garamond', serif",
          fontWeight: 500, fontSize: 32, lineHeight: 1.15,
          margin: '0 0 6px', letterSpacing: '-0.005em',
        }}>{project.title}</h2>
        <div style={{
          fontFamily: "'Spectral', serif", fontStyle: 'italic',
          fontSize: 14, color: `${ink}99`, marginBottom: 16,
        }}>{project.role}</div>
        <p style={{
          fontFamily: "'Spectral', 'EB Garamond', serif",
          fontSize: 17, lineHeight: 1.55, margin: '0 0 22px',
          color: `${ink}d0`,
        }}>{project.blurb}</p>

        <div style={{
          background: panel, padding: '20px 24px',
          border: `0.5px solid ${ink}22`, marginBottom: 18,
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: `${ink}99`, marginBottom: 8,
          }}>Figure {project.fig}</div>
          <MiniFigure kind={project.figureKind} ink={ink} accent={accent} w={620} h={180} />
          <div style={{
            fontFamily: "'Spectral', serif", fontStyle: 'italic',
            fontSize: 13, color: `${ink}99`, marginTop: 10,
          }}>
            Fig. {project.fig}. Reconstructed from project notebook.
          </div>
        </div>

        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 6,
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 10, color: ink,
        }}>
          {project.methods.map((m) => (
            <span key={m} style={{
              padding: '3px 8px', border: `0.5px solid ${ink}55`,
              borderRadius: 2,
            }}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ArtImage ────────────────────────────────────────────────
export function ArtImage({ artKey, style = {} }) {
  const seed = (artKey || '').length;
  const angle = 35 + (seed * 17) % 30;
  const cites = {
    longbeach: 'Long Beach Civic Center · PUMS dashboard, 2025.',
    apps: 'App Store + Google Play, 2018 sample.',
    i94: 'Westbound I-94 at Minneapolis, MN DOT.',
    ebay: 'eBay Kleinanzeigen used-car listings, 2016.',
  };
  const cite = cites[artKey] || 'Plate';
  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: '#d8cdb4',
      backgroundImage: `repeating-linear-gradient(${angle}deg, rgba(60,40,20,.32) 0 1px, transparent 1px 5px)`,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '10px 12px', color: '#3a2a1c',
      ...style,
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
        letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7,
      }}>plate · {artKey}</div>
      <div style={{
        fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
        fontSize: 12, lineHeight: 1.35, opacity: 0.85,
        background: 'rgba(246,241,230,.78)',
        padding: '6px 8px', alignSelf: 'flex-start', maxWidth: '92%',
      }}>{cite}</div>
    </div>
  );
}

// ─── NavBar ──────────────────────────────────────────────────
import { Link } from 'react-router-dom';

export function NavBar({ ink, accent, mono, active }) {
  return (
    <nav className="site-nav" style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '22px 56px 0',
      fontFamily: mono, fontSize: 17, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: `${ink}cc`,
    }}>
      <Link to="/" style={{ color: accent, fontWeight: 600 }}>A. Molina</Link>
      <span style={{ display: 'flex', gap: 24 }}>
        <Link to="/" style={{
          color: 'inherit',
          borderBottom: active === 'home' ? `0.5px solid ${accent}` : 'none',
        }}>Home</Link>
        <Link to="/notebooks" style={{
          color: 'inherit',
          borderBottom: active === 'notebooks' ? `0.5px solid ${accent}` : 'none',
        }}>Notebooks</Link>
        <Link to="/resume" style={{
          color: 'inherit',
          borderBottom: active === 'resume' ? `0.5px solid ${accent}` : 'none',
        }}>Résumé</Link>
      </span>
      <a href="mailto:AndyxMolina@outlook.com" style={{ color: accent, fontWeight: 600 }}>↩ Email</a>
    </nav>
  );
}

// ─── SiteFooter ──────────────────────────────────────────────
export function SiteFooter({ ink, accent, serif, mono, P }) {
  return (
    <footer className="site-footer" style={{
      padding: '36px 56px 48px', borderTop: `0.5px solid ${ink}33`,
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'baseline', gap: 24, flexWrap: 'wrap',
      fontFamily: mono, fontSize: 10.5,
      letterSpacing: '0.06em', color: `${ink}99`,
    }}>
      <span>{P.name} · {P.location} · 2026</span>
      <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 14, color: ink, letterSpacing: 0 }}>
        "Counting is the humblest interpretation."
      </span>
      <a href={`mailto:${P.email}`} style={{ color: accent }}>{P.email}</a>
    </footer>
  );
}
