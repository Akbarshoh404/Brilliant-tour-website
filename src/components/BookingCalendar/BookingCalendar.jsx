import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BookingCalendar.module.scss';

const LOCALE_BY_LANG = { en: 'en-US', ru: 'ru-RU', uz: 'uz-UZ' };

// A full formatted price ("5 250 000 UZS") doesn't fit in a ~40px calendar
// cell, so calendar days show a compact number only (no currency code) —
// the full price is already shown prominently above the calendar.
function formatCompactPrice(amount, locale) {
  try {
    return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(amount);
  } catch {
    return String(Math.round(amount));
  }
}

function toISO(d) {
  return d.toISOString().slice(0, 10);
}
function addDays(iso, n) {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
// Monday-first weekday index (0 = Monday .. 6 = Sunday)
function mondayIndex(date) {
  return (date.getDay() + 6) % 7;
}

// Single-calendar date picker: pick a start date and the trip's fixed
// duration auto-selects (and highlights) the end date — no independent
// end-date picking, since every offer has a fixed day count.
export default function BookingCalendar({ availableDates, durationDays, selected, onSelect, price }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const locale = LOCALE_BY_LANG[lang] ?? 'en-US';

  const statusByDate = useMemo(() => Object.fromEntries(availableDates.map((d) => [d.date, d.status])), [availableDates]);

  const initialView = useMemo(() => {
    const first = availableDates[0]?.date;
    const base = first ? new Date(first) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  }, [availableDates]);

  const [viewMonth, setViewMonth] = useState(initialView);

  const rangeSet = useMemo(() => {
    if (!selected) return new Set();
    const set = new Set();
    for (let i = 0; i < durationDays; i++) set.add(addDays(selected, i));
    return set;
  }, [selected, durationDays]);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const monthLabel = viewMonth.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const firstOfMonth = new Date(year, month, 1);
  const leadingBlanks = mondayIndex(firstOfMonth);
  const totalDays = daysInMonth(year, month);

  const cells = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const goPrev = () => setViewMonth(new Date(year, month - 1, 1));
  const goNext = () => setViewMonth(new Date(year, month + 1, 1));

  const weekdayLabels = t('offer.calendarWeekdays', { returnObjects: true });

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <button type="button" className={styles.navBtn} onClick={goPrev} aria-label="Previous month">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span className={styles.monthLabel}>{monthLabel}</span>
        <button type="button" className={styles.navBtn} onClick={goNext} aria-label="Next month">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <div className={styles.weekdays}>
        {weekdayLabels.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <div className={styles.grid}>
        {cells.map((d, i) => {
          if (d == null) return <span key={`b${i}`} className={styles.blank} />;
          const iso = toISO(new Date(year, month, d));
          const status = statusByDate[iso];
          const bookable = status === 'available' || status === 'limited';
          const isStart = selected === iso;
          const inRange = rangeSet.has(iso);

          return (
            <button
              key={iso}
              type="button"
              disabled={!bookable}
              className={`${styles.day} ${status ? styles[status] : ''} ${inRange ? styles.inRange : ''} ${isStart ? styles.isStart : ''}`}
              onClick={() => bookable && onSelect(iso)}
              aria-label={status ? `${d} — ${t(`offer.date${status === 'available' ? 'Available' : status === 'limited' ? 'Limited' : 'SoldOut'}`)}` : String(d)}
            >
              <span className={styles.dayNum}>{d}</span>
              {bookable && <span className={styles.dayPrice}>{formatCompactPrice(price, locale)}</span>}
            </button>
          );
        })}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendAvailable}`} aria-hidden="true" />
          {t('offer.dateAvailable')}
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendLimited}`} aria-hidden="true" />
          {t('offer.dateLimited')}
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendSoldout}`} aria-hidden="true" />
          {t('offer.dateSoldOut')}
        </span>
      </div>

      <p className={styles.hint}>
        {selected
          ? `${t('offer.tripDates')}: ${new Date(selected).toLocaleDateString(locale, { month: 'short', day: 'numeric' })} – ${new Date(addDays(selected, durationDays - 1)).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}`
          : t('offer.pickStartDate')}
      </p>
    </div>
  );
}
