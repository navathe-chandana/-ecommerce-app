import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getAllOrders, updateOrderStatus } from "../api/adminApi";
import { Link } from "react-router-dom";
const statusOptions = ["placed", "processing", "shipped", "delivered", "cancelled"];

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      toast.success("Order status updated — email sent to customer");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

 if (loading) return <div className="page-container"><div className="spinner"></div></div>;

 return (
  <div className="page-container">
    <h1 className="section-title">Admin — All Orders</h1>
    <Link to="/admin/add-product" className="btn btn-primary" style={{ marginBottom: "20px", display: "inline-block" }}>
  + Add New Product
</Link>

    {orders.length === 0 ? (
      <p>No orders yet.</p>
    ) : (
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>#{order._id.slice(-8)}</td>
              <td>
                {order.user?.name} <br />
                <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>{order.user?.email}</span>
              </td>
              <td>
                {order.items.map((item) => (
                  <div key={item._id}>{item.name} × {item.quantity}</div>
                ))}
              </td>
              <td>₹{order.totalAmount}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <select
                  value={order.orderStatus}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid var(--border)" }}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
};

export default AdminDashboard;