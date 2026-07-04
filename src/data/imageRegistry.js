// The data layer is stored as plain .json (so it can later be swapped for a
// real backend response with no shape changes), but bundled local photos
// still need a real JS `import` for Vite to process them — JSON can't do
// that. This registry is the one place that bridges the two: JSON entries
// reference a photo by this map's string keys instead of a file path.
import franceHero from '../assets/pics/France/france_1.jpg';
import uaeHero from '../assets/pics/UAE/uae_1.jpg';
import germanyHero from '../assets/pics/Germany/germany_1.jpg';
import germanyGate from '../assets/pics/Germany/germany_2.jpg';
import koreaHero from '../assets/pics/Korea/korea_1.jpg';
import koreaSkyline from '../assets/pics/Korea/korea_2.jpg';
import japanTorii from '../assets/pics/Japan/japan_2.jpg';
import japanShibuya from '../assets/pics/Japan/japan_3.jpg';
import uzbekistanMountain from '../assets/pics/Uzbekistan/photo_1_2026-06-30_15-23-57.jpg';

const imageRegistry = {
  'france-1': franceHero,
  'uae-1': uaeHero,
  'germany-1': germanyHero,
  'germany-2': germanyGate,
  'korea-1': koreaHero,
  'korea-2': koreaSkyline,
  'japan-2': japanTorii,
  'japan-3': japanShibuya,
  'uzbekistan-1': uzbekistanMountain,
};

// `imageKey` resolves to a bundled local photo; falling back to `imageUrl`
// covers entries that intentionally use a placeholder photo service instead.
export function resolveImage(entry) {
  if (entry.imageKey) return imageRegistry[entry.imageKey];
  return entry.imageUrl;
}

export default imageRegistry;
