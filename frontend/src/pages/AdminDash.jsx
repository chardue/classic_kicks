import { useEffect, useState } from "react";
import { fetchAdminDashboardSummary } from "../services/adminService";
import { Link } from "react-router-dom";
import PageLoader from "../components/PageLoader";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminDash() {
  const [adminUser] = useState({
    username: "admin"
  });

  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalStock: 0,
    totalSales: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatMoney = (value) =>
    Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2
    });

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const data = await fetchAdminDashboardSummary();
        setSummary(data.summary || {});
        setRecentOrders(data.recentOrders || []);
        setLowStockProducts(data.lowStockProducts || []);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const adminNavClass = ({ isActive }) =>
  `btn btn-sm me-2 ${isActive ? "btn-light text-dark" : "btn-outline-light"}`;

  if (loading) return <PageLoader text="Loading product..." />;

  return (
    <div>
      <nav className="admin-header d-flex align-items-center justify-content-between bg-dark p-3">
        <div className="d-flex align-items-center">
          <h4 className="mb-0 text-white me-4">Admin Panel</h4>

          <NavLink to="/admindash" className={adminNavClass}>
            Dashboard
          </NavLink>

          <NavLink to="/admin" className={adminNavClass}>
            Manage Products
          </NavLink>

          <NavLink to="/createadmin" className={adminNavClass}>
            Manage Admins
          </NavLink>
        </div>

        <div className="d-flex align-items-center">
          <span className="me-3 text-white">Welcome, {user?.username || "admin"}</span>
          <button
            type="button"
            className="btn btn-outline-light btn-sm text-decoration-none"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mt-4 mb-5">
        <h3 className="mb-4">📊 Admin Dashboard</h3>

        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card text-center shadow">
              <div className="card-body">
                <h6>Total Orders</h6>
                <h3>{summary.totalOrders}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow">
              <div className="card-body">
                <h6>Total Products</h6>
                <h3>{summary.totalProducts}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow">
              <div className="card-body">
                <h6>Total Stock</h6>
                <h3>{summary.totalStock}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow">
              <div className="card-body">
                <h6>Total Sales</h6>
                <h3>₱{formatMoney(summary.totalSales)}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-7">
            <div className="card shadow">
              <div className="card-body">
                <h6>Recent Orders</h6>

                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.username}</td>
                        <td>{order.order_date}</td>
                        <td>₱{formatMoney(order.total)}</td>
                        <td>{order.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card shadow">
              <div className="card-body">
                <h6>Low Stock Products</h6>

                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Total Stock</th>
                    </tr>
                  </thead>

                  <tbody>
                    {lowStockProducts.map((product, index) => (
                      <tr key={index}>
                        <td>{product.name}</td>
                        <td>{product.total_stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}