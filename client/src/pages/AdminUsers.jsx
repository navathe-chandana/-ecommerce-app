import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getAllUsers, toggleBlockUser, deleteUser } from "../api/userApi";
import UserProfileModal from "../components/UserProfileModal";
import UserDeleteModal from "../components/UserDeleteModal";
import AdminLayout from "../components/AdminLayout";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [viewingUser, setViewingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      const res = await toggleBlockUser(id);
      setUsers((prev) => prev.map((u) => (u._id === id ? res.data : u)));
      toast.success(res.data.isBlocked ? "User blocked" : "User unblocked");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingUser(null);
    }
  };

  const filtered = users
    .filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    .filter((u) => (roleFilter ? u.role === roleFilter : true));

  if (loading) return <div className="page-container"><div className="spinner"></div></div>;

  return (
    <AdminLayout>
    <div className="page-container admin-page-container">
      <h1 className="section-title">User Management</h1>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td style={{ textTransform: "capitalize" }}>{u.role}</td>
              <td>
                <span className={`status-badge ${u.isBlocked ? "status-blocked" : ""}`}>
                  {u.isBlocked ? "Blocked" : "Active"}
                </span>
              </td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td className="user-actions-cell">
                <button className="btn btn-outline" style={{ padding: "6px 10px", fontSize: "11px" }} onClick={() => setViewingUser(u)}>
                  View
                </button>
                {u.role !== "admin" && (
                  <>
                    <button className="btn btn-outline" style={{ padding: "6px 10px", fontSize: "11px" }} onClick={() => handleToggleBlock(u._id)}>
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button className="btn-danger" onClick={() => setDeletingUser(u)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <UserProfileModal user={viewingUser} onClose={() => setViewingUser(null)} />
      <UserDeleteModal user={deletingUser} onConfirm={handleDelete} onCancel={() => setDeletingUser(null)} />
    </div>
    </AdminLayout>
  );
};

export default AdminUsers;