import styles from './LogoMarquee.module.scss';

const PARTNERS = ['Uzbekistan Airways', 'Silk Road Hotels', 'Turkish Airlines', 'Emirates', 'Registan Tours', 'Pamir Lodge'];

export default function LogoMarquee() {
  // Duplicate the list once so the CSS animation can loop seamlessly at -50%.
  const items = [...PARTNERS, ...PARTNERS];

  return (
    <div className={styles.marquee} aria-hidden="false">
      <div className={styles.track}>
        {items.map((name, i) => (
          <span key={`${name}-${i}`} className={styles.item}>
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
