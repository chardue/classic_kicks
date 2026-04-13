import { useMemo, useState } from "react";

export default function AdminDash() {
  const [adminUser] = useState({
    username: "admin"
  });

  const [summary] = useState({
    totalOrders: 24,
    totalProducts: 18,
    totalStock: 67,
    totalSales: 154320
  });

  const [recentOrders] = useState([
    {
      id: 201,
      username: "sampleuser",
      order_date: "2026-04-13 09:15:00",
      total: 10990,
      status: "pending"
    },
    {
      id: 202,
      username: "john_doe",
      order_date: "2026-04-12 15:40:00",
      total: 7995,
      status: "completed"
    },
    {
      id: 203,
      username: "maria123",
      order_date: "2026-04-12 10:05:00",
      total: 6800,
      status: "shipped"
    },
    {
      id: 204,
      username: "ashley",
      order_date: "2026-04-11 18:30:00",
      total: 5495,
      status: "packed"
    },
    {
      id: 205,
      username: "kevinp",
      order_date: "2026-04-11 09:20:00",
      total: 11295,
      status: "completed"
    }
  ]);

  const [lowStockProducts] = useState([
    { name: "Nike Air Force 1", total_stock: 5 },
    { name: "Adidas Samba OG", total_stock: 3 },
    { name: "Jordan Retro 3", total_stock: 2 }
  ]);

  const salesOverview = useMemo(
    () => [
      { date: "2026-04-07", revenue: 15200 },
      { date: "2026-04-08", revenue: 9800 },
      { date: "2026-04-09", revenue: 12150 },
      { date: "2026-04-10", revenue: 18700 },
      { date: "2026-04-11", revenue: 14200 },
      { date: "2026-04-12", revenue: 22100 },
      { date: "2026-04-13", revenue: 17350 }
    ],
    []
  );

  const ordersOverview = useMemo(
    () => [
      { date: "2026-04-07", count: 3 },
      { date: "2026-04-08", count: 2 },
      { date: "2026-04-09", count: 4 },
      { date: "2026-04-10", count: 5 },
      { date: "2026-04-11", count: 3 },
      { date: "2026-04-12", count: 6 },
      { date: "2026-04-13", count: 4 }
    ],
    []
  );

  const formatMoney = (value) =>
    Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2
    });

  const handleLogout = () => {
    console.log("Admin logout");
  };

  const printChart = (chartId) => {
    const canvas = document.getElementById(chartId);
    if (!canvas) return;

    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write("<html><head><title>Print Chart</title></head><body>");
    win.document.write(
      `<h3 style="text-align:center;">${chartId.replace("Chart", "")}</h3>`
    );
    win.document.write(
      `<img src="${canvas.toDataURL()}" style="width:100%;">`
    );
    win.document.write("</body></html>");
    win.document.close();
    win.print();
  };

  return (
    <div>
      <nav className="admin-header d-flex align-items-center justify-content-between bg-dark p-3">
        <div className="d-flex align-items-center">
          <h4 className="mb-0 text-white me-4">Admin Panel</h4>

          <a
            href="/admindash"
            className="btn btn-sm btn-outline-light me-2 active"
          >
            Dashboard
          </a>

          <a href="/admin" className="btn btn-sm btn-outline-light me-2">
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

      <div className="container mt-4 mb-5">
        <h3 className="mb-4">📊 Admin Dashboard</h3>

        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card text-center shadow">
              <div className="card-body">
                <h6>Total Orders</h6>
                <h3>{summary.totalOrders}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow">
              <div className="card-body">
                <h6>Total Products</h6>
                <h3>{summary.totalProducts}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow">
              <div className="card-body">
                <h6>Total Stock</h6>
                <h3>{summary.totalStock}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow">
              <div className="card-body">
                <h6>Total Sales</h6>
                <h3>₱{formatMoney(summary.totalSales)}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6>Sales Overview</h6>
                  <button
                    className="btn btn-sm btn-dark"
                    onClick={() => printChart("salesChart")}
                  >
                    🖨 Print
                  </button>
                </div>

                <canvas id="salesChart"></canvas>

                <div className="table-responsive mt-3">
                  <table className="table table-bordered table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Revenue (₱)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesOverview.map((row) => (
                        <tr key={row.date}>
                          <td>{row.date}</td>
                          <td>{formatMoney(row.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-muted small mb-0">
                  Connect this canvas to Chart.js later using backend API data.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6>Orders Overview</h6>
                  <button
                    className="btn btn-sm btn-dark"
                    onClick={() => printChart("ordersChart")}
                  >
                    🖨 Print
                  </button>
                </div>

                <canvas id="ordersChart"></canvas>

                <div className="table-responsive mt-3">
                  <table className="table table-bordered table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Orders</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersOverview.map((row) => (
                        <tr key={row.date}>
                          <td>{row.date}</td>
                          <td>{row.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-muted small mb-0">
                  Connect this canvas to Chart.js later using backend API data.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-7">
            <div className="card shadow">
              <div className="card-body">
                <h6>Recent Orders</h6>

                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.username}</td>
                        <td>{order.order_date}</td>
                        <td>₱{formatMoney(order.total)}</td>
                        <td>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card shadow">
              <div className="card-body">
                <h6>Low Stock Products</h6>

                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Total Stock</th>
                    </tr>
                  </thead>

                  <tbody>
                    {lowStockProducts.map((product, index) => (
                      <tr key={index} style={{ backgroundColor: "#a5a6a7ff" }}>
                        <td>{product.name}</td>
                        <td>{product.total_stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}