import { useState } from "react";

export default function CreateAdmin() {
  const [adminUser] = useState({
    username: "admin"
  });

  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("alert-info");

  const [admins, setAdmins] = useState([
    {
      id: 1,
      username: "mainadmin",
      email: "mainadmin@gmail.com"
    },
    {
      id: 2,
      username: "stockmanager",
      email: "stockmanager@gmail.com"
    }
  ]);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: ""
  });

  const handleLogout = () => {
    console.log("Admin logout");
    setMessage("Logout clicked.");
    setMessageClass("alert-info");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailExists = admins.some(
      (admin) => admin.email.toLowerCase() === formData.email.toLowerCase()
    );

    const usernameExists = admins.some(
      (admin) => admin.username.toLowerCase() === formData.username.toLowerCase()
    );

    if (emailExists) {
      setMessage("Email already exists.");
      setMessageClass("alert-danger");
      return;
    }

    if (usernameExists) {
      setMessage("Username already exists.");
      setMessageClass("alert-danger");
      return;
    }

    const newAdmin = {
      id: Date.now(),
      email: formData.email,
      username: formData.username
    };

    setAdmins((prev) => [newAdmin, ...prev]);
    setFormData({
      email: "",
      username: "",
      password: ""
    });
    setMessage("Admin account created successfully.");
    setMessageClass("alert-success");
  };

  const handleDeleteAdmin = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this admin account?"
    );
    if (!confirmed) return;

    setAdmins((prev) => prev.filter((admin) => admin.id !== id));
    setMessage("Admin account deleted successfully.");
    setMessageClass("alert-success");
  };

  return (
    <div>
      <nav className="admin-header d-flex align-items-center justify-content-between bg-dark p-3">
        <div className="d-flex align-items-center">
          <h4 className="mb-0 text-white me-4">Admin Panel</h4>

          <a href="/admindash" className="btn btn-sm btn-outline-light me-2">
            Dashboard
          </a>

          <a href="/admin" className="btn btn-sm btn-outline-light me-2">
            Manage Products
          </a>

          <a
            href="/createadmin"
            className="btn btn-sm btn-outline-light active"
          >
            Manage Admins
          </a>
        </div>

        <div className="d-flex align-items-center">
          <span className="me-3 text-white">Welcome, {adminUser.username}</span>
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
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-control"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
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

                {admins.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Email</th>
                          <th>Username</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {admins.map((admin) => (
                          <tr key={admin.id}>
                            <td>{admin.id}</td>
                            <td>{admin.email}</td>
                            <td>{admin.username}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteAdmin(admin.id)}
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