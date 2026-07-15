import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Seo from '../../components/Seo/Seo';
import styles from './Contact.module.scss';

// One icon per entry in contact.services (translation.json), in the same
// fixed order: visas, study abroad, domestic/intl tourism, cruises,
// translations, apostille, consulting, flight tickets.
const SERVICE_ICONS = [
  <path key="visas" d="M3 5h14v10H3z M3 5l7 6 7-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />,
  <path key="study" d="M2 7l8-3.5L18 7l-8 3.5L2 7z M5 8.6v4c0 1 2.2 2 5 2s5-1 5-2v-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  <path key="tourism" d="M3 15c2-6 5-10 7-10s5 4 7 10M2 15h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  <path key="cruises" d="M4 9V4h12v5M3 9h14l-1.5 6h-11L3 9z M2 17c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  <path key="translate" d="M3 5h7M6.5 3v2M4 9c1.5 2 3 3 5.5 3M9 5c-.5 3-2.5 5.5-6 7M11 17l3.5-8 3.5 8M12.2 14h4.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  <path key="apostille" d="M4 14h12M6 14V9a4 4 0 018 0v5M8 9V6M12 9V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />,
  <path key="consulting" d="M10 2l7 3v5c0 4.5-3 7.5-7 8-4-.5-7-3.5-7-8V5l7-3z M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" fill="none" />,
  <path key="tickets" d="M2 8a2 2 0 100-4 2 2 0 000 4zM18 8a2 2 0 100-4 2 2 0 000 4zM3 6h14M3 14a2 2 0 104 0 2 2 0 00-4 0zM17 14a2 2 0 11-4 0 2 2 0 014 0zM7 14h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
];

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Seo
        title="Контакты"
        description="Свяжитесь с Brilliant Tourism в Ташкенте: телефон, Telegram, Instagram и офис для планирования вашего следующего тура."
      />
      {/* Light "paper" hero in the same graphic family as Visas/About —
          the contact channels themselves are the hero visual, laid out as
          rotated stamp cards (and they're real links, replacing the old
          separate quick-contact strip). */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <motion.div
            className={styles.heroText}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Breadcrumbs items={[{ label: t('nav.contact') }]} variant="onLight" />
            <span className={styles.eyebrow}>{t('contact.eyebrow')}</span>
            <h1 className={styles.title}>{t('contact.title')}</h1>
            <p className={styles.heroIntro}>{t('contact.heroIntro')}</p>
            <p className={styles.heroHours}>
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" /><path d="M10 5.5V10l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {t('contact.hoursValue')}
            </p>
          </motion.div>

          <motion.div
            className={styles.heroChannels}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {/* A playful nudge toward the most direct channel — these cards
                are real links/buttons, so a little "tap me" annotation
                invites the interaction instead of leaving it to be found. */}
            <div className={styles.tapHintWrap}>
              <span className={styles.tapHint}>
                <svg width="46" height="34" viewBox="0 0 46 34" fill="none" aria-hidden="true" className={styles.tapHintArrow}>
                  <path d="M40 4C24 4 8 10 4 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 6" />
                  <path d="M1 17L4 24L11 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t('contact.tapHint')}
              </span>
              <a href="tel:+998332990000" className={styles.channelCard} style={{ '--r': '-4deg' }}>
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 3h3l2 5-2 1a10 10 0 005 5l1-2 5 2v3a2 2 0 01-2 2C9 19 1 11 1 5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                <span className={styles.channelLabel}>{t('contact.phone')}</span>
                <span className={styles.channelValue}>{t('contact.phoneValue')}</span>
              </a>
            </div>
            <a href="https://t.me/brillianttours_uz" target="_blank" rel="noreferrer" className={styles.channelCard} style={{ '--r': '3deg' }}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M18 3L2 9.5l5 1.8M18 3l-3 14-6.5-5M18 3L7 12.3v4.7l2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span className={styles.channelLabel}>{t('contact.telegram')}</span>
              <span className={styles.channelValue}>{t('contact.telegramValue')}</span>
            </a>
            <a href="https://instagram.com/brillianttours_uz" target="_blank" rel="noreferrer" className={styles.channelCard} style={{ '--r': '-3deg' }}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2" y="2" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" /><circle cx="14.6" cy="5.4" r="1" fill="currentColor" /></svg>
              <span className={styles.channelLabel}>{t('contact.instagram')}</span>
              <span className={styles.channelValue}>{t('contact.instagramValue')}</span>
            </a>
            <div className={styles.channelCard} style={{ '--r': '5deg' }}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 18s-6-5.5-6-10a6 6 0 1112 0c0 4.5-6 10-6 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="10" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.5" /></svg>
              <span className={styles.channelLabel}>{t('contact.officeTitle')}</span>
              <span className={styles.channelValue}>{t('contact.officeAddress')}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services — a glass-card icon grid instead of a flat pill list. */}
      <section className={styles.servicesSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionHeadingEyebrow}>{t('contact.servicesEyebrow')}</span>
            <h2 className={styles.sectionHeadingTitle}>{t('contact.servicesTitle')}</h2>
            <p className={styles.servicesIntro}>{t('contact.servicesIntro')}</p>
          </div>
          <div className={styles.servicesGrid}>
            {t('contact.services', { returnObjects: true }).map((service, i) => (
              <motion.div
                key={service}
                className={styles.serviceCard}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
              >
                <span className={styles.serviceIcon} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">{SERVICE_ICONS[i]}</svg>
                </span>
                <span className={styles.serviceLabel}>{service}</span>
              </motion.div>
            ))}
          </div>
          <p className={styles.directCta}>{t('contact.directCta')}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.layout}>
            <div className={styles.formCard}>
              <span className={styles.formBadge} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14v10H3z M3 5l7 6 7-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
              </span>
              <h2 className={styles.formTitle}>{t('contact.formTitle')}</h2>
              <p className={styles.formSubtitle}>{t('contact.formSubtitle')}</p>

              <form className={styles.form} onSubmit={onSubmit}>
                <label className={styles.field}>
                  <input
                    type="text"
                    required
                    placeholder=" "
                    value={form.name}
                    onChange={onChange('name')}
                    className={styles.input}
                  />
                  <svg className={styles.fieldIcon} width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="6.5" r="3.2" stroke="currentColor" strokeWidth="1.5" /><path d="M3.5 17c1-4 3.7-6 6.5-6s5.5 2 6.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  <span className={styles.floatLabel}>{t('contact.name')}</span>
                </label>
                <label className={styles.field}>
                  <input
                    type="email"
                    required
                    placeholder=" "
                    value={form.email}
                    onChange={onChange('email')}
                    className={styles.input}
                  />
                  <svg className={styles.fieldIcon} width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="M3 5.5l7 5.5 7-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span className={styles.floatLabel}>{t('contact.email')}</span>
                </label>
                <label className={`${styles.field} ${styles.fieldTextarea}`}>
                  <textarea
                    required
                    rows={5}
                    placeholder=" "
                    value={form.message}
                    onChange={onChange('message')}
                    className={styles.textarea}
                  />
                  <svg className={styles.fieldIcon} width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 5h14v10H8l-4 3.5V15H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                  <span className={styles.floatLabel}>{t('contact.message')}</span>
                </label>
                <button type="submit" className={styles.submitBtn}>
                  {t('contact.send')}
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>

                <AnimatePresence>
                  {submitted && (
                    <motion.p
                      className={styles.success}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {t('contact.sent')}
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* A dot-grid "map" card instead of a stock photo — controlled,
                on-brand, and doesn't depend on what a placeholder image
                happens to show. */}
            <div className={styles.officePanel}>
              <span className={styles.officePin} aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
                  <path d="M10 18s-6-5.5-6-10a6 6 0 1112 0c0 4.5-6 10-6 10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <circle cx="10" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
              <h2 className={styles.officeTitle}>{t('contact.officeTitle')}</h2>
              <p className={styles.officeAddress}>{t('contact.officeAddress')}</p>

              <div className={styles.officeMeta}>
                <div className={styles.officeMetaRow}>
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" /><path d="M10 5.5V10l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {t('contact.hoursValue')}
                </div>
                <a href="tel:+998332990000" className={styles.officeMetaRow}>
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 3h3l2 5-2 1a10 10 0 005 5l1-2 5 2v3a2 2 0 01-2 2C9 19 1 11 1 5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                  {t('contact.phoneValue')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
