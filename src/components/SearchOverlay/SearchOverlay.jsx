import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import useDebounce from '../../hooks/useDebounce';
import useLocalStorage from '../../hooks/useLocalStorage';
import { getLocalizedField } from '../../utils/getLocalizedField';
import countries from '../../data/countries';
import cities from '../../data/cities';
import offers from '../../data/offers';
import styles from './SearchOverlay.module.scss';

const POPULAR_SEARCHES = ['Samarkand', 'Dubai', 'Maldives', 'Bukhara', 'Honeymoon'];

const STATIC_SERVICES = [
  { id: 'svc-visa', label: { en: 'Visa support', ru: 'Визовая поддержка', uz: 'Viza yordami' }, to: '/visas' },
  { id: 'svc-custom', label: { en: 'Custom & private planning', ru: 'Индивидуальное планирование', uz: 'Individual rejalashtirish' }, to: '/collections/custom-private' },
  { id: 'svc-group', label: { en: 'Group bookings', ru: 'Групповые бронирования', uz: 'Guruhli buyurtmalar' }, to: '/collections/group' },
  { id: 'svc-insurance', label: { en: 'Travel insurance', ru: 'Страхование путешествий', uz: 'Sayohat sug‘urtasi' }, to: '/contact' },
];

export default function SearchOverlay({ isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recent, setRecent] = useLocalStorage('brilliant-recent-searches', []);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 200);

  // Reset query/selection each time the overlay opens. Adjusted during
  // render (React's documented "previous prop" pattern, state-based rather
  // than ref-based) since the component stays mounted across opens/closes.
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setQuery('');
      setActiveIndex(-1);
    }
  }

  // Focusing the input is a genuine DOM side effect, so it stays in an effect.
  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => inputRef.current?.focus());
  }, [isOpen]);

  const groups = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];

    const matchCountries = countries
      .filter((c) => getLocalizedField(c.name, lang).toLowerCase().includes(q))
      .map((c) => ({ id: `country-${c.slug}`, label: getLocalizedField(c.name, lang), to: `/international/${c.slug}` }));

    const matchCities = cities
      .filter((c) => getLocalizedField(c.name, lang).toLowerCase().includes(q))
      .map((c) => ({ id: `city-${c.slug}`, label: getLocalizedField(c.name, lang), to: `/international/${c.countrySlug}/${c.slug}` }));

    const matchTours = offers
      .filter((o) => o.type !== 'cruise' && getLocalizedField(o.title, lang).toLowerCase().includes(q))
      .slice(0, 6)
      .map((o) => ({ id: `tour-${o.slug}`, label: getLocalizedField(o.title, lang), to: `/tours/${o.slug}` }));

    const matchCruises = offers
      .filter((o) => o.type === 'cruise' && getLocalizedField(o.title, lang).toLowerCase().includes(q))
      .map((o) => ({ id: `cruise-${o.slug}`, label: getLocalizedField(o.title, lang), to: `/tours/${o.slug}` }));

    const matchServices = STATIC_SERVICES
      .filter((s) => getLocalizedField(s.label, lang).toLowerCase().includes(q))
      .map((s) => ({ id: s.id, label: getLocalizedField(s.label, lang), to: s.to }));

    const matchVisas = countries
      .filter((c) => getLocalizedField(c.name, lang).toLowerCase().includes(q))
      .map((c) => ({ id: `visa-${c.slug}`, label: `${getLocalizedField(c.name, lang)} — ${c.visaRequirement}`, to: '/visas' }));

    return [
      { key: 'countries', title: t('search.countries'), items: matchCountries },
      { key: 'cities', title: t('search.cities'), items: matchCities },
      { key: 'tours', title: t('search.tours'), items: matchTours },
      { key: 'cruises', title: t('search.cruises'), items: matchCruises },
      { key: 'services', title: t('search.services'), items: matchServices },
      { key: 'visas', title: t('search.visas'), items: matchVisas },
    ].filter((g) => g.items.length > 0);
  }, [debouncedQuery, lang, t]);

  const flatItems = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  const goTo = (item) => {
    if (!item) return;
    setRecent((prev) => [item.label, ...prev.filter((r) => r !== item.label)].slice(0, 6));
    onClose();
    navigate(item.to);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      goTo(flatItems[activeIndex]);
    }
  };

  let runningIndex = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.search')}
        >
          <motion.div
            className={styles.panel}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.inputRow}>
              <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
                <path d="M14 14l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={t('search.placeholder')}
                className={styles.input}
                aria-autocomplete="list"
              />
              <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={t('nav.close')}>
                &times;
              </button>
            </div>

            <div className={styles.results}>
              {debouncedQuery.trim() === '' && (
                <div className={styles.emptyState}>
                  <div className={styles.chipGroup}>
                    <span className={styles.chipLabel}>{t('search.popularSearches')}</span>
                    <div className={styles.chips}>
                      {POPULAR_SEARCHES.map((term) => (
                        <button key={term} type="button" className={styles.chip} onClick={() => setQuery(term)}>
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                  {recent.length > 0 && (
                    <div className={styles.chipGroup}>
                      <span className={styles.chipLabel}>{t('search.recentSearches')}</span>
                      <div className={styles.chips}>
                        {recent.map((term) => (
                          <button key={term} type="button" className={styles.chip} onClick={() => setQuery(term)}>
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {debouncedQuery.trim() !== '' && groups.length === 0 && (
                <p className={styles.noResults}>
                  {t('search.noResults')} &ldquo;{debouncedQuery}&rdquo;
                </p>
              )}

              {groups.map((group) => (
                <div key={group.key} className={styles.group}>
                  <span className={styles.groupTitle}>{group.title}</span>
                  <ul>
                    {group.items.map((item, idx) => {
                      runningIndex += 1;
                      const isActive = runningIndex === activeIndex;
                      const myIndex = runningIndex;
                      return (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: idx * 0.03 }}
                        >
                          <button
                            type="button"
                            className={`${styles.resultItem} ${isActive ? styles.activeItem : ''}`}
                            onMouseEnter={() => setActiveIndex(myIndex)}
                            onClick={() => goTo(item)}
                          >
                            {item.label}
                          </button>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
