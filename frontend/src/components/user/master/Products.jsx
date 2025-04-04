import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Select, Table, Popconfirm, Form, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "./Css Files/style.css"; // Import your CSS file
import { Color } from "antd/es/color-picker";
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';


const Products = () => {
  const [form] = Form.useForm(); // Ant Design form instance
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage(); // Message API for notifications


  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8081/product");
      setData(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setData([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8081/category");
      setCategories(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!editingId) {
        await axios.post("http://localhost:8081/product", values);
        messageApi.success("Product added successfully!");
      } else {
        await axios.put(`http://localhost:8081/product/${editingId}`, values);
        messageApi.success("Product updated successfully!");
        setEditingId(null);
      }

      fetchData();
      form.resetFields();

    } catch (error) {
      console.error("Validation failed or request error:", error);
    
      if (error.response?.data?.message) {
        const errMsg = error.response.data.message;
    
        if (errMsg.includes("Serial number")) {
          form.setFields([{ name: "srno", errors: [errMsg] }]);
        } else {
          messageApi.error(errMsg);
        }
      } else {
        messageApi.error("Something went wrong. Please try again.");
      }
    }
    
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/product/${id}`);
      messageApi.success("Product deleted successfully!"); // Success message
      fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
      messageApi.error("Failed to delete product. Please try again!"); // Error message
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record); // Populate the form with the selected record
    setEditingId(record._id); // Set the editing ID
  };

  const clearForm = () => {
    form.resetFields(); // Reset the form fields
    setEditingId(null); // Clear the editing ID
  };

  const columns = [
    { title: "Serial No", dataIndex: "srno", key: "srno", align: "center" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Category",
      dataIndex: "categoryid",
      key: "categoryid",
      render: (categoryid) => {
        const category = categories.find((cat) => cat._id === categoryid);
        return category ? category.name : "Unknown";
      },
    },
    { title: "Weight", dataIndex: "weight", key: "weight", align: "center" },

    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="action-button edit-button"
          />
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              icon={<DeleteOutlined />}
              danger
              className="action-button delete-button"
            />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      {contextHolder /* Render the message context holder at the top */}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Products</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to={"/"}>Dashboard</Link></li>
              <li className="breadcrumb-item active">Products</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <div className="card p-3" style={{ backgroundColor: "#f8f9fa" }}>
            <Form form={form} layout="vertical">
              <div className="row">
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="categoryid"
                    label="Category"
                    rules={[{ required: true, message: "Please select a category!" }]}
                  >
                    <Select
                      className="w-100"
                      placeholder="Select Category"
                      options={categories.map((category) => ({
                        value: category._id,
                        label: category.name,
                      }))}
                    />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                      { required: true, message: "Please enter the product name!" },
                      { min: 2, message: "Product name must be at least 2 characters long!" }, // Minimum length validation
                    ]}
                  >
                    <Input placeholder="Product Name" />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="weight"
                    label={
                      <span>
                        Weight&nbsp;
                        <Tooltip title="Enter weight in kg">
                          <InfoCircleOutlined style={{ color: "#1890ff", cursor: "pointer" }} />
                        </Tooltip>
                      </span>
                    }
                    rules={[{ required: true, message: "Please enter the product weight!" }]}
                  >
                    <Input placeholder="Weight" />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="srno"
                    label="Serial No"
                    rules={[{ required: true, message: "Please enter the serial number!" }]}
                  >
                    <Input placeholder="Serial Number" disabled={!!editingId} />
                  </Form.Item>
                </div>
                <div className="col-lg-12 p-1">
                  <Button type="primary" onClick={handleSubmit}>
                    {editingId ? "Update" : "Save"}
                  </Button>
                  <Button type="default" onClick={clearForm} style={{ marginLeft: "10px" }}>
                    {editingId ? "Cancel" : "Clear"}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
          <div className="card p-3 custom-table">
            <Table
              columns={columns}
              dataSource={data}
              rowKey="_id"
              pagination={{ pageSize: 5, showSizeChanger: false }}
            />
          </div>

        </section>
      </main>
    </>
  );
};

export default Products;

