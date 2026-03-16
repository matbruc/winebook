import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { isEmail } from "validator";
import AuthService from "../../services/AuthService";

const SignUp = () => {
  let navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validName, setValidName] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleRegister = (e) => {
    e.preventDefault();

    // Validate client-side before submitting
    if (!validName || !validEmail || !validPassword) {
      setMessage("Please correct validation errors before submitting.");
      return;
    }

    setMessage("");
    setSuccessful(false);

    AuthService.register(name, email, password).then(
      (response) => {
        setMessage("User created successfully.");
        setSuccessful(true);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    ).then(() => {
      navigate("/home");
      window.location.reload();
    });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleRegister}>
          <h3>Sign Up</h3>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              className={`form-control ${!validName ? 'is-invalid' : ''}`}
              id="username"
              name="username"
              value={name}
              onChange={onChangeUsername}
              required
              minLength={3}
              maxLength={20}
            />
            {!validName && (
              <div className="invalid-feedback">
                The username must be between 3 and 20 characters.
              </div>
            )}
          </div>

          <div className="mb-3">
            <label>Email address</label>
            <input
              type="text"
              className={`form-control ${!validEmail ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              value={email}
              onChange={onChangeEmail}
              required
            />
            {!validEmail && (
              <div className="invalid-feedback">
                This is not a valid email.
              </div>
            )}
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className={`form-control ${!validPassword ? 'is-invalid' : ''}`}
              id="password"
              name="password"
              value={password}
              onChange={onChangePassword}
              required
              minLength={6}
              maxLength={40}
            />
            {!validPassword && (
              <div className="invalid-feedback">
                The password must be between 6 and 40 characters.
              </div>
            )}
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
          <p className="forgot-password text-right">
            Already registered? <a href="/login">sign in</a>
          </p>
          {message && (
            <div className="form-group">
              <div
                className={
                  successful ? "alert alert-success" : "alert alert-danger"
                }
                role="alert"
              >
                {message}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
