import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ScrollCue from '../../components/ScrollCue/ScrollCue';
import StatCounter from '../../components/StatCounter/StatCounter';
import RouteLine from '../../components/RouteLine/RouteLine';
import { avatarUrl } from '../../data/images';
import aboutHero from '../../assets/pics/photo_11_2026-06-30_15-23-57.jpg';
import styles from './About.module.scss';

const TEAM = [
  { id: 1, name: 'Madina Tashkentova', role: 'Founder & Lead Route Planner', avatarImg: 5 },
  { id: 2, name: 'Otabek Yusupov', role: 'Domestic Operations', avatarImg: 13 },
  { id: 3, name: 'Sarah Lindqvist', role: 'International Partnerships', avatarImg: 28 },
  { id: 4, name: 'Farrukh Aliyev', role: 'Lead Guide, Samarkand', avatarImg: 19 },
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
          <RouteLine variant="fork" dDomestic="M10 30 C 60 30, 80 10, 160 10" dInternational="M10 30 C 60 30, 80 50, 160 50" width={180} height={60} className={styles.storyRoute} />
          <p className={styles.story}>{t('about.story')}</p>
        </div>
      </section>

      <section className={styles.missionSection}>
        <div className={styles.sectionInner}>
          <div className={styles.missionCard}>
            <h2>{t('about.missionTitle')}</h2>
            <p>{t('about.mission')}</p>
          </div>
        </div>
      </section>

      <section className={styles.statsSection}>
        <div className={styles.sectionInner}>
          <div className={styles.statsGrid}>
            <StatCounter value={18} suffix="+" label="Years routing" />
            <StatCounter value={42000} suffix="+" label="Travelers" />
            <StatCounter value={120} suffix="+" label="Routes" />
            <StatCounter value={9} label="Cities with local teams" />
          </div>
        </div>
      </section>

      <section className={styles.teamSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.teamTitle}>{t('about.teamTitle')}</h2>
          <div className={styles.teamGrid}>
            {TEAM.map((member) => (
              <div key={member.id} className={styles.teamCard}>
                <img src={avatarUrl(member.avatarImg)} alt={member.name} className={styles.teamAvatar} />
                <span className={styles.teamName}>{member.name}</span>
                <span className={styles.teamRole}>{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
