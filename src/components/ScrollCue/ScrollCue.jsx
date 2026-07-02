import styles from './ScrollCue.module.scss';

// Small bouncing indicator anchored to the bottom of a full-height hero,
// hinting that there's more below the fold.
export default function ScrollCue({ label = 'Scroll' }) {
  return (
    <div className={styles.cue} aria-hidden="true">
      <span className={styles.label}>{label}</span>
      <svg width="14" height="22" viewBox="0 0 14 22" className={styles.icon}>
        <rect x="1" y="1" width="12" height="20" rx="6" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <circle className={styles.dot} cx="7" cy="6.5" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}
