// Raw data lives in countries.json (backend-ready — swapping this file for
// a fetch() later needs no changes anywhere else) — this loader only
// resolves each entry's photo via the image registry.
import raw from './countries.json';
import { resolveImage } from './imageRegistry';

const countries = raw.map((c) => ({ ...c, heroImage: resolveImage(c) }));

export default countries;
