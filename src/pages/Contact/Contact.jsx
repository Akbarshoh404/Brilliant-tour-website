import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ScrollCue from '../../components/ScrollCue/ScrollCue';
import Seo from '../../components/Seo/Seo';
import { img } from '../../data/images';
import contactHero from '../../assets/pics/Uzbekistan/photo_12_2026-06-30_15-23-57.jpg';
import styles from './Contact.module.scss';

const MAP_IMAGE = img('tashkent-city-map-placeholder', 1000, 700);

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
      <section className={styles.heroBand} style={{ backgroundImage: `url(${contactHero})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <Breadcrumbs items={[{ label: t('nav.contact') }]} />
          <span className={styles.eyebrow}>{t('contact.eyebrow')}</span>
          <h1 className={styles.title}>{t('contact.title')}</h1>
          <p className={styles.heroIntro}>{t('contact.heroIntro')}</p>
        </div>
        <ScrollCue label={t('common.scroll')} />
      </section>

      <section className={styles.quickSection}>
        <div className={styles.sectionInner}>
          <div className={styles.quickGrid}>
            <a href="tel:+998332990000" className={styles.quickCard}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 3h3l2 5-2 1a10 10 0 005 5l1-2 5 2v3a2 2 0 01-2 2C9 19 1 11 1 5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
              <div>
                <span className={styles.quickLabel}>{t('contact.phone')}</span>
                <span className={styles.quickValue}>{t('contact.phoneValue')}</span>
              </div>
            </a>
            <a href="https://instagram.com/brillianttours_uz" target="_blank" rel="noreferrer" className={styles.quickCard}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2" y="2" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" /><circle cx="14.6" cy="5.4" r="1" fill="currentColor" /></svg>
              <div>
                <span className={styles.quickLabel}>{t('contact.instagram')}</span>
                <span className={styles.quickValue}>{t('contact.instagramValue')}</span>
              </div>
            </a>
            <a href="https://t.me/brillianttours_uz" target="_blank" rel="noreferrer" className={styles.quickCard}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M18 3L2 9.5l5 1.8M18 3l-3 14-6.5-5M18 3L7 12.3v4.7l2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div>
                <span className={styles.quickLabel}>{t('contact.telegram')}</span>
                <span className={styles.quickValue}>{t('contact.telegramValue')}</span>
              </div>
            </a>
            <div className={styles.quickCard}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" /><path d="M10 5.5V10l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div>
                <span className={styles.quickLabel}>{t('contact.hours')}</span>
                <span className={styles.quickValue}>{t('contact.hoursValue')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.servicesTitle}>{t('contact.servicesTitle')}</h2>
          <p className={styles.servicesIntro}>{t('contact.servicesIntro')}</p>
          <div className={styles.servicesGrid}>
            {t('contact.services', { returnObjects: true }).map((service) => (
              <span key={service} className={styles.servicePill}>{service}</span>
            ))}
          </div>
          <p className={styles.directCta}>{t('contact.directCta')}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.layout}>
            <form className={styles.form} onSubmit={onSubmit}>
              <label className={styles.field}>
                <span className={styles.label}>{t('contact.name')}</span>
                <input type="text" required value={form.name} onChange={onChange('name')} className={styles.input} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{t('contact.email')}</span>
                <input type="email" required value={form.email} onChange={onChange('email')} className={styles.input} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{t('contact.message')}</span>
                <textarea required rows={5} value={form.message} onChange={onChange('message')} className={styles.textarea} />
              </label>
              <button type="submit" className={styles.submitBtn}>
                {t('contact.send')}
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

            <div className={styles.officePanel}>
              <img src={MAP_IMAGE} alt="Map placeholder showing the Brilliant office location" className={styles.mapImg} />
              <div className={styles.officeInfo}>
                <h2>{t('contact.officeTitle')}</h2>
                <p>{t('contact.officeAddress')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
