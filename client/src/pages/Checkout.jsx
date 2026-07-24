import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getCart } from "../api/cartApi";
import { createRazorpayOrder, verifyPayment } from "../api/paymentApi";
import { createOrder } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from "../utils/addressStorage";
import AddressForm from "../components/AddressForm";
import AddressCard from "../components/AddressCard";
import CheckoutStepper from "../components/CheckoutStepper";

const STEPS = ["Cart", "Address", "Payment", "Review", "Confirmation"];

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const { user } = useAuth();
  const { refreshCartCount } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  useEffect(() => {
    fetchCart();
    const list = getAddresses(user._id);
    setAddresses(list);
    const def = list.find((a) => a.isDefault) || list[0];
    if (def) setSelectedAddressId(def.id);
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

  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const goNext = () => {
    if (step === 2 && !selectedAddressId) {
      toast.error("Please select or add a shipping address");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSaveAddress = (formData) => {
    if (editingAddress) {
      const updated = updateAddress(user._id, editingAddress.id, formData);
      setAddresses(updated);
      toast.success("Address updated");
    } else {
      const updated = addAddress(user._id, formData);
      setAddresses(updated);
      const created = updated[updated.length - 1];
      setSelectedAddressId(created.id);
      toast.success("Address added");
    }
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id) => {
    const updated = deleteAddress(user._id, id);
    setAddresses(updated);
    if (selectedAddressId === id) {
      const def = updated.find((a) => a.isDefault) || updated[0];
      setSelectedAddressId(def ? def.id : null);
    }
    toast.success("Address deleted");
  };

  const handleSetDefault = (id) => {
    const updated = setDefaultAddress(user._id, id);
    setAddresses(updated);
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const { data: razorpayOrder } = await createRazorpayOrder({ amount: total });

      const options = {
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Ecommerce Store",
        description: "Order Payment",
        order_id: razorpayOrder.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.verified) {
              const shippingAddress = {
                fullName: selectedAddress.fullName,
                address: selectedAddress.address,
                city: selectedAddress.city,
                postalCode: selectedAddress.postalCode,
                country: selectedAddress.country,
                phone: selectedAddress.phone,
              };

              const orderRes = await createOrder({
                shippingAddress,
                paymentId: response.razorpay_payment_id,
              });

              refreshCartCount();
              setConfirmedOrder(orderRes.data);
              setStep(5);
              toast.success("Order placed successfully!");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            toast.error("Something went wrong after payment");
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#ff6b35" },
      };
      const handleCodOrder = async () => {
  setProcessing(true);
  try {
    const shippingAddress = {
      fullName: selectedAddress.fullName,
      address: selectedAddress.address,
      city: selectedAddress.city,
      postalCode: selectedAddress.postalCode,
      country: selectedAddress.country,
      phone: selectedAddress.phone,
    };
    const orderRes = await createOrder({ shippingAddress, paymentId: "COD" });
    refreshCartCount();
    setConfirmedOrder(orderRes.data);
    setStep(5);
    toast.success("Order placed successfully!");
  } catch (error) {
    toast.error("Failed to place order");
  } finally {
    setProcessing(false);
  }
};

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("Failed to initiate payment");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="page-container"><div className="spinner"></div></div>;

  if (step < 5 && (!cart || cart.items.length === 0)) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="section-title">Checkout</h1>

      <CheckoutStepper steps={STEPS} currentStep={step} onStepClick={setStep} />

      <div className="checkout-step-body">
        {step === 1 && (
          <div className="checkout-panel">
            <h3>Review Cart</h3>
            {cart.items.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.product.images[0] || "https://via.placeholder.com/60"} alt={item.product.name} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>{item.product.name}</p>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "13px" }}>Qty: {item.quantity}</p>
                </div>
                <p style={{ fontWeight: 700 }}>₹{item.product.price * item.quantity}</p>
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="checkout-panel">
            <h3>Shipping Address</h3>

            {addresses.length > 0 && (
              <div className="address-grid">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr.id}
                    address={addr}
                    selected={selectedAddressId === addr.id}
                    onSelect={setSelectedAddressId}
                    onEdit={handleEditAddress}
                    onDelete={handleDeleteAddress}
                    onSetDefault={handleSetDefault}
                  />
                ))}
              </div>
            )}

            {showAddressForm ? (
              <AddressForm
                initialData={editingAddress}
                onSave={handleSaveAddress}
                onCancel={() => { setShowAddressForm(false); setEditingAddress(null); }}
              />
            ) : (
              <button className="btn btn-outline" onClick={() => setShowAddressForm(true)}>
                + Add New Address
              </button>
            )}
          </div>
        )}

        {step === 3 && (
  <div className="checkout-panel">
    <h3>Payment Method</h3>
    <div className="payment-options">
      <div
        className={`payment-method-card ${paymentMethod === "razorpay" ? "payment-method-selected" : ""}`}
        onClick={() => setPaymentMethod("razorpay")}
      >
        <span>💳 Card / Netbanking (Razorpay)</span>
        {paymentMethod === "razorpay" && <span className="status-badge">Selected</span>}
      </div>
      <div
        className={`payment-method-card ${paymentMethod === "upi" ? "payment-method-selected" : ""}`}
        onClick={() => setPaymentMethod("upi")}
      >
        <span>📱 UPI</span>
        {paymentMethod === "upi" && <span className="status-badge">Selected</span>}
      </div>
      <div
        className={`payment-method-card ${paymentMethod === "wallet" ? "payment-method-selected" : ""}`}
        onClick={() => setPaymentMethod("wallet")}
      >
        <span>👛 Wallet</span>
        {paymentMethod === "wallet" && <span className="status-badge">Selected</span>}
      </div>
      <div
        className={`payment-method-card ${paymentMethod === "cod" ? "payment-method-selected" : ""}`}
        onClick={() => setPaymentMethod("cod")}
      >
        <span>💵 Cash on Delivery</span>
        {paymentMethod === "cod" && <span className="status-badge">Selected</span>}
      </div>
    </div>
    <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "14px" }}>
      {paymentMethod === "cod"
        ? "Pay in cash when your order arrives."
        : "You'll be redirected to Razorpay's secure checkout on the Review step (Card/UPI/Netbanking/Wallet all route through Razorpay)."}
    </p>
  </div>
)}

        {step === 4 && (
          <div className="checkout-panel">
            <h3>Review Order</h3>
            <div className="review-block">
              <h4>Shipping To</h4>
              {selectedAddress && (
                <p className="address-card-text">
                  {selectedAddress.fullName}, {selectedAddress.address}, {selectedAddress.city} - {selectedAddress.postalCode}, {selectedAddress.country} · {selectedAddress.phone}
                </p>
              )}
            </div>
            <div className="review-block">
              <h4>Items</h4>
              {cart.items.map((item) => (
                <div key={item._id} className="summary-row">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="review-block">
              <div className="summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
              <div className="summary-row"><span>Tax</span><span>₹{tax}</span></div>
              <div className="summary-row summary-total"><span>Total</span><span>₹{total}</span></div>
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={paymentMethod === "cod" ? handleCodOrder : handlePayment} disabled={processing}>
  {processing ? "Processing..." : paymentMethod === "cod" ? "Place COD Order" : `Pay ₹${total}`}
</button>
          </div>
        )}

        {step === 5 && confirmedOrder && (
          <div className="checkout-panel confirmation-panel">
            <div className="empty-state-icon">✅</div>
            <h2>Order Confirmed!</h2>
            <p style={{ color: "var(--text-muted)" }}>Order #{confirmedOrder._id.slice(-8)} has been placed successfully.</p>
            <p style={{ fontWeight: 700, fontSize: "18px" }}>Total Paid: ₹{confirmedOrder.totalAmount}</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "16px" }}>
              <button className="btn btn-primary" onClick={() => navigate("/orders")}>View My Orders</button>
              <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>

      {step < 4 && (
        <div className="checkout-nav">
          <button className="btn btn-outline" onClick={goBack} disabled={step === 1}>Back</button>
          <button className="btn btn-primary" onClick={goNext}>Next</button>
        </div>
      )}
      {step === 4 && (
        <div className="checkout-nav">
          <button className="btn btn-outline" onClick={goBack}>Back</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;