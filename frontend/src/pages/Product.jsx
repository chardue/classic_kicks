import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProductById } from "../services/productService";
import { addToCart } from "../services/cartService";
import { addToWishlist } from "../services/wishlistService";
import { getImageUrl } from "../utils/image";
import PageLoader from "../components/PageLoader";
import PageError from "../components/PageError";

export default function Product() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState(null);
  const [sizeStock, setSizeStock] = useState({});
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("alert-success");
  const [openAccordion, setOpenAccordion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [wishlistMessageClass, setWishlistMessageClass] = useState("alert-success");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchProductById(productId);

        setProduct(data);

        const stockMap = {};
        if (Array.isArray(data.sizes)) {
          data.sizes.forEach((item) => {
            stockMap[item.size] = Number(item.stock);
          });
        }

        setSizeStock(stockMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadProduct();
    } else {
      setLoading(false);
      setError("Missing product id");
    }
  }, [productId]);

  const availableSizes = useMemo(() => {
    return Object.entries(sizeStock)
      .filter(([, stock]) => Number(stock) > 0)
      .map(([size]) => size);
  }, [sizeStock]);

  const currentStock = selectedSize
    ? sizeStock[selectedSize] ?? 0
    : Number(product?.quantity || 0);

  const displayImage = product?.image || "/images/model/default-model.png";

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    const stock = sizeStock[size] ?? 0;
    setQuantity(stock > 0 ? 1 : 0);
  };

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    if (value < 1) {
      setQuantity(1);
      return;
    }
    if (value > currentStock) {
      setQuantity(currentStock);
      return;
    }
    setQuantity(value);
  };

  const handleAddToWishlist = async () => {
    try {
      const data = await addToWishlist(Number(product.id));
      setWishlistMessage(data.message || "Added to wishlist");
      setWishlistMessageClass("alert-success");
    } catch (err) {
      setWishlistMessage(err.message);
      setWishlistMessageClass("alert-danger");
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!selectedSize) {
      setMessage("Please select a size.");
      setMessageClass("alert-danger");
      return;
    }

    try {
      setSubmitting(true);
      const data = await addToCart({
        product_id: Number(product.id),
        quantity,
        sizes: selectedSize
      });

      setMessage(data.message || "Added to cart");
      setMessageClass("alert-success");
    } catch (err) {
      setMessage(err.message);
      setMessageClass("alert-danger");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAccordion = (key) => {
    setOpenAccordion((prev) => (prev === key ? "" : key));
  };

  const renderStockIndicator = () => {
    if (currentStock > 0) {
      return (
        <p className="text-muted d-flex align-items-center">
          <svg width="15" height="15" className="me-2" aria-hidden="true">
            <circle cx="7.5" cy="7.5" r="7.5" fill="rgba(62,214,96,0.3)"></circle>
            <circle
              cx="7.5"
              cy="7.5"
              r="5"
              stroke="rgb(255, 255, 255)"
              strokeWidth="1"
              fill="rgb(62,214,96)"
            ></circle>
          </svg>
          In Stock: {currentStock}
        </p>
      );
    }

    return (
      <p className="text-muted d-flex align-items-center">
        <svg width="15" height="15" className="me-2" aria-hidden="true">
          <circle cx="7.5" cy="7.5" r="7.5" fill="rgba(255,0,0,0.3)"></circle>
          <circle
            cx="7.5"
            cy="7.5"
            r="5"
            stroke="rgb(255, 255, 255)"
            strokeWidth="1"
            fill="rgb(255,0,0)"
          ></circle>
        </svg>
        <span className="text-danger fw-bold">Out of Stock</span>
      </p>
    );
  };

  if (loading) return <PageLoader text="Loading product..." />;

  if (error) return <PageError message={error} />;

  if (!product) {
    return <div className="container mt-5"><p className="text-danger">Product not found.</p></div>;
  }

  return (
    <>
      <style>{`
        .product-description-tab {
          background-color: #fff;
          padding: 40px 0;
        }

        .description-review-text {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .grid-wrap {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 40px;
          align-items: start;
        }

        .banner-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .desc-content {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .desc-block {
          margin-bottom: 20px;
        }

        .sub-title {
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
          color: #111;
        }

        .desc-block p {
          color: #444;
          line-height: 1.6;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .accordion-button {
          box-shadow: none !important;
          font-size: 1rem;
        }

        .accordion-button::after {
          display: none !important;
        }

        .toggle-icon {
          font-size: 1.5rem;
          line-height: 1;
          transition: all 0.2s;
        }
      `}</style>

      <div className="container mt-5">
        <div className="row g-4">
          <div className="col-md-6">
            <img
              src={getImageUrl(product.image)}
              className="img-fluid rounded shadow"
              alt={product.name}
            />
          </div>

          <div className="col-md-6">
            <h2 className="fw-bold">{product.name}</h2>
            <p className="text-muted">
              Brand: <strong>{product.brand_name}</strong>
            </p>
            <p className="fw-bold m-0 fs-5">
              ₱ {Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className="text-muted" style={{ fontSize: "14px" }}>
              Tax included. Shipping calculated at checkout.
            </p>

            {renderStockIndicator()}

            <hr />
            <p>{product.description}</p>

            {message && <div className={`alert ${messageClass}`}>{message}</div>}

            <form onSubmit={handleAddToCart} className="mt-4">
              {availableSizes.length > 0 && (
                <div className="mb-3">
                  <label className="form-label fw-bold">Sizes:</label>
                  <div className="d-flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <div key={size}>
                        <input
                          type="radio"
                          className="btn-check"
                          name="sizes"
                          id={`size_${size}`}
                          value={size}
                          checked={selectedSize === size}
                          onChange={() => handleSizeChange(size)}
                          required
                        />
                        <label
                          className="btn btn-outline-dark px-3 py-2"
                          htmlFor={`size_${size}`}
                        >
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  min="1"
                  max={currentStock}
                  className="form-control"
                  style={{ maxWidth: "120px" }}
                  disabled={currentStock <= 0}
                  onChange={handleQuantityChange}
                />
              </div>

              {currentStock <= 0 ? (
                <span className="text-danger fw-bold">Out of Stock</span>
              ) : (
                <button type="submit" className="btn btn-dark" disabled={submitting}>
                  {submitting ? "Adding..." : "🛒 Add to Cart"}
                </button>
              )}
                <button
                  type="button"
                  className="btn btn-outline-danger ms-2"
                  onClick={handleAddToWishlist}
                >
                  ❤️ Add to Wishlist
                </button>
            </form>
            {wishlistMessage && (
              <div className={`alert ${wishlistMessageClass} mt-3`}>
                {wishlistMessage}
              </div>
            )}

            <button
              type="button"
              className="btn btn-outline-secondary mt-3"
              data-bs-toggle="modal"
              data-bs-target="#sizeGuideModal"
            >
              📏 Size Guide
            </button>
          </div>
        </div>

        <div
          className="modal fade"
          id="sizeGuideModal"
          tabIndex="-1"
          aria-labelledby="sizeGuideLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 rounded-3">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title" id="sizeGuideLabel">
                  Shoe Size Guide (Philippines Standard)
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-bordered text-center align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>Size</th>
                        <th>US</th>
                        <th>EU</th>
                        <th>CM (Foot Length)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>XS</td><td>5</td><td>37</td><td>23 cm</td></tr>
                      <tr><td>S</td><td>6–7</td><td>38–39</td><td>24–25 cm</td></tr>
                      <tr><td>M</td><td>8–9</td><td>40–42</td><td>26–27 cm</td></tr>
                      <tr><td>L</td><td>10–11</td><td>43–44</td><td>28–29 cm</td></tr>
                      <tr><td>XL</td><td>12–13</td><td>45–46</td><td>30–31 cm</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="small text-muted mt-3">
                  📌 Tip: Stand on a piece of paper, mark your heel and longest toe,
                  then measure in cm.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="product-tabs mb-5 my-5">
          <div className="accordion" id="productAccordion">
            <div className="accordion-item border-0 border-bottom border-top">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button d-flex justify-content-between align-items-center bg-white px-0 ${
                    openAccordion === "desc" ? "" : "collapsed"
                  }`}
                  type="button"
                  onClick={() => toggleAccordion("desc")}
                >
                  <span className="text-muted">Description</span>
                  <span className="toggle-icon ms-auto text-muted">
                    {openAccordion === "desc" ? "−" : "+"}
                  </span>
                </button>
              </h2>

              <div className={`accordion-collapse collapse ${openAccordion === "desc" ? "show" : ""}`}>
                <div className="accordion-body px-0">
                  <div className="product-description-tab">
                    <div className="description-review-text">
                      <div className="product-description">
                        <div className="grid-wrap">
                          <div className="grid-wrapper">
                            <div className="banner-img">
                              <img src={displayImage} alt={product.name} />
                            </div>
                          </div>

                          <div className="grid-wrapper">
                            <div className="desc-content">
                              <div className="desc-block">
                                <h6 className="sub-title">Product Specifications</h6>
                                <p>{product.description}</p>
                              </div>

                              <div className="desc-block">
                                <h6 className="sub-title">Washing Instructions</h6>
                                <p><i className="bx bx-wind icon-wash"></i> Machine wash cold.</p>
                                <p><i className="bx bx-no-entry icon-wash"></i> Do not bleach.</p>
                                <p><i className="bx bx-error-circle"></i> Tumble dry low.</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid-wrapper">
                            <div className="desc-content">
                              <div className="desc-block">
                                <h6 className="sub-title">Material</h6>
                                <p>
                                  Premium synthetic leather and mesh lining for
                                  durability and breathability.
                                </p>
                              </div>

                              <div className="desc-block">
                                <h6 className="sub-title">Wearing</h6>
                                <p>Model height: 1.82m — Wearing Size M</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}