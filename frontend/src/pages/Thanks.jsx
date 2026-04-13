export default function Thanks() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 text-center p-4 p-md-5">
            <div className="mb-4">
              <i
                className="bx bx-check-circle"
                style={{ fontSize: "80px", color: "#198754" }}
              ></i>
            </div>

            <h1 className="fw-bold mb-3">Thank You for Your Order!</h1>

            <p className="text-muted mb-4">
              Your order has been placed successfully. We appreciate your
              purchase and support.
            </p>

            <p className="mb-4">
              You can track your order status in your account page.
            </p>

            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <a href="/shop" className="btn btn-dark">
                Continue Shopping
              </a>

              <a href="/my-account" className="btn btn-outline-secondary">
                Go to My Account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}