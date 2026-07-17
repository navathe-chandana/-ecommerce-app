import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getWishlist, toggleWishlist } from "../api/wishlistApi";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      setWishlist(res.data);
    } catch (error) {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await toggleWishlist(productId);
      setWishlist(res.data);
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

 if (loading) return <div className="page-container"><div className="spinner"></div></div>;

  if (!wishlist || wishlist.products.length === 0) {
    return (
      <div className="page-container">
        <h2>Your wishlist is empty</h2>
        <Link to="/products">Browse products</Link>
      </div>
    );
  }

  return (
       <div className="page-container">
  <h1 className="section-title">My Wishlist</h1>
  <div className="product-grid">
        {wishlist.products.map((product) => (
          <div key={product._id}>
            <ProductCard product={product} />
            <button
              onClick={() => handleRemove(product._id)}
              style={{ marginTop: "8px", color: "red", width: "220px" }}
            >
              Remove from Wishlist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;