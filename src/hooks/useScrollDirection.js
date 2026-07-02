import { useEffect, useRef, useState } from 'react';

// Tracks scroll direction ('up' | 'down') and whether the page has scrolled
// past `threshold`. Used to drive the navbar's solid/transparent transition.
export default function useScrollDirection(threshold = 80) {
  const [direction, setDirection] = useState('up');
  const [scrolledPast, setScrolledPast] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setDirection(y > lastY.current ? 'down' : 'up');
      setScrolledPast(y > threshold);
      lastY.current = y;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { direction, scrolledPast };
}
