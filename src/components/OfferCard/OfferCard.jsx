import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { getLocalizedField } from '../../utils/getLocalizedField';
import { formatPrice, applyPriceModifier } from '../../utils/formatPrice';
import countries from '../../data/countries';
import categories from '../../data/categories';
import styles from './OfferCard.module.scss';

const countryBySlug = Object.fromEntries(countries.map((c) => [c.slug, c]));
const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

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
          {offer.isSpecialOffer && (
            <span className={styles.discountBadge}>-{offer.discountPercent}%</span>
          )}
        </div>

        <div className={styles.body}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h3 className={styles.title}>{getLocalizedField(offer.title, lang)}</h3>

          <div className={styles.metaRow}>
            <span className={styles.duration}>
              {offer.duration.days} {t('common.days')}
            </span>
            <span className={styles.metaDot} aria-hidden="true" />
            <span className={styles.rating}>★ {offer.rating}</span>
          </div>

          <div className={styles.footer}>
            <span className={styles.price}>
              <span className={styles.priceFrom}>{t('common.from')} </span>
              {formatPrice(price, offer.currency, lang)}
            </span>
            <span
              className={`${styles.arrowBtn} ${offer.type === 'domestic' ? styles.arrowDomestic : styles.arrowIntl}`}
              aria-hidden="true"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
