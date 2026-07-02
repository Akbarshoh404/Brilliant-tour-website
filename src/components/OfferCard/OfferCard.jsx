import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { getLocalizedField } from '../../utils/getLocalizedField';
import { formatPrice, applyPriceModifier } from '../../utils/formatPrice';
import countries from '../../data/countries';
import categories from '../../data/categories';
import RouteLine from '../RouteLine/RouteLine';
import styles from './OfferCard.module.scss';

const countryBySlug = Object.fromEntries(countries.map((c) => [c.slug, c]));
const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

function StarRating({ rating }) {
  const filled = Math.round(rating);
  return (
    <span className={styles.stars} aria-label={`Rating: ${rating}`}>
      {'★'.repeat(filled)}{'☆'.repeat(Math.max(0, 5 - filled))}
    </span>
  );
}

export default function OfferCard({ offer, packageLevel = 'standard', index = 0 }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const eyebrow =
    offer.type === 'international'
      ? getLocalizedField(countryBySlug[offer.country]?.name, lang)
      : getLocalizedField(categoryBySlug[offer.categorySlug]?.name, lang);

  const pkg = offer.packages.find((p) => p.tier === packageLevel) ?? offer.packages[1];
  const price = applyPriceModifier(offer.basePrice, pkg.priceModifier);
  const isPremium = offer.tags.includes('luxury') || offer.rating >= 4.8;

  return (
    <motion.article
      className={`${styles.card} ${isPremium ? styles.premium : ''}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.35), ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/tours/${offer.slug}`} className={styles.link}>
        <div className={styles.imageWrap}>
          <img
            src={offer.images[0]}
            alt={getLocalizedField(offer.title, lang)}
            className={styles.image}
            loading="lazy"
          />
          <div className={styles.overlay} />
          {offer.isSpecialOffer && (
            <span className={styles.discountBadge}>-{offer.discountPercent}%</span>
          )}
          <span className={styles.eyebrow}>{eyebrow}</span>
        </div>

        <div className={styles.body}>
          <h3 className={styles.title}>{getLocalizedField(offer.title, lang)}</h3>
          <p className={styles.desc}>{getLocalizedField(offer.description, lang)}</p>

          <div className={styles.ratingRow}>
            <StarRating rating={offer.rating} />
            <span className={styles.ratingNum}>{offer.rating} ({offer.reviewCount})</span>
          </div>

          <div className={styles.tags}>
            {offer.tags.slice(0, 2).map((tag) => (
              <span key={tag} className={styles.tagPill}>
                {t(`categories.${tag}`)}
              </span>
            ))}
          </div>

          <div className={styles.footer}>
            <span className={styles.duration}>
              {offer.duration.days} {t('common.days')}
            </span>
            <div className={styles.priceWrap}>
              <RouteLine
                variant={offer.type === 'domestic' ? 'domestic' : 'international'}
                width={28}
                height={10}
                d="M2 5 H26"
                className={styles.priceRoute}
              />
              <span className={styles.price}>
                <span className={styles.priceFrom}>{t('common.from')} </span>
                {formatPrice(price, offer.currency, lang)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
