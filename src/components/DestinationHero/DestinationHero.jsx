import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollCue from '../ScrollCue/ScrollCue';
import styles from './DestinationHero.module.scss';

// Shared slideshow hero used on Home, DomesticHub and InternationalHub.
// `slides`: [{ image, name, sublabel, to }] — clicking a slide's preview
// card or its top label navigates to `to`.
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
  const next1 = slides[(slide + 1) % slides.length];
  const next2 = slides[(slide + 2) % slides.length];

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

      {/* Top-pinned current destination label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`loc-${slide}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.35 }}
        >
          <Link to={current.to} className={styles.heroLocationTop}>
            <span className={styles.heroLocationDot} aria-hidden="true" />
            <span className={styles.heroLocationName}>{current.name}</span>
            {current.sublabel && <span className={styles.heroLocationTag}>{current.sublabel}</span>}
          </Link>
        </motion.div>
      </AnimatePresence>

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
                <Link to={next1.to} className={`${styles.heroCard} ${styles.heroCardPrimary}`}>
                  <img src={next1.image} alt={next1.name} className={styles.heroCardImg} />
                  <div className={styles.heroCardGrad} aria-hidden="true" />
                  <span className={styles.heroCardLabel}>
                    {next1.name}
                    {next1.sublabel && <em>{next1.sublabel}</em>}
                  </span>
                </Link>
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
                <Link to={next2.to} className={`${styles.heroCard} ${styles.heroCardSecondary}`}>
                  <img src={next2.image} alt={next2.name} className={styles.heroCardImg} />
                  <div className={styles.heroCardGrad} aria-hidden="true" />
                  <span className={styles.heroCardLabel}>
                    {next2.name}
                    {next2.sublabel && <em>{next2.sublabel}</em>}
                  </span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {hasMultiple && (
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
