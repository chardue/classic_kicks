import { useEffect, useMemo, useState } from "react";
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  fetchAdminOrders,
  updateAdminOrderStatus,
  fetchBestSellerReport,
  fetchWishlistAlerts
} from "../services/adminService";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../components/PageLoader";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("#create");
  const [editingProductId, setEditingProductId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("alert-info");
  const [loading, setLoading] = useState(true);

  const [adminUser] = useState({
    username: "admin"
  });

  const [brands] = useState([
    { id: 1, name: "Nike" },
    { id: 2, name: "Adidas" },
    { id: 3, name: "Jordan" },
    { id: 4, name: "Under Armour" },
    { id: 5, name: "Anta" },
    { id: 6, name: "Converse" },
    { id: 7, name: "New Balance" },
    { id: 8, name: "Puma" }
  ]);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlistAlerts, setWishlistAlerts] = useState([]);
  const [bestSellerData, setBestSellerData] = useState([]);

  const emptyProductForm = {
    name: "",
    brand_id: "",
    description: "",
    price: "",
    image: "",
    stock: {
      XS: 0,
      S: 0,
      M: 0,
      L: 0,
      XL: 0
    }
  };

  const [createForm, setCreateForm] = useState(emptyProductForm);
  const [editForm, setEditForm] = useState(emptyProductForm);

  useEffect(() => {
    const savedTab = localStorage.getItem("activeAdminTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeAdminTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);

        const [productData, orderData, reportData, wishlistData] =
          await Promise.all([
            fetchAdminProducts(),
            fetchAdminOrders(),
            fetchBestSellerReport(),
            fetchWishlistAlerts()
          ]);

        setProducts(productData);
        setOrders(orderData);
        setBestSellerData(reportData);
        setWishlistAlerts(wishlistData);
      } catch (error) {
        setMessage(error.message);
        setMessageClass("alert-danger");
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  const formatMoney = (value) =>
    Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 });

  const getTotalStock = (stock) => {
    return Object.values(stock).reduce((sum, qty) => sum + Number(qty || 0), 0);
  };

  const getAvailableSizes = (stock) => {
    return Object.entries(stock)
      .filter(([, qty]) => Number(qty) > 0)
      .map(([size]) => size)
      .join(", ");
  };

  const showFlash = (text, type = "alert-success") => {
    setMessage(text);
    setMessageClass(type);
  };

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== "#list") {
      setEditingProductId(null);
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateStockChange = (size, value) => {
    setCreateForm((prev) => ({
      ...prev,
      stock: {
        ...prev.stock,
        [size]: Number(value)
      }
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await createAdminProduct({
        ...createForm,
        brand_id: Number(createForm.brand_id)
      });

      const refreshed = await fetchAdminProducts();
      setProducts(refreshed);
      setCreateForm(emptyProductForm);
      showFlash(data.message || "Product added successfully.");
      setActiveTab("#list");
    } catch (error) {
      showFlash(error.message, "alert-danger");
    }
  };

  const openEditProduct = (product) => {
    setEditingProductId(product.id);
    setEditForm({
      name: product.name,
      brand_id: product.brand_id,
      description: product.description,
      price: product.price,
      image: product.image,
      stock: { ...product.stock }
    });
    setActiveTab("#list");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditStockChange = (size, value) => {
    setEditForm((prev) => ({
      ...prev,
      stock: {
        ...prev.stock,
        [size]: Number(value)
      }
    }));
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      const data = await updateAdminProduct(editingProductId, {
        ...editForm,
        brand_id: Number(editForm.brand_id)
      });

      const refreshed = await fetchAdminProducts();
      setProducts(refreshed);
      setEditingProductId(null);
      showFlash(data.message || "Product updated successfully.");
    } catch (error) {
      showFlash(error.message, "alert-danger");
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      const data = await deleteAdminProduct(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
      showFlash(data.message || "Product deleted successfully.");
    } catch (error) {
      showFlash(error.message, "alert-danger");
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const data = await updateAdminOrderStatus(orderId, newStatus);

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      showFlash(data.message || "Order status updated.");
    } catch (error) {
      showFlash(error.message, "alert-danger");
    }
  };

  const bestSellerRows = useMemo(() => {
    return bestSellerData;
  }, [bestSellerData]);

  if (loading) return <PageLoader text="Loading product..." />;

  return (
    <div>
      <nav className="admin-header d-flex align-items-center justify-content-between bg-dark p-3">
        <div className="d-flex align-items-center flex-wrap">
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
        {message && <div className={`alert ${messageClass}`}>{message}</div>}

        <ul className="nav admin-nav-tabs" role="tablist">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "#create" ? "active" : ""}`}
              type="button"
              onClick={() => handleTabChange("#create")}
            >
              Create Product
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "#list" ? "active" : ""}`}
              type="button"
              onClick={() => handleTabChange("#list")}
            >
              Product List
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "#report" ? "active" : ""}`}
              type="button"
              onClick={() => handleTabChange("#report")}
            >
              Best Seller Report
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "#orders" ? "active" : ""}`}
              type="button"
              onClick={() => handleTabChange("#orders")}
            >
              Orders
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "#wishlist-alert" ? "active" : ""
              }`}
              type="button"
              onClick={() => handleTabChange("#wishlist-alert")}
            >
              Wishlist Alerts
            </button>
          </li>
        </ul>

        <div className="tab-content">
          {activeTab === "#create" && (
            <div className="tab-pane fade show active">
              <div className="mt-3">
                <form className="mb-5" onSubmit={handleCreateSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={createForm.name}
                      onChange={handleCreateChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Brand</label>
                    <select
                      className="form-select"
                      name="brand_id"
                      value={createForm.brand_id}
                      onChange={handleCreateChange}
                      required
                    >
                      <option value="" disabled>
                        Select Brand
                      </option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={createForm.description}
                      onChange={handleCreateChange}
                    ></textarea>
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Price (₱)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-control"
                      name="price"
                      value={createForm.price}
                      onChange={handleCreateChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <div className="row">
                      {["XS", "S", "M", "L", "XL"].map((size) => (
                        <div className="col-md-2 col-4" key={size}>
                          <label className="form-label small">{size}</label>
                          <input
                            type="number"
                            className="form-control"
                            min="0"
                            value={createForm.stock[size]}
                            onChange={(e) =>
                              handleCreateStockChange(size, e.target.value)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Image</label>
                    <input
                      type="text"
                      className="form-control"
                      name="image"
                      placeholder="images/products/sample.webp"
                      value={createForm.image}
                      onChange={handleCreateChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-dark">
                    Add Product
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "#list" && (
            <div className="tab-pane fade show active">
              <div className="mt-4">
                {!editingProductId && products.length > 0 && (
                  <>
                    <h5>Product List</h5>
                    <div className="table-responsive">
                      <table className="table table-bordered align-middle">
                        <thead className="table-dark">
                          <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Price (₱)</th>
                            <th>Qty</th>
                            <th>Sizes</th>
                            <th>Description</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {products.map((product) => (
                            <tr key={product.id}>
                              <td>{product.id}</td>
                              <td>
                                <img
                                  src={
                                    product.image?.startsWith("/")
                                      ? product.image
                                      : `/${product.image}`
                                  }
                                  alt="Product"
                                  style={{ width: "60px" }}
                                />
                              </td>
                              <td>{product.name}</td>
                              <td>{product.brand_name}</td>
                              <td>{formatMoney(product.price)}</td>
                              <td>{getTotalStock(product.stock)}</td>
                              <td>{getAvailableSizes(product.stock)}</td>
                              <td>{product.description}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-warning me-2"
                                  onClick={() => openEditProduct(product)}
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {editingProductId && (
                  <>
                    <h5>Edit Product (ID: {editingProductId})</h5>

                    <form onSubmit={handleUpdateProduct}>
                      <div className="mb-3">
                        <label className="form-label">Product Name</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={editForm.name}
                          onChange={handleEditChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Brand</label>
                        <select
                          name="brand_id"
                          className="form-select"
                          value={editForm.brand_id}
                          onChange={handleEditChange}
                          required
                        >
                          {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          name="description"
                          className="form-control"
                          rows="3"
                          value={editForm.description}
                          onChange={handleEditChange}
                        ></textarea>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Price (₱)</label>
                        <input
                          type="number"
                          step="0.01"
                          name="price"
                          className="form-control"
                          value={editForm.price}
                          onChange={handleEditChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Quantity</label>
                        <div className="row">
                          {["XS", "S", "M", "L", "XL"].map((size) => (
                            <div className="col-md-2 col-4" key={size}>
                              <label className="form-label small">{size}</label>
                              <input
                                type="number"
                                className="form-control"
                                min="0"
                                value={editForm.stock[size]}
                                onChange={(e) =>
                                  handleEditStockChange(size, e.target.value)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Image URL</label>
                        <input
                          type="text"
                          name="image"
                          className="form-control"
                          value={editForm.image}
                          onChange={handleEditChange}
                          required
                        />
                      </div>

                      <button type="submit" className="btn btn-success">
                        Update Product
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => setEditingProductId(null)}
                      >
                        Cancel
                      </button>
                    </form>
                  </>
                )}

                {!editingProductId && products.length === 0 && (
                  <p className="text-muted">No products found.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "#report" && (
            <div className="tab-pane fade show active">
              <div className="mt-4">
                <h5 className="text-center mb-3">
                  Best Sellers (by Quantity Sold)
                </h5>

                <div className="table-responsive">
                  <table className="table table-bordered align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>Brand</th>
                        <th>Total Sold</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bestSellerRows.map((row, index) => (
                        <tr key={index}>
                          <td>{row.brand_name}</td>
                          <td>{row.total_sold}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "#orders" && (
            <div className="tab-pane fade show active">
              <div className="mt-4">
                <h5>Orders</h5>
                <div className="table-responsive">
                  <table className="table table-bordered align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.length > 0 ? (
                        orders.map((order) => {
                          const currentStatus = String(order.status || "").toLowerCase();

                          return (
                            <tr key={order.id}>
                              <td>{order.id}</td>
                              <td>{order.username}</td>
                              <td>{order.order_date}</td>
                              <td>₱{formatMoney(order.total)}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <select
                                    className="form-select form-select-sm me-2"
                                    value={order.status}
                                    onChange={(e) =>
                                      handleOrderStatusChange(order.id, e.target.value)
                                    }
                                  >
                                    <option value="Pending">Order Placed</option>
                                    <option value="packed">Packed</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="completed">Delivered</option>
                                    <option value="Canceled">Canceled</option>
                                  </select>

                                  {currentStatus === "canceled" && (
                                    <span className="badge bg-danger ms-2">
                                      Canceled
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center text-muted">
                            No orders yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "#wishlist-alert" && (
            <div className="tab-pane fade show active">
              <div className="mt-4">
                <h5>Out-of-Stock Products in Wishlists</h5>

                {wishlistAlerts.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th>Image</th>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Wishlists Count</th>
                        </tr>
                      </thead>

                      <tbody>
                        {wishlistAlerts.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <img
                                src={
                                  item.image?.startsWith("/")
                                    ? item.image
                                    : `/${item.image}`
                                }
                                alt={item.name}
                                style={{ width: "60px" }}
                              />
                            </td>
                            <td>{item.name}</td>
                            <td>₱{formatMoney(item.price)}</td>
                            <td>{item.wishlist_count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">No products in wishlists.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}