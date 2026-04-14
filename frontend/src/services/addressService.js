import API_BASE_URL from "./api";

export async function fetchAddresses() {
  const response = await fetch(`${API_BASE_URL}/address`, {
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch addresses");
  }

  return data;
}

export async function addAddress(payload) {
  const response = await fetch(`${API_BASE_URL}/address`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add address");
  }

  return data;
}

export async function updateAddress(addressId, payload) {
  const response = await fetch(`${API_BASE_URL}/address/${addressId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update address");
  }

  return data;
}

export async function deleteAddress(addressId) {
  const response = await fetch(`${API_BASE_URL}/address/${addressId}`, {
    method: "DELETE",
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete address");
  }

  return data;
}