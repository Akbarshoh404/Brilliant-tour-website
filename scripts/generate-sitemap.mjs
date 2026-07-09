// Generates public/sitemap.xml at build time from the static routes plus
// the dynamic slugs in src/data (countries/cities/categories/offers).
//
// offers.js isn't JSON (it imports bundled image assets, see src/data),
// so its slugs are pulled with a regex instead of importing the module —
// this script runs under plain Node, outside Vite's module graph.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(fileURLToPath(new URL(".", import.meta.url)));
const dataDir = path.join(rootDir, "src/data");
const SITE_URL = (
  process.env.VITE_SITE_URL || "https://brillianttour.uz"
).replace(/\/$/, "");

const countries = JSON.parse(
  readFileSync(path.join(dataDir, "countries.json"), "utf8"),
);
const cities = JSON.parse(
  readFileSync(path.join(dataDir, "cities.json"), "utf8"),
);
const categories = JSON.parse(
  readFileSync(path.join(dataDir, "categories.json"), "utf8"),
);

const offersSource = readFileSync(path.join(dataDir, "offers.js"), "utf8");
const offerSlugs = [...offersSource.matchAll(/slug:\s*"([^"]+)"/g)].map(
  (m) => m[1],
);

const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/international", priority: "0.9", changefreq: "daily" },
  { path: "/domestic", priority: "0.9", changefreq: "daily" },
  { path: "/visas", priority: "0.8", changefreq: "weekly" },
  { path: "/business", priority: "0.7", changefreq: "monthly" },
  { path: "/about", priority: "0.5", changefreq: "monthly" },
  { path: "/contact", priority: "0.5", changefreq: "monthly" },
];

const dynamicRoutes = [
  ...countries.map((c) => ({
    path: `/international/${c.slug}`,
    priority: "0.8",
    changefreq: "weekly",
  })),
  ...cities.map((c) => ({
    path: `/international/${c.countrySlug}/${c.slug}`,
    priority: "0.7",
    changefreq: "weekly",
  })),
  ...categories.map((c) => ({
    path: `/domestic/${c.slug}`,
    priority: "0.8",
    changefreq: "weekly",
  })),
  ...offerSlugs.map((slug) => ({
    path: `/tours/${slug}`,
    priority: "0.7",
    changefreq: "weekly",
  })),
];

const allRoutes = [...staticRoutes, ...dynamicRoutes];
const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync(path.join(rootDir, "public/sitemap.xml"), xml);
console.log(`sitemap.xml written with ${allRoutes.length} URLs`);
