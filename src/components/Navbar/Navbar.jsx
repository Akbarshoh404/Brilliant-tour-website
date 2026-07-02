import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useScrollDirection from '../../hooks/useScrollDirection';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import SearchOverlay from '../SearchOverlay/SearchOverlay';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const { t } = useTranslation();
  const { scrolledPast } = useScrollDirection(80);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const NAV_LINKS = [
    { to: '/international', label: t('nav.international') },
    { to: '/domestic', label: t('nav.domestic') },
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
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const solid = scrolledPast || menuOpen;

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
          <button
            type="button"
            className={styles.searchBtn}
            onClick={() => setSearchOpen(true)}
            aria-label={t('nav.search')}
          >
            <svg width="19" height="19" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
              <path d="M14 14l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          <div className={styles.langDesktop}>
            <LanguageSwitcher variant={solid ? 'dark' : 'light'} />
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
        <>
          {/* Portaled to body: `.solid`'s backdrop-filter on <header> would
              otherwise create a new containing block, trapping these
              position:fixed overlays inside the navbar's own (84px) box. */}
          <div className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`}>
            <button type="button" className={styles.close} aria-label={t('nav.close')} onClick={() => setMenuOpen(false)}>
              &times;
            </button>
            <ul className={styles.overlayLinks}>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className={styles.overlayLink} onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className={styles.overlayLang}>
              <LanguageSwitcher variant="dark" />
            </div>
          </div>

          <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>,
        document.body
      )}
    </header>
  );
}
