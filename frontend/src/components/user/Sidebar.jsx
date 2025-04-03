import React from 'react'
import { Link, useNavigate } from 'react-router'

function Sidebar() {

  let navigate = useNavigate();

  function logout(e){
    e.preventDefault();
    localStorage.clear();
    navigate("/");
  }

  return (
    <aside id="sidebar" class="sidebar">
    <ul class="sidebar-nav" id="sidebar-nav">
      <li class="nav-item">
        <Link class="nav-link " to={"/dashboard"}>
          <i class="bi bi-grid"></i>
          <span>Dashboard</span>
        </Link>
        
      </li>

      <li class="nav-item">
        <a
          class="nav-link collapsed"
          data-bs-target="#components-nav"
          data-bs-toggle="collapse"
          href="#"
        >
          <i class="bi bi-menu-button-wide"></i>
          <span>Masters</span>
          <i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul
          id="components-nav"
          class="nav-content collapse "
          data-bs-parent="#sidebar-nav"
        >
          <li>
            <Link to={"/master/Admin"}>
              <i class="bi bi-circle"></i>
              <span>Admin</span>
            </Link>
          </li>
          <li>
            <Link to={"/master/employees"}>
              <i class="bi bi-circle"></i>
              <span>Employees</span>
            </Link>
          </li><li>
            <Link to={"/master/financialYear"}>
              <i class="bi bi-circle"></i>
              <span>FinancialYear</span>
            </Link>
          </li>

          <li>
            <Link to={"/master/Categories"}>
              <i class="bi bi-circle"></i>
              <span>Categories</span>
            </Link>
          </li>
          <li>
            <Link to={"/master/products"}>
              <i class="bi bi-circle"></i>
              <span>Products</span>
            </Link>
          </li>
          <li>
            <Link to={"/master/brands"}>
              <i class="bi bi-circle"></i>
              <span>Brand</span>
            </Link>
          </li>
          <li>
            <Link to={"/master/firms"}>
              <i class="bi bi-circle"></i>
              <span>Firms</span>
            </Link>
          </li>

          <li>
            <Link to={"/master/brandproduct"}>
              <i class="bi bi-circle"></i>
              <span>Brand Product</span>
            </Link>
          </li>

          <li>
            <Link to={"/master/customers"}>
              <i class="bi bi-circle"></i>
              <span>Customers</span>
            </Link>
          </li>
          <Link to={"/master/leads"}>
              <i class="bi bi-circle"></i>
              <span>Lead</span>
            </Link>

        </ul>
      </li>
      <li class="nav-item">
        <Link class="nav-link" onClick={(e)=>{ logout(e); }}>
          <i class="bi bi-grid"></i>
          <span>Logout</span>
        </Link>
      </li>
    </ul>
  </aside>
  )
}

export default Sidebar;