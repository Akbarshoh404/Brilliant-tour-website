// Central SEO constants. SITE_URL should be overridden with the real
// production .uz domain via the VITE_SITE_URL env var on Vercel; the
// fallback here only matters for local dev/preview builds.
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || "https://brillianttour.uz"
).replace(/\/$/, "");
export const SITE_NAME = "Brilliant Tourism";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-cover.jpg`;
export const DEFAULT_LOCALE = "ru_RU";
export const TWITTER_HANDLE = "@brillianttours_uz";
