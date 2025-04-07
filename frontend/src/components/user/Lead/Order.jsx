import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, message, Table, Select, DatePicker, Popconfirm, Form } from "antd";
import axios from "axios";
import moment from "moment";
import "../master/Css Files/style.css";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";


function Orders() {
  const [form] = Form.useForm();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();


  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchQuotations();
    fetchAdmins();
    clearForm();
  }, []);

  const clearForm = () => {
    form.resetFields();
    setEditingId(null);
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8081/order");
      setOrders(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8081/customer");
      setCustomers(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchQuotations = async () => {
    try {
      const response = await axios.get("http://localhost:8081/quotation");
      setQuotations(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("http://localhost:8081/admin");
      setAdmins(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await axios.put(`http://localhost:8081/order/${editingId}`, values);
        messageApi.success("Order updated successfully!");
      } else {
        await axios.post("http://localhost:8081/order", values);
        messageApi.success("Order saved successfully!");
      }
      fetchOrders();
      clearForm();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to save order!";
      console.error("Error saving order:", error);
      messageApi.error(errorMsg);
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      ...record,
      orderdate: record.orderdate ? moment(record.orderdate) : null,
    });
    setEditingId(record._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/order/${id}`);
      messageApi.success("Order deleted successfully!");
      fetchOrders();
    } catch (error) {
      messageApi.error("Failed to delete order!");
      console.error("Error deleting order:", error);
    }
  };

  const columns = [
    { title: "Order No", dataIndex: "orderno", key: "orderno", align: "center" },
    {
      title: "Order Date",
      dataIndex: "orderdate",
      key: "orderdate",
      align: "center",
      render: (text) => (text ? moment(text).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "Customer",
      dataIndex: "customerid",
      key: "customerid",
      align: "start",
      render: (customerid) => {
        const customer = customers.find((c) => c._id === customerid);
        return customer ? customer.name : "N/A";
      },
    },
    {
      title: "Admin",
      dataIndex: "adminid",
      key: "adminid",
      align: "start",
      render: (adminid) => {
        const admin = admins.find((c) => c._id === adminid);
        return admin ? admin.name : "N/A";
      },
    },
    {
      title: "Quotation No",
      dataIndex: "quotationid",
      key: "quotationid",
      align: "Center",
      render: (quotationid) => {
        const quotation = quotations.find((q) => q._id === quotationid);
        return quotation ? quotation.quotationno : "N/A";
      },
    },
    { title: "Total Weight", dataIndex: "totalweight", key: "totalweight", align: "center" },
    { title: "Subtotal", dataIndex: "subtotal", key: "subtotal", align: "center" },
    { title: "GST Amount", dataIndex: "gstamount", key: "gstamount", align: "center" },
    { title: "Total", dataIndex: "total", key: "total", align: "center" },
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
            title="Are you sure you want to delete this admin?"
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
          <h1>Orders</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to={"/"}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Orders</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <div className="card p-3">
            <Form form={form} layout="vertical">
              <div className="row">
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="customerid"
                    label="Customer"
                    rules={[{ required: true, message: "Please select a customer!" }]}
                  >
                    <Select
                      className="w-100"
                      placeholder="Select Customer"
                      options={customers.map((customer) => ({
                        value: customer._id,
                        label: customer.name,
                      }))}
                    />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="quotationid"
                    label="Quotation"
                    rules={[{ required: true, message: "Please select a quotation!" }]}
                  >
                    <Select
                      className="w-100"
                      placeholder="Select Quotation"
                      options={quotations.map((quotation) => ({
                        value: quotation._id,
                        label: quotation.quotationno,
                      }))}
                    />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="orderno"
                    label="Order No"
                    rules={[{ required: true, message: "Please enter the order number!" }]}
                  >
                    <Input placeholder="Order No" />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="orderdate"
                    label="Order Date"
                    rules={[{ required: true, message: "Please select the order date!" }]}
                  >
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="baddress"
                    label="Billing Address"
                    rules={[{ required: true, message: "Please enter the billing address!" }]}
                  >
                    <Input placeholder="Billing Address" />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="saddress"
                    label="Shipping Address"
                    rules={[{ required: true, message: "Please enter the shipping address!" }]}
                  >
                    <Input placeholder="Shipping Address" />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="adminid"
                    label="Admin"
                    rules={[{ required: true, message: "Please select an admin!" }]}
                  >
                    <Select
                      className="w-100"
                      placeholder="Select Admin"
                      options={admins.map((admin) => ({
                        value: admin._id,
                        label: admin.name,
                      }))}
                    />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="totalweight"
                    label="Total Weight"
                    rules={[{ required: true, message: "Please enter the total weight!" }]}
                  >
                    <Input placeholder="Total Weight" />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="subtotal"
                    label="Subtotal"
                    rules={[{ required: true, message: "Please enter the subtotal!" }]}
                  >
                    <Input placeholder="Subtotal" />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="gstamount"
                    label="GST Amount"
                    rules={[{ required: true, message: "Please enter the GST amount!" }]}
                  >
                    <Input placeholder="GST Amount" />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="total"
                    label="Total"
                    rules={[{ required: true, message: "Please enter the total amount!" }]}
                  >
                    <Input placeholder="Total" />
                  </Form.Item>
                </div>
                <div className="col-lg-12 p-1">
                  <Button type="primary" onClick={handleSubmit} style={{ marginRight: "10px" }}>
                    {editingId ? "Update" : "Save"}
                  </Button>
                  <Button onClick={clearForm} style={{ marginRight: "10px" }}>
                    Clear
                  </Button>
                </div>
              </div>
            </Form>
          </div>
          <div className="card p-3">
            <Table
              className="custom-table"
              columns={columns}
              dataSource={orders}
              rowKey="_id"
              pagination={{ pageSize: 5, showSizeChanger: false }}
            />
          </div>
        </section>
      </main>
    </>
  );
}

export default Orders;