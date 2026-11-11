import { createContext, useContext } from 'react';

// The three themes. With "Auto" the site follows the visitor's local clock.
export const TIDES = [
  { id: 'low-tide', label: 'Low tide', hours: '6 am – 4 pm' },
  { id: 'golden-hour', label: 'Golden hour', hours: '4 – 8 pm' },
  { id: 'high-tide', label: 'High tide', hours: '8 pm – 6 am' },
];

// Page background of each tide, used for the browser's toolbar colour.
// Keep in step with --surface in styles/base.css and the boot script in index.html.
export const TIDE_CHROME = { 'low-tide': '#fbf9f5', 'golden-hour': '#f4ebd9', 'high-tide': '#161b22' };

export function tideForHour(hour) {
  return hour >= 6 && hour < 16 ? 'low-tide' : hour >= 16 && hour < 20 ? 'golden-hour' : 'high-tide';
}

/** 'auto', or the tide the visitor pinned. */
export function readChoice() {
  try {
    const saved = localStorage.getItem('tide');
    if (TIDES.some((t) => t.id === saved)) return saved;
  } catch {
    // storage can be blocked; fall through to auto
  }
  return 'auto';
}

export function resolveTide(choice, now = new Date()) {
  return choice === 'auto' ? tideForHour(now.getHours()) : choice;
}

export function minutesToNextTide(now = new Date()) {
  const h = now.getHours();
  const next = h < 6 ? 6 : h < 16 ? 16 : h < 20 ? 20 : 30;
  return (next - h) * 60 - now.getMinutes();
}

export const TideContext = createContext({ choice: 'auto', tide: 'low-tide', setChoice: () => {} });

export const useTide = () => useContext(TideContext);
