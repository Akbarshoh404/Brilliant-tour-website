// Shared with FilterDrawer and the mobile FilterOpenerButton so the active
// filter count badge always matches what the drawer itself would show.
export function countActiveFilters(filters) {
  let n = 0;
  if (filters.countrySlug) n++;
  if (filters.priceMin != null || filters.priceMax != null) n++;
  if (filters.durationBucket) n++;
  if (filters.season) n++;
  if (filters.tags?.length) n += filters.tags.length;
  if (filters.visaRequirement) n++;
  if (filters.hotelCategoryKeyword) n++;
  if (filters.transportation) n++;
  if (filters.activityKeyword) n++;
  if (filters.packageLevel) n++;
  if (filters.tourLanguage) n++;
  if (filters.groupSize) n++;
  return n;
}
