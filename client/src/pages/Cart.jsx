import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCart, addToCart, removeFromCart } from "../api/cartApi";
import { toggleWishlist } from "../api/wishlistApi";
import { useCart } from "../context/CartContext";

const MOCK_COUPONS = {
  SAVE10: { type: "percent", value: 10, label: "10% off" },
  SAVE500: { type: "flat", value: 500, label: "₹500 off" },
  FREESHIP: { type: "shipping", value: 0, label: "Free shipping" },
};

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movingId, setMovingId] = useState(null);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (error) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const res = await addToCart({ productId, quantity: newQuantity });
      setCart(res.data);
      refreshCartCount();
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await removeFromCart(productId);
      setCart(res.data);
      refreshCartCount();
      toast.success("Item removed");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleMoveToWishlist = async (item) => {
    setMovingId(item.product._id);
    try {
      await toggleWishlist(item.product._id);
      await removeFromCart(item.product._id);
      const res = await getCart();
      setCart(res.data);
      refreshCartCount();
      toast.success("Moved to wishlist!");
    } catch (error) {
      toast.error("Failed to move item");
    } finally {
      setMovingId(null);
    }
  };

  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingBase = subtotal > 0 ? (subtotal > 999 ? 0 : 49) : 0;
  const tax = Math.round(subtotal * 0.05);

  let discount = 0;
  let shipping = shippingBase;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") discount = Math.round(subtotal * (appliedCoupon.value / 100));
    if (appliedCoupon.type === "flat") discount = Math.min(appliedCoupon.value, subtotal);
    if (appliedCoupon.type === "shipping") shipping = 0;
  }

  const total = Math.max(subtotal + shipping + tax - discount, 0);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    const match = MOCK_COUPONS[code];
    if (match) {
      setAppliedCoupon({ code, ...match });
      toast.success(`Coupon applied: ${match.label}`);
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
  };

  if (loading) return <div className="page-container"><div className="spinner"></div></div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p style={{ marginBottom: "20px" }}>Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="section-title">Your Cart</h1>

      <div className="cart-layout">
        <div className="cart-items-col">
          {cart.items.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                src={item.product.images[0] || "https://via.placeholder.com/80"}
                alt={item.product.name}
              />

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 5px" }}>{item.product.name}</h3>
                <p style={{ margin: 0, color: "var(--text-muted)" }}>₹{item.product.price}</p>
              </div>

              <div className="qty-control">
                <button onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}>+</button>
              </div>

              <p style={{ width: "80px", textAlign: "right", fontWeight: "bold" }}>
                ₹{item.product.price * item.quantity}
              </p>

              <div className="cart-item-actions">
                <button
                  className="btn btn-outline cart-wishlist-btn"
                  onClick={() => handleMoveToWishlist(item)}
                  disabled={movingId === item.product._id}
                >
                  {movingId === item.product._id ? "Moving..." : "♡ Move to Wishlist"}
                </button>
                <button className="btn-danger" onClick={() => handleRemove(item.product._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary-col">
          <div className="coupon-box">
            <h4>Have a coupon?</h4>
            {appliedCoupon ? (
              <div className="coupon-applied">
                <span>🏷️ {appliedCoupon.code} — {appliedCoupon.label}</span>
                <button className="btn-danger" onClick={handleRemoveCoupon}>Remove</button>
              </div>
            ) : (
              <form className="coupon-form" onSubmit={handleApplyCoupon}>
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button className="btn btn-outline" type="submit">Apply</button>
              </form>
            )}
            <p className="coupon-hint">Try: SAVE10, SAVE500, FREESHIP</p>
          </div>

          <div className="cart-summary">
            <h3 style={{ marginTop: 0 }}>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
            <div className="summary-row"><span>Tax (5%)</span><span>₹{tax}</span></div>
            {appliedCoupon && (
              <div className="summary-row summary-discount"><span>Discount</span><span>-₹{discount}</span></div>
            )}
            <div className="summary-row summary-total"><span>Total</span><span>₹{total}</span></div>

            <button className="btn btn-primary" style={{ width: "100%", marginTop: "14px" }} onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;