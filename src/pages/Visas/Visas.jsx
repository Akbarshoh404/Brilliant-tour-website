import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ScrollCue from '../../components/ScrollCue/ScrollCue';
import countries from '../../data/countries';
import { getLocalizedField } from '../../utils/getLocalizedField';
import { img } from '../../data/images';
import styles from './Visas.module.scss';

const HERO_IMAGE = img('passport-visa-stamps-travel', 1920, 600);

const GUIDANCE = {
  'visa-free': {
    en: 'No visa needed for short tourist stays — just a valid passport.',
    ru: 'Виза не требуется для краткосрочных туристических поездок — нужен только действующий паспорт.',
    uz: 'Qisqa muddatli turistik tashriflar uchun viza talab qilinmaydi — faqat amal qiluvchi pasport kerak.',
  },
  eVisa: {
    en: 'Apply online before departure — approval typically takes a few days.',
    ru: 'Подайте заявку онлайн до вылета — одобрение обычно занимает несколько дней.',
    uz: 'Jo‘nashdan oldin onlayn ariza bering — tasdiqlash odatda bir necha kun davom etadi.',
  },
  'visa-required': {
    en: 'A visa must be arranged in advance through the relevant embassy or consulate.',
    ru: 'Визу необходимо оформить заранее через соответствующее посольство или консульство.',
    uz: 'Viza tegishli elchixona yoki konsullik orqali oldindan rasmiylashtirilishi kerak.',
  },
};

const BADGE_KEY = { 'visa-free': 'visaFree', eVisa: 'eVisa', 'visa-required': 'visaRequired' };

export default function Visas() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [query, setQuery] = useState('');

  const filtered = countries.filter((c) => getLocalizedField(c.name, lang).toLowerCase().includes(query.trim().toLowerCase()));

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

      <section className={styles.listSection}>
        <div className={styles.sectionInner}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('visas.searchPlaceholder')}
            className={styles.searchInput}
          />

          <div className={styles.list}>
            {filtered.map((c) => (
              <div key={c.slug} className={styles.row}>
                <img src={c.heroImage} alt="" className={styles.rowImg} />
                <div className={styles.rowBody}>
                  <div className={styles.rowTop}>
                    <span className={styles.rowName}>{getLocalizedField(c.name, lang)}</span>
                    <span className={`${styles.badge} ${styles[c.visaRequirement.replace('-', '')]}`}>
                      {t(`visas.${BADGE_KEY[c.visaRequirement]}`)}
                    </span>
                  </div>
                  <p className={styles.rowText}>{getLocalizedField(GUIDANCE[c.visaRequirement], lang)}</p>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p className={styles.noResults}>{t('common.noResults')}</p>}
          </div>
        </div>
      </section>
    </>
  );
}
