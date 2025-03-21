import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRegister from "./Components/AdminRegister";
import AdminLogin from "./Components/AdminLogin";
import Dashboard from "./Components/Dashboard";
import Layout from "./Components/Layout";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/admin-register" element={<AdminRegister />} /> */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
<<<<<<< HEAD
        <Route path="/layout" element={<Layout />} />

=======
        <Route path="/layout" element={< Layout />} />
>>>>>>> 4e01b755a4c8aa43a6644bdad1993da7ae28a041
      </Routes>
    </BrowserRouter>
  );
}

export default App;
