import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, DEFAULT_LOCALE, TWITTER_HANDLE } from '../../config/seo';

// Single source of truth for per-page <head> metadata: title, description,
// canonical, robots, Open Graph, Twitter Card, and optional JSON-LD blocks.
// Every route should render one of these instead of hand-rolling <Helmet>,
// so canonical/OG defaults stay consistent site-wide.
export default function Seo({
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  noindex = false,
  jsonLd,
  type = 'website',
}) {
  const { pathname } = useLocation();
  const canonical = `${SITE_URL}${pathname === '/' ? '' : pathname.replace(/\/$/, '')}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const schemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={DEFAULT_LOCALE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
