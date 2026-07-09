import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './ModeSwitcher.module.scss';

const MODES = ['client', 'business'];

// Client vs. business browsing mode — a segmented glass pill with a sliding
// highlight, replacing the old inline search field in the navbar. Route-
// driven rather than local state: whichever half of the site you're on
// determines which option is lit, and pressing "business" navigates to the
// B2B partner hub at /business (pressing "client" returns to /).
// `instanceId` keeps the sliding highlight's layoutId unique per render
// location — the desktop navbar and the mobile drawer can both have one
// mounted at once (one just hidden by CSS), and sharing a layoutId across
// them would make framer-motion animate the highlight between the two.
export default function ModeSwitcher({ instanceId = 'default', fullWidth = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const mode = pathname.startsWith('/business') ? 'business' : 'client';

  const select = (m) => {
    if (m === mode) return;
    navigate(m === 'business' ? '/business' : '/');
  };

  return (
    <div className={`${styles.wrap} ${fullWidth ? styles.fullWidth : ''}`} role="group" aria-label={t('nav.modeSwitcher')}>
      {MODES.map((m) => (
        <button
          key={m}
          type="button"
          className={styles.option}
          onClick={() => select(m)}
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
