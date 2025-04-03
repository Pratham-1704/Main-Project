import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, message, Table, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
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

  // Validate form data
  const validateForm = () => {
    if (!formData.name || !formData.type || !formData.billingIn || !formData.srno) {
      messageApi.open({ type: "error", content: "All fields are required!" });
      return false;
    }
    if (isNaN(formData.srno)) {
      messageApi.open({ type: "error", content: "Serial No must be a number!" });
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:8081/category", formData);
      messageApi.open({ type: "success", content: "Category saved successfully!" });
      fetchCategories();
      clearForm();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to save category!" });
      console.error("Error:", error);
    }
  };

  // Handle update
  const handleUpdate = async () => {
    if (!formData._id) {
      messageApi.open({ type: "error", content: "Select a category to update!" });
      return;
    }
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:8081/category/${formData._id}`, formData);
      messageApi.open({ type: "success", content: "Category updated successfully!" });
      fetchCategories();
      clearForm();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to update category!" });
      console.error("Error:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/category/${id}`);
      messageApi.open({ type: "success", content: "Category deleted successfully!" });
      fetchCategories();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to delete category!" });
      console.error("Error:", error);
    }
  };

  // Clear form
  const clearForm = () => {
    setFormData({
      name: "",
      type: "",
      billingIn: "",
      srno: "",
    });
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
            title="Are you sure you want to delete this category?"
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
          <h1>Categories</h1>
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
                    <Button
                      type="primary"
                      onClick={handleSubmit}
                      style={{ marginRight: "10px" }}
                    >
                      Save
                    </Button>
                    <Button
                      danger
                      onClick={clearForm}
                      style={{ marginRight: "10px" }}
                    >
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
                  dataSource={categories}
                  rowKey="_id"
                   pagination={{ pageSize: 5 , showSizeChanger: false}}
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