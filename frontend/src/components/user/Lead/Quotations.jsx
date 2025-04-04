import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, message, Table, Select, DatePicker, Form } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import "../master/Css Files/style.css";

function Quotations() {
    const [formData, setFormData] = useState({
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
    const [customers, setCustomers] = useState([]);
    const [sources, setSources] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [admins, setAdmins] = useState([]);
    const [form] = Form.useForm(); // Ant Design Form instance

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
        fetchCustomers();
        fetchSources();
        fetchAdmins();
        clearForm();
    }, []);

    const handleDateChange = (name, date) => {
        setFormData({ ...formData, [name]: date ? date.toISOString() : null });
    };

    const handleSubmit = async () => {
        try {
            await form.validateFields(); // Validate all fields
            if (formData._id) {
                // Update operation
                console.log("Updating record:", formData); // Debugging: Log the formData for update
                await axios.put(`http://localhost:8081/quotation/${formData._id}`, formData);
                messageApi.open({ type: "success", content: "Quotation updated successfully!" });
            } else {
                // Create operation
                console.log("Creating new record:", formData); // Debugging: Log the formData for create
                await axios.post("http://localhost:8081/quotation", formData);
                messageApi.open({ type: "success", content: "Quotation saved successfully!" });
            }
            fetchQuotations(); // Refresh the table data
            clearForm(); // Clear the form
        } catch (error) {
            if (error.errorFields) {
                // messageApi.open({ type: "error", content: "Please fill all required fields!" });
            } else {
                messageApi.open({ type: "error", content: "Failed to save quotation!" });
                console.error("Error:", error);
            }
        }
    };

    const clearForm = () => {
        setFormData({
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
        form.resetFields(); // Reset form fields
    };

    const columns = [
        { title: "Quotation No", dataIndex: "quotationno", key: "quotationno" },
        { title: "Quotation Date", dataIndex: "quotationdate", key: "quotationdate" },
        { title: "Customer", dataIndex: ["customerid", "name"], key: "customerid" },
        { title: "Source", dataIndex: ["sourceid", "name"], key: "sourceid" },
        { title: "Total Weight", dataIndex: "totalweight", key: "totalweight" },
        { title: "Subtotal", dataIndex: "subtotal", key: "subtotal" },
        { title: "GST Amount", dataIndex: "gstamount", key: "gstamount" },
        { title: "Total", dataIndex: "total", key: "total" },
        { title: "Quotation Type", dataIndex: "quotationtype", key: "quotationtype" },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <div>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                            console.log("Editing record:", record); // Debugging: Log the selected record
                            setFormData(record); // Update the state with the selected record
                            form.setFieldsValue({
                                ...record,
                                quotationdate: record.quotationdate ? moment(record.quotationdate) : null, // Ensure moment is used for date
                            }); // Populate the form fields
                        }}
                        style={{ marginRight: "10px" }}
                    />
                    <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDeleteRow(record._id)}
                    />
                </div>
            ),
        },
    ];

    const handleDeleteRow = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/quotation/${id}`);
            messageApi.open({ type: "success", content: "Quotation deleted successfully!" });
            fetchQuotations();
            clearForm();
        } catch (error) {
            messageApi.open({ type: "error", content: "Failed to delete quotation!" });
            console.error("Error:", error);
        }
    };

    return (
        <>
            {contextHolder}
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Quotations</h1>
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
                                <Form form={form} layout="vertical">
                                    <div className="row">
                                        <div className="col-lg-6 p-1">
                                            <Form.Item
                                                label="Customer"
                                                name="customerid"
                                                rules={[{ required: true, message: "Please select a customer!" }]}
                                            >
                                                <Select
                                                    className="w-100"
                                                    placeholder="Select Customer"
                                                    value={formData.customerid}
                                                    onChange={(value) => setFormData({ ...formData, customerid: value })}
                                                    options={customers.map((customer) => ({
                                                        value: customer._id,
                                                        label: customer.name,
                                                    }))}
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="col-lg-6 p-1">
                                            <Form.Item
                                                label="Source"
                                                name="sourceid"
                                                rules={[{ required: true, message: "Please select a source!" }]}
                                            >
                                                <Select
                                                    className="w-100"
                                                    placeholder="Select Source"
                                                    value={formData.sourceid}
                                                    onChange={(value) => setFormData({ ...formData, sourceid: value })}
                                                    options={sources.map((source) => ({
                                                        value: source._id,
                                                        label: source.name,
                                                    }))}
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="col-lg-6 p-1">
                                            <Form.Item
                                                label="Admin"
                                                name="adminid"
                                                rules={[{ required: true, message: "Please select an admin!" }]}
                                            >
                                                <Select
                                                    className="w-100"
                                                    placeholder="Select Admin"
                                                    value={formData.adminid}
                                                    onChange={(value) => setFormData({ ...formData, adminid: value })}
                                                    options={admins.map((admin) => ({
                                                        value: admin._id,
                                                        label: admin.name,
                                                    }))}
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="col-lg-6 p-1">
                                            <Form.Item
                                                label="Quotation No"
                                                name="quotationno"
                                                rules={[{ required: true, message: "Please enter a quotation number!" }]}
                                            >
                                                <Input
                                                    name="quotationno"
                                                    placeholder="Quotation No"
                                                    value={formData.quotationno}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, quotationno: e.target.value })
                                                    }
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="col-lg-6 p-1">
                                            <Form.Item
                                                label="Quotation Date"
                                                name="quotationdate"
                                                rules={[{ required: true, message: "Please select a quotation date!" }]}
                                            >
                                                <DatePicker
                                                    className="w-100"
                                                    value={formData.quotationdate ? moment(formData.quotationdate) : null}
                                                    onChange={(date) => handleDateChange("quotationdate", date)}
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="col-lg-6 p-1">
                                            <Form.Item
                                                label="Billing Address"
                                                name="baddress"
                                                rules={[{ required: true, message: "Please enter a billing address!" }]}
                                            >
                                                <Input
                                                    name="baddress"
                                                    placeholder="Billing Address"
                                                    value={formData.baddress}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, baddress: e.target.value })
                                                    }
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="col-lg-6 p-1">
                                            <Form.Item
                                                label="Shipping Address"
                                                name="saddress"
                                                rules={[{ required: true, message: "Please enter a shipping address!" }]}
                                            >
                                                <Input
                                                    name="saddress"
                                                    placeholder="Shipping Address"
                                                    value={formData.saddress}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, saddress: e.target.value })
                                                    }
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="col-lg-6 p-1">
                                            <Form.Item
                                                label="Total Weight"
                                                name="totalweight"
                                                rules={[{ required: true, message: "Please enter total weight!" }]}
                                            >
                                                <Input
                                                    name="totalweight"
                                                    placeholder="Total Weight"
                                                    value={formData.totalweight}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, totalweight: e.target.value })
                                                    }
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="col-lg-6 p-1">
                                            <Form.Item
                                                label="Subtotal"
                                                name="subtotal"
                                                rules={[{ required: true, message: "Please enter subtotal!" }]}
                                            >
                                                <Input
                                                    name="subtotal"
                                                    placeholder="Subtotal"
                                                    value={formData.subtotal}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, subtotal: e.target.value })
                                                    }
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="col-lg-6 p-1">
                                            <Form.Item
                                                label="GST Amount"
                                                name="gstamount"
                                                rules={[{ required: true, message: "Please enter GST amount!" }]}
                                            >
                                                <Input
                                                    name="gstamount"
                                                    placeholder="GST Amount"
                                                    value={formData.gstamount}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, gstamount: e.target.value })
                                                    }
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="col-lg-6 p-1">
                                            <Form.Item
                                                label="Total"
                                                name="total"
                                                rules={[{ required: true, message: "Please enter total!" }]}
                                            >
                                                <Input
                                                    name="total"
                                                    placeholder="Total"
                                                    value={formData.total}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, total: e.target.value })
                                                    }
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="col-lg-6 p-1">
                                            <Form.Item
                                                label="Quotation Type"
                                                name="quotationtype"
                                                rules={[{ required: true, message: "Please enter quotation type!" }]}
                                            >
                                                <Input
                                                    name="quotationtype"
                                                    placeholder="Quotation Type"
                                                    value={formData.quotationtype}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, quotationtype: e.target.value })
                                                    }
                                                />
                                            </Form.Item>
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
                                                onClick={clearForm}
                                                style={{ marginRight: "10px" }}
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
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