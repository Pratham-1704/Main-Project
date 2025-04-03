import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, message, Table, Select } from "antd";
import axios from "axios";
import "./Css Files/style.css";

function Customers() {
  const [formData, setFormData] = useState({
    firmid: "",
    name: "",
    firmname: "",
    address: "",
    city: "",
    state: "",
    mobileno1: "",
    mobileno2: "",
    profession: "",
    gstno: "",
  });

  const [customers, setCustomers] = useState([]);
  const [firms, setFirms] = useState([]);
  const [states, setStates] = useState([]); // State to store the list of states
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch customers from the backend
  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8081/customer");
      setCustomers(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    }
  };

  // Fetch firms from the backend
  const fetchFirms = async () => {
    try {
      const response = await axios.get("http://localhost:8081/firm");
      setFirms(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching firms:", error);
    }
  };

  // Fetch states from the backend
  const fetchStates = async () => {
    try {
      const response = await axios.get("http://localhost:8081/state");
      setStates(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchFirms();
    fetchStates(); // Fetch states when the component is mounted
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFirmChange = (value) => {
    const selectedFirm = firms.find((firm) => firm._id === value);
    setFormData({
      ...formData,
      firmid: selectedFirm ? selectedFirm._id : "",
      firmname: selectedFirm ? selectedFirm.name : "",
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8081/customer", formData);
      messageApi.open({ type: "success", content: "Customer saved successfully!" });
      fetchCustomers();
      clearForm();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to save customer!" });
      console.error("Error:", error);
    }
  };

  const handleUpdate = async () => {
    if (!formData._id) {
      messageApi.open({ type: "error", content: "Select a customer to update!" });
      return;
    }
    try {
      await axios.put(`http://localhost:8081/customer/${formData._id}`, formData);
      messageApi.open({ type: "success", content: "Customer updated successfully!" });
      fetchCustomers();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to update customer!" });
      console.error("Error:", error);
    }
  };

  const handleDelete = async () => {
    if (!formData._id) {
      messageApi.open({ type: "error", content: "Select a customer to delete!" });
      return;
    }
    try {
      await axios.delete(`http://localhost:8081/customer/${formData._id}`);
      messageApi.open({ type: "success", content: "Customer deleted successfully!" });
      fetchCustomers();
      clearForm();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to delete customer!" });
      console.error("Error:", error);
    }
  };

  const clearForm = () => {
    setFormData({
      firmid: "",
      name: "",
      firmname: "",
      address: "",
      city: "",
      state: "",
      mobileno1: "",
      mobileno2: "",
      profession: "",
      gstno: "",
    });
  };

  const columns = [
    // { title: "Firm ID", dataIndex: "firmid", key: "firmid" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Firm Name", dataIndex: "firmname", key: "firmname" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "State", dataIndex: "state", key: "state" },
    { title: "Mobile No.1", dataIndex: "mobileno1", key: "mobileno1" },
    { title: "Mobile No.2", dataIndex: "mobileno2", key: "mobileno2" },
    { title: "Profession", dataIndex: "profession", key: "profession" },
    { title: "GST No", dataIndex: "gstno", key: "gstno" },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Customer Management</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to={"/"}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Customers</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <div className="row">
                  <div className="col-lg-6 p-1">
                    Firm Name*
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select Firm Name"
                      value={formData.firmid}
                      onChange={handleFirmChange}
                    >
                      {firms.map((firm) => (
                        <Select.Option key={firm._id} value={firm._id}>
                          {firm.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  {Object.keys(formData)
                    .filter((key) => key !== "firmid" && key !== "firmname" && key !== "_id" && key !== "state") // Exclude _id, firmid, firmname, and state
                    .map((key) => (
                      <div className="col-lg-6 p-1" key={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}*
                        <Input
                          name={key}
                          placeholder={key}
                          value={formData[key]}
                          onChange={handleInputChange}
                        />
                      </div>
                    ))}
                  <div className="col-lg-6 p-1">
                    State*
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select State"
                      value={formData.state}
                      onChange={(value) => setFormData({ ...formData, state: value })}
                    >
                      {states.map((state) => (
                        <Select.Option key={state._id} value={state.name}>
                          {state.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  <div className="col-lg-12 p-1">
                    <Button
                      type="primary"
                      onClick={handleSubmit}
                      style={{ marginRight: "10px" }}
                    >
                      Save
                    </Button>
                    <Button
                    color="green" variant="solid"
                      onClick={handleUpdate}
                      style={{ marginRight: "10px" }}
                    >
                      Update
                    </Button>
                    <Button
                      color="danger" variant="solid"
                      onClick={handleDelete}
                      style={{ marginRight: "10px" }}
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={clearForm}
                      style={{ marginRight: "10px" }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <Table
                  className="custom-table"
                  columns={columns}
                  dataSource={customers}
                  rowKey="_id"
                  onRow={(record) => ({
                    onClick: () => {
                      setFormData(record); // Populate form with selected row data
                    },
                  })}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Customers;
