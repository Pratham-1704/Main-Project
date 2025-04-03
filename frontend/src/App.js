import './App.css';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router';
import Landing from './components/user/Landing';
import Dashboard from './components/user/dashboard/Dashboard';
//import Clients from './components/user/master/Admin';
import Employees from './components/user/master/Employees';
import Forgotpassword from './components/Forgotpassword';
import Categories from './components/user/master/Categories';
import Admin from './components/user/master/Admin';
import Products from './components/user/master/Products';
import Brand from './components/user/master/Brand';
<<<<<<< HEAD
import FinancialYear from './components/user/master/FinancialYear';
import Firms from './components/user/master/Firms';
import BrandProducts from './components/user/master/BrandProduct';
import Customers from './components/user/master/Customers';
=======
import Firms from './components/user/master/Firms';
import BrandProducts from './components/user/master/BrandProduct';
import Customers from './components/user/master/Customers';
import FinancialYear from './components/user/master/FinancialYear';
import ProfilePage from './components/user/ProfilePage';
>>>>>>> afdfe58e5e285bb0731b433a947021d2561b1eaa

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
            <Route path="employees" element={<Employees />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="brands" element={<Brand />} />
            <Route path="firms" element={<Firms />} />
            <Route path="brandproduct" element={<BrandProducts />} />
            <Route path="customers" element={<Customers />} />
            <Route path="financialyear" element={<FinancialYear />} />
            


          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
