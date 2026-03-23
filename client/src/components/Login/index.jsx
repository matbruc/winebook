import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import Spinner from "react-bootstrap/Spinner";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      setError(true);
      return;
    }

    if (!password) {
      setMessage("Please enter your password.");
      setError(true);
      return;
    }

    setMessage("");
    setError(false);
    setLoading(true);

    AuthService.login(email, password)
      .then(() => {
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        const resMessage =
          (error.response?.data?.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
        setError(true);
      });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <span className="logo-icon">&#127866;</span>
          <h1>WINEBOOK</h1>
        </div>

        <div className="auth-card">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to access your wine collection</p>

          {message && (
            <div className={`alert-custom ${error ? "alert-error" : "alert-success"}`} role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-input"
                id="email"
                name="email"
                value={email}
                onChange={onChangeEmail}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group mt-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-input"
                id="password"
                name="password"
                value={password}
                onChange={onChangePassword}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-text">
              Don't have an account?{" "}
              <Link to="/register" className="auth-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
