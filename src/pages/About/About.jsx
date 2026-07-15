import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import StatCounter from '../../components/StatCounter/StatCounter';
import RouteLine from '../../components/RouteLine/RouteLine';
import Seo from '../../components/Seo/Seo';
import { avatarUrl } from '../../data/images';
import aboutHero from '../../assets/pics/Uzbekistan/photo_2_2026-06-30_15-23-57.jpg';
import heroAccent from '../../assets/pics/Uzbekistan/photo_5_2026-06-30_15-23-57.jpg';
import storyPhoto from '../../assets/pics/Uzbekistan/photo_8_2026-06-30_15-23-57.jpg';
import storyAccentPhoto from '../../assets/pics/Uzbekistan/photo_10_2026-06-30_15-23-57.jpg';
import missionPhoto from '../../assets/pics/Uzbekistan/photo_4_2026-06-30_15-23-57.jpg';
import styles from './About.module.scss';

const TEAM = [
  { id: 1, name: 'Madina Tashkentova', role: 'Founder & Lead Route Planner', avatarImg: 5 },
  { id: 2, name: 'Otabek Yusupov', role: 'Domestic Operations', avatarImg: 13 },
  { id: 3, name: 'Sarah Lindqvist', role: 'International Partnerships', avatarImg: 28 },
  { id: 4, name: 'Farrukh Aliyev', role: 'Lead Guide, Samarkand', avatarImg: 19 },
  { id: 5, name: 'Elena Petrova', role: 'Guest Experience', avatarImg: 44 },
  { id: 6, name: 'Otabek Nazarov', role: 'Lead Guide, Bukhara', avatarImg: 51 },
];

export default function About() {
  const { t } = useTranslation();

  return (
    <>
      <Seo
        title="О компании"
        description="Brilliant Tourism — команда, которая проектирует туры по Узбекистану и всему миру: от Шёлкового пути до пляжей Мальдив."
      />
      {/* Light "travel journal" hero in the same graphic family as the
          Visas page — grid-paper texture, bold type, milestone figures and
          a taped-photo collage instead of a full-bleed background image. */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <motion.div
            className={styles.heroText}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Breadcrumbs items={[{ label: t('nav.about') }]} variant="onLight" />
            <span className={styles.eyebrow}>{t('about.eyebrow')}</span>
            <h1 className={styles.title}>{t('about.title')}</h1>
            <p className={styles.intro}>{t('about.heroIntro')}</p>

            <div className={styles.heroMilestones}>
              <div className={styles.heroMilestone}>
                <span className={styles.heroMilestoneValue}>18+</span>
                <span className={styles.heroMilestoneLabel}>{t('about.statYears')}</span>
              </div>
              <div className={styles.heroMilestone}>
                <span className={styles.heroMilestoneValue}>9</span>
                <span className={styles.heroMilestoneLabel}>{t('about.statCities')}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.heroCollage}
            aria-hidden="true"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className={`${styles.collageFrame} ${styles.collageMain}`}>
              <img src={aboutHero} alt="" />
            </div>
            <div className={`${styles.collageFrame} ${styles.collageAccent}`}>
              <img src={heroAccent} alt="" />
            </div>
            <span className={styles.collageBadge}>{t('about.since')}</span>
          </motion.div>
        </div>
      </section>

      <section className={styles.storySection}>
        <div className={styles.sectionInner}>
          <div className={styles.storyLayout}>
            <motion.div
              className={styles.storyPhotoWrap}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <img src={storyPhoto} alt="" className={styles.storyPhoto} />
              <span className={styles.storyBadge}>{t('about.since')}</span>
              <div className={styles.storyAccentWrap}>
                <img src={storyAccentPhoto} alt="" className={styles.storyAccentPhoto} />
              </div>
            </motion.div>

            <motion.div
              className={styles.storyText}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className={styles.storyEyebrow}>{t('about.storyEyebrow')}</span>
              <p className={styles.story}>{t('about.story')}</p>
              <RouteLine variant="fork" dDomestic="M10 30 C 60 30, 80 10, 160 10" dInternational="M10 30 C 60 30, 80 50, 160 50" width={180} height={60} className={styles.storyRoute} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission — a frosted glass panel over the photo rather than a flat
          gradient overlay, in the "Liquid Glass" vein: one translucent
          material, not glass stacked on glass. */}
      <section className={styles.missionSection}>
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.missionCard}
            style={{ backgroundImage: `url(${missionPhoto})` }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.missionGlass}>
              <span className={styles.missionEyebrow}>{t('about.missionTitle')}</span>
              <p className={styles.missionText}>{t('about.mission')}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats — an even bento grid, four equal glass tiles. */}
      <section className={styles.statsSection}>
        <div className={styles.sectionInner}>
          <SectionHeading eyebrow={t('about.statsEyebrow')} title={t('about.statsTitle')} />
          <div className={styles.bento}>
            <BentoTile delay={0}>
              <span className={styles.bentoIcon} aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M3 15c2-6 5-10 7-10s5 4 7 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="10" cy="8" r="1.4" fill="currentColor" /></svg>
              </span>
              <StatCounter value={18} suffix="+" label={t('about.statYears')} />
            </BentoTile>
            <BentoTile delay={0.08}>
              <span className={styles.bentoIcon} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" /><circle cx="14" cy="9" r="2.3" stroke="currentColor" strokeWidth="1.6" /><path d="M2.5 16c.6-3 2.3-4.6 4.5-4.6s3.9 1.6 4.5 4.6M12 16c.4-2.2 1.7-3.4 3.3-3.4s2.9 1.2 3.3 3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </span>
              <StatCounter value={42000} suffix="+" label={t('about.statTravelers')} />
            </BentoTile>
            <BentoTile delay={0.16}>
              <span className={styles.bentoIcon} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4l6-1.5L16 4v12l-6 1.5L4 16V4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M10 2.5v15" stroke="currentColor" strokeWidth="1.6" /></svg>
              </span>
              <StatCounter value={120} suffix="+" label={t('about.statRoutes')} />
            </BentoTile>
            <BentoTile delay={0.24}>
              <span className={styles.bentoIcon} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 17.5s-6-5.4-6-9.7a6 6 0 0112 0c0 4.3-6 9.7-6 9.7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="10" cy="7.8" r="2" stroke="currentColor" strokeWidth="1.6" /></svg>
              </span>
              <StatCounter value={9} label={t('about.statCities')} />
            </BentoTile>
          </div>
        </div>
      </section>

      <section className={styles.teamSection}>
        <div className={styles.sectionInner}>
          <div className={styles.teamHeader}>
            <span className={styles.teamEyebrow}>{t('nav.about')}</span>
            <h2 className={styles.teamTitle}>{t('about.teamTitle')}</h2>
          </div>

          <div className={styles.teamGrid}>
            {TEAM.map((member, i) => (
              <motion.div
                key={member.id}
                className={styles.teamCard}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.3) }}
              >
                <div className={styles.teamPhotoWrap}>
                  <img src={avatarUrl(member.avatarImg, 400)} alt={member.name} className={styles.teamPhoto} />
                  <div className={styles.teamGlassStrip}>
                    <span className={styles.teamName}>{member.name}</span>
                    <span className={styles.teamRole}>{member.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ eyebrow, title }) {
  return (
    <motion.div
      className={styles.sectionHeading}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5 }}
    >
      <span className={styles.sectionHeadingEyebrow}>{eyebrow}</span>
      <h2 className={styles.sectionHeadingTitle}>{title}</h2>
    </motion.div>
  );
}

function BentoTile({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={`${styles.bentoTile} ${className}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
