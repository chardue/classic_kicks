import { useMemo, useState } from "react";

export default function OrderTracking() {
  const [orderId] = useState(101);

  // Temporary frontend data until backend API is connected
  const [timeline] = useState([
    {
      status: "Order Placed",
      message: "Your order has been placed successfully.",
      created_at: "2026-04-10T09:30:00"
    },
    {
      status: "Packed",
      message: "Your items have been packed and prepared for shipment.",
      created_at: "2026-04-10T01:15:00"
    },
    {
      status: "Shipped",
      message: "Your order is now on the way.",
      created_at: "2026-04-11T08:45:00"
    }
  ]);

  const steps = ["Order Placed", "Packed", "Shipped", "Delivered"];

  const activeStatuses = useMemo(() => {
    return timeline.map((item) => item.status);
  }, [timeline]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <>
      <style>{`
        .breadcrumb {
          --bs-breadcrumb-divider-color: white !important;
        }

        .breadcrumb-item + .breadcrumb-item::before {
          color: white !important;
        }

        .breadcrumb a {
          color: white;
        }

        .breadcrumb a:hover {
          text-decoration: underline;
          color: #f8f9fa;
        }

        .tracking-wrapper {
          max-width: 800px;
          background: #fff;
          margin: 60px auto;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .tracking-title {
          text-align: center;
          font-weight: 600;
          color: #333;
          margin-bottom: 40px;
        }

        .progressbar {
          counter-reset: step;
          display: flex;
          justify-content: space-between;
          position: relative;
          margin-bottom: 50px;
        }

        .progressbar::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50px;
          right: 50px;
          transform: translateY(-50%);
          height: 5px;
          background: #dcdcdc;
          z-index: 0;
        }

        .step {
          position: relative;
          z-index: 1;
          text-align: center;
          flex: 1;
        }

        .step::before {
          counter-increment: step;
          content: counter(step);
          width: 40px;
          height: 40px;
          line-height: 40px;
          display: block;
          background: #dcdcdc;
          border-radius: 50%;
          margin: 0 auto 10px;
          font-weight: bold;
          color: #555;
          transition: 0.3s;
        }

        .step.active::before {
          background: #28a745;
          color: #fff;
        }

        .step.active p {
          color: #28a745;
          font-weight: 600;
        }

        .step p {
          margin: 0;
          color: #777;
          font-size: 14px;
        }

        .timeline-details {
          margin-top: 40px;
        }

        .timeline-item {
          margin-bottom: 25px;
          padding: 15px 20px;
          border-left: 4px solid #28a745;
          background: #f9f9f9;
          border-radius: 5px;
        }

        .timeline-item h4 {
          margin: 0 0 5px;
          color: #333;
        }

        .timeline-item p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
      `}</style>

      <div
        className="breadcrumb-container position-relative text-center text-white d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: "url('/images/bread.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "150px"
        }}
      >
        <div
          className="overlay position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.4)" }}
        ></div>

        <div className="position-relative">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-2">
              <li className="breadcrumb-item">
                <a href="/" className="text-decoration-none text-white">
                  Home
                </a>
              </li>
              <li className="breadcrumb-item">
                <a href="/my-account" className="text-decoration-none text-white">
                  My Account
                </a>
              </li>
              <li className="breadcrumb-item active text-white" aria-current="page">
                Track Order #{orderId}
              </li>
            </ol>
          </nav>
          <h1 className="fw-bold text-uppercase">Order</h1>
        </div>
      </div>

      <div className="tracking-wrapper">
        <h2 className="tracking-title">Order Tracking #{orderId}</h2>

        {timeline.length > 0 ? (
          <>
            <div className="progressbar">
              {steps.map((step) => {
                const isActive = activeStatuses.includes(step);

                return (
                  <div className={`step ${isActive ? "active" : ""}`} key={step}>
                    <p>{step}</p>
                  </div>
                );
              })}
            </div>

            <div className="timeline-details">
              {timeline.map((row, index) => (
                <div className="timeline-item" key={index}>
                  <h4>{row.status}</h4>
                  <p>{row.message}</p>
                  <small style={{ color: "#999" }}>
                    {formatDateTime(row.created_at)}
                  </small>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{ textAlign: "center", color: "#666" }}>
            No tracking updates available yet.
          </p>
        )}
      </div>
    </>
  );
}