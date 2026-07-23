const KEY = "recentlyViewed";
const MAX_ITEMS = 10;

export const addRecentlyViewed = (product) => {
  const existing = getRecentlyViewed();
  const filtered = existing.filter((p) => p._id !== product._id);
  const updated = [
    { _id: product._id, name: product.name, price: product.price, images: product.images, category: product.category },
    ...filtered,
  ].slice(0, MAX_ITEMS);
  localStorage.setItem(KEY, JSON.stringify(updated));
};

export const getRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};