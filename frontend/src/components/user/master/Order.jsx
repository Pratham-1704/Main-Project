import React, { useState, useEffect } from "react";
import { Button, Input, message, Table, DatePicker } from "antd";
import axios from "axios";
import "./Css Files/style.css";

function Order() {
  const [formData, setFormData] = useState({
    firmid: "",
    quotationid: "",
    customerid: "",
    orderno: "",
    orderdate: "",
    baddress: "",
    saddress: "",
    createdon: "",
    adminid: "",
    totalweight: "",
    subtotal: "",
    gstamount: "",
    total: ""
  });

  const [orders, setOrders] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8081/order");
      setOrders(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      messageApi.open({ type: "error", content: "Failed to fetch orders!" });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date, dateString) => {
    setFormData({ ...formData, orderdate: dateString });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8081/order", formData);
      messageApi.open({ type: "success", content: "Order saved successfully!" });
      fetchOrders();
      clearForm();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to save order!" });
      console.error("Error:", error);
    }
  };

  const handleUpdate = async () => {
    if (!formData._id) {
      messageApi.open({ type: "error", content: "Select an order to update!" });
      return;
    }
    try {
      await axios.put(`http://localhost:8081/order/${formData._id}`, formData);
      messageApi.open({ type: "success", content: "Order updated successfully!" });
      fetchOrders();
      clearForm();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to update order!" });
      console.error("Error:", error);
    }
  };

  const handleDelete = async () => {
    if (!formData._id) {
      messageApi.open({ type: "error", content: "Select an order to delete!" });
      return;
    }
    try {
      await axios.delete(`http://localhost:8081/order/${formData._id}`);
      messageApi.open({ type: "success", content: "Order deleted successfully!" });
      fetchOrders();
      clearForm();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to delete order!" });
      console.error("Error:", error);
    }
  };

  const clearForm = () => {
    setFormData({
      firmid: "",
      quotationid: "",
      customerid: "",
      orderno: "",
      orderdate: "",
      baddress: "",
      saddress: "",
      createdon: "",
      adminid: "",
      totalweight: "",
      subtotal: "",
      gstamount: "",
      total: ""
    });
  };

  const columns = [
    { title: "Firm ID", dataIndex: "firmid", key: "firmid" },
    { title: "Quotation ID", dataIndex: "quotationid", key: "quotationid" },
    { title: "Customer ID", dataIndex: "customerid", key: "customerid" },
    { title: "Order No", dataIndex: "orderno", key: "orderno" },
    { title: "Order Date", dataIndex: "orderdate", key: "orderdate" },
    { title: "Billing Address", dataIndex: "baddress", key: "baddress" },
    { title: "Shipping Address", dataIndex: "saddress", key: "saddress" },
    { title: "Created On", dataIndex: "createdon", key: "createdon" },
    { title: "Admin ID", dataIndex: "adminid", key: "adminid" },
    { title: "Total Weight", dataIndex: "totalweight", key: "totalweight" },
    { title: "Subtotal", dataIndex: "subtotal", key: "subtotal" },
    { title: "GST Amount", dataIndex: "gstamount", key: "gstamount" },
    { title: "Total", dataIndex: "total", key: "total" }
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Orders</h1>
        </div>
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <div className="row">
                  {Object.keys(formData).map((key) => (
                    <div className="col-lg-6 p-1" key={key}>
                      {key.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase()}*
                      {key === "orderdate" ? (
                        <DatePicker onChange={handleDateChange} style={{ width: "100%" }} />
                      ) : (
                        <Input name={key} placeholder={`Enter ${key}`} value={formData[key]} onChange={handleInputChange} />
                      )}
                    </div>
                  ))}
                  <div className="col-lg-12 p-1">
                    <Button type="primary" onClick={handleSubmit} style={{ marginRight: "10px" }}>Save</Button>
                    <Button onClick={handleUpdate} style={{ marginRight: "10px", backgroundColor: "green", color: "white" }}>Update</Button>
                    <Button onClick={handleDelete} style={{ marginRight: "10px", backgroundColor: "red", color: "white" }}>Delete</Button>
                    <Button onClick={clearForm}>Cancel</Button>
                  </div>
                </div>
              </div>
              <Table className="custom-table" columns={columns} dataSource={orders} rowKey="_id" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Order;