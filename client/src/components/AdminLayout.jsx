import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { path: "/admin/overview", label: "Dashboard", icon: "📊" },
  { path: "/admin", label: "Orders", icon: "🧾" },
  { path: "/admin/inventory", label: "Inventory", icon: "📦" },
  { path: "/admin/users", label: "Users", icon: "👥" },
  { path: "/admin/add-product", label: "Add Product", icon: "➕" },
];

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`admin-shell ${collapsed ? "admin-shell-collapsed" : ""}`}>
      <aside className={`admin-sidebar ${mobileOpen ? "admin-sidebar-open" : ""}`}>
        <div className="admin-sidebar-logo">
          {!collapsed && <span>🛍️ Admin</span>}
          <button className="admin-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? "admin-nav-active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {mobileOpen && <div className="admin-sidebar-backdrop" onClick={() => setMobileOpen(false)} />}

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-mobile-toggle" onClick={() => setMobileOpen(true)}>☰</button>

          <input className="admin-search" type="text" placeholder="Search anything..." />

          <div className="admin-topbar-right">
            <button className="admin-icon-btn">🔔<span className="admin-notif-dot"></span></button>

            <div className="admin-profile-menu">
              <button className="admin-profile-trigger" onClick={() => setProfileOpen(!profileOpen)}>
                <span className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</span>
                {!collapsed && <span>{user?.name}</span>}
              </button>
              {profileOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-avatar" style={{ width: 40, height: 40, fontSize: 16 }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="user-dropdown-name">{user?.name}</p>
                      <p className="user-dropdown-email">{user?.email}</p>
                    </div>
                  </div>
                  <Link to="/" className="user-dropdown-item" onClick={() => setProfileOpen(false)}>🏠 Back to Store</Link>
                  <button className="user-dropdown-item logout-item" onClick={handleLogout}>🚪 Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;