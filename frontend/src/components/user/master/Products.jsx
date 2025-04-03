import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Select, message, Table, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import "./Css Files/style.css";

const Products = () => {
  const [formData, setFormData] = useState({
    categoryid: "",
    name: "",
    weight: "",
    srno: "",
  });
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [editingId, setEditingId] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, categoryid: value });
  };

  const validateForm = () => {
    if (!formData.categoryid || !formData.name || !formData.weight || !formData.srno) {
      messageApi.error("All fields are required!");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      await axios.post("http://localhost:8081/product", formData);
      messageApi.success("Product saved successfully!");
      clearForm();
      fetchData();
    } catch (error) {
      messageApi.error("Failed to save product!");
      console.error("Error:", error);
    }
  };

  const handleUpdate = async () => {
    if (!formData._id) {
      messageApi.error("Select a product to update!");
      return;
    }
    if (!validateForm()) return;
    try {
      await axios.put(`http://localhost:8081/product/${formData._id}`, formData);
      messageApi.success("Product updated successfully!");
      clearForm();
      fetchData();
      setEditingId(null);
    } catch (error) {
      messageApi.error("Failed to update product!");
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/product/${id}`);
      messageApi.success("Product deleted successfully!");
      fetchData();
    } catch (error) {
      messageApi.error("Failed to delete product!");
      console.error("Error:", error);
    }
  };

  const clearForm = () => {
    setFormData({ categoryid: "", name: "", weight: "", srno: "" });
    setEditingId(null);
  };

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
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          {editingId === record._id ? (
            <>
              <Button type="link" icon={<SaveOutlined />} onClick={handleUpdate} style={{ marginRight: "10px" }} />
              <Button type="link" icon={<CloseOutlined />} onClick={clearForm} danger />
            </>
          ) : (
            <>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => {
                  setFormData(record);
                  setEditingId(record._id);
                }}
                style={{ marginRight: "10px" }}
              />
              <Popconfirm
                title="Are you sure you want to delete this product?"
                onConfirm={() => handleDelete(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" icon={<DeleteOutlined />} danger />
              </Popconfirm>
            </>
          )}
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
              <li className="breadcrumb-item"><Link to={"/"}>Dashboard</Link></li>
              <li className="breadcrumb-item active">Products</li>
            </ol>
          </nav>
        </div>
        <section className="section">
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
                <Input name="name" placeholder="Product Name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="col-lg-6 p-1">
                Weight*
                <Input name="weight" placeholder="Weight" value={formData.weight} onChange={handleInputChange} />
              </div>
              <div className="col-lg-6 p-1">
                Serial No*
                <Input name="srno" placeholder="Serial Number" value={formData.srno} onChange={handleInputChange} />
              </div>

              <div className="col-lg-12 p-1">
                <Button type="primary" onClick={editingId ? handleUpdate : handleSubmit}>
                  {editingId ? "Update" : "Save"}
                </Button>
                {editingId && (
                  <Button type="default" onClick={clearForm} style={{ marginLeft: "10px" }}>
                    Cancel
                  </Button>
                )}
                <Button type="default" onClick={clearForm} danger style={{ marginLeft: "10px" }}>
                  Clear
                </Button>
                </div>



            </div>
          </div>
          <div className="card p-3">
            <Table columns={columns} 
            dataSource={data}
             rowKey="_id"
             pagination={{ pageSize: 5 , showSizeChanger: false}}
             />
          </div>
        </section>
      </main>
    </>
  );
};

export default Products;
