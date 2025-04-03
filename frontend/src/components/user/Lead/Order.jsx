import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, message, Table, Select, DatePicker } from "antd";
import axios from "axios";
import moment from "moment";
import "../master/Css Files/style.css";

function Orders() {
    const [formData, setFormData] = useState({
        quotationid: "",
        customerid: "",
        orderno: "",
        orderdate: null,
        baddress: "",
        saddress: "",
        createdon: null,
        adminid: "",
        totalweight: "",
        subtotal: "",
        gstamount: "",
        total: "",
    });

    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [quotations, setQuotations] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        fetchOrders();
        fetchCustomers();
        fetchQuotations();
        fetchAdmins();
        clearForm();
    }, []);

    const clearForm = () => {
        setFormData({
            quotationid: "",
            customerid: "",
            orderno: "",
            orderdate: null,
            baddress: "",
            saddress: "",
            createdon: null,
            adminid: "",
            totalweight: "",
            subtotal: "",
            gstamount: "",
            total: "",
        });
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleDateChange = (name, date) => {
        setFormData({ ...formData, [name]: date ? date.toISOString() : null });
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

    const columns = [
        { title: "Order No", dataIndex: "orderno", key: "orderno" },
        { title: "Order Date", dataIndex: "orderdate", key: "orderdate" },
        { title: "Customer", dataIndex: "customerid", key: "customerid" },
        { title: "Quotation", dataIndex: "quotationid", key: "quotationid" },
        { title: "Total Weight", dataIndex: "totalweight", key: "totalweight" },
        { title: "Subtotal", dataIndex: "subtotal", key: "subtotal" },
        { title: "GST Amount", dataIndex: "gstamount", key: "gstamount" },
        { title: "Total", dataIndex: "total", key: "total" },
    ];

    return (
        <>
            {contextHolder}
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Order Management</h1>
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
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card p-3">
                                <div className="row">
                                    <div className="col-lg-6 p-1">
                                        Customer*
                                        <Select
                                            className="w-100"
                                            placeholder="Select Customer"
                                            value={formData.customerid}
                                            onChange={(value) => handleSelectChange("customerid", value)}
                                            options={customers.map((customer) => ({
                                                value: customer._id,
                                                label: customer.name,
                                            }))}
                                        />
                                    </div>
                                    <div className="col-lg-6 p-1">
                                        Quotation*
                                        <Select
                                            className="w-100"
                                            placeholder="Select Quotation"
                                            value={formData.quotationid}
                                            onChange={(value) => handleSelectChange("quotationid", value)}
                                            options={quotations.map((quotation) => ({
                                                value: quotation._id,
                                                label: quotation.quotationno,
                                            }))}
                                        />
                                    </div>
                                    <div className="col-lg-6 p-1">
                                        Order No*
                                        <Input
                                            name="orderno"
                                            placeholder="Order No"
                                            value={formData.orderno}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-6 p-1">
                                        Order Date*
                                        <DatePicker
                                            className="w-100"
                                            value={formData.orderdate ? moment(formData.orderdate) : null}
                                            onChange={(date) => handleDateChange("orderdate", date)}
                                        />
                                    </div>
                                    <div className="col-lg-6 p-1">
                                        Billing Address*
                                        <Input
                                            name="baddress"
                                            placeholder="Billing Address"
                                            value={formData.baddress}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-6 p-1">
                                        Shipping Address*
                                        <Input
                                            name="saddress"
                                            placeholder="Shipping Address"
                                            value={formData.saddress}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-6 p-1">
                                        Total Weight*
                                        <Input
                                            name="totalweight"
                                            placeholder="Total Weight"
                                            value={formData.totalweight}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-6 p-1">
                                        Subtotal*
                                        <Input
                                            name="subtotal"
                                            placeholder="Subtotal"
                                            value={formData.subtotal}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-6 p-1">
                                        GST Amount*
                                        <Input
                                            name="gstamount"
                                            placeholder="GST Amount"
                                            value={formData.gstamount}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-6 p-1">
                                        Total*
                                        <Input
                                            name="total"
                                            placeholder="Total"
                                            value={formData.total}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-12 p-1">
                                        <Button type="primary" onClick={handleSubmit} style={{ marginRight: "10px" }}>
                                            Save Order
                                        </Button>
                                        <Button onClick={clearForm} style={{ marginRight: "10px" }}>
                                            Clear
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card p-3">
                                <Table
                                    className="custom-table"
                                    columns={columns}
                                    dataSource={orders}
                                    rowKey="_id"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Orders;