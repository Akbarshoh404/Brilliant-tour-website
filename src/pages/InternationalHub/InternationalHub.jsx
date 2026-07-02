import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import DestinationHero from '../../components/DestinationHero/DestinationHero';
import OfferCard from '../../components/OfferCard/OfferCard';
import FilterDrawer from '../../components/FilterDrawer/FilterDrawer';
import SortDropdown from '../../components/SortDropdown/SortDropdown';
import useFilteredOffers from '../../hooks/useFilteredOffers';
import countries from '../../data/countries';
import cities from '../../data/cities';
import offers from '../../data/offers';
import { getLocalizedField } from '../../utils/getLocalizedField';
import styles from './InternationalHub.module.scss';

const REGIONS = ['Europe', 'Middle East', 'Asia'];

// The curated countries featured in the hero — matches the Home countries
// showcase, each paired with its most popular city.
const FEATURED_SLUGS = ['uae', 'france', 'germany', 'korea', 'japan'];
const POPULAR_CITY_SLUG = { uae: 'dubai', france: 'paris', germany: 'berlin', korea: 'seoul', japan: 'tokyo' };

function OfferRow({ title, offers: rowOffers, viewAllTo, t }) {
  if (rowOffers.length === 0) return null;
  return (
    <div className={styles.row}>
      <div className={styles.rowHeader}>
        <h2>{title}</h2>
        <Link to={viewAllTo} className={styles.viewAll}>
          {t('common.viewAll')}
        </Link>
      </div>
      <div className={styles.rowScroll}>
        {rowOffers.map((offer, i) => (
          <div key={offer.id} className={styles.rowItem}>
            <OfferCard offer={offer} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InternationalHub() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [region, setRegion] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({ type: 'international' });
  const [sortBy, setSortBy] = useState('popular');

  const filteredCountries = region ? countries.filter((c) => c.region === region) : countries;
  const intlOffers = useMemo(() => offers.filter((o) => o.type === 'international'), []);

  const seasonal = intlOffers.filter((o) => o.isSpecialOffer);
  const luxury = intlOffers.filter((o) => o.tags.includes('luxury'));
  const honeymoon = intlOffers.filter((o) => o.tags.includes('honeymoon'));
  const cruise = offers.filter((o) => o.type === 'cruise');
  const religious = intlOffers.filter((o) => o.tags.includes('religious'));

  const allFiltered = useFilteredOffers(intlOffers, filters, sortBy, lang);

  const heroSlides = FEATURED_SLUGS.map((slug) => {
    const country = countries.find((c) => c.slug === slug);
    const city = cities.find((c) => c.slug === POPULAR_CITY_SLUG[slug]);
    return {
      image: city?.heroImage ?? country.heroImage,
      name: city ? getLocalizedField(city.name, lang) : getLocalizedField(country.name, lang),
      sublabel: getLocalizedField(country.name, lang),
      to: `/international/${slug}`,
    };
  });

  return (
    <>
      <DestinationHero
        eyebrow={t('international.eyebrow')}
        title={t('international.title')}
        subtitle={t('international.intro')}
        slides={heroSlides}
        scrollLabel={t('common.scroll')}
      />

      <section className={styles.regionSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.regionTitle}>{t('international.regions')}</h2>
          <div className={styles.chips}>
            <button type="button" className={`${styles.chip} ${!region ? styles.chipActive : ''}`} onClick={() => setRegion(null)}>
              {t('international.allRegions')}
            </button>
            {REGIONS.map((r) => (
              <button key={r} type="button" className={`${styles.chip} ${region === r ? styles.chipActive : ''}`} onClick={() => setRegion(r)}>
                {r}
              </button>
            ))}
          </div>

          <div className={styles.countryGrid}>
            {filteredCountries.map((c, i) => (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
              >
                <Link to={`/international/${c.slug}`} className={styles.countryTile}>
                  <img src={c.heroImage} alt={getLocalizedField(c.name, lang)} className={styles.countryImg} />
                  <span className={styles.countryName}>{getLocalizedField(c.name, lang)}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.curated}>
        <div className={styles.sectionInner}>
          <OfferRow title={t('international.seasonalOffers')} offers={seasonal} viewAllTo="/search?tag=seasonal" t={t} />
          <OfferRow title={t('international.luxuryTrips')} offers={luxury} viewAllTo="/collections/luxury" t={t} />
          <OfferRow title={t('international.honeymoonPackages')} offers={honeymoon} viewAllTo="/collections/honeymoon" t={t} />
          <OfferRow title={t('international.cruisePackages')} offers={cruise} viewAllTo="/cruises" t={t} />
          <OfferRow title={t('international.religiousTourism')} offers={religious} viewAllTo="/collections/religious" t={t} />
        </div>
      </section>

      <section className={styles.allOffers}>
        <div className={styles.sectionInner}>
          <button type="button" className={styles.toggleBtn} onClick={() => setShowAll((s) => !s)}>
            {showAll ? '−' : '+'} {t('international.allOffers')}
          </button>

          {showAll && (
            <div className={styles.gridLayout}>
              <FilterDrawer
                filters={filters}
                onChange={setFilters}
                onClear={() => setFilters({ type: 'international' })}
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              />
              <div className={styles.results}>
                <div className={styles.resultsHeader}>
                  <button type="button" className={styles.mobileFilterBtn} onClick={() => setDrawerOpen(true)}>
                    {t('common.filters')}
                  </button>
                  <span className={styles.resultCount}>
                    {allFiltered.length} {t('common.results')}
                  </span>
                  <SortDropdown value={sortBy} onChange={setSortBy} />
                </div>
                <div className={styles.offerGrid}>
                  {allFiltered.map((offer, i) => (
                    <OfferCard key={offer.id} offer={offer} index={i} />
                  ))}
                  {allFiltered.length === 0 && <p className={styles.noResults}>{t('common.noResults')}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
