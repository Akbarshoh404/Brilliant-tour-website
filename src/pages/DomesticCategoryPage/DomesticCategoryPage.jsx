import { useMemo, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ScrollCue from '../../components/ScrollCue/ScrollCue';
import OfferCard from '../../components/OfferCard/OfferCard';
import FilterDrawer from '../../components/FilterDrawer/FilterDrawer';
import SortDropdown from '../../components/SortDropdown/SortDropdown';
import ViewToggle from '../../components/ViewToggle/ViewToggle';
import useFilteredOffers from '../../hooks/useFilteredOffers';
import categories from '../../data/categories';
import offers from '../../data/offers';
import { getLocalizedField } from '../../utils/getLocalizedField';
import styles from './DomesticCategoryPage.module.scss';

export default function DomesticCategoryPage() {
  const { categorySlug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [extraFilters, setExtraFilters] = useState({});

  const category = categories.find((c) => c.slug === categorySlug);
  const filters = useMemo(
    () => ({ ...extraFilters, type: 'domestic', categorySlug }),
    [extraFilters, categorySlug]
  );
  const filtered = useFilteredOffers(offers, filters, sortBy, lang);

  if (!category) return <Navigate to="/domestic" replace />;

  return (
    <>
      <section className={styles.hero} style={{ backgroundImage: `url(${category.heroImage})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <Breadcrumbs items={[{ label: t('nav.domestic'), to: '/domestic' }, { label: getLocalizedField(category.name, lang) }]} />
          <h1 className={styles.title}>{getLocalizedField(category.name, lang)}</h1>
          <p className={styles.intro}>{getLocalizedField(category.description, lang)}</p>
        </div>
        <ScrollCue label={t('common.scroll')} />
      </section>

      <section className={styles.offersSection}>
        <div className={styles.sectionInner}>
          <div className={styles.gridLayout}>
            <FilterDrawer
              filters={filters}
              onChange={setExtraFilters}
              onClear={() => setExtraFilters({})}
              isOpen={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              showDestination={false}
            />
            <div className={styles.results}>
              <div className={styles.resultsHeader}>
                <button type="button" className={styles.mobileFilterBtn} onClick={() => setDrawerOpen(true)}>
                  {t('common.filters')}
                </button>
                <span className={styles.resultCount}>
                  {filtered.length} {t('common.results')}
                </span>
                <div className={styles.resultsControls}>
                  <SortDropdown value={sortBy} onChange={setSortBy} />
                  <ViewToggle value={viewMode} onChange={setViewMode} />
                </div>
              </div>
              <div className={viewMode === 'list' ? styles.offerGridList : styles.offerGrid}>
                {filtered.map((offer, i) => (
                  <OfferCard key={offer.id} offer={offer} index={i} layout={viewMode} />
                ))}
                {filtered.length === 0 && <p className={styles.noResults}>{t('common.noResults')}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
