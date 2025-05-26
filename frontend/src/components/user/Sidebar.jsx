import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  let navigate = useNavigate();

  function logout(e) {
    e.preventDefault();
    localStorage.clear();
    navigate("/");
  }

  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        
        {/* Dashboard */}
        <li className="nav-item">
          <Link className="nav-link" to={"/dashboard"}>
            <i className="bi bi-grid"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        {/* Masters Section */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            data-bs-target="#masters-nav"
            data-bs-toggle="collapse"
            href="#"
          >
            <i className="bi bi-menu-button-wide"></i>
            <span>Masters</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="masters-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <Link to={"/master/Admin"}>
                <i className="bi bi-circle"></i>
                <span>Admin</span>
              </Link>
            </li>
            <li>
              <Link to={"/master/financialYear"}>
                <i className="bi bi-circle"></i>
                <span>Financial Year</span>
              </Link>
            </li>
            <li>
              <Link to={"/master/Categories"}>
                <i className="bi bi-circle"></i>
                <span>Categories</span>
              </Link>
            </li>
            <li>
              <Link to={"/master/brands"}>
                <i className="bi bi-circle"></i>
                <span>Brand</span>
              </Link>
            </li>
            <li>
              <Link to={"/master/products"}>
                <i className="bi bi-circle"></i>
                <span>Products</span>
              </Link>
            </li>
            <li>
              <Link to={"/master/customers"}>
                <i className="bi bi-circle"></i>
                <span>Customers</span>
              </Link>
            </li>
            {/* <li>
              <Link to={"/master/brandproduct"}>
                <i className="bi bi-circle"></i>
                <span>Brand Product</span>
              </Link>
            </li> */}
            <li>
              <Link to={"/master/Parities"}>
                <i className="bi bi-circle"></i>
                <span>Parities</span>
              </Link>
            </li>
          </ul>
        </li>

        {/* Lead Section */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            data-bs-target="#lead-nav"
            data-bs-toggle="collapse"
            href="#"
          >
            <i className="bi bi-menu-button-wide"></i>
            <span>Lead</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="lead-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <Link to={"/lead/lead-record"}>
                <i className="bi bi-circle"></i>
                <span>Lead</span>
              </Link>
            </li>
          </ul>
        </li>

        {/* Quotation Section */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            data-bs-target="#quotation-nav"
            data-bs-toggle="collapse"
            href="#"
          >
            <i className="bi bi-menu-button-wide"></i>
            <span>Quotation</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="quotation-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <Link to={"/quotation/quotations"}>
                <i className="bi bi-circle"></i>
                <span>Quotations</span>
              </Link>
            </li>
             {/* <li>
              <Link to={"/quotation/order"}>
                <i className="bi bi-circle"></i>
                <span>order</span>
              </Link>
            </li> */}
          </ul>
        </li>


        {/* Order Section */}
          <li className="nav-item">
          <a
            className="nav-link collapsed"
            data-bs-target="#order-nav"
            data-bs-toggle="collapse"
            href="#"
          >
            <i className="bi bi-menu-button-wide"></i>
            <span>Order</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="order-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <Link to={"/order/orders"}>
                <i className="bi bi-circle"></i>
                <span>Orders</span>
              </Link>
            </li>
          </ul>
        </li>


        {/* Logout */}
        <li className="nav-item">
          <Link className="nav-link" onClick={(e) => logout(e)}>
            <i className="bi bi-grid"></i>
            <span>Logout</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
