import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useScrollDirection from '../../hooks/useScrollDirection';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import ModeSwitcher from '../ModeSwitcher/ModeSwitcher';
import { useSearchOverlay } from '../../context/SearchOverlayContext';
import styles from './Navbar.module.scss';

// Routes whose pages don't open with a full-bleed dark hero image — the
// navbar needs to default to its solid (opaque) look on these, since its
// transparent/white-text look is designed to sit over a dark photo.
const ALWAYS_SOLID_PREFIXES = ['/tours/'];

export default function Navbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { scrolledPast } = useScrollDirection(80);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openSearch } = useSearchOverlay();

  const NAV_LINKS = [
    { to: '/international', label: t('nav.international') },
    { to: '/domestic', label: t('nav.domestic') },
    { to: '/visas', label: t('nav.visas') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Global keyboard shortcut: Cmd/Ctrl+K opens search.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSearch]);

  const solid = scrolledPast || menuOpen || ALWAYS_SOLID_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <header className={`${styles.navbar} ${solid ? styles.solid : ''}`}>
      <nav className={styles.inner} aria-label="Primary">
        <Link to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          Brilliant
        </Link>

        <ul className={styles.links}>
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <div className={styles.modeDesktop}>
            <ModeSwitcher instanceId="desktop" />
          </div>

          <button
            type="button"
            className={styles.searchBtn}
            onClick={() => openSearch()}
            aria-label={t('nav.search')}
          >
            <svg width="19" height="19" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
              <path d="M14 14l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          <div className={styles.langDesktop}>
            <LanguageSwitcher variant="light" />
          </div>

          <button
            type="button"
            className={styles.hamburger}
            aria-label={t('nav.menu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {createPortal(
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Portaled to body: `.solid`'s backdrop-filter on <header> would
                  otherwise create a new containing block, trapping these
                  position:fixed overlays inside the navbar's own (84px) box. */}
              <motion.div
                className={styles.drawerBackdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setMenuOpen(false)}
              />
              <motion.div
                className={styles.drawer}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={styles.drawerHeader}>
                  <span className={styles.drawerLogo}>Brilliant</span>
                  <button type="button" className={styles.close} aria-label={t('nav.close')} onClick={() => setMenuOpen(false)}>
                    &times;
                  </button>
                </div>

                <ul className={styles.drawerLinks}>
                  <li>
                    <NavLink
                      to="/"
                      end
                      className={({ isActive }) => `${styles.drawerLink} ${isActive ? styles.drawerLinkActive : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" className={styles.drawerLinkIcon}>
                        <path d="M3 9.5L10 3l7 6.5M5 8v9h10V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className={styles.drawerLinkLabel}>{t('nav.home')}</span>
                      <svg width="7" height="11" viewBox="0 0 7 11" fill="none" aria-hidden="true" className={styles.drawerLinkChevron}>
                        <path d="M1 1l5 4.5L1 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </NavLink>
                  </li>
                  {NAV_LINKS.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        className={({ isActive }) => `${styles.drawerLink} ${isActive ? styles.drawerLinkActive : ''}`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className={styles.drawerLinkDot} aria-hidden="true" />
                        <span className={styles.drawerLinkLabel}>{link.label}</span>
                        <svg width="7" height="11" viewBox="0 0 7 11" fill="none" aria-hidden="true" className={styles.drawerLinkChevron}>
                          <path d="M1 1l5 4.5L1 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </NavLink>
                    </li>
                  ))}
                </ul>

                <div className={styles.drawerFooter}>
                  <ModeSwitcher instanceId="drawer" fullWidth />
                  <LanguageSwitcher variant="dark" />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}
