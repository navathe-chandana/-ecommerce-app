const Footer = () => (
  <footer className="footer">
    <div className="footer-grid">
      <div className="footer-col">
        <h4>Ecommerce Store</h4>
        <p style={{ color: "rgba(255,255,255,.65)", fontSize: "13px", maxWidth: "220px" }}>
          Quality products, fast delivery, secure payments.
        </p>
      </div>
      <div className="footer-col">
        <h4>Shop</h4>
        <a href="/products">All Products</a>
        <a href="/cart">Cart</a>
        <a href="/wishlist">Wishlist</a>
      </div>
      <div className="footer-col">
        <h4>Account</h4>
        <a href="/orders">My Orders</a>
        <a href="/login">Login</a>
      </div>
    </div>
    <div className="footer-bottom">© 2026 Ecommerce Store — Built with the MERN stack</div>
  </footer>
);

export default Footer;