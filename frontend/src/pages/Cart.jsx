import { useEffect, useMemo, useState } from "react";
import {
  fetchCart,
  updateCartItemQuantity,
  deleteCartItem
} from "../services/cartService";

export default function Cart() {
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("alert-success");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + Number(item.price) * Number(item.quantity);
    }, 0);
  }, [cartItems]);

  useEffect(() => {
    async function loadCart() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchCart();
        setCartItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, []);

  const handleQuantityChange = async (cartItemId, currentQty, action) => {
  try {
    if (action === "decrease" && currentQty === 1) {
      const data = await deleteCartItem(cartItemId);

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.cart_item_id !== cartItemId)
      );

      setMessage(data.message || "Item removed from cart.");
      setMessageClass("alert-success");
      return;
    }

    let newQty = currentQty;

    if (action === "decrease") {
      newQty = currentQty - 1;
    }

    if (action === "increase") {
      newQty = currentQty + 1;
    }

    const data = await updateCartItemQuantity(cartItemId, newQty);

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cart_item_id === cartItemId
          ? { ...item, quantity: data.quantity }
          : item
      )
    );

    setMessage("Cart updated successfully.");
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
                Cart
              </li>
            </ol>
          </nav>
          <h1 className="fw-bold text-uppercase">Cart</h1>
        </div>
      </div>

      <div className="container mt-5">
        <h2>Your Shopping Cart</h2>

        {loading ? (
          <p>Loading cart...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.cart_item_id} style={{ verticalAlign: "middle" }}>
                    <td>
                      {item.name}
                      <br />
                      <small>Size: {item.sizes}</small>
                    </td>

                    <td>
                      <img src={item.image} width="80" alt={item.name} />
                    </td>

                    <td>
                      ₱
                      {Number(item.price).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                      })}
                    </td>

                    <td
                      style={{
                        height: "100px",
                        verticalAlign: "middle",
                        textAlign: "center"
                      }}
                    >
                      <div className="d-flex h-100">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary mt-4"
                          onClick={() =>
                            handleQuantityChange(
                              item.cart_item_id,
                              Number(item.quantity),
                              "decrease"
                            )
                          }
                        >
                          −
                        </button>

                        <span className="mx-2 mt-4">{item.quantity}</span>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary mt-4"
                          onClick={() =>
                            handleQuantityChange(
                              item.cart_item_id,
                              Number(item.quantity),
                              "increase"
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td>
                      ₱
                      {Number(item.price * item.quantity).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2 }
                      )}
                    </td>
                  </tr>
                ))}

                <tr>
                  <td colSpan="4" className="text-end">
                    <strong>Total:</strong>
                  </td>
                  <td colSpan="2">
                    <strong>
                      ₱
                      {Number(totalPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                      })}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="text-end">
              <a
                href="/checkout"
                className="btn mb-5"
                style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  border: "none"
                }}
              >
                Proceed to Checkout
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
}