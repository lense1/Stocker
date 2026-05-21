const REVIEW_PRESETS = [
  { rating: 4.8, reviewCount: 28 },
  { rating: 4.7, reviewCount: 26 },
  { rating: 4.6, reviewCount: 24 },
  { rating: 4.5, reviewCount: 23 },
  { rating: 4.9, reviewCount: 29 },
  { rating: 4.4, reviewCount: 22 },
  { rating: 4.3, reviewCount: 21 },
  { rating: 4.7, reviewCount: 27 },
  { rating: 4.6, reviewCount: 25 },
];

function hashString(value = "") {
  return String(value)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export function getProductReviewMeta(product) {
  const numericId = Number(product?.id ?? product ?? 0);

  if (numericId > 0) {
    return REVIEW_PRESETS[numericId % REVIEW_PRESETS.length];
  }

  const nameHash = hashString(product?.name || "");
  return REVIEW_PRESETS[nameHash % REVIEW_PRESETS.length];
}

export function formatRatingText(rating) {
  return `${Number(rating).toFixed(1)}/5`;
}