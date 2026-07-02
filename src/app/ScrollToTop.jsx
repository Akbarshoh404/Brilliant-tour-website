import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { lenisRef } from '../hooks/useLenis';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Lenis owns its own virtual scroll offset, so a plain window.scrollTo
    // gets overridden on Lenis's next raf tick. Reset both.
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
