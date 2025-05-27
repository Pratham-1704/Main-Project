import React, { useEffect, useState } from "react";
import { Card, Descriptions, message } from "antd";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch admin details from localStorage
    const storedAdmin = {
      name: localStorage.getItem("name"),
      role: localStorage.getItem("role"),
      username: localStorage.getItem("username"),
      mobileno: localStorage.getItem("mobileno"),
      status: localStorage.getItem("status"),
    };

    if (storedAdmin.name && storedAdmin.role) {
      setAdmin(storedAdmin);
    } else {
      message.error("Failed to load admin details. Please log in again.");
    }
  }, []);

  return (
    <div className="container mt-4">
      <Card title="My Profile" bordered={false} style={{ maxWidth: "600px", margin: "0 auto" }}>
        {admin ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">{admin.name}</Descriptions.Item>
            <Descriptions.Item label="Username">{admin.username || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Mobile No">{admin.mobileno || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Role">{admin.role}</Descriptions.Item>
            <Descriptions.Item label="Status">{admin.status || "Active"}</Descriptions.Item>
          </Descriptions>
        ) : (
          <p>Loading admin details...</p>
        )}
      </Card>
    </div>
  );
};

export default AdminProfile;
