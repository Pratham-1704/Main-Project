import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Select, Table, Popconfirm, Form, message, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import "./Css Files/style.css";

const Products = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
    const [initialValues, setInitialValues] = useState(null);
  

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

  const getTimedValidator = (field, message, extraCheck = null) => ({
    validator: async (_, value) => {
      if (!value || (extraCheck && !extraCheck(value))) {
        setTimeout(() => {
          form.setFields([{ name: field, errors: [] }]);
        }, 3000);
        return Promise.reject(new Error(message));
      }
      return Promise.resolve();
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
  
      if (editingId) {
        // Check if values are different
        const isChanged = Object.keys(values).some(
          (key) => values[key] !== initialValues?.[key]
        );
  
        if (!isChanged) {
          messageApi.info("No changes made.");
          return;
        }
  
        await axios.put(`http://localhost:8081/product/${editingId}`, values);
        messageApi.success("Brand updated successfully!");
        setEditingId(null);
        setInitialValues(null);
      } else {
        await axios.post("http://localhost:8081/product", values);
        messageApi.success("Brand added successfully!");
      }
  
      fetchData();
      form.resetFields();
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMsg =
        error.response?.data?.message || "All Fields are Required!";
      messageApi.error(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/product/${id}`);
      messageApi.success("Product deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
      messageApi.error("Failed to delete product. Please try again!");
    }
  };

  // const handleEdit = (record) => {
  //   form.setFieldsValue(record);
  //   setEditingId(record._id);
  // };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingId(record._id);
    setInitialValues(record); // Save original data
  };

  // const clearForm = () => {
  //   form.resetFields();
  //   setEditingId(null);
  // };

  const clearForm = () => {
    form.resetFields();
    setEditingId(null);
    setInitialValues(null);
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
      render: (_, record) => (
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
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Products</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="">Dashboard</Link></li>
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
                    name="srno"
                    label="Serial No"
                    rules={[getTimedValidator("srno", "Please enter the serial number!")]}
                  >
                    <Input placeholder="Serial Number" disabled={!!editingId} />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="categoryid"
                    label="Category"
                    rules={[getTimedValidator("categoryid", "Please select a category!")]}
                  >
                    <Select
                      className="w-100"
                      placeholder="Select Category"
                      options={categories.map((c) => ({ value: c._id, label: c.name }))}
                    />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                      getTimedValidator("name", "Please enter the product name!"),
                      getTimedValidator("name", "Product name must be at least 2 characters!", (val) => val.length >= 2)
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
                    rules={[getTimedValidator("weight", "Please enter the product weight!")]}
                  >
                    <Input placeholder="Weight" />
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
