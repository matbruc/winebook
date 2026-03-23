import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { isEmail } from "validator";
import Spinner from "react-bootstrap/Spinner";

const SignUp = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [validName, setValidName] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [validConfirmPassword, setValidConfirmPassword] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setName(username);
    setValidName(username.length >= 3 && username.length <= 20);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
    setValidEmail(isEmail(email));
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
    setValidPassword(password.length >= 6 && password.length <= 40);
  };

  const onChangeConfirmPassword = (e) => {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);
    setValidConfirmPassword(confirmPassword === password && confirmPassword.length > 0);
  };

  const validateForm = () => {
    const errors = {};

    if (!validName) {
      errors.name = "Username must be between 3 and 20 characters";
    }
    if (!validEmail) {
      errors.email = "Please enter a valid email address";
    }
    if (!validPassword) {
      errors.password = "Password must be between 6 and 40 characters";
    }
    if (!validConfirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("Please correct the errors in the form.");
      setError(true);
      return;
    }

    setMessage("");
    setError(false);
    setSuccessful(false);
    setLoading(true);

    AuthService.register(name, email, password)
      .then((response) => {
        setMessage("User created successfully!");
        setSuccessful(true);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      })
      .catch((error) => {
        const resMessage =
          (error.response?.data?.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setError(true);
        setSuccessful(false);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <span className="logo-icon">&#127866;</span>
          <h1>WINEBOOK</h1>
        </div>

        <div className="auth-card">
          <h2 className="auth-title">Join Winebook</h2>
          <p className="auth-subtitle">Create your account and start exploring wines</p>

          {message && (
            <div className={`alert-custom ${error ? "alert-error" : "alert-success"}`} role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Username
              </label>
              <input
                type="text"
                className={`form-input ${!validName ? 'is-invalid' : ''}`}
                id="name"
                name="name"
                value={name}
                onChange={onChangeUsername}
                placeholder="Enter your username"
                required
                minLength={3}
                maxLength={20}
              />
              {!validName && (
                <div className="invalid-feedback">{formErrors.name}</div>
              )}
            </div>

            <div className="form-group mt-4">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className={`form-input ${!validEmail ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={email}
                onChange={onChangeEmail}
                placeholder="you@example.com"
                required
              />
              {!validEmail && (
                <div className="invalid-feedback">{formErrors.email}</div>
              )}
            </div>

            <div className="form-group mt-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className={`form-input ${!validPassword ? 'is-invalid' : ''}`}
                id="password"
                name="password"
                value={password}
                onChange={onChangePassword}
                placeholder="Enter your password"
                required
                minLength={6}
                maxLength={40}
              />
              {!validPassword && (
                <div className="invalid-feedback">{formErrors.password}</div>
              )}
            </div>

            <div className="form-group mt-4">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className={`form-input ${!validConfirmPassword ? 'is-invalid' : ''}`}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChangeConfirmPassword}
                placeholder="Confirm your password"
                required
              />
              {!validConfirmPassword && (
                <div className="invalid-feedback">{formErrors.confirmPassword}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" />
                  <span>Creating account...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-text">
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
