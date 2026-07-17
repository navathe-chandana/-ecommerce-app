import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCart } from "../api/cartApi";
import { createRazorpayOrder, verifyPayment } from "../api/paymentApi";
import { createOrder } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    address: "",
    city: "",
    postalCode: "",
    country: "India",
    phone: "",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (error) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const total = calculateTotal();

      // Step 1: Create Razorpay order on our backend
      const { data: razorpayOrder } = await createRazorpayOrder({ amount: total });

      // Step 2: Open Razorpay checkout popup
      const options = {
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Ecommerce Store",
        description: "Order Payment",
        order_id: razorpayOrder.orderId,
        handler: async (response) => {
          try {
            // Step 3: Verify payment signature on our backend
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.verified) {
              // Step 4: Create the actual order in our DB
              await createOrder({
                shippingAddress: address,
                paymentId: response.razorpay_payment_id,
              });

              toast.success("Order placed successfully!");
              navigate("/orders");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            toast.error("Something went wrong after payment");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#000000" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("Failed to initiate payment");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p style={{ padding: "30px" }}>Loading...</p>;
  if (!cart || cart.items.length === 0) return <p style={{ padding: "30px" }}>Your cart is empty.</p>;

  return (
  <div className="page-container" style={{ maxWidth: "500px" }}>
    <h1 className="section-title">Checkout</h1>

    <div className="form-container" style={{ margin: 0, maxWidth: "100%" }}>
      <h3 style={{ marginBottom: "16px" }}>Shipping Address</h3>
      <form onSubmit={handlePayment}>
        <input className="form-input" type="text" name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleAddressChange} required />
        <input className="form-input" type="text" name="address" placeholder="Address" value={address.address} onChange={handleAddressChange} required />
        <input className="form-input" type="text" name="city" placeholder="City" value={address.city} onChange={handleAddressChange} required />
        <input className="form-input" type="text" name="postalCode" placeholder="Postal Code" value={address.postalCode} onChange={handleAddressChange} required />
        <input className="form-input" type="text" name="phone" placeholder="Phone" value={address.phone} onChange={handleAddressChange} required />

        <h3 style={{ margin: "20px 0" }}>Total: ₹{calculateTotal()}</h3>

        <button className="btn btn-primary" type="submit" disabled={processing} style={{ width: "100%" }}>
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  </div>
);
};

export default Checkout;