import { useEffect, useMemo, useState } from "react";

export default function Checkout() {
  const [checkoutErrors] = useState([]);

  // Temporary frontend data until backend API is connected
  const [userDetails] = useState({
    email: "sampleuser@gmail.com",
    first_name: "John",
    last_name: "Doe",
    phone: "09123456789"
  });

  const [addresses] = useState([
    {
      address_id: 1,
      house_street: "123 Shoe Street",
      barangay: "Barangay 123",
      city: "Manila",
      province: "Metro Manila",
      region: "NCR",
      postal_code: "1000",
      country: "Philippines"
    },
    {
      address_id: 2,
      house_street: "45 Sneaker Ave",
      barangay: "Barangay 456",
      city: "Quezon City",
      province: "Metro Manila",
      region: "NCR",
      postal_code: "1100",
      country: "Philippines"
    }
  ]);

  const [cartItems] = useState([
    {
      cart_item_id: 1,
      product_id: 1,
      name: "Nike Air Force 1",
      price: 5495,
      image: "/images/products/AF1.webp",
      quantity: 2,
      sizes: "M"
    },
    {
      cart_item_id: 2,
      product_id: 2,
      name: "Adidas Samba OG",
      price: 6800,
      image: "/images/products/AdidasSambaOG.webp",
      quantity: 1,
      sizes: "S"
    }
  ]);

  const [formData, setFormData] = useState({
    delivery_type: "delivery",
    email: userDetails.email || "",
    phone: userDetails.phone || "",
    first_name: userDetails.first_name || "",
    last_name: userDetails.last_name || "",
    address_id: "",
    shipping: "",
    payment_method: "GCASH"
  });

  const [selectedShipping, setSelectedShipping] = useState("free");

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric"
    });
  };

  const shippingOptions = useMemo(() => {
    const today = new Date();

    const freeStart = new Date(today);
    freeStart.setDate(today.getDate());

    const freeEnd = new Date(today);
    freeEnd.setDate(today.getDate() + 6);

    const expressStart = new Date(today);
    expressStart.setDate(today.getDate());

    const expressEnd = new Date(today);
    expressEnd.setDate(today.getDate() + 4);

    return {
      free: {
        key: "free",
        fee: 0,
        feeText: "Free",
        arrival: `${formatDate(freeStart)} - ${formatDate(freeEnd)}`
      },
      express: {
        key: "express",
        fee: 150,
        feeText: "₱150",
        arrival: `${formatDate(expressStart)} - ${formatDate(expressEnd)}`
      }
    };
  }, []);

  useEffect(() => {
    const current = shippingOptions[selectedShipping];
    setFormData((prev) => ({
      ...prev,
      shipping: `${current.fee}|${current.feeText}|${current.arrival}`
    }));
  }, [selectedShipping, shippingOptions]);

  const currentShipping = shippingOptions[selectedShipping];
  const total = subtotal + currentShipping.fee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "address_id" && value === "create") {
      alert("You need to add your address before checkout.");
      window.location.href = "/my-account#address";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShippingChange = (key) => {
    setSelectedShipping(key);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Checkout submitted:", formData);
    console.log("Cart items:", cartItems);
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-7">
          <h4 className="mb-4">Delivery Details</h4>

          {checkoutErrors.length > 0 && (
            <div className="alert alert-danger">
              <ul className="mb-0">
                {checkoutErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form id="checkoutForm" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold">Shipping Option</label>
              <select
                className="form-select"
                name="delivery_type"
                required
                value={formData.delivery_type}
                onChange={handleInputChange}
              >
                <option value="delivery">Delivery</option>
              </select>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="form-control"
                  placeholder="you@example.com"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  className="form-control"
                  placeholder="09XXXXXXXXX"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  className="form-control"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  className="form-control"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Address</label>
                <select
                  name="address_id"
                  className="form-select"
                  required
                  value={formData.address_id}
                  onChange={handleInputChange}
                >
                  {addresses.length === 0 ? (
                    <>
                      <option value="" disabled>
                        No saved address. Please create one.
                      </option>
                      <option value="create">➕ Create New Address</option>
                    </>
                  ) : (
                    <>
                      <option value="" disabled>
                        -- Select Address --
                      </option>
                      {addresses.map((addr) => (
                        <option key={addr.address_id} value={addr.address_id}>
                          {`${addr.house_street}, ${addr.barangay}, ${addr.city}`}
                        </option>
                      ))}
                      <option value="create">➕ Create New Address</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <h5>Shipping Details</h5>
              <label className="form-label">
                When would you like to get your order?
              </label>

              <input type="hidden" name="shipping" value={formData.shipping} />

              <div className="d-flex gap-2 flex-wrap">
                <button
                  type="button"
                  className={`btn btn-outline-secondary shipping-btn ${
                    selectedShipping === "free" ? "active" : ""
                  }`}
                  onClick={() => handleShippingChange("free")}
                >
                  Free Shipping
                  <br />
                  <small>Arrives {shippingOptions.free.arrival}</small>
                </button>

                <button
                  type="button"
                  className={`btn btn-outline-secondary shipping-btn ${
                    selectedShipping === "express" ? "active" : ""
                  }`}
                  onClick={() => handleShippingChange("express")}
                >
                  Express Shipping
                  <br />
                  <small>Arrives {shippingOptions.express.arrival}</small>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h5>Payment Method</h5>
              <div className="list-group">
                <label className="list-group-item d-flex justify-content-between align-items-center">
                  <span>GCash</span>
                  <input
                    className="form-check-input ms-2"
                    type="radio"
                    name="payment_method"
                    value="GCASH"
                    checked={formData.payment_method === "GCASH"}
                    onChange={handleInputChange}
                  />
                </label>

                <label className="list-group-item d-flex justify-content-between align-items-center">
                  <span>Cash on Delivery</span>
                  <input
                    className="form-check-input ms-2"
                    type="radio"
                    name="payment_method"
                    value="CASH ON DELIVERY"
                    checked={formData.payment_method === "CASH ON DELIVERY"}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-dark btn-lg mt-3"
              data-bs-toggle="modal"
              data-bs-target="#confirmOrderModal"
            >
              Place Order
            </button>

            <div
              className="modal fade"
              id="confirmOrderModal"
              tabIndex="-1"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Confirm Your Order</h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                    ></button>
                  </div>

                  <div className="modal-body">
                    <p>
                      Are you sure you want to place this order?
                      <br />
                      Once placed, it cannot be canceled after 1 hour.
                    </p>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                    >
                      Review Again
                    </button>
                    <button type="submit" className="btn btn-success">
                      Yes, Place Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="col-lg-4">
          <div className="position-sticky" style={{ top: "20px" }}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-3">Order Summary</h5>

                {cartItems.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  <>
                    {cartItems.map((item) => (
                      <div className="d-flex mb-3" key={item.cart_item_id}>
                        <img
                          src={item.image}
                          className="me-3"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover"
                          }}
                          alt={item.name}
                        />
                        <div>
                          <h6 className="mb-1">{item.name}</h6>
                          <small>Size: {item.sizes}</small>
                          <br />
                          <small>Qty: {item.quantity}</small>
                          <p className="mb-0">
                            ₱
                            {Number(item.price * item.quantity).toLocaleString(
                              undefined,
                              { minimumFractionDigits: 2 }
                            )}
                          </p>
                        </div>
                      </div>
                    ))}

                    <hr />
                    <div className="d-flex justify-content-between">
                      <span>Subtotal</span>
                      <span id="subtotal">
                        ₱
                        {Number(subtotal).toLocaleString(undefined, {
                          minimumFractionDigits: 2
                        })}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span>Delivery</span>
                      <span id="delivery-fee">{currentShipping.feeText}</span>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total</span>
                      <span id="total">
                        ₱
                        {Number(total).toLocaleString(undefined, {
                          minimumFractionDigits: 2
                        })}
                      </span>
                    </div>

                    <p className="text-muted mt-2" id="arrival-date">
                      Arrives {currentShipping.arrival}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}