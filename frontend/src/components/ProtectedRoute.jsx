import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "./PageLoader";

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  guestOnly = false
}) {
  const { user, isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader text="Loading product..." />;

  if (guestOnly && isLoggedIn) {
    if (user?.role === "admin") {
      return <Navigate to="/admindash" replace />;
    }
    return <Navigate to="/" replace />;
  }

  if (!guestOnly && !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}