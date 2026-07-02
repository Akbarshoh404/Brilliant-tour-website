import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ScrollCue from '../../components/ScrollCue/ScrollCue';
import OfferCard from '../../components/OfferCard/OfferCard';
import PackageComparison from '../../components/PackageComparison/PackageComparison';
import FilterDrawer from '../../components/FilterDrawer/FilterDrawer';
import SortDropdown from '../../components/SortDropdown/SortDropdown';
import useFilteredOffers from '../../hooks/useFilteredOffers';
import offers from '../../data/offers';
import { img } from '../../data/images';
import styles from './Cruises.module.scss';

const HERO_IMAGE = img('cruise-ship-river-sunset-hero', 1920, 700);

export default function Cruises() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [filters, setFilters] = useState({ type: 'cruise' });

  const cruiseOffers = offers.filter((o) => o.type === 'cruise');
  const filtered = useFilteredOffers(cruiseOffers, filters, sortBy, lang);
  const comparisonOffer = cruiseOffers[0];

  return (
    <>
      <section className={styles.hero} style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <Breadcrumbs items={[{ label: t('nav.cruises') }]} />
          <span className={styles.eyebrow}>{t('cruises.eyebrow')}</span>
          <h1 className={styles.title}>{t('cruises.title')}</h1>
          <p className={styles.intro}>{t('cruises.intro')}</p>
        </div>
        <ScrollCue label={t('common.scroll')} />
      </section>

      {comparisonOffer && (
        <section className={styles.comparisonSection}>
          <div className={styles.sectionInner}>
            <h2 className={styles.subheading}>{t('cruises.cabinComparison')}</h2>
            <div className={styles.comparisonWrap}>
              <PackageComparison offer={comparisonOffer} />
            </div>
          </div>
        </section>
      )}

      <section className={styles.offersSection}>
        <div className={styles.sectionInner}>
          <div className={styles.gridLayout}>
            <FilterDrawer
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters({ type: 'cruise' })}
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
      </section>
    </>
  );
}
