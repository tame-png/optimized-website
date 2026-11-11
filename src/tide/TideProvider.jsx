import { useCallback, useEffect, useRef, useState } from 'react';
import { TIDE_CHROME, TideContext, minutesToNextTide, readChoice, resolveTide } from './tides.js';

export default function TideProvider({ children }) {
  const [choice, setChoiceState] = useState(readChoice);
  const [tide, setTide] = useState(() => resolveTide(readChoice()));
  const stinger = useRef(null);

  // A change of tide wipes a band of colour up the screen and swaps the theme behind it.
  const apply = useCallback((next) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = stinger.current;
    if (el && !reduced) {
      el.classList.remove('run');
      void el.offsetWidth; // restart the animation
      el.classList.add('run');
      setTimeout(() => document.documentElement.setAttribute('data-theme', next), 380);
    } else {
      document.documentElement.setAttribute('data-theme', next);
    }
    setTide(next);
  }, []);

  const setChoice = useCallback(
    (next) => {
      setChoiceState(next);
      try {
        if (next === 'auto') localStorage.removeItem('tide');
        else localStorage.setItem('tide', next);
      } catch {
        // storage can be blocked; the choice then lasts for this visit only
      }
      apply(resolveTide(next));
    },
    [apply],
  );

  // On Auto, change over when the clock reaches the next tide.
  useEffect(() => {
    if (choice !== 'auto') return;
    const timer = setTimeout(() => apply(resolveTide('auto')), (minutesToNextTide() * 60 + 5) * 1000);
    return () => clearTimeout(timer);
  }, [choice, tide, apply]);

  // The browser's toolbar colour follows the tide, not the OS light/dark setting.
  useEffect(() => {
    const colour = TIDE_CHROME[tide];
    if (!colour) return;
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.removeAttribute('media');
      meta.setAttribute('content', colour);
    });
  }, [tide]);

  return (
    <TideContext.Provider value={{ choice, tide, setChoice }}>
      <div ref={stinger} className="stinger" aria-hidden="true" />
      {children}
    </TideContext.Provider>
  );
}
