import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  message,
  Table,
  Popconfirm,
  Form,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "./Css Files/style.css";

const Brand = () => {
  const [form] = Form.useForm();
  const [brands, setBrands] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [initialValues, setInitialValues] = useState(null);
  const [nextSerialNumber, setNextSerialNumber] = useState(1); // Default serial number for new entries
  const navigate = useNavigate();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:8081/brand");
      const fetchedBrands = response.data.status === "success" ? response.data.data : [];
  
      // Sort by srno or createdAt to keep order consistent
      const sortedBrands = fetchedBrands.sort((a, b) => a.srno - b.srno);
  
      // Reassign serial numbers
      const updatedBrands = sortedBrands.map((brand, index) => ({
        ...brand,
        srno: index + 1,
      }));
  
      // Persist the new serial numbers to DB
      await Promise.all(
        updatedBrands.map((brand) =>
          axios.put(`http://localhost:8081/brand/${brand._id}`, { srno: brand.srno })
        )
      );
  
      setBrands(updatedBrands);
      setNextSerialNumber(updatedBrands.length + 1);
      form.setFieldsValue({ srno: updatedBrands.length + 1 });
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    }
  };  

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

        await axios.put(`http://localhost:8081/brand/${editingId}`, values);
        messageApi.success("Brand updated successfully!");
        setEditingId(null);
        setInitialValues(null);
      } else {
        // Add the new brand with the next serial number
        const newBrand = { ...values, srno: nextSerialNumber };
        await axios.post("http://localhost:8081/brand", newBrand);
        messageApi.success("Brand added successfully!");
        setNextSerialNumber(nextSerialNumber + 1); // Increment for the next entry
      }

      fetchBrands();
      form.resetFields();
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMsg =
        error.response?.data?.message || "An unexpected error occurred.";
      messageApi.error(errorMsg);
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue({ name: record.name }); // Only set the editable fields
    setEditingId(record._id);
    setInitialValues(record); // Save original data
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/brand/${id}`);
      messageApi.success("Brand deleted successfully!");

      // Re-fetch brands and reassign serial numbers
      fetchBrands();
    } catch (error) {
      messageApi.error("Failed to delete brand!");
      console.error("Error deleting brand:", error);
    }
  };

  const clearForm = () => {
    form.resetFields();
    setEditingId(null);
    setInitialValues(null);
    form.setFieldsValue({ srno: nextSerialNumber }); // Reset the serial number to the next value
  };

  const handleManageProducts = (record) => {
    // Navigate to the BrandProduct page with the brand name and brand ID
    navigate(`/master/brandproduct`, { state: { brandName: record.name, brandId: record._id } });
  };

  const columns = [
    { title: "Serial No", dataIndex: "srno", key: "srno", align: "center" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Products",
      align: "center",
      key: "products",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="dashed"
            onClick={() => handleManageProducts(record)}
            size="small"
          >
            Manage Products
          </Button>
        </div>
      ),
    },
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
            title="Are you sure you want to delete this brand?"
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
          <h1>Brands</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Brands</li>
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
                      { required: true, message: "Please enter serial number!" },
                    ]}
                  >
                    <Input
                      placeholder="Serial Number"
                      disabled
                    />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                      { required: true, message: "Please enter brand name!" },
                    ]}
                  >
                    <Input placeholder="Brand Name" />
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
              dataSource={brands}
              rowKey="_id"
              pagination={{ pageSize: 5, showSizeChanger: false }}
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default Brand;
