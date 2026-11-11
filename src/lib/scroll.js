// Scroll memory for a single-page app.
// A new page opens at the top; Back and Forward return to where the reader was.
//
// The position of the page being left is saved at the moment of navigation (pushState or
// popstate), before React re-renders, so it does not depend on scroll events firing.

const positions = new Map();

export const memory = {
  current: '', // id of the page on screen
  viaHistory: false, // true when the pending navigation came from Back/Forward
  firstLoad: true,
};

const save = () => {
  if (memory.current) positions.set(memory.current, window.scrollY);
};

export const savedPosition = (id) => positions.get(id) ?? 0;

export function installScrollMemory() {
  window.addEventListener('popstate', () => {
    memory.viaHistory = true;
    save();
  });
  try {
    history.scrollRestoration = 'manual';
    const pushState = history.pushState;
    history.pushState = function (...args) {
      save();
      return pushState.apply(this, args);
    };
  } catch {
    // A locked-down frame may refuse; pages then simply open at the top.
  }
}
