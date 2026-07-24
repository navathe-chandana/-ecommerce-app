const NotificationsPanel = ({ newOrdersCount, lowStockProducts, paidCount, pendingShipments }) => {
  const items = [
    { icon: "🆕", label: `${newOrdersCount} new orders today`, type: "info" },
    ...lowStockProducts.slice(0, 3).map((p) => ({ icon: "⚠️", label: `Low stock: ${p.name} (${p.stock} left)`, type: "warning" })),
    { icon: "✅", label: `${paidCount} payments successful`, type: "success" },
    { icon: "🚚", label: `${pendingShipments} orders pending shipment`, type: "info" },
  ];

  return (
    <div className="chart-card">
      <h3>🔔 Notifications</h3>
      <ul className="notif-list">
        {items.map((item, i) => (
          <li key={i} className={`notif-item notif-${item.type}`}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPanel;