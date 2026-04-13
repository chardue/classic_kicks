import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setMessageClass("");

    try {
      const data = await register({ email, username, password });
      setMessage(data.message || "Registration successful");
      setMessageClass("message-success");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setMessage(error.message);
      setMessageClass("message-error");
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <style>{`
        .register-page {
          font-family: 'Roboto', sans-serif;
          margin: 0;
          background: #f0f2f5;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 30px 15px;
        }

        .register-container {
          background: #fff;
          padding: 40px 30px;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
        }

        .register-title {
          text-align: center;
          margin-bottom: 25px;
          color: #333;
        }

        .register-input {
          width: 95%;
          padding: 12px 15px;
          margin: 10px 0 20px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
          transition: border-color 0.3s;
        }

        .register-input:focus {
          border-color: #28a745;
          outline: none;
        }

        .register-button {
          width: 103%;
          padding: 12px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .register-button:hover {
          background-color: #218838;
        }

        .message-success {
          color: green;
          margin-top: 20px;
          text-align: center;
          font-weight: bold;
        }

        .message-error {
          color: red;
          margin-top: 20px;
          text-align: center;
          font-weight: bold;
        }

        .register-footer-text {
          text-align: center;
          margin-top: 20px;
        }

        .register-link {
          color: #28a745;
          text-decoration: none;
        }

        .register-link:hover {
          text-decoration: underline;
        }

        .password-wrapper {
          position: relative;
          width: 89%;
        }

        .password-input {
          width: 100%;
          padding: 12px 40px 12px 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
          margin: 10px 0 20px 0;
        }

        .password-toggle {
          position: absolute;
          right: -30px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
        }
      `}</style>

      <div className="register-page">
        <div className="register-container">
          <h2 className="register-title">Register New Account</h2>

          <form onSubmit={handleSubmit}>
            <span style={{ textDecoration: "underline" }}>E</span>mail:
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              accessKey="E"
              maxLength="50"
              pattern="[A-Za-z0-9]+@gmail\.com"
              title="Must be a Gmail address, max 50 characters, only letters and numbers before @gmail.com"
              className="register-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <span style={{ textDecoration: "underline" }}>U</span>sername:
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              accessKey="U"
              maxLength="12"
              pattern="[A-Za-z0-9_]+"
              title="Max 12 characters, only letters, numbers, and underscore"
              className="register-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <span style={{ textDecoration: "underline" }}>P</span>assword:
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                required
                accessKey="P"
                minLength="8"
                maxLength="16"
                title="Password must be 8–16 characters"
                className="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                id="togglePassword"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                <img
                  src={
                    showPassword
                      ? "https://cdn-icons-png.flaticon.com/512/709/709612.png"
                      : "https://cdn-icons-png.flaticon.com/512/159/159604.png"
                  }
                  alt="Toggle Password"
                  width="20"
                  height="20"
                />
              </span>
            </div>

            <button type="submit" className="register-button" accessKey="R" disabled={submitting}>
              {submitting ? "Registering..." : <><span style={{ textDecoration: "underline" }}>R</span>egister</>}
            </button>

            {message !== "" && <div className={messageClass}>{message}</div>}

            <p className="register-footer-text">
              Already have an account?{" "}
              <a href="/login" className="register-link" accessKey="S">
                <span style={{ textDecoration: "underline" }}>S</span>ign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}