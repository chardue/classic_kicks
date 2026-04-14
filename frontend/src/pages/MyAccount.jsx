import { useEffect, useMemo, useState } from "react";
import { fetchAccount, updateAccount } from "../services/accountService";
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} from "../services/addressService";
import { fetchMyOrders, cancelOrder } from "../services/orderService";
import { getImageUrl } from "../utils/image";
import { Link } from "react-router-dom";
import PageLoader from "../components/PageLoader";

export default function MyAccount() {
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("alert-info");
  const [activeTab, setActiveTab] = useState("#account");
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    email: "",
    username: ""
  });

  const [customer, setCustomer] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: ""
  });

  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  const [editAccountForm, setEditAccountForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: ""
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
    async function loadMyAccount() {
      try {
        setLoading(true);

        const [accountData, addressData, orderData] = await Promise.all([
          fetchAccount(),
          fetchAddresses(),
          fetchMyOrders()
        ]);

        setUser(accountData.user || { email: "", username: "" });
        setCustomer(
          accountData.customer || {
            email: "",
            first_name: "",
            last_name: "",
            phone: ""
          }
        );
        setAddresses(addressData || []);
        setOrders(orderData || []);
      } catch (error) {
        setMessage(error.message);
        setMessageClass("alert-danger");
      } finally {
        setLoading(false);
      }
    }

    loadMyAccount();
  }, []);

  useEffect(() => {
    setEditAccountForm({
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      email: customer.email || user.email || "",
      phone: customer.phone || ""
    });
  }, [customer, user]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      setMessage("");
      setMessageClass("alert-info");
    }, 2500);
    return () => clearTimeout(timer);
  }, [message]);

  const notificationOrders = useMemo(() => {
    return [...orders].sort(
      (a, b) => new Date(b.order_date) - new Date(a.order_date)
    );
  }, [orders]);

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
    const now = Date.now();
    const timeDiff = now - orderTime;
    const status = String(order.status || "").toLowerCase();
    return timeDiff <= 3600 * 1000 && status === "pending";
  };

  const showFlash = (text, type = "alert-success") => {
    setMessage(text);
    setMessageClass(type);
  };

  const handleEditAccountChange = (e) => {
    const { name, value } = e.target;
    setEditAccountForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();

    try {
      const data = await updateAccount(editAccountForm);

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

      showFlash(data.message || "Personal information updated successfully!");
    } catch (error) {
      showFlash(error.message, "alert-danger");
    }
  };

  const handleAddAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    try {
      const data = await addAddress(addAddressForm);
      const refreshed = await fetchAddresses();
      setAddresses(refreshed);
      setAddAddressForm(emptyAddressForm);
      showFlash(data.message || "Address added successfully!");
    } catch (error) {
      showFlash(error.message, "alert-danger");
    }
  };

  const openEditAddress = (address) => {
    setEditingAddress({ ...address, is_default: !!Number(address.is_default) || !!address.is_default });
  };

  const handleEditAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSaveEditedAddress = async (e) => {
    e.preventDefault();
    if (!editingAddress) return;

    try {
      const data = await updateAddress(editingAddress.address_id, editingAddress);
      const refreshed = await fetchAddresses();
      setAddresses(refreshed);
      setEditingAddress(null);
      showFlash(data.message || "Address updated successfully!");
    } catch (error) {
      showFlash(error.message, "alert-danger");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );
    if (!confirmed) return;

    try {
      const data = await deleteAddress(addressId);
      setAddresses((prev) =>
        prev.filter((addr) => addr.address_id !== addressId)
      );
      showFlash(data.message || "Address deleted successfully!");
    } catch (error) {
      showFlash(error.message, "alert-danger");
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmed) return;

    try {
      const data = await cancelOrder(orderId);
      const refreshedOrders = await fetchMyOrders();
      setOrders(refreshedOrders);
      showFlash(data.message || "Order canceled successfully!");
    } catch (error) {
      showFlash(error.message, "alert-danger");
    }
  };

  if (loading) return <PageLoader text="Loading product..." />;

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
          </div>
        </div>

        <div className="col-md-9">
          <div className="tab-content">
            {activeTab === "#account" && (
              <div className="tab-pane fade show active">
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
                                  {Number(addr.is_default) === 1 && (
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
              <div className="tab-pane fade show active">
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
                                String(order.status).toLowerCase() === "canceled"
                                  ? "bg-danger"
                                  : String(order.status).toLowerCase() === "pending"
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

                          <Link
                            to={`/order-tracking?order_id=${order.order_id}`}
                            className="btn btn-primary btn-sm mb-3"
                          >
                            Track Order
                          </Link>

                          <div className="row g-3">
                            {order.items.map((item, index) => (
                              <div
                                className="col-md-6 d-flex align-items-center border rounded p-2 bg-white"
                                key={`${order.order_id}-${index}`}
                              >
                                <img
                                  src={getImageUrl(item.image)}
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
              <div className="tab-pane fade show active">
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
                                      String(order.status).toLowerCase() === "canceled"
                                        ? "text-danger"
                                        : String(order.status).toLowerCase() === "pending"
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
                              <Link
                                to={`/order-tracking?order_id=${order.order_id}`}
                                className="btn btn-sm btn-primary"
                              >
                                Track Order
                              </Link>
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
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
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
                  <div className="input-group">
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
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">
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

      <div className="modal fade" id="addAddressModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleAddAddress}>
              <div className="modal-header">
                <h5 className="modal-title">Add New Address</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div className="modal-body row g-3">
                <div className="col-md-6">
                  <label className="form-label">Address Name</label>
                  <input
                    type="text"
                    name="address_name"
                    className="form-control"
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
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">
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
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
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
                      required
                    />
                  </div>

                  <div className="col-md-6 d-flex align-items-center">
                    <div className="form-check mt-4">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="is_default"
                        checked={!!editingAddress.is_default}
                        onChange={handleEditAddressChange}
                      />
                      <label className="form-check-label">Set as Default</label>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-light" data-bs-dismiss="modal">
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