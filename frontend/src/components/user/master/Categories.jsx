import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, message, Table, Popconfirm, Form } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "./Css Files/style.css"; // Import your CSS file

const Categories = () => {
  const [form] = Form.useForm(); // Ant Design form instance
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage(); // Message API for notifications

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8081/category");
      setData(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setData([]);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!editingId) {
        await axios.post("http://localhost:8081/category", values);
        messageApi.success("Category added successfully!");
      } else {
        await axios.put(`http://localhost:8081/category/${editingId}`, values);
        messageApi.success("Category updated successfully!");
        setEditingId(null);
      }

      fetchData();
      form.resetFields();

    } catch (error) {
      console.error("Validation failed or request error:", error);
    
      const errorMsg = error.response?.data?.message || "An unexpected error occurred.";
      messageApi.error(errorMsg);
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingId(record._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/category/${id}`);
      messageApi.success("Category deleted successfully!");
      fetchData();
    } catch (error) {
      messageApi.error("Failed to delete category!");
      console.error("Error deleting category:", error);
    }
  };

  const clearForm = () => {
    form.resetFields();
    setEditingId(null);
  };

  const columns = [
    { title: "Serial No", dataIndex: "srno", key: "srno", align: "center" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Billing In", dataIndex: "billingIn", key: "billingIn" },
   
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="action-button edit-button"
          />
          <Popconfirm
            title="Are you sure you want to delete this category?"
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
          <div className="card p-3" style={{ backgroundColor: "#f8f9fa" }}>
            <Form form={form} layout="vertical">
              <div className="row">
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: "Please enter category name!" }]}
                  >
                    <Input placeholder="Category Name" />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="type"
                    label="Type"
                    rules={[{ required: true, message: "Please enter type!" }]}
                  >
                    <Input placeholder="Type" />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="billingIn"
                    label="Billing In"
                    rules={[{ required: true, message: "Please enter billing information!" }]}
                  >
                    <Input placeholder="Billing In" />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="srno"
                    label="Serial No"
                    rules={[
                      { required: true, message: "Please enter serial number!" },
                      {
                        validator: (_, value) =>
                          isNaN(value) ? Promise.reject("Serial No must be a number!") : Promise.resolve(),
                      },
                    ]}
                  >
                    <Input placeholder="Serial Number" />
                  </Form.Item>
                </div>
                <div className="col-lg-12 p-1">
                  <Button type="primary" onClick={handleSubmit}>
                    {editingId ? "Update" : "Save"}
                  </Button>
                  <Button
                    type="default"
                    onClick={clearForm}
                    style={{ marginLeft: "10px" }}
                  >
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

export default Categories;
