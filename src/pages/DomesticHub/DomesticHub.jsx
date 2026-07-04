import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DestinationHero from '../../components/DestinationHero/DestinationHero';
import OfferCard from '../../components/OfferCard/OfferCard';
import FilterDrawer from '../../components/FilterDrawer/FilterDrawer';
import FilterOpenerButton from '../../components/FilterOpenerButton/FilterOpenerButton';
import SortDropdown from '../../components/SortDropdown/SortDropdown';
import ViewToggle from '../../components/ViewToggle/ViewToggle';
import useFilteredOffers from '../../hooks/useFilteredOffers';
import categories from '../../data/categories';
import offers from '../../data/offers';
import { getLocalizedField } from '../../utils/getLocalizedField';
import styles from './DomesticHub.module.scss';

const UZBEKISTAN_NAME = { en: 'Uzbekistan', ru: 'Узбекистан', uz: 'O‘zbekiston' };

export default function DomesticHub() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [extraFilters, setExtraFilters] = useState({});

  const domesticOffers = useMemo(() => offers.filter((o) => o.type === 'domestic'), []);
  const filters = useMemo(() => ({ ...extraFilters, type: 'domestic' }), [extraFilters]);
  const filtered = useFilteredOffers(domesticOffers, filters, sortBy, lang);

  const heroSlides = categories.map((cat) => ({
    image: cat.heroImage,
    name: getLocalizedField(cat.name, lang),
    sublabel: getLocalizedField(UZBEKISTAN_NAME, lang),
    to: `/domestic/${cat.slug}`,
  }));

  return (
    <>
      <DestinationHero
        eyebrow={t('domestic.eyebrow')}
        title={t('domestic.title')}
        subtitle={t('domestic.intro')}
        slides={heroSlides}
        scrollLabel={t('common.scroll')}
      />

      <section className={styles.offersSection}>
        <div className={styles.sectionInner}>
          <div className={styles.listingHeading}>
            <h2>{t('domestic.allOffers')}</h2>
          </div>
          <div className={styles.gridLayout}>
            <FilterDrawer
              filters={filters}
              onChange={setExtraFilters}
              onClear={() => setExtraFilters({})}
              isOpen={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              showDestination={false}
              showCategory
            />
            <div className={styles.results}>
              <div className={styles.resultsHeader}>
                <FilterOpenerButton filters={filters} onClick={() => setDrawerOpen(true)} />
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
