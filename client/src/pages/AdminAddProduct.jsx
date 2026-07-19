import { useState } from "react";
import toast from "react-hot-toast";
import { createProduct } from "../api/productApi";
import { generateDescription } from "../api/aiApi";
// import { Link } from "react-router-dom";

const AdminAddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "electronics",
    stock: "",
  });
  const [image, setImage] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerateDescription = async () => {
    if (!form.name) {
      toast.error("Enter a product name first");
      return;
    }
    setGenerating(true);
    try {
      const res = await generateDescription({ name: form.name, category: form.category });
      setForm({ ...form, description: res.data.description });
      toast.success("Description generated!");
    } catch (error) {
      toast.error("Failed to generate description");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please select an image");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append("images", image);

      await createProduct(formData);
      toast.success("Product created!");
      setForm({ name: "", description: "", price: "", category: "electronics", stock: "" });
      setImage(null);
      e.target.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="section-title">Add New Product</h1>
      
      <div className="form-container" style={{ margin: 0, maxWidth: "500px" }}>
        <form onSubmit={handleSubmit}>
          <input
            className="form-input"
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <div style={{ position: "relative" }}>
            <textarea
              className="form-input"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
              style={{ resize: "vertical" }}
            />
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={generating}
              className="btn btn-outline"
              style={{ fontSize: "12px", padding: "6px 12px", marginBottom: "14px" }}
            >
              {generating ? "Generating..." : "✨ Generate with AI"}
            </button>
          </div>

          <input
            className="form-input"
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />

          <select
            className="form-input"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
          </select>

          <input
            className="form-input"
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
          />

          <input
            className="form-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />

          <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: "100%" }}>
            {submitting ? "Creating..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;