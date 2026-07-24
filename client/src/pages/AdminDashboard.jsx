import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllOrders, updateOrderStatus } from "../api/adminApi";
import OrderDetailsModal from "../components/OrderDetailsModal";
import AdminLayout from "../components/AdminLayout";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [viewingOrder, setViewingOrder] = useState(null);
  const perPage = 8;

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

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? o.orderStatus === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / perPage) || 1;
  const paginatedOrders = filteredOrders.slice((page - 1) * perPage, page * perPage);

  if (loading) return <div className="page-container"><div className="spinner"></div></div>;

  return (
    <AdminLayout>
  <div className="page-container admin-page-container">
      <h1 className="section-title">Orders Management</h1>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by order ID, customer name, or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          <option value="placed">Placed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
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
                      <option value="placed">placed</option>
                      <option value="processing">processing</option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn btn-outline" style={{ padding: "6px 12px", fontSize: "12px" }} onClick={() => setViewingOrder(order)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
            <button className="btn btn-outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button className="btn btn-outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </>
      )}

      <OrderDetailsModal order={viewingOrder} onClose={() => setViewingOrder(null)} />
    </div>
    </AdminLayout>
  );
};

export default AdminDashboard;