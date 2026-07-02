import { useMemo } from 'react';
import { getLocalizedField } from '../utils/getLocalizedField';
import countries from '../data/countries';

const countryBySlug = Object.fromEntries(countries.map((c) => [c.slug, c]));

function durationBucket(days) {
  if (days <= 3) return 'short';
  if (days <= 6) return 'medium';
  return 'long';
}

function seasonOfDate(dateStr) {
  const month = new Date(dateStr).getMonth(); // 0-11
  if ([11, 0, 1].includes(month)) return 'winter';
  if ([2, 3, 4].includes(month)) return 'spring';
  if ([5, 6, 7].includes(month)) return 'summer';
  return 'autumn';
}

// Filters/sorts the offer catalog. Facets backed by real Offer fields filter
// for real; a few FilterDrawer facets (tour language, group size) have no
// corresponding field in the mock data model and are intentionally left as
// display-only controls rather than faked.
export default function useFilteredOffers(offers, filters = {}, sortBy = 'popular', lang = 'en') {
  return useMemo(() => {
    const {
      query = '',
      type = null,
      countrySlug = null,
      categorySlug = null,
      tags = [],
      priceMin = null,
      priceMax = null,
      durationBucket: durationFilter = null,
      travelLevel = null,
      visaRequirement = null,
      transportation = null,
      season = null,
      specialOffersOnly = false,
      hotelCategoryKeyword = null,
      activityKeyword = null,
    } = filters;

    let result = offers.filter((offer) => {
      if (type && offer.type !== type) return false;
      if (countrySlug && offer.country !== countrySlug) return false;
      if (categorySlug && offer.categorySlug !== categorySlug) return false;
      if (tags.length && !tags.some((t) => offer.tags.includes(t))) return false;
      if (priceMin != null && offer.basePrice < priceMin) return false;
      if (priceMax != null && offer.basePrice > priceMax) return false;
      if (durationFilter && durationBucket(offer.duration.days) !== durationFilter) return false;
      if (travelLevel && offer.travelLevel !== travelLevel) return false;
      if (specialOffersOnly && !offer.isSpecialOffer) return false;
      if (visaRequirement) {
        const country = offer.country ? countryBySlug[offer.country] : null;
        if (!country || country.visaRequirement !== visaRequirement) return false;
      }
      if (transportation && !offer.packages.some((p) => p.transfer === transportation)) return false;
      if (season && !offer.availableDates.some((d) => seasonOfDate(d.date) === season)) return false;
      if (hotelCategoryKeyword && !offer.packages.some((p) => p.hotelCategory.includes(hotelCategoryKeyword))) return false;
      if (activityKeyword && !offer.includedServices.en.some((s) => s.toLowerCase().includes(activityKeyword.toLowerCase()))) return false;

      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const title = getLocalizedField(offer.title, lang).toLowerCase();
        const desc = getLocalizedField(offer.description, lang).toLowerCase();
        if (!title.includes(q) && !desc.includes(q)) return false;
      }

      return true;
    });

    const sorters = {
      popular: (a, b) => b.reviewCount - a.reviewCount,
      recommended: (a, b) => b.rating - a.rating,
      priceLow: (a, b) => a.basePrice - b.basePrice,
      priceHigh: (a, b) => b.basePrice - a.basePrice,
      premiumFirst: (a, b) => b.basePrice - a.basePrice,
      shortest: (a, b) => a.duration.days - b.duration.days,
      newest: (a, b) => offers.indexOf(b) - offers.indexOf(a),
      rated: (a, b) => b.rating - a.rating,
    };

    const sorter = sorters[sortBy] ?? sorters.popular;
    return [...result].sort(sorter);
  }, [offers, filters, sortBy, lang]);
}
