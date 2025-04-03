import './App.css';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router';
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
import Order from './components/user/master/Order';
import ProfilePage from './components/user/ProfilePage';
import Quotations from './components/user/master/Quotations';
import Lead from './components/user/master/Lead';



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<Forgotpassword />} />
         
          <Route path="dashboard" element={<Landing />}>
       
            <Route path="" element={<Dashboard />} />
            
            
          </Route>
          <Route path="master" element={<Landing />}>
            <Route path="admin" element={<Admin />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="brands" element={<Brand />} />
            <Route path="firms" element={<Firms />} />
            <Route path="brandproduct" element={<BrandProducts />} />
            <Route path="customers" element={<Customers />} />
            <Route path="financialyear" element={<FinancialYear />} />
            <Route path="Order" element={<Order/>}/>
            <Route path="quotations" element={<Quotations />} />
            <Route path="leads" element={<Lead />} />

            
 887b7f98ca0dfb56cf4fc23bbbcf1a9c449199bb


          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
