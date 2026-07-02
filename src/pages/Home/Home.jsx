import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollCue from '../../components/ScrollCue/ScrollCue';
import OfferCard from '../../components/OfferCard/OfferCard';
import StatCounter from '../../components/StatCounter/StatCounter';
import LogoMarquee from '../../components/LogoMarquee/LogoMarquee';
import offers from '../../data/offers';
import collections from '../../data/collections';
import { img, avatarUrl } from '../../data/images';
import { getLocalizedField } from '../../utils/getLocalizedField';

import p1 from '../../assets/pics/photo_1_2026-06-30_15-23-57.jpg';
import p2 from '../../assets/pics/photo_2_2026-06-30_15-23-57.jpg';
import p3 from '../../assets/pics/photo_3_2026-06-30_15-23-57.jpg';
import p4 from '../../assets/pics/photo_4_2026-06-30_15-23-57.jpg';
import p5 from '../../assets/pics/photo_5_2026-06-30_15-23-57.jpg';
import p6 from '../../assets/pics/photo_6_2026-06-30_15-23-57.jpg';
import p7 from '../../assets/pics/photo_7_2026-06-30_15-23-57.jpg';
import p8 from '../../assets/pics/photo_8_2026-06-30_15-23-57.jpg';
import p9 from '../../assets/pics/photo_9_2026-06-30_15-23-57.jpg';
import p10 from '../../assets/pics/photo_10_2026-06-30_15-23-57.jpg';
import p11 from '../../assets/pics/photo_11_2026-06-30_15-23-57.jpg';
import p12 from '../../assets/pics/photo_12_2026-06-30_15-23-57.jpg';
import p13 from '../../assets/pics/photo_13_2026-06-30_15-23-57.jpg';

import styles from './Home.module.scss';

const SLIDES = [
  { img: p1,  location: 'Charvak Lake',       tag: 'Tashkent Region'   },
  { img: p2,  location: 'Chimgan Trail',       tag: 'Mountain Trek'     },
  { img: p3,  location: 'Aydarkul Lake',       tag: 'Desert Oasis'      },
  { img: p4,  location: 'Nuratau Hills',       tag: 'Ancient Forests'   },
  { img: p5,  location: 'Ugam-Chatkal',        tag: 'National Park'     },
  { img: p6,  location: 'Zarafshan Range',     tag: 'Snow Peaks'        },
  { img: p7,  location: 'Fergana Valley',      tag: 'Valley Views'      },
  { img: p8,  location: 'Kyzylkum',            tag: 'Red Desert'        },
  { img: p9,  location: 'Beldersay Peak',      tag: 'Summit Views'      },
  { img: p10, location: 'Charvak Reservoir',   tag: 'Sunset Water'      },
  { img: p11, location: 'Pskem Range',         tag: 'Mountain Paths'    },
  { img: p12, location: 'Mountain Pass',       tag: 'Road Less Taken'   },
  { img: p13, location: 'Aral Sea Region',     tag: 'Lost Sea'          },
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
  const [slide, setSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const popularScrollRef = useRef(null);
  const seasonalScrollRef = useRef(null);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, [isPaused]);

  const prevSlide = () => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length);
  const nextSlide = () => setSlide((s) => (s + 1) % SLIDES.length);

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

  const next1 = (slide + 1) % SLIDES.length;
  const next2 = (slide + 2) % SLIDES.length;

  return (
    <>
      {/* ===== HERO SLIDESHOW ===== */}
      <section
        className={styles.hero}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background images — all rendered, only active one visible */}
        <div className={styles.heroBg} aria-hidden="true">
          {SLIDES.map((s, i) => (
            <img
              key={i}
              src={s.img}
              alt=""
              className={`${styles.heroSlide} ${i === slide ? styles.heroSlideActive : ''}`}
            />
          ))}
        </div>

        {/* Gradient overlays */}
        <div className={styles.heroOverlay} aria-hidden="true" />

        {/* Main content */}
        <div className={styles.heroInner}>
          {/* Left: headline + CTA */}
          <motion.div
            className={styles.heroText}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
            }}
          >
            <motion.span
              className={styles.heroEyebrow}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
            >
              {t('hero.eyebrow')}
            </motion.span>

            <motion.h1
              className={styles.heroTitle}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
            >
              {t('hero.titleLine1')} <em>{t('hero.titleLine2')}</em>
              <br />{t('hero.titleLine3')}
            </motion.h1>

            <motion.p
              className={styles.heroSubtitle}
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } } }}
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.form
              className={styles.heroSearch}
              onSubmit={onSearchSubmit}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                className={styles.heroSearchInput}
              />
              <button type="submit" className={styles.heroSearchBtn}>
                {t('nav.search')}
              </button>
            </motion.form>
          </motion.div>

          {/* Right: preview cards for the next 2 slides */}
          <div className={styles.heroCards}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`c1-${next1}`}
                className={`${styles.heroCard} ${styles.heroCardPrimary}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <img src={SLIDES[next1].img} alt={SLIDES[next1].location} className={styles.heroCardImg} />
                <div className={styles.heroCardGrad} aria-hidden="true" />
                <span className={styles.heroCardLabel}>{SLIDES[next1].location}</span>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`c2-${next2}`}
                className={`${styles.heroCard} ${styles.heroCardSecondary}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.45, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <img src={SLIDES[next2].img} alt={SLIDES[next2].location} className={styles.heroCardImg} />
                <div className={styles.heroCardGrad} aria-hidden="true" />
                <span className={styles.heroCardLabel}>{SLIDES[next2].location}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Arrow controls */}
        <div className={styles.heroArrows}>
          <button className={styles.heroArrowBtn} onClick={prevSlide} aria-label="Previous slide">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className={styles.heroArrowBtn} onClick={nextSlide} aria-label="Next slide">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Counter */}
        <div className={styles.heroCounter} aria-live="polite">
          <span className={styles.heroCounterCurrent}>{String(slide + 1).padStart(2, '0')}</span>
          <span className={styles.heroCounterDiv}>/</span>
          <span className={styles.heroCounterTotal}>{String(SLIDES.length).padStart(2, '0')}</span>
        </div>

        {/* Animated location label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`loc-${slide}`}
            className={styles.heroLocation}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.35 }}
          >
            <span className={styles.heroLocationDot} aria-hidden="true" />
            <span className={styles.heroLocationName}>{SLIDES[slide].location}</span>
            <span className={styles.heroLocationTag}>{SLIDES[slide].tag}</span>
          </motion.div>
        </AnimatePresence>

        <ScrollCue label={t('common.scroll')} />
      </section>

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
              <img src={img('uzbekistan-domestic-card', 700, 500)} alt="" className={styles.splitCardImg} />
              <div className={styles.splitCardBody}>
                <span className={styles.splitCardEyebrow}>Domestic</span>
                <span className={styles.splitCardLabel}>{t('home.domesticCta')}</span>
                <span className={styles.splitCardArrow} aria-hidden="true">→</span>
              </div>
            </Link>
            <Link to="/international" className={`${styles.splitCard} ${styles.splitCardIntl}`}>
              <img src={img('international-world-card', 700, 500)} alt="" className={styles.splitCardImg} />
              <div className={styles.splitCardBody}>
                <span className={styles.splitCardEyebrow}>International</span>
                <span className={styles.splitCardLabel}>{t('home.internationalCta')}</span>
                <span className={styles.splitCardArrow} aria-hidden="true">→</span>
              </div>
            </Link>
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
