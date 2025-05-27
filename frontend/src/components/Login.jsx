import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // <-- Add this import

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // For show/hide password
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8081/admin/login", {
        username,
        password,
      });

      if (res.data.status === "success") {
        localStorage.setItem("adminid", res.data.data.adminid);
        localStorage.setItem("name", res.data.data.name);
        localStorage.setItem("role", res.data.data.role);
        localStorage.setItem("username", res.data.data.username);
        localStorage.setItem("mobileno", res.data.data.mobileno);
        navigate("/dashboard");
      } else {
        setError("Incorrect username or password");
        setTimeout(() => setError(""), 2000); // Hide after 2 seconds
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setTimeout(() => setError(""), 2000); // Hide after 2 seconds
    }
  };

  return (
    <main>
      <div className="" style={{backgroundColor: "#d7d8d7",borderRadius: "20px", padding: "0rem", marginTop: "0rem"}}>
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4" style={{borderRadius: "20px"}}>
          <div className="col-lg-4 col-md-6" style={{backgroundColor: "white", borderRadius: "20px"}}>
            <div className="card mb-0" style={{borderRadius: "20px"}}>
              <div className="card-body" style={{padding: "2rem", backgroundColor: "#e3f0ae", borderRadius: "20px"}}>
                <h5 className="card-title text-center pb-0 fs-4">Login</h5>
                <p className="text-center small">Enter username & password</p>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={login} className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <span
                        className="input-group-text"
                        style={{ cursor: "pointer", background: "white" }}
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                  </div>

                  <div className="col-12">
                    <p className="small mb-0">Forgot password? <Link to="/forgot-password">Recover</Link></p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
