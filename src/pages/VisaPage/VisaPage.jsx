import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import FlagIcon from '../../components/FlagIcon/FlagIcon';
import Seo from '../../components/Seo/Seo';
import visaCountries from '../../data/visaCountries';
import visaExtraServices from '../../data/visaExtraServices';
import { getLocalizedField } from '../../utils/getLocalizedField';
import styles from './VisaPage.module.scss';

const REGIONS = ['Schengen', 'Europe', 'Middle East', 'Asia', 'Americas'];

// Hero is a "stamped passport page" rather than a destination-photo
// slideshow — visas aren't about picking a place to browse, they're a
// document process, so the imagery leans into that instead.
const STAMP_SLUGS = ['germany', 'france', 'italy', 'uk', 'uae', 'japan', 'korea', 'usa'];
const STAMP_ROTATIONS = [-6, 4, -8, 6, -4, 7, -5, 3];

const EXTRA_ICONS = {
  stamp: <path d="M4 14h12M6 14V9a4 4 0 018 0v5M8 9V6M12 9V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />,
  translate: <path d="M3 5h7M6.5 3v2M4 9c1.5 2 3 3 5.5 3M9 5c-.5 3-2.5 5.5-6 7M11 17l3.5-8 3.5 8M12.2 14h4.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  mail: <path d="M3 5h14v10H3z M3 5l7 6 7-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />,
  shield: <path d="M10 2l7 3v5c0 4.5-3 7.5-7 8-4-.5-7-3.5-7-8V5l7-3z M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" fill="none" />,
  scale: <path d="M10 3v14M4 6h12M4 6l-2 5h4L4 6zM16 6l-2 5h4l-2-5M7 17h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  bolt: <path d="M11 2L4 12h5l-1 6 8-11h-5l1-5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />,
};

export default function VisaPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [region, setRegion] = useState(null);

  const filteredCountries = region ? visaCountries.filter((c) => c.region === region) : visaCountries;
  const process = t('visas.process', { returnObjects: true });

  const stamps = STAMP_SLUGS
    .map((slug) => visaCountries.find((c) => c.slug === slug))
    .filter(Boolean);

  return (
    <>
      <Seo
        title="Визовые услуги"
        description="Оформление виз для путешественников из Узбекистана: Шенген, ОАЭ, Корея, Япония и другие направления — полное сопровождение заявки."
      />

      <section className={styles.visaHero}>
        <div className={styles.visaHeroInner}>
          <div className={styles.visaHeroText}>
            <Breadcrumbs items={[{ label: t('nav.visas') }]} variant="onLight" />
            <span className={styles.visaHeroEyebrow}>{t('visas.eyebrow')}</span>
            <h1 className={styles.visaHeroTitle}>{t('visas.title')}</h1>
            <p className={styles.visaHeroIntro}>{t('visas.intro')}</p>

            <div className={styles.visaHeroStats}>
              <div className={styles.visaHeroStat}>
                <span className={styles.visaHeroStatValue}>{visaCountries.length}+</span>
                <span className={styles.visaHeroStatLabel}>{t('visas.statCountries')}</span>
              </div>
              <div className={styles.visaHeroStat}>
                <span className={styles.visaHeroStatValue}>10–15</span>
                <span className={styles.visaHeroStatLabel}>{t('visas.statProcessing')}</span>
              </div>
            </div>
          </div>

          <div className={styles.visaHeroStamps} aria-hidden="true">
            {stamps.map((c, i) => (
              <div
                key={c.slug}
                className={styles.stampCard}
                style={{ '--r': `${STAMP_ROTATIONS[i % STAMP_ROTATIONS.length]}deg` }}
              >
                <FlagIcon iso={c.iso} size={26} className={styles.stampFlag} />
                <span className={styles.stampName}>{getLocalizedField(c.name, lang)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Online visa applications aren't live yet — styled as a stamped
          document card rather than the dark full-viewport CTA used on
          International, to match this page's paperwork theme. */}
      <section className={styles.contactSection}>
        <div className={styles.contactCard}>
          <span className={styles.contactStamp} aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M12 3l2.2 4.4 4.9.7-3.5 3.4.8 4.9L12 14l-4.4 2.4.8-4.9-3.5-3.4 4.9-.7L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </span>
          <span className={styles.comingSoonTag}>{t('common.comingSoon')}</span>
          <h2 className={styles.contactTitle}>{t('visas.contactTitle')}</h2>
          <p className={styles.contactText}>{t('visas.comingSoonText')}</p>

          <div className={styles.contactActions}>
            <a href="tel:+998332990000" className={styles.contactCallBtn}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 3h3.2l1.3 4-2 1.3a10.5 10.5 0 004.8 4.8l1.3-2 4 1.3V16a1.5 1.5 0 01-1.6 1.5C9.4 16.9 3.1 10.6 2.5 4.6A1.5 1.5 0 014 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              {t('contact.phoneValue')}
            </a>
            <Link to="/contact" className={styles.contactMsgBtn}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 5h14v10H8l-4 3.5V15H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              {t('common.contactUs')}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== COUNTRIES ===== */}
      <section className={styles.countriesSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.subheading}>{t('visas.countriesTitle')}</h2>
          <div className={styles.chips}>
            <button type="button" className={`${styles.chip} ${!region ? styles.chipActive : ''}`} onClick={() => setRegion(null)}>
              {t('international.allRegions')}
            </button>
            {REGIONS.map((r) => (
              <button key={r} type="button" className={`${styles.chip} ${region === r ? styles.chipActive : ''}`} onClick={() => setRegion(r)}>
                {r}
              </button>
            ))}
          </div>

          {/* Informational only — applying happens via the Contact Us
              section above, not a per-card action. */}
          <div className={styles.countryGrid}>
            {filteredCountries.map((c, i) => (
              <motion.div
                key={c.slug}
                className={styles.countryCard}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
              >
                <span className={styles.priceBadge}>
                  <span className={styles.priceBadgeLabel}>{t('visas.priceFrom')}</span>
                  <span className={styles.priceBadgeValue}>${c.priceFrom}</span>
                </span>

                <div className={styles.countryHead}>
                  <FlagIcon iso={c.iso} size={64} className={styles.countryFlag} />
                  <div>
                    <h3 className={styles.countryName}>{getLocalizedField(c.name, lang)}</h3>
                    <span className={styles.countryType}>{t(`visas.types.${c.visaTypeKey}`)}</span>
                  </div>
                </div>

                <div className={styles.countryFacts}>
                  <div>
                    <span className={styles.factLabel}>{t('visas.processingTime')}</span>
                    <span className={styles.factValue}>{c.processingDays} {t('visas.businessDays')}</span>
                  </div>
                </div>

                <div className={styles.reqTitle}>{t('visas.requirementsTitle')}</div>
                <div className={styles.reqList}>
                  {c.requirementKeys.map((key) => (
                    <span key={key} className={styles.reqPill}>{t(`visas.req.${key}`)}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className={styles.processSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.subheadingLight}>{t('visas.processTitle')}</h2>
          <div className={styles.processGrid}>
            {process.map((step, i) => (
              <motion.div
                key={step.title}
                className={styles.processStep}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.08, 0.3) }}
              >
                <span className={styles.processNum}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== APOSTILLE & EXTRA SERVICES ===== */}
      <section className={styles.extraSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.subheading}>{t('visas.extraTitle')}</h2>
          <p className={styles.extraIntro}>{t('visas.extraIntro')}</p>
          <div className={styles.extraGrid}>
            {visaExtraServices.map((svc, i) => (
              <motion.div
                key={svc.id}
                className={styles.extraCard}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3) }}
              >
                <span className={styles.extraIconWrap}>
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" className={styles.extraIcon} aria-hidden="true">
                    {EXTRA_ICONS[svc.icon]}
                  </svg>
                </span>
                <h3>{t(`visas.extra.${svc.id}.title`)}</h3>
                <p>{t(`visas.extra.${svc.id}.text`)}</p>
                <span className={styles.extraPrice}>{t('visas.priceFrom')} ${svc.priceFrom}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>{t('visas.ctaTitle')}</h2>
          <p className={styles.ctaText}>{t('visas.ctaText')}</p>
          <Link to="/contact" className={styles.ctaBtn}>
            {t('visas.ctaBtn')}
          </Link>
        </div>
      </section>
    </>
  );
}
