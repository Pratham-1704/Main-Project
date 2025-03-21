import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure Bootstrap CSS is included
import { FaHome, FaEnvelope, FaBell, FaGlobeAmericas } from 'react-icons/fa'; // Optional: for icons
import './Layout.css'; // Make sure you include your Layout CSS

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      {/* Container wrapper */}
      <div className="container-fluid">
        {/* Navbar brand */}
        <a className="navbar-brand" href="#">Navbar</a>

        {/* Toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars text-light"></i>
        </button>

        {/* Collapsible wrapper */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Left links */}
          <ul className="navbar-nav me-auto d-flex flex-row mt-3 mt-lg-0">
            <li className="nav-item text-center mx-2 mx-lg-1">
              <a className="nav-link active" aria-current="page" href="#!">
                <div>
                  <FaHome className="mb-1" />
                </div>
                Home
              </a>
            </li>
            <li className="nav-item text-center mx-2 mx-lg-1">
              <a className="nav-link" href="#!">
                <div>
                  <FaEnvelope className="mb-1" />
                  <span className="badge rounded-pill badge-notification bg-danger">11</span>
                </div>
                Link
              </a>
            </li>
            <li className="nav-item text-center mx-2 mx-lg-1">
              <a className="nav-link disabled" aria-disabled="true" href="#!">
                <div>
                  <FaEnvelope className="mb-1" />
                  <span className="badge rounded-pill badge-notification bg-warning">11</span>
                </div>
                Disabled
              </a>
            </li>
            <li className="nav-item dropdown text-center mx-2 mx-lg-1">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div>
                  <FaEnvelope className="mb-1" />
                  <span className="badge rounded-pill badge-notification bg-primary">11</span>
                </div>
                Dropdown
              </a>
              {/* Dropdown menu */}
              <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" href="#">Action</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>
          </ul>

          {/* Right links */}
          <ul className="navbar-nav ms-auto d-flex flex-row mt-3 mt-lg-0">
            <li className="nav-item text-center mx-2 mx-lg-1">
              <a className="nav-link" href="#!">
                <div>
                  <FaBell className="mb-1" />
                  <span className="badge rounded-pill badge-notification bg-info">11</span>
                </div>
                Messages
              </a>
            </li>
            <li className="nav-item text-center mx-2 mx-lg-1">
              <a className="nav-link" href="#!">
                <div>
                  <FaGlobeAmericas className="mb-1" />
                  <span className="badge rounded-pill badge-notification bg-success">11</span>
                </div>
                News
              </a>
            </li>
          </ul>

          {/* Search form */}
          <form className="d-flex input-group w-auto ms-lg-3 my-3 my-lg-0">
            <input
              type="search"
              className="form-control"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-primary" type="button" data-bs-ripple-init data-bs-ripple-color="dark">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

const Layout = () => {
  return (
    <div className="layout-wrapper">
      {/* Navbar Section */}
      <Navbar />

      {/* Sidebar */}
      <div className="sidebar">
        <ul className="sidebar-nav">
          <li className="sidebar-item"><a href="#">Dashboard</a></li>
          <li className="sidebar-item"><a href="#">Settings</a></li>
          <li className="sidebar-item"><a href="#">Notifications</a></li>
          <li className="sidebar-item"><a href="#">Messages</a></li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <h1>Welcome to the Layout</h1>
        <p>This is where the main content will go.</p>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Your Company. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
