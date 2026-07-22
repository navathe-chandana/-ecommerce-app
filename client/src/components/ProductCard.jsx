import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { toggleWishlist } from "../api/wishlistApi";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ product }) => {
  const { user } = useAuth();

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

  // Deterministic fake rating from product id, so it's consistent (not random per render)
  const seed = product._id.charCodeAt(product._id.length - 1);
  const rating = (4 + (seed % 10) / 10).toFixed(1);
  const reviewCount = 30 + (seed % 15) * 17;

  return (
    <div className="product-card">
      <button className="wishlist-btn" onClick={handleWishlistClick}>♥</button>
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
  );
};

export default ProductCard;