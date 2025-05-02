import React, { useState, useEffect } from "react";
import { Button, Input, message, Table, DatePicker, Select } from "antd";
import axios from "axios";
import "./Css Files/style.css";

const { Option } = Select;

function Order() {
  const [formData, setFormData] = useState({
    firmid: "",
    quotationid: "",
    customerid: "",
    adminid: "",
    orderno: "",
    orderdate: "",
    baddress: "",
    saddress: "",
    createdon: "",
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
    window.scrollTo(0, 0);

    fetchOrders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
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
                      {[
                        "firmid",
                        "quotationid",
                        "customerid",
                        "adminid"
                      ].includes(key) ? (
                        <Select
                          name={key}
                          style={{ width: "100%" }}
                          placeholder={`Select ${key}`}
                          onChange={(value) => handleSelectChange(key, value)}
                        >
                          <Option value="1">Option 1</Option>
                          <Option value="2">Option 2</Option>
                          <Option value="3">Option 3</Option>
                        </Select>
                      ) : key === "orderdate" ? (
                        <DatePicker
                          onChange={handleDateChange}
                          style={{ width: "100%" }}
                        />
                      ) : (
                        <Input
                          name={key}
                          placeholder={`Enter ${key}`}
                          value={formData[key]}
                          onChange={handleInputChange}
                        />
                      )}
                    </div>
                  ))}
                  <div className="col-lg-12 p-1">
                    <Button type="primary" onClick={handleSubmit} style={{ marginRight: "10px" }}>
                      Save
                    </Button>
                    <Button onClick={clearForm}>Cancel</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Order;
