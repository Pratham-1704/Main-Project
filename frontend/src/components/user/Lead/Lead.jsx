import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Table,
  message,
  InputNumber,
  Popconfirm,
} from "antd";
import {
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Leads = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [source, setSources] = useState([]);
  const [rows, setRows] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [leadnoPreview, setLeadnoPreview] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchInitials();

    if (location.state?.record) {
      setIsEditMode(true);
      prefillForm(location.state.record);
    } else {
      setIsEditMode(false);
      generateNextLeadNo();
      addRow(); // Add a default row
    }
  }, [location.state]);

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

  const prefillForm = (record) => {
    form.setFieldsValue({
      leaddate: dayjs(record.leaddate),
      customerid: record.customerid,
      sourceid: record.sourceid,
    });

    // Set the lead number for the Lead No field
    setLeadnoPreview(record.leadno);

    const updatedRows = record.items.map((item, index) => ({
      key: index,
      category: item.categoryid,
      product: item.productid,
      in: item.estimationin,
      quantity: item.quantity,
      narration: item.narration || "",
    }));
    setRows(updatedRows);
  };

  const handleRowChange = (key, field, value) => {
    const updated = rows.map((row) =>
      row.key === key ? { ...row, [field]: value, ...(field === "category" ? { product: null } : {}) } : row
    );
    setRows(updated);
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        key: Date.now(),
        category: null,
        product: null,
        in: null,
        quantity: "",
        narration: "",
      },
    ]);
  };

  const removeRow = (key) => {
    setRows((prev) => prev.filter((row) => row.key !== key));
  };

  const handleSaveOrUpdate = async () => {
    try {
      const values = await form.validateFields();
      const adminid = localStorage.getItem("adminid"); // Retrieve adminid from localStorage

      // Validate rows
      const validRows = rows.filter(
        (row) =>
          row.category &&
          row.product &&
          row.in &&
          row.quantity &&
          row.quantity > 0 // Ensure quantity is greater than 0
      );

      if (validRows.length === 0) {
        message.error("Please fill in all required fields in the table.");
        return;
      }

      const leadPayload = {
        adminid, // Include adminid in the payload
        leaddate: values.leaddate?.toISOString(),
        customerid: values.customerid,
        sourceid: values.sourceid,
        items: validRows.map((row) => ({
          categoryid: row.category,
          productid: row.product,
          estimationin: row.in,
          quantity: row.quantity,
          narration: row.narration || "",
        })),
      };

      // Check if there are any changes
      if (isEditMode) {
        const originalPayload = location.state?.record;
        const isUnchanged =
          JSON.stringify(leadPayload) === JSON.stringify(originalPayload);

        if (isUnchanged) {
          message.info("No changes made.");
          return;
        }

        // Update existing lead
        await axios.put(`http://localhost:8081/lead/${location.state?.record?._id}`, leadPayload);
        message.success("Lead updated successfully!");
      } else {
        // Add new lead
        leadPayload.leadno = leadnoPreview; // Add lead number for new leads
        await axios.post("http://localhost:8081/lead", leadPayload);
        message.success("Lead added successfully!");
      }

      // Clear the form and rows
      form.resetFields();
      setRows([]);
      setLeadnoPreview(""); // Reset lead number

      // Redirect to LeadRecord page
      navigate("/lead/lead-record");
    } catch (err) {
      console.error("Error saving/updating lead:", err);
      message.error("Failed to save/update lead.");
    }
  };

  const handleCancel = () => {
    navigate("/lead/lead-record"); // Redirect to LeadRecord page
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text, record) => (
        <Select
          placeholder="Select Category"
          value={record.category}
          onChange={(value) => handleRowChange(record.key, "category", value)}
          options={categories.map((cat) => ({
            label: cat.name,
            value: cat._id,
          }))}
        />
      ),
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (text, record) => (
        <Select
          placeholder="Select Product"
          value={record.product}
          onChange={(value) => handleRowChange(record.key, "product", value)}
          options={products
            .filter((prod) => prod.categoryid === record.category)
            .map((prod) => ({
              label: prod.name,
              value: prod._id,
            }))}
        />
      ),
    },
    {
      title: "Unit",
      dataIndex: "in",
      key: "in",
      render: (text, record) => (
        <Select
          placeholder="Select Unit"
          value={record.in}
          onChange={(value) => handleRowChange(record.key, "in", value)}
          options={[
            { label: "Kg", value: "Kg" },
            { label: "Feet", value: "Feet" },
            { label: "No's", value: "No's" },
            { label: "Meter", value: "Meter" },
          ]}
        />
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => (
        <InputNumber
          placeholder="Quantity"
          value={record.quantity}
          onChange={(value) => handleRowChange(record.key, "quantity", value)}
          min={0}
        />
      ),
    },
    {
      title: "Narration",
      dataIndex: "narration",
      key: "narration",
      render: (text, record) => (
        <Input
          placeholder="Narration"
          value={record.narration}
          onChange={(e) => handleRowChange(record.key, "narration", e.target.value)}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this row?"
          onConfirm={() => removeRow(record.key)} // Call removeRow if confirmed
          okText="Yes"
          cancelText="No"
        >
          <Button
            danger
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>{isEditMode ? "Edit Lead" : "Add New Lead"}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">
                {isEditMode ? "Edit Lead" : "Add New Lead"}
              </li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="card p-3">
            <Form form={form} layout="vertical">
              <div className="row">
                <div className="col-md-3">
                  <Form.Item
                    name="leaddate"
                    label="Lead Date"
                    rules={[{ required: true }]}
                  >
                    <DatePicker className="w-100" format="DD-MM-YYYY" />
                  </Form.Item>
                </div>
                <div className="col-md-2">
                  <Form.Item label="Lead No">
                    <Input value={leadnoPreview} disabled />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item
                    name="customerid"
                    label="Customer"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Select Customer"
                      options={customers.map((c) => ({
                        label: c.name,
                        value: c._id,
                      }))}
                    />
                  </Form.Item>
                </div>
                <div className="col-md-3">
                  <Form.Item
                    name="sourceid"
                    label="Source"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Select Source"
                      options={source.map((s) => ({
                        label: s.name,
                        value: s._id,
                      }))}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="text-end">
                {/* <Button type="primary" onClick={handleSaveOrUpdate}>
                  {isEditMode ? "Update" : "Save"}
                </Button> */}
              </div>
            </Form>
          </div>

          <div className="card p-3 mt-3">
            <Table
              dataSource={rows}
              columns={columns}
              rowKey="key"
              pagination={false}
            />
            <div className="text-end mt-0">
              <Button
                type="default"
                icon={<PlusCircleOutlined />}
                onClick={addRow}
                size="small"
              >
                Add Row
              </Button>
              <br />
              <Button
                type="primary"
                style={{ marginTop: "8px", marginRight: "8px" }}
                onClick={handleSaveOrUpdate}
              >
                {isEditMode ? "Update" : "Save"}
              </Button>
              <Button
                type="default"
                danger
                style={{ marginTop: "8px" }}
                onClick={handleCancel}
              >
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
