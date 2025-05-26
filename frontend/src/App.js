import './App.css';
import Login from './components/Login';

import Landing from './components/user/Landing';
import Dashboard from './components/user/dashboard/Dashboard';
import Forgotpassword from './components/Forgotpassword';
import Categories from './components/user/master/Categories';
import Admin from './components/user/master/Admin';
import Products from './components/user/master/Products';
import Brand from './components/user/master/Brand';
import Firms from './components/user/master/Firms';
import BrandProducts from './components/user/master/BrandProduct';
import Customers from './components/user/master/Customers';
import FinancialYear from './components/user/master/FinancialYear';
import Lead from './components/user/Lead/Lead';
import Quotations from './components/user/Quotation/Quotations';
import Order from './components/user/Lead/Order';
// import AdminProfile from './components/user/AdminProfile';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import LeadRecord from './components/user/Lead/LeadRecord';
import LeadDetails from './components/user/Lead/LeadDetails';
import SBQ from './components/user/Lead/SBQ';
import MBQ from './components/user/Lead/MBQ';
import ManageParity from './components/user/master/ManageParity';
import Parities from './components/user/master/parities';
import QuotationDetails from './components/user/Quotation/QuotationDetails';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import OrderDetails from './components/user/Order/orderDetails';
import DOrder from './components/user/Order/DOrder';
import ModifyQuotation from './components/user/Quotation/ModifyQuotation';
import AdminProfile from './components/user/dashboard/AdminProfile';



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<Forgotpassword />} />

          {/* Protected Routes */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          >
            <Route path="" element={<Dashboard />} />
            <Route path="admin-profile" element={<AdminProfile />} />
            {/* <Route path="admin-profile" element={<AdminProfile />} /> */}
          </Route>

          <Route
            path="master"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          >
            <Route path="admin" element={<Admin />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="brands" element={<Brand />} />
            <Route path="firms" element={<Firms />} />
            <Route path="brandproduct" element={<BrandProducts />} />
            <Route path="customers" element={<Customers />} />
            <Route path="financialyear" element={<FinancialYear />} />
            {/* <Route path="leads" element={<LeadRecord />} /> */}
            <Route path="quotations" element={<Quotations />} />
            <Route path='manage products' element={<BrandProducts />} />
            <Route path="manage-parity" element={<ManageParity />} />
            <Route path="parities" element={<Parities />} />
          </Route>

          <Route
            path="lead"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          >
            <Route path="new-lead" element={<Lead />} />
            {/* <Route path="quotations" element={<Quotations />} /> */}
            <Route path="order" element={<Order />} />
            <Route path="lead-record" element={<LeadRecord />} />
            <Route path="/lead/lead-details/:leadid" element={<LeadDetails />} />
            <Route path="sbq" element={<SBQ />} />
            <Route path="sbq/:id" element={<SBQ />} />
            <Route path="mbq" element={<MBQ />} />

          </Route>
          <Route
            path="quotation"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          >
            <Route path="quotations" element={<Quotations />} />
            <Route path="quotation-details/:id" element={<QuotationDetails/>} />
            <Route path="dOrder" element={<DOrder />} />
            <Route path="dOrder/:id" element={<DOrder />} />
            <Route path="modifyQtation/:id" element={<ModifyQuotation />} />
            
            {/* <Route path="order" element={<Order />} /> */}

          </Route>

          <Route
            path="order"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          >             
            <Route path="orders" element={<Order />} />
            <Route path="order-details/:id" element={<OrderDetails />} />
            {/* <Route path="dorder" element={<dOrder />} />             */}

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

//nothing