import API_BASE_URL from "./api";

export async function fetchAccount() {
  const response = await fetch(`${API_BASE_URL}/account`, {
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch account");
  }

  return data;
}

export async function updateAccount(payload) {
  const response = await fetch(`${API_BASE_URL}/account`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update account");
  }

  return data;
}