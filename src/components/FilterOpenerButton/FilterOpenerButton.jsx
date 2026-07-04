import { useTranslation } from 'react-i18next';
import { countActiveFilters } from '../../utils/countActiveFilters';
import styles from './FilterOpenerButton.module.scss';

// The mobile entry point into FilterDrawer's bottom sheet — a small text
// pill was easy to miss, so this reads clearly as "tap to open filters".
export default function FilterOpenerButton({ filters, onClick }) {
  const { t } = useTranslation();
  const count = countActiveFilters(filters);

  return (
    <button type="button" className={styles.btn} onClick={onClick}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 4.5h12M4.5 8h7M7 11.5h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {t('common.filters')}
      {count > 0 && <span className={styles.badge}>{count}</span>}
    </button>
  );
}
