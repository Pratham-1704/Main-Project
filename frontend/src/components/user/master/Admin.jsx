import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Select, message, Table } from "antd";
import axios from "axios";
import "./Css Files/style.css"; // Import your custom styles

function Admin() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    mobileno: "",
    role: "",
    status: "",
  });

  const [adminList, setAdminList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch admins from the backend
  const fetchAdmins = async () => {
    try {
      const response = await axios.get("http://localhost:8081/admin");
      setAdminList(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setAdminList([]);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (Object.values(formData).some((field) => !field.trim())) {
      messageApi.error("All fields are required!");
      return;
    }

    try {
      await axios.post("http://localhost:8081/admin", formData);
      messageApi.success("Admin added successfully!");
      setFormData({
        name: "",
        username: "",
        password: "",
        mobileno: "",
        role: "",
        status: "",
      }); // Reset form after successful submission
      fetchAdmins(); // Refresh the admin list
    } catch (error) {
      messageApi.error("Failed to add admin!");
      console.error("Error:", error);
    }
  };

  // Handle update
  const handleUpdate = async () => {
    if (Object.values(formData).some((field) => !field.trim())) {
      messageApi.error("All fields are required!");
      return;
    }

    try {
      await axios.put(`http://localhost:8081/admin/${formData._id}`, formData);
      messageApi.success("Admin updated successfully!");
      setFormData({
        name: "",
        username: "",
        password: "",
        mobileno: "",
        role: "",
        status: "",
      }); // Reset form after successful submission
      fetchAdmins(); // Refresh the admin list
    } catch (error) {
      messageApi.error("Failed to update admin!");
      console.error("Error:", error);
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!formData._id) {
      messageApi.error("Select an admin to delete!");
      return;
    }

    try {
      await axios.delete(`http://localhost:8081/admin/${formData._id}`);
      messageApi.success("Admin deleted successfully!");
      setFormData({
        name: "",
        username: "",
        password: "",
        mobileno: "",
        role: "",
        status: "",
      }); // Reset form after successful submission
      fetchAdmins(); // Refresh the admin list
    } catch (error) {
      messageApi.error("Failed to delete admin!");
      console.error("Error:", error);
    }
  }
  

  // Clear form
  const clearForm = () => {
    setFormData({
      name: "",
      username: "",
      password: "",
      mobileno: "",
      role: "",
      status: "",
    });
  }
  // Table columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Username", dataIndex: "username", key: "username" },
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
                  {["name", "username", "password", "mobileno"].map((field) => (
                    <div className="col-lg-6 p-1" key={field}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}*
                      <Input
                        name={field}
                        placeholder={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                      />
                    </div>
                  ))}
                  <div className="col-lg-6 p-1">
                    Role*<br />
                    <Select
                      className="w-100"
                      placeholder="Select Role"
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
                      placeholder="Select Status"
                      value={formData.status}
                      onChange={(value) => handleSelectChange("status", value)}
                      options={[
                        { value: "active", label: "Active" },
                        { value: "inactive", label: "Inactive" },
                      ]}
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
                      variant="solid"
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
                <Table className="custom-table" columns={columns} dataSource={adminList} rowKey="_id" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Admin;