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
      <div className="hero">
        <h1>Welcome to Ecommerce Store</h1>
        <p>Discover great products at great prices</p>
        <Link to="/products">
          <button className="btn btn-primary">Shop Now</button>
        </Link>
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