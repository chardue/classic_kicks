import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchOrderTimeline } from "../services/orderService";

export default function OrderTracking() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const steps = ["Order Placed", "Packed", "Shipped", "Delivered"];

  useEffect(() => {
    async function loadTimeline() {
      try {
        setLoading(true);
        setError("");

        if (!orderId) {
          throw new Error("Missing order id");
        }

        const data = await fetchOrderTimeline(orderId);
        setTimeline(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTimeline();
  }, [orderId]);

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
          display: flex;
          justify-content: space-between;
          position: relative;
          margin-bottom: 50px;
        }

        .progressbar::before {
          content: "";
          position: absolute;
          top: 20px;
          left: 50px;
          right: 50px;
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
          width: 40px;
          height: 40px;
          line-height: 40px;
          display: block;
          background: #dcdcdc;
          border-radius: 50%;
          margin: 0 auto 10px;
          font-weight: bold;
          color: #555;
          content: "";
        }

        .step.active::before {
          background: #28a745;
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

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading tracking...</p>
        ) : error ? (
          <p style={{ textAlign: "center", color: "red" }}>{error}</p>
        ) : timeline.length > 0 ? (
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