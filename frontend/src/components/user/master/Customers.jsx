import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Input,
  message,
  Table,
  Form,
  Select,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "./Css Files/style.css";

const Customers = () => {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([]);
  const [firms, setFirms] = useState([]);
  const [states, setStates] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchCustomers();
    // fetchFirms();
    fetchStates();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:8081/customer");
      setCustomers(res.data.status === "success" ? res.data.data : []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // const fetchFirms = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:8081/firm");
  //     setFirms(res.data.status === "success" ? res.data.data : []);
  //   } catch (error) {
  //     console.error("Error fetching firms:", error);
  //   }
  // };

  const fetchStates = async () => {
    try {
      const res = await axios.get("http://localhost:8081/state");
      setStates(res.data.status === "success" ? res.data.data : []);
    } catch (error) {
      console.error("Error fetching states:", error);
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

      if (editingId) {
        const isChanged = Object.keys(values).some(
          (key) =>
            values[key]?.toString().trim() !==
            initialValues?.[key]?.toString().trim()
        );
        if (!isChanged) {
          messageApi.info("No changes made. Update not required.");
          return;
        }

        await axios.put(`http://localhost:8081/customer/${editingId}`, values);
        messageApi.success("Customer updated successfully!");
      } else {
        await axios.post("http://localhost:8081/customer", values);
        messageApi.success("Customer added successfully!");
      }

      fetchCustomers();
      clearForm();
    } catch (error) {
      console.error("Submit Error:", error);
      const errorMsg =
        error.response?.data?.message || "Please fill the values correctly!";
      messageApi.error(errorMsg);
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingId(record._id);
    setInitialValues(record);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/customer/${id}`);
      messageApi.success("Customer deleted successfully!");
      fetchCustomers();
    } catch (error) {
      console.error("Delete Error:", error);
      messageApi.error("Failed to delete customer!");
    }
  };

  const clearForm = () => {
    form.resetFields();
    setEditingId(null);
    setInitialValues(null);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    // { title: "Firm Name", dataIndex: "firmname", key: "firmname" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "State", dataIndex: "state", key: "state" },
    { title: "Mobile No", dataIndex: "mobileno1", key: "mobileno1" },
    // { title: "Mobile No.2", dataIndex: "mobileno2", key: "mobileno2" },
    { title: "Profession", dataIndex: "profession", key: "profession" },
    { title: "GST No", dataIndex: "gstno", key: "gstno" },
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
          />
          <Popconfirm
            title="Are you sure to delete this customer?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
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
          <h1>Customers</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="">Dashboard</Link></li>
              <li className="breadcrumb-item active">Customers</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="card p-3">
            <Form form={form} layout="vertical">
              <div className="row">
                {/* <div className="col-lg-6 "> */}
                  {/* <Form.Item
                    name="firmid"
                    label="Firm"
                    rules={[getTimedValidator("firmid", "Please select a firm!")]}
                  >
                    <Select
                      placeholder="Select Firm"
                      onChange={(value) => {
                        const selected = firms.find((f) => f._id === value);
                        form.setFieldsValue({
                          firmid: selected?._id,
                          firmname: selected?.name,
                        });
                      }}
                      disabled={!!editingId}
                    > */}
                      {/* {firms.map((firm) => (
                        <Select.Option key={firm._id} value={firm._id}>
                          {firm.name}
                        </Select.Option> */}
                      {/* ))}
                    </Select>
                  </Form.Item> */}
                {/* </div> */}

                <Form.Item name="firmname" hidden>
                  <Input />
                </Form.Item>

                {[
                  ["name", "Customer Name"],
                  ["address", "Address"],
                  ["city", "City"],
                  ["mobileno1", "Mobile No.1"],
                  ["mobileno2", "Mobile No.2"],
                  ["profession", "Profession"],
                  ["gstno", "GST No"],
                ].map(([key, label]) => (
                  <div className="col-lg-6 " key={key}>
                    <Form.Item
                      name={key}
                      label={label}
                      rules={[getTimedValidator(key, `Please enter ${label.toLowerCase()}!`)]}
                    >
                      <Input placeholder={label} />
                    </Form.Item>
                  </div>
                ))}

                <div className="col-lg-6 ">
                  <Form.Item
                    name="state"
                    label="State"
                    rules={[getTimedValidator("state", "Please select a state!")]}
                  >
                    <Select placeholder="Select State">
                      {states.map((state) => (
                        <Select.Option key={state._id} value={state.name}>
                          {state.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="col-lg-12 ">
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
              dataSource={customers}
              rowKey="_id"
              pagination={{ pageSize: 5, showSizeChanger: false }}
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default Customers;
