import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
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
      const res = await registerUser(formData);
      login(res.data);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="form-container">
    <h2>Register</h2>
    <form onSubmit={handleSubmit}>
      <input
        className="form-input"
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
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
        {loading ? "Creating account..." : "Register"}
      </button>
    </form>
    <p className="form-link">Already have an account? <Link to="/login">Login</Link></p>
  </div>
);
};

export default Register;