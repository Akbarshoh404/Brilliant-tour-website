import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OfferCard from '../../components/OfferCard/OfferCard';
import FilterDrawer from '../../components/FilterDrawer/FilterDrawer';
import SortDropdown from '../../components/SortDropdown/SortDropdown';
import ScrollCue from '../../components/ScrollCue/ScrollCue';
import useFilteredOffers from '../../hooks/useFilteredOffers';
import useDebounce from '../../hooks/useDebounce';
import offers from '../../data/offers';
import searchHero from '../../assets/pics/photo_12_2026-06-30_15-23-57.jpg';
import styles from './SearchResults.module.scss';

export default function SearchResults() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [sortBy, setSortBy] = useState('popular');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [extraFilters, setExtraFilters] = useState(() => {
    const tag = searchParams.get('tag');
    return tag ? { tags: [tag] } : {};
  });

  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (debouncedQuery) next.set('q', debouncedQuery);
    else next.delete('q');
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const filters = useMemo(() => ({ ...extraFilters, query: debouncedQuery }), [extraFilters, debouncedQuery]);
  const filtered = useFilteredOffers(offers, filters, sortBy, lang);

  return (
    <div className={styles.page}>
      <div className={styles.hero} style={{ backgroundImage: `url(${searchHero})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t('search.heroTitle')}</h1>
          <p className={styles.heroSubtitle}>{t('search.heroSubtitle')}</p>
          <div className={styles.searchRow}>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className={styles.searchIcon}>
              <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
              <path d="M14 14l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className={styles.searchInput}
              aria-label={t('search.placeholder')}
            />
          </div>
        </div>
        <ScrollCue label={t('common.scroll')} />
      </div>

      <div className={styles.sectionInner}>
        <div className={styles.gridLayout}>
          <FilterDrawer
            filters={filters}
            onChange={setExtraFilters}
            onClear={() => setExtraFilters({})}
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          />
          <div className={styles.results}>
            <div className={styles.resultsHeader}>
              <button type="button" className={styles.mobileFilterBtn} onClick={() => setDrawerOpen(true)}>
                {t('common.filters')}
              </button>
              <span className={styles.resultCount}>
                {filtered.length} {t('common.results')}
              </span>
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>
            <div className={styles.offerGrid}>
              {filtered.map((offer, i) => (
                <OfferCard key={offer.id} offer={offer} index={i} />
              ))}
              {filtered.length === 0 && <p className={styles.noResults}>{t('common.noResults')}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
