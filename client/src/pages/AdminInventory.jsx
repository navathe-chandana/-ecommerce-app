import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getProducts, updateProduct, deleteProduct } from "../api/productApi";
import ProductDeleteModal from "../components/ProductDeleteModal";
import AdminLayout from "../components/AdminLayout";

const LOW_STOCK_THRESHOLD = 5;

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [editingStockId, setEditingStockId] = useState(null);
  const [stockValue, setStockValue] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ limit: 1000, page: 1 });
      setProducts(res.data.products);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeletingProduct(null);
    }
  };

  const handleStockSave = async (id) => {
    try {
      const formData = new FormData();
      formData.append("stock", stockValue);
      const res = await updateProduct(id, formData);
      setProducts((prev) => prev.map((p) => (p._id === id ? res.data : p)));
      toast.success("Stock updated");
    } catch (error) {
      toast.error("Failed to update stock");
    } finally {
      setEditingStockId(null);
    }
  };

  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (categoryFilter ? p.category === categoryFilter : true))
    .filter((p) => {
      if (stockFilter === "in") return p.stock > LOW_STOCK_THRESHOLD;
      if (stockFilter === "low") return p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD;
      if (stockFilter === "out") return p.stock === 0;
      return true;
    });

  if (loading) return <div className="page-container"><div className="spinner"></div></div>;

  return (
    <AdminLayout>
    <div className="page-container admin-page-container">
      <h1 className="section-title">Inventory Management</h1>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>
        <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
          <option value="">All Stock Levels</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p._id}>
              <td><img src={p.images?.[0]} alt={p.name} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6 }} /></td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>₹{p.price}</td>
              <td>
                {editingStockId === p._id ? (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input
                      type="number"
                      value={stockValue}
                      onChange={(e) => setStockValue(e.target.value)}
                      style={{ width: "60px", padding: "4px 6px", borderRadius: "6px", border: "1px solid var(--border)" }}
                    />
                    <button className="btn btn-primary" style={{ padding: "4px 10px", fontSize: "11px" }} onClick={() => handleStockSave(p._id)}>Save</button>
                  </div>
                ) : (
                  <span onClick={() => { setEditingStockId(p._id); setStockValue(p.stock); }} style={{ cursor: "pointer" }}>
                    {p.stock} ✏️
                  </span>
                )}
              </td>
              <td>
                {p.stock === 0 ? (
                  <span className="stock-badge stock-out">Out of Stock</span>
                ) : p.stock <= LOW_STOCK_THRESHOLD ? (
                  <span className="stock-badge stock-low">Low Stock</span>
                ) : (
                  <span className="stock-badge stock-in">In Stock</span>
                )}
              </td>
              <td>
                <button className="btn-danger" onClick={() => setDeletingProduct(p)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ProductDeleteModal
        product={deletingProduct}
        onConfirm={handleDelete}
        onCancel={() => setDeletingProduct(null)}
      />
    </div>
    </AdminLayout>
  );
};

export default AdminInventory;