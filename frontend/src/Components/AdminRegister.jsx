import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const AdminRegister = () => {
    return (
        <div id="root" className="root front-container d-flex justify-content-center px-3 py-5">
            <section id="content" className="content w-100" style={{ maxWidth: "600px", border: "1px solid #ccc", borderRadius: "10px", padding: "20px", backgroundColor: "#fff" }}>
                <div className="content__boxed w-100 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                    <div className="content__wrap">
                        <div className="card shadow-lg p-4">
                            <div className="card-body">
                                <div className="text-center">
                                    <h1 className="h3">Create a New Admin Account</h1>
                                    <p>Join the Nifty community as an administrator! Let's set up your account.</p>
                                </div>
                                <form className="mt-4" action="#">
                                    <div className="row g-3 mb-4">
                                        <div className="col-sm-6">
                                            <input type="text" className="form-control" placeholder="First name" aria-label="First name" autoFocus />
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="text" className="form-control" placeholder="Last name" aria-label="Last name" />
                                        </div>
                                        <div className="col-12">
                                            <input type="text" className="form-control" placeholder="Username" aria-label="Username" />
                                        </div>
                                        <div className="col-12">
                                            <input type="email" className="form-control" placeholder="Email" aria-label="Email" />
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="password" className="form-control" placeholder="Password" aria-label="Password" />
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="password" className="form-control" placeholder="Confirm Password" aria-label="Confirm Password" />
                                        </div>
                                    </div>
                                    <div className="form-check">
                                        <input id="_dm-registerCheck" className="form-check-input" type="checkbox" />
                                        <label htmlFor="_dm-registerCheck" className="form-check-label">
                                            I agree with the <a href="#" className="btn-link text-decoration-underline">Terms and Conditions</a>
                                        </label>
                                    </div>
                                    <div className="d-grid mt-4">
                                        <button className="btn btn-primary btn-lg" type="submit">Register</button>
                                    </div>
                                </form>
                                <div className="d-flex justify-content-between mt-4">
                                    Already have an account?
                                    <Link to="/admin-login" className="btn-link text-decoration-none">Sign In</Link>
                                </div>
                                <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
                                    <h5 className="m-0">Sign Up with</h5>
                                    <div className="ms-3">
                                        <a href="#" className="btn btn-sm btn-icon btn-hover btn-danger text-inherit">
                                            <i className="fab fa-google" style={{ fontSize: "0.7rem" }}></i>
                                        </a>
                                        <a href="#" className="btn btn-sm btn-icon btn-hover btn-info text-inherit">
                                            <i className="fab fa-twitter" style={{ fontSize: "0.7rem" }}></i>
                                        </a>
                                        <a href="#" className="btn btn-sm btn-icon btn-hover btn-primary text-inherit">
                                            <i className="fab fa-facebook" style={{ fontSize: "0.7rem" }}></i>
                                        </a>
                                        <a href="#" className="btn btn-sm btn-icon btn-hover btn-warning text-inherit">
                                            <i className="fab fa-instagram" style={{ fontSize: "0.7rem" }}></i>
                                        </a>
                                    </div>
                                </div>


                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center gap-3 mt-4">

                            <div className="text-center mt-3">
                                <button className="btn btn-light" onClick={() => window.history.back()}>
                                    ⬅️ Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminRegister;
