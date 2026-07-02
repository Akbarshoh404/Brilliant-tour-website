import { img } from './images';
import mountainHero from '../assets/pics/Uzbekistan/photo_1_2026-06-30_15-23-57.jpg';

// Domestic Uzbekistan tourism categories — /domestic/:categorySlug
const categories = [
  {
    slug: 'historical',
    name: { en: 'Historical', ru: 'Исторический', uz: 'Tarixiy' },
    heroImage: img('samarkand-registan-historical', 1600, 900),
    description: {
      en: 'Madrasas, mausoleums and city walls that carried the Silk Road for a thousand years.',
      ru: 'Медресе, мавзолеи и крепостные стены, тысячу лет несущие на себе Шёлковый путь.',
      uz: 'Ming yil davomida Ipak yo‘lini ko‘targan madrasalar, maqbaralar va shahar devorlari.',
    },
  },
  {
    slug: 'weekend',
    name: { en: 'Weekend', ru: 'Выходные', uz: 'Dam olish kunlari' },
    heroImage: img('khiva-weekend-gateway', 1600, 900),
    description: {
      en: 'Short routes that fit between a Friday flight and a Monday morning.',
      ru: 'Короткие маршруты, умещающиеся между пятничным рейсом и утром понедельника.',
      uz: 'Juma kuni parvozi va dushanba ertalabi orasiga sig‘adigan qisqa marshrutlar.',
    },
  },
  {
    slug: 'cultural',
    name: { en: 'Cultural', ru: 'Культурный', uz: 'Madaniy' },
    heroImage: img('tashkent-cultural-metro', 1600, 900),
    description: {
      en: 'Workshops, bazaars and living crafts — from miniature painting to silk weaving.',
      ru: 'Мастер-классы, базары и живые ремёсла — от миниатюры до шёлкоткачества.',
      uz: 'Miniatyura chizishdan ipak to‘qishgacha — ustaxonalar, bozorlar va tirik hunarmandchilik.',
    },
  },
  {
    slug: 'mountain',
    name: { en: 'Mountain', ru: 'Горы', uz: 'Tog\'' },
    heroImage: mountainHero,
    description: {
      en: 'The Tian Shan and Pamir foothills, an hour outside the capital.',
      ru: 'Предгорья Тянь-Шаня и Памира, в часе от столицы.',
      uz: 'Poytaxtdan bir soat masofadagi Tyan-Shan va Pomir tog‘ etaklari.',
    },
  },
  {
    slug: 'desert',
    name: { en: 'Desert', ru: 'Пустыня', uz: 'Cho\'l' },
    heroImage: img('kyzylkum-desert-dunes', 1600, 900),
    description: {
      en: 'Kyzylkum dunes by camel and 4x4, yurt camps, and a sky with no city light in it.',
      ru: 'Дюны Кызылкума на верблюдах и внедорожниках, юрточные лагеря и небо без городских огней.',
      uz: 'Tuyada va yo‘ltanlamasda Qizilqum qumtepalari, yurta lagerlari va shahar chiroqlarisiz osmon.',
    },
  },
  {
    slug: 'family',
    name: { en: 'Family', ru: 'Семейный', uz: 'Oilaviy' },
    heroImage: img('fergana-valley-family', 1600, 900),
    description: {
      en: 'Easy paces, kid-friendly stops and routes built around a family\'s actual schedule.',
      ru: 'Спокойный темп, остановки для детей и маршруты, выстроенные под реальный график семьи.',
      uz: 'Sokin sur’at, bolalar uchun qulay to‘xtashlar va oilaning haqiqiy jadvaliga mos marshrutlar.',
    },
  },
  {
    slug: 'group',
    name: { en: 'Group', ru: 'Групповой', uz: 'Guruhli' },
    heroImage: img('tashkent-samarkand-group-tour', 1600, 900),
    description: {
      en: 'Shared departures for travelers who\'d rather split the road with company.',
      ru: 'Совместные выезды для тех, кто предпочитает делить дорогу с компанией.',
      uz: 'Yo‘lni hamrohlik bilan baham ko‘rishni afzal ko‘radigan sayohatchilar uchun birgalikdagi jo‘nashlar.',
    },
  },
  {
    slug: 'premium',
    name: { en: 'Premium local', ru: 'Премиум локально', uz: 'Mahalliy premium' },
    heroImage: img('samarkand-premium-silk-road', 1600, 900),
    description: {
      en: 'Private guides, boutique riads and a slower, more deliberate route through the same cities.',
      ru: 'Частные гиды, бутик-отели и более неспешный, продуманный маршрут по тем же городам.',
      uz: 'Shaxsiy gidlar, butik mehmonxonalar va o‘sha shaharlar bo‘ylab sekinroq, o‘ylangan marshrut.',
    },
  },
  {
    slug: 'seasonal',
    name: { en: 'Seasonal', ru: 'Сезонный', uz: 'Mavsumiy' },
    heroImage: img('uzbekistan-navruz-festival', 1600, 900),
    description: {
      en: 'Navruz, pomegranate harvest, and the handful of weeks each year worth timing a trip around.',
      ru: 'Навруз, сбор урожая граната и те несколько недель в году, ради которых стоит спланировать поездку.',
      uz: 'Navro‘z, anor hosili va sayohatni shu atrofida rejalashtirishga arziydigan yiliga bir necha hafta.',
    },
  },
];

export default categories;
