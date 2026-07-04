import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import countries from '../../data/countries';
import categories from '../../data/categories';
import CountrySelect from '../CountrySelect/CountrySelect';
import { countActiveFilters } from '../../utils/countActiveFilters';
import { getLocalizedField } from '../../utils/getLocalizedField';
import styles from './FilterDrawer.module.scss';

const TRAVEL_TYPES = ['luxury', 'budget', 'group', 'family', 'honeymoon', 'business', 'cruise', 'religious', 'custom-private'];
const DURATIONS = ['short', 'medium', 'long'];
const BUDGET_TIERS = [
  { key: 'economy', priceMin: null, priceMax: 400 },
  { key: 'standard', priceMin: 400, priceMax: 1200 },
  { key: 'premium', priceMin: 1200, priceMax: null },
];
const PACKAGE_LEVELS = ['economy', 'standard', 'premium'];
const VISA_OPTIONS = [
  { value: 'visa-free', key: 'visaFree' },
  { value: 'eVisa', key: 'eVisa' },
  { value: 'visa-required', key: 'visaRequired' },
];
const HOTEL_CATEGORIES = ['3★', '4★', '5★'];
const TRANSPORT_OPTIONS = ['Shared shuttle', 'Private transfer', 'Private VIP transfer'];
const ACTIVITIES = [
  { key: 'guide', label: 'Guided' },
  { key: 'camel', label: 'Camel trek' },
  { key: 'boat', label: 'Boat' },
  { key: 'workshop', label: 'Workshop' },
  { key: 'train', label: 'Rail' },
];
const SEASONS = ['spring', 'summer', 'autumn', 'winter'];
const TOUR_LANGUAGES = ['English', 'Russian', 'Uzbek'];
const GROUP_SIZES = ['Solo', 'Couple', 'Small group (2-6)', 'Large group (7+)'];

function Section({ id, title, openSections, toggle, children }) {
  const isOpen = openSections.includes(id);
  return (
    <div className={styles.section}>
      <button type="button" className={styles.sectionHeader} onClick={() => toggle(id)} aria-expanded={isOpen}>
        <span>{title}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className={styles.chevron}>
          ⌄
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={styles.sectionBody}
          >
            <div className={styles.sectionInner}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FilterDrawer({ filters, onChange, onClear, isOpen, onClose, showDestination = true, showCategory = false }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [openSections, setOpenSections] = useState(['destination', 'category']);

  const toggle = (id) =>
    setOpenSections((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const patch = (p) => onChange({ ...filters, ...p });
  const activeCount = countActiveFilters(filters);

  const toggleTag = (tag) => {
    const tags = filters.tags ?? [];
    patch({ tags: tags.includes(tag) ? tags.filter((x) => x !== tag) : [...tags, tag] });
  };

  const content = (
    <>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {t('common.filters')}
          {activeCount > 0 && <span className={styles.badge}>{activeCount}</span>}
        </h2>
        <div className={styles.headerActions}>
          {activeCount > 0 && (
            <button type="button" className={styles.clearBtn} onClick={onClear}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              {t('common.clearFilters')}
            </button>
          )}
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={t('nav.close')}>
            &times;
          </button>
        </div>
      </div>

      <div className={styles.body}>
        {showDestination && (
          <Section id="destination" title={t('filters.destination')} openSections={openSections} toggle={toggle}>
            <CountrySelect
              options={countries}
              value={filters.countrySlug ?? ''}
              onChange={(slug) => patch({ countrySlug: slug || null })}
              placeholder={t('international.allRegions')}
            />
          </Section>
        )}

        {showCategory && (
          <Section id="category" title={t('filters.category')} openSections={openSections} toggle={toggle}>
            <select
              className={styles.select}
              value={filters.categorySlug ?? ''}
              onChange={(e) => patch({ categorySlug: e.target.value || null })}
            >
              <option value="">{t('international.allRegions')}</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {getLocalizedField(c.name, lang)}
                </option>
              ))}
            </select>
          </Section>
        )}

        <Section id="priceRange" title={t('filters.priceRange')} openSections={openSections} toggle={toggle}>
          <div className={styles.row}>
            <input
              type="number"
              placeholder="Min"
              className={styles.numberInput}
              value={filters.priceMin ?? ''}
              onChange={(e) => patch({ priceMin: e.target.value ? Number(e.target.value) : null })}
            />
            <span className={styles.rowSep}>–</span>
            <input
              type="number"
              placeholder="Max"
              className={styles.numberInput}
              value={filters.priceMax ?? ''}
              onChange={(e) => patch({ priceMax: e.target.value ? Number(e.target.value) : null })}
            />
          </div>
        </Section>

        <Section id="duration" title={t('filters.duration')} openSections={openSections} toggle={toggle}>
          <div className={styles.pillGroup}>
            {DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                className={`${styles.pill} ${filters.durationBucket === d ? styles.pillActive : ''}`}
                onClick={() => patch({ durationBucket: filters.durationBucket === d ? null : d })}
              >
                {d === 'short' ? '1–3' : d === 'medium' ? '4–6' : '7+'} {t('common.days')}
              </button>
            ))}
          </div>
        </Section>

        <Section id="season" title={t('filters.season')} openSections={openSections} toggle={toggle}>
          <div className={styles.pillGroup}>
            {SEASONS.map((s) => (
              <button
                key={s}
                type="button"
                className={`${styles.pill} ${filters.season === s ? styles.pillActive : ''}`}
                onClick={() => patch({ season: filters.season === s ? null : s })}
              >
                {s}
              </button>
            ))}
          </div>
        </Section>

        <Section id="travelType" title={t('filters.travelType')} openSections={openSections} toggle={toggle}>
          <div className={styles.pillGroup}>
            {TRAVEL_TYPES.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`${styles.pill} ${filters.tags?.includes(tag) ? styles.pillActive : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {t(`categories.${tag}`)}
              </button>
            ))}
          </div>
        </Section>

        <Section id="budgetTier" title={t('filters.budgetTier')} openSections={openSections} toggle={toggle}>
          <div className={styles.pillGroup}>
            {BUDGET_TIERS.map((b) => (
              <button
                key={b.key}
                type="button"
                className={`${styles.pill} ${filters.priceMin === b.priceMin && filters.priceMax === b.priceMax ? styles.pillActive : ''}`}
                onClick={() => patch({ priceMin: b.priceMin, priceMax: b.priceMax })}
              >
                {t(`offer.${b.key}`)}
              </button>
            ))}
          </div>
        </Section>

        <Section id="packageLevel" title={t('filters.packageLevel')} openSections={openSections} toggle={toggle}>
          <div className={styles.pillGroup}>
            {PACKAGE_LEVELS.map((p) => (
              <button
                key={p}
                type="button"
                className={`${styles.pill} ${filters.packageLevel === p ? styles.pillActive : ''}`}
                onClick={() => patch({ packageLevel: filters.packageLevel === p ? null : p })}
              >
                {t(`offer.${p}`)}
              </button>
            ))}
          </div>
        </Section>

        <Section id="visaRequirement" title={t('filters.visaRequirement')} openSections={openSections} toggle={toggle}>
          <div className={styles.pillGroup}>
            {VISA_OPTIONS.map((v) => (
              <button
                key={v.value}
                type="button"
                className={`${styles.pill} ${filters.visaRequirement === v.value ? styles.pillActive : ''}`}
                onClick={() => patch({ visaRequirement: filters.visaRequirement === v.value ? null : v.value })}
              >
                {t(`visas.${v.key}`)}
              </button>
            ))}
          </div>
        </Section>

        <Section id="hotelCategory" title={t('filters.hotelCategory')} openSections={openSections} toggle={toggle}>
          <div className={styles.pillGroup}>
            {HOTEL_CATEGORIES.map((h) => (
              <button
                key={h}
                type="button"
                className={`${styles.pill} ${filters.hotelCategoryKeyword === h ? styles.pillActive : ''}`}
                onClick={() => patch({ hotelCategoryKeyword: filters.hotelCategoryKeyword === h ? null : h })}
              >
                {h}
              </button>
            ))}
          </div>
        </Section>

        <Section id="transportation" title={t('filters.transportation')} openSections={openSections} toggle={toggle}>
          <div className={styles.pillGroup}>
            {TRANSPORT_OPTIONS.map((tr) => (
              <button
                key={tr}
                type="button"
                className={`${styles.pill} ${filters.transportation === tr ? styles.pillActive : ''}`}
                onClick={() => patch({ transportation: filters.transportation === tr ? null : tr })}
              >
                {tr}
              </button>
            ))}
          </div>
        </Section>

        <Section id="activities" title={t('filters.activities')} openSections={openSections} toggle={toggle}>
          <div className={styles.pillGroup}>
            {ACTIVITIES.map((a) => (
              <button
                key={a.key}
                type="button"
                className={`${styles.pill} ${filters.activityKeyword === a.key ? styles.pillActive : ''}`}
                onClick={() => patch({ activityKeyword: filters.activityKeyword === a.key ? null : a.key })}
              >
                {a.label}
              </button>
            ))}
          </div>
        </Section>

        <Section id="tourLanguage" title={t('filters.tourLanguage')} openSections={openSections} toggle={toggle}>
          <div className={styles.pillGroup}>
            {TOUR_LANGUAGES.map((l) => (
              <button
                key={l}
                type="button"
                className={`${styles.pill} ${filters.tourLanguage === l ? styles.pillActive : ''}`}
                onClick={() => patch({ tourLanguage: filters.tourLanguage === l ? null : l })}
              >
                {l}
              </button>
            ))}
          </div>
        </Section>

        <Section id="groupSize" title={t('filters.groupSize')} openSections={openSections} toggle={toggle}>
          <div className={styles.pillGroup}>
            {GROUP_SIZES.map((g) => (
              <button
                key={g}
                type="button"
                className={`${styles.pill} ${filters.groupSize === g ? styles.pillActive : ''}`}
                onClick={() => patch({ groupSize: filters.groupSize === g ? null : g })}
              >
                {g}
              </button>
            ))}
          </div>
        </Section>
      </div>
    </>
  );

  return (
    <>
      <aside className={styles.desktopDrawer}>{content}</aside>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.mobileBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
          >
            <motion.div
              className={styles.mobileSheet}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {content}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
