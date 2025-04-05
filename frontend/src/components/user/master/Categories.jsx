import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, message, Table, Popconfirm, Form } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "./Css Files/style.css";

const Categories = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/category");
      setData(res.data.status === "success" ? res.data.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setData([]);
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
      const isChanged = Object.keys(values).some(
        (key) => values[key]?.toString().trim() !== initialValues?.[key]?.toString().trim()
      );

      if (!isChanged) {
        messageApi.info("No changes made. Update not required.");
        return;
      }

      await axios.put(`http://localhost:8081/category/${editingId}`, values);
      messageApi.success("Category updated successfully!");
      setEditingId(null);
      setInitialValues(null);
    } else {
      await axios.post("http://localhost:8081/category", values);
      messageApi.success("Category added successfully!");
    }

    fetchData();
    form.resetFields();
  } catch (error) {
    console.error("Error submitting form:", error);
    const errorMsg =
      error.response?.data?.message || "Please fill the values correctly!";
    messageApi.error(errorMsg);
  }
};


  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingId(record._id);
    setInitialValues(record);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/category/${id}`);
      messageApi.success("Category deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting category:", error);
      messageApi.error("Failed to delete category!");
    }
  };

  const clearForm = () => {
    form.resetFields();
    setEditingId(null);
    setInitialValues(null);
  };

  const columns = [
    { title: "Serial No", dataIndex: "srno", key: "srno", align: "center" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Billing In", dataIndex: "billingIn", key: "billingIn" },
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
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
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
                    name="srno"
                    label="Serial No"
                    rules={[
                      getTimedValidator("srno", "Please enter serial number!", (val) =>
                        isNaN(val) ? false : true
                      ),
                    ]}
                  >
                    <Input placeholder="Serial Number" disabled={!!editingId}/>
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                      getTimedValidator("name", "Please enter category name!"),
                      getTimedValidator("name", "Name must be at least 2 characters!", (val) => val.length >= 2),
                    ]}
                  >
                    <Input placeholder="Category Name" />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="type"
                    label="Type"
                    rules={[getTimedValidator("type", "Please enter type!")]}
                  >
                    <Input placeholder="Type" />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="billingIn"
                    label="Billing In"
                    rules={[getTimedValidator("billingIn", "Please enter billing info!")]}
                  >
                    <Input placeholder="Billing In" />
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

export default Categories;
