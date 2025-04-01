import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, message, Table } from "antd";
import axios from "axios";
import "./Css Files/style.css"; // Import the custom CSS file

function Categories() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    billingIn: "",
    srno: "",
  });

  const [categories, setCategories] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8081/category");
      setCategories(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.name || !formData.type || !formData.billingIn || !formData.srno) {
      messageApi.open({ type: "error", content: "All fields are required!" });
      return;
    }

    try {
      await axios.post("http://localhost:8081/category", formData);
      messageApi.open({ type: "success", content: "Category saved successfully!" });
      fetchCategories();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to save category!" });
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Table columns configuration
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Billing In", dataIndex: "billingIn", key: "billingIn" },
    { title: "Serial No", dataIndex: "srno", key: "srno" },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Category Management</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to={"/"}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Categories</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <div className="row">
                  <div className="col-lg-6 p-1">
                    Name*
                    <Input
                      name="name"
                      placeholder="Category Name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Type*
                    <Input
                      name="type"
                      placeholder="Type"
                      value={formData.type}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Billing In*
                    <Input
                      name="billingIn"
                      placeholder="Billing In"
                      value={formData.billingIn}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Serial No*
                    <Input
                      name="srno"
                      placeholder="Serial No"
                      value={formData.srno}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-12 p-1">
                    <Button type="primary" onClick={handleSubmit}>
                      Save
                    </Button>
                    <Button variant="solid" className="ms-1" danger>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <Table
                  className="custom-table" // Add a custom class for the table
                  columns={columns}
                  dataSource={categories}
                  rowKey="_id"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Categories;
