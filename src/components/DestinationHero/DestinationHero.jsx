import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollCue from '../ScrollCue/ScrollCue';
import styles from './DestinationHero.module.scss';

// Shared slideshow hero used on Home, DomesticHub and InternationalHub.
// `slides`: [{ image, name, sublabel, to }] — clicking a preview card swaps
// the background to that destination; the destination badge (below the
// search bar) is the actual link to `to`.
export default function DestinationHero({
  eyebrow,
  title,
  subtitle,
  slides,
  showSearch = false,
  query = '',
  onQueryChange,
  onSearchSubmit,
  searchPlaceholder,
  searchLabel,
  scrollLabel,
}) {
  const [slide, setSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const hasMultiple = slides.length > 1;

  useEffect(() => {
    if (isPaused || !hasMultiple) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [isPaused, hasMultiple, slides.length]);

  const prevSlide = () => setSlide((s) => (s - 1 + slides.length) % slides.length);
  const nextSlide = () => setSlide((s) => (s + 1) % slides.length);

  const current = slides[slide];
  const next1Idx = (slide + 1) % slides.length;
  const next2Idx = (slide + 2) % slides.length;
  const next1 = slides[next1Idx];
  const next2 = slides[next2Idx];

  const destinationBadge = (
    <AnimatePresence mode="wait">
      <motion.div
        key={`loc-${slide}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
      >
        <Link to={current.to} className={styles.heroLocationTop}>
          <span className={styles.heroLocationDot} aria-hidden="true" />
          <span className={styles.heroLocationName}>{current.name}</span>
          {current.sublabel && <span className={styles.heroLocationTag}>{current.sublabel}</span>}
          <span className={styles.heroLocationArrow} aria-hidden="true">→</span>
        </Link>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <section
      className={styles.hero}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.heroBg} aria-hidden="true">
        {slides.map((s, i) => (
          <img
            key={s.to + i}
            src={s.image}
            alt=""
            className={`${styles.heroSlide} ${i === slide ? styles.heroSlideActive : ''}`}
          />
        ))}
      </div>

      <div className={styles.heroOverlay} aria-hidden="true" />

      <div className={styles.heroInner}>
        <motion.div
          className={styles.heroText}
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
        >
          {eyebrow && (
            <motion.span
              className={styles.heroEyebrow}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
            >
              {eyebrow}
            </motion.span>
          )}

          <motion.h1
            className={styles.heroTitle}
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              className={styles.heroSubtitle}
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } } }}
            >
              {subtitle}
            </motion.p>
          )}

          {/* Search + destination badge move together as one bottom-anchored
              cluster below desktop, so the search bar reads as "paired with"
              the badge instead of stranded up near the title. */}
          <div className={styles.heroBottomCluster}>
            {showSearch && (
              <motion.form
                className={styles.heroSearch}
                onSubmit={onSearchSubmit}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => onQueryChange?.(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={styles.heroSearchInput}
                />
                <button type="submit" className={styles.heroSearchBtn}>
                  {searchLabel}
                </button>
              </motion.form>
            )}

            <motion.div
              className={styles.heroLocationWrap}
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
            >
              {destinationBadge}
            </motion.div>
          </div>
        </motion.div>

        {hasMultiple && (
          <div className={styles.heroCards}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`c1-${slide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  onClick={() => setSlide(next1Idx)}
                  className={`${styles.heroCard} ${styles.heroCardPrimary}`}
                  aria-label={next1.name}
                >
                  <img src={next1.image} alt={next1.name} className={styles.heroCardImg} />
                  <div className={styles.heroCardGrad} aria-hidden="true" />
                  <span className={styles.heroCardLabel}>
                    {next1.name}
                    {next1.sublabel && <em>{next1.sublabel}</em>}
                  </span>
                </button>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`c2-${slide}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.45, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  onClick={() => setSlide(next2Idx)}
                  className={`${styles.heroCard} ${styles.heroCardSecondary}`}
                >
                  <img src={next2.image} alt={next2.name} className={styles.heroCardImg} />
                  <div className={styles.heroCardGrad} aria-hidden="true" />
                  <span className={styles.heroCardLabel}>
                    {next2.name}
                    {next2.sublabel && <em>{next2.sublabel}</em>}
                  </span>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {hasMultiple && (
        <button className={`${styles.heroArrowBtn} ${styles.heroArrowLeft}`} onClick={prevSlide} aria-label="Previous slide">
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      {hasMultiple && (
        <button className={`${styles.heroArrowBtn} ${styles.heroArrowRight}`} onClick={nextSlide} aria-label="Next slide">
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {hasMultiple && (
        <div className={styles.heroCounter} aria-live="polite">
          <span className={styles.heroCounterCurrent}>{String(slide + 1).padStart(2, '0')}</span>
          <span className={styles.heroCounterDiv}>/</span>
          <span className={styles.heroCounterTotal}>{String(slides.length).padStart(2, '0')}</span>
        </div>
      )}

      {scrollLabel && <ScrollCue label={scrollLabel} />}
    </section>
  );
}
