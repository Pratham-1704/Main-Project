import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRegister from "./Components/AdminRegister";
import AdminLogin from "./Components/AdminLogin";
import Dashboard from "./Components/Dashboard";
import '@fortawesome/fontawesome-free/css/all.min.css';

import "font-awesome/css/font-awesome.min.css";
import Navbar from "./Components/Navbar";


function App() {
  return (
    <BrowserRouter>
      <Routes>
         {/* <Route path="/admin-register" element={<AdminRegister />} /> */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Navbar" element={<Navbar />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
