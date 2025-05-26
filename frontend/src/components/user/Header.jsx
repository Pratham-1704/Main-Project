import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Use react-router-dom for navigation

function Header() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  // Retrieve name and role from localStorage on component mount
  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");
    setName(storedName || "User"); // Default to "User" if no name is found
    setRole(storedRole || "Role"); // Default to "Role" if no role is found
  }, []);

  return (
    <>
      <header id="header" className="header fixed-top d-flex align-items-center" style={{ backgroundColor:"orange"}}>
        <div className="d-flex align-items-center justify-content-between">
          <a href="index.html" className="logo d-flex align-items-center">
            <img src="assets/img/Companylogo.png" style={{ textAlign: "left" }}
              alt="" />
              <h4 style={{marginTop:"10px", color:"black",marginLeft:"15px"}}>Parshwanath Steel</h4>
            <span className="d-none d-lg-block"></span>
          </a>
          {/* <i className="bi bi-list toggle-sidebar-btn"></i> */}
        </div>

        <div className="search-bar">
          <h5 style={{marginTop:"10px", marginLeft:"400px"}}>Welcome {name}</h5>
        </div>

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            <li className="nav-item dropdown pe-3">
              <a
                className="nav-link nav-profile d-flex align-items-center pe-0"
                href="#"
                data-bs-toggle="dropdown"
              >
                <img
                  src="assets/img/profile-img.jpg"
                  alt="Profile"
                  className="rounded-circle"
                />
                <span className="d-none d-md-block dropdown-toggle ps-2">
                  {name}
                  {/* ({role}) */}
                </span>
              </a>

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6>{name}</h6>
                  <span>{role}</span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  {/* Navigate to AdminProfile.jsx */}
                  <Link to="/dashboard/admin-profile" className="dropdown-item d-flex align-items-center">
                    <i className="bi bi-person"></i>
                    <span>My Profile</span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="users-profile.html"
                  >
                    <i className="bi bi-gear"></i>
                    <span>Account Settings</span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="pages-faq.html"
                  >
                    <i className="bi bi-question-circle"></i>
                    <span>Need Help?</span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <Link to={"/"}>
                    <a className="dropdown-item d-flex align-items-center">
                      <i className="bi bi-box-arrow-right"></i>
                      <span>Sign Out</span>
                    </a>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Header;