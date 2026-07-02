import { useTranslation } from 'react-i18next';
import RouteLine from '../RouteLine/RouteLine';
import styles from './DateAvailability.module.scss';

const STATUS_KEY = { available: 'dateAvailable', limited: 'dateLimited', soldout: 'dateSoldOut' };

const LOCALE_BY_LANG = { en: 'en-US', ru: 'ru-RU', uz: 'uz-UZ' };

export default function DateAvailability({ dates, selected, onSelect }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(LOCALE_BY_LANG[lang] ?? 'en-US', { month: 'short', day: 'numeric' });

  return (
    <div className={styles.wrap}>
      <h3 className={styles.heading}>{t('offer.availableDates')}</h3>
      <div className={styles.routeRow}>
        <RouteLine
          variant="domestic"
          width={dates.length * 90}
          height={4}
          showDots={false}
          d={`M0 2 H${dates.length * 90}`}
          className={styles.connector}
        />
      </div>
      <div className={styles.chips}>
        {dates.map((d) => {
          const disabled = d.status === 'soldout';
          const isSelected = selected === d.date;
          return (
            <button
              key={d.date}
              type="button"
              disabled={disabled}
              className={`${styles.chip} ${styles[d.status]} ${isSelected ? styles.selected : ''}`}
              onClick={() => !disabled && onSelect?.(d.date)}
            >
              <span className={styles.chipDate}>{formatDate(d.date)}</span>
              <span className={styles.chipStatus}>{t(`offer.${STATUS_KEY[d.status]}`)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
