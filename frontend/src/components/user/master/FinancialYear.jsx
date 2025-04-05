import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Table,
  Popconfirm,
  message,
} from "antd";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import "./Css Files/style.css";

const FinancialYear = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/financialyear");
      setData(res.data.status === "success" ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching financial years:", err);
      messageApi.error("Failed to fetch financial years.");
    }
  };

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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        ...values,
        startdate: values.startdate?.toISOString(),
        enddate: values.enddate?.toISOString(),
      };

      if (editingId) {
        const isChanged = Object.keys(payload).some((key) => {
          const current = payload[key]?.toString().trim();
          const original = initialValues?.[key]?.toString().trim();
          return current !== original;
        });

        if (!isChanged) {
          messageApi.info("No changes made. Update not required.");
          return;
        }

        await axios.put(`http://localhost:8081/financialyear/${editingId}`, payload);
        messageApi.success("Financial year updated successfully!");
        setEditingId(null);
        setInitialValues(null);
      } else {
        await axios.post("http://localhost:8081/financialyear", payload);
        messageApi.success("Financial year added successfully!");
      }

      fetchData();
      form.resetFields();
    } catch (error) {
      console.error("Error submitting form:", error);
      const msg = error.response?.data?.message || "Please fill the values correctly!";
      messageApi.error(msg);
    }
  };

  const handleEdit = (record) => {
    const formatted = {
      ...record,
      startdate: moment(record.startdate),
      enddate: moment(record.enddate),
    };

    form.setFieldsValue(formatted);
    setEditingId(record._id);
    setInitialValues({ ...record });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/financialyear/${id}`);
      messageApi.success("Deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      messageApi.error("Failed to delete!");
    }
  };

  const clearForm = () => {
    form.resetFields();
    setEditingId(null);
    setInitialValues(null);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Start Date",
      dataIndex: "startdate",
      key: "startdate",
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "End Date",
      dataIndex: "enddate",
      key: "enddate",
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
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
            title="Are you sure you want to delete this financial year?"
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
          <h1>Financial Years</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Financial Years</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="card p-3" style={{ backgroundColor: "#f8f9fa" }}>
            <Form form={form} layout="vertical">
              <div className="row">
                <div className="col-lg-4 p-1">
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                      getTimedValidator("name", "Please enter financial year name!"),
                      getTimedValidator("name", "Name must be at least 2 characters!", (val) => val.length >= 2),
                    ]}
                  >
                    <Input placeholder="Financial Year Name" />
                  </Form.Item>
                </div>
                <div className="col-lg-4 p-1">
                  <Form.Item
                    name="startdate"
                    label="Start Date"
                    rules={[getTimedValidator("startdate", "Please select start date!")]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </div>
                <div className="col-lg-4 p-1">
                  <Form.Item
                    name="enddate"
                    label="End Date"
                    dependencies={["startdate"]}
                    rules={[
                      getTimedValidator("enddate", "Please select end date!"),
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const start = getFieldValue("startdate");
                          if (!value || !start || value.isAfter(start)) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("End date must be after start date!"));
                        },
                      }),
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>

                </div>
                <div className="col-lg-12 p-1">
                  <Button type="primary" onClick={handleSubmit}>
                    {editingId ? "Update" : "Save"}
                  </Button>
                  <Button onClick={clearForm} style={{ marginLeft: 10 }}>
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

export default FinancialYear;
