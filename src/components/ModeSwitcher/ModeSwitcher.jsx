import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import useLocalStorage from '../../hooks/useLocalStorage';
import styles from './ModeSwitcher.module.scss';

const MODES = ['client', 'business'];

// Client vs. business browsing mode — a segmented glass pill with a sliding
// highlight, replacing the old inline search field in the navbar (full-text
// search still lives behind the search icon / SearchOverlay).
// `instanceId` keeps the sliding highlight's layoutId unique per render
// location — the desktop navbar and the mobile drawer can both have one
// mounted at once (one just hidden by CSS), and sharing a layoutId across
// them would make framer-motion animate the highlight between the two.
export default function ModeSwitcher({ instanceId = 'default', fullWidth = false }) {
  const { t } = useTranslation();
  const [mode, setMode] = useLocalStorage('brilliant-mode', 'client');

  return (
    <div className={`${styles.wrap} ${fullWidth ? styles.fullWidth : ''}`} role="group" aria-label={t('nav.modeSwitcher')}>
      {MODES.map((m) => (
        <button
          key={m}
          type="button"
          className={styles.option}
          onClick={() => setMode(m)}
          aria-pressed={mode === m}
        >
          {mode === m && (
            <motion.span
              layoutId={`modeHighlight-${instanceId}`}
              className={styles.highlight}
              transition={{ type: 'spring', stiffness: 500, damping: 34 }}
            />
          )}
          <span className={styles.optionLabel}>{t(`nav.${m}Mode`)}</span>
        </button>
      ))}
    </div>
  );
}
