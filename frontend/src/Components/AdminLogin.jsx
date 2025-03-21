import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminLogin = () => {
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
        <div className="content__boxed w-100 min-vh-100 d-flex flex-column align-items-center justify-content-center">
          <div className="content__wrap">
            <div className="card shadow-lg p-4">
              <div className="card-body">
                <div className="text-center">
                  <h1 className="h3 fw-bold">🔐 Sign In</h1>
                  <p className="text-muted">Access your admin account</p>
                </div>
                <form className="mt-4">
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      aria-label="Username"
                      autoFocus
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      aria-label="Password"
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center">                
                    <a href="#" className="btn-link text-decoration-none">Forgot Password?</a>
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
