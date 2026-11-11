import { useState } from 'react';
import { TIDES, minutesToNextTide, useTide } from './tides.js';

/** The Auto / Low tide / Golden hour / High tide control. `note` adds the line saying what is showing. */
export default function TideSwitcher({ note = false }) {
  const { choice, tide, setChoice } = useTide();
  const [minutes] = useState(minutesToNextTide);
  const label = TIDES.find((t) => t.id === tide)?.label ?? '';
  const wait = minutes >= 60 ? `${Math.floor(minutes / 60)} h ${minutes % 60} min` : `${minutes} min`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <div className="tides" role="group" aria-label="Tide theme">
        <button type="button" aria-pressed={choice === 'auto'} onClick={() => setChoice('auto')} title="Follow the local clock">
          Auto
        </button>
        {TIDES.map((t) => (
          <button key={t.id} type="button" aria-pressed={choice === t.id} onClick={() => setChoice(t.id)} title={t.hours}>
            {t.label}
          </button>
        ))}
      </div>
      {note && (
        <span className="tide-note">
          {choice === 'auto' ? `${label} by your clock · changes in ${wait}` : `${label}, pinned`}
        </span>
      )}
    </div>
  );
}
