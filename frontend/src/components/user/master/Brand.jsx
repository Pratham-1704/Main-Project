import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, message, Table, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "./Css Files/style.css"; // Import the custom CSS file

function Brand() {
  const [formData, setFormData] = useState({ name: "", srno: "" });
  const [brands, setBrands] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch brands from the backend
  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:8081/brand");
      setBrands(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.name || !formData.srno) {
      messageApi.error("All fields are required!");
      return false;
    }
    if (isNaN(formData.srno)) {
      messageApi.error("Serial No must be a number!");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:8081/brand", formData);
      messageApi.success("Brand saved successfully!");
      fetchBrands();
      clearForm();
    } catch (error) {
      messageApi.error("Failed to save brand!");
      console.error("Error:", error);
    }
  };

  // Handle update
  const handleUpdate = async () => {
    if (!formData._id) {
      messageApi.error("Select a brand to update!");
      return;
    }
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:8081/brand/${formData._id}`, formData);
      messageApi.success("Brand updated successfully!");
      fetchBrands();
      clearForm();
    } catch (error) {
      messageApi.error("Failed to update brand!");
      console.error("Error:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/brand/${id}`);
      messageApi.success("Brand deleted successfully!");
      fetchBrands();
    } catch (error) {
      messageApi.error("Failed to delete brand!");
      console.error("Error:", error);
    }
  };

  // Clear form
  const clearForm = () => {
    setFormData({ name: "", srno: "" });
  };

  // Table columns configuration
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Serial No", dataIndex: "srno", key: "srno" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => setFormData(record)}
            style={{ marginRight: "10px" }}
          />
          <Popconfirm
            title="Are you sure you want to delete this brand?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Brands</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Brands</li>
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
                      placeholder="Brand Name"
                      value={formData.name}
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
                    <Button
                      type="primary"
                      onClick={handleSubmit}
                      style={{ marginRight: "10px" }}
                    >
                      Save
                    </Button>
                    <Button danger onClick={clearForm} style={{ marginRight: "10px" }}>
                      Clear
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
                  className="custom-table"
                  columns={columns}
                  dataSource={brands}
                  rowKey="_id"
                  pagination={{ pageSize: 5, showSizeChanger: false }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Brand;
