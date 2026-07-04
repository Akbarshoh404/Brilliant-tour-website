// Domestic Uzbekistan tourism categories — /domestic/:categorySlug.
// Raw data lives in categories.json (backend-ready) — this loader only
// resolves each entry's photo via the image registry.
import raw from './categories.json';
import { resolveImage } from './imageRegistry';

const categories = raw.map((c) => ({ ...c, heroImage: resolveImage(c) }));

export default categories;
