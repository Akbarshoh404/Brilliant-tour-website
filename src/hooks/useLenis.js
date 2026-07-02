import { useEffect } from 'react';
import Lenis from 'lenis';

// Module-level handle to the live Lenis instance (or null when inactive,
// e.g. under prefers-reduced-motion). ScrollToTop reads this so it can
// reset Lenis's own virtual scroll offset instead of fighting it with a
// plain window.scrollTo, which Lenis otherwise overrides on its next tick.
export const lenisRef = { current: null };

// Site-wide smooth scroll. Skips entirely under prefers-reduced-motion so
// native (instant) scrolling takes over.
export default function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisRef.current = lenis;

    let frameId;
    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);
}
