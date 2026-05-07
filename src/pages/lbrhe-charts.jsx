import React from 'react';

export function HBar({ data, max, ink, accent, paper, panel, height = 22, gap = 10,
                fmt = (v) => v + '%', highlight, label = 'group', value = 'pct',
                width = 460, accentSet }) {
  const m = max || Math.max(...data.map((d) => d[value])) * 1.1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
      {data.map((d, i) => {
        const w = (d[value] / m) * width;
        const isHi = highlight && highlight.includes(d[label]);
        const fill = accentSet ? (accentSet[i % accentSet.length])
          : (isHi ? accent : `${ink}55`);
        return (
          <div key={d[label]} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 60px', alignItems: 'center', gap: 10, fontSize: 11 }}>
            <div style={{ textAlign: 'right', color: `${ink}cc`, letterSpacing: '0.02em' }}>{d[label]}</div>
            <div style={{ position: 'relative', height, background: panel, borderLeft: `1px solid ${ink}33` }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: w, background: fill, transition: 'width .8s ease' }} />
            </div>
            <div style={{ color: ink, fontWeight: 500, fontSize: 12 }}>{fmt(d[value])}</div>
          </div>
        );
      })}
    </div>
  );
}

export function Lollipop({ data, max, ink, accent, paper, panel,
                    fmt = (v) => v + '%', label = 'group', value = 'pct',
                    height = 220 }) {
  const m = max || Math.max(...data.map((d) => d[value])) * 1.15;
  const W = 600, H = height;
  const padL = 90, padR = 50, padT = 16, padB = 30;
  const innerW = W - padL - padR;
  const stepY = (H - padT - padB) / Math.max(1, data.length - 1);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible' }}>
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke={ink} strokeWidth="0.6" />
      {[0, 0.25, 0.5, 0.75, 1].map((p) => {
        const x = padL + p * innerW;
        return (
          <g key={p}>
            <line x1={x} y1={padT} x2={x} y2={H - padB} stroke={ink} strokeWidth="0.3" opacity="0.2" />
            <text x={x} y={H - padB + 14} fontSize="8.5" fill={`${ink}99`} textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace">{Math.round(p * m)}%</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const y = padT + i * stepY;
        const x = padL + (d[value] / m) * innerW;
        return (
          <g key={d[label]}>
            <text x={padL - 8} y={y + 3} fontSize="10" fill={`${ink}cc`}
                  textAnchor="end" fontFamily="JetBrains Mono, monospace">{d[label]}</text>
            <line x1={padL} y1={y} x2={x} y2={y} stroke={`${ink}55`} strokeWidth="0.5" />
            <circle cx={x} cy={y} r="4" fill={accent} />
            <text x={x + 8} y={y + 3} fontSize="10" fill={ink} fontWeight="500"
                  fontFamily="JetBrains Mono, monospace">{fmt(d[value])}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function Donut({ data, ink, accent, paper, panel, label = 'group', value = 'pct',
                 size = 200, palette }) {
  const total = data.reduce((s, d) => s + d[value], 0);
  const r = size / 2 - 18, cx = size / 2, cy = size / 2;
  let acc = 0;
  const arcs = data.map((d, i) => {
    const start = acc / total * Math.PI * 2 - Math.PI / 2;
    acc += d[value];
    const end = acc / total * Math.PI * 2 - Math.PI / 2;
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
    const mid = (start + end) / 2;
    const lx = cx + (r + 14) * Math.cos(mid);
    const ly = cy + (r + 14) * Math.sin(mid);
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    const c = palette ? palette[i % palette.length] :
      `oklch(${0.45 + i * 0.07} 0.10 ${20 + i * 50})`;
    return { path, color: c, label: d[label], pct: d[value], lx, ly, mid };
  });
  return (
    <svg viewBox={`0 0 ${size} ${size + 60}`} width="100%">
      {arcs.map((a, i) => <path key={i} d={a.path} fill={a.color} stroke={paper} strokeWidth="1.2" />)}
      <circle cx={cx} cy={cy} r={r * 0.45} fill={paper} />
      {arcs.map((a, i) => (
        <text key={'l' + i} x={a.lx} y={a.ly} fontSize="9" fill={ink}
              textAnchor={a.lx > cx ? 'start' : 'end'}
              fontFamily="JetBrains Mono, monospace">
          {a.label} · {a.pct}%
        </text>
      ))}
    </svg>
  );
}

export function PairBars({ a, b, labelA, labelB, ink, accent, paper, panel }) {
  const total = a + b;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 60, fontSize: 11, color: `${ink}cc` }}>{labelA}</span>
        <div style={{ flex: 1, height: 18, background: panel, position: 'relative' }}>
          <div style={{ width: (a / total) * 100 + '%', height: '100%', background: accent }} />
        </div>
        <span style={{ width: 36, fontSize: 12, fontWeight: 500 }}>{a}%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 60, fontSize: 11, color: `${ink}cc` }}>{labelB}</span>
        <div style={{ flex: 1, height: 18, background: panel, position: 'relative' }}>
          <div style={{ width: (b / total) * 100 + '%', height: '100%', background: `${ink}88` }} />
        </div>
        <span style={{ width: 36, fontSize: 12, fontWeight: 500 }}>{b}%</span>
      </div>
    </div>
  );
}

export function Stat({ value, label, sub, ink, accent, paper, panel, large }) {
  return (
    <div style={{
      borderTop: `2px solid ${ink}`, paddingTop: 12,
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{
        fontFamily: "'Spectral', 'EB Garamond', serif",
        fontSize: large ? 64 : 44, lineHeight: 1, color: accent,
        fontWeight: 400, letterSpacing: '-0.02em',
      }}>{value}</div>
      <div style={{
        fontFamily: "'Spectral', serif", fontSize: 14, fontStyle: 'italic',
        color: `${ink}cc`, lineHeight: 1.35,
      }}>{label}</div>
      {sub && (
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: `${ink}88`, marginTop: 4,
        }}>{sub}</div>
      )}
    </div>
  );
}

export function PumaMap({ ink, accent, paper, panel, highlight }) {
  const regions = [
    { id: 'North', d: 'M 60 30 L 220 30 L 230 90 L 70 100 Z', cx: 145, cy: 65 },
    { id: 'East', d: 'M 220 30 L 280 40 L 290 130 L 230 90 Z', cx: 255, cy: 80 },
    { id: 'Central', d: 'M 70 100 L 230 90 L 240 170 L 90 180 Z', cx: 155, cy: 140 },
    { id: 'South', d: 'M 90 180 L 240 170 L 260 240 L 100 250 Z', cx: 175, cy: 215 },
  ];
  return (
    <svg viewBox="0 0 320 280" width="100%" style={{ display: 'block' }}>
      <path d="M 100 250 L 260 240 L 280 270 L 90 280 Z" fill={`${ink}11`} />
      <text x="280" y="265" fontSize="8" fill={`${ink}99`}
            fontFamily="Spectral, serif" fontStyle="italic">Pacific</text>
      {regions.map((r) => {
        const isHi = highlight === r.id;
        return (
          <g key={r.id}>
            <path d={r.d} fill={isHi ? accent : `${ink}11`}
                  stroke={ink} strokeWidth="0.8" />
            <text x={r.cx} y={r.cy} fontSize="11" fill={isHi ? paper : ink}
                  fontFamily="Spectral, serif" textAnchor="middle"
                  fontStyle="italic" fontWeight="500">{r.id}</text>
            <text x={r.cx} y={r.cy + 12} fontSize="8" fill={isHi ? paper : `${ink}99`}
                  fontFamily="JetBrains Mono, monospace" textAnchor="middle"
                  letterSpacing="0.05em">PUMA</text>
          </g>
        );
      })}
    </svg>
  );
}
