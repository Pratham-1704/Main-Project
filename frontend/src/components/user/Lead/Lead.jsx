import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Table,
  message,
  Popconfirm,
  DatePicker,
} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const Leads = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sources, setSources] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [leadnoPreview, setLeadnoPreview] = useState(""); // For showing the next lead number
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    fetchCustomers();
    fetchSources();
    fetchAdmins();
    generateNextLeadNo(); // Generate the next lead number on load
  }, []);

  // Fetch leads data
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/lead");
      setData(res.data.status === "success" ? res.data.data : []);
    } catch (err) {
      messageApi.error("Failed to load leads.");
    }
  };

  // Fetch customers data
  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:8081/customer");
      setCustomers(res.data.status === "success" ? res.data.data : []);
    } catch (err) {
      messageApi.error("Failed to load customers.");
    }
  };

  // Fetch sources data
  const fetchSources = async () => {
    try {
      const res = await axios.get("http://localhost:8081/source");
      setSources(res.data.status === "success" ? res.data.data : []);
    } catch (err) {
      messageApi.error("Failed to load sources.");
    }
  };

  // Fetch admins data
  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:8081/admin");
      setAdmins(res.data.status === "success" ? res.data.data : []);
    } catch (err) {
      messageApi.error("Failed to load admins.");
    }
  };

  // Generate the next lead number
  const generateNextLeadNo = async () => {
    const today = new Date();
    const datePart = today.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const prefix = `LD${datePart}`;

    try {
      const res = await axios.get("http://localhost:8081/lead");
      const leads = res.data.status === "success" ? res.data.data : [];

      // Filter today's leads
      const todayLeads = leads.filter((lead) =>
        lead.leadno.startsWith(prefix)
      );

      // Extract numbers and find the highest
      const maxNumber = todayLeads.reduce((max, lead) => {
        const numPart = parseInt(lead.leadno.split("-")[1], 10);
        return numPart > max ? numPart : max;
      }, 0);

      // Generate next number, padded to 3 digits
      const nextNumber = String(maxNumber + 1).padStart(3, "0");
      const nextLeadNo = `${prefix}-${nextNumber}`;

      setLeadnoPreview(nextLeadNo); // Update the preview
      return nextLeadNo;
    } catch (error) {
      console.error("Error generating lead number:", error);
      messageApi.error("Failed to generate lead number.");
      const fallbackLeadNo = `${prefix}-001`;
      setLeadnoPreview(fallbackLeadNo); // Fallback preview
      return fallbackLeadNo;
    }
  };

  // Validator for form fields
  const getTimedValidator = (field, msg, extraCheck = null) => ({
    validator: async (_, value) => {
      if (!value || (extraCheck && !extraCheck(value))) {
        setTimeout(() => {
          form.setFields([{ name: field, errors: [] }]);
        }, 3000);
        return Promise.reject(new Error(msg));
      }
      return Promise.resolve();
    },
  });

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        leaddate: values.leaddate.format("YYYY-MM-DD"),
        createdon: values.createdon.format("YYYY-MM-DD"),
      };

      if (editingId) {
        const isChanged = Object.keys(payload).some(
          (key) =>
            payload[key] !==
            (initialValues?.[key]?.format
              ? initialValues[key].format("YYYY-MM-DD")
              : initialValues?.[key])
        );
        if (!isChanged) {
          messageApi.info("No changes made.");
          return;
        }

        await axios.put(`http://localhost:8081/lead/${editingId}`, payload);
        messageApi.success("Lead updated successfully!");
        setEditingId(null);
        setInitialValues(null);
      } else {
        // Generate lead number for new leads
        payload.leadno = await generateNextLeadNo();
        await axios.post("http://localhost:8081/lead", payload);
        messageApi.success("Lead added successfully!");
      }

      form.resetFields();
      fetchData();
      generateNextLeadNo(); // Generate the next lead number for the next entry
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Please fill all required fields.";
      messageApi.error(errorMsg);
    }
  };

  // Handle edit action
  const handleEdit = (record) => {
    form.setFieldsValue({
      ...record,
      leaddate: dayjs(record.leaddate),
      createdon: dayjs(record.createdon),
    });
    setEditingId(record._id);
    setInitialValues({
      ...record,
      leaddate: dayjs(record.leaddate),
      createdon: dayjs(record.createdon),
    });
  };

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/lead/${id}`);
      messageApi.success("Lead deleted successfully!");
      fetchData();
      generateNextLeadNo(); // Update lead number preview after deletion
    } catch (err) {
      messageApi.error("Failed to delete lead.");
    }
  };

  // Clear form fields
  const clearForm = () => {
    form.resetFields();
    setEditingId(null);
    setInitialValues(null);
    generateNextLeadNo(); // Reset lead number preview
  };

  // Table columns
  const columns = [
    {
      title: "Lead No",
      dataIndex: "leadno",
    },
    {
      title: "Customer",
      dataIndex: "customerid",
      render: (id) =>
        customers.find((c) => c._id === id)?.name || "Unknown",
    },
    {
      title: "Source",
      dataIndex: "sourceid",
      render: (id) =>
        sources.find((s) => s._id === id)?.name || "Unknown",
    },
    {
      title: "Lead Date",
      dataIndex: "leaddate",
    },
    {
      title: "Created On",
      dataIndex: "createdon",
    },
    {
      title: "Admin",
      dataIndex: "adminid",
      render: (id) =>
        admins.find((a) => a._id === id)?.name || "Unknown",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this lead?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
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
          <h1>Leads</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Leads</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="card p-3" style={{ backgroundColor: "#f8f9fa" }}>
            <Form layout="vertical" form={form}>
              <div className="row">
                <div className="col-lg-6 p-1">
                  <Form.Item label="Lead No">
                    <Input value={leadnoPreview} disabled />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="customerid"
                    label="Customer"
                    rules={[
                      getTimedValidator("customerid", "Please select a customer!"),
                    ]}
                  >
                    <Select
                      options={customers.map((c) => ({
                        label: c.name,
                        value: c._id,
                      }))}
                      placeholder="Select Customer"
                    />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="sourceid"
                    label="Source"
                    rules={[
                      getTimedValidator("sourceid", "Please select a source!"),
                    ]}
                  >
                    <Select
                      options={sources.map((s) => ({
                        label: s.name,
                        value: s._id,
                      }))}
                      placeholder="Select Source"
                    />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="leaddate"
                    label="Lead Date"
                    rules={[getTimedValidator("leaddate", "Select a lead date!")]}
                  >
                    <DatePicker format="YYYY-MM-DD" className="w-100" />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="createdon"
                    label="Created On"
                    rules={[
                      getTimedValidator("createdon", "Select created on date!"),
                    ]}
                  >
                    <DatePicker format="YYYY-MM-DD" className="w-100" />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="adminid"
                    label="Admin"
                    rules={[getTimedValidator("adminid", "Please select an admin!")]}
                  >
                    <Select
                      options={admins.map((a) => ({
                        label: a.name,
                        value: a._id,
                      }))}
                      placeholder="Select Admin"
                    />
                  </Form.Item>
                </div>

                <div className="col-lg-12 p-1">
                  <Button type="primary" onClick={handleSubmit}>
                    {editingId ? "Update" : "Save"}
                  </Button>
                  <Button onClick={clearForm} className="ms-2">
                    {editingId ? "Cancel" : "Clear"}
                  </Button>
                </div>
              </div>
            </Form>
          </div>

          <div className="card p-3 custom-table">
            <Table
              dataSource={data}
              columns={columns}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default Leads;
