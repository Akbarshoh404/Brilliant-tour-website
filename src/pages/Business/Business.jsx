import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import Seo from '../../components/Seo/Seo';
import FlagIcon from '../../components/FlagIcon/FlagIcon';
import { getLocalizedField } from '../../utils/getLocalizedField';
import destinations from '../../data/business/destinations.json';
import starCategories from '../../data/business/starCategories.json';
import boardTypes from '../../data/business/boardTypes.json';
import priceTypes from '../../data/business/priceTypes.json';
import transportTypes from '../../data/business/transportTypes.json';
import exchangeRates from '../../data/business/exchangeRates.json';
import results from '../../data/business/results.json';
import partners from '../../data/business/partners.json';
import styles from './Business.module.scss';

// Decorative hero background only — not part of the swappable business
// dataset, so it stays inline rather than in src/data/business.
const ROUTES = [
  { d: 'M 500 300 C 430 320, 380 350, 310 375', alt: false },
  { d: 'M 500 300 C 450 265, 400 235, 340 205', alt: false },
  { d: 'M 500 300 C 560 325, 620 355, 700 405', alt: true },
  { d: 'M 500 300 C 570 260, 640 210, 730 150', alt: true },
  { d: 'M 500 300 C 540 340, 590 395, 650 460', alt: true },
];

const NODES = [
  { x: 310, y: 375, countryKey: 'uzbekistan', cityKey: 'samarkand' },
  { x: 340, y: 205, countryKey: 'uzbekistan', cityKey: 'bukhara' },
  { x: 700, y: 405, countryKey: 'korea', cityKey: 'seoul' },
  { x: 730, y: 150, countryKey: 'turkey', cityKey: 'istanbul' },
  { x: 650, y: 460, countryKey: 'uae', cityKey: 'dubai' },
];

const SORT_OPTIONS = ['priceAsc', 'priceDesc', 'nightsAsc', 'dateAsc'];

const FILTER_DEFAULTS = {
  country: '',
  city: '',
  hotel: '',
  stars: [],
  board: [],
  priceType: [],
  transport: [],
  nightsMin: '',
  nightsMax: '',
  priceMin: '',
  priceMax: '',
};

function parseRuDate(d) {
  const [day, month, year] = d.split('.').map(Number);
  return new Date(year, month - 1, day).getTime();
}

function Section({ id, title, count, openSections, toggle, children }) {
  const isOpen = openSections.includes(id);
  return (
    <div className={styles.filterSection}>
      <button type="button" className={styles.filterSectionHeader} onClick={() => toggle(id)} aria-expanded={isOpen}>
        <span>
          {title}
          {count > 0 && <em>{count}</em>}
        </span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className={styles.filterChevron}>
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
            className={styles.filterSectionBody}
          >
            <div className={styles.filterSectionInner}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Business() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [form, setForm] = useState({ company: '', contact: '' });
  const [submitted, setSubmitted] = useState(false);
  const [filters, setFilters] = useState(FILTER_DEFAULTS);
  const [sortBy, setSortBy] = useState('priceAsc');
  const [openSections, setOpenSections] = useState(['destination', 'stars']);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const countryByKey = useMemo(() => Object.fromEntries(destinations.map((d) => [d.key, d])), []);
  const cityOptions = useMemo(() => countryByKey[filters.country]?.cities ?? [], [countryByKey, filters.country]);

  const toggleSection = (id) =>
    setOpenSections((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const patchFilters = (p) => setFilters((f) => ({ ...f, ...p }));

  const toggleMulti = (field, value) => {
    const list = filters[field];
    patchFilters({ [field]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] });
  };

  const activeFilterCount =
    (filters.country ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.hotel.trim() ? 1 : 0) +
    filters.stars.length +
    filters.board.length +
    filters.priceType.length +
    filters.transport.length +
    (filters.nightsMin || filters.nightsMax ? 1 : 0) +
    (filters.priceMin || filters.priceMax ? 1 : 0);

  const filteredResults = useMemo(() => {
    const hotelQuery = filters.hotel.trim().toLowerCase();
    let list = results.filter((r) => {
      if (filters.country && r.countryKey !== filters.country) return false;
      if (filters.city && r.cityKey !== filters.city) return false;
      if (hotelQuery && !r.hotel.toLowerCase().includes(hotelQuery)) return false;
      if (filters.stars.length && !filters.stars.includes(String(r.stars))) return false;
      if (filters.board.length && !filters.board.includes(r.board)) return false;
      if (filters.priceType.length && !filters.priceType.includes(r.priceType)) return false;
      if (filters.transport.length && !filters.transport.includes(r.transport)) return false;
      if (filters.nightsMin && r.nights < Number(filters.nightsMin)) return false;
      if (filters.nightsMax && r.nights > Number(filters.nightsMax)) return false;
      if (filters.priceMin && r.price < Number(filters.priceMin)) return false;
      if (filters.priceMax && r.price > Number(filters.priceMax)) return false;
      return true;
    });

    const sorters = {
      priceAsc: (a, b) => a.price - b.price,
      priceDesc: (a, b) => b.price - a.price,
      nightsAsc: (a, b) => a.nights - b.nights,
      dateAsc: (a, b) => parseRuDate(a.date) - parseRuDate(b.date),
    };
    return [...list].sort(sorters[sortBy]);
  }, [filters, sortBy]);

  const onChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ company: '', contact: '' });
  };

  const filterPanel = (
    <>
      <div className={styles.filterHead}>
        <h3>
          {t('business.filters.title')}
          {activeFilterCount > 0 && <span className={styles.filterBadge}>{activeFilterCount}</span>}
        </h3>
        <div className={styles.filterHeadActions}>
          {activeFilterCount > 0 && (
            <button type="button" className={styles.filterClear} onClick={() => setFilters(FILTER_DEFAULTS)}>
              {t('business.filters.clear')}
            </button>
          )}
          <button
            type="button"
            className={styles.filterCloseMobile}
            onClick={() => setMobileFiltersOpen(false)}
            aria-label={t('business.filters.close')}
          >
            &times;
          </button>
        </div>
      </div>

      <div className={styles.filterBody}>
        <Section
          id="destination"
          title={t('business.filters.destination')}
          count={(filters.country ? 1 : 0) + (filters.city ? 1 : 0)}
          openSections={openSections}
          toggle={toggleSection}
        >
          <select className={styles.filterSelect} value={filters.country} onChange={(e) => patchFilters({ country: e.target.value, city: '' })}>
            <option value="">{t('business.filters.anyCountry')}</option>
            {destinations.map((d) => (
              <option key={d.key} value={d.key}>
                {getLocalizedField(d.name, lang)}
              </option>
            ))}
          </select>
          <select
            className={styles.filterSelect}
            value={filters.city}
            onChange={(e) => patchFilters({ city: e.target.value })}
            disabled={!cityOptions.length}
          >
            <option value="">{t('business.filters.anyCity')}</option>
            {cityOptions.map((c) => (
              <option key={c.key} value={c.key}>
                {getLocalizedField(c.name, lang)}
              </option>
            ))}
          </select>
        </Section>

        <Section id="hotel" title={t('business.filters.hotel')} count={filters.hotel.trim() ? 1 : 0} openSections={openSections} toggle={toggleSection}>
          <input
            type="text"
            className={styles.filterSelect}
            placeholder={t('business.filters.hotelPlaceholder')}
            value={filters.hotel}
            onChange={(e) => patchFilters({ hotel: e.target.value })}
          />
        </Section>

        <Section id="stars" title={t('business.filters.stars')} count={filters.stars.length} openSections={openSections} toggle={toggleSection}>
          <div className={styles.filterPillGroup}>
            {starCategories.map((s) => (
              <button
                key={s}
                type="button"
                className={`${styles.filterPill} ${filters.stars.includes(s) ? styles.filterPillActive : ''}`}
                onClick={() => toggleMulti('stars', s)}
              >
                {s}★
              </button>
            ))}
          </div>
        </Section>

        <Section id="nights" title={t('business.filters.nights')} count={filters.nightsMin || filters.nightsMax ? 1 : 0} openSections={openSections} toggle={toggleSection}>
          <div className={styles.filterRow}>
            <input
              type="number"
              min="1"
              placeholder={t('business.filters.from')}
              className={styles.filterNumberInput}
              value={filters.nightsMin}
              onChange={(e) => patchFilters({ nightsMin: e.target.value })}
            />
            <span className={styles.filterRowSep}>–</span>
            <input
              type="number"
              min="1"
              placeholder={t('business.filters.to')}
              className={styles.filterNumberInput}
              value={filters.nightsMax}
              onChange={(e) => patchFilters({ nightsMax: e.target.value })}
            />
          </div>
        </Section>

        <Section id="price" title={t('business.filters.price')} count={filters.priceMin || filters.priceMax ? 1 : 0} openSections={openSections} toggle={toggleSection}>
          <div className={styles.filterRow}>
            <input
              type="number"
              min="0"
              placeholder={t('business.filters.from')}
              className={styles.filterNumberInput}
              value={filters.priceMin}
              onChange={(e) => patchFilters({ priceMin: e.target.value })}
            />
            <span className={styles.filterRowSep}>–</span>
            <input
              type="number"
              min="0"
              placeholder={t('business.filters.to')}
              className={styles.filterNumberInput}
              value={filters.priceMax}
              onChange={(e) => patchFilters({ priceMax: e.target.value })}
            />
          </div>
        </Section>

        <Section id="board" title={t('business.filters.board')} count={filters.board.length} openSections={openSections} toggle={toggleSection}>
          <div className={styles.filterPillGroup}>
            {boardTypes.map((b) => (
              <button
                key={b}
                type="button"
                className={`${styles.filterPill} ${filters.board.includes(b) ? styles.filterPillActive : ''}`}
                onClick={() => toggleMulti('board', b)}
              >
                {b}
              </button>
            ))}
          </div>
        </Section>

        <Section id="priceType" title={t('business.filters.priceType')} count={filters.priceType.length} openSections={openSections} toggle={toggleSection}>
          <div className={styles.filterPillGroup}>
            {priceTypes.map((p) => (
              <button
                key={p}
                type="button"
                className={`${styles.filterPill} ${filters.priceType.includes(p) ? styles.filterPillActive : ''}`}
                onClick={() => toggleMulti('priceType', p)}
              >
                {t(`business.priceTypeLabels.${p}`)}
              </button>
            ))}
          </div>
        </Section>

        <Section id="transport" title={t('business.filters.transport')} count={filters.transport.length} openSections={openSections} toggle={toggleSection}>
          <div className={styles.filterPillGroup}>
            {transportTypes.map((tr) => (
              <button
                key={tr}
                type="button"
                className={`${styles.filterPill} ${filters.transport.includes(tr) ? styles.filterPillActive : ''}`}
                onClick={() => toggleMulti('transport', tr)}
              >
                {t(`business.transportLabels.${tr}`)}
              </button>
            ))}
          </div>
        </Section>
      </div>
    </>
  );

  return (
    <>
      <Seo
        title={`${t('business.titleLine1')} ${t('business.titleHighlight')}`}
        description={t('business.subtitle')}
      />

      <section className={styles.hero}>
        <svg className={styles.netmap} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          {ROUTES.map((r, i) => (
            <path key={i} className={`${styles.route} ${r.alt ? styles.routeAlt : ''}`} d={r.d} />
          ))}
          <circle className={styles.pulse} cx="500" cy="300" r="6" />
          <circle className={styles.hub} cx="500" cy="300" r="5" />
          <text className={styles.nodeLabel} x="514" y="296">
            {t('business.hubCity')}
          </text>
          {NODES.map((n) => {
            const country = countryByKey[n.countryKey];
            const city = country?.cities.find((c) => c.key === n.cityKey);
            return (
              <g key={n.cityKey}>
                <circle className={styles.node} cx={n.x} cy={n.y} r="3.5" />
                <text className={styles.nodeLabel} x={n.x + 12} y={n.y + 4}>
                  {getLocalizedField(city?.name, lang)}
                </text>
              </g>
            );
          })}
        </svg>

        <div className={styles.heroInner}>
          <motion.div
            className={styles.heroText}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.eyebrow}>
              <span className={styles.eyebrowDot} aria-hidden="true" />
              {t('business.eyebrow')}
            </span>
            <h1 className={styles.title}>
              {t('business.titleLine1')} <span className={styles.lime}>{t('business.titleHighlight')}</span>
              <br />
              {t('business.titleLine2')}
            </h1>
            <p className={styles.subtitle}>{t('business.subtitle')}</p>

            <div className={styles.ratesStrip}>
              <span className={styles.ratesLabel}>{t('business.ratesLabel')}</span>
              <div className={styles.ratesList}>
                {exchangeRates.map((r) => (
                  <div key={r.code} className={styles.rateItem}>
                    <b>1 {r.code}</b>
                    <span>{r.rate.toLocaleString('ru-RU')} UZS</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className={styles.trust}>
          <span className={styles.trustCaption}>{t('business.trustCaption')}</span>
          <div className={styles.trustLogos}>
            {partners.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="business-listing" className={styles.listing}>
        <div className={styles.listingInner}>
          <div className={styles.listingHeader}>
            <div>
              <span className={styles.eyebrowDark}>
                <span className={styles.eyebrowDot} aria-hidden="true" />
                {t('business.listingEyebrow')}
              </span>
              <h2 className={styles.listingTitle}>{t('business.listingTitle')}</h2>
            </div>
            <button type="button" className={styles.filterOpenMobile} onClick={() => setMobileFiltersOpen(true)}>
              {t('business.filterOpen')}
              {activeFilterCount > 0 && <span className={styles.filterBadge}>{activeFilterCount}</span>}
            </button>
          </div>

          <div className={styles.listingLayout}>
            <aside className={styles.filterSidebar}>{filterPanel}</aside>

            <AnimatePresence>
              {mobileFiltersOpen && (
                <motion.div
                  className={styles.filterMobileBackdrop}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onMouseDown={(e) => e.target === e.currentTarget && setMobileFiltersOpen(false)}
                >
                  <motion.div
                    className={styles.filterMobileSheet}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {filterPanel}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={styles.resultsCol}>
              <div className={styles.resultsToolbar}>
                <span className={styles.resultsCount}>{t('business.results.found', { count: filteredResults.length })}</span>
                <label className={styles.sortSelect}>
                  <span>{t('business.results.sort')}</span>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    {SORT_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {t(`business.sortOptions.${o}`)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {filteredResults.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>{t('business.results.empty')}</p>
                  <button type="button" className={styles.filterClear} onClick={() => setFilters(FILTER_DEFAULTS)}>
                    {t('business.results.reset')}
                  </button>
                </div>
              ) : (
                <div className={styles.resultsList}>
                  {filteredResults.map((r) => {
                    const country = countryByKey[r.countryKey];
                    const city = country?.cities.find((c) => c.key === r.cityKey);
                    return (
                      <motion.div
                        key={`${r.hotel}-${r.date}`}
                        className={styles.resultRow}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <span className={styles.resultDate}>{r.date}</span>
                        <span className={styles.resultName}>
                          <b>{getLocalizedField(r.tour, lang)}</b>
                          <em>
                            <FlagIcon iso={country?.iso} size={16} className={styles.resultFlag} />
                            {r.hotel} · {'★'.repeat(r.stars)} · {getLocalizedField(country?.name, lang)}, {getLocalizedField(city?.name, lang)}
                          </em>
                          <i>{r.room}</i>
                        </span>
                        <span className={styles.resultCell}>
                          {r.nights} {t('business.results.nights')}
                        </span>
                        <span className={styles.boardBadge}>{r.board}</span>
                        <span className={styles.seatsBadge}>
                          {r.seats} {t('business.results.seats')}
                        </span>
                        <span className={styles.resultPrice}>
                          {r.price.toLocaleString('ru-RU')} {r.currency}
                          <small>{t(`business.priceTypeLabels.${r.priceType}`)}</small>
                        </span>
                        <span className={`${styles.transportBadge} ${styles[`transport-${r.transport}`] ?? ''}`}>
                          {t(`business.transportLabels.${r.transport}`)}
                        </span>
                        <span className={styles.resultArrow} aria-hidden="true">
                          →
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {submitted ? (
        <section className={styles.leadDone}>
          <div className={styles.leadDoneInner}>{t('business.lead.sent')}</div>
        </section>
      ) : (
        <section className={styles.lead}>
          <div className={styles.leadInner}>
            <div>
              <h2>{t('business.lead.title')}</h2>
              <p>{t('business.lead.text')}</p>
            </div>
            <form className={styles.rateForm} onSubmit={onSubmit}>
              <input
                type="text"
                value={form.company}
                onChange={onChange('company')}
                placeholder={t('business.lead.companyPlaceholder')}
                required
                className={styles.rateInput}
              />
              <input
                type="text"
                value={form.contact}
                onChange={onChange('contact')}
                placeholder={t('business.lead.contactPlaceholder')}
                required
                className={styles.rateInput}
              />
              <button type="submit" className={styles.rateBtnDark}>
                {t('business.lead.submit')}
              </button>
            </form>
          </div>
        </section>
      )}

      <section className={styles.perks}>
        <div className={styles.perksInner}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            {t('business.perksEyebrow')}
          </span>
          <div className={styles.perksGrid}>
            {t('business.perks', { returnObjects: true }).map((p, i) => (
              <motion.div
                key={p.title}
                className={styles.perkCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <span className={styles.perkIndex}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
