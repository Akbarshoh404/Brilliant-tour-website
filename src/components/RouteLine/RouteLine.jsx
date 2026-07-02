import { motion, useReducedMotion } from 'framer-motion';
import styles from './RouteLine.module.scss';

// The signature element (see DESIGN.md §1): a dashed route path that draws
// once on mount/scroll-into-view. `variant` picks the brand color; 'fork'
// renders two paths forking from a shared origin (used on the Home
// "Two Routes" split section to visualize the domestic/international duality).
export default function RouteLine({
  variant = 'domestic',
  d,
  dDomestic,
  dInternational,
  width = 320,
  height = 120,
  className = '',
  showDots = true,
}) {
  const reduceMotion = useReducedMotion();

  const draw = {
    hidden: { pathLength: 0, opacity: reduceMotion ? 1 : 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { pathLength: { duration: reduceMotion ? 0 : 1.4, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.3 } },
    },
  };

  if (variant === 'fork') {
    return (
      <svg
        className={`${styles.routeLine} ${className}`}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        fill="none"
        aria-hidden="true"
      >
        {showDots && <circle cx="6" cy={height / 2} r="4" className={styles.dotOrigin} />}
        <motion.path
          d={dDomestic}
          className={styles.pathTurquoise}
          strokeDasharray="2 8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={draw}
        />
        <motion.path
          d={dInternational}
          className={styles.pathGold}
          strokeDasharray="2 8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={draw}
        />
      </svg>
    );
  }

  return (
    <svg
      className={`${styles.routeLine} ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      fill="none"
      aria-hidden="true"
    >
      {showDots && <circle cx="6" cy={height / 2} r="4" className={variant === 'international' ? styles.dotGold : styles.dotTurquoise} />}
      <motion.path
        d={d}
        className={variant === 'international' ? styles.pathGold : styles.pathTurquoise}
        strokeDasharray="2 8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={draw}
      />
    </svg>
  );
}
