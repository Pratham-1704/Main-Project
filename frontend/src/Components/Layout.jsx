import React from 'react';
import './Layout.css';

function Layout() {
  return (
    <div className="layout-wrapper">
      {/* Navbar */}
      <div role="navigation" className="navbar-wrapper">
        <div className="brand-logo">
          <a href="/">
            <img src="https://th.bing.com/th/id/OIP.VGH-_2dPONY9FCieQ-r4ZwHaHa?rs=1&pid=ImgDetMain" alt="Logo" />
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
}

export default Layout;
