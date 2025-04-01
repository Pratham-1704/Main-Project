import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button, Input, Select, message, Table } from "antd";
import axios from "axios";

function Admin() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    mobileno: "",
    role: "",
    status: "",
  });

  const [admin, setAdmin] = useState([]); // State to store fetched clients
  const [messageApi, contextHolder] = message.useMessage(); // Initialize message API

  // Fetch admin from the backend
  const fetchAdmin = async () => {
    try {
      const response = await axios.get("http://localhost:8081/admin");
      const data = Array.isArray(response.data) ? response.data : []; // Ensure it's an array
      setAdmin(data);
    } catch (error) {
      console.error("Error fetching Admin:", error);
      setAdmin([]); // Fallback to empty array to avoid errors
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle select dropdown changes
  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Client-side validation
    if (!formData.name || !formData.username || !formData.password || !formData.mobileno || !formData.role || !formData.status) {
      messageApi.open({ type: "error", content: "All fields are required!" });
      return;
    }

    try {
      await axios.post("http://localhost:8081/admin", formData);
      messageApi.open({ type: "success", content: "Data saved successfully!" });
      fetchAdmin(); // Refresh table data after adding a client
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to save data!" });
      console.error(error);
    }
  };

  // Fetch clients on component mount
  useEffect(() => {
    fetchAdmin();
  }, []);

  // Table columns configuration
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Password", dataIndex: "password", key: "password" },
    { title: "Mobile No", dataIndex: "mobileno", key: "mobileno" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Admin Management</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to={"/"}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Admin</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <div className="row">
                  <div className="col-lg-6 p-1">
                    Name*
                    <Input
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Username*
                    <Input
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Password*
                    <Input
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Mobile No*
                    <Input
                      name="mobileno"
                      placeholder="Mobile No"
                      value={formData.mobileno}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Role*<br />
                    <Select
                      className="w-100"
                      showSearch
                      placeholder="Select Role"
                      optionFilterProp="label"
                      value={formData.role}
                      onChange={(value) => handleSelectChange("role", value)}
                      options={[
                        { value: "admin", label: "Admin" },
                        { value: "user", label: "User" },
                      ]}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Status*<br />
                    <Select
                      className="w-100"
                      showSearch
                      placeholder="Select Status"
                      optionFilterProp="label"
                      value={formData.status}
                      onChange={(value) => handleSelectChange("status", value)}
                      options={[
                        { value: "active", label: "Active" },
                        { value: "inactive", label: "Inactive" },
                      ]}
                    />
                  </div>
                  <div className="col-lg-12 p-1">
                    <Button type="primary" onClick={handleSubmit}>
                      Save
                    </Button>
                    <Button variant="solid" className="ms-1" color="danger">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <Table columns={columns} dataSource={admin} rowKey="_id" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Admin;a
