import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './SortDropdown.module.scss';

const OPTIONS = ['popular', 'recommended', 'priceLow', 'priceHigh', 'premiumFirst', 'shortest', 'newest', 'rated'];

export default function SortDropdown({ value, onChange }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className={styles.wrap} ref={ref}>
      <button type="button" className={styles.trigger} onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        <span className={styles.label}>{t('common.sortBy')}:</span>
        <span className={styles.value}>{t(`sort.${value}`)}</span>
        <svg className={styles.chevron} width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            className={styles.menu}
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {OPTIONS.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  className={`${styles.option} ${opt === value ? styles.active : ''}`}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  role="option"
                  aria-selected={opt === value}
                >
                  {t(`sort.${opt}`)}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
