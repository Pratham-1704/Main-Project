import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    Select,
    Button,
    DatePicker,
    Table,
    message,
} from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";

const MBQ = () => {
    const [form] = Form.useForm();
    const [tableData, setTableData] = useState([]);
    const [brandOptions, setBrandOptions] = useState([]);

    // Fetch brands
    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchBrands = async () => {
            try {
                const res = await axios.get("/api/brand");
                const options = res.data.map((brand) => ({
                    value: brand._id,
                    label: brand.name,
                }));
                setBrandOptions(options);
            } catch (err) {
                console.error("Error fetching brands:", err);
                message.error("Failed to load brands");
            }
        };
        fetchBrands();
    }, []);

    const addRow = () => {
        const newRow = {
            key: Date.now(),
            brand: null,
            category: null,
            product: null,
            req: "",
            estimationin: "",
            rate: "",
            total: "",
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
            render: (_, __, index) => index + 1,
        },
        {
            title: "Brand",
            dataIndex: "brand",
            render: (_, record) => (
                <Select
                    placeholder="Select Brand"
                    value={record.brand}
                    onChange={(value) => updateRow(record.key, "brand", value)}
                    options={brandOptions}
                    style={{ width: "100%" }}
                />
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
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
            title: "Req",
            dataIndex: "req",
            render: (_, record) => (
                <Input
                    value={record.req}
                    onChange={(e) => updateRow(record.key, "req", e.target.value)}
                />
            ),
        },
        {
            title: "Estimation In",
            dataIndex: "estimationin",
            render: (_, record) => (
                <Input
                    value={record.estimationin}
                    onChange={(e) => updateRow(record.key, "estimationin", e.target.value)}
                />
            ),
        },
        {
            title: "Rate",
            dataIndex: "rate",
            render: (_, record) => (
                <Input
                    value={record.rate}
                    onChange={(e) => updateRow(record.key, "rate", e.target.value)}
                />
            ),
        },
        {
            title: "Total",
            dataIndex: "total",
            render: (_, record) => (
                <Input
                    value={record.total}
                    onChange={(e) => updateRow(record.key, "total", e.target.value)}
                />
            ),
        },
        {
            title: "Action",
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
                <h1>MBQ</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/lead">Lead</Link>
                        </li>
                        <li className="breadcrumb-item active">MBQ</li>
                    </ol>
                </nav>
            </div>

            <section className="section">
                <div className="card p-3">
                    <Form form={form} layout="vertical">
                        <div className="row">
                            <div className="col-md-3">
                                <Form.Item name="mbqdate" label="MBQ Date">
                                    <DatePicker className="w-100" format="DD-MM-YYYY" />
                                </Form.Item>
                            </div>
                            <div className="col-md-2">
                                <Form.Item label="MBQ No">
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

export default MBQ;
