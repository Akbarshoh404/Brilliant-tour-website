import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import FlagIcon from '../FlagIcon/FlagIcon';
import { getLocalizedField } from '../../utils/getLocalizedField';
import styles from './CountrySelect.module.scss';

// Custom dropdown standing in for a native <select> — <option> elements
// can't render an <img>/flag, so a country picker that needs to show flags
// has to be built by hand instead.
export default function CountrySelect({ options, value, onChange, placeholder }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.slug === value);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const select = (slug) => {
    onChange(slug);
    setOpen(false);
  };

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={styles.triggerContent}>
          {selected ? (
            <>
              <FlagIcon iso={selected.iso} size={22} className={styles.triggerFlag} />
              {getLocalizedField(selected.name, lang)}
            </>
          ) : (
            placeholder
          )}
        </span>
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
            <li>
              <button
                type="button"
                className={`${styles.option} ${!value ? styles.active : ''}`}
                onClick={() => select('')}
                role="option"
                aria-selected={!value}
              >
                {placeholder}
              </button>
            </li>
            {options.map((o) => (
              <li key={o.slug}>
                <button
                  type="button"
                  className={`${styles.option} ${value === o.slug ? styles.active : ''}`}
                  onClick={() => select(o.slug)}
                  role="option"
                  aria-selected={value === o.slug}
                >
                  <FlagIcon iso={o.iso} size={20} className={styles.optionFlag} />
                  {getLocalizedField(o.name, lang)}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
