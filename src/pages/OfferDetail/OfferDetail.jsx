import { useMemo, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ScrollCue from '../../components/ScrollCue/ScrollCue';
import Lightbox from '../../components/Lightbox/Lightbox';
import PackageComparison from '../../components/PackageComparison/PackageComparison';
import DateAvailability from '../../components/DateAvailability/DateAvailability';
import OfferCard from '../../components/OfferCard/OfferCard';
import countries from '../../data/countries';
import categories from '../../data/categories';
import offers from '../../data/offers';
import { getLocalizedField } from '../../utils/getLocalizedField';
import { formatPrice, applyPriceModifier } from '../../utils/formatPrice';
import styles from './OfferDetail.module.scss';

const countryBySlug = Object.fromEntries(countries.map((c) => [c.slug, c]));
const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

export default function OfferDetail() {
  const { offerSlug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedTier, setSelectedTier] = useState('standard');
  const [selectedDate, setSelectedDate] = useState(null);

  const offer = offers.find((o) => o.slug === offerSlug);

  const related = useMemo(() => {
    if (!offer) return [];
    return offers
      .filter((o) => o.id !== offer.id && (o.type === offer.type || o.tags.some((tg) => offer.tags.includes(tg))))
      .slice(0, 3);
  }, [offer]);

  if (!offer) return <Navigate to="/search" replace />;

  const eyebrow =
    offer.type === 'international'
      ? getLocalizedField(countryBySlug[offer.country]?.name, lang)
      : getLocalizedField(categoryBySlug[offer.categorySlug]?.name, lang);

  const pkg = offer.packages.find((p) => p.tier === selectedTier);
  const price = applyPriceModifier(offer.basePrice, pkg.priceModifier);

  return (
    <div className={styles.page}>
      {/* ===== 100VH HERO ===== */}
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${offer.images[0]})` }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroTop}>
          <Breadcrumbs
            items={[
              { label: offer.type === 'international' ? t('nav.international') : t('nav.domestic'), to: offer.type === 'international' ? '/international' : '/domestic' },
              { label: getLocalizedField(offer.title, lang) },
            ]}
          />
        </div>
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>{eyebrow}</span>
          <h1 className={styles.heroTitle}>{getLocalizedField(offer.title, lang)}</h1>
          <div className={styles.heroMeta}>
            <span>★ {offer.rating} ({offer.reviewCount})</span>
            <span>·</span>
            <span>{offer.duration.days} {t('common.days')}</span>
            <span>·</span>
            <span className={`${styles.levelPill} ${styles[offer.travelLevel]}`}>{t(`offer.${offer.travelLevel}`)}</span>
          </div>
          <button
            type="button"
            className={styles.galleryBtn}
            onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
          >
            ◧ {t('offer.viewGallery', { count: offer.images.length })}
          </button>
        </div>
        <ScrollCue label={t('common.scroll')} />
      </section>

      {/* ===== GALLERY THUMBNAILS ===== */}
      <div className={styles.gallery}>
        {offer.images.map((src, i) => (
          <button
            key={src}
            type="button"
            className={styles.galleryThumb}
            onClick={() => {
              setLightboxIndex(i);
              setLightboxOpen(true);
            }}
          >
            <img src={src} alt={`${getLocalizedField(offer.title, lang)} ${i + 1}`} />
          </button>
        ))}
      </div>

      <Lightbox
        images={offer.images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        alt={getLocalizedField(offer.title, lang)}
      />

      <div className={styles.layout}>
        {/* ===== MAIN CONTENT ===== */}
        <div className={styles.main}>
          <div className={styles.tags}>
            {offer.tags.map((tag) => (
              <span key={tag} className={styles.tagPill}>
                {t(`categories.${tag}`)}
              </span>
            ))}
          </div>

          <p className={styles.description}>{getLocalizedField(offer.description, lang)}</p>

          <div className={styles.servicesBlock}>
            <h2 className={styles.blockHeading}>{t('offer.includedServices')}</h2>
            <ul className={styles.servicesList}>
              {(offer.includedServices[lang] ?? offer.includedServices.en).map((s) => (
                <li key={s} className={styles.serviceItem}>
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3 8l3.5 3.5L13 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.comparisonBlock}>
            <PackageComparison offer={offer} onSelect={setSelectedTier} />
          </div>

          <div className={styles.datesBlock}>
            <DateAvailability dates={offer.availableDates} selected={selectedDate} onSelect={setSelectedDate} />
          </div>
        </div>

        {/* ===== STICKY BOOKING PANEL ===== */}
        <aside className={styles.booking}>
          <div className={styles.bookingCard}>
            <div className={styles.bookingPriceRow}>
              <span className={styles.bookingPriceFrom}>{t('common.from')}</span>
              <span className={styles.bookingPrice}>{formatPrice(price, offer.currency, lang)}</span>
              <span className={styles.bookingPriceUnit}>{t('common.perPerson')}</span>
            </div>
            <div className={styles.bookingTier}>{t(`offer.${selectedTier}`)}</div>
            {selectedDate && (
              <div className={styles.bookingDate}>
                {t('offer.selectDate')}: <strong>{selectedDate}</strong>
              </div>
            )}
            <button type="button" className={styles.bookingCta}>
              {t('common.bookNow')}
            </button>
          </div>
        </aside>
      </div>

      {/* ===== MOBILE STICKY BAR ===== */}
      <div className={styles.mobileBar}>
        <div>
          <span className={styles.mobileBarPrice}>{formatPrice(price, offer.currency, lang)}</span>
          <span className={styles.mobileBarUnit}>{t('common.perPerson')}</span>
        </div>
        <button type="button" className={styles.mobileBarCta}>
          {t('common.bookNow')}
        </button>
      </div>

      {/* ===== RELATED ===== */}
      {related.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={styles.relatedInner}>
            <h2 className={styles.blockHeading}>{t('offer.relatedTitle')}</h2>
            <div className={styles.relatedGrid}>
              {related.map((o, i) => (
                <OfferCard key={o.id} offer={o} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
