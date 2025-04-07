import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, message, Table, Select, DatePicker, Form, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import "../master/Css Files/style.css";

const Quotations = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sources, setSources] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    fetchData();
    fetchCustomers();
    fetchSources();
    fetchAdmins();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/quotation");
      setData(res.data.status === "success" ? res.data.data : []);
    } catch (error) {
      console.error("Error fetching quotations:", error);
      setData([]);
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

  const getTimedValidator = (field, message, extraCheck = null) => ({
    validator: async (_, value) => {
      if (!value || (extraCheck && !extraCheck(value))) {
        setTimeout(() => {
          form.setFields([{ name: field, errors: [] }]);
        }, 3000);
        return Promise.reject(new Error(message));
      }
      return Promise.resolve();
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Convert date fields to ISO string
      if (values.quotationdate) {
        values.quotationdate = values.quotationdate.toISOString();
      }

      if (editingId) {
        // Check if values are different from initialValues
        const isChanged = Object.keys(values).some(
          (key) => values[key]?.toString().trim() !== initialValues?.[key]?.toString().trim()
        );

        if (!isChanged) {
          messageApi.info("No changes made. Update not required.");
          return; // Exit the function if no changes are made
        }

        // Proceed with the update if changes are detected
        await axios.put(`http://localhost:8081/quotation/${editingId}`, values);
        messageApi.success("Quotation updated successfully!");
        setEditingId(null);
        setInitialValues(null);
      } else {
        // Add a new quotation
        await axios.post("http://localhost:8081/quotation", values);
        messageApi.success("Quotation added successfully!");
      }

      fetchData();
      form.resetFields();
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMsg =
        error.response?.data?.message || "Please fill the values correctly!";
      messageApi.error(errorMsg);
    }
  };

  const handleEdit = (record) => {
    // Convert date string to moment object for the form
    const formattedRecord = {
      ...record,
      quotationdate: record.quotationdate ? moment(record.quotationdate) : null
    };
    form.setFieldsValue(formattedRecord);
    setEditingId(record._id);
    setInitialValues(formattedRecord);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/quotation/${id}`);
      messageApi.success("Quotation deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting quotation:", error);
      messageApi.error("Failed to delete quotation!");
    }
  };

  const clearForm = () => {
    form.resetFields();
    setEditingId(null);
    setInitialValues(null);
  };

  const columns = [
    { title: "Quotation No", dataIndex: "quotationno", key: "quotationno" },
    { 
      title: "Quotation Date", 
      dataIndex: "quotationdate", 
      key: "quotationdate",
      render: (date) => date ? moment(date).format('YYYY-MM-DD') : '-'
    },
    { 
      title: "Customer", 
      dataIndex: ["customerid", "name"], 
      key: "customerid" 
    },
    { 
      title: "Source", 
      dataIndex: ["sourceid", "name"], 
      key: "sourceid" 
    },
    { title: "Total Weight", dataIndex: "totalweight", key: "totalweight" },
    { title: "Subtotal", dataIndex: "subtotal", key: "subtotal" },
    { title: "GST Amount", dataIndex: "gstamount", key: "gstamount" },
    { title: "Total", dataIndex: "total", key: "total" },
    { title: "Quotation Type", dataIndex: "quotationtype", key: "quotationtype" },
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
            title="Are you sure you want to delete this quotation?"
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
          <h1>Quotations</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active">Quotations</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <div className="card p-3" style={{ backgroundColor: "#f8f9fa" }}>
            <Form form={form} layout="vertical">
              <div className="row">
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="customerid"
                    label="Customer"
                    rules={[
                      getTimedValidator("customerid", "Please select a customer!"),
                    ]}
                  >
                    <Select
                      placeholder="Select Customer"
                      options={customers.map(customer => ({
                        value: customer._id,
                        label: customer.name,
                      }))}
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
                      placeholder="Select Source"
                      options={sources.map(source => ({
                        value: source._id,
                        label: source.name,
                      }))}
                    />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="adminid"
                    label="Admin"
                    rules={[
                      getTimedValidator("adminid", "Please select an admin!"),
                    ]}
                  >
                    <Select
                      placeholder="Select Admin"
                      options={admins.map(admin => ({
                        value: admin._id,
                        label: admin.name,
                      }))}
                    />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="quotationno"
                    label="Quotation No"
                    rules={[
                      getTimedValidator("quotationno", "Please enter quotation number!"),
                    ]}
                  >
                    <Input placeholder="Quotation No" />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="quotationdate"
                    label="Quotation Date"
                    rules={[
                      getTimedValidator("quotationdate", "Please select quotation date!"),
                    ]}
                  >
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="baddress"
                    label="Billing Address"
                    rules={[
                      getTimedValidator("baddress", "Please enter billing address!"),
                    ]}
                  >
                    <Input placeholder="Billing Address" />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="saddress"
                    label="Shipping Address"
                    rules={[
                      getTimedValidator("saddress", "Please enter shipping address!"),
                    ]}
                  >
                    <Input placeholder="Shipping Address" />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="totalweight"
                    label="Total Weight"
                    rules={[
                      getTimedValidator("totalweight", "Please enter total weight!"),
                    ]}
                  >
                    <Input placeholder="Total Weight" />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="subtotal"
                    label="Subtotal"
                    rules={[
                      getTimedValidator("subtotal", "Please enter subtotal!"),
                    ]}
                  >
                    <Input placeholder="Subtotal" />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="gstamount"
                    label="GST Amount"
                    rules={[
                      getTimedValidator("gstamount", "Please enter GST amount!"),
                    ]}
                  >
                    <Input placeholder="GST Amount" />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="total"
                    label="Total"
                    rules={[
                      getTimedValidator("total", "Please enter total!"),
                    ]}
                  >
                    <Input placeholder="Total" />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="quotationtype"
                    label="Quotation Type"
                    rules={[
                      getTimedValidator("quotationtype", "Please enter quotation type!"),
                    ]}
                  >
                    <Input placeholder="Quotation Type" />
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
              dataSource={data}
              rowKey="_id"
              pagination={{ pageSize: 5, showSizeChanger: false }}
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default Quotations;