import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import FlagIcon from '../FlagIcon/FlagIcon';
import { getLocalizedField } from '../../utils/getLocalizedField';
import styles from './CountrySelect.module.scss';

// Custom dropdown standing in for a native <select> — <option> elements
// can't render an <img>/flag, so a country picker that needs to show flags
// has to be built by hand instead.
//
// The menu is rendered through a portal into <body> instead of as a normal
// absolutely-positioned child: this component lives inside FilterDrawer's
// collapsible accordion section, which needs `overflow: hidden` on its own
// wrapper for the expand/collapse height animation — that same overflow
// was silently clipping the dropdown, making it look like the option list
// "wasn't showing" (it was rendered, just cut off and painted under the
// filter sections that follow).
export default function CountrySelect({ options, value, onChange, placeholder }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [open, setOpen] = useState(false);
  const [menuRect, setMenuRect] = useState(null);
  const wrapRef = useRef(null);
  const selected = options.find((o) => o.slug === value);

  const openMenu = useCallback(() => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (rect) {
      setMenuRect({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    }
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target) && !e.target.closest(`.${styles.menu}`)) {
        setOpen(false);
      }
    };
    // Closing on scroll/resize avoids having to keep a fixed-position menu
    // in sync with the trigger while the page moves under it.
    const onScrollOrResize = () => setOpen(false);
    document.addEventListener('mousedown', onClickOutside);
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [open]);

  const select = (slug) => {
    onChange(slug);
    setOpen(false);
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => (open ? setOpen(false) : openMenu())}
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

      {createPortal(
        <AnimatePresence>
          {open && menuRect && (
            <motion.ul
              className={styles.menu}
              role="listbox"
              style={{ position: 'fixed', top: menuRect.top, left: menuRect.left, width: menuRect.width }}
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
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
