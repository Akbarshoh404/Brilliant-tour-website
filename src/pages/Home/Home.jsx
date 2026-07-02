import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import DestinationHero from '../../components/DestinationHero/DestinationHero';
import OfferCard from '../../components/OfferCard/OfferCard';
import StatCounter from '../../components/StatCounter/StatCounter';
import LogoMarquee from '../../components/LogoMarquee/LogoMarquee';
import offers from '../../data/offers';
import collections from '../../data/collections';
import homeCountries from '../../data/homeCountries';
import { avatarUrl } from '../../data/images';
import { getLocalizedField } from '../../utils/getLocalizedField';

import p1 from '../../assets/pics/Uzbekistan/photo_1_2026-06-30_15-23-57.jpg';
import p3 from '../../assets/pics/Uzbekistan/photo_3_2026-06-30_15-23-57.jpg';
import p7 from '../../assets/pics/Uzbekistan/photo_7_2026-06-30_15-23-57.jpg';
import p9 from '../../assets/pics/Uzbekistan/photo_9_2026-06-30_15-23-57.jpg';
import p13 from '../../assets/pics/Uzbekistan/photo_13_2026-06-30_15-23-57.jpg';
import internationalCardImg from '../../assets/pics/Japan/japan_2.jpg';

import styles from './Home.module.scss';

// Uzbekistan highlights used to interleave with the international countries
// in the Home hero slideshow — a mix of domestic + international spots.
const DOMESTIC_SPOTS = [
  { image: p1,  name: 'Charvak Lake',     sublabel: 'Uzbekistan', to: '/domestic/mountain' },
  { image: p3,  name: 'Aydarkul Lake',    sublabel: 'Uzbekistan', to: '/domestic/desert'   },
  { image: p7,  name: 'Fergana Valley',   sublabel: 'Uzbekistan', to: '/domestic/cultural' },
  { image: p9,  name: 'Beldersay Peak',   sublabel: 'Uzbekistan', to: '/domestic/mountain' },
  { image: p13, name: 'Aral Sea Region',  sublabel: 'Uzbekistan', to: '/domestic/desert'   },
];

const POPULAR_IDS = [
  'samarkand-registan-discovery',
  'dubai-skyline-escape',
  'maldives-overwater-retreat',
  'kyzylkum-desert-safari',
  'paris-romance-weekend',
  'chimgan-mountains-trek',
];

const TESTIMONIALS = [
  { id: 1, name: 'Aziza Karimova',  role: 'traveler',   avatarImg: 47, quoteKey: 'aziza'   },
  { id: 2, name: 'James Whitfield', role: 'traveler',   avatarImg: 22, quoteKey: 'james'   },
  { id: 3, name: 'Dilnoza Yusupova',role: 'influencer', avatarImg: 36, quoteKey: 'dilnoza' },
];

const TESTIMONIAL_TEXT = {
  aziza: {
    en: 'Our Kyzylkum desert night under a yurt sky was the best two days of the year.',
    ru: 'Ночь в пустыне Кызылкум под юртой стала лучшими двумя днями года.',
    uz: "Qizilqum cho'lida yurta osmoni ostidagi tunimiz yilning eng yaxshi ikki kuni edi.",
  },
  james: {
    en: 'Brilliant planned our Switzerland trip and our Samarkand trip with the exact same care. Hard to find that consistency.',
    ru: 'Brilliant спланировал и поездку в Швейцарию, и в Самарканд с одинаковой тщательностью. Такую последовательность редко встретишь.',
    uz: "Brilliant Shveytsariya va Samarqand safarlarimizni bir xil sinchkovlik bilan rejalashtirdi.",
  },
  dilnoza: {
    en: 'The Registan at sunrise, with no crowds yet — our guide timed it perfectly.',
    ru: 'Регистан на рассвете, ещё без толпы — гид рассчитал время идеально.',
    uz: "Tongda hali olomon yo'q Registon — gidimiz vaqtni mukammal hisoblagan edi.",
  },
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const popularScrollRef = useRef(null);
  const seasonalScrollRef = useRef(null);

  const popularPrev = () => popularScrollRef.current?.scrollBy({ left: -340, behavior: 'smooth' });
  const popularNext = () => popularScrollRef.current?.scrollBy({ left:  340, behavior: 'smooth' });
  const seasonalPrev = () => seasonalScrollRef.current?.scrollBy({ left: -340, behavior: 'smooth' });
  const seasonalNext = () => seasonalScrollRef.current?.scrollBy({ left:  340, behavior: 'smooth' });

  const popularOffers = POPULAR_IDS.map((id) => offers.find((o) => o.id === id)).filter(Boolean);
  const seasonalOffers = offers.filter((o) => o.isSpecialOffer);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
  };

  // Interleave Uzbekistan spots with the international countries so the
  // hero mixes domestic + international destinations.
  const internationalSpots = homeCountries.slice(1).map((c) => ({
    image: c.image,
    name: getLocalizedField(c.name, lang),
    sublabel: t('nav.international'),
    to: c.to,
  }));
  const heroSlides = DOMESTIC_SPOTS.flatMap((spot, i) => [spot, internationalSpots[i]]).filter(Boolean);

  return (
    <>
      <DestinationHero
        eyebrow={t('hero.eyebrow')}
        title={<>{t('hero.titleLine1')} <em>{t('hero.titleLine2')}</em><br />{t('hero.titleLine3')}</>}
        subtitle={t('hero.subtitle')}
        slides={heroSlides}
        showSearch
        query={query}
        onQueryChange={setQuery}
        onSearchSubmit={onSearchSubmit}
        searchPlaceholder={t('hero.searchPlaceholder')}
        searchLabel={t('nav.search')}
        scrollLabel={t('common.scroll')}
      />

      {/* ===== TWO ROUTES SPLIT ===== */}
      <section className={styles.split}>
        <div className={styles.splitInner}>
          <motion.div
            className={styles.splitText}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.splitTitle}>{t('home.splitTitle')}</h2>
            <p className={styles.splitBody}>{t('home.splitText')}</p>
          </motion.div>

          <div className={styles.splitCards}>
            <Link to="/domestic" className={`${styles.splitCard} ${styles.splitCardDomestic}`}>
              <img src={p1} alt="" className={styles.splitCardImg} />
              <div className={styles.splitCardBody}>
                <span className={styles.splitCardEyebrow}>Domestic</span>
                <span className={styles.splitCardLabel}>{t('home.domesticCta')}</span>
                <span className={styles.splitCardArrow} aria-hidden="true">→</span>
              </div>
            </Link>
            <Link to="/international" className={`${styles.splitCard} ${styles.splitCardIntl}`}>
              <img src={internationalCardImg} alt="" className={styles.splitCardImg} />
              <div className={styles.splitCardBody}>
                <span className={styles.splitCardEyebrow}>International</span>
                <span className={styles.splitCardLabel}>{t('home.internationalCta')}</span>
                <span className={styles.splitCardArrow} aria-hidden="true">→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== COUNTRIES ===== */}
      <section className={styles.countries}>
        <div className={styles.sectionInner}>
          <SectionHeading title={t('home.countriesTitle')} text={t('home.countriesText')} />
          <div className={styles.countryGrid}>
            {homeCountries.map((c, i) => (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
              >
                <Link to={c.to} className={styles.countryTile}>
                  <img src={c.image} alt={getLocalizedField(c.name, lang)} className={styles.countryImg} />
                  <span className={styles.countryName}>{getLocalizedField(c.name, lang)}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR DESTINATIONS ===== */}
      <section className={styles.popular}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionRow}>
            <SectionHeading title={t('home.popularTitle')} text={t('home.popularText')} />
            <CarouselArrows onPrev={popularPrev} onNext={popularNext} />
          </div>
          <div className={styles.popularScroll} ref={popularScrollRef}>
            {popularOffers.map((offer, i) => (
              <div key={offer.id} className={styles.popularItem}>
                <OfferCard offer={offer} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <section className={styles.stats}>
        <div className={styles.sectionInner}>
          <div className={styles.statsGrid}>
            <StatCounter value={18}    suffix="+" label="Years of routing" />
            <StatCounter value={42000} suffix="+" label="Happy travelers"  />
            <StatCounter value={120}   suffix="+" label="Curated routes"   />
            <StatCounter value={4.8}             label="Average rating"    />
          </div>
        </div>
      </section>

      {/* ===== TRAVEL YOUR WAY ===== */}
      <section className={styles.travelWay}>
        <div className={styles.sectionInner}>
          <SectionHeading title={t('home.travelYourWayTitle')} text={t('home.travelYourWayText')} />
          <div className={styles.tileGrid}>
            {collections.map((c, i) => (
              <motion.div
                key={c.tag}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.3) }}
              >
                <Link to={`/collections/${c.tag}`} className={styles.tile}>
                  <img src={c.heroImage} alt="" className={styles.tileImg} />
                  <div className={styles.tileOverlay} aria-hidden="true" />
                  <span className={styles.tileLabel}>{getLocalizedField(c.name, lang)}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SEASONAL OFFERS ===== */}
      <section className={styles.seasonal}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionRow}>
            <SectionHeading title={t('home.seasonalTitle')} text={t('home.seasonalText')} />
            <CarouselArrows onPrev={seasonalPrev} onNext={seasonalNext} />
          </div>
          <div className={styles.popularScroll} ref={seasonalScrollRef}>
            {seasonalOffers.map((offer, i) => (
              <div key={offer.id} className={styles.popularItem}>
                <OfferCard offer={offer} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className={styles.testimonials}>
        <div className={styles.sectionInner}>
          <SectionHeading title={t('home.testimonialsTitle')} light />
          <div className={styles.testimonialGrid}>
            {TESTIMONIALS.map((tst) => (
              <motion.div
                key={tst.id}
                className={styles.testimonialCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: (tst.id - 1) * 0.08 }}
              >
                <p className={styles.testimonialQuote}>&ldquo;{getLocalizedField(TESTIMONIAL_TEXT[tst.quoteKey], lang)}&rdquo;</p>
                <div className={styles.testimonialAuthor}>
                  <img src={avatarUrl(tst.avatarImg)} alt={tst.name} className={styles.testimonialAvatar} />
                  <div>
                    <span className={styles.testimonialName}>{tst.name}</span>
                    <span className={styles.testimonialRole}>{t(`common.${tst.role}`)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PARTNERS ===== */}
      <section className={styles.partners}>
        <div className={styles.sectionInner}>
          <span className={styles.partnersTitle}>{t('home.partnersTitle')}</span>
          <LogoMarquee />
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <FaqSection t={t} />

      {/* ===== NEWSLETTER ===== */}
      <section className={styles.newsletterCta}>
        <div className={styles.newsletterInner}>
          <h2 className={styles.newsletterTitle}>{t('home.newsletterTitle')}</h2>
          <p className={styles.newsletterText}>{t('home.newsletterText')}</p>
          <Link to="/contact" className={styles.newsletterBtn}>
            {t('common.learnMore')}
          </Link>
        </div>
      </section>
    </>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function SectionHeading({ title, text, light = false }) {
  return (
    <motion.div
      className={`${styles.sectionHeading} ${light ? styles.sectionHeadingLight : ''}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5 }}
    >
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </motion.div>
  );
}

function CarouselArrows({ onPrev, onNext }) {
  return (
    <div className={styles.carouselArrows}>
      <button className={styles.carouselArrow} onClick={onPrev} aria-label="Previous">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button className={styles.carouselArrow} onClick={onNext} aria-label="Next">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

function FaqSection({ t }) {
  const [open, setOpen] = useState(null);
  const items = t('home.faqItems', { returnObjects: true });

  return (
    <section className={styles.faq}>
      <div className={styles.sectionInner}>
        <SectionHeading title={t('home.faqTitle')} />
        <div className={styles.faqList}>
          {items.map((item, i) => (
            <div key={i} className={styles.faqItem}>
              <button
                type="button"
                className={styles.faqQ}
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{item.q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.22 }}
                  className={styles.faqIcon}
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className={styles.faqAWrap}
                  >
                    <p className={styles.faqA}>{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
