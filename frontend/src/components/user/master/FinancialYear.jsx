import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, message, Table, Popconfirm, Form, DatePicker } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const FinancialYears = () => {
  const [form] = Form.useForm();
  const [financialYears, setFinancialYears] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [initialValues, setInitialValues] = useState(null);

  // Validator function
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

  useEffect(() => {
    fetchFinancialYears();
  }, []);

  const fetchFinancialYears = async () => {
    try {
      const response = await axios.get("http://localhost:8081/financialyear");
      setFinancialYears(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching financial years:", error);
      setFinancialYears([]);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Validate startDate and endDate using dayjs
      const startDate = dayjs(values.startDate);
      const endDate = dayjs(values.endDate);

      if (!startDate.isValid() || !endDate.isValid()) {
        messageApi.error("Invalid date format. Please select valid dates.");
        return;
      }

      if (endDate.isBefore(startDate)) {
        messageApi.error("End date must be after start date.");
        return;
      }

      if (editingId) {
        // Compare current form values with initial values
        const isChanged = Object.keys(values).some((key) => {
          const currentValue = values[key]?.toString().trim() || "";
          const initialValue = initialValues?.[key]?.toString().trim() || "";
          return currentValue !== initialValue;
        });

        if (!isChanged) {
          messageApi.info("No changes made. Update not required.");
          return;
        }

        // Proceed with the update if changes are detected
        await axios.put(`http://localhost:8081/financialyear/${editingId}`, {
          ...values,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
        messageApi.success("Financial year updated successfully!");
        setEditingId(null);
        setInitialValues(null);
      } else {
        await axios.post("http://localhost:8081/financialyear", {
          ...values,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
        messageApi.success("Financial year added successfully!");
      }

      fetchFinancialYears();
      form.resetFields();
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMsg =
        error.response?.data?.message || "An unexpected error occurred.";
      messageApi.error(errorMsg);
    }
  };

  const handleEdit = (record) => {
    const formattedRecord = {
      ...record,
      startDate: dayjs(record.startDate),
      endDate: dayjs(record.endDate),
    };
    form.setFieldsValue(formattedRecord);
    setEditingId(record._id);
    setInitialValues(formattedRecord); // Set initial values for comparison
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/financialyear/${id}`);
      messageApi.success("Financial year deleted successfully!");
      fetchFinancialYears();
    } catch (error) {
      messageApi.error("Failed to delete financial year!");
      console.error("Error deleting financial year:", error);
    }
  };

  const clearForm = () => {
    form.resetFields();
    setEditingId(null);
    setInitialValues(null);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name", align: "center" },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      align: "center",
      render: (text) => (text ? dayjs(text).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      align: "center",
      render: (text) => (text ? dayjs(text).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (text, record) => (
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
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                      getTimedValidator(
                        "name",
                        "Please enter financial year name!",
                        (value) => value.length >= 3
                      ),
                    ]}
                  >
                    <Input placeholder="Financial Year Name" />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="startDate"
                    label="Start Date"
                    rules={[
                      getTimedValidator("startDate", "Please select a start date!"),
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="endDate"
                    label="End Date"
                    rules={[
                      getTimedValidator("endDate", "Please select an end date!"),
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const startDate = getFieldValue("startDate");
                          if (!value || !startDate || dayjs(value).isAfter(dayjs(startDate))) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("End date must be after start date!")
                          );
                        },
                      }),
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                  </Form.Item>
                </div>
                <div className="col-lg-12 p-1">
                  <Button type="primary" onClick={handleSubmit}>
                    {editingId ? "Update" : "Save"}
                  </Button>
                  <Button
                    type="default"
                    onClick={clearForm}
                    style={{ marginLeft: "10px" }}
                  >
                    {editingId ? "Cancel" : "Clear"}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
          <div className="card p-3 custom-table">
            <Table
              columns={columns}
              dataSource={financialYears}
              rowKey="_id"
              pagination={{ pageSize: 5, showSizeChanger: false }}
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default FinancialYears;
