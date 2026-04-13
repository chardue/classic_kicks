import { useEffect, useState } from "react";

export default function Home() {
  const [showAlert, setShowAlert] = useState(false);

  // Temporary frontend data based on your current project assets
  const brands = [
    { id: 1, name: "Nike", image: "/images/nike.svg" },
    { id: 2, name: "Adidas", image: "/images/adidas.svg" },
    { id: 3, name: "Jordan", image: "/images/jordan.svg" },
    { id: 4, name: "Puma", image: "/images/puma.svg" },
    { id: 5, name: "Anta", image: "/images/anta.svg" },
    { id: 6, name: "Converse", image: "/images/converse.svg" },
    { id: 7, name: "New Balance", image: "/images/new balance.svg" },
    { id: 8, name: "Under Armour", image: "/images/under armour.svg" }
  ];

  const featuredProducts = [];

  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const brandChunks = chunkArray(brands, 4);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <>
      <style>{`
        .floating-alert {
          position: fixed;
          top: 120px;
          left: 85%;
          transform: translateX(-50%);
          width: auto;
          max-width: 900px;
          z-index: 2000;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
        }

        .fade-text {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .carousel-item.active .fade-text:nth-child(1) {
          transition-delay: 0.2s;
          opacity: 1;
          transform: translateY(0);
        }

        .carousel-item.active .fade-text:nth-child(2) {
          transition-delay: 0.4s;
          opacity: 1;
          transform: translateY(0);
        }

        .carousel-item.active .fade-text:nth-child(3) {
          transition-delay: 0.6s;
          opacity: 1;
          transform: translateY(0);
        }

        .cardo img {
          transition: transform 0.4s ease;
        }

        .cardo:hover img {
          transform: scale(1.1);
        }

        .cardo:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.20);
          transform: translateY(-3px);
          transition: all 0.3s ease;
        }

        .img-fit {
          object-fit: cover;
        }

        .overlay-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: rgba(0, 0, 0, 0.5);
          padding: 8px 12px;
          border-radius: 4px;
          color: white;
          text-align: center;
        }
      `}</style>

      {showAlert && (
        <div
          id="session-alert"
          className="alert alert-success alert-dismissible fade show floating-alert"
          role="alert"
        >
          Login successful.
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setShowAlert(false)}
          ></button>
        </div>
      )}

      <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div
            className="carousel-item active"
            style={{ backgroundColor: "#e2d9ceff", padding: "60px 0" }}
          >
            <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-between">
              <div className="text-center text-lg-start mb-4 mb-lg-0">
                <p className="text-muted small fade-text">Every step, game On!</p>
                <h1 className="display-5 fw-bold mb-3 fade-text">
                  Elevate every
                  <br />
                  walking moment!
                </h1>
                <a
                  href="/shop"
                  className="btn btn-dark px-4 py-2 rounded-pill fade-text"
                >
                  BUY NOW
                </a>
              </div>
              <div className="text-center">
                <img
                  src="/images/j1.png"
                  alt="Sneakers"
                  className="img-fluid"
                  style={{ maxHeight: "450px" }}
                />
              </div>
            </div>
          </div>

          <div
            className="carousel-item"
            style={{ backgroundColor: "#e2d9ceff", padding: "60px 0" }}
          >
            <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-between">
              <div className="text-center text-lg-start mb-4 mb-lg-0">
                <p className="text-muted small fade-text">Every step, game On!</p>
                <h1 className="display-5 fw-bold mb-3 fade-text">
                  Elevate every
                  <br />
                  walking moment!
                </h1>
                <a
                  href="/shop"
                  className="btn btn-dark px-4 py-2 rounded-pill fade-text"
                >
                  BUY NOW
                </a>
              </div>
              <div className="text-center">
                <img
                  src="/images/banner2.png"
                  alt="Sneakers"
                  className="img-fluid"
                  style={{ maxHeight: "450px" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        <h2 className="text-center fw-bold mb-4">Explore Popular Brands</h2>

        <div id="categoryCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {brandChunks.map((chunk, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <div className="row g-4 text-center">
                  {chunk.map((brand) => (
                    <div className="col-6 col-md-3" key={brand.id}>
                      <a
                        href={`/shop?brand=${brand.id}`}
                        className="text-decoration-none text-dark"
                      >
                        <div className="card shadow-sm border-0 h-100 cardo">
                          <img
                            src={brand.image}
                            className="card-img-top p-3"
                            style={{ height: "100px", objectFit: "contain" }}
                            alt={brand.name}
                          />
                          <div className="card-body">
                            <h6 className="mb-0">{brand.name}</h6>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#categoryCarousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon bg-dark rounded-circle p-2"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#categoryCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon bg-dark rounded-circle p-2"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <div className="container-fluid p-0 pb-5">
        <div className="row g-0">
          <div className="col-md-3">
            <div className="position-relative h-100">
              <img
                src="/images/homeadidas.png"
                className="w-100 h-100 img-fit"
                alt="Image 1"
              />
            </div>
          </div>

          <div className="col-md-3">
            <div className="position-relative h-100">
              <img
                src="/images/homenewbalnce.png"
                className="w-100 h-100 img-fit"
                alt="Image 2"
              />
            </div>
          </div>

          <div className="col-md-3">
            <div className="position-relative h-100">
              <img
                src="/images/homenike.png"
                className="w-100 h-100 img-fit"
                alt="Image 3"
              />
            </div>
          </div>

          <div className="col-md-3">
            <div className="position-relative h-100">
              <img
                src="/images/logo.png"
                className="w-100 h-100 img-fit"
                alt="Image 4"
              />
            </div>
          </div>
        </div>
      </div>

      <section className="marquee-section">
        <div className="container-fluid">
          <div className="offer-text-wrap">
            <ul className="list-unstyled grid-wrap">
              <li className="grid-wrapper"><div className="richtext"><p>Kicks 'n Style</p></div></li>
              <li className="grid-wrapper"><div className="richtext"><p><strong>•</strong></p></div></li>
              <li className="grid-wrapper"><div className="richtext"><p>Kicks 'n Style</p></div></li>
              <li className="grid-wrapper"><div className="richtext"><p><strong>•</strong></p></div></li>
              <li className="grid-wrapper"><div className="richtext"><p>Kicks 'n Style</p></div></li>
              <li className="grid-wrapper"><div className="richtext"><p><strong>•</strong></p></div></li>
              <li className="grid-wrapper"><div className="richtext"><p>Kicks 'n Style</p></div></li>
              <li className="grid-wrapper"><div className="richtext"><p><strong>•</strong></p></div></li>
              <li className="grid-wrapper"><div className="richtext"><p>Kicks 'n Style</p></div></li>
            </ul>

            <ul className="list-unstyled grid-wrap">
              <li className="grid-wrapper"><div className="richtext"><p><strong>•</strong></p></div></li>
              <li className="grid-wrapper"><div className="richtext"><p>Kicks 'n Style</p></div></li>
              <li className="grid-wrapper"><div className="richtext"><p><strong>•</strong></p></div></li>
              <li className="grid-wrapper"><div className="richtext"><p>Kicks 'n Style</p></div></li>
              <li className="grid-wrapper"><div className="richtext"><p><strong>•</strong></p></div></li>
              <li className="grid-wrapper"><div className="richtext"><p>Kicks 'n Style</p></div></li>
              <li className="grid-wrapper"><div className="richtext"><p><strong>•</strong></p></div></li>
              <li className="grid-wrapper"><div className="richtext"><p>Kicks 'n Style</p></div></li>
              <li className="grid-wrapper"><div className="richtext"><p><strong>•</strong></p></div></li>
              <li className="grid-wrapper"><div className="richtext"><p>Kicks 'n Style</p></div></li>
            </ul>
          </div>
        </div>
      </section>

      <div className="container mt-5 mb-5">
        <h2 className="text-center fw-bold mb-4">Featured Products</h2>
        <div className="row g-4">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <div className="col-6 col-md-3" key={product.id}>
                <div className="card h-100 shadow-sm border-0">
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt="Product Image"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6 className="fw-bold">{product.name}</h6>
                    <p className="text-muted small mb-2">
                      ₱ {Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-truncate mb-3">{product.description}</p>
                    <a href={`/product?id=${product.id}`} className="btn btn-sm btn-dark mt-auto">
                      View Product
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">No featured products found.</p>
          )}
        </div>
      </div>
    </>
  );
}