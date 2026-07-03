import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RouteLine from '../RouteLine/RouteLine';
import styles from './Footer.module.scss';

const SOCIAL = [
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/brillianttours_uz' },
  { id: 'telegram', label: 'Telegram', href: 'https://t.me/brillianttours_uz' },
];

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
  };

  const columns = [
    {
      title: t('footer.destinations'),
      links: [
        { label: t('nav.international'), to: '/international' },
        { label: t('nav.domestic'), to: '/domestic' },
        { label: t('nav.visas'), to: '/visas' },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { label: t('footer.aboutUs'), to: '/about' },
        { label: t('footer.ourStory'), to: '/about' },
        { label: t('nav.contact'), to: '/contact' },
      ],
    },
    {
      title: t('footer.support'),
      links: [
        { label: t('footer.faq'), to: '/contact' },
        { label: t('footer.supportCentre'), to: '/contact' },
        { label: t('footer.termsPrivacy'), to: '/contact' },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              Brilliant
            </Link>
            <p className={styles.tagline}>{t('footer.tagline')}</p>
            <a href="tel:+998332990000" className={styles.footerPhone}>{t('contact.phoneValue')}</a>
            <div className={styles.social}>
              {SOCIAL.map((s) => (
                <a key={s.id} href={s.href} target="_blank" rel="noreferrer" className={styles.socialLink}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className={styles.columns}>
            {columns.map((col) => (
              <div key={col.title} className={styles.column}>
                <h3 className={styles.colTitle}>{col.title}</h3>
                <RouteLine variant="domestic" width={48} height={12} showDots={false} d="M2 6 H46" className={styles.colDivider} />
                <ul className={styles.colLinks}>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className={styles.colLink}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.newsletter}>
          <div>
            <h3 className={styles.newsletterTitle}>{t('footer.newsletterTitle')}</h3>
            <p className={styles.newsletterText}>{t('footer.newsletterText')}</p>
          </div>
          <form className={styles.newsletterForm} onSubmit={onSubmit}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('footer.newsletterPlaceholder')}
              className={styles.newsletterInput}
            />
            <button type="submit" className={styles.newsletterBtn}>
              {t('footer.newsletterCta')}
            </button>
          </form>
          {submitted && <p className={styles.thanks}>{t('contact.sent')}</p>}
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Brilliant. {t('footer.rights')}</span>
        </div>
      </div>
    </footer>
  );
}
