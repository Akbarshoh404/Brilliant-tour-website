import { img } from './images';
import franceHero from '../assets/pics/France/france_1.jpg';
import uaeHero from '../assets/pics/UAE/uae_1.jpg';
import germanyHero from '../assets/pics/Germany/germany_1.jpg';
import koreaHero from '../assets/pics/Korea/korea_1.jpg';
import japanHero from '../assets/pics/Japan/japan_2.jpg';

const countries = [
  {
    id: 'fr',
    slug: 'france',
    name: { en: 'France', ru: 'Франция', uz: 'Fransiya' },
    region: 'Europe',
    heroImage: franceHero,
    description: {
      en: 'Romance, riviera light and centuries of art along the Seine and the Mediterranean coast.',
      ru: 'Романтика, свет Лазурного берега и века искусства вдоль Сены и Средиземноморья.',
      uz: 'Sena daryosi va O’rta yer dengizi sohili bo‘ylab romantika, yorug‘lik va asrlar davomidagi san’at.',
    },
    visaRequirement: 'eVisa',
    bestSeason: { en: 'April – June, September – October', ru: 'Апрель – июнь, сентябрь – октябрь', uz: 'Aprel – iyun, sentabr – oktabr' },
  },
  {
    id: 'ae',
    slug: 'uae',
    name: { en: 'United Arab Emirates', ru: 'ОАЭ', uz: 'Birlashgan Arab Amirliklari' },
    region: 'Middle East',
    heroImage: uaeHero,
    description: {
      en: 'Glass towers, desert dunes and a coastline built for a different idea of luxury.',
      ru: 'Стеклянные башни, песчаные дюны и побережье для совершенно иного представления о роскоши.',
      uz: 'Shisha minoralar, cho‘l qumtepalari va boshqacha hashamat tushunchasi uchun qurilgan sohil.',
    },
    visaRequirement: 'visa-free',
    bestSeason: { en: 'November – March', ru: 'Ноябрь – март', uz: 'Noyabr – mart' },
  },
  {
    id: 'mv',
    slug: 'maldives',
    name: { en: 'Maldives', ru: 'Мальдивы', uz: 'Maldiv orollari' },
    region: 'Asia',
    heroImage: img('maldives-overwater-villas', 1920, 1000),
    description: {
      en: 'Overwater villas, glass-clear lagoons, and a horizon with nothing on it but water.',
      ru: 'Виллы над водой, прозрачные лагуны и горизонт, где нет ничего, кроме воды.',
      uz: 'Suv ustidagi villalar, tiniq laguna va ufqda faqat suvdan boshqa narsa yo‘q.',
    },
    visaRequirement: 'visa-free',
    bestSeason: { en: 'December – April', ru: 'Декабрь – апрель', uz: 'Dekabr – aprel' },
  },
  {
    id: 'ch',
    slug: 'switzerland',
    name: { en: 'Switzerland', ru: 'Швейцария', uz: 'Shveytsariya' },
    region: 'Europe',
    heroImage: img('swiss-alps-mountains-lake', 1920, 1000),
    description: {
      en: 'Glacier peaks, cobalt lakes and railways that climb higher than the clouds.',
      ru: 'Ледниковые вершины, кобальтовые озёра и железные дороги, поднимающиеся выше облаков.',
      uz: 'Muzlik cho‘qqilari, ko‘k ko‘llar va bulutlardan ham balandga ko‘tariladigan temir yo‘llar.',
    },
    visaRequirement: 'visa-required',
    bestSeason: { en: 'June – September, December – March', ru: 'Июнь – сентябрь, декабрь – март', uz: 'Iyun – sentabr, dekabr – mart' },
  },
  {
    id: 'tr',
    slug: 'turkey',
    name: { en: 'Türkiye', ru: 'Турция', uz: 'Turkiya' },
    region: 'Middle East',
    heroImage: img('istanbul-mosque-skyline', 1920, 1000),
    description: {
      en: 'Where two continents meet — domed skylines, balloon-lit valleys, and bazaars that never close.',
      ru: 'Где встречаются два континента — купольные силуэты, долины в свете воздушных шаров и базары, которые никогда не закрываются.',
      uz: 'Ikki qit’a tutashgan joy — gumbazli shahar siluetlari, sharlar yorug‘idagi vodiylar va hech qachon yopilmaydigan bozorlar.',
    },
    visaRequirement: 'eVisa',
    bestSeason: { en: 'April – May, September – November', ru: 'Апрель – май, сентябрь – ноябрь', uz: 'Aprel – may, sentabr – noyabr' },
  },
  {
    id: 'de',
    slug: 'germany',
    name: { en: 'Germany', ru: 'Германия', uz: 'Germaniya' },
    region: 'Europe',
    heroImage: germanyHero,
    description: {
      en: 'Fairy-tale castles, riverside vineyards and cities that mix medieval streets with modern skylines.',
      ru: 'Сказочные замки, прибрежные виноградники и города, где средневековые улицы соседствуют с современными небоскрёбами.',
      uz: 'Ertak qal’alari, daryo bo‘yidagi uzumzorlar va o‘rta asr ko‘chalari zamonaviy shahar siluetlari bilan uyg‘unlashgan shaharlar.',
    },
    visaRequirement: 'eVisa',
    bestSeason: { en: 'May – September, December (Christmas markets)', ru: 'Май – сентябрь, декабрь (рождественские ярмарки)', uz: 'May – sentabr, dekabr (Rojdestvo bozorlari)' },
  },
  {
    id: 'kr',
    slug: 'korea',
    name: { en: 'South Korea', ru: 'Южная Корея', uz: 'Janubiy Koreya' },
    region: 'Asia',
    heroImage: koreaHero,
    description: {
      en: 'Palace courtyards, neon skylines and coastlines where centuries-old tradition sits beside hyper-modern cities.',
      ru: 'Дворцовые дворы, неоновые небоскрёбы и побережья, где вековые традиции соседствуют с ультрасовременными городами.',
      uz: 'Saroy hovlilari, neon shahar siluetlari va asrlar davomidagi an’analar zamonaviy shaharlar bilan yonma-yon turgan sohillar.',
    },
    visaRequirement: 'eVisa',
    bestSeason: { en: 'March – May, September – November', ru: 'Март – май, сентябрь – ноябрь', uz: 'Mart – may, sentabr – noyabr' },
  },
  {
    id: 'jp',
    slug: 'japan',
    name: { en: 'Japan', ru: 'Япония', uz: 'Yaponiya' },
    region: 'Asia',
    heroImage: japanHero,
    description: {
      en: 'Red torii gates, bamboo groves and a snow-capped Fuji watching over it all.',
      ru: 'Красные ворота тории, бамбуковые рощи и заснеженная Фудзи, возвышающаяся над всем этим.',
      uz: 'Qizil torii darvozalari, bambuk o‘rmonlari va bularning barchasini kuzatib turgan qorli Fudziyama.',
    },
    visaRequirement: 'eVisa',
    bestSeason: { en: 'March – May, October – November', ru: 'Март – май, октябрь – ноябрь', uz: 'Mart – may, oktabr – noyabr' },
  },
];

export default countries;
