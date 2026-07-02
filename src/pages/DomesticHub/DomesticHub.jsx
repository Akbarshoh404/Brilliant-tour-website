import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import DestinationHero from '../../components/DestinationHero/DestinationHero';
import OfferCard from '../../components/OfferCard/OfferCard';
import categories from '../../data/categories';
import offers from '../../data/offers';
import { getLocalizedField } from '../../utils/getLocalizedField';
import styles from './DomesticHub.module.scss';

export default function DomesticHub() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const featured = offers.filter((o) => o.type === 'domestic').slice(0, 6);

  const heroSlides = categories.map((cat) => ({
    image: cat.heroImage,
    name: getLocalizedField(cat.name, lang),
    sublabel: 'Uzbekistan',
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

      <section className={styles.categorySection}>
        <div className={styles.sectionInner}>
          <div className={styles.tileGrid}>
            {categories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
              >
                <Link to={`/domestic/${cat.slug}`} className={styles.tile}>
                  <img src={cat.heroImage} alt={getLocalizedField(cat.name, lang)} className={styles.tileImg} />
                  <span className={styles.tileLabel}>{getLocalizedField(cat.name, lang)}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.featuredSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.subheading}>{t('domestic.featuredTitle')}</h2>
          <div className={styles.offerGrid}>
            {featured.map((offer, i) => (
              <OfferCard key={offer.id} offer={offer} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
