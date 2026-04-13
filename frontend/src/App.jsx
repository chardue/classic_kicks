import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Thanks from "./pages/Thanks";
import MyAccount from "./pages/MyAccount";
import OrderTracking from "./pages/OrderTracking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import AdminDash from "./pages/AdminDash";
import CreateAdmin from "./pages/CreateAdmin";

function PublicLayout({ children }) {
  return (
    <>
      <Header>{children}</Header>
      <Footer />
    </>
  );
}

function AuthLayout({ children }) {
  return <>{children}</>;
}

function AdminLayout({ children }) {
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public store pages */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />
        <Route
          path="/shop"
          element={
            <PublicLayout>
              <Shop />
            </PublicLayout>
          }
        />
        <Route
          path="/product"
          element={
            <PublicLayout>
              <Product />
            </PublicLayout>
          }
        />
        <Route
          path="/wishlist"
          element={
            <PublicLayout>
              <Wishlist />
            </PublicLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <PublicLayout>
              <Cart />
            </PublicLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <PublicLayout>
              <Checkout />
            </PublicLayout>
          }
        />
        <Route
          path="/thanks"
          element={
            <PublicLayout>
              <Thanks />
            </PublicLayout>
          }
        />
        <Route
          path="/my-account"
          element={
            <PublicLayout>
              <MyAccount />
            </PublicLayout>
          }
        />
        <Route
          path="/order-tracking"
          element={
            <PublicLayout>
              <OrderTracking />
            </PublicLayout>
          }
        />

        {/* Auth pages */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />

        {/* Admin pages */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <Admin />
            </AdminLayout>
          }
        />
        <Route
          path="/admindash"
          element={
            <AdminLayout>
              <AdminDash />
            </AdminLayout>
          }
        />
        <Route
          path="/createadmin"
          element={
            <AdminLayout>
              <CreateAdmin />
            </AdminLayout>
          }
        />

        {/* Fallback route */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <div className="container py-5">
                <h1 className="fw-bold">404</h1>
                <p className="mb-0">Page not found.</p>
              </div>
            </PublicLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}