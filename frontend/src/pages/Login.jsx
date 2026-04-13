import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
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
      const data = await login({ username, password });

      setMessage(data.message || "Login successful");
      setMessageClass("login-message-success");

      setTimeout(() => {
        if (data.user?.role === "admin") {
          navigate("/admindash");
        } else {
          navigate("/");
        }
      }, 800);
    } catch (error) {
      setMessage(error.message);
      setMessageClass("login-message-error");
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
        .login-page {
          font-family: 'Roboto', sans-serif;
          margin: 0;
          background: #f0f2f5;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 30px 15px;
        }

        .login-container {
          background: #fff;
          padding: 40px 30px;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
        }

        .login-title {
          text-align: center;
          margin-bottom: 25px;
          color: #333;
        }

        .login-input {
          width: 95%;
          padding: 12px 15px;
          margin: 10px 0 20px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
          transition: border-color 0.3s;
        }

        .login-input:focus {
          border-color: #007bff;
          outline: none;
        }

        .login-button {
          width: 103%;
          padding: 12px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .login-button:hover {
          background-color: #0056b3;
        }

        .login-message-success {
          color: green;
          margin-bottom: 20px;
          text-align: center;
        }

        .login-message-error {
          color: red;
          margin-bottom: 20px;
          text-align: center;
        }

        .login-footer-text {
          text-align: center;
          margin-top: 20px;
        }

        .login-link {
          color: #007bff;
          text-decoration: none;
        }

        .login-link:hover {
          text-decoration: underline;
        }

        .logo-wrapper {
          text-align: center;
          margin-bottom: 20px;
        }

        .logo-image {
          height: 80px;
          width: auto;
        }

        .password-wrapper {
          position: relative;
          width: 100%;
        }

        .password-input {
          width: 89%;
          padding: 12px 40px 12px 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
          margin: 10px 0 20px 0;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 42%;
          transform: translateY(-50%);
          cursor: pointer;
        }
      `}</style>

      <div className="login-page">
        <div className="login-container">
          <div className="logo-wrapper">
            <a href="/">
              <img
                src="/images/logowithbg.png"
                alt="Logo"
                className="logo-image"
              />
            </a>
          </div>

          <h2 className="login-title">Login</h2>

          {message !== "" && <div className={messageClass}>{message}</div>}

          <form onSubmit={handleSubmit}>
            <span style={{ textDecoration: "underline" }}>U</span>sername:
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              accessKey="U"
              className="login-input"
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
                className="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
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

            <button type="submit" className="login-button" accessKey="L" disabled={submitting}>
              {submitting ? "Logging in..." : <><span style={{ textDecoration: "underline" }}>L</span>ogin</>}
            </button>
          </form>

          <p className="login-footer-text">
            Don't have an account?{" "}
            <a href="/register" className="login-link" accessKey="R">
              <span style={{ textDecoration: "underline" }}>R</span>egister here
            </a>
          </p>
        </div>
      </div>
    </>
  );
}