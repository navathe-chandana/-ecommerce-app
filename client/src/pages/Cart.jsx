import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCart, addToCart, removeFromCart } from "../api/cartApi";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
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
      refreshCartCount()
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await removeFromCart(productId);
      setCart(res.data);
      toast.success("Item removed");
      refreshCartCount()
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  if (loading) return <div className="page-container"><div className="spinner"></div></div>;
  if (!cart || cart.items.length === 0) {
    return (
    <div className="page-container">
      <h2>Your cart is empty</h2>
      <Link to="/products">Browse products</Link>
    </div>
  );
}

  return (
  <div className="page-container">
    <h1 className="section-title">Your Cart</h1>

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

        <button className="btn-danger" onClick={() => handleRemove(item.product._id)}>
          Remove
        </button>
      </div>
    ))}

    <div className="cart-summary">
  <h2>Total: ₹{calculateTotal()}</h2>
  <button className="btn btn-primary" onClick={() => navigate("/checkout")}>
    Proceed to Checkout
  </button>
</div>
  </div>
);
};

export default Cart;