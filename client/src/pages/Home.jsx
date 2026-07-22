import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const res = await getProducts({ limit: 4, page: 1 });
      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="hero hero-premium">
  <div className="hero-content">
    <h1>Shop Smarter.</h1>
    <p>Discover thousands of products with lightning-fast delivery.</p>
    <div className="hero-cta-group">
      <Link to="/products"><button className="btn btn-primary">Explore Products</button></Link>
      <Link to="/products"><button className="btn btn-outline hero-outline">View Deals</button></Link>
    </div>
  </div>
  <div className="hero-images">
    <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300" alt="Laptop" className="hero-float hero-float-1" />
    <img src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300" alt="Phone" className="hero-float hero-float-2" />
    <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" alt="Shoes" className="hero-float hero-float-3" />
    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300" alt="Headphones" className="hero-float hero-float-4" />
  </div>
</div>

      <div className="page-container">
        <h2 className="section-title">Featured Products</h2>
        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;