import { Link } from "react-router-dom";
import BackToTop from "./BackToTop";

export default function Footer() {
  return (
    <>
      <footer className="bg-dark text-light mt-auto py-4">
        <div className="container">
          <div className="row align-items-start">
            <div className="col-md-6 mb-4">
              <h5 className="fw-bold">Stay in touch</h5>
              <form className="d-flex align-items-center border-bottom pb-2">
                <input
                  type="email"
                  className="form-control border-0 shadow-none"
                  placeholder="kicksnstyles@gmail.com"
                  style={{ maxWidth: "300px" }}
                />
                <button type="submit" className="btn p-0 ms-2" aria-label="submit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="white"
                    className="bi bi-box-arrow-up-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.364 2.05a.5.5 0 0 1 .707 0L13 7.979V4.5a.5.5 0 0 1 1 0v5.5a.5.5 0 0 1-.5.5H8a.5.5 0 0 1 0-1h3.479L6.05 2.757a.5.5 0 0 1 0-.707z"
                    />
                    <path
                      fillRule="evenodd"
                      d="M13.5 14a.5.5 0 0 1-.5.5H2a1 1 0 0 1-1-1V3a.5.5 0 0 1 1 0v10a.5.5 0 0 0 .5.5H13a.5.5 0 0 1 .5.5z"
                    />
                  </svg>
                </button>
              </form>
            </div>

            <div className="col-md-6 mb-4 text-md-end">
              <nav>
                {/* ✅ Converted links */}
                <Link to="/about" className="text-light me-3 text-decoration-none">
                  ABOUT US
                </Link>

                <Link to="/contact" className="text-light me-3 text-decoration-none">
                  CONTACT
                </Link>
              </nav>
            </div>
          </div>

          <hr />

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="mb-2 mb-md-0">
              <strong>Kicks 'N Styles</strong>
            </div>
            <div className="text-center">© 2025, Copy all rights reserved</div>
          </div>
        </div>
      </footer>

      <BackToTop />
    </>
  );
}