import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Input,
  Select,
  message,
  Table,
  Popconfirm,
  Form,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "./Css Files/style.css";

const BrandProduct = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    fetchBrandProducts();
    fetchBrands();
    fetchProducts();
  };

  const fetchBrandProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8081/brandproduct");
      setData(res.data.status === "success" ? res.data.data : []);
    } catch (error) {
      console.error("Error fetching brand products:", error);
      setData([]);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get("http://localhost:8081/brand");
      setBrands(res.data.status === "success" ? res.data.data : []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8081/product");
      setProducts(res.data.status === "success" ? res.data.data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const getTimedValidator = (field, msg, extraCheck = null) => ({
    validator: async (_, value) => {
      if (!value || (extraCheck && !extraCheck(value))) {
        setTimeout(() => {
          form.setFields([{ name: field, errors: [] }]);
        }, 3000);
        return Promise.reject(new Error(msg));
      }
      return Promise.resolve();
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingId) {
        const isChanged = Object.keys(values).some(
          (key) =>
            values[key]?.toString().trim() !==
            initialValues?.[key]?.toString().trim()
        );

        if (!isChanged) {
          messageApi.info("No changes made. Update not required.");
          return;
        }

        await axios.put(
          `http://localhost:8081/brandproduct/${editingId}`,
          values
        );
        messageApi.success("Brand product updated successfully!");
        setEditingId(null);
        setInitialValues(null);
      } else {
        await axios.post("http://localhost:8081/brandproduct", values);
        messageApi.success("Brand product added successfully!");
      }

      fetchBrandProducts();
      form.resetFields();
    } catch (error) {
      console.error("Error:", error);
      const errMsg =
        error.response?.data?.message ||
        "Please fill all values correctly!";
      messageApi.error(errMsg);
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingId(record._id);
    setInitialValues(record);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/brandproduct/${id}`);
      messageApi.success("Brand product deleted successfully!");
      fetchBrandProducts();
    } catch (error) {
      console.error("Error deleting brand product:", error);
      messageApi.error("Failed to delete brand product!");
    }
  };

  const clearForm = () => {
    form.resetFields();
    setEditingId(null);
    setInitialValues(null);
  };

  const columns = [
    {
      title: "Brand",
      dataIndex: "brandid",
      key: "brandid",
      render: (id) => brands.find((b) => b._id === id)?.name || "Unknown",
    },
    {
      title: "Product",
      dataIndex: "productid",
      key: "productid",
      render: (id) => products.find((p) => p._id === id)?.name || "Unknown",
    },
    { title: "Parity", dataIndex: "parity", key: "parity" },
    { title: "Rate", dataIndex: "rate", key: "rate" },
    { title: "Billing Rate", dataIndex: "billingrate", key: "billingrate" },
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
            title="Are you sure you want to delete this brand product?"
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
          <h1>Brand Products</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Brand Products</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="card p-3" style={{ backgroundColor: "#f8f9fa" }}>
            <Form form={form} layout="vertical">
              <div className="row">
                <div className="col-lg-6">
                  <Form.Item
                    name="brandid"
                    label="Brand"
                    rules={[
                      getTimedValidator("brandid", "Please select a brand!"),
                    ]}
                  >
                    <Select
                      placeholder="Select Brand"
                      options={brands.map((b) => ({
                        value: b._id,
                        label: b.name,
                      }))}
                    />
                  </Form.Item>
                </div>

                <div className="col-lg-6 ">
                  <Form.Item
                    name="productid"
                    label="Product"
                    rules={[
                      getTimedValidator("productid", "Please select a product!"),
                    ]}
                  >
                    <Select
                      placeholder="Select Product"
                      options={products.map((p) => ({
                        value: p._id,
                        label: p.name,
                      }))}
                    />
                  </Form.Item>
                </div>

                <div className="col-lg-6 ">
                  <Form.Item
                    name="parity"
                    label="Parity"
                    rules={[getTimedValidator("parity", "Please enter parity!")]}
                  >
                    <Input placeholder="Parity" />
                  </Form.Item>
                </div>

                <div className="col-lg-6 ">
                  <Form.Item
                    name="rate"
                    label="Rate"
                    rules={[getTimedValidator("rate", "Please enter rate!")]}
                  >
                    <Input placeholder="Rate" />
                  </Form.Item>
                </div>

                <div className="col-lg-6 ">
                  <Form.Item
                    name="billingrate"
                    label="Billing Rate"
                    rules={[
                      getTimedValidator("billingrate", "Please enter billing rate!"),
                    ]}
                  >
                    <Input placeholder="Billing Rate" />
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

export default BrandProduct;
