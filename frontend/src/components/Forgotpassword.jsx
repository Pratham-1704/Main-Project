import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [mobileno, setMobileno] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:8081/admin/forgot-password', {
        username,
        mobileno,
        newPassword,
      });

      if (res.data.message) {
        setMessage(res.data.message);
        setUsername('');
        setMobileno('');
        setNewPassword('');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <main>
      <div className="container" style={{backgroundColor: "#d7d8d7", borderRadius: "20px", padding: "0rem", marginTop: "0rem"}}>
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4" style={{borderRadius: "20px"}}>
          <div className="col-lg-4 col-md-6" style={{backgroundColor: "white", borderRadius: "20px"}}>
            <div className="card mb-0" style={{borderRadius: "20px"}}>
              <div className="card-body" style={{padding: "2rem", backgroundColor: "#d9f1ed", borderRadius: "20px"}}>
                <h5 className="card-title text-center pb-0 fs-4">Forgot Password</h5>
                <p className="text-center small">Enter your username, mobile number, and new password</p>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleReset} className="row g-3">
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
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={mobileno}
                      onChange={(e) => setMobileno(e.target.value)}
                      pattern="\d{10}"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100">Reset Password</button>
                  </div>

                  <div className="col-12 text-center">
                    <p className="small mb-0">
                      Remembered? <Link to="/">Login</Link>
                    </p>
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

export default ForgotPassword;
