import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Select, message, Table } from "antd";
import axios from "axios";
import "./Css Files/style.css"; // Import the custom CSS file

function Products() {
  const [formData, setFormData] = useState({
    categoryid: "",
    name: "",
    weight: "",
    srno: "",
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8081/product");
      setProducts(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  // Fetch categories for the dropdown
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8081/category");
      setCategories(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, categoryid: value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.categoryid || !formData.name || !formData.weight || !formData.srno) {
      messageApi.open({ type: "error", content: "All fields are required!" });
      return;
    }

    try {
      await axios.post("http://localhost:8081/product", formData);
      messageApi.open({ type: "success", content: "Product saved successfully!" });
      setFormData({
        categoryid: "",
        name: "",
        weight: "",
        srno: "",
      }); // Reset form after successful submission
      fetchProducts(); // Refresh the product list
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to save product!" });
      console.error("Error:", error);
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: "Category",
      dataIndex: "categoryid",
      key: "categoryid",
      render: (categoryid) => {
        const category = categories.find((cat) => cat._id === categoryid);
        return category ? category.name : "Unknown";
      },
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Weight", dataIndex: "weight", key: "weight" },
    { title: "Serial No", dataIndex: "srno", key: "srno" },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Product Management</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to={"/"}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Products</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <div className="row">
                  <div className="col-lg-6 p-1">
                    Category*
                    <Select
                      className="w-100"
                      placeholder="Select Category"
                      value={formData.categoryid}
                      onChange={handleSelectChange}
                      options={categories.map((category) => ({
                        value: category._id,
                        label: category.name,
                      }))}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Name*
                    <Input
                      name="name"
                      placeholder="Product Name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Weight*
                    <Input
                      name="weight"
                      placeholder="Weight"
                      value={formData.weight}
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
                  dataSource={products}
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

export default Products;
