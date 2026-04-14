import { useEffect, useState } from "react";
import { addToCart } from "../services/cartService";
import {
  fetchWishlist,
  removeFromWishlist
} from "../services/wishlistService";
import { getImageUrl } from "../utils/image";

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("alert-success");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWishlist() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchWishlist();
        setWishlistItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadWishlist();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const data = await addToCart({
        product_id: productId,
        quantity: 1,
        sizes: "M"
      });

      setMessage(data.message || "Added to cart");
      setMessageClass("alert-success");
    } catch (err) {
      setMessage(err.message);
      setMessageClass("alert-danger");
    }
  };

  const handleRemoveFromWishlist = async (wishlistId) => {
    const confirmed = window.confirm("Remove this item from wishlist?");
    if (!confirmed) return;

    try {
      const data = await removeFromWishlist(wishlistId);

      setWishlistItems((prev) =>
        prev.filter((item) => item.wishlist_id !== wishlistId)
      );

      setMessage(data.message || "Removed from wishlist");
      setMessageClass("alert-success");
    } catch (err) {
      setMessage(err.message);
      setMessageClass("alert-danger");
    }
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

      {message && (
        <div className="container mt-3">
          <div className={`alert ${messageClass}`} role="alert">
            {message}
          </div>
        </div>
      )}

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
                <a href="/shop" className="text-white text-decoration-none">
                  Shop
                </a>
              </li>
              <li className="breadcrumb-item active text-white" aria-current="page">
                Wishlist
              </li>
            </ol>
          </nav>
          <h1 className="fw-bold text-uppercase">Wishlist</h1>
        </div>
      </div>

      <div className="container mt-5">
        <h2>Your Wishlist</h2>

        {loading ? (
          <p>Loading wishlist...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : wishlistItems.length > 0 ? (
          <div className="row g-4">
            {wishlistItems.map((item) => (
              <div className="col-6 col-md-3 d-flex" key={item.wishlist_id}>
                <div className="card h-100 shadow-sm border-0 flex-fill">
                  <img
                    src={getImageUrl(item.image)}
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                    alt={item.name}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6 className="fw-bold">{item.name}</h6>
                    <p className="text-muted small mb-2">
                      ₱{" "}
                      {Number(item.price).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                      })}
                    </p>

                    <a href={`/product?id=${item.id}`} className="btn btn-sm btn-dark">
                      View
                    </a>

                    {Number(item.quantity) <= 0 ? (
                      <span className="text-danger fw-bold mt-2 text-center">
                        Out of Stock
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm w-100 mt-2"
                        style={{
                          backgroundColor: "#212529",
                          color: "#fff",
                          border: "none"
                        }}
                        onClick={() => handleAddToCart(item.id)}
                      >
                        Add to Cart
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger mt-2"
                      onClick={() => handleRemoveFromWishlist(item.wishlist_id)}
                    >
                      ❌ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Your wishlist is empty.</p>
        )}
      </div>
    </>
  );
}