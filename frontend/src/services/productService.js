import API_BASE_URL from "./api";

export async function fetchProducts(filters = {}) {
  const params = new URLSearchParams();

  if (filters.brand) params.append("brand", filters.brand);
  if (filters.min_price) params.append("min_price", filters.min_price);
  if (filters.max_price) params.append("max_price", filters.max_price);
  if (filters.sort) params.append("sort", filters.sort);

  const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch products");
  }

  return data;
}

export async function fetchProductById(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch product");
  }

  return data;
}

export async function searchProducts(query) {
  const response = await fetch(
    `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`,
    {
      credentials: "include"
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to search products");
  }

  return data;
}