import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ScrollCue from '../../components/ScrollCue/ScrollCue';
import OfferCard from '../../components/OfferCard/OfferCard';
import categories from '../../data/categories';
import offers from '../../data/offers';
import { getLocalizedField } from '../../utils/getLocalizedField';
import heroImage from '../../assets/pics/photo_10_2026-06-30_15-23-57.jpg';
import styles from './DomesticHub.module.scss';

export default function DomesticHub() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const featured = offers.filter((o) => o.type === 'domestic').slice(0, 6);

  return (
    <>
      <section className={styles.hero} style={{ backgroundImage: `url(${heroImage})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <Breadcrumbs items={[{ label: t('nav.domestic') }]} />
          <span className={styles.eyebrow}>{t('domestic.eyebrow')}</span>
          <h1 className={styles.title}>{t('domestic.title')}</h1>
          <p className={styles.intro}>{t('domestic.intro')}</p>
        </div>
        <ScrollCue label={t('common.scroll')} />
      </section>

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
