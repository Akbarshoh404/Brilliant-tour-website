// Raw data lives in cities.json (backend-ready) — this loader only resolves
// each entry's photo via the image registry.
import raw from './cities.json';
import { resolveImage } from './imageRegistry';

const cities = raw.map((c) => ({ ...c, heroImage: resolveImage(c) }));

export default cities;
