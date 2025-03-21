import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRegister from "./Components/AdminRegister";
import AdminLogin from "./Components/AdminLogin";
import Dashboard from "./Components/Dashboard";
<<<<<<< HEAD
import Navbar from "./Components/Navbar";
=======
// import '@fortawesome/fontawesome-free/css/all.min.css';

import "font-awesome/css/font-awesome.min.css";
>>>>>>> 640a0657b4d46e54aee5ba1801b85f197e7dd4e2
import Layout from "./Components/Layout";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/admin-register" element={<AdminRegister />} /> */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
<<<<<<< HEAD
        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/layout" element={< Layout />} />
=======
        <Route path="/layout" element={<Layout />} />

>>>>>>> 640a0657b4d46e54aee5ba1801b85f197e7dd4e2
      </Routes>
    </BrowserRouter>
  );
}

export default App;
