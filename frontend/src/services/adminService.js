import API_BASE_URL from "./api";

async function handleResponse(response, fallbackMessage) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
}

export async function fetchAdminDashboardSummary() {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/summary`, {
    credentials: "include"
  });

  return handleResponse(response, "Failed to fetch dashboard summary");
}

export async function fetchAdminOrders() {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/orders`, {
    credentials: "include"
  });

  return handleResponse(response, "Failed to fetch admin orders");
}

export async function fetchBestSellerReport() {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/best-sellers`, {
    credentials: "include"
  });

  return handleResponse(response, "Failed to fetch best seller report");
}

export async function fetchWishlistAlerts() {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/wishlist-alerts`, {
    credentials: "include"
  });

  return handleResponse(response, "Failed to fetch wishlist alerts");
}

export async function fetchAdminProducts() {
  const response = await fetch(`${API_BASE_URL}/admin/products`, {
    credentials: "include"
  });

  return handleResponse(response, "Failed to fetch products");
}

export async function createAdminProduct(payload) {
  const response = await fetch(`${API_BASE_URL}/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  return handleResponse(response, "Failed to create product");
}

export async function updateAdminProduct(productId, payload) {
  const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  return handleResponse(response, "Failed to update product");
}

export async function deleteAdminProduct(productId) {
  const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
    method: "DELETE",
    credentials: "include"
  });

  return handleResponse(response, "Failed to delete product");
}

export async function updateAdminOrderStatus(orderId, status) {
  const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ status })
  });

  return handleResponse(response, "Failed to update order status");
}

export async function fetchAdmins() {
  const response = await fetch(`${API_BASE_URL}/admin/admins`, {
    credentials: "include"
  });

  return handleResponse(response, "Failed to fetch admins");
}

export async function createAdminUser(payload) {
  const response = await fetch(`${API_BASE_URL}/admin/admins`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  return handleResponse(response, "Failed to create admin");
}

export async function deleteAdminUser(adminId) {
  const response = await fetch(`${API_BASE_URL}/admin/admins/${adminId}`, {
    method: "DELETE",
    credentials: "include"
  });

  return handleResponse(response, "Failed to delete admin");
}