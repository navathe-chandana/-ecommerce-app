import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import VoiceSearchButton from "../components/VoiceSearchButton";
import ImageSearchModal from "../components/ImageSearchModal";
import { getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";


const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [priceRange, setPriceRange] = useState(100000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [showImageSearch, setShowImageSearch] = useState(false);
  useEffect(() => {
    fetchProducts();
  }, [search, category, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ search, category, page, limit: 8 });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await getProducts({ search: query, limit: 5 });
      setSuggestions(res.data.products);
    } catch (error) {
      setSuggestions([]);
    }
  };

  const getRating = (id) => {
    const seed = id.charCodeAt(id.length - 1);
    return 4 + (seed % 10) / 10;
  };
  const getDiscount = (id) => id.charCodeAt(0) % 3 === 0;

  let displayedProducts = products
    .filter((p) => p.price <= priceRange)
    .filter((p) => getRating(p._id) >= minRating)
    .filter((p) => (inStockOnly ? p.stock > 0 : true))
    .filter((p) => (discountOnly ? getDiscount(p._id) : true));

  if (sortBy === "price-low") displayedProducts.sort((a, b) => a.price - b.price);
  if (sortBy === "price-high") displayedProducts.sort((a, b) => b.price - a.price);
  if (sortBy === "rating") displayedProducts.sort((a, b) => getRating(b._id) - getRating(a._id));

  return (
    <div className="page-container">
      <h1 className="section-title">Products</h1>

      <div className="filter-bar">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
              fetchSuggestions(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => search && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((p) => (
                <Link
                  key={p._id}
                  to={`/products/${p._id}`}
                  className="suggestion-item"
                  onClick={() => setShowSuggestions(false)}
                >
                  <img src={p.images?.[0] || "https://via.placeholder.com/40"} alt={p.name} />
                  <div>
                    <p className="suggestion-name">{p.name}</p>
                    <p className="suggestion-category">{p.category} · ₹{p.price}</p>
                  </div>
                </Link>
              ))}
             
            </div>
          )}
           <VoiceSearchButton
  onResult={(text) => {
    setSearch(text);
    setPage(1);
    fetchSuggestions(text);
  }}
/>
        <button
  type="button"
  className="image-search-trigger"
  onClick={() => setShowImageSearch(true)}
  title="Search by image"
>
  📷
</button>
        </div>
        <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="relevance">Sort: Relevance</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <div className="category-pills">
        {["", "electronics", "clothing", "books"].map((cat) => (
          <button
            key={cat}
            className={`category-pill ${category === cat ? "active" : ""}`}
            onClick={() => { setCategory(cat); setPage(1); }}
          >
            {cat === "" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="products-layout">
        <aside className="filters-sidebar">
          <div className="filter-group">
            <h4>Price</h4>
            <input
              type="range"
              min="0"
              max="100000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
            <p className="filter-value">Up to ₹{priceRange.toLocaleString()}</p>
          </div>

          <div className="filter-group">
            <h4>Minimum Rating</h4>
            {[4, 3, 0].map((r) => (
              <label key={r} className="filter-radio">
                <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} />
                {r === 0 ? "All ratings" : `${"⭐".repeat(r)} & up`}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Availability</h4>
            <label className="filter-checkbox">
              <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
              In Stock Only
            </label>
          </div>

          <div className="filter-group">
            <h4>Discount</h4>
            <label className="filter-checkbox">
              <input type="checkbox" checked={discountOnly} onChange={(e) => setDiscountOnly(e.target.checked)} />
              On Sale
            </label>
          </div>
        </aside>

        <div className="products-main">
          {loading ? (
            <div className="product-grid">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h2>No products found</h2>
              <p>Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="product-grid">
              {displayedProducts.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "24px", display: "flex", gap: "10px", alignItems: "center" }}>
        <button className="btn btn-outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button className="btn btn-outline" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>Next</button>
      </div>
      {showImageSearch && <ImageSearchModal onClose={() => setShowImageSearch(false)} />}
    </div>
  );
};

export default Products;