import API_BASE_URL from "./api";

export async function placeOrder(payload) {
  const response = await fetch(`${API_BASE_URL}/orders/place`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to place order");
  }

  return data;
}

export async function fetchMyOrders() {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders");
  }

  return data;
}

export async function cancelOrder(orderId) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
    method: "PATCH",
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to cancel order");
  }

  return data;
}

export async function fetchOrderTimeline(orderId) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/tracking`, {
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch order timeline");
  }

  return data;
}