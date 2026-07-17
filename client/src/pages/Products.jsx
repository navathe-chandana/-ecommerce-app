import { useState, useEffect } from "react";
import { getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
  return (
  <div className="page-container">
    <h1 className="section-title">Products</h1>

  <div className="filter-bar">
  <input
    type="text"
    placeholder="Search products..."
    value={search}
    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
  />
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

{loading ? (
  <div className="product-grid">
    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
) : (
      <div className="product-grid">
        {products.map((product) => <ProductCard key={product._id} product={product} />)}
      </div>
    )}

    <div style={{ marginTop: "24px", display: "flex", gap: "10px", alignItems: "center" }}>
      <button className="btn btn-outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
      <span>Page {page} of {totalPages}</span>
      <button className="btn btn-outline" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>Next</button>
    </div>
  </div>
);
  
};

export default Products;