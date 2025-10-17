// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
// Contexts
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Categories from "./pages/Categories";
import SearchResults from "./pages/SearchResults";
import Troubleshooting from "./pages/Troubleshooting";
import Support from "./pages/Support";
import MealPlans from "./pages/MealPlans";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductsManagement from "./pages/admin/ProductsManagement";
import CategoriesManagement from "./pages/admin/CategoriesManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";
import AdminOrderDetail from "./pages/admin/OrderDetail";

// Layout Components
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

const AdminLayout = ({ children }) => (
  <div className="min-h-screen">
    {children}
  </div>
);

const AppContent = () => {
  return (
    <>
      <Routes>
        {/* Public Routes with Header & Footer */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
        <Route path="/products/category/:categoryId" element={<PublicLayout><Products /></PublicLayout>} />
        <Route path="/product/:productId" element={<PublicLayout><ProductDetail /></PublicLayout>} />
        <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
        <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
        <Route path="/orders" element={<PublicLayout><Orders /></PublicLayout>} />
        <Route path="/orders/:orderId" element={<PublicLayout><OrderDetail /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        <Route path="/categories" element={<PublicLayout><Categories /></PublicLayout>} />
        <Route path="/search" element={<PublicLayout><SearchResults /></PublicLayout>} />
        <Route path="/troubleshoot" element={<PublicLayout><Troubleshooting /></PublicLayout>} />
        <Route path="/support" element={<PublicLayout><Support /></PublicLayout>} />
        <Route path="/meal" element={<PublicLayout><MealPlans /></PublicLayout>} />

        {/* Admin Routes - No Header/Footer */}
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout><ProductsManagement /></AdminLayout>} />
        <Route path="/admin/categories" element={<AdminLayout><CategoriesManagement /></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><OrdersManagement /></AdminLayout>} />
        <Route path="/admin/orders/:orderId" element={<AdminLayout><AdminOrderDetail /></AdminLayout>} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);