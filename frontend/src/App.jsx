import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
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
            <ProtectedRoute>
              <PublicLayout>
                <Wishlist />
              </PublicLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <Cart />
              </PublicLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <Checkout />
              </PublicLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/thanks"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <Thanks />
              </PublicLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-account"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <MyAccount />
              </PublicLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-tracking"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <OrderTracking />
              </PublicLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <ProtectedRoute guestOnly>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute guestOnly>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admindash"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDash />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createadmin"
          element={
            <ProtectedRoute requireAdmin>
              <CreateAdmin />
            </ProtectedRoute>
          }
        />

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