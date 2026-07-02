// Reads a `{ en, ru, uz }` shaped field for the active i18next language,
// falling back to English if a translation is missing.
export function getLocalizedField(field, lang) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] ?? field.en ?? '';
}
