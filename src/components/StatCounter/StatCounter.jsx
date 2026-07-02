import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import styles from './StatCounter.module.scss';

export default function StatCounter({ value, suffix = '', label }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    // reduceMotion is handled by the useState initializer above — nothing to animate.
    if (!isInView || reduceMotion) return;
    const duration = 1400;
    const start = performance.now();

    let frame;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value, reduceMotion]);

  return (
    <div className={styles.stat} ref={ref}>
      <span className={styles.value}>
        {display.toLocaleString()}
        {suffix}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
