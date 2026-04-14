import { useEffect, useState } from "react";
import {
  fetchAdmins,
  createAdminUser,
  deleteAdminUser
} from "../services/adminService";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CreateAdmin() {
  const [adminUser] = useState({
    username: "admin"
  });

  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("alert-info");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: ""
  });

  useEffect(() => {
    async function loadAdmins() {
      try {
        setLoading(true);
        const data = await fetchAdmins();
        setAdmins(data);
      } catch (error) {
        setMessage(error.message);
        setMessageClass("alert-danger");
      } finally {
        setLoading(false);
      }
    }

    loadAdmins();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await createAdminUser(formData);
      const refreshed = await fetchAdmins();

      setAdmins(refreshed);
      setFormData({
        email: "",
        username: "",
        password: ""
      });
      setMessage(data.message || "Admin account created successfully.");
      setMessageClass("alert-success");
    } catch (error) {
      setMessage(error.message);
      setMessageClass("alert-danger");
    }
  };

  const handleDeleteAdminAccount = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this admin account?"
    );
    if (!confirmed) return;

    try {
      const data = await deleteAdminUser(id);
      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
      setMessage(data.message || "Admin account deleted successfully.");
      setMessageClass("alert-success");
    } catch (error) {
      setMessage(error.message);
      setMessageClass("alert-danger");
    }
  };

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

      <div className="container mt-5 mb-5">
        <h2 className="fw-bold mb-4">Create Admin Account</h2>

        {message && (
          <div className={`alert ${messageClass}`} role="alert">
            {message}
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="fw-bold mb-3">New Admin</h5>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-dark w-100">
                    Create Admin
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Admin List</h5>

                {loading ? (
                  <p className="text-muted mb-0">Loading admin accounts...</p>
                ) : admins.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Email</th>
                          <th>Username</th>
                          <th>Role</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {admins.map((admin) => (
                          <tr key={admin.id}>
                            <td>{admin.id}</td>
                            <td>{admin.email}</td>
                            <td>{admin.username}</td>
                            <td>{admin.role}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteAdminAccount(admin.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted mb-0">No admin accounts found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}