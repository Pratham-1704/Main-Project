import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, message, Table, Select, DatePicker } from "antd"; // Added DatePicker
import axios from "axios";
import "../master/Css Files/style.css"; // Import the custom CSS file
import moment from "moment"; // Import moment for date formatting
import { Input } from "antd"; // Import Input from antd

const { Option } = Select;

function Lead() {
  const [formData, setFormData] = useState({
    firmid: "",
    sourceid: "",
    customerid: "",
    adminid: "",
    leadno: "",
    leaddate: null, // Changed to null for DatePicker
    createdon: null, // Changed to null for DatePicker
  });

  const [leads, setLeads] = useState([]);
  const [firms, setFirms] = useState([]); // State for firms
  const [sources, setSources] = useState([]); // State for sources
  const [admins, setAdmins] = useState([]); // State for admins
  const [customers, setCustomers] = useState([]); // State for customers
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch leads from the backend
  const fetchLeads = async () => {
    try {
      const response = await axios.get("http://localhost:8081/lead");
      setLeads(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching leads:", error);
      setLeads([]);
    }
  };

  // Fetch firms, sources, admins, and customers for dropdowns
  const fetchDropdownData = async () => {
    try {
      const [firmsResponse, sourcesResponse, adminsResponse, customersResponse] = await Promise.all([
        axios.get("http://localhost:8081/firm"),
        axios.get("http://localhost:8081/source"),
        axios.get("http://localhost:8081/admin"),
        axios.get("http://localhost:8081/customer"),
      ]);
      setFirms(firmsResponse.data.data || []);
      setSources(sourcesResponse.data.data || []);
      setAdmins(adminsResponse.data.data || []);
      setCustomers(customersResponse.data.data || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle dropdown changes
  const handleDropdownChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle date changes
  const handleDateChange = (name, date, dateString) => {
    setFormData({ ...formData, [name]: dateString });
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.firmid ||
      !formData.sourceid ||
      !formData.customerid ||
      !formData.adminid ||
      !formData.leadno ||
      !formData.leaddate ||
      !formData.createdon
    ) {
      messageApi.open({ type: "error", content: "All fields are required!" });
      return;
    }

    try {
      console.log("Submitting formData:", formData); // Debugging: Log formData
      const response = await axios.post("http://localhost:8081/lead", formData);
      console.log("Save response:", response); // Debugging: Log response

      if (response.data.status === "success") {
        messageApi.open({ type: "success", content: "Lead saved successfully!" });
        fetchLeads(); // Refresh the leads table
        clearForm(); // Clear the form
      } else {
        messageApi.open({ type: "error", content: response.data.message || "Failed to save lead!" });
      }
    } catch (error) {
      console.error("Error saving lead:", error); // Debugging: Log error
      messageApi.open({ type: "error", content: "Failed to save lead!" });
    }
  };

  // Handle update
  const handleUpdate = async () => {
    if (!formData._id) {
      messageApi.open({ type: "error", content: "Select a lead to update!" });
      return;
    }
    try {
      await axios.put(`http://localhost:8081/lead/${formData._id}`, formData);
      messageApi.open({ type: "success", content: "Lead updated successfully!" });
      fetchLeads();
      clearForm();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to update lead!" });
      console.error("Error:", error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!formData._id) {
      messageApi.open({ type: "error", content: "Select a lead to delete!" });
      return;
    }
    try {
      await axios.delete(`http://localhost:8081/lead/${formData._id}`);
      messageApi.open({ type: "success", content: "Lead deleted successfully!" });
      fetchLeads();
      clearForm();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to delete lead!" });
      console.error("Error:", error);
    }
  };

  // Clear form
  const clearForm = () => {
    setFormData({
      firmid: "",
      sourceid: "",
      customerid: "",
      adminid: "",
      leadno: "",
      leaddate: null,
      createdon: null,
    });
  };

  useEffect(() => {
    fetchLeads();
    fetchDropdownData(); // Fetch dropdown data on component mount
  }, []);

  // Table columns configuration
  const columns = [
    { title: "Firm ID", dataIndex: "firmid", key: "firmid" },
    { title: "Source ID", dataIndex: "sourceid", key: "sourceid" },
    { title: "Customer ID", dataIndex: "customerid", key: "customerid" },
    { title: "Admin ID", dataIndex: "adminid", key: "adminid" },
    { title: "Lead No", dataIndex: "leadno", key: "leadno" },
    { title: "Lead Date", dataIndex: "leaddate", key: "leaddate" },
    { title: "Created On", dataIndex: "createdon", key: "createdon" },
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
                <Link to={"/"}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Leads</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <div className="row">
                  <div className="col-lg-6 p-1">
                    Firm ID*
                    <Select
                      placeholder="Select Firm"
                      value={formData.firmid}
                      onChange={(value) => handleDropdownChange("firmid", value)}
                      style={{ width: "100%" }}
                    >
                      {firms.map((firm) => (
                        <Option key={firm.id} value={firm.id}>
                          {firm.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="col-lg-6 p-1">
                    Source ID*
                    <Select
                      placeholder="Select Source"
                      value={formData.sourceid}
                      onChange={(value) => handleDropdownChange("sourceid", value)}
                      style={{ width: "100%" }}
                    >
                      {sources.map((source) => (
                        <Option key={source.id} value={source.id}>
                          {source.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="col-lg-6 p-1">
                    Customer ID*
                    <Select
                      placeholder="Select Customer"
                      value={formData.customerid}
                      onChange={(value) => handleDropdownChange("customerid", value)}
                      style={{ width: "100%" }}
                    >
                      {customers.map((customer) => (
                        <Option key={customer.id} value={customer.id}>
                          {customer.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="col-lg-6 p-1">
                    Admin ID*
                    <Select
                      placeholder="Select Admin"
                      value={formData.adminid}
                      onChange={(value) => handleDropdownChange("adminid", value)}
                      style={{ width: "100%" }}
                    >
                      {admins.map((admin) => (
                        <Option key={admin.id} value={admin.id}>
                          {admin.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="col-lg-6 p-1">
                    Lead No*
                    <Input
                      name="leadno"
                      placeholder="Lead No"
                      value={formData.leadno}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Lead Date*
                    <DatePicker
                      style={{ width: "100%" }}
                      value={formData.leaddate ? moment(formData.leaddate) : null}
                      onChange={(date, dateString) => handleDateChange("leaddate", date, dateString)}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Created On*
                    <DatePicker
                      style={{ width: "100%" }}
                      value={formData.createdon ? moment(formData.createdon) : null}
                      onChange={(date, dateString) => handleDateChange("createdon", date, dateString)}
                    />
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
                      type="default"
                      onClick={handleUpdate}
                      style={{ marginRight: "10px" }}
                    >
                      Update
                    </Button>
                    <Button
                      type="danger"
                      onClick={handleDelete}
                      style={{ marginRight: "10px" }}
                    >
                      Delete
                    </Button>
                    <Button
                      type="default"
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
                  dataSource={leads}
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

export default Lead;