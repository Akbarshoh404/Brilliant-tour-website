const LOCALE_BY_LANG = { en: 'en-US', ru: 'ru-RU', uz: 'uz-UZ' };

export function formatPrice(amount, currency = 'USD', lang = 'en') {
  try {
    return new Intl.NumberFormat(LOCALE_BY_LANG[lang] ?? 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount)}`;
  }
}

export function applyPriceModifier(basePrice, modifier) {
  return Math.round(basePrice * (1 + modifier));
}
