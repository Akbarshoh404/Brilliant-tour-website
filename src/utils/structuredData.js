import { SITE_URL, SITE_NAME } from '../config/seo';

// Rendered once, site-wide (in App.jsx), so every page's crawl carries the
// business identity/contact graph without repeating it per-page.
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['TravelAgency', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    image: `${SITE_URL}/og-cover.jpg`,
    telephone: '+998332990000',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'UZ',
      addressLocality: 'Tashkent',
    },
    sameAs: [
      'https://instagram.com/brillianttours_uz',
      'https://t.me/brillianttours_uz',
    ],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: 'ru',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/international?query={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

// `items`: [{ label, to }] — same shape the Breadcrumbs component takes.
export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.to ? { item: `${SITE_URL}${item.to}` } : {}),
    })),
  };
}

// `offer`: an entry from data/offers.js; `title`/`description` pre-localized strings.
export function touristTripSchema(offer, title, description, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: title,
    description,
    url,
    image: offer.images,
    offers: {
      '@type': 'Offer',
      price: offer.basePrice,
      priceCurrency: offer.currency,
      availability: 'https://schema.org/InStock',
      url,
    },
    ...(offer.reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: offer.rating,
            reviewCount: offer.reviewCount,
          },
        }
      : {}),
  };
}

// `faqs`: [{ question, answer }] (plain strings — strip markup before passing).
export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}
