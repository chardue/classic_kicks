import { useLocation } from "react-router-dom";

export default function Thanks() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 text-center p-4 p-md-5">
            <div className="mb-4">
              <i className="bx bx-check-circle" style={{ fontSize: "80px", color: "#198754" }}></i>
            </div>

            <h1 className="fw-bold mb-3">Thank You for Your Order!</h1>

            {orderId && (
              <p className="mb-2">
                Order ID: <strong>{orderId}</strong>
              </p>
            )}

            <p className="text-muted mb-4">
              Your order has been placed successfully.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}