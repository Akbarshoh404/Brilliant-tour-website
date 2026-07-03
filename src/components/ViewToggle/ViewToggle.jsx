import styles from './ViewToggle.module.scss';

// Grid/list view switcher for offer listings.
export default function ViewToggle({ value, onChange }) {
  return (
    <div className={styles.wrap} role="group" aria-label="Card layout">
      <button
        type="button"
        className={`${styles.btn} ${value === 'grid' ? styles.active : ''}`}
        onClick={() => onChange('grid')}
        aria-pressed={value === 'grid'}
        aria-label="Grid view"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
        </svg>
      </button>
      <button
        type="button"
        className={`${styles.btn} ${value === 'list' ? styles.active : ''}`}
        onClick={() => onChange('list')}
        aria-pressed={value === 'list'}
        aria-label="List view"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="1" y="2" width="14" height="3" rx="1" fill="currentColor" />
          <rect x="1" y="7" width="14" height="3" rx="1" fill="currentColor" />
          <rect x="1" y="12" width="14" height="3" rx="1" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
