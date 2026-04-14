import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchProducts, searchProducts } from "../services/productService";
import { getImageUrl } from "../utils/image";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [brands] = useState([
    { id: 1, name: "Nike" },
    { id: 2, name: "Adidas" },
    { id: 3, name: "Jordan" },
    { id: 4, name: "Under Armour" },
    { id: 5, name: "Anta" },
    { id: 6, name: "Converse" },
    { id: 7, name: "New Balance" },
    { id: 8, name: "Puma" }
  ]);

  const sizes = ["XS", "S", "M", "L", "XL"];

  const [filters, setFilters] = useState({
    brand: searchParams.get("brand") || "",
    size: "",
    min_price: "",
    max_price: "",
    sort: "",
    page: 1
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 6;

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      brand: searchParams.get("brand") || ""
    }));
  }, [searchParams]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        let data = [];

        if (query.trim()) {
          data = await searchProducts(query.trim());
        } else {
          data = await fetchProducts({
            brand: filters.brand,
            min_price: filters.min_price,
            max_price: filters.max_price,
            sort: filters.sort
          });
        }

        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [query, filters.brand, filters.min_price, filters.max_price, filters.sort]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.brand !== "") {
      result = result.filter(
        (product) => String(product.brand_id) === String(filters.brand)
      );
    }

    if (filters.size !== "") {
      result = result.filter((product) => {
        if (!product.sizes) return true;

        if (Array.isArray(product.sizes)) {
          return product.sizes.includes(filters.size);
        }

        if (typeof product.sizes === "string") {
          return product.sizes
            .split(",")
            .map((s) => s.trim())
            .includes(filters.size);
        }

        return true;
      });
    }

    if (filters.min_price !== "") {
      result = result.filter(
        (product) => Number(product.price) >= Number(filters.min_price)
      );
    }

    if (filters.max_price !== "") {
      result = result.filter(
        (product) => Number(product.price) <= Number(filters.max_price)
      );
    }

    return result;
  }, [filters.brand, filters.size, filters.min_price, filters.max_price, products]);

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / limit);

  const paginatedProducts = useMemo(() => {
    const start = (filters.page - 1) * limit;
    const end = start + limit;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, filters.page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1
    }));

    if (name === "brand") {
      const next = new URLSearchParams(searchParams);

      if (value) next.set("brand", value);
      else next.delete("brand");

      // choosing a brand clears search query so reload won't stay stuck on old search
      next.delete("q");

      setSearchParams(next);
    }
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
  };

  const handleClearFilters = () => {
    setFilters({
      brand: "",
      size: "",
      min_price: "",
      max_price: "",
      sort: "",
      page: 1
    });

    setSearchParams({});
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      sort: e.target.value,
      page: 1
    }));
  };

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setFilters((prev) => ({
      ...prev,
      page: pageNumber
    }));
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
                <Link to="/" className="text-white text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item active text-white" aria-current="page">
                Shop
              </li>
            </ol>
          </nav>
          <h1 className="fw-bold text-uppercase">SHOP</h1>
        </div>
      </div>

      <div className="container mt-5">
        <h2 className="text-center fw-bold mb-2">Shop</h2>

        {query && (
          <p className="text-center text-muted mb-4">
            Search results for: <strong>{query}</strong>
          </p>
        )}

        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Filters</h5>

                <form onSubmit={handleApplyFilters}>
                  <div className="mb-3">
                    <label htmlFor="brand" className="form-label">Brand</label>
                    <select
                      className="form-select"
                      id="brand"
                      name="brand"
                      value={filters.brand}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Brands</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="size" className="form-label">Size</label>
                    <select
                      className="form-select"
                      id="size"
                      name="size"
                      value={filters.size}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Sizes</option>
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Price Range (₱)</label>
                    <div className="d-flex">
                      <input
                        min="0"
                        type="number"
                        className="form-control me-2"
                        name="min_price"
                        placeholder="Min"
                        value={filters.min_price}
                        onChange={handleFilterChange}
                      />
                      <input
                        min="0"
                        type="number"
                        className="form-control"
                        name="max_price"
                        placeholder="Max"
                        value={filters.max_price}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-dark">
                      Apply Filters
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">{totalProducts} Products found</h6>

              <div className="d-flex">
                <select
                  className="form-select form-select-sm"
                  name="sort"
                  value={filters.sort}
                  onChange={handleSortChange}
                >
                  <option value="">Sort By</option>
                  <option value="az">Name: A–Z</option>
                  <option value="za">Name: Z–A</option>
                  <option value="low_high">Price: Low to High</option>
                  <option value="high_low">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <p className="text-center text-muted">Loading products...</p>
            ) : error ? (
              <p className="text-center text-danger">{error}</p>
            ) : (
              <div className="row g-4">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <div className="col-6 col-md-4" key={product.id}>
                      <div className="card h-100 shadow-sm border-0">
                        <img
                          src={getImageUrl(product.image)}
                          className="card-img-top"
                          style={{ height: "180px", objectFit: "cover" }}
                          alt={product.name}
                        />
                        <div className="card-body d-flex flex-column">
                          <h6 className="fw-bold">{product.name}</h6>
                          <p className="text-muted small mb-1">{product.brand_name}</p>
                          <p className="text-muted small mb-2">
                            ₱ {Number(product.price).toLocaleString(undefined, {
                              minimumFractionDigits: 2
                            })}
                          </p>
                          <p className="text-truncate mb-3">{product.description}</p>
                          <Link to={`/product?id=${product.id}`} className="btn btn-sm btn-dark mt-auto">
                            View Product
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted">
                    No products found for these filters.
                  </p>
                )}
              </div>
            )}

            {totalPages > 1 && (
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center mt-4">
                  <li className={`page-item ${filters.page <= 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => goToPage(filters.page - 1)}>
                      <span aria-hidden="true">&laquo;</span>
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (pageNumber) => (
                      <li
                        key={pageNumber}
                        className={`page-item ${pageNumber === filters.page ? "active" : ""}`}
                      >
                        <button className="page-link" onClick={() => goToPage(pageNumber)}>
                          {pageNumber}
                        </button>
                      </li>
                    )
                  )}

                  <li className={`page-item ${filters.page >= totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => goToPage(filters.page + 1)}>
                      <span aria-hidden="true">&raquo;</span>
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  );
}