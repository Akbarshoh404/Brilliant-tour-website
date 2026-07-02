import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Lightbox.module.scss';

export default function Lightbox({ images, initialIndex = 0, isOpen, onClose, alt = '' }) {
  const [index, setIndex] = useState(initialIndex);
  const touchStartX = useRef(null);

  // Reset to initialIndex each time the lightbox opens. Adjusted during
  // render (React's documented "previous prop" pattern, state-based rather
  // than ref-based) since the component stays mounted across opens/closes.
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) setIndex(initialIndex);
  }

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, images.length, onClose]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      setIndex((i) => (delta < 0 ? (i + 1) % images.length : (i - 1 + images.length) % images.length));
    }
    touchStartX.current = null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
        >
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            &times;
          </button>

          <button
            type="button"
            className={`${styles.navBtn} ${styles.prevBtn}`}
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div className={styles.stage} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <AnimatePresence mode="wait">
              <motion.img
                key={index}
                src={images[index]}
                alt={`${alt} ${index + 1}`}
                className={styles.image}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>

          <button
            type="button"
            className={`${styles.navBtn} ${styles.nextBtn}`}
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            aria-label="Next image"
          >
            ›
          </button>

          <div className={styles.counter}>
            {index + 1} / {images.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
