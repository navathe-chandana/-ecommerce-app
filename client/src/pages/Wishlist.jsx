import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getWishlist, toggleWishlist } from "../api/wishlistApi";
import { addToCart } from "../api/cartApi";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movingId, setMovingId] = useState(null);
  const { refreshCartCount } = useCart();

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

  const handleMoveToCart = async (product) => {
    setMovingId(product._id);
    try {
      await addToCart({ productId: product._id, quantity: 1 });
      await toggleWishlist(product._id);
      refreshCartCount();
      setWishlist((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p._id !== product._id),
      }));
      toast.success("Moved to cart!");
    } catch (error) {
      toast.error("Failed to move to cart");
    } finally {
      setMovingId(null);
    }
  };

  if (loading) return <div className="page-container"><div className="spinner"></div></div>;

  if (!wishlist || wishlist.products.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">💛</div>
          <h2>Your wishlist is empty</h2>
          <p style={{ marginBottom: "20px" }}>Save items you love for later.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
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
            <div className="wishlist-actions">
              <button
                className="btn btn-primary wishlist-move-btn"
                onClick={() => handleMoveToCart(product)}
                disabled={movingId === product._id || product.stock === 0}
              >
                {movingId === product._id ? "Moving..." : "Move to Cart"}
              </button>
              <button className="btn-danger" onClick={() => handleRemove(product._id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;