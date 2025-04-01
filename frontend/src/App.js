import './App.css';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router';
import Landing from './components/user/Landing';
import Dashboard from './components/user/dashboard/Dashboard';
import Clients from './components/user/master/Admin';
import Employees from './components/user/master/Employees';
import Forgotpassword from './components/Forgotpassword';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="dashboard" element={<Landing />}>
          <Route path="" element={<Dashboard />} />
        </Route>
        <Route path="master" element={<Landing />}>
          <Route path="clients" element={<Clients />} />
          <Route path="employees" element={<Employees />} />
        </Route>
=======
        {/* <Route path="/admin-register" element={<AdminRegister />} /> */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
<<<<<<< HEAD
        <Route path="/layout" element={<Layout />} />

=======
        <Route path="/layout" element={< Layout />} />
>>>>>>> 4e01b755a4c8aa43a6644bdad1993da7ae28a041
>>>>>>> 9ba2b018b4de948979f1ef7052f93b3096473d17
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
