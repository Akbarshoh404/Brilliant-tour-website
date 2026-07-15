import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.scss';

// Icon-only toggle used in both the desktop navbar and the mobile drawer —
// both sit on an always-dark surface, so one light-on-dark treatment works
// in both spots without needing its own theme-aware styling.
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`${styles.toggle} ${className}`}
      onClick={toggleTheme}
      aria-label={isDark ? t('nav.lightMode') : t('nav.darkMode')}
      aria-pressed={isDark}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.svg
            key="sun"
            width="19"
            height="19"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <circle cx="10" cy="10" r="3.6" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10 2v2M10 16v2M18 10h-2M4 10H2M15.5 4.5l-1.4 1.4M5.9 14.1l-1.4 1.4M15.5 15.5l-1.4-1.4M5.9 5.9L4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </motion.svg>
        ) : (
          <motion.svg
            key="moon"
            width="19"
            height="19"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <path d="M17 11.3A7 7 0 018.7 3a7 7 0 108.3 8.3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
