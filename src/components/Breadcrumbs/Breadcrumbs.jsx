import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.scss';

// `items`: [{ label, to }] — last item renders as plain text (current page).
// `variant="onLight"` swaps to darker text for the rare non-hero, light-page
// usage (e.g. OfferDetail); the default styling assumes a dark hero image.
export default function Breadcrumbs({ items, variant }) {
  return (
    <nav className={`${styles.breadcrumbs} ${variant === 'onLight' ? styles.onLight : ''}`} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className={styles.item}>
              {isLast || !item.to ? (
                <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              ) : (
                <Link to={item.to}>{item.label}</Link>
              )}
              {!isLast && <span className={styles.sep} aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
