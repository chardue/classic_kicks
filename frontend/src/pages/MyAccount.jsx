import { useEffect, useMemo, useState } from "react";

export default function MyAccount() {
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("alert-info");
  const [activeTab, setActiveTab] = useState("#account");

  const [user, setUser] = useState({
    email: "sampleuser@gmail.com",
    username: "sampleuser"
  });

  const [customer, setCustomer] = useState({
    email: "sampleuser@gmail.com",
    first_name: "John",
    last_name: "Doe",
    phone: "9123456789"
  });

  const [addresses, setAddresses] = useState([
    {
      address_id: 1,
      address_name: "Home",
      house_street: "123 Shoe Street",
      barangay: "Barangay 123",
      city: "Manila",
      province: "Metro Manila",
      region: "NCR",
      postal_code: "1000",
      country: "Philippines",
      is_default: true
    },
    {
      address_id: 2,
      address_name: "Office",
      house_street: "45 Sneaker Ave",
      barangay: "Barangay 456",
      city: "Quezon City",
      province: "Metro Manila",
      region: "NCR",
      postal_code: "1100",
      country: "Philippines",
      is_default: false
    }
  ]);

  const [orders, setOrders] = useState([
    {
      order_id: 101,
      order_date: "2026-04-10",
      total: 17790,
      status: "Pending",
      address: {
        house_street: "123 Shoe Street",
        barangay: "Barangay 123",
        city: "Manila",
        province: "Metro Manila",
        region: "NCR",
        postal_code: "1000",
        country: "Philippines"
      },
      items: [
        {
          product_name: "Nike Air Force 1",
          image: "/images/products/AF1.webp",
          quantity: 2,
          price: 5495,
          size: "M"
        },
        {
          product_name: "Adidas Samba OG",
          image: "/images/products/AdidasSambaOG.webp",
          quantity: 1,
          price: 6800,
          size: "S"
        }
      ]
    },
    {
      order_id: 102,
      order_date: "2026-04-05",
      total: 7995,
      status: "Completed",
      address: {
        house_street: "45 Sneaker Ave",
        barangay: "Barangay 456",
        city: "Quezon City",
        province: "Metro Manila",
        region: "NCR",
        postal_code: "1100",
        country: "Philippines"
      },
      items: [
        {
          product_name: "New Balance 550",
          image: "/images/products/NB550.webp",
          quantity: 1,
          price: 7995,
          size: "L"
        }
      ]
    }
  ]);

  const [editAccountForm, setEditAccountForm] = useState({
    first_name: customer.first_name || "",
    last_name: customer.last_name || "",
    email: customer.email || user.email || "",
    phone: customer.phone || ""
  });

  const [changeUsernameForm, setChangeUsernameForm] = useState({
    username: user.username || ""
  });

  const [changePasswordForm, setChangePasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  const emptyAddressForm = {
    address_name: "",
    house_street: "",
    barangay: "",
    city: "",
    province: "",
    region: "",
    postal_code: "",
    country: "Philippines",
    is_default: false
  };

  const [addAddressForm, setAddAddressForm] = useState(emptyAddressForm);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    setEditAccountForm({
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      email: customer.email || user.email || "",
      phone: customer.phone || ""
    });
  }, [customer, user]);

  useEffect(() => {
    setChangeUsernameForm({
      username: user.username || ""
    });
  }, [user]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      setMessage("");
      setMessageClass("alert-info");
    }, 2000);
    return () => clearTimeout(timer);
  }, [message]);

  const formatMoney = (value) =>
    Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 });

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });

  const canCancelOrder = (order) => {
    const orderTime = new Date(order.order_date).getTime();
    const now = new Date().getTime();
    const timeDiff = now - orderTime;
    return timeDiff <= 3600 * 1000 && order.status === "Pending";
  };

  const notificationOrders = useMemo(() => {
    return [...orders].sort(
      (a, b) => new Date(b.order_date) - new Date(a.order_date)
    );
  }, [orders]);

  const showFlash = (text, type = "alert-success") => {
    setMessage(text);
    setMessageClass(type);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    showFlash("Logout clicked.", "alert-success");
  };

  const handleEditAccountChange = (e) => {
    const { name, value } = e.target;
    setEditAccountForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();

    setCustomer((prev) => ({
      ...prev,
      first_name: editAccountForm.first_name,
      last_name: editAccountForm.last_name,
      email: editAccountForm.email,
      phone: editAccountForm.phone
    }));

    setUser((prev) => ({
      ...prev,
      email: editAccountForm.email
    }));

    showFlash("Personal information updated successfully!");
  };

  const handleUsernameChange = (e) => {
    const { name, value } = e.target;
    setChangeUsernameForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUsername = (e) => {
    e.preventDefault();

    if (!changeUsernameForm.username.trim()) {
      showFlash("Username cannot be empty.", "alert-danger");
      return;
    }

    setUser((prev) => ({
      ...prev,
      username: changeUsernameForm.username.trim()
    }));

    showFlash("Username updated successfully!");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setChangePasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePassword = (e) => {
    e.preventDefault();

    if (
      !changePasswordForm.current_password ||
      !changePasswordForm.new_password ||
      !changePasswordForm.confirm_password
    ) {
      showFlash("Please fill in all password fields.", "alert-danger");
      return;
    }

    if (changePasswordForm.new_password !== changePasswordForm.confirm_password) {
      showFlash("New passwords do not match.", "alert-danger");
      return;
    }

    setChangePasswordForm({
      current_password: "",
      new_password: "",
      confirm_password: ""
    });

    showFlash("Password updated successfully!");
  };

  const handleAddAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();

    const newAddress = {
      ...addAddressForm,
      address_id: Date.now()
    };

    let nextAddresses = [...addresses];

    if (newAddress.is_default) {
      nextAddresses = nextAddresses.map((addr) => ({
        ...addr,
        is_default: false
      }));
    }

    setAddresses([...nextAddresses, newAddress]);
    setAddAddressForm(emptyAddressForm);
    showFlash("Address added successfully!");
  };

  const openEditAddress = (address) => {
    setEditingAddress({ ...address });
  };

  const handleEditAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSaveEditedAddress = (e) => {
    e.preventDefault();
    if (!editingAddress) return;

    let nextAddresses = [...addresses];

    if (editingAddress.is_default) {
      nextAddresses = nextAddresses.map((addr) => ({
        ...addr,
        is_default: false
      }));
    }

    nextAddresses = nextAddresses.map((addr) =>
      addr.address_id === editingAddress.address_id ? editingAddress : addr
    );

    setAddresses(nextAddresses);
    setEditingAddress(null);
    showFlash("Address updated successfully!");
  };

  const handleDeleteAddress = (addressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );
    if (!confirmed) return;

    setAddresses((prev) =>
      prev.filter((addr) => addr.address_id !== addressId)
    );
    showFlash("Address deleted successfully!");
  };

  const handleDeleteOrder = (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order receipt?"
    );
    if (!confirmed) return;

    setOrders((prev) => prev.filter((order) => order.order_id !== orderId));
    showFlash("Order receipt deleted successfully!");
  };

  const handleCancelOrder = (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmed) return;

    setOrders((prev) =>
      prev.map((order) =>
        order.order_id === orderId ? { ...order, status: "Canceled" } : order
      )
    );
    showFlash("Order canceled successfully!");
  };

  return (
    <div className="container mt-5 mb-5">
      {message && (
        <div className={`alert ${messageClass} alert-dismissible fade show`} role="alert">
          {message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage("")}
          ></button>
        </div>
      )}

      <div className="row">
        <div className="col-md-3">
          <h2 className="fw-bold mb-4">My Account</h2>

          <div className="d-flex align-items-center mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
              alt="User Icon"
              width="50"
              className="me-2"
            />
            <span className="fw-bold fs-5">{user.username}</span>
          </div>

          <div className="nav flex-column nav-pills gap-2" role="tablist">
            <button
              className={`btn btn-outline-dark text-start ${
                activeTab === "#account" ? "active" : ""
              }`}
              type="button"
              onClick={() => setActiveTab("#account")}
            >
              Account
            </button>

            <button
              className={`btn btn-outline-dark text-start ${
                activeTab === "#orders" ? "active" : ""
              }`}
              type="button"
              onClick={() => setActiveTab("#orders")}
            >
              Orders
            </button>

            <button
              className={`btn btn-outline-dark text-start ${
                activeTab === "#orderNotifications" ? "active" : ""
              }`}
              type="button"
              onClick={() => setActiveTab("#orderNotifications")}
            >
              Order Notifications
            </button>

            <button className="btn btn-danger text-start" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="col-md-9">
          <div className="tab-content">
            {activeTab === "#account" && (
              <div className="tab-pane fade show active" id="account">
                <div className="card shadow-sm border-0 mb-4">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Personal Information</h5>
                    <button
                      className="btn btn-sm btn-dark"
                      data-bs-toggle="modal"
                      data-bs-target="#editAccountModal"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="card-body row g-3">
                    <div className="col-md-6">
                      <strong>First Name:</strong> {customer.first_name || ""}
                    </div>
                    <div className="col-md-6">
                      <strong>Last Name:</strong> {customer.last_name || ""}
                    </div>
                    <div className="col-md-6">
                      <strong>Email:</strong> {customer.email || user.email}
                    </div>
                    <div className="col-md-6">
                      <strong>Phone:</strong>
                      <span>&nbsp;+63</span> {customer.phone || ""}
                    </div>
                    <div className="col-12 mt-3">
                      <button
                        className="btn btn-dark me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#changeUsernameModal"
                      >
                        Change Username
                      </button>
                      <button
                        className="btn btn-dark"
                        data-bs-toggle="modal"
                        data-bs-target="#changePasswordModal"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card shadow-sm border-0 mb-4" id="address">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Address Information</h5>
                    <button
                      className="btn btn-sm btn-dark"
                      data-bs-toggle="modal"
                      data-bs-target="#addAddressModal"
                    >
                      + Add New Address
                    </button>
                  </div>

                  <div className="card-body">
                    {addresses.length > 0 ? (
                      <div className="row g-3">
                        {addresses.map((addr) => (
                          <div className="col-md-6" key={addr.address_id}>
                            <div className="border rounded p-3 h-100">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="fw-bold mb-1">{addr.address_name}</h6>
                                  <p className="mb-1 small">
                                    {addr.house_street}
                                    <br />
                                    {addr.barangay}, {addr.city}
                                    <br />
                                    {addr.province}, {addr.region}
                                    <br />
                                    {addr.postal_code}, {addr.country}
                                  </p>
                                  {addr.is_default && (
                                    <span className="badge bg-primary">Default</span>
                                  )}
                                </div>

                                <div>
                                  <button
                                    className="btn btn-sm btn-dark me-1"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editAddressModal"
                                    onClick={() => openEditAddress(addr)}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDeleteAddress(addr.address_id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">
                        You haven't added any addresses yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "#orders" && (
              <div className="tab-pane fade show active" id="orders">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">My Orders</h5>

                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <div
                          className="border rounded p-3 mb-4 bg-light position-relative"
                          key={order.order_id}
                        >
                          <div
                            className="position-absolute"
                            style={{ top: "10px", right: "10px" }}
                          >
                            <button
                              type="button"
                              className="btn btn-sm btn-danger me-1 delete-order-btn"
                              onClick={() => handleDeleteOrder(order.order_id)}
                            >
                              Delete
                            </button>

                            {canCancelOrder(order) && (
                              <button
                                type="button"
                                className="btn btn-sm btn-dark"
                                onClick={() => handleCancelOrder(order.order_id)}
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>

                          <h6 className="mb-1">Order #: {order.order_id}</h6>
                          <h6 className="text-muted small mb-1">
                            Status:
                            <span
                              className={`badge ms-1 ${
                                order.status === "Canceled"
                                  ? "bg-danger"
                                  : order.status === "Pending"
                                  ? "bg-warning text-dark"
                                  : "bg-success"
                              }`}
                            >
                              {order.status}
                            </span>
                          </h6>

                          <p className="text-muted small mb-1">
                            Date: {formatDate(order.order_date)}
                          </p>

                          {order.address?.house_street && (
                            <p className="text-muted small mb-1">
                              Delivered To:{" "}
                              {`${order.address.house_street}, ${order.address.barangay}, ${order.address.city}, ${order.address.province}, ${order.address.region}, ${order.address.postal_code}, ${order.address.country}`}
                            </p>
                          )}

                          <p className="fw-bold mb-3">
                            Total: ₱ {formatMoney(order.total)}
                          </p>

                          <a
                            href={`/thanks?order_id=${order.order_id}`}
                            className="btn btn-primary btn-sm mb-3"
                          >
                            🧾 View Receipt
                          </a>

                          <div className="row g-3">
                            {order.items.map((item, index) => (
                              <div
                                className="col-md-6 d-flex align-items-center border rounded p-2 bg-white"
                                key={`${order.order_id}-${index}`}
                              >
                                <img
                                  src={item.image}
                                  alt={item.product_name}
                                  className="me-2"
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    objectFit: "cover",
                                    borderRadius: "8px"
                                  }}
                                />
                                <div>
                                  <p className="mb-1 fw-bold">{item.product_name}</p>
                                  <small>
                                    Qty: {item.quantity} × ₱ {formatMoney(item.price)}
                                    <br />
                                    Size: {item.size}
                                  </small>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">
                        You haven’t placed any orders yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "#orderNotifications" && (
              <div
                className="tab-pane fade show active"
                id="orderNotifications"
                role="tabpanel"
              >
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">Order Notifications & Tracking</h5>

                    {notificationOrders.length > 0 ? (
                      notificationOrders.map((order) => (
                        <div className="card mb-3 shadow-sm p-3" key={order.order_id}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1 fw-bold">
                                Order #{order.order_id}
                              </h6>
                              <p className="mb-1 text-muted small">
                                Date: {formatDate(order.order_date)}
                              </p>
                              <p className="mb-1">
                                Status:{" "}
                                <strong>
                                  <span
                                    className={
                                      order.status === "Canceled"
                                        ? "text-danger"
                                        : order.status === "Pending"
                                        ? "text-warning"
                                        : "text-success"
                                    }
                                  >
                                    {order.status}
                                  </span>
                                </strong>
                              </p>
                              <p className="mb-0 fw-bold">
                                Total: ₱ {formatMoney(order.total)}
                              </p>
                            </div>

                            <div>
                              <a
                                href={`/order-tracking?order_id=${order.order_id}`}
                                className="btn btn-sm btn-primary"
                              >
                                Track Order
                              </a>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No orders found.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="modal fade" id="editAccountModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSaveAccount}>
              <div className="modal-header">
                <h5 className="modal-title">Edit Personal Information</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>

              <div className="modal-body row g-3">
                <div className="col-md-6">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    className="form-control"
                    value={editAccountForm.first_name}
                    onChange={handleEditAccountChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    className="form-control"
                    value={editAccountForm.last_name}
                    onChange={handleEditAccountChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={editAccountForm.email}
                    onChange={handleEditAccountChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <div className="input-group mb-3">
                    <span className="input-group-text">+63</span>
                    <input
                      name="phone"
                      className="form-control"
                      type="number"
                      min="0"
                      max="9999999999"
                      value={editAccountForm.phone}
                      onChange={handleEditAccountChange}
                      onInput={(e) => {
                        if (e.target.value.length > 10) {
                          e.target.value = e.target.value.slice(0, 10);
                        }
                      }}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="changeUsernameModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSaveUsername}>
              <div className="modal-header">
                <h5 className="modal-title">Change Username</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>

              <div className="modal-body">
                <label className="form-label">New Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={changeUsernameForm.username}
                  onChange={handleUsernameChange}
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-dark"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Username
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="changePasswordModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSavePassword}>
              <div className="modal-header">
                <h5 className="modal-title">Change Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>

              <div className="modal-body">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="current_password"
                  className="form-control mb-3"
                  value={changePasswordForm.current_password}
                  onChange={handlePasswordChange}
                  required
                />

                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="new_password"
                  className="form-control mb-3"
                  value={changePasswordForm.new_password}
                  onChange={handlePasswordChange}
                  required
                />

                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  className="form-control"
                  value={changePasswordForm.confirm_password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-dark"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal fade" id="addAddressModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleAddAddress}>
              <div className="modal-header">
                <h5 className="modal-title">Add New Address</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>

              <div className="modal-body row g-3">
                <div className="col-md-6">
                  <label className="form-label">Address Name</label>
                  <input
                    type="text"
                    name="address_name"
                    className="form-control"
                    placeholder="Home / Office / Parents"
                    value={addAddressForm.address_name}
                    onChange={handleAddAddressChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">House / Street</label>
                  <input
                    type="text"
                    name="house_street"
                    className="form-control"
                    value={addAddressForm.house_street}
                    onChange={handleAddAddressChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Barangay</label>
                  <input
                    type="text"
                    name="barangay"
                    className="form-control"
                    value={addAddressForm.barangay}
                    onChange={handleAddAddressChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    value={addAddressForm.city}
                    onChange={handleAddAddressChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Province</label>
                  <input
                    type="text"
                    name="province"
                    className="form-control"
                    value={addAddressForm.province}
                    onChange={handleAddAddressChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Region</label>
                  <input
                    type="text"
                    name="region"
                    className="form-control"
                    value={addAddressForm.region}
                    onChange={handleAddAddressChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Postal Code</label>
                  <input
                    name="postal_code"
                    className="form-control"
                    type="number"
                    min="0"
                    max="9999"
                    value={addAddressForm.postal_code}
                    onChange={handleAddAddressChange}
                    onInput={(e) => {
                      if (e.target.value.length > 4) {
                        e.target.value = e.target.value.slice(0, 4);
                      }
                    }}
                    placeholder="e.g., 1100"
                    required
                  />
                </div>

                <div className="col-md-6 d-flex align-items-center">
                  <div className="form-check mt-4">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="is_default"
                      checked={addAddressForm.is_default}
                      onChange={handleAddAddressChange}
                    />
                    <label className="form-check-label">Set as Default</label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal fade" id="editAddressModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            {editingAddress && (
              <form onSubmit={handleSaveEditedAddress}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    Edit Address ({editingAddress.address_name})
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>

                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Address Name</label>
                    <input
                      type="text"
                      name="address_name"
                      className="form-control"
                      value={editingAddress.address_name}
                      onChange={handleEditAddressChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">House / Street</label>
                    <input
                      type="text"
                      name="house_street"
                      className="form-control"
                      value={editingAddress.house_street}
                      onChange={handleEditAddressChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Barangay</label>
                    <input
                      type="text"
                      name="barangay"
                      className="form-control"
                      value={editingAddress.barangay}
                      onChange={handleEditAddressChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={editingAddress.city}
                      onChange={handleEditAddressChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Province</label>
                    <input
                      type="text"
                      name="province"
                      className="form-control"
                      value={editingAddress.province}
                      onChange={handleEditAddressChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Region</label>
                    <input
                      type="text"
                      name="region"
                      className="form-control"
                      value={editingAddress.region}
                      onChange={handleEditAddressChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Postal Code</label>
                    <input
                      name="postal_code"
                      className="form-control"
                      type="number"
                      min="0"
                      max="9999"
                      value={editingAddress.postal_code}
                      onChange={handleEditAddressChange}
                      onInput={(e) => {
                        if (e.target.value.length > 4) {
                          e.target.value = e.target.value.slice(0, 4);
                        }
                      }}
                      placeholder="e.g., 1100"
                      required
                    />
                  </div>

                  <div className="col-md-6 d-flex align-items-center">
                    <div className="form-check mt-4">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="is_default"
                        checked={editingAddress.is_default}
                        onChange={handleEditAddressChange}
                      />
                      <label className="form-check-label">Set as Default</label>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}