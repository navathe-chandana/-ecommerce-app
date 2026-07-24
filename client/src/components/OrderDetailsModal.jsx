const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Order #{order._id.slice(-8)}</h3>
          <button className="quickview-close" onClick={onClose}>✕</button>
        </div>

        <p><strong>Customer:</strong> {order.user?.name} ({order.user?.email})</p>
        <p><strong>Status:</strong> <span className="status-badge">{order.orderStatus}</span></p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Payment ID:</strong> {order.paymentId || "N/A"}</p>

        {order.shippingAddress && (
          <p><strong>Ship To:</strong> {order.shippingAddress.fullName}, {order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
        )}

        <h4 style={{ marginTop: "16px" }}>Items</h4>
        {order.items.map((item) => (
          <div key={item._id} className="summary-row">
            <span>{item.name} × {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}

        <div className="summary-row summary-total">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;