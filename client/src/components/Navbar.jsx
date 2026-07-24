import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { cartCount } = useCart();
  const { dark, toggleTheme } = useTheme();


  const getInitial = (name) => name?.charAt(0).toUpperCase() || "U";

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">🛍️ Ecommerce</Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/ai">✨ AI Hub</Link>

        {user ? (
          <>
           <Link to="/cart" className="cart-link">
  🛒 Cart
  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
</Link>
            <button className="theme-toggle" onClick={toggleTheme}>{dark ? "☀️" : "🌙"}</button>
            <div className="user-menu" ref={menuRef}>
              <button className="user-menu-trigger" onClick={() => setMenuOpen(!menuOpen)}>
                <div className="user-avatar">{getInitial(user.name)}</div>
                <span>{user.name}</span>
                <span className="chevron">{menuOpen ? "▲" : "▼"}</span>
              </button>

              {menuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-avatar" style={{ width: 40, height: 40, fontSize: 16 }}>
                      {getInitial(user.name)}
                    </div>
                    <div>
                      <p className="user-dropdown-name">{user.name}</p>
                      <p className="user-dropdown-email">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/orders" className="user-dropdown-item" onClick={() => setMenuOpen(false)}>
                    📦 My Orders
                  </Link>
                  <Link to="/wishlist" className="user-dropdown-item" onClick={() => setMenuOpen(false)}>
                    💛 Wishlist
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/admin" className="user-dropdown-item" onClick={() => setMenuOpen(false)}>
                      🛠️ Admin Dashboard
                    </Link>
                  )}
                  <button className="user-dropdown-item logout-item" onClick={handleLogout}>
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;