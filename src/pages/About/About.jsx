import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ScrollCue from '../../components/ScrollCue/ScrollCue';
import StatCounter from '../../components/StatCounter/StatCounter';
import RouteLine from '../../components/RouteLine/RouteLine';
import { avatarUrl } from '../../data/images';
import aboutHero from '../../assets/pics/Uzbekistan/photo_11_2026-06-30_15-23-57.jpg';
import storyPhoto from '../../assets/pics/Uzbekistan/photo_9_2026-06-30_15-23-57.jpg';
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
      <section className={styles.hero} style={{ backgroundImage: `url(${aboutHero})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <Breadcrumbs items={[{ label: t('nav.about') }]} />
          <span className={styles.eyebrow}>{t('about.eyebrow')}</span>
          <h1 className={styles.title}>{t('about.title')}</h1>
          <p className={styles.intro}>{t('about.heroIntro')}</p>
        </div>
        <ScrollCue label={t('common.scroll')} />
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
            </motion.div>

            <motion.div
              className={styles.storyText}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
              <p className={styles.story}>{t('about.story')}</p>
              <RouteLine variant="fork" dDomestic="M10 30 C 60 30, 80 10, 160 10" dInternational="M10 30 C 60 30, 80 50, 160 50" width={180} height={60} className={styles.storyRoute} />
            </motion.div>
          </div>
        </div>
      </section>

      <section className={styles.missionSection}>
        <div className={styles.sectionInner}>
          <div className={styles.missionCard} style={{ backgroundImage: `url(${aboutHero})` }}>
            <div className={styles.missionOverlay} aria-hidden="true" />
            <span className={styles.missionEyebrow}>{t('about.missionTitle')}</span>
            <p>{t('about.mission')}</p>
          </div>
        </div>
      </section>

      <section className={styles.statsSection}>
        <div className={styles.sectionInner}>
          <div className={styles.statsGrid}>
            <StatCounter value={18} suffix="+" label={t('about.statYears')} />
            <StatCounter value={42000} suffix="+" label={t('about.statTravelers')} />
            <StatCounter value={120} suffix="+" label={t('about.statRoutes')} />
            <StatCounter value={9} label={t('about.statCities')} />
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
                  <span className={styles.teamIndex}>{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className={styles.teamInfo}>
                  <span className={styles.teamName}>{member.name}</span>
                  <span className={styles.teamDivider} aria-hidden="true" />
                  <span className={styles.teamRole}>{member.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
