import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, message, Table, Popconfirm, Form, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "./Css Files/style.css";

const Categories = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [initialValues, setInitialValues] = useState(null);
  const [nextSerialNumber, setNextSerialNumber] = useState(1); // Default serial number for new entries

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/category");
      const fetchedData = res.data.status === "success" ? res.data.data : [];
  
      // Sort by srno or createdAt (to keep order stable)
      const sortedData = fetchedData.sort((a, b) => a.srno - b.srno);
  
      // Reassign serial numbers
      const updatedData = sortedData.map((item, index) => ({
        ...item,
        srno: index + 1,
      }));
  
      // Persist updated srno values to the DB
      await Promise.all(
        updatedData.map((item) =>
          axios.put(`http://localhost:8081/category/${item._id}`, { srno: item.srno })
        )
      );
  
      setData(updatedData);
      setNextSerialNumber(updatedData.length + 1);
      form.setFieldsValue({ srno: updatedData.length + 1 });
    } catch (error) {
      console.error("Error fetching categories:", error);
      setData([]);
    }
  };  

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingId) {
        // Check if values are different
        const isChanged = Object.keys(values).some(
          (key) =>
            values[key]?.toString().trim() !==
            initialValues?.[key]?.toString().trim()
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
        // Add the new category with the next serial number
        const newCategory = { ...values, srno: nextSerialNumber };
        await axios.post("http://localhost:8081/category", newCategory);
        messageApi.success("Category added successfully!");
        setNextSerialNumber(nextSerialNumber + 1); // Increment for the next entry
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
  
      // Re-fetch data and reassign serial numbers
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
    form.setFieldsValue({ srno: nextSerialNumber }); // Reset the serial number to the next value
  };

  const columns = [
    { title: "Serial No", dataIndex: "srno", key: "srno", align: "center" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Unit", dataIndex: "billingIn", key: "billingIn" },
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
              <li className="breadcrumb-item"><Link to="">Dashboard</Link></li>
              <li className="breadcrumb-item active">Categories</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <div className="card p-3">
            <Form form={form} layout="vertical">
              <div className="row">
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="srno"
                    label="Serial No"
                    rules={[
                      { required: true, message: "Please enter serial number!" },
                    ]}
                  >
                    <Input placeholder="Serial Number" disabled />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                      { required: true, message: "Please enter category name!" },
                      { min: 2, message: "Name must be at least 2 characters!" },
                    ]}
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
                    label="Unit"
                    rules={[{ required: true, message: "Please select billing info!" }]}
                  >
                    <Select placeholder="Select Unit">
                      <Select.Option value="Kg">Kg</Select.Option>
                      <Select.Option value="Meter">Meter</Select.Option>
                      <Select.Option value="Feet">Feet</Select.Option>
                      <Select.Option value="No's">No's</Select.Option>
                    </Select>
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
