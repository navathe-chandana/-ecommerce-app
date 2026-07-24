const RecentActivityPanel = ({ orders }) => {
  const recentOrders = orders.slice(0, 5);
  const recentCustomers = [...new Map(orders.map((o) => [o.user?.email, o.user])).values()].slice(0, 5);
  const recentPayments = orders.filter((o) => o.paymentStatus === "paid").slice(0, 5);

  return (
    <div className="activity-grid">
      <div className="chart-card">
        <h3>🧾 Recent Orders</h3>
        <ul className="activity-list">
          {recentOrders.map((o) => (
            <li key={o._id}>
              <span>#{o._id.slice(-8)}</span>
              <span className={`status-badge status-${o.orderStatus}`}>{o.orderStatus}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="chart-card">
        <h3>👤 Latest Customers</h3>
        <ul className="activity-list">
          {recentCustomers.map((c, i) => (
            <li key={i}><span>{c?.name}</span><span className="top-products-metric">{c?.email}</span></li>
          ))}
        </ul>
      </div>

      <div className="chart-card">
        <h3>💳 Recent Payments</h3>
        <ul className="activity-list">
          {recentPayments.map((o) => (
            <li key={o._id}><span>#{o._id.slice(-8)}</span><span className="top-products-metric">₹{o.totalAmount}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentActivityPanel;