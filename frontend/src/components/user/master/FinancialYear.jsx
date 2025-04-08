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
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import "./Css Files/style.css";
import { Link } from "react-router-dom";

const FinancialYear = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/financialyear");
      setData(res.data.status === "success" ? res.data.data : []);
    } catch (err) {
      messageApi.error("Failed to fetch financial years.");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        startdate: values.startdate?.startOf("day").toISOString(),
        enddate: values.enddate?.endOf("day").toISOString(),
      };

      if (editingId) {
        await axios.put(`http://localhost:8081/financialyear/${editingId}`, payload);
        messageApi.success("Financial year updated successfully!");
        setEditingId(null);
      } else {
        await axios.post("http://localhost:8081/financialyear", payload);
        messageApi.success("Financial year added successfully!");
      }

      fetchData();
      form.resetFields();
    } catch (err) {
      messageApi.error(err.response?.data?.message || "Failed to save financial year.");
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      ...record,
      startdate: moment(record.startdate),
      enddate: moment(record.enddate),
    });
    setEditingId(record._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/financialyear/${id}`);
      messageApi.success("Financial year deleted successfully!");
      fetchData();
    } catch (err) {
      messageApi.error("Failed to delete financial year.");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Start Date",
      dataIndex: "startdate",
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "End Date",
      dataIndex: "enddate",
      render: (date) => moment(date).format("YYYY-MM-DD"),
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
            title="Are you sure to delete this financial year?"
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
                    rules={[{ required: true, message: "Please enter financial year name!" }]}
                  >
                    <Input placeholder="Financial Year Name" />
                  </Form.Item>
                </div>
                <div className="col-lg-4 p-1">
                  <Form.Item
                    name="startdate"
                    label="Start Date"
                    rules={[{ required: true, message: "Please select start date!" }]}
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
                      { required: true, message: "Please select end date!" },
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
                  <Button onClick={() => form.resetFields()} style={{ marginLeft: 10 }}>
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
