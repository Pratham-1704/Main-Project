import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, DatePicker, Table, message } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";

const SBQ = () => {
    const [tableData, setTableData] = useState([]);
    const [form] = Form.useForm();
    const [brandOptions, setBrandOptions] = useState([]);

    // Fetch brand list from backend
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await axios.get("/api/brand"); // adjust your endpoint if needed
                const options = res.data.map((brand) => ({
                    value: brand._id,
                    label: brand.name,
                }));
                setBrandOptions(options);
            } catch (err) {
                console.error("Failed to fetch brands:", err);
                message.error("Failed to load brands");
            }
        };

        fetchBrands();
    }, []);

    const addRow = () => {
        const newRow = {
            key: Date.now(),
            category: null,
            product: null,
            brand: null,
            req: "",
            estimationin: "",
            narration: "",
        };
        setTableData([...tableData, newRow]);
    };

    const updateRow = (key, field, value) => {
        setTableData((prev) =>
            prev.map((row) => (row.key === key ? { ...row, [field]: value } : row))
        );
    };

    const deleteRow = (key) => {
        setTableData((prev) => prev.filter((row) => row.key !== key));
    };

    const columns = [
        {
            title: "No",
            dataIndex: "no",
            key: "no",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (_, record) => (
                <Select
                    placeholder="Select"
                    value={record.category}
                    onChange={(value) => updateRow(record.key, "category", value)}
                    style={{ width: "100%" }}
                >
                    <Select.Option value="cat1">Category 1</Select.Option>
                    <Select.Option value="cat2">Category 2</Select.Option>
                </Select>
            ),
        },
        {
            title: "Product",
            dataIndex: "product",
            key: "product",
            render: (_, record) => (
                <Select
                    placeholder="Select"
                    value={record.product}
                    onChange={(value) => updateRow(record.key, "product", value)}
                    style={{ width: "100%" }}
                >
                    <Select.Option value="prod1">Product 1</Select.Option>
                    <Select.Option value="prod2">Product 2</Select.Option>
                </Select>
            ),
        },
        {
            title: "Brand",
            dataIndex: "brand",
            key: "brand",
            render: (_, record) => (
                <Select
                    placeholder="Select Brand"
                    value={record.brand}
                    onChange={(value) => updateRow(record.key, "brand", value)}
                    style={{ width: "100%" }}
                    options={brandOptions}
                />
            ),
        },
        {
            title: "Estimation In",
            dataIndex: "req",
            key: "req",
            render: (_, record) => (
                <Select
                    placeholder=""
                    value={record.brand}
                    onChange={(value) => updateRow(record.key, "brand", value)}
                    style={{ width: "100%" }}
                    options={{}}
                />
            ),
        },
        {
            title: "Req",
            dataIndex: "req",
            key: "req",
            render: (_, record) => (
                <Input
                    value={record.req}
                    onChange={(e) => updateRow(record.key, "req", e.target.value)}
                />
            ),
        },
        {
            title: "Unit",
            dataIndex: "estimationin",
            key: "estimationin",
            render: (_, record) => (
                <Input
                    value={record.estimationin}
                    onChange={(e) =>
                        updateRow(record.key, "estimationin", e.target.value)
                    }
                />
            ),
        },
        {
            title: "Rate",
            dataIndex: "narration",
            key: "narration",
            render: (_, record) => (
                <Input
                    value={record.narration}
                    onChange={(e) =>
                        updateRow(record.key, "narration", e.target.value)
                    }
                />
            ),
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            render: (_, record) => (
                <Input
                    value={record.total}
                    onChange={(e) => updateRow(record.key, "total", e.target.value)}
                />
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => deleteRow(record.key)}
                />
            ),
        },
    ];

    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>SBQ</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="">Lead</Link>
                        </li>
                        <li className="breadcrumb-item active">SBQ</li>
                    </ol>
                </nav>
            </div>

            <section className="section">
                <div className="card p-3">
                    <Form form={form} layout="vertical">
                        <div className="row">
                            <div className="col-md-3">
                                <Form.Item name="sbqdate" label="SBQ Date">
                                    <DatePicker className="w-100" format="DD-MM-YYYY" />
                                </Form.Item>
                            </div>
                            <div className="col-md-2">
                                <Form.Item label="SBQ No">
                                    <Input disabled />
                                </Form.Item>
                            </div>
                            <div className="col-md-4">
                                <Form.Item name="customerid" label="Customer">
                                    <Select placeholder="Select Customer" />
                                </Form.Item>
                            </div>
                            <div className="col-md-3">
                                <Form.Item name="sourceid" label="Source">
                                    <Select placeholder="Select Source" />
                                </Form.Item>
                            </div>
                        </div>
                    </Form>
                </div>

                <div className="card p-3 mt-3">
                    <Table
                        dataSource={tableData}
                        columns={columns}
                        rowKey="key"
                        pagination={false}
                    />
                    <div className="text-end mt-2">
                        <Button
                            type="default"
                            icon={<PlusCircleOutlined />}
                            size="small"
                            onClick={addRow}
                        >
                            Add Row
                        </Button>
                        <br />
                        <Button
                            type="primary"
                            style={{ marginTop: "8px", marginRight: "8px" }}
                        >
                            Save
                        </Button>
                        <Link to="/lead/lead-record">
                            <Button type="default" danger style={{ marginTop: "8px" }}>
                                Cancel
                            </Button>
                        </Link>

                    </div>
                </div>
            </section>
        </main>
    );
};

export default SBQ;
