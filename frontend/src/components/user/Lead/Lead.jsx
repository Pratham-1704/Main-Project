import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Table,
  message,
  DatePicker,
  Popconfirm,
} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";

const Leads = () => {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [source, setSources] = useState([]);
  const [rows, setRows] = useState([{ key: 0, category: null, product: null, in: null, quantity: '', narration: '' }]);
  const [messageApi, contextHolder] = message.useMessage();
  const [leadnoPreview, setLeadnoPreview] = useState("");

  useEffect(() => {
    fetchInitials();
  }, []);

  const fetchInitials = async () => {
    try {
      const [cust, cat, prod, src] = await Promise.all([
        axios.get("http://localhost:8081/customer"),
        axios.get("http://localhost:8081/category"),
        axios.get("http://localhost:8081/product"),
        axios.get("http://localhost:8081/source"),
      ]);

      setCustomers(cust.data.data || []);
      setCategories(cat.data.data || []);
      setProducts(prod.data.data || []);
      setSources(src.data.data || []);

      generateNextLeadNo();
      form.setFieldsValue({ createdon: dayjs() });
    } catch (err) {
      messageApi.error("Failed to load initial data");
    }
  };

  const generateNextLeadNo = async () => {
    const today = new Date();
    const datePart = today.toLocaleDateString("en-GB").replace(/\//g, "");
    const prefix = `LD${datePart}`;

    try {
      const res = await axios.get("http://localhost:8081/lead");
      const leads = res.data.status === "success" ? res.data.data : [];

      const todayLeads = leads.filter((lead) => lead.leadno.startsWith(prefix));
      const maxNumber = todayLeads.reduce((max, lead) => {
        const numPart = parseInt(lead.leadno.split("-")[1], 10);
        return numPart > max ? numPart : max;
      }, 0);

      const nextNumber = String(maxNumber + 1).padStart(3, "0");
      const nextLeadNo = `${prefix}-${nextNumber}`;
      setLeadnoPreview(nextLeadNo);
      return nextLeadNo;
    } catch {
      const fallback = `${prefix}-001`;
      setLeadnoPreview(fallback);
      return fallback;
    }
  };

  const handleRowChange = (key, field, value) => {
    const updated = rows.map((row) =>
      row.key === key ? { ...row, [field]: value, ...(field === 'category' ? { product: null } : {}) } : row
    );
    setRows(updated);
  };

  const addRow = () => {
    setRows((prev) => [...prev, { key: Date.now(), category: null, product: null, in: null, quantity: '', narration: '' }]);
  };

  const removeRow = (key) => {
    setRows((prev) => prev.filter((row) => row.key !== key));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const leadno = await generateNextLeadNo();

      // Retrieve admin ID from localStorage
      const adminId = localStorage.getItem("adminid");

      // Prepare the payload for the `lead` table
      const leadPayload = {
        sourceid: values.sourceid,
        customerid: values.customerid,
        leadno,
        leaddate: values.leaddate?.toISOString(),
        createdon: values.createdon?.toISOString(),
        adminid: adminId,
      };

      console.log("Lead Payload:", leadPayload);

      // Save the `lead` data
      const leadResponse = await axios.post("http://localhost:8081/lead", leadPayload);

      // Get the `leadid` from the response
      const leadId = leadResponse.data.data._id;

      // Prepare the payload for the `leaddetails` table
      const leadDetailsPayload = rows.map((row) => ({
        leadid: leadId, // Associate with the lead ID
        categoryid: row.category,
        productid: row.product,
        estimationin: row.in,
        quantity: row.quantity,
        narration: row.narration || "", // Default value for optional field
      }));

      // Validate the payload
      const isValid = leadDetailsPayload.every(
        (detail) =>
          detail.categoryid &&
          detail.productid &&
          detail.estimationin &&
          detail.quantity !== null &&
          detail.quantity !== undefined
      );

      if (!isValid) {
        messageApi.error("Please fill in all required fields in the lead details.");
        return;
      }

      console.log("Lead Details Payload:", leadDetailsPayload);

      // Save the `leaddetails` data
      await axios.post("http://localhost:8081/leaddetail", leadDetailsPayload);

      messageApi.success("Leads saved successfully!");
      setRows([{ key: 0, category: null, product: null, in: null, quantity: '', narration: '' }]);
      form.resetFields();
      form.setFieldsValue({ createdon: dayjs() });
      generateNextLeadNo();
    } catch (err) {
      console.error("Error saving leads:", err.response?.data || err.message);
      messageApi.error("Failed to save leads.");
    }
  };

  const columns = [
    {
      title: "Sr No",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (_, record) => (
        <Select
          style={{ width: 150 }}
          value={record.category}
          onChange={(val) => handleRowChange(record.key, "category", val)}
          options={categories.map((cat) => ({ label: cat.name, value: cat._id }))}
        />
      ),
    },
    {
      title: "Product",
      dataIndex: "product",
      render: (_, record) => {
        const filteredProducts = products.filter(
          (p) => p.categoryid === record.category
        );
        return (
          <Select
            style={{ width: 150 }}
            value={record.product}
            onChange={(val) => handleRowChange(record.key, "product", val)}
            options={filteredProducts.map((p) => ({ label: p.name, value: p._id }))}
            disabled={!record.category}
          />
        );
      },
    },
    {
      title: "IN",
      dataIndex: "in",
      render: (_, record) => (
        <Select
          style={{ width: 120 }}
          value={record.in}
          onChange={(val) => handleRowChange(record.key, "in", val)}
          options={[
            { label: "KG", value: "kg" },
            { label: "FEET", value: "feet" },
            { label: "METER", value: "meter" },
            { label: "NOS", value: "nos" },
          ]}
        />
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (_, record) => (
        <Input
          value={record.quantity}
          type="number"
          style={{ width: 100 }}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            handleRowChange(record.key, "quantity", value >= 0 ? value : 0); // Ensure quantity is non-negative
          }}
        />
      ),
    },
    {
      title: "Narration",
      dataIndex: "narration",
      render: (_, record) => (
        <Input
          value={record.narration}
          style={{ width: 200 }}
          onChange={(e) => handleRowChange(record.key, "narration", e.target.value)}
        />
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this row?"
          onConfirm={() => removeRow(record.key)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <main className="main">
        <div className="pagetitle">
          <h1>Leads</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Leads</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="card p-3">
            <Form form={form} layout="vertical">
              <div className="row">
                <div className="col-md-6">
                  <Form.Item name="leaddate" label="Lead Date" rules={[{ required: true }]}>
                    <DatePicker className="w-100" format="DD-MM-YYYY" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item label="Lead No">
                    <Input value={leadnoPreview} disabled />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item name="customerid" label="Customer" rules={[{ required: true }]}>
                    <Select
                      placeholder="Select Customer"
                      options={customers.map((c) => ({ label: c.name, value: c._id }))}
                    />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item name="sourceid" label="Source" rules={[{ required: true }]}>
                    <Select
                      placeholder="Select Source"
                      options={source.map((s) => ({ label: s.name, value: s._id }))}
                    />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>

          <div className="card p-3 mt-3">
            <div className="d-flex justify-content-between mb-2">
              <h5>Lead Items</h5>
              <Button icon={<PlusCircleOutlined />} onClick={addRow}>
                Add Row
              </Button>
            </div>
            <Table dataSource={rows} columns={columns} rowKey="key" pagination={false} />
            <div className="mt-3 text-end">
              <Button type="primary" onClick={handleSubmit}>
                Save
              </Button>
              <Button onClick={() => setRows([{ key: 0, category: null, product: null, in: null, quantity: '', narration: '' }])} className="ms-2">
                Cancel
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Leads;