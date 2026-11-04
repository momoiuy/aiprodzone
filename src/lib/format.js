// دوال تنسيق أرقام المشاهدات وحساب التقييم العام
export function formatViews(viewsCount) {
  const num = Number(viewsCount);
  if (!num || Number.isNaN(num) || num <= 0) return 'جديد';
  if (num >= 1_000_000) {
    const m = num / 1_000_000;
    return `${Number.isInteger(m) ? m : m.toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (num >= 1_000) {
    const k = num / 1_000;
    return `${Number.isInteger(k) ? k : k.toFixed(1).replace(/\.0$/, '')}K`;
  }
  return String(Math.floor(num));
}

export function getOverallScore(scores) {
  if (!scores) return 0;
  const { depth = 0, practical = 0, freshness = 0, production = 0 } = scores;
  return Number(((depth + practical + freshness + production) / 4).toFixed(1));
}

export { normalizeArabicSearch, matchesSmartSearch } from './search.js';

