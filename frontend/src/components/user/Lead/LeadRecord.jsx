import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Table,
  Popconfirm,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";

const LeadRecord = () => {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
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
      const [cust, cat, prod, src] = await Promise.all([
        axios.get("http://localhost:8081/customer"),
        axios.get("http://localhost:8081/category"),
        axios.get("http://localhost:8081/product"),
        axios.get("http://localhost:8081/source"),
      ]);

      setCustomers(cust.data.data || []);
      setCategories(cat.data.data || []);
      setProducts(prod.data.data || []);
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
    navigate("/lead/new-lead", { state: { record } }); // Navigate to the Lead page with the record
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
      render: (_, __, index) => index + 1, // Serial number
    },
    {
      title: "Lead No",
      dataIndex: "leadno",
      key: "leadno",
      render: (text) => (
        <Link
          to={`/lead/leadDetails/`}
          style={{
            color: 'black',
            textDecoration: 'none',
            cursor: 'revert-layer',
          }}
          onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
          onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
        >
          {text}
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
            onClick={() => handleUpdate(record)} // Call handleUpdate
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
              style={{ marginLeft: "995px", marginBottom: "5px", width: "100px" }}
              onClick={() => navigate("/lead/new-lead")} // Navigate to the Lead page
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
