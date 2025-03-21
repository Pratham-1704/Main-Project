import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRegister from "./Components/AdminRegister";
import AdminLogin from "./Components/AdminLogin";
import Dashboard from "./Components/Dashboard";
// import '@fortawesome/fontawesome-free/css/all.min.css';

import "font-awesome/css/font-awesome.min.css";
import Navbar from "./Components/Navbar";
import Layout from "./Components/Layout";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/admin-register" element={<AdminRegister />} /> */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Navbar" element={<Navbar />} />
<<<<<<< HEAD
        <Route path="/layout" element={<Layout />} />

=======
        <Route path="/layout" element={< Layout />} />
>>>>>>> 05131ac97adb613cefde700357ca9c872eb442f2
      </Routes>
    </BrowserRouter>
  );
}

export default App;
