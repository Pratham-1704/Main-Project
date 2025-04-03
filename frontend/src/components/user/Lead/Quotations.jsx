import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, message, Table, Select, DatePicker } from "antd";
import axios from "axios";
import moment from "moment"; // Import moment
import "../master/Css Files/style.css"; // Import the custom CSS file

function Quotations() {
    const [formData, setFormData] = useState({
        firmid: "",
        sourceid: "",
        customerid: "",
        quotationno: "",
        quotationdate: null,
        baddress: "",
        saddress: "",
        createdon: null,
        adminid: "",
        totalweight: "",
        subtotal: "",
        gstamount: "",
        total: "",
        quotationtype: "",
    });

    const [quotations, setQuotations] = useState([]);
    const [firms, setFirms] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [sources, setSources] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [admins, setAdmins] = useState([]);


    // Fetch quotations from the backend
    const fetchQuotations = async () => {
        try {
            const response = await axios.get("http://localhost:8081/quotation");
            setQuotations(response.data.status === "success" ? response.data.data : []);
        } catch (error) {
            console.error("Error fetching quotations:", error);
            setQuotations([]);
        }
    };

    // Fetch firms from the backend
    const fetchFirms = async () => {
        try {
            const response = await axios.get("http://localhost:8081/firm");
            setFirms(response.data.status === "success" ? response.data.data : []);
        } catch (error) {
            console.error("Error fetching firms:", error);
        }
    };

    // Fetch customers from the backend
    const fetchCustomers = async () => {
        try {
            const response = await axios.get("http://localhost:8081/customer");
            setCustomers(response.data.status === "success" ? response.data.data : []);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    // Fetch sources from the backend
    const fetchSources = async () => {
        try {
            const response = await axios.get("http://localhost:8081/source");
            setSources(response.data.status === "success" ? response.data.data : []);
        } catch (error) {
            console.error("Error fetching sources:", error);
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


    useEffect(() => {
        fetchQuotations();
        fetchFirms();
        fetchCustomers();
        fetchSources();
        fetchAdmins();
        clearForm();
    }, []);

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
            await axios.post("http://localhost:8081/quotation", formData);
            messageApi.open({ type: "success", content: "Quotation saved successfully!" });
            fetchQuotations();
            clearForm();
        } catch (error) {
            messageApi.open({ type: "error", content: "Failed to save quotation!" });
            console.error("Error:", error);
        }
    };

    const handleUpdate = async () => {
        if (!formData._id) {
            messageApi.open({ type: "error", content: "Select a quotation to update!" });
            return;
        }
        try {
            await axios.put(`http://localhost:8081/quotation/${formData._id}`, formData);
            messageApi.open({ type: "success", content: "Quotation updated successfully!" });
            fetchQuotations();
            clearForm();
        } catch (error) {
            messageApi.open({ type: "error", content: "Failed to update quotation!" });
            console.error("Error:", error);
        }
    };

    const handleDelete = async () => {
        if (!formData._id) {
            messageApi.open({ type: "error", content: "Select a quotation to delete!" });
            return;
        }
        try {
            await axios.delete(`http://localhost:8081/quotation/${formData._id}`);
            messageApi.open({ type: "success", content: "Quotation deleted successfully!" });
            fetchQuotations();
            clearForm();
        } catch (error) {
            messageApi.open({ type: "error", content: "Failed to delete quotation!" });
            console.error("Error:", error);
        }
    };

    const clearForm = () => {
        setFormData({
            firmid: "",
            sourceid: "",
            customerid: "",
            quotationno: "",
            quotationdate: null,
            baddress: "",
            saddress: "",
            createdon: null,
            adminid: "",
            totalweight: "",
            subtotal: "",
            gstamount: "",
            total: "",
            quotationtype: "",
        });
    };

    const columns = [
        { title: "Quotation No", dataIndex: "quotationno", key: "quotationno" },
        { title: "Quotation Date", dataIndex: "quotationdate", key: "quotationdate" },
        { title: "Firm", dataIndex: "firmid", key: "firmid" },
        { title: "Customer", dataIndex: "customerid", key: "customerid" },
        { title: "Source", dataIndex: "sourceid", key: "sourceid" },
        { title: "Total Weight", dataIndex: "totalweight", key: "totalweight" },
        { title: "Subtotal", dataIndex: "subtotal", key: "subtotal" },
        { title: "GST Amount", dataIndex: "gstamount", key: "gstamount" },
        { title: "Total", dataIndex: "total", key: "total" },
        { title: "Quotation Type", dataIndex: "quotationtype", key: "quotationtype" },
    ];

    return (
        <>
            {contextHolder}
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Quotation Management</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to={"/"}>Dashboard</Link>
                            </li>
                            <li className="breadcrumb-item active">Quotations</li>
                        </ol>
                    </nav>
                </div>
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card p-3">
                                <div className="row">
                                    <div className="col-lg-6 p-1">
                                        Firm*
                                        <Select
                                            className="w-100"
                                            placeholder="Select Firm"
                                            value={formData.firmid}
                                            onChange={(value) => handleSelectChange("firmid", value)}
                                            options={firms.map((firm) => ({
                                                value: firm._id,
                                                label: firm.name,
                                            }))}
                                        />
                                    </div>
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
                                        Source*
                                        <Select
                                            className="w-100"
                                            placeholder="Select Source"
                                            value={formData.sourceid}
                                            onChange={(value) => handleSelectChange("sourceid", value)}
                                            options={sources.map((source) => ({
                                                value: source._id,
                                                label: source.name,
                                            }))}
                                        />
                                    </div>
                                    <div className="col-lg-6 p-1">
                                        Admin*
                                        <Select
                                            className="w-100"
                                            placeholder="Select Admin"
                                            value={formData.adminid}
                                            onChange={(value) => handleSelectChange("adminid", value)}
                                            options={admins.map((admin) => ({
                                                value: admin._id,
                                                label: admin.name,
                                            }))}
                                        />
                                    </div>

                                    <div className="col-lg-6 p-1">
                                        Quotation No*
                                        <Input
                                            name="quotationno"
                                            placeholder="Quotation No"
                                            value={formData.quotationno}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-6 p-1">
                                        Quotation Date*
                                        <DatePicker
                                            className="w-100"
                                            value={formData.quotationdate ? moment(formData.quotationdate) : null} // Ensure moment is used
                                            onChange={(date) => handleDateChange("quotationdate", date)}
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
                                    <div className="col-lg-6 p-1">
                                        Quotation Type*
                                        <Input
                                            name="quotationtype"
                                            placeholder="Quotation Type"
                                            value={formData.quotationtype}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-12 p-1">
                                        <Button
                                            type="primary"
                                            onClick={handleSubmit}
                                            style={{ marginRight: "10px" }}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            color="green" variant="solid"
                                            onClick={handleUpdate}
                                            style={{ marginRight: "10px" }}
                                        >
                                            Update
                                        </Button>

                                        <Button
                                            color="danger" variant="solid"
                                            onClick={handleDelete}
                                            style={{ marginRight: "10px" }}
                                        >
                                            Delete
                                        </Button>

                                        <Button
                                            variant="solid"
                                            onClick={clearForm}
                                            style={{ marginRight: "10px" }}
                                        >
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
                                    dataSource={quotations}
                                    rowKey="_id"
                                    onRow={(record) => ({
                                        onClick: () => {
                                            setFormData(record); // Populate form with selected row data
                                        },
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Quotations;