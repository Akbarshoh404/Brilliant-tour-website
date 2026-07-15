import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DestinationHero from '../../components/DestinationHero/DestinationHero';
import Seo from '../../components/Seo/Seo';
import countries from '../../data/countries';
import cities from '../../data/cities';
import { getLocalizedField } from '../../utils/getLocalizedField';
import styles from './InternationalHub.module.scss';

// The curated countries featured in the hero — matches the Home countries
// showcase, each paired with its most popular city.
const FEATURED_SLUGS = ['uae', 'france', 'germany', 'korea', 'japan'];
const POPULAR_CITY_SLUG = { uae: 'dubai', france: 'paris', germany: 'berlin', korea: 'seoul', japan: 'tokyo' };

// Online booking for international routes isn't live yet, so this page is
// deliberately just the hero plus one full-viewport call to action — no
// browsing/filtering UI that would imply a working catalog underneath.
export default function InternationalHub() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

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
      <Seo
        title="Международные туры"
        description="Туры за рубеж от Brilliant Tourism: ОАЭ, Франция, Германия, Корея, Япония и другие направления с визовой поддержкой."
      />
      <DestinationHero
        eyebrow={t('international.eyebrow')}
        title={t('international.title')}
        subtitle={t('international.intro')}
        slides={heroSlides}
        scrollLabel={t('common.scroll')}
      />

      <section className={styles.contactSection}>
        <div className={styles.contactInner}>
          <span className={styles.comingSoonTag}>{t('common.comingSoon')}</span>
          <h2 className={styles.contactTitle}>{t('international.contactTitle')}</h2>
          <p className={styles.contactText}>{t('international.comingSoonText')}</p>

          <div className={styles.contactActions}>
            <a href="tel:+998332990000" className={styles.contactCallBtn}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 3h3.2l1.3 4-2 1.3a10.5 10.5 0 004.8 4.8l1.3-2 4 1.3V16a1.5 1.5 0 01-1.6 1.5C9.4 16.9 3.1 10.6 2.5 4.6A1.5 1.5 0 014 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              {t('contact.phoneValue')}
            </a>
            <Link to="/contact" className={styles.contactMsgBtn}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 5h14v10H8l-4 3.5V15H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              {t('common.contactUs')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
