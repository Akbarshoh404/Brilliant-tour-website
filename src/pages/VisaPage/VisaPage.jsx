import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ScrollCue from '../../components/ScrollCue/ScrollCue';
import FlagIcon from '../../components/FlagIcon/FlagIcon';
import visaCountries from '../../data/visaCountries';
import visaExtraServices from '../../data/visaExtraServices';
import countries from '../../data/countries';
import { getLocalizedField } from '../../utils/getLocalizedField';
import HERO_IMAGE from '../../assets/pics/Germany/germany_3.jpg';
import styles from './VisaPage.module.scss';

const REGIONS = ['Schengen', 'Europe', 'Middle East', 'Asia', 'Americas'];
// Countries with a full destination page get sent there — the visa CTA on
// that page already handles the apply flow. Countries we only offer visa
// services for (no destination page) apply inline, right here.
const COUNTRY_PAGE_SLUGS = new Set(countries.map((c) => c.slug));

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
  const navigate = useNavigate();
  const [region, setRegion] = useState(null);
  const [openSlug, setOpenSlug] = useState(null);
  const [submittedSlug, setSubmittedSlug] = useState(null);
  const [applyForm, setApplyForm] = useState({ name: '', phone: '' });

  const filteredCountries = region ? visaCountries.filter((c) => c.region === region) : visaCountries;
  const process = t('visas.process', { returnObjects: true });

  const activateCard = (c) => {
    if (COUNTRY_PAGE_SLUGS.has(c.slug)) {
      navigate(`/international/${c.slug}#visa`);
      return;
    }
    toggleApply(c.slug);
  };

  const toggleApply = (slug) => {
    setSubmittedSlug(null);
    setApplyForm({ name: '', phone: '' });
    setOpenSlug((cur) => (cur === slug ? null : slug));
  };

  const onApplySubmit = (slug) => (e) => {
    e.preventDefault();
    setSubmittedSlug(slug);
  };

  return (
    <>
      <section className={styles.hero} style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <Breadcrumbs items={[{ label: t('nav.visas') }]} />
          <span className={styles.eyebrow}>{t('visas.eyebrow')}</span>
          <h1 className={styles.title}>{t('visas.title')}</h1>
          <p className={styles.intro}>{t('visas.intro')}</p>
        </div>
        <ScrollCue label={t('common.scroll')} />
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

          <div className={styles.countryGrid}>
            {filteredCountries.map((c, i) => (
              <motion.div
                key={c.slug}
                className={`${styles.countryCard} ${openSlug === c.slug ? styles.countryCardActive : ''}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
                onClick={() => activateCard(c)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.target !== e.currentTarget) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activateCard(c);
                  }
                }}
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

                <span
                  className={`${styles.applyBtn} ${openSlug === c.slug ? styles.applyBtnActive : ''}`}
                  aria-hidden="true"
                >
                  {t('visas.applyCta')}
                  {COUNTRY_PAGE_SLUGS.has(c.slug) ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={styles.applyBtnIcon}>
                      <path d="M4 10L10 4M10 4H5M10 4V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={styles.applyBtnIcon}>
                      <path d="M3 5.5L7 9.5L11 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>

                <AnimatePresence initial={false}>
                  {openSlug === c.slug && (
                    <motion.div
                      className={styles.applyPanel}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ height: { duration: 0.42, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.28 } }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <motion.div
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.32, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {submittedSlug === c.slug ? (
                          <p className={styles.applySuccess}>{t('visas.applySuccess')}</p>
                        ) : (
                          <form className={styles.applyForm} onSubmit={onApplySubmit(c.slug)}>
                            <input
                              type="text"
                              required
                              placeholder={t('contact.name')}
                              value={applyForm.name}
                              onChange={(e) => setApplyForm((f) => ({ ...f, name: e.target.value }))}
                              className={styles.applyInput}
                            />
                            <input
                              type="tel"
                              required
                              placeholder={t('visas.applyPhone')}
                              value={applyForm.phone}
                              onChange={(e) => setApplyForm((f) => ({ ...f, phone: e.target.value }))}
                              className={styles.applyInput}
                            />
                            <button type="submit" className={styles.applySubmitBtn}>
                              {t('visas.applySubmit')}
                            </button>
                          </form>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
