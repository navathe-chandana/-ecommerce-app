import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(formData);
      login(res.data);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="form-container">
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
      <input
        className="form-input"
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        className="form-input"
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%" }}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
    <p className="form-link">Don't have an account? <Link to="/register">Register</Link></p>
  </div>
);
};

export default Login;