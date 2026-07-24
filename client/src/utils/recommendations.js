import { getProducts } from "../api/productApi";
import { getRecentlyViewed } from "./recentlyViewed";

// "Recommended For You" — based on categories from recently viewed + wishlist
export const getRecommendedForYou = async (wishlistProducts = []) => {
  const recent = getRecentlyViewed();
  const categories = [
    ...new Set([...recent.map((p) => p.category), ...wishlistProducts.map((p) => p.category)]),
  ].filter(Boolean);

  if (categories.length === 0) return { products: [], reason: "Popular picks" };

  const results = await Promise.all(
    categories.slice(0, 2).map((cat) => getProducts({ category: cat, limit: 6 }))
  );
  const seenIds = new Set([...recent.map((p) => p._id), ...wishlistProducts.map((p) => p._id)]);
  const merged = results.flatMap((r) => r.data.products).filter((p) => !seenIds.has(p._id));
  const unique = [...new Map(merged.map((p) => [p._id, p])).values()];

  return { products: unique.slice(0, 4), reason: `Based on your interest in ${categories[0]}` };
};

// "Because you viewed X" — same category as most recently viewed item
export const getBecauseYouViewed = async () => {
  const recent = getRecentlyViewed();
  if (recent.length === 0) return { products: [], sourceProduct: null };

  const latest = recent[0];
  const res = await getProducts({ category: latest.category, limit: 6 });
  const filtered = res.data.products.filter((p) => p._id !== latest._id).slice(0, 4);

  return { products: filtered, sourceProduct: latest };
};

// "Customers Also Viewed" — price-similar products, any category
export const getCustomersAlsoViewed = async (currentProduct) => {
  if (!currentProduct) return [];
  const min = Math.round(currentProduct.price * 0.7);
  const max = Math.round(currentProduct.price * 1.3);

  const res = await getProducts({ limit: 20 });
  const filtered = res.data.products
    .filter((p) => p._id !== currentProduct._id && p.price >= min && p.price <= max)
    .slice(0, 4);

  return filtered;
};

// "Trending Now" — deterministic pseudo-trending pick (no real analytics backend)
export const getTrendingNow = async () => {
  const res = await getProducts({ limit: 20 });
  const sorted = [...res.data.products].sort((a, b) => {
    const seedA = a._id.charCodeAt(a._id.length - 1);
    const seedB = b._id.charCodeAt(b._id.length - 1);
    return seedB - seedA;
  });
  return sorted.slice(0, 4);
};