import { useEffect, useMemo, useState } from "react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("#create");
  const [editingProductId, setEditingProductId] = useState(null);
  const [message, setMessage] = useState("");

  const [adminUser] = useState({
    username: "admin"
  });

  const [brands] = useState([
    { id: 1, name: "Nike" },
    { id: 2, name: "Adidas" },
    { id: 3, name: "Jordan" },
    { id: 4, name: "Puma" },
    { id: 5, name: "Anta" },
    { id: 6, name: "Converse" },
    { id: 7, name: "New Balance" },
    { id: 8, name: "Under Armour" }
  ]);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Nike Air Force 1",
      brand_id: 1,
      brand_name: "Nike",
      description: "Classic everyday sneaker with clean and simple design.",
      price: 5495,
      image: "/images/products/AF1.webp",
      stock: { XS: 0, S: 1, M: 4, L: 2, XL: 1 }
    },
    {
      id: 2,
      name: "Adidas Samba OG",
      brand_id: 2,
      brand_name: "Adidas",
      description: "Low-profile streetwear favorite with timeless style.",
      price: 6800,
      image: "/images/products/AdidasSambaOG.webp",
      stock: { XS: 0, S: 2, M: 2, L: 0, XL: 0 }
    }
  ]);

  const [orders, setOrders] = useState([
    {
      id: 101,
      username: "sampleuser",
      order_date: "2026-04-10 09:30:00",
      total: 17790,
      status: "pending"
    },
    {
      id: 102,
      username: "john_doe",
      order_date: "2026-04-11 13:20:00",
      total: 7995,
      status: "canceled"
    }
  ]);

  const [wishlistAlerts] = useState([
    {
      id: 8,
      name: "Under Armour Curry 4",
      image: "/images/products/UnderArmourCurry4.webp",
      price: 8495,
      wishlist_count: 6
    }
  ]);

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

  const bestSellerData = useMemo(() => {
    return [
      { month: "Jan", nike: 10, adidas: 6, jordan: 4 },
      { month: "Feb", nike: 8, adidas: 7, jordan: 6 },
      { month: "Mar", nike: 12, adidas: 5, jordan: 9 },
      { month: "Apr", nike: 7, adidas: 10, jordan: 8 }
    ];
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

  const handleLogout = () => {
    console.log("Admin logout");
    setMessage("Logout clicked.");
  };

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

  const handleCreateSubmit = (e) => {
    e.preventDefault();

    const brand = brands.find((b) => String(b.id) === String(createForm.brand_id));

    const newProduct = {
      id: Date.now(),
      name: createForm.name,
      brand_id: Number(createForm.brand_id),
      brand_name: brand ? brand.name : "",
      description: createForm.description,
      price: Number(createForm.price),
      image: createForm.image || "/images/logo.png",
      stock: { ...createForm.stock }
    };

    setProducts((prev) => [newProduct, ...prev]);
    setCreateForm(emptyProductForm);
    setMessage("Product added successfully.");
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

  const handleUpdateProduct = (e) => {
    e.preventDefault();

    const brand = brands.find((b) => String(b.id) === String(editForm.brand_id));

    setProducts((prev) =>
      prev.map((product) =>
        product.id === editingProductId
          ? {
              ...product,
              name: editForm.name,
              brand_id: Number(editForm.brand_id),
              brand_name: brand ? brand.name : "",
              description: editForm.description,
              price: Number(editForm.price),
              image: editForm.image,
              stock: { ...editForm.stock }
            }
          : product
      )
    );

    setEditingProductId(null);
    setMessage("Product updated successfully.");
  };

  const handleDeleteProduct = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    setProducts((prev) => prev.filter((product) => product.id !== id));
    setMessage("Product deleted successfully.");
  };

  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setMessage("Order status updated.");
  };

  return (
    <div>
      <nav className="admin-header d-flex align-items-center justify-content-between bg-dark p-3">
        <div className="d-flex align-items-center flex-wrap">
          <h4 className="mb-0 text-white me-4">Admin Panel</h4>

          <a href="/admindash" className="btn btn-sm btn-outline-light me-2">
            Dashboard
          </a>

          <a
            href="/admin"
            className="btn btn-sm btn-outline-light me-2 active"
          >
            Manage Products
          </a>

          <a href="/createadmin" className="btn btn-sm btn-outline-light">
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
        {message && <div className="alert alert-info">{message}</div>}

        <ul className="nav admin-nav-tabs" id="adminTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "#create" ? "active" : ""}`}
              type="button"
              onClick={() => handleTabChange("#create")}
            >
              Create Product
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "#list" ? "active" : ""}`}
              type="button"
              onClick={() => handleTabChange("#list")}
            >
              Product List
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "#report" ? "active" : ""}`}
              type="button"
              onClick={() => handleTabChange("#report")}
            >
              Best Seller Report
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "#orders" ? "active" : ""}`}
              type="button"
              onClick={() => handleTabChange("#orders")}
            >
              Orders
            </button>
          </li>

          <li className="nav-item" role="presentation">
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

        <div className="tab-content" id="adminTabContent">
          {activeTab === "#create" && (
            <div className="tab-pane fade show active" id="create" role="tabpanel">
              <div className="mt-3">
                <form className="mb-5" onSubmit={handleCreateSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Product Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={createForm.name}
                      onChange={handleCreateChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="brand_id" className="form-label">
                      Brand
                    </label>
                    <select
                      className="form-select"
                      name="brand_id"
                      id="brand_id"
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
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="3"
                      value={createForm.description}
                      onChange={handleCreateChange}
                    ></textarea>
                  </div>

                  <div className="mb-2">
                    <label htmlFor="price" className="form-label">
                      Price (₱)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-control"
                      id="price"
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
                    <label htmlFor="image" className="form-label">
                      Image
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="image"
                      name="image"
                      placeholder="/images/products/sample.webp"
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
            <div className="tab-pane fade show active" id="list" role="tabpanel">
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
                                  src={product.image}
                                  alt="Product Image"
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
                        <label htmlFor="edit_name" className="form-label">
                          Product Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="edit_name"
                          className="form-control"
                          value={editForm.name}
                          onChange={handleEditChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="edit_brand_id" className="form-label">
                          Brand
                        </label>
                        <select
                          name="brand_id"
                          id="edit_brand_id"
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
                        <label htmlFor="edit_description" className="form-label">
                          Description
                        </label>
                        <textarea
                          name="description"
                          id="edit_description"
                          className="form-control"
                          rows="3"
                          value={editForm.description}
                          onChange={handleEditChange}
                        ></textarea>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="edit_price" className="form-label">
                          Price (₱)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="price"
                          id="edit_price"
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
                        <label htmlFor="edit_image" className="form-label">
                          Image URL
                        </label>
                        <input
                          type="text"
                          name="image"
                          id="edit_image"
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
            <div className="tab-pane fade show active" id="report" role="tabpanel">
              <div className="mt-4" style={{ height: "520px" }}>
                <h5 className="text-center mb-3">
                  Best Sellers (by Quantity Sold)
                </h5>

                <div className="table-responsive">
                  <table className="table table-bordered align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>Month</th>
                        <th>Nike</th>
                        <th>Adidas</th>
                        <th>Jordan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bestSellerData.map((row) => (
                        <tr key={row.month}>
                          <td>{row.month}</td>
                          <td>{row.nike}</td>
                          <td>{row.adidas}</td>
                          <td>{row.jordan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-muted mt-3">
                  Chart.js from the PHP version should be connected later through
                  API chart data.
                </p>
              </div>
            </div>
          )}

          {activeTab === "#orders" && (
            <div className="tab-pane fade show active" id="orders" role="tabpanel">
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
                          const isCanceled =
                            String(order.status).toLowerCase() === "canceled";

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
                                    disabled={isCanceled}
                                    onChange={(e) =>
                                      handleOrderStatusChange(order.id, e.target.value)
                                    }
                                  >
                                    <option value="pending">Order Placed</option>
                                    <option value="packed">Packed</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="completed">Delivered</option>
                                    <option value="canceled">Canceled</option>
                                  </select>

                                  {isCanceled && (
                                    <span className="badge bg-danger ms-2">
                                      User Canceled
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center text-muted">
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
            <div
              className="tab-pane fade show active"
              id="wishlist-alert"
              role="tabpanel"
            >
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
                                src={item.image}
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