import React from "react";
import "./Navbar.css"; // Assuming your styles are in a separate CSS file

const Navbar = () => {
    return (
        <div role="navigation">
            <div className="navbar-wrapper">
                <div className="brand-logo">
                    <a href="/">
                        <img src="/static_files/images/htmljstemplatesLogo.png" alt="Logo" />
                    </a>
                </div>
                <div className="brand-phone">
                    <a href="tel:+9002341234">
                        <i className="fa fa-phone me-3"></i> 900 234-1234
                    </a>
                </div>
                <div className="text-center">
                    <nav className="top-bar-wrap">
                        <ul className="top-bar">
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    <span className="inner-link">Home</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    <span className="inner-link">About</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    <span className="inner-link">Contact</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    <span className="inner-link">Support</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <nav className="main-nav-wrap">
                        <ul className="main-nav">
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    <span className="inner-link">Services</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    <span className="inner-link">Career</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    <span className="inner-link">Features</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    <span className="inner-link">Gallery</span>
                                </a>
                            </li>
                        </ul>
                    </nav>

                </div>
            </div>
        </div>
    );
};

export default Navbar;
