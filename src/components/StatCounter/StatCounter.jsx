import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
import styles from './StatCounter.module.scss';

// Several of these animate at once (the About stats row). Driving each with
// its own requestAnimationFrame + setState meant every frame re-rendered
// every counter's React tree at the same time, which is what made them look
// like they were fighting each other. framer-motion's `animate()` runs on a
// single shared ticker and writes straight to the DOM node, so counters stay
// independent and smooth no matter how many animate together.
export default function StatCounter({ value, suffix = '', label }) {
  const ref = useRef(null);
  const valueRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = valueRef.current;
    if (!node) return;

    if (reduceMotion) {
      node.textContent = value.toLocaleString();
      return;
    }
    if (!isInView) return;

    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = Math.round(v).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [isInView, value, reduceMotion]);

  return (
    <div className={styles.stat} ref={ref}>
      <span className={styles.value}>
        <span ref={valueRef}>0</span>
        {suffix}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
