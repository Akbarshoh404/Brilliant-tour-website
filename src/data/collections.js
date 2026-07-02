import { img } from './images';

// Themed landing pages — /collections/:tag — reuse the catalog grid + filters,
// each offer is tagged with one or more of these tags in offers.js.
const collections = [
  {
    tag: 'luxury',
    name: { en: 'Luxury', ru: 'Люкс', uz: 'Lyuks' },
    heroImage: img('luxury-resort-suite', 1920, 900),
    intro: {
      en: 'Five-star stays, private guides and a route planned around comfort, not compromise.',
      ru: 'Пятизвёздочные отели, частные гиды и маршрут, построенный вокруг комфорта, а не компромиссов.',
      uz: 'Besh yulduzli mehmonxonalar, shaxsiy gidlar va kelishuvga emas, qulaylikka asoslangan marshrut.',
    },
  },
  {
    tag: 'budget',
    name: { en: 'Budget', ru: 'Бюджет', uz: 'Byudjet' },
    heroImage: img('budget-backpacker-trail', 1920, 900),
    intro: {
      en: 'The same routes, planned to cost less without seeing less.',
      ru: 'Те же маршруты, но дешевле — без потери впечатлений.',
      uz: 'Xuddi shu marshrutlar, kamroq taassurot emas, kamroq xarajat bilan rejalashtirilgan.',
    },
  },
  {
    tag: 'group',
    name: { en: 'Group', ru: 'Групповой', uz: 'Guruhli' },
    heroImage: img('group-travel-caravan', 1920, 900),
    intro: {
      en: 'Shared departures, split costs, and a guide who keeps the whole group moving.',
      ru: 'Совместные выезды, разделённые расходы и гид, который держит группу в темпе.',
      uz: 'Birgalikdagi jo‘nashlar, bo‘lingan xarajatlar va guruhni harakatda ushlab turuvchi gid.',
    },
  },
  {
    tag: 'family',
    name: { en: 'Family', ru: 'Семейный', uz: 'Oilaviy' },
    heroImage: img('family-travel-kids', 1920, 900),
    intro: {
      en: 'Built around nap schedules, picky eaters, and the questions kids actually ask.',
      ru: 'Спланировано с учётом тихого часа, разборчивых в еде детей и их настоящих вопросов.',
      uz: 'Uxlash jadvali, tanlab ovqatlanadigan bolalar va ularning haqiqiy savollariga moslab tuzilgan.',
    },
  },
  {
    tag: 'honeymoon',
    name: { en: 'Honeymoon', ru: 'Медовый месяц', uz: 'Asal oyi' },
    heroImage: img('honeymoon-sunset-couple', 1920, 900),
    intro: {
      en: 'Quiet rooms, private dinners, and routes with nowhere you have to be on time.',
      ru: 'Тихие номера, частные ужины и маршруты без жёстких графиков.',
      uz: 'Sokin xonalar, xususiy kechki ovqatlar va vaqtga qat’iy bog‘liq bo‘lmagan marshrutlar.',
    },
  },
  {
    tag: 'business',
    name: { en: 'Business', ru: 'Бизнес', uz: 'Biznes' },
    heroImage: img('business-travel-skyline', 1920, 900),
    intro: {
      en: 'Efficient transfers, reliable wifi, and evenings still worth having.',
      ru: 'Чёткие трансферы, надёжный wifi и вечера, которые всё ещё стоит провести красиво.',
      uz: 'Aniq transferlar, ishonchli wifi va hali ham qadrli kechqurunlar.',
    },
  },
  {
    tag: 'cruise',
    name: { en: 'Cruise', ru: 'Круиз', uz: 'Kruiz' },
    heroImage: img('cruise-ship-deck-ocean', 1920, 900),
    intro: {
      en: 'River routes through history and open-sea voyages beyond it.',
      ru: 'Речные маршруты сквозь историю и морские путешествия за её пределы.',
      uz: 'Tarix bo‘ylab daryo marshrutlari va undan tashqaridagi dengiz sayohatlari.',
    },
  },
  {
    tag: 'religious',
    name: { en: 'Religious', ru: 'Религиозный туризм', uz: 'Diniy turizm' },
    heroImage: img('religious-mosque-architecture', 1920, 900),
    intro: {
      en: 'Pilgrimage routes and sacred architecture, guided with the context they deserve.',
      ru: 'Паломнические маршруты и священная архитектура с подобающим историческим контекстом.',
      uz: 'Ziyorat marshrutlari va muqaddas me’morchilik, munosib tarixiy izoh bilan.',
    },
  },
  {
    tag: 'custom-private',
    name: { en: 'Custom & Private', ru: 'Индивидуальный тур', uz: 'Individual tur' },
    heroImage: img('private-guide-custom-route', 1920, 900),
    intro: {
      en: 'Tell us the shape of the trip — we build the route around it.',
      ru: 'Расскажите, каким должно быть путешествие, — мы выстроим маршрут вокруг этого.',
      uz: 'Sayohat qanday bo‘lishini ayting — biz marshrutni shunga moslab quramiz.',
    },
  },
];

export default collections;
