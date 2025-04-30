import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Input, message, Table, Popconfirm, Form } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const Parities = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [initialValues, setInitialValues] = useState(null);
  const [nextSerialNumber, setNextSerialNumber] = useState(1); // Default serial number for new entries

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch parities
      const res = await axios.get("http://localhost:8081/parity");
      const fetchedData = res.data.status === "success" ? res.data.data : [];
      console.log("Fetched Parities:", fetchedData); // Debugging: Log fetched parities

      // Fetch parity counts
      const countRes = await axios.get("http://localhost:8081/brandproduct/parity-counts");
      const parityCounts = countRes.data.status === "success" ? countRes.data.data : [];
      console.log("Fetched Parity Counts:", parityCounts); // Debugging: Log fetched counts

      // Map counts to parity names
      const parityCountMap = parityCounts.reduce((acc, item) => {
        acc[item._id] = item.count; // _id is the parity name
        return acc;
      }, {});
      console.log("Mapped Parity Counts:", parityCountMap); // Debugging: Log mapped counts

      // Sort by serial number or createdAt to maintain order
      const sortedData = fetchedData.sort((a, b) => a.srno - b.srno);

      // Reassign serial numbers and add counts
      const updatedData = sortedData.map((item, index) => ({
        ...item,
        srno: index + 1,
        count: parityCountMap[item.name] || 0, // Add count for each parity
      }));
      console.log("Updated Data with Counts:", updatedData); // Debugging: Log updated data

      setData(updatedData);
      setNextSerialNumber(updatedData.length + 1); // Set the next serial number
      form.setFieldsValue({ srno: updatedData.length + 1 }); // Set the default serial number in the form
    } catch (error) {
      console.error("Error fetching parities:", error);
      setData([]);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form Values:", values); // Debugging: Log form values

      if (editingId) {
        // Check if values are different from initial values
        const isChanged = Object.keys(values).some(
          (key) =>
            values[key]?.toString().trim() !==
            initialValues?.[key]?.toString().trim()
        );

        if (!isChanged) {
          messageApi.info("No changes made. Update not required.");
          return; // Exit without making an API call
        }

        // Update existing parity
        console.log("Updating parity with ID:", editingId); // Debugging
        const response = await axios.put(`http://localhost:8081/parity/${editingId}`, values);
        console.log("Update Response:", response.data); // Debugging: Log backend response
        messageApi.success("Parity updated successfully!");
        setEditingId(null);
        setInitialValues(null);
      } else {
        // Add new parity with the next serial number
        const newParity = { ...values, srno: nextSerialNumber };
        console.log("Adding new parity:", newParity); // Debugging
        await axios.post("http://localhost:8081/parity", newParity);
        messageApi.success("Parity added successfully!");
        setNextSerialNumber(nextSerialNumber + 1); // Increment for the next entry
      }

      fetchData();
      form.resetFields();
    } catch (error) {
      console.error("Error submitting form:", error);

      // Handle duplicate serial number error
      if (error.response?.status === 400 && error.response?.data?.message) {
        messageApi.error(error.response.data.message);
      } else {
        const errorMsg =
          error.response?.data?.message || "An error occurred while saving the parity!";
        messageApi.error(errorMsg);
      }
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue({ name: record.name, baserate: record.baserate });
    setEditingId(record._id);
    setInitialValues(record);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/parity/${id}`);
      messageApi.success("Parity deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting parity:", error);
      messageApi.error("Failed to delete parity!");
    }
  };

  const clearForm = () => {
    form.resetFields();
    setEditingId(null);
    setInitialValues(null);
    form.setFieldsValue({ srno: nextSerialNumber }); // Reset the serial number to the next value
  };

  const columns = [
    { title: "Serial No", dataIndex: "srno", key: "srno", align: "center" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Base Rate", dataIndex: "baserate", key: "baserate", align: "center" },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      align: "center",
      render: (_, record) => (
        <Link
          to="/master/manage-parity"
          state={{
            name: record.name, // Pass the parity name
            baseRate: record.baserate, // Pass the base rate
            parityId: record._id, // Pass the parity ID
          }}
        >
          <Button type="primary" size="small">
            Manage Parities - {record.count || 0} {/* Display the count */}
          </Button>
        </Link>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="action-button edit-button"
          />
          <Popconfirm
            title="Are you sure you want to delete this parity?"
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
          <h1>Parities</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Parities</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <div className="card p-3">
            <Form form={form} layout="vertical">
              <div className="row">
                {/* <div className="col-lg-6 p-1">
                  <Form.Item
                    name="srno"
                    label="Serial No"
                    rules={[
                      { required: true, message: "Please enter serial number!" },
                    ]}
                  >
                    <Input placeholder="Serial Number" disabled />
                  </Form.Item>
                </div> */}
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                      { required: true, message: "Please enter the name!" },
                    ]}
                  >
                    <Input placeholder="Enter Name" />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="baserate"
                    label="Base Rate"
                    rules={[
                      { required: true, message: "Please enter the base rate!" },
                    ]}
                  >
                    <Input placeholder="Enter Base Rate" />
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

export default Parities;