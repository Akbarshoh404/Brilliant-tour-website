import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { lenisRef } from '../hooks/useLenis';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Lenis owns its own virtual scroll offset, so a plain window.scrollTo
    // gets overridden on Lenis's next raf tick. Reset both.
    if (hash) {
      // The target route may still be loading (lazy chunk), so poll briefly
      // for the element before falling back to a plain top scroll.
      const id = hash.slice(1);
      let attempts = 0;
      let frameId;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          lenisRef.current?.scrollTo(el, { immediate: true, offset: -80 });
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo(0, top);
          return;
        }
        attempts += 1;
        if (attempts < 40) frameId = requestAnimationFrame(tryScroll);
      };
      frameId = requestAnimationFrame(tryScroll);
      return () => cancelAnimationFrame(frameId);
    }

    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
