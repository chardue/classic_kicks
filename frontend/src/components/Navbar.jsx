import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Kicks 'N Styles
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                Shop
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                About
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                Contact
              </NavLink>
            </li>
          </ul>

          <form className="d-flex me-3">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search products..."
            />
            <button className="btn btn-outline-dark" type="submit">
              Search
            </button>
          </form>

          <div className="d-flex align-items-center gap-3">
            <Link to="/wishlist" className="btn btn-outline-dark btn-sm">
              ❤️
            </Link>

            <Link to="/cart" className="btn btn-outline-dark btn-sm">
              🛒
            </Link>
                
            {/* <Link to="/wishlist" className="btn btn-outline-dark btn-sm">
              ❤️
            </Link>

            <Link to="/cart" className="btn btn-outline-dark btn-sm">
              🛒
            </Link>  */}

            {loading ? (
              <span className="text-muted small">Loading...</span>
            ) : !isLoggedIn ? (
              <>
                <Link to="/login" className="btn btn-outline-dark btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-dark btn-sm">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/my-account" className="btn btn-outline-dark btn-sm">
                  {user?.username || "My Account"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger btn-sm"
                  type="button"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}