import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        // Save user data to localStorage
        //localStorage.setItem("user", JSON.stringify(res.data.user)); // assuming response includes a `user` object
       // console.log(res.data.user);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
  

  return (
    <main>
      <div className="container">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="col-lg-4 col-md-6">
            <div className="card mb-3">
              <div className="card-body">
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
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
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
