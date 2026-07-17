import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import Wishlist from "./pages/Wishlist";
import Home from "./pages/Home";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <Toaster
  position="top-center"
  toastOptions={{
    style: {
      background: "#2b2d42",
      color: "#fff",
      fontSize: "13.5px",
      borderRadius: "10px",
      padding: "10px 16px",
    },
    success: { iconTheme: { primary: "#06d6a0", secondary: "#fff" } },
    error: { iconTheme: { primary: "#ff6b35", secondary: "#fff" } },
  }}
/>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route
        path="/cart"
        element={
          <ProtectedRoute>
          <Cart />
          </ProtectedRoute>
         }
        />
        <Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  }
/> 
      <Route
  path="/orders"
  element={
    <ProtectedRoute>
      <Orders />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin"
  element={
    <ProtectedRoute adminOnly={true}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/wishlist"
  element={
    <ProtectedRoute>
      <Wishlist />
    </ProtectedRoute>
  }
/>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;