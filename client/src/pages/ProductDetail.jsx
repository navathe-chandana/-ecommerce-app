import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getProductById, getProducts } from "../api/productApi";
import { addToCart } from "../api/cartApi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { addRecentlyViewed, getRecentlyViewed } from "../utils/recentlyViewed";
import ProductCard from "../components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { refreshCartCount } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});
  const [zooming, setZooming] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    fetchProduct();
    setActiveImage(0);
    setActiveTab("description");
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await getProductById(id);
      setProduct(res.data);
      addRecentlyViewed(res.data);
      setRecentlyViewed(getRecentlyViewed().filter((p) => p._id !== res.data._id));

      const similarRes = await getProducts({ category: res.data.category, limit: 5 });
      setSimilarProducts(similarRes.data.products.filter((p) => p._id !== res.data._id));
    } catch (error) {
      toast.error("Product not found");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    setAdding(true);
    try {
      await addToCart({ productId: product._id, quantity });
      refreshCartCount();
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to write a review");
      return;
    }
    if (!reviewText.trim()) return;
    setUserReviews([
      { name: user.name, rating: reviewRating, text: reviewText, id: Date.now() },
      ...userReviews,
    ]);
    setReviewText("");
    setReviewRating(5);
    toast.success("Review added!");
  };

  if (loading) return <div className="page-container"><div className="spinner"></div></div>;
  if (!product) return <div className="page-container"><p>Product not found.</p></div>;

  const images = product.images?.length ? product.images : ["https://via.placeholder.com/420"];
  const seed = product._id.charCodeAt(product._id.length - 1);
  const rating = (4 + (seed % 10) / 10).toFixed(1);
  const reviewCount = 30 + (seed % 15) * 17;

  return (
    <div className="page-container">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <span>{product.name}</span>
      </div>

      <div className="detail-layout">
        <div className="gallery">
          <div
            className="gallery-main"
            onMouseEnter={() => setZooming(true)}
            onMouseLeave={() => setZooming(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={images[activeImage]}
              alt={product.name}
              className={`detail-image ${zooming ? "zoomed" : ""}`}
              style={zooming ? zoomStyle : {}}
            />
          </div>

          {images.length > 1 && (
            <div className="thumbnail-row">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  className={`thumbnail ${i === activeImage ? "thumbnail-active" : ""}`}
                  onClick={() => setActiveImage(i)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <p className="product-card-category">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="product-card-stars">
            {"⭐".repeat(Math.round(rating))} <span>{rating} ({reviewCount} reviews)</span>
          </p>
          <p className="detail-price">
            ₹{product.price}
            <span className="strike-price">₹{Math.round(product.price * 1.25)}</span>
            <span className="discount-badge">20% OFF</span>
          </p>

          <span className={`stock-badge ${product.stock > 0 ? "stock-in" : "stock-out"}`}>
            {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
          </span>

          {product.stock > 0 && (
            <div className="qty-selector">
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
          )}

          <div>
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      <div className="product-tabs">
        <div className="tab-headers">
          <button
            className={`tab-header ${activeTab === "description" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`tab-header ${activeTab === "specs" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("specs")}
          >
            Specifications
          </button>
          <button
            className={`tab-header ${activeTab === "reviews" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews ({reviewCount})
          </button>
        </div>

        <div className="tab-body">
          {activeTab === "description" && <p>{product.description}</p>}

          {activeTab === "specs" && (
            <table className="specs-table">
              <tbody>
                <tr><td>Category</td><td>{product.category}</td></tr>
                <tr><td>Stock</td><td>{product.stock} units</td></tr>
                <tr><td>Price</td><td>₹{product.price}</td></tr>
                <tr><td>Product ID</td><td>{product._id}</td></tr>
              </tbody>
            </table>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="review-summary">
                <div className="review-avg-score">{rating}</div>
                <div>
                  <p className="product-card-stars" style={{ fontSize: "16px" }}>{"⭐".repeat(Math.round(rating))}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>
                    Based on {reviewCount + userReviews.length} reviews
                  </p>
                </div>
              </div>

              <form className="review-form" onSubmit={handleSubmitReview}>
                <label>Your Rating:</label>
                <div className="star-picker">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={n <= reviewRating ? "star-active" : "star-inactive"}
                      onClick={() => setReviewRating(n)}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <textarea
                  className="form-input"
                  placeholder="Write your review..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={3}
                />
                <button className="btn btn-primary" type="submit">Submit Review</button>
              </form>

              <div className="reviews-list">
                {userReviews.map((r) => (
                  <div key={r.id} className="review-item">
                    <div className="review-header">
                      <span className="review-avatar">{r.name.charAt(0).toUpperCase()}</span>
                      <div>
                        <p className="review-name">{r.name}</p>
                        <p className="product-card-stars">{"⭐".repeat(r.rating)}</p>
                      </div>
                    </div>
                    <p className="review-text">{r.text}</p>
                  </div>
                ))}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="review-item">
                    <div className="review-header">
                      <span className="review-avatar">U{i}</span>
                      <div>
                        <p className="review-name">User{i}</p>
                        <p className="product-card-stars">{"⭐".repeat(5 - (i % 2))}</p>
                      </div>
                    </div>
                    <p className="review-text">Great product, exactly as described. Fast delivery too!</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {similarProducts.length > 0 && (
        <div className="recently-viewed">
          <h2 className="section-title">You May Also Like</h2>
          <div className="product-grid">
            {similarProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {recentlyViewed.length > 0 && (
        <div className="recently-viewed">
          <h2 className="section-title">Recently Viewed</h2>
          <div className="product-grid">
            {recentlyViewed.map((p) => (
              <Link key={p._id} to={`/products/${p._id}`} className="recent-item">
                <img src={p.images?.[0] || "https://via.placeholder.com/160"} alt={p.name} />
                <p className="recent-item-name">{p.name}</p>
                <p className="recent-item-price">₹{p.price}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;