import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ScrollCue from '../../components/ScrollCue/ScrollCue';
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
