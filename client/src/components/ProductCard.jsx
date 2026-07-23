import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { toggleWishlist } from "../api/wishlistApi";
import { addToCart } from "../api/cartApi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { refreshCartCount } = useCart();
  const [showQuickView, setShowQuickView] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to use wishlist");
      return;
    }
    try {
      await toggleWishlist(product._id);
      toast.success("Wishlist updated");
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    setShowQuickView(true);
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    setAdding(true);
    try {
      await addToCart({ productId: product._id, quantity: 1 });
      refreshCartCount();
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const seed = product._id.charCodeAt(product._id.length - 1);
  const rating = (4 + (seed % 10) / 10).toFixed(1);
  const reviewCount = 30 + (seed % 15) * 17;

  return (
    <>
      <div className="product-card">
        <button className="wishlist-btn" onClick={handleWishlistClick}>♥</button>
        <button className="quickview-btn" onClick={handleQuickViewClick}>👁 Quick View</button>
        <Link to={`/products/${product._id}`}>
          <div className="product-card-img-wrap">
            <img src={product.images[0] || "https://via.placeholder.com/220"} alt={product.name} />
          </div>
          <div className="product-card-body">
            <p className="product-card-name">{product.name}</p>
            <p className="product-card-category">{product.category}</p>
            <p className="product-card-stars">{"⭐".repeat(Math.round(rating))} <span>({reviewCount})</span></p>
            <p className="product-card-price">
              ₹{product.price}
              <span className="strike-price">₹{Math.round(product.price * 1.25)}</span>
              <span className="discount-badge">20% OFF</span>
            </p>
            <p className="free-delivery">🚚 Free Delivery</p>
          </div>
        </Link>
      </div>

      {showQuickView && (
        <div className="quickview-overlay" onClick={() => setShowQuickView(false)}>
          <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
            <button className="quickview-close" onClick={() => setShowQuickView(false)}>✕</button>

            <div className="quickview-content">
              <img
                className="quickview-image"
                src={product.images[0] || "https://via.placeholder.com/300"}
                alt={product.name}
              />

              <div className="quickview-info">
                <p className="product-card-category">{product.category}</p>
                <h2>{product.name}</h2>
                <p className="product-card-stars">
                  {"⭐".repeat(Math.round(rating))} <span>{rating} ({reviewCount} reviews)</span>
                </p>
                <p className="detail-price">
                  ₹{product.price}
                  <span className="strike-price">₹{Math.round(product.price * 1.25)}</span>
                  <span className="discount-badge">20% OFF</span>
                </p>
                <p className="quickview-description">{product.description}</p>

                <span className={`stock-badge ${product.stock > 0 ? "stock-in" : "stock-out"}`}>
                  {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
                </span>

                <div className="quickview-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || adding}
                  >
                    {adding ? "Adding..." : "Add to Cart"}
                  </button>
                  <Link
                    to={`/products/${product._id}`}
                    className="btn btn-outline"
                    onClick={() => setShowQuickView(false)}
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;