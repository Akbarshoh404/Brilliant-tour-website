import { img } from './images';

const cities = [
  { id: 'paris', slug: 'paris', countrySlug: 'france', name: { en: 'Paris', ru: 'Париж', uz: 'Parij' }, heroImage: img('paris-louvre-evening', 1600, 900) },
  { id: 'nice', slug: 'nice', countrySlug: 'france', name: { en: 'Nice', ru: 'Ницца', uz: 'Nitssa' }, heroImage: img('nice-riviera-coast', 1600, 900) },
  { id: 'dubai', slug: 'dubai', countrySlug: 'uae', name: { en: 'Dubai', ru: 'Дубай', uz: 'Dubay' }, heroImage: img('dubai-marina-night', 1600, 900) },
  { id: 'abu-dhabi', slug: 'abu-dhabi', countrySlug: 'uae', name: { en: 'Abu Dhabi', ru: 'Абу-Даби', uz: 'Abu-Dabi' }, heroImage: img('abu-dhabi-grand-mosque', 1600, 900) },
  { id: 'male', slug: 'male', countrySlug: 'maldives', name: { en: 'Malé Atoll', ru: 'Атолл Мале', uz: 'Male atolli' }, heroImage: img('maldives-lagoon-aerial', 1600, 900) },
  { id: 'zurich', slug: 'zurich', countrySlug: 'switzerland', name: { en: 'Zurich', ru: 'Цюрих', uz: 'Sityurix' }, heroImage: img('zurich-lake-city', 1600, 900) },
  { id: 'interlaken', slug: 'interlaken', countrySlug: 'switzerland', name: { en: 'Interlaken', ru: 'Интерлакен', uz: 'Interlaken' }, heroImage: img('interlaken-alps-valley', 1600, 900) },
  { id: 'istanbul', slug: 'istanbul', countrySlug: 'turkey', name: { en: 'Istanbul', ru: 'Стамбул', uz: 'Istanbul' }, heroImage: img('istanbul-bosphorus-bridge', 1600, 900) },
  { id: 'cappadocia', slug: 'cappadocia', countrySlug: 'turkey', name: { en: 'Cappadocia', ru: 'Каппадокия', uz: 'Kappadokiya' }, heroImage: img('cappadocia-balloons-sunrise', 1600, 900) },
];

export default cities;
