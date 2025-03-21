import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8081/admin/login", {
        username,
        password,
      });

      if (response.data?.status === "success") {
        alert("Login Successful!");
        navigate("/layout"); // Redirect on successful login
        
        setUsername("");
        setPassword("");

      } else {
        setErrorMessage(response.data?.message || "Invalid username or password");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        setErrorMessage(error.response.data?.message || "Server error occurred");
      } else if (error.request) {
        // Request was made but no response received
        setErrorMessage("No response from server. Please try again later.");
      } else {
        // Something else caused the error
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div id="root" className="root front-container d-flex justify-content-center px-3 py-5">
      <section
        id="content"
        className="content w-100"
        style={{
          maxWidth: "400px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "20px",
          backgroundColor: "#fff",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="content__boxed w-100 min-vh-95 d-flex flex-column align-items-center justify-content-center">
          <div className="content__wrap">
            <div className="card shadow-lg p-4">
              <div className="card-body">
                <div className="text-center">
                  <h1 className="h3 fw-bold">🔐 Sign In</h1>
                  <p className="text-muted">Access your admin account</p>
                </div>
                {errorMessage && (
                  <div className="alert alert-danger text-center">{errorMessage}</div>
                )}
                <form className="mt-4" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      aria-label="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      aria-label="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <a href="/forgot-password" className="btn-link text-decoration-none">
                      Forgot Password?
                    </a>
                  </div>
                  <div className="d-grid mt-4">
                    <button className="btn btn-primary btn-lg" type="submit">
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;
