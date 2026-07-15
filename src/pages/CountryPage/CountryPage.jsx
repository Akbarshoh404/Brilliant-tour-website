import { useMemo, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ScrollCue from '../../components/ScrollCue/ScrollCue';
import OfferCard from '../../components/OfferCard/OfferCard';
import FilterDrawer from '../../components/FilterDrawer/FilterDrawer';
import FilterOpenerButton from '../../components/FilterOpenerButton/FilterOpenerButton';
import SortDropdown from '../../components/SortDropdown/SortDropdown';
import ViewToggle from '../../components/ViewToggle/ViewToggle';
import Lightbox from '../../components/Lightbox/Lightbox';
import FlagIcon from '../../components/FlagIcon/FlagIcon';
import Seo from '../../components/Seo/Seo';
import { breadcrumbSchema } from '../../utils/structuredData';
import useFilteredOffers from '../../hooks/useFilteredOffers';
import countries from '../../data/countries';
import cities from '../../data/cities';
import offers from '../../data/offers';
import countryGallery from '../../data/countryGallery';
import visaCountries from '../../data/visaCountries';
import { getLocalizedField } from '../../utils/getLocalizedField';
import styles from './CountryPage.module.scss';

// Supplementary placeholder facts not in the core Country data model.
const EXTRA_FACTS = {
  france: { flightTime: '6h 40m', currency: 'EUR' },
  uae: { flightTime: '4h 10m', currency: 'AED' },
  maldives: { flightTime: '5h 50m', currency: 'MVR' },
  switzerland: { flightTime: '7h 20m', currency: 'CHF' },
  turkey: { flightTime: '3h 30m', currency: 'TRY' },
  germany: { flightTime: '6h 10m', currency: 'EUR' },
  korea: { flightTime: '7h 50m', currency: 'KRW' },
  japan: { flightTime: '8h 40m', currency: 'JPY' },
};

export default function CountryPage() {
  const { countrySlug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [extraFilters, setExtraFilters] = useState({});
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const country = countries.find((c) => c.slug === countrySlug);
  const countryCities = cities.filter((c) => c.countrySlug === countrySlug);
  const filters = useMemo(() => ({ ...extraFilters, type: 'international', countrySlug }), [extraFilters, countrySlug]);
  const allOffersFiltered = useFilteredOffers(offers, filters, sortBy, lang);
  const gallery = countryGallery[countrySlug] ?? [];
  const visaInfo = visaCountries.find((v) => v.slug === countrySlug);

  if (!country) return <Navigate to="/international" replace />;

  const facts = EXTRA_FACTS[country.slug] ?? { flightTime: '—', currency: '—' };
  const visaStatusKey = country.visaRequirement === 'visa-free' ? 'visaFree' : country.visaRequirement === 'eVisa' ? 'eVisa' : 'visaRequired';

  const countryName = getLocalizedField(country.name, lang);
  const breadcrumbItems = [{ label: t('nav.international'), to: '/international' }, { label: countryName }];

  return (
    <>
      <Seo
        title={`Туры в ${countryName}`}
        description={`${countryName}: готовые туры, визовые требования и лучшие даты для поездки — подберите маршрут вместе с Brilliant Tourism.`}
        image={country.heroImage}
        jsonLd={breadcrumbSchema(breadcrumbItems)}
      />
      <section className={styles.hero} style={{ backgroundImage: `url(${country.heroImage})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <Breadcrumbs items={breadcrumbItems} />
          <div className={styles.heroBadgeRow}>
            <span className={styles.heroFlagBadge}>
              <FlagIcon iso={country.iso} size={32} className={styles.heroFlagIcon} />
              {country.region}
            </span>
            <span className={styles.heroVisaBadge}>{t(`visas.${visaStatusKey}`)}</span>
          </div>
          <h1 className={styles.title}>{getLocalizedField(country.name, lang)}</h1>
          <p className={styles.intro}>{getLocalizedField(country.description, lang)}</p>
          <div className={styles.heroActions}>
            <a href="#offers" className={styles.heroCta}>{t('country.exploreToursCta')}</a>
            {visaInfo && (
              <a href="#visa" className={styles.heroCtaGhost}>{t('country.visaCta')}</a>
            )}
          </div>
        </div>
        <ScrollCue label={t('common.scroll')} />
      </section>

      {/* Online booking isn't live for international tours yet — this
          banner routes interested travelers to Contact Us instead. */}
      <section className={styles.comingSoonSection}>
        <div className={styles.sectionInner}>
          <div className={styles.comingSoonBanner}>
            <span className={styles.comingSoonTag}>{t('common.comingSoon')}</span>
            <p className={styles.comingSoonText}>{t('international.comingSoonText')}</p>
            <Link to="/contact" className={styles.comingSoonBtn}>{t('common.contactUs')}</Link>
          </div>
        </div>
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

      {gallery.length > 0 && (
        <section className={styles.gallerySection}>
          <div className={styles.sectionInner}>
            <h2 className={styles.subheading}>{t('country.galleryTitle')}</h2>
            <div className={styles.galleryMosaic}>
              {gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={`${styles.galleryItem} ${styles[`galleryItem${i}`] ?? ''}`}
                  onClick={() => {
                    setLightboxIndex(i);
                    setLightboxOpen(true);
                  }}
                >
                  <img src={src} alt={`${getLocalizedField(country.name, lang)} ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <Lightbox
        images={gallery}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        alt={getLocalizedField(country.name, lang)}
      />

      {visaInfo && (
        <section id="visa" className={styles.visaSection}>
          <div className={styles.sectionInner}>
            <h2 className={styles.subheading}>
              {t('country.visaTitle')} {getLocalizedField(country.name, lang)}
            </h2>
            <div className={styles.visaCard}>
              <div className={styles.visaHead}>
                <FlagIcon iso={visaInfo.iso} size={72} className={styles.visaFlag} />
                <div className={styles.visaHeadText}>
                  <span className={styles.visaType}>{t(`visas.types.${visaInfo.visaTypeKey}`)}</span>
                  <p className={styles.visaIntro}>{t('country.visaIntro')}</p>
                </div>
                <span className={styles.visaPriceBadge}>
                  <span className={styles.visaPriceLabel}>{t('visas.priceFrom')}</span>
                  <span className={styles.visaPriceValue}>${visaInfo.priceFrom}</span>
                </span>
              </div>

              <div className={styles.visaFacts}>
                <div>
                  <span className={styles.factLabel}>{t('visas.processingTime')}</span>
                  <span className={styles.factValue}>{visaInfo.processingDays} {t('visas.businessDays')}</span>
                </div>
              </div>

              <div className={styles.reqTitle}>{t('visas.requirementsTitle')}</div>
              <div className={styles.reqList}>
                {visaInfo.requirementKeys.map((key) => (
                  <span key={key} className={styles.reqPill}>{t(`visas.req.${key}`)}</span>
                ))}
              </div>

              {/* Visa applications aren't handled online yet — send
                  travelers to Contact Us instead of a fake apply form. */}
              <Link to="/contact" className={styles.visaCta}>
                {t('country.visaCta')}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={styles.visaCtaIcon}>
                  <path d="M4 10L10 4M10 4H5M10 4V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

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

      <section id="offers" className={styles.offersSection}>
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
                <FilterOpenerButton filters={filters} onClick={() => setDrawerOpen(true)} />
                <span className={styles.resultCount}>
                  {allOffersFiltered.length} {t('common.results')}
                </span>
                <div className={styles.resultsControls}>
                  <SortDropdown value={sortBy} onChange={setSortBy} />
                  <ViewToggle value={viewMode} onChange={setViewMode} />
                </div>
              </div>
              <div className={viewMode === 'list' ? styles.offerGridList : styles.offerGrid}>
                {allOffersFiltered.map((offer, i) => (
                  <OfferCard key={offer.id} offer={offer} index={i} layout={viewMode} />
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
