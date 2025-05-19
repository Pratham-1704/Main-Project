import React, { useEffect, useState } from "react";
import { Card, Descriptions, Spin, message, Avatar } from "antd";
import axios from "axios";

const CURRENT_ADMIN_ID = localStorage.getItem("adminid"); // Adjust as per your auth logic

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!CURRENT_ADMIN_ID) {
      setLoading(false);
      setAdmin(null);
      return;
    }
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/admin/${CURRENT_ADMIN_ID}`);
        setAdmin(res.data.data);
      } catch (err) {
        messageApi.error("Failed to fetch admin profile!");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  if (loading) {
    return <Spin tip="Loading..." style={{ marginTop: 100 }} />;
  }

  if (!CURRENT_ADMIN_ID) {
    return <div style={{ padding: 40, textAlign: "center" }}>No admin ID found. Please log in.</div>;
  }

  if (!admin) {
    return <div style={{ padding: 40, textAlign: "center" }}>No profile data found.</div>;
  }

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Admin Profile</h1>
        </div>
        <section className="section">
          <Card title="Profile Information" style={{ maxWidth: 600, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Avatar
                size={96}
                src={admin.profilePic ? `http://localhost:8081${admin.profilePic}` : undefined}
                style={{ backgroundColor: "#87d068" }}
              >
                {admin.name ? admin.name[0] : ""}
              </Avatar>
            </div>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Name">{admin.name}</Descriptions.Item>
              <Descriptions.Item label="Username">{admin.username}</Descriptions.Item>
              <Descriptions.Item label="Mobile No">{admin.mobileno}</Descriptions.Item>
              <Descriptions.Item label="Role">{admin.role}</Descriptions.Item>
              <Descriptions.Item label="Status">{admin.status}</Descriptions.Item>
            </Descriptions>
          </Card>
        </section>
      </main>
    </>
  );
};

export default AdminProfile;