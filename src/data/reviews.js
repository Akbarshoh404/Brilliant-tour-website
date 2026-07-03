import { avatarUrl } from "./images";

// A shared pool of sample reviews. Each offer draws a deterministic subset
// (by id) so the same offer always shows the same reviews, without needing
// per-offer review data.
const REVIEW_POOL = [
  {
    name: "Aziza Karimova",
    avatarImg: 47,
    rating: 5,
    daysAgo: 9,
    comment: {
      en: "Everything was arranged exactly as promised — the guide was punctual, knowledgeable, and genuinely warm. Worth every som.",
      ru: "Всё было организовано точно как обещано — гид был пунктуальным, знающим и по-настоящему тёплым. Каждый сум оправдан.",
      uz: "Hammasi va’da qilinganidek tashkil qilindi — gid vaqtida keldi, bilimdon va samimiy edi. Har bir so‘miga arziydi.",
    },
  },
  {
    name: "James Whitfield",
    avatarImg: 22,
    rating: 5,
    daysAgo: 21,
    comment: {
      en: "Booked this after a friend recommended Brilliant. The itinerary paced itself perfectly — never rushed, never idle.",
      ru: "Забронировал после того, как друг порекомендовал Brilliant. Маршрут был выстроен идеально — без спешки и без простоя.",
      uz: "Do‘stim Brilliant’ni tavsiya qilgandan so‘ng band qildim. Marshrut mukammal — na shoshqaloqlik, na bo‘sh vaqt.",
    },
  },
  {
    name: "Dilnoza Yusupova",
    avatarImg: 36,
    rating: 4,
    daysAgo: 34,
    comment: {
      en: "Hotel was a small step down from the photos, but the guide and the route more than made up for it. Would book again.",
      ru: "Отель оказался чуть скромнее, чем на фото, но гид и маршрут это с лихвой компенсировали. Забронировала бы снова.",
      uz: "Mehmonxona suratlardagidan biroz oddiyroq edi, ammo gid va marshrut buni to‘ldirdi. Yana band qilardim.",
    },
  },
  {
    name: "Sarah Lindqvist",
    avatarImg: 28,
    rating: 5,
    daysAgo: 6,
    comment: {
      en: "The kind of trip that's hard to plan yourself — local access, good timing, zero logistics stress on our side.",
      ru: "Это тур, который сложно спланировать самому — местный доступ, точный тайминг и никакой логистической головной боли.",
      uz: "O‘zingiz rejalashtirishi qiyin bo‘lgan sayohat — mahalliy imkoniyatlar, aniq vaqt va logistika bilan bosh og‘rig‘i yo‘q.",
    },
  },
  {
    name: "Otabek Yusupov",
    avatarImg: 13,
    rating: 5,
    daysAgo: 48,
    comment: {
      en: "Second time booking with Brilliant and the standard hasn't dropped at all. Premium tier is genuinely worth the upgrade.",
      ru: "Второй раз бронирую у Brilliant, и уровень нисколько не упал. Премиум-уровень действительно стоит доплаты.",
      uz: "Brilliant’da ikkinchi marta band qildim, sifat asti pasaymadi. Premium daraja haqiqatan ham arziydi.",
    },
  },
  {
    name: "Farrukh Aliyev",
    avatarImg: 19,
    rating: 4,
    daysAgo: 63,
    comment: {
      en: "Good value for the price, especially the economy package. A couple of transfer times ran late, nothing major.",
      ru: "Хорошее соотношение цены и качества, особенно эконом-пакет. Пара трансферов задержалась, но некритично.",
      uz: "Narxiga nisbatan yaxshi, ayniqsa ekonom paket. Bir-ikki transfer kechikdi, lekin jiddiy emas.",
    },
  },
  {
    name: "Elena Petrova",
    avatarImg: 44,
    rating: 5,
    daysAgo: 15,
    comment: {
      en: "Booked as a solo traveler and never once felt like an afterthought. The support team answered every question within hours.",
      ru: "Путешествовала одна и ни разу не почувствовала себя «довеском». Служба поддержки отвечала на все вопросы за считанные часы.",
      uz: "Yolg‘iz sayohat qildim va bir marta ham e’tibordan chetda qolganday sezmadim. Qo‘llab-quvvatlash xizmati barcha savollarga soatlar ichida javob berdi.",
    },
  },
  {
    name: "Michael Osei",
    avatarImg: 51,
    rating: 3,
    daysAgo: 77,
    comment: {
      en: "Solid trip overall. The pace was a little fast for us on day two, but the guide adjusted once we said something.",
      ru: "В целом хорошая поездка. На второй день темп был для нас великоват, но гид скорректировал его, как только мы сказали.",
      uz: "Umuman olganda yaxshi sayohat. Ikkinchi kuni sur’at bizga biroz tez edi, lekin aytishimiz bilan gid moslashtirdi.",
    },
  },
];

export function getReviewsForOffer(offer, count = 4) {
  const seed = [...offer.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const start = seed % REVIEW_POOL.length;
  const rotated = [...REVIEW_POOL.slice(start), ...REVIEW_POOL.slice(0, start)];
  const now = Date.now();
  return rotated.slice(0, count).map((r, i) => ({
    id: `${offer.id}-review-${i}`,
    name: r.name,
    avatar: avatarUrl(r.avatarImg),
    rating: r.rating,
    comment: r.comment,
    date: new Date(now - r.daysAgo * 86400000).toISOString().slice(0, 10),
  }));
}
