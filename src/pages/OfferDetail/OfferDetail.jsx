import { useMemo, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Lightbox from '../../components/Lightbox/Lightbox';
import BookingCalendar from '../../components/BookingCalendar/BookingCalendar';
import OfferCard from '../../components/OfferCard/OfferCard';
import countries from '../../data/countries';
import categories from '../../data/categories';
import offers from '../../data/offers';
import { getReviewsForOffer } from '../../data/reviews';
import { getLocalizedField } from '../../utils/getLocalizedField';
import { formatPrice, applyPriceModifier } from '../../utils/formatPrice';
import styles from './OfferDetail.module.scss';

const countryBySlug = Object.fromEntries(countries.map((c) => [c.slug, c]));
const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
const TIERS = ['economy', 'standard', 'premium'];

const LOCALE_BY_LANG = { en: 'en-US', ru: 'ru-RU', uz: 'uz-UZ' };

function Stars({ rating }) {
  const filled = Math.round(rating);
  return (
    <span className={styles.stars} aria-hidden="true">
      {'★'.repeat(filled)}
      {'☆'.repeat(Math.max(0, 5 - filled))}
    </span>
  );
}

export default function OfferDetail() {
  const { offerSlug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState('standard');
  const [selectedDate, setSelectedDate] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);

  const offer = offers.find((o) => o.slug === offerSlug);

  const related = useMemo(() => {
    if (!offer) return [];
    return offers
      .filter((o) => o.id !== offer.id && (o.type === offer.type || o.tags.some((tg) => offer.tags.includes(tg))))
      .slice(0, 3);
  }, [offer]);

  const reviews = useMemo(() => (offer ? getReviewsForOffer(offer) : []), [offer]);

  if (!offer) return <Navigate to="/" replace />;

  const eyebrow =
    offer.type === 'international'
      ? getLocalizedField(countryBySlug[offer.country]?.name, lang)
      : getLocalizedField(categoryBySlug[offer.categorySlug]?.name, lang);

  const pkg = offer.packages.find((p) => p.tier === selectedTier);
  const price = applyPriceModifier(offer.basePrice, pkg.priceModifier);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(LOCALE_BY_LANG[lang] ?? 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const parentTo = offer.type === 'international' ? '/international' : '/domestic';

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbRow}>
        <Link to={parentTo} className={styles.backBtn} aria-label={t('common.back')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <Breadcrumbs
          variant="onLight"
          items={[
            { label: offer.type === 'international' ? t('nav.international') : t('nav.domestic'), to: parentTo },
            { label: getLocalizedField(offer.title, lang) },
          ]}
        />
      </div>

      {/* ===== PRODUCT SECTION ===== */}
      <div className={styles.productLayout}>
        <div className={styles.gallery}>
          <button type="button" className={styles.mainImageWrap} onClick={() => setLightboxOpen(true)}>
            <img src={offer.images[activeImage]} alt={getLocalizedField(offer.title, lang)} className={styles.mainImage} />
          </button>
          <div className={styles.thumbRow}>
            {offer.images.map((src, i) => (
              <button
                key={src}
                type="button"
                className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ''}`}
                onClick={() => setActiveImage(i)}
              >
                <img src={src} alt={`${getLocalizedField(offer.title, lang)} ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.infoPanel}>
          {offer.isSpecialOffer && <span className={styles.badge}>{t('common.from')} -{offer.discountPercent}%</span>}
          <span className={styles.brandEyebrow}>{eyebrow}</span>
          <h1 className={styles.productTitle}>{getLocalizedField(offer.title, lang)}</h1>

          <a href="#reviews" className={styles.ratingRow}>
            <Stars rating={offer.rating} />
            <span className={styles.ratingNum}>{offer.rating}</span>
            <span className={styles.reviewCount}>({offer.reviewCount} {t('offer.reviews')})</span>
          </a>

          <div className={styles.priceRow}>{formatPrice(price, offer.currency, lang)}</div>

          <div className={styles.optionGroup}>
            <span className={styles.optionLabel}>
              {t('offer.packageComparison')}: <strong>{t(`offer.${selectedTier}`)}</strong>
            </span>
            <div className={styles.swatches}>
              {TIERS.map((tier) => (
                <button
                  key={tier}
                  type="button"
                  className={`${styles.swatch} ${selectedTier === tier ? styles.swatchActive : ''}`}
                  onClick={() => setSelectedTier(tier)}
                >
                  {t(`offer.${tier}`)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.optionGroup}>
            <span className={styles.optionLabel}>{t('offer.availableDates')}</span>
            <BookingCalendar
              availableDates={offer.availableDates}
              durationDays={offer.duration.days}
              selected={selectedDate}
              onSelect={setSelectedDate}
              price={price}
            />
          </div>

          <button type="button" className={styles.bookBtn}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            {t('common.bookNow')}
          </button>
          <button type="button" className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlistActive : ''}`} onClick={() => setWishlisted((w) => !w)}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill={wishlisted ? 'currentColor' : 'none'} aria-hidden="true"><path d="M10 17s-6.5-4.1-6.5-9A3.9 3.9 0 0110 5.5 3.9 3.9 0 0116.5 8c0 4.9-6.5 9-6.5 9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
            {wishlisted ? t('offer.savedToWishlist') : t('offer.saveToWishlist')}
          </button>

          <hr className={styles.divider} />

          <p className={styles.description}>{getLocalizedField(offer.description, lang)}</p>

          <div className={styles.factsGrid}>
            <div className={styles.factBlock}>
              <span className={styles.factBlockLabel}>{t('common.days')}</span>
              <span className={styles.factBlockValue}>{offer.duration.days} / {offer.duration.nights} {t('common.nights')}</span>
            </div>
            <div className={styles.factBlock}>
              <span className={styles.factBlockLabel}>{t('offer.travelLevel')}</span>
              <span className={`${styles.factBlockValue} ${styles[offer.travelLevel]}`}>{t(`offer.${offer.travelLevel}`)}</span>
            </div>
            <div className={styles.factBlock}>
              <span className={styles.factBlockLabel}>{t('offer.groupSize')}</span>
              <span className={styles.factBlockValue}>
                {offer.groupSize.min === offer.groupSize.max ? offer.groupSize.min : `${offer.groupSize.min}–${offer.groupSize.max}`} {t('offer.people')}
              </span>
            </div>
            <div className={styles.factBlock}>
              <span className={styles.factBlockLabel}>{t('offer.minAge')}</span>
              <span className={styles.factBlockValue}>
                {offer.minAge === 0 ? t('offer.anyAge') : `${offer.minAge}+`}
              </span>
            </div>
          </div>

          <div className={styles.tags}>
            {offer.tags.map((tag) => (
              <span key={tag} className={styles.tagPill}>
                {t(`categories.${tag}`)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Lightbox
        images={offer.images}
        initialIndex={activeImage}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        alt={getLocalizedField(offer.title, lang)}
      />

      {/* ===== DETAILS ===== */}
      <div className={styles.detailsSection}>
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
      </div>

      {/* ===== REVIEWS ===== */}
      <section id="reviews" className={styles.reviewsSection}>
        <div className={styles.reviewsInner}>
          <div className={styles.reviewsHeader}>
            <h2 className={styles.blockHeading}>{t('offer.reviewsTitle')}</h2>
            <div className={styles.reviewsSummary}>
              <span className={styles.reviewsScore}>{offer.rating}</span>
              <div>
                <Stars rating={offer.rating} />
                <span className={styles.reviewsCount}>{offer.reviewCount} {t('offer.reviews')}</span>
              </div>
            </div>
          </div>

          <div className={styles.reviewsGrid}>
            {reviews.map((r) => (
              <div key={r.id} className={styles.reviewCard}>
                <div className={styles.reviewHead}>
                  <img src={r.avatar} alt={r.name} className={styles.reviewAvatar} />
                  <div>
                    <span className={styles.reviewName}>{r.name}</span>
                    <span className={styles.reviewDate}>{formatDate(r.date)}</span>
                  </div>
                </div>
                <Stars rating={r.rating} />
                <p className={styles.reviewComment}>{getLocalizedField(r.comment, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
