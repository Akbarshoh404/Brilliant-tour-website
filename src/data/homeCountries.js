import countries from './countries';
import uzbekistanImage from '../assets/pics/Uzbekistan/photo_1_2026-06-30_15-23-57.jpg';

const countryBySlug = Object.fromEntries(countries.map((c) => [c.slug, c]));

// Curated countries shown on the Home page — Uzbekistan first, then the
// international countries with real (non-placeholder) photography.
const homeCountries = [
  {
    slug: 'uzbekistan',
    name: { en: 'Uzbekistan', ru: 'Узбекистан', uz: 'O‘zbekiston' },
    image: uzbekistanImage,
    to: '/domestic',
  },
  ...['uae', 'france', 'germany', 'korea', 'japan'].map((slug) => {
    const c = countryBySlug[slug];
    return { slug, name: c.name, image: c.heroImage, to: `/international/${slug}` };
  }),
];

export default homeCountries;
