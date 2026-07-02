import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { formatPrice, applyPriceModifier } from '../../utils/formatPrice';
import styles from './PackageComparison.module.scss';

const TIERS = ['economy', 'standard', 'premium'];

export default function PackageComparison({ offer, onSelect }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [activeTier, setActiveTier] = useState('standard');

  const activePackage = offer.packages.find((p) => p.tier === activeTier);
  const price = applyPriceModifier(offer.basePrice, activePackage.priceModifier);

  const select = (tier) => {
    setActiveTier(tier);
    onSelect?.(tier);
  };

  return (
    <div className={styles.wrap}>
      <h2 className={styles.heading}>{t('offer.packageComparison')}</h2>

      <div className={styles.tabs} role="tablist">
        {TIERS.map((tier) => (
          <button
            key={tier}
            type="button"
            role="tab"
            aria-selected={activeTier === tier}
            className={styles.tab}
            onClick={() => select(tier)}
          >
            {activeTier === tier && (
              <motion.span layoutId="package-tab-indicator" className={styles.tabIndicator} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} />
            )}
            <span className={styles.tabLabel}>{t(`offer.${tier}`)}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTier}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className={styles.content}
        >
          <div className={styles.priceRow}>
            <span className={styles.price}>{formatPrice(price, offer.currency, lang)}</span>
            <span className={styles.priceUnit}>{t('common.perPerson')}</span>
          </div>

          <ul className={styles.checklist}>
            <li>
              <span className={styles.checkLabel}>{t('offer.hotelCategory')}</span>
              <span className={styles.checkValue}>{activePackage.hotelCategory}</span>
            </li>
            <li>
              <span className={styles.checkLabel}>{t('offer.transfer')}</span>
              <span className={styles.checkValue}>{activePackage.transfer}</span>
            </li>
            <li>
              <span className={styles.checkLabel}>{t('offer.support')}</span>
              <span className={styles.checkValue}>{activePackage.support}</span>
            </li>
            {activePackage.concierge && (
              <li>
                <span className={styles.checkLabel}>{t('offer.concierge')}</span>
                <span className={styles.checkValue}>✓</span>
              </li>
            )}
            {activePackage.extras.length > 0 && (
              <li className={styles.extrasRow}>
                <span className={styles.checkLabel}>{t('offer.extras')}</span>
                <span className={styles.checkValue}>{activePackage.extras.join(', ')}</span>
              </li>
            )}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
