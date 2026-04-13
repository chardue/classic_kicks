import API_BASE_URL from "./api";

export async function fetchWishlist() {
  const response = await fetch(`${API_BASE_URL}/wishlist`, {
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch wishlist");
  }

  return data;
}

export async function addToWishlist(productId) {
  const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ product_id: productId })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add to wishlist");
  }

  return data;
}

export async function removeFromWishlist(wishlistId) {
  const response = await fetch(`${API_BASE_URL}/wishlist/${wishlistId}`, {
    method: "DELETE",
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to remove from wishlist");
  }

  return data;
}