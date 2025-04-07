import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, message, Table, Select, DatePicker, Popconfirm, Form } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "../master/Css Files/style.css";
import moment from "moment";

const Lead = () => {
  const [form] = Form.useForm();
  const [leads, setLeads] = useState([]);
  const [sources, setSources] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    fetchLeads();
    fetchDropdownData();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get("http://localhost:8081/lead");
      setLeads(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching leads:", error);
      setLeads([]);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [sourcesResponse, adminsResponse, customersResponse] = await Promise.all([
        axios.get("http://localhost:8081/source"),
        axios.get("http://localhost:8081/admin"),
        axios.get("http://localhost:8081/customer"),
      ]);
      setSources(sourcesResponse.data.data || []);
      setAdmins(adminsResponse.data.data || []);
      setCustomers(customersResponse.data.data || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingId) {
        const isChanged = Object.keys(values).some(
          (key) => values[key]?.toString().trim() !== initialValues?.[key]?.toString().trim()
        );

        if (!isChanged) {
          messageApi.info("No changes made. Update not required.");
          return;
        }

        await axios.put(`http://localhost:8081/lead/${editingId}`, values);
        messageApi.success("Lead updated successfully!");
        setEditingId(null);
        setInitialValues(null);
      } else {
        await axios.post("http://localhost:8081/lead", values);
        messageApi.success("Lead added successfully!");
      }

      fetchLeads();
      form.resetFields();
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMsg = error.response?.data?.message || "Please fill the values correctly!";
      messageApi.error(errorMsg);
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      ...record,
      leaddate: record.leaddate ? moment(record.leaddate) : null,
      createdon: record.createdon ? moment(record.createdon) : null,
    });
    setEditingId(record._id);
    setInitialValues(record);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/lead/${id}`);
      messageApi.success("Lead deleted successfully!");
      fetchLeads();
    } catch (error) {
      console.error("Error deleting lead:", error);
      messageApi.error("Failed to delete lead!");
    }
  };

  const clearForm = () => {
    form.resetFields();
    setEditingId(null);
    setInitialValues(null);
  };

  const columns = [
    { title: "Source", dataIndex: "sourceid", key: "sourceid" },
    { title: "Customer", dataIndex: "customerid", key: "customerid" },
    { title: "Admin", dataIndex: "adminid", key: "adminid" },
    { title: "Lead No", dataIndex: "leadno", key: "leadno" },
    { title: "Lead Date", dataIndex: "leaddate", key: "leaddate" },
    { title: "Created On", dataIndex: "createdon", key: "createdon" },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="action-button edit-button"
          />
          <Popconfirm
            title="Are you sure you want to delete this lead?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              icon={<DeleteOutlined />}
              danger
              className="action-button delete-button"
            />
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
            <Form form={form} layout="vertical">
              <div className="row">
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="sourceid"
                    label="Source"
                    rules={[{ required: true, message: "Please select a source!" }]}
                  >
                    <Select
                      placeholder="Select Source"
                      options={sources.map((source) => ({
                        value: source.id,
                        label: source.name,
                      }))}
                    />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="customerid"
                    label="Customer"
                    rules={[{ required: true, message: "Please select a customer!" }]}
                  >
                    <Select
                      placeholder="Select Customer"
                      options={customers.map((customer) => ({
                        value: customer.id,
                        label: customer.name,
                      }))}
                    />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="adminid"
                    label="Admin"
                    rules={[{ required: true, message: "Please select an admin!" }]}
                  >
                    <Select
                      placeholder="Select Admin"
                      options={admins.map((admin) => ({
                        value: admin.id,
                        label: admin.name,
                      }))}
                    />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="leadno"
                    label="Lead No"
                    rules={[{ required: true, message: "Please enter the lead number!" }]}
                  >
                    <Input placeholder="Lead No" />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="leaddate"
                    label="Lead Date"
                    rules={[{ required: true, message: "Please select a lead date!" }]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="createdon"
                    label="Created On"
                    rules={[{ required: true, message: "Please select a creation date!" }]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </div>
                <div className="col-lg-12 p-1">
                  <Button type="primary" onClick={handleSubmit}>
                    {editingId ? "Update" : "Save"}
                  </Button>
                  <Button type="default" onClick={clearForm} style={{ marginLeft: "10px" }}>
                    {editingId ? "Cancel" : "Clear"}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
          <div className="card p-3 custom-table">
            <Table
              columns={columns}
              dataSource={leads}
              rowKey="_id"
              pagination={{ pageSize: 5, showSizeChanger: false }}
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default Lead;