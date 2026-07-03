// Central placeholder-image builder. Swapping in real photography later is a
// one-line change per call site — nothing else in the codebase touches URLs.
export const img = (seed, width, height) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;

export const avatarUrl = (n, size = 100) => `https://i.pravatar.cc/${size}?img=${n}`;
