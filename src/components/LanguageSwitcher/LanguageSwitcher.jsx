import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './LanguageSwitcher.module.scss';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'uz', label: 'UZ' },
];

// `openUp`: the dropdown opens downward by default, which is fine when the
// trigger sits near the top of the screen (desktop navbar) — but in the
// mobile drawer, the switcher lives in the footer near the bottom edge, so
// a downward menu runs off the viewport. Pass `openUp` there to flip it.
export default function LanguageSwitcher({ variant = 'light', openUp = false }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGS.find((l) => l.code === i18n.language) ?? LANGS[0];

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const select = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className={`${styles.wrap} ${styles[variant]}`} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <svg className={styles.globe} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M1.7 7h10.6M7 1.5c1.6 1.5 2.5 3.5 2.5 5.5S8.6 12 7 12.5C5.4 12 4.5 10 4.5 7S5.4 1.5 7 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
        {current.label}
        <svg className={styles.chevron} width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            className={`${styles.menu} ${openUp ? styles.menuUp : ''}`}
            role="listbox"
            initial={{ opacity: 0, y: openUp ? 6 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: openUp ? 6 : -6 }}
            transition={{ duration: 0.18 }}
          >
            {LANGS.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  className={`${styles.option} ${l.code === current.code ? styles.active : ''}`}
                  onClick={() => select(l.code)}
                  role="option"
                  aria-selected={l.code === current.code}
                >
                  {l.label}
                  {l.code === current.code && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 6.2l2.8 2.8L10 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
