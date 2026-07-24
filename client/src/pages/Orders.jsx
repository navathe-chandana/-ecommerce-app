import { useState, useEffect } from "react";
import { getMyOrders } from "../api/orderApi";
import { generateInvoice } from "../utils/generateInvoice";
import OrderTimeline from "../components/OrderTimeline";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-container"><div className="spinner"></div></div>;
  if (orders.length === 0) return <div className="page-container"><p>You haven't placed any orders yet.</p></div>;

  return (
  <div className="page-container">
    <h1 className="section-title">My Orders</h1>

    {orders.map((order) => (
      <div key={order._id} className="order-card">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
          <div>
            <strong>Order #{order._id.slice(-8)}</strong>
            <p style={{ margin: "5px 0", color: "var(--text-muted)", fontSize: "13px" }}>
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className="status-badge">{order.orderStatus}</span>
        </div>

        {order.items.map((item) => (
          <div key={item._id} style={{ display: "flex", gap: "15px", padding: "8px 0" }}>
            <img
              src={item.image}
              alt={item.name}
              style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
            />
            <div>
              <p style={{ margin: 0 }}>{item.name}</p>
              <p style={{ margin: 0, color: "var(--text-muted)" }}>
                Qty: {item.quantity} × ₹{item.price}
              </p>
            </div>
          </div>
        ))}

        <OrderTimeline status={order.orderStatus} />

        <p style={{ textAlign: "right", fontWeight: "bold", marginTop: "10px" }}>
          Total: ₹{order.totalAmount}
        </p>

        {order.orderStatus === "delivered" && (
          <div style={{ textAlign: "right", marginTop: "8px" }}>
            <button className="btn btn-outline" onClick={() => generateInvoice(order, user)}>
              📄 Download Invoice
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
);
};

export default Orders;