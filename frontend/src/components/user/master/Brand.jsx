import { Button, Input, message, Table } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Css Files/style.css"; // Import the CSS file

function Brand() {
  const [formData, setFormData] = useState({ name: "", srno: "" });
  const [brands, setBrands] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:8081/brand");
      setBrands(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      messageApi.error("Unable to load brand data.");
      setBrands([]);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.name.trim() || formData.name.length < 3) {
      messageApi.error("Name must be at least 3 characters long.");
      return false;
    }
    if (!/^[1-9][0-9]*$/.test(formData.srno)) {
      messageApi.error("Serial Number must be a positive integer.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      await axios.post("http://localhost:8081/brand", formData);
      messageApi.success("Brand added successfully!");
      setFormData({ name: "", srno: "" });
      fetchBrands();
    } catch (error) {
      messageApi.error("Failed to add brand.");
      console.error("Error:", error);
    }
  };

  // Handle update
  const handleUpdate = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`http://localhost:8081/brand/${formData.srno}`, formData);
      messageApi.success("Brand updated successfully!");
      setFormData({ name: "", srno: "" });
      fetchBrands();
    }
    catch (error) {
      messageApi.error("Failed to update brand.");
      console.error("Error:", error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!formData.srno) {
      messageApi.error("Select a brand to delete.");
      return; 
    }
    try {
      await axios.delete(`http://localhost:8081/brand/${formData.srno}`);
      messageApi.success("Brand deleted successfully!");
      setFormData({ name: "", srno: "" });
      fetchBrands();
    }
    catch (error) {
      messageApi.error("Failed to delete brand.");
      console.error("Error:", error);
    }
  };

  
  // Clear form
  const clearForm = () => {
    setFormData({ name: "", srno: "" });
  }

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Sr No", dataIndex: "srno", key: "srno" },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Brand Management</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Brand</li>
            </ol>
          </nav>
        </div>
        <section>
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <div className="col-lg-6 p-1">
                  Name*
                  <Input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="col-lg-6 p-1">
                  Sr No*
                  <Input name="srno" placeholder="Serial Number" value={formData.srno} onChange={handleInputChange} />
                </div>
                <div className="col-lg-12 p-1">
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    style={{ marginRight: "10px" }}
                  >
                    Save
                  </Button>
                  <Button
                    color="green" variant="solid"
                    onClick={handleUpdate}
                    style={{ marginRight: "10px" }}
                  >
                    Update
                  </Button>

                  <Button
                    color="danger" variant="solid"
                    onClick={handleDelete}
                    style={{ marginRight: "10px" }}
                  >
                    Delete
                  </Button>

                  <Button
                    variant="solid"
                    onClick={clearForm}
                    style={{ marginRight: "10px" }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <Table className="custom-table" columns={columns} dataSource={brands} rowKey="_id" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Brand;