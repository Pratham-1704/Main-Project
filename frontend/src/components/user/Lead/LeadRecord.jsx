import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Table,
  Popconfirm,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";

const LeadRecord = () => {
  const [customers, setCustomers] = useState([]);
  const [source, setSources] = useState([]);
  const [leadRecords, setLeadRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitials();
    fetchLeadRecords();
  }, []);

  const fetchInitials = async () => {
    try {
      const [cust, src] = await Promise.all([
        axios.get("http://localhost:8081/customer"),
        axios.get("http://localhost:8081/source"),
      ]);
      setCustomers(cust.data.data || []);
      setSources(src.data.data || []);
    } catch (err) {
      messageApi.error("Failed to load initial data");
    }
  };

  const fetchLeadRecords = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8081/lead");
      setLeadRecords(res.data.data || []);
    } catch (err) {
      messageApi.error("Failed to fetch lead records");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (record) => {
    navigate("/lead/new-lead", { state: { record } });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/lead/${id}`);
      messageApi.success("Lead deleted successfully");
      fetchLeadRecords();
    } catch (err) {
      messageApi.error("Failed to delete lead");
    }
  };

  const leadColumns = [
    {
      title: "Sr No",
      key: "srno",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Lead No",
      dataIndex: "leadno",
      key: "leadno",
      render: (_, record) => (
        <Link
          to={`/lead/lead-details/${record._id}`}
          onClick={() => localStorage.setItem("selectedLeadId", record._id)}
          style={{
            color: "blue",
            textDecoration: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
        >
          {record.leadno}
        </Link>
      ),
    },
    {
      title: "Lead Date",
      dataIndex: "leaddate",
      key: "leaddate",
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Customer",
      dataIndex: "customerid",
      key: "customerid",
      render: (text) => customers.find((c) => c._id === text)?.name || "N/A",
    },
    {
      title: "Source",
      dataIndex: "sourceid",
      key: "sourceid",
      render: (text) => source.find((s) => s._id === text)?.name || "N/A",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Button
            icon={<EditOutlined />}
            size="small"
            type="primary"
            onClick={() => handleUpdate(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this lead?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </div>
      ),
    },
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
                <Link to="">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Leads</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="card p-3 mt-3">
            <Button
              type="primary"
<<<<<<< HEAD
              style={{ marginLeft: "995px", marginBottom: "5px", width: "100px" }}
=======
              style={{ marginLeft: "900px", marginBottom: "5px", width: "100px",animation: "blink 1s infinite", }}
>>>>>>> 68dc9a34da041c30679e7b7ed239ed8e5f5ef33e
              onClick={() => navigate("/lead/new-lead")}
            >
              Add New Lead
            </Button>
            <Table
              dataSource={leadRecords}
              columns={leadColumns}
              rowKey="_id"
              pagination={false}
              loading={loading}
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default LeadRecord;
