import { useMemo, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ScrollCue from '../../components/ScrollCue/ScrollCue';
import OfferCard from '../../components/OfferCard/OfferCard';
import FilterDrawer from '../../components/FilterDrawer/FilterDrawer';
import FilterOpenerButton from '../../components/FilterOpenerButton/FilterOpenerButton';
import SortDropdown from '../../components/SortDropdown/SortDropdown';
import ViewToggle from '../../components/ViewToggle/ViewToggle';
import useFilteredOffers from '../../hooks/useFilteredOffers';
import countries from '../../data/countries';
import cities from '../../data/cities';
import offers from '../../data/offers';
import { getLocalizedField } from '../../utils/getLocalizedField';
import styles from './CityPage.module.scss';

const CITY_INTRO = { en: 'Journeys based in', ru: 'Туры с базой в', uz: 'Quyidagi shaharda asoslangan sayohatlar:' };

export default function CityPage() {
  const { countrySlug, citySlug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [extraFilters, setExtraFilters] = useState({});

  const city = cities.find((c) => c.slug === citySlug && c.countrySlug === countrySlug);
  const country = countries.find((c) => c.slug === countrySlug);

  const filters = useMemo(
    () => ({ ...extraFilters, type: 'international', countrySlug, city: citySlug }),
    [extraFilters, countrySlug, citySlug]
  );
  // useFilteredOffers doesn't filter by `city` directly — narrow the source set first.
  const cityOffers = useMemo(() => offers.filter((o) => o.city === citySlug), [citySlug]);
  const filtered = useFilteredOffers(cityOffers, filters, sortBy, lang);

  if (!city || !country) return <Navigate to="/international" replace />;

  return (
    <>
      <section className={styles.hero} style={{ backgroundImage: `url(${city.heroImage})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <Breadcrumbs
            items={[
              { label: t('nav.international'), to: '/international' },
              { label: getLocalizedField(country.name, lang), to: `/international/${country.slug}` },
              { label: getLocalizedField(city.name, lang) },
            ]}
          />
          <h1 className={styles.title}>{getLocalizedField(city.name, lang)}</h1>
          <p className={styles.intro}>
            {getLocalizedField(CITY_INTRO, lang)} {getLocalizedField(city.name, lang)}, {getLocalizedField(country.name, lang)}.
          </p>
        </div>
        <ScrollCue label={t('common.scroll')} />
      </section>

      <section className={styles.offersSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.subheading}>
            {t('city.offersTitle')} {getLocalizedField(city.name, lang)}
          </h2>
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
