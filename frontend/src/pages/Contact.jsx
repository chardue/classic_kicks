export default function Contact() {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Contact Us</h1>

      <section className="mb-5 text-center">
        <p className="lead">
          Have questions, feedback, or need support? We’d love to hear from you.
          Our team is here to help!
        </p>
      </section>

      <div className="row g-4">
        <div className="col-md-5">
          <div className="card shadow-sm border-0 h-100 bg-light">
            <div className="card-body">
              <h4 className="fw-bold mb-3">Get in Touch</h4>
              <p>
                <i className="bi bi-geo-alt-fill me-2"></i>
                123 Shoe Street, Manila, Philippines
              </p>
              <p>
                <i className="bi bi-envelope-fill me-2"></i>
                kicksnstyles@gmail.com
              </p>
              <p>
                <i className="bi bi-telephone-fill me-2"></i>
                +63 912 345 6789
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h4 className="fw-bold mb-3">Send Us a Message</h4>

              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Your Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    name="subject"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="4"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-secondary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}