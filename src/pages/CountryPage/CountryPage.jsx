import { useMemo, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ScrollCue from '../../components/ScrollCue/ScrollCue';
import OfferCard from '../../components/OfferCard/OfferCard';
import FilterDrawer from '../../components/FilterDrawer/FilterDrawer';
import SortDropdown from '../../components/SortDropdown/SortDropdown';
import useFilteredOffers from '../../hooks/useFilteredOffers';
import countries from '../../data/countries';
import cities from '../../data/cities';
import offers from '../../data/offers';
import { getLocalizedField } from '../../utils/getLocalizedField';
import styles from './CountryPage.module.scss';

// Supplementary placeholder facts not in the core Country data model.
const EXTRA_FACTS = {
  france: { flightTime: '6h 40m', currency: 'EUR' },
  uae: { flightTime: '4h 10m', currency: 'AED' },
  maldives: { flightTime: '5h 50m', currency: 'MVR' },
  switzerland: { flightTime: '7h 20m', currency: 'CHF' },
  turkey: { flightTime: '3h 30m', currency: 'TRY' },
};

export default function CountryPage() {
  const { countrySlug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [extraFilters, setExtraFilters] = useState({});

  const country = countries.find((c) => c.slug === countrySlug);
  const countryCities = cities.filter((c) => c.countrySlug === countrySlug);
  const filters = useMemo(() => ({ ...extraFilters, type: 'international', countrySlug }), [extraFilters, countrySlug]);
  const allOffersFiltered = useFilteredOffers(offers, filters, sortBy, lang);

  if (!country) return <Navigate to="/international" replace />;

  const facts = EXTRA_FACTS[country.slug] ?? { flightTime: '—', currency: '—' };

  return (
    <>
      <section className={styles.hero} style={{ backgroundImage: `url(${country.heroImage})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <Breadcrumbs items={[{ label: t('nav.international'), to: '/international' }, { label: getLocalizedField(country.name, lang) }]} />
          <h1 className={styles.title}>{getLocalizedField(country.name, lang)}</h1>
          <p className={styles.intro}>{getLocalizedField(country.description, lang)}</p>
        </div>
        <ScrollCue label={t('common.scroll')} />
      </section>

      <section className={styles.factsSection}>
        <div className={styles.sectionInner}>
          <div className={styles.factsStrip}>
            <Fact label={t('country.bestSeason')} value={getLocalizedField(country.bestSeason, lang)} />
            <Fact label={t('country.flightTime')} value={facts.flightTime} />
            <Fact label={t('country.visaNote')} value={t(`visas.${country.visaRequirement === 'visa-free' ? 'visaFree' : country.visaRequirement === 'eVisa' ? 'eVisa' : 'visaRequired'}`)} />
            <Fact label={t('country.currency')} value={facts.currency} />
          </div>
        </div>
      </section>

      {countryCities.length > 0 && (
        <section className={styles.citiesSection}>
          <div className={styles.sectionInner}>
            <h2 className={styles.subheading}>{t('country.citiesTitle')}</h2>
            <div className={styles.cityGrid}>
              {countryCities.map((city, i) => (
                <motion.div
                  key={city.slug}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <Link to={`/international/${country.slug}/${city.slug}`} className={styles.cityTile}>
                    <img src={city.heroImage} alt={getLocalizedField(city.name, lang)} className={styles.cityImg} />
                    <span className={styles.cityName}>{getLocalizedField(city.name, lang)}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={styles.offersSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.subheading}>
            {t('country.offersTitle')} {getLocalizedField(country.name, lang)}
          </h2>
          <div className={styles.gridLayout}>
            <FilterDrawer
              filters={filters}
              onChange={(next) => setExtraFilters(next)}
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
                  {allOffersFiltered.length} {t('common.results')}
                </span>
                <SortDropdown value={sortBy} onChange={setSortBy} />
              </div>
              <div className={styles.offerGrid}>
                {allOffersFiltered.map((offer, i) => (
                  <OfferCard key={offer.id} offer={offer} index={i} />
                ))}
                {allOffersFiltered.length === 0 && <p className={styles.noResults}>{t('common.noResults')}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Fact({ label, value }) {
  return (
    <div className={styles.fact}>
      <span className={styles.factLabel}>{label}</span>
      <span className={styles.factValue}>{value}</span>
    </div>
  );
}
