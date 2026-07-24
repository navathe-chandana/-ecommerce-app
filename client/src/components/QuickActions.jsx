import { Link } from "react-router-dom";

const QuickActions = () => {
  return (
    <div className="quick-actions">
      <Link to="/admin/add-product" className="quick-action-btn">➕ Add Product</Link>
      <button className="quick-action-btn" onClick={() => alert("Category management coming soon")}>🏷️ Add Category</button>
      <Link to="/admin" className="quick-action-btn">🧾 View Orders</Link>
      <Link to="/admin/users" className="quick-action-btn">👥 Manage Users</Link>
      <button className="quick-action-btn" onClick={() => window.print()}>📤 Export Reports</button>
    </div>
  );
};

export default QuickActions;