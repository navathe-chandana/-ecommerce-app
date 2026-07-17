import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getProductById } from "../api/productApi";
import { addToCart } from "../api/cartApi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
// import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { refreshCartCount } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await getProductById(id);
      setProduct(res.data);
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
      toast.success("Added to cart!");
      await refreshCartCount();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

 if (loading) return <div className="page-container"><div className="spinner"></div></div>;
if (!product) return <div className="page-container"><p>Product not found.</p></div>;

  

 return (
  <div className="page-container">
    <div className="breadcrumbs">
  <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <span>{product.name}</span>
</div>
    <div className="detail-layout">
      <img
        className="detail-image"
        src={product.images[0] || "https://via.placeholder.com/420"}
        alt={product.name}
      />

      <div className="detail-info">
        <p className="product-card-category">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="detail-price">₹{product.price}</p>
        <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>{product.description}</p>

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
  </div>
);
};

export default ProductDetail;