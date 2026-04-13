import API_BASE_URL from "./api";

export async function fetchCart() {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch cart");
  }

  return data;
}

export async function addToCart(payload) {
  const response = await fetch(`${API_BASE_URL}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add to cart");
  }

  return data;
}

export async function updateCartItemQuantity(cartItemId, quantity) {
  const response = await fetch(`${API_BASE_URL}/cart/item/${cartItemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ quantity })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update cart");
  }

  return data;
}

export async function deleteCartItem(cartItemId) {
  const response = await fetch(`${API_BASE_URL}/cart/item/${cartItemId}`, {
    method: "DELETE",
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to remove cart item");
  }

  return data;
}