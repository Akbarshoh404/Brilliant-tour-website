// Visa service catalogue — countries we handle visa applications for.
// Raw data lives in visaCountries.json (backend-ready). `visaTypeKey`/
// `requirementKeys` reference shared, translated labels (see i18n
// `visas.types` / `visas.req`) instead of per-country prose, so the same
// handful of translated strings covers every country.
import visaCountries from './visaCountries.json';

export default visaCountries;
